// @ts-ignore
import i18n from '@/localization';
import BuildFloorScene from './SpaceEquipMapScene';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import dayjs from 'dayjs';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { $Message } from 'meri-plus';
import { curSelectedFloorKey, curSelectedSpaceKey, buildingInfoPromiseKey, globalTimeKey, curSelectedTimeKey } from '../../injectionKey';
import { getStoreTreeBuildingFloor } from '../../utils/index';

import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { debounce } from 'lodash';
import { SAPCETYPE } from '../../variable';
import { OBJ_TYPE } from '@/utils/globalVariables';

export default props => {
    const { base } = useStore();

    const currentFloorObj = inject(curSelectedFloorKey);

    const curSelectedSpaceObj = inject(curSelectedSpaceKey);
    const _buildingInfoPromise = inject(buildingInfoPromiseKey);
    // 当前选择日期
    const curSelectedDate = inject(globalTimeKey);
    const curSelectedTime = inject(curSelectedTimeKey);
    const showModuleInfo = ref();
    const buildingFloors = ref([]);
    // const buildingSpaceTree = inject('buildingSpaceTree');

    const graphWarp = ref('');

    const curHoverObj = ref();
    const hoverCardPosition = ref();

    const appSceneInstances = {};

    const curMapData = ref();
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
        cancelTokenSource;

    console.log('cancelTokenSource: ');

    const makeBuildingFloors = async () => {
        if (_buildingInfoPromise) {
            await _buildingInfoPromise;
        } else {
            await getStoreTreeBuildingFloor();
        }
        buildingFloors.value = xplantindoorenvStore().buildingFloorData?.map(building => {
            const newBuilding = { ...building, name: building?.localName };
            newBuilding.floors = newBuilding?.floors?.map(f => ({ ...f, name: f?.localName })) || [];
            newBuilding.floorList = [...newBuilding.floors].sort((a, b) => {
                return b.floorSequenceId - a.floorSequenceId;
            });
            return newBuilding;
        });
    };

    buildingInfoPromise = makeBuildingFloors();

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
        showModuleInfo.value = false;
        if (obj) {
            showModuleInfo.value = true;
            let floorLocalName = obj.floorLocalId;
            if (obj.objType === OBJ_TYPE.EQUIPMENT) {
                const floor = getFloorInfoByFloorId(obj.floorId);
                floorLocalName = floor?.localId;
            }
            curSelectedSpaceObj.value = {
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
                canSpaceSelected: props.canSpaceSelected
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
                        // const dateSel = dayjs(curSelectedDate.value);
                        const curTime = `${curSelectedDate.value} ${curSelectedTime.value}`;
                        console.log('curTime: ', curTime);
                        // 计算结束日期，加一天以确保包含所有需要的数据
                        const endDate = dayjs(curTime).add(5, 'minute').format('YYYY-MM-DD HH:mm:00');
                        const cardData = {
                            ...instance,
                            classCode: instance.objType === OBJ_TYPE.EQUIPMENT ? instance.classCode : '',
                            oriClassCode: instance.classCode,
                            startTime: dayjs(curTime).format('YYYY-MM-DD HH:mm:00'),
                            endTime: endDate
                        };
                        if (props?.spaceSecondType) {
                            cardData.runningMonitorSecondType = SAPCETYPE[props.spaceSecondType]?.code;
                        }
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
            try {
                await appSceneInstances.scene.initLoader();
            } catch (e) {
                console.log('e: ', e);
            }
            loadings.initLoading.value = false;
        }
    };

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

    watch(curSelectedSpaceObj, newVal => {
        // console.log('showModuleInfo: ', curSelectedSpaceObj.value);
        if (!newVal?.id) {
            appSceneInstances.scene?.unselectModel();
        }
    });

    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
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
        if (!curMapData.value) {
            return;
        }
        await initPromis;

        const floorRecord = {};
        loadings.elementsLoading.value = true;
        try {
            await buildingInfoPromise;
            const { spaces, equipments, links } = toRaw(curMapData.value);
            console.log('rebuildElements spaces, equipments, links: ', spaces, equipments, links);

            spaces?.forEach(space => {
                additionalFloorInfo(space, floorRecord);
            });

            equipments?.forEach(equipment => {
                additionalFloorInfo(equipment, floorRecord);
            });

            await appSceneInstances.scene.createAndRenderElements({ spaces, equipments, links });

            // appSceneInstances.scene?.updateSpaceStatus();
            // appSceneInstances.scene?.updateShowElements();
            // appSceneInstances.scene?.updateEquipStatus();
        } catch (e) {
            console.log('e: ', e);
        }
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
            if (floorInfo) {
                currentFloorObj.value = floorInfo;
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

    const rebuildElementsDebounce = debounce(rebuildElements, 20);

    onMounted(() => {
        // 网格图加载完之后开始加载地图相关
        initCreateAndView();
        watch(
            [() => props?.spaces, () => props?.equipments, () => props?.links],
            () => {
                const data = { spaces: props?.spaces || [], equipments: props?.equipments || [], links: props?.links || [] };
                curMapData.value = data;
                rebuildElementsDebounce();
            },
            { immediate: true }
        );
        watch(
            () => props?.isActive,
            () => {
                pauseRender(!props?.isActive);
            }
        );
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
        buildingFloors,
        curSelectedSpaceObj,
        currentFloorObj,
        goDefault,
        windowResize,
        mapSwitchMode,
        onClickMoreInfo,
        curHoverObj,
        hoverCardPosition,
        showMapRelationMode,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender
    };
};
