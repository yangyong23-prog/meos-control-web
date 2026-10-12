import {
    floorViewInjectKey,
    selectModuleInfoInjectKey,
    showModuleInfoInjectKey,
    openDetailDrawerInjectKey,
    closeDetailDrawerInjectKey,
    currentFloorObjInjectKey,
    runningMonitorSecondTypeInjectKey,
    currentTimeKey,
    mapLoadedKey,
    allInstanceClassCodeMapKey
} from '../constant/injectKey';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';

export default () => {
    const runningMonitorType = 'PARKING';

    const currentFloorObj = ref({});
    const currentTime = ref(Date.now());
    const floorView = computed(() => {
        return !!currentFloorObj?.value?.floorId;
    });

    const showModuleInfo = ref(false);
    const selectModuleInfo = ref({});

    const mapLoaded = ref(false);
    const allInstanceClassCodeMap = ref(new Map());

    const openDetailDrawer = obj => {
        showModuleInfo.value = true;
        if (obj) {
            let floorLocalName = obj.floorLocalId;
            if (!obj.floorId && obj.objType === 'equipment') {
                const floor = getFloorInfoByFloorId(obj.floorId);
                floorLocalName = floor?.localId;
            }

            const data = {
                ...obj,
                id: obj.id,
                localName: obj.localName ?? '--',
                floorLocalName,
                spaceId: obj.objType === 'space' ? obj.id : '',
                type: obj.objType
            };
            selectModuleInfo.value = data;
        }
    };
    const closeDetailDrawer = () => {
        showModuleInfo.value = false;
        selectModuleInfo.value = null;
    };

    const _timer = setInterval(() => {
        currentTime.value = Date.now();
    }, 5 * 60 * 1000);

    onBeforeUnmount(() => {
        clearInterval(_timer);
    });

    provide(runningMonitorSecondTypeInjectKey, runningMonitorType);

    provide(currentFloorObjInjectKey, currentFloorObj);
    provide(floorViewInjectKey, floorView);

    provide(showModuleInfoInjectKey, showModuleInfo);
    provide(selectModuleInfoInjectKey, selectModuleInfo);
    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(currentTimeKey, currentTime);
    provide(mapLoadedKey, mapLoaded);
    provide(allInstanceClassCodeMapKey, allInstanceClassCodeMap);

    onUnmounted(() => {
        allInstanceClassCodeMap?.value?.clear();
    });

    return {
        currentFloorObj,
        floorView,
        showModuleInfo,
        selectModuleInfo,
        closeDetailDrawer,
        runningMonitorType,
        allInstanceClassCodeMap
    };
};
