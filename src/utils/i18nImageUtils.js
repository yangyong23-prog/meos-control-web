import { getLocaleLang, DEFAULT_LANG } from '@/localization';

const getImageUrl = (imageName, lang = getLocaleLang(DEFAULT_LANG)) => {
    return new URL(`../assets/locales/${lang}/${imageName}`, import.meta.url).href;
};

export { getImageUrl };
