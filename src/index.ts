
import {
    RyokoConfig,
    RyokoNativeFn,
    RyokoInstance,
} from 'types';

import Ryoko from './core/ryoko'
import AbortTokenizer from './abort/abortToken';
import { extend } from './shared/utils';

function createInstance(
    insConfig: RyokoConfig = {}
) {
    const ctx = new Ryoko(insConfig);
    const ins = ctx.request.bind(ctx);
    extend(ins, ctx);
    extend(ins, Object.getPrototypeOf(ctx))
    return ins as RyokoInstance
};

const ryoko = createInstance() as RyokoNativeFn;

ryoko.Ryoko = Ryoko;
ryoko.AbortTokenizer = AbortTokenizer;
ryoko.create = (insConfig: RyokoConfig) => createInstance(insConfig);
ryoko.all = (promises) => Promise.all(promises);
ryoko.spread = (callback) => (promisesArr) => callback.apply(null, promisesArr);

export default ryoko;