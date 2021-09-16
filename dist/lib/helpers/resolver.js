var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchBodyInitTypes, resposneTypes, } from './constant';
import { typeOf, extend, is, objToQuery, queryToObj, iteratorToObj, URLPATT, } from '../shared/utils';
import { warn } from './warn';
/**
 * 生成fetch url
 * @param url 链接地址 string
 * @param params 查询参数 string | PlainObject<string>
 * @returns
 */
export const resolveRyokoUrl = (prefixUrl, url, params) => {
    url = decodeURIComponent(url);
    prefixUrl = decodeURIComponent(prefixUrl).trim();
    if (URLPATT.test(url)) {
        if (prefixUrl.length > 0) {
            warn(`the combination of 'baseURL' and 'url' is invalid!`, 'URIError');
        }
    }
    else {
        url = `${prefixUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    }
    if (params == void 0) {
        return url;
    }
    const searchObj = queryToObj(url);
    if (typeof params === 'string') {
        params = queryToObj(params);
    }
    else if (typeOf(params) === 'URLSearchParams') {
        params = iteratorToObj(params);
    }
    else if (!is.PlainObject(params)) {
        warn(`the type of 'params' parameter must be one of the thres options: 'String'、'PlainObject'、'URLSearchParams'`, 'TypeError');
    }
    const realSearchString = objToQuery(extend(searchObj, params), true);
    return url + realSearchString;
};
/**
 * 生成fetch options选项的body参数
 */
export const resolveRyokoBody = (data) => {
    const typeOfData = typeOf(data);
    if (typeOfData === 'Undefined')
        return void 0;
    if (fetchBodyInitTypes.some(_ => _ === typeOfData)) {
        return data;
    }
    else if (is.PlainObject(data)) {
        return JSON.stringify(data);
    }
    warn(`The original or converted value of 'data' parameter is invalid`, 'TypeError');
};
export const resolveRyokoResData = (res, config) => __awaiter(void 0, void 0, void 0, function* () {
    const responseType = config.responseType.trim();
    const resClone = res;
    if (responseType === '') {
        return yield resClone.text();
    }
    const resTypeReg = new RegExp(String.raw `^${responseType}$`, 'i');
    const tarResType = resposneTypes.find(_ => resTypeReg.test(_));
    if (tarResType) {
        return yield resClone[tarResType]();
    }
    warn(`The value of 'responseType' parameter is invalid!`, 'TypeError');
});
// 生成Ryoko resolve返回值
export const resolveRyokoResponse = (res, config) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusText, status, headers, } = res;
    const headersObj = iteratorToObj(headers, true);
    const ryokoRes = {};
    ryokoRes.source = res.clone();
    ryokoRes.status = status;
    ryokoRes.statusText = statusText;
    ryokoRes.headers = headersObj;
    ryokoRes.config = config;
    ryokoRes.data = yield resolveRyokoResData(res, config);
    return ryokoRes;
});
