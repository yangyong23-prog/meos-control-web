import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_AIM } from '@/config';

// 通风，查询地图数据
export const queryVentilationModelView = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/ventilation/queryVentilationModelView', params);
};
// 通风异常事件列表查询
export const getAbnormalDataList = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/ventilation/getAbnormalDataList', params);
};
export const queryStatics = (params, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/ventilation/equipment/statistics', params, { headers: { mergeParams: false }, signal });
};

// 通风感知升级
// 查询静态数据（空间+设备）
export const listDashboardSpaces = (runningMonitorType, params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listDashboardSpaces/' + runningMonitorType, params, { headers: { mergeParams: false } });
    // return http.post('https://m1.apifoxmock.com/m1/4266741-3908487-default/instance/listDashboardSpaces', params, { headers: { mergeParams: false } });
};
