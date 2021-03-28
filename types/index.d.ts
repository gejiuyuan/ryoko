
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

export type DownloadSchedulerFn = (arg: DownloadSchedulerArg) => void;

export type RyokoResponseType =
    'json' | 'text' | 'stream' | 'arrayBuffer' | 'blob' | 'formData';

export type FetchInitKeys =
    'headers' | 'cache' | 'integrity' | 'redirect' | 'mode' |
    'referrer' | 'referrerPolicy' | 'window' | 'keepalive'

export interface RyokoConfig extends Pick<RequestInit, FetchInitKeys> {

    fetch?: typeof fetch;

    prefixURL?: string;

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

export type TokenStoreKey = Symbol;

export type TokenStoreSpace = Set<(msg?: any) => void>;
 
export interface RyokoNativeFn extends RyokoInstance {
    Ryoko: typeof Ryoko;
    AbortTokenizer: typeof AbortTokenizer;
    create: (c: RyokoConfig) => RyokoInstance;
    all: (p: Promise<any>[]) => Promise<any>;
    spread: (cb: Function) => (pa: Promise<any>[]) => any;
}

export type VerifyStatus = (status: number | string) => boolean

export type RyokoDefaultConfigKeys =
    'prefixURL' | 'url' | 'method' | 'timeout' | 'onDefer' | 'responseType' |
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

export const mergeRyokoConfig: (
    initialConfig: RyokoMergedConfig, 
    commonConfig: RyokoConfig
) => RyokoMergedConfig;


export type RyokoMergedConfig =
    Omit<
        RyokoConfig,
        RyokoDefaultConfigKeys
    // Extract<keyof RyokoConfig, keyof RyokoDefaultConfig>
    > & RyokoDefaultConfig

 
export class RyokoAbortController {
    abortTimer: ReturnType<typeof setTimeout>;
    private isAllow;
    singal: AbortSignal;
    controller: AbortController;
    abortMsg: any;
    constructor();
    private init;
    deferAbort(timeout: number, cb: (msg?: any) => void): void;
    private initAborber;
    setAbortMsg(abortMsg: any): void;
    abortFetch(): void;
    abortState(): Promise<any>;
    restoreAbortTimer(): void;
}

export class AbortTokenizer {
    static abortName: string;
    static tokenStore: Map<Symbol, TokenStoreSpace>;
    static create(): {
        stop(msg?: any): void;
        token: symbol;
    };
}

export function dispatchFetch(this: RyokoClass, config: RyokoMergedConfig): Promise<RyokoResponse>;

export declare const ryokoStreamDeliver: (
    this: RyokoClass, 
    fetchRes: Response, 
    cb?: DownloadSchedulerFn 
) => Response;

export class Interceptor<T> implements InterceptorCtor<T> {
    callbacks: Array<InterceptorItem<T> | undefined>;
    constructor();
    init(): void;
    use(onsuccess: (config: T) => any, onfailure: (config: T) => any): number;
    eject(serie: number): void;
    traverse(fn: (item: InterceptorItem<T>) => void): void;
}

export class Ryoko implements RyokoClass {
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

export declare const defaultRyokoConfig: RyokoDefaultConfig; 

export declare const MIME: string[];
export declare const DIREACTIVE: string[];
export declare const contentTypeReg: RegExp;
export function getContentTypeVal(headersObj: PlainObject): string;

export declare const resolveRyokoUrl: (prefixURL: string, url: string, params?: RyokoParams | undefined) => string;
/**
 * 生成fetch options选项的body参数
 */
export declare const resolveRyokoBody: (data?: BodyInit | undefined) => string | ArrayBuffer | Blob | FormData | ReadableStream<Uint8Array> | ArrayBufferView | undefined;
export declare const resolveRyokoResData: (res: Response, config: RyokoMergedConfig) => Promise<any>;
export declare const resolveRyokoResponse: (res: Response, config: RyokoMergedConfig) => Promise<RyokoResponse>;

export class RyokoError extends Error {
    readonly name: string;
    readonly isRyokoError: boolean;
    options?: RyokoErrorOptions;
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

declare const ryoko: RyokoNativeFn;
export default ryoko;
