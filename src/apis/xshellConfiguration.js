/*
 * @Author: guoxiaohuan
 * @Date: 2023-10-12 18:45:21
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2023-12-26 19:48:05
 * @Description:
 */
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_BDTP_KNOWLEDGE, INTERFACE_PREFIX_ENERGY_RESEARCH } from '@/config';

/**
 * 查询壳配置数据列表
 * @param params
 * @returns
 */
export const shellConfigQuery = (params, signal) =>
    http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/query', params, {
        signal
    });

/**
 * 查询壳配置数据列表-简易
 * @param params
 * @returns
 */
export const shellConfigQuerySimple = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/query', params);

/**
 * 保存壳配置数据
 * @param params
 * @returns
 */
export const shellConfigSave = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/save', params);

/**
 * 启动算法计算接口
 * @param params
 * @returns
 */
export const startAlgorithmCalculation = params => http.post(INTERFACE_PREFIX_MEOS + '/aiStrategic/startAlgorithmCalculation', params, { headers: { mergeParams: false } });

/**
 * 修改AI算法开关状态
 * @param params
 * @returns
 */
export const changeAlgorithmConfig = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/changeAlgorithmConfig', params);

/**
 * 查询AI算法开关状态
 * @param params
 * @returns
 */
export const getAlgorithmConfig = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/getAlgorithmConfig', params);

// 查询时序大模型策略开关状态
export const getTimeSeriesModelConfig = params => http.get(INTERFACE_PREFIX_MEOS + '/shellConfig/listLtsmConfig', params);

// 修改时序大模型策略开关状态
export const changeTimeSeriesModelConfig = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/changeLtsmConfig', params);

// 查询壳配置类别列表(v5.240501)
export const getGroupList = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/getGroupList', params);

// 保存壳配置
export const saveConfigParamByGroup = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/saveConfigParamByGroup', params);

//获取壳配置数据
export const queryConfigParamByGroup = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/queryConfigParamByGroup', params);

//查询字典数据
export const listTypeByCode = params => http.post(INTERFACE_PREFIX_BDTP_KNOWLEDGE + '/api/type/listTypeByCode', params, { headers: { mergeParams: false } });

/**
 * 查询MPC配置数据
 * @param params
 * @returns
 */
export const queryMpcAgentCfg = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/queryMpcAgentCfg', params, { headers: { mergeParams: false }, ...config });

/**
 * MPC配置数据
 * @param params
 * @returns
 */
export const mpcAgentCfg = params => http.post(INTERFACE_PREFIX_MEOS + '/shellConfig/mpcAgentCfg', params, { headers: { mergeParams: false } });

/**
 * 获取楼层公共信息
 * @param params
 * @returns
 */
export const getTreeBuildingFloorSpace = params => http.post(INTERFACE_PREFIX_MEOS + '/instance/treeBuildingFloorSpace', params);

/**
 * 获取能耗模型选项
 * @param params
 * @returns
 */
export const getEnergyModelsOptions = (params, config) => http.post(INTERFACE_PREFIX_ENERGY_RESEARCH + '/common/api/energy/type/project/model', params, config);

/**
 * 获取能耗模型分项选项
 * @param params
 * @returns
 */
export const getEnergyModelsSubOptions = (params, config) => http.post(INTERFACE_PREFIX_ENERGY_RESEARCH + '/common/api/energy/model/item/list', params, config);

/**
 * 轮训接口 - 获取计算时间
 * @param params
 * @returns
 */
export const getLoopTime = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/cacheRwd/getBuildStatus', params, { autoHandleError: false, ...config });

/**
 * 查询空间列表
 * @param params
 * @returns
 */
export const getSpaceListObject = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/instance/listObject', params, config);

/**
 * 触发末端管理范围计算
 * @param params
 * @returns
 */
export const triggerBuildCache = params => http.post(INTERFACE_PREFIX_MEOS + '/cacheRwd/triggerBuildCache', params);

/**
 * 查询白名单
 */
export const queryWhitelist = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/cacheRwd/whitelist/query', params, config);

/**
 * 保存白名单
 */
export const submitWhitelist = params => http.post(INTERFACE_PREFIX_MEOS + '/cacheRwd/whitelist/save', params);

/**
 * 请求动态IOT规则列表
 */
export const getDynamicIotRulesList = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/infoCodeConfig/listOriginInfoCodeConfigs', params, config);

export const queryACShellSpace = postData => http.post(`${INTERFACE_PREFIX_MEOS}/cacheRwd/listAirTerminalControlSpaces`, postData);
