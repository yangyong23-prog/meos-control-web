import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP } from '@/config';
// const INTERFACE_PREFIX_MEOS = 'http://192.168.0.49:8088';
/**
 * 查询-末端设备类列表
 */
export const queryListEquipment = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/listEquipmentTypes`, postData);

/**
 * 查询-空间品质统计
 */
export const getSpaceQualityStatistics = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/getSpaceQualityStatistics`, postData);

/**
 * 查询-是否加载弹框
 */
export const getDialogContinueLoad = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/getDialogContinueLoad`, postData);
/**
 * 查询-设备状态统计
 */
export const listEquipmentStatusStatistics = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/listEquipmentStatusStatistics`, postData);
/**
 * 查询-设备状态统计
 */
export const homePageEquipment = (postData, signal) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/air/statistics/homePageEquipment`, postData, {
        signal
    });

/**
 * 查询-需求目标展示
 */
export const listObjectSetting = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/listObjectSetting`, postData);
/*
 * @param {*} postData:{projectId:String}
 * @returns
 */
export const queryQualityLegend = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/getQualityInterval`, postData);

/**
 *
 * @param {*} postData:{projectId:String}
 * @returns
 */
export const querySchedulingLegend = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/getDemandStatus`, postData);

/**
 * 异常事件列表
 * @returns
 */
export const getAbnormalDataList = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/getAbnormalDataList`, postData);

/**
 * 查询楼层管道列表
 * @returns
 */
export const queryPipeListByFloor = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/listPipelineByFloor`, postData, config);
/**
 * 查询空间带状态
 * @returns
 */
export const querySpaceWithStatus = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/listSpaceWithStatus`, postData, config);

/**
 * 基础信息
 */

export const getBaseInfo = id =>
    http.get(`${INTERFACE_PREFIX_MEOS}/forward-to-aim/object/detail/basic/${id}`, null, {
        simple: true
    });

//设备服务空间, 弃用
// export const querySpaceCurrentInfo = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/querySpaceCurrentInfo`, postData);

// 空间关联设备
export const queryEqInfo = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/space/queryEqInfo`, postData);
// 空间关联设备
export const queryRelationEquip = postData => http.post(`${INTERFACE_PREFIX_MEOS}/commonSpace/listEquipmentServiceSpaceBySpaceId`, postData);
// 查询-模版类型列表
export const listTemplateTypes = postData => http.post(`${INTERFACE_PREFIX_MEOS}/equipment/infoCodeConfig/listTemplateTypes`, postData);
// 新版本查询模板类型列表
export const queryTemplateTypes = postData => http.post(`${INTERFACE_PREFIX_MEOS}/infoCodeConfig/listTemplateTypes`, postData);
// 查询-信息点配置-按模版类型
export const listInfoCodeConfigsByTemplateType = postData => http.post(`${INTERFACE_PREFIX_MEOS}/equipment/infoCodeConfig/listInfoCodeConfigsByTemplateType`, postData);
export const queryListInfoCodeConfigsByTemplateType = postData => http.post(`${INTERFACE_PREFIX_MEOS}/equipment/infoCodeConfig/listInfoCodeConfigsByTemplateType`, postData);
export const listInfoCodeConfigsByTemplateId = postData => http.post(`${INTERFACE_PREFIX_MEOS}/infoCodeConfig/listInfoCodeConfigsByTemplateId`, postData);
// 查询-信息点编码定义
export const queryListInfoCodes = postData => http.post(`${INTERFACE_PREFIX_MEOS}/knowledge/listInfoCodes`, postData);
// 查询-模版类型对象存在规则的IOT信息点 (设备列表表头查询)
export const releaseIntervention = postData => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/running-monitor/releaseIntervention`, postData);

/**
 * 操作-批量自动指令下发(不受手自动控制的操作)
 */
export const batchAutoSetOperatingParameters = postData => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/running-monitor/batchAutoSetOperatingParameters`, postData);

// 获取空调末端调度回放历史数据
export const getACHistoryPlaybackData = (postData, signal) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/historyPlaybackByTime`, postData, {
        signal
    });
// 查询-末端静态数据
export const queryAirListSpaceEquipment = postData => http.post(`${INTERFACE_PREFIX_MEOS}/airTerminal/listSpaceEquipment`, postData);

/**
 * @description: 查询-批量控制
 * @param {*} params
 * @param {*} config
 * @return {*}
 */
export const listBatchControl = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/dashboardGridChart/listBatchControl', params, config);
};

/**
 * @description: 查询-Dashboard设备统计
 * @param {*} params
 * @param {*} config
 * @return {*}
 */
export const dashboardEquipment = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/airTerminal/statistic/dashboardEquipment', params, config);
};

/**
 * @description: 查询-Dashboard设备可视化统计
 * @param {*} params
 * @param {*} config
 * @returns
 */
export const dashboardEquipmentVisible = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/airTerminal/statistic/dashboardEquipmentVisible', params, config);
};
