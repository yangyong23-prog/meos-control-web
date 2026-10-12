import { selectModuleInfoInjectKey, showModuleInfoInjectKey, openDetailDrawerInjectKey, closeDetailDrawerInjectKey, curFloorFilteredEquipListKey } from '../constant/injectKey';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { getCommonListSpacesByRunningMonitor } from '@/apis/kitchenFumes';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import treeBuildFloor from '@/store/treeBuildFloor';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { RUNNING_MONITOR_TYPE } from '../constant/index';

import DockSingleton from '@/hooks/responsiveDock';
import xplantindoorenvStore from '@/store/xplantindoorenv';

export const spaceDataInjectKey = Symbol('SpaceDataInjectKey');
export const isFloorViewKey = Symbol('IsFloorViewKey');
export const currentFloorObjKey = Symbol('CurrentFloorObjKey');
export const buildFloorsKey = Symbol('BuildFloorsKey');
export const curFloorEquipmentListKey = Symbol('CurFloorEquipmentListKey');
export const equipsForMapKey = Symbol('equipsForMapKey');
export const treeBuildFloorStorePromiseKey = Symbol('TreeBuildFloorStorePromiseKey');
export const curFloorSpaceListKey = Symbol('CurFloorSpaceListKey');
export const entryFloorKey = Symbol('EntryFloorKey');
export const onlyShowControlledEquipmentKey = Symbol('onlyShowControlledEquipmentKey');
export const curFilterEquipClassCodesKey = Symbol('curFilterEquipClassCodesKey');
export const floorMapRefKey = Symbol('floorMapRefKey');

export default () => {
    // TODO
    const currentFloorObj = ref({});

    const showModuleInfo = ref(false);
    const selectModuleInfo = ref({});
    const selectOwnId = ref('');
    // serviceSpacesTree supplementalFans oilFumePurifiers
    const selectAreaType = ref('');
    const spaceData = ref([]);
    const equipsForMap = ref([]);
    const onlyShowControlledEquipment = ref(true);
    const curFilterEquipClassCodes = ref([]);
    const curFloorFilteredEquipList = ref([]);
    const floorMapRef = ref(null);
    // const buildFloors = ref([]);
    const { getAbnormalEventsList } = DockSingleton.getInstance();
    const handleTreeBuildingFloorData = async () => await treeBuildFloor().handleTreeBuildingFloorData();
    const treeBuildFloorStorePromise = handleTreeBuildingFloorData();

    const openDetailDrawer = obj => {
        showModuleInfo.value = true;
        if (obj) {
            let floorLocalName = obj.floorLocalId;
            if (!obj.floorId && obj.objType === OBJ_TYPE.EQUIPMENT) {
                const floor = getFloorInfoByFloorId(obj.floorId);
                floorLocalName = floor?.localId;
            }

            const data = {
                ...obj,
                id: obj.id,
                localName: obj.localName ?? '--',
                floorLocalName,
                spaceId: obj.objType === OBJ_TYPE.SPACE ? obj.id : '',
                type: obj.objType
            };
            selectModuleInfo.value = data;
        }
    };
    const closeDetailDrawer = () => {
        showModuleInfo.value = false;
        selectModuleInfo.value = null;
        selectOwnId.value = '';
        selectAreaType.value = '';
    };

    const entryFloor = floorId => {
        currentFloorObj.value = getFloorInfoByFloorId(floorId);
    };
    const generateBuildFloors = floorList => {
        if (!floorList?.length) {
            return [];
        }

        let allBuildingData = xplantindoorenvStore().buildingData;
        allBuildingData = allBuildingData
            ?.map(b => {
                const building = { ...b, name: b?.localName };
                building.floorList = b.floors
                    ?.map(f => ({ ...f, name: f?.localName }))
                    ?.filter(f => floorList?.includes(f.id))
                    .sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
                return building;
            })
            .filter(building => building.floorList?.length)
            .sort((a, b) => b.floorSequenceId - a.floorSequenceId);

        return allBuildingData;
    };

    const isFloorView = computed(() => {
        return !!currentFloorObj.value?.id;
    });
    const floorIdMapEquips = computed(() => {
        const map = {};
        equipsForMap.value?.forEach(item => {
            map[item.floorId] = map[item.floorId] || [];
            map[item.floorId].push(item);
        });
        return map;
    });
    const curFloorEquipmentList = computed(() => {
        if (!currentFloorObj.value?.id) return [];
        return floorIdMapEquips.value[currentFloorObj.value?.id] || [];
    });
    const curFloorSpaceList = computed(() => {
        if (!currentFloorObj.value?.id) return [];

        return spaceData.value?.filter(item => item.floorId === currentFloorObj.value?.id);
    });
    const relFloorIdList = computed(() => {
        const ids = new Set();
        equipsForMap.value?.forEach(item => {
            ids.add(item.floorId);
        });
        spaceData.value?.forEach(item => {
            ids.add(item.floorId);
        });
        return Array.from(ids);
    });
    // 初始化楼层选择器列表
    const buildFloors = computed(() => {
        const _building = generateBuildFloors(Array.from(new Set(relFloorIdList.value)));
        if (_building?.length) {
            _building.forEach(items => {
                items.floorList.forEach(item => {
                    if (floorIdMapEquips?.value) {
                        // 楼层小圆点包含设备+空间的异常事件
                        const equipIds = floorIdMapEquips.value[item.id]?.map(obj => obj.id) || [];
                        const spaceIds = spaceData.value?.filter(space => space.floorId === item?.id)?.map(obj => obj.id) ?? [];

                        item.dot = getAbnormalEventsList([...equipIds, ...spaceIds])?.length > 0;
                    }
                });
            });
        }
        return _building;
    });

    onMounted(async () => {
        const res = await getCommonListSpacesByRunningMonitor({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            withColumns: ['bimLocation', 'buildingId', 'classCode', 'floorId', 'id', 'localName', 'objType', 'name', 'outline', 'roomFuncType']
        });
        await treeBuildFloorStorePromise;
        if (res?.code === SUCCESSCODE) {
            const resData = res?.data;
            const cacheObj = {};
            resData?.forEach(item => {
                if (item.outline && typeof item.outline === 'string') {
                    try {
                        item.outline = JSON.parse(item.outline);
                    } catch (error) {
                        console.log('error: ', error);
                    }
                }
                additionalFloorInfo(item, cacheObj);
            });

            spaceData.value = resData;
        }
    });

    provide(spaceDataInjectKey, spaceData);

    provide(showModuleInfoInjectKey, showModuleInfo);
    provide(selectModuleInfoInjectKey, selectModuleInfo);
    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide('selectOwnId', selectOwnId);
    provide('selectAreaType', selectAreaType);
    provide(isFloorViewKey, isFloorView);
    provide(currentFloorObjKey, currentFloorObj);
    provide(curFloorEquipmentListKey, curFloorEquipmentList);
    provide(equipsForMapKey, equipsForMap);
    provide(curFloorSpaceListKey, curFloorSpaceList);
    provide(treeBuildFloorStorePromiseKey, treeBuildFloorStorePromise);
    provide(buildFloorsKey, buildFloors);
    provide(entryFloorKey, entryFloor);
    provide(onlyShowControlledEquipmentKey, onlyShowControlledEquipment);
    provide(curFilterEquipClassCodesKey, curFilterEquipClassCodes);
    provide(curFloorFilteredEquipListKey, curFloorFilteredEquipList);
    provide(floorMapRefKey, floorMapRef);
    return {
        currentFloorObj,
        isFloorView,
        showModuleInfo,
        selectModuleInfo,
        closeDetailDrawer,
        selectOwnId,
        selectAreaType,
        spaceData,
        equipsForMap,
        floorMapRef,
        curFloorSpaceList,
        curFloorEquipmentList
    };
};
