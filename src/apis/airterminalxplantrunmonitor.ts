import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP } from '@/config';
// const INTERFACE_PREFIX_MEOS = '/meos-control-server-edge';

/**
 * @description: 手自动
 * @param {} params
 * @return {*}
 */
export const changeManualAutoStatusByObjectId = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/changeManualAutoStatusByObjectId', params);
};
/**
 * @description: 查询系统自控模式
 * @param {object} params
 * @return {*}
 */
export const queryRunMode = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/airTerminal/queryManualAutoStatusByObjectId', params);
};
/**
 * @description: 设备AI控制修改
 * @param {} params
 * @return {*}
 */
export const setOperatingParametersAi = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/eq/setOperatingParameters', params);
};
/**
 * @description: 单设备-AI设定
 * @param {} params
 * @return {*}
 */
export const setOperatingParameters = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/setOperatingParameters', params);
};
/**
 * @description: 单设备-手自动模式修改到期时间
 * @param {} params
 * @return {*}
 */
export const changeManualExpireTimeByObjectId = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/changeManualExpireTimeByObjectId', params);
};
// /**
//  * @description: 解除干预
//  * @param {} params
//  * @return {*}
//  */
// export const releaseIntervention = (params: any) => {
//     return http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/eq/releaseIntervention', params);
// };
/**
 * @description: 单设备-测弹窗
 * @param {} params
 * @return {*}
 */
export const listEquipmentControllerDetails = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/airTerminal/listEquipmentControllerDetails', params);
};
/**
 * @description: 测弹窗标签tags
 * @param {} params
 * @return {*}
 */
export const getObjectTag = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/airTerminal/getObjectTag', params);
};
/**
 * @description: 异常事件
 * @param {} params
 * @return {*}
 */
export const getAbnormalDataList = (params: any) => {
    console.log('arams: ', params);
    if (params.instanceType) {
        params.instanceType = params.instanceType.toUpperCase();
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/airTerminal/getAbnormalDataList', params);
};

/**
 * @description: 查询-信息点配置-按对象
 * @param {} params
 * @return {*}
 */
export const listInfoCodeConfigsByObject = (params: any, config: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', params, config);
};
/**
 * @description: 操作-单点/批量控制
 * @param {} params
 * @return {*}
 */
export const batchSetOperatingParameters = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/batchSetOperatingParameters', params);
};
/**
 * @description: 操作-解除干预
 * @param {} params
 * @return {*}
 */
export const releaseIntervention = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/releaseIntervention', params);
};
/**
 * @description: 操作-环境品质关联传感器
 * @param {} params
 * @return {*}
 */
export const listSensorByServiceSpace = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/commonSpace/listSensorByServiceSpace', params);
};
