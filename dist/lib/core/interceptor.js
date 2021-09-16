/**
 * 拦截器 the interceptor of request method
 */
export default class Interceptor {
    constructor() {
        this.init();
    }
    init() {
        this.callbacks = [];
    }
    use(onsuccess, onfailure) {
        const length = this.callbacks.push({
            success: onsuccess,
            failure: onfailure
        });
        return length - 1;
    }
    eject(serie) {
        if (this.callbacks[serie]) {
            this.callbacks[serie] = void 0;
        }
    }
    traverse(fn) {
        this.callbacks.forEach(item => item != void 0 && fn(item));
    }
}
