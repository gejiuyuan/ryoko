import { PlainObject } from '../types';
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
export default function getContentTypeVal(headersObj: PlainObject): string;
