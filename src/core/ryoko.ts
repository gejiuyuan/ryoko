
import {
    extend,
    override,
} from '../shared/utils'

import {
    RyokoConfig,
    RyokoClass,
    InterceptorCtor,
    InterceptorItem,
    RyokoMergedConfig,
    InterceptorFn,
    RyokoResponse,
    PlainObject,
    RyokoInstance,
    RyokoDefaultConfig,
    RyokoReqMethods,
    RyokoClassQuickFn,
} from 'types';

import Interceptor from './interceptor'
import defaultRyokoConfig from '../helpers/defaults'
import dispatchFetch from './dispatchFetch'
import { ryokoMethods } from '../helpers/constant'
import mergeRyokoConfig from '../helpers/mergeConfig'

 
// a request method based on the native fetch api

export default class Ryoko {

    public get!: RyokoClassQuickFn;
    public post!: RyokoClassQuickFn;
    public options!: RyokoClassQuickFn;
    public put!: RyokoClassQuickFn;
    public delete!: RyokoClassQuickFn;
    public patch!: RyokoClassQuickFn;
    public head!: RyokoClassQuickFn;
    public link!: RyokoClassQuickFn;
    public unlink!: RyokoClassQuickFn;
    public purge!: RyokoClassQuickFn;

    public defaults: RyokoMergedConfig;

    public interceptors: {
        request: InterceptorCtor<RyokoConfig>,
        response: InterceptorCtor<RyokoResponse>,
    }

    constructor(
        config: RyokoConfig
    ) {
        this.defaults = extend({}, config, defaultRyokoConfig) as RyokoMergedConfig;
        this.interceptors = {
            request: new Interceptor(),
            response: new Interceptor(),
        }
    }

    public request(
        config: RyokoConfig
    ): Promise<RyokoResponse> {
        const mergedConfig = mergeRyokoConfig(this.defaults, config);
        
        const { beforeRequest, afterResponse } = mergedConfig;

        const promisesQueueBefore: InterceptorFn<RyokoConfig>[] = [],
            promisesQueueAfter: InterceptorFn<RyokoResponse>[] = [];

        this.interceptors.request.traverse((interceptor: InterceptorItem<RyokoConfig>) => {
            promisesQueueBefore.push(interceptor.success, interceptor.failure);
        });

        this.interceptors.response.traverse((interceptor: InterceptorItem<RyokoResponse>) => {
            promisesQueueAfter.push(interceptor.success, interceptor.failure);
        });

        let prePromise = Promise.resolve(mergedConfig);
        while (promisesQueueBefore.length) {
            prePromise = prePromise.then(promisesQueueBefore.shift(), promisesQueueBefore.shift())
        }

        prePromise = prePromise.then(async (config) => {
            await beforeRequest.call(this, config);
            return config;
        });

        const corePromise = prePromise.then(dispatchFetch.bind(this), void 0);

        let endPromise = corePromise;
        endPromise = endPromise.then(async (response) => {
            await afterResponse.call(this, response);
            return response
        });

        while (promisesQueueAfter.length) {
            endPromise = endPromise.then(promisesQueueAfter.shift(), promisesQueueAfter.shift());
        };

        return endPromise;
    }

}

//默认class定义的类的原型方法不能枚举
Object.defineProperty(Ryoko.prototype, 'request', {
    enumerable: true,
});

ryokoMethods.forEach((method, i) => {
    Reflect.set(
        Ryoko.prototype,
        method,
        function (
            this: RyokoClass | RyokoInstance,
            url: string,
            config?: RyokoConfig
        ) {
            const endConfig = override({}, config, { method, url, });
            return (
                typeof this === 'function'
                    ? this(endConfig)
                    : this.request.call(this, endConfig)
            );
        })
});


