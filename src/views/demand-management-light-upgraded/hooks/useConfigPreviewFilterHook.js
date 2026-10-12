// @ts-ignore
import i18n from '@/localization';
import { currentLoopsKey, loopIdMapSourceKey, rightTableLoopsKey } from './useConfigPreviewHook';
import { NOT_CONFIGURED } from '../constant/index';

import { globalModuleListMapKey } from './useGlobalData';
import _, { trim } from 'lodash';
export function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义所有正则元字符
}
// 配置预览右侧列表搜索项
export const configPreviewModalTableQueryKey = Symbol('configPreviewModalTableQueryKey');
// 配置预览右侧列表搜索函数
export const configPreviewFilterFuncKey = Symbol('configPreviewFilterFuncKey');
// 配置预览右侧列表分页参数
export const configPreviewPageKey = Symbol('configPreviewPageKey');
// 最终的表格数据
export const configPreviewTableDataKey = Symbol('configPreviewTableDataKey');
// 配置预览右侧列表回路搜索
export const useConfigPreviewFilterHook = () => {
    const rightTableLoops = inject(rightTableLoopsKey);
    const tableData = ref([]);
    const loopIdMapSource = inject(loopIdMapSourceKey);
    const globalModuleListMap = inject(globalModuleListMapKey);
    const page = ref({
        current: 1,
        pageSize: 20,
        total: 0
    });
    const query = ref({
        name: '',
        settingModes: [],
        lampFuncTypes: [],
        funcTypes: [],
        relControllers: [],
        relSpaces: []
    });

    watch(rightTableLoops, () => {
        filterData();
    });

    const filterData = () => {
        tableData.value = [];
        console.log(query.value);
        if (page.value.current <= 0) {
            page.value.current = 1;
        }
        const data = rightTableLoops.value.filter(loop => {
            let valid = true;
            loop.settingMode = loopIdMapSource.value[loop.id]?.settingMode;
            loop.configSourceObjId = loopIdMapSource.value[loop.id]?.configSourceObjId;
            loop.configSourceObjName = loopIdMapSource.value[loop.id]?.configSourceObjName;
            if (loop.relController) {
                loop.inSpace = globalModuleListMap.value.get(loop.relController[0].id);
            }
            if (trim(query.value.name)) {
                const reg = new RegExp(escapeRegExp(trim(query.value.name)), 'gi');
                if (!reg.test(loop.localName)) {
                    valid = false;
                }
            }
            if (valid) {
                if (query.value.settingModes.length) {
                    if (!query.value.settingModes.includes(loop?.settingMode) && !(query.value.settingModes.includes(NOT_CONFIGURED) && !loop.settingMode)) {
                        valid = false;
                    }
                }
            }
            if (valid) {
                if (query.value.lampFuncTypes.length) {
                    if (!(query.value.lampFuncTypes.includes('') && !loop?.lampFuncType)) {
                        if (!query.value.lampFuncTypes.includes(loop?.lampFuncType)) {
                            valid = false;
                        }
                    }
                }
            }
            if (valid) {
                if (query.value.funcTypes.length) {
                    if (!query.value.funcTypes.includes(loop?.funcType)) {
                        valid = false;
                    }
                }
            }
            if (valid) {
                if (query.value.relSpaces.length) {
                    valid = false;
                    if (loop.relSpace) {
                        loop.relSpace.some(sp => {
                            if (query.value.relSpaces.includes(sp.id)) {
                                valid = true;
                                return true;
                            }
                            return false;
                        });
                    }
                }
            }
            if (valid) {
                if (query.value.relControllers.length) {
                    valid = false;
                    if (loop.relController) {
                        loop.relController.some(ctrl => {
                            if (query.value.relControllers.includes(ctrl.id)) {
                                valid = true;
                                return true;
                            }
                            return false;
                        });
                    }
                }
            }
            return valid;
        });
        page.value.total = data.length;
        data.slice((page.value.current - 1) * page.value.pageSize, page.value.current * page.value.pageSize).forEach(item => {
            tableData.value.push({
                ...item
            });
        });
    };
    provide(configPreviewTableDataKey, tableData);
    provide(configPreviewModalTableQueryKey, query);
    provide(configPreviewPageKey, page);
    provide(configPreviewFilterFuncKey, filterData);
    return {
        query,
        page,
        filterData
    };
};
