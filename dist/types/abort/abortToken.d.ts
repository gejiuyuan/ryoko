import { TokenStoreKey, TokenStoreSpace } from '../types';
/**
 * 取消等待中的请求
 * @param args
 */
export declare function abortPendingRequest(...args: Array<TokenStoreKey | TokenStoreKey[] | unknown>): void;
/**
 * 终止所有请求
 */
export declare function abortAllRequest(): void;
/**
 * 终止指定请求
 * @param tokenKey symbol标识
 */
export declare function abortOneRequest(tokenKey: TokenStoreKey): boolean;
/**
 * 添加终止请求函数到store中，以便后续统一手动取消
 * @param tokenKey 请求的abortToken属性
 * @param cbs 终止执行的函数
 * @returns
 */
export declare function addAbortCallbacks(tokenKey: any, cbs: Function | Array<Function>): void;
export default class AbortTokenizer {
    static readonly abortName = "RyokoAbortTokenizer";
    static tokenStore: Map<any, TokenStoreSpace>;
    static createToken(): symbol;
}
