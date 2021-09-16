import { filterUselessKey, extend, isFetch, } from '../shared/utils';
import { credentialsTypes, ryokoMethods } from './constant';
import { resolveRyokoBody } from "./resolver";
import { warn } from "./warn";
const mergeRyokoConfig = (initialConfig, commonConfig) => {
    const mergedConfig = filterUselessKey(extend(commonConfig, initialConfig));
    let { method, headers, data, fetch: ryokoFetch, credentials, beforeRequest, afterResponse, } = mergedConfig;
    let methodReg = new RegExp(`^${method}$`, 'i');
    if (ryokoMethods.some(_ => _.match(methodReg))) {
        mergedConfig.method = method = method.toLowerCase();
    }
    else {
        warn(`The 'method' parameter must be one of the ${ryokoMethods.length} 
            options:${ryokoMethods.join('、')}`, 'TypeError');
    }
    if (['get', 'head', 'options'].includes(method)) {
        Reflect.deleteProperty(mergedConfig, 'data');
    }
    else {
        mergedConfig.data = resolveRyokoBody(data);
    }
    if (!isFetch(ryokoFetch)) {
        warn(`The 'fetch' option you provided is not a function!`, 'TypeError');
    }
    if (typeof credentials === 'boolean') {
        mergedConfig.credentials = credentials = credentials ? 'include' : 'omit';
    }
    else if (!credentialsTypes.includes(credentials)) {
        warn(`The valid type of 'credentials' paramter：Boolean、undefined、${credentialsTypes.join('、')}`, 'TypeError');
    }
    return mergedConfig;
};
export default mergeRyokoConfig;
