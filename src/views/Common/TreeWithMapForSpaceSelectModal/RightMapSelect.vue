<template>
    <div class="right-container">
        <div ref="graphWarp" class="webgl-dom"></div>
        <div v-show="!loading && mapLoading" class="loading-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <template v-if="!loading">
            <div v-ellipsis class="header m-ellipsis">{{ selectedFloorName }}</div>

            <div class="bottom-wrap">
                <Legend></Legend>
            </div>

            <DiagramControls v-if="!mapLoading" class="graph-diagram-controls" :actual-size="false" @reset-view="goDefault" />

            <SpaceHoverTips :pos="hoverCardPosition" :query-data="curHoverObj"> </SpaceHoverTips>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import useLoading from '@/hooks/useLoading';
import DiagramControls from '@/components/common/DiagramControls.vue';
import { buildingFloorSpaceIdsMapKey, selectedFloorIdKey } from './hooks/useGlobalModal';
import Legend from './widget/Legend.vue';
import useFloorMap from './hooks/useFloorMap';
import SpaceHoverTips from './widget/SpaceHoverTips.vue';

const props = defineProps({
    treeDataLoading: {
        type: Boolean,
        default: false
    }
});
const selectedFloorId = inject(selectedFloorIdKey);
const buildingFloorSpaceIdsMap = inject(buildingFloorSpaceIdsMapKey);
const selectedFloorName = computed(() => {
    if (selectedFloorId?.value) {
        const floorInfo = buildingFloorSpaceIdsMap.value?.get?.(selectedFloorId.value);
        return floorInfo?.name || '';
    }
    return '';
});

const { goDefault, graphWarp, hoverMapObj, unhoverMapObj, hoverCardPosition, curHoverObj, mapLoading } = useFloorMap();

const { openLoading, closeLoading, loading } = useLoading(
    'right-container',
    '#f2f4f6',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);

watch(
    () => props?.treeDataLoading,
    curLoading => {
        if (curLoading) {
            openLoading();
        } else {
            closeLoading();
        }
    },
    {
        immediate: true
    }
);

defineExpose({
    hoverMapObj,
    unhoverMapObj
});
</script>

<style lang="less" scoped>
.right-container {
    flex: 1;
    height: 100%;
    border-radius: 8px;
    background: #d9e1ea;
    position: relative;
}

.webgl-dom {
    width: 100%;
    height: 100%;
    background: #d9e1ea;
    border-radius: 8px;

    // HACK: 解决画布抖动的问题
    :deep(.apm3d-labelcontainer) {
        width: 100% !important;
        height: 100% !important;
    }
    :deep(canvas) {
        width: 100% !important;
        height: 100% !important;
        background: #d9e1ea;
        border-radius: 8px;
    }
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

.header {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    padding-left: 12px;
    padding-top: 12px;
    color: @grey-800;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    z-index: 80;
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

.graph-diagram-controls {
    right: 16px;
}
</style>
