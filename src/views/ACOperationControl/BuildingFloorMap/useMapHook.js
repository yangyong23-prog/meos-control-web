// @ts-ignore
import i18n from '@/localization';
import BuildFloorScene from './BuildingFloorScene';
import { ref, computed, inject, watch, watchEffect } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment, useFloorCollisionSetting } from '@/config';
import dataDockHandling from '@/hooks/dataDockHandling';
import useEffectWarp from '@/hooks/useEffectWarp';
import DockSingleton from '@/hooks/responsiveDock';
import { AIR_TERMINAL, MODEL_VIEW, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import axios from 'axios';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { queryPipeListByFloor } from '@/apis/ACOperationControl';
import { listInfoCodeConfigsByObjectIdCommon, listModelViewFieldsByObjectId } from '@/apis/public';
import {
    headerModelViewKey,
    currentFloorObjKey,
    abnormalParamIdsKey,
    mapAllLoadedKey,
    onlyShowIOTSpaceKey,
    topologyControllerKey,
    selectObjectInjectKey,
    spacesAndEquipsStaticDataLoadedKey,
    spacesAndEquipsStaticDataKey,
    spaceIotDataLoadingKey
} from '../injectKeys';
import { SELECT_SOURCE } from '../constants/constant';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { getEnvScope, ENV_SCOPE_MAP_TARGET_OBJECT_MAP } from '../constants/constant';
import { dashboardEnvTabsInjectKey } from '../hooks/useDashboard';
import { isSpaceEnvShielded } from '../utils/shield';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';

export default emits => {
    const { base } = useStore();
    const { writeDataToResponsiveDock } = dataDockHandling();
    console.log('useFloorCollisionSetting: ', useFloorCollisionSetting);
    const { getIotData, getCustomInfo, getObjectAbnormalStatus } = DockSingleton.getInstance();

    const currentFloorObj = inject(currentFloorObjKey);
    const currentTab = inject('currentTab');
    const currentTabFloor = inject('currentTabFloor');
    const currentEnvAttr = inject('currentEnvAttr');
    const currentEnvAttrFloor = inject('currentEnvAttrFloor');
    const showPipes = inject('showPipes');
    const onlyShowControlledEquipment = inject('onlyShowControlledEquipment');
    const filterEquipmentClass = inject('filterEquipmentClass');

    const showModuleInfo = inject('showModuleInfo');
    const topologyController = inject(topologyControllerKey, null);
    const selectObject = inject(selectObjectInjectKey, null);
    const buildingSpaceTree = inject('buildingSpaceTree');
    const headerModelView = inject(headerModelViewKey);
    const spaceIotDataLoading = inject(spaceIotDataLoadingKey);

    // 合并后的全量空间设备数据（含 modelView 字段），替代原 allSpacesData / allEquipsData
    const mergedAllSpaces = ref([]);
    const mergedAllEquips = ref([]);

    const spacesAndEquipsLoaded = inject(spacesAndEquipsStaticDataLoadedKey);
    const spacesAndEquipsStaticData = inject(spacesAndEquipsStaticDataKey);

    const abnormalParamIds = inject(abnormalParamIdsKey);
    const mapAllLoaded = inject(mapAllLoadedKey);
    const onlyShowIOTSpace = inject(onlyShowIOTSpaceKey);

    const graphWarp = ref('');

    const curHoverObj = ref();
    const hoverCardPosition = ref();

    // 楼层图渲染设置：空间和设备同时碰撞、显示优先级；由 FloorMapSetting 通过 v-model 双向同步
    const mapSettings = ref({
        collision: 'uncheck',
        priority: 'equip'
    });

    const floorList = ref([]); // 楼层列表
    const isFloorAbnormal = ref({});
    // 楼层id映射空间列表
    const floorIdMapSpaces = ref({});
    const appSceneInstances = {};
    const buildFloors = ref([]);

    const loadings = {
        initLoading: ref(false),
        elementsLoading: ref(false),
        floorLoading: ref(false),
        pipeDataLoading: ref(false),
        spaceDataLoading: ref(false),
        detailLoading: ref(false)
    };
    const dyncInfoApiToken = UseCancelTokenHooks();
    const otherSpacesApiToken = UseCancelTokenHooks();

    let initPromis = null,
        resizeOb = null,
        buildingInfoPromise = null,
        cancelTokenSource,
        positionSpaceCache = {};

    const isModelView = computed(() => headerModelView.value === 'model');
    // 已加载过的楼层 ID 缓存，避免重复加载
    const loadedFloorIds = new Set();

    const generateBuildFloors = _floorList => {
        if (!_floorList?.length) {
            return [];
        }

        let allBuildingData = xplantindoorenvStore().buildingData;
        allBuildingData = allBuildingData
            ?.map(b => {
                const building = { ...b, name: b?.localName };
                building.floorList = b.floors?.filter(f => _floorList?.includes(f.id)).sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
                return building;
            })
            .filter(building => building.floorList?.length)
            .sort((a, b) => b.floorSequenceId - a.floorSequenceId);
        return allBuildingData;
    };

    watch(
        floorList,
        () => {
            if (floorList.value?.length) {
                const _building = generateBuildFloors(Array.from(new Set(floorList.value)));
                if (_building?.length) {
                    _building.forEach(items => {
                        items.floorList.forEach(item => {
                            item.name = item.localName;
                            item.dot = computed(() => {
                                return isFloorAbnormal.value[item.id] === item.id;
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

    const mapLoading = computed(() => loadings.initLoading.value || loadings.floorLoading.value || loadings.pipeDataLoading.value || loadings.elementsLoading.value);

    // 默认加载位置
    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const windowResize = () => {
        if (appSceneInstances.app && isModelView.value) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const pauseRender = pause => {
        appSceneInstances.scene?.pauseRender(pause);
    };

    const clickSpaceOrEquip = obj => {
        if (!obj) {
            showModuleInfo.value = false;
            return;
        }

        if (selectObject) {
            try {
                selectObject(obj, SELECT_SOURCE.MAP);
            } catch (e) {
                console.error('[clickSpaceOrEquip] selectObject error:', e);
                // 降级
                if (topologyController?.applyDetailSelection) {
                    topologyController.applyDetailSelection({ ...obj, objType: obj.objType, type: obj.objType });
                }
            }
        } else {
            console.warn('[clickSpaceOrEquip] selectObject not injected, using fallback');
            if (topologyController?.applyDetailSelection) {
                topologyController.applyDetailSelection({ ...obj, objType: obj.objType, type: obj.objType });
            }
        }
    };

    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            // await buildingInfoPromise;

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
                curFilterType: currentTab,
                currentTabFloor: currentTabFloor,
                filterEquipmentClass,
                currentEnvAttr,
                currentEnvAttrFloor,
                showPipes,
                // onlyShowAbnormal,
                onlyShowControlledEquipment,
                onlyShowIOTSpace,
                mapSettings
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });
            loadings.initLoading.value = true;

            appSceneInstances.scene.addEventListener('clickFloor', obj => {
                console.log('点击楼层标签----obj: ', obj);
                if (currentFloorObj) {
                    currentFloorObj.value = obj?.data;
                }
            });

            appSceneInstances.scene.addEventListener('onHoverCard', obj => {
                console.log('onHoverEquip空间----obj: ', obj);
                if (obj.data) {
                    const { instance, pos } = obj.data;
                    if (instance && pos) {
                        const cardData = {
                            ...instance,
                            classCode: instance.objType === OBJ_TYPE.EQUIPMENT ? instance.classCode : '',
                            oriClassCode: instance.classCode,
                            graphTypeCode: i18n.global.t('meos_control_web.space_environment_and_regulation')
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

    const queryPipes = async () => {
        loadings.pipeDataLoading.value = true;
        if (cancelTokenSource) {
            cancelTokenSource.cancel(i18n.global.t('meos_control_web.cancel_last_request'));
            cancelTokenSource = null;
        }
        cancelTokenSource = axios.CancelToken.source();

        const p = {
            projectId: base.projectId,
            floorId: currentFloorObj?.value?.id
        };
        try {
            const res = await queryPipeListByFloor(p, {
                cancelToken: cancelTokenSource.token
            });
            // console.log('res=======: ', res);
            loadings.pipeDataLoading.value = false;
            if (res.code === '00000' && res.data) {
                return res.data;
            }
        } catch (e) {
            console.log('e: ', e);
            loadings.pipeDataLoading.value = false;
        }
    };

    // 通道 B 楼层请求取消令牌
    const floorMapInfoToken = UseCancelTokenHooks();

    // 请求模型视图字段（bimLocation、outline 等 3D 渲染必要字段）
    const queryMapInfos = async (ids, { cancelToken } = {}) => {
        if (!ids?.length) return [];
        const p = {
            runningMonitorType: AIR_TERMINAL,
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

    const createElements = async data => {
        try {
            await appSceneInstances.scene.createElements(data);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const mapSwitchMode = async (m, floorId) => {
        await appSceneInstances.scene.switchModeView(m, floorId);
    };

    const onClickMoreInfo = obj => {
        if (obj && selectObject) {
            selectObject({ ...obj, classCode: obj.oriClassCode || obj.classCode }, SELECT_SOURCE.MAP_HOVER);
        }
    };

    // 创建/更新辅助空间图元
    const createOrUpdatePositionSpaces = async newFloorId => {
        if (newFloorId) {
            let spaces = positionSpaceCache[newFloorId];
            if (!spaces) {
                spaces = await laodOtherSpaces(newFloorId);
                positionSpaceCache[newFloorId] = spaces;
            }

            appSceneInstances.scene?.createOtherSpaces(spaces);
            appSceneInstances.scene?.updateOtherSpacesShow();
        }
    };

    const floorIdMapObjIds = computed(() => {
        const staticData = spacesAndEquipsStaticData.value || {};
        const mapObj = {};
        (staticData.spaces || [])?.forEach(obj => {
            if (!mapObj[obj.floorId]) {
                mapObj[obj.floorId] = new Set();
            }
            mapObj[obj.floorId].add(obj.id);
        });

        (staticData.equipments || [])?.forEach(obj => {
            if (!mapObj[obj.floorId]) {
                mapObj[obj.floorId] = new Set();
            }
            mapObj[obj.floorId].add(obj.id);
        });
        Object.keys(mapObj).forEach(fId => {
            if (mapObj[fId]) {
                mapObj[fId] = [...mapObj[fId]];
            }
        });
        return mapObj;
    });

    watch(
        () => currentFloorObj?.value?.id,
        async newFloorId => {
            showModuleInfo.value = false;

            // 只有从dashboard 进入楼层图时才执行，返回dashboard不执行,从楼层图返回全楼图也会执行
            if (isModelView.value) {
                appSceneInstances.scene?.switchModeView(newFloorId ? 2 : 1, newFloorId);
            }

            if (newFloorId) {
                abnormalParamIds.value = floorIdMapObjIds.value[newFloorId] ?? [];

                createOrUpdatePositionSpaces(newFloorId);
                // 🆕 通道 B：该楼层未缓存时才加载
                if (!loadedFloorIds.has(newFloorId)) {
                    loadFloorElements(newFloorId);
                }
            } else {
                const staticData = spacesAndEquipsStaticData.value || {};
                abnormalParamIds.value = [...(staticData.equipments || []).map(item => item.id), ...(staticData.spaces || []).map(item => item.id)];
            }
        }
    );

    // eslint-disable-next-line one-var
    // let enterBuildingTimer = null;
    watch(
        () => headerModelView.value,
        () => {
            // clearTimeout(enterBuildingTimer);
            // 从dashboard 进入 全楼视角时
            if (isModelView.value && !currentFloorObj?.value?.id) {
                // enterBuildingTimer = setTimeout(() => {
                // });
                appSceneInstances.scene?.switchModeView(1);
            }
        }
    );

    watch(
        [() => currentTab?.value, currentEnvAttr, currentEnvAttrFloor, filterEquipmentClass, onlyShowControlledEquipment, currentTabFloor, currentEnvAttrFloor, onlyShowIOTSpace],
        () => {
            showModuleInfo.value = false;
            appSceneInstances.scene?.updateModelsShowAndStyle();
        }
    );

    // 楼层图渲染设置变化(空间和设备同时碰撞开关/显示优先级): 重新给不同的碰撞器更新元素并触发碰撞
    watch(
        () => ({ ...mapSettings.value }),
        () => {
            appSceneInstances.scene?.updateModelsShowAndStyle();
        }
    );

    watch([() => currentFloorObj?.value?.id, showPipes], ([floorId, pipes], [oldFloorId]) => {
        if (floorId && pipes && !appSceneInstances.scene?.hasCachedPipes(floorId)) {
            queryPipes().then(pipesData => {
                appSceneInstances.scene?.createRevitePipes(pipesData);
            });
        }
        // 楼层变了 → switchModeView 里已调过 updateModelsShowAndStyle → 跳过
        // 楼层没变（只变了管道开关）→ 需要更新
        if (isModelView.value && floorId === oldFloorId) {
            appSceneInstances.scene?.updateModelsShowAndStyle();
        }
    });

    watch(showModuleInfo, newVal => {
        if (!newVal) {
            appSceneInstances.scene?.unselectModel();
            appSceneInstances.scene?.exitRelationMode();
        }
    });

    const dealBuildingData = rawData => {
        if (rawData && rawData.length > 0) {
            const treeData = [];
            if (rawData.length === 1) {
                const { floorList: _floors } = rawData[0];
                const floors = [..._floors];
                floors
                    ?.sort((a, b) => a.floorSequenceId - b.floorSequenceId)
                    ?.forEach(res => {
                        const spaces = floorIdMapSpaces.value[res.id]?.map(item => {
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
                    const floors = parentRes.floorList ? [...parentRes.floorList] : [];

                    floors
                        ?.sort((a, b) => a.floorSequenceId - b.floorSequenceId)
                        .forEach(res => {
                            const spaces = floorIdMapSpaces.value[res.id]?.map(item => {
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

    const sceneDestroy = () => {
        cancelEffectsCleanup();
        destoryMapEffects();
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
            const curFloorId = currentFloorObj?.value?.id;
            mapSwitchMode(curFloorId ? 2 : 1, curFloorId);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    // 加载辅助空间数据
    const laodOtherSpaces = async () => {
        otherSpacesApiToken.cancelQuest();
        const params = {
            projectId: base.projectId,
            templateCode: MODEL_VIEW,
            runningMonitorType: 'COMMON',
            runningMonitorSecondType: 'FIXED_OBJECT',
            filterGroups: [
                {
                    groupCode: 'relation',
                    infoCodes: ['airTerminalSpaceInFloor']
                }
            ],
            objectIds: [currentFloorObj.value.id]
        };
        const res = await listInfoCodeConfigsByObjectIdCommon(params, null, { cancelToken: otherSpacesApiToken.cancelToken() });

        if (res?.code === SUCCESSCODE && res.data?.length > 0) {
            const floorObj = res.data[0];
            const spaces = floorObj.relInfoCodeGroupConfigs
                ?.find(obj => obj.groupCode === 'relation')
                ?.relInfoCodeConfigs?.find(obj => obj.infoCode === 'airTerminalSpaceInFloor')?.dataValue;

            const allSpaces = [...spaces];
            if (allSpaces?.length > 0) {
                const floorRecord = {};
                allSpaces.forEach(obj => {
                    obj.isPositionSpace = true;
                    obj.floorId = floorObj.id;
                    additionalFloorInfo(obj, floorRecord);
                });
            }
            return allSpaces;
        }
    };

    // 获取动态数据
    const loadFloorDyncData = async (ids = []) => {
        dyncInfoApiToken.cancelQuest();
        if (!ids?.length) {
            return;
        }
        try {
            const params = {
                // projectId: base.projectId,
                runningMonitorType: AIR_TERMINAL,
                objectIds: ids,
                templateType: MODEL_VIEW
                // withColumns: ['id', 'localName', 'classCode', 'floorId']
            };
            // const { code, data } = await listInfoCodeConfigsByObjectIdCommon(params, { cancelToken: dyncInfoApiToken.cancelToken() });
            const { code, data } = await listInfoCodeConfigsByObjectIdCommon(params);

            if (code === SUCCESSCODE && data) {
                writeDataToResponsiveDock(data);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    // 通道 A：全量加载所有空间设备模型并渲染（不可取消）
    const loadAllElements = async () => {
        floorList.value = [];
        const equipArr = new Set();
        let spaceArr = [],
            equipmentsArr = [],
            floorMapSpaces = {},
            floorRecord = {},
            floorAbnormals = {};
        loadings.elementsLoading.value = true;
        try {
            await buildingInfoPromise;
            // 从静态数据中取全量空间设备并去重
            const staticData = spacesAndEquipsStaticData.value || {};
            const objIdMap = {};
            const spaces = [],
                equipments = [];
            (staticData.equipments || []).forEach(item => {
                if (!objIdMap[item.id]) {
                    objIdMap[item.id] = true;
                    equipments.push(item);
                }
            });
            (staticData.spaces || []).forEach(item => {
                if (!objIdMap[item.id]) {
                    objIdMap[item.id] = true;
                    spaces.push(item);
                }
            });
            let loadDyncPromise = null,
                floors = [];

            // 🆕 请求模型视图字段（bimLocation、outline 等），不可取消
            const allIds = [...(spaces ?? []).map(s => s.id), ...equipments.map(e => e.id)];
            const modelViewFields = await queryMapInfos(allIds);

            // 🆕 合并字段 + 过滤无 bimLocation 的对象
            spaceArr = mergeAndFilter(toRaw(spaces) || [], modelViewFields);
            equipmentsArr = mergeAndFilter(toRaw(equipments) || [], modelViewFields);

            // 写入合并后的全量数据，供楼层筛选和 SSE watchEffect 使用
            mergedAllSpaces.value = spaceArr;
            mergedAllEquips.value = equipmentsArr;
            emits('getEquipments', structuredClone(equipmentsArr));

            // loadDyncPromise = loadFloorDyncData([...spaceArr, ...equipmentsArr]);
            const objIdSet = new Set();
            const classCodeMap = {};
            spaceArr?.forEach((space, index) => {
                objIdSet.add(space.id);
                if (!classCodeMap[space.classCode]) {
                    classCodeMap[space.classCode] = [];
                }
                classCodeMap[space.classCode].push(space.id);
                const isAbnormal = getObjectAbnormalStatus(space.id);
                if (isAbnormal) {
                    floorAbnormals[space.floorId] = space.floorId;
                }
                const rawSpace = toRaw(space);
                if (!floorMapSpaces[rawSpace.floorId]) {
                    floorMapSpaces[rawSpace.floorId] = [];
                }
                floorMapSpaces[rawSpace.floorId].push(rawSpace);

                additionalFloorInfo(rawSpace, floorRecord);
                rawSpace.relEquipments?.forEach(e => {
                    equipArr.add(e);
                });
            });

            floorList.value = Object.keys(floorRecord);

            floorIdMapSpaces.value = floorMapSpaces;
            equipmentsArr?.forEach((equipment, index) => {
                objIdSet.add(equipment.id);
                if (!classCodeMap[equipment.classCode]) {
                    classCodeMap[equipment.classCode] = [];
                }
                classCodeMap[equipment.classCode].push(equipment.id);
                const isAbnormal = getObjectAbnormalStatus(equipment.id);
                if (isAbnormal) {
                    floorAbnormals[equipment.floorId] = equipment.floorId;
                }
                additionalFloorInfo(equipment, floorRecord);
            });
            isFloorAbnormal.value = floorAbnormals;
            abnormalParamIds.value = [...objIdSet];
            const builds = xplantindoorenvStore().buildingFloorData;
            builds.forEach(ele => {
                floors = floors.concat(
                    ele.floors.map(item => {
                        return {
                            id: item.id,
                            localId: item.localId
                        };
                    })
                );
            });
            await createElements({ spaces: [...spaceArr], floors, equips: [...equipmentsArr] });
            // await loadDyncPromise;
            // 通道 A 完成后，标记所有楼层已缓存
            floorList.value.forEach(fId => loadedFloorIds.add(fId));
            bindAllEffects();
        } catch (e) {
            console.log('e: ', e);
        }
        loadings.elementsLoading.value = false;
        if (mapAllLoaded) {
            mapAllLoaded.value = true;
        }
    };

    // 通道 B：楼层级加载空间设备模型数据并渲染（可取消，频繁切换时取消上次）
    const loadFloorElements = async floorId => {
        floorMapInfoToken.cancelQuest();
        const { spaces, equipments } = spacesAndEquipsStaticData.value || {};
        const floorSpaces = (spaces || []).filter(s => s.floorId === floorId);
        const floorEquips = (equipments || []).filter(e => e.floorId === floorId);
        const floorIds = [...floorSpaces.map(s => s.id), ...floorEquips.map(e => e.id)];

        if (!floorIds.length) return;

        try {
            const modelViewFields = await queryMapInfos(floorIds, {
                cancelToken: floorMapInfoToken.cancelToken()
            });
            const mergedSpaces = mergeAndFilter(floorSpaces, modelViewFields);
            const mergedEquips = mergeAndFilter(floorEquips, modelViewFields);

            const { scene } = appSceneInstances;
            // 直接调用原子方法（不经 BatchHelper），避免与通道 A 的 BatchHelper 并发冲突
            if (mergedSpaces.length) scene.createSpaces(mergedSpaces);
            if (mergedEquips.length) {
                scene.ensureEquipGroups(mergedEquips);
                scene.createEquip2DModels(mergedEquips);
            }
            scene.updateModelsShowAndStyle();
            // 标记该楼层已缓存
            loadedFloorIds.add(floorId);
        } catch (e) {
            if (axios.isCancel(e)) return; // 被取消，静默
            console.error('loadFloorElements error:', e);
        }
    };

    const isShieldedStatus = (spaceId, valObj) => {
        return isSpaceEnvShielded(spaceId, valObj, getIotData);
    };
    function updateSpaceTag(space, key, type, targetProperty) {
        try {
            let targetLabelObj;
            if (key === 'QUALITY_INTERVAL') {
                const limitRangeObj = getCustomInfo(space.id, 'DEMAND_CONFIG', type);
                const valObj = getIotData(space.id, type);
                if (!space.infoData) {
                    space.infoData = {};
                }
                space.infoData[type] = valObj;
                const shieldedStatus = isShieldedStatus(space.id, valObj);
                // console.log('valObj: ', valObj);
                // 有屏蔽区
                if (shieldedStatus) {
                    targetLabelObj = {
                        dataValue: ENV_SCOPE_MAP_TARGET_OBJECT_MAP.SHIELDED_ZONE
                    };
                } else {
                    const curScope = getEnvScope(valObj?.dataValue, limitRangeObj?.dataValue, type);

                    targetLabelObj = {
                        dataValue: ENV_SCOPE_MAP_TARGET_OBJECT_MAP[curScope]
                    };
                }
            } else {
                targetLabelObj = getCustomInfo(space.id, key, type);
            }
            if (targetProperty) {
                if (targetLabelObj?.dataValue) {
                    if (!space.tag) {
                        space.tag = {};
                    }
                    space.tag[targetProperty] = targetLabelObj.dataValue;
                } else if (space.tag) {
                    delete space.tag[targetProperty];
                }
            }
            if (key === 'QUALITY_INTERVAL' && !targetLabelObj?.dataValue) {
                if (!space.tag) {
                    space.tag = {};
                }
                space.tag.noData = true;
            }
        } catch (error) {
            console.error(error);
        }
    }
    const dashboardEnvTabs = inject(dashboardEnvTabsInjectKey);

    // ========== 性能优化：watchEffect + 脏检查 替代 elementsDyncData computed，避免每次 SSE 全量重建 ==========
    const { createEffect: createMapEffect, destoryEffect: destoryMapEffects } = useEffectWarp();

    const computeSpaceTag = space => {
        space.tag = {};
        space.tag.abnormal = getObjectAbnormalStatus(space.id);

        updateSpaceTag(space, 'DEMAND_TARGET_TYPE', 'tdbTargetType', 'temperatureDemandStatus');
        updateSpaceTag(space, 'QUALITY_INTERVAL', 'tdb', 'temperatureInterval');
        updateSpaceTag(space, 'DEMAND_TARGET_TYPE', 'cO2targetType', 'carbonDioxideDemandStatus');
        updateSpaceTag(space, 'QUALITY_INTERVAL', 'cO2', 'carbonDioxideInterval');
        updateSpaceTag(space, 'DEMAND_TARGET_TYPE', 'rhTargetType', 'humidityDemandStatus');
        updateSpaceTag(space, 'QUALITY_INTERVAL', 'rH', 'rHInterval');
        updateSpaceTag(space, 'QUALITY_INTERVAL', 'relativePressureDiffToOtherSpace', 'relativePressureDiffToOtherSpaceInterval');

        dashboardEnvTabs.value.forEach(({ id: infoCode }) => {
            updateSpaceTag(space, 'QUALITY_INTERVAL', infoCode, infoCode + 'Interval');
        });
        return space.tag;
    };

    const computeEquipTag = equipment => {
        equipment.tag = { abnormalStatuses: [] };
        const isAbnormal = getObjectAbnormalStatus(equipment.id);
        if (isAbnormal) {
            equipment.tag.abnormalStatuses.push(ABNORMAL_EVENT);
        }
        const statusMap = {
            runStatus: { 1: 'OPEN', 0: 'CLOSE' },
            onlineStatus: { 1: 'ONLINE', 0: 'OFFLINE' },
            orderFailAlarm: { 1: 'ORDER_FAIL_ALARM' }
        };

        const runVal = getIotData(equipment.id, 'runStatus')?.dataValue;
        equipment.tag.runStatus = runVal ? statusMap.runStatus[runVal] : null;

        const onlineVal = getIotData(equipment.id, 'onlineStatus')?.dataValue;
        equipment.tag.onlineStatus = onlineVal ? statusMap.onlineStatus[onlineVal] : null;

        if (getIotData(equipment.id, 'orderFailAlarm')?.dataValue === '1') {
            equipment.tag.abnormalStatuses.push('ORDER_FAIL_ALARM');
        }
        if (onlineVal === '0') {
            equipment.tag.abnormalStatuses.push('EQUIPMENT_OFFLINE');
        }
        return equipment.tag;
    };

    const isTagDiff = (prev, next) => {
        if (!prev) return true;
        if (prev === next) return false;
        const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
        for (const k of keys) {
            if (prev[k] !== next[k]) return true;
        }
        return false;
    };

    // eslint-disable-next-line one-var
    let cancelEffectsCleanup = () => {};

    const bindAllEffects = () => {
        // 取消上一批（如果有正在进行的 rAF 分批创建）
        cancelEffectsCleanup();
        destoryMapEffects();

        const prevTagMap = new Map();
        const BATCH_SIZE = 50;
        let batchRafId = null,
            batchActive = true,
            batchIndex = 0;

        // 合并空间和设备为统一列表，确保迭代顺序稳定
        const allObjects = [...mergedAllSpaces.value.map(s => ({ obj: s, type: 'space' })), ...mergedAllEquips.value.map(e => ({ obj: e, type: 'equip' }))];

        const cancelBatch = () => {
            batchActive = false;
            if (batchRafId !== null) {
                cancelAnimationFrame(batchRafId);
                batchRafId = null;
            }
        };
        cancelEffectsCleanup = cancelBatch;

        createMapEffect(() => {
            const createBatch = () => {
                if (!batchActive) return;

                const end = Math.min(batchIndex + BATCH_SIZE, allObjects.length);

                for (let i = batchIndex; i < end; i++) {
                    const { obj, type } = allObjects[i];
                    if (type === OBJ_TYPE.SPACE) {
                        watchEffect(() => {
                            const newTag = computeSpaceTag(obj);
                            const prevTag = prevTagMap.get(`space:${obj.id}`);

                            if (!isTagDiff(prevTag, newTag)) return;
                            prevTagMap.set(`space:${obj.id}`, { ...newTag });
                            appSceneInstances.scene?.updateOneSpaceShowAndState(obj.id, newTag);
                        });
                    } else {
                        watchEffect(() => {
                            const newTag = computeEquipTag(obj);
                            const prevTag = prevTagMap.get(`equip:${obj.id}`);
                            if (!isTagDiff(prevTag, newTag)) return;
                            prevTagMap.set(`equip:${obj.id}`, { ...newTag });
                            appSceneInstances.scene?.updateOneEquipShowAndState(obj.id, newTag);
                        });
                    }
                }
                batchIndex = end;

                if (batchIndex < allObjects.length && batchActive) {
                    batchRafId = requestAnimationFrame(createBatch);
                } else {
                    batchRafId = null;
                    // 所有 watchEffect 首轮执行完成，触发一次防碰撞
                    // _updateSpaceModelShow / _updateEquipModelShow 在 watchEffect 中已维护 detector 元素
                    appSceneInstances.scene?._collisionInvokeDebounce();
                }
            };
            createBatch();
        });
    };

    const showMapRelationMode = (arr, inSameCtlGroupIds) => {
        try {
            // 只有当前打开了详情测弹框，才执行切换到关联模式 UYAI-247
            if (showModuleInfo?.value) {
                appSceneInstances.scene?.showRelationElements(arr, inSameCtlGroupIds);
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };
    const clickMapObj = (obj, fromRel) => {
        // 点击的非本楼层对象
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
    const unselectModel = () => {
        appSceneInstances.scene?.unselectModel();
    };

    onMounted(() => {
        // let hasInitAndCreated = false;
        // // 网格图加载完之后开始加载地图相关
        // watch(spaceIotDataLoading, () => {
        //     if (!spaceIotDataLoading.value && !hasInitAndCreated) {
        //         hasInitAndCreated = true;
        //         // sseClient?.addEventListener('SPACE_WITH_STATUS', dealEvent);
        //         initCreateAndView();
        //         rebuildElements();
        //         resizeOb = new ResizeObserver(windowResize);
        //         resizeOb.observe(graphWarp.value);
        //     }
        // });
        // 不再等待网格图加载完再加载地图，地图和网格图都加载

        // 场景初始化与静态数据加载并行，互不阻塞
        initCreateAndView();

        // 等待静态空间设备数据请求完后加载（仅一次 false→true，执行后取消监听）
        const unwatchLoaded = watch(
            () => spacesAndEquipsLoaded.value,
            cur => {
                if (cur) {
                    unwatchLoaded();
                    loadAllElements();
                }
            },
            { immediate: true }
        );
        const unwatchDashboardIotLoaded = watch([() => spaceIotDataLoading.value, () => spacesAndEquipsLoaded.value], () => {
            if (spacesAndEquipsLoaded.value && !spaceIotDataLoading.value) {
                const staticData = spacesAndEquipsStaticData.value;
                const idSet = new Set();
                (staticData.equipments || []).forEach(item => {
                    idSet.add(item.id);
                });
                (staticData.spaces || []).forEach(item => {
                    idSet.add(item.id);
                });
                unwatchDashboardIotLoaded();
                loadFloorDyncData([...idSet]);
            }
        });

        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();

        currentFloorObj.value = null;
    });

    return {
        initScene,
        appSceneInstances,
        graphWarp,
        goDefault,
        windowResize,
        mapLoading,
        mapSwitchMode,
        onClickMoreInfo,
        buildFloors,
        floorList,
        curHoverObj,
        hoverCardPosition,
        mapSettings,
        useFloorCollisionSetting,
        showMapRelationMode,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        unselectModel,
        pauseRender
    };
};
