import { extend } from "../shared/utils";
import { RyokoMergedConfig, RyokoErrorOptions } from "../types";

export default class RyokoError extends Error {

    public readonly name: string = 'RyokoError'

    public readonly isRyokoError: boolean = true

    public config?: RyokoMergedConfig

    public status?: number

    constructor(
        message?: any,
        options: RyokoErrorOptions = {}
    ) {
        super(message);
        extend(this, options);
    }

    public toString() {
        return `${this.name}: ${this.message}`;
    }

    public toJSON() {

        const {
            //Standard
            message,
            name,
            //MiscroSoft
            number,
            description,
            //FireFox
            fileName,
            lineNumber,
            stack,
            columnNumber,
            //Ryoko
            config,
            status, 
        } = this

        return {
            message, number, description, fileName, lineNumber, stack, columnNumber, name,
            config, status, 
        }

    }

}