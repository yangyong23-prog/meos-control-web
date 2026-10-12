<template>
    <div class="relation-chart-warp wh100">
        <RelationChart
            ref="relationChartComponent"
            :chart-attr="chartAttr"
            :running-monitor-type="runningMonitorType"
            :equip-group-info="equipGroupInfo"
            :can-hover-group-select="canHoverGroupSelect"
            use-hover-new-api
            :should-had-sub-graph="shouldHadSubGraph"
            :equip-group-cannot-select="props.equipGroupCannotSelect"
            :enable-hover-group="enableHoverGroup"
            v-bind="$attrs"
            @click-node="clickNode"
            @clear-click-node="clearClickNode"
            @before-load-chart="beforeLoadChart"
            @after-load-chart="afterLoadChart"
            @switch-relation-chart="switchRelationChart"
        >
            <slot name="legend" :default-legends="defaultLegends" :switch-legend-data="switchLegendData" :pipeline-legend-data="pipelineLegendData"> </slot>
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

<script setup lang="ts">
import RelationChart from '@/views/System/shared/RelationChart/index.vue';
import useChartHook from './hooks/useChartHook';
import { ChartEmit } from './types/emits';
import i18n from '@/localization';
import { ChartProps } from './types/props';
import { IconMeriComponentChevronLeft } from 'meri-icon';

const props = withDefaults(defineProps<ChartProps>(), {
    defaultLegends: () => [{ id: 'abnormal_event', name: i18n.global.t('meos_control_web.abnormal_event'), color: '#F55047', bgColor: '#FFFFFF' }],
    canHoverGroupSelect: false
});
const emits = defineEmits<ChartEmit>();

const {
    relationChartComponent,
    equipGroupInfo,
    chartAttr,
    curSubGraphInfo,
    switchLegendData,
    pipelineLegendData,
    enableHoverGroup,
    clickNode,
    clearClickNode,
    beforeLoadChart,
    afterLoadChart,
    triggerClose,
    switchRelationChart,
    shouldHadSubGraph
} = useChartHook(props, emits);
const backMainGraph = () => {
    curSubGraphInfo.value = null;
};
defineExpose({ triggerClose, relationChartComponent, curSubGraphInfo });
</script>
<style lang="less" scoped>
.relation-chart-warp {
    position: relative;
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
