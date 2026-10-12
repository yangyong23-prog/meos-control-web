import { createI18n } from 'vue-i18n';
import zhLocale from '@/locales/langs/zh.json'; // 中文简体
import enLocale from '@/locales/langs/en.json'; // 英文
import { qiankunWindow } from 'vite-plugin-qiankun-persagy/dist/helper';
// 注意：localization.js 不使用 storageUtils，避免循环依赖
// storageUtils -> baseStore -> localization
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
    // 直接使用 localStorage，避免循环依赖
    const localLang = localStorage.getItem(LANG_LOCALE_KEY);
    return localLang || initLang;
};

const initShareLanguage = () => {
    const isQianKun = qiankunWindow.__POWERED_BY_QIANKUN__;
    const host = isQianKun ? qiankunWindow : window;

    let { language } = getUrlParams(host.location.href);
    if (import.meta.env.VITE_DEV_MODE && language) {
        // 直接使用 localStorage，避免循环依赖
        localStorage.setItem(LANG_LOCALE_KEY, language);
    }
};

export function getLanguage() {
    // 如果有默认语言则选择默认语言
    let chooseLanguage = getLocaleLang(DEFAULT_LANG);
    const lang = chooseLanguage;
    // 当下语言由于枚举配置问题，导致无法异步设置语言，只能通过localStorage存储
    document.documentElement.setAttribute('lang', lang);
    return lang;
}

initShareLanguage();

const i18n = createI18n({
    locale: getLanguage(),
    messages
});

export const isCurrentCn = () => {
    return getLanguage() === SupportLanguage.zh;
};

export const SupportLanguage = {
    zh: 'zh',
    en: 'en'
};

export default i18n;
