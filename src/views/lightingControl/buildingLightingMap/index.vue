<template>
    <div class="map-scene">
        <Header :public-control="false" @drop-change="dropdownChangeObj" />
        <div ref="graphWarp" class="webgl-dom" />
        <div v-show="mapLoading" class="loadding-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>

        <!--图例-->
        <div class="bottom-wrap">
            <Legend />
        </div>
        <DiagramControls :actual-size="false" @reset-view="goDefault" />
        <SpaceHoverCard :space-obj="curHoverLampObj" :pos="lampCardPos" @click-more-info="onClickMoreInfo"></SpaceHoverCard>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Header from '@/views/lightingControl/components/header.vue';
import useBuildingLightingMap from '../hooks/useBuildingLightingMap';

import DiagramControls from '@/components/common/DiagramControls.vue';
import Legend from '../components/legend.vue';

import SpaceHoverCard from '@/views/lightingControl/components/SpaceHoverCard.vue';
const emits = defineEmits(['clickTempelte']);
const graphWarp = ref(null);

const { goDefault, mapLoading, onClickMoreInfo, curHoverLampObj, lampCardPos } = useBuildingLightingMap(graphWarp);

const dropdownChangeObj = obj => {
    emits('clickTempelte', obj);
};
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
    }
}
</style>
