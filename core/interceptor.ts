import { 
    DemandeConfig, 
    InterceptorItem,
    InterceptorFn,
} from '../index'

export declare interface InterceptorCtor<T> {
    callbacks: Array<InterceptorItem<T> | undefined>;
    use(
        onsuccess?: InterceptorFn<T>,
        onfailure?: InterceptorFn<T>
    ): number;
    eject(serie: number): void;
    traverse(fn: Function): void;
}

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
        this.callbacks.push({
            success: onsuccess,
            failure: onfailure
        });
        return this.callbacks.length - 1;
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
        this.callbacks.forEach(item => item != null && fn(item));
    }

}
 