import { PlainObject } from "../types";
import RyokoError from './ryokoError'

export const errors = [
    Error,
    URIError,
    TypeError,
    RangeError,
    ReferenceError,
    SyntaxError,
    RyokoError,
]

const errTypesMatchPatts = errors.map(
    Ctor => new RegExp(Ctor.name, 'i')
)

export const warn = (
    msg: any,
    type: string = 'Error',
    options?: PlainObject,
) => {
    if (type === 'console') {
        console.warn(msg, `options：${options}`)
        return
    } 
    let idx = errTypesMatchPatts.findIndex(patt => patt.test(type))
    !~idx && (idx = 0);
    throw new errors[idx](msg);
}