import DemoFloorScene from './DemoFloorScene';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';

import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { getFloorInfoByFloorId, getFloorInfoListByFloorIdList, getBuildingInfoByFloorId } from '@/utils/buildingUtils';

import spaces from './mock/spaces.json';
import parking from './mock/parking.json';

export default currentFloorId => {
    const { base } = useStore();

    const graphWarp = ref('');

    const hoverCardPosition = ref();

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
        spaceIdMap = null;

    const mapLoading = computed(() => loadings.initLoading.value || loadings.floorLoading.value || loadings.elementsLoading.value || loadings.detailLoading.value);

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

    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            await buildingInfoPromise;

            if (appSceneInstances.scene) {
                appSceneInstances.scene?.dispose();
            }
            if (appSceneInstances.app) {
                appSceneInstances.app.dispose();
            }
            appSceneInstances.scene = new DemoFloorScene({
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

            appSceneInstances.scene.addEventListener('clickFloor', obj => {
                console.log('点击楼层标签----obj: ', obj);
            });

            appSceneInstances.scene.addEventListener('onHoverCard', obj => {
                console.log('onHoverEquip空间----obj: ', obj);
                if (obj.data) {
                    const { instance, pos } = obj.data;
                    if (instance && pos) {
                        const cardData = {
                            ...instance,
                            classCode: instance.objType === 'equipment' ? instance.classCode : '',
                            oriClassCode: instance.classCode,
                            graphTypeCode: '空间环境与调节'
                        };
                    }
                    hoverCardPosition.value = { ...pos, top: pos.top - 10 };
                }
            });
            appSceneInstances.scene.addEventListener('onUnHover', obj => {
                // console.log('onUnEquip设备----obj: ', Date.now());
                if (hoverCardPosition.value) {
                    hoverCardPosition.value = null;
                }
            });

            appSceneInstances.scene.addEventListener('clickDetail', obj => {
                console.log('点击空间或控制模块----obj: ', obj);
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
    };

    watch(
        () => currentFloorId?.value,
        newFloorObj => {
            console.log('watch---currentFloorId?.value: ', currentFloorId?.value);
            appSceneInstances.scene?.switchModeView(newFloorObj ? 2 : 1, newFloorObj);
        }
    );

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
            // mapSwitchMode(1);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const rebuildElements = async () => {
        await initPromis;
        const floors = [];
        floorList.value = [];
        const equipArr = new Set();

        let spaceArr = [],
            equipmentsArr = [],
            floorMapSpaces = {},
            floorRecord = {},
            // 有撤布防的空间
            hasSpaceDeploymentStatus = false;
        loadings.elementsLoading.value = true;
        try {
            // const spaceRes = await queryModels();
            // const { spaces, equipments } = spaceRes;
            spaceIdMap = {};
            spaceArr = spaces;
            // equipmentsArr = equipments;
            spaceArr?.forEach(obj => {
                obj.newKey = obj.oldKey;
            });
            // mackMockData(spaceArr, equipmentsArr);
            spaceArr?.forEach((space, index) => {
                // currentSpaceData.value?.forEach(space => {
                spaceIdMap[space.id] = space;
                if (!hasSpaceDeploymentStatus && !!space.deploymentStatus) {
                    hasSpaceDeploymentStatus = true;
                }
                // space.tag.abnormal
                if (space.abnormal) {
                    //空间是否存在异常
                    floorAbnormalRecord.value[space.floorId] = space.floorId;
                }
                const rawSpace = toRaw(space);
                if (!floorMapSpaces[rawSpace.floorId]) {
                    floorMapSpaces[rawSpace.floorId] = [];
                }
                floorMapSpaces[rawSpace.floorId].push(rawSpace);
                if (!floorRecord[rawSpace.floorId]) {
                    const floorInfo = getFloorInfoByFloorId(rawSpace.floorId);
                    floorRecord[rawSpace.floorId] = floorInfo;

                    floors.push({
                        id: rawSpace.floorId,
                        localId: floorInfo?.localId
                    });
                    floorList.value.push(space.floorId);
                    rawSpace.floorLocalId = floorInfo?.localId;
                } else {
                    rawSpace.floorLocalId = floorRecord[rawSpace.floorId].localId;
                }
                rawSpace.relEquipments?.forEach(e => {
                    equipArr.add(e);
                });
            });
            floorIdMapSpaces.value = floorMapSpaces;

            console.log('createElements:--- ');
            const pps = spaceArr.filter(obj => obj.id === 'Sp6101122010159b6aa4f5824d52bb6d93c758d5e5d0');
            // const pp = parking.filter(obj => obj.floorId === 'Fl1101059001679da59d16c64aeb8df98b15230ddf69');
            // console.log('pp: ', pp);
            const ss = spaceArr.filter(obj => obj.id !== 'Sp6101122010159b6aa4f5824d52bb6d93c758d5e5d0');
            await createElements({ spaces: [], floors, parkingPlaces: parking, equips: [...equipmentsArr] });
            appSceneInstances.scene?.updateShowElements();
        } catch (e) {
            console.log('e: ', e);
        }

        loadings.elementsLoading.value = false;
    };

    onMounted(() => {
        initCreateAndView();
        //
        rebuildElements();
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();

        currentFloorId.value = null;
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
        floorList,
        hoverCardPosition
    };
};
