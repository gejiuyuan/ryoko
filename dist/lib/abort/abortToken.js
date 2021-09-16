const defaultAbortMsg = 'The user aborted a request';
/**
 * 取消等待中的请求
 * @param args
 */
export function abortPendingRequest(...args) {
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
export function abortAllRequest() {
    const { tokenStore } = AbortTokenizer;
    for (let symbolKey of tokenStore.keys()) {
        abortOneRequest(symbolKey);
    }
}
/**
 * 终止指定请求
 * @param tokenKey symbol标识
 */
export function abortOneRequest(tokenKey) {
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
export function addAbortCallbacks(tokenKey, cbs) {
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
export default class AbortTokenizer {
    static createToken() {
        const { tokenStore, abortName } = AbortTokenizer;
        const symbolKey = Symbol(abortName + tokenStore.size);
        return symbolKey;
    }
}
AbortTokenizer.abortName = 'RyokoAbortTokenizer';
AbortTokenizer.tokenStore = new Map();
