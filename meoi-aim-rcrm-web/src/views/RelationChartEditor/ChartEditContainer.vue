<template>
    <div class="relation-chart-editor-content">
        <div
            class="relation-chart-editor-warp relation-chart-editor-content-center"
            :class="{ 'show-edit-tab': showEditTab }"
        >
            <div class="chart-create-time">
                <span v-if="graphHeaderData.graphType === 0"
                    >最新获取时间：{{ graphHeaderData.updateTime || graphHeaderData.createTime }}</span
                >
                <span v-else>创建时间：{{ graphHeaderData.createTime }}</span>
            </div>
            <div class="chart-box">
                <ChartView ref="chartViewCom" @onload="onReloadChart"> </ChartView>
            </div>
        </div>
        <SidebarOperation v-if="showEditTab && !refresh" class="relation-chart-editor-content-right" />
    </div>
</template>
<script setup>
import { graphHeaderDataKey } from '@/utils/injectionKey';
import { computed, ref, inject, nextTick } from 'vue';
import ChartView from './chart/ChartView.vue';
import SidebarOperation from './SidebarOperation/index.vue';
const graphHeaderData = inject(graphHeaderDataKey);
const chartViewCom = ref();

const showEditTab = computed(() => {
    return graphHeaderData.value.graphType === 1 && graphHeaderData.value?.status !== 1;
});

const refresh = ref(false);
const onReloadChart = () => {
    refresh.value = true;
    nextTick(() => {
        refresh.value = false;
    });
};

const loadChartData = () => {
    chartViewCom.value?.loadData();
};
const getChartSizeInfo = () => {
    return chartViewCom.value?.getChartSizeInfo();
};
defineExpose({ loadChartData, getChartSizeInfo: getChartSizeInfo });
</script>
<style lang="scss" scoped>
.relation-chart-editor-content {
    width: 100%;
    height: calc(100% - 52px);
    display: flex;
    flex-direction: row;
    position: relative;
    .relation-chart-editor-content-center {
        width: 100%;
        height: 100%;
        border-left: 1px solid #e1e5eb;
        position: relative;
        &.show-edit-tab {
            width: calc(100% - 340px);
        }
        .chart-create-time {
            position: absolute;
            top: 12px;
            left: 16px;
            color: #626c78;
            height: 31px;
            line-height: 31px;
            z-index: 999;
            font-family: 'Microsoft YaHei UI';
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            border-radius: 4px;
            padding: 0 6px;
            background: #f1f4f6;
        }
        .chart-box {
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            :deep(.m-loading-mask) {
                z-index: 3000 !important;
            }
        }
    }
    .relation-chart-editor-content-right {
        width: 340px;
        max-width: 340px;
        min-width: 340px;
        border-left: 1px solid #e1e5eb;
        background: #ffffff;
        box-sizing: content-box;
    }
}
</style>
