/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const _globalThis = globalThis !== void 0
    ? globalThis
    : self !== void 0
        ? self
        : window !== void 0
            ? window
            : global !== void 0
                ? global
                : {};
const ArrayBufferViewTypes = [
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'DataView',
];
const BufferSourceTypes = ArrayBufferViewTypes.concat('ArrayBuffer');
const fetchBodyInitTypes = ['Blob', 'FormData', 'URLSearchParams', 'ReadableStream', 'String', 'Null'].concat(BufferSourceTypes);
const fetchCodeOptionKeys = [
    'method',
    'mode',
    'credentials',
    'headers',
    'cache',
    'integrity',
    'redirect',
    'referrer',
    'referrerPolicy',
    'keepalive',
    'window',
];
const ryokoMethods = [
    'get', 'post', 'put', 'options', 'delete', 'patch', 'head',
];
const CONTENT_LENGTH = 'content-length';
const resposneTypes = [
    'blob',
    'arrayBuffer',
    'formData',
    'json',
    'text'
];
const credentialsTypes = [
    'omit',
    'same-origin',
    'include',
];

const hasOwnProp = Object.prototype.hasOwnProperty;
const hasOwn = (ins, key) => hasOwnProp.call(ins, key);
const override = Object.assign;
const noop = function (a, b, c) { };
const URLPATT = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;
function extend(target, ...source) {
    target = Object(target);
    const extendCore = (tar, s) => {
        if (Object(s) === s) {
            Object.keys(s).forEach(key => {
                tar[key] === void 0 &&
                    (tar[key] = s[key]);
            });
        }
        return tar;
    };
    let merged;
    if (source.length !== 1) {
        merged = source.reduce((tar, s) => extendCore(tar, s), {});
    }
    else {
        merged = source[0];
    }
    return extendCore(target, merged);
}
const toString = Object.prototype.toString;
const typeOf = (ins) => toString.call(ins).slice(8, -1);
const is = [
    'String', 'Number', 'Undefined',
    'Boolean', 'Null', 'Symbol', 'Function'
]
    .reduce((is, typeStr) => {
    is[typeStr] = ins => typeof ins === typeStr.toLowerCase();
    return is;
}, {});
is.Array = Array.isArray;
is.emptyArray = ins => is.Array(ins) &&
    ins.length < 1;
is.Object = ins => typeof ins === 'object' &&
    ins !== null &&
    'constructor' in ins &&
    ins.constructor === Object;
is.PlainObject = ins => typeof ins === 'object' &&
    ins !== null &&
    typeOf(ins) === 'Object';
is.emptyObject = ins => is.PlainObject(ins) &&
    Object.keys(ins).length < 1;
const isSupportAbortController = 'AbortController' in _globalThis &&
    is.Function(AbortController);
const isFetch = (ins) => {
    return is.Function(ins);
};
const queryToObj = (query) => {
    let obj = {};
    const prefixMatched = query.match(/^.*\?/);
    if (prefixMatched) {
        const realQuery = query.replace(prefixMatched[0], '');
        realQuery && (obj = realQuery
            .split('&')
            .reduce((obj, val) => {
            const arr = val.split('=');
            obj[arr[0]] = arr[1];
            return obj;
        }, obj));
    }
    return obj;
};
const objToQuery = (obj, prefix = false) => is.emptyObject(obj)
    ? ''
    : `${prefix ? '?' : ''}${Object.entries(obj).map(arr => arr.join('=')).join('&')}`;
const filterUselessKey = (obj) => {
    for (let key in obj) {
        hasOwn(obj, key) && obj[key] === void 0 && (delete obj[key]);
    }
    return obj;
};
const iteratorToObj = (iterator, lowerKey = false) => {
    let obj = Object.create(null);
    for (let [key, value] of iterator.entries()) {
        const realKey = lowerKey ? key.toLowerCase() : key;
        obj[realKey] = value;
    }
    return obj;
};

/**
 * 拦截器 the interceptor of request method
 */
class Interceptor {
    constructor() {
        this.init();
    }
    init() {
        this.callbacks = [];
    }
    use(onsuccess, onfailure) {
        this.callbacks.push({
            success: onsuccess,
            failure: onfailure
        });
        return this.callbacks.length - 1;
    }
    eject(serie) {
        if (this.callbacks[serie]) {
            this.callbacks[serie] = void 0;
        }
    }
    traverse(fn) {
        this.callbacks.forEach(item => item != null && fn(item));
    }
}

const defaultRyokoConfig = {
    prefixURL: '',
    url: '',
    timeout: 0,
    fetch: _globalThis.fetch,
    onDefer: noop,
    verifyStatus: (status) => status < 300 && status >= 200,
    method: 'GET',
    responseType: 'text',
    beforeRequest: noop,
    afterResponse: noop,
    credentials: 'same-origin',
};

const ryokoStreamDeliver = function (fetchRes, cb) {
    const { body, status, statusText, headers } = fetchRes;
    const resBody = body;
    let returnStream, progressStream;
    if (cb !== void 0) {
        const dataLength = Number(headers.get(CONTENT_LENGTH)) || 0;
        let dataReceivedLength = 0;
        const prgsReaderFn = (controller) => {
            progressStream
                .getReader()
                .read()
                .then(({ value, done }) => {
                if (done) {
                    controller && controller.close();
                    return;
                }
                dataReceivedLength += (value === null || value === void 0 ? void 0 : value.length) || 0;
                const percent = dataLength === 0 ? 0 : dataReceivedLength / dataLength;
                const progressData = {
                    total: dataLength,
                    received: dataReceivedLength,
                    percent,
                    buffer: value,
                };
                cb.call(this, progressData);
                controller && controller.enqueue(value);
                prgsReaderFn();
            });
        };
        try {
            const teedStreams = resBody.tee();
            [returnStream, progressStream] = teedStreams;
            prgsReaderFn();
        }
        catch (err) {
            progressStream = resBody;
            returnStream = new _globalThis.ReadableStream({
                start(controller) {
                    prgsReaderFn(controller);
                }
            });
        }
    }
    else {
        returnStream = resBody;
    }
    return new Response(returnStream, {
        status, statusText, headers
    });
};

class RyokoError extends Error {
    constructor(message, options) {
        super(message);
        this.name = 'RyokoError';
        this.isRyokoError = true;
        this.options = options;
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
    toJSON() {
        const { 
        //标准
        message, name, 
        //微软
        number, description, 
        //火狐
        fileName, lineNumber, stack, columnNumber, 
        //Ryoko
        options } = this;
        const { config, status } = options;
        return {
            message, number, description, fileName, lineNumber, stack, columnNumber, name, config, status
        };
    }
}

/**
 * ryoko取消控制器
 */
class RyokoAbortController {
    constructor() {
        this.isAllow = false;
        this.init();
    }
    init() {
        isSupportAbortController && (this.isAllow = true);
        this.initAborber();
    }
    deferAbort(timeout, cb) {
        timeout = +timeout;
        if (timeout === 0) {
            return;
        }
        if (Number.isNaN(timeout) || timeout < 0) {
            throw new RyokoError(`the type of parameter 'timeout' is invalid!`);
        }
        this.abortTimer = setTimeout(() => {
            const abortMsg = new RyokoError(`The request duration exceeded the maximum limit of ${timeout} 
                    milliseconds and has been interrupted`);
            this.setAbortMsg(abortMsg);
            this.abortFetch();
            cb(abortMsg);
        }, timeout);
    }
    initAborber() {
        const controller = new AbortController();
        const { signal } = controller;
        this.controller = controller;
        this.singal = signal;
    }
    setAbortMsg(abortMsg) {
        this.abortMsg = abortMsg;
    }
    abortFetch() {
        const { controller, isAllow, singal } = this;
        isAllow && !singal.aborted && controller.abort();
    }
    abortState() {
        const { isAllow, singal } = this;
        return new Promise((resolve, reject) => {
            if (isAllow && singal) {
                singal.onabort = (ev) => {
                    resolve(this.abortMsg);
                };
            }
        });
    }
    restoreAbortTimer() {
        const serial = clearTimeout(this.abortTimer);
        this.abortTimer = null;
        return serial;
    }
}

/**
 * 生成fetch url
 * @param url 链接地址 string
 * @param params 查询参数 string | PlainObject<string>
 * @returns
 */
const resolveRyokoUrl = (prefixURL, url, params) => {
    url = decodeURIComponent(url);
    prefixURL = decodeURIComponent(prefixURL).trim();
    if (URLPATT.test(url)) {
        if (prefixURL.length > 0) {
            throw new RyokoError(`the combination of 'baseURL' and 'url' is invalid!`);
        }
    }
    else {
        url = `${prefixURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
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
        throw new TypeError(`the type of 'params' parameter must be one of the thres options: 'String'、'PlainObject'、'URLSearchParams'`);
    }
    const realSearchString = objToQuery(extend(searchObj, params), true);
    return url + realSearchString;
};
/**
 * 生成fetch options选项的body参数
 */
const resolveRyokoBody = (data) => {
    const typeOfData = typeOf(data);
    if (typeOfData === 'Undefined')
        return void 0;
    if (fetchBodyInitTypes.some(_ => _ === typeOfData)) {
        return data;
    }
    else if (is.PlainObject(data)) {
        return JSON.stringify(data);
    }
    throw new RyokoError(`The original or converted value of 'data' parameter is invalid`);
};
const resolveRyokoResData = (res, config) => __awaiter(void 0, void 0, void 0, function* () {
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
    throw new RyokoError(`The value of 'responseType' parameter is invalid!`);
});
// 生成Ryoko resolve返回值
const resolveRyokoResponse = (res, config) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusText, status, headers, } = res;
    const headersObj = iteratorToObj(headers, true);
    const ryokoRes = {};
    ryokoRes.source = res;
    ryokoRes.status = status;
    ryokoRes.statusText = statusText;
    ryokoRes.headers = headersObj;
    ryokoRes.config = config;
    ryokoRes.data = yield resolveRyokoResData(res, config);
    return ryokoRes;
});

class AbortTokenizer {
    static create() {
        const { tokenStore, abortName } = AbortTokenizer;
        const symbolKey = Symbol(abortName + tokenStore.size);
        const _tokenSet = new Set();
        tokenStore.set(symbolKey, _tokenSet);
        return {
            stop(msg) {
                for (let abortCb of _tokenSet) {
                    abortCb(msg);
                }
                queueMicrotask(() => {
                    _tokenSet.clear();
                    tokenStore.delete(symbolKey);
                });
            },
            token: symbolKey
        };
    }
}
AbortTokenizer.abortName = 'ryokoToken';
AbortTokenizer.tokenStore = new Map();

function dispatchFetch(config) {
    //如果未在拦截器中返回config配置，则抛出错误
    if (Object(config) !== config) {
        throw new RyokoError(`The request 'config' is invalid, is it returned in the request interceptor?`);
    }
    const cloneConfig = Object.assign({}, config);
    let { prefixURL, url, params, data, timeout, method, onDefer, verifyStatus, downloadScheduler, headers, fetch: RyokoFetch, abortToken } = cloneConfig;
    //fetch请求取消控制器
    let abortCtrl = new RyokoAbortController();
    const abortCb = (msg) => {
        abortCtrl === null || abortCtrl === void 0 ? void 0 : abortCtrl.restoreAbortTimer();
        abortCtrl === null || abortCtrl === void 0 ? void 0 : abortCtrl.setAbortMsg(msg || '');
        abortCtrl === null || abortCtrl === void 0 ? void 0 : abortCtrl.abortFetch();
    };
    const { tokenStore } = AbortTokenizer;
    const tarStore = tokenStore.get(abortToken);
    if (tarStore) {
        tarStore.add(abortCb);
    }
    //根据用户传入config，获取fetch的options
    let fetchConfig = {};
    const configKeys = Object.keys(cloneConfig);
    fetchCodeOptionKeys.forEach(key => {
        if (configKeys.includes(key)) {
            fetchConfig[key] =
                cloneConfig[key];
        }
    });
    //获取请求url
    const fetchUrl = resolveRyokoUrl(prefixURL, url, params);
    //获取请求body
    const fetchBody = resolveRyokoBody(data);
    fetchBody && (fetchConfig.body = fetchBody);
    //存储abortber到该请求实例上 
    fetchConfig.signal = abortCtrl.singal;
    abortCtrl.deferAbort(timeout, abortMsg => {
        onDefer && onDefer.call(this, abortMsg);
    });
    return new Promise((resolve, reject) => {
        //监听取消控制器的终止请求状态
        abortCtrl.abortState().then((abortMsg) => {
            reject(abortMsg);
        });
        RyokoFetch(fetchUrl, fetchConfig).then(res => {
            // 取消abort定时器
            abortCtrl.restoreAbortTimer();
            abortCtrl = null; //!作用是告知ts强制转null为RyokoAbortController类型
            const { body: resBody, status, } = res;
            //将相应数据以流的形式传送处理
            if (resBody != null) {
                res = ryokoStreamDeliver.call(this, res, downloadScheduler);
            }
            const RyokoRes = resolveRyokoResponse(res, cloneConfig);
            // 验证status状态码
            const isSuccess = verifyStatus(status);
            if (isSuccess) {
                resolve(RyokoRes);
            }
            reject(new RyokoError(`The status of the Ryoko request response is ${status}`, {
                status,
                config: cloneConfig
            }));
        }, err => {
            const errMsg = `The Ryoko Requestion miss an Error: ${err}`;
            reject(errMsg);
        });
    });
}

const mergeRyokoConfig = (initialConfig, commonConfig) => {
    const mergedConfig = filterUselessKey(extend(commonConfig, initialConfig));
    let { method, headers, data, fetch: ryokoFetch, credentials, beforeRequest, afterResponse, } = mergedConfig;
    let methodReg = new RegExp(`^${method}$`, 'i');
    if (ryokoMethods.some(_ => _.match(methodReg))) {
        mergedConfig.method = method = method.toLowerCase();
    }
    else {
        throw new RyokoError(`The 'method' parameter must be one of the ${ryokoMethods.length} 
            options:${ryokoMethods.join('、')}`);
    }
    if (['get', 'head', 'options'].includes(method)) {
        delete mergedConfig.data;
    }
    else {
        mergedConfig.data = resolveRyokoBody(data);
    }
    if (!isFetch(ryokoFetch)) {
        throw new RyokoError(`The 'fetch' option you provided is not a function!`);
    }
    if (typeof credentials === 'boolean') {
        credentials = credentials ? 'include' : 'omit';
    }
    else if (!credentialsTypes.includes(credentials)) {
        throw new RyokoError(`The valid type of 'credentials' paramter：Boolean、undefined、${credentialsTypes.join('、')}`);
    }
    return mergedConfig;
};

// a request method based on the native fetch api
class Ryoko {
    constructor(config) {
        this.defaults = extend({}, config, defaultRyokoConfig);
        this.interceptors = {
            request: new Interceptor(),
            response: new Interceptor(),
        };
    }
    request(config) {
        const mergedConfig = mergeRyokoConfig(this.defaults, config);
        const { beforeRequest, afterResponse } = mergedConfig;
        const promisesQueueBefore = [], promisesQueueAfter = [];
        this.interceptors.request.traverse((interceptor) => {
            promisesQueueBefore.push(interceptor.success, interceptor.failure);
        });
        this.interceptors.response.traverse((interceptor) => {
            promisesQueueAfter.push(interceptor.success, interceptor.failure);
        });
        let prePromise = Promise.resolve(mergedConfig);
        while (promisesQueueBefore.length) {
            prePromise = prePromise.then(promisesQueueBefore.shift(), promisesQueueBefore.shift());
        }
        prePromise = prePromise.then((config) => __awaiter(this, void 0, void 0, function* () {
            yield beforeRequest.call(this, config);
            return config;
        }));
        const corePromise = prePromise.then(dispatchFetch.bind(this), void 0);
        let endPromise = corePromise;
        endPromise = endPromise.then((response) => __awaiter(this, void 0, void 0, function* () {
            yield afterResponse.call(this, response);
            return response;
        }));
        while (promisesQueueAfter.length) {
            endPromise = endPromise.then(promisesQueueAfter.shift(), promisesQueueAfter.shift());
        }
        return endPromise;
    }
}
//默认class定义的类的原型方法不能枚举
Object.defineProperty(Ryoko.prototype, 'request', {
    enumerable: true,
});
ryokoMethods.forEach((method, i) => {
    Reflect.set(Ryoko.prototype, method, function (url, config) {
        const endConfig = override({}, config, { method, url, });
        return (typeof this === 'function'
            ? this(endConfig)
            : this.request.call(this, endConfig));
    });
});

function createInstance(insConfig = {}) {
    const ctx = new Ryoko(insConfig);
    const ins = ctx.request.bind(ctx);
    extend(ins, ctx);
    extend(ins, Object.getPrototypeOf(ctx));
    return ins;
}
const ryoko = createInstance();
ryoko.Ryoko = Ryoko;
ryoko.AbortTokenizer = AbortTokenizer;
ryoko.create = (insConfig) => createInstance(insConfig);
ryoko.all = (promises) => Promise.all(promises);
ryoko.spread = (callback) => (promisesArr) => callback.apply(null, promisesArr);

export default ryoko;
