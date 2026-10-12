<template>
    <div class="left-map-container">
        <div ref="graphWarp" class="flow-webgl-dom" />
        <!-- 楼层切换器 -->
        <!-- 楼层切换器 -->
        <FloorSelect
            v-if="buildFloors?.length"
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :building-floors="buildFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :show-project-btn="!currentFloorId"
            :project-btn-text="i18n.global.t('meos_control_web.project')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />
        <!--图例-->
        <div class="bottom-wrap">
            <Legend />
        </div>
        <div v-show="mapLoading" class="loading-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <!-- <DiagramControls :actual-size="false" @reset-view="goDefault" /> -->
        <BuildingFloorMapPopupTips
            :pos="hoverCardPosition"
            :query-data="curHoverObj"
            :running-monitor-type="runningMonitorType"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Legend from './legend.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import useFlowMapHook from './hooks/useFlowMapHook';
import {
    spacePassengerFlowDataInjectKey,
    runningMonitorSecondTypeInjectKey,
    currentFloorObjInjectKey,
    currentBuildingObjInjectKey,
    currentBuidingNumInjectKey
} from '../constant/injectKey';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';

const runningMonitorType = inject(runningMonitorSecondTypeInjectKey);
const currentBuildingObj = inject(currentBuildingObjInjectKey);
const currentBuidingNum = inject(currentBuidingNumInjectKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const spacePassengerFlowData = inject(spacePassengerFlowDataInjectKey);

const currentFloorId = ref('');
const expandBuildingId = ref('');

const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj) {
        currentBuildingObj.value = building;
    }
};
const buildFloors = computed(() => {
    // 适配楼层选择器
    if (spacePassengerFlowData.value) {
        return spacePassengerFlowData.value.map(building => {
            return {
                ...building,
                localName: building.buildingLocalName ?? '--',
                name: building.buildingLocalName ?? '--',
                id: building.buildingId,
                floorList: (building.floors || []).map(floor => {
                    return {
                        ...floor,
                        id: floor.floorId,
                        localName: floor.floorLocalName ?? '--',
                        name: floor.floorLocalName ?? '--',
                        buildingLocalName: building.buildingLocalName ?? '--'
                    };
                })
            };
        });
    }
    return [];
});

watchEffect(() => {
    currentBuidingNum.value = buildFloors?.value.length;
    if (currentFloorObj?.value?.floorId) {
        currentFloorId.value = currentFloorObj.value.floorId;
    } else {
        currentFloorId.value = '';
    }
});
const { graphWarp, mapLoading, onClickMoreInfo, curHoverObj, hoverCardPosition, clickMapObj, hoverMapObj, unhoverMapObj } = useFlowMapHook();

const choseFloor = (id, floor, building) => {
    if (id === currentFloorObj?.value?.floorId) return;
    if (currentFloorObj) {
        currentFloorObj.value = floor;
        if (currentFloorObj.value) {
            currentFloorObj.value.buildingLocalName = (floor.buildingName || building?.localName) ?? '--';
        }
    }
};

watch(currentFloorId, curId => {
    const allFloors = (buildFloors.value || []).flatMap(s => s?.floorList || []);
    const selectFloor = allFloors.find(s => s.id === curId || s?.floorId === curId);
    if (selectFloor) {
        currentFloorObj.value = selectFloor;
    }
});

watch(expandBuildingId, curId => {
    const selectBuilding = (buildFloors.value || []).find(b => b.id === curId);
    if (selectBuilding) {
        currentBuildingObj.value = selectBuilding;
    }
});

defineExpose({
    clickMapObj,
    hoverMapObj,
    unhoverMapObj
});
</script>

<style lang="less" scoped>
.left-map-container {
    width: 100%;
    height: 100%;
    // padding-right: 14px;
    display: flex;
    position: relative;

    .flow-webgl-dom {
        width: 100%;
        height: 100%;
    }

    .model-container {
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
    }

    .webgl-dom {
        width: 100%;
        height: 100%;
    }

    .loading-msg {
        background-color: rgba(27, 33, 41, 0.9);
        border-radius: 4px;
        padding: 8px 12px;
        color: #fff;

        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
        position: absolute;
        z-index: 2;
        top: 64px;
        left: 50%;
        transform: translateX(-50%);
    }
    .bottom-wrap {
        position: absolute;
        width: 100%;
        bottom: 0;
        display: flex;
        justify-content: center;
        padding-left: 120px;
        padding-right: 20px;
    }
}
</style>
