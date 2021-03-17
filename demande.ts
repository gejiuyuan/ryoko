
import {
    extend,
    filterUselessKey,
} from './shared/utils'

import { 
    DemandeConfig, 
    DemandeMethod, 
    DemandeInstance, 
} from './index';

import Demande from './core/demande'
  
function createInstance(
    insConfig: DemandeConfig = {
        url: ''
    }
) {
    const ctx = new Demande(insConfig);
    const ins = ctx.request.bind(ctx); 
    Object.assign(ins, ctx); 
    return ins as DemandeInstance;
};


const demande = createInstance() as DemandeMethod;
demande.Demande = Demande;
demande.create = (insConfig: DemandeConfig) => createInstance(insConfig);
demande.all = (promises) => Promise.all(promises);
demande.spread = (callback) => (promisesArr) => callback.apply(null, promisesArr);


export default demande;