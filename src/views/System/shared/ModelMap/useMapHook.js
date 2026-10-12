// @ts-ignore
import i18n from '@/localization';
import useStore from '@/store';
import { Environment } from '@/config';
import { Application } from '@yushu/core3d';
import { debounce } from 'lodash';
import { getPipesLegendsFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import { isPipe, isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import { getListEquipmentsInBySpaceIds } from '@/apis/public';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import useEffectWarp from '@/hooks/useEffectWarp';
import DockSingleton from '@/hooks/responsiveDock';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';

// 业务数据依赖
import SpaceMapScene from './SpaceMapScene';
import { VIEWMODE } from '@/views/System/constant/variables';
import { mapSpaceListKey, currentMapSpaceObjKey, viewModeKey, systemIdKey, curMapEquipIdsKey, curMapClassCodeMapIdsKey } from '@/views/System/hooks/useStateHook';
import { openEquipmentInfoKey, closeEquipmentInfoKey, showEquipmentInfoKey } from '@/views/System/hooks/useLeftHook';

const additionalClassCodes = [
    'SPVSCM',
    'WESSTP',
    'WESSWV',
    'WESSCT',
    'WESSFL',
    'WESSFD',
    'WESSTH',
    'WESSCP',
    'WESSCO',
    'WESSTO',
    'WESSPE',
    'WESSIL',
    'WESSCB',
    'WESSWL',
    'CFCSDR',
    'CFCSFR',
    'CFCSED'
];

export default RUNNING_MONITOR_TYPE => {
    const { base } = useStore();

    const currentMapSpaceObj = inject(currentMapSpaceObjKey);
    const curMapEquipIds = inject(curMapEquipIdsKey);
    const curMapClassCodeMapIds = inject(curMapClassCodeMapIdsKey);
    const systemId = inject(systemIdKey);
    const openEquipmentInfo = inject(openEquipmentInfoKey);
    const closeEquipmentInfo = inject(closeEquipmentInfoKey);
    const showModuleInfo = inject(showEquipmentInfoKey);
    const mapSpaceList = inject(mapSpaceListKey);

    const equipsWidthMeshList = ref([]); //空间中有网格的设备ids列表
    const viewMode = inject(viewModeKey);

    const allEquips = ref(); // 接口返回的静态数据

    const allMapData = ref({});

    const pipeLegends = ref([]); // 管道图例动态数据

    // 当前图背景色
    const curBackgroundColor = ref('');

    const appSceneInstances = {};
    let resizeOb = null,
        refreshIds = new Set(),
        initPromise = null,
        buildingFloorPromise = null;
    const loadings = {
        floorLoading: ref(false),
        objectsLoading: ref(false),

        initLoading: ref(false),
        resourceLoading: ref(false)
    };

    const graphWarp = ref(null);
    const curHoverObj = ref(null);
    const hoverCardPosition = ref({});
    const popPosition = ref({ left: 0, top: 0 });
    const popupQueryData = ref(null);

    const mapLoading = computed(() => loadings.initLoading.value || loadings.resourceLoading.value || loadings.objectsLoading.value || loadings.floorLoading.value);

    const hasSpace = computed(() => mapSpaceList?.value?.length > 0);
    const queryUseCancelToken = UseCancelTokenHooks();
    // 获取并存储建筑楼层数据
    const getStoreTreeBuildingFloor = async () => {
        // 获取建筑信息

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
    buildingFloorPromise = getStoreTreeBuildingFloor();

    const { getObjectAbnormalStatus } = DockSingleton.getInstance();

    const { createEffect, destoryEffect } = useEffectWarp();

    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const windowResize = debounce(() => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    }, 10);

    const clickSpaceOrEquip = obj => {
        if (obj) {
            const data = { ...obj, floorLocalName: currFloorInfo.value?.localName ?? '--' };
            openEquipmentInfo(data);
        }
    };
    const currFloorInfo = computed(() => {
        const floorInfo = getFloorInfoByFloorId(currentMapSpaceObj.value?.floorId) || {};
        return { ...toRaw(floorInfo) };
    });

    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            if (appSceneInstances.scene) {
                appSceneInstances.scene?.dispose();
            }
            if (appSceneInstances.app) {
                appSceneInstances.app.dispose();
            }
            appSceneInstances.scene = new SpaceMapScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                curBackgroundColorRef: curBackgroundColor,
                equipsWidthMeshListRef: equipsWidthMeshList,
                loadings
            });
            appSceneInstances.app = new Application({ dom: graphWarp.value, webGLScene: appSceneInstances.scene });
            loadings.initLoading.value = true;

            appSceneInstances.scene.addEventListener('onHoverCard', obj => {
                _handleHoverModal(obj.data);

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
            appSceneInstances.scene.addEventListener('onUnHover', () => {
                _handleUnHoverModal();
            });
            appSceneInstances.scene.addEventListener('clickDetail', obj => {
                clickSpaceOrEquip(obj.data);
            });
            try {
                await appSceneInstances.scene.initLoader();
                return Promise.resolve();
            } catch (e) {
                console.log('e: ', e);
                return Promise.reject();
            } finally {
                loadings.initLoading.value = false;
            }
        }
    };

    const _handleHoverModal = targetModelInfo => {
        if (!targetModelInfo) return;

        const { pos: bimPos, instance: equipData = {} } = targetModelInfo;
        if (!bimPos) return;
        const { x, y, left, top } = bimPos;
        popPosition.value = { left: left || x, top: (top || y) - 10 };
        const tipData = {
            ...equipData,
            classCode: equipData.objType === OBJ_TYPE.EQUIPMENT ? equipData.classCode : '',
            oriClassCode: equipData.classCode
        };
        popupQueryData.value = tipData;
    };

    const _handleUnHoverModal = () => {
        popupQueryData.value = null;
    };

    const createElements = async data => {
        const startSpaceId = currentMapSpaceObj?.value?.id;
        try {
            loadings.resourceLoading.value = true;
            await appSceneInstances.scene?.createElements(data);
        } catch (e) {
            console.log('e: ', e);
            loadings.resourceLoading.value = false;
        } finally {
            if (currentMapSpaceObj?.value?.id === startSpaceId) {
                loadings.resourceLoading.value = false;
            }
        }
    };

    const onClickMoreInfo = dataObject => {
        if (dataObject) {
            clickSpaceOrEquip({ ...dataObject, classCode: dataObject.oriClassCode || dataObject.classCode });
        }
    };

    const queryAllEquipsInSpace = async () => {
        if (!currentMapSpaceObj?.value?.id) {
            return;
        }
        queryUseCancelToken.cancelQuest();
        const params = {
            runningMonitorSecondType: RUNNING_MONITOR_TYPE,
            spaceId: currentMapSpaceObj?.value?.id,
            filterInSystemIds: [systemId.value],
            additionalQueryParam: {
                spaceId: currentMapSpaceObj?.value?.id,
                filterClassCodes: additionalClassCodes
            }
        };
        try {
            const { code, data } = await getListEquipmentsInBySpaceIds(params, { cancelToken: queryUseCancelToken.cancelToken() });
            if (code === SUCCESSCODE) {
                return data;
            }
        } catch (e) {
            console.log('queryAllEquipsInSpace-e: ', e);
        }
    };

    const bindEquipsEffects = equipIds => {
        destoryEffect();
        createEffect(() => {
            equipIds?.forEach(equipId => {
                watchEffect(() => {
                    const statusList = [];
                    const abnormal = getObjectAbnormalStatus([equipId]);

                    statusList.push({ name: 'abnormal', value: abnormal });

                    // 空间气泡数据变化
                    appSceneInstances.scene?.updateOneEquipStatus(equipId, statusList);
                    appSceneInstances.scene?.debounceInvokeCollision();
                });
            });
        });
    };

    const makeObjects = arr => {
        const equips = [],
            pipes = [],
            legends = [],
            pipesLegendColorMap = {},
            classCodeMapIds = {};
        const idRecord = {};
        arr?.forEach(obj => {
            if (!obj) {
                return;
            }
            const { id, classCode } = obj;
            if (!idRecord[id]) {
                idRecord[id] = true;
                if (isPipe(classCode)) {
                    pipes.push(obj);

                    const { isPipeClassCode, legendItem } = getPipesLegendsFromClassCode(classCode);
                    if (isPipeClassCode) {
                        const { color, name } = legendItem;
                        const itemName = name ?? i18n.global.t('meos_control_web.others_dup');
                        if (!pipesLegendColorMap[classCode]) {
                            pipesLegendColorMap[classCode] = true;
                            legends.push({
                                name: itemName,
                                id: classCode,
                                color
                            });
                        }
                    }
                } else if (!isMachineRoomCF(classCode)) {
                    if (!classCodeMapIds[classCode]) {
                        classCodeMapIds[classCode] = [];
                    }
                    classCodeMapIds[classCode].push(id);
                    equips.push(obj);
                }
            }
        });
        return { equips, pipes, legends, classCodeMapIds };
    };

    const loadAllModelData = async spaceData => {
        const floorInfoCache = {};
        const finalRes = {
            spaces: [spaceData],
            floorInfo: toRaw(currFloorInfo.value)
        };
        try {
            const allObjects = await queryAllEquipsInSpace();
            await buildingFloorPromise;
            const { equips, pipes, legends, classCodeMapIds } = makeObjects(allObjects);
            pipeLegends.value = legends;

            equips?.forEach(item => {
                try {
                    additionalFloorInfo(item, floorInfoCache);
                } catch (error) {
                    console.error('error: ', error);
                }
            });
            allEquips.value = equips;

            finalRes.classCodeMapIds = classCodeMapIds;
            finalRes.equips = equips;
            finalRes.pipes = pipes;
            finalRes.legends = legends;
        } catch (e) {
            console.log('e: ', e);
        }
        allMapData.value = finalRes;

        return Promise.resolve(finalRes);
    };

    const loadAndCreateView = async () => {
        const newSpace = toRaw(currentMapSpaceObj?.value) || {};

        const finalSpace = { ...newSpace };
        const spaceId = finalSpace?.id;
        if (!spaceId) {
            return;
        }

        console.log('loadAndCreateView: ', loadings);
        try {
            loadings.objectsLoading.value = true;
            appSceneInstances.scene?.removeAllDynamicObjects();
            const results = await Promise.allSettled([initPromise, loadAllModelData(finalSpace)]);
            const isAllCompleted = results.every(result => result.status === 'fulfilled' || result.status === 'rejected');
            if (isAllCompleted) {
                await createElements(allMapData.value);
                const equipIds = allMapData.value?.equips?.map(obj => obj.id);
                curMapEquipIds.value = equipIds;
                curMapClassCodeMapIds.value = allMapData.value?.classCodeMapIds;
                bindEquipsEffects(equipIds);
            } else {
                curMapEquipIds.value = [];
                curMapClassCodeMapIds.value = null;
                console.error('部分异步任务未完成');
            }
        } catch (e) {
            curMapEquipIds.value = [];
            curMapClassCodeMapIds.value = null;
            console.log('e: ', e);
        } finally {
            loadings.objectsLoading.value = false;
        }
    };
    watch(
        () => showModuleInfo?.value,
        newVal => {
            if (!newVal) {
                appSceneInstances.scene?.unSelectModel();
            }
        }
    );

    onMounted(() => {
        initPromise = initScene();
        resizeOb = new ResizeObserver(entries => {
            const entry = entries[0];
            const { width, height } = entry.contentRect;
            if (width && height) {
                windowResize(appSceneInstances);
            } else {
                windowResize(appSceneInstances);
            }
        });
        nextTick(() => {
            resizeOb.observe(graphWarp.value);
        });
        watch(
            () => currentMapSpaceObj?.value,
            async () => {
                if (currentMapSpaceObj.value?.id) {
                    closeEquipmentInfo?.();
                    await loadAndCreateView();
                }
            },
            {
                immediate: true
            }
        );
        watch(
            () => viewMode?.value,
            async () => {
                appSceneInstances.scene?.pauseRender(viewMode?.value === VIEWMODE.GRAPHCODE);
            },
            {
                immediate: true
            }
        );
    });

    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
    });

    onUnmounted(() => {
        refreshIds.clear();
        refreshIds = null;
    });

    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
            appSceneInstances.scene.removeEventListener('clickDetail');
            appSceneInstances.scene.removeEventListener('onHoverEquip');
            appSceneInstances.scene.removeEventListener('onUnHover');
            appSceneInstances.scene.dispose();
            delete appSceneInstances.scene;
        }
        if (appSceneInstances.app) {
            appSceneInstances.app.dispose();
            delete appSceneInstances.app;
        }
    };

    const clickMapObj = obj => {
        appSceneInstances.scene?.clickMapObj(obj);
    };
    const hoverMapObj = obj => {
        appSceneInstances.scene?.hoverMapObj(obj);
    };
    const unhoverMapObj = () => {
        appSceneInstances.scene?.unhoverMapObj();
    };

    const togglePipeShow = classCodes => {
        appSceneInstances.scene?.togglePipeShow(classCodes);
    };

    return {
        hasSpace,
        goDefault,
        graphWarp,
        togglePipeShow,
        mapLoading,
        onClickMoreInfo,
        curHoverObj,
        popupQueryData,
        hoverCardPosition,
        popPosition,
        windowResize,
        pipeLegends,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj
    };
};
