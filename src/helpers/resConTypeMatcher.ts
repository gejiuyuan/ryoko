import { PlainObject } from 'types';
import {
    CONTENT_TYPE
} from './constant'

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
]

export const contentTypeReg =
    new RegExp(
        String.raw`((${MIME.join('|')})\/[a-z\d.*+-]+)(?:;\s+(${DIREACTIVE.join('|')})=.+)*`,
        'i'
    );

export default function getContentTypeVal(
    headersObj: PlainObject,
) {
    let conTypeVal = '',
        isMatched = false,
        matchedMIME = ''

    for (let [key, value] of Object.values(headersObj)) {
        if (key.toLowerCase() === CONTENT_TYPE) {
            conTypeVal = value;
            isMatched = true;
            break;
        }
    }
    if (isMatched) {
        matchedMIME = conTypeVal.match(contentTypeReg)?.[1] || '';
    }
    return matchedMIME;
}
