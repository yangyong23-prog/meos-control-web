<template>
    <div class="left-map-container">
        <div ref="graphWarp" class="parking-webgl-dom" />
        <div class="parking-search-container">
            <template v-if="isEdge()">
                <!-- 车牌号搜索 -->
                <CarNumberSearch
                    ref="carNumberSearchRef"
                    :list="carNumbers"
                    :cur-floor-id="currentFloorObj?.floorId"
                    :cur-building-id="currentFloorObj?.buildingId"
                    @parking-spot-search="handleParkingSpotSearch"
                />
            </template>

            <!-- 停车位选择 -->
            <ParkingSpotSearch
                ref="spotSearchRef"
                :list="allParkingSpots"
                :cur-floor-id="currentFloorObj?.floorId"
                :cur-building-id="currentFloorObj?.buildingId"
                @parking-spot-search="handleParkingSpotSearch"
            ></ParkingSpotSearch>
        </div>

        <!-- 楼层切换器 -->
        <FloorSelect
            v-if="buildFloors?.length"
            v-model:floor-id="currentFloorId"
            :show-project-btn="false"
            :building-floors="buildFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />
        <!-- <FloorSelect :floor-id="currentFloorObj?.floorId" :building-floors="buildFloors" :auto-choose-floor="!!currentFloorObj?.floorId" @change="choseFloor" /> -->
        <!--图例-->
        <div class="bottom-wrap">
            <Legend></Legend>
        </div>
        <div v-show="mapLoading" class="loading-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <DiagramControls :actual-size="false" class="graph-diagram-controls" @reset-view="goDefault" />
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
import Legend from '../components/Legend.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
// import FloorSelect from '@/components/common/FloorSelect.vue';
import DiagramControls from '@/components/common/DiagramControls.vue';
import { runningMonitorSecondTypeInjectKey, currentFloorObjInjectKey } from '../constant/injectKey';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import useParkingMapHook from './hooks/useParkingMapHook';
import ParkingSpotSearch from '../components/ParkingSpotSearch.vue';
import CarNumberSearch from '../components/CarNumberSearch.vue';
import { isEdge } from '@/utils/envUtils';

const runningMonitorType = inject(runningMonitorSecondTypeInjectKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const currentFloorId = ref('');
const expandBuildingId = ref('');

const currentBuildingObj = ref();
const spotSearchRef = ref();
const carNumberSearchRef = ref();

watch(
    currentFloorObj,
    cur => {
        if (cur?.id || cur?.floorId) {
            currentFloorId.value = cur?.id || cur?.floorId;
        } else {
            currentFloorId.value = '';
        }
    },
    {
        immediate: true
    }
);

const {
    goDefault,
    graphWarp,
    mapLoading,
    onClickMoreInfo,
    curHoverObj,
    hoverCardPosition,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj,
    moveToParkingSpot,
    buildFloors,
    allParkingSpots,
    clearSpotTime,
    carNumbers
} = useParkingMapHook();

watch(currentFloorId, curId => {
    const allFloors = (buildFloors.value || []).flatMap(build => {
        return (build?.floors || [])?.map(f => ({ ...f, buildingLocalName: build?.localName || f?.buildingName }));
    });
    const selectFloor = allFloors.find(s => s.id === curId);
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

watch(
    () => clearSpotTime.value,
    cur => {
        if (cur) {
            nextTick(() => {
                spotSearchRef?.value?.clearSelectSpot?.();
            });
        }
    },
    {
        immediate: true
    }
);

const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj.value) {
        currentBuildingObj.value = building;
    }

    carNumberSearchRef?.value?.clearSearch?.();
};

const choseFloor = (id, floor, building) => {
    if (id === currentFloorObj?.value?.floorId) return;
    if (currentFloorObj) {
        currentFloorObj.value = floor;
        if (currentFloorObj.value) {
            currentFloorObj.value.buildingLocalName = (floor.buildingName || building?.localName) ?? '--';
        }
    }

    carNumberSearchRef?.value?.clearSearch?.();
};

const handleParkingSpotSearch = val => {
    if (val) {
        moveToParkingSpot.value?.(val);
    }
};

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
    display: flex;
    position: relative;

    .parking-search-container {
        position: absolute;
        display: flex;
        align-items: center;
        top: 16px;
        right: 16px;
        z-index: 100;
        gap: 10px;
    }

    .parking-webgl-dom {
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
        padding-left: 164px;
        padding-right: 64px;
    }
}
.graph-diagram-controls {
    right: 16px;
}
</style>
