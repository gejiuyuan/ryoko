import RyokoError from './ryokoError';
export const errors = [
    Error,
    URIError,
    TypeError,
    RangeError,
    ReferenceError,
    SyntaxError,
    RyokoError,
];
const errTypesMatchPatts = errors.map(Ctor => new RegExp(Ctor.name, 'i'));
export const warn = (msg, type = 'Error', options) => {
    if (type === 'console') {
        console.warn(msg, `options：${options}`);
        return;
    }
    let idx = errTypesMatchPatts.findIndex(patt => patt.test(type));
    !~idx && (idx = 0);
    throw new errors[idx](msg);
};
