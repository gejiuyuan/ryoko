import { noop } from '../shared/utils';
import { _globalThis } from './constant';
const defaultRyokoConfig = {
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
    params: {},
};
export default defaultRyokoConfig;
