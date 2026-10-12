import { HttpResponse } from '@/types/common';
import { CLASSCODE } from '@/views/operationMonitoring/coolVariables';
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP } from '@/config';
import { isEdge } from '@/utils/envUtils';
// const INTERFACE_PREFIX_MEOS = '/meos-control-server-edge';
/**
 * @description: 查询策略对象列表
 * @param {} params
 * @return {*}
 */
export const getCooler = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/getCooler', params);

/**
 * @description: 查询策略对象列表
 * @param {} params
 * @return {*}
 */
export const listStrategyObject = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/listStrategyObject',
        Object.assign(params, {
            businessType: 'LAST_FREEZE_PUMP_GROUP',
            systemType: CLASSCODE()
        })
    );

/**
 * @description: 校验固定时间策略
 * @param {} params
 * @return {*}
 */
export const checkFixedStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/checkFixedStrategy',
        Object.assign(params, {
            systemType: CLASSCODE()
        })
    );

/**
 * @description: 查询已配置的策略月份
 * @param {} params
 * @return {*}
 */
export const listFixedStrategyDateByMonth = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/listFixedStrategyDateByMonth',
        Object.assign(params, {
            systemType: CLASSCODE()
        })
    );

/**
 * @description: 【冷机策略】查看冷机策略列表
 * @param {} params
 * @return {*}
 */
export const listFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/chillerStrategy/listFixedTimeStrategy',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'CHILLER_UNIT'
        })
    );

/**
 * @description: 【冷机策略】新建冷机固定时间策略
 * @param {} params
 * @return {*}
 */
export const chillerStrategyAddFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/chillerStrategy/addFixedTimeStrategy',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'CHILLER_UNIT'
        })
    );

/**
 * @description:【冷机策略】修改固定时间点策略
 * @param {} params
 * @return {*}
 */
export const updateFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/chillerStrategy/updateFixedTimeStrategy',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'CHILLER_UNIT'
        })
    );

/**
 * @description:【冷机策略】删除固定时间点策略
 * @param {} params
 * @return {*}
 */
export const deleteFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/chillerStrategy/deleteFixedTimeStrategy',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'CHILLER_UNIT'
        })
    );

/**
 * @description:【冷机策略】查看冷机策略列表-按日期范围
 * @param {} params
 * @return {*}
 */
export const chillListFixedTimeStrategyByDateRange = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/chillerStrategy/listFixedTimeStrategyByDateRange',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'CHILLER_UNIT'
        })
    );

/**
 * @description:【冷机策略】算法调用--查询冷机固定时间点策略
 * @param {} params
 * @return {*}
 */
export const queryByParam = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/chillerStrategy/queryByParam', params);

/**
 * @description:【末级冷冻泵组】查询运行策略
 * @param {} params
 * @return {*}
 */
export const listRunningStrategy = (params: any): HttpResponse<unknown> =>
    http.post((isEdge() ? INTERFACE_PREFIX_MEOS_DTP : INTERFACE_PREFIX_MEOS) + '/strategyIntervention/lastFreezePumpGroup/listRunningStrategy', params);

/**
 * @description:【末级冷冻泵组】查询固定时间策略
 * @param {} params
 * @return {*}
 */
export const lastFreezePumpGroupListFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/lastFreezePumpGroup/listFixedTimeStrategy',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'LAST_FREEZE_PUMP_GROUP'
        })
    );
/**
 * @description:【末级冷冻泵组】新增固定时间策略
 * @param {} params
 * @return {*}
 */
export const addFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/lastFreezePumpGroup/addFixedTimeStrategy',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'LAST_FREEZE_PUMP_GROUP'
        })
    );

/**
 * @description:【末级冷冻泵组】编辑固定时间策略
 * @param {} params
 * @return {*}
 */
export const editFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/lastFreezePumpGroup/editFixedTimeStrategy',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'LAST_FREEZE_PUMP_GROUP'
        })
    );

/**
 * @description:【末级冷冻泵组】删除固定时间策略
 * @param {} params
 * @return {*}
 */
export const delFixedTimeStrategy = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/lastFreezePumpGroup/delFixedTimeStrategy',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'LAST_FREEZE_PUMP_GROUP'
        })
    );

/**
 * @description:【末级冷冻泵组】获取信息点设置类型
 * @param {} params
 * @return {*}
 */
export const listBranchDateType = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS + '/strategyIntervention/lastFreezePumpGroup/listBranchDateType',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'LAST_FREEZE_PUMP_GROUP'
        })
    );
/**
 * @description:【末级冷冻泵组】查询固定时间策略-按日期范围
 * @param {} params
 * @return {*}
 */
export const listFixedTimeStrategyByDateRange = (params: any): HttpResponse<unknown> =>
    http.post(
        INTERFACE_PREFIX_MEOS_DTP + '/strategyIntervention/lastFreezePumpGroup/listFixedTimeStrategyByDateRange',
        Object.assign(params, {
            systemType: CLASSCODE(),
            businessType: 'LAST_FREEZE_PUMP_GROUP'
        })
    );

// 播报默认查询的接口
export const listLatestContent = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/pageBroadcast/listLatestContent', params);

// 策略转换保存接口
export const saveSupportAiConfig = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/saveSupportAiConfig', params);

// 策略控制器-查询算法是否支持AI策略
export const fetchSupportAi = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/fetchSupportAi', params);

// 策略控制器-本地获取AI策略状态
export const querySupportAi = (params: any): HttpResponse<unknown> => http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/querySupportAi', params);
