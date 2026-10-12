import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 查询当前应用的配置
 * @param params
 * @returns
 */
export const getCurrentApplyConfig = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/valueSelection/currentApplyConfig', params);
};
/**
 * 查询当前配置信息-电价
 * @param params
 * @returns
 */
export const getCurrentElectricityInfo = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/valueSelection/listElectricityData', params);
};
/**
 * 查询当前配置信息-电价
 * @param params
 * @returns
 */
export const getCurrentCarbonInfo = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/valueSelection/listCarbonData', params);
};
/**
 * 查询最近配置的一条数据
 * @param params
 * @returns
 */
export const getListConfig = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/valueSelection/listLastestConfig', params);
};
/**
 * 保存配置
 * @param params
 * @returns
 */
export const saveConfig = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/valueSelection/saveConfig', params);
};

/**
 * 查询价值选择详情
 * @param params
 * @returns
 */
export const queryValConfigDetail = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/valueSelection/listConfigByType', params);
};
