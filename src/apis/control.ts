import { INTERFACE_PREFIX_MEOS_DTP } from '@/config';
import { HttpResponse } from '@/types/common';
import http from '@/utils/http';
import { modelType } from '@/utils/tools';
import { ControllerParameter, ChillerData } from '@/views/Common/SystemsAndControl/types';
import { ControlListItem, AirData, CodeConfig } from '@/views/Common/SystemsAndControl/types/control';

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
export const consoleSwitchSet = (code: string, params: any) => http.post(INTERFACE_PREFIX_MEOS_DTP + `/runConsole/${code}`, params, { headers: { modelType: modelType() } });

/**
 * @description: 【控制台】修改-手自动切换
 * @param {*} params
 * @return {*}
 */
export const changeManualAutoStatus = (params: any) => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/runConsole/changeManualAutoStatus`, params, { headers: { modelType: modelType() } });
