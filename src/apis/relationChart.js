import http from '@/utils/http';
import { INTERFACE_PREFIX_AIM, INTERFACE_PREFIX_MEOS } from '@/config';

// 获取关系图列表
// systemObjectId=Pj9909990007&classCode=project
export const queryRelationChartList = (params, abortSignal) =>
    http.get(`${INTERFACE_PREFIX_MEOS}/system/graph/instance/select`, params, { headers: { mergeParams: false }, signal: abortSignal });

// 获取关系图实例
export const queryRelationChartInstance = (params, abortSignal) =>
    http.get(`${INTERFACE_PREFIX_MEOS}/system/graph/instance/${params.id}`, {}, { headers: { mergeParams: false }, signal: abortSignal });

// 根据获取系统图细节调整id
export const getSystemGraphDetailById = (params, abortSignal) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/systemGraphEditor/getSystemGraphDetailById`, params, { headers: { mergeParams: false }, signal: abortSignal });
//
// export const queryRelationChartList = params => http.get(`${INTERFACE_PREFIX_MEOS}/system/graph/instance/list/select`, params, { headers: { mergeParams: false } });
