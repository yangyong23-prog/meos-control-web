<template>
    <div class="map-scene">
        <div ref="graphWarp" class="webgl-dom" />
        <div v-show="mapLoading" class="loadding-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <DiagramControls :actual-size="false" @reset-view="goDefault" />
        <PlaybackMapPopupTips :pos="hoverCardPosition" :query-data="curHoverObj" :running-monitor-type="AIR_TERMINAL"> </PlaybackMapPopupTips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { AIR_TERMINAL } from '@/utils/globalVariables';
import DiagramControls from '@/components/common/DiagramControls.vue';
import PlaybackMapPopupTips from '@/components/PlaybackMapPopupTips.vue';
import usePlayBackMapHook from './usePlayBackMapHook';

const { graphWarp, mapLoading, curHoverObj, hoverCardPosition, goDefault } = usePlayBackMapHook();
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
