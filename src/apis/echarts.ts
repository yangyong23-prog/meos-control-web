/*
 * @Author: guoxiaohuan
 * @Date: 2024-04-15 16:58:44
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-04-17 16:32:29
 * @Description:
 */
import { HttpResponse } from '@/types/common';
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * @description: 系统运行看板-系统运行效率
 * @param {} params
 * @return {*}
 */
export const getSystemEfficiency = (params: { systemId: string }): HttpResponse<unknown> =>
    http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/getSystemEfficiency`, { systemId: params.systemId, systemCode: 'ACCC' });

/**
 * @description: 系统运行看板-冷机运行
 * @param {} params
 * @return {*}
 */
export const getChillerLoad = (params: { systemId: string }): HttpResponse<unknown> =>
    http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/getChillerLoad`, { systemId: params.systemId, systemCode: 'ACCC' });

/**
 * @description: 系统运行看板-冷却侧温度分析
 * @param {} params
 * @return {*}
 */
export const getChillingTemp = (params: { systemId: string }): HttpResponse<unknown> =>
    http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/getChillingTemp`, { systemId: params.systemId, systemCode: 'ACCC' });

/**
 * @description: 系统运行看板-冷冻侧供回水温差
 * @param {} params
 * @return {*}
 */
export const getFreezingTempDiff = (params: { systemId: string }): HttpResponse<unknown> =>
    http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/getFreezingTempDiff`, { systemId: params.systemId, systemCode: 'ACCC' });

/**
 * @description: 系统运行看板-冷冻侧供水温度
 * @param {} params
 * @return {*}
 */
export const getFreezingTemp = (params: { systemId: string }): HttpResponse<unknown> =>
    http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/getFreezingTemp`, { systemId: params.systemId, systemCode: 'ACCC' });

/**
 * @description: 系统运行看板-冷冻二次侧
 * @param {} params
 * @return {*}
 */
export const getFreezingSecondary = (params: { systemId: string }): HttpResponse<unknown> =>
    http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/getFreezingSecondary`, { systemId: params.systemId, systemCode: 'ACCC' });
