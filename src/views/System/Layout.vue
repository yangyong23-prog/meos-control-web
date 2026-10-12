<template>
    <div class="layout-wrap wh100" :class="curContainerClass">
        <div class="left-wrap">
            <slot name="left"></slot>
        </div>
        <div class="right-wrap">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script setup>
import useAbnormalHook from './hooks/useAbnormalHook';
import { VIEWMODE } from '@/views/System/constant/variables';

const props = defineProps({
    viewMode: {
        type: String,
        default: VIEWMODE.GRAPHCODE
    }
});
useAbnormalHook();

const curContainerClass = computed(() => {
    const res = props?.viewMode === VIEWMODE.GRAPHCODE ? 'SYSTEM_GRAPH' : 'SPACE_3D_GRAPH';
    return res;
});
</script>
<style lang="less" scoped>
@media screen and (min-width: 1600px) {
    .left-wrap {
        width: calc(100% - 496px);
    }
    .right-wrap {
        width: 496px;
    }
}
@media screen and (max-width: 1600px) {
    .left-wrap {
        width: calc(100% - 416px);
    }
    .right-wrap {
        width: 416px;
    }
}
.layout-wrap {
    display: flex;
    background-color: var(--gray-100);
    position: relative;
    min-width: 1280px;

    &.SYSTEM_GRAPH {
        background: @system_graph_bg;
    }

    &.SPACE_3D_GRAPH {
        background: @space_3d_bg;
    }
}
</style>
