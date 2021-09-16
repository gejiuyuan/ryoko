import { _globalThis } from '../helpers/constant';
const hasOwnProp = Object.prototype.hasOwnProperty;
export const hasOwn = (ins, key) => hasOwnProp.call(ins, key);
export const override = Object.assign;
export const noop = function (a, b, c) { };
export const URLPATT = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;
export const URLKEYS = [
    'href', 'origin', 'protocol', 'host',
    'hostname', 'port', 'pathname', 'search', 'hash'
];
export const parseUrl = (url) => {
    const result = {};
    let i = URLKEYS.length - 1;
    const matched = URLPATT.exec(url);
    if (matched) {
        for (; i >= 0; --i) {
            result[URLKEYS[i]] = matched[i] || '';
        }
    }
    return result;
};
export const extendCore = (tar, s) => {
    if (Object(s) === s) {
        Object.keys(s).forEach(key => {
            if (tar[key] === void 0) {
                tar[key] = s[key];
            }
            else {
                extendCore(tar[key], s[key]);
            }
        });
    }
    return tar;
};
export function extend(target, ...source) {
    target = Object(target);
    let merged;
    if (source.length !== 1) {
        merged = source.reduce((tar, s) => extendCore(tar, s), {});
    }
    else {
        merged = source[0];
    }
    return extendCore(target, merged);
}
const { toString } = Object.prototype;
export const typeOf = (ins) => toString.call(ins).slice(8, -1);
export const is = [
    'String', 'Number', 'Undefined',
    'Boolean', 'Null', 'Symbol', 'Function'
]
    .reduce((is, typeStr) => {
    is[typeStr] = ins => typeof ins === typeStr.toLowerCase();
    return is;
}, {});
is.Array = Array.isArray;
is.emptyArray = ins => is.Array(ins) &&
    ins.length < 1;
is.Object = ins => typeof ins === 'object' &&
    ins !== null &&
    'constructor' in ins &&
    ins.constructor === Object;
is.PlainObject = ins => typeof ins === 'object' &&
    ins !== null &&
    typeOf(ins) === 'Object';
is.emptyObject = ins => is.PlainObject(ins) &&
    Object.keys(ins).length < 1;
export const isSupportAbortController = 'AbortController' in _globalThis &&
    is.Function(AbortController);
export const isFetch = (ins) => {
    return is.Function(ins);
};
export const isSupportURL = 'URL' in _globalThis &&
    'createObjectURL' in _globalThis.URL &&
    'revokeObjectURL' in _globalThis.URL;
export const appendParam = (form, key, value) => {
    Array.isArray(value)
        ? value.forEach(v => form.append(key, v))
        : form.append(key, value);
};
export const queryToObj = (query) => {
    let obj = {};
    const prefixMatched = query.match(/^.*\?/);
    if (prefixMatched) {
        const realQuery = query.replace(prefixMatched[0], '');
        realQuery && (obj = realQuery
            .split('&')
            .reduce((obj, val) => {
            const arr = val.split('=');
            obj[arr[0]] = arr[1];
            return obj;
        }, obj));
    }
    return obj;
};
export const objToQuery = (obj, prefix = false) => is.emptyObject(obj)
    ? ''
    : `${prefix ? '?' : ''}${Object.entries(obj).map(arr => arr.join('=')).join('&')}`;
export const encode = (val) => {
    return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
};
export const filterUselessKey = (obj) => {
    for (let key in obj) {
        hasOwn(obj, key) && obj[key] === void 0 && (delete obj[key]);
    }
    return obj;
};
export const iteratorToObj = (iterator, lowerKey = false) => {
    let obj = {};
    for (let [key, value] of iterator.entries()) {
        const realKey = lowerKey ? key.toLowerCase() : key;
        obj[realKey] = value;
    }
    return obj;
};
