// @ts-ignore
import i18n from '@/localization';
// import { currentFloorObjKey } from '@/views/toilet/hooks/useBaseDataHook';

import { currentFloorObjInjectKey, curFloorEquipmentListKey, curModelEquipmentListKey } from '../../hooks/useBaseHook';
export default emits => {
    const currentFloorObj = inject(currentFloorObjInjectKey);
    const spacesAndEquipsLoading = ref(false);
    const curFloorEquipmentList = inject(curFloorEquipmentListKey);
    const equipmentList = inject(curModelEquipmentListKey);
    const curBuildingName = computed(() => {
        return `${currentFloorObj?.value?.buildingLocalName || ''}`;
    });
    const curFloorName = computed(() => {
        return `${currentFloorObj?.value?.floorName || currentFloorObj?.value?.localName || ''}`;
    });
    const goBack = () => {
        currentFloorObj.value = {};
    };
    const chooseObj = obj => {
        emits('chooseObj', obj);
    };
    const hoverObj = obj => {
        emits('hoverObj', obj);
    };
    const unhoverObj = () => {
        emits('unhoverObj');
    };

    // 搜索数据
    const searchEquips = computed(() => {
        return currentFloorObj.value?.id ? curFloorEquipmentList.value : equipmentList.value;
    });

    return {
        searchEquips,
        spacesAndEquipsLoading,
        curBuildingName,
        curFloorName,
        currentFloorObj,
        goBack,
        chooseObj,
        hoverObj,
        unhoverObj
    };
};
