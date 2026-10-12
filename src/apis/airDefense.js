import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
// const INTERFACE_PREFIX_MEOS = 'http://172.16.2.14:8088';
/**
 * @description: 布防空间统计
 * @param {} params
 * @return {*}
 */
export const spaceStatistics = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/security/arming/space/statistics', params);
};
/**
 * @description: 通行空间状态统计
 * @param {} params
 * @return {*}
 */
export const accessSpaceStatistics = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/security/access/space/statistics', params);
};
/**
 * @description: 设备统计
 * @param {} params
 * @return {*}
 */
export const equipmentStatistics = (params, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/security/equipment/statistics', params, { signal });
};
/**
 * 异常事件列表
 * @returns
 */
export const getAbnormalDataList = postData => http.post(`${INTERFACE_PREFIX_MEOS}/security/getAbnormalDataList`, postData);
