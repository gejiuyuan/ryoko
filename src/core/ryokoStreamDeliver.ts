import {
    RyokoResponse,
    DownloadSchedulerFn,
    RyokoInstance,
    RyokoClass,
} from 'types';

import {
    _globalThis,
    CONTENT_LENGTH
} from '../helpers/constant';

export const ryokoStreamDeliver = function (
    this: RyokoClass,
    fetchRes: Response,
    cb?: DownloadSchedulerFn
) {
    const { body, status, statusText, headers } = fetchRes;
    const resBody = body as ReadableStream<Uint8Array>;

    let returnStream: ReadableStream<Uint8Array>,
        progressStream: ReadableStream<Uint8Array>;

    if (cb !== void 0) {

        const dataLength = Number(headers.get(CONTENT_LENGTH)) || 0
        let dataReceivedLength = 0;

        const prgsReaderFn = (
            controller?: ReadableStreamController<any>
        ) => {

            progressStream
                .getReader()
                .read()
                .then(({ value, done }) => {
                    if (done) {
                        controller && controller.close();
                        return
                    }
                    dataReceivedLength += value?.length || 0;
                    const percent = dataLength === 0 ? 0 : dataReceivedLength / dataLength;
                    const progressData = {
                        total: dataLength,
                        received: dataReceivedLength,
                        percent,
                        buffer: value,
                    }
                    cb.call(this, progressData);
                    controller && controller.enqueue(value);
                    prgsReaderFn();
                });

        }

        try {

            const teedStreams = resBody.tee();
            [returnStream, progressStream] = teedStreams;
            prgsReaderFn();

        } catch (err) {

            progressStream = resBody;
            returnStream = new _globalThis.ReadableStream({
                start(controller) {
                    prgsReaderFn(controller)
                }
            })
            
        }

    } else {
        returnStream = resBody;
    }

    return new Response(returnStream, {
        status, statusText, headers
    })

}