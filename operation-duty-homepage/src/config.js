// @ts-ignore
import i18n from '@/localization';
// 全局配置常量

// 接口前缀 在腾讯云ConfigMap中进行配置
export const portPrefix = window.apmstmEnv?.INTERFACE_PREFIX_STM;
export const portAimPrefix = window.apmstmEnv?.INTERFACE_PREFIX_AIM;
export const portPrefixCommon = window.apmstmEnv?.INTERFACE_PREFIX_COMMON;
export const INTERFACE_PREFIX_MEOS =
    window.proxy?.meosEnv?.INTERFACE_PREFIX_MEOS ||
    window.meosEnv?.INTERFACE_PREFIX_MEOS ||
    window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_MEOS ||
    window.apmCommonEnv?.INTERFACE_PREFIX_MEOS; // moes 后端服务

export const Environment = window.proxy?.meosEnv?.Environment || window.meosEnv?.Environment || window.proxy?.apmCommonEnv?.Environment || window.apmCommonEnv?.Environment;
