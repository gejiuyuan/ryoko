import { RyokoParams, RyokoResponse, RyokoMergedConfig } from '../types';
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
export declare const resolveRyokoBody: (data?: BodyInit | undefined) => string | Blob | ArrayBufferView | ArrayBuffer | FormData | ReadableStream<Uint8Array> | undefined;
export declare const resolveRyokoResData: (res: Response, config: RyokoMergedConfig) => Promise<any>;
export declare const resolveRyokoResponse: (res: Response, config: RyokoMergedConfig) => Promise<RyokoResponse>;
