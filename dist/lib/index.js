import Ryoko from './core/ryoko';
import AbortTokenizer from './abort/abortToken';
import { extend } from './shared/utils';
/**
 * 创建Ryoko实例
 * @param insConfig 实例初始化配置
 * @returns 返回Ryoko请求实例
 */
function createInstance(insConfig = {}) {
    const ctx = new Ryoko(insConfig);
    const ins = ctx.request.bind(ctx);
    extend(ins, ctx);
    extend(ins, Object.getPrototypeOf(ctx));
    return ins;
}
;
const ryoko = createInstance();
ryoko.Ryoko = Ryoko;
ryoko.AbortTokenizer = AbortTokenizer;
ryoko.create = (insConfig) => createInstance(insConfig);
ryoko.all = (promises) => Promise.all(promises);
ryoko.spread = (callback) => (promisesArr) => callback.apply(null, promisesArr);
export { abortAllRequest, abortOneRequest, abortPendingRequest, } from './abort/abortToken';
export * from './types';
export default ryoko;
