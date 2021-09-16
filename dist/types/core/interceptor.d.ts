import { InterceptorItem, InterceptorCtor } from '../types';
/**
 * 拦截器 the interceptor of request method
 */
export default class Interceptor<T> implements InterceptorCtor<T> {
    callbacks: Array<InterceptorItem<T> | undefined>;
    constructor();
    init(): void;
    use(onsuccess: (config: T) => any, onfailure: (config: T) => any): number;
    eject(serie: number): void;
    traverse(fn: (item: InterceptorItem<T>) => void): void;
}
