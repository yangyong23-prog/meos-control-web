<template>
    <div class="ac-playback-warp">
        <div class="ac-playback-left">
            <div class="ac-playback-title">{{ i18n.global.t('meos_control_web.hvac_scheduling_history_replay') }}</div>
            <div class="ac-playback-map-warp">
                <PlayBackMap></PlayBackMap>
            </div>
            <PlayBottomHandlerBar class="ac-playback-handler-bar"></PlayBottomHandlerBar>
        </div>
        <div class="ac-playback-right">
            <RightSideTabs />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import PlayBottomHandlerBar from './PlayBottomHandlerBar/index.vue';
import PlayBackMap from './PlayBackMap/index.vue';

import usePlaybackGlobalData from './hooks/usePlaybackGlobalData';
import RightSideTabs from './RightSideTabs/index.vue';

usePlaybackGlobalData();
</script>
<style lang="less" scoped>
.ac-playback-warp {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #d6dde5;
    min-width: 1280px;
    .ac-playback-left {
        width: calc(100% - var(--broken-width));
        position: relative;
        .ac-playback-title {
            width: 100%;
            padding: 16px 16px 0px 24px;
            align-items: center;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px;
            height: 48px;
            color: var(--gray-900);
        }
        .ac-playback-handler-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 48px;
            z-index: 99;
        }
        .ac-playback-map-warp {
            width: 100%;
            height: calc(100% - 48px);
        }
    }
    .ac-playback-right {
        width: var(--broken-width);
    }
}
</style>
