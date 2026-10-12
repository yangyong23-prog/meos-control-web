import { $Message } from 'meri-plus';
// import cookies from 'cookies-js';
import { getToken } from '@/utils/auth';
import { useMainStore } from '@/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isEmpty } from 'yushu-js-utils';
import { emptyValue } from './index';
import { getLocaleLang, DEFAULT_LANG } from '@/localization';

// import { portPrefix } from '@/config';
/**
 * 打开加载指示器。
 * 此函数用于启用一个加载指示器，该指示器通常与一个按钮或链接关联，当用户触发该按钮或链接时，指示器显示加载状态。
 * @param {string} loadingBtnId 加载按钮的ID。如果提供此参数，将使用此ID查找元素。
 */
function openLoading(loadingBtnId) {
    try {
        // 根据提供的loadingBtnId或URL的最后一个部分查找元素
        // 通过查询选择器获取文档中的特定元素
        // 如果loadingBtnId存在，则使用其作为查询条件；否则，从URL中获取最后一个部分作为查询条件
        // 根据URL的最后一个部分查找文档中的元素
        const e = document.querySelector(`#${loadingBtnId}`);

        if (e) {
            // 获取元素的宽度
            const { clientWidth } = e;

            // 添加类以显示加载动画
            e.classList.add('iconfont');
            e.classList.add('icon-jiazai');
            e.classList.add('auto-loading');

            // 设置元素的最小宽度为其实际宽度，确保加载动画有足够的空间显示
            e.style.minWidth = clientWidth + 'px';

            // 禁用元素，防止在加载过程中用户进行进一步操作
            e.disabled = true;
        }
    } catch (error) {
        // 捕获并记录任何在查找或操作元素过程中发生的错误
        console.log(error);
    }
}

/**
 * 停止加载动画并恢复按钮功能。
 * 该函数旨在找到一个特定的按钮元素，根据传入的loadingBtnId或url参数，
 * 并取消该按钮的加载状态，使其恢复可交互状态。
 *
 * @param {string} loadingBtnId - 按钮的ID，用于定位按钮元素。
 */
const closeLoading = loadingBtnId => {
    try {
        // 根据loadingBtnId或url的末尾部分查找按钮元素
        const button = document.querySelector(`#${loadingBtnId}`);
        if (button) {
            // 恢复按钮的可用状态，移除加载相关的类名
            button.disabled = false;
            button.classList.remove('iconfont');
            button.classList.remove('icon-jiazai');
            button.classList.remove('auto-loading');
        }
    } catch (error) {
        // 捕获并记录查询按钮过程中可能出现的错误
        console.log(error);
    }
};
/**
 * 重复请求存放
 */
const pendingRequest = new Map();

/**
 * @method generateReqKey 用于根据当前请求的信息，生成请求 Key；
 * @param config
 * @returns {string}
 */
function generateReqKey(url, method) {
    // const { method, url } = config;
    /**
     * 这里的接口只对比请求方式跟url,不对比参数
     */
    return [method, url].join('&');
}

/**
 * @method addPendingRequest：用于把当前请求信息添加到pendingRequest对象中；
 * @param config
 */

function addPendingRequest(url, config) {
    const requestKey = generateReqKey(url, config.method);
    const signalTpye = Object.prototype.toString.call(config.signal).match(/\[object (.*)\]/)[1];
    if (signalTpye !== 'AbortSignal') {
        const controller = new AbortController();
        config.signal = controller.signal;
        if (!pendingRequest.has(requestKey)) {
            pendingRequest.set(requestKey, controller);
        }
    }
}

/**
 * @method removePendingRequest：检查是否存在重复请求，若存在则取消已发的请求。
 * @param config
 */
function removePendingRequest(url, config) {
    const requestKey = generateReqKey(url, config.method);
    if (pendingRequest.has(requestKey)) {
        const controller = pendingRequest.get(requestKey);
        controller.abort();
        pendingRequest.delete(requestKey);
    }
}

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

async function Fetch({
    method = 'GET',
    url = '',
    contentType = 'application/json',
    params = {},
    token = '',
    signal = '',
    loadingBtnId = ''
}) {
    loadingBtnId && openLoading(loadingBtnId);
    const mainStore = useMainStore();
    const headers = {
        'Content-Type': contentType,
        'accept-language': getLocaleLang(DEFAULT_LANG)
    };
    if (token) {
        headers.token = token;
    } else {
        const t = getToken();
        if (t) headers.token = t;
    }
    const { list } = params;
    // 对header需要的参数做统一处理
    if (mainStore) {
        const { groupCode, projectId } = mainStore;
        headers['project-id'] = projectId;
        headers['group-code'] = groupCode;
    }

    try {
        const init = {
            method,
            headers
        };
        let reqUrl = url;
        if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
            init.body = list?.length ? JSON.stringify(list) : JSON.stringify(params);
        } else {
            reqUrl = formatUrl(url, params);
        }
        // abort标志
        if (!emptyValue(signal)) {
            init.signal = signal;
            // 检查是否存在重复请求，若存在则取消已发的请求
            removePendingRequest(url, init);
            // 把当前请求添加到pendingRequest对象中
            addPendingRequest(url, init);
        }
        const response = await window.fetch(reqUrl, init);
        const { status } = response;
        let data;
        try {
            data = await response.json();
        } catch (e) {
            if (status === 200) data = {};
            else data = e;
        }
        return { status, data };
    } catch (e) {
        console.log(e.message);
        if (e.message.includes('Failed to fetch') || navigator.onLine === false) {
            return { data: { message: '网络异常' } };
        }

        if (e.name === 'AbortError') {
            console.log('Fetch request aborted:', url);
            return;
        }

        return { data: { message: '服务器异常' } };
    }
}

export default async options => {
    const result = await Fetch(options);
    // console.log('result==', result);
    const { status, data } = result;
    options.loadingBtnId && closeLoading(options.loadingBtnId);
    return new Promise((resolve, reject) => {
        // 未登陆 / 登陆凭证过期
        if (status === 401 || status === 403) {
            // token失效
            const mainStore = useMainStore();
            mainStore.pastDueHandle?.();
        } else if (status === 200) {
            if (data?.result === 'fail') {
                reject(data);
                // 若是abort掉请求则不需要Message Tips
                $Message.error({
                    title: data?.message || '服务器异常',
                    showClose: true
                });
            } else {
                resolve(data);
            }
        } else {
            reject(data);
            // 若是abort掉请求则不需要Message Tips
            $Message.error({
                title: data?.message || '服务器异常',
                showClose: true
            });
        }
    });
};
