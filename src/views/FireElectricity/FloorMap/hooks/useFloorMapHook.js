// @ts-ignore
import i18n from '@/localization';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { querySpacesWithHttpConfig, queryEquipsWithHttpConfig } from '@/apis/public';
import useEffectWarp from '@/hooks/useEffectWarp';
import { Environment } from '@/config';
import useStore from '@/store';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import useMapAction from './useMapAction';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import FloorScene from '../FloorMapScene';

import {
    currentFloorObjInjectKey,
    dashboardFloorIdsKey,
    buildingFloorPromiseKey,
    abnormalListInFloorKey,
    camerasInFloorKey,
    spaceIdMapEquipsKey,
    systemIdMapClassCodesKey,
    equipsInFloorKey,
    mapBgColorKey,
    isFaultFucKey,
    isAlarmFucKey,
    selectCameraInfoKey
} from '../../hooks/useCommonConfig';
import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, selectObjKey } from '../../hooks/useDrawerCommon';
import { filterBuildFloors } from '../utils/index';
import { isEmpty, isNil, debounce } from 'lodash';

export const filterOptionDataKey = Symbol('filterOptionDataKey'); //地图筛选下拉框数据
export const curFilterSpaceIdsKey = Symbol('curFilterSpaceIdsKey'); // 当前筛选选择的空间ID
export const showCameraEquipsKey = Symbol('showCameraEquipsKey'); // 当前是否显示摄像头
const curSearchHoverEquipKey = Symbol('curSearchHoverEquipKey'); // 当前搜索下拉框hover的设备
export default () => {
    const { base } = useStore();

    const buildFloors = ref([]);

    const dashboardFloorIds = inject(dashboardFloorIdsKey);
    const currentFloorObj = inject(currentFloorObjInjectKey);
    const selectSpaceObj = inject(selectObjKey);
    const buildingFloorPromise = inject(buildingFloorPromiseKey);
    const systemIdMapClassCodes = inject(systemIdMapClassCodesKey);
    const equipsInFloor = inject(equipsInFloorKey);
    const camerasInFloor = inject(camerasInFloorKey);
    const abnormalListInFloor = inject(abnormalListInFloorKey);
    const mapBgColor = inject(mapBgColorKey);
    const spaceIdMapEquips = inject(spaceIdMapEquipsKey);
    const isAlarmFuc = inject(isAlarmFucKey);
    const isFaultFuc = inject(isFaultFucKey);

    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);
    const selectCameraInfo = inject(selectCameraInfoKey);

    const graphWarp = ref(null);
    const curHoverObj = ref();
    const hoverCardPosition = ref();

    // 当前过滤的空间ID
    const curFilterSpaceIds = ref(null);
    //
    const showCameraEquips = ref(true);
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

    const clickSpaceOrEquip = obj => {
        // console.log('clickSpaceOrEquip--obj: ', obj);

        if (obj) {
            if (obj.objType === OBJ_TYPE.EQUIPMENT) {
                closeDetailDrawer();
                selectCameraInfo.value = obj;
            } else {
                openDetailDrawer({ ...obj });
                selectCameraInfo.value = null;
            }
        } else {
            closeDetailDrawer();
        }
    };
    const closeDetailOrMonitor = () => {
        closeDetailDrawer();
        selectCameraInfo.value = null;
    };
    const { clickMapObj, hoverMapObj, unhoverMapObj, onClickMoreInfo, goDefault, pauseRender, cameraCollisionDebounce, spaceBubbleCollisionDebounce } = useMapAction({
        appSceneInstances,
        clickSpaceOrEquip,
        currentFloorObj
    });

    const spaceStaticApiToken = UseCancelTokenHooks();
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

    const selectSpaceByEquip = equip => {
        const spaceId = equip?.spaceIds?.length > 0 ? equip?.spaceIds[0] : null;
        if (spaceId) {
            const spaceObj = appSceneInstances.scene?.getBaseDataById(spaceId);
            clickMapObj(spaceObj);
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
            // console.log('点击空间或控制模块----obj: ', obj);
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
                // curSelectedClasscode,
                showCameraEquips,
                curFilterSpaceIds,
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

    // 加载楼层静态数据
    const loadFloorSpaces = async () => {
        spaceStaticApiToken.cancelQuest();
        loadings.objectsLoading.value = true;
        const spaceIdSet = new Set();
        equipsInFloor?.value?.forEach(obj => {
            if (obj.spaceIds?.length > 0) {
                const spaceId = obj.spaceIds[0];
                spaceIdSet.add(spaceId);
            }
        });
        const spaceIds = [...spaceIdSet];
        // console.log('spaceIdSet: ', [...spaceIdSet]);
        try {
            const paramsSpaces = {
                spaceIds
            };
            const spaceRes = await querySpacesWithHttpConfig(paramsSpaces, { cancelToken: spaceStaticApiToken.cancelToken() });

            let spaces = null;
            const { code, data } = spaceRes;
            if (code === SUCCESSCODE) {
                spaces = data;
                spaces?.forEach(obj => {
                    obj.equipCounts = spaceIdMapEquips?.value[obj.id]?.length ?? 0;
                });
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
        await initPromise;

        loadings.elementsLoading.value = true;
        try {
            resetData();
            loadFloorPromise = loadAndRenderFloorModel(currentFloorObj?.value?.id);
            const resSpaces = await loadFloorSpaces();

            if (resSpaces) {
                await Promise.allSettled([initPromise, buildingFloorPromise]);
                const { spaces } = makeSpaceEquips(resSpaces, curElementIdMap);
                // console.log('spaces, equips: ', spaces, equips);

                // curFloorMapEquips.value = equips;
                await appSceneInstances.scene?.createSpaces({ spaces });
                bindSpacesEffects(resSpaces.spaceIds);
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
        const sysClassCodeMap = {};
        equipsInFloor?.value?.forEach(equip => {
            equip.systemId?.forEach(systemId => {
                const sysClassCodeInfo = systemIdMapClassCodes?.value[systemId];
                if (sysClassCodeInfo) {
                    let item = sysClassCodeMap[sysClassCodeInfo.classCode];
                    if (!item) {
                        sysClassCodeMap[sysClassCodeInfo.classCode] = {
                            name: sysClassCodeInfo.classCodeName,
                            id: sysClassCodeInfo.classCode,
                            children: []
                        };
                    }
                    item = sysClassCodeMap[sysClassCodeInfo.classCode];
                    // eslint-disable-next-line one-var
                    let equipClass = item.children.find(obj => obj.id === equip.classCode);
                    if (!equipClass) {
                        equipClass = { id: equip.classCode, name: equip.classCodeName, relSpaceIds: {} };
                        item.children.push(equipClass);
                    }
                    equip.spaceIds?.forEach(spaceId => {
                        equipClass.relSpaceIds[spaceId] = true;
                    });
                }
            });
        });
        return Object.values(sysClassCodeMap);
    });

    watch([() => currentFloorObj?.value?.id, () => currentFloorObj?.value?.inSpaceId], async ([newFloorId, newSpaceId], [preFloorId, preSpaceId]) => {
        // console.log('currentFloorObj?.value: ', currentFloorObj?.value);
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
            curFilterSpaceIds.value = null;
            showCameraEquips.value = true;
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
    });
    watch([() => selectSpaceObj?.value, () => selectCameraInfo?.value], () => {
        if (!selectSpaceObj?.value?.id && !selectCameraInfo?.value?.id) {
            appSceneInstances.scene?.unselectModel();
        }
    });

    watch(camerasInFloor, async () => {
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
    watch([curFilterSpaceIds, showCameraEquips], () => {
        closeDetailOrMonitor();
        appSceneInstances.scene?.unselectModel();
        appSceneInstances.scene?.updateShowElements();
        // appSceneInstances.scene?.updateSpaceStatus();
    });
    watch(curSearchHoverEquip, () => {
        if (curSearchHoverEquip.value) {
            const spaceId = curSearchHoverEquip.value?.spaceIds?.length > 0 ? curSearchHoverEquip.value?.spaceIds[0] : null;
            if (spaceId) {
                appSceneInstances.scene?.hoverSpaceById(spaceId);
            }
        } else {
            appSceneInstances.scene?.unhoverModel();
        }
    });

    const bindSpacesEffects = spaceIds => {
        destoryEffect();
        createEffect(() => {
            spaceIds.forEach(spaceId => {
                const equipInSpaces = spaceIdMapEquips.value[spaceId];
                const equipIds = [];

                equipInSpaces?.forEach(obj => {
                    equipIds.push(obj.id);
                });
                // 空间异常
                watchEffect(() => {
                    const spaceAbnormal = getAbnormalEventsList([spaceId, ...equipIds])?.length > 0;
                    appSceneInstances.scene.updateOneSpaceState(spaceId, 'abnormal', spaceAbnormal);
                });
                watchEffect(() => {
                    let faultCount = 0,
                        alarmCount = 0;
                    const statusList = [];
                    const abnormalCount = getAbnormalEventsList([spaceId, ...equipIds])?.length || 0;

                    // 统计各状态数量
                    equipInSpaces?.forEach(obj => {
                        faultCount += isFaultFuc(obj) ? 1 : 0;
                        alarmCount += isAlarmFuc(obj) ? 1 : 0;
                    });

                    if (abnormalCount > 0) {
                        statusList.push({ code: 'abnormal', value: abnormalCount, name: i18n.global.t('meos_control_web.abnormal_event') });
                    }
                    if (alarmCount > 0) {
                        statusList.push({ code: 'alarm', value: alarmCount, name: i18n.global.t('meos_control_web.alarm_signal') });
                    }
                    if (faultCount > 0) {
                        statusList.push({ code: 'fault', value: faultCount, name: i18n.global.t('meos_control_web.fault_signal') });
                    }

                    // 空间气泡数据变化
                    appSceneInstances.scene.updateOneSpaceData(spaceId, statusList);
                    spaceBubbleCollisionDebounce();
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

    onMounted(() => {
        initCreateAndView();

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
                        if (abnormalListInFloor?.value) {
                            return abnormalListInFloor.value[item.id]?.length > 0;
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
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
    });

    provide(filterOptionDataKey, filterOptionData);
    provide(curFilterSpaceIdsKey, curFilterSpaceIds);
    provide(showCameraEquipsKey, showCameraEquips);
    provide(curSearchHoverEquipKey, curSearchHoverEquip);
    return {
        graphWarp,
        goDefault,
        mapLoading,
        curHoverObj,
        hoverCardPosition,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender,
        buildFloors,
        curFilterSpaceIds,
        filterOptionData,
        selectSpaceByEquip,
        curSearchHoverEquip
    };
};
