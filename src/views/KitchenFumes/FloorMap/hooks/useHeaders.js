// @ts-ignore
import i18n, { SupportLanguage, getLocaleLang, DEFAULT_LANG, isCurrentCn } from '@/localization';
// import { currentFloorObjKey } from '@/views/toilet/hooks/useBaseDataHook';
import {
    currentFloorObjKey,
    curFloorEquipmentListKey,
    curFloorSpaceListKey,
    curFilterEquipClassCodesKey,
    onlyShowControlledEquipmentKey
} from '@/views/KitchenFumes/hooks/useKitchenFumesGlobal';
import { allEqCLassCodeInfoListKey, curFloorFilteredEquipListKey, closeDetailDrawerInjectKey } from '@/views/KitchenFumes/constant/injectKey';
export default emits => {
    const currentFloorObj = inject(currentFloorObjKey);
    const spacesAndEquipsLoading = ref(false);
    const curFloorEquipmentList = inject(curFloorEquipmentListKey);
    const allEqCLassCodeInfoList = inject(allEqCLassCodeInfoListKey);
    const curFilterEquipClassCodes = inject(curFilterEquipClassCodesKey);
    const curFloorFilteredEquipList = inject(curFloorFilteredEquipListKey);
    const curFloorSpaceList = inject(curFloorSpaceListKey);
    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);

    const onlyShowControlledEquipment = inject(onlyShowControlledEquipmentKey);
    const onlyShowControlledEquipmentRef = ref(onlyShowControlledEquipment?.value ? 'checked' : 'uncheck');
    const selectValue = ref(null);

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

    const onlyShowControlledEquipmentChange = state => {
        onlyShowControlledEquipmentRef.value = state;
        onlyShowControlledEquipment.value = state === 'checked' ? true : false;
    };

    // 搜索数据
    const searchEquips = computed(() => {
        return curFloorEquipmentList.value;
    });

    const eqTypeOptions = computed(() => {
        const curFloorEqClassCodeRecord = curFloorEquipmentList.value.reduce((pre, cur) => ({ ...pre, [cur.classCode]: true }), {});

        return allEqCLassCodeInfoList.value
            ?.filter(item => curFloorEqClassCodeRecord[item.code])
            ?.map(item => ({
                name: isCurrentCn() ? item.name : item.englishName,
                id: item.code
            }));
    });
    watch(currentFloorObj, newVal => {
        curFilterEquipClassCodes.value = [];
        closeDetailDrawer();
    });

    watch([curFilterEquipClassCodes, onlyShowControlledEquipment, curFloorEquipmentList], () => {
        closeDetailDrawer();
        curFloorFilteredEquipList.value =
            curFloorEquipmentList.value?.filter(item => {
                let isFilteredOk = true;

                if (onlyShowControlledEquipment.value) {
                    isFilteredOk = item.monitoringSurveillanceStatus === '3';
                }
                if (isFilteredOk && curFilterEquipClassCodes.value?.length > 0) {
                    isFilteredOk = curFilterEquipClassCodes.value.includes(item.classCode);
                }
                return isFilteredOk;
            }) ?? [];
    });

    return {
        searchEquips,
        spacesAndEquipsLoading,
        curBuildingName,
        curFloorName,
        currentFloorObj,
        eqTypeOptions,
        selectValue,
        curFilterEquipClassCodes,
        onlyShowControlledEquipmentRef,
        curFloorFilteredEquipList,
        curFloorSpaceList,
        onlyShowControlledEquipmentChange,
        goBack,
        chooseObj,
        hoverObj,
        unhoverObj
    };
};
