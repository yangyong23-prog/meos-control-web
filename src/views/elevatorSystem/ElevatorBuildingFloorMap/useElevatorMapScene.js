// @ts-ignore
import i18n from '@/localization';
import ElevatorBuildingFloorScene from './ElevatorBuildingFloorScene';
import { ref, computed, inject, watch } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';

import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { getFloorInfoByFloorId, getFloorInfoListByFloorIdList, getBuildingInfoByFloorId } from '@/utils/buildingUtils';
import { $Message } from 'meri-plus';
import { isStraightLadder, judgeSLadderServeFloor } from '@/views/elevatorSystem/utils';
import { OBJ_TYPE } from '@/utils/globalVariables';

export default () => {
    const { base } = useStore();

    const currentFloorObj = inject('currentFloorObj');

    const selectModuleInfo = inject('selectModuleInfo');
    const showModuleInfo = inject('showModuleInfo');
    const buildingFloorTree = inject('buildingFloorTree');

    const escalatorList = inject('escalatorList');
    const usedFloorIds = inject('usedFloorIds');
    const mapDataInfo = inject('mapDataInfo');
    const mapBusiDataLoading = inject('mapBusiDataLoading');

    const graphWarp = ref('');

    const curHoverObj = ref();
    const hoverCardPosition = ref();
    const hasData = ref(false);

    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        elementsLoading: ref(false),
        floorLoading: ref(false),
        spaceDataLoading: ref(false),
        detailLoading: ref(false)
    };

    let initPromis = null,
        resizeOb = null,
        buildingInfoPromise = null,
        cancelTokenSource,
        spaceIdMap = null;

    // 初始化楼层选择器列表
    const buildFloors = computed(() => {
        const _building = generateBuildFloors(Array.from(new Set(usedFloorIds.value)));
        // console.log('usedFloorIds.value=====: ', usedFloorIds.value);

        // if (!currentFloorObj?.value && _building.length > 1) {
        //     return [{ name: '项目', id: 'project', floorList: [] }, ..._building];
        // }
        // console.log('_building: ', _building);

        return _building;
    });

    const getTreeBuildingFloor = () => {
        // 获取建筑信息

        // eslint-disable-next-line one-var
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

    buildingInfoPromise = getTreeBuildingFloor();

    const generateBuildFloors = floorList => {
        // const result = [];
        // const floorDatas = getFloorInfoListByFloorIdList(floorList);
        // const buildDict = {};

        // floorDatas.forEach(floorData => {
        //     if (buildDict[floorData.buildingId]) {
        //         buildDict[floorData.buildingId].floorList.push(floorData);
        //     } else {
        //         const buildInfo = getBuildingInfoByFloorId(floorData.id);
        //         buildDict[floorData.buildingId] = {
        //             floorList: [floorData],
        //             ...buildInfo
        //         };
        //     }
        // });

        // for (const item in buildDict) {
        //     buildDict[item].floorList = buildDict[item].floorList.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
        //     result.push(buildDict[item]);
        // }

        // return result;
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

    const mapLoading = computed(() => mapBusiDataLoading?.value || loadings.initLoading.value || loadings.floorLoading.value || loadings.elementsLoading.value);

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

    const clickSpaceOrEquip = obj => {
        // showSpaceInfo.value = false;
        showModuleInfo.value = false;
        if (obj) {
            showModuleInfo.value = true;
            let floorLocalName = obj.floorLocalId;
            if (obj.objType === OBJ_TYPE.EQUIPMENT) {
                const floor = getFloorInfoByFloorId(obj.floorId, false);
                floorLocalName = floor?.localId;
            }
            selectModuleInfo.value = {
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
            if (appSceneInstances.scene) {
                appSceneInstances.scene?.dispose();
            }
            if (appSceneInstances.app) {
                appSceneInstances.app.dispose();
            }
            appSceneInstances.scene = new ElevatorBuildingFloorScene({
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
                if (currentFloorObj) {
                    currentFloorObj.value = obj?.data;
                }
            });

            appSceneInstances.scene.addEventListener('onHoverCard', obj => {
                console.log('onHoverEquip空间----obj: ', obj);
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
            appSceneInstances.scene?.updateEquipStatus();
        }
    );

    watch(showModuleInfo, newVal => {
        if (!newVal) {
            appSceneInstances.scene?.unselectModel();
        }
    });

    // 扶梯建筑楼层树处理
    const dealBuildingData = rawData => {
        if (rawData && rawData.length > 0) {
            const _floorIdMap = {};
            escalatorList.value?.forEach(obj => {
                _floorIdMap[obj.floorId] = true;
            });
            let treeData = [];
            if (rawData.length === 1) {
                const { floorList: _floors } = rawData[0];
                const floors = [..._floors];
                floors
                    ?.filter(f => _floorIdMap[f.id])
                    ?.sort((a, b) => a.floorSequenceId - b.floorSequenceId)
                    ?.forEach(res => {
                        const metaItem = { id: res.id, name: res.localName ?? '--', type: 'FLOOR' };

                        treeData.push(metaItem);
                    });
                treeData.unshift({
                    id: 'all',
                    name: i18n.global.t('meos_control_web.all_floors'),
                    type: 'FLOOR'
                });
            } else {
                rawData.forEach(parentRes => {
                    const parent = { id: parentRes.id, name: parentRes.localName ?? '--', children: [], type: 'BUILDING' };
                    const floors = [...parentRes.floorList];

                    floors
                        ?.filter(f => _floorIdMap[f.id])
                        ?.sort((a, b) => a.floorSequenceId - b.floorSequenceId)
                        .forEach(res => {
                            const metaItem = { id: res.id, name: res.localName ?? '--', type: 'FLOOR' };

                            parent.children.push(metaItem);
                        });
                    if (parent.children?.length > 0) {
                        treeData.push(parent);
                    }
                });
                treeData.unshift({
                    id: '1',
                    name: i18n.global.t('meos_control_web.project'),
                    type: 'BUILDING',
                    children: [
                        {
                            id: 'all',
                            name: i18n.global.t('meos_control_web.all_floors'),
                            type: 'FLOOR'
                        }
                    ]
                });
                if (treeData.length === 1) {
                    treeData = treeData[0].children;
                }
            }
            return treeData;
        }
    };

    watch(
        () => buildFloors.value,
        newVal => {
            if (newVal && buildingFloorTree) {
                const buildings = buildFloors.value?.filter(b => {
                    return b.id !== 'project' && !b.disabled;
                });
                buildingFloorTree.value = dealBuildingData(buildings);
            }
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
            mapSwitchMode(1);
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const rebuildElements = async () => {
        await initPromis;
        await buildingInfoPromise;
        loadings.elementsLoading.value = true;

        try {
            watch(
                mapDataInfo,
                (newVal, oldVal) => {
                    if (newVal && !oldVal) {
                        hasData.value = true;

                        const floorDatas = getFloorInfoListByFloorIdList(usedFloorIds.value || []);
                        // console.log('floorDatas: ', floorDatas);
                        const eles = toRaw(newVal) || {};
                        createElements({ ...eles, floors: floorDatas });
                        appSceneInstances.scene?.updateShowElements();
                        appSceneInstances.scene?.updateEquipStatus();
                    }
                },
                { immediate: true }
            );
        } catch (e) {
            console.log('e: ', e);
        }

        loadings.elementsLoading.value = false;
    };

    const updateElementsStates = () => {
        // appSceneInstances.scene?.updateShowElements();
        appSceneInstances.scene?.updateEquipStatus();
    };

    const clickMapObj = obj => {
        // 点击的非本楼层对象
        if (!isStraightLadder(obj?.classCode) && currentFloorObj.value?.id && currentFloorObj.value?.id !== obj.floorId) {
            const floorInfo = getFloorInfoByFloorId(obj.floorId, false);
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
        if (currentFloorObj.value?.id) {
            if (isStraightLadder(obj.classCode)) {
                if (!judgeSLadderServeFloor(obj, currentFloorObj.value?.id)) {
                    return;
                }
            } else if (currentFloorObj.value?.id !== obj.floorId) {
                return;
            }
        }
        appSceneInstances.scene?.hoverMapObj(obj);
    };
    const unhoverMapObj = () => {
        appSceneInstances.scene?.unhoverMapObj();
    };

    onMounted(() => {
        initCreateAndView();
        // 监听模版类型变化
        rebuildElements();
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
        // queryAbnormalDataList();
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
        goDefault,
        windowResize,
        mapLoading,
        mapSwitchMode,
        onClickMoreInfo,
        buildFloors,
        curHoverObj,
        hoverCardPosition,
        hasData,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        updateElementsStates
    };
};
