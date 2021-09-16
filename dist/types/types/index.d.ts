import Ryoko from "../core/ryoko";
import AbortTokenizer from "../abort/abortToken";
export interface PlainObject<type = any> {
    [key: string]: type;
}
export declare type RyokoAppendBody = 'FormData' | 'URLSearchParams';
export declare type RyokoAppendBodySource = PlainObject<string | string[]>;
export declare type RyokoDataSpecial = {
    source: RyokoAppendBodySource;
    type: RyokoAppendBody;
};
export declare type RyokoData = BodyInit;
export declare type RyokoParams = string | PlainObject<any> | URLSearchParams;
export declare type TeedStreams = [
    ReadableStream<Uint8Array>,
    ReadableStream<Uint8Array>
];
export declare type DownloadSchedulerArg = {
    total: number;
    received: number;
    percent: number;
    buffer: Uint8Array | undefined;
};
export declare type RyokoMergedConfig = Omit<RyokoConfig, RyokoDefaultConfigKeys> & RyokoDefaultConfig;
export declare type DownloadSchedulerFn = (arg: DownloadSchedulerArg) => void;
export declare type RyokoResponseType = 'json' | 'text' | 'stream' | 'arrayBuffer' | 'blob' | 'formData';
export declare type FetchInitKeys = 'headers' | 'cache' | 'integrity' | 'redirect' | 'mode' | 'referrer' | 'referrerPolicy' | 'window' | 'keepalive';
export interface RyokoConfig extends Pick<RequestInit, FetchInitKeys> {
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
export interface InterceptorFn<T> {
    (config: T): any;
}
export declare type InterceptorItem<T> = {
    success: (config: T) => Promise<any>;
    failure: (config: T) => Promise<any>;
};
export interface InterceptorCtor<T> {
    callbacks: Array<InterceptorItem<T> | undefined>;
    use(onsuccess?: InterceptorFn<T>, onfailure?: InterceptorFn<T>): number;
    eject(serie: number): void;
    traverse(fn: Function): void;
}
export declare type RyokoReqMethods = 'get' | 'post' | 'put' | 'options' | 'delete' | 'patch' | 'head' | 'link' | 'unlink' | 'purge';
export declare type RyokoClassQuickFn = (url: string, config?: RyokoConfig) => Promise<any>;
export declare type RyokoClassQuickCmds = Record<RyokoReqMethods, RyokoClassQuickFn>;
export interface RyokoClass extends RyokoClassQuickCmds {
    interceptors: {
        request: InterceptorCtor<RyokoConfig>;
        response: InterceptorCtor<RyokoResponse>;
    };
    request(config: RyokoConfig): Promise<RyokoResponse>;
    defaults: RyokoMergedConfig;
}
export interface RyokoInstance extends RyokoClass {
    (c: RyokoConfig): Promise<any>;
}
export declare type TokenStoreKey = any;
export declare type TokenStoreSpace = Set<Function>;
export interface RyokoNativeFn extends RyokoInstance {
    Ryoko: typeof Ryoko;
    AbortTokenizer: typeof AbortTokenizer;
    create: (c: RyokoConfig) => RyokoInstance;
    all: (p: Promise<any>[]) => Promise<any>;
    spread: (cb: Function) => (pa: Promise<any>[]) => any;
}
export declare type VerifyStatus = (status: number | string) => boolean;
export declare type RyokoDefaultConfigKeys = 'prefixUrl' | 'url' | 'method' | 'timeout' | 'onDefer' | 'responseType' | 'verifyStatus' | 'fetch' | 'beforeRequest' | 'afterResponse' | 'credentials' | 'params';
export declare type RyokoDefaultConfig = Required<Pick<RyokoConfig, RyokoDefaultConfigKeys>>;
export interface RyokoErrorOptions {
    request?: Request;
    response?: Response;
    config?: RyokoMergedConfig;
    status?: number;
}
export interface RyokoResponse {
    data: any;
    source: Response;
    status: number;
    statusText: string;
    headers: PlainObject<any>;
    config: RyokoConfig;
}
export interface WebURL {
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
export interface IteratorObj<T> {
    [Symbol.iterator](): IterableIterator<T>;
    entries(): IterableIterator<[string, T]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<T>;
}
