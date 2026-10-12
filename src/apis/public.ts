import { DemandType, HttpResponse } from '@/types/common';
import http from '@/utils/http';
import { Method } from 'axios';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_BDTP_DMP_RWD } from '@/config';

const modelType = () => sessionStorage.getItem('modelType');

/**
 * @description: 获取表格数据
 * @param {TableParams} params
 * @param {Method} method
 * @param {string} url
 * @return {*}
 */
export const getTableLists = (params: Record<string, any>, method: Method, url: string): any => {
    if (method.toUpperCase() === 'GET') {
        return http.get(url, params);
    }
    return http.post(url, params);
};

/**
 * 获取tab列表
 * @param params
 * @returns
 */
export const getListDateSetting = (
    params: {
        templateType: DemandType;
        demandType: DemandType;
    },
    config?: any
): HttpResponse<{ templateId: string; templateName: string; isInitialized: boolean; templateTag: string }[]> =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/template/listTemplate', params, config);

/**
 * @description: 获取表格下载
 * @param {object} params
 * @param {string} url
 * @param {string} responseType
 * @return {*}
 */
export const getDownLoad = (params: object, url: string): any => http.post(url, params, { responseType: 'blob', autoHandleError: false });

export const listInfoCodeConfigsByObjectCommon = (
    data: { templateCode: string; runningMonitorType: string; objectIds: string[] },
    signal?: AbortSignal,
    config = {}
): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', data, {
        signal,
        ...config
    });

// 新版本动态数据查询接口
export const listInfoCodeConfigsByObjectIdCommon = (
    data: { templateCode: string; runningMonitorType: string; objectIds: string[]; templateType?: string },
    signal?: AbortSignal,
    config = {}
): HttpResponse<unknown> => {
    const configData: any = config || {};
    if (signal) {
        configData.signal = signal;
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/infoCodeConfig/listInfoCodeConfigsByObjectId' + '?' + (data?.templateCode || data?.templateType), data, configData);
};

export const listDangerEventsByObjecysCommon = (data: { objectIds: string[] }, signal?: AbortSignal): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/dangerEvent/listByObject', data, {
        signal
    });

export const listDangerEventsByDangerObject = (data: { objectIds: string[] }, signal?: AbortSignal): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/dangerEvent/listByDangerObject', data, {
        signal
    });
// export const listDangerEventsByDangerObject = (data: { objectIds: string[] }, signal?: AbortSignal): HttpResponse<unknown> =>
//     http.post('https://m1.apifoxmock.com/m1/5622601-5302169-default/dangerEvent/listByDangerObject', data, {
//         signal
//     });
// 查询空间对象列表，支持http config 参数
export const querySpacesWithHttpConfig = (data: any, config?: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/instance/listSpaces', data, config);

// 查询配置信息点数据,支持http config 参数
export const listInfoCodeConfigsWithHttpConfig = (data: any, config?: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', data, config);

// 查询设备对象列表,支持http config 参数
export const queryEquipsWithHttpConfig = (data: any, config?: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipmentInByFloorIds', data, config);
// export const queryEquipsWithHttpConfig = (data: any, config?: any): HttpResponse<unknown> =>

// 查询日预报数据
export const queryWeatherService = (date: any, config?: any): HttpResponse<unknown> => http.get(INTERFACE_PREFIX_MEOS + '/weather/queryWeatherService/' + date, null, config);

// [查询] 根据取值逻辑查询对象
export const listObjectsByTackValueLogic = (params: any, config?: any): HttpResponse<unknown> =>
    http.post(INTERFACE_PREFIX_MEOS + '/instance/listObjectsByTackValueLogic', params, config);

export const getKnowledgeListClassCodes = (params: any, config?: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/knowledge/listClassCodes', params, config);

/**
 * 批量查询分精度数据
 */
export const batchQueryPeriodData = (params: any, config?: any) => http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/batchQueryPeriodData`, params, config);

/**
 * 查询-是否有绑点信息
 */
export const queryObjectsExistRule = (params: any, config?: any) => http.post(`${INTERFACE_PREFIX_MEOS}/knowledge/queryObjectsExistRule`, params, config);

// 查询建筑楼层空间dashboard空间树
export const queryTreeBuildingFloorDashboardSpaces = (params: any) => http.post(`${INTERFACE_PREFIX_MEOS}/instance/treeBuildingFloorDashboardSpaces`, params);

// 查询实例配置：白名单
export const queryInstanceWhiteList = (params: any) => http.post(`${INTERFACE_PREFIX_MEOS}/instanceConfig/listInstanceConfig`, params);

// 保存实例配置：白名单
export const saveInstanceWhiteList = (params: any) => http.post(`${INTERFACE_PREFIX_MEOS}/instanceConfig/saveInstanceConfig`, params);

/**
 * 查询空间下设备
 * @param {*} params
 * @param {*} config
 * @returns
 */
export const getListEquipmentsInBySpaceIds = (params: any, config: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipmentsInBySpaceIds', params, config);
};

/**
 * 查询-新版运行播报数据
 * @param {*} params
 * @returns
 */
export const getListPageBroadcastMsg = (params: any, config: any) =>
    http.post(INTERFACE_PREFIX_MEOS + '/runningLog/listPageBroadcastMsg', params, { ...config, headers: { modelType: modelType() } });

/**
 * 查询-多设备的IOT数据（不分组）
 */
export const batchQueryInfoCode = (params: any, config: any) => http.post(`${INTERFACE_PREFIX_MEOS}/running-monitor/batchQueryInfoCode`, params, config);
// export const batchQueryInfoCode = (params: any, config: any) =>
//     http.post(`https://m1.apifoxmock.com/m1/5622601-5302169-default/running-monitor/batchQueryInfoCode`, params, config);

/**
 * [查询] 建筑楼层空间Dashboard空间树

 */
export const treeBuildingFloorDashboardSpaces = (params: any, config: any) => http.post(`${INTERFACE_PREFIX_MEOS}/instance/treeBuildingFloorDashboardSpaces`, params, config);

/**
 * apm台账配置-空间树配置
 * @param params
 * @param config
 * @returns
 */
export const getSpaceTypeTree = (params: any, config: any) => http.get(`${INTERFACE_PREFIX_BDTP_DMP_RWD}/rwd/aim/space/tree/query`, params, config);

/**
 * 查询空间关联的设备
 * 机房内的全部设备、系统下的设备、系统关联的设备
 * @param {*} params
 * @param {*} config
 * @returns
 */
export const getListEquipmentsToModuleView = (prefix: string, type: string, params: any, config: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + `/${prefix}/listEquipmentsToModuleView/${type}`, params, config);
};

/**
 * 查询3D模型图对象，地图用字段
 * @param params
 * @param config
 * @returns
 */
export const listModelViewFieldsByObjectId = (params: any, config: any) => http.post(`${INTERFACE_PREFIX_MEOS}/cacheRwd/listModelViewFieldsByObjectId`, params, config);
