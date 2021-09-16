import { DownloadSchedulerFn, RyokoClass } from '../types';
export declare const ryokoStreamDeliver: (this: RyokoClass, fetchRes: Response, cb?: DownloadSchedulerFn | undefined) => Response;
