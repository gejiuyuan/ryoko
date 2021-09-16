import { extend } from "../shared/utils";
export default class RyokoError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = 'RyokoError';
        this.isRyokoError = true;
        extend(this, options);
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
    toJSON() {
        const { 
        //Standard
        message, name, 
        //MiscroSoft
        number, description, 
        //FireFox
        fileName, lineNumber, stack, columnNumber, 
        //Ryoko
        config, status, } = this;
        return {
            message, number, description, fileName, lineNumber, stack, columnNumber, name,
            config, status,
        };
    }
}
