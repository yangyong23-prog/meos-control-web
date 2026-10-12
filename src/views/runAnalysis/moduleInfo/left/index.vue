<template>
    <div class="data-range wh100">
        <div class="data-range-title fs18 fw700 m-ellipsis">{{ i18n.global.t('meos_control_web.data_display_range') }}</div>
        <m-list-skeleton v-if="loading" />
        <m-scrollbar v-else-if="data?.length" height="calc(100% - 48px)">
            <m-tree v-model="treeModel" :data="data" multiple @change="change"> </m-tree>
        </m-scrollbar>
        <div v-else class="fcc" style="color: var(--gray-500); height: calc(100% - 48px)">{{ i18n.global.t('meos_control_web.no_content') }}</div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    data: {
        type: Array,
        default: () => []
    }
});
const treeModel = inject('treeModel', ref([])); // ==> src\views\runAnalysis\hooks\useQueryChartDataHook.js
const getBatchQueryPeriodData = inject('getBatchQueryPeriodData', () => {}); // ==> src\views\runAnalysis\hooks\useQueryChartDataHook.js
const change = (ids, selectNode, currentNode) => {
    if (currentNode) {
        nextTick(() => {
            getBatchQueryPeriodData();
        });
    }
};
</script>
<style lang="less" scoped>
.data-range {
    position: relative;
    z-index: 2;
    background-color: var(--gray-100);
    :deep(.m-tree-node) {
        &.is-notlast {
            .m-tree-node__content {
                color: var(--gray-900);
            }
        }
    }
    &-title {
        padding: 16px 16px 8px 16px;
    }
    :deep(.m-scrollbar__content) {
        padding: 8px 12px 16px 12px;
    }
}
</style>
