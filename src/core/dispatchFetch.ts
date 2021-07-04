import {
    RyokoConfig,
    VerifyStatus,
    RyokoMergedConfig,
    TeedStreams,
    RyokoResponse,
    DownloadSchedulerFn,
    RyokoInstance,
    RyokoClass,
} from '../types'

import { ryokoStreamDeliver } from './ryokoStreamDeliver'

import {
    addAbortCallbacks
} from '../abort/abortToken'

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
import { warn } from '../helpers/warn'

import RyokoAbortController from '../abort/abortController'

export default function dispatchFetch(
    this: RyokoClass,
    config: RyokoMergedConfig
) {
    //如果未在拦截器中返回config配置，则抛出错误
    if (Object(config) !== config) {
        warn(
            `The request 'config' is invalid, is it returned in the request interceptor?`,
            'RyokoError'
        )
    }
    //请求前钩子
    config.beforeRequest.call(this, config);

    //创建一个终止请求控制器
    let abortCtrl = new RyokoAbortController();
    //根据abortToken添加对应的手动终止请求函数
    addAbortCallbacks(config.abortToken, function () {
        abortCtrl?.restoreAbortTimer();
        abortCtrl?.abortFetch();
    });

    let {
        prefixUrl,
        url,
        params,
        data,
        timeout,
        method,
        onDefer,
        verifyStatus,
        downloadScheduler,
        headers,
        fetch: ryokoFetch,
    } = config;

    //根据用户传入config，获取fetch的options
    const fetchConfig = {} as RequestInit;
    const configKeys = Object.keys(config)
    fetchCodeOptionKeys.forEach(key => {
        if (configKeys.includes(key)) {
            fetchConfig[key as keyof RequestInit] =
                config[key as keyof RyokoMergedConfig];
        }
    });

    //获取请求url
    const fetchUrl = resolveRyokoUrl(prefixUrl, url, params);

    //获取请求body
    const fetchBody = resolveRyokoBody(data);
    fetchBody && (fetchConfig.body = fetchBody);

    //存储abortber到该请求实例上 
    fetchConfig.signal = abortCtrl.singal;
    //添加超时终止请求处理
    abortCtrl.deferAbort(timeout);

    return new Promise<RyokoResponse>((resolve, reject) => {

        //监听取消控制器的终止请求状态
        abortCtrl.abortState().then((abortMsg) => {
            //如果是超时终止的请求，则执行
            if (abortCtrl.isDefer) {
                onDefer && onDefer.call(this, config);
                reject(
                    new RyokoError(
                        abortMsg,
                        { config: config }
                    )
                );
            }
        });

        ryokoFetch(
            fetchUrl,
            fetchConfig
        ).then(

            async res => {
                // 取消abort定时器
                abortCtrl.restoreAbortTimer();
                abortCtrl = null!;//!作用是告知ts强制转null为RyokoAbortController类型

                const { body: resBody, status, } = res;

                //将响应数据以流的形式传送处理
                if (resBody != null) {
                    res = ryokoStreamDeliver.call(this, res, downloadScheduler);
                }

                const RyokoRes = await resolveRyokoResponse(res, config);
                // 验证status状态码
                const isSuccess = (verifyStatus as VerifyStatus)(status);
                if (isSuccess) {
                    resolve(RyokoRes);
                    //响应后钩子
                    config.afterResponse.call(this, RyokoRes);
                }

                reject(
                    new RyokoError(
                        `The status of the Ryoko request response is ${status}`,
                        { status, config }
                    )
                )
            },

            err => {

                if (abortCtrl.aborted) return

                //如果不是超时和用户手动取消请求的就走这一步(如服务器错误、网络错误等)
                const status = err?.status
                const errMsg = `The Ryoko Requestion miss an Error: ${err}`;
                reject(
                    new RyokoError(errMsg, { status, config })
                )

            }
        )
    });

}