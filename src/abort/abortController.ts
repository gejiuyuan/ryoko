
import { warn } from '@/helpers/warn';
import { _globalThis } from '../helpers/constant';
import RyokoError from '../helpers/ryokoError'
import { is, isSupportAbortController } from '../shared/utils';

 
/**
 * ryoko取消控制器
 */

export default class RyokoAbortController {

    /**
     * 延时终止定时器
     */
    public abortTimer!: ReturnType<typeof setTimeout>;

    /**
     * 是否支持AbortController
     */
    private isAllow: boolean = false;

    /**
     * fetch的singal选项
     */
    public singal!: AbortSignal;

    /**
     * AbortController终止器实例
     */
    public controller!: AbortController;

    /**
     * 终止提示信息
     */
    public abortMsg!: any;

    /**
     * 是否已终止该请求
     */
    public aborted: boolean = false;

    /**
     * 是否是超时才终止请求的
     */
    public isDefer:boolean = false;

    constructor() {
        this.init()
    }

    private init() {
        isSupportAbortController && (this.isAllow = true);
        this.initAborber()
    }

    /**
     * 延时终止请求
     * @param timeout 延时
     * @param cb 延时回调
     * @returns void
     */
    public deferAbort(
        timeout: number,
        cb?: (msg?: any) => void
    ) {
        timeout = +timeout;
        if (timeout === 0) {
            return;
        }
        if (Number.isNaN(timeout) || timeout < 0) {
            warn(
                `the type of parameter 'timeout' is invalid!`,
                'TypeError'
            )
        }
        this.abortTimer = setTimeout(
            () => {
                const abortMsg = `The request duration exceeded the maximum limit of ${timeout} 
                    milliseconds and has been interrupted`;
                this.setAbortMsg(abortMsg);
                this.isDefer = true;
                this.abortFetch();
                cb && cb(abortMsg);
            },
            timeout
        )
    }

    /**
     * 初始化终止控制器
     */
    private initAborber() {
        const controller = new AbortController()
        const { signal } = controller
        this.controller = controller
        this.singal = signal
    }

    /**
     * 设置终止提示信息
     * @param abortMsg 终止信息
     */
    public setAbortMsg(abortMsg: any) {
        this.abortMsg = abortMsg;
    }

    /**
     * 手动终止请求
     */
    public abortFetch() {
        const { controller, isAllow, singal } = this;
        isAllow && !this.aborted && controller.abort();
    }

    /**
     * 监听请求终止状态
     * 
     */
    public abortState(): Promise<any> {
        const { isAllow, singal } = this;
        return new Promise((resolve, reject) => {
            if (isAllow && singal) {
                singal.onabort = (ev: Event) => {
                    this.aborted = true;
                    resolve(this.abortMsg);
                }
            };
        });
    }

    /**
     * 清除延迟终止定时器
     */
    public restoreAbortTimer() {
        const serial = clearTimeout(this.abortTimer)
        this.abortTimer = null!;
        return serial
    }

}

