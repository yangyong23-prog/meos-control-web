import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { useShellPrecisionConfig } from '@/hooks/useShellPrecisionConfig';
import { nanoid } from 'nanoid';

/**
 * 解析系统列表数据，将树形结构扁平化为一维数组
 * @param {Array} treeData - 树形结构的系统数据
 * @returns {Array} 扁平化的系统列表
 */
export const parseSystemList = treeData => {
    if (Array.isArray(treeData) && treeData.length > 0 && Array.isArray(treeData?.[0].children)) {
        let result = [];
        (treeData[0].children || []).forEach(outer => {
            const outerData = {
                isGroup: true,
                key: nanoid(),
                ...outer
            };
            result.push(outerData);
            (outer?.children || []).forEach(inner => {
                result.push({
                    isGroup: false,
                    key: nanoid(),
                    parent: outerData,
                    ...inner
                });
            });
        });
        return result;
    }
    return [];
};

/**
 * 设置运行监控类型（非Edge环境下设置头部配置）
 */
export const setRunningMonitorType = runningMonitorType => {
    if (isEdge()) return;
    baseStore().setHeaderConfig({ runningMonitorType: runningMonitorType });
    useShellPrecisionConfig().fetchShellPrecisionConfig();
};
