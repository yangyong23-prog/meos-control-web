import useLoading from '@/hooks/useLoading';
import {
    currentFloorObjInjectKey,
    floorViewInjectKey,
    currentBuildingObjKey,
    idDynaDataKey,
    mapClasscodeOptionsKey,
    curSelectedClasscodeKey,
    curFloorMapEquipsKey,
    selectObjKey,
    findEquipmentIdAndSpaceIdInFloorKey,
    dashboardShowFloorIdsInjectKey,
    mapRefKey,
    clickMapObjInjectKey,
    mapBgColorKey,
    classCodeEquipmentsInjectKey
} from '../constant/injectKey';
import i18n from '@/localization';
import { getEquipmentsAxios } from '@/apis/WSSewageTreatment';
import { EQUIPEMNT_CLASSCODE } from '../variables';
import dataDockHandling from '@/hooks/dataDockHandling';
import { uniq, uniqBy } from 'lodash';
import baseStore from '@/store/baseStore';
import DockSingleton from '@/hooks/responsiveDock';
import { RUNNING_MONITOR_TYPE_SEWAGE, MAP_FILTER_CLSDDCODES } from '../constant';
import { checkMonitorSurveillanceStatus } from '../utils/index';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { GRID } from '@/utils/globalVariables';
export const classCodeSpaceIdsMapKey = Symbol('classCodeSpaceIdsMapKey');
export const canWatchControlEquipIdsKey = Symbol('canWatchControlEquipIdsKey');
export const loadingFloorKey = Symbol('loadingFloorKey');

export const useBaseData = setEquipmentSSEClientOption => {
    const { getAbnormalEventsList, getIotData } = DockSingleton.getInstance();
    const selectObj = ref({});
    const { loadDynaDataWithIotHandling, idDynaData } = dataDockHandling();
    const { openLoading, closeLoading, loading } = useLoading(
        'ws-left',
        '#ffffff00',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const buildingSpaceTree = ref([]);

    const loadingFloor = ref(false);
    const isLoaded = ref(false);
    const currentBuildingObj = ref(); // 当前建筑对象
    const currentFloorObj = ref(); // 当前楼层对象
    // 所有设备实例映射
    const equipmentsMpa = ref(new Map());
    // 可监可控设备id集合
    const canWatchControlEquipIds = ref(new Set());
    // 可监可控设备所在空间id的集合
    const spaceSetIds = ref(new Set());
    // 所有关联设备id集合
    const relEquipmentIds = ref(new Set());
    const classCodeObjectIdsMap = {};
    const classCodeSpaceIdsMap = {};

    // 地图设备类选择，下拉选项
    const mapClasscodeOptions = ref([]);
    // 地图当前选择的设备类
    const curSelectedClasscode = ref();

    // 地图当前楼层的所有设备
    const curFloorMapEquips = ref();
    const mapRef = ref();
    const mapBgColor = ref('#D6DDE5');
    const findFloorSequence = (buildingId, floorId) => {
        if (xplantindoorenvStore().buildingData && xplantindoorenvStore().buildingData.length) {
            const building = xplantindoorenvStore().buildingData.find(building => buildingId === building.id);
            if (building) {
                const floor = building.floors.find(floor => floorId === floor.id);
                if (floor) {
                    return floor.floorSequenceId;
                }
            }
        }
        return 0;
    };

    const mainBackgroundColor = computed(() => {
        console.log('currentFloorObj.value: ', currentFloorObj.value);
        if (currentFloorObj.value?.id) {
            return mapBgColor.value || '#D6DDE5';
        }
        return null;
    });
    const cardStatistics = computed(() => {
        const obj = new Map();
        equipmentsMpa.value.forEach(value => {
            if (obj.has(value.classCode)) {
                obj.get(value.classCode).equipments.push(value);
            } else {
                obj.set(value.classCode, { ...EQUIPEMNT_CLASSCODE[value.classCode], equipments: [value] });
            }
        });

        const statistics = Array.from(obj.values());
        statistics.forEach(item => {
            const cardEventIds = new Set();
            let superHighLevelAlarmNumber = 0,
                highLevelAlarmNumber = 0;
            item.relEquipments = [];
            item.equipments.forEach(equipment => {
                const isWatch = checkMonitorSurveillanceStatus(equipment);
                if (isWatch) {
                    canWatchControlEquipIds.value.add(equipment.id);
                    cardEventIds.add(equipment.id);
                    cardEventIds.add(equipment.spaceId);
                    const superHighLevelAlarm = getIotData(equipment.id, 'superHighLevelAlarm');
                    const highLevelAlarm = getIotData(equipment.id, 'highLevelAlarm');
                    const highLevAlarm = getIotData(equipment.id, 'highLevAlarm');

                    if (superHighLevelAlarm?.dataValue === '1') {
                        superHighLevelAlarmNumber++;
                        equipment.superHighLevelAlarm = true;
                    } else {
                        equipment.superHighLevelAlarm = false;
                    }
                    if (highLevelAlarm?.dataValue === '1' || highLevAlarm?.dataValue === '1') {
                        highLevelAlarmNumber++;
                        equipment.highLevelAlarm = true;
                    } else {
                        equipment.highLevelAlarm = false;
                    }
                }

                equipment.relEquipment?.forEach(relItem => {
                    const runStatus = getIotData(relItem.id, 'runStatus');
                    const faultStatus = getIotData(relItem.id, 'faultStatus'); // 故障状态
                    relItem.runStatus = runStatus?.dataValue;
                    relItem.faultStatus = faultStatus?.dataValue; // 故障状态
                    relItem.buildingName = equipment.buildingName; // 设置建筑名
                    relItem.floorName = equipment.floorName; // 设置楼层名
                    relItem.floorSequence = findFloorSequence(relItem.buildingId, relItem.floorId);
                    item.relEquipments.push(relItem);
                });
                equipment.relEquipment?.sort((a, b) => a.floorSequence - b.floorSequence);
            });
            item.relEquipments = uniqBy(item.relEquipments, 'id');
            item.faultCount = item.relEquipments.reduce((sum, cur) => {
                if (cur?.faultStatus?.toString() === '1' && (!currentFloorObj.value?.id || currentFloorObj.value?.id === cur.floorId)) {
                    return sum + 1;
                }
                return sum;
            }, 0);
            item.abnormalEventsList = getAbnormalEventsList([...cardEventIds]);
            item.superHighLevelAlarmNumber = superHighLevelAlarmNumber;
            item.highLevelAlarmNumber = highLevelAlarmNumber;
        });
        return statistics.sort((a, b) => MAP_FILTER_CLSDDCODES.indexOf(a.code) - MAP_FILTER_CLSDDCODES.indexOf(b.code));
    });
    const eventIds = computed(() => {
        const equipments = [...equipmentsMpa.value.values()];
        const equipmentIds = equipments
            .filter(item => {
                const isWatch = checkMonitorSurveillanceStatus(item);
                const hasRelEquipment = Array.isArray(item?.relEquipment) && item.relEquipment.length;
                return isWatch || hasRelEquipment;
            })
            ?.map(item => item.id);
        // 污水处理：查询空间的异常事件
        const spaceIds = [...spaceSetIds.value];
        // const spaceIds = [];
        const ids = [...relEquipmentIds.value];
        return [...spaceIds, ...equipmentIds, ...ids];
    });

    // 地图有设备的楼层Ids
    const dashboardShowFloorIds = computed(() => {
        const equipments = [...equipmentsMpa.value.values()];
        const equipmentFloorIds = equipments
            .filter(item => {
                const canWatch = checkMonitorSurveillanceStatus(item);
                const hasRelEquipment = item.relEquipment?.length;
                return canWatch || hasRelEquipment;
            })
            .map(item => item.floorId);
        return [...new Set(equipmentFloorIds)];
    });

    const getListInfoCodeConfigsByObject = async ids => {
        try {
            await loadDynaDataWithIotHandling({ objectIds: ids, runningMonitorType: RUNNING_MONITOR_TYPE_SEWAGE, templateCode: GRID });
            setEquipmentSSEClientOption(classCodeObjectIdsMap, RUNNING_MONITOR_TYPE_SEWAGE);
        } catch (error) {
            loadingFloor.value = false;
        } finally {
            loadingFloor.value = false;
        }
    };

    // 更新SSE异常事件订阅实例
    const setClaasCodeObjectsMap = data => {
        if (classCodeObjectIdsMap.GeneralZone) {
            data.spaceId && classCodeObjectIdsMap.GeneralZone.push(data.spaceId);
        } else {
            data.spaceId && (classCodeObjectIdsMap.GeneralZone = [data.spaceId]);
        }
        if (classCodeObjectIdsMap[data.classCode]) {
            classCodeObjectIdsMap[data.classCode].push(data.id);
        } else {
            classCodeObjectIdsMap[data.classCode] = [data.id];
        }
        if (classCodeSpaceIdsMap[data.classCode]) {
            classCodeSpaceIdsMap[data.classCode].push(data.spaceId);
        } else {
            classCodeSpaceIdsMap[data.classCode] = [data.spaceId];
        }
    };

    const getBuildFloorEquipmentData = async () => {
        openLoading();
        loadingFloor.value = true;
        isLoaded.value = false;
        try {
            const { data = [] } = await getEquipmentsAxios({
                runningMonitorType: RUNNING_MONITOR_TYPE_SEWAGE,
                instance: { instanceType: 'PROJECT', instanceId: baseStore().projectId }
            });
            isLoaded.value = true;
            // 获取所有可监可控的设备ids+关联设备ids数据
            const ids = [];
            const treeData = {};
            data.forEach(item => {
                const isWatch = checkMonitorSurveillanceStatus(item);
                if (isWatch) {
                    ids.push(item.id);
                    setClaasCodeObjectsMap(item);
                    spaceSetIds.value.add(item.spaceId);
                }

                equipmentsMpa.value.set(item.id, item);
                // 处理楼层空间树
                if (item.buildingId && !treeData[item.buildingId]) {
                    treeData[item.buildingId] = {
                        id: item.buildingId,
                        name: item.buildingName ?? '--',
                        type: 'BUILDING',
                        children: {}
                    };
                }
                if (item.floorId && treeData[item.buildingId] && !treeData[item.buildingId].children[item.floorId]) {
                    treeData[item.buildingId].children[item.floorId] = {
                        id: item.floorId,
                        name: item.floorName ?? '--',
                        type: 'FLOOR',
                        floorSequence: findFloorSequence(item.buildingId, item.floorId),
                        children: {}
                    };
                }

                if (
                    item.spaceId &&
                    treeData[item.buildingId] &&
                    treeData[item.buildingId].children[item.floorId] &&
                    !treeData[item.buildingId].children[item.floorId].children[item.spaceId]
                ) {
                    treeData[item.buildingId].children[item.floorId].children[item.spaceId] = {
                        id: item.spaceId,
                        name: item.spaceName ?? '--',
                        type: 'SPACE'
                    };
                }

                item.relEquipment?.forEach(relItem => {
                    setClaasCodeObjectsMap(relItem);
                    relEquipmentIds.value.add(relItem.id);
                    ids.push(relItem.id);
                });
            });
            for (const key in classCodeObjectIdsMap) {
                if (Object.prototype.hasOwnProperty.call(classCodeObjectIdsMap, key)) {
                    classCodeObjectIdsMap[key] = uniq(classCodeObjectIdsMap[key]);
                }
            }
            for (let k in treeData) {
                for (let k2 in treeData[k].children) {
                    treeData[k].children[k2].children = Object.values(treeData[k].children[k2].children);
                }
                treeData[k].children = Object.values(treeData[k].children);
            }
            const rawData = Object.values(treeData);
            buildingSpaceTree.value = rawData.length <= 1 ? (rawData[0] ? rawData[0].children : []) : rawData;
            getListInfoCodeConfigsByObject(uniq(ids));
        } catch (error) {
            closeLoading();
        } finally {
            closeLoading();
        }
    };
    const findEquipmentIdAndSpaceIdInFloor = computed(() => {
        try {
            if (currentFloorObj.value?.id && equipmentsMpa.value) {
                const ids = new Set();
                for (const item of equipmentsMpa.value.values()) {
                    if (item.floorId === currentFloorObj.value.id) {
                        // 仅看可监可控的设备、空间
                        if (checkMonitorSurveillanceStatus(item) || (Array.isArray(item?.relEquipment) && item?.relEquipment?.length)) {
                            ids.add(item.id);
                            // 污水处理：查询空间的异常事件
                            ids.add(item.spaceId);
                        }

                        if (item.relEquipment) {
                            item.relEquipment.forEach(equipment => {
                                ids.add(equipment.id);
                            });
                        }
                    }
                }
                return [...ids];
            }
            // 确保 eventIds.value 存在且为数组
            return Array.isArray(eventIds.value) ? eventIds.value : [];
        } catch (error) {
            console.error('Error in findEquipmentIdAndSpaceIdInFloor:', error);
            return [];
        }
    });
    const clickMapObj = obj => {
        mapRef?.value?.clickMapObj(obj);
    };
    onMounted(() => {
        getBuildFloorEquipmentData();
    });
    const equipmentData = ref(i18n.global.t('meos_control_web.equipment_list'));
    const floorView = computed(() => !!currentFloorObj?.value?.id || !!currentFloorObj?.value?.floorId);
    provide(currentFloorObjInjectKey, currentFloorObj);
    provide('currentFloorObj', currentFloorObj);
    provide('equipmentData', equipmentData);
    provide('buildingSpaceTree', buildingSpaceTree);
    provide(floorViewInjectKey, floorView);
    provide(currentBuildingObjKey, currentBuildingObj);
    provide(idDynaDataKey, idDynaData);
    provide(mapClasscodeOptionsKey, mapClasscodeOptions);
    provide(curSelectedClasscodeKey, curSelectedClasscode);
    provide(curFloorMapEquipsKey, curFloorMapEquips);
    provide(selectObjKey, selectObj);
    provide(findEquipmentIdAndSpaceIdInFloorKey, findEquipmentIdAndSpaceIdInFloor);
    provide(dashboardShowFloorIdsInjectKey, dashboardShowFloorIds);
    provide(mapRefKey, mapRef);
    provide(clickMapObjInjectKey, clickMapObj);
    provide(mapBgColorKey, mapBgColor);
    provide(classCodeEquipmentsInjectKey, classCodeObjectIdsMap);
    provide(classCodeSpaceIdsMapKey, classCodeSpaceIdsMap);
    provide(canWatchControlEquipIdsKey, canWatchControlEquipIds);
    provide(loadingFloorKey, loadingFloor);

    onUnmounted(() => {
        canWatchControlEquipIds.value.clear?.();
        canWatchControlEquipIds.value = null;
    });

    return {
        loading,
        currentFloorObj,
        loadingFloor,
        equipmentsMpa,
        cardStatistics,
        idDynaData,
        findEquipmentIdAndSpaceIdInFloor,
        mainBackgroundColor,
        floorView,
        isLoaded
    };
};
