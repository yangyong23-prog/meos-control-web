import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 获取楼层公共信息
 * @param params
 * @returns
 */
export const getPublicList = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/instance/treeBuildingFloorSpace', params);
/**
 * 获取墙柱子信息
 * @param params
 * @returns
 */
export const getQueryColumnAndWallObjectByFloorId = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/instance/queryColumnAndWallObjectByFloorId', params);
/**
 * 获取管控楼层空间
 * @param params
 * @returns
 */
export const getQueryControlObjectTree = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/queryFloorAvgDataAndSpaceInfo', params);
/**
 * 获取建筑信息
 * @param params
 * @returns
 */
export const getListTreeBuildingFloorSpace = (params: any, signal: any) => http.post(INTERFACE_PREFIX_MEOS + '/instance/treeBuildingFloorSpace', params, { signal });
/**
 * 获取楼层树
 * @param params
 * @returns
 */
export const getTree = (params: { isFilterInfoCodeTdb: boolean } = { isFilterInfoCodeTdb: true }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/queryFloorAvgDataAndSpaceInfo', params);

/**
 * 获取楼层
 * @param params
 * @returns
 */
export const getListFloors = (params: { isFilterInfoCodeTdb: boolean } = { isFilterInfoCodeTdb: true }) => http.post(INTERFACE_PREFIX_MEOS + '/instance/listFloors', params);
/**
 * 获取空间
 * @param params
 * @returns
 */
export const getListSpaces = (params: { isFilterInfoCodeTdb: boolean } = { isFilterInfoCodeTdb: true }, signal?: any) =>
    http.post(INTERFACE_PREFIX_MEOS + '/instance/listSpaces', params, { signal });

/**
 * 查询-对象配置
 * @param params
 * @returns
 */
export const getQuerySpaceQuality = (params: { instanceId: string; instanceType: string }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/queryFloorAvgDataAndSpaceInfo', params);

/**
 * 查询-异常空间详情数据
 * @param params
 * @returns
 */
export const getQuerySpaceDemandInfo = (params: { instanceId: string; instanceType: string }) => http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/querySpaceDemandInfo', params);

/**
 * 查询-异常空间
 * @param params
 * @returns
 */
export const getQueryRealAbnormalSpaceList = (params: { instanceId: string; instanceType: string }) =>
    http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/queryRealAbnormalSpaceList', params);

/**
 * 操作-屏蔽空间
 * @param params
 * @returns
 */
export const setShieldSpace = (params: { spaceId: string; isShielded: boolean }) => http.post(INTERFACE_PREFIX_MEOS + '/demand/setting/shieldSpace', params);

/**
 * 新增-管控空间
 * @param params
 * @returns
 */
export const setControlSpace = (params: { spaceIds: string[]; isControlled: boolean }) => http.post(INTERFACE_PREFIX_MEOS + '/demand/setting/controlSpace', params);

/**
 * 查询-对象配置
 * @param params
 * @returns
 */
export const getObjectSetting = (params: { instanceId: string; instanceType: string }) => http.post(INTERFACE_PREFIX_MEOS + '/demand/setting/getObjectSetting', params);

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
}) => http.post(INTERFACE_PREFIX_MEOS + '/demand/setting/editObjectSetting', params);

/**
 * 编辑-恢复默认
 * @param params
 * @returns
 */
export const resetObjectSetting = (params: { instanceTypeAndIds: Record<string, string[]> }) => http.post(INTERFACE_PREFIX_MEOS + '/demand/setting/resetObjectSetting', params);
