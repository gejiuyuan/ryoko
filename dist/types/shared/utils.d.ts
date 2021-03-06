import { PlainObject, WebURL } from "../types";
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
export declare const extendCore: (tar: PlainObject, s: PlainObject) => PlainObject<any>;
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
export declare const filterUselessKey: (obj: PlainObject<any>) => PlainObject<any>;
export declare const iteratorToObj: (iterator: Headers, lowerKey?: boolean) => PlainObject<any>;
