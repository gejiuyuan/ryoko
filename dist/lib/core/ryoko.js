import { extend, override, } from '../shared/utils';
import Interceptor from './interceptor';
import defaultRyokoConfig from '../helpers/defaults';
import dispatchFetch from './dispatchFetch';
import { ryokoMethods } from '../helpers/constant';
import mergeRyokoConfig from '../helpers/mergeConfig';
// a request method based on the native fetch api
export default class Ryoko {
    constructor(config) {
        this.defaults = extend({}, config, defaultRyokoConfig);
        this.interceptors = {
            request: new Interceptor(),
            response: new Interceptor(),
        };
    }
    request(config) {
        const mergedConfig = mergeRyokoConfig(this.defaults, config);
        const promisesQueueBefore = [], promisesQueueAfter = [];
        this.interceptors.request.traverse((interceptor) => {
            promisesQueueBefore.push(interceptor.success, interceptor.failure);
        });
        this.interceptors.response.traverse((interceptor) => {
            promisesQueueAfter.push(interceptor.success, interceptor.failure);
        });
        let synchronous = true;
        if (!synchronous) {
            let prePromise = Promise.resolve(mergedConfig);
            while (promisesQueueBefore.length) {
                prePromise = prePromise.then(promisesQueueBefore.shift(), promisesQueueBefore.shift());
            }
            const corePromise = prePromise.then(dispatchFetch.bind(this), void 0);
            let endPromise = corePromise;
            while (promisesQueueAfter.length) {
                endPromise = endPromise.then(promisesQueueAfter.shift(), promisesQueueAfter.shift());
            }
            ;
            return endPromise;
        }
        let actualMergedConfig = mergedConfig;
        let syncEndPromise;
        while (promisesQueueBefore.length) {
            const requestInterceptor = promisesQueueBefore.shift();
            const responseInterceptor = promisesQueueBefore.shift();
            try {
                actualMergedConfig = requestInterceptor(mergedConfig);
            }
            catch (err) {
                responseInterceptor(err);
                break;
            }
        }
        try {
            syncEndPromise = dispatchFetch.call(this, actualMergedConfig);
        }
        catch (err) {
            return Promise.reject(err);
        }
        while (promisesQueueAfter.length) {
            syncEndPromise = syncEndPromise.then(promisesQueueAfter.shift(), promisesQueueAfter.shift());
        }
        return syncEndPromise;
    }
}
//默认class定义的类的原型方法不能枚举
Object.defineProperty(Ryoko.prototype, 'request', {
    enumerable: true,
});
ryokoMethods.forEach((method, i) => {
    Reflect.set(Ryoko.prototype, method, function (url, config) {
        const endConfig = override({}, config, { method, url, });
        return (typeof this === 'function'
            ? this(endConfig)
            : this.request.call(this, endConfig));
    });
});
