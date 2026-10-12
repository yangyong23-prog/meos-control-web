// @ts-ignore
import { getLocaleLang, DEFAULT_LANG } from '@/localization';
import { $Message } from 'meri-plus';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isEmpty } from 'yushu-js-utils';

// import { portPrefix } from '@/config';
/**
 * ajax请求数据封装
 * @param obj - options
 * @contentType - 请求头
 * @method - 请求方法 ['GET', 'POST']
 * @url - 地址
 * @params - 数据
 * @token - token验证
 *
 * 例：
 * Xsync({
        method: 'GET',
        url: './lib/test.json',
        params: {id: 123},
        token: 'token-token'
    }).then(res => {
        console.log('then:', res);
    }).catch(err => {
        console.log('catch:', err);
    });
 */
/**
 * 格式化url参数
 * @param url
 * @param params
 * @returns {string|*}
 */
const formatUrl = (url, params) => {
    if (isEmpty(params)) return url;
    let param = '?';
    const keys = Object.keys(params);
    const lastIndex = keys.length - 1;
    keys.forEach((key, i) => {
        param += `${key}=${encodeURIComponent(params[key])}${lastIndex === i ? '' : '&'}`;
    });
    return `${url}${param}`;
};

async function Fetch({ method = 'GET', url = '', contentType = 'application/json', params = {}, modelType = '', token = '', signal }) {
    const headers = {
        'Content-Type': contentType,
        'accept-language': getLocaleLang(DEFAULT_LANG)
    };
    if (token) {
        headers.token = token;
    } else {
        const t = window.WebStore.token;
        if (t) headers.token = t;
    }
    if (modelType) {
        headers.modelType = modelType;
    }
    const { list } = params;
    // 对header需要的参数做统一处理
    if (window.WebStore) {
        const { groupCode, projectId } = window.WebStore;
        headers['project-id'] = projectId;
        headers.projectId = projectId;
        headers['group-code'] = groupCode;
        headers.groupCode = groupCode;
    }

    try {
        const init = {
            method,
            headers,
            signal
        };
        let reqUrl = url,
            data;
        if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
            init.body = list?.length ? JSON.stringify(list) : JSON.stringify(params);
        } else {
            reqUrl = formatUrl(url, params);
        }
        const response = await window.fetch(reqUrl, init);
        const { status } = response;
        try {
            data = await response.json();
        } catch (e) {
            if (status === 200) data = {};
            else data = e;
        }
        return { status, data };
    } catch (e) {
        if (e?.name === 'AbortError') {
            throw e;
        }
        console.error('request failed!', e);
        return { message: 'request failed!' };
    }
}

let MESSAGE = null;
export default async options => {
    const result = await Fetch(options);
    // console.log('result==', result);
    const { status, data } = result;
    return new Promise((resolve, reject) => {
        // 未登陆 / 登陆凭证过期
        if (status === 401 || status === 403) {
            // token失效
        } else if (status === 200) {
            resolve(data);
        } else {
            reject(data);
            if (MESSAGE && !MESSAGE._isDestroyed) MESSAGE.changeMessage(MESSAGE, data?.message || status);
            else MESSAGE = $Message.error(data?.message || status);
        }
    });
};
