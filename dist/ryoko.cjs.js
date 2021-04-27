'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
    let obj = {};
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
        const length = this.callbacks.push({
            success: onsuccess,
            failure: onfailure
        });
        return length - 1;
    }
    eject(serie) {
        if (this.callbacks[serie]) {
            this.callbacks[serie] = void 0;
        }
    }
    traverse(fn) {
        this.callbacks.forEach(item => item != void 0 && fn(item));
    }
}

const defaultRyokoConfig = {
    prefixUrl: '',
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
        let dataReceivedLength = 0;
        const dataLength = Number(headers.get(CONTENT_LENGTH)) || 0;
        let progressStreamReader;
        const prgsReaderFn = (controller) => {
            progressStreamReader
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
            progressStreamReader = progressStream.getReader();
            prgsReaderFn();
        }
        catch (err) {
            progressStream = resBody;
            progressStreamReader = progressStream.getReader();
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

const defaultAbortMsg = 'The user aborted a request';
/**
 * 取消等待中的请求
 * @param args
 */
function abortPendingRequest(...args) {
    args = args.flat(Infinity);
    const { length } = args;
    if (length < 1) {
        abortAllRequest();
        return;
    }
    for (let i = 0; i < length; i++) {
        abortOneRequest(args[i]);
    }
}
/**
 * 终止所有请求
 */
function abortAllRequest() {
    const { tokenStore } = AbortTokenizer;
    for (let symbolKey of tokenStore.keys()) {
        abortOneRequest(symbolKey);
    }
}
/**
 * 终止指定请求
 * @param tokenKey symbol标识
 */
function abortOneRequest(tokenKey) {
    const { tokenStore } = AbortTokenizer;
    const _tokenSet = tokenStore.get(tokenKey);
    if (_tokenSet === void 0) {
        return false;
    }
    for (let abortCb of _tokenSet) {
        abortCb(defaultAbortMsg);
    }
    _tokenSet.clear();
    tokenStore.delete(tokenKey);
    return true;
}
/**
 * 添加终止请求函数到store中，以便后续统一手动取消
 * @param tokenKey 请求的abortToken属性
 * @param cbs 终止执行的函数
 * @returns
 */
function addAbortCallbacks(tokenKey, cbs) {
    if (typeof cbs === 'function') {
        cbs = [cbs];
    }
    if (tokenKey == void 0) {
        return;
    }
    const { tokenStore } = AbortTokenizer;
    let _tarTokenSet = tokenStore.get(tokenKey);
    if (_tarTokenSet !== void 0) {
        cbs.forEach(abortCb => _tarTokenSet.add(abortCb));
    }
    else {
        tokenStore.set(tokenKey, new Set(cbs));
    }
}
class AbortTokenizer {
    static createToken() {
        const { tokenStore, abortName } = AbortTokenizer;
        const symbolKey = Symbol(abortName + tokenStore.size);
        return symbolKey;
    }
}
AbortTokenizer.abortName = 'RyokoAbortTokenizer';
AbortTokenizer.tokenStore = new Map();

class RyokoError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = 'RyokoError';
        this.isRyokoError = true;
        extend(this, options);
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
    toJSON() {
        const { 
        //Standard
        message, name, 
        //MiscroSoft
        number, description, 
        //FireFox
        fileName, lineNumber, stack, columnNumber, 
        //Ryoko
        config, status, } = this;
        return {
            message, number, description, fileName, lineNumber, stack, columnNumber, name,
            config, status,
        };
    }
}

const errors = [
    Error,
    URIError,
    TypeError,
    RangeError,
    ReferenceError,
    SyntaxError,
    RyokoError,
];
const errTypesMatchPatts = errors.map(Ctor => new RegExp(Ctor.name, 'i'));
const warn = (msg, type = 'Error', options) => {
    if (type === 'console') {
        console.warn(msg, `options：${options}`);
        return;
    }
    let idx = errTypesMatchPatts.findIndex(patt => patt.test(type));
    !~idx && (idx = 0);
    throw new errors[idx](msg);
};

/**
 * 生成fetch url
 * @param url 链接地址 string
 * @param params 查询参数 string | PlainObject<string>
 * @returns
 */
const resolveRyokoUrl = (prefixUrl, url, params) => {
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
    warn(`The original or converted value of 'data' parameter is invalid`, 'TypeError');
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
    warn(`The value of 'responseType' parameter is invalid!`, 'TypeError');
});
// 生成Ryoko resolve返回值
const resolveRyokoResponse = (res, config) => __awaiter(void 0, void 0, void 0, function* () {
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

/**
 * ryoko取消控制器
 */
class RyokoAbortController {
    constructor() {
        /**
         * 是否支持AbortController
         */
        this.isAllow = false;
        /**
         * 是否已终止该请求
         */
        this.aborted = false;
        /**
         * 是否是超时才终止请求的
         */
        this.isDefer = false;
        this.init();
    }
    init() {
        isSupportAbortController && (this.isAllow = true);
        this.initAborber();
    }
    /**
     * 延时终止请求
     * @param timeout 延时
     * @param cb 延时回调
     * @returns void
     */
    deferAbort(timeout, cb) {
        timeout = +timeout;
        if (timeout === 0) {
            return;
        }
        if (Number.isNaN(timeout) || timeout < 0) {
            warn(`the type of parameter 'timeout' is invalid!`, 'TypeError');
        }
        this.abortTimer = setTimeout(() => {
            const abortMsg = `The request duration exceeded the maximum limit of ${timeout} 
                    milliseconds and has been interrupted`;
            this.setAbortMsg(abortMsg);
            this.isDefer = true;
            this.abortFetch();
            cb && cb(abortMsg);
        }, timeout);
    }
    /**
     * 初始化终止控制器
     */
    initAborber() {
        const controller = new AbortController();
        const { signal } = controller;
        this.controller = controller;
        this.singal = signal;
    }
    /**
     * 设置终止提示信息
     * @param abortMsg 终止信息
     */
    setAbortMsg(abortMsg) {
        this.abortMsg = abortMsg;
    }
    /**
     * 手动终止请求
     */
    abortFetch() {
        const { controller, isAllow, singal } = this;
        isAllow && !this.aborted && controller.abort();
    }
    /**
     * 监听请求终止状态
     *
     */
    abortState() {
        const { isAllow, singal } = this;
        return new Promise((resolve, reject) => {
            if (isAllow && singal) {
                singal.onabort = (ev) => {
                    this.aborted = true;
                    resolve(this.abortMsg);
                };
            }
        });
    }
    /**
     * 清除延迟终止定时器
     */
    restoreAbortTimer() {
        const serial = clearTimeout(this.abortTimer);
        this.abortTimer = null;
        return serial;
    }
}

function dispatchFetch(config) {
    //如果未在拦截器中返回config配置，则抛出错误
    if (Object(config) !== config) {
        warn(`The request 'config' is invalid, is it returned in the request interceptor?`, 'RyokoError');
    }
    const cloneConfig = Object.assign({}, config);
    let { prefixUrl, url, params, data, timeout, method, onDefer, verifyStatus, downloadScheduler, headers, fetch: RyokoFetch, abortToken, } = cloneConfig;
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
    const fetchUrl = resolveRyokoUrl(prefixUrl, url, params);
    //获取请求body
    const fetchBody = resolveRyokoBody(data);
    fetchBody && (fetchConfig.body = fetchBody);
    //创建一个终止请求控制器
    let abortCtrl = new RyokoAbortController();
    //根据abortToken添加对应的手动终止请求函数
    addAbortCallbacks(abortToken, function () {
        abortCtrl === null || abortCtrl === void 0 ? void 0 : abortCtrl.restoreAbortTimer();
        abortCtrl === null || abortCtrl === void 0 ? void 0 : abortCtrl.abortFetch();
    });
    //存储abortber到该请求实例上 
    fetchConfig.signal = abortCtrl.singal;
    //添加超时终止请求处理
    abortCtrl.deferAbort(timeout);
    return new Promise((resolve, reject) => {
        //监听取消控制器的终止请求状态
        abortCtrl.abortState().then((abortMsg) => {
            //如果是超时终止的请求，则执行
            if (abortCtrl.isDefer) {
                onDefer && onDefer.call(this, cloneConfig);
                reject(new RyokoError(abortMsg, {
                    config: cloneConfig
                }));
            }
        });
        RyokoFetch(fetchUrl, fetchConfig).then(res => {
            // 取消abort定时器
            abortCtrl.restoreAbortTimer();
            abortCtrl = null; //!作用是告知ts强制转null为RyokoAbortController类型
            const { body: resBody, status, } = res;
            //将响应数据以流的形式传送处理
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
            if (abortCtrl.aborted)
                return;
            //如果不是超时和用户手动取消请求的就走这一步(如服务器错误、网络错误等)
            const status = err === null || err === void 0 ? void 0 : err.status;
            const errMsg = `The Ryoko Requestion miss an Error: ${err}`;
            reject(new RyokoError(errMsg, {
                status,
                config: cloneConfig
            }));
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
        warn(`The 'method' parameter must be one of the ${ryokoMethods.length} 
            options:${ryokoMethods.join('、')}`, 'TypeError');
    }
    if (['get', 'head', 'options'].includes(method)) {
        delete mergedConfig.data;
    }
    else {
        mergedConfig.data = resolveRyokoBody(data);
    }
    if (!isFetch(ryokoFetch)) {
        warn(`The 'fetch' option you provided is not a function!`, 'TypeError');
    }
    if (typeof credentials === 'boolean') {
        credentials = credentials ? 'include' : 'omit';
    }
    else if (!credentialsTypes.includes(credentials)) {
        warn(`The valid type of 'credentials' paramter：Boolean、undefined、${credentialsTypes.join('、')}`, 'TypeError');
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

/**
 * 创建Ryoko实例
 * @param insConfig 实例初始化配置
 * @returns 返回Ryoko请求实例
 */
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

exports.abortAllRequest = abortAllRequest;
exports.abortOneRequest = abortOneRequest;
exports.abortPendingRequest = abortPendingRequest;
exports.default = ryoko;
