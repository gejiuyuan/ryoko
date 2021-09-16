import { warn } from '../helpers/warn';
import { isSupportAbortController } from '../shared/utils';
/**
 * ryoko取消控制器
 */
export default class RyokoAbortController {
    constructor() {
        /**
         * 是否支持AbortController
         */
        this.isAllow = false;
        /**
         * 是否已终止该请求
         */
        this.aborted = false;
        /**
         * 是否是超时才终止请求的
         */
        this.isDefer = false;
        this.init();
    }
    init() {
        isSupportAbortController && (this.isAllow = true);
        this.initAborber();
    }
    /**
     * 延时终止请求
     * @param timeout 延时
     * @param cb 延时回调
     * @returns void
     */
    deferAbort(timeout, cb) {
        timeout = +timeout;
        if (timeout === 0) {
            return;
        }
        if (Number.isNaN(timeout) || timeout < 0) {
            warn(`the type of parameter 'timeout' is invalid!`, 'TypeError');
        }
        this.abortTimer = setTimeout(() => {
            const abortMsg = `The request duration exceeded the maximum limit of ${timeout} 
                    milliseconds and has been interrupted`;
            this.setAbortMsg(abortMsg);
            this.isDefer = true;
            this.abortFetch();
            cb && cb(abortMsg);
        }, timeout);
    }
    /**
     * 初始化终止控制器
     */
    initAborber() {
        const controller = new AbortController();
        const { signal } = controller;
        this.controller = controller;
        this.singal = signal;
    }
    /**
     * 设置终止提示信息
     * @param abortMsg 终止信息
     */
    setAbortMsg(abortMsg) {
        this.abortMsg = abortMsg;
    }
    /**
     * 手动终止请求
     */
    abortFetch() {
        const { controller, isAllow } = this;
        isAllow && !this.aborted && controller.abort();
    }
    /**
     * 监听请求终止状态
     *
     */
    abortState() {
        const { isAllow, singal } = this;
        return new Promise((resolve, reject) => {
            if (isAllow && singal) {
                singal.onabort = (ev) => {
                    this.aborted = true;
                    resolve(this.abortMsg);
                };
            }
            ;
        });
    }
    /**
     * 清除延迟终止定时器
     */
    restoreAbortTimer() {
        const serial = clearTimeout(this.abortTimer);
        this.abortTimer = null;
        return serial;
    }
}
