<template>
    <div class="map-scene">
        <Header @search-choose-obj="searchChooseObj" @drop-change="dropdownChangeObj" />
        <div v-show="headerModelView == 'model'" style="width: 100%; height: 100%">
            <div ref="graphWarp" class="webgl-dom" />
            <div v-show="mapLoading" class="loadding-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>

            <!-- 楼层切换器 -->
            <FloorSelectPlus v-if="buildFloors?.length" v-model:floor-id="curFloorId" :building-floors="buildFloors" :show-project="!curFloorId" />
            <!--图例-->
            <div class="bottom-wrap">
                <Legend />
            </div>
            <DiagramControls :actual-size="false" @reset-view="goDefault" />
            <SpaceHoverCard :space-obj="curHoverSpaceObj" :pos="spaceCardPos" @click-more-info="onClickMoreInfo"></SpaceHoverCard>
        </div>

        <div v-show="headerModelView == 'list'" style="width: 100%; height: 100%">
            <LightingMonitoringBoard />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Header from '@/views/lightingControl/components/header.vue';
import usePublicMapScene from '../hooks/usePublicMapScene';

import DiagramControls from '@/components/common/DiagramControls.vue';
import Legend from '../components/legend.vue';
import LightingMonitoringBoard from '../LightingMonitoringBoard/index.vue';
import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import SpaceHoverCard from '@/views/lightingControl/components/SpaceHoverCard.vue';
const currentBuidingNum = inject('currentBuidingNum');
const headerModelView = inject('headerModelView');
const graphWarp = ref(null);
const emits = defineEmits(['clickTempelte']);
const { goDefault, mapLoading, onClickMoreInfo, buildFloors, curFloorId, curHoverSpaceObj, spaceCardPos, curFloorName, goBackBuilding, clickMapObj } = usePublicMapScene(graphWarp);

const stopWatchEffect = watchEffect(() => {
    currentBuidingNum.value = buildFloors?.value?.length;
});

const searchChooseObj = (obj, type) => {
    clickMapObj(obj);
};
const dropdownChangeObj = obj => {
    emits('clickTempelte', obj);
};
defineExpose({ clickMapObj });

onBeforeUnmount(() => {
    stopWatchEffect();
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
        z-index: 2;
        top: 64px;
        left: 50%;
        transform: translateX(-50%);
    }

    .reset-btn {
        position: absolute;
        bottom: 16px;
        right: 28px;
        cursor: pointer;
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
