// @ts-ignore
import i18n from '@/localization';
import BuildFloorScene from './BuildingFloorScene';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';

import { showAbnormalStateKey } from '../constant/symbols';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { getFloorInfoByFloorId, getBuildingInfoByFloorId } from '@/utils/buildingUtils';
import axios from 'axios';
import { $Message } from 'meri-plus';
import { debounce } from 'lodash';
import { OBJ_TYPE } from '@/utils/globalVariables';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';

import { queryVentilationModelView } from '@/apis/ventilationPerception';
import { spaceStaticDataLoadingKey, mapStaticDataLoadingKey } from '../constant/symbols';
import { EQUIP_TYPE_DICT, allSpacesInjectKey, allEquipsInjectKey, spacesAndEquipsLoadingInjectKey } from '../constant/symbols';
import { IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export default () => {
    const { base } = useStore();

    const currentFloorObj = inject('currentFloorObj');
    const currentTab = inject('currentTab');

    const onlyShowControlledEquipment = inject('onlyShowControlledEquipment');
    const filterEquipmentType = inject('filterEquipmentType');
    const equipTypeOptions = inject('equipTypeOptions');

    const selectModuleInfo = inject('selectModuleInfo');
    const showModuleInfo = inject('showModuleInfo');
    const buildingSpaceTree = inject('buildingSpaceTree');
    const templateType = inject('templateType');
    const curEquipInfoList = inject('curEquipInfoList');
    const showAbnormalState = inject(showAbnormalStateKey);

    const allSpacesData = inject(allSpacesInjectKey);
    const allEquipsData = inject(allEquipsInjectKey);
    const spacesAndEquipsLoading = inject(spacesAndEquipsLoadingInjectKey);

    const sseClient = inject('sseClient');
    const spaceStaticDataLoading = inject(spaceStaticDataLoadingKey);
    const mapStaticDataLoading = inject(mapStaticDataLoadingKey);
    const graphWarp = ref('');

    const curHoverObj = ref();
    const hoverCardPosition = ref();
    const allEquips = ref([]);

    const floorList = ref([]); // 楼层列表
    const floorAbnormalRecord = ref({});
    // 楼层id映射空间列表
    const floorIdMapSpaces = ref({});
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
        buildingInfoPromise = null,
        cancelTokenSource,
        spaceIdMap = null,
        _spaceIotCache = {};

    // 初始化楼层选择器列表
    const buildFloors = computed(() => {
        const _building = generateBuildFloors(Array.from(new Set(floorList.value)));
        if (_building?.length) {
            _building.forEach(items => {
                items.floorList.forEach(item => {
                    item.dot = !!floorAbnormalRecord.value[item.id];
                });
            });
        }
        // if (!currentFloorObj?.value && _building.length > 1) {
        //     return [{ name: '项目', id: 'project', floorList: [] }, ..._building];
        // }

        return _building;
    });

    const getTreeBuildingFloor = () => {
        // 获取建筑信息

        // eslint-disable-next-line one-var
        const parasm = {
            projectId: base.projectId,
            isQuerySpace: false
        };
        return getListTreeBuildingFloorSpace(parasm).then(res => {
            const { data, code } = res;
            // eslint-disable-next-line eqeqeq
            if (code == '00000') {
                xplantindoorenvStore().setBuildingData(data);
                xplantindoorenvStore().setBuildingFloorData(data);
            }
        });
    };

    // buildingInfoPromise = getTreeBuildingFloor();

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

    const mapLoading = computed(
        () => loadings.initLoading.value || loadings.floorLoading.value || loadings.pipeDataLoading.value || loadings.elementsLoading.value || loadings.detailLoading.value
    );

    // 默认加载位置
    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const windowResize = () => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const pauseRender = pause => {
        appSceneInstances.scene?.pauseRender(pause);
    };

    const clickSpaceOrEquip = obj => {
        // showSpaceInfo.value = false;
        showModuleInfo.value = false;
        if (obj) {
            showModuleInfo.value = true;
            let floorLocalName = obj.floorLocalId;
            if (obj.objType === OBJ_TYPE.EQUIPMENT) {
                const floor = getFloorInfoByFloorId(obj.floorId);
                floorLocalName = floor?.localId;
            }
            selectModuleInfo.value = {
                ...obj,
                id: obj.id,
                localName: obj.localName ?? '--',
                floorLocalName,
                spaceId: obj.objType === OBJ_TYPE.SPACE ? obj.id : '',
                type: obj.objType
            };
        }
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
                curFilterType: currentTab,
                filterEquipmentType,
                onlyShowControlledEquipment
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

    const queryModels = async () => {
        if (cancelTokenSource) {
            cancelTokenSource.cancel(i18n.global.t('meos_control_web.cancel_last_request'));
            cancelTokenSource = null;
        }
        cancelTokenSource = axios.CancelToken.source();

        loadings.spaceDataLoading.value = true;
        const p = {
            projectId: base.projectId,
            instanceId: currentFloorObj?.value?.id ? currentFloorObj?.value?.id : base.projectId,
            instanceType: currentFloorObj?.value?.id ? 'FLOOR' : 'PROJECT',
            ventilationType: templateType?.value
        };

        try {
            spacesAndEquipsLoading.value = true;
            const res = await queryVentilationModelView(p, {
                cancelToken: cancelTokenSource.token
            });
            loadings.spaceDataLoading.value = false;
            if (res.code === '00000' && res.data) {
                // 将数据存储到全局变量中
                allEquipsData.value = [...(res.data?.equipments || [])];
                allSpacesData.value = [...(res.data?.spaces || [])];
                return res.data;
            }
        } catch (e) {
            loadings.spaceDataLoading.value = false;
            allEquipsData.value = [];
            allSpacesData.value = [];
            console.log('e: ', e);
        } finally {
            spacesAndEquipsLoading.value = false;
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
            showModuleInfo.value = false;

            appSceneInstances.scene?.switchModeView(newFloorObj ? 2 : 1, newFloorObj?.id);
            appSceneInstances.scene?.updateSpaceStatus();
        }
    );

    watch([currentFloorObj, onlyShowControlledEquipment, floorIdMapEquipTypes], () => {
        if (currentFloorObj.value) {
            const types = new Set();
            const floorRecord = floorIdMapEquipTypes.value[currentFloorObj.value.id];
            if (floorRecord) {
                floorRecord.forEach(obj => {
                    if (onlyShowControlledEquipment?.value && !obj.isControl) {
                        return;
                    }
                    obj.equipTypes?.forEach(code => {
                        types.add(code);
                    });
                    if (obj.equipType) {
                        types.add(obj.equipType);
                    }
                });
            }
            equipTypeOptions.value = [...types].map(k => {
                return {
                    key: k,
                    name: EQUIP_TYPE_DICT[k]
                };
            });
            nextTick(() => {
                if (filterEquipmentType.value && !equipTypeOptions.value?.some(obj => obj.key === filterEquipmentType.value.key)) {
                    filterEquipmentType.value = null;
                }
                // console.log('equipTypeOptions.value: ', equipTypeOptions.value, [...types], floorRecord);
            });
        }
    });
    watch([() => currentTab?.value, filterEquipmentType, onlyShowControlledEquipment], () => {
        // console.log('filterEquipmentType: ', filterEquipmentType);

        showModuleInfo.value = false;
        appSceneInstances.scene?.updateShowElements();
        appSceneInstances.scene?.updateSpaceStatus();
    });

    watch(showModuleInfo, newVal => {
        if (!newVal) {
            appSceneInstances.scene?.unselectModel();
            appSceneInstances.scene?.exitRelationMode();
        }
    });
    watch(selectModuleInfo, newVal => {
        loadings.detailLoading.value = !!newVal?.id;
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
                    const floors = [...parentRes.floorList];

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

    watchEffect(() => {
        if (floorAbnormalRecord.value) {
            if (currentFloorObj?.value?.id) {
                showAbnormalState.value = !!floorAbnormalRecord.value[currentFloorObj.value.id];
                // console.log('showAbnormalState.value: ', showAbnormalState.value, floorAbnormalRecord.value, currentFloorObj?.value);
            } else {
                showAbnormalState.value = Object.keys(floorAbnormalRecord.value).length > 0;
            }
        }
    });
    watchEffect(() => {
        curEquipInfoList.value = allEquips.value?.filter(obj => (currentFloorObj?.value?.id && currentFloorObj?.value.id === obj.floorId) || !currentFloorObj?.value?.id);
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

    const makeFloorEquipTypeMap = (record, obj) => {
        if (!record[obj.floorId]) {
            record[obj.floorId] = [];
        }
        const floorRecord = record[obj.floorId];
        floorRecord.push(obj);
    };

    const rebuildElements = async () => {
        spaceIdMap = {};
        floorList.value = [];
        const equipArr = new Set();

        const floorEquipTypesRecord = {};
        let spaceArr = [],
            equipmentsArr = [],
            floorMapSpaces = {},
            floorRecord = {};
        loadings.elementsLoading.value = true;
        try {
            const spaceRes = await queryModels();
            // await buildingInfoPromise;
            const { spaces, equipments } = spaceRes;
            spaceArr = spaces || [];
            equipmentsArr = equipments || [];
            spaceArr?.forEach(obj => {
                obj.newKey = obj.oldKey;
            });
            spaceArr?.forEach(space => {
                spaceIdMap[space.id] = space;
                if (space.isAbnormal) {
                    //空间是否存在异常
                    floorAbnormalRecord.value[space.floorId] = space.floorId;
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

            const floors = floorList.value.map(floorId => {
                const floorInfo = floorRecord[floorId];

                return {
                    id: floorId,
                    localId: floorInfo?.localId
                };
            });

            floorIdMapSpaces.value = floorMapSpaces;

            const _equips = [];
            //设备是否异常
            equipmentsArr?.forEach(equipment => {
                additionalFloorInfo(equipment, floorRecord);
                const { abnormalTypes } = equipment;
                // 楼层异常过滤控反不一致、离线的设备
                const filterList = abnormalTypes?.filter(v => !['OFFLINE', 'CONTROL_REVERSE_INCONSISTENT'].includes(v));
                if (filterList?.length > 0) {
                    floorAbnormalRecord.value[equipment.floorId] = equipment.floorId;
                }
                makeFloorEquipTypeMap(floorEquipTypesRecord, equipment);
                _equips.push({
                    id: equipment.id,
                    floorId: equipment.floorId,
                    equipType: equipment.equipType,
                    classCode: equipment.classCode,
                    isAbnormal: equipment.abnormalTypes?.includes('ABNORMAL')
                });
            });
            allEquips.value = _equips;

            await createElements({ spaces: spaceArr, floors, equips: [...equipmentsArr] });
            appSceneInstances.scene?.updateSpaceStatus();
            appSceneInstances.scene?.updateShowElements();
            appSceneInstances.scene?.updateEquipStatus();
        } catch (e) {
            console.log('e: ', e);
        }
        floorIdMapEquipTypes.value = floorEquipTypesRecord;
        loadings.elementsLoading.value = false;
        mapStaticDataLoading.value = false;
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

    // 处理地图上非iot数据sse更新
    const dealMapStatusSSEEvent = res => {
        if (res?.data) {
            const { spaces, equipments } = res.data;
            const idMapData = {};
            spaces?.forEach(s => {
                idMapData[s.id] = s;
            });
            equipments?.forEach(s => {
                idMapData[s.id] = s;
                const eq = allEquips.value.find(obj => obj.id === s.id);
                if (eq) {
                    eq.isAbnormal = s.abnormalTypes?.includes('ABNORMAL');
                }
            });
            // console.log(res, 'res==========================');
            appSceneInstances.scene?.updateSpaceEquipData(res.data, floorAbnormalRecord);
            appSceneInstances.scene?.updateShowElements();
            appSceneInstances.scene?.updateSpaceStatus();
            appSceneInstances.scene?.updateEquipStatus();
        }
    };

    const _handleSpaceIotChange = () => {
        // console.log('_spaceIotCache: ', Date.now(), Object.keys(_spaceIotCache));
        appSceneInstances.scene?.updateSpaceIotData(_spaceIotCache);
        _spaceIotCache = {};
    };

    // 根据sse实时数据更新
    const debounceSpaceIotChange = debounce(_handleSpaceIotChange, 1000);

    // 空间指标iot数据更新
    const dealSpaceIotSSEEvent = res => {
        if (res?.data) {
            const { objectId, infoCode, dataValue } = res.data;
            if (spaceIdMap && spaceIdMap[objectId]) {
                if (!_spaceIotCache[objectId]) {
                    _spaceIotCache[objectId] = {};
                }
                const info = _spaceIotCache[objectId];
                info[infoCode] = res.data;
                debounceSpaceIotChange();
            }
            // console.log(res, 'res==========================');
        }
    };
    onMounted(() => {
        sseClient?.addEventListener('VENTILATION_VIEW', dealMapStatusSSEEvent);
        sseClient?.addEventListener(IOT_DATA_CHANGE, dealSpaceIotSSEEvent);
        initCreateAndView();
        // 监听模版类型变化
        watch(
            () => [templateType?.value, spaceStaticDataLoading?.value],
            val => {
                if (val[0] && !val[1]) {
                    floorList.value = [];
                    floorAbnormalRecord.value = {};
                    floorIdMapSpaces.value = {};
                    floorIdMapEquipTypes.value = {};

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
        sseClient?.removeEventListener('VENTILATION_VIEW', dealMapStatusSSEEvent);
        sseClient?.removeEventListener(IOT_DATA_CHANGE, dealSpaceIotSSEEvent);
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
        floorList,
        curHoverObj,
        hoverCardPosition,
        showMapRelationMode,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender
    };
};
