import { RyokoConfig, RyokoDefaultConfig, RyokoMergedConfig } from "types";

import {
    filterUselessKey,
    extend,
    iteratorToObj,
    is,
    isFetch,
} from '../shared/utils'

import {
    credentialsTypes,
    ryokoMethods,
     _globalThis
} from './constant'
import RyokoError from "./ryokoError";
import { resolveRyokoBody } from "./resolver";

const mergeRyokoConfig = (
    initialConfig: RyokoMergedConfig,
    commonConfig: RyokoConfig
) => {

    const mergedConfig = filterUselessKey(extend(commonConfig, initialConfig)) as RyokoMergedConfig;

    let {
        method,
        headers,
        data,
        fetch: ryokoFetch,
        credentials,
        beforeRequest,
        afterResponse,
    } = mergedConfig

    let methodReg = new RegExp(`^${method}$`, 'i');
    if (ryokoMethods.some(_ => _.match(methodReg))) {
        mergedConfig.method = method = method.toLowerCase();
    } else {
        throw new RyokoError(
            `The 'method' parameter must be one of the ${ryokoMethods.length} 
            options:${ryokoMethods.join('、')}`
        )
    }

    if (['get', 'head', 'options'].includes(method)) {
        delete mergedConfig.data
    } else {
        mergedConfig.data = resolveRyokoBody(data)
    }

    if (!isFetch(ryokoFetch)) {
        throw new RyokoError(`The 'fetch' option you provided is not a function!`);
    }

    if (typeof credentials === 'boolean') {
        credentials = credentials ? 'include' : 'omit';
    } else if (
        !credentialsTypes.includes(credentials)
    ) {
        throw new RyokoError(
            `The valid type of 'credentials' paramter：Boolean、undefined、${credentialsTypes.join('、')}`
        )
    }

    return mergedConfig;

}

export default mergeRyokoConfig