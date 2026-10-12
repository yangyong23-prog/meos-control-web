import { HttpResponse } from '@/types/common';
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP } from '@/config';
import { CLASSCODE } from '@/views/operationMonitoring/coolVariables';
import { isEdge } from '@/utils/envUtils';
import { modelType } from '@/utils/tools';
import { getDayjsTz } from '@/utils/globalVariables';

/**
 * @description: 查询供冷系统列表
 * @param {} params
 * @return {*}
 */
export const coolingSystemList = (classCode: string): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/system/querySystemListData', { criteria: { classCode } });

/**
 * @description: 查询信息点配置及IOT数据
 * @param {} params
 * @return {*}
 */
export const queryInfoCodeConfigByObjectIds = (data: { objectIds: string[]; systemId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/queryInfoCodeConfigByObjectIds', data);

/**
 * @description: 查询泵组信息
 * @param {} params
 * @return {*}
 */
export const listPumpGroupStrategy = (data: { objectIds: string[]; systemId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/listPumpGroupStrategy', data);

/**
 * @description: 查询单个设备的信息点配置信息
 * @param {} params
 * @return {*}
 */
export const querySingleAbnormalEventList = (data: { objectId: string; systemId: string; systemClassCode: string }, signal?: AbortSignal): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/querySingleAbnormalEventList', data, {
        signal
    });

/**
 * @description: 查询单个设备的信息点配置信息
 * @param {} params
 * @return {*}
 */
export const queryEquipOrSpaceHoverInfo = (data: { objectId: string; systemId: string; systemClassCode: string }, signal?: AbortSignal): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/queryEquipOrSpaceHoverInfo', data, {
        signal
    });

/**
 * @description: 获取室外天气数据
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const queryWeather = (params: { systemId: string }): HttpResponse<Record<string, any>> => http.post(INTERFACE_PREFIX_MEOS + '/weather/queryWeather', params);

/**
 * @description: 【末级冷冻泵组】查询固定时间策略
 * @param {} params
 * @return {*}
 */
export const listRunningStrategy = (systemId: string, systemType?: string, hasError = true): HttpResponse<unknown> =>
    http.post(
        (isEdge() ? INTERFACE_PREFIX_MEOS_DTP : INTERFACE_PREFIX_MEOS) + '/strategyIntervention/lastFreezePumpGroup/listRunningStrategy',
        {
            acccSystemId: systemId,
            systemType: systemType || CLASSCODE(),
            beginDateTime: getDayjsTz().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
            endDateTime: getDayjsTz().add(2, 'day').format('YYYY-MM-DD 00:00:00')
        },
        {
            autoHandleError: hasError
        }
    );

/**
 * @description: 查询单个设备的信息点配置信息
 * @return {*}
 * @param data
 * @param signal
 */
export const queryEquipHoverInfo = (data: { templateCode: string; runningMonitorType: string; objectIds: string[] }, signal?: AbortSignal): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', data, {
        signal
    });

/**
 * @description: 【冷机策略】查看冷机策略列表
 * @param {} params
 * @return {*}
 */
export const chilllistRunningStrategy = (systemId: string, systemType?: string, hasError = true): HttpResponse<unknown> =>
    http.post(
        (isEdge() ? INTERFACE_PREFIX_MEOS_DTP : INTERFACE_PREFIX_MEOS) + '/strategyIntervention/chillerStrategy/listRunningStrategy',
        {
            acccSystemId: systemId,
            systemType: systemType || CLASSCODE(),
            beginDateTime: getDayjsTz().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
            endDateTime: getDayjsTz().add(2, 'day').format('YYYY-MM-DD 00:00:00')
        },
        {
            autoHandleError: hasError
        }
    );

/**
 * @description: 查询系统自控模式
 * @param {object} params
 * @return {*}
 */
export const queryRunMode = (params: { objectId: string; systemId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/queryManualAutoStatusByObjectId', params);

/**
 * @description: 更新设备运行参数
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const setOperatingParameters = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/setOperatingParameters', params);

/**
 * @description: 手自动模式一键切换
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const changeManualAutoStatusByObjectId = (params: {
    systemId: string;
    objectId: string;
    model: string;
    expireTime?: string;
    operateType?: string;
    operateReason?: string;
    contentInfo?: string;
}): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/changeManualAutoStatusByObjectId', params);

/**
 * @description: 获取风机、水阀
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const queryFanAndWaterValveByCoolingTowerId = (params: { coolingTowerId: string; systemId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/queryFanAndWaterValveByCoolingTowerId', params);

/**
 * @description: 获取手自动切换原因定义
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const getManualAutoChangeReason = (params: { systemId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/getManualAutoChangeReason', params, { autoHandleError: false });

/**
 * @description: 【末级冷冻泵组】新增临时时间策略
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const addTempTimeStrategy = (params: { systemId: string; objectId: string; effectEndDateTime: string; strategyPlan: Record<string, any> }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/lastFreezePumpGroup/addTempTimeStrategy', { systemType: CLASSCODE(), ...params });

/**
 * @description: 【冷机策略】新建临时冷机策略
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const addChillerTempTimeStrategy = (params: { systemId: string; objectId: string; effectEndDateTime: string; strategyPlan: Record<string, any> }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/addChillerTempTimeStrategy', { systemType: CLASSCODE(), ...params });

/**
 * @description: 查询3D模型下的关系对象树
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const queryRelationObjectTreeByObjectId = (params: { systemId: string; objectId: string; classCode: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/queryRelationObjectTreeByObjectId', params);

/**
 * @description: 重新设置临时策略计划生效结束时间
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const resetTempStrategyPlanEffectEndDateTime = (params: { systemId: string; objectId: string; effectEndDateTime: string; strategyPlanId: string }): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/resetTempStrategyPlanEffectEndDateTime',
        {
            systemType: CLASSCODE(),
            ...params
        },
        { headers: { modelType: modelType(), modelClass: modelType() } }
    );

/**
 * @description: 联动-单点控制切换
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const changeLinkForceControlStatus = (params: { systemId: string; objectId: string; infoCode: string; model: string; classCode: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/changeLinkForceControlStatus', params);

/**
 * @description: 手自动模式修改到期时间
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const changeManualExpireTimeByObjectId = (params: { systemId: string; objectId: string; expireTime: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/changeManualExpireTimeByObjectId', params);

/**
 * @description: 查询水泵对应的泵组信息
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const queryPumpGroupByWaterPump = (params: { systemId: string; objectId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/queryPumpGroupByWaterPump', params);

/**
 * @description: 获取泵组信息
 * @param {} params
 * @return {*}
 */
export const queryPumpGroupObjectByPumpId = (params: { systemId: string; objectId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/cold-heat/queryPumpGroupObjectByPumpId', params);

/**
 * @description: 查询风机对应的冷却塔控制单元的信息
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const queryCoolingTowerByFanId = (params: { systemId: string; objectId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/queryCoolingTowerByFanId', params);

/**
 * @description: 查询风机对应的冷却塔控制单元的信息
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const getRunningChillerData = (params: { systemId: string }): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/getRunningChillerData', params);

/**
 * @description: 系统参数设定
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const commandExecuteByBatch = (params: {
    sustainTime?: string;
    objectId: string;
    adjustmentReasonType?: string;
    adjustmentReasonDetail?: string;
    data?: any;
    manualIntervention: boolean;
}): HttpResponse<boolean> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/commandExecute/commandExecuteByBatch', params, { headers: { modelType: modelType(), modelClass: modelType() } });

/**
 * @description: 切换系统泵组的状态为人工或者自动
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const setManualAutoMatic = (params: { systemId: string; objectId: string; pattern: boolean; infoCode: string }): HttpResponse<boolean> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/commandExecute/setManualAutoMatic', params);

/**
 * @description: 解除干预
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const relieveIntervene = (params: { systemId: string; objectId: string; manualIntervention: boolean; infoCode: string }): HttpResponse<boolean> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/commandExecute/relieveIntervene', params);

/**
 * @description: 查询-某图下所有的异常事件
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const queryAbnormalEventList = (params: any): HttpResponse<boolean> => http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/queryAbnormalEventList', params);

// 新加冷站、热站等监控看板接口
export const querySystemRunningParam = (params: any): HttpResponse<boolean> => http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/querySystemRunningParam', params);

// 获取当前系统一键手自动切换所涉及到的设备类
export const queryManualAutoClassList = (params: any): HttpResponse<boolean> => http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/queryManualAutoClassList', params);

/**
 * @description: 【冷机策略】查看冷机策略列表
 * @param {} params
 * @return {*}
 */
export const coldHotListRunningStrategy = (systemId: string, systemType?: string, hasError = true): HttpResponse<unknown> =>
    http.post(
        (isEdge() ? INTERFACE_PREFIX_MEOS_DTP : INTERFACE_PREFIX_MEOS) + '/hotColdStationStrategyIntervention/listRunningStrategy',
        {
            systemId,
            systemType: systemType || CLASSCODE,
            beginDateTime: getDayjsTz().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
            endDateTime: getDayjsTz().add(2, 'day').format('YYYY-MM-DD 00:00:00')
        },
        {
            autoHandleError: hasError
        }
    );

// 查询壳配置
export const queryShellConfigByInfoCode = (data: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/queryByInfoCode', data);

/**
 * @description: 查询当日运行模式
 * @param {} params
 * @return {*}
 */
export const getSystemRunningModel = (params: {
    systemId: string;
}): HttpResponse<{
    runModeSet: '4' | '1' | '2' | '3';
    expireTime: string;
}> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/cold-heat/getSystemRunningModel', params);

/**
 * @description: 检测是否允许进行修改系统的运行模式
 * @param {} params
 * @return {*}
 */
export const checkSystemRunningModelStatus = (params: {
    systemId: string;
}): HttpResponse<{
    data: boolean;
    code: string;
}> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/cold-heat/checkSystemRunningModelStatus', params);

// 解除系统运行模式的干预
export const removeInterveneSystemRunningModel = (params: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/cold-heat/removeInterveneSystemRunningModel', params);

/**
 * @description: 【冷机策略】查看冷机策略列表-热源
 * @param {} params
 * @return {*}
 */
export const hotListRunningStrategy = (systemId: string, systemType?: string, hasError = true): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/hotStationStrategyIntervention/listRunningStrategy',
        {
            systemId: systemId,
            systemType: systemType || CLASSCODE(),
            beginDateTime: getDayjsTz().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
            endDateTime: getDayjsTz().add(2, 'day').format('YYYY-MM-DD 00:00:00')
        },
        {
            autoHandleError: hasError
        }
    );

/**
 * @description: 解除干预-热源
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const hotEelieveIntervene = (params: { systemId: string; objectId: string; manualIntervention: boolean; infoCode: string }): HttpResponse<boolean> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotStationStrategyIntervention/relieveIntervene', params);

/**
 * @description: 系统参数设定
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const hitCommandExecuteByBatch = (params: {
    sustainTime?: string;
    objectId: string;
    adjustmentReasonType?: string;
    adjustmentReasonDetail?: string;
    hotWaterOutTempSet?: any;
    hotWaterDetaSet?: any;
    manualIntervention: boolean;
    systemCode: String;
    remark: String;
}): HttpResponse<boolean> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotStationStrategyIntervention/commandExecuteByBatch', params);

/**
 * @description: 查询自控期间累计运行时间清零
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const listAccRuntimeClass = (params: { systemId: string; projectId: string; systemClassCode: string }): HttpResponse<boolean> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/listAccRuntimeClass', params);

/**
 * @description: 查询自控期间累计运行时间清零-提交
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const clearAccRuntimeClass = (params: { objectId: string; projectId: string; classCode: string }): HttpResponse<boolean> =>
    http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/clearAccRuntimeClass', params);

/**
 * @description: 获取手自动切换原因定义
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const getInfoCodeDataTimeAndPrecisionType = (params?: {}): HttpResponse<any> =>
    http.get((isEdge() ? INTERFACE_PREFIX_MEOS_DTP : INTERFACE_PREFIX_MEOS) + '/strategyIntervention/getInfoCodeDataTimeAndPrecisionType', params);

/**
 * @description: 查询系统包含的大小机数量
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const getNumberOfChillers = (params: any): HttpResponse<boolean> => http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/getNumberOfChillers', params);

/**
 * @description: 冷却塔出水温度设定配置
 * @param {Record} params
 * @param {*} any
 * @return {*}
 */
export const coolWaterReturnTemp = (params: any): HttpResponse<boolean> => http.post(INTERFACE_PREFIX_MEOS + '/coldCfg/coolWaterReturnTemp', params);

/**
 * [查询] 感知空间列表
 */
export const listSpacesByRunningMonitor = (params: any): HttpResponse<boolean> =>
    http.post(`${INTERFACE_PREFIX_MEOS}/instance/listSpacesByRunningMonitor/${params.runningMonitorType}`, params);
