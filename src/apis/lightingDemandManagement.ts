import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 获取-项目建筑楼层树
 * @param params
 * @returns
 */
export const getFloorTreeList = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/treeObject', params);
};

// 获取工作日历规则
export const getCalendarRule = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/getCalendarRule', params);
};
// 保存工作日历规则
export const saveCalendarRule = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/editCalendarRule', params);
};
// 获取空间&灯具类型
export const getSpaceOrLampsType = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/getTypeEnum', params);
};

// 获取基本配置
export const getBasicInfo = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/getProjectBasicConfig', params);
};
// 获取策略设置
export const getSetingInfo = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/listObjectStrategies', params);
};
// 照明回路对象
export const getListCircuitObject = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/treeCircuitObject', params);
};

// 基础配置保存
export const editProjectBasicConfig = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/editProjectBasicConfig', params);
};
// 策略配置保存
export const editObjectStrategy = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/editObjectStrategy', params);
};
// 策略配置类型
export const getObjectStrategyType = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/getObjectStrategyType', params);
};
/**
 * 获取照明编组
 * @param params
 * @returns
 */
export const getIlluminationList = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/listCustomCircuitGroupStrategies', params);
};
/**
 * 获取照明配置情况
 * @param params
 * @returns
 */
export const getTreeCircuitStrategyConfig = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/listCircuitStrategies', params);
};

/**
 * 切换视角
 * @param params
 * @returns
 */
export const switchStrategyType = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/switchStrategyType', params);
};
/**
 * 重置、清除配置
 * @param params
 * @returns
 */
export const resetStrategyConfig = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/resetStrategyConfig', params);
};

/**
 * 照明需求-空间下回路反馈调节配置是否重复校验
 */
export const checkLoopFeedbackConfigs = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/check/feedbackConfig', params);
};
