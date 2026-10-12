<template>
    <div :class="{ 'map-scene': true, 'hide-model': hideModel }">
        <div class="webgl-wrap">
            <div ref="graphWarp" class="webgl-dom" />
        </div>
        <div v-show="mapLoading" class="loading-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <div v-show="!mapLoading" class="bottom-wrap">
            <Legend :template-demand-type="templateDemandType" :floor-view="floorView"></Legend>
        </div>
        <DiagramControls v-show="!hideModel" :actual-size="false" @reset-view="goDefault" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
import useMapEntry from './hooks/useMapEntry';
import Legend from './components/Legend.vue';
import { templateDemandTypeInjectKey, floorViewInjectKey } from '../constant/injectKey';

const templateDemandType = inject(templateDemandTypeInjectKey);
const floorView = inject(floorViewInjectKey);

const props = defineProps({
    hideModel: {
        type: Boolean,
        default: false
    }
});

const { goDefault, graphWarp, mapLoading, clickMapObj, hoverMapObj, unhoverMapObj, pauseRender } = useMapEntry({ templateDemandType });

watch(
    () => props?.hideModel,
    curHide => {
        pauseRender?.(curHide);
    },
    { immediate: true }
);

defineExpose({
    clickMapObj,
    hoverMapObj,
    unhoverMapObj
});
</script>
<style lang="less" scoped>
.map-scene {
    width: 100%;
    transition: all 0.5s;
    opacity: 1;

    height: 100%;
    display: flex;
    position: relative;
    background-color: #e8edf3;

    .webgl-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #e8edf3;
    }

    .webgl-dom {
        position: absolute;
        width: 100%;
        height: 100%;
        right: 0;
        top: 0;
        background-color: #e8edf3;
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
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
    }
}

.hide-model.map-scene {
    width: 0;
    opacity: 0;
    transition: all 0.5s;

    .webgl-wrap {
        width: 0;
        display: none;
        transition: all 0.5s;
    }

    .loading-msg {
        width: 0;
        display: none;
        transition: all 0.5s;
    }

    .bottom-wrap {
        width: 0;
        display: none;
        transition: all 0.5s;
    }
}
</style>
