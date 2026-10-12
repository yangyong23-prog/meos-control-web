// @ts-ignore
import i18n from '@/localization';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import useStore from '@/store';
import baseStore from '@/store/baseStore';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { isEmpty, isNil, debounce } from 'lodash';

import FloorScene from '../floorMapScene';
import useMapAction from './useMapAction';

import { listInfoCodeConfigsByObject } from '@/apis/machineRoomSafety';
import { MODEL_VIEW, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';

import DockSingleton from '@/hooks/responsiveDock';
import dataDockHandling from '@/hooks/dataDockHandling';

import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, selectModuleInfoInjectKey, curSelectedRoomTypesInjectKey } from '../../constant/injectKey';
import {
    currentFloorInfoKey,
    dashboardFloorIdsKey,
    currentFloorSpacesKey,
    openPlayerFnKey,
    isWaitBuildingLoadingKey,
    allBuildingDataKey,
    currentFloorMachineRoomSpacesKey,
    isActiveOnlyMagRiskKey
} from '../../hooks/useBaseDataHook';
import { SPACE_STATUS, RUNNING_MONITOR_TYPE } from '../../variable';
import { filterBuildFloors, getStoreTreeBuildingFloor, isCamera, isDoor } from '../utils/index';
import { ROOM_MACHINE_MAP_FUNC_TYPES, filterRoomFuncTypes, defaultRoomFuncTypes, filterClassCodes } from '../constant/index';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';

const isNone = v => {
    return isNil(v) || v === '';
};

export default (mapBgColorRef, onlyMachineRoom) => {
    const { base } = useStore();

    const openPlayerFn = inject(openPlayerFnKey);
    // 所有建筑数据
    const allBuildingsData = inject(allBuildingDataKey, ref([]));
    // 楼层选择器数据
    const buildFloors = ref([]);
    const fetchFloorDynamicController = ref();

    // dashboard 展示的楼层ids
    const dashboardFloorIds = inject(dashboardFloorIdsKey, ref([]));
    const currentFloorObj = inject(currentFloorInfoKey, ref([]));
    const currentFloorId = computed(() => {
        return currentFloorObj.value?.id;
    });

    const selectModuleInfo = inject(selectModuleInfoInjectKey, ref(null));

    // 筛选-设备类型
    const equipClassCodeOptions = ref([]);
    // 筛选-空间类型
    const spaceRoomTypeOptions = ref([]);
    const curSelectedRoomTypes = inject(curSelectedRoomTypesInjectKey);
    // 筛选-空间
    const curSelectedSpace = ref(null);
    const currentFloorSpaces = inject(currentFloorSpacesKey, ref([]));

    const isActiveOnlyMagRisk = inject(isActiveOnlyMagRiskKey);
    // 当前楼层空间
    const curSpaces = computed(() => currentFloorSpaces.value.spaces || []);

    // 筛选仅主动管理的风险事件后应当展示的空间
    const filterShowSpacesIds = computed(
        () =>
            curSpaces.value
                .filter(spaceItem => {
                    let isOk = true;
                    if (isOk && isActiveOnlyMagRisk.value) {
                        isOk = getObjectAndRelatedDanegerList([spaceItem.id])?.length > 0;
                    }
                    if (isOk && onlyMachineRoom.value === 'checked') {
                        const onlyMachineRoomFilter = machineRoomIds.value.indexOf(spaceItem.id) === -1;
                        const roomfuncTypeFilter = curSelectedRoomTypes.value.length > 0 && !curSelectedRoomTypes.value.includes(spaceItem.roomFuncType);
                        isOk = !(onlyMachineRoomFilter || roomfuncTypeFilter);
                    }
                    return isOk;
                })
                .map(s => s.id) || []
    );

    // 当前空间ids
    const curSpaceIds = ref([]);
    // 当前设备ids
    const curEquipIds = ref([]);

    const mapBgColor = mapBgColorRef;

    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);

    const graphWarp = ref(null);
    const curHoverObj = ref();
    const hoverCardPosition = ref();

    const currentFloorMachineRoomSpaces = inject(currentFloorMachineRoomSpacesKey);

    const machineRoomIds = computed(() => {
        return currentFloorMachineRoomSpaces.value.map(s => s.id);
    });

    const appSceneInstances = {};
    const rebuildController = ref(null);
    const isWaitBuildingLoading = inject(isWaitBuildingLoadingKey, ref(false));
    const loadings = {
        initLoading: ref(false),
        floorLoading: ref(false),
        elementsLoading: ref(false)
    };
    const floorRecord = {};

    const { getIotData, getObjectDanegerEventsList, getRelatedObjects, getObjectDanegerStatus, getObjectAndRelatedDanegerList } = DockSingleton.getInstance();

    const { writeDataToResponsiveDock } = dataDockHandling();

    let initPromise = null,
        resizeOb = null;

    const resetData = () => {
        // 默认设备类型不展示
        equipClassCodeOptions.value = [];
        // TODO 默认空间类型均展示
        spaceRoomTypeOptions.value = ROOM_MACHINE_MAP_FUNC_TYPES;
        curSelectedRoomTypes.value = [];
        curSelectedSpace.value = undefined;
    };

    const clickSpaceOrEquip = obj => {
        if (!selectModuleInfo) {
            return;
        }
        if (obj) {
            openDetailDrawer?.({ ...obj });
            const isCameraEquip = isCamera(obj.classCode);
            if (isCameraEquip) {
                nextTick(() => {
                    openPlayerFn?.value?.open?.({ ...obj });
                });
            }
        } else {
            closeDetailDrawer?.();
        }
    };

    const addSceneListener = async () => {
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
                hoverCardPosition.value = { ...pos, top: pos.top };
            }
        });
        appSceneInstances.scene.addEventListener('onUnHover', () => {
            curHoverObj.value = null;
            if (hoverCardPosition.value) {
                hoverCardPosition.value = null;
            }
        });

        appSceneInstances.scene.addEventListener('clickDetail', obj => {
            console.log('点击空间或控制模块----obj: ', obj);
            if (obj?.data) {
                clickSpaceOrEquip(obj.data);
            }
        });
        try {
            await appSceneInstances.scene.initLoader();
        } catch (e) {
            console.log('e: ', e);
        }
        loadings.initLoading.value = false;
    };

    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            await getStoreTreeBuildingFloor(res => {
                allBuildingsData.value = res;
            });

            if (appSceneInstances.scene) {
                appSceneInstances.scene?.dispose();
            }
            if (appSceneInstances.app) {
                appSceneInstances.app.dispose();
            }
            appSceneInstances.scene = new FloorScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                filterShowSpacesIds,
                curSelectedSpace,
                loadings,
                mapBgColor
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });

            await addSceneListener();
        }
    };
    const initCreateAndView = async () => {
        try {
            if (!initPromise) {
                initPromise = initScene();
            }

            await initPromise;
            windowResize();
        } catch (e) {
            console.log('e: ', e);
        }
    };

    // 加载楼层动态数据
    const loadFloorDynamicData = async (objectIds, rebuildSignal) => {
        fetchFloorDynamicController.value?.abort();
        fetchFloorDynamicController.value = new AbortController();
        const { signal } = fetchFloorDynamicController.value;

        if (!objectIds?.length || rebuildSignal?.aborted) {
            return;
        }
        try {
            const params = {
                projectId: baseStore().projectId,
                runningMonitorType: RUNNING_MONITOR_TYPE,
                objectIds,
                templateCode: MODEL_VIEW
            };
            const { code, data } = await listInfoCodeConfigsByObjectIdCommon(params, signal);
            if (code === SUCCESSCODE && data) {
                writeDataToResponsiveDock(data);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const makeSpaceEquips = spaces => {
        const equips = [];
        const spaceIds = [];
        const equipIds = new Set();
        const doorEquipIds = new Set();
        const classCodesSet = new Set();
        const roomTypesSet = new Set();

        const eqHandle = item => {
            const eq = structuredClone(item);
            const isCameraEquip = isCamera(eq.classCode);
            const isDoorEquip = isDoor(eq.classCode);
            if (isDoorEquip && eq.bimLocation) {
                doorEquipIds.add(eq.id);
            }
            if ((isCameraEquip || isDoorEquip) && eq.bimLocation) {
                additionalFloorInfo(eq, floorRecord);
                if (!equips.some(v => v?.id === eq?.id)) {
                    equips.push(eq);
                }
                equipIds.add(eq.id);
                classCodesSet.add(eq.classCode);
            }
        };

        spaces?.forEach(space => {
            spaceIds.push(space.id);
            const rawSpace = toRaw(space);
            if (rawSpace?.roomFuncType) {
                roomTypesSet.add(rawSpace.roomFuncType);
            }
            rawSpace.equipmentsInSpace?.forEach(eqHandle);
            additionalFloorInfo(rawSpace, floorRecord);
        });

        const filterEquipOptions = filterClassCodes([...classCodesSet]);
        equipClassCodeOptions.value = filterEquipOptions;

        const filterSpaceOptions = filterRoomFuncTypes([...roomTypesSet]);
        spaceRoomTypeOptions.value = filterSpaceOptions;
        curSelectedRoomTypes.value = [];
        return { spaces, equips, spaceIds, equipIds: [...equipIds], doorEquipIds: [...doorEquipIds] };
    };

    // 加载渲染楼层模型(楼板土建、视角)
    const loadAndRenderFloorModel = async floorId => {
        if (floorId) {
            await appSceneInstances.scene?.loadFloorResource(floorId);
        }
    };

    const updateDataAndState = data => {
        appSceneInstances.scene?.updateElementData(data);
        appSceneInstances.scene?.updateShowElements();
        appSceneInstances.scene?.updateSpaceStatus();
        appSceneInstances.scene?.updateEquipStatus();
    };

    const updateDataAndStateDebounce = debounce(updateDataAndState, 200);

    const rebuildElements = async () => {
        await initPromise;
        // 取消上次未完成的重建（切换楼层场景）
        rebuildController.value?.abort();
        rebuildController.value = new AbortController();
        const { signal } = rebuildController.value;

        loadings.elementsLoading.value = true;
        try {
            resetData();
            loadAndRenderFloorModel(currentFloorId?.value);
            const sps = curSpaces.value;
            let doorIds = [];
            if (sps?.length) {
                const { spaces, equips, spaceIds, equipIds, doorEquipIds } = makeSpaceEquips(sps || []);
                if (signal.aborted) return;
                curSpaceIds.value = spaceIds;
                curEquipIds.value = equipIds;
                doorIds = doorEquipIds;
                // 3D元素创建 与 门动态数据加载 并行
                await Promise.all([appSceneInstances.scene.createElements({ spaces, equips }, signal), loadFloorDynamicData(doorIds, signal)]);
                if (signal.aborted) return;
                // 分帧创建完成后，应用默认可见性规则（设备默认隐藏、空间按筛选条件显示）
                updateDataAndState(elementStatus.value);
                // appSceneInstances.scene.updateElementData(elementStatus.value);
                // appSceneInstances.scene.updateShowElements();
                // appSceneInstances.scene.updateSpaceStatus();
                // appSceneInstances.scene.updateEquipStatus();
            } else {
                await loadFloorDynamicData(doorIds, signal);
            }
        } catch (e) {
            if (e?.name === 'AbortError' || signal.aborted) return;
            console.log('e: ', e);
        } finally {
            loadings.elementsLoading.value = false;
        }
    };

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

    const mapLoading = computed(() => {
        const mapInnerLoading = loadings.initLoading.value || loadings.floorLoading.value || isWaitBuildingLoading.value;
        return mapInnerLoading;
    });

    const elementStatus = computed(() => {
        const idMapStatus = {};
        curSpaceIds.value?.forEach(curId => {
            const spaceStatus = getObjectDanegerStatus(curId);
            const spaceDangerEventsList = getObjectDanegerEventsList(curId) || [];
            const equipIds = getRelatedObjects(curId) || [];
            const equipDangerEventsList =
                equipIds
                    ?.map(item => {
                        const list = getObjectDanegerEventsList(item) || [];
                        return list;
                    })
                    ?.filter(v => !!v?.length)
                    ?.flat?.() || [];

            const allStatus = [...spaceDangerEventsList, ...equipDangerEventsList];
            const finalState = allStatus.reduce((acc, cur) => {
                const { status } = cur || {};
                let converStatu = '';
                if (status === 'CONJECTURE_EXCEPTION') {
                    converStatu = 'EXCEPTION';
                } else if (status === 'GENERAL_NORMAL') {
                    converStatu = 'NORMAL';
                } else {
                    converStatu = status;
                }
                const mapStatus = SPACE_STATUS[converStatu]?.mapStatus;
                if (mapStatus) {
                    acc[mapStatus] = acc[mapStatus] || 0;
                    acc[mapStatus] += 1;
                }
                return acc;
            }, {});

            idMapStatus[curId] = { spaceStatus: spaceStatus?.code, countObj: finalState };
        });

        const iotCodes = ['runStatus'];
        curEquipIds.value?.forEach(eqId => {
            iotCodes.forEach(infoCode => {
                const infoData = getIotData(eqId, infoCode);
                if (infoData && !isNone(infoData.dataValue)) {
                    if (!idMapStatus[eqId]) {
                        idMapStatus[eqId] = {};
                    }
                    // 1是开启 0是关闭
                    if (infoData.dataValue === '1' || infoData.dataValue === 1) {
                        idMapStatus[eqId].opened = true;
                    } else if (infoData.dataValue === '0' || infoData.dataValue === 0) {
                        idMapStatus[eqId].closed = true;
                    } else {
                        idMapStatus[eqId].opened = false;
                        idMapStatus[eqId].closed = false;
                    }
                }
            });
        });

        // console.log('idMapStatus', idMapStatus);

        return idMapStatus;
    });

    watch(elementStatus, newVal => {
        if (!isEmpty(newVal)) {
            updateDataAndStateDebounce(newVal);
        }
    });

    watch(
        () => curSpaces?.value,
        async renderSpaces => {
            appSceneInstances.scene?.pauseRender(!renderSpaces?.length);

            if (renderSpaces?.length && currentFloorId?.value) {
                // 异步阻塞-获取空间数据
                await rebuildElements();
                closeDetailDrawer?.();
            }
        },
        {
            immediate: true
        }
    );

    watch(
        () => selectModuleInfo?.value?.id,
        async () => {
            if (!selectModuleInfo?.value?.id) {
                appSceneInstances.scene?.unselectModel();
                appSceneInstances.scene?.updateShowElements();
            }
        }
    );

    watch([curSelectedRoomTypes, onlyMachineRoom, isActiveOnlyMagRisk], async () => {
        // 切换楼层时，等待空间数据加载完成后，执行空间功能类型显隐
        nextTick(() => {
            closeDetailDrawer?.();
            appSceneInstances.scene?.unselectModel();
            appSceneInstances.scene?.updateShowElements();
            appSceneInstances.scene?.updateSpaceStatus();
        });
    });

    onMounted(() => {
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

    watch(
        [dashboardFloorIds, allBuildingsData],
        ([curFloors, curBuilding]) => {
            if (curFloors?.length && curBuilding?.length) {
                const _building = filterBuildFloors(curFloors, curBuilding);
                buildFloors.value = _building;
            }
        },
        {
            immediate: true
        }
    );

    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
    });

    const { moveToClickMapObj, clickMapObj, hoverMapObj, unhoverMapObj, onClickMoreInfo, goDefault, pauseRender } = useMapAction({
        appSceneInstances,
        clickSpaceOrEquip,
        currentFloorObj
    });

    return {
        graphWarp,
        goDefault,
        mapLoading,
        curHoverObj,
        hoverCardPosition,
        onClickMoreInfo,
        moveToClickMapObj,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender,
        buildFloors,
        currentFloorObj,

        // 筛选-设备类型
        equipClassCodeOptions,
        // 筛选-空间类型
        spaceRoomTypeOptions,
        curSelectedRoomTypes,
        // 筛选-空间
        curSelectedSpace,
        curSpaces
    };
};
