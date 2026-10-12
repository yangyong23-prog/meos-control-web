import Xsync from '@/utils/Xsync';
import { getMeoiServerUrl, getDtpServerUrl } from '@/utils/tools';
const modelType = () => sessionStorage.getItem('modelType');

export const getDutyHome = params =>
    Xsync({
        method: 'POST',
        url: `${getMeoiServerUrl()}/duty/homePage?` + (params?.systemList || ''),
        params
    });

export const todayLogSummary = () => {
    return Xsync({
        method: 'POST',
        url: `${getMeoiServerUrl()}/runningLog/todayLogSummary`
    });
};

export const getNumberOfChillers = params =>
    Xsync({
        method: 'POST',
        url: `${getMeoiServerUrl()}/strategyIntervention/getNumberOfChillers`,
        params
    });

export const getMenuConfig = params =>
    Xsync({
        method: 'GET',
        url: `${getMeoiServerUrl()}/system/graph/menu/config`,
        params
    });

/**
 * 【通用】查询-时间表编码定义
 * @param {*} params
 * @returns
 */
export const listScheduleInfoCodeDefine = params =>
    Xsync({
        method: 'GET',
        url: `${getDtpServerUrl()}/demandStrategy/listScheduleInfoCodeDefine`,
        params
    });

/**
 * @description: 【控制台】查询-运行控制台（包含供冷、蓄冷、空调分区）
 * @param {*} data
 * @return {*}
 */
export const allControllerParameter = (params, requestOptions = {}) =>
    Xsync({
        method: 'POST',
        url: `${getDtpServerUrl()}/runConsole/allControllerParameter`,
        params,
        modelType: modelType(),
        ...requestOptions
    });
