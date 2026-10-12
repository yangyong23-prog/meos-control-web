import { abnormalEventListKey, abnormalEventListUpdateTimeKey, abnormalEventListLoadedTimeKey, abnormalEventListLoadingKey } from './useBaseDataHook';
import { rightUnknownRiskEventListKey, targetSpaceEquipIdsKey, currentFloorSpacesWithEquipIdsKey } from './useBaseDataHook';
export default () => {
    const isScroll = ref(false);
    const abnormalEventList = inject(abnormalEventListKey);
    const abnormalEventListUpdateTime = inject(abnormalEventListUpdateTimeKey);
    const abnormalEventListLoadedTime = inject(abnormalEventListLoadedTimeKey);
    const abnormalEventListLoading = inject(abnormalEventListLoadingKey);
    const currentFloorSpacesWithEquipIds = inject(currentFloorSpacesWithEquipIdsKey);
    const targetSpaceEquipIds = inject(targetSpaceEquipIdsKey);
    const proxyAbnormalEventList = ref([]);
    const rightUnknownRiskEventList = inject(rightUnknownRiskEventListKey);
    const filterIds = ref([]);

    const getEquipmentIds = equipments => {
        if (!Array.isArray(equipments)) return [];
        return equipments.map(equipment => equipment.id);
    };

    const getItemIds = item => {
        const ids = [item.id];
        if (Array.isArray(item.equipmentsInSpace)) {
            ids.push(...getEquipmentIds(item.equipmentsInSpace));
        }
        return ids;
    };

    const getFilterIds = arr => {
        if (!Array.isArray(arr)) return [];
        let ids = [];
        for (const item of arr) {
            ids.push(...getItemIds(item));
        }
        return ids;
    };
    const handleScroll = () => {
        isScroll.value = true;
    };
    const renderList = computed(() => {
        if (!abnormalEventList?.value.length) {
            return [];
        }
        if (!filterIds?.value.length) {
            return abnormalEventList?.value;
        }
        const idMap = {};
        filterIds?.value.forEach(id => {
            idMap[id] = true;
        });
        return abnormalEventList?.value.filter(abnormal => {
            const { instances = [] } = abnormal;
            return instances.some(ins => idMap[ins.instanceId]);
        });
    });
    provide('isScroll', isScroll);
    watchEffect(() => {
        if (Array.isArray(currentFloorSpacesWithEquipIds.value) && currentFloorSpacesWithEquipIds.value.length > 0) {
            // filterIds.value = getFilterIds(currentSpacesWithEquips.value);
            filterIds.value = currentFloorSpacesWithEquipIds.value;
        } else {
            filterIds.value = targetSpaceEquipIds.value || [];
        }
    });
    return {
        abnormalEventList,
        abnormalEventListUpdateTime,
        abnormalEventListLoadedTime,
        abnormalEventListLoading,
        proxyAbnormalEventList,
        rightUnknownRiskEventList,
        filterIds,
        renderList,
        handleScroll
    };
};
