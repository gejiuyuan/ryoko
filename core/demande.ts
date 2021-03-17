
import {
    extend,
    filterUselessKey,
} from '../shared/utils'

import {
    DemandeConfig,
    DemandeMethod,
    DemandeInstance,
    DemandeClass,
    InterceptorCtor,
    InterceptorItem,
    DemandeMergedConfig,
    InterceptorFn,
    DemandeResponse,
} from '../index';

import Interceptor from './interceptor'
import defaultDemandeConfig from '../defaults'
import dispatchRequest from './dispatchRequest'

// a request method based on the native fetch api

export default class Demande implements DemandeClass {

    private defaults: DemandeConfig;

    public interceptors: {
        request: InterceptorCtor<DemandeConfig>,
        response: InterceptorCtor<DemandeResponse>,
    }

    public config!: DemandeMergedConfig;

    constructor(
        config: DemandeConfig
    ) {
        this.defaults = extend(config, defaultDemandeConfig);
        this.interceptors = {
            request: new Interceptor(),
            response: new Interceptor(),
        }
    }

    request(
        config: DemandeConfig
    ): Promise<any> {
        const mergedConfig = filterUselessKey(extend(config, this.defaults)) as DemandeMergedConfig;
        this.config = mergedConfig;

        const promisesQueueBefore: InterceptorFn<DemandeConfig>[] = [],
            promisesQueueAfter: InterceptorFn<DemandeResponse>[] = [];

        this.interceptors.request.traverse((interceptor: InterceptorItem<DemandeConfig>) => {
            promisesQueueBefore.push(interceptor.success, interceptor.failure);
        });

        this.interceptors.response.traverse((interceptor: InterceptorItem<DemandeResponse>) => {
            promisesQueueAfter.push(interceptor.success, interceptor.failure);
        });

        let prePromise = Promise.resolve(mergedConfig);
        while (promisesQueueBefore.length) {
            prePromise = prePromise.then(promisesQueueBefore.shift(), promisesQueueBefore.shift())
        }

        const corePromise = prePromise.then(dispatchRequest.bind(this), void 0);

        let endPromise = corePromise;
        while (promisesQueueAfter.length) {
            endPromise = endPromise.then(promisesQueueAfter.shift(), promisesQueueAfter.shift());
        };

        return endPromise;
    }
}

