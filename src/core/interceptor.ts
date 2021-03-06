import {
    RyokoConfig,
    InterceptorItem,
    InterceptorFn,
    InterceptorCtor,
} from '../types'

/**
 * 拦截器 the interceptor of request method
 */

export default class Interceptor<T> implements InterceptorCtor<T> {

    public callbacks!: Array<InterceptorItem<T> | undefined>;

    constructor() {
        this.init();
    }

    init() {
        this.callbacks = [];
    }

    public use(
        onsuccess: (config: T) => any,
        onfailure: (config: T) => any
    ): number {
        const length = this.callbacks.push({
            success: onsuccess,
            failure: onfailure
        });
        return length - 1;
    }

    public eject(
        serie: number
    ): void {
        if (this.callbacks[serie]) {
            this.callbacks[serie] = void 0;
        }
    }

    public traverse(
        fn: (item: InterceptorItem<T>) => void
    ): void {
        this.callbacks.forEach(item => item != void 0 && fn(item));
    }

}
