/*
 * @Author: guoxiaohuan
 * @Date: 2023-10-12 18:45:21
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-07-02 10:57:31
 * @Description:
 */
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 查询-模版类型列表
 * @param params
 * @returns
 */
export const listTemplateType = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/template/listTemplateType', params);

/**
 * 查询-当前模板下的所有场景
 * @param params
 * @returns
 */
export const listSceneConfig = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/demand/scene/listSceneConfig', params, config);

/**
 * 查询-获取存在场景配置的模板列表
 * @param params
 * @returns
 */
export const listExistsSceneConfigTemplate = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/demand/scene/listExistsSceneConfigTemplate', params, config);

/**
 * 操作-复制其他模板下的场景配置
 * @param params
 * @returns
 */
export const copySceneConfigByTemplate = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/scene/copySceneConfigByTemplate', params);

/**
 * 编辑-新增/修改模板下的场景信息
 * @param params
 * @returns
 */
export const editSceneConfigs = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/scene/editSceneConfigs', params);
/**
 * 查询-某场景下实例所对应的所有照明功能类型列表
 * @param params
 * @returns
 */
export const querySceneFuncTypeList = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/queryCircuitIdFuncTypeList', params);
export const querySceneFuncTypeListNew = (params, abortSignal) =>
    http.post(INTERFACE_PREFIX_MEOS + '/lighting/queryCircuitIdFuncTypeList', params, { headers: { mergeParams: false }, signal: abortSignal });
export const addIntervention = params => http.post(INTERFACE_PREFIX_MEOS + '/intervention/config/saveOrUpdate', params);
export const validIntervention = params => http.post(INTERFACE_PREFIX_MEOS + '/intervention/config/valid', params);
/**
 * 保存-某场景下实例所对应的所有照明功能类型列表
 * @param params
 * @returns
 */
export const saveSceneObjectSettings = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/editSceneObjectSettings', params);

/**
 * 查询-当前模板下的所有场景
 * @param params
 */
export const getSceneObjectSettings = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/getSceneObjectSettings', params);

/**
 * 查询-管控对象树和空间配置信息
 * @param params
 * @returns
 */
export const queryTreeControlledObject = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/query/treeControlledObject', params);

/**
 * 校验-编组名称是否存在
 * @param params
 * @returns
 */
export const checkGroupNameExists = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/instanceGroup/checkNameExists', params);

/**
 * 新增-实例编组
 * @param params
 * @returns
 */
export const addInstanceGroup = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/instanceGroup/add', params);

/**
 * 编辑-实例编组
 * @param params
 * @returns
 */
export const editInstanceGroup = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/instanceGroup/edit', params);

/**
 * 清除配置
 * @param params
 * @returns
 */
export const delClearData = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/clear', params);

/**
 * 获取空间下拉
 * @param params
 * @returns
 */
export const querySpaceFuncTypeList = (params, abortSignal = null) => {
    if (abortSignal) {
        return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/querySpaceFuncTypeList', params, { headers: { mergeParams: false }, signal: abortSignal });
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/querySpaceFuncTypeList', params);
};

/**
 * 删除某卡片的配置
 * @param params
 * @returns
 */
export const removeCurrentCardConfig = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/removeCurrentCardConfig', params);

/**
 * 查询-某场景下的照明回路功能类型树
 * @param params
 * @returns
 */
export const queryPreviewSceneFuncTypeList = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/querySceneFuncTypeList', params);

/**
 * 查询空间状态
 * @param params
 * @returns
 */
export const querySpaceModes = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/query/spaceCfgStatistics', params);

/**
 * 查询-回路统计
 * @param params
 * @returns
 */
export const queryCircuitObjCfgStatistics = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/query/circuitObjCfgStatistics', params);

// 查询-某模板下的照明回路功能类型树
export const queryTemplateFuncTypeList = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/queryTemplateFuncTypeList', params);

// 查询-预览当前模板回路配置详情
export const queryTemplateCircuitView = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/queryTemplateCircuitView', params);

// 查询-楼层关联照明回路
export const listFloorWithCircuits = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/listFloorWithCircuits', params);
// 查询-空间书否支持反馈调节
export const spaceFeedbackAdjustSettingsCheck = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/lighting/query/spaceFeedbackAdjustSettingsCheck', params);

/**
 * @description: 查询-实例编组列表
 * @param {*} params
 * @return {*}
 */
export const listInstanceGroup = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/demand/instanceGroup/list', params, config);
// export const listInstanceGroup = (params, config) => http.post('https://m1.apifoxmock.com/m1/5622601-5302169-default/demand/instanceGroup/list', params, config);
/**
 * @description: 查询-所有场景
 * @param {*} params
 * @return {*}
 */
export const listAllScene = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/scene/listAllScene', params);

/**
 * @description: 操作-复制其他场景配置
 * @param {*} params
 * @return {*}
 */
export const copySceneConfig = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/scene/copySceneConfig', params);

/**
 * @description: 删除场景
 * @param {*} params
 * @return {*}
 */
export const delScene = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/instanceGroup/del', params);
