 
import fetch, { Headers, Response, Request, } from 'node-fetch'
import AbortController from 'abort-controller';
import FormData from 'form-data';
 
jest.setTimeout(60000);

;[
    fetch,
    Headers,
    Response,
    Request,
    AbortController,
    FormData, 
].forEach(_ => {
    Reflect.set(globalThis, _.name, _);
});

import ryoko from '../src'

const anfrage = ryoko.create({
    // timeout: 10000,.then(res=>res.data)
    // onDefer() {
    //     console.info(this)
    // },
    // downloadScheduler({ percent, total, received, buffer }) {
        // console.info(percent, received, total , buffer )
    // },
    fetch: globalThis.fetch,
})

import { describe, expect, test } from '@jest/globals'

test('ryoko get', async () => {

    // expect(
    //     await anfrage({
    //         url: 'https://api.github.com/',
    //         mode: 'no-cors',
    //     }).then(res=>res.data)
    // ).toEqual('')

    expect(
        (function() {
            return ''
        })()
    ).toEqual('')

})