/*
 * @Author: guoxiaohuan
 * @Date: 2024-04-29 17:51:56
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-06 16:20:47
 * @Description:
 */
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
// const INTERFACE_PREFIX_MEOS = 'https://br-tyxn.yushu.cloud/meos-control-server-edge';

// 查询-空间带状态
export const listSpaceWithStatus = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/listSpaceWithStatus', params);
};

// 查询-需求变化
export const getDemandChange = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/getDemandChange', params);
};

// 当前需求满足情况
export const listLightLoopTotal = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/listLightLoopTotal', params);
};

// 查询批量控制
export const listManualAutomaticControl = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/listManualAutomaticControl', params);
};
// 当前设备状态
export const countEquipmentStatus = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/countEquipmentStatus', params);
};

// 照度监测
export const getIllumInfo = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/getIllumInfo', params);
};

// 日出日落时间
export const sunRiseAndSet = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/weather/sunRiseAndSet', params);
};

// 查询-照明回路信息点编码
export const getCircuitInfoCode = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/getCircuitInfoCode', params);
};

// 照明异常时间列表
export const getLightAbnormalList = (params: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/getAbnormalDataList`, params);
};

// 查询-空间信息
export const getLightSpaceData = (params: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/getSpaceData`, params);
};

// 查询-空间飞行线
export const getLineOfFlight = (params: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/getLineOfFlight`, params);
};

// 分页查询-照明控制模块详情列表
export const getPageControllerDetails = (params: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/pageControllerDetails`, params);
};

// 分页查询-照明回路详情列表
export const getPageCircuitDetails = (params: any, config: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/pageCircuitDetails`, params, config);
};

// 查询楼体景观照明状态数据
export const getBuildingStatus = (params: any, config: Record<string, any> | undefined) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/getLampFuncTypeWithStatus`, params, config);
};

// 查询-照片空间类型配置
export const lightingQuerySpaceFuncTypeList = (params: any, abortSignal: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/intervention/querySpaceFuncTypeList`, params, { headers: { mergeParams: false }, signal: abortSignal });
};

// 查询-照明监控
export const dashboard = (params: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/dashboard`, params);
};

// 查询-照明监控设备统计
export const dashboardEquipmentStatistics = (params: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/lighting/dashboardEquipmentStatistics`, params);
};

// 查询-照明需求统计
export const spaceStatistics = (params: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/intervention/spaceStatistics`, params);
};

// 查询-建筑楼层空间类型空间树
export const treeBuildingFloorRoomFuncTypeSpace = (params: any) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/instance/treeBuildingFloorRoomFuncTypeSpace`, params);
};
