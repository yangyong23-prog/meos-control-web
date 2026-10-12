import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS_DTP } from '@/config';

const modelType = () => sessionStorage.getItem('modelType');
const urlDtp = () => INTERFACE_PREFIX_MEOS_DTP;

export const optionsUpdateStrategy = (data, config) => http.post(`${urlDtp()}/demandStrategy/optionsUpdateStrategy`, data, { ...config, headers: { modelType: modelType() } });

export const optionsEditStrategy = (data, config) => http.post(`${urlDtp()}/demandStrategy/optionsEditStrategy`, data, { ...config, headers: { modelType: modelType() } });

export const saveStrategy = (params, config) => http.post(`${urlDtp()}/demandStrategy/saveStrategy`, params, { ...config, headers: { modelType: modelType() } });

export const listSpaceZoneAndPublicPumpGroup = (params, config) =>
    http.post(`${urlDtp()}/demandStrategy/listSpaceZoneAndPublicPumpGroup`, params, { ...config, headers: { modelType: modelType() } });

export const getChillerAxios = data => http.post(`${urlDtp()}/demandStrategy/getChiller`, data, { headers: { modelType: modelType() } });

export const listStrategy = (data, config) => http.post(`${urlDtp()}/demandStrategy/listStrategy`, data, { ...config, headers: { modelType: modelType() } });

/**
 * 【时间表】查询-某日需求策略列表
 */
export const getStrategyOfDay = (params, config) => http.post(`${urlDtp()}/demandStrategy/getStrategy`, params, { ...config, headers: { modelType: modelType() } });

/**
 * @description: 【时间表】删除-需求策略[单类型]
 * @param {*} data
 * @return {*}
 */
export const removeStrategy = data => http.post(`${urlDtp()}/demandStrategy/removeStrategy`, data, { headers: { modelType: modelType() } });
