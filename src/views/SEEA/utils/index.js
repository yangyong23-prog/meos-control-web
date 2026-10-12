// @ts-ignore
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { nanoid } from 'nanoid';
import _ from 'lodash';
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
};

/**
 * 合并classCode 映射ids 结构数据
 * @param {*} mapA
 * @param {*} mapB
 */
export const mergeClassCodeMapIds = (mapA, mapB) => {
    if (!mapA || _.isEmpty(mapA)) {
        return mapB;
    }
    if (!mapB || _.isEmpty(mapB)) {
        return mapA;
    }
    let codeMapIds = mapA;
    if (codeMapIds) {
        codeMapIds = { ...codeMapIds };
        if (mapB) {
            Object.keys(mapB).forEach(classCode => {
                const ids = mapB[classCode];
                if (ids) {
                    if (!codeMapIds[classCode]) {
                        codeMapIds[classCode] = [];
                    } else {
                        codeMapIds[classCode] = [...codeMapIds[classCode]];
                    }
                    ids.forEach(id => {
                        codeMapIds[classCode].push(id);
                    });
                }
            });
        }
        uniqueClassCodeIds(codeMapIds);
    }
    return codeMapIds;
};
export const mergeIdInfoCodes = (mapA, mapB) => {
    let idInfoCodes = mapA || mapB;
    if (idInfoCodes) {
        idInfoCodes = { ...idInfoCodes };
        if (mapB) {
            Object.keys(mapB).forEach(objId => {
                const codes = mapB[objId];
                if (codes) {
                    if (!idInfoCodes[objId]) {
                        idInfoCodes[objId] = [];
                    }
                    codes.forEach(code => {
                        idInfoCodes[objId].push(code);
                    });
                    idInfoCodes[objId] = [...new Set(idInfoCodes[objId])];
                }
            });
        }
    }
    return idInfoCodes;
};

// 去重/唯一classCode对应的ids
export const uniqueClassCodeIds = classCodeMapIds => {
    if (classCodeMapIds) {
        Object.keys(classCodeMapIds).forEach(_classCode => {
            if (classCodeMapIds[_classCode]) {
                classCodeMapIds[_classCode] = [...new Set(classCodeMapIds[_classCode])];
            }
        });
    }
};
