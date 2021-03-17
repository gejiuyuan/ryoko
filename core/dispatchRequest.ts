import {
    DemandeConfig,
    ValidateStatus,
    DemandeMergedConfig,
    TeedStreams,
    DemandeResponse,
    DownloadProgressFn,
} from '../index'

import { downloadProgress } from './downloadProgress'

import DemandeAbortController from './abort'

import {
    resolveDemandeUrl,
    resolveDemandeData,
    resolveDemandeResponse,
} from '../helpers/resolver'

import {
    is
} from '../shared/utils'

import {
    fetchCodeOptionKeys
} from '../helpers/cosntant' 

type PromiseResolve = (value?: any) => any
type PromiseReject = (reason?: any) => any

export default function dispatchRequest(
    this: any,
    config: DemandeMergedConfig
) {
    const cloneConfig = { ...config }
    let {
        baseURL = '',
        url = '',
        params,
        data,
        timeout,
        method,
        onAbort,
        validateStatus,
        onDownloadProgress,
    } = cloneConfig;

    //下载进度方法
    is.Function(onDownloadProgress) && (
        onDownloadProgress = (onDownloadProgress as DownloadProgressFn).bind(this)
    )

    //根据用户传入config，获取fetch的options
    let fetchConfig = {} as RequestInit
    const configKeys = Object.keys(cloneConfig)
    fetchCodeOptionKeys.forEach(key => {
        if (configKeys.includes(key)) {
            Reflect.set(fetchConfig, key, Reflect.get(cloneConfig, key))
        }
    });

    //获取请求url
    const fetchUrl = resolveDemandeUrl(baseURL, url, params);
    //获取请求body
    fetchConfig.body = resolveDemandeData(data);

    //fetch请求取消控制器
    let abortber = new DemandeAbortController(timeout as number);
    abortber.singal && (fetchConfig.signal = abortber.singal);

    return new Promise<Response>((resolve, reject) => {

        //监听取消控制器的终止请求状态
        abortber.abortState().then(
            (abortMsg) => {
                onAbort && onAbort.call(this);
                reject(abortMsg);
            }
        );

        fetch(
            fetchUrl,
            fetchConfig
        ).then(
            res => {
                // 取消abort定时器
                abortber.restoreAbortTimer()
                abortber = null!;//!作用是告知ts强制转null为DemandeAbortController类型
                resolve(res);
            },
            err => reject(new Error(err))
        )

    }).then(
        res => {
            const { body: resBody, status, statusText, headers } = res;
            if (resBody !== null) {
                const teedStreams = resBody.tee();
                const [returnStream, progressStream] = teedStreams as TeedStreams;
                // 监听下载进度
                downloadProgress(res, progressStream, onDownloadProgress);
                res = new Response(returnStream, {
                    status, statusText, headers
                })
            }
            return res;
        }
    ).then(
        res => {
            const demandeRes = resolveDemandeResponse(res, cloneConfig)
            // 验证status状态码
            const isSuccess = (validateStatus as ValidateStatus)(demandeRes.status);
            if (isSuccess) {
                return demandeRes
            }
            throw new RangeError(`The status of the demande request response is ${demandeRes.status}`)
        }
    )

}