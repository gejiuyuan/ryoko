import { CONTENT_TYPE } from './constant';
export const MIME = [
    'text',
    'image',
    'application',
    'multipart',
    'audio',
    'video',
    'font',
    'model',
    'message',
    'example',
];
export const DIREACTIVE = [
    'charset',
    'boundary',
];
export const contentTypeReg = new RegExp(String.raw `((${MIME.join('|')})\/[a-z\d.*+-]+)(?:;\s+(${DIREACTIVE.join('|')})=.+)*`, 'i');
export const defaultMiMEMaps = {
    'json': [],
    'text': [],
    'blob': [],
    'arrayBuffer': [],
    'formData': []
};
export default function getContentTypeVal(headersObj) {
    var _a;
    let matchedMIME = '';
    for (let [key, value] of Object.values(headersObj)) {
        if (key.toLowerCase() === CONTENT_TYPE) {
            matchedMIME = ((_a = value.match(contentTypeReg)) === null || _a === void 0 ? void 0 : _a[1]) || '';
            break;
        }
    }
    return matchedMIME;
}
