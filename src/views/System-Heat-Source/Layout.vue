<template>
    <div class="layout-wrap wh100" :class="curContainerClass">
        <template v-if="isSystemLoaded && systemList?.length">
            <div class="left-wrap">
                <slot name="left"></slot>
            </div>
            <div class="right-wrap">
                <slot name="right"></slot>
            </div>
        </template>
        <div v-else class="empty-item">
            <Empty :text="i18n.global.t('meos_control_web.no_content')"></Empty>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Empty from '@/components/common/Empty.vue';
import useAbnormalHook from './hooks/useAbnormalHook';
import { VIEW_MODE } from './constant/variable';
import { isSystemLoadedKey, systemListKey } from './hooks/useBaseHook';

const props = defineProps({
    viewMode: {
        type: String,
        default: VIEW_MODE.GRAPH_CODE
    }
});
const isSystemLoaded = inject(isSystemLoadedKey);
const systemList = inject(systemListKey);

useAbnormalHook();

const curContainerClass = computed(() => {
    const res = props?.viewMode === VIEW_MODE.GRAPH_CODE ? 'SYSTEM_GRAPH' : 'SPACE_3D_GRAPH';
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
.empty-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
