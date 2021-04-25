
import {
    TokenStoreKey,
    TokenStoreSpace
} from 'types';

const defaultAbortMsg = 'The user aborted a request'

export default class AbortTokenizer {

    static abortName = 'ryokoToken';

    static tokenStore = new Map<TokenStoreKey, TokenStoreSpace>();

    static create() {
        const { tokenStore, abortName } = AbortTokenizer;
        const symbolKey = Symbol(abortName + tokenStore.size);
        const _tokenSet: TokenStoreSpace = new Set()
        tokenStore.set(symbolKey, _tokenSet);
        return {
            stop(msg: any = defaultAbortMsg) {
                for (let abortCb of _tokenSet) {
                    abortCb(msg);
                }
                queueMicrotask(() => {
                    _tokenSet.clear();
                    tokenStore.delete(symbolKey);
                })
            },
            token: symbolKey
        }
    }
}