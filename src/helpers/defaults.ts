import { noop } from '../shared/utils';
import {
    RyokoDefaultConfig,
} from 'types';
import { _globalThis } from './constant';

const defaultRyokoConfig: RyokoDefaultConfig = {

    prefixUrl: '',

    url: '',

    timeout: 0,

    fetch: _globalThis.fetch,

    onDefer: noop,

    verifyStatus: (status) => status < 300 && status >= 200,

    method: 'GET',

    responseType: 'text',

    beforeRequest: noop,

    afterResponse: noop,

    credentials: 'same-origin',

};

export default defaultRyokoConfig