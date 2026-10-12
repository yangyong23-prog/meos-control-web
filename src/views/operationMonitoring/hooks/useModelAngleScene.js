import i18n from '@/localization';
import { onUnmounted, ref, computed, inject, watch } from 'vue';
import { GRAPH_TYPE_DICT, PERSPECTIVE_DICT } from '@/views/operationMonitoring/constants';
import { Application } from '@yushu/core3d';
import ModelAngleScene from '@/views/operationMonitoring/operationMonitoringMain/ModelAngleScene/ModelAngleScene';
import { Environment } from '@/config';
import useStore from '@/store';
import xplantindoorenvStore from '@/store/xplantindoorenv';

import { getFloorInfoByFloorId } from '@/utils/buildingUtils';

import useEffectWarp from '@/hooks/useEffectWarp';
import { watchEffect } from 'vue';
import DockSingleton from '@/hooks/responsiveDock';

export default graphWarp => {
    const { base } = useStore();
    const { createEffect, destoryEffect } = useEffectWarp();
    const { getIotData } = DockSingleton.getInstance();

    const curGraphType = inject('curGraphType');
    const modelCurFloorId = inject('modelCurFloorId');
    const currentBuildingObj = inject('currentBuildingObj');
    const mapMode = inject('mapMode');
    const equipsWidthMeshList = inject('equipsWidthMeshList') || ref([]);
    const modelDefatlGraph = inject('modelDefatlGraph');

    const selectedSystemObj = inject('selectedSystemObj');

    const modelInstanceData = inject('modelInstanceData');
    const abnormalEventList = inject('abnormalEventList');

    const floorList = ref([]); // 楼层列表
    const equipTipsRef = ref(); //
    const popPosition = ref({ left: 0, top: 0 }); //
    const popupQueryData = ref(null); //
    const iotReqEquipIds = ref([]); // iot socket 轮询请求参数之一

    const showEquipmentFun = inject('showEquipmentFun');
    const closeEquipmentiInfo = inject('closeEquipmentiInfo');
    const showEquipmentInfo = inject('showEquipmentInfo');
    const equipDetailLoading = inject('equipDetailLoading');
    const perspectiveType = inject('perspectiveType');

    // 初始化楼层选择器列表
    const buildFloors = computed(() => {
        return generateBuildFloors(Array.from(new Set(floorList.value)));
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

    // 当前图背景色
    const curBackgroundColor = ref('');

    const viewFieldStack = ref([]);
    // 当前进入的空间数据
    const curEnterSpace = ref(null);
    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        resourceLoading: ref(false),
        pipeMerging: ref(false),
        floorLoading: ref(false)
    };

    const mapLoading = computed(() => loadings.initLoading.value || loadings.resourceLoading.value || loadings.floorLoading.value);

    // const requestParams = computed(() => {
    //     return {
    //         projectId: base.projectId, // 项目编码
    //         systemId: selectedSystemObj.value.systemId, // 系统ID
    //         systemClassCode: selectedSystemObj.value.graphTypeCode, // 系统类编码
    //         objectIds: iotReqEquipIds.value
    //     };
    // });

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

    const updateAbnormalState = () => {
        if (abnormalEventList.value?.length > 0) {
            const changeStateRecord = {};
            abnormalEventList?.value.forEach(obj => {
                const { instances = [] } = obj;
                instances.forEach(ins => {
                    changeStateRecord[ins.instanceId] = true;
                });
            });
            appSceneInstances.scene?.updateEquipAbnormalState(changeStateRecord);
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
            appSceneInstances.scene = new ModelAngleScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                curBackgroundColorRef: curBackgroundColor,
                equipsWidthMeshListRef: equipsWidthMeshList,
                mapModeRef: mapMode,
                loadings
            });
            appSceneInstances.app = new Application({ dom: graphWarp.value, webGLScene: appSceneInstances.scene });
            loadings.initLoading.value = true;

            appSceneInstances.scene.addEventListener('clickFloor', obj => {
                // console.log('点击楼层标签----obj: ', obj);
                if (modelCurFloorId) {
                    modelCurFloorId.value = obj?.data?.id;
                }
                curGraphType.value = GRAPH_TYPE_DICT.FLOOR_GRAPH;
                viewFieldStack.value.push(curGraphType.value);
            });
            appSceneInstances.scene.addEventListener('enterSpace', obj => {
                curEnterSpace.value = obj?.data;
                curGraphType.value = GRAPH_TYPE_DICT.SPACE_3D_GRAPH;
                if (modelCurFloorId) {
                    modelCurFloorId.value = curEnterSpace.value?.floorId;
                }
                viewFieldStack.value.push(curGraphType.value);
            });
            appSceneInstances.scene.addEventListener('onHoverEquip', obj => {
                // console.log('onHoverEquip设备----obj: ', Date.now());
                _handleHoverModal(obj.data);
            });
            appSceneInstances.scene.addEventListener('onUnEquip', obj => {
                console.log('onUnEquip设备----obj: ', Date.now());
                _handleUnHoverModal();
            });
            // appSceneInstances.scene.addEventListener('onMouseControl', obj => {
            //     if (popupQueryData.value) {
            //         equipTipsRef.value?.hideTipsNow();
            //     }
            // });
            appSceneInstances.scene.addEventListener('clickDetail', obj => {
                // console.log('点击设备----obj: ', obj);
                if (showEquipmentFun) {
                    showEquipmentFun({
                        ...obj.data,
                        systemObjectId: selectedSystemObj.value.systemId, // 系统ID
                        systemClassCode: selectedSystemObj.value.graphTypeCode
                    });
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

    const createElements = async data => {
        try {
            loadings.resourceLoading.value = true;

            await appSceneInstances.scene.createElements(data);
            updateAbnormalState();
        } catch (e) {
            console.log('e: ', e);
        }
        loadings.resourceLoading.value = false;
    };

    const bindEffects = equipIds => {
        destoryEffect();
        createEffect(() => {
            equipIds.forEach(equipId => {
                // runStatus 开启关闭
                watchEffect(() => {
                    const { dataValue } = getIotData(equipId, 'runStatus') || {};

                    if (dataValue === '1') {
                        appSceneInstances.scene.updateOneEquipState(equipId, 'close', false);
                        appSceneInstances.scene.updateOneEquipState(equipId, 'noData', false);
                    } else if (dataValue === '0') {
                        appSceneInstances.scene.updateOneEquipState(equipId, 'close', true);
                        appSceneInstances.scene.updateOneEquipState(equipId, 'noData', false);
                    } else {
                        appSceneInstances.scene.updateOneEquipState(equipId, 'noData', true);
                    }
                });

                // onlineStatus 离线
                watchEffect(() => {
                    const { dataValue } = getIotData(equipId, 'onlineStatus') || {};
                    if (dataValue === '0') {
                        appSceneInstances.scene.updateOneEquipState(equipId, 'offline', true);
                    } else {
                        appSceneInstances.scene.updateOneEquipState(equipId, 'offline', false);
                    }
                });

                // orderFailAlarm 控返不一致
                watchEffect(() => {
                    const { dataValue } = getIotData(equipId, 'orderFailAlarm') || {};
                    if (dataValue === '1') {
                        appSceneInstances.scene.updateOneEquipState(equipId, 'orderFail', true);
                    } else {
                        appSceneInstances.scene.updateOneEquipState(equipId, 'orderFail', false);
                    }
                });
            });
        });
    };

    const goBackView = () => {
        console.log('back------viewFieldStack.value: ', viewFieldStack.value);
        if (viewFieldStack.value.length > 1) {
            //
            viewFieldStack.value.pop();
            // 取最后一个为当前
            curGraphType.value = viewFieldStack.value[viewFieldStack.value.length - 1];
            if (curGraphType.value !== GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
                curEnterSpace.value = null;
            }
            if (curGraphType.value !== GRAPH_TYPE_DICT.FLOOR_GRAPH) {
                modelCurFloorId.value = '';
                currentBuildingObj.value = null;
            }
        }
    };
    const nameAfterBack = computed(() => {
        if (curGraphType.value === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
            return curEnterSpace.value?.localName ?? '--';
        }
        if (curGraphType.value === GRAPH_TYPE_DICT.FLOOR_GRAPH) {
            const floorInfo = getFloorInfoByFloorId(modelCurFloorId?.value);
            return i18n.global.t('meos_control_web.floor_lv', {
                floor: floorInfo?.localName ?? '--'
            });
        }
        return '';
    });

    const mapSwitchMode = async (m, floorId, space) => {
        console.log('---===--mapSwitchMode: ');
        await appSceneInstances.scene.switchModeView(m, floorId, space);
    };

    const _handleHoverModal = targetModelInfo => {
        if (!targetModelInfo) return;
        // console.log('targetModelInfo: ', targetModelInfo);

        const { bimPos, equipData = {} } = targetModelInfo;
        if (!bimPos) return;
        const { x, y } = bimPos;
        popPosition.value = { left: x, top: y };
        const tipData = {
            ...equipData,
            systemObjectId: selectedSystemObj.value.systemId,
            classCode: equipData.classCode || selectedSystemObj.value.classCode,
            graphTypeCode: selectedSystemObj.value.imageOrProductName
        };
        popupQueryData.value = tipData;
    };

    const _handleUnHoverModal = () => {
        popupQueryData.value = null;
    };

    const onClickMoreInfo = dataObject => {
        if ((showEquipmentFun, dataObject)) {
            showEquipmentFun({
                ...dataObject,
                systemObjectId: selectedSystemObj.value.systemId, // 系统ID
                systemClassCode: selectedSystemObj.value.graphTypeCode
            });
            appSceneInstances.scene?.selectModel(dataObject.id);
        }
    };

    const pauseRender = pause => {
        appSceneInstances.scene?.pauseRender(pause);
    };

    watch([() => modelCurFloorId?.value, () => curGraphType?.value, () => curEnterSpace.value], ([newFloorId, newGraphType]) => {
        console.log('newFloorId, newGraphType: ', newFloorId, newGraphType, curEnterSpace.value);
        if (perspectiveType.value === PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE) {
            return;
        }
        if (closeEquipmentiInfo) {
            closeEquipmentiInfo();
        }
        appSceneInstances.scene?.switchModeView(newGraphType, newFloorId, curEnterSpace.value);
    });

    watch(showEquipmentInfo, newVal => {
        if (!equipDetailLoading.value && !newVal) {
            appSceneInstances.scene?.unSelectModel();
        }
    });
    watch(perspectiveType, () => {
        pauseRender(perspectiveType.value === PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE);
    });

    watch(
        () => abnormalEventList?.value,
        () => {
            updateAbnormalState();
        }
    );

    onBeforeUnmount(() => {
        if (closeEquipmentiInfo) {
            closeEquipmentiInfo();
        }
        sceneDestroy();
        modelCurFloorId.value = '';
        window.removeEventListener('resize', windowResize);
    });

    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
            appSceneInstances.scene.removeEventListener('clickFloor');
            appSceneInstances.scene.removeEventListener('clickDetail');
            appSceneInstances.scene.removeEventListener('enterSpace');
            appSceneInstances.scene.removeEventListener('onHoverEquip');
            appSceneInstances.scene.removeEventListener('onUnEquip');
            appSceneInstances.scene.dispose();
            delete appSceneInstances.scene;
        }
        if (appSceneInstances.app) {
            appSceneInstances.app.dispose();
            delete appSceneInstances.app;
        }

        destoryEffect();
    };

    return {
        initScene,
        appSceneInstances,
        goDefault,
        windowResize,
        createElements,
        mapLoading,
        mapSwitchMode,
        goBackView,
        onClickMoreInfo,
        closeEquipmentiInfo,
        modelDefatlGraph,
        viewFieldStack,
        nameAfterBack,
        modelInstanceData,
        curBackgroundColor,
        buildFloors,
        modelCurFloorId,
        currentBuildingObj,
        curGraphType,
        curEnterSpace,
        equipTipsRef,
        floorList,
        bindEffects,
        popupQueryData,
        popPosition,
        pauseRender
    };
};
