
export declare interface PlainObject<type = any> {
    [key: string]: type
}

export declare type DemandeAppendBody = 'FormData' | 'URLSearchParams';

export declare type DemandeAppendBodySource = PlainObject<string | string[]>;

export declare type DemandeDataSpecial = {
    source: DemandeAppendBodySource,
    type: DemandeAppendBody
}

export declare type DemandeData =
    BodyInit | null | DemandeDataSpecial

export declare type DemandeParams = string | PlainObject<any>

export type TeedStreams = [
    ReadableStream<Uint8Array>,
    ReadableStream<Uint8Array>
]

export declare type DownloadProgressFn = ({
    total: number,
    received: number
}) => void;

export declare interface DemandeConfig {

    baseURL?: string;

    onAbort?: () => void;

    url?: string

    params?: DemandeParams;

    data?: DemandeData;

    method?: string;

    mode?: RequestMode;

    credentials?: RequestCredentials;

    headers?: HeadersInit;

    cache?: RequestCache;

    integrity?: string;

    redirect?: RequestRedirect;

    referrer?: string;

    referrerPolicy?: ReferrerPolicy;

    window?: any;

    signal?: AbortSignal | null;

    keepalive?: boolean;

    timeout?: number;

    maxContentLength?: number;

    onDownloadProgress?: DownloadProgressFn

    validateStatus?: (status: string | number) => boolean

}

export declare interface InterceptorFn<T> {
    (config: T): any
}
export declare type InterceptorItem<T> = {
    success: (config: T) => Promise<any>;
    failure: (config: T) => Promise<any>;
};

export declare abstract class InterceptorCtor<T> {
    public abstract callbacks: Array<InterceptorItem<T> | undefined>;
    public abstract use(
        onsuccess?: InterceptorFn<T>,
        onfailure?: InterceptorFn<T>
    ): number;
    public abstract eject(serie: number): void;
    public abstract traverse(fn: Function): void;
}

export declare interface DemandeClass { 
    config: DemandeMergedConfig;
    interceptors: {
        request: InterceptorCtor<DemandeConfig>,
        response: InterceptorCtor<DemandeResponse>,
    }
    request(config: DemandeConfig): Promise<any>
}

export declare interface DemandeInstance extends DemandeClass {
    (c: DemandeConfig): Promise<any>
}

export declare interface DemandeMethod extends DemandeInstance {
    Demande: typeof Demande;
    create: (c: DemandeConfig) => DemandeInstance;
    all: (p: Promise<any>[]) => Promise<any>;
    spread: (cb: Function) => (pa: Promise<any>[]) => any;
}

export declare type ValidateStatus = (status: number | string) => boolean

export declare interface DemandeDefaultConfig {
    baseURL: string;
    method: string;
    timeout: number;
    onAbort: Function;
    maxContentLength: number;
    validateStatus: ValidateStatus
}

export declare interface DemandeMergedConfig extends DemandeConfig, DemandeDefaultConfig {};

export declare interface DemandeResponse {
    data: Response;
    status: number;
    statusText: string;
    headers: PlainObject<any>;
    config: DemandeConfig;
}

