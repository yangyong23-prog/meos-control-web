// @ts-ignore
import i18n from '@/localization';
import { ref, computed, inject } from 'vue';
import { Application } from '@yushu/core3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { querySpacesWithHttpConfig, listInfoCodeConfigsByObjectCommon } from '@/apis/public';
import useEffectWarp from '@/hooks/useEffectWarp';
import { Environment } from '@/config';
import useStore from '@/store';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import useMapAction from './useMapAction';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import FloorScene from '../FloorMapScene';
import emitter from '@/utils/bus';

// import {
//     currentFloorObjInjectKey,
//     dashboardFloorIdsKey,
//     buildingFloorPromiseKey,
//     abnormalListInFloorKey,
//     camerasInFloorKey,
//     spaceIdMapEquipsKey,
//     systemIdMapClassCodesKey,
//     equipsInFloorKey,
//     mapBgColorKey,
//     isFaultFucKey,
//     isAlarmFucKey,
//     selectCameraInfoKey
// } from '../../hooks/useCommonConfig';
// import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, selectObjKey } from '../../hooks/useDrawerCommon';
import { filterBuildFloors } from '../utils/index';
import {
    currentFloorObjInjectKey,
    mapBgColorKey,
    dashboardFloorIdsKey,
    buildingFloorPromiseKey,
    getModuleListByFloorIdKey,
    getLoopListByFloorIdKey,
    getModuleListByLoopIdKey,
    getStatusListBySpaceIdKey,
    getLoopListByModuleIdKey,
    getLoopListBySpaceIdKey,
    getAbnormalIdsBySpaceIdKey,
    getModuleListBySpaceIdKey,
    getAbnormalIdsByFloorIdKey,
    showCircuitsAndControlerKey
} from '../../../hooks/useBaseHook';
import _, { isEmpty, uniqBy } from 'lodash';
import { INFOCODE, SPACE_SWITCH_ABNORMAL } from '@/views/IndoorLighting/variables';
import { closeDetailDrawerInjectKey, openDetailDrawerInjectKey, selectObjKey } from '@/views/IndoorLighting/hooks/useDrawerCommon';
import useDiagramControls from '@/hooks/useDiagramControls';
import useLoadFloorPosSpaces from '@/hooks/useLoadFloorPosSpaces';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';

export const spacesInFloorKey = Symbol('spacesInFloorKey'); //地图中的空间
export const filterOptionDataKey = Symbol('filterOptionDataKey'); //地图筛选下拉框数据
export const curFilterShowSpaceIdsKey = Symbol('curFilterShowSpaceIdsKey'); // 当前筛选后显示的空间ID

export const curFilterOptionKey = Symbol('curFilterOptionKey'); // 当前筛选选择的空间ID

export const SpaceType = {
    servedByLoop: 'servedByLoop',
    hostsController: 'hostsController',
    position: 'position'
};

const curSearchHoverEquipKey = Symbol('curSearchHoverEquipKey'); // 当前搜索下拉框hover的设备
export default () => {
    const { base } = useStore();

    const buildFloors = ref([]);

    const showCircuitsAndControler = inject(showCircuitsAndControlerKey);
    const dashboardFloorIds = inject(dashboardFloorIdsKey);
    const currentFloorObj = inject(currentFloorObjInjectKey);
    const selectSpaceObj = inject(selectObjKey);
    const buildingFloorPromise = inject(buildingFloorPromiseKey);

    const getModuleListByFloorId = inject(getModuleListByFloorIdKey);
    const getLoopListByFloorId = inject(getLoopListByFloorIdKey);
    const getModuleListByLoopId = inject(getModuleListByLoopIdKey);
    const getLoopListByModuleId = inject(getLoopListByModuleIdKey);
    const getLoopListBySpaceId = inject(getLoopListBySpaceIdKey);
    const getModuleListBySpaceId = inject(getModuleListBySpaceIdKey);

    const camerasInFloor = inject('camerasInFloorKey');
    const getAbnormalIdsByFloorId = inject(getAbnormalIdsByFloorIdKey);
    const mapBgColor = inject(mapBgColorKey);
    const spaceIdMapEquips = ref({});
    const getAbnormalIdsBySpaceId = inject(getAbnormalIdsBySpaceIdKey);

    const spacesInFloor = ref([]);
    provide(spacesInFloorKey, spacesInFloor);

    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);

    const graphWarp = ref(null);
    const curHoverObj = ref();
    const hoverCardPosition = ref();
    const curHoverLoopRelSpaceids = ref([]);

    // 当前过滤的空间ID
    const curFilterShowSpaceIds = ref(null);
    // 当前过滤选项
    const curFilterOption = ref(null);

    const curSearchHoverEquip = ref();

    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        floorLoading: ref(false),
        objectsLoading: ref(false),
        elementsLoading: ref(false)
    };
    const floorRecord = {};

    const { createEffect, destoryEffect } = useEffectWarp();
    const { createEffect: createEffectCameras, destoryEffect: destoryEffectCameras } = useEffectWarp();

    const { getFloorPositionObjs, getPositionConfig } = useLoadFloorPosSpaces();

    const clickSpaceOrEquip = obj => {
        console.log('clickSpaceOrEquip--obj: ', obj);
        if (obj) {
            if (obj.objType === OBJ_TYPE.EQUIPMENT) {
                closeDetailDrawer();
            } else {
                openDetailDrawer({ ...obj });
            }
        } else {
            closeDetailDrawer();
        }
    };
    const closeDetailOrMonitor = () => {
        closeDetailDrawer();
    };
    const { clickMapObj, hoverMapObj, unhoverMapObj, onClickMoreInfo, goDefault, pauseRender, cameraCollisionDebounce, spaceBubbleCollisionDebounce } = useMapAction({
        appSceneInstances,
        clickSpaceOrEquip,
        currentFloorObj
    });

    const { panelSelectData, panelSelectCheckedIds, panelSelectChange, spaceCardShowOption, showPostionSpaceOption } = useDiagramControls();

    const spaceStaticApiToken = UseCancelTokenHooks();
    const otherSpacesApiToken = UseCancelTokenHooks();
    const cameraEquipsApiToken = UseCancelTokenHooks();

    const { getIotData, getObjectAbnormalStatus, getAbnormalEventsList } = DockSingleton.getInstance();

    let initPromise = null,
        resizeOb = null,
        curElementIdMap = {},
        loadFloorPromise = null,
        // 初始化碰撞过
        hadCollisionInit = false;

    const resetData = () => {
        curElementIdMap = {};
    };

    const selectSpace = space => {
        const { id: spaceId } = space;
        if (spaceId) {
            const spaceObj = appSceneInstances.scene?.getBaseDataById(spaceId);
            clickMapObj(spaceObj);
            // TODO 移动到对应空间
        }
    };

    const moveCameraToBox = space => {
        appSceneInstances.scene?.moveCameraToBox(space);
    };

    const addSceneListener = async () => {
        loadings.initLoading.value = true;

        appSceneInstances.scene.addEventListener('onHoverCard', obj => {
            console.log('onHoverEquip空间----obj: ', obj);
            if (obj.data) {
                const { instance, pos } = obj.data;
                if (instance && pos && instance.type === SpaceType.servedByLoop) {
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

        appSceneInstances.scene.addEventListener('clickDetail', ({ data, controler, loop }) => {
            console.log('点击空间或控制模块----obj: ', data, controler, loop);
            let objData = null;
            if (isEmpty(controler) && isEmpty(loop)) {
                if (data) {
                    objData = data;
                }
            } else if (controler) {
                objData = controler;
            } else if (loop) {
                objData = loop;
            }
            if (objData) clickSpaceOrEquip(objData);
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
            // await getStoreTreeBuildingFloor(res => {
            //     allBuildingsData.value = res;
            // });

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
                showCircuitsAndControler,
                curFilterShowSpaceIds,
                showPostionSpaceOption,
                spaceCardShowOption,
                loadings,
                mapBgColor,
                utils: { getModuleListByLoopId, getLoopListByModuleId, getLoopListBySpaceId, getModuleListBySpaceId }
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

    const laodOtherSpaces = async () => {
        const res = await getFloorPositionObjs(currentFloorObj.value.id, false);
        // console.log('aaa: ', res);
        if (res) {
            const { spaces } = res;
            if (spaces) {
                spaces.forEach(obj => {
                    const cfg = getPositionConfig(obj.roomFuncType);
                    obj.showType = cfg.showType;
                    obj.floorId = currentFloorObj.value.id;
                    // console.log('type: ', cfg.showType);
                });
            }
            return spaces;
        }
        return [];
    };

    // 加载楼层静态数据
    const loadFloorSpaces = async () => {
        // 控制模块
        const controllers = getModuleListByFloorId(currentFloorObj.value.id);
        // 回路列表
        const loops = getLoopListByFloorId(currentFloorObj.value.id);
        // 回路服务空间
        // eslint-disable-next-line no-return-assign
        const spaceId2Loops = _.reduce(
            loops,
            (result, eq) => (
                _.map(eq.relSpace || [], space => {
                    result[space.id] = [...(result[space.id] || []), eq];
                }),
                result
            ),
            {}
        );
        const servedSpaceIdsByLoops = Object.keys(spaceId2Loops);
        // 模块所在空间
        // eslint-disable-next-line no-return-assign
        const spaceId2Controllers = _.reduce(controllers, (result, eq) => ((result[eq.relSpace?.id] = [...(result[eq.relSpace?.id] || []), eq]), result), {});
        const hostsControllerSpaceIds = Object.keys(spaceId2Controllers);

        spaceStaticApiToken.cancelQuest();
        loadings.objectsLoading.value = true;
        const spaceIds = [...servedSpaceIdsByLoops, ...hostsControllerSpaceIds];
        try {
            const paramsSpaces = {
                spaceIds
            };

            const [{ value: spaceRes }, { value: otherSpaces }] = await Promise.allSettled([
                querySpacesWithHttpConfig(paramsSpaces, { cancelToken: spaceStaticApiToken.cancelToken() }),
                laodOtherSpaces()
            ]);

            let spaces = null;
            const { code, data } = spaceRes;
            if (code === SUCCESSCODE) {
                spaces = uniqBy([...data, ...otherSpaces], 'id');
                // 为空间标记类型、挂载数据
                spaces.forEach(sp => {
                    if (hostsControllerSpaceIds.indexOf(sp.id) > -1) {
                        sp.type = SpaceType.hostsController;
                    } else if (servedSpaceIdsByLoops.indexOf(sp.id) > -1) {
                        sp.type = SpaceType.servedByLoop;
                    } else {
                        sp.type = SpaceType.position;
                    }
                    if (sp.type === SpaceType.servedByLoop) {
                        // 回路服务
                        sp.servedByLoops = spaceId2Loops[sp.id];
                    } else if (sp.type === SpaceType.hostsController) {
                        sp.servedByLoops = spaceId2Loops[sp.id];
                        sp.abnormalIds = getAbnormalIdsBySpaceId(sp.id);
                        // 模块所在
                        sp.hostsControlers = spaceId2Controllers[sp.id];
                        sp.hostsControlers.forEach(c => {
                            // 模块控制的回路ids
                            c.controlsLoops = getLoopListByModuleId(c.id);
                        });
                    }
                });
                spacesInFloor.value = spaces;
            }

            loadings.objectsLoading.value = false;
            return { spaces, spaceIds };
        } catch (error) {
            console.log('error: ', error);
        }
        loadings.objectsLoading.value = false;
    };

    const makeSpaceEquips = (res, idMap) => {
        let { spaces } = res;

        const spaceIds = [];
        const equipIds = [];
        const classcodeSet = new Set();
        spaces = spaces?.filter(obj => {
            if (!idMap[obj.id]) {
                idMap[obj.id] = obj;
                return true;
            }
            return false;
        });
        spaces?.forEach(space => {
            spaceIds.push(space.id);
            const rawSpace = toRaw(space);

            additionalFloorInfo(rawSpace, floorRecord);
        });

        return { spaces, spaceIds };
    };

    // 加载渲染楼层模型(楼板土建、视角)
    const loadAndRenderFloorModel = async floorId => {
        // console.log('loadAndRenderFloorModel: ');
        await appSceneInstances.scene?.loadFloorResource(floorId);
    };

    const rebuildElements = async () => {
        // await initPromise;

        loadings.elementsLoading.value = true;
        try {
            resetData();
            await buildingFloorPromise;
            const resSpaces = await loadFloorSpaces();
            loadFloorPromise = loadAndRenderFloorModel(currentFloorObj?.value?.id);

            if (resSpaces) {
                // await initPromise;
                const { spaces, spaceIds } = makeSpaceEquips(resSpaces, curElementIdMap);
                // console.log('spaces, equips: ', spaces, equips);

                // curFloorMapEquips.value = equips;
                await appSceneInstances.scene?.createSpaces({ spaces });
                bindSpacesEffects(spaceIds);
                hadCollisionInit = false;
            }
            await loadFloorPromise;
            appSceneInstances.scene?.updateShowElements();
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
        destoryEffect();
        destoryEffectCameras();
    };

    const mapLoading = computed(() => {
        const mapInnerLoading = loadings.initLoading.value || loadings.floorLoading.value || loadings.elementsLoading.value || loadings.objectsLoading.value;
        return mapInnerLoading;
    });

    const filterOptionData = computed(() => {
        const sapces = spacesInFloor.value.filter(s => {
            return curFilterShowSpaceIds.value ? curFilterShowSpaceIds.value.includes(s.id) : true;
        });
        return sapces;
    });

    useWatchWithCleanup(
        [() => currentFloorObj?.value?.id, () => currentFloorObj?.value?.inSpaceId],
        async ([newFloorId, newSpaceId], [preFloorId, preSpaceId]) => {
            console.log('currentFloorObj?.value: ', currentFloorObj?.value);

            if (newFloorId !== preFloorId) {
                closeDetailOrMonitor();
            }
            // 选中的当前对象清空则不继续
            if (newFloorId && newFloorId === preFloorId && !newSpaceId) {
                return;
            }
            // 选中的当前对象变化则地图选中并弹窗
            if (newFloorId && newFloorId === preFloorId && newSpaceId !== preSpaceId) {
                const spaceObj = appSceneInstances.scene?.getBaseDataById(newSpaceId);
                clickMapObj(spaceObj);
                nextTick(() => {
                    if (currentFloorObj?.value) {
                        currentFloorObj.value.inSpaceId = undefined;
                    }
                });
                return;
            }
            pauseRender(!newFloorId);
            if (newFloorId) {
                curFilterOption.value = null;
                curFilterShowSpaceIds.value = null;
                await rebuildElements();
                if (!newSpaceId) {
                    closeDetailDrawer();
                } else {
                    const spaceObj = appSceneInstances.scene?.getBaseDataById(newSpaceId);
                    clickMapObj(spaceObj);
                    nextTick(() => {
                        if (currentFloorObj?.value) {
                            currentFloorObj.value.inSpaceId = undefined;
                        }
                    });
                }
            }
        },
        {
            immediate: true
        }
    );
    useWatchWithCleanup(
        () => selectSpaceObj?.value,
        () => {
            if (!selectSpaceObj?.value?.id) {
                appSceneInstances.scene?.unselectModel();
            }
        }
    );

    useWatchWithCleanup(camerasInFloor, async () => {
        if (camerasInFloor.value?.length > 0) {
            // console.log('camerasInFloor.value: ', camerasInFloor.value?.length);
            try {
                await initPromise;
                appSceneInstances.scene?.createCameraEquips(camerasInFloor.value);
                const ids = camerasInFloor.value.map(obj => obj.id);
                bindCamerasEffect(ids);
                await loadFloorPromise;
                cameraCollisionDebounce();
            } catch (e) {
                console.log('createCameraEquips-e: ', e);
            }
        } else {
            appSceneInstances.scene?.removeCameraEquips();
        }
    });

    const getStatusListBySpaceId = inject(getStatusListBySpaceIdKey);

    useWatchWithCleanup([curFilterOption, spacesInFloor], () => {
        if (curFilterOption.value?.length) {
            curFilterShowSpaceIds.value = spacesInFloor.value
                .filter(space => {
                    let result = false;
                    const statusList = getStatusListBySpaceId(space.id);

                    curFilterOption.value.forEach(optionId => {
                        // 回路服务的空间响应筛选项前三项
                        if (optionId !== INFOCODE.abnormalEvent.id && statusList.find(s => s.id === optionId)?.value) {
                            result = true;
                            return result;
                        }
                        if (space.type === SpaceType.hostsController) {
                            // 模块所在的空间响应筛选项【异常】
                            if (optionId === INFOCODE.abnormalEvent.id && statusList.find(s => s.id === optionId)?.value) {
                                result = true;
                            }
                        } else if (space.type === SpaceType.position) {
                            result = true;
                        }
                    });
                    return result;
                })
                .map(s => s.id);
        } else {
            curFilterShowSpaceIds.value = spacesInFloor.value.map(s => s.id);
        }
    });
    useWatchWithCleanup([curFilterShowSpaceIds, showCircuitsAndControler], () => {
        // console.log('curFilterShowSpaceIds :>> ', curFilterShowSpaceIds.value, curFilterShowSpaceIds.value.length);
        closeDetailOrMonitor();
        appSceneInstances.scene?.unselectModel();
        appSceneInstances.scene?.updateShowElements();
        // appSceneInstances.scene?.updateSpaceStatus();
    });
    useWatchWithCleanup(showPostionSpaceOption, () => {
        appSceneInstances.scene?.updateShowElements();
    });
    useWatchWithCleanup(curSearchHoverEquip, () => {
        if (curSearchHoverEquip.value) {
            const { id: spaceId } = curSearchHoverEquip.value;
            if (spaceId) {
                appSceneInstances.scene?.hoverSpaceById(spaceId);
            }
        } else {
            appSceneInstances.scene?.unhoverModel();
        }
    });

    const bindSpacesEffects = spaceIds => {
        destoryEffect();
        // scope = effectScope();
        createEffect(() => {
            // 缓存上一次的状态，用于脏检查对比
            const prevStateMap = new Map();

            watchEffect(() => {
                spaceIds.forEach(spaceId => {
                    // 1. 计算当前最新状态
                    const spaceStatus = getStatusListBySpaceId(spaceId);
                    const hasOnOffAbnormal = spaceStatus.find(s => s.id === SPACE_SWITCH_ABNORMAL.id)?.value;
                    const { dataValue } = getIotData(spaceId, 'workPlaneLux');
                    const currentState = {
                        onOffAbnormal: !!hasOnOffAbnormal,
                        hasLux: dataValue !== undefined
                    };

                    // 2. 和上一次状态对比，只有值真正变化才触发渲染
                    const prevState = prevStateMap.get(spaceId);
                    if (!prevState || prevState.onOffAbnormal !== currentState.onOffAbnormal || prevState.hasLux !== currentState.hasLux) {
                        // 3. 仅变化的空间调用渲染更新
                        appSceneInstances.scene.updateOneSpaceState(spaceId, 'onOffNormal', !currentState.onOffAbnormal);
                        appSceneInstances.scene.updateOneSpaceState(spaceId, 'onOffAbnormal', currentState.onOffAbnormal);
                        appSceneInstances.scene.updateOneSpaceState(spaceId, 'hasLux', currentState.hasLux);
                        prevStateMap.set(spaceId, currentState);
                    }
                });
            });
        });
    };

    const bindCamerasEffect = cameraIds => {
        destoryEffectCameras();
        createEffectCameras(() => {
            cameraIds.forEach(equipId => {
                // 设备异常
                watchEffect(() => {
                    const cameraAbnormal = getObjectAbnormalStatus(equipId);

                    appSceneInstances.scene.updateOneCameraState(equipId, 'abnormal', cameraAbnormal);
                });
            });
        });
    };

    const onRelSpacesHover = spaceIds => {
        const spaceIdsSet = new Set([...spaceIds, ...curHoverLoopRelSpaceids.value]);
        curHoverLoopRelSpaceids.value = [...spaceIdsSet];
    };
    const onRelSpacesUnHover = spaceIds => {
        const spaceIdsSet = new Set([...curHoverLoopRelSpaceids.value].filter(id => !spaceIds.includes(id)));
        curHoverLoopRelSpaceids.value = [...spaceIdsSet];
    };

    watch(curHoverLoopRelSpaceids, () => {
        appSceneInstances.scene?.updateSpaceOutlineHover(curHoverLoopRelSpaceids.value ?? []);
    });

    onMounted(() => {
        initCreateAndView();
        emitter.on('relSpacesHover', onRelSpacesHover);
        emitter.on('relSpacesUnHover', onRelSpacesUnHover);

        resizeOb = new ResizeObserver(() => windowResize());
        resizeOb.observe(graphWarp.value);
    });

    watchEffect(() => {
        const allBuildingData = xplantindoorenvStore().buildingData;
        if (dashboardFloorIds?.value?.length && allBuildingData?.length) {
            const _building = filterBuildFloors(dashboardFloorIds.value, allBuildingData);
            _building.forEach(items => {
                items.floorList.forEach(item => {
                    item.dot = computed(() => {
                        let ids = getAbnormalIdsByFloorId(item.id);
                        if (ids.length > 0) {
                            return getAbnormalEventsList(ids).length > 0;
                        }
                        return false;
                    });
                });
            });
            buildFloors.value = _building;
        } else {
            buildFloors.value = [];
        }
    });

    onBeforeUnmount(() => {
        emitter.off('relSpacesHover', onRelSpacesHover);
        emitter.off('relSpacesUnHover', onRelSpacesUnHover);
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
    });

    provide(filterOptionDataKey, filterOptionData);
    provide(curFilterShowSpaceIdsKey, curFilterShowSpaceIds);
    provide(curFilterOptionKey, curFilterOption);
    provide(curSearchHoverEquipKey, curSearchHoverEquip);
    return {
        graphWarp,
        goDefault,
        panelSelectData,
        panelSelectChange,
        mapLoading,
        curHoverObj,
        hoverCardPosition,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender,
        buildFloors,
        curFilterShowSpaceIds,
        filterOptionData,
        selectSpace,
        curSearchHoverEquip,
        moveCameraToBox,
        mapBgColor
    };
};
