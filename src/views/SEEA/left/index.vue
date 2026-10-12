<template>
    <div class="wh100 seea-sys-left">
        <Header v-show="systemList?.length > 0" @choose-obj="chooseObj"></Header>
        <m-illustration
            v-if="!baseLoading && !systemList?.length"
            :title="i18n.global.t('meos_control_web.no_content')"
            type="noContent"
            style="height: 100%"
            class="fcc"
        ></m-illustration>
        <div v-show="headerModelView === VIEW_MODE_3D_GRAPH && mapLoading" class="loadding-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <SysRelationChart v-show="!baseLoading && systemList?.length > 0 && headerModelView === VIEW_MODE_RELATION_GRAPH" :view-mode="headerModelView" />

        <div v-show="headerModelView === VIEW_MODE_3D_GRAPH" class="map-wrap">
            <Floor v-if="systemList?.length > 0" v-show="currentFloorObj?.id" ref="floorMapRef"></Floor>
            <div v-show="!currentFloorObj?.id" ref="graphWarp" class="wh100"></div>
        </div>
        <template v-if="headerModelView === VIEW_MODE_3D_GRAPH">
            <!-- 楼层切换器 -->
            <FloorSelect
                v-if="buildFloors?.length > 0"
                v-model:floor-id="currentFloorId"
                v-model:expand-building-id="expandBuildingId"
                :building-floors="buildFloors"
                :building-select-text="i18n.global.t('meos_control_web.all_building')"
                :show-project-btn="false"
                @change="choseFloor"
                @build-change="changeBuilding"
            />
            <BuildingFloorMapPopupTips
                :use-new-api="true"
                :pos="hoverCardPosition"
                :query-data="curHoverObj"
                :running-monitor-type="RUNNING_MONITOR_TYPE"
                @click-more-info="onClickMoreInfo"
            ></BuildingFloorMapPopupTips>
            <!-- 下钻 -->
            <Legend :pipeline-data="pipeLegends" />
            <DiagramControls :actual-size="false" @reset-view="goDefault" />
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
// import Header from '@/components/systemGraphHeader/index.vue';
import { ref } from 'vue';
import { headerModelViewKey, systemListKey, baseLoadingKey } from '../hooks/useBaseHook';
import Header from './Headers.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import Legend from '../components/legend.vue';
import Floor from './Floor.vue';
import useBuildingFloorMap from './hooks/useBuildingFloorMap';
import { RUNNING_MONITOR_TYPE, VIEW_MODE_TABS, VIEW_MODE_3D_GRAPH, VIEW_MODE_RELATION_GRAPH } from '../constants/index';
import SysRelationChart from './SysRelationChart/index.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';

const floorMapRef = ref(null);
const systemList = inject(systemListKey);
const baseLoading = inject(baseLoadingKey);
const pipeLegends = ref([]);
const currentBuildingObj = ref();
const currentFloorId = ref('');
const expandBuildingId = ref('');

const headerModelView = inject(headerModelViewKey);
// TODO viewFieldStack  modelCurFloorId buildFloors 来源于hooks占个位

const { mapLoading, graphWarp, currentFloorObj, buildFloors, hoverCardPosition, curHoverObj, onClickMoreInfo, goDefault: goDefaultBuilding, clickMapObj } = useBuildingFloorMap();
const choseFloor = (id, floor, building) => {
    if (id === currentFloorObj?.value?.id) return;
    if (currentFloorObj) {
        currentFloorObj.value = floor;
        if (currentFloorObj.value) {
            currentFloorObj.value.buildingLocalName = (floor.buildingName || building?.localName) ?? '--';
        }
    }
};

const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj.value) {
        currentBuildingObj.value = building;
    }
};
const goDefault = () => {
    if (currentFloorObj.value?.id) {
        floorMapRef.value?.goDefault();
    } else {
        goDefaultBuilding();
    }
};
const chooseObj = obj => {
    if (currentFloorObj.value?.id) {
        floorMapRef.value?.click(obj);
    } else {
        clickMapObj(obj);
    }
};

watchEffect(() => {
    if (currentFloorObj?.value?.id) {
        if (!currentFloorObj.value.buildingLocalName) {
            currentFloorObj.value.buildingLocalName = (currentFloorObj.value.buildingName || currentBuildingObj?.value?.localName) ?? '--';
        }
    } else {
        currentFloorId.value = '';
    }
});

watch(currentFloorId, curId => {
    const allFloors = (buildFloors.value || []).flatMap(s => s?.floors || []);
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
</script>
<style lang="less" scoped>
.seea-sys-left {
    // padding: 16px;
    padding-right: 0;
    position: relative;

    .map-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #e8edf3;
    }
    .loadding-msg {
        background-color: rgba(27, 33, 41, 0.9);
        border-radius: 4px;
        padding: 8px 12px;
        color: #fff;

        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
        position: absolute;
        z-index: 99;
        top: 64px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
