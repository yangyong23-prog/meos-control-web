/**
 * opt/standards-transition：前端开关，全部默认关闭。
 *
 * 只从主框架下发的 window.meosEnv（或 qiankun 代理 window.proxy.meosEnv）读取，
 * 不读 apmCommonEnv，避免框架镜像里的云端默认值把开关意外打开。
 * 值支持 true / 'true'，其余一律视为关闭。
 *
 * 边缘盒子上在主框架运行时配置（microservice.env.js / apm.env.js 的 window.meosEnv）里加：
 *   OPT_STRICT_EDGE_PREFIX: true   // W1 关键前缀只认 meosEnv，未配置时拦截，不回落云端网关（AI_AUTORUN 静默禁用）
 *   OPT_STANDARDS_READONLY: true   // W2 已切新运行标准的项目，配置页只读
 *   OPT_STANDARDS_DISPLAY: true    // W3 监测页的标准值改经我方后端（转 dtp-meos）读取
 *   OPT_AI_BUBBLE_CACHE: true      // W3 AI 平面图气泡结果缓存，去掉每次 hover 的重复外查
 *   OPT_NO_CLOUD_FALLBACK: true    // 所有 meosEnv/apmCommonEnv 前缀都只认 meosEnv，未配置时拦截，不回落云端（W1 的全量版）
 */
export const OPT_SWITCH = Object.freeze({
    STRICT_EDGE_PREFIX: 'OPT_STRICT_EDGE_PREFIX',
    STANDARDS_READONLY: 'OPT_STANDARDS_READONLY',
    STANDARDS_DISPLAY: 'OPT_STANDARDS_DISPLAY',
    AI_BUBBLE_CACHE: 'OPT_AI_BUBBLE_CACHE',
    NO_CLOUD_FALLBACK: 'OPT_NO_CLOUD_FALLBACK'
});

const readMeosEnv = key => {
    if (typeof window === 'undefined') return undefined;
    const proxyValue = window.proxy?.meosEnv?.[key];
    return proxyValue !== undefined ? proxyValue : window.meosEnv?.[key];
};

export const optOn = key => {
    const value = readMeosEnv(key);
    if (value === true) return true;
    return typeof value === 'string' && value.trim().toLowerCase() === 'true';
};
