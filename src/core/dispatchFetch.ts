import {
    RyokoConfig,
    VerifyStatus,
    RyokoMergedConfig,
    TeedStreams,
    RyokoResponse,
    DownloadSchedulerFn,
    RyokoInstance,
    RyokoClass
} from 'types'

import { ryokoStreamDeliver } from './ryokoStreamDeliver'

import RyokoAbortController from '../abort/abortController'

import {
    resolveRyokoUrl,
    resolveRyokoBody,
    resolveRyokoResponse,
} from '../helpers/resolver'

import {
    is,
    typeOf
} from '../shared/utils'

import {
    fetchCodeOptionKeys,
    ryokoMethods,
} from '../helpers/constant'

import RyokoError from '../helpers/ryokoError'

import AbortTokenizer from '../abort/abortToken'

export default function dispatchFetch(
    this: RyokoClass,
    config: RyokoMergedConfig
) {
    //如果未在拦截器中返回config配置，则抛出错误
    if (Object(config) !== config) {
        throw new RyokoError(
            `The request 'config' is invalid, is it returned in the request interceptor?`
        );
    }
    const cloneConfig = { ...config }
    let {
        prefixURL,
        url,
        params,
        data,
        timeout,
        method,
        onDefer,
        verifyStatus,
        downloadScheduler,
        headers,
        fetch: RyokoFetch,
        abortToken
    } = cloneConfig;

    //fetch请求取消控制器
    let abortCtrl = new RyokoAbortController();
    const abortCb = (msg?: any) => {
        abortCtrl?.restoreAbortTimer();
        abortCtrl?.setAbortMsg(msg || '');
        abortCtrl?.abortFetch();
    }

    const { tokenStore } = AbortTokenizer;
    const tarStore = tokenStore.get(abortToken as Symbol)
    if (tarStore) {
        tarStore.add(abortCb);
    }

    //根据用户传入config，获取fetch的options
    let fetchConfig = {} as RequestInit
    const configKeys = Object.keys(cloneConfig)
    fetchCodeOptionKeys.forEach(key => {
        if (configKeys.includes(key)) {
            fetchConfig[key as keyof RequestInit] =
                cloneConfig[key as keyof RyokoMergedConfig]
        }
    });

    //获取请求url
    const fetchUrl = resolveRyokoUrl(prefixURL, url, params);

    //获取请求body
    const fetchBody = resolveRyokoBody(data)
    fetchBody && (fetchConfig.body = fetchBody);

    //存储abortber到该请求实例上 
    fetchConfig.signal = abortCtrl.singal;
    abortCtrl.deferAbort(timeout, abortMsg => {
        onDefer && onDefer.call(this, abortMsg);
    });

    return new Promise<RyokoResponse>((resolve, reject) => {

        //监听取消控制器的终止请求状态
        abortCtrl.abortState().then((abortMsg) => {
            reject(abortMsg);
        });

        RyokoFetch(
            fetchUrl,
            fetchConfig
        ).then(

            res => {
                // 取消abort定时器
                abortCtrl.restoreAbortTimer()
                abortCtrl = null!;//!作用是告知ts强制转null为RyokoAbortController类型

                const { body: resBody, status, } = res;
                
                //将相应数据以流的形式传送处理
                if(resBody != null) {
                    res = ryokoStreamDeliver.call(this, res, downloadScheduler)
                }

                const RyokoRes = resolveRyokoResponse(res, cloneConfig)
                // 验证status状态码
                const isSuccess = (verifyStatus as VerifyStatus)(status);
                if (isSuccess) {
                    resolve(RyokoRes)
                }

                reject(
                    new RyokoError(
                        `The status of the Ryoko request response is ${status}`,
                        {
                            status,
                            config: cloneConfig
                        }
                    )
                )
            },

            err => {
                const errMsg = `The Ryoko Requestion miss an Error: ${err}`;
                reject(
                    errMsg  
                )
            }
        )
    });

}