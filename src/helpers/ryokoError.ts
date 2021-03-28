import { RyokoMergedConfig , RyokoErrorOptions } from "types";
 
export default class RyokoError extends Error {

    public readonly name: string = 'RyokoError';

    public readonly isRyokoError: boolean = true;

    public options?: RyokoErrorOptions;

    constructor(
        message?: any,
        options?: RyokoErrorOptions
    ) {
        super(message);
        this.options = options;
    }

    public toString() {
        return `${this.name}: ${this.message}`;
    }

    public toJSON() {

        const {
            //标准
            message,
            name,
            //微软
            number,
            description,
            //火狐
            fileName,
            lineNumber,
            stack,
            columnNumber,
            //Ryoko
            options
        } = this

        const {
            config, status
        } = options as RyokoErrorOptions;

        return {
            message, number, description, fileName, lineNumber, stack, columnNumber, name, config, status
        }

    }

}