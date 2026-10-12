// @ts-ignore
import i18n from '@/localization';
import { currentFloorObjKey } from '@/views/toilet/hooks/useBaseDataHook';
import { OBJ_TYPE } from '@/utils/globalVariables';

export default emits => {
    const currentFloorObj = inject(currentFloorObjKey);
    const spacesAndEquipsLoading = ref(false);
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

    const floorSearchData = inject('floorSearchData');

    // 筛选数据
    const searchData = computed(() => {
        const spaces = floorSearchData.value.filter(o => o.objType === OBJ_TYPE.SPACE);
        const equips = floorSearchData.value.filter(o => o.objType === OBJ_TYPE.EQUIPMENT);
        return { spaces, equips };
    });

    return {
        searchData,
        spacesAndEquipsLoading,
        curBuildingName,
        curFloorName,
        goBack,
        chooseObj,
        hoverObj,
        unhoverObj
    };
};
