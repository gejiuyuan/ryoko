
export default class DemandeAbortController {

    private abortTimer!: NodeJS.Timeout

    private isAllow: boolean = false

    public singal!: AbortSignal

    constructor(
        public timeout: number = 0,
    ) {
        this.timeout = timeout
        this.init()
    }

    private init() {
        const { timeout } = this
        if (
            typeof timeout !== 'number' 
            && timeout < 0 && 
            timeout !== void 0
        ) {
            // throw new TypeError(`the type of parameter 'timeout' is invalid!`)
            console.warn(`the type of parameter 'timeout' is invalid!`);
            return
        }
        this.isAllow = true;
        this.initAborber()
    }

    private initAborber() {
        const { timeout } = this
        const controller = new AbortController()
        const { signal } = controller
        this.singal = signal
        this.abortTimer = setTimeout(controller.abort.bind(controller), timeout)
    }

    public abortState(): Promise<RangeError> {
        const { isAllow, singal, timeout } = this;
        return new Promise((resolve, reject) => {
            if (isAllow && singal) {
                singal.onabort = (ev: Event) => {
                    resolve(
                        new RangeError(
                            `The request duration exceeded the maximum limit of ${timeout} 
                            milliseconds and has been interrupted`
                        )
                    )
                }
            };
        });
    }

    public restoreAbortTimer() {
        return clearTimeout(this.abortTimer)
    }

}

