import { noop } from './shared/utils';
import { 
    DemandeDefaultConfig,
} from './index';

const defaultDemandeConfig: DemandeDefaultConfig = { 
    
    baseURL: window.location.origin,

    timeout: 0,

    onAbort: noop,

    validateStatus: (status) => status < 300 && status >= 200,
    
    method: 'GET',

    maxContentLength: -1,

};

export default defaultDemandeConfig