// @ts-ignore
import i18n from '@/localization';
import {
    openDetailDrawerInjectKey,
    closeDetailDrawerInjectKey,
    showModuleInfoInjectKey,
    currentFloorObjInjectKey,
    currentTimeKey,
    mapLoadedKey,
    allInstanceClassCodeMapKey,
    parkingCommonSSEClientKey
} from '../../constant/injectKey';
import useStore from '@/store';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import { listInfoCodeConfigsByObjectFilters } from '@/apis/monitor';
import { isParkingGate, isParkingCamera, isParkingLotSpace, isParkingSpot } from '../utils/check';
import { getRelEquipmentIds, additionalFloorInfo, filterBuildFloors } from '../utils/index';
import ParkingFloorScene from '../ParkingFloorScene';
import useModelViewSSEHandle from '@/components/hooks/useModelViewSSEHandle';
import useCarNumberSSE from '../../hooks/useCarNumberSSE';
import { PARKING_SPOT_CLASS_CODES } from '../../constant/index';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { throttle } from 'lodash';
import { MODEL_VIEW, OBJ_TYPE } from '@/utils/globalVariables';
import { IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export default () => {
    const { base } = useStore();
    const currentFloorObj = inject(currentFloorObjInjectKey);
    // 所有建筑数据
    const allBuildingsData = ref([]);
    const buildFloors = ref([]);

    const showModuleInfo = inject(showModuleInfoInjectKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);
    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
    const currentTime = inject(currentTimeKey);
    const mapLoaded = inject(mapLoadedKey);

    const mapSSEClient = inject(parkingCommonSSEClientKey);

    const graphWarp = ref(null);
    const appSceneInstances = {};
    const floorIdObjMap = ref({});
    const renderFloorIds = ref([]);
    const abnormalFloorIds = ref([]);
    const listInfoCodeOrigin = ref();
    const allParkingSpots = ref([]);
    const curSelectedSpot = ref();
    const clearSpotTime = ref();

    const allInstanceClassCodeMap = inject(allInstanceClassCodeMapKey);

    // 车牌与车位关系
    const carNumbers = ref([]);

    // 订阅车牌号所在的车位实例ids
    const allParkingSpotIds = computed(() => {
        const allIds = allParkingSpots.value.map(item => item?.id);
        return allIds;
    });

    const classCodeMapIds = computed(() => {
        const allIds = allParkingSpotIds.value;
        if (allIds.length) {
            const classCode = PARKING_SPOT_CLASS_CODES[0];
            return { [classCode]: allIds };
        }
        return null;
    });

    const { carNumberSSEClient } = useCarNumberSSE(classCodeMapIds);

    let initPromise = null,
        getAllDataPromise = null,
        resizeOb = null;

    const loadings = {
        buildLoading: ref(false),
        initLoading: ref(false),
        floorLoading: ref(false),
        objectsLoading: ref(false)
    };

    const curHoverObj = ref();
    const hoverCardPosition = ref();

    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const clickMapObj = obj => {
        // 点击的非本楼层对象
        appSceneInstances.scene?.clickMapObj(obj);
    };

    const hoverMapObj = obj => {
        appSceneInstances.scene?.hoverMapObj(obj);
    };

    const unhoverMapObj = () => {
        appSceneInstances.scene?.unhoverMapObj();
    };

    const mapLoading = computed(() => loadings.buildLoading.value || loadings.floorLoading.value || loadings.initLoading.value || loadings.objectsLoading.value);

    useModelViewSSEHandle(mapSSEClient, listInfoCodeOrigin, () => {
        const tempAbnormalIds = appSceneInstances.scene?.sseRefreshIotInfo();
        const total = [...abnormalFloorIds.value, ...tempAbnormalIds];
        abnormalFloorIds.value = [...new Set(total)];
    });

    // SSE推送的车牌号缓存
    const carNumberCacheMap = new Map();

    const updateCarNumber = ({ objectId, data }) => {
        const spotItem = allParkingSpots.value.find(item => item?.id === objectId) || {};
        const preCarNumber = carNumbers.value?.find(item => item?.data?.id === objectId);
        if (preCarNumber) {
            carNumbers.value = carNumbers.value.map(v => {
                if (v?.data?.id === objectId) {
                    return { ...v, carNumber: data?.dataValue };
                }
                return v;
            });
        } else {
            carNumbers.value.push({
                carNumber: data?.dataValue,
                data: spotItem
            });
        }
        // 更新车牌信息
        console.log('update-spot-car-number', data);
    };

    const refreshCarNumber = () => {
        carNumberCacheMap.forEach((v, k) => {
            updateCarNumber({ objectId: k, data: v });
        });
    };

    const throttleRefreshCarNumber = throttle(refreshCarNumber, 500);

    const callback = ({ objectId, data }) => {
        if (data.infoCode === 'carNumber') {
            carNumberCacheMap.set(objectId, data);
            throttleRefreshCarNumber();
        }
    };

    useResponsiveDockSSEHandle(carNumberSSEClient, [IOT_DATA_CHANGE], callback);

    const getBuildingFloorsTree = async () => {
        let tempArr = [];
        loadings.buildLoading.value = true;
        const res = await getListTreeBuildingFloorSpace({ projectId: base.projectId, isQuerySpace: false }).finally(() => {
            loadings.buildLoading.value = false;
        });
        if (res?.code === '00000') {
            const resData = res?.data?.map(v => ({ ...v, floors: v?.floors?.map(f => ({ ...f, floorId: f?.id })) }));
            // 全局注入数据
            xplantindoorenvStore().setBuildingData(resData);
            xplantindoorenvStore().setBuildingFloorData(resData);
            if (Array.isArray(resData)) {
                tempArr = resData;
                allBuildingsData.value = resData;
            }
        }
        return { buildFloors: tempArr };
    };

    const clickSpaceOrEquip = obj => {
        if (obj) {
            openDetailDrawer(obj);
        } else {
            closeDetailDrawer();
        }
    };

    const onClickMoreInfo = obj => {
        if (obj) {
            clickSpaceOrEquip({ ...obj, classCode: obj.oriClassCode || obj.classCode });
        }
    };

    const addSceneEventsListener = async () => {
        loadings.initLoading.value = true;

        appSceneInstances.scene.addEventListener('onHoverCard', obj => {
            if (obj.data) {
                const { instance, pos } = obj.data;
                if (instance && pos) {
                    const cardData = {
                        ...instance,
                        classCode: instance.objType === OBJ_TYPE.EQUIPMENT ? instance.classCode : '',
                        oriClassCode: instance.classCode
                    };
                    curHoverObj.value = cardData;
                }
                hoverCardPosition.value = { ...pos, top: pos.top - 10 };
            }
        });
        appSceneInstances.scene.addEventListener('onUnHover', () => {
            curHoverObj.value = null;
            if (hoverCardPosition.value) {
                hoverCardPosition.value = null;
            }
        });

        appSceneInstances.scene.addEventListener('clickDetail', obj => {
            clickSpaceOrEquip(obj.data);
        });
        try {
            await appSceneInstances.scene.initLoader();
        } catch (e) {
            console.log('e: ', e);
        } finally {
            loadings.initLoading.value = false;
        }
    };

    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            await getBuildingFloorsTree();

            if (appSceneInstances.scene) {
                appSceneInstances.scene.dispose();
            }

            if (appSceneInstances.app) {
                appSceneInstances.app.dispose();
            }

            appSceneInstances.scene = new ParkingFloorScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                loadings
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });

            await addSceneEventsListener();
        }
    };

    const writeIotInfos = data => {
        if (!data._infoMap) {
            data._infoMap = {};
            data._infoMapOrigin = {};
        }
        const { relInfoCodeGroupConfigs } = data;
        relInfoCodeGroupConfigs?.forEach(config => {
            const { relInfoCodeConfigs } = config;
            relInfoCodeConfigs?.forEach(info => {
                const { infoCode } = info;

                data._infoMapOrigin[infoCode] = info;
                data._infoMap[infoCode] = structuredClone(info);
            });
        });
    };

    // 获取地图中的所有对象 并做分组
    const loadAllModelData = async () => {
        try {
            loadings.objectsLoading.value = true;
            const res = await listInfoCodeConfigsByObjectFilters({
                projectId: base.projectId,
                runningMonitorType: 'PARKING',
                templateCode: MODEL_VIEW
            });
            if (res.code === '00000' && res.data) {
                listInfoCodeOrigin.value = res.data;
                // 按照楼层id分组
                const floorIdMapData = {};
                const floorIdMapFlag = {};
                const idMapObj = {};
                const objData = {
                    spaces: [],
                    parkingSpots: [],
                    camerasOrGates: []
                };
                res.data.forEach(da => {
                    if (!allInstanceClassCodeMap.value.has(da.classCode)) {
                        allInstanceClassCodeMap.value.set(da.classCode, []);
                    }
                    allInstanceClassCodeMap.value.get(da.classCode).push({ id: da.id, floorId: da.floorId });

                    if (!floorIdMapFlag[da.floorId]) {
                        floorIdMapFlag[da.floorId] = true;
                    }
                    if (isParkingSpot(da.classCode) || isParkingLotSpace(da.roomFuncType)) {
                        renderFloorIds.value = [...new Set([...renderFloorIds.value, da.floorId])];
                    }
                    idMapObj[da.id] = da;
                    additionalFloorInfo(da, floorIdMapData);
                    if (da.objType === OBJ_TYPE.SPACE) {
                        // 含车道/坡道、停车场空间、出入口
                        objData.spaces.push(da);
                    } else if (isParkingSpot(da.classCode)) {
                        const relEquipIds = getRelEquipmentIds(da.relInfoCodeGroupConfigs);
                        da.chargeStationId = relEquipIds?.length === 1 ? relEquipIds[0] : null;
                        objData.parkingSpots.push(da);
                    } else if (isParkingCamera(da.classCode) || isParkingGate(da.classCode)) {
                        objData.camerasOrGates.push(da);
                    }

                    writeIotInfos(da);
                });

                handleCarNumberData(res.data ?? []);

                objData.parkingSpots?.forEach(obj => {
                    // 给停车位对象设置关联的充电桩对象
                    if (idMapObj[obj.chargeStationId]) {
                        obj.chargeStation = idMapObj[obj.chargeStationId];
                    }
                });
                floorIdObjMap.value = floorIdMapFlag;
                allParkingSpots.value = objData.parkingSpots;
                return objData;
            }
        } catch (e) {
            console.log('e: ', e);
        } finally {
            loadings.objectsLoading.value = false;
            mapLoaded.value = true;
        }
    };

    /**
     * 获取relInfoCodeGroupConfigs下全部的relInfoCodeConfigs信息，转换成数组返回
     * @param {*} groupConfigs
     * @returns
     */
    const parseRelInfoCodeConfigs = groupConfigs => {
        const configs = [];
        (groupConfigs ?? []).forEach(group => {
            const { relInfoCodeConfigs } = group;
            relInfoCodeConfigs?.forEach(info => {
                configs.push(info);
            });
        });
        return configs;
    };

    const handleCarNumberData = data => {
        const carNumberItems = [];
        (data ?? []).forEach(item => {
            if (isParkingSpot(item.classCode)) {
                const configs = parseRelInfoCodeConfigs(item.relInfoCodeGroupConfigs);
                for (let i = 0; i < configs.length; ++i) {
                    const { infoCode, dataValue } = configs[i];
                    if (infoCode === 'carNumber') {
                        carNumberItems.push({ carNumber: dataValue, data: item });
                    }
                }
            }
        });
        console.log('========================================', carNumberItems);
        carNumbers.value = carNumberItems;
    };

    const checkAbnormal = infoCodeMap => {
        return infoCodeMap?.alarmstatus?.dataValue === 'alarmstatus';
    };

    const recordAbnormalFloorIds = mapData => {
        const { spaces = [], parkingSpots = [], camerasOrGates = [] } = mapData || {};
        const abnormalSpaces = spaces.filter(v => checkAbnormal(v?._infoMap))?.map(v => v?.floorId);
        const abnormalEquips = [...parkingSpots, ...camerasOrGates].filter(v => checkAbnormal(v?._infoMap))?.map(v => v?.floorId);
        const total = [...abnormalFloorIds.value, ...abnormalSpaces, ...abnormalEquips];
        abnormalFloorIds.value = [...new Set(total)];
    };

    const createElements = mapData => {
        if (mapData) {
            recordAbnormalFloorIds(mapData);
            appSceneInstances.scene?.createElements(mapData);
        }
    };

    const startWatchFloorChange = () => {
        watch(
            () => currentFloorObj?.value,
            newFloorObj => {
                if (newFloorObj?.floorId) {
                    appSceneInstances.scene?.renderFloor(newFloorObj?.floorId);
                    appSceneInstances.scene?.updateElementsShow();
                    appSceneInstances.scene?.sseRefreshIotInfo();
                    if (showModuleInfo) {
                        showModuleInfo.value = false;
                    }
                }
            },
            { immediate: true }
        );
    };

    watch(currentTime, () => {
        appSceneInstances.scene?.updateSpaceStatus();
    });
    watch(showModuleInfo, newVal => {
        if (!newVal) {
            appSceneInstances.scene?.unselectModel();
        }
    });

    watch([() => curSelectedSpot.value, () => loadings.floorLoading.value], ([curSpot, curFloorLoading]) => {
        if (curSpot && !curFloorLoading) {
            const callback = () => {
                clearSpotTime.value = new Date().toISOString();
                curSelectedSpot.value = undefined;
            };
            appSceneInstances.scene.moveCameraToBox(curSpot, callback);
        }
    });

    const initCreateAndView = async () => {
        try {
            if (!initPromise) {
                initPromise = initScene();
            }
            await initPromise;

            if (!getAllDataPromise) {
                getAllDataPromise = loadAllModelData();
            }
            const mapData = await getAllDataPromise;

            createElements(mapData);
            startWatchFloorChange();
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const moveToParkingSpot = computed(() => spotItem => {
        if (mapLoading.value) {
            return;
        }

        if (spotItem?.floorId && spotItem?.floorId !== currentFloorObj.value?.floorId) {
            const floorInfo = getFloorInfoByFloorId(spotItem?.floorId);
            currentFloorObj.value = { ...(floorInfo || {}) };
            nextTick(() => {
                curSelectedSpot.value = spotItem;
            });
        } else {
            const callback = () => {
                clearSpotTime.value = new Date().toISOString();
                curSelectedSpot.value = undefined;
            };
            appSceneInstances.scene.moveCameraToBox(spotItem, callback);
        }
    });

    onMounted(async () => {
        initCreateAndView();
        resizeOb = new ResizeObserver(entries => {
            const entry = entries[0];
            const { width, height } = entry.contentRect;
            if (width && height) {
                windowResize();
            }
        });
        resizeOb.observe(graphWarp.value);
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
    });

    const windowResize = () => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
            appSceneInstances.scene.removeEventListener('clickDetail');
            appSceneInstances.scene.removeEventListener('onHoverCard');
            appSceneInstances.scene.removeEventListener('onUnHoverSpace');
            appSceneInstances.scene.dispose();
            delete appSceneInstances.scene;
        }
        if (appSceneInstances.app) {
            appSceneInstances.app.dispose();
            delete appSceneInstances.app;
        }
    };

    watch(
        [renderFloorIds, allBuildingsData],
        ([curFloors, curBuilding]) => {
            if (curFloors?.length && curBuilding?.length) {
                const _building = filterBuildFloors(curFloors, curBuilding);
                if (_building?.length) {
                    _building.forEach(items => {
                        items?.floorList?.forEach(item => {
                            item.dot = computed(() => {
                                return abnormalFloorIds.value?.includes(item.id);
                            });
                        });
                    });
                }
                buildFloors.value = _building;
            }
        },
        {
            immediate: true
        }
    );

    onUnmounted(() => {
        buildFloors.value = null;
        allBuildingsData.value = null;

        carNumberCacheMap.clear();
    });

    return {
        goDefault,
        graphWarp,
        mapLoading,
        onClickMoreInfo,
        curHoverObj,
        hoverCardPosition,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,

        windowResize,
        moveToParkingSpot,
        buildFloors,
        allParkingSpots,
        clearSpotTime,
        carNumbers
    };
};
