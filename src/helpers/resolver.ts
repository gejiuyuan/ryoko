import {
    RyokoData,
    RyokoDataSpecial,
    RyokoParams,
    RyokoConfig,
    RyokoResponse,
    RyokoMergedConfig,
    RyokoDefaultConfig,
    PlainObject,
} from 'types'

import {
    fetchBodyInitTypes,
    fetchBodyAppendDataTypes,
    CONTENT_TYPE,
    resposneTypes,
} from './constant'

import RyokoError from './ryokoError'

import getContentTypeVal from './resConTypeMatcher'

import {
    typeOf,
    extend,
    is,
    getURLDescriptors,
    objToQuery,
    queryToObj,
    iteratorToObj,
    parseUrl,
    isSupportURL,
    URLPATT,
} from '../shared/utils';
import Ryoko from '../core/ryoko';
import { warn } from './warn';

/**
 * 生成fetch url
 * @param url 链接地址 string
 * @param params 查询参数 string | PlainObject<string>
 * @returns 
 */

export const resolveRyokoUrl = (
    prefixURL: string,
    url: string,
    params?: RyokoParams
) => {
    url = decodeURIComponent(url);
    prefixURL = decodeURIComponent(prefixURL).trim();
    if (URLPATT.test(url)) {
        if (prefixURL.length > 0) {
            warn(
                `the combination of 'baseURL' and 'url' is invalid!`,
                'URIError'
            )
        }
    } else {
        url = `${prefixURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
    }
    if (params == void 0) {
        return url
    }
    const searchObj = queryToObj(url);
    if (typeof params === 'string') {
        params = queryToObj(params)
    } else if (typeOf(params) === 'URLSearchParams') {
        params = iteratorToObj(params as URLSearchParams)
    } else if (!is.PlainObject(params)) {
        warn(
            `the type of 'params' parameter must be one of the thres options: 'String'、'PlainObject'、'URLSearchParams'`,
            'TypeError'
        );
    }
    const realSearchString = objToQuery(
        extend(searchObj, params),
        true
    )
    return url + realSearchString;
}


/**
 * 生成fetch options选项的body参数 
 */

export const resolveRyokoBody = (
    data?: RyokoData,
) => {
    const typeOfData = typeOf(data);
    if (typeOfData === 'Undefined') return void 0;
    if (
        fetchBodyInitTypes.some(_ => _ === typeOfData)
    ) {
        return data as BodyInit
    } else if (is.PlainObject(data)) {
        return JSON.stringify(data)
    }
    warn(
        `The original or converted value of 'data' parameter is invalid`,
        'TypeError'
    );
}

export const resolveRyokoResData = async (
    res: Response,
    config: RyokoMergedConfig
) => {
    const responseType = config.responseType.trim();
    const resClone = res as PlainObject
    if (responseType === '') {
        return await resClone.text();
    }
    const resTypeReg = new RegExp(String.raw`^${responseType}$`, 'i');
    const tarResType = resposneTypes.find(_ => resTypeReg.test(_))
    if (tarResType) {
        return await resClone[tarResType]();
    }
    warn(
        `The value of 'responseType' parameter is invalid!`,
        'TypeError'
    );
}

// 生成Ryoko resolve返回值
export const resolveRyokoResponse = async (
    res: Response,
    config: RyokoMergedConfig
) => {
    const { statusText, status, headers, } = res
    const headersObj = iteratorToObj(headers, true)
    const ryokoRes = {} as RyokoResponse
    ryokoRes.source = res;
    ryokoRes.status = status;
    ryokoRes.statusText = statusText;
    ryokoRes.headers = headersObj;
    ryokoRes.config = config;
    ryokoRes.data = await resolveRyokoResData(res, config);
    return ryokoRes
}
