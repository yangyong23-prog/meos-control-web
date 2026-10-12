// @ts-ignore
import i18n from '@/localization';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';

import { Environment } from '@/config';
import useStore from '@/store';
import xplantindoorenvStore from '@/store/xplantindoorenv';

import useMapAction from './useMapAction';

import BuildFloorScene from '../DemandManageInfoScene';

import {
    currentFloorObjInjectKey,
    selectModuleInfoInjectKey,
    templateDemandTypeInjectKey,
    showModuleInfoInjectKey,
    staticTreeInjectKey,
    staticTreeIsLoadingInjectKey,
    dynamicSpacesDataInjectKey,
    customConfigIdsInjectKey,
    shieldedSpaceIdsInjectKey,
    blackListSpaceIdsInjectKey,
    customConfigInstancesInjectKey,
    floorIdToReferenceSpacesInjectKey,
    dynamicSpacesDataLoadingInjectKey
} from '../../constant/injectKey';
import { BUILDING_MODE, FLOOR_MODE } from '../constant/index';
import { addFloorInfoToSpace, getFloorDataFromSpace } from '../utils/index';
import { OBJ_TYPE } from '@/utils/globalVariables';

export default () => {
    const { base } = useStore();

    const currentBuildingId = ref('');
    const currentFloorObj = inject(currentFloorObjInjectKey);
    const showModuleInfo = inject(showModuleInfoInjectKey);
    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const templateDemandType = inject(templateDemandTypeInjectKey);

    const staticTree = inject(staticTreeInjectKey);
    const staticTreeIsLoading = inject(staticTreeIsLoadingInjectKey);
    const dynamicSpacesData = inject(dynamicSpacesDataInjectKey);

    const customConfigInstances = inject(customConfigInstancesInjectKey);
    const customConfigIds = inject(customConfigIdsInjectKey);
    const shieldedSpaceIds = inject(shieldedSpaceIdsInjectKey);
    const blackListSpaceIds = inject(blackListSpaceIdsInjectKey);
    const dynamicSpacesDataLoading = inject(dynamicSpacesDataLoadingInjectKey);
    const floorIdToReferenceSpaces = inject(floorIdToReferenceSpacesInjectKey);

    const graphWarp = ref(null);
    const curHoverObj = ref();
    const hoverCardPosition = ref();

    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        floorLoading: ref(false),
        objectsLoading: ref(false),
        elementsLoading: ref(false)
    };
    const floorRecord = {};

    let initPromise = null,
        resizeOb = null;

    const mapLoading = computed(() => {
        const buildLoading = staticTreeIsLoading?.value;
        const dynamicLoading = dynamicSpacesDataLoading?.value;
        const mapInnerLoading = loadings.initLoading.value || loadings.floorLoading.value || loadings.elementsLoading.value || loadings.objectsLoading.value;
        return buildLoading || dynamicLoading || mapInnerLoading;
    });

    const clickSpaceOrFloor = obj => {
        if (!selectModuleInfo) {
            return;
        }
        if (obj) {
            selectModuleInfo.value = { ...obj };
        } else {
            selectModuleInfo.value = null;
        }
    };

    const addSceneListener = async () => {
        loadings.initLoading.value = true;

        appSceneInstances.scene.addEventListener('clickFloor', obj => {
            if (currentFloorObj) {
                currentFloorObj.value = obj?.data;
                const floorObj = floorRecord[currentFloorObj.value?.id];
                if (floorObj) {
                    clickSpaceOrFloor(floorObj);
                }
            }
        });

        appSceneInstances.scene.addEventListener('onHoverCard', obj => {
            if (obj.data) {
                const { instance, pos } = obj.data;
                if (instance && pos) {
                    const cardData = {
                        ...instance,
                        classCode: instance.objType === 'equipment' ? instance.classCode : '',
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
            if (obj?.data) {
                const floorObj = getFloorDataFromSpace(obj.data);
                if (currentFloorObj && currentFloorObj.value?.id !== floorObj.id) {
                    currentFloorObj.value = floorObj;
                }
                clickSpaceOrFloor(obj.data);
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

    const mapSwitchMode = async (m, floorId) => {
        await appSceneInstances.scene.switchModeView(m, floorId);
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
                templateDemandType: templateDemandType?.value
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
            await mapSwitchMode(BUILDING_MODE);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const dealSpacesFloors = (tree, customConfigs) => {
        const buildings = [];
        const customConfigFloors = customConfigs?.filter(v => v?.objType === OBJ_TYPE.FLOOR);
        const customConfigBuildings = customConfigs?.filter(v => v?.objType === OBJ_TYPE.BUILDING);
        const deal = node => {
            if (node?.children?.length > 0) {
                if (node.objType === OBJ_TYPE.BUILDING) {
                    const building = {
                        ...node,
                        ...(customConfigBuildings?.length
                            ? {
                                  instanceTag: {
                                      customConfig: customConfigBuildings?.some(curBuilding => curBuilding.id === node.id)
                                  }
                              }
                            : {})
                    };
                    building.floors = node.children?.map(f => {
                        const floor = {
                            ...f,
                            ...(customConfigFloors?.length
                                ? {
                                      instanceTag: {
                                          customConfig: customConfigFloors?.some(curFloor => curFloor.id === f.id)
                                      }
                                  }
                                : {})
                        };
                        floorRecord[f.id] = floor;
                        delete floor.children;
                        delete floor.parent;
                        return floor;
                    });
                    delete building.children;
                    delete building.parent;
                    buildings.push(building);
                    node.floors = node.children;
                }
                node.children?.forEach(c => {
                    deal(c);
                });
            }
        };

        if (!tree?.length) {
            return { buildings };
        }

        tree?.forEach(prj => {
            deal(prj);
        });
        return { buildings };
    };

    const rebuildElements = async (tree, customConfigs) => {
        await initPromise;

        loadings.elementsLoading.value = true;
        try {
            const { buildings } = dealSpacesFloors(tree, customConfigs);
            const spaces = renderSpaces.value;
            // if (!spaces?.length) {
            //     return;
            // }

            xplantindoorenvStore().setBuildingData(buildings);

            spaces?.forEach(space => {
                const rawSpace = toRaw(space);
                addFloorInfoToSpace(rawSpace, floorRecord);
            });

            let floors = Object.values(floorRecord)?.filter(v => !!v);
            if (currentBuildingId.value) {
                floors = floors.filter(v => v?.buildingId === currentBuildingId.value);
            }

            await createElements({ spaces, floors });
            appSceneInstances.scene?.updateSpaceStatus();
            appSceneInstances.scene?.updateShowElements();
            appSceneInstances.scene?.updateEquipStatus();
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
    };

    const customConfigSpaces = computed(() => {
        return customConfigInstances?.value?.filter(v => v?.objType === 'space');
    });

    const renderSpaces = computed(() => {
        const customSpaces = customConfigSpaces?.value;
        const finalSpaces = currentFloorObj?.value?.id ? (dynamicSpacesData?.value?.length ? dynamicSpacesData?.value : customSpaces) : customSpaces;
        const spaces = finalSpaces?.map(v => {
            const customConfig = customConfigIds?.value?.includes?.(v.id);
            const shielded = shieldedSpaceIds?.value?.includes?.(v.id);
            const inBlacklisted = blackListSpaceIds?.value?.includes(v.id);
            const existCfg = floorIdToReferenceSpaces?.value?.[v.floorId]?.includes(v.id);
            return {
                ...v,
                instanceTag: { inBlacklisted, shielded, customConfig, existCfg }
            };
        });
        return spaces;
    });

    const renderSpacesFlags = computed(() => {
        const customSpaces = customConfigSpaces?.value;
        const finalSpaces = currentFloorObj?.value?.id ? (dynamicSpacesData?.value?.length ? dynamicSpacesData?.value : customSpaces) : customSpaces;
        const spaceObj = finalSpaces?.map(v => {
            const customConfig = customConfigIds?.value?.includes?.(v.id);
            const shielded = shieldedSpaceIds?.value?.includes?.(v.id);
            const inBlacklisted = blackListSpaceIds?.value?.includes(v.id);
            const existCfg = floorIdToReferenceSpaces?.value?.[v.floorId]?.includes(v.id);
            return {
                id: v.id,
                inBlacklisted,
                shielded,
                customConfig,
                existCfg
            };
        });

        return JSON.stringify(spaceObj);
    });

    onMounted(() => {
        initCreateAndView();
        // 静态树数据变化，重新消费建筑、楼层模型数据
        watch(
            [() => staticTree?.value, () => customConfigInstances?.value],
            ([curTree, curCustomConfigs]) => {
                rebuildElements(curTree, curCustomConfigs);
            },
            { immediate: true }
        );
        // 动态加载空间数据，创建空间图元，添加特殊配置、屏蔽、黑名单、引用上级标记
        watch([renderSpacesFlags], async () => {
            const spaces = renderSpaces.value;
            if (!spaces?.length) {
                return;
            }

            const { buildings } = dealSpacesFloors(staticTree?.value, customConfigInstances?.value);

            xplantindoorenvStore().setBuildingData(buildings);

            spaces?.forEach(space => {
                const rawSpace = toRaw(space);
                addFloorInfoToSpace(rawSpace, floorRecord);
            });

            let floors = Object.values(floorRecord)?.filter(v => !!v);
            if (currentBuildingId.value) {
                floors = floors?.filter(v => v?.buildingId === currentBuildingId.value);
            }

            await createElements({ spaces: spaces, floors });
            appSceneInstances.scene?.updateSpaceStatus();
            appSceneInstances.scene?.updateShowElements();
        });
        // TODO 特殊配置对象变化，高亮楼层变化：recordFloorInfo
        resizeOb = new ResizeObserver(() => windowResize());
        resizeOb.observe(graphWarp.value);
    });

    watch(
        () => staticTreeIsLoading?.value,
        async curLoading => {
            if (curLoading && currentFloorObj?.value) {
                currentFloorObj.value = null;
            }
        }
    );

    watch(
        () => currentFloorObj?.value?.id,
        async newFloorId => {
            await mapSwitchMode(newFloorId ? FLOOR_MODE : BUILDING_MODE, newFloorId);
            appSceneInstances.scene?.updateSpaceStatus();
            if (showModuleInfo) {
                showModuleInfo.value = false;
            }
        }
    );

    watch(selectModuleInfo, newVal => {
        if (!newVal || newVal.objType !== 'space') {
            appSceneInstances.scene?.unselectModel();
        }
        // HACK：多建筑下无法区分相同楼层染色，默认选中第一个建筑
        if (newVal?.instanceType === 'PROJECT') {
            currentBuildingId.value = newVal?.children?.[0]?.id;
        }
        // if (newVal?.objType === 'building') {
        //     currentBuildingId.value = newVal?.id;
        // }
        // if (['floor', 'space'].includes(newVal?.objType)) {
        //     currentBuildingId.value = newVal?.buildingId;
        // }
    });

    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
    });

    const { clickMapObj, hoverMapObj, unhoverMapObj, onClickMoreInfo, goDefault, pauseRender } = useMapAction({ appSceneInstances, clickSpaceOrFloor, currentFloorObj });

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
        pauseRender
    };
};
