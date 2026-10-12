import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 日志分类列表
export const queryLogCategoryList = () => http.post(INTERFACE_PREFIX_MEOS + '/runningLog/logCategoryList');
// 日志列表
export const queryLogListByPage = (params: any, signal: any = null) => {
    if (signal) {
        return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/queryListByPage', params, { signal });
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/queryListByPage', params);
};
// 设备列表
export const queryEquipmentList = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/runningLog/equipmentList', params);
// 所属系统
export const querySystemListData = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/system/querySystemListData', params);
// 日志下载
export const runningLogExport = (params: any, signal: any = null) => {
    if (signal) {
        return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/export', params, { signal });
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/export', params);
};
// 日志标识
export const queryRunningLogType = (params?: any) => http.get(INTERFACE_PREFIX_MEOS + '/runningLog/queryRunningLogType', params);

// 新版日志系统 获取日志列表
export const queryRunningLogListByPage = (params: any, signal: any = null, config: any = {}) => {
    if (signal) {
        return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/queryRunningLogListByPage', params, { signal, ...config });
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/queryRunningLogListByPage', params, config);
};

// 新版日志系统 生成日志文档
export const downloadLog = (params: any, signal: any = null) => {
    if (signal) {
        return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/downloadLog', params, { signal });
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/downloadLog', params);
};
// 通过一级分类查询数据库中有的二级日志分类
export const getSecondLevelRunningLogCategory = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/runningLog/getSecondLevelRunningLogCategory', params);
};
