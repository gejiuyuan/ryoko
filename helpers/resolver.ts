import {
    DemandeData,
    DemandeDataSpecial,
    DemandeParams,
    DemandeConfig,
    DemandeResponse,
} from '../index'

import {
    fetchBodyInitTypes,
    fetchBodyAppendDataTypes,
} from './cosntant'

import {
    typeOf,
    extend,
    is,
    generateDataBody,
    getURLDescriptors,
    objToQuery,
    queryToObj,
} from '../shared/utils';

/**
 * 生成fetch url
 * @param url 链接地址 string
 * @param params 查询参数 string | PlainObject<string>
 * @returns 
 */

export const resolveDemandeUrl = (
    baseURL: string,
    url: string,
    params?: DemandeParams
) => {
    url = baseURL + url
    if (params == void 0) {
        return url
    }
    const { hash, origin, pathname, searchParams } = getURLDescriptors(url);
    typeof params === 'string' && (params = queryToObj(params))
    const realSearchString = objToQuery(extend(params, searchParams), true)
    return origin + pathname + hash + realSearchString;
}


/**
 * 生成fetch options选项的body参数 
 */

export const resolveDemandeData = (
    data?: DemandeData,
) => {
    let dataVal = null
    const typeOfData = typeOf(data);
    if (typeOfData === 'Undefined') return null;
    if (
        fetchBodyInitTypes.some(_ => _ === typeOfData)
    ) {
        return dataVal = data as BodyInit | null
    }

    if (is.Object(data)) {
        const dataObj = data as DemandeDataSpecial;
        if (
            Object.values(fetchBodyAppendDataTypes).some(_ => _ === dataObj.type)
        ) {
            const { source, type } = dataObj
            const realData = generateDataBody(source, type);
            return realData;
        }
    }
    throw new TypeError(`The original or converted value of 'data' parameter is invalid`);
}

// 生成demande resolve返回值
export const resolveDemandeResponse = (
    data: Response,
    config: DemandeConfig
) => {
    const { statusText, status, headers, } = data
    const demandeRes = {} as DemandeResponse
    demandeRes.data = data;
    demandeRes.status = status;
    demandeRes.statusText = statusText;
    demandeRes.headers = headers;
    demandeRes.config = config;
    return demandeRes
}
