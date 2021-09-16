import { PlainObject } from "../types";
import RyokoError from './ryokoError';
export declare const errors: (ErrorConstructor | typeof RyokoError)[];
export declare const warn: (msg: any, type?: string, options?: PlainObject<any> | undefined) => void;
