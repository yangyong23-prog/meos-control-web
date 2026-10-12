<template>
    <div class="map-scene">
        <div ref="graphWarp" class="webgl-dom" />
        <div class="time">{{ curSelectedTime }}</div>
        <!-- 楼层切换器 -->
        <FloorSelect
            v-if="buildingFloors?.length"
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :building-floors="buildingFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :project-btn-text="i18n.global.t('meos_control_web.project')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />

        <!--图例-->
        <div class="bottom-wrap">
            <Legend :legends="legends" />
        </div>

        <DiagramControls :actual-size="false" style="right: 16px" @reset-view="goDefault" />
        <BuildingFloorMapPopupTips
            :pos="hoverCardPosition"
            :query-data="curHoverObj"
            running-monitor-type="RUN_ANALYSIS"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
import useMapHook from './useMapHook';
import Legend from './Legend.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';

import { curSelectedTimeKey } from '../../injectionKey';

const currentFloorId = ref('');
const expandBuildingId = ref('');

const curSelectedTime = inject(curSelectedTimeKey);

const props = defineProps({
    legends: {
        type: Array,
        default: () => []
    },
    spaces: {
        type: Array,
        default: () => []
    },
    equipments: {
        type: Array,
        default: () => []
    },
    links: {
        type: Array,
        default: () => []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    canSpaceSelected: {
        type: Boolean,
        default: false
    },
    spaceSecondType: {
        type: String,
        default: ''
    }
});

const { goDefault, graphWarp, buildingFloors, currentFloorObj, onClickMoreInfo, curHoverObj, hoverCardPosition, clickMapObj, hoverMapObj, unhoverMapObj } = useMapHook(props);
const buildingId = computed(() => {
    const res = expandBuildingId.value;
    return res;
});

const choseFloor = (id, floor, building) => {
    // console.log('choseFloor: ', id, floor);
    if (id === currentFloorObj?.value?.id) return;
    currentFloorId.value = id;
    if (currentFloorObj) {
        currentFloorObj.value = floor;
        if (currentFloorObj.value) {
            currentFloorObj.value.buildingLocalName = (floor.buildingName || building?.localName) ?? '--';
        }
    }
};

const changeBuilding = (id, building) => {
    // console.log('changeBuilding--id, building: ', id, building);
};

watch(currentFloorId, curId => {
    const allFloors = (buildingFloors.value || []).flatMap(s => {
        const buildingLocalName = s?.localName ?? '--';
        return s?.floors?.map(f => ({ ...f, buildingLocalName })) || [];
    });
    const selectFloor = allFloors.find(s => s.id === curId);
    if (selectFloor) {
        currentFloorObj.value = selectFloor;
    }
});

defineExpose({
    clickMapObj,
    hoverMapObj,
    unhoverMapObj,
    buildingId
});
</script>
<style lang="less" scoped>
.map-scene {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;

    .webgl-dom {
        width: 100%;
        height: 100%;
        :deep(.apm3d-labelcontainer) {
            width: 100% !important;
            height: 100% !important;
        }
        :deep(canvas) {
            width: 100% !important;
            height: 100% !important;
        }
    }
    .time {
        position: absolute;
        left: 12px;
        top: 16px;
        user-select: none;

        color: var(--Gray-900);
        font-family: Persagy2.0;
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px; /* 122.222% */
    }
    .reset-btn {
        position: absolute;
        bottom: 16px;
        right: 28px;
        cursor: pointer;
    }

    .bottom-wrap {
        position: absolute;
        width: calc(100% - 140px);
        right: 64px;
        bottom: 0;
        display: flex;
        justify-content: center;
    }
}
</style>
