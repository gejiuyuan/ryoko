import { RyokoMergedConfig, RyokoErrorOptions } from "../types";
export default class RyokoError extends Error {
    readonly name: string;
    readonly isRyokoError: boolean;
    config?: RyokoMergedConfig;
    status?: number;
    constructor(message?: any, options?: RyokoErrorOptions);
    toString(): string;
    toJSON(): {
        message: any;
        number: any;
        description: any;
        fileName: any;
        lineNumber: any;
        stack: any;
        columnNumber: any;
        name: any;
        config: any;
        status: any;
    };
}
