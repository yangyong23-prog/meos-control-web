/**
 * opt W1：边缘关键接口前缀只认主框架下发的 meosEnv。
 *
 * 原逻辑是 meosEnv 没配就回落 apmCommonEnv，而新主框架镜像里的 apmCommonEnv 是云端开发网关，
 * 结果是盒子上漏配的前缀会把请求悄悄发到云端。开关 OPT_STRICT_EDGE_PREFIX 打开后：
 * - 只读 window.proxy.meosEnv / window.meosEnv；
 * - 没配时返回一个占位前缀，http 拦截器识别后直接拒绝请求并提示，不会发到任何真实地址。
 * 开关关闭时行为与原来完全一致。
 *
 * 11-19 Blake 定：ai-autorun-agent-edge 不纳入新边缘盒子架构（原 W5 取消）。
 * INTERFACE_PREFIX_AI_AUTORUN 不再要求配置：开关打开后没配就静默禁用（不提示、不回落云端），
 * AI 页直调 agent 的 /strategy/* 请求在本地失败；页面和菜单随 W6 下线。
 */
import { optOn, OPT_SWITCH } from './optSwitch';

export const MISSING_PREFIX_MARK = '/__meosEnv_missing__/';

/** 开关打开时受约束的前缀 */
export const STRICT_PREFIX_KEYS = ['INTERFACE_PREFIX_MEOS_DTP', 'INTERFACE_PREFIX_AI_AUTORUN'];

/** 边缘不部署的服务：没配属于正常情况，静默禁用，不报错不提示 */
export const DISABLED_ON_EDGE_PREFIX_KEYS = [
    'INTERFACE_PREFIX_AI_AUTORUN',
    // 能耗分析类（energy-ddp 等）11-17 已从标准边缘架构去掉
    'INTERFACE_PREFIX_ENERGY_RESEARCH',
    'INTERFACE_PREFIX_ENERGY_QUALITY'
];

export const isDisabledOnEdgePrefix = key => DISABLED_ON_EDGE_PREFIX_KEYS.includes(key);

const missing = new Set();

export const getMissingStrictPrefixes = () => Array.from(missing);

/**
 * @param {string} key 前缀名
 * @param {() => string} legacyResolve 原来的解析方式（meosEnv → apmCommonEnv）
 */
export const resolveStrictPrefix = (key, legacyResolve) => {
    if (!optOn(OPT_SWITCH.STRICT_EDGE_PREFIX) || !STRICT_PREFIX_KEYS.includes(key)) {
        return legacyResolve();
    }
    const value = window.proxy?.meosEnv?.[key] || window.meosEnv?.[key];
    if (value) return value;
    missing.add(key);
    if (isDisabledOnEdgePrefix(key)) {
        console.info(`[opt] ${key} 对应服务不在边缘盒子架构内，相关请求已禁用（不回落云端网关）`);
    } else {
        console.error(`[opt] 主框架 meosEnv 未配置 ${key}，相关请求将被拦截（不回落云端网关）`);
    }
    return `${MISSING_PREFIX_MARK}${key}`;
};

/**
 * opt：OPT_NO_CLOUD_FALLBACK 打开时，所有 getInterfacePrefix('meosEnv', 'apmCommonEnv', key) 只读 meosEnv。
 *
 * 新主框架挂载的公共 apm.env.js 是云端配置（qa-gw.meos.net.cn 等），回落它等于把盒子页面的请求发到云端，
 * 违背“配置以云为准、盒子页面只用盒内服务”的原则（2026-11-22 Blake 同意）。打开后：
 * - meosEnv 配了就用；
 * - 没配时返回占位前缀，http 拦截器拒绝请求（DISABLED_ON_EDGE_PREFIX_KEYS 中的静默），不会发到任何云端地址。
 * 开关关闭时返回 null，调用方按原逻辑解析。
 *
 * @param {string} key 前缀名
 * @returns {string|null}
 */
export const resolveEdgeOnlyPrefix = key => {
    if (!optOn(OPT_SWITCH.NO_CLOUD_FALLBACK)) {
        return null;
    }
    const value = window.proxy?.meosEnv?.[key] || window.meosEnv?.[key];
    if (value) return value;
    if (!missing.has(key)) {
        missing.add(key);
        if (isDisabledOnEdgePrefix(key)) {
            console.info(`[opt] ${key} 对应服务不在边缘盒子架构内，相关请求已禁用（不回落云端）`);
        } else {
            console.error(`[opt] 主框架 meosEnv 未配置 ${key}，相关请求将被拦截（不回落云端）`);
        }
    }
    return `${MISSING_PREFIX_MARK}${key}`;
};

export const isMissingPrefixUrl = url => typeof url === 'string' && url.includes(MISSING_PREFIX_MARK);

export const missingPrefixKeyOf = url => {
    if (!isMissingPrefixUrl(url)) return '';
    return url.slice(url.indexOf(MISSING_PREFIX_MARK) + MISSING_PREFIX_MARK.length).split('/')[0];
};
