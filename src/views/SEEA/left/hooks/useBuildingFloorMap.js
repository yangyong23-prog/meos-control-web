// @ts-ignore
import i18n from '@/localization';
import BuildingMapScene from '../BuildingMapScene';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import { currentFloorObjInjectKey, curModelEquipmentListKey, curBuildingBgColorKey, floorIdMapEquipsKey, viewModeDisabledIdKey, headerModelViewKey } from '../../hooks/useBaseHook';
import useEffectWarp from '@/hooks/useEffectWarp';
import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, selectObjKey } from '../../hooks/useDrawerCommon';
import { VIEW_MODE_3D_GRAPH } from '../../constants/index';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { getFloorInfoByFloorId, getBuildingInfoByFloorId } from '@/utils/buildingUtils';

import { $Message } from 'meri-plus';
import DockSingleton from '@/hooks/responsiveDock';
import { OBJ_TYPE } from '@/utils/globalVariables';
export const curHoverObjKey = Symbol('curHoverObjKey');
export const onClickMoreInfoKey = Symbol('onClickMoreInfoKey');
export const hoverCardPositionKey = Symbol('hoverCardPositionKey');
export const mapLoadingsKey = Symbol('mapLoadingsKey');
export default () => {
    const { base } = useStore();

    const { getObjectAbnormalStatus, getIotData, getAbnormalEventsList } = DockSingleton.getInstance();

    const currentFloorObj = inject(currentFloorObjInjectKey);
    const equips = inject(curModelEquipmentListKey);

    const mapBgColor = inject(curBuildingBgColorKey);

    const selectObj = inject(selectObjKey);
    const openDetailDrawer = inject(openDetailDrawerInjectKey);
    const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
    const floorIdMapEquips = inject(floorIdMapEquipsKey);
    const viewModeDisabledId = inject(viewModeDisabledIdKey);
    const headerModelView = inject(headerModelViewKey);

    const graphWarp = ref(null);

    const curHoverObj = ref();
    const hoverCardPosition = ref();

    const { createEffect, destoryEffect } = useEffectWarp();

    // 楼层id映射空间列表
    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        elementsLoading: ref(false),
        floorLoading: ref(false)
    };

    let initPromis = null,
        resizeOb = null;

    // 业务对象相关的楼层ID
    const relFloorIdList = computed(() => {
        const floorIdSet = new Set();
        equips?.value?.forEach(obj => {
            floorIdSet.add(obj.floorId);
        });
        return [...floorIdSet];
    });
    // 初始化楼层选择器列表
    const buildFloors = computed(() => {
        const _building = generateBuildFloors(Array.from(new Set(relFloorIdList.value)));
        if (_building?.length) {
            _building.forEach(items => {
                items.floorList.forEach(item => {
                    if (floorIdMapEquips?.value) {
                        const equipIds = floorIdMapEquips.value[item.id]?.map(obj => obj.id) || [];

                        item.dot = getAbnormalEventsList(equipIds)?.length > 0;
                    }
                });
            });
        }
        return _building;
    });

    const generateBuildFloors = floorList => {
        if (!floorList?.length) {
            return [];
        }

        let allBuildingData = xplantindoorenvStore().buildingData;
        allBuildingData = allBuildingData
            ?.map(b => {
                const building = { ...b, name: b?.localName };
                building.floorList = b.floors
                    ?.map(f => ({ ...f, name: f?.localName }))
                    ?.filter(f => floorList?.includes(f.id))
                    .sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
                return building;
            })
            .filter(building => building.floorList?.length)
            .sort((a, b) => b.floorSequenceId - a.floorSequenceId);

        return allBuildingData;
    };

    const mapLoading = computed(() => loadings.initLoading.value || loadings.elementsLoading.value || loadings.floorLoading.value);

    // 默认加载位置
    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const windowResize = () => {
        if (appSceneInstances.app) {
            if (graphWarp.value?.clientWidth > 0) {
                appSceneInstances.app.resize();
                appSceneInstances.scene?.resize();
            }
        }
    };

    const pauseRender = pause => {
        appSceneInstances.scene?.pauseRender(pause);
    };

    const clickSpaceOrEquip = obj => {
        // console.log('clickSpaceOrEquip--obj: ', obj);
        openDetailDrawer(obj);
    };

    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            if (appSceneInstances.scene) {
                appSceneInstances.scene?.dispose();
            }
            if (appSceneInstances.app) {
                appSceneInstances.app.dispose();
            }
            appSceneInstances.scene = new BuildingMapScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                loadings,
                bgColor: mapBgColor
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });
            loadings.initLoading.value = true;

            appSceneInstances.scene.addEventListener('onHoverCard', obj => {
                console.log('onHoverEquip空间----obj: ', obj);
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
                // console.log('onUnEquip设备----obj: ', Date.now());
                curHoverObj.value = null;
                if (hoverCardPosition.value) {
                    hoverCardPosition.value = null;
                }
            });

            appSceneInstances.scene.addEventListener('clickDetail', obj => {
                console.log('点击空间或控制模块----obj: ', obj);
                clickSpaceOrEquip(obj.data);
            });
            try {
                await appSceneInstances.scene.initScene();
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

    const onClickMoreInfo = obj => {
        // console.log('onClickMoreInfo--obj: ', obj);
        if (obj) {
            clickSpaceOrEquip({ ...obj, classCode: obj.oriClassCode || obj.classCode });
        }
    };

    watch(
        () => currentFloorObj?.value,
        () => {
            hoverCardPosition.value = null;
            curHoverObj.value = null;
            closeDetailDrawer();
            // 楼层图视角，或关系图视角暂停全楼渲染
            pauseRender(!!currentFloorObj?.id || headerModelView.value !== VIEW_MODE_3D_GRAPH);
        }
    );

    watch(selectObj, newVal => {
        if (!newVal) {
            appSceneInstances.scene?.unselectModel();
        }
    });

    // 切视角关闭详情
    watch(headerModelView, () => {
        // 楼层图视角，或关系图视角暂停全楼渲染
        pauseRender(!!currentFloorObj?.id || headerModelView.value !== VIEW_MODE_3D_GRAPH);
    });

    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
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
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const rebuildElements = async () => {
        loadings.elementsLoading.value = true;
        try {
            await initPromis;

            await createElements({ equips: equips.value });
            bindSpacesEffects();
            appSceneInstances.scene?.updateShowElements();
        } catch (e) {
            console.log('e: ', e);
        }

        loadings.elementsLoading.value = false;
    };

    const clickMapObj = obj => {
        // 点击的非本楼层对象
        if (currentFloorObj.value?.id && currentFloorObj.value?.id !== obj.floorId) {
            const floorInfo = getFloorInfoByFloorId(obj.floorId);
            const buildingInfo = getBuildingInfoByFloorId(obj.floorId);
            if (floorInfo) {
                currentFloorObj.value = { ...floorInfo, buildingLocalName: buildingInfo?.localName ?? '--', buildingId: buildingInfo?.id || '' };
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

    const bindSpacesEffects = () => {
        destoryEffect();
        createEffect(() => {
            equips.value?.forEach(equip => {
                // 设备异常
                watchEffect(() => {
                    const equipId = equip.id;
                    const hasAbnormal = getObjectAbnormalStatus(equipId);

                    appSceneInstances.scene.updateOneModelState(equipId, 'abnormal', hasAbnormal);
                    const infoVal = getIotData(equipId, 'onlineStatus');

                    appSceneInstances.scene.updateOneModelState(equipId, 'online', infoVal?.dataValue === '1');
                    appSceneInstances.scene.updateOneModelState(equipId, 'offline', infoVal?.dataValue === '0');
                });
            });
        });
    };

    watch(mapLoading, () => {
        viewModeDisabledId.value = mapLoading.value ? VIEW_MODE_3D_GRAPH : '';
    });

    onMounted(() => {
        initCreateAndView();
        // 监听模版类型变化
        watch(
            () => equips.value,
            () => {
                if (equips?.value?.length > 0) {
                    rebuildElements();
                } else {
                    appSceneInstances.scene?.removeDyncElements();
                }
                // console.log('loadings:---- ', loadings);
            },
            { immediate: true }
        );
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
        // queryAbnormalDataList();
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        sceneDestroy();
        destoryEffect();
        currentFloorObj.value = null;
    });

    provide(curHoverObjKey, curHoverObj);
    provide(hoverCardPositionKey, hoverCardPosition);
    provide(mapLoadingsKey, loadings);

    return {
        initScene,
        currentFloorObj,
        appSceneInstances,
        graphWarp,
        goDefault,
        windowResize,
        mapLoading,
        onClickMoreInfo,
        buildFloors,
        curHoverObj,
        hoverCardPosition,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender
    };
};
