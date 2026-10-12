// @ts-ignore
import i18n from '@/localization';
/* eslint-disable max-len */
import BuildFloorScene from '../FlowFloorScene';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import { FLOW_STATISTICS_CAMERA_CLASS_CODES } from '@/constants/camera';
import { DOOR_GROUP_CLASS_CODES } from '@/constants/door';

import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, showModuleInfoInjectKey, selectModuleInfoInjectKey, currentFloorObjInjectKey } from '../../constant/injectKey';

import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { listInfoCodeConfigsByObjectFilters } from '@/apis/monitor';
import useModelViewSSEHandle from '@/components/hooks/useModelViewSSEHandle';
import { MODEL_VIEW, PASSENGER_FLOW, OBJ_TYPE } from '@/utils/globalVariables';

export default () => {
    const { base } = useStore();

    const currentFloorObj = inject(currentFloorObjInjectKey);

    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const showModuleInfo = inject(showModuleInfoInjectKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);
    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
    const sseClient = inject('sseClient');
    const graphWarp = ref('');
    const curHoverObj = ref();
    const hoverCardPosition = ref();
    const appSceneInstances = {};
    const floorIdObjMap = ref({});
    const listInfoCodeOrigin = ref();

    const loadings = {
        floorLoading: ref(false),
        initLoading: ref(false),
        objectsLoading: ref(false)
    };

    let initPromis = null,
        buildingInfoPromise = null,
        getAllDataPromise = null,
        resizeOb = null;

    const mapLoading = computed(() => loadings.floorLoading.value || loadings.initLoading.value || loadings.objectsLoading.value);

    useModelViewSSEHandle(sseClient, listInfoCodeOrigin, () => {
        appSceneInstances.scene?.sseRefreshIotInfo();
    });

    // 获取建筑信息
    const getTreeBuildingFloor = () => {
        // eslint-disable-next-line one-var
        let parasm = {
            projectId: base.projectId,
            isQuerySpace: false
        };
        if (xplantindoorenvStore().buildingData?.length) {
            return Promise.resolve();
        }
        return getListTreeBuildingFloorSpace(parasm).then(res => {
            const { data, code } = res;
            // eslint-disable-next-line eqeqeq
            if (code == '00000') {
                xplantindoorenvStore().setBuildingData(data);
                xplantindoorenvStore().setBuildingFloorData(data);
            }
        });
    };
    buildingInfoPromise = getTreeBuildingFloor();

    const writeIotInfos = data => {
        if (!data._infoMap) {
            data._infoMap = {};
            data._infoMapOrigin = {};
        }
        const { relInfoCodeGroupConfigs } = data;
        relInfoCodeGroupConfigs?.forEach(config => {
            const { relInfoCodeConfigs } = config;
            relInfoCodeConfigs?.forEach(info => {
                const { infoCode } = info;
                data._infoMapOrigin[infoCode] = info;
                data._infoMap[infoCode] = JSON.parse(JSON.stringify(info));
            });
        });
    };

    // 获取地图中的所有对象 并做分组
    const getAllObjects = async () => {
        loadings.objectsLoading.value = true;
        try {
            const res = await listInfoCodeConfigsByObjectFilters({
                projectId: base.projectId,
                runningMonitorType: PASSENGER_FLOW,
                templateCode: MODEL_VIEW
            });

            if (res.code === '00000') {
                listInfoCodeOrigin.value = res.data;
                // 按照楼层id分组
                const objMap = {};
                res.data.forEach(da => {
                    if (!objMap[da.floorId]) {
                        objMap[da.floorId] = {
                            spaces: [],
                            cameras: [],
                            doorGroup: []
                        };
                    }
                    if (da.objType === OBJ_TYPE.SPACE) {
                        objMap[da.floorId].spaces.push(da);
                    } else if (FLOW_STATISTICS_CAMERA_CLASS_CODES.includes(da.classCode)) {
                        objMap[da.floorId].cameras.push(da);
                    } else if (DOOR_GROUP_CLASS_CODES.includes(da.classCode)) {
                        objMap[da.floorId].doorGroup.push(da);
                    }
                    writeIotInfos(da);
                });
                floorIdObjMap.value = objMap;
            }
        } catch (e) {
            console.error(e);
        }

        loadings.objectsLoading.value = false;
    };

    getAllDataPromise = getAllObjects();

    // 初始化场景
    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            await buildingInfoPromise;

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
                loadings
            });

            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });

            loadings.initLoading.value = true;

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

            appSceneInstances.scene.addEventListener('onUnHover', obj => {
                curHoverObj.value = null;
                if (hoverCardPosition.value) {
                    hoverCardPosition.value = null;
                }
            });

            appSceneInstances.scene.addEventListener('clickDetail', obj => {
                clickSpaceOrEquip(obj.data);
            });

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
                    hoverCardPosition.value = { ...pos, top: pos.top - 10 };
                }
            });

            appSceneInstances.scene.addEventListener('onUnHover', obj => {
                curHoverObj.value = null;
                if (hoverCardPosition.value) {
                    hoverCardPosition.value = null;
                }
            });

            try {
                await appSceneInstances.scene.initLoader();
            } catch (e) {
                console.log('e: ', e);
            }
            loadings.initLoading.value = false;
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

    const clickSpaceOrEquip = obj => {
        if (obj) {
            openDetailDrawer(obj);
        } else {
            closeDetailDrawer();
        }
    };

    const nameAfterBack = computed(() => {
        return '';
    });

    const onClickMoreInfo = obj => {
        if (obj) {
            clickSpaceOrEquip({ ...obj, classCode: obj.oriClassCode || obj.classCode });
        }
    };

    const createElements = () => {
        if (Object.keys(floorIdObjMap.value).length && currentFloorObj.value?.floorId) {
            const { spaces, cameras, doorGroup } = floorIdObjMap.value[currentFloorObj.value.floorId] || {};
            appSceneInstances.scene?.createElements(spaces, cameras, doorGroup);
        }
    };

    watch(
        () => currentFloorObj?.value,
        newFloorObj => {
            appSceneInstances.scene?.renderFloor(newFloorObj?.floorId);
            createElements();
            if (showModuleInfo) {
                showModuleInfo.value = false;
            }
        }
    );

    watch(showModuleInfo, newVal => {
        if (!newVal) {
            appSceneInstances.scene?.unselectModel();
        }
    });

    const initCreateAndView = async () => {
        // pageLoading.value = true;
        try {
            if (!initPromis) {
                initPromis = initScene();
            }
            await initPromis;
            if (currentFloorObj.value?.floorId) {
                appSceneInstances.scene.renderFloor(currentFloorObj.value?.floorId);
            }
            await getAllDataPromise;
            createElements();
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const clickMapObj = obj => {
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

    onMounted(() => {
        initCreateAndView();
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
    });

    return {
        initScene,
        appSceneInstances,
        graphWarp,
        goDefault,
        windowResize,
        mapLoading,
        onClickMoreInfo,
        nameAfterBack,
        curHoverObj,
        hoverCardPosition,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj
    };
};
