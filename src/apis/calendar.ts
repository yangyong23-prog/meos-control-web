/*
 * @Author: wuyangyang
 * @Date: 2024-02-18 09:54:21
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-03-14 13:54:12
 * @Description:
 */
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_EMS, INTERFACE_PREFIX_ENERGY_QUALITY } from '@/config';
// const INTERFACE_PREFIX_MEOS = 'https://qa.yushu.cloud';

/**
 * 营业日历-实例化日期标签
 * @param params
 * @returns
 */
export const listInstantiationDateTag = (params: any, config?: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/listInstantiationDateTag', params, config);

/**
 * 营业日历-更新全局规则时间
 * @param params
 * @returns
 */
export const getLastUpdateGlobalRuleTime = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/getGlobalRuleLastUpdateTime', params);
/**
 * 营业日历-查询全局规则
 * @param params
 * @returns
 */
export const getGlobalRule = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/getGlobalRule', params);
/**
 * 营业日历-编辑全局规则
 * @param params
 * @returns
 */
export const editGlobalRule = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/editGlobalRule', params);

/**
 * 营业日历-查询气候区
 * @param params
 * @returns
 */
export const getProjectByIdService = (params: any) => http.post(INTERFACE_PREFIX_EMS + '/Spring/MVC/entrance/unifier/getProjectByIdService', params);
/**
 * 营业日历-查询气候区
 * @param params
 * @returns
 */
export const listClimateZoneService = (params: any) => http.post(INTERFACE_PREFIX_EMS + '/Spring/MVC/entrance/unifier/listClimateZoneService', params);
/**
 * 营业日历-查询气候区
 * @param params
 * @returns
 */
export const querySeason = (params: any) => http.post(INTERFACE_PREFIX_ENERGY_QUALITY + '/quality/common/querySeason', params);

/**
 * 营业日历-查询有工作历的对象
 * @param params
 * @returns
 */
export const queryCalendarByInstanceId = (params: any) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/queryCalendarByInstanceId', params, { headers: { mergeParams: false } });
/**
 * 营业日历-对象营业时间
 * @param params
 * @returns
 */
export const editBusinessTime = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/editBusinessTime', params);

/**
 * 营业日历-查建筑
 * @param params
 * @returns
 */
export const treeBuildingFloorSpace = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/instance/treeBuildingFloorSpace', params);

/**
 * 营业日历-查营业时间
 * @param params
 * @returns
 */
export const listBusinessTimeByObjId = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/listBusinessTimeByObjId', params);

/**
 * 需求日历-查询模板列表
 * @param params
 * @returns
 */
export const listTemplate = (params: any, config: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/template/listTemplate', params, config);
/**
 * 需求日历-日期配置
 * @param params
 * @returns
 */
export const listDateSetting = (params: any, config: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/template/listDateSetting', params, config);

/**
 * 需求日历-应用日期模板
 * @param params
 * @returns
 */
export const applyTemplateByDate = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/template/applyTemplateByDate', params);

/**
 * 需求日历-清除模板
 * @param params
 * @returns
 */
export const clearCalendar = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/template/clearCalendar', params);

/**
 * 需求日历-需求类型列表
 * @param params
 * @returns
 */
export const listTemplateType = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/demand/template/listTemplateType', params);

/**
 * 批量删除特殊对象配置
 * 该函数用于清除所有特殊对象的配置信息，通过HTTP POST请求调用后端接口
 * @param params - 请求参数对象，包含需要删除的特殊对象配置的相关信息
 * @param config - 可选的请求配置参数，用于自定义HTTP请求的配置
 * @returns 返回HTTP POST请求的响应结果
 */
export const clearAllSpecialObjectConfig = (params: any, config?: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/batchDelete/specialObjectConfiguration', params, config);
};
