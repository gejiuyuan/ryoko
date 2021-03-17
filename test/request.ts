import demande from '../demande';

export const anfrage = demande.create({
    // baseURL: 'https://music.qier222.com/api',
    baseURL: 'http://localhost:3000',
    mode: 'cors',
    credentials: 'include',
    timeout: 15000,
    onDownloadProgress({
        total,
        received
    }) {

    }
});

export const getAll = demande.all;
export const getSpread = demande.spread;

export const get = demande.create({
    mode: 'cors',
    timeout: 5000,
    validateStatus(status) {
        return status >= 200 && status < 400
    },
    onAbort() {
        console.info(this)
    }
});

get.interceptors.request.use((config) => {
    return config;
});
get.interceptors.response.use((res) => {
    return res;
});

export const getPlaylist = (url: string): Promise<any> => get({ url }).then(res => {
    return res.data.json()
});
export const getLyric = (url: string): Promise<any> => get({ url }).then(res => res.data.text());
export const getPlaybill = (url: string): Promise<any> => get({ url }).then(res => res.data.url);

