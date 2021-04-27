
export interface PlainObject<type = any> {
    [key: string]: type
}

export type RyokoAppendBody = 'FormData' | 'URLSearchParams';

export type RyokoAppendBodySource = PlainObject<string | string[]>;

export type RyokoDataSpecial = {
    source: RyokoAppendBodySource,
    type: RyokoAppendBody
}

export type RyokoData = BodyInit

export type RyokoParams = string | PlainObject<any> | URLSearchParams

export type TeedStreams = [
    ReadableStream<Uint8Array>,
    ReadableStream<Uint8Array>
]

export type DownloadSchedulerArg = {
    total: number,
    received: number,
    percent: number,
    buffer: Uint8Array | undefined
}

export type RyokoMergedConfig =
    Omit<
        RyokoConfig,
        RyokoDefaultConfigKeys
    // Extract<keyof RyokoConfig, keyof RyokoDefaultConfig>
    > & RyokoDefaultConfig

export type DownloadSchedulerFn = (arg: DownloadSchedulerArg) => void;

export type RyokoResponseType =
    'json' | 'text' | 'stream' | 'arrayBuffer' | 'blob' | 'formData';

export type FetchInitKeys =
    'headers' | 'cache' | 'integrity' | 'redirect' | 'mode' |
    'referrer' | 'referrerPolicy' | 'window' | 'keepalive'

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
    (config: T): any
}

export type InterceptorItem<T> = {
    success: (config: T) => Promise<any>;
    failure: (config: T) => Promise<any>;
};

export interface InterceptorCtor<T> {
    callbacks: Array<InterceptorItem<T> | undefined>;
    use(
        onsuccess?: InterceptorFn<T>,
        onfailure?: InterceptorFn<T>
    ): number;
    eject(serie: number): void;
    traverse(fn: Function): void;
}

export type RyokoReqMethods =
    'get' | 'post' | 'put' | 'options' | 'delete' |
    'patch' | 'head' | 'link' | 'unlink' | 'purge'

export type RyokoClassQuickFn = (url: string, config?: RyokoConfig) => Promise<any>

export type RyokoClassQuickCmds =
    Record<
        RyokoReqMethods,
        RyokoClassQuickFn
    >;

export interface RyokoClass extends RyokoClassQuickCmds {
    interceptors: {
        request: InterceptorCtor<RyokoConfig>,
        response: InterceptorCtor<RyokoResponse>,
    };
    request(config: RyokoConfig): Promise<RyokoResponse>;
    defaults: RyokoMergedConfig;
}

export interface RyokoInstance extends RyokoClass {
    (c: RyokoConfig): Promise<any>
}

export type TokenStoreKey = any;

export type TokenStoreSpace = Set<Function>;

export interface RyokoNativeFn extends RyokoInstance {
    Ryoko: typeof Ryoko;
    AbortTokenizer: typeof AbortTokenizer;
    create: (c: RyokoConfig) => RyokoInstance;
    all: (p: Promise<any>[]) => Promise<any>;
    spread: (cb: Function) => (pa: Promise<any>[]) => any;
}

export type VerifyStatus = (status: number | string) => boolean

export type RyokoDefaultConfigKeys =
    'prefixUrl' | 'url' | 'method' | 'timeout' | 'onDefer' | 'responseType' |
    'verifyStatus' | 'fetch' | 'beforeRequest' | 'afterResponse' | 'credentials'

export type RyokoDefaultConfig =
    Required<
        Pick<
            RyokoConfig,
            RyokoDefaultConfigKeys
        >
    >

export interface RyokoErrorOptions {
    request?: Request,
    response?: Response,
    config?: RyokoMergedConfig,
    status?: number
}

export interface RyokoResponse {
    data: any;
    source: Response;
    status: number;
    statusText: string;
    headers: PlainObject<any>;
    config: RyokoConfig;
}

/**
 * ryoko取消控制器
 */
export class RyokoAbortController {
    /**
     * 延时终止定时器
     */
    abortTimer: ReturnType<typeof setTimeout>;
    /**
     * 是否支持AbortController
     */
    private isAllow;
    /**
     * fetch的singal选项
     */
    singal: AbortSignal;
    /**
     * AbortController终止器实例
     */
    controller: AbortController;
    /**
     * 终止提示信息
     */
    abortMsg: any;
    /**
     * 是否已终止该请求
     */
    aborted: boolean;
    /**
     * 是否是超时才终止请求的
     */
    isDefer: boolean;
    constructor();
    private init;
    /**
     * 延时终止请求
     * @param timeout 延时
     * @param cb 延时回调
     * @returns void
     */
    deferAbort(timeout: number, cb?: (msg?: any) => void): void;
    /**
     * 初始化终止控制器
     */
    private initAborber;
    /**
     * 设置终止提示信息
     * @param abortMsg 终止信息
     */
    setAbortMsg(abortMsg: any): void;
    /**
     * 手动终止请求
     */
    abortFetch(): void;
    /**
     * 监听请求终止状态
     *
     */
    abortState(): Promise<any>;
    /**
     * 清除延迟终止定时器
     */
    restoreAbortTimer(): void;
}

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
export class AbortTokenizer {
    static abortName: string;
    static tokenStore: Map<any, TokenStoreSpace>;
    static createToken(): symbol;
}

export function dispatchFetch(this: RyokoClass, config: RyokoMergedConfig): Promise<RyokoResponse>;


/**
 * 拦截器 the interceptor of request method
 */
export class Interceptor<T> implements InterceptorCtor<T> {
    callbacks: Array<InterceptorItem<T> | undefined>;
    constructor();
    init(): void;
    use(onsuccess: (config: T) => any, onfailure: (config: T) => any): number;
    eject(serie: number): void;
    traverse(fn: (item: InterceptorItem<T>) => void): void;
}

export class Ryoko {
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

export declare const ryokoStreamDeliver: (this: RyokoClass, fetchRes: Response, cb?: DownloadSchedulerFn | undefined) => Response;

export declare const _globalThis: typeof globalThis;
export declare const ArrayBufferViewTypes: string[];
export declare const BufferSourceTypes: string[];
export declare const fetchBodyInitTypes: string[];
export declare const fetchBodyAppendDataTypes: {
    FORMDATA: string;
    URLSEARCHPARAMS: string;
};
export declare const fetchCodeOptionKeys: string[];
export declare const ryokoMethods: RyokoReqMethods[];
export declare const CONTENT_TYPE = "content-type";
export declare const CONTENT_LENGTH = "content-length";
export declare const resposneTypes: string[];
export declare const credentialsTypes: string[];

export const mergeRyokoConfig: (initialConfig: RyokoMergedConfig, commonConfig: RyokoConfig) => RyokoMergedConfig;

export declare const MIME: string[];
export declare const DIREACTIVE: string[];
export declare const contentTypeReg: RegExp;
export declare const defaultMiMEMaps: {
    json: never[];
    text: never[];
    blob: never[];
    arrayBuffer: never[];
    formData: never[];
};
export function getContentTypeVal(headersObj: PlainObject): string;

/**
 * 生成fetch url
 * @param url 链接地址 string
 * @param params 查询参数 string | PlainObject<string>
 * @returns
 */
export declare const resolveRyokoUrl: (prefixUrl: string, url: string, params?: RyokoParams | undefined) => string;
/**
 * 生成fetch options选项的body参数
 */
export declare const resolveRyokoBody: (data?: BodyInit | undefined) => string | ArrayBuffer | Blob | FormData | ArrayBufferView | ReadableStream<Uint8Array> | undefined;
export declare const resolveRyokoResData: (res: Response, config: RyokoMergedConfig) => Promise<any>;
export declare const resolveRyokoResponse: (res: Response, config: RyokoMergedConfig) => Promise<RyokoResponse>;

export class RyokoError extends Error {
    readonly name: string;
    readonly isRyokoError: boolean;
    config?: RyokoMergedConfig;
    status?: number;
    constructor(message?: any, options?: RyokoErrorOptions);
    toString(): string;
    toJSON(): {
        message: string;
        number: number;
        description: string;
        fileName: string;
        lineNumber: number;
        stack: string | undefined;
        columnNumber: number;
        name: string;
        config: RyokoMergedConfig | undefined;
        status: number | undefined;
    };
}

export declare const errors: (ErrorConstructor | typeof RyokoError)[];
export declare const warn: (msg: any, type?: string, options?: PlainObject<any> | undefined) => void;

export declare const hasOwn: (ins: any, key: string) => boolean;
export declare const override: {
    <T, U>(target: T, source: U): T & U;
    <T_1, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
    <T_2, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
    (target: object, ...sources: any[]): any;
};
export declare const noop: (a?: any, b?: any, c?: any) => void;
export declare const URLPATT: RegExp;
export declare const URLKEYS: (keyof WebURL)[];
export declare const parseUrl: (url: string) => WebURL;
export declare function extend(target: PlainObject, ...source: PlainObject[]): PlainObject;
export declare const typeOf: (ins: any) => string;
export declare const is: PlainObject<(ins: any) => boolean>;
export declare const isSupportAbortController: boolean;
export declare const isFetch: (ins: typeof fetch) => boolean;
export declare const isSupportURL: boolean;
export declare const appendParam: (form: FormData | URLSearchParams, key: string, value: string | string[]) => void;
export declare const queryToObj: (query: string) => PlainObject<string>;
export declare const objToQuery: (obj: PlainObject<string>, prefix?: boolean) => string;
export declare const encode: (val: string) => string;
export declare const getURLDescriptors: (url: string) => {
    hash: string;
    host: string;
    hostname: string;
    href: string;
    origin: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
};
export declare const filterUselessKey: (obj: PlainObject<any>) => PlainObject<any>;
export declare const iteratorToObj: (iterator: IteratorObj<any>, lowerKey?: boolean) => PlainObject<any>;

declare const ryoko: RyokoNativeFn;
export default ryoko;
