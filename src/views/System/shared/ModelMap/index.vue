<template>
    <div class="graph-scene-container">
        <div v-show="hasSpace" ref="graphWarp" :style="{ visibility: loading ? 'hidden' : 'visible' }" class="webgl-dom" @mouseleave="leaveChart" />

        <div v-show="hasSpace && !mapLoading" class="bottom-wrap">
            <slot name="legend" :pipeline-data="pipeLegends"></slot>
        </div>

        <DiagramControls v-show="hasSpace" class="graph-diagram-controls" :actual-size="false" @reset-view="goDefault" />
        <div v-if="!hasSpace" class="empty-text">{{ i18n.global.t('meos_control_web.no_model_diagram') }}</div>
        <BuildingFloorMapPopupTips
            :pos="popPosition"
            :query-data="popupQueryData"
            :running-monitor-type="props.runningMonitorType"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
        <div v-show="loading" class="loading-wrap"></div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import useLoading from '@/hooks/useLoading';
import DiagramControls from '@/components/common/DiagramControls.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import useMapHook from './useMapHook';

const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    }
});

const { goDefault, hasSpace, graphWarp, mapLoading, onClickMoreInfo, clickMapObj, hoverMapObj, unhoverMapObj, popPosition, popupQueryData, pipeLegends } = useMapHook(
    props.runningMonitorType
);
const { loading, openLoading, closeLoading } = useLoading('loading-wrap', '#51545b', 'circle', { width: '200px', height: '200px' }, 0);
watch(
    () => mapLoading.value,
    newVal => {
        if (newVal) {
            openLoading();
        } else {
            closeLoading();
        }
    },
    { immediate: true }
);
defineExpose({
    onClickMoreInfo,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj
});
</script>

<style lang="less" scoped>
.graph-scene-container {
    width: 100%;
    height: 100%;
    position: relative;
    .graph-diagram-controls {
        // right: 16px;
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
        font-weight: 400;
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
        width: calc(100%);
        bottom: 0;
        left: 50%;
        padding-inline: 64px;
        padding-left: 114px;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
    }

    .switch-angle-container {
        position: absolute;
        left: 20px;
        bottom: 20px;
        z-index: 60;
    }
    .loading-wrap {
        position: absolute;
        width: 100%;
        // height: calc(100% - 48px);
        height: 100%;
        bottom: 0;
        z-index: 10;
        background-color: transparent;
        &.loading {
            z-index: 9999;
        }
    }
    .empty-text {
        position: absolute;
        width: 100%;
        top: 50%;
        color: var(--gray-500, #8b949e);
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
}
</style>
