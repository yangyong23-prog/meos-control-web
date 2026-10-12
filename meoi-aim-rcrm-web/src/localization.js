import { createI18n } from 'vue-i18n';
import zhLocale from '@/locales/langs/zh.json'; // 中文简体
import enLocale from '@/locales/langs/en.json'; // 英文
const getUrlParams = url => {
    const params = {};
    if (!url) {
        return params;
    }
    let start = url.indexOf('?');
    if (start < 0) {
        return params;
    }
    const paramStr = url.substring(start + 1) || '';
    const paramsObj = paramStr.split('&') || [];
    paramsObj.forEach(item => {
        let [key, value] = item.split('=');
        if (!!key && !!value) {
            params[key] = decodeURIComponent(value);
        }
    });
    return params;
};
const messages = {
    en: {
        ...enLocale
    },
    zh: {
        ...zhLocale
    }
};

export const LANG_LOCALE_KEY = 'x-frame-language';
export const DEFAULT_LANG = 'zh';

export const getLocaleLang = initLang => {
    const localLang = localStorage.getItem(LANG_LOCALE_KEY);
    return localLang || initLang;
};

export function getLanguage() {
    // 如果有默认语言则选择默认语言
    let chooseLanguage = getLocaleLang(DEFAULT_LANG);
    const lang = chooseLanguage;
    // 当下语言由于枚举配置问题，导致无法异步设置语言，只能通过localStorage存储
    document.documentElement.setAttribute('lang', lang);
    return lang;
}

const i18n = createI18n({
    locale: getLanguage(),
    messages
});

export default i18n;
