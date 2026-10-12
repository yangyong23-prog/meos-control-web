// 只补齐静态默认值，{objId}、{pj} 等动态占位符由业务参数及主应用处理。
export const getDestinationDefaultParams = page =>
    Object.fromEntries(Object.entries(page.paramsTemplate || {}).filter(([, value]) => typeof value !== 'string' || !/\{[^{}]+\}/.test(value)));

const getDestinationPath = url => {
    if (!url) return '';
    const { pathname } = new URL(url.replace(/^\{\{[^{}]+\}\}/, ''), 'https://destination.local');
    // 去掉宿主框架前缀和服务名称，只比较服务内的完整页面路径。
    return pathname
        .replace(/^\/(?:mid-frame-web|meos-frame-web)\//, '/')
        .replace(/^\/[^/]+(?:\/|$)/, '/')
        .replace(/\/$/, '');
};

// 目的页 ID 只从注册表读取，调用方提供原跳转 URL 与业务参数。
export const findDestinationPage = (pages, url, params = {}) => {
    const path = getDestinationPath(url);
    if (!path) return undefined;
    const matches = pages.filter(page => getDestinationPath(page.url) === path);
    console.log('findDestinationPage', { path, matches, params });
    if (matches.length === 1) return matches[0];
    // 多个目的页可共用一个路由，用 type 等静态参数区分，歧义时不擅自选第一项。
    const exactMatches = matches.filter(page => {
        const defaults = Object.entries(getDestinationDefaultParams(page));
        return defaults.length > 0 && defaults.every(([key, value]) => String(params[key]) === String(value));
    });
    return exactMatches.length === 1 ? exactMatches[0] : undefined;
};
