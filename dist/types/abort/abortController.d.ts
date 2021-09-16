/**
 * ryoko取消控制器
 */
export default class RyokoAbortController {
    /**
     * 延时终止定时器
     */
    abortTimer: ReturnType<typeof setTimeout>;
    /**
     * 是否支持AbortController
     */
    private isAllow;
    /**
     * fetch的singal选项
     */
    singal: AbortSignal;
    /**
     * AbortController终止器实例
     */
    controller: AbortController;
    /**
     * 终止提示信息
     */
    abortMsg: any;
    /**
     * 是否已终止该请求
     */
    aborted: boolean;
    /**
     * 是否是超时才终止请求的
     */
    isDefer: boolean;
    constructor();
    private init;
    /**
     * 延时终止请求
     * @param timeout 延时
     * @param cb 延时回调
     * @returns void
     */
    deferAbort(timeout: number, cb?: (msg?: any) => void): void;
    /**
     * 初始化终止控制器
     */
    private initAborber;
    /**
     * 设置终止提示信息
     * @param abortMsg 终止信息
     */
    setAbortMsg(abortMsg: any): void;
    /**
     * 手动终止请求
     */
    abortFetch(): void;
    /**
     * 监听请求终止状态
     *
     */
    abortState(): Promise<any>;
    /**
     * 清除延迟终止定时器
     */
    restoreAbortTimer(): void;
}
