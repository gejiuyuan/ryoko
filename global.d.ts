
interface Error {
    description: string;
    number: number;
    fileName: string;
    lineNumber: number;
    columnNumber: number;
}

interface IteratorObj<T> {

    [Symbol.iterator](): IterableIterator<T>;

    entries(): IterableIterator<[string, T]>;

    keys(): IterableIterator<string>;

    values(): IterableIterator<T>;
}

interface Headers extends IteratorObj<any> {

}

interface URLSearchParams extends IteratorObj<any> {

}

interface WebURL {
    hash: string;
    host: string;
    hostname: string;
    href: string;
    origin: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
}

declare module 'form-data' {
    const FormData: any;
    export default FormData
}

declare module 'readable-stream' {
    const Readable:NodeJS.ReadableStream;
    export {
        Readable,
    }
}