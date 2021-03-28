import {
    PlainObject,
    RyokoAppendBody,
    RyokoAppendBodySource,
} from "types";

import { fetchBodyAppendDataTypes, _globalThis } from '../helpers/constant'

const hasOwnProp = Object.prototype.hasOwnProperty

export const hasOwn = (
    ins: any,
    key: string,
) => hasOwnProp.call(ins, key);

export const override = Object.assign;

export const noop = function (a?: any, b?: any, c?: any) { };

export const URLPATT = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;

export const URLKEYS: (keyof WebURL)[] = [
    'href', 'origin', 'protocol', 'host',
    'hostname', 'port', 'pathname', 'search', 'hash'
];

export const parseUrl = (url: string) => {
    const result = {} as WebURL;
    let i = URLKEYS.length - 1;
    const matched = URLPATT.exec(url);
    if (matched) {
        for (; i >= 0; --i) {
            result[
                URLKEYS[i]
            ] = matched[i] || '';
        }
    }
    return result;
}

export function extend(
    target: PlainObject,
    ...source: PlainObject[]
): PlainObject {
    target = Object(target);
    const extendCore = (tar: PlainObject, s: PlainObject) => {
        if (Object(s) === s) {
            Object.keys(s).forEach(key => {
                tar[key] === void 0 &&
                    (tar[key] = s[key])
            })
        }
        return tar
    }
    let merged: PlainObject
    if (source.length !== 1) {
        merged = source.reduce((tar, s) => extendCore(tar, s), {})
    } else {
        merged = source[0]
    }
    return extendCore(target, merged);
}

const toString = Object.prototype.toString;

export const typeOf = (ins: any): string =>
    toString.call(ins).slice(8, -1);

export const is: PlainObject<
    (ins: any) => boolean
> =
    [
        'String', 'Number', 'Undefined',
        'Boolean', 'Null', 'Symbol', 'Function'
    ]
        .reduce(
            (is, typeStr) => {
                is[typeStr] = ins => typeof ins === typeStr.toLowerCase();
                return is;
            },
            {} as PlainObject<(ins: any) => boolean>
        );
 
is.Array = Array.isArray;

is.emptyArray = ins => 
    is.Array(ins) && 
    ins.length < 1; 

is.Object = ins =>
    typeof ins === 'object' &&
    ins !== null &&
    'constructor' in ins &&
    ins.constructor === Object;

is.PlainObject = ins => 
    typeof ins === 'object' && 
    ins !== null && 
    typeOf(ins) === 'Object';

is.emptyObject = ins =>
    is.PlainObject(ins) &&
    Object.keys(ins).length < 1;

export const isSupportAbortController =
    'AbortController' in _globalThis &&
    is.Function(AbortController);

export const isFetch = (ins: typeof fetch) => {
    return is.Function(ins);
}

export const isSupportURL =
    'URL' in _globalThis &&
    'createObjectURL' in _globalThis.URL &&
    'revokeObjectURL' in _globalThis.URL;

export const appendParam = (
    form: FormData | URLSearchParams,
    key: string,
    value: string | string[]
) => {
    Array.isArray(value)
        ? value.forEach(v => form.append(key, v))
        : form.append(key, value);
}

export const generateDataBody = (
    source: RyokoAppendBodySource,
    type: RyokoAppendBody
) => {
    let dataBody = null;
    switch (type) {
        case fetchBodyAppendDataTypes.FORMDATA:
            dataBody = new FormData();
            break;
        case fetchBodyAppendDataTypes.URLSEARCHPARAMS:
            dataBody = new URLSearchParams();
            break;
        default:
            throw new TypeError(
                `the parameter 'type' must be one of the two Options: 'FormData'、'URLSearchParams'`
            )
    }
    for (let key in source) {
        hasOwn(source, key) && appendParam(dataBody, key, source[key]);
    }
    return dataBody as FormData | URLSearchParams
}

export const queryToObj = (
    query: string
) => {
    let obj: PlainObject<string> = {}
    const prefixMatched = query.match(/^.*\?/);
    if (prefixMatched) {
        const realQuery = query.replace(prefixMatched[0], '')
        realQuery && (
            obj = realQuery
                .split('&')
                .reduce(
                    (obj, val) => {
                        const arr = val.split('=');
                        obj[arr[0]] = arr[1];
                        return obj;
                    },
                    obj
                )
        )

    }
    return obj
}


export const objToQuery = (
    obj: PlainObject<string>,
    prefix: boolean = false
) =>
    is.emptyObject(obj)
        ? ''
        : `${prefix ? '?' : ''}${Object.entries(obj).map(arr => arr.join('=')).join('&')}`


export const encode = (
    val: string
) => {
    return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
}

export const getURLDescriptors = (
    url: string
) => {
    const {
        hash,
        host,
        hostname,
        href,
        origin,
        pathname,
        port,
        protocol,
        search,
    } = new URL(url);
    return { hash, host, hostname, href, origin, pathname, port, protocol, search }
}

export const filterUselessKey = (
    obj: PlainObject<any>
) => {
    for (let key in obj) {
        hasOwn(obj, key) && obj[key] === void 0 && (delete obj[key]);
    }
    return obj
}

export const iteratorToObj = (
    iterator: IteratorObj<any>,
    lowerKey = false
) => {
    let obj: PlainObject = Object.create(null)
    for (let [key, value] of iterator.entries()) {
        const realKey = lowerKey ? key.toLowerCase() : key;
        obj[realKey] = value
    }
    return obj;
}

