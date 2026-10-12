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
    buildingFloorSpaceTreeKey,
    buildingFloorSpaceTreeLoadingKey
} from '../../constant/injectKey';
import { BUILDING_MODE, FLOOR_MODE } from '../constant/index';
import { additionalFloorInfo, extractFloorDataFromSpace } from '../utils/index';

export default () => {
    const { base } = useStore();

    const currentFloorObj = inject(currentFloorObjInjectKey);
    const showModuleInfo = inject(showModuleInfoInjectKey);
    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const templateDemandType = inject(templateDemandTypeInjectKey);
    const buildingFloorSpaceTree = inject(buildingFloorSpaceTreeKey);
    const buildingFloorSpaceTreeLoading = inject(buildingFloorSpaceTreeLoadingKey);

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
        const buildLoading = buildingFloorSpaceTreeLoading.value;
        const mapInnerLoading = loadings.initLoading.value || loadings.floorLoading.value || loadings.elementsLoading.value || loadings.objectsLoading.value;
        return buildLoading || mapInnerLoading;
    });

    const clickSpaceOrFloor = obj => {
        if (!selectModuleInfo) {
            return;
        }
        if (obj) {
            selectModuleInfo.value = obj;
        } else {
            selectModuleInfo.value = null;
        }
    };

    const addSceneListener = async () => {
        loadings.initLoading.value = true;

        appSceneInstances.scene.addEventListener('clickFloor', obj => {
            console.log('点击楼层标签----obj: ', obj);
            if (currentFloorObj) {
                currentFloorObj.value = obj?.data;
                const floorObj = floorRecord[currentFloorObj.value?.id];
                if (floorObj) {
                    clickSpaceOrFloor(floorObj);
                }
            }
        });

        appSceneInstances.scene.addEventListener('onHoverCard', obj => {
            console.log('onHoverEquip空间----obj: ', obj);
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
            console.log('点击空间或控制模块----obj: ', obj);
            if (obj?.data) {
                const floorObj = extractFloorDataFromSpace(obj.data);
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

            console.time('initCreateAndView');
            await initPromise;
            await mapSwitchMode(BUILDING_MODE);
            console.timeEnd('initCreateAndView');
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const dealSpacesFloors = () => {
        const spaces = [];

        const buildings = [];
        const deal = (node, p) => {
            if (node?.children?.length > 0) {
                if (node.instanceType === 'BUILDING') {
                    const building = { ...node };
                    building.floors = node.children?.map(f => {
                        const floor = { ...f };
                        delete floor.children;
                        delete floor.parent;
                        return floor;
                    });
                    delete building.children;
                    delete building.parent;
                    buildings.push(building);
                    node.floors = node.children;
                } else if (node.instanceType === 'FLOOR') {
                    floorRecord[node.id] = node;
                }
                node.children?.forEach(c => {
                    deal(c);
                });
            } else if (node) {
                spaces.push(node);
            }
        };
        buildingFloorSpaceTree.value?.forEach(prj => {
            deal(prj);
        });
        // const buildings = buildingFloorSpaceTree.value?.length > 0 ? buildingFloorSpaceTree.value[0].children : [];
        return { spaces, buildings };
    };

    const rebuildElements = async () => {
        await initPromise;

        console.time('rebuildElements');
        loadings.elementsLoading.value = true;
        try {
            const { spaces, buildings } = dealSpacesFloors();

            xplantindoorenvStore().setBuildingData(buildings);

            spaces?.forEach(space => {
                const rawSpace = toRaw(space);
                // mock数据
                // rawSpace.instanceTag = {
                //     shielded: Math.random() > 0.9,
                //     customConfig: Math.random() > 0.2
                // };
                additionalFloorInfo(rawSpace, floorRecord);
            });

            // console.log('createElements: ', toRaw(buildingFloorSpaceTree.value));
            // TODO 待调整设备
            await createElements({ spaces, floors: Object.values(floorRecord), equips: [] });
            appSceneInstances.scene?.updateSpaceStatus();
            appSceneInstances.scene?.updateShowElements();
            appSceneInstances.scene?.updateEquipStatus();
        } catch (e) {
            console.log('e: ', e);
        } finally {
            loadings.elementsLoading.value = false;
            console.timeEnd('rebuildElements');
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

    onMounted(() => {
        initCreateAndView();
        watch(
            () => buildingFloorSpaceTree?.value?.length,
            () => {
                rebuildElements();
            },
            { immediate: true }
        );
        resizeOb = new ResizeObserver(() => windowResize());
        resizeOb.observe(graphWarp.value);
    });

    watch(
        () => buildingFloorSpaceTreeLoading.value,
        async curLoading => {
            if (curLoading) {
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
        if (!newVal || newVal.instanceType !== 'SPACE') {
            appSceneInstances.scene?.unselectModel();
        }
    });

    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
    });

    const { clickMapObj, hoverMapObj, unhoverMapObj, onClickMoreInfo, goDefault } = useMapAction({ appSceneInstances, clickSpaceOrFloor, currentFloorObj });

    return {
        graphWarp,
        goDefault,
        mapLoading,
        curHoverObj,
        hoverCardPosition,
        onClickMoreInfo,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj
    };
};
