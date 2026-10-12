<template>
    <div class="wh100 seea-sys-left">
        <Header @choose-obj="chooseObj"></Header>
        <m-illustration v-if="!baseLoading" :title="i18n.global.t('meos_control_web.no_content')" type="noContent" style="height: 100%" class="fcc"></m-illustration>
        <div v-show="mapLoading" class="loadding-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <div class="map-wrap">
            <Floor ref="floorMapRef"></Floor>
        </div>

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

        <!-- 下钻 -->
        <div class="bottom-wrap">
            <Legend />
        </div>
        <DiagramControls :actual-size="false" @reset-view="goDefault" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
// import Header from '@/components/systemGraphHeader/index.vue';
import { ref } from 'vue';
import Header from './Headers.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import Legend from './legend.vue';
import Floor from './Floor.vue';
import { currentFloorObjKey, buildFloorsKey, floorMapRefKey } from '@/views/KitchenFumes/hooks/useKitchenFumesGlobal';

const pipeLegends = ref([]);
const currentBuildingObj = ref();
const currentFloorId = ref('');
const expandBuildingId = ref('');
const currentFloorObj = inject(currentFloorObjKey);
const buildFloors = inject(buildFloorsKey);
const floorMapRef = inject(floorMapRefKey);

const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj.value) {
        currentBuildingObj.value = building;
    }
};
const goDefault = () => {
    floorMapRef.value?.goDefault();
};
const chooseObj = obj => {
    floorMapRef.value?.click(obj);
};

watchEffect(() => {
    if (currentFloorObj.value.id) {
        currentFloorId.value = currentFloorObj.value.id;
    }
    if (!currentFloorObj.value.buildingLocalName) {
        currentFloorObj.value.buildingLocalName = (currentFloorObj.value.buildingName || currentBuildingObj?.value?.localName) ?? '--';
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
.bottom-wrap {
    position: absolute;
    width: calc(100% - 140px);
    right: 64px;
    bottom: 0;
    display: flex;
    justify-content: center;
}
</style>
