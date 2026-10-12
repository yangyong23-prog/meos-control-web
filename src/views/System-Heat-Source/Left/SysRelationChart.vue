<template>
    <div class="relation-chart-warp">
        <RelationChart
            v-bind="$attrs"
            ref="relationChartComponent"
            :chart-attr="chartAttr"
            :use-hover-new-api="true"
            :need-line-flow="true"
            :equip-group-info="equipGroupIdMap"
            :running-monitor-type="runningMonitorType"
            :should-had-sub-graph="shouldHadSubGraph"
            :equip-group-cannot-select="equipGroupCannotSelect"
            :cancel-loading="showMonitoringBoard"
            :enable-hover-group="enableHoverGroup"
            @click-node="clickNode"
            @clear-click-node="clearClickNode"
            @switch-relation-chart="switchRelationChart"
            @before-load-chart="beforeLoadChart"
            @after-load-chart="afterLoadChart"
        >
            <Legend :equipment-data="equipmentData" :switch-data="switchLegendData" :pipeline-data="pipelineLegendData" />
        </RelationChart>
        <div v-if="curSubGraphInfo" class="back-wrap">
            <div class="back-label" @click="backMainGraph">
                <IconMeriComponentChevronLeft :size="16" color="#8B949E"></IconMeriComponentChevronLeft>{{ i18n.global.t('meos_control_web.back_to_main_view') }}
            </div>
            <div class="split-line"></div>
            <div class="sub-graph-name">{{ curSubGraphInfo.localName }}</div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import RelationChart from '@/views/System/shared/RelationChart/index.vue';
import Legend from './Legend.vue';
import useRelationChart from '../hooks/useRelationChart';
import { showMonitoringBoardKey } from '../hooks/useBaseHook';
const {
    relationChartComponent,
    curSubGraphInfo,
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
    enableHoverGroup
} = useRelationChart();

const showMonitoringBoard = inject(showMonitoringBoardKey);
const backMainGraph = () => {
    curSubGraphInfo.value = null;
};
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
