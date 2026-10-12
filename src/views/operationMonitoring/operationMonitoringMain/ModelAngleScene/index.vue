<template>
    <div class="map-wrap">
        <GoBack v-show="viewFieldStack.length > 1" :is-dark="curGraphType === GRAPH_TYPE_DICT.SPACE_3D_GRAPH" :name="nameAfterBack" @click="goBackView" />

        <div v-show="!mapLoading" key="graphWarp" ref="graphWarp" class="graph-warp" />

        <!-- 楼层切换器 -->
        <FloorSelect
            v-if="(curGraphType === GRAPH_TYPE_DICT.FLOOR_GRAPH && viewFieldStack.length > 1) || curGraphType === GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH"
            v-model:floor-id="modelCurFloorId"
            v-model:expand-building-id="expandBuildingId"
            :building-floors="buildFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :show-project-btn="curGraphType === GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH"
            :project-btn-text="i18n.global.t('meos_control_web.project')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />
        <!--图例-->
        <div class="bottom-wrap">
            <Legend v-if="majorCode === 'SE'" :equipment-data="seLengendData.equipmentData" :switch-data="seLengendData.switchData" :pipeline-data="[]" />
            <Legend v-else :pipeline-data="pipeLegends" />
        </div>

        <DiagramControls :actual-size="false" @reset-view="goDefault" />
        <!-- <div id="maptipsBox" class="tips"></div> -->
        <BuildingFloorMapPopupTips
            :pos="popPosition"
            :query-data="popupQueryData"
            :running-monitor-type="runningMonitorType"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { GRAPH_TYPE_DICT, PERSPECTIVE_DICT } from '@/views/operationMonitoring/constants';
import useModelAngleScene from '@/views/operationMonitoring/hooks/useModelAngleScene';
import GoBack from '@/views/operationMonitoring/components/goBack.vue';
import Legend from '../components/legend.vue';
import DiagramControls from '@/components/common/DiagramControls.vue';
import { FloorSelect } from 'yushu-component-web';
import { MLoading } from 'meri-plus';
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { throttle } from 'lodash';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import baseStore from '@/store/baseStore';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import { OBJ_TYPE } from '@/utils/globalVariables';

const majorCode = inject('majorCode');
const perspectiveType = inject('perspectiveType');
const runningMonitorType = inject('runningMonitorType');
const seLengendData = {
    equipmentData: [
        {
            id: 'normal',
            name: i18n.global.t('meos_control_web.normal'),
            bgColor: '#ffffff',
            color: '#0C9B4A'
        },
        {
            id: 'abnormal',
            name: i18n.global.t('meos_control_web.abnormal'),
            bgColor: '#ffffff',
            color: '#F55047'
        },
        {
            id: 'offline',
            name: i18n.global.t('meos_control_web.offline'),
            bgColor: '#ffffff',
            color: '#C4C9CF'
        }
    ],
    switchData: []
};

// eslint-disable-next-line import/extensions
import '@/assets/less/apm-3d.less';

const buildingInited = ref();
const expandBuildingId = ref('');
const graphWarp = ref();
const pageLoading = ref();
const pageloadingService = ref();
const pipeLegends = ref([]);

const getTreeBuildingFloor = () => {
    // 获取建筑信息

    // eslint-disable-next-line one-var
    let parasm = {
        projectId: baseStore()?.projectId,
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

const choseFloor = id => {
    if (!id || id === modelCurFloorId.value) return;
    modelCurFloorId.value = id;
    curGraphType.value = GRAPH_TYPE_DICT.FLOOR_GRAPH;
    const viewField = viewFieldStack.value;
    const lastItem = viewField[viewField.length - 1];
    if (lastItem !== GRAPH_TYPE_DICT.FLOOR_GRAPH) {
        viewFieldStack.value.push(curGraphType.value);
    }
};

const changeBuilding = (id, building) => {
    if (!id) {
        viewFieldStack.value = [];
        modelCurFloorId.value = '';
        curGraphType.value = GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH;
        viewFieldStack.value.push(curGraphType.value);
    }
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj) {
        currentBuildingObj.value = building;
    }
};

const {
    initScene,
    goDefault,
    goBackView,
    windowResize,
    createElements,
    mapLoading,
    mapSwitchMode,
    closeEquipmentiInfo,
    nameAfterBack,
    viewFieldStack,
    modelDefatlGraph,
    buildFloors,
    modelCurFloorId,
    currentBuildingObj,
    curGraphType,
    modelInstanceData,
    floorList,
    curEnterSpace,
    bindEffects,
    popupQueryData,
    popPosition,
    onClickMoreInfo,
    pauseRender
} = useModelAngleScene(graphWarp);

let initPromis = null,
    containerDomResizeObserver = null,
    treeBuildingPromise = null;

if (!xplantindoorenvStore()?.buildingData?.length) {
    treeBuildingPromise = getTreeBuildingFloor();
}

watch(expandBuildingId, curId => {
    const selectBuilding = (buildFloors.value || []).find(b => b.id === curId);
    if (selectBuilding) {
        currentBuildingObj.value = selectBuilding;
    }
});

const initCreateAndView = async () => {
    pageLoading.value = true;
    viewFieldStack.value = [];
    // console.log('initCreateAndView:---viewFieldStack ', viewFieldStack);
    try {
        if (!initPromis) {
            initPromis = initScene();
        }

        // 注册window事件
        window.addEventListener('resize', windowResize);

        containerDomResizeObserver = new ResizeObserver(
            throttle(entries => {
                const isDomChage = entries.findIndex(e => e.target === graphWarp.value) > -1;
                if (isDomChage) windowResize();
            }, 16)
        );

        containerDomResizeObserver.observe(graphWarp.value);

        await initPromis;
        buildingInited.value = true;
        pauseRender(perspectiveType?.value === PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE);
    } catch (e) {
        console.log('e: ', e);
    }
    setTimeout(() => {
        pageLoading.value = false;
    }, 30);
};

onBeforeUnmount(() => {
    window.removeEventListener('resize', windowResize);
    containerDomResizeObserver.unobserve(graphWarp.value);
    containerDomResizeObserver.disconnect();
});

onUnmounted(() => {
    graphWarp.value = null;
    pageloadingService.value?.destroy();
});

const rebuildElements = async data => {
    if (perspectiveType.value !== PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE && closeEquipmentiInfo) {
        closeEquipmentiInfo();
    }
    if (!data) {
        return;
    }
    pageLoading.value = true;
    try {
        const { equipments, spaces, meshes, classDefines } = toRaw(data);
        const floorRecord = {};
        let floors = [];
        modelCurFloorId.value = null;
        curEnterSpace.value = null;
        floorList.value = [];
        viewFieldStack.value = [];
        pipeLegends.value = classDefines?.map(classInfo => {
            return {
                name: classInfo.className,
                color: RevitModelColorFromClassCode(classInfo.classCode)
            };
        });
        const spaceIdSet = new Set();
        const allObjs = spaces?.concat(equipments);
        allObjs.forEach(obj => {
            if (obj.spaceId) {
                spaceIdSet.add(obj.spaceId);
            }
            if (obj.objType === OBJ_TYPE.SPACE) {
                spaceIdSet.add(obj.id);
            }
            if (!floorRecord[obj.floorId]) {
                floorRecord[obj.floorId] = true;
                floorList.value.push(obj.floorId);
            }
        });
        meshes?.forEach(obj => {
            if (obj.spaceId) {
                spaceIdSet.add(obj.spaceId);
            }
        });
        if (floorList.value?.length > 1) {
            modelDefatlGraph.value = GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH;
        } else {
            modelDefatlGraph.value = spaceIdSet.size > 1 ? GRAPH_TYPE_DICT.FLOOR_GRAPH : spaceIdSet.size === 1 ? GRAPH_TYPE_DICT.SPACE_3D_GRAPH : GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH;
            if (floorList.value?.length === 1) {
                modelCurFloorId.value = floorList.value[0];
            }
            if (spaceIdSet.size === 1 && spaces?.length) {
                curEnterSpace.value = spaces[0];
            }
        }
        viewFieldStack.value.push(modelDefatlGraph.value);
        curGraphType.value = modelDefatlGraph.value;
        await treeBuildingPromise;
        const builds = xplantindoorenvStore().buildingFloorData;
        builds.forEach(ele => {
            floors = floors.concat(
                ele.floors.map(item => {
                    return {
                        id: item.id
                    };
                })
            );
        });
        await initPromis;

        await createElements({
            equips: equipments,
            pipes: meshes,
            spaces,
            floors
        });

        await mapSwitchMode(modelDefatlGraph.value, modelCurFloorId.value, curEnterSpace?.value);
        const equipIds = modelInstanceData?.value?.equipments?.map(obj => obj.id);
        bindEffects(equipIds);
    } catch (e) {
        console.log('e: ', e);
    }
    pageLoading.value = false;
};

watch(
    () => pageLoading.value || mapLoading.value,
    newVal => {
        if (newVal) {
            pageloadingService.value = MLoading.service({
                target: '.map-wrap',
                fullscreen: false,
                duration: 30000,
                lottieName: 'circle',
                background: curGraphType.value === GRAPH_TYPE_DICT.SPACE_3D_GRAPH ? '#52535A' : '#D6DDE5'
            });
        } else {
            pageloadingService.value?.destroy();
        }
    },
    { immediate: true }
);
onMounted(() => {
    initCreateAndView();

    watch(
        modelInstanceData,
        newVal => {
            rebuildElements(newVal);
        },
        { immediate: true }
    );
});
</script>
<style lang="less" scoped>
.map-wrap {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 10;

    .tips {
        position: absolute;
        display: none;
        width: 250px;
        padding: 10px 10px 0px;
        z-index: 999 !important;
        transform: translate(-50%, -100%);
    }
    .graph-warp {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .bottom-wrap {
        position: absolute;
        width: 100%;
        max-width: calc(100% - 16px);
        bottom: 0;
        display: flex;
        justify-content: center;
    }
}
</style>
