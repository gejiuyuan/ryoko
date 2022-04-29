declare class Ryoko {
    get: RyokoClassQuickFn;
    post: RyokoClassQuickFn;
    options: RyokoClassQuickFn;
    put: RyokoClassQuickFn;
    delete: RyokoClassQuickFn;
    patch: RyokoClassQuickFn;
    head: RyokoClassQuickFn;
    link: RyokoClassQuickFn;
    unlink: RyokoClassQuickFn;
    purge: RyokoClassQuickFn;
    defaults: RyokoMergedConfig;
    interceptors: {
        request: InterceptorCtor<RyokoConfig>;
        response: InterceptorCtor<RyokoResponse>;
    };
    constructor(config: RyokoConfig);
    request(config: RyokoConfig): Promise<RyokoResponse>;
}

/**
 * 取消等待中的请求
 * @param args
 */
declare function abortPendingRequest(...args: Array<TokenStoreKey | TokenStoreKey[] | unknown>): void;
/**
 * 终止所有请求
 */
declare function abortAllRequest(): void;
/**
 * 终止指定请求
 * @param tokenKey symbol标识
 */
declare function abortOneRequest(tokenKey: TokenStoreKey): boolean;
declare class AbortTokenizer {
    static readonly abortName = "RyokoAbortTokenizer";
    static tokenStore: Map<any, TokenStoreSpace>;
    static createToken(): symbol;
}

interface PlainObject<type = any> {
    [key: string]: type;
}
declare type RyokoAppendBody = 'FormData' | 'URLSearchParams';
declare type RyokoAppendBodySource = PlainObject<string | string[]>;
declare type RyokoDataSpecial = {
    source: RyokoAppendBodySource;
    type: RyokoAppendBody;
};
declare type RyokoData = BodyInit;
declare type RyokoParams = string | PlainObject<any> | URLSearchParams;
declare type TeedStreams = [
    ReadableStream<Uint8Array>,
    ReadableStream<Uint8Array>
];
declare type DownloadSchedulerArg = {
    total: number;
    received: number;
    percent: number;
    buffer: Uint8Array | undefined;
};
declare type RyokoMergedConfig = Omit<RyokoConfig, RyokoDefaultConfigKeys> & RyokoDefaultConfig;
declare type DownloadSchedulerFn = (arg: DownloadSchedulerArg) => void;
declare type RyokoResponseType = 'json' | 'text' | 'stream' | 'arrayBuffer' | 'blob' | 'formData';
declare type FetchInitKeys = 'headers' | 'cache' | 'integrity' | 'redirect' | 'mode' | 'referrer' | 'referrerPolicy' | 'window' | 'keepalive';
interface RyokoConfig extends Pick<RequestInit, FetchInitKeys> {
    fetch?: typeof fetch;
    prefixUrl?: string;
    url?: string;
    onDefer?: (deferMsg: any) => void;
    params?: RyokoParams;
    data?: RyokoData;
    method?: string;
    credentials?: RequestCredentials | boolean;
    timeout?: number;
    downloadScheduler?: DownloadSchedulerFn;
    verifyStatus?: VerifyStatus;
    responseType?: RyokoResponseType;
    beforeRequest?: (config: RyokoMergedConfig) => void;
    afterResponse?: (res: RyokoResponse) => void;
    abortToken?: Symbol;
    readonly uid?: Symbol;
}
interface InterceptorFn<T> {
    (config: T): any;
}
declare type InterceptorItem<T> = {
    success: (config: T) => Promise<any>;
    failure: (config: T) => Promise<any>;
};
interface InterceptorCtor<T> {
    callbacks: Array<InterceptorItem<T> | undefined>;
    use(onsuccess?: InterceptorFn<T>, onfailure?: InterceptorFn<T>): number;
    eject(serie: number): void;
    traverse(fn: Function): void;
}
declare type RyokoReqMethods = 'get' | 'post' | 'put' | 'options' | 'delete' | 'patch' | 'head' | 'link' | 'unlink' | 'purge';
declare type RyokoClassQuickFn = (url: string, config?: RyokoConfig) => Promise<any>;
declare type RyokoClassQuickCmds = Record<RyokoReqMethods, RyokoClassQuickFn>;
interface RyokoClass extends RyokoClassQuickCmds {
    interceptors: {
        request: InterceptorCtor<RyokoConfig>;
        response: InterceptorCtor<RyokoResponse>;
    };
    request(config: RyokoConfig): Promise<RyokoResponse>;
    defaults: RyokoMergedConfig;
}
interface RyokoInstance extends RyokoClass {
    (c: RyokoConfig): Promise<any>;
}
declare type TokenStoreKey = any;
declare type TokenStoreSpace = Set<Function>;
interface RyokoNativeFn extends RyokoInstance {
    Ryoko: typeof Ryoko;
    AbortTokenizer: typeof AbortTokenizer;
    create: (c: RyokoConfig) => RyokoInstance;
    all: (p: Promise<any>[]) => Promise<any>;
    spread: (cb: Function) => (pa: Promise<any>[]) => any;
}
declare type VerifyStatus = (status: number | string) => boolean;
declare type RyokoDefaultConfigKeys = 'prefixUrl' | 'url' | 'method' | 'timeout' | 'onDefer' | 'responseType' | 'verifyStatus' | 'fetch' | 'beforeRequest' | 'afterResponse' | 'credentials' | 'params';
declare type RyokoDefaultConfig = Required<Pick<RyokoConfig, RyokoDefaultConfigKeys>>;
interface RyokoErrorOptions {
    request?: Request;
    response?: Response;
    config?: RyokoMergedConfig;
    status?: number;
}
interface RyokoResponse {
    data: any;
    source: Response;
    status: number;
    statusText: string;
    headers: PlainObject<any>;
    config: RyokoConfig;
}
interface WebURL {
    hash: string;
    host: string;
    hostname: string;
    href: string;
    origin: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
}
interface IteratorObj<T> {
    [Symbol.iterator](): IterableIterator<T>;
    entries(): IterableIterator<[string, T]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<T>;
}

declare const ryoko: RyokoNativeFn;

export { DownloadSchedulerArg, DownloadSchedulerFn, FetchInitKeys, InterceptorCtor, InterceptorFn, InterceptorItem, IteratorObj, PlainObject, RyokoAppendBody, RyokoAppendBodySource, RyokoClass, RyokoClassQuickCmds, RyokoClassQuickFn, RyokoConfig, RyokoData, RyokoDataSpecial, RyokoDefaultConfig, RyokoDefaultConfigKeys, RyokoErrorOptions, RyokoInstance, RyokoMergedConfig, RyokoNativeFn, RyokoParams, RyokoReqMethods, RyokoResponse, RyokoResponseType, TeedStreams, TokenStoreKey, TokenStoreSpace, VerifyStatus, WebURL, abortAllRequest, abortOneRequest, abortPendingRequest, ryoko as default };
