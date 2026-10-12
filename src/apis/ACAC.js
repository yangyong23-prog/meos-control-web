import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP, INTERFACE_PREFIX_BDTP_KNOWLEDGE } from '@/config';
import { isEdge } from '@/utils/envUtils';
const modelType = () => sessionStorage.getItem('modelType');
const url = () => INTERFACE_PREFIX_MEOS_DTP;
const urlDtp = () => INTERFACE_PREFIX_MEOS_DTP;

/**
 * 菜单配置
 * @param params
 * @returns
 */
export const getMenuConfig = params => http.get(`${INTERFACE_PREFIX_MEOS}/system/graph/menu/config`, params, { headers: { modelType: modelType() } });

/**
 * @description: 获取室外天气数据
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const queryWeather = params => http.post(INTERFACE_PREFIX_MEOS + '/weather/queryWeather', params, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】修改-开关设定
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const consoleSwitchSet = (code, params) => http.post(url() + `/runConsole/${code}`, params, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】查询-运行控制台（包含供冷、蓄冷、空调分区）
 * @param {*} params
 * @return {*}
 */
export const querySystemRunningParam = params => http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/querySystemRunningParam', params, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】查询-运行控制台（包含供冷、蓄冷、空调分区）
 * @param {*} params
 * @return {*}
 */
export const listSpacesByRunningMonitor = (params, config) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/instance/listSpacesByRunningMonitor/${params.runningMonitorType}`, params, { ...config, headers: { modelType: modelType() } });

/**
 * @description: 【控制台】修改-手自动切换
 * @param {*} params
 * @return {*}
 */
export const changeManualAutoStatus = params => http.post(`${url()}/runConsole/changeManualAutoStatus`, params, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】修改-供冷开关设定
 * @param {*} data
 * @return {*}
 */
export const coolingSupplySwitchSet = data => http.post(`${url()}/runConsole/coolingSupplySwitchSet`, data, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】查询-运行控制台（包含供冷、蓄冷、空调分区）
 * @param {*} data
 * @return {*}
 */
export const allControllerParameter = data => http.post(`${url()}/runConsole/allControllerParameter`, data, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】查询-运行控制台（空调分区）
 * @param {*} data
 * @return {*}
 */
export const airTerminalZoneControllerParameter = data => http.post(`${url()}/runConsole/airTerminalZoneControllerParameter`, data, { headers: { modelType: modelType() } });

/**
 * @description: 【时间表】查询-各点位孪生规则校验情况（）
 * @param {*} data
 * @return {*}
 */
export const optionsUpdateStrategy = (data, config) => http.post(`${urlDtp()}/demandStrategy/optionsUpdateStrategy`, data, { ...config, headers: { modelType: modelType() } });

/**
 * @description: 【通用】查询-台数分类
 * @param {*} data
 * @return {*}
 */
export const getChillerAxios = data => http.post(`${urlDtp()}/demandStrategy/getChiller`, data, { headers: { modelType: modelType() } });

/**
 * 【时间表】查询-预编辑某日需求策略
 * @param {*} data
 * @param {*} config
 * @returns
 */
export const optionsEditStrategy = (data, config) => http.post(`${urlDtp()}/demandStrategy/optionsEditStrategy`, data, { ...config, headers: { modelType: modelType() } });

/**
 * @description: 【控制台】修改-释放干预
 * @param {*} data
 * @return {*}
 */
export const releaseIntervention = data => http.post(`${url()}/runConsole/releaseIntervention`, data, { headers: { modelType: modelType() } });

/**
 * @description: 修改-释放干预
 * @param {*} data
 * @return {*}
 */
export const commandExecuteReleaseIntervention = data => http.post(`${url()}/commandExecute/releaseIntervention`, data, { headers: { modelType: modelType() } });

/**
 * @description: 【时间表】查询-需求策略列表
 * @param {*} data
 * @return {*}
 */
export const listStrategy = (data, config) => http.post(`${urlDtp()}/demandStrategy/listStrategy`, data, { ...config, headers: { modelType: modelType() } });

/**
 * @description: 【时间表】删除-需求策略[单类型]
 * @param {*} data
 * @return {*}
 */
export const removeStrategy = data => http.post(`${urlDtp()}/demandStrategy/removeStrategy`, data, { headers: { modelType: modelType() } });

/**
 * @description: 【时间表】删除-需求策略[多类型]
 * @param {*} data
 * @return {*}
 */
export const batchRemoveStrategy = data => http.post(`${urlDtp()}/demandStrategy/batchRemoveStrategy`, data, { headers: { modelType: modelType() } });

/**
 * 根据类型查询知识库定义信息点
 */
export const queryInfoCodesByTypeInKnowledge = (params, config) =>
    http.post(`${INTERFACE_PREFIX_BDTP_KNOWLEDGE}/api/type/info/listInfoByTypes`, params, { ...config, headers: { modelType: modelType(), mergeParams: false } });

/**
 * 【时间表】查询-系统下的控制分区与公共泵组
 */
export const listSpaceZoneAndPublicPumpGroup = (params, config) =>
    http.post(`${urlDtp()}/demandStrategy/listSpaceZoneAndPublicPumpGroup`, params, { ...config, headers: { modelType: modelType() } });

export const listInfoCodeConfigsByObjectId = (data, config) =>
    http.post(INTERFACE_PREFIX_MEOS + '/infoCodeConfig/listInfoCodeConfigsByObjectId', data, { ...config, headers: { modelType: modelType() } });
/**
 * 【时间表】保存-需求策略信息
 */
export const saveStrategy = (params, config) => http.post(`${urlDtp()}/demandStrategy/saveStrategy`, params, { ...config, headers: { modelType: modelType() } });
/**
 * 【时间表】查询-某日需求策略列表
 */
export const getStrategyOfDay = (params, config) => http.post(`${urlDtp()}/demandStrategy/getStrategy`, params, { ...config, headers: { modelType: modelType() } });

/**
 * @description: 系统设置编辑保存
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const extendInfoCodeValueConfig = params => http.post(INTERFACE_PREFIX_MEOS + '/coldCfg/extendInfoCodeValueConfig', params, { headers: { modelType: modelType() } });

/**
 * @description: 单点指令下发
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const commandSend = params => http.post(url() + '/commandExecute/commandSend', params, { headers: { modelType: modelType() } });

/**
 * @description: 批量控制
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const batchCommandSend = params => http.post(url() + '/commandExecute/batchCommandSend', params, { headers: { modelType: modelType() } });

/**
 * @description: 操作-单点/批量手自动模式切换
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const commandExecuteChangeManualAutoStatus = (params, autoHandleError) =>
    http.post(url() + '/commandExecute/changeManualAutoStatus', params, { headers: { modelType: modelType() }, autoHandleError });

/**
 * @description: 查询自控期间累计运行时间清零
 * @param {Record} params
 * @param {*} config
 * @return {*}
 */
export const listAccRuntimeClass = params => http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/listAccRuntimeClass', params);

/**
 * @description: 查询自控期间累计运行时间清零
 * @param {Record} params
 * @param {*} config
 * @return {*}
 */
export const getListEquipments = params => http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipments/AIR_CONDITIONING_COLD_SOURCE', params);

/**
 * @description: 查询自控期间累计运行时间清零
 * @param {Record} params
 * @param {*} config
 * @return {*}
 */
export const getListEquipmentsByType = (runningMonitorType, params) => http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipments/' + runningMonitorType, params);

/**
 * @description: 查询自控期间累计运行时间清零
 * @param {Record} params
 * @param {*} config
 * @return {*}
 */
export const getListClassCodes = params => http.post(INTERFACE_PREFIX_MEOS + '/knowledge/listClassCodes', params);

/**
 * 查询空间下设备
 * @param {*} params
 * @param {*} config
 * @returns
 */
export const listEquipmentsInBySpaceIds = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipmentsInBySpaceIds', params, config);
};

/**
 * 查询强制控制状态
 * @param {*} params
 * @returns
 */
export const getForceControlStatus = params => http.post(INTERFACE_PREFIX_MEOS + '/airconditioning/getForceControlStatus', params);

/**
 * 编辑强制控制状态
 * @param {*} params
 * @returns
 */
export const editForceControlStatus = params => http.post(INTERFACE_PREFIX_MEOS + '/airconditioning/editForceControlStatus', params);

/**
 * 查询-新版运行播报数据
 * @param {*} params
 * @returns
 */
export const listPageBroadcastMsg = (params, config) =>
    http.post(INTERFACE_PREFIX_MEOS + '/runningLog/listPageBroadcastMsg', params, { ...config, headers: { modelType: modelType() } });

/**
 * 【通用】查询-时间表编码定义
 * @param {*} params
 * @returns
 */
export const listScheduleInfoCodeDefine = params => http.get(url() + '/demandStrategy/listScheduleInfoCodeDefine', params);

/**
 * 查询-室外气象数据
 * @param {*} params
 * @returns
 */
export const queryOutdoorWeather = params => http.post(INTERFACE_PREFIX_MEOS + '/weather/queryOutdoorWeather', params);

/**
 * 查询-运行分析效率
 * @param {*} params
 * @returns
 */
export const queryEfficiency = params =>
    http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/queryEfficiency', params, {
        autoHandleError: false
    });

/**
 * 查询空间关联的设备
 * 机房内的全部设备、系统下的设备、系统关联的设备
 * @param {*} params
 * @param {*} config
 * @returns
 */
export const getlistEquipmentsToModuleView = (type, params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/airconditioning/listEquipmentsToModuleView/' + type, params, config);
};
