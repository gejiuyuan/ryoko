var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ryokoStreamDeliver } from './ryokoStreamDeliver';
import { addAbortCallbacks } from '../abort/abortToken';
import { resolveRyokoUrl, resolveRyokoBody, resolveRyokoResponse, } from '../helpers/resolver';
import { fetchCodeOptionKeys, } from '../helpers/constant';
import RyokoError from '../helpers/ryokoError';
import { warn } from '../helpers/warn';
import RyokoAbortController from '../abort/abortController';
export default function dispatchFetch(config) {
    //如果未在拦截器中返回config配置，则抛出错误
    if (Object(config) !== config) {
        warn(`The request 'config' is invalid, is it returned in the request interceptor?`, 'RyokoError');
    }
    //请求前钩子
    config.beforeRequest.call(this, config);
    //创建一个终止请求控制器
    let abortCtrl = new RyokoAbortController();
    //根据abortToken添加对应的手动终止请求函数
    addAbortCallbacks(config.abortToken, function () {
        abortCtrl === null || abortCtrl === void 0 ? void 0 : abortCtrl.restoreAbortTimer();
        abortCtrl === null || abortCtrl === void 0 ? void 0 : abortCtrl.abortFetch();
    });
    let { prefixUrl, url, params, data, timeout, method, onDefer, verifyStatus, downloadScheduler, headers, fetch: ryokoFetch, } = config;
    //根据用户传入config，获取fetch的options
    const fetchConfig = {};
    const configKeys = Object.keys(config);
    fetchCodeOptionKeys.forEach(key => {
        if (configKeys.includes(key)) {
            fetchConfig[key] =
                config[key];
        }
    });
    //获取请求url
    const fetchUrl = resolveRyokoUrl(prefixUrl, url, params);
    //获取请求body
    const fetchBody = resolveRyokoBody(data);
    fetchBody && (fetchConfig.body = fetchBody);
    //存储abortber到该请求实例上 
    fetchConfig.signal = abortCtrl.singal;
    //添加超时终止请求处理
    abortCtrl.deferAbort(timeout);
    return new Promise((resolve, reject) => {
        //监听取消控制器的终止请求状态
        abortCtrl.abortState().then((abortMsg) => {
            //如果是超时终止的请求，则执行
            if (abortCtrl.isDefer) {
                onDefer && onDefer.call(this, config);
                reject(new RyokoError(abortMsg, { config: config }));
            }
        });
        ryokoFetch(fetchUrl, fetchConfig).then((res) => __awaiter(this, void 0, void 0, function* () {
            // 取消abort定时器
            abortCtrl.restoreAbortTimer();
            abortCtrl = null; //!作用是告知ts强制转null为RyokoAbortController类型
            const { body: resBody, status, } = res;
            //将响应数据以流的形式传送处理
            if (resBody != null && downloadScheduler) {
                res = ryokoStreamDeliver.call(this, res, downloadScheduler);
            }
            const RyokoRes = yield resolveRyokoResponse(res, config);
            // 验证status状态码
            const isSuccess = verifyStatus(status);
            if (isSuccess) {
                resolve(RyokoRes);
                //响应后钩子
                config.afterResponse.call(this, RyokoRes);
            }
            else {
                reject(new RyokoError(`The status of the Ryoko request response is ${status}`, { status, config }));
            }
        }), err => {
            if (abortCtrl.aborted)
                return;
            //如果不是超时和用户手动取消请求的就走这一步(如服务器错误、网络错误等)
            const status = err === null || err === void 0 ? void 0 : err.status;
            const errMsg = `The Ryoko Requestion miss an Error: ${err}`;
            reject(new RyokoError(errMsg, { status, config }));
        });
    });
}
