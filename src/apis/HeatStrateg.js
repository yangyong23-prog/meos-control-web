import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP } from '@/config';
/**
 *【热源策略】查看热源策略列表
 */
export const listFixedTimeStrategy = postData => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/hotStationStrategyIntervention/listFixedTimeStrategy`, postData);
/**
 * 【热源策略】新建热源固定时间策略
 */
export const addFixedTimeStrategy = postData => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/hotStationStrategyIntervention/addFixedTimeStrategy`, postData);
/**
 * 【热源策略】修改固定时间点策略
 */
export const updateFixedTimeStrategy = postData => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/hotStationStrategyIntervention/updateFixedTimeStrategy`, postData);
/**
 * 【热源策略】删除固定时间点策略
 */
export const deleteFixedTimeStrategy = postData => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/hotStationStrategyIntervention/deleteFixedTimeStrategy`, postData);
/**
 * 查询已配置的策略月份
 */
export const listFixedStrategyDateByMonth = postData => http.post(INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/listFixedStrategyDateByMonth', postData);
/**
 *  校验固定时间策略
 */
export const checkFixedStrategy = postData => http.post(INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/checkFixedStrategy', postData);
/**
 * 【热源策略】获取系统当前交付的供回水温差设定/供回水压差设定类型
 */
export const getHotWaterDetaSetType = postData => http.get(INTERFACE_PREFIX_MEOS_DTP + '/hotStationStrategyIntervention/getHotWaterDetaSetType', postData);
