import http, { HttpResponse } from '@/utils/http';
import { INTERFACE_PREFIX_MEOS_DTP, INTERFACE_PREFIX_MEOS } from '@/config';
// 定义日报相关的API接口

// 日报数据类型定义
export interface DailyReportData {
    reportDate: string;
    overview: {
        electricity: {
            current: number;
            prev: number;
            trend: number;
            monthlyTotal: number;
        };
        budget: {
            rate: number;
            budget: number;
            actual: number;
            monthlyBudget: number;
            monthlyActual: number;
            monthlyRate: number;
            monthlyBudgetUsedRate: number;
            totalMonthBudget: number;
        };
        weather: {
            temp: number;
            humidity: number;
            status: string;
            tempRange: string;
            humidRange: string;
        };
    };
    acResults: {
        tempRate: number;
        overCoolRooms: number;
        longCoolRooms: number;
        longHeatRooms: number;
        overHeatRooms: number;
        standard: string;
        strategy: string;
        runStatusDescription: string;
        exceptionLogsEmptyMessage: string;
        westPlant: {
            plantName: string;
            runtime: string;
            rate: number;
            consumption: number;
            trend: number;
        };
        exceptionLogs: Array<{
            time: string;
            device: string;
            action: string;
        }>;
    };
    // 更多字段...
}

// 获取报告章节目录树
export const getReportChapterTree = (params?: Record<string, any>): HttpResponse<any> => {
    return http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/report/chapterTree', params, { headers: { mergeParams: false } });
};
// 获取报告章节详情数据
export const getReportChapterDetail = (params?: Record<string, any>): HttpResponse<any> => {
    return http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/report/detail', params, { headers: { mergeParams: false } });
};

export const treeBuildingFloorSpace = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/instance/treeBuildingFloorSpace', params);

export const getListTreeBuildingFloorSpace = (params: any, signal?: any) => http.post(INTERFACE_PREFIX_MEOS + '/instance/treeBuildingFloorSpace', params, { signal });

// 查询人工干预记录
export const queryRunningLogListByPage = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/runningLog/queryRunningLogListByPage', params);

/**
 * @description: 【时间表】查询-需求策略列表
 * @param {*} data
 * @return {*}
 */
export const listStrategy = (data, config) => http.post(`${INTERFACE_PREFIX_MEOS_DTP}/demandStrategy/listStrategy`, data, { ...config });

/**
 * 【通用】查询-时间表编码定义
 * @param {*} params
 * @returns
 */
export const listScheduleInfoCodeDefine = params => http.get(INTERFACE_PREFIX_MEOS_DTP + '/demandStrategy/listScheduleInfoCodeDefine', params);
/**
 * 【通用】查询-报告备注列表
 * @param {*} params 报告id列表
 * @returns
 */
export const queryReportRemarkList = params => http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/report/remark/list', params, { headers: { mergeParams: false } });
/**
 * 【通用】保存-报告备注列表
 * @param {*} params 数组，数组里对象字段包括reportId（报告id）和remark（备注内容）objectId （对象id：当章节对应系统实例，或空调控制分区时）
 * @returns
 */
export const saveReportRemarkList = params => http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/report/remark/save', params, { headers: { mergeParams: false } });

/**
 * 下载报告
 * @param {*} params reportDate和reportType
 * @returns
 */
export const downloadReport = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/report/download', params, {
        responseType: 'blob'
    });
};
