import { ref } from 'vue';
import i18n from '@/localization';
import { $Message } from 'meri-plus';
import { getDynamicIotRulesList } from '@/apis/xshellConfiguration';
import { AIR_TERMINAL, GeneralZone, GRID, IOT_RUNNING, IOT_SETTING, SUCCESSCODE } from '@/utils/globalVariables';

const mergeUniqueIds = (...idGroups) => {
    return Array.from(new Set(idGroups.flat().filter(Boolean)));
};

// 新增项优先：若同一个空间重复出现，优先使用本次新增的展示信息。
const mergeSpaceListWithIncomingFirst = (currentList, incomingList) => {
    const nextMap = new Map();
    (incomingList || []).forEach(item => {
        if (item?.id) {
            nextMap.set(item.id, item);
        }
    });

    (currentList || []).forEach(item => {
        if (item?.id && !nextMap.has(item.id)) {
            nextMap.set(item.id, item);
        }
    });

    return Array.from(nextMap.values());
};

export const useSpaceWhitelistMerge = ({
    buildingFloorSpaceList,
    whitelistSpaceIds,
    spaceTreeData,
    loadFilteredSpaceTree,
    querySpacesByIotRules,
    mapIotRecordsToSpaceRows,
    mapTreeNodesToSpaceRows,
    fetchDynamicIOTData,
    sortSpacesByLocation
}) => {
    const checkedSpaceIds = ref([]);
    const tableResetKey = ref(0);

    const showAddByIotModal = ref(false);
    const showIotLoading = ref(false);
    const iotSelectedConditions = ref([]);

    const getIotConditionOptions = arr => {
        const prefix = i18n.global.t('meos_control_web.air_terminal_scope_iot_modal_prefix');
        const suffix = i18n.global.t('meos_control_web.air_terminal_scope_iot_modal_suffix');
        const dataText = i18n.global.t('meos_control_web.air_terminal_scope_iot_modal_data');

        return arr.map(v => {
            const { infoCode: code, aliasName } = v?.groupChildren?.[0]?.relInfoCodeConfigs?.[0] || {};
            return {
                code: code || v?.groupCode,
                matchLabel: v?.groupName,
                segments: [{ text: prefix }, { text: aliasName || v?.groupName, class: 'iot-modal-highlight' }, { text: dataText, class: 'iot-modal-highlight' }, { text: suffix }]
            };
        });
    };
    const iotConditionOptions = ref([]);
    const addByIotLoading = ref(false);

    const showAddBySpaceMapModal = ref(false);
    const beforeConfirmCallback = () => true;

    const clearSelectionState = () => {
        checkedSpaceIds.value = [];
        tableResetKey.value += 1;
    };

    const handleCheckedChange = checkeds => {
        checkedSpaceIds.value = (checkeds?.selecteds || []).map(item => item?.id).filter(Boolean);
    };

    const handleRemoveSpace = spaceId => {
        whitelistSpaceIds.value = whitelistSpaceIds.value.filter(id => id !== spaceId);
        checkedSpaceIds.value = checkedSpaceIds.value.filter(id => id !== spaceId);
    };

    const handleRemoveSelected = checkeds => {
        const checkedIds = (checkeds || [])
            .filter(item => item?.checked === 'checked')
            .map(item => item?.id)
            .filter(Boolean);

        if (!checkedIds.length) {
            return;
        }

        whitelistSpaceIds.value = whitelistSpaceIds.value.filter(id => !checkedIds.includes(id));
        clearSelectionState();
    };

    const openAddBySpaceMapModal = () => {
        spaceTreeData.value = [];
        showAddBySpaceMapModal.value = true;
        loadFilteredSpaceTree();
    };

    const loadIotConditionOptions = async () => {
        showIotLoading.value = true;
        const res = await getDynamicIotRulesList({
            runningMonitorType: AIR_TERMINAL,
            templateTypes: [GRID],
            classCodes: [GeneralZone],
            infoCodeTypes: [IOT_RUNNING, IOT_SETTING]
        }).finally(() => {
            showIotLoading.value = false;
        });
        if (res?.code === SUCCESSCODE) {
            const arr = res?.data?.[0]?.relInfoCodeGroupConfigs || [];
            const options = getIotConditionOptions(arr);
            iotConditionOptions.value = Array.isArray(options) ? options : [];
        }
    };

    const openAddByIotModal = async () => {
        iotSelectedConditions.value = [];
        showAddByIotModal.value = true;
        await loadIotConditionOptions();
    };

    const closeAddByIotModal = () => {
        showAddByIotModal.value = false;
    };

    const confirmAddByIot = async () => {
        if (!iotSelectedConditions.value.length) {
            $Message.error({ title: i18n.global.t('meos_control_web.air_terminal_scope_iot_modal_select_tip') });
            return;
        }

        const selectedSet = new Set(iotSelectedConditions.value);

        addByIotLoading.value = true;
        const resData = await querySpacesByIotRules([...selectedSet]).catch(() => {
            addByIotLoading.value = false;
        });

        // 查询失败时保持历史行为：关闭弹窗并重置勾选态。
        if (resData === null) {
            addByIotLoading.value = false;
            clearSelectionState();
            closeAddByIotModal();
            return;
        }

        const matchedIds = (resData || []).map(v => v?.id).filter(Boolean);
        if (!matchedIds.length) {
            addByIotLoading.value = false;
            $Message.error({ title: i18n.global.t('meos_control_web.air_terminal_scope_iot_modal_no_match_tip') });
            return;
        }

        whitelistSpaceIds.value = mergeUniqueIds(whitelistSpaceIds.value, matchedIds);

        // IOT 接口返回的是轻量空间信息，这里统一转换为表格结构并补充楼栋/楼层字段。
        const addSpaceData = mapIotRecordsToSpaceRows(resData);
        const mergedList = mergeSpaceListWithIncomingFirst(buildingFloorSpaceList.value, addSpaceData);
        buildingFloorSpaceList.value = await fetchDynamicIOTData(sortSpacesByLocation(mergedList)).finally(() => {
            addByIotLoading.value = false;
        });

        clearSelectionState();
        closeAddByIotModal();
    };

    const confirmAddBySpaceMap = async (spaceIds, relatedNodes, { successCallback }) => {
        const addSpaceIds = spaceIds.value || [];
        whitelistSpaceIds.value = mergeUniqueIds(whitelistSpaceIds.value, addSpaceIds);

        // 树节点结构较复杂，这里只提取表格需要的最小字段。
        const addSpaceData = mapTreeNodesToSpaceRows(relatedNodes);
        const mergedList = mergeSpaceListWithIncomingFirst(buildingFloorSpaceList.value, addSpaceData);
        buildingFloorSpaceList.value = await fetchDynamicIOTData(sortSpacesByLocation(mergedList));

        clearSelectionState();
        successCallback?.();
    };

    const confirmClearAll = () => {
        if (!whitelistSpaceIds.value.length) {
            return;
        }

        whitelistSpaceIds.value = [];
        clearSelectionState();
    };

    return {
        whitelistSpaceIds,
        checkedSpaceIds,
        tableResetKey,
        showAddByIotModal,
        iotSelectedConditions,
        addByIotLoading,
        showIotLoading,
        iotConditionOptions,
        showAddBySpaceMapModal,
        beforeConfirmCallback,
        handleCheckedChange,
        handleRemoveSpace,
        handleRemoveSelected,
        openAddBySpaceMapModal,
        openAddByIotModal,
        closeAddByIotModal,
        confirmAddByIot,
        confirmAddBySpaceMap,
        confirmClearAll
    };
};
