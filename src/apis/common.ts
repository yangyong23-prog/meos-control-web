import { HttpResponse, UserInfo } from '@/types/common';
import http from '@/utils/http';
import {
    INTERFACE_PREFIX_BDTP_DMP_RWD,
    INTERFACE_PREFIX_BDTP_ELECTRICITY,
    INTERFACE_PREFIX_BDTP_PERSIST,
    INTERFACE_PREFIX_MEOS,
    INTERFACE_PREFIX_MEOS_DTP,
    INTERFACE_PREFIX_TWIN_DTP
} from '@/config';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { ChillerData, ControllerParameter } from '@/views/Common/SystemsAndControl/types';
import { AirData, CodeConfig, ControlListItem } from '@/views/Common/SystemsAndControl/types/control';
const url = () => (isEdge() ? INTERFACE_PREFIX_MEOS_DTP : INTERFACE_PREFIX_MEOS);
const modelType = () => {
    return sessionStorage.getItem('modelType');
};

/**
 * 获取iframe地址
 * @param params
 * @returns
 */
export const getLocalBaseUrlApi = (id: string) => http.get<UserInfo[]>(`${INTERFACE_PREFIX_MEOS}/saas/local/getLocalBaseUrl/${id}`, {}, { headers: { mergeParams: false } });

// 操作-单点/批量控制 乾坤 https://apifox.com/apidoc/shared-6ede71ae-df4d-4d1c-981a-36a22b83382a/api-187140116

export const batchSetOperatingParameters = (body: Object, autoHandleError: boolean) =>
    http.post(`${INTERFACE_PREFIX_MEOS_DTP}/running-monitor/batchSetOperatingParameters`, body, { autoHandleError });

/**
 * 异常事件列表: 按系统划分异常事件
 */
export const getAbnormalListByDivideSystem = (postData: Object) => http.post(`${INTERFACE_PREFIX_MEOS}/abnormalEvent/getAbnormalDataListDivideSystem`, postData);
/**
 * 异常事件列表: 按对象ID
 */
export const getAbnormalListByObjIds = (postData: Object) => http.post(`${INTERFACE_PREFIX_MEOS}/abnormalEvent/listAbnormalEvent`, postData);
// export const getAbnormalListByObjIds = (postData: Object) => http.post(`https://m1.apifoxmock.com/m1/5622601-5302169-default/abnormalEvent/listAbnormalEvent`, postData);

/**
 * 异常事件列表: 按对象ID
 * 注：缓存优化新加，先在机房应用
 */
export const getAbnormalListByObjIdsV2 = (postData: Object) => http.post(`${INTERFACE_PREFIX_MEOS}/abnormalEvent/new/listAbnormalEvent`, postData);
// export const getAbnormalListByObjIds = (postData: Object) => http.post(`https://m1.apifoxmock.com/m1/5622601-5302169-default/abnormalEvent/listAbnormalEvent`, postData);

/**
 * @description: 操作-解除干预
 * @param {} params
 * @return {*}
 */
export const releaseIntervention = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/releaseIntervention', params);
};

/**
 * @description: 手自动
 * @param {} params
 * @return {*}
 */
export const changeManualAutoStatusByObjectId = (params: any, autoHandleError: boolean) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/changeManualAutoStatusByObjectId', params, { autoHandleError });
};

/**
 * @description: 单设备-手自动模式修改到期时间
 * @param {} params
 * @return {*}
 */
export const changeManualExpireTimeByObjectId = (params: any, autoHandleError: boolean) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/changeManualExpireTimeByObjectId', params, { autoHandleError });
};

/**
 * @description: 操作-单点/批量手自动模式切换
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const commandExecuteChangeManualAutoStatus = (params: any, autoHandleError: boolean) =>
    http.post(url() + '/commandExecute/changeManualAutoStatus', params, { autoHandleError, headers: { modelType: modelType() } });

/**
 * @description: 操作-批量控制
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const batchCommandSend = (params: any, autoHandleError: boolean) =>
    http.post(url() + '/commandExecute/batchCommandSend', params, { autoHandleError, headers: { modelType: modelType() } });

/**
 * @description: 操作-批量自动控制（单对象多点位）
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const batchAutoCommandSendBySingleObject = (params: any, autoHandleError: boolean) =>
    http.post(url() + '/commandExecute/batchAutoCommandSendBySingleObject', params, { autoHandleError, headers: { modelType: modelType() } });

/**
 * @description: 操作-批量控制-单设备
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const batchCommandSendBySingleObject = (params: any, autoHandleError: boolean) =>
    http.post(url() + '/commandExecute/batchCommandSendBySingleObject', params, { autoHandleError, headers: { modelType: modelType() } });

/**
 * @description: 操作-批量控制-多设备
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const batchObjectCommandSend = (params: any, autoHandleError: boolean) =>
    http.post(url() + '/commandExecute/batchObjectCommandSend', params, { autoHandleError, headers: { modelType: modelType() } });

/**
 * @description: 操作-修改信息点的干预截止时间
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const changeInfoCodeExpireTime = (params: any, autoHandleError: boolean) =>
    http.post(url() + '/commandExecute/changeInfoCodeExpireTime', params, { autoHandleError, headers: { modelType: modelType() } });

/**
 * @description: 解除控制点位的人工干预（非手自动指令），指令下发受孪生规则限制
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const commandExecuteReleaseIntervention = (params: any, autoHandleError: boolean) =>
    http.post(url() + '/commandExecute/releaseIntervention', params, { autoHandleError, headers: { modelType: modelType() } });

/**
 * @description: 操作-手动触发照明需求计算
 * @param params
 * @param autoHandleError
 * @returns
 */
export const commandExecuteCircuitDemand = (params: any, autoHandleError: boolean) =>
    http.post(url() + '/calculate/lighting/circuitDemand', params, { autoHandleError, headers: { modelType: modelType() } });
/**
 * @description: 获取信息点列表
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const listInfoCodes = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/knowledge/listInfoCodes', params);

/**
 * @description: 查询项目电价
 * @param {any} params
 * @return {*}
 */
export const queryProjectElecPrice = (params: any) => http.post(INTERFACE_PREFIX_BDTP_PERSIST + '/iot/ipcal/data/queryProjectElecPrice', params);

/**
 * @description: 查询项目碳数据
 * @param {any} params
 * @return {*}
 */
export const queryProjectCarbonData = (params: any) => http.post(INTERFACE_PREFIX_BDTP_ELECTRICITY + '/carbon/queryCategoryData', params);
// export const queryProjectCarbonData = (params: any) => http.post('https://dev-gw.meos.net.cn/dtp-electricity-server/carbon/queryCategoryData', params);

/**
 * 查询-新版运行播报数据
 * @param {*} params
 * @returns
 */
export const listPageBroadcastMsg = (params: any, config: any) =>
    http.post(INTERFACE_PREFIX_MEOS + '/runningLog/listPageBroadcastMsg', params, { ...config, headers: { modelType: modelType() } });

/**
 * [查询] 根据取值逻辑查询对象
 * @param {*} params
 * @returns
 */
export const listObjectsByTackValueLogic = (params: any, config: any) => http.post(INTERFACE_PREFIX_MEOS + '/instance/listObjectsByTackValueLogic', params, config);

/**
 * [查询] 操作-清零某设备类的累计时长
 * @param {*} params
 * @returns
 */
export const clearAccRuntimeClass = (params: any) => http.post(url() + '/commandExecute/clearAccRuntimeClass', params, { headers: { modelType: modelType() } });

/**
 * [查询] 查询对象信息点
 * @param {*} params
 * @returns
 */
export const instanceObjectQuery = (params: any, config: any) =>
    http.post(INTERFACE_PREFIX_BDTP_DMP_RWD + `/rwd/instance/object/query?groupCode=${baseStore().groupCode}&projectId=${baseStore().projectId}`, params, config);

/**
 * 查询信息点是否有实例化规则
 * @param params
 * @param abortSignal
 * @returns
 */
export const mapObjectId2ExistsRuleInfoCodes = (params: any, headers = {}, abortSignal: any = null) => {
    if (abortSignal) {
        return http.post(INTERFACE_PREFIX_MEOS + '/rwd/mapObjectId2ExistsRuleInfoCodes', params, { ...headers, signal: abortSignal });
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/rwd/mapObjectId2ExistsRuleInfoCodes', params, headers);
};

/**
 * 查询强制控制状态
 * @param {*} params
 * @returns
 */
export const getForceControlStatus = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/airconditioning/getForceControlStatus', params);

/**
 * 编辑强制控制状态
 * @param {*} params
 * @returns
 */
export const editForceControlStatus = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/airconditioning/editForceControlStatus', params);

/**
 * 重置对象数据
 * @param {*} params
 * @returns
 */
export const resetMultiObjectDatas = (params: any) => http.post(INTERFACE_PREFIX_TWIN_DTP + '/reset/resetMultiObjectDatas', params, { headers: { mergeParams: false } });

/**
 * @description: 【控制台】查询-运行控制台（包含供冷、蓄冷、空调分区）
 * @param {*} data
 * @return {*}
 */
export const allControllerParameter = (data: ControllerParameter): HttpResponse<ControlListItem[]> =>
    http.post(`${INTERFACE_PREFIX_MEOS_DTP}/runConsole/allControllerParameter`, data, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】查询-运行控制台（空调分区）
 * @param {*} data
 * @return {*}
 */
export const airTerminalZoneControllerParameter = (data: ControllerParameter): HttpResponse<AirData> =>
    http.post(`${INTERFACE_PREFIX_MEOS_DTP}/runConsole/airTerminalZoneControllerParameter`, data, { headers: { modelType: modelType() } });

/**
 * 【通用】查询-时间表编码定义
 * @param {*} params
 * @returns
 */
export const listScheduleInfoCodeDefine = (params: { classCode: string }): HttpResponse<Record<string, CodeConfig[]>> =>
    http.get(INTERFACE_PREFIX_MEOS_DTP + '/demandStrategy/listScheduleInfoCodeDefine', params);

/**
 * @description: 【通用】查询-台数分类
 * @param {*} data
 * @return {*}
 */
export const getChillerAxios = (data: { objectId: string }): HttpResponse<ChillerData> =>
    http.post(`${INTERFACE_PREFIX_MEOS_DTP}/demandStrategy/getChiller`, data, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】修改-开关设定
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const consoleSwitchSet = (code: string, params: any) => http.post(url() + `/runConsole/${code}`, params, { headers: { modelType: modelType() } });
