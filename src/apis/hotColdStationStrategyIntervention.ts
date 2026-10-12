/*
 * @Author: guoxiaohuan
 * @Date: 2023-08-22 18:28:20
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-08-27 15:19:44
 * @Description:
 */
export const CLASSCODE = 'ACCI';
import { HttpResponse } from '@/types/common';
import http from '@/utils/http';
import dayjs from 'dayjs';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP } from '@/config';
import { isEdge } from '@/utils/envUtils';
import { modelType } from '@/utils/tools';
import { getDayjsTz } from '@/utils/globalVariables';

/**
 * @description: 校验固定时间策略
 * @param {} params
 * @return {*}
 */
export const checkFixedStrategy = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/checkFixedStrategy', params);

/**
 * @description: 查询已配置的策略月份
 * @param {} params
 * @return {*}
 */
export const listFixedStrategyDateByMonth = (params: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/listFixedStrategyDateByMonth', params);

/**
 * @description: 【冷机策略】查看冷机策略列表
 * @param {} params
 * @return {*}
 */
export const listFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/listFixedTimeStrategy', params);

/**
 * @description: 【冷机策略】新建冷机固定时间策略
 * @param {} params
 * @return {*}
 */
export const chillerStrategyAddFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/addFixedTimeStrategy', params, { headers: { modelType: modelType(), modelClass: modelType() } });

/**
 * @description:【冷机策略】修改固定时间点策略
 * @param {} params
 * @return {*}
 */
export const updateFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/updateFixedTimeStrategy', params, { headers: { modelType: modelType(), modelClass: modelType() } });

/**
 * @description:【冷机策略】删除固定时间点策略
 * @param {} params
 * @return {*}
 */
export const deleteFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/deleteFixedTimeStrategy', params, { headers: { modelType: modelType(), modelClass: modelType() } });

/**
 * @description: 批量删除固定时间策略
 * @param params 批量删除日期范围及系统参数
 * @return {*}
 */
export const batchDeleteFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/batchDeleteFixedTimeStrategy', params, {
        headers: { modelType: modelType(), modelClass: modelType() }
    });

// 策略转换保存接口
export const saveSupportAiConfig = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/saveSupportAiConfig', params);

// 策略控制器-本地获取AI策略状态
export const querySupportAi = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/querySupportAi', params);

// 查询主机组数
export const getAcahcObj = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/getAcahcObj', params);

// 查询时间区间的供冷供暖供冷季
export const querySeasonByTime = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/hotColdStationStrategyIntervention/querySeasonByTime', params);

//
export const queryShellConfigByInfoCode = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/queryByInfoCode', params);

/**
 * @description: 【冷机策略】查看冷机策略列表
 * @param {} params
 * @return {*}
 */
/** TODO MARK */
export const chilllistRunningStrategy = (systemId: string, systemType?: string, hasError = true): HttpResponse<unknown> =>
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

// 解除系统运行模式的干预
export const removeInterveneSystemRunningModel = (params: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS_DTP + '/cold-heat/removeInterveneSystemRunningModel', params, { headers: { modelType: modelType(), modelClass: modelType() } });
