import { RyokoReqMethods } from 'types'

export const _globalThis =
    globalThis !== void 0
        ? globalThis
        : self !== void 0
            ? self
            : window !== void 0
                ? window
                : global !== void 0
                    ? global
                    : {} as typeof globalThis;

export const ArrayBufferViewTypes = [
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
]

export const BufferSourceTypes = ArrayBufferViewTypes.concat('ArrayBuffer');

export const fetchBodyInitTypes =
    ['Blob', 'FormData', 'URLSearchParams', 'ReadableStream', 'String', 'Null'].concat(BufferSourceTypes);

export const fetchBodyAppendDataTypes = {
    FORMDATA: 'FormData',
    URLSEARCHPARAMS: 'URLSearchParams'
};

export const fetchCodeOptionKeys = [
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
]

export const ryokoMethods: RyokoReqMethods[] = [
    'get', 'post', 'put', 'options', 'delete', 'patch', 'head',
]

export const CONTENT_TYPE = 'content-type';

export const CONTENT_LENGTH = 'content-length';

export const resposneTypes = [
    'blob',
    'arrayBuffer',
    'formData',
    'json',
    'text'
]

export const credentialsTypes = [
    'omit',
    'same-origin',
    'include',
]