import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
console.log('INTERFACE_PREFIX_MEOS: ', INTERFACE_PREFIX_MEOS);

// 查询-统计
export const queryStatics = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/kitchenRangeHood/equipment/statistics', params, { headers: { mergeParams: false } });
};
export const queryStaticGrid = params => {
    return http.get(INTERFACE_PREFIX_MEOS + '/kitchenRangeHood/static/info/aggregate', params);
};

/**
 * [查询] 感知空间列表
 */
export const getCommonListSpacesByRunningMonitor = (params, config) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/instance/listSpacesByRunningMonitor/${params.runningMonitorType}`, params, config);
