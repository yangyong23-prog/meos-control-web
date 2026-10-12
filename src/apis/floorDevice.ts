import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 楼层末端设备列表
 * @param params
 * @returns
 */
export const getTerminalStatistics = (params: { floorId: string }) => http.post(`${INTERFACE_PREFIX_MEOS}/terminal-equipment/queryTerminalStatistics`, params);

/**
 * 切换控制模式
 * @param params
 * @returns
 */
export const changeManualAutoStatus = (params: { floorId: string; classCode: string; model: string; objIdList: any; operateReason: string; expireTime: string }) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/terminal-equipment/changeManualAutoStatus`, params);

/**
 * 解除干预
 * @param params
 * @returns
 */
export const relieveIntervene = (params: { floorId: string; classCode: string; objIdList: any }) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/terminal-equipment/relieveIntervene`, params);

/**
 * 批量控制
 * @param params
 * @returns
 */
export const batchSetOperatingParameters = (params: {
    floorId: string;
    classCode: string;
    objIdList: any;
    value: string;
    infoCode: string;
    operateReason: string;
    expireTime: string;
}) => http.post(`${INTERFACE_PREFIX_MEOS}/terminal-equipment/batchSetOperatingParameters`, params);
