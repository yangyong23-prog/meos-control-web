import { currentFloorObjInjectKey, equipsInFloorKey } from '../../hooks/useCommonConfig';
import { showCameraEquipsKey, curFilterSpaceIdsKey, filterOptionDataKey } from './useFloorMapHook';
export default emits => {
    const showCameraEquips = inject(showCameraEquipsKey);
    const curFilterSpaceIds = inject(curFilterSpaceIdsKey);
    const filterOptionData = inject(filterOptionDataKey);
    const showCameraRef = ref(showCameraEquips?.value ? 'checked' : 'uncheck');
    const showCameraChange = state => {
        showCameraRef.value = state;
        showCameraEquips.value = state === 'checked' ? true : false;
    };

    const currentFloorObj = inject(currentFloorObjInjectKey);
    const equipsInFloor = inject(equipsInFloorKey);
    const spacesAndEquipsLoading = ref(false);
    const curSelectedClasscode = ref([]);
    const curBuildingName = computed(() => {
        return `${currentFloorObj?.value?.buildingLocalName || ''}`;
    });
    const curFloorName = computed(() => {
        return `${currentFloorObj?.value?.floorName || currentFloorObj?.value?.localName || ''}`;
    });
    const goBack = () => {
        currentFloorObj.value = null;
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
    const equipFilterFn = obj => {
        let flag = true;
        if (curSelectedClasscode.value?.length > 0) {
            flag = curSelectedClasscode.value.includes(obj.classCode);
        }

        return flag;
    };
    watch(curSelectedClasscode, () => {
        if (curSelectedClasscode.value?.length > 0) {
            let spaceIdMap = {};

            filterOptionData?.value?.forEach(item =>
                item.children?.forEach(c => {
                    if (c.relSpaceIds && curSelectedClasscode.value?.some(k => c.id === k)) {
                        spaceIdMap = { ...spaceIdMap, ...c.relSpaceIds };
                    }
                })
            );
            curFilterSpaceIds.value = spaceIdMap;
        } else {
            curFilterSpaceIds.value = null;
        }
    });
    watch(curFilterSpaceIds, () => {
        if (!curFilterSpaceIds.value) {
            curSelectedClasscode.value = [];
        }
    });
    watch(
        () => currentFloorObj?.value?.id,
        () => {
            showCameraRef.value = 'checked';
        }
    );
    return {
        showCameraRef,
        equipsInFloor,
        spacesAndEquipsLoading,
        curSelectedClasscode,
        curBuildingName,
        curFloorName,
        equipFilterFn,
        goBack,
        showCameraChange,
        chooseObj,
        hoverObj,
        unhoverObj
    };
};
