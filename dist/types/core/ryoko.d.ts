import { RyokoConfig, InterceptorCtor, RyokoMergedConfig, RyokoResponse, RyokoClassQuickFn } from '../types';
export default class Ryoko {
    get: RyokoClassQuickFn;
    post: RyokoClassQuickFn;
    options: RyokoClassQuickFn;
    put: RyokoClassQuickFn;
    delete: RyokoClassQuickFn;
    patch: RyokoClassQuickFn;
    head: RyokoClassQuickFn;
    link: RyokoClassQuickFn;
    unlink: RyokoClassQuickFn;
    purge: RyokoClassQuickFn;
    defaults: RyokoMergedConfig;
    interceptors: {
        request: InterceptorCtor<RyokoConfig>;
        response: InterceptorCtor<RyokoResponse>;
    };
    constructor(config: RyokoConfig);
    request(config: RyokoConfig): Promise<RyokoResponse>;
}
