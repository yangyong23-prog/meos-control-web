// @ts-ignore
import i18n from '@/localization';
import useStore from '@/store';
import { Environment } from '@/config';
import DataCenterScene from './DataCenterScene';
import { Application } from '@yushu/core3d';
import { getPipesLegendsFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import dataDockHandling from '@/hooks/dataDockHandling';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { useRoute } from 'vue-router';
import { throttle, debounce } from 'lodash';
import { convertEquipsToTree } from '../utils';
import { isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';
import {
    showModuleInfoInjectKey,
    curSpace3DViewDataInjectKey,
    selectModuleInfoInjectKey,
    allEquipsInjectKey,
    allSpaceInfoInjectKey,
    allSpaceInfoWithEquipsLoadingInjectKey,
    space3DViewSSEClientInjectKey,
    allFloorInfoInjectKey,
    switchIotHideInjectKey,
    selEquipIdsInjectKey,
    equipClassOptionInjectKey
} from '../constant/injectKey';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, DANGER_EVENT, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, DANGER_EVENT_MONITORING_SITUATION } from '@/utils/SSEEventTypes';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import useEffectWarp from '@/hooks/useEffectWarp';
import DockSingleton from '@/hooks/responsiveDock';
import { MODEL_VIEW, OBJ_TYPE } from '@/utils/globalVariables';

export default () => {
    const { base } = useStore();

    const { query } = useRoute();

    const { curFloorId } = query || {};

    const sseClient = inject(space3DViewSSEClientInjectKey);

    const floorsInfoData = inject(allFloorInfoInjectKey);
    const curSpace3DViewData = inject(curSpace3DViewDataInjectKey); // 被选中的空间对象
    const showModuleInfo = inject(showModuleInfoInjectKey);
    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const switchIotHide = inject(switchIotHideInjectKey);
    const selEquipIds = inject(selEquipIdsInjectKey);
    const equipClassOption = inject(equipClassOptionInjectKey);

    const equipsWidthMeshList = ref([]); //空间中有网格的设备ids列表

    const allEquips = inject(allEquipsInjectKey); // 接口返回的静态数据
    const allSpaceInfo = inject(allSpaceInfoInjectKey);
    const allSpaceInfoWithEquipsLoading = inject(allSpaceInfoWithEquipsLoadingInjectKey);
    const listInfoCodeOrigin = ref([]); //接口返回的动态数据
    const allMapData = ref({});

    const pipeLegends = ref([]); // 管道图例动态数据

    // 当前图背景色
    const curBackgroundColor = ref('');

    const { createEffect, destoryEffect } = useEffectWarp();
    const { getObjectDanegerStatus } = DockSingleton.getInstance();
    const appSceneInstances = {};
    let resizeOb = null,
        refreshIds = new Set(),
        initScenePromise = null;
    const loadings = {
        buildLoading: ref(true),
        floorLoading: ref(true),
        objectsLoading: ref(true),

        initLoading: ref(true),
        resourceLoading: ref(true)
    };

    const graphWarp = ref(null);
    const curHoverObj = ref(null);
    const hoverCardPosition = ref({});
    const popPosition = ref({ left: 0, top: 0 });
    const popupQueryData = ref(null);

    const mapLoading = computed(() => loadings.initLoading.value || loadings.resourceLoading.value);

    const writeIotInfos = data => {
        if (!data._infoMap) {
            data._infoMap = {};
            data._infoMapOrigin = {};
        }
        const { relInfoCodeGroupConfigs } = data;
        relInfoCodeGroupConfigs?.forEach(config => {
            const { relInfoCodeConfigs, groupCode } = config;
            relInfoCodeConfigs?.forEach(info => {
                const { infoCode } = info;
                info.groupCode = groupCode;
                data._infoMapOrigin[infoCode] = info;
                data._infoMap[infoCode] = structuredClone(info);
            });
        });
    };

    // 动态数据
    const { loadDynaDataWithIotHandling } = dataDockHandling();

    const eventType = [CLOUD_IOT_DATA_CHANGE, DANGER_EVENT, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, ABNORMAL_EVENT, DANGER_EVENT_MONITORING_SITUATION];

    const throttleRefreshCallback = throttle(() => appSceneInstances.scene?.sseRefreshSingleIotInfo([...refreshIds]), 500);

    const refreshCallback = updateData => {
        const { objectId } = updateData;
        refreshIds.add(objectId);
        throttleRefreshCallback();
    };
    useResponsiveDockSSEHandle(sseClient, [...eventType], refreshCallback);

    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const windowResize = () => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const clickSpaceOrEquip = obj => {
        if (obj) {
            selectModuleInfo.value = { ...obj, floorLocalName: floorsInfoData?.value?.[0]?.localName ?? '--' };
            showModuleInfo.value = true;
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
            appSceneInstances.scene = new DataCenterScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                curBackgroundColorRef: curBackgroundColor,
                equipsWidthMeshListRef: equipsWidthMeshList,
                switchIotHideRef: switchIotHide,
                selEquipIdsRef: selEquipIds,
                loadings,
                floorInfoData: floorsInfoData.value?.[0] || {}
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
        try {
            loadings.resourceLoading.value = true;
            await appSceneInstances.scene.createElements(data);
        } catch (e) {
            console.log('e: ', e);
        } finally {
            loadings.resourceLoading.value = false;
        }
    };

    const onClickMoreInfo = dataObject => {
        if (dataObject) {
            clickSpaceOrEquip({ ...dataObject, classCode: dataObject.oriClassCode || dataObject.classCode });
        }
    };

    const loadAllModelData = async spaceData => {
        let equipsArr = [],
            pipesArr = [],
            equipIds = new Set();
        const pipesLegendColorMap = {};
        const floorInfoCache = {};
        // 每个设备共享的 _infoMap 引用：IOT 数据回来时原地填充，设备创建时读到最新配置（双层保险）
        const equipInfoMapRefs = {};
        if (Array.isArray(allEquips.value)) {
            allEquips.value.forEach(item => {
                try {
                    additionalFloorInfo(item, floorInfoCache);
                    const { classCode, className } = item;
                    const { isPipeClassCode, legendItem } = getPipesLegendsFromClassCode(classCode);
                    if (isPipeClassCode) {
                        pipesArr.push(item);
                        const { color, name } = legendItem;
                        const itemName = className || name;
                        if (!pipesLegendColorMap[classCode]) {
                            pipesLegendColorMap[classCode] = {
                                name: itemName,
                                id: classCode,
                                color
                            };
                        }
                    } else {
                        equipsArr.push(item);
                        equipIds.add(item.id);
                        equipInfoMapRefs[item.id] = {};
                    }
                } catch (error) {
                    console.error('error: ', error);
                }
            });
            pipeLegends.value = Object.values(pipesLegendColorMap);
        }

        const floorInfo = floorsInfoData.value?.[0] || {};

        const finalRes = {
            equips: equipsArr.map(v => {
                return { ...v, _infoMap: equipInfoMapRefs[v.id] };
            }),
            pipes: pipesArr,
            spaces: [spaceData],
            floors: [{ id: spaceData.floorId, floorName: floorInfo?.localName ?? '--' }]
        };
        equipClassOption.value = convertEquipsToTree(finalRes.equips.filter(obj => !isMachineRoomCF(obj?.classCode)));
        allMapData.value = finalRes;

        // 设备 IOT 数据 fire-and-forget：不阻塞 3D 元素创建
        if ([...equipIds].length) {
            loadings.objectsLoading.value = true;
            loadDynaDataWithIotHandling(
                {
                    projectId: base.projectId,
                    runningMonitorType: 'COMPUTER_ROOM_SECURITY',
                    templateCode: MODEL_VIEW,
                    objectIds: [...equipIds]
                },
                listInfoCodeConfigsByObjectIdCommon
            )
                .then(dynamicRes => {
                    if (dynamicRes?.code === '00000') {
                        const resData = dynamicRes?.data || [];
                        resData.forEach(obj => {
                            writeIotInfos(obj);
                            // 原地填充共享引用，保证设备创建时能读到最新 IOT 配置
                            // 注意：变量不能命名为 ref，会遮蔽 auto-import 的 ref 注入
                            const infoMapRef = equipInfoMapRefs[obj.id];
                            if (infoMapRef && obj._infoMap) {
                                Object.assign(infoMapRef, obj._infoMap);
                            }
                        });
                        listInfoCodeOrigin.value = resData;
                        // 双层保险：若设备模型已创建，刷新 IOT 图标（全局池已有数据）
                        appSceneInstances.scene?.sseRefreshSingleIotInfo([...equipIds]);
                    }
                    return dynamicRes;
                })
                .finally(() => {
                    loadings.objectsLoading.value = false;
                });
        }

        return Promise.resolve(finalRes);
    };

    const computedSpaceId = computed(() => {
        const newSpace = curSpace3DViewData?.value || {};
        const spaceInfo = allSpaceInfo?.value || {};
        const finalSpace = { ...newSpace, ...spaceInfo };
        return finalSpace?.id;
    });

    const initCreateAndView = async () => {
        const newSpace = curSpace3DViewData?.value || {};
        const isSpaceAndEquipLoading = allSpaceInfoWithEquipsLoading?.value;
        const spaceInfo = allSpaceInfo?.value || {};
        const finalSpace = { ...newSpace, ...spaceInfo };
        const spaceId = finalSpace?.id;
        if (!spaceId || isSpaceAndEquipLoading) {
            return;
        }

        try {
            // 场景已在 mount 提前初始化，这里等待它完成；未提前则此处兜底初始化
            await (initScenePromise || initScene());
            // 数据就绪后补齐 scene 楼层信息（提前初始化时可能为空）
            if (appSceneInstances.scene && floorsInfoData.value?.[0]) {
                appSceneInstances.scene.floorInfoData = floorsInfoData.value[0];
            }
            console.time('loadAllModelData: ');
            await loadAllModelData(finalSpace);
            console.timeEnd('loadAllModelData: ');

            console.time('createElements: ');
            await createElements(allMapData.value);
            console.timeEnd('createElements: ');
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const bindLineEffect = () => {
        destoryEffect();
        createEffect(() => {
            allMapData.value.equips?.forEach(obj => {
                watchEffect(() => {
                    const status = getObjectDanegerStatus(obj.id);
                    if (status) {
                        throttleRefreshCallback();
                        appSceneInstances.scene?.updateSingleEquipStatus(obj.id);
                    }
                });
            });
        });
    };

    onMounted(() => {
        // 提前初始化 3D 场景（与 Phase 1 数据请求并行），记录 promise 供 createElements 前 await
        try {
            initScenePromise = initScene();
        } catch (e) {
            console.log('e: ', e);
        }
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
    });

    watch(
        () => allSpaceInfoWithEquipsLoading?.value,
        async curLoading => {
            if (!curLoading) {
                await initCreateAndView();
                bindLineEffect();
            }
        },
        {
            immediate: true
        }
    );

    watch(
        () => showModuleInfo?.value,
        newVal => {
            if (!newVal) {
                appSceneInstances.scene?.unSelectModel();
            }
        }
    );

    const debounceUpdateEquipsShow = debounce(() => {
        appSceneInstances.scene?._updateEquipShow();
    }, 20);
    watch([switchIotHide, selEquipIds], () => {
        debounceUpdateEquipsShow();
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

    const switchAngle = angle => {
        appSceneInstances.scene.switchAngle(computedSpaceId.value, angle);
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
        switchAngle,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj
    };
};
