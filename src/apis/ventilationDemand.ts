import http from '@/utils/http';
import useStore from '@/store';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 获取楼层树
 * @param params
 * @returns
 */
export const getTree = (params: { isFilterInfoCodeTdb: boolean } = { isFilterInfoCodeTdb: true }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/ventilation/treeSettingObject', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 获取楼层树-历史配置
 * @param params
 * @returns
 */
export const getHistoryTree = (params: { isFilterInfoCodeTdb: boolean } = { isFilterInfoCodeTdb: true }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/ventilation/history/treeSettingObject', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 获取-对象配置
 * @param params
 * @returns
 */
export const getObjectSetting = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/ventilation/getObjectSetting', params);
};

/**
 * 获取-对象配置-历史配置
 * @param params
 * @returns
 */
export const getObjectHistorySetting = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/ventilation/history/getObjectSetting', params);
};
/**
 * 更改-对象配置
 * @param params
 * @returns
 */
export const editObjectSetting = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/ventilation/editObjectSetting', params);
};

/**
 * 重置、清除配置
 * @param params
 * @returns
 */
export const resetObjectSetting = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/ventilation/resetObjectSetting', params);
};

/**
 * 获取模板
 * @param params
 * @returns
 */
export const listTemplate = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/template/listTemplate', params);
};
/**
 * 模板编辑
 * @param params
 * @returns
 */
export const editTemplate = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/template/editTemplate', params);
};
/**
 * 模板删除
 * @param params
 * @returns
 */
export const delTemplate = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/template/delTemplate', params);
};
/**
 * 日期配置
 * @param params
 * @returns
 */
export const checkExistsDateSettingInFuture = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/template/checkExistsDateSettingInFuture', params);
};
