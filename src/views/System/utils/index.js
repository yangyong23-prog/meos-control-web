// @ts-ignore
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { useRoute } from 'vue-router';
import { nanoid } from 'nanoid';
import { SYSTEM_CONFIGS } from '../constant/config';

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
};

// 获取当前专业系统配置
export const getCurrentSystemConfig = () => {
    const route = useRoute();
    const majorCode = route.params.majorCode.toUpperCase();
    const currentConfig = SYSTEM_CONFIGS[majorCode];
    return { currentConfig, majorCode };
};
