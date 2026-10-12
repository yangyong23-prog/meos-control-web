import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

const urlPrefix = INTERFACE_PREFIX_MEOS;

type UnknownObject = Record<string, any>;

// 查询运行监测日志树
export const queryTemplateNodes = () => {
    return http.get(`${urlPrefix}/log-trace/query/template/group`);
};

// 分页查询-运行监测日志列表
export const getRunMonitorLogList = (params: UnknownObject, config?: UnknownObject) => {
    return http.post(`${urlPrefix}/log-trace/query/template/data`, params, config);
};

// 分页查询-运行监测日志列表-查询条件
export const getRunMonitorLogListBySearch = (params: UnknownObject, config?: UnknownObject) => {
    return http.post(`${urlPrefix}/log-trace/query/template/search/data`, params, config);
};
