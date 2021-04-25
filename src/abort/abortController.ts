
import { warn } from '@/helpers/warn';
import { _globalThis } from '../helpers/constant';
import RyokoError from '../helpers/ryokoError'
import { is, isSupportAbortController } from '../shared/utils';


/**
 * ryoko取消控制器
 */

export default class RyokoAbortController {

    public abortTimer!: ReturnType<typeof setTimeout>;

    private isAllow: boolean = false;

    public singal!: AbortSignal;

    public controller!: AbortController;

    public abortMsg!: any;

    constructor() {
        this.init()
    }

    private init() {
        isSupportAbortController && (this.isAllow = true);
        this.initAborber()
    }

    public deferAbort(
        timeout: number,
        cb: (msg?: any) => void
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
        this.abortTimer = setTimeout(() => {
            const abortMsg =
                `The request duration exceeded the maximum limit of ${timeout} 
                    milliseconds and has been interrupted`
            this.setAbortMsg(abortMsg);
            this.abortFetch();
            cb(abortMsg);
        }, timeout)
    }

    private initAborber() {
        const controller = new AbortController()
        const { signal } = controller
        this.controller = controller
        this.singal = signal
    }

    public setAbortMsg(abortMsg: any) {
        this.abortMsg = abortMsg;
    }

    public abortFetch() {
        const { controller, isAllow, singal } = this;
        isAllow && !singal.aborted && controller.abort();
    }

    public abortState(): Promise<any> {
        const { isAllow, singal } = this;
        return new Promise((resolve, reject) => {
            if (isAllow && singal) {
                singal.onabort = (ev: Event) => {
                    resolve(this.abortMsg);
                }
            };
        });
    }

    public restoreAbortTimer() {
        const serial = clearTimeout(this.abortTimer)
        this.abortTimer = null!;
        return serial
    }

}

