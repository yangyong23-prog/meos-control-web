<template>
    <div class="map-scene">
        <div ref="graphWarp" class="webgl-dom" />
        <div v-show="mapLoading" class="loadding-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import useBuildingLightingMap from './hooks/useBuildingLightingMap';
const graphWarp = ref(null);

const { goDefault, mapLoading, onClickMoreInfo, curHoverLampObj, lampCardPos } = useBuildingLightingMap(graphWarp);

defineExpose({
    goDefault
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
}
</style>
