import http from '@/utils/http';
import {
    INTERFACE_PREFIX_MEOS_DTP,
    INTERFACE_PREFIX_MEOS,
    INTERFACE_PREFIX_AI_AUTORUN,
    INTERFACE_PREFIX_BDTP_WEATHER,
    INTERFACE_PREFIX_MID_CALENDAR,
    INTERFACE_PREFIX_MID_PERMISSION,
    INTERFACE_PREFIX_EMS,
    INTERFACE_PREFIX_IT_OPS
} from '@/config';

const getAiApiPrefix = () => {
    if (import.meta.env.DEV) {
        return '/ai-bdmpc-agent-edge';
    }
    return INTERFACE_PREFIX_AI_AUTORUN;
};

/**
 * 策略计算概况
 * @param params
 * @returns
 */
export const jobResult = params => http.post(`${getAiApiPrefix()}/strategy/jobResult`, params, { autoHandleError: false });
// export const jobResult = params => http.post('https://m1.apifoxmock.com/m1/7740474-7484941-default/strategy/jobResultMock', params, { autoHandleError: false });
// export const jobResult = params => http.post('https://qa-jtzg5.meosedge.com/ai-autorun-agent/strategy/jobResult', params);
// export const jobResult = params => http.post('https://m1.apifoxmock.com/m1/5622601-5302169-default/ai-autorun-agent/strategy/jobResult', params);

/**
 * 策略详情
 * @param params
 * @returns
 */
export const getStrategDetail = params => http.post(`${getAiApiPrefix()}/strategy/detail`, params, { autoHandleError: false });
// export const getStrategDetail = params => http.post('https://m1.apifoxmock.com/m1/7740474-7484941-default/strategy/stgyDetailMock', params, { autoHandleError: false });
// export const getStrategDetail = params => http.post('https://qa-jtzg5.meosedge.com/ai-autorun-agent/strategy/detail', params);
// export const getStrategDetail = params => http.post('https://m1.apifoxmock.com/m1/5622601-5302169-default/ai-autorun-agent/strategy/detail', params);

/**
 * 策略状态
 * @param params
 * @returns
 */
export const getJobState = params => http.post(`${getAiApiPrefix()}/strategy/jobState`, params, { autoHandleError: false });
// export const getJobState = params => http.post('https://m1.apifoxmock.com/m1/7740474-7484941-default/jobState', params, { autoHandleError: false });
// export const getStrategDetail = params => http.post('https://qa-jtzg5.meosedge.com/ai-autorun-agent/strategy/detail', params);
// export const getJobState = params => http.post('https://m1.apifoxmock.com/m1/5622601-5302169-default/ai-autorun-agent/strategy/jobState', params);

export const listObjects = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipments/AI', params, config);

export const getWorkTimes = params => http.post(INTERFACE_PREFIX_MEOS + '/midCalendar/listWorkTimes', params);

/**
 * 播报数据
 * @param params
 * @returns
 */
export const getBroadcast = params => http.post(INTERFACE_PREFIX_MEOS + '/ai/getDemandConfig', params);

/**
 * 播报数据
 * @param params
 * @returns
 */
export const getValueSelect = params => http.post(INTERFACE_PREFIX_MEOS + '/valueSelection/currentApplyConfig', params);

/**
 * 天气服务
 * @param params
 * @returns
 */
export const Hour24Forecast = params =>
    http.post(INTERFACE_PREFIX_BDTP_WEATHER + '/api/entrance/unifierJson/Hour24Forecast', params, { autoHandleError: false, headers: { mergeParams: false } });

/**
 * 自行查询天气服务-历史小时数据
 * @param params
 * @returns
 */
export const CommonCityHourWeatherService = params =>
    http.post(INTERFACE_PREFIX_BDTP_WEATHER + '/api/entrance/unifierJson/CommonCityHourWeatherService', params, { autoHandleError: false, headers: { mergeParams: false } });

/**
 * @description: 获取项目详情
 * @param {*} params
 * @return {*}
 */
export const getProjectByIdService = params =>
    http.post(INTERFACE_PREFIX_MID_PERMISSION + '/Spring/MVC/entrance/unifier/getProjectByIdService', params, { autoHandleError: false, headers: { mergeParams: false } });
/**
 * 获取空调季信息
 * @param {*} params
 * @returns
 */
export const getAcQuarter = (params, config) => http.post(INTERFACE_PREFIX_MID_CALENDAR + '/v2.0/work/calendar/getEveryDayDateTag', params, config);

export const listConfigsByInstance = (params, config) => http.post(`${INTERFACE_PREFIX_MEOS}/demand/config/listConfigsByInstance`, params, config);

/**
 * 获取系统开关服务ACCC
 * @param {*} params
 * @returns
 */
export const getACCCSystemRunning = params => http.post(INTERFACE_PREFIX_MEOS + '/strategyIntervention/chillerStrategy/listRunningStrategy', params);

/**
 * 获取系统开关服务ACAC
 * @param {*} params
 * @returns
 */
export const getACACSystemRunning = params => http.post(INTERFACE_PREFIX_MEOS_DTP + '/runConsole/allControllerParameter', params);

/**
 * 获取当前项目边缘测地址
 * @param {*} params
 * @returns
 */
export const getEdgeAdressByPj = params => http.post(INTERFACE_PREFIX_EMS + '/saas/project/domain/query', params, { autoHandleError: false });

/**
 * 判断边缘测网络是否通畅
 * @param {*} params
 * @returns
 */
export const getCanConnectEdge = params => http.post(INTERFACE_PREFIX_IT_OPS + '/om/serviceStatus/getLatestProjectStatus', params);
