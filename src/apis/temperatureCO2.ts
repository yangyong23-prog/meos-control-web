import http from '@/utils/http';
import useStore from '@/store';
import { INTERFACE_PREFIX_MEOS } from '@/config';
// const INTERFACE_PREFIX_MEOS = '/meos-control-server-edge';
/**
 * 获取楼层公共信息
 * @param params
 * @returns
 */
export const getPublicList = (params: any) =>
    http.post(INTERFACE_PREFIX_MEOS + '/instance/treeBuildingFloorSpace', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 获取楼层树
 * @param params
 * @returns
 */
export const getTree = (params: { isFilterInfoCodeTdb: boolean } = { isFilterInfoCodeTdb: true }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/treeControlledObject', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 获取楼层树
 * @param params
 * @returns
 */
export const treeUncontrolledObject = (params: { isFilterInfoCodeTdb: boolean } = { isFilterInfoCodeTdb: true }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/treeUncontrolledObject', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 操作-屏蔽空间
 * @param params
 * @returns
 */
export const setShieldSpace = (params: { spaceId: string; isShielded: boolean }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/shieldSpace', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 新增-管控空间
 * @param params
 * @returns
 */
export const setControlSpace = (params: { spaceIds: string[]; isControlled: boolean }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/controlSpace', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 查询-对象配置
 * @param params
 * @returns
 */
export const getObjectSetting = (params: { date?: any; dateMd?: string; instanceTypeAndIds: Record<string, string[]> }) => {
    if (params.date) {
        return http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/history/listObjectSetting', {
            templateTag: useStore().base.templateTag || 'DAYOFF',
            templateType: useStore().base.templateType,
            ...params
        });
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/listObjectSetting', {
        ...params,
        templateTag: useStore().base.templateTag || 'DAYOFF',
        date: params.dateMd
    });
};

/**
 * 编辑-对象配置
 * @param params
 * @returns
 */
export const editObjectSetting = (params: {
    instanceId: string;
    instanceType: string;
    isBusinessTimeReferenced: boolean;
    isParticipateInSchedulingReferenced: boolean;
    setting: any;
}) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/editObjectSetting', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 编辑-恢复默认
 * @param params
 * @returns
 */
export const resetObjectSetting = (params: { instanceTypeAndIds: Record<string, string[]> }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/resetObjectSetting', {
        templateTag: useStore().base.templateTag,
        ...params
    });

/**
 * 编辑-查询历史对象树
 * @param params
 * @returns
 */
export const treeControlledObject = (params: any) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/history/treeControlledObject', {
        templateTag: useStore().base.templateTag,
        templateType: useStore().base.templateType,
        ...params
    });

/**
 * 编辑-查询对象历史配置
 * @param params
 * @returns
 */
export const historyListObjectSetting = (params: { instanceTypeAndIds: Record<string, string[]> }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/history/listObjectSetting', {
        templateTag: useStore().base.templateTag,
        templateType: useStore().base.templateType,
        ...params
    });
