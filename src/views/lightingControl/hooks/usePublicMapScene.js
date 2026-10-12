// @ts-ignore
import i18n from '@/localization';
import BuildFloorScene from '../publicLightingMap/BuildingFloorScene';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment, MEOS_LIGHT_SPACE_MAXCOUNT } from '@/config';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { $Message } from 'meri-plus';
import useStore from '@/store';
import { getLineOfFlight } from '@/apis/lightingControl';
import { getFloorInfoByFloorId, getBuildingInfoByFloorId } from '@/utils/buildingFloorTreeUtils';
import { mapSSEClientKey } from './useMapSSE';
import { LIGHT_SPACE_STATUS } from '@/utils/SSEEventTypes';
import { listInfoCodeConfigsByObjectCommon } from '@/apis/public';
import { MODEL_VIEW, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';

export default graphWarp => {
    const { base } = useStore();

    const curFloorId = inject('curFloorId');
    const curFloorName = inject('curFloorName');
    const curBuildingName = inject('curBuildingName');
    const showSpaceInfo = inject('showSpaceInfo');
    const showModuleInfo = inject('showModuleInfo');
    const spaceModuleInfo = inject('spaceModuleInfo');
    const templateType = inject('templateType');
    const mapSSEClient = inject(mapSSEClientKey);
    const buildingInfoPromise = inject('buildingInfoPromise');
    const loadingSpaceData = inject('loadingSpaceData');

    const currentTabs = ref('');
    const currentIntervenedValue = ref('');
    const currentLampFuncTypes = ref('');
    const currentAbnormalValue = ref('');
    const currentSpaceData = ref('');

    const curHoverSpaceObj = ref();
    const spaceCardPos = ref();

    const floorList = ref([]); // 楼层列表
    const equipTipsRef = ref(); //
    const popPosition = ref({
        left: 0,
        top: 0
    }); //
    const popupQueryData = ref(null); //
    const iotReqEquipIds = ref([]); // iot socket 轮询请求参数之一

    // 当前图背景色
    const curBackgroundColor = ref('');

    const viewFieldStack = ref([]);
    // 当前进入的空间数据
    const curEnterSpace = ref(null);
    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        floorLoading: ref(false)
    };

    let initPromis = null,
        resizeOb = null,
        cancelOtherSpacesLoad = null;
    // buildingInfoPromise = null;

    // 初始化楼层选择器列表
    const buildFloors = computed(() => {
        const _building = generateBuildFloors(Array.from(new Set(floorList.value)));
        console.log('wwwwwwww====', _building);
        return _building;
    });

    const generateBuildFloors = floorList => {
        if (!floorList?.length) {
            return [];
        }

        let allBuildingData = xplantindoorenvStore().buildingFloorData;
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

    const mapLoading = computed(() => {
        return loadings.initLoading.value || loadings.floorLoading.value || loadingSpaceData.value;
    });

    // 默认加载位置
    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };
    const goBackBuilding = () => {
        curFloorId.value = '';
        showSpaceInfo.value = false;
        showModuleInfo.value = false;
    };

    const windowResize = () => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const clickSpace = space => {
        showSpaceInfo.value = false;
        showModuleInfo.value = false;
        if (space) {
            showSpaceInfo.value = true;
            spaceModuleInfo.value = {
                ...space,
                templateType: templateType.value
            };
        }
        // 创建飞行线
        createLine(space);
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
                spaceMaxCount: MEOS_LIGHT_SPACE_MAXCOUNT || 1500,
                loadings,
                curFilterType: currentTabs,
                curFilterLampType: currentLampFuncTypes,
                curFilterIntervened: currentIntervenedValue,
                curFilterAbnormal: currentAbnormalValue
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });
            loadings.initLoading.value = true;

            appSceneInstances.scene.addEventListener('clickFloor', obj => {
                console.log('点击楼层标签----obj: ', obj);
                if (curFloorId) {
                    curFloorId.value = obj?.data?.id;
                }
            });

            appSceneInstances.scene.addEventListener('onHoverSpaceCard', obj => {
                // console.log('onHoverEquip空间----obj: ', Date.now());
                if (obj.data) {
                    const { spaceObj, pos } = obj.data;
                    curHoverSpaceObj.value = spaceObj;
                    spaceCardPos.value = { ...pos, top: pos.top - 10 };
                }
            });
            appSceneInstances.scene.addEventListener('onUnHoverSpace', obj => {
                // console.log('onUnEquip设备----obj: ', Date.now());
                curHoverSpaceObj.value = null;
                spaceCardPos.value = null;
            });
            appSceneInstances.scene.addEventListener('clickModuleCount', obj => {
                // console.log('clickModuleCount设备----obj: ', obj, Date.now());
                showSpaceInfo.value = false;
                showModuleInfo.value = false;
                if (obj.data) {
                    appSceneInstances.scene.clearAllLine();
                    showModuleInfo.value = true;
                    const { target, spaceData } = obj.data;
                    spaceModuleInfo.value = {
                        ...target,
                        objectType: OBJ_TYPE.EQUIPMENT,
                        spaceId: spaceData.id,
                        templateType: templateType.value
                    };
                    // console.log('spaceModuleInfo.value: ', spaceModuleInfo.value);
                }
            });

            appSceneInstances.scene.addEventListener('clickDetail', obj => {
                console.log('点击空间或控制模块----obj: ', obj);
                clickSpace(obj.data);
            });
            try {
                await appSceneInstances.scene.initLoader();
            } catch (e) {
                console.log('e: ', e);
            }
            loadings.initLoading.value = false;
        }
    };

    // TODO #创建飞线线
    const createLine = async data => {
        const sceneApp = appSceneInstances.scene;
        // 重复点击同一个空间
        if (sceneApp?.activeLineData?.targetData?.id === data.id) return;
        sceneApp.clearAllLine();
        const params = {
            instanceId: data.id,
            instanceType: 'SPACE',
            demandTemplateType: templateType.value
        };
        let response = await getLineOfFlight(params);
        if (response.code === '00000') {
            let relationList = response.data || [];
            if (showSpaceInfo.value) {
                sceneApp.activeLineData = {
                    targetData: data,
                    relationData: relationList
                };
                sceneApp.activeLineList = [];
                relationList.forEach(res => {
                    sceneApp._createAdvanceLinkLine(data, res);
                });
                sceneApp.updateSpaceOrLineStatus(curFloorId.value);
            }
        }
    };

    const createElements = async data => {
        try {
            await appSceneInstances.scene.createElements(data);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const goBackBuildingView = () => {
        console.log('back------goBackBuildingView: ', viewFieldStack.value);
    };
    const nameAfterBack = computed(() => {
        return '';
    });

    const mapSwitchMode = async (m, floorId) => {
        await appSceneInstances.scene.switchModeView(m, floorId);
    };

    const onClickMoreInfo = obj => {
        // console.log('obj: ', obj);
        clickSpace(obj);
    };

    const clickMapObj = obj => {
        // 点击的非本楼层对象
        if (curFloorId.value && curFloorId.value !== obj.floorId) {
            curFloorId.value = obj.floorId;
            nextTick(() => {
                appSceneInstances.scene?.selectSpaceModelByObj(obj);
            });
            $Message.Default({ title: i18n.global.t('meos_control_web.change_floor_num', { floor: obj.floorLocalName }) });
            return;
        }
        appSceneInstances.scene?.selectSpaceModelByObj(obj);
    };

    const laodOtherSpaces = async floorId => {
        cancelOtherSpacesLoad?.abort();
        cancelOtherSpacesLoad = new AbortController();
        const params = { projectId: base.projectId, templateCode: MODEL_VIEW, runningMonitorType: 'COMMON', runningMonitorSecondType: 'FIXED_OBJECT', objectIds: [floorId] };
        const res = await listInfoCodeConfigsByObjectCommon(params, cancelOtherSpacesLoad.signal);

        if (res?.code === SUCCESSCODE && res.data?.length > 0) {
            const floorObj = res.data[0];
            const spaces = floorObj.relInfoCodeGroupConfigs?.find(obj => obj.groupCode === 'relation')?.relInfoCodeConfigs?.find(obj => obj.infoCode === 'spaceInFloor')?.dataValue;
            if (spaces?.length > 0) {
                spaces.forEach(obj => {
                    obj.floorId = floorObj.id;
                });
            }
            // console.log('spaces: ', spaces);
            return spaces;
        }
    };

    const unwatcher0 = watch(curFloorId, async newFloorId => {
        showSpaceInfo.value = false;
        showModuleInfo.value = false;

        if (newFloorId) {
            if (curFloorId.value) {
                const floorInfo = getFloorInfoByFloorId(curFloorId.value, false);
                // console.log('floorInfo: ', floorInfo);

                if (floorInfo) {
                    curFloorName.value = floorInfo.localId;
                } else {
                    curFloorName.value = '';
                }

                const buildingInfo = getBuildingInfoByFloorId(curFloorId.value, false);
                if (buildingInfo) {
                    curBuildingName.value = buildingInfo?.localName ?? '--';
                } else {
                    curBuildingName.value = '';
                }
            }
        } else {
            curFloorName.value = '';
        }

        appSceneInstances.scene?.updateSpaceOrLineStatus(curFloorId.value);
        appSceneInstances.scene?.switchModeView(newFloorId ? 2 : 1, newFloorId);
        appSceneInstances.scene?.updateSpaceStatus();
        cancelOtherSpacesLoad?.abort();
        if (newFloorId) {
            const spaces = await laodOtherSpaces(newFloorId);

            appSceneInstances.scene?.createOtherSpaces(spaces);
        }
        appSceneInstances.scene?.updateOtherSpacesShow();
    });

    const unwatcher1 = watch([() => currentTabs?.value, currentIntervenedValue, currentLampFuncTypes, currentAbnormalValue], ([newCurTab], [oldCurTab]) => {
        // console.log('newCurTab: ', newCurTab, currentLampFuncTypes.value);
        appSceneInstances.scene?.updateShowSpaces();
        appSceneInstances.scene?.updateSpaceStatus();
    });

    const unwatcher2 = watch(
        () => currentTabs?.value,
        v => {
            showSpaceInfo.value = false;
            showModuleInfo.value = false;
        }
    );

    const unwatcher3 = watch(showSpaceInfo, newVal => {
        if (!newVal) {
            appSceneInstances.scene.unSelectSpace();
            appSceneInstances.scene.clearAllLine();
        }
    });
    const unwatcher4 = watch(showModuleInfo, newVal => {
        if (!newVal) {
            appSceneInstances.scene.unselectModel();
            appSceneInstances.scene.clearAllLine();
        }
    });

    const unwatcher5 = watch(currentSpaceData, newVal => {
        // console.log('空间数据;;;;;', newVal);
        floorList.value = [];
        rebuildElements();
    });
    const unwatcher6 = watch(loadingSpaceData, newVal => {
        if (newVal) {
            floorList.value = [];
        }
    });

    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
            appSceneInstances.scene.removeEventListener('clickFloor');
            appSceneInstances.scene.removeEventListener('clickDetail');
            appSceneInstances.scene.removeEventListener('onHoverSpaceCard');
            appSceneInstances.scene.removeEventListener('onUnHoverSpace');
            appSceneInstances.scene.removeEventListener('clickModuleCount');
            // appSceneInstances.scene.removeEventListener('onMouseControl');
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
            console.log('initPromis: ');
            mapSwitchMode(1);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const rebuildElements = async () => {
        await initPromis;
        await buildingInfoPromise;
        const floorRecord = {};
        const floors = [];
        floorList.value = [];
        const spaces = [];
        currentSpaceData.value?.forEach(space => {
            const rawSpace = toRaw(space);
            if (!floorRecord[rawSpace.floorId]) {
                const floorInfo = getFloorInfoByFloorId(rawSpace.floorId);
                floorRecord[rawSpace.floorId] = floorInfo;

                floors.push({
                    id: rawSpace.floorId,
                    localId: floorInfo?.localId
                });
                floorList.value.push(space.floorId);
            }
            spaces.push(rawSpace);
        });
        await createElements({ spaces, floors });
        appSceneInstances.scene?.updateSpaceStatus();
        appSceneInstances.scene?.updateShowSpaces();
    };
    const dealEvent = res => {
        if (res?.data?.length > 0) {
            const spaceIdMap = {};
            res.data.forEach(obj => {
                if (obj.tag) {
                    spaceIdMap[obj.spaceId] = obj.tag;
                }
            });
            appSceneInstances.scene?.updateSpaceData(spaceIdMap);
            appSceneInstances.scene?.updateSpaceStatus();
        }
    };
    onMounted(() => {
        mapSSEClient?.addEventListener(LIGHT_SPACE_STATUS, dealEvent);
        console.log(mapSSEClient);
        initCreateAndView();
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
    });
    onBeforeUnmount(() => {
        showSpaceInfo.value = false;
        showModuleInfo.value = false;
        resizeOb?.unobserve(graphWarp.value);
        resizeOb = null;
        sceneDestroy();
        mapSSEClient?.removeEventListener(LIGHT_SPACE_STATUS, dealEvent);
        curFloorId.value = '';
        unwatcher0();
        unwatcher1();
        unwatcher2();
        unwatcher3();
        unwatcher4();
        unwatcher5();
        unwatcher6();
    });

    provide('currentTabs', currentTabs); // 当前选中tab
    provide('currentLampFuncTypes', currentLampFuncTypes); // 当前灯具类型编码
    provide('currentAbnormalValue', currentAbnormalValue); // 当前选中的异常状态
    provide('currentIntervenedValue', currentIntervenedValue); // 当前选中的干预类型
    provide('currentSpaceData', currentSpaceData);
    // XXX 楼层名字
    provide('curFloorName', curFloorName);

    return {
        initScene,
        appSceneInstances,
        goDefault,
        windowResize,
        createElements,
        mapLoading,
        mapSwitchMode,
        goBackBuildingView,
        onClickMoreInfo,
        viewFieldStack,
        nameAfterBack,
        curBackgroundColor,
        buildFloors,
        curFloorId,
        curEnterSpace,
        equipTipsRef,
        floorList,
        iotReqEquipIds,
        popupQueryData,
        popPosition,
        curFloorName,
        curHoverSpaceObj,
        spaceCardPos,
        goBackBuilding,
        clickMapObj
    };
};
