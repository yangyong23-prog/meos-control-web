// @ts-ignore
import i18n from '@/localization';
import BuildFloorScene from './BuildingFloorScene';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import { throttle } from 'lodash';

import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, showModuleInfoInjectKey, selectModuleInfoInjectKey, currentModelInjectKey } from '../constants/injectKey';
import { allMapDataLoadedInjectKey } from '../hooks/useSecurityGlobalData';
import { addOrRmMonitorGroupInjectKey } from '../hooks/useMonitorEditHook';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';

import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { getFloorInfoByFloorId, getBuildingInfoByFloorId } from '@/utils/buildingFloorTreeUtils';
// import axios from 'axios';
import { $Message } from 'meri-plus';
import { isEdge } from '@/utils/envUtils';

// import { querySecurityModelView } from '@/apis/SpaceSecurityControl';
import { groupBy } from 'lodash';
import {
    getStaticEquipsKey,
    getStaticSpacesKey,
    staticEquipsKey,
    staticSpacesKey,
    deploymentSpacesKey,
    accessSpacesKey,
    floorAbnormalRecordInjectKey,
    getSpaceEquipDynamicDataKey,
    mapAndRightSSEClientKey,
    buildingTreePromiseInjectKey
} from '../constants/injectKey';

import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { onlyShowMapKey } from '../hooks/useDashboard';
import { SECURITY_CAMERA_FILTER_CLASS_CODES } from '@/constants/camera';
import { selectedCameraTypesKey, selectedSpaceFuncTypesKey, showVideoGroupMapKey } from '../hooks/useVideoGroup';
import { GeneralZone, OBJ_TYPE } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

function* chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

export default () => {
    const { base } = useStore();

    const currentFloorObj = inject('currentFloorObj');
    const currentTab = inject('currentTab');
    // const tabsOptions = inject('tabsOptions');

    const sseClient = inject(mapAndRightSSEClientKey);
    const addOrRmMonitorGroup = inject(addOrRmMonitorGroupInjectKey);

    // 楼层视图：仅看可控设备
    const onlyShowControlledEquipment = inject('onlyShowControlledEquipment');
    const filterEquipmentClass = inject('filterEquipmentClass');

    // 楼层视图+视频编组：设备类型、空间功能类型
    const showVideoGroupMap = inject(showVideoGroupMapKey);
    const selectedCameraTypes = inject(selectedCameraTypesKey);
    const selectedSpaceFuncTypes = inject(selectedSpaceFuncTypesKey);

    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const showModuleInfo = inject(showModuleInfoInjectKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);
    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);

    const buildingSpaceTree = inject('buildingSpaceTree');
    // 设备展示树列表
    const screenConfigList = inject('screenConfigList');
    // 设备筛选下拉树数据
    const equipFilterTreeData = inject('equipFilterTreeData');

    const onlyShowMap = inject(onlyShowMapKey);
    const allMapDataLoaded = inject(allMapDataLoadedInjectKey);
    // 当前视图类型：list、model
    const currentModel = inject(currentModelInjectKey);

    const graphWarp = ref('');
    const hasData = ref(false);

    const curHoverObj = ref();
    const hoverCardPosition = ref();
    const hoverVideoCardPosition = ref();

    const floorList = ref([]); // 楼层列表
    // 楼层异常记录
    const floorAbnormalRecord = inject(floorAbnormalRecordInjectKey);
    const buildFloors = ref([]);

    const getStaticSpaces = inject(getStaticSpacesKey);
    const getStaticEquips = inject(getStaticEquipsKey);

    const deploymentSpaces = inject(deploymentSpacesKey);
    const accessSpaces = inject(accessSpacesKey);
    const staticSpaces = inject(staticSpacesKey);
    const staticEquips = inject(staticEquipsKey);
    const isLoadDynamic = ref(false);

    const getSpaceEquipDynamicData = inject(getSpaceEquipDynamicDataKey);

    const timeoutKey = ref(null);

    // 楼层id映射空间列表
    const floorIdMapSpaces = ref({});
    const floorIdMapEquipTypes = ref({});
    const selectedCameraIds = ref([]);
    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        elementsLoading: ref(false),
        dynamicLoading: ref(false),
        floorLoading: ref(false),
        pipeDataLoading: ref(false),
        spacesAndEquipsLoading: ref(false),
        detailLoading: ref(false)
    };

    let initPromise = null,
        resizeOb = null,
        buildingInfoPromise = null,
        // cancelTokenSource,
        spaceIdMap = null;

    // 建筑树共享 promise：由父级 index.vue 发起（handleTreeBuildingFloorData）并提供
    buildingInfoPromise = inject(buildingTreePromiseInjectKey);

    const generateBuildFloors = _floorList => {
        if (!_floorList?.length) {
            return [];
        }

        let allBuildingData = xplantindoorenvStore().buildingFloorData;
        allBuildingData = allBuildingData
            ?.map(b => {
                const building = { ...b, name: b?.localName };
                if (b.floors) {
                    building.floors = b.floors.map(f => {
                        return { ...f, name: f?.localName };
                    });
                }
                building.floorList = building.floors?.filter(f => _floorList?.includes(f.id)).sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
                if (!building.floorList?.length) {
                    building.disabled = true;
                    building.disabledTip = i18n.global.t('meos_control_web.no_data_for_building');
                }
                return building;
            })
            .filter(building => building.floorList?.length)
            .sort((a, b) => b.floorSequenceId - a.floorSequenceId);

        return allBuildingData;
    };

    const mapLoading = computed(
        () => loadings.initLoading.value || loadings.dynamicLoading.value || loadings.floorLoading.value || loadings.elementsLoading.value || loadings.detailLoading.value
    );

    // 默认加载位置
    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
        // showVideoGroupMap.value = !showVideoGroupMap.value;
    };

    const windowResize = () => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const clickSpaceOrEquip = obj => {
        if (obj) {
            openDetailDrawer(obj);
        } else {
            closeDetailDrawer();
        }
    };

    const pauseRender = pause => {
        appSceneInstances.scene?.pauseRender(pause);
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
                filterEquipmentClass,
                cameraEquipmentClass: SECURITY_CAMERA_FILTER_CLASS_CODES,
                onlyShowControlledEquipment,
                selectedCameraTypes,
                selectedSpaceFuncTypes,
                showVideoGroupMap
            });
            pauseRender(currentModel.value === 'list');
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });
            loadings.initLoading.value = true;

            appSceneInstances.scene.addEventListener('clickFloor', obj => {
                if (currentFloorObj) {
                    // 以前的楼层是否来自dashboard
                    const fromDashboard = currentFloorObj.value?.fromDashboard;
                    currentFloorObj.value = { ...(obj?.data || {}), fromDashboard };
                }
            });

            appSceneInstances.scene.addEventListener('onHoverCard', obj => {
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

            appSceneInstances.scene.addEventListener('onHoverVideoCard', obj => {
                if (obj.data) {
                    const { pos } = obj.data;
                    // TODO
                    hoverVideoCardPosition.value = { ...pos, top: pos.top - 10 };
                }
            });
            appSceneInstances.scene.addEventListener('onVideoEditModeSelected', obj => {
                //TODO
                // console.log('obj :>> ', obj);
                const objIds = addOrRmMonitorGroup(obj);
                setCameraGroup(objIds);
            });
            appSceneInstances.scene.addEventListener('onUnHoverVideo', obj => {
                if (hoverVideoCardPosition.value) {
                    hoverVideoCardPosition.value = null;
                }
            });

            appSceneInstances.scene.addEventListener('onUnHover', obj => {
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
        await appSceneInstances?.scene?.switchModeView(m, floorId);
    };

    const onClickMoreInfo = obj => {
        if (obj) {
            clickSpaceOrEquip({ ...obj, classCode: obj.oriClassCode || obj.classCode });
        }
    };

    watch(
        () => currentFloorObj?.value?.id,
        async newFloorId => {
            appSceneInstances.scene?.switchModeView(newFloorId ? 2 : 1, newFloorId);
            // 未加载过，且楼层下钻，则请求动态数据
            if (newFloorId && !isLoadDynamic?.value && currentFloorObj?.value?.fromDashboard) {
                // appSceneInstances.scene?.switchModeView(newFloorId ? 2 : 1, newFloorId);
                loadings.dynamicLoading.value = true;
                await getDynamicData();
                // appSceneInstances.scene?.updateShowElements();
                // appSceneInstances.scene?.updateSpaceStatus();
                // appSceneInstances.scene?.updateEquipStatus();
                loadings.dynamicLoading.value = false;
            }
            nextTick(() => {
                appSceneInstances.scene?.updateShowElements();
                appSceneInstances.scene?.updateSpaceStatus();
                appSceneInstances.scene?.updateEquipStatus();
            });

            if (showModuleInfo) {
                showModuleInfo.value = false;
            }
            // 切楼层时重置，仅看可控设备（默认不勾选），设备类型筛选
            if (newFloorId) {
                nextTick(() => {
                    onlyShowControlledEquipment.value = false;
                    filterEquipmentClass.value = [];
                });
            }
        }
    );

    const setCameraGroup = cameraIds => {
        // console.log(cameraIds);
        selectedCameraIds.value = cameraIds;
        appSceneInstances.scene?.setCameraGroup(cameraIds);
        appSceneInstances.scene?.updateShowElements();
        appSceneInstances.scene?.updateSpaceStatus();
        appSceneInstances.scene?.updateEquipStatus();
    };

    watch([showVideoGroupMap, () => currentFloorObj?.value?.id], () => {
        nextTick(() => {
            appSceneInstances.scene?.switchVideoEditMode(showVideoGroupMap.value);
            appSceneInstances.scene?.setCameraGroup(selectedCameraIds.value);
            appSceneInstances.scene?.updateShowElements();
            appSceneInstances.scene?.updateSpaceStatus();
            appSceneInstances.scene?.updateEquipStatus();
        });

        if (showModuleInfo) {
            showModuleInfo.value = false;
        }
    });

    watch([() => currentFloorObj?.value?.id, onlyShowControlledEquipment, floorIdMapEquipTypes, screenConfigList], ([curFloorId]) => {
        if (curFloorId) {
            const floorRecord = floorIdMapEquipTypes.value[curFloorId];
            const equipFilterList = screenConfigList?.value?.filter(cfg => {
                if (floorRecord) {
                    return floorRecord.some(obj => {
                        if (onlyShowControlledEquipment?.value && !obj.isControl) {
                            return;
                        }

                        return obj.classCode && obj.classCode === cfg.classCode && (!cfg.condition || (cfg.condition && obj[cfg.condition] === cfg.conditionValue));
                    });
                }
                return false;
            });
            if (equipFilterTreeData) {
                const groupMap = groupBy(equipFilterList, obj => obj.groupName);
                filterEquipmentClass.value = null;
                nextTick(() => {
                    equipFilterTreeData.value = Object.keys(groupMap).map(groupName => {
                        return {
                            name: groupName,
                            id: groupName,
                            children: groupMap[groupName].map(obj => {
                                const id = `${groupName}-${obj.classCode}-${obj.condition}-${obj.conditionValue}`;
                                return {
                                    ...obj,
                                    id
                                };
                            })
                        };
                    });
                });
            }
        }
    });

    const throttleRefreshCallback = throttle(() => {
        // IOT 推送不影响 tab 撤布防隐藏
        // const deploymentStatusSpaces = appSceneInstances.scene?.updateShowElements();

        // if (![...deploymentStatusSpaces]?.length) {
        //     // 无撤布防的空间时，不展示对应Tab
        //     tabsOptions.value = CONTROL_BAR_TABS.filter(da => {
        //         if (da.id === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
        //             return false;
        //         }
        //         return true;
        //     });
        // } else {
        //     tabsOptions.value = CONTROL_BAR_TABS;
        // }

        appSceneInstances.scene?.updateSpaceStatus();
        appSceneInstances.scene?.updateEquipStatus();
        appSceneInstances.scene?.updateShowElements(false);
    }, 200);

    const filterHideParams = computed(() => {
        let filterEquip = [];
        if (Array.isArray(filterEquipmentClass?.value)) {
            filterEquip = filterEquipmentClass.value
                .filter(obj => {
                    return obj?.checked === 'checked';
                })
                ?.map(v => v?.id);
        }
        const finalArr = [...filterEquip, onlyShowControlledEquipment?.value];
        const finalString = JSON.stringify(finalArr);
        return finalString;
    });

    const videoGroupFilterHideParams = computed(() => {
        const filterCameraTypes = selectedCameraTypes.value;
        const filterSpaceFuncTypes = selectedSpaceFuncTypes.value;
        const finalArr = [...filterCameraTypes, ...filterSpaceFuncTypes];
        return JSON.stringify(finalArr);
    });

    // 过滤筛选
    watch([() => filterHideParams?.value, () => videoGroupFilterHideParams?.value], () => {
        if (currentModel?.value !== 'list') {
            appSceneInstances.scene?.updateShowElements();
        }

        if (showModuleInfo && currentModel?.value !== 'list') {
            showModuleInfo.value = false;
        }
    });

    watch(
        () => currentTab?.value,
        newVal => {
            if (currentModel?.value !== 'list' && newVal) {
                appSceneInstances.scene?.updateShowElements();
                appSceneInstances.scene?.updateSpaceStatus();
                appSceneInstances.scene?.updateEquipStatus();
            }
            if (showModuleInfo && currentModel?.value !== 'list') {
                showModuleInfo.value = false;
            }
        }
    );

    watch(showModuleInfo, newVal => {
        // if (currentModel.value === 'list') return;

        if (!appSceneInstances.scene?.currentSelectedModel) {
            return;
        }
        if (!newVal) {
            appSceneInstances.scene?.unselectModel();
            appSceneInstances.scene?.exitRelationMode();
        }
    });

    watch([showModuleInfo, selectModuleInfo], () => {
        if (currentModel.value === 'list') return;
        loadings.detailLoading.value = showModuleInfo.value && !!selectModuleInfo?.value?.id;
    });

    watch(floorList, () => {
        buildFloors.value = generateBuildFloors(Array.from(new Set(floorList.value)));
        buildFloors.value.forEach(items => {
            items.floorList.forEach(item => {
                item.dot = computed(() => {
                    const isShowVideo = showVideoGroupMap.value;
                    if (isShowVideo) {
                        return false;
                    }
                    return !!floorAbnormalRecord.value[item.id];
                });
            });
        });
    });

    watch(
        currentModel,
        async () => {
            pauseRender(currentModel.value === 'list');
            if (currentModel.value === 'model') {
                try {
                    // 未加载过，且非楼层下钻，则请求动态数据
                    if (!isLoadDynamic?.value && !currentFloorObj?.value?.fromDashboard) {
                        loadings.dynamicLoading.value = true;
                        await getDynamicData();
                        appSceneInstances.scene?.updateShowElements();
                        appSceneInstances.scene?.updateSpaceStatus();
                        appSceneInstances.scene?.updateEquipStatus();
                        loadings.dynamicLoading.value = false;
                    }
                } catch (error) {
                    loadings.dynamicLoading.value = false;
                } finally {
                    loadings.dynamicLoading.value = false;
                }
            }
        },
        {
            immediate: true
        }
    );

    const eventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, ABNORMAL_EVENT];

    const refreshCallback = () => {
        throttleRefreshCallback?.();
    };

    useResponsiveDockSSEHandle(sseClient, [...eventType], refreshCallback);

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
                    const floors = [...parentRes.floorList] || [];

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
        if (appSceneInstances.scene) {
            appSceneInstances.scene.removeEventListener('clickFloor');
            appSceneInstances.scene.removeEventListener('clickDetail');
            appSceneInstances.scene.removeEventListener('onHoverCard');
            appSceneInstances.scene.removeEventListener('onUnHoverSpace');
            appSceneInstances.scene.removeEventListener('onUnHoverVideo');
            appSceneInstances.scene.removeEventListener('onVideoEditModeSelected');
            appSceneInstances.scene.removeEventListener('onHoverVideoCard');
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
        try {
            if (!initPromise) {
                initPromise = initScene();
            }
            await initPromise;
            mapSwitchMode(onlyShowMap.value ? 2 : 1);
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

    const getDynamicData = async () => {
        isLoadDynamic.value = false;
        const deploymentSpaceRequest = deploymentSpaces.value?.map(obj => {
            return { objectId: obj?.id, classCode: GeneralZone, infoCodes: ['deploymentStatus'] };
        });
        // 空间通行状态取的空间下的设备状态
        const accessSpaceRequest = accessSpaces.value?.map(obj => {
            return { objectId: obj?.id, classCode: GeneralZone, infoCodes: ['spaceAccessDemandStatus'] };
        });

        const equipParams = staticEquips.value?.map(obj => {
            return {
                objectId: obj?.id,
                classCode: obj?.classCode,
                infoCodes: ['accessDemand', 'runStatus', 'onlineStatus', 'orderFailAlarm']
            };
        });

        const subLists = [...chunks(equipParams, 1000)];
        const currentTabString = currentTab?.value;

        try {
            const deploymentSpaceRes = await getSpaceEquipDynamicData(deploymentSpaceRequest, currentTabString);
            const accessSpaceRes = await getSpaceEquipDynamicData(accessSpaceRequest);
            const equipRes = await Promise.all(subLists.map(v => getSpaceEquipDynamicData(v)));

            isLoadDynamic.value = true;
            return { deploymentSpaceRes, accessSpaceRes, equipRes };
        } catch (error) {
            console.error('Error fetching space equip dynamic data:', error);
            throw error;
        }
    };

    const rebuildElements = async () => {
        floorList.value = [];
        const equipArr = new Set();

        const floorEquipTypesRecord = {};
        let spaceArr = [],
            equipmentsArr = [],
            floorMapSpaces = {},
            floorRecord = {};
        loadings.elementsLoading.value = true;
        try {
            if (getStaticSpaces && getStaticEquips) {
                await Promise.all([getStaticSpaces(), getStaticEquips()]);
            }
            const spaces = staticSpaces?.value || [];
            const equipments = staticEquips?.value || [];
            await initPromise;
            await buildingInfoPromise;
            if (spaces?.length || equipments?.length) {
                hasData.value = true;
            }
            spaceIdMap = {};
            spaceArr = spaces;
            equipmentsArr = equipments?.filter(obj => !!obj.bimLocation);
            spaceArr?.forEach(space => {
                spaceIdMap[space.id] = space;
                const rawSpace = toRaw(space);
                if (!floorMapSpaces[rawSpace.floorId]) {
                    floorMapSpaces[rawSpace.floorId] = [];
                }
                floorMapSpaces[rawSpace.floorId].push(rawSpace);
                additionalFloorInfo(rawSpace, floorRecord, getFloorInfoByFloorId);

                rawSpace.relEquipments?.forEach(e => {
                    equipArr.add(e);
                });
            });
            // 楼层地图下，设备也增加过滤
            equipments.forEach(equip => {
                const equipFloorId = equip?.floorId;
                if (equipFloorId) {
                    if (!floorRecord[equipFloorId]) {
                        const floorInfo = getFloorInfoByFloorId(equipFloorId);
                        floorRecord[equipFloorId] = floorInfo;
                    }
                }
            });

            floorList.value = Object.keys(floorRecord);
            // const floors = floorList.value.map(floorId => {
            //     const floorInfo = floorRecord[floorId];
            //     return {
            //         id: floorId,
            //         localId: floorInfo?.localId
            //     };
            // });
            floorIdMapSpaces.value = floorMapSpaces;
            //设备是否异常
            equipmentsArr.forEach(equipment => {
                additionalFloorInfo(equipment, floorRecord, getFloorInfoByFloorId);
                makeFloorEquipTypeMap(floorEquipTypesRecord, equipment);
            });
            let floors = [];
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
            await createElements({ spaces: spaceArr, floors, equips: [...equipmentsArr] });
            appSceneInstances.scene?.updateShowElements();
            appSceneInstances.scene?.updateSpaceStatus();
            appSceneInstances.scene?.updateEquipStatus();
            nextTick(() => {
                allMapDataLoaded.value = true;
            });
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
        const baseObj = appSceneInstances.scene?.getBaseDataById(obj.id);
        if (!baseObj) {
            return;
        }
        // 点击的非本楼层对象
        if (currentFloorObj.value?.id && currentFloorObj.value?.id !== baseObj.floorId) {
            const floorInfo = getFloorInfoByFloorId(baseObj.floorId);
            const buildingInfo = getBuildingInfoByFloorId(obj.floorId);
            if (floorInfo) {
                // 以前的楼层是否来自dashboard
                const fromDashboard = currentFloorObj.value?.fromDashboard;
                currentFloorObj.value = { ...floorInfo, fromDashboard, buildingLocalName: buildingInfo?.localName ?? '', buildingId: buildingInfo?.id || '' };
                nextTick(() => {
                    timeoutKey.value = setTimeout(() => {
                        appSceneInstances.scene?.clickMapObj(baseObj);
                    });
                });
                $Message.Default({ title: i18n.global.t('meos_control_web.change_floor_num', { floor: floorInfo.localName ?? '--' }) });
                return;
            }
        }
        appSceneInstances.scene?.clickMapObj(obj);
    };
    const hoverMapObj = obj => {
        appSceneInstances.scene?.hoverMapObj(obj);
    };
    const highlightCameras = objIds => {
        // console.log(objIds);
        appSceneInstances.scene?.highlightCameras(objIds);
    };
    const unhighlightCameras = () => {
        appSceneInstances.scene?.unhighlightCameras();
    };
    const unhoverMapObj = () => {
        appSceneInstances.scene?.unhoverMapObj();
    };
    const setEquipOnPlay = obj => {
        if (currentFloorObj.value?.id && currentFloorObj.value?.id !== obj.inFloor?.id) {
            return;
        }
        appSceneInstances.scene?.setEquipOnPlay(obj);
    };
    const unsetEquipOnPlay = () => {
        appSceneInstances.scene?.unsetEquipOnPlay();
    };

    // 处理地图上非iot数据sse更新
    // const dealMapStatusSSEEvent = res => {
    //     if (res?.data) {
    //         appSceneInstances.scene?.updateSpaceEquipData(res.data, floorAbnormalRecord);
    //         appSceneInstances.scene?.updateShowElements();
    //         appSceneInstances.scene?.updateSpaceStatus();
    //         appSceneInstances.scene?.updateEquipStatus();
    //     }
    // };

    onMounted(() => {
        // sseClient?.addEventListener('SECURITY_MODEL_VIEW', dealMapStatusSSEEvent);
        initCreateAndView();
        rebuildElements();
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
        // sseClient?.removeEventListener('SECURITY_MODEL_VIEW', dealMapStatusSSEEvent);
        currentFloorObj.value = null;
        if (timeoutKey.value) {
            clearTimeout(timeoutKey.value);
            timeoutKey.value = null;
        }
    });

    onUnmounted(() => {
        graphWarp.value = null;
        floorList.value = null;
        buildFloors.value = null;
        floorIdMapSpaces.value = null;
        floorIdMapEquipTypes.value = null;
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
        hoverVideoCardPosition,
        showMapRelationMode,
        highlightCameras,
        unhighlightCameras,
        setCameraGroup,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        setEquipOnPlay,
        unsetEquipOnPlay,
        pauseRender,
        hasData
    };
};
