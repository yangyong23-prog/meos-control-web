import { HttpResponse } from '@/types/common';
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP } from '@/config';
/**
 * @description: 查询当日运行模式
 * @param {} params
 * @return {*}
 */
export const getSystemRunningModel = (params: {
    systemId: string;
}): HttpResponse<{
    runModeSet: '4' | '1' | '2' | '3';
    expireTime: string;
}> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/cold-heat/getSystemRunningModel', params);

/**
 * @description: 修改系统的运行模式
 * @param {} params
 * @return {*}
 */
export const changeSystemRunningModel = (params: {
    systemId: string;
    expireTime: string;
    model: string | number;
    operateType: string;
    contentInfo: string;
}): HttpResponse<{
    data: boolean;
    code: string;
}> => http.post(INTERFACE_PREFIX_MEOS_DTP + '/cold-heat/changeSystemRunningModel', params);

/**
 * @description: 获取冷机调整的下拉原因
 * @param {} params
 * @return {*}
 */
export const queryCoolerConfigReason = (params: { classCode: string }): HttpResponse<any> => http.post(INTERFACE_PREFIX_MEOS + '/cool-heat/queryCoolerConfigReason', params);

/**
 * @description: 获取泵组信息
 * @param {} params
 * @return {*}
 */
export const queryPumpGroupObjectByPumpId = (params: { objectId: string; systemId: string }): HttpResponse<any> =>
    http.post(INTERFACE_PREFIX_MEOS + '/cold-heat/queryPumpGroupObjectByPumpId', params);
