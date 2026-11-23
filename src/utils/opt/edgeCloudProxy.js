import { INTERFACE_PREFIX_MEOS } from '@/config';
import { isEdge } from '@/utils/envUtils';
import { optOn, OPT_SWITCH } from '@/utils/opt/optSwitch';

/**
 * opt：边缘盒子上，原先由浏览器直连云端的几个接口改经我方后端 meos-control 原样转发（2026-11-23 Blake 决定）。
 *
 * 打开 window.meosEnv.OPT_EDGE_CLOUD_PROXY（且后端 switch.opt.edgeCloudProxy 已开）后：
 *   天气 24 小时预报、项目电价、碳排分类数据、工作历日期标签 → ${INTERFACE_PREFIX_MEOS}/opt/edgeCloudProxy/*
 * 后端返回下游原始响应，调用方的解析逻辑不变。开关关闭或非边缘环境时返回原地址。
 *
 * @param {string} path 转发接口相对路径，如 'weather/hour24Forecast'
 * @param {string} originalUrl 原来的完整地址
 * @returns {string}
 */
export const edgeCloudProxyUrl = (path, originalUrl) => (isEdge() && optOn(OPT_SWITCH.EDGE_CLOUD_PROXY) ? `${INTERFACE_PREFIX_MEOS}/opt/edgeCloudProxy/${path}` : originalUrl);
