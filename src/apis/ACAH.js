import http from '@/utils/http';
import { INTERFACE_PREFIX_BDTP_KNOWLEDGE, INTERFACE_PREFIX_MEOS_DTP, INTERFACE_PREFIX_MEOS } from '@/config';
import { isEdge } from '@/utils/envUtils';
const modelType = () => sessionStorage.getItem('modelType');

/**
 * 查询-室外气象数据
 * @param {*} params
 * @returns
 */
export const queryOutdoorWeather = params => http.post(INTERFACE_PREFIX_MEOS + '/weather/queryOutdoorWeather', params);

/**
 * @description: 【控制台】查询-运行控制台（包含供冷、蓄冷、空调分区）
 * @param {*} params
 * @return {*}
 */
export const listSpacesByRunningMonitor = params => http.post(`${INTERFACE_PREFIX_MEOS}/instance/listSpacesByRunningMonitor/${params.runningMonitorType}`, params);

/**
 * 查询空间关联的设备
 * 机房内的全部设备、系统下的设备、系统关联的设备
 * @param {*} params
 * @param {*} config
 * @returns
 */
export const getListEquipmentsToModuleView = (type, params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/hot/listEquipmentsToModuleView/' + type, params, config);
};

/**
 * 查询强制控制状态
 * @param {*} params
 * @returns
 */
export const getForceControlStatus = params => http.post(INTERFACE_PREFIX_MEOS + '/hot/getForceControlStatus', params);

export const editForceControlStatus = params => http.post(INTERFACE_PREFIX_MEOS + '/hot/editForceControlStatus', params);

export const listInfoCodeConfigsByObjectId = (data, config) => http.post(INTERFACE_PREFIX_MEOS + '/infoCodeConfig/listInfoCodeConfigsByObjectId', data, config);
export const tagObjList = (data, config) => http.post(INTERFACE_PREFIX_BDTP_KNOWLEDGE + '/api/proj/tagObjList', data, config);
/**
 * @description: 【控制台】查询-运行控制台（包含供冷、蓄冷、空调分区）
 * @param {*} data
 * @return {*}
 */
export const allControllerParameter = data => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/runConsole/allControllerParameter`, data, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】查询-运行控制台（空调分区）
 * @param {*} data
 * @return {*}
 */
export const airTerminalZoneControllerParameter = data =>
    http.post(`${INTERFACE_PREFIX_MEOS_DTP}/runConsole/airTerminalZoneControllerParameter`, data, { headers: { modelType: modelType() } });

/**
 * 【通用】查询-时间表编码定义
 * @param {*} params
 * @returns
 */
export const listScheduleInfoCodeDefine = params => http.get(INTERFACE_PREFIX_MEOS_DTP + '/demandStrategy/listScheduleInfoCodeDefine', params);
