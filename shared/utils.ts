import {
    PlainObject,
    DemandeAppendBody,
    DemandeAppendBodySource,
} from "../index";

import { fetchBodyAppendDataTypes } from '../helpers/cosntant'

const hasOwnProp = Object.prototype.hasOwnProperty

export const hasOwn = (
    ins: any,
    key: string,
) => hasOwnProp.call(ins, key);

export const noop = (a?: any, b?: any, c?: any) => { };

export function extend(
    target: PlainObject,
    ...source: PlainObject[]
): PlainObject {
    target = Object(target);
    const extendCore = (tar: PlainObject, s: PlainObject) => {
        if (Object(s) === s) {
            for (let key in s) {
                if (hasOwn(s, key)) {
                    Reflect.get(tar, key) === void (0) &&
                        Reflect.set(tar, key, Reflect.get(s, key))
                }
            }
        }
        return tar
    }
    const mergedSource = source.reduce((target, s) => extendCore(target, s), {})
    return extendCore(target, mergedSource)
}

const toString = Object.prototype.toString;

export const typeOf = (ins: any): string =>
    toString.call(ins).slice(8, -1);

export const is: PlainObject<
    (ins: any) => boolean
> =
    [
        'String', 'Number', 'Undefined',
        'Array', 'Boolean', 'Null',
    ]
        .reduce(
            (is, typeStr) => {
                is[typeStr] = ins => typeOf(ins) === typeStr;
                return is;
            },
            {} as PlainObject<(ins: any) => boolean>
        );

is.emptyArray = ins => is.array(ins) && ins.length === 0;
is.Function = ins => typeof ins === 'function';
is.Object = ins =>
    typeof ins === 'object' &&
    ins !== null &&
    'constructor' in ins &&
    ins.constructor === Object;

is.emptyObject = ins =>
    is.Object(ins) &&
    Object.keys(ins).length === 0;

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
    source: DemandeAppendBodySource,
    type: DemandeAppendBody
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
    const realParamsStr = query.replace(/^\?/, '').trim();
    let obj: PlainObject<string> = {}
    if (realParamsStr.length !== 0) {
        obj = realParamsStr.split('&')
            .reduce(
                (obj, val) => {
                    const arr = val.split('=');
                    obj[arr[0]] = arr[1];
                    return obj;
                },
                obj
            )
    }
    return obj
}


export const objToQuery = (
    obj: PlainObject<string>,
    prefix: boolean = false
) => (
    (prefix ? '?' : '') +
    Object.entries(obj).map(arr => arr.join('=')).join('&')
)

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
    url = decodeURIComponent(url); 
    const {
        hash,
        host,
        href,
        origin,
        pathname,
        port,
        protocol,
        search,
    } = new URL(url);
    const searchParams = queryToObj(search)
    return { hash, host, href, origin, pathname, port, protocol, search, searchParams }
}

export const filterUselessKey = (
    obj: PlainObject<any>
) => {
    for (let key in obj) {
        hasOwn(obj, key) && obj[key] === void 0 && (delete obj[key]);
    }
    return obj
}