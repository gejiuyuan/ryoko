import { _globalThis, CONTENT_LENGTH } from '../helpers/constant';
export const ryokoStreamDeliver = function (fetchRes, cb) {
    const { body, status, statusText, headers } = fetchRes;
    const resBody = body;
    let returnStream, progressStream;
    if (cb !== void 0) {
        let dataReceivedLength = 0;
        const dataLength = Number(headers.get(CONTENT_LENGTH)) || 0;
        let progressStreamReader;
        const prgsReaderFn = (controller) => {
            progressStreamReader
                .read()
                .then(({ value, done }) => {
                if (done) {
                    controller && controller.close();
                    return;
                }
                dataReceivedLength += (value === null || value === void 0 ? void 0 : value.length) || 0;
                const percent = dataLength === 0 ? 0 : dataReceivedLength / dataLength;
                const progressData = {
                    total: dataLength,
                    received: dataReceivedLength,
                    percent,
                    buffer: value,
                };
                cb.call(this, progressData);
                controller && controller.enqueue(value);
                prgsReaderFn();
            });
        };
        try {
            const teedStreams = resBody.tee();
            [returnStream, progressStream] = teedStreams;
            progressStreamReader = progressStream.getReader();
            prgsReaderFn();
        }
        catch (err) {
            progressStream = resBody;
            progressStreamReader = progressStream.getReader();
            returnStream = new _globalThis.ReadableStream({
                start(controller) {
                    prgsReaderFn(controller);
                }
            });
        }
    }
    else {
        returnStream = resBody;
    }
    return new Response(returnStream, {
        status, statusText, headers
    });
};
