// @ts-ignore
import i18n from '@/localization';
import BuildFloorScene from './BuildingFloorScene';
import { ref, computed, inject, watch, toRaw } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import {
    currentFloorObjInjectKey,
    headerModelViewKey,
    mapBgColorKey,
    buildFloorMapRefKey,
    staticSpaceListKey,
    staticEquipListKey,
    getSpacesByFloorIdKey,
    getEquipsByFloorIdKey,
    relFloorIdListKey,
    treeBuildFloorStorePromiseKey
} from '../../hooks/useBaseHook';
import useEffectWarp from '@/hooks/useEffectWarp';
import { MONITORING_CONTROL_TYPE, RUNNING_MONITOR_TYPE } from '../../variables';
import { getEquipTypeList, isAirSupplyObj, isAirExhaustObj, isNaturalVentObj } from '../../utils';
import { equipTypeOptionsKey, onlyShowControlledEquipmentKey, filterEquipmentTypeKey, curSceneSelSpaceTypesKey, curSceneEnvParamKey } from '../../hooks/useHeaderHook';
import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, selectObjKey } from '../../hooks/useDrawerCommon';
// import { showAbnormalStateKey } from '../constant/symbols';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { getFloorInfoByFloorId, getBuildingInfoByFloorId } from '@/utils/buildingUtils';

import { $Message } from 'meri-plus';
import DockSingleton from '@/hooks/responsiveDock';
import { OBJ_TYPE, SUCCESSCODE } from '@/utils/globalVariables';
import { listModelViewFieldsByObjectId } from '@/apis/public';
// import { spaceStaticDataLoadingKey, mapStaticDataLoadingKey } from '../constant/symbols';
// import { EQUIP_TYPE_DICT, allSpacesInjectKey, allEquipsInjectKey, spacesAndEquipsLoadingInjectKey } from '../constant/symbols';

export default () => {
    const { base } = useStore();

    const { getObjectAbnormalStatus, getIotData, getAbnormalEventsList } = DockSingleton.getInstance();

    const currentFloorObj = inject(currentFloorObjInjectKey);
    const currentTab = inject('currentTab');

    const onlyShowControlledEquipment = inject(onlyShowControlledEquipmentKey);
    const curSceneEnvParam = inject(curSceneEnvParamKey);
    const filterEquipmentType = inject(filterEquipmentTypeKey);
    const curSceneSelSpaceTypes = inject(curSceneSelSpaceTypesKey);
    const equipTypeOptions = inject(equipTypeOptionsKey);
    const relFloorIdList = inject(relFloorIdListKey);
    const mapBgColor = inject(mapBgColorKey);
    const headerModelView = inject(headerModelViewKey);

    const buildingSpaceTree = inject('buildingSpaceTree');

    const getEquipsByFloorId = inject(getEquipsByFloorIdKey);
    const getSpacesByFloorId = inject(getSpacesByFloorIdKey);

    const staticSpaceList = inject(staticSpaceListKey);
    const staticEquipList = inject(staticEquipListKey);
    const buildingInfoPromise = inject(treeBuildFloorStorePromiseKey);

    const selectObj = inject(selectObjKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);
    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);

    const spaceStaticDataLoading = inject('spaceStaticDataLoadingKey');

    const graphWarp = ref(null);

    const curHoverObj = ref();
    const hoverCardPosition = ref();

    const { createEffect, destoryEffect } = useEffectWarp();

    // 楼层id映射空间列表
    const floorIdMapEquipTypes = ref({});
    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        elementsLoading: ref(false),
        floorLoading: ref(false),
        pipeDataLoading: ref(false),
        spaceDataLoading: ref(false),
        detailLoading: ref(false)
    };

    let initPromis = null,
        resizeOb = null,
        spaceIdMap = null,
        _spaceIotCache = {};

    // 初始化楼层选择器列表
    const buildFloors = computed(() => {
        console.log('floorList.value: ', relFloorIdList.value);
        const _building = generateBuildFloors(Array.from(new Set(relFloorIdList.value)));
        if (_building?.length) {
            _building.forEach(items => {
                items.name = items.localName;
                items.floorList.forEach(item => {
                    const spaceIds = getSpacesByFloorId(item.id).map(obj => obj.id) || [];
                    const equipIds = getEquipsByFloorId(item.id).map(obj => obj.id) || [];
                    item.name = item.localName;
                    item.dot = getAbnormalEventsList([...spaceIds, ...equipIds])?.length > 0;
                });
            });
        }
        // if (!currentFloorObj?.value && _building.length > 1) {
        //     return [{ name: '项目', id: 'project', floorList: [] }, ..._building];
        // }

        // console.log('_building: ', _building);
        return _building;
    });

    const generateBuildFloors = floorList => {
        if (!floorList?.length) {
            return [];
        }

        let allBuildingData = xplantindoorenvStore().buildingData;
        allBuildingData = allBuildingData
            ?.map(b => {
                const building = { ...b };
                building.floorList = b.floors?.filter(f => floorList?.includes(f.id)).sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
                return building;
            })
            .filter(building => building.floorList?.length)
            .sort((a, b) => b.floorSequenceId - a.floorSequenceId);

        return allBuildingData;
    };
    // 请求模型视图字段（bimLocation、outline 等 3D 渲染必要字段）
    const queryMapInfos = async (ids, { cancelToken } = {}) => {
        if (!ids?.length) return [];
        const p = {
            runningMonitorType: RUNNING_MONITOR_TYPE,
            objectIds: ids
        };
        const config = cancelToken ? { cancelToken } : {};
        const res = await listModelViewFieldsByObjectId(p, config);
        return res?.code === SUCCESSCODE ? res.data || [] : [];
    };

    // 将 queryMapInfos 返回的字段按 objectId ↔ id 合并到静态数据，并过滤无 bimLocation 的对象
    const mergeAndFilter = (staticList, modelViewFields) => {
        const fieldMap = new Map((modelViewFields || []).map(f => [f.objectId, f]));
        return staticList
            .map(obj => {
                const extra = fieldMap.get(obj.id);
                return extra ? { ...obj, ...extra } : obj;
            })
            .filter(obj => obj.bimLocation);
    };

    // 根据当前选择的环境参数，更新空间label图元iot code
    const setSpaceEnvParams = () => {
        appSceneInstances.scene?.updateSpacesIotCode(currentFloorObj?.value?.id ? curSceneEnvParam.value : '');
    };

    const mapLoading = computed(
        () => loadings.initLoading.value || loadings.floorLoading.value || loadings.pipeDataLoading.value || loadings.elementsLoading.value || loadings.detailLoading.value
    );

    // 默认加载位置
    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const windowResize = () => {
        if (appSceneInstances.app && headerModelView.value === 'model') {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const pauseRender = pause => {
        appSceneInstances.scene?.pauseRender(pause);
    };

    const clickSpaceOrEquip = obj => {
        console.log('clickSpaceOrEquip--obj: ', obj);
        openDetailDrawer(obj);
    };

    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            if (appSceneInstances.scene) {
                appSceneInstances.scene?.dispose();
            }
            if (appSceneInstances.app) {
                appSceneInstances.app.dispose();
            }
            appSceneInstances.scene = new BuildFloorScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                loadings,
                bgColor: mapBgColor,
                curSceneSelSpaceTypes,
                filterEquipmentType,
                onlyShowControlledEquipment
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });
            loadings.initLoading.value = true;

            // appSceneInstances.scene.addEventListener('clickFloor', obj => {
            //     console.log('点击楼层标签----obj: ', obj);
            //     if (currentFloorObj) {
            //         currentFloorObj.value = obj?.data;
            //     }
            // });

            appSceneInstances.scene.addEventListener('onHoverCard', obj => {
                console.log('onHoverEquip空间----obj: ', obj);
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
            appSceneInstances.scene.addEventListener('onUnHover', obj => {
                // console.log('onUnEquip设备----obj: ', Date.now());
                curHoverObj.value = null;
                if (hoverCardPosition.value) {
                    hoverCardPosition.value = null;
                }
            });

            appSceneInstances.scene.addEventListener('clickDetail', obj => {
                console.log('点击空间或控制模块----obj: ', obj);
                clickSpaceOrEquip(obj.data);
            });
            try {
                await appSceneInstances.scene.initLoader();
            } catch (e) {
                console.log('e: ', e);
            }
            loadings.initLoading.value = false;
        }
    };

    const createElements = async data => {
        try {
            await appSceneInstances.scene.createElements(data);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const nameAfterBack = computed(() => {
        return '';
    });

    const mapSwitchMode = async (m, floorId) => {
        await appSceneInstances.scene.switchModeView(m, floorId);
    };

    const onClickMoreInfo = obj => {
        // console.log('onClickMoreInfo--obj: ', obj);
        if (obj) {
            clickSpaceOrEquip({ ...obj, classCode: obj.oriClassCode || obj.classCode });
        }
    };

    watch(
        () => currentFloorObj?.value,
        newFloorObj => {
            closeDetailDrawer();

            appSceneInstances.scene?.switchModeView(newFloorObj ? 2 : 1, newFloorObj?.id);
            appSceneInstances.scene?.updateSpacesIotCode(curSceneEnvParam.value);
            setSpaceEnvParams();
        }
    );

    watch([currentFloorObj, onlyShowControlledEquipment, floorIdMapEquipTypes], () => {
        if (currentFloorObj.value) {
            const types = new Set();
            // const floorRecord = floorIdMapEquipTypes.value[currentFloorObj.value.id];
            const floorRecord = getEquipsByFloorId(currentFloorObj.value.id);
            if (floorRecord) {
                const equips = floorRecord.filter(obj => {
                    if (onlyShowControlledEquipment?.value && obj.monitoringSurveillanceStatus !== MONITORING_CONTROL_TYPE.MEASURABLE_CONTROLLABLE) {
                        return false;
                    }
                    return true;
                });
                equipTypeOptions.value = getEquipTypeList(equips);
            }
            nextTick(() => {
                if (filterEquipmentType.value && !equipTypeOptions.value?.some(obj => obj.key === filterEquipmentType.value.key)) {
                    filterEquipmentType.value = null;
                }
                // console.log('equipTypeOptions.value: ', equipTypeOptions.value, [...types], floorRecord);
            });
        }
    });
    watch([() => currentTab?.value, filterEquipmentType, onlyShowControlledEquipment, curSceneSelSpaceTypes], () => {
        // console.log('filterEquipmentType: ', filterEquipmentType);

        closeDetailDrawer();
        appSceneInstances.scene?.updateShowElements();
    });

    watch(selectObj, newVal => {
        if (!newVal) {
            appSceneInstances.scene?.unselectModel();
            appSceneInstances.scene?.exitRelationMode();
        }
    });
    watch(curSceneEnvParam, newVal => {
        setSpaceEnvParams();
    });
    // watch(selectObj, newVal => {
    //     loadings.detailLoading.value = !!newVal?.id;
    // });

    const dealBuildingData = rawData => {
        if (rawData && rawData.length > 0) {
            const treeData = [];
            if (rawData.length === 1) {
                const { floorList: _floors } = rawData[0];
                const floors = [..._floors];
                floors
                    ?.sort((a, b) => a.floorSequenceId - b.floorSequenceId)
                    ?.forEach(res => {
                        const spaces = getSpacesByFloorId(res.id)?.map(item => {
                            return {
                                id: item.id,
                                name: item.localName ?? '--',
                                type: 'SPACE'
                            };
                        });
                        const metaItem = { id: res.id, name: res.localName ?? '--', children: spaces || [], type: 'FLOOR' };

                        treeData.push(metaItem);
                    });
            } else {
                rawData.forEach(parentRes => {
                    const parent = { id: parentRes.id, name: parentRes.localName ?? '--', children: [], type: 'BUILDING' };
                    const floors = [...parentRes.floorList];

                    floors
                        ?.sort((a, b) => a.floorSequenceId - b.floorSequenceId)
                        .forEach(res => {
                            const spaces = getSpacesByFloorId(res.id)?.map(item => {
                                return {
                                    id: item.id,
                                    name: item.localName ?? '--',
                                    type: 'SPACE'
                                };
                            });
                            const metaItem = { id: res.id, name: res.localName ?? '--', children: spaces || [], type: 'FLOOR' };

                            parent.children.push(metaItem);
                        });
                    treeData.push(parent);
                });
            }
            return treeData;
        }
    };

    watch(
        () => buildFloors.value,
        newVal => {
            if (newVal && buildingSpaceTree) {
                const buildings = buildFloors.value?.filter(b => {
                    return b.id !== 'project' && !b.disabled;
                });
                buildingSpaceTree.value = dealBuildingData(buildings);
            }
        }
    );
    watch(headerModelView, () => {
        if (headerModelView.value === 'model') {
            nextTick(() => {
                appSceneInstances.scene?._collisionInvokeDebounce();
            });
        }
    });

    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
            appSceneInstances.scene.removeEventListener('clickFloor');
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
        // appSceneInstances = {};
    };

    const initCreateAndView = async () => {
        // pageLoading.value = true;
        try {
            if (!initPromis) {
                initPromis = initScene();
            }

            // 注册window事件
            // window.addEventListener('resize', windowResize);
            await initPromis;
            mapSwitchMode(1);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const rebuildElements = async () => {
        spaceIdMap = {};
        const equipArr = new Set();

        const floorEquipTypesRecord = {};
        let spaceArr = [],
            equipmentsArr = [];
        loadings.elementsLoading.value = true;
        try {
            await buildingInfoPromise;
            // 从静态数据中取全量空间设备
            const rawSpaces = toRaw(staticSpaceList?.value || []);
            const rawEquipments = toRaw(staticEquipList.value || []);

            // 请求模型视图字段（bimLocation、outline 等），与静态数据合并后过滤
            const allIds = [...rawSpaces.map(s => s.id), ...rawEquipments.map(e => e.id)];
            const modelViewFields = await queryMapInfos(allIds);

            spaceArr = mergeAndFilter(rawSpaces, modelViewFields);
            equipmentsArr = mergeAndFilter(rawEquipments, modelViewFields);

            spaceArr?.forEach(space => {
                spaceIdMap[space.id] = space;
                space.relEquipments?.forEach(e => {
                    equipArr.add(e);
                });
            });

            const floors = relFloorIdList.value.map(floorId => {
                const floorInfo = getFloorInfoByFloorId(floorId);
                return {
                    id: floorId,
                    localId: floorInfo?.localId
                };
            });

            await createElements({ spaces: spaceArr, floors, equips: equipmentsArr });
            bindSpacesEffects();
            appSceneInstances.scene?.updateShowElements();
        } catch (e) {
            console.log('e: ', e);
        }
        floorIdMapEquipTypes.value = floorEquipTypesRecord;
        loadings.elementsLoading.value = false;
    };
    const showMapRelationMode = arr => {
        try {
            appSceneInstances.scene?.showRelationElements(arr);
        } catch (e) {
            console.log('e: ', e);
        }
        loadings.detailLoading.value = false;
    };
    const clickMapObj = obj => {
        // 点击的非本楼层对象
        if (currentFloorObj.value?.id && currentFloorObj.value?.id !== obj.floorId) {
            const floorInfo = getFloorInfoByFloorId(obj.floorId);
            const buildingInfo = getBuildingInfoByFloorId(obj.floorId);
            if (floorInfo) {
                currentFloorObj.value = { ...floorInfo, buildingLocalName: buildingInfo?.localName ?? '--', buildingId: buildingInfo?.id || '' };
                nextTick(() => {
                    appSceneInstances.scene?.clickMapObj(obj);
                });
                $Message.Default({ title: i18n.global.t('meos_control_web.change_floor_num', { floor: floorInfo.localName ?? '--' }) });
                return;
            }
        }
        appSceneInstances.scene?.clickMapObj(obj);
    };
    const hoverMapObj = obj => {
        if (currentFloorObj.value?.id && currentFloorObj.value?.id !== obj.floorId) {
            return;
        }
        appSceneInstances.scene?.hoverMapObj(obj);
    };
    const unhoverMapObj = () => {
        appSceneInstances.scene?.unhoverMapObj();
    };

    const bindSpacesEffects = () => {
        destoryEffect();
        createEffect(() => {
            staticSpaceList.value?.forEach(space => {
                // 空间异常
                watchEffect(() => {
                    const spaceId = space.id;
                    const spaceAbnormal = getAbnormalEventsList([spaceId])?.length > 0;
                    appSceneInstances.scene.updateOneModelState(spaceId, 'abnormal', spaceAbnormal);
                    let hasAirExhaustOpen = false,
                        hasAirSupplyOpen = false,
                        hasNaturalVentOpen = false;
                    space.relObjects?.forEach(equip => {
                        const infoVal = getIotData(equip.id, 'runStatus');
                        // 送风机
                        if (isAirSupplyObj(equip)) {
                            if (!hasAirSupplyOpen && infoVal?.dataValue === '1') {
                                hasAirSupplyOpen = true;
                                // “服务该空间”的送风机至少有一台能获取到运行状态（runStatus）且运行状态=运行
                            }
                        } else if (isAirExhaustObj(equip)) {
                            if (!hasAirExhaustOpen && infoVal?.dataValue === '1') {
                                hasAirExhaustOpen = true;
                                // “服务该空间”的排风机至少有一台能获取到运行状态（runStatus）且运行状态=运行
                            }
                        } else if (isNaturalVentObj(equip)) {
                            if (!hasNaturalVentOpen && infoVal?.dataValue === '1') {
                                hasNaturalVentOpen = true;
                                //  1. 正在通风：任意一个关联的送风机、排风机、普通窗或排烟窗的运行状态（runStatus）=运行=运行
                            }
                        }
                        appSceneInstances.scene.updateOneModelState(equip.id, 'closed', infoVal?.dataValue === '0');
                        appSceneInstances.scene.updateOneModelState(equip.id, 'opened', infoVal?.dataValue === '1');
                        appSceneInstances.scene.updateOneModelState(equip.id, 'abnormal', getObjectAbnormalStatus(equip.id));
                    });
                    /**
                     * 取值规则：（1）且（2）
                     * （1）“服务该空间”的全部送风机的运行状态（runStatus）=停止
                     *（2）“服务该空间”的全部排风机的运行状态（runStatus）=停止
                     */
                    const notVentilation = space.relObjects?.every(obj => {
                        if (isAirSupplyObj(obj) || isAirExhaustObj(obj) || isNaturalVentObj(obj)) {
                            const infoVal = getIotData(obj.id, 'runStatus');
                            if (infoVal.existsIotRule) {
                                return infoVal?.dataValue === '0';
                            } else {
                                return false;
                            }
                        }
                        return true;
                    });

                    appSceneInstances.scene.updateOneModelState(spaceId, 'hasVentilation', hasAirSupplyOpen || hasAirExhaustOpen || hasNaturalVentOpen);
                    appSceneInstances.scene.updateOneModelState(spaceId, 'notVentilation', notVentilation);
                });
            });
        });
    };

    onMounted(() => {
        initCreateAndView();
        // 监听模版类型变化
        const unwatchHandle = watch(
            () => [staticSpaceList?.value, staticEquipList?.value],
            () => {
                if (staticSpaceList?.value?.length > 0) {
                    unwatchHandle();
                    rebuildElements();
                }
                // console.log('loadings:---- ', loadings);
            },
            { immediate: true }
        );
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
        // queryAbnormalDataList();
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
        destoryEffect();
        currentFloorObj.value = null;
    });

    return {
        initScene,
        appSceneInstances,
        graphWarp,
        goDefault,
        windowResize,
        createElements,
        mapLoading,
        mapSwitchMode,
        onClickMoreInfo,
        nameAfterBack,
        buildFloors,
        curHoverObj,
        hoverCardPosition,
        showMapRelationMode,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender
    };
};
