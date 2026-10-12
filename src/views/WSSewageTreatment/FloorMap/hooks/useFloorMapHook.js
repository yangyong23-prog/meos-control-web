// @ts-ignore
import i18n from '@/localization';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';

import { Environment } from '@/config';
import useStore from '@/store';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { listInfoCodeConfigsByObject, querySpaceEquipmentList } from '@/apis/WSSewageTreatment';
import useMapAction from './useMapAction';
import { GRID, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import FloorScene from '../FloorMapScene';

import {
    currentFloorObjInjectKey,
    selectObjKey,
    mapClasscodeOptionsKey,
    curSelectedClasscodeKey,
    curFloorMapEquipsKey,
    dashboardShowFloorIdsInjectKey,
    openDetailDrawerInjectKey,
    closeDetailDrawerInjectKey,
    mapBgColorKey
} from '../../constant/injectKey';
import { canWatchControlEquipIdsKey } from '../../hooks/useBaseData';
import { filterBuildFloors } from '../utils/index';
import { getStoreTreeBuildingFloor, checkMonitorSurveillanceStatus } from '../../utils/index';
import baseStore from '@/store/baseStore';
import { isEmpty, isNil, debounce } from 'lodash';
import { CLASSCODE_DEFS, MAP_FILTER_CLSDDCODES, RUNNING_MONITOR_TYPE_SEWAGE } from '@/views/WSSewageTreatment/constant/index';
import dataDockHandling from '@/hooks/dataDockHandling';

const isNone = v => {
    return isNil(v) || v === '';
};
export default () => {
    const { base } = useStore();

    const allBuildingsData = ref([]);
    const buildFloors = ref([]);
    const canWatchControlEquipIds = inject(canWatchControlEquipIdsKey);

    // src/views/WSSewageTreatment/hooks/useBaseData.js
    const dashboardFloorIds = inject(dashboardShowFloorIdsInjectKey);
    const currentFloorObj = inject(currentFloorObjInjectKey);
    const selectModuleInfo = inject(selectObjKey);
    const mapClasscodeOptions = inject(mapClasscodeOptionsKey);
    const curSelectedClasscode = inject(curSelectedClasscodeKey);
    const curFloorMapEquips = inject(curFloorMapEquipsKey);
    const mapBgColor = inject(mapBgColorKey);

    // src/views/WSSewageTreatment/hooks/useDrawerCommon.js
    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);

    const graphWarp = ref(null);
    const curHoverObj = ref();
    const hoverCardPosition = ref();

    const curSpaceIds = ref([]);
    const curEquipIds = ref([]);
    const curRelatedEquips = ref(new Map());

    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        floorLoading: ref(false),
        objectsLoading: ref(false),
        elementsLoading: ref(false)
    };
    const floorRecord = {};

    const spaceStaticApiToken = UseCancelTokenHooks();
    const dyncInfoApiToken = UseCancelTokenHooks();

    const { getIotData, getObjectAbnormalStatus } = DockSingleton.getInstance();

    const { writeDataToResponsiveDock } = dataDockHandling();

    let initPromise = null,
        resizeOb = null,
        curElementIdMap = {},
        // 初始化碰撞过
        hadCollisionInit = false;

    const resetData = () => {
        curSpaceIds.value = [];
        curEquipIds.value = [];

        curElementIdMap = {};
        if (mapClasscodeOptions) {
            mapClasscodeOptions.value = [];
        }

        if (curFloorMapEquips) {
            curFloorMapEquips.value = [];
        }
    };

    const clickSpaceOrEquip = obj => {
        console.log('clickSpaceOrEquip--obj: ', obj);
        if (!selectModuleInfo) {
            return;
        }
        if (obj) {
            // selectModuleInfo.value = { ...obj };
            openDetailDrawer({ ...obj });
        } else {
            closeDetailDrawer();
        }
    };

    const addSceneListener = async () => {
        loadings.initLoading.value = true;

        appSceneInstances.scene.addEventListener('onHoverCard', obj => {
            // console.log('onHoverEquip空间----obj: ', obj);
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

    const createElements = async data => {
        try {
            await appSceneInstances.scene.createElements(data);
        } catch (e) {
            console.log('e: ', e);
        }
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
                curSelectedClasscode,
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
    const loadFloorDyncData = async objectIds => {
        dyncInfoApiToken.cancelQuest();
        if (!objectIds?.length) {
            return;
        }
        try {
            const params = {
                projectId: baseStore().projectId,
                runningMonitorType: RUNNING_MONITOR_TYPE_SEWAGE,
                objectIds,
                templateCode: GRID
            };
            const { code, data } = await listInfoCodeConfigsByObject(params, { cancelToken: dyncInfoApiToken.cancelToken() });
            if (code === SUCCESSCODE && data) {
                console.log('loadFloorDyncData--- data: ', code, data);
                writeDataToResponsiveDock(data);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    // 加载楼层静态数据
    const loadFloorStaticElements = async () => {
        console.log('loadFloorStaticElements: ');
        spaceStaticApiToken.cancelQuest();
        try {
            const params = { instanceType: 'FLOOR', instanceId: currentFloorObj?.value?.id };
            const { code, data } = await querySpaceEquipmentList(params, { cancelToken: spaceStaticApiToken.cancelToken() });
            if (code === SUCCESSCODE && data) {
                // console.log('code, data: ', code, data);
                return data;
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const makeSpaceEquips = (arr, idMap) => {
        const spaces = arr;

        const equips = [];
        const spaceIds = [];
        const equipIds = [];
        const classcodeSet = new Set();
        spaces?.forEach(space => {
            if (idMap[space.id]) {
                return;
            }
            idMap[space.id] = space;
            spaceIds.push(space.id);
            const rawSpace = toRaw(space);
            rawSpace.equipmentList?.forEach(eq => {
                if (eq.bimLocation && !idMap[eq.id]) {
                    const isWatch = canWatchControlEquipIds?.value?.size
                        ? canWatchControlEquipIds?.value?.has(eq.id)
                        : eq?.monitoringSurveillanceStatus?.toString()
                        ? checkMonitorSurveillanceStatus(eq)
                        : false;
                    if (isWatch || (Array.isArray(eq?.relEquipment) && eq?.relEquipment?.length)) {
                        additionalFloorInfo(eq, floorRecord);
                        equips.push(eq);
                        equipIds.push(eq.id);
                        idMap[eq.id] = eq;
                        classcodeSet.add(eq.classCode);
                    }
                    if (Array.isArray(eq?.relEquipment) && eq?.relEquipment?.length) {
                        if (!curRelatedEquips.value.has(eq.id)) {
                            curRelatedEquips.value.set(eq.id, eq?.relEquipment);
                        } else {
                            const preEquips = curRelatedEquips.value.get(eq.id) || [];
                            const existingIds = new Set(preEquips.map(e => e.id));
                            const filteredEquipment = eq.relEquipment.filter(e => !existingIds.has(e.id));
                            curRelatedEquips.value.set(eq.id, [...preEquips, ...filteredEquipment]);
                        }
                    }
                }
            });
            delete rawSpace.equipmentList;
            additionalFloorInfo(rawSpace, floorRecord);
        });

        if (mapClasscodeOptions) {
            mapClasscodeOptions.value = MAP_FILTER_CLSDDCODES.filter(code => classcodeSet.has(code)).map(code => {
                return {
                    id: code,
                    name: CLASSCODE_DEFS[code]?.name
                };
            });
        }
        return { spaces, equips, spaceIds, equipIds };
    };

    // 加载渲染楼层模型(楼板土建、视角)
    const loadAndRenderFloorModel = async floorId => {
        // console.log('loadAndRenderFloorModel: ');
        await appSceneInstances.scene?.loadFloorResource(floorId);
    };

    const updateDataAndState = data => {
        // console.log('updateDataAndState---data: ', data);
        appSceneInstances.scene?.updateElementData(data);
        appSceneInstances.scene?.updateShowElements(!hadCollisionInit);
        appSceneInstances.scene?.updateSpaceStatus();
        appSceneInstances.scene?.updateEquipStatus();
        hadCollisionInit = true;
    };

    const updateDataAndStateDebounce = debounce(updateDataAndState, 100);

    const rebuildElements = async () => {
        await initPromise;

        loadings.elementsLoading.value = true;
        try {
            resetData();
            const loadFloorPromise = loadAndRenderFloorModel(currentFloorObj?.value?.id);
            const resSpaces = await loadFloorStaticElements();
            let loadDyncPromise = null;
            if (resSpaces) {
                const { spaces, equips, spaceIds, equipIds } = makeSpaceEquips(resSpaces, curElementIdMap);
                loadDyncPromise = loadFloorDyncData(equipIds);
                curFloorMapEquips.value = equips;
                await createElements({ spaces, equips });
                await loadFloorPromise;
                hadCollisionInit = false;
                curSpaceIds.value = spaceIds;
                curEquipIds.value = equipIds;
            }
            await loadDyncPromise;
        } catch (e) {
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
        const mapInnerLoading = loadings.initLoading.value || loadings.floorLoading.value || loadings.elementsLoading.value || loadings.objectsLoading.value;
        return mapInnerLoading;
    });

    const elementStatus = computed(() => {
        const idMapStatus = {};
        curSpaceIds.value?.forEach(sId => {
            const isAbnormal = getObjectAbnormalStatus(sId);

            idMapStatus[sId] = { isAbnormal };
        });

        const iotCodes = ['highLevelAlarm', 'highLevAlarm', 'superHighLevelAlarm'];
        curEquipIds.value?.forEach(eqId => {
            // const isWatch = canWatchControlEquipIds.value.has(eqId);
            iotCodes.forEach(infoCode => {
                const infoData = getIotData(eqId, infoCode);
                if (infoData && !isNone(infoData.dataValue)) {
                    if (!idMapStatus[eqId]) {
                        idMapStatus[eqId] = {};
                    }
                    // 1是报警 0是正常
                    if (infoData.dataValue === '1' || infoData.dataValue === 1) {
                        const k = infoCode === 'highLevAlarm' ? 'highLevelAlarm' : infoCode;
                        idMapStatus[eqId][k] = true;
                    }
                }
            });
            // 液位正常情况
            if (idMapStatus[eqId] && isEmpty(idMapStatus[eqId])) {
                idMapStatus[eqId].normalLevel = true;
            }
            const isAbnormal = getObjectAbnormalStatus(eqId);
            // 异常
            if (isAbnormal) {
                if (!idMapStatus[eqId]) {
                    idMapStatus[eqId] = {};
                }
                idMapStatus[eqId].abnormal = true;
            }
            // 关联潜污泵异常
            const relatedEquips = curRelatedEquips.value.get(eqId);
            if (relatedEquips?.length) {
                let subAbnormals = new Set();
                relatedEquips.forEach(eq => {
                    const isSubAbnormal = getObjectAbnormalStatus(eq.id);
                    if (isSubAbnormal) {
                        subAbnormals.add(eq.id);
                    }
                });
                if (subAbnormals.size) {
                    if (!idMapStatus[eqId]) {
                        idMapStatus[eqId] = {};
                    }
                    idMapStatus[eqId].relatedPumpAbnormal = true;
                }
            }

            if (idMapStatus?.[eqId]?.abnormal && idMapStatus?.[eqId]?.relatedPumpAbnormal) {
                idMapStatus[eqId].relatedPumpAbnormalAndAbnormal = true;
            }
        });

        return idMapStatus;
    });

    watch(elementStatus, newVal => {
        if (!isEmpty(newVal)) {
            // console.log('elementStatus-changed: ', hadCollisionInit);

            updateDataAndStateDebounce(newVal);
        }
    });

    watch([() => currentFloorObj?.value?.id, () => currentFloorObj?.value?.selectedObj], async ([newFloorId, newObj], [preFloorId, preObj]) => {
        // 选中的当前对象清空则不继续
        if (newFloorId && newFloorId === preFloorId && !newObj?.id) {
            return;
        }
        // 选中的当前对象变化则地图选中并弹窗
        if (newFloorId && newFloorId === preFloorId && newObj?.id !== preObj?.id) {
            clickMapObj(newObj);
            nextTick(() => {
                if (currentFloorObj?.value) {
                    currentFloorObj.value.selectedObj = undefined;
                }
            });
            return;
        }
        pauseRender(!newFloorId);
        if (newFloorId) {
            await rebuildElements();
            if (!newObj) {
                closeDetailDrawer();
            } else {
                clickMapObj(newObj);
                nextTick(() => {
                    if (currentFloorObj?.value) {
                        currentFloorObj.value.selectedObj = undefined;
                    }
                });
            }
        }
    });
    watch(
        () => selectModuleInfo?.value,
        async () => {
            if (!selectModuleInfo?.value?.id) {
                appSceneInstances.scene?.unselectModel();
            }
        }
    );
    watch(
        () => curSelectedClasscode?.value,
        async () => {
            // console.log('curSelectedClasscode?.value: ', curSelectedClasscode?.value);
            appSceneInstances.scene?.updateShowElements();
            appSceneInstances.scene?.updateEquipStatus();
        }
    );

    onMounted(() => {
        initCreateAndView();

        resizeOb = new ResizeObserver(() => windowResize());
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

    onUnmounted(() => {
        curRelatedEquips.value.clear();
        curRelatedEquips.value = null;
    });

    const { clickMapObj, hoverMapObj, unhoverMapObj, onClickMoreInfo, goDefault, pauseRender } = useMapAction({ appSceneInstances, clickSpaceOrEquip, currentFloorObj });

    return {
        graphWarp,
        goDefault,
        mapLoading,
        curHoverObj,
        hoverCardPosition,
        onClickMoreInfo,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender,
        buildFloors
    };
};
