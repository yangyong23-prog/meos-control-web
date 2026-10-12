// @ts-ignore
import i18n from '@/localization';
import { SMD_ALL_OPEN, SMD_ALL_CLOSE, SMD_OPEN, SMD_CLOSE, NOT_CONFIGURED, SMD_PARTIAL_OPEN } from '../constant/index';
import { curMenuIdKey } from './useGlobalData';

export const useConfigDynamicModal = collapseDataList => {
    const baseViewItem = { groupList: [], loopList: [], showType: 'loop' };
    const currentViewItem = ref(baseViewItem);
    const currentViewModeIsPreview = ref(true);
    const showViewModal = ref(false);
    const curPreviewGroupRow = ref(null);

    const templateType = inject(curMenuIdKey);

    const switchMode = (row, toMode) => {
        let newRow = row;
        collapseDataList.value = collapseDataList.value.map(v => {
            if (v?.id === row?.id) {
                const lastSettingMode = v?.settingMode;
                const isEmptyGroup = v?.groupList?.length === 0;
                const showType =
                    [SMD_ALL_OPEN, SMD_ALL_CLOSE].includes(toMode) || isEmptyGroup ? 'loop' : v?.settingMode === NOT_CONFIGURED || !v?.settingMode ? 'group' : v?.showType;

                const newLoopList = v?.loopList?.map(loop => {
                    const settingMode = toMode === SMD_ALL_OPEN ? SMD_OPEN : toMode === SMD_ALL_CLOSE ? SMD_CLOSE : loop.settingMode;
                    return { ...loop, settingMode };
                });
                const newOpenCount = [SMD_ALL_OPEN, SMD_ALL_CLOSE].includes(toMode) ? newLoopList.filter(item => item.settingMode === SMD_OPEN).length : v?.openCount;
                const newUnConfigCount = [SMD_ALL_OPEN, SMD_ALL_CLOSE].includes(toMode)
                    ? newLoopList.filter(item => item.settingMode === NOT_CONFIGURED || !item.settingMode).length
                    : v?.unConfigCount;
                newRow = {
                    ...v,
                    lastSettingMode,
                    settingMode: toMode,
                    loopList: newLoopList,
                    showType,
                    tableShowType: [SMD_ALL_OPEN, SMD_ALL_CLOSE].includes(toMode) ? showType : v?.tableShowType || showType,
                    openCount: newOpenCount,
                    unConfigCount: newUnConfigCount
                };
                return newRow;
            }
            return v;
        });
        if (toMode === SMD_PARTIAL_OPEN) {
            const cloneNewRow = structuredClone(newRow);

            // 全开、全关，切换部分开启时重置配置模式
            if ([SMD_ALL_OPEN, SMD_ALL_CLOSE].includes(cloneNewRow.lastSettingMode)) {
                cloneNewRow.loopList = cloneNewRow?.loopList?.map(loop => {
                    return {
                        ...loop,
                        settingMode: NOT_CONFIGURED
                    };
                });
                cloneNewRow.groupList = cloneNewRow?.groupList?.map(loop => {
                    return {
                        ...loop,
                        settingMode: NOT_CONFIGURED
                    };
                });
            }

            const lastTableShowType = cloneNewRow.tableShowType;
            if (lastTableShowType === 'group') {
                // 上次列表配置模式为分组时，切换部分开启时重置回路配置模式
                cloneNewRow.loopList = cloneNewRow?.loopList?.map(loop => {
                    return {
                        ...loop,
                        settingMode: NOT_CONFIGURED
                    };
                });
            } else {
                // 上次列表配置模式为回路时，切换部分开启时重置分组配置模式
                cloneNewRow.groupList = cloneNewRow?.groupList?.map(loop => {
                    return {
                        ...loop,
                        settingMode: NOT_CONFIGURED
                    };
                });
            }

            currentViewModeIsPreview.value = false;
            currentViewItem.value = cloneNewRow;
            showViewModal.value = true;
        }
    };

    const viewMoreModal = curItem => {
        currentViewModeIsPreview.value = true;
        currentViewItem.value = structuredClone(curItem);
        showViewModal.value = true;
    };

    const closeViewModal = cancel => {
        if (cancel && !currentViewModeIsPreview.value && currentViewItem.value.settingMode === SMD_PARTIAL_OPEN && currentViewItem.value.lastSettingMode !== SMD_PARTIAL_OPEN) {
            switchMode(currentViewItem.value, currentViewItem.value.lastSettingMode);
        }
        currentViewModeIsPreview.value = true;
        currentViewItem.value = baseViewItem;
    };

    const previewGroup = row => {
        curPreviewGroupRow.value = structuredClone(row);
    };

    const handleSave = newObj => {
        collapseDataList.value = collapseDataList.value.map(v => {
            if (v?.id === currentViewItem.value?.id) {
                return { ...v, ...newObj };
            }
            return v;
        });
    };

    return { viewMoreModal, closeViewModal, previewGroup, handleSave, switchMode, templateType, currentViewItem, currentViewModeIsPreview, curPreviewGroupRow, showViewModal };
};
