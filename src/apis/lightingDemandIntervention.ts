import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 'https://dev-gw.meos.net.cn/meos-control-server'
const prefix = INTERFACE_PREFIX_MEOS;

// 干预配置时段查询
export const getInterventionTimeRange = (params: Record<string, any>, config?: Record<string, any>) => {
    return http.post(prefix + '/intervention/config/query/timeslot', params, config);
};

// 干预列表查询
export const getInterventionList = (params: Record<string, any>) => {
    return http.post(prefix + '/intervention/config/list', params);
};

// 查看干预配置详情
export const getInterventionConfigDetail = (params: Record<string, any>) => {
    return http.post(prefix + '/intervention/getConfigDetails', params);
};

// 查看空间功能类型列表
export const getSpaceFunctionTypeList = (params: Record<string, any>) => {
    return http.post(prefix + '/lighting/querySpaceFuncTypeList', params);
};

// 查看某场景下实例对应的配置信息
export const getInstanceConfigInfo = (params: Record<string, any>) => {
    return http.post(prefix + '/demand/lighting/getSceneObjectSettings', params);
};

// 查询实例对应的照明功能类型树
export const getInstanceFunctionTypeTree = (params: Record<string, any>) => {
    return http.post(prefix + '/lighting/queryCircuitIdFuncTypeList', params);
};

// 查看需求空间统计
export const getSpaceStatistics = (params: Record<string, any>) => {
    return http.post(prefix + '/intervention/spaceStatistics', params);
};
