// @ts-ignore
import i18n from '@/localization';
import PlayeBackMapScene from './PlayeBackMapScene';
import { ref, computed, inject } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import {
    currentPlayingDataInjectKey,
    pausePlayInjectKey,
    currentEnvParamInjectKey,
    playbackLoadingInjectKey,
    sceneLoadingInjectKey,
    selectedDateInjectKey
} from '../constant/injectKey';

import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';

export default () => {
    const currentPlayingData = inject(currentPlayingDataInjectKey);
    const pausePlay = inject(pausePlayInjectKey);
    const playbackLoading = inject(playbackLoadingInjectKey);
    const sceneLoading = inject(sceneLoadingInjectKey);
    const selectedDate = inject(selectedDateInjectKey);

    const { base } = useStore();
    const graphWarp = ref('');
    const curHoverObj = ref();
    const hoverCardPosition = ref();
    const currentEnvParam = inject(currentEnvParamInjectKey);

    // 楼层id映射空间列表
    const appSceneInstances = {};

    let initPromis = null,
        resizeOb = null,
        buildingInfoPromise = null;

    const spaceIdMapSpace = {};

    const getTreeBuildingFloor = () => {
        // 获取建筑信息
        let parasm = {
            projectId: base.projectId
        };
        return getListTreeBuildingFloorSpace(parasm).then(res => {
            const { data, code } = res;
            if (`${code}` === '00000') {
                xplantindoorenvStore().setBuildingData(data);
                data.forEach(building => {
                    const { floors } = building;
                    floors.forEach(floor => {
                        const { spaces } = floor;
                        spaces.forEach(space => {
                            spaceIdMapSpace[space.id] = space;
                        });
                    });
                });
            }
        });
    };

    buildingInfoPromise = getTreeBuildingFloor();

    const mapLoading = computed(() => sceneLoading.value || playbackLoading.value);

    const windowResize = () => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const writeDetailSpaceData = spaceList => {
        spaceList.forEach(space => {
            const detailSpace = spaceIdMapSpace[space.id];

            if (detailSpace) {
                // 合并对象
                Object.assign(space, detailSpace);
                space.tag = {
                    carbonDioxideDemandStatus: space.carbonDioxideDemandStatus,
                    carbonDioxideDemandStatusName: space.carbonDioxideDemandStatusName,
                    carbonDioxideDemandValue: space.carbonDioxideDemandValue,
                    carbonDioxideCurrentValue: space.carbonDioxideCurrentValue,
                    temperatureDemandStatus: space.temperatureDemandStatus,
                    temperatureDemandStatusName: space.temperatureDemandStatusName,
                    temperatureDemandValue: space.temperatureDemandValue,
                    temperatureCurrentValue: space.temperatureCurrentValue
                };
            }
        });
    };
    const renderCurrentSpace = () => {
        if (!sceneLoading.value && currentPlayingData.value) {
            const { spaceDetail } = currentPlayingData.value;
            writeDetailSpaceData(spaceDetail);
            createSpaces(spaceDetail);
            appSceneInstances.scene?.updateSpaceStatus();
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
            appSceneInstances.scene = new PlayeBackMapScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                currentEnvAttr: currentEnvParam
            });

            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });

            sceneLoading.value = true;

            appSceneInstances.scene.addEventListener('onHoverCard', obj => {
                if (obj.data) {
                    const { instance, pos } = obj.data;
                    if (instance && pos) {
                        pausePlay?.();
                        const cardData = {
                            ...instance,
                            classCode: instance.objType === 'equipment' ? instance.classCode : '',
                            oriClassCode: instance.classCode,
                            graphTypeCode: i18n.global.t('meos_control_web.space_environment_and_regulation')
                        };
                        curHoverObj.value = cardData;
                        console.log('curHoverObj>>>>>', curHoverObj.value);
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

            try {
                await Promise.all([buildingInfoPromise, appSceneInstances.scene.initLoader()]);
            } catch (e) {
                console.log('e: ', e);
            }
            sceneLoading.value = false;
        }
    };

    const initCreateAndView = async () => {
        try {
            if (!initPromis) {
                initPromis = initScene();
            }

            await initPromis;
            await appSceneInstances.scene.switchModeView(1);
            renderCurrentSpace();
        } catch (e) {
            console.error('e: ', e);
        }
    };

    const createSpaces = async data => {
        try {
            appSceneInstances.scene.createSpaces(data);
        } catch (e) {
            console.log('e: ', e);
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

    watch(
        currentPlayingData,
        () => {
            renderCurrentSpace();
        },
        {
            immediate: true
        }
    );

    watch(currentEnvParam, () => {
        appSceneInstances.scene?.updateSpaceStatus();
    });

    watch(selectedDate, () => {
        createSpaces([]); // 清空一下数据
    });

    // 默认加载位置
    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
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
        windowResize,
        mapLoading,
        curHoverObj,
        hoverCardPosition,
        goDefault
    };
};
