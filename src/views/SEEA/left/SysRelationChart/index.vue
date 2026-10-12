<template>
    <div class="relation-chart-warp">
        <RelationChart
            v-bind="$attrs"
            ref="relationChartComponent"
            :chart-attr="chartAttr"
            :equip-group-info="equipGroupIdMap"
            :running-monitor-type="runningMonitorType"
            :should-had-sub-graph="shouldHadSubGraph"
            :equip-group-cannot-select="equipGroupCannotSelect"
            :enable-hover-group="enableHoverGroup"
            :can-hover-group-select="true"
            :support-status-codes="['onlineStatus']"
            :use-hover-new-api="true"
            :enable-select="enableSelect"
            @click-node="clickNode"
            @clear-click-node="clearClickNode"
            @switch-relation-chart="switchRelationChart"
            @before-load-chart="beforeLoadChart"
            @after-load-chart="afterLoadChart"
        >
            <Legend :equipment-data="equipmentData" :switch-data="switchLegendData" :pipeline-data="pipelineLegendData" />
        </RelationChart>
    </div>
</template>
<script setup>
import RelationChart from '@/views/System/shared/RelationChart/index.vue';
import Legend from './Legend.vue';
import useRelationChart from '../../hooks/useRelationChart';
const {
    relationChartComponent,
    chartAttr,
    equipGroupIdMap,
    runningMonitorType,
    equipmentData,
    switchLegendData,
    pipelineLegendData,
    shouldHadSubGraph,
    equipGroupCannotSelect,
    switchRelationChart,
    clickNode,
    clearClickNode,
    beforeLoadChart,
    afterLoadChart,
    triggerClose,
    enableHoverGroup,
    enableSelect
} = useRelationChart();

defineExpose({ triggerClose });
</script>

<style lang="scss" scoped>
.relation-chart-warp {
    width: 100%;
    height: 100%;
    :deep(.relation-chart-com) {
        .tools-container {
            z-index: 52;
        }
    }
    .back-wrap {
        position: absolute;
        left: 16px;
        top: 60px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        z-index: 20;
        .back-label {
            display: flex;
            padding: 5px 8px 5px 4px;
            justify-content: center;
            align-items: center;
            gap: 2px;
            cursor: pointer;
            &:hover {
                border-radius: 4px;
                background: rgb(196 201 207 / 30%);
            }
        }
        .split-line {
            width: 1px;
            height: 16px;
            background: #c4c9cf;
        }
        .sub-graph-name {
            color: var(--gray-900, #1b2129);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px; /* 150% */
        }
    }
}
</style>
