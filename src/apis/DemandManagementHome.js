import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_ENERGY_QUALITY, INTERFACE_PREFIX_EMS } from '@/config';
/**
 * 需求管理查询配置 [需求目标]
 */
export const listConfigsByInstance = (postData, signal) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/demand/config/listConfigsByInstance`, postData, {
        signal
    });

/**
 * 需求管理查询配置 [性能优化版本]
 */
export const listConfigResultsByInstances = (postData, signal) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/demand/config/listConfigResultsByInstances`, postData, {
        signal
    });

/**
 * 新增实例配置
 */
export const addInstanceConfig = postData => http.post(`${INTERFACE_PREFIX_MEOS}/demand/addInstanceConfig`, postData);

// 新增需求配置
export const addDemandConfig = postData => http.post(`${INTERFACE_PREFIX_MEOS}/demand/addDemandConfig`, postData);

// 清除实例配置
export const removeInstanceConfig = postData => http.post(`${INTERFACE_PREFIX_MEOS}/demand/clearSettings`, postData);

// 取消引用
export const cancelReferenceConfig = postData => http.post(`${INTERFACE_PREFIX_MEOS}/demand/referenceSettings`, postData);

/**
 * 查询-模版类型列表
 * @param params
 * @returns
 */
export const listTemplateType = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/demand/template/listTemplateType', params, config);
/**
 * 查询实例下的空间功能类型
 */
export const listChildrenSpaceFuncTypes = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/listChildrenSpaceFuncTypes', params);
/**
 * 查询-需求空间树
 */
export const treeControlledObject = (postData, signal) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/treeControlledObject', postData, {
        signal
    });
/**
 * 屏蔽空间，已弃用
 */
// export const shieldSpace = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/shieldSpace', params);

/**
 * 屏蔽空间树
 */
export const treeShieldedObject = (params, signal) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/treeShieldedObject', params, {
        signal
    });

// 查询服务空间
export const getServiceSpaces = (params, signal) =>
    http.post(INTERFACE_PREFIX_MEOS + '/commonSpace/listObjectServiceSpaceByObjectId', params, {
        signal
    });

// 查询集团标准
export const queryStandard = params => http.post(INTERFACE_PREFIX_ENERGY_QUALITY + '/quality/common/queryStandard', params);

// 查询标准类型
export const queryZone = params => http.post(INTERFACE_PREFIX_EMS + '/Spring/MVC/entrance/unifier/getProjectByIdService', params);
// 查询温度标准
export const listAirDateTagByRule = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/openingCalendar/listAirDateTagByRule', params);

// 查询-空调工况与壳配置综合后的配置
export const getWorkConditionByShellConfigData = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/airconditioning/getWorkConditionByShellConfigData', params);

// 复制模板
export const copyTemplate = params => http.post(INTERFACE_PREFIX_MEOS + '/demand/copyConfigs', params);
