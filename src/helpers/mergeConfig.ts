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
import { warn } from "./warn";

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
        warn(
            `The 'method' parameter must be one of the ${ryokoMethods.length} 
            options:${ryokoMethods.join('、')}`,
            'TypeError'
        )
    }

    if (['get', 'head', 'options'].includes(method)) {
        delete mergedConfig.data
    } else {
        mergedConfig.data = resolveRyokoBody(data)
    }

    if (!isFetch(ryokoFetch)) {
        warn(
            `The 'fetch' option you provided is not a function!`,
            'TypeError'
        )
    }

    if (typeof credentials === 'boolean') {
        credentials = credentials ? 'include' : 'omit';
    } else if (
        !credentialsTypes.includes(credentials)
    ) {
        warn(
            `The valid type of 'credentials' paramter：Boolean、undefined、${credentialsTypes.join('、')}`,
            'TypeError'
        )
    }

    return mergedConfig;

}

export default mergeRyokoConfig