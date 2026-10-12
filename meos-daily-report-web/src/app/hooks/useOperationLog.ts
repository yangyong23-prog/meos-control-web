import { useState } from 'react';
import { queryRunningLogListByPage as apiQueryRunningLogListByPage } from '../../apis/reportApi';
import { store } from '@/store';
import { dayTz } from '@/utils/dayjsTool';

// 运行日志数据类型定义
interface RunningLog {
    id: string;
    time: string;
    category: string;
    tag: string;
    operator: string;
    object: string;
    content: string;
    effectiveTime: string;
    reason: string;
    logData: object;
}

// 分页响应数据类型定义
interface PaginationResponse {
    data: RunningLog[];
}

const getLogParams = (logDate: string, secondLevelCategory: string, objectIds?: string[], page = 1, pageSize = 10000) => {
    const start = `${logDate} 00:00:00`;
    const end = `${logDate} 23:59:59`;
    const currentTime = dayTz().format('YYYY-MM-DD HH:mm:ss');
    return {
        projectId: store.getState().base.projectId || '',
        startTime: start,
        endTime: end,
        type: '2', // 人工操作日志
        keyWord: '',
        effectTime: null,
        systemId: '',
        objectIds: objectIds || [],
        pageNumber: page,
        pageSize: pageSize,
        orderBy: '',
        firstLevelCategory: 'airConditioningColdSource', // 空调制冷源
        secondLevelCategory: secondLevelCategory,
        createTime: currentTime,
        dataEndTime: end,
        dataStartTime: start,
        effectStartTime: null,
        workDate: currentTime
    };
};

/**
 * 直接导出查询方法，方便单独使用
 * @param logDate 日志日期，格式：YYYY-MM-DD
 * @param secondLevelCategory 二级分类，默认：''
 * @param page 页码，默认：1
 * @param pageSize 每页大小，默认：10000 (这里暂时不需要分页，所以给个大数字)
 * @returns 分页响应数据
 */
export const queryRunningLogListByPage = async (logDate: string, secondLevelCategory: string, objectIds?: string[], page = 1, pageSize = 10000): Promise<PaginationResponse> => {
    // 调用真实的API接口
    try {
        const response = await apiQueryRunningLogListByPage(getLogParams(logDate, secondLevelCategory, objectIds, page, pageSize));

        console.log('response', response.data);
        // 处理API响应数据
        if (response.data && response.data.code === '00000') {
            const apiData = response.data.data || [];

            // 转换数据格式以匹配本地接口
            const formattedData: RunningLog[] = apiData.map((record: any) => ({
                id: record.traceId,
                time: record.createTime,
                category: record.category,
                tag: record.type,
                operator: record.createUser,
                object: record.objectName,
                content: record.contentDesc,
                effectiveTime:
                    record.effectStartTime && record.effectEndTime
                        ? `${dayTz(record.effectStartTime).format('YYYY.MM.DD HH:mm:ss')}-${dayTz(record.effectEndTime).format('YYYY.MM.DD HH:mm:ss')}`
                        : '--',
                reason: record.content?.reasonSource || '--',
                logData: record
            }));

            return {
                data: formattedData
            };
        } else {
            throw new Error(response.data?.message || '查询运行日志失败');
        }
    } catch (err) {
        return {
            data: []
        };
    }
};
