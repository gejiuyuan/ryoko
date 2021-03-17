import {
    DemandeResponse,
    DownloadProgressFn
} from '../index';

export const CONTENT_LENGTH = 'content-length';

export const downloadProgress = (
    fetchRes: Response,
    progressStream: ReadableStream<Uint8Array>,
    cb?: DownloadProgressFn
) => {
    if (typeof cb !== 'function') {
        return
    }
    const { headers: resHeader } = fetchRes;
    const dataLength = resHeader.get(CONTENT_LENGTH)
    let dataReceivedLength = 0;
    const streamReader = progressStream.getReader();
    const prgsReaderFn = () => {
        streamReader.read().then(({ value, done }) => {
            if (done) {
                return
            }
            dataReceivedLength += value?.length || 0;
            const progressData = {
                total: dataLength,
                received: dataReceivedLength,
            }
            cb(progressData);
            prgsReaderFn();
        });
    }
    prgsReaderFn();
}