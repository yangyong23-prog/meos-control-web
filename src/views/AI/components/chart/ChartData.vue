<template>
    <div class="system-data wh100" :style="{ 'min-height': `${props.chartContentHeight}px` }">
        <div ref="chartPrefix" class="chart-title fs18 fw700 fcb">
            <div v-if="showTitle" class="chart-title-name" style="align-self: flex-start">{{ chartData.name }}&nbsp;<slot name="title"></slot></div>
            <div class="chart-title-legend h100 fc">
                <div class="chart-title-legend-box fc fw500 fs14" :style="{ justifyContent: showTitle ? 'end' : 'start' }">
                    <Legend v-if="!chartData.isSystem" :list="chartData.objects" :style-fun="sytleLine" @item-click="item => objectClick(item, chartData)" />
                </div>
                <slot name="legend"></slot>
            </div>
        </div>
        <div v-for="(value, index) in chartData.children" :key="value.id" class="chart-item">
            <div class="chart-view">
                <div class="chart-view-name fcb">
                    <span class="fw700 chart-view-name-text" style="align-self: flex-start">
                        <span class="chart-view-name-text-name">{{ value.groupName }}</span>
                        <span class="chart-view-name-text-unit">{{ value.unit ? `（${value.unit}）` : '' }}</span
                        >&nbsp;
                    </span>
                    <div class="fc chart-view-name-legend">
                        <Legend v-if="!data.isSystem" :list="value.infoCodes" :style-fun="sytleLine2" @item-click="item => infoCodeClick(item, value)" />
                        <Legend v-else :list="value.infoCodes" :style-fun="sytleLine" @item-click="item => infoCodeClick(item, value)" />
                    </div>
                </div>

                <div class="chart-view-content">
                    <ChartDataView
                        :ref="getRef"
                        :data="value.echartData"
                        :title="value.groupName"
                        :unit="value.unit"
                        :objects="data.objects"
                        :info-codes="value.infoCodes"
                        :index="index + 1"
                        :is-system="data.isSystem"
                        :data-sources="value.echartData?.[0]?.dataSources"
                        :custom-formatter="customFormatter"
                        :single-height="singleChartHeight"
                        @hover="val => hoverLine(val, index)"
                        @mouseleave="mouseleave"
                        @finished="finished"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ECHART_COLORS } from '@/utils/globalVariables';
import ChartDataView from './ChartDataView.vue';
import Legend from './Legend.vue';
import { useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';

const systemId = ref('');
const ChartDataViewRefs = ref([]);
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    showTitle: {
        type: Boolean,
        default: false
    },
    customFormatter: {
        type: Function,
        default: undefined
    },
    chartContentHeight: {
        type: Number,
        default: 0
    },
    showScroll: {
        type: Boolean,
        default: false
    }
});
const chartData = ref({});
const objects = ref([]);

const chartPrefix = useTemplateRef('chartPrefix');
const { height } = useElementSize(chartPrefix);
const emits = defineEmits(['hover', 'mouseleave', 'finished']);
const getRef = val => {
    if (chartData.value.children.length === ChartDataViewRefs.value.length) {
        return;
    }
    ChartDataViewRefs.value.push(val);
};

const MIN_CHART_HEIGHT = 150;
const CHART_GAP = 8;
const CHART_NAME_HEIGHT = 22;
const singleChartHeight = computed(() => {
    if (!props.showScroll && chartData.value?.children?.length) {
        const singleHeight = Math.floor((props.chartContentHeight - height.value - CHART_GAP) / chartData.value.children.length);
        return singleHeight - CHART_NAME_HEIGHT - CHART_GAP;
    }
    return MIN_CHART_HEIGHT;
});

const objectClick = data => {
    const chartNameShow = {};
    data.show = !data.show;
    chartData.value.children.forEach(item => {
        item.infoCodes.forEach(val => {
            chartNameShow[val.name + '&&' + (data.name || data.localName || '--')] = data.show && val.show;
        });
    });
    for (const key in chartNameShow) {
        if (Object.prototype.hasOwnProperty.call(chartNameShow, key)) {
            const value = chartNameShow[key];
            ChartDataViewRefs.value.forEach(item => {
                item?.legendToggleSelectFun(key, value);
            });
        }
    }
};
const infoCodeClick = infoCode => {
    infoCode.show = !infoCode.show;
    const allFalse = chartData.value.objects.every(item => item.show === false);
    if (allFalse) {
        return;
    }
    ChartDataViewRefs.value.forEach(item => {
        const arr = chartData.value.objects.filter(val => val.show);
        arr.forEach(val => {
            const objName = (val.name || val.localName) ?? '--';
            const infoName = (infoCode.name || infoCode.localName) ?? '--';
            item?.legendToggleSelectFun(infoName + '&&' + objName, infoCode.show);
        });
    });
};
const hoverLine = (data, i) => {
    ChartDataViewRefs.value.forEach((item, index) => {
        if (i === index) {
            return;
        }
        item?.showTip(data);
    });
    emits('hover', data);
};
const mouseleave = id => {
    ChartDataViewRefs.value.forEach(item => {
        item?.hideTip(id);
    });
    emits('mouseleave', id);
};
const showTip = data => {
    ChartDataViewRefs.value.forEach(item => {
        item?.showTip(data);
    });
};
const hideTip = id => {
    ChartDataViewRefs.value.forEach(item => {
        item?.hideTip(id);
    });
};
const sytleLine = (data, i) => {
    return { backgroundColor: data.show ? ECHART_COLORS[i % ECHART_COLORS.length] : '#ccc' };
};
const sytleLine2 = (data, i) => {
    let style = { padding: 0 };
    if (i === 1) {
        return {
            ...style,
            background: data.show
                ? 'repeating-linear-gradient(90deg, var(--gray-600), var(--gray-600) 2px, var(--gray-0) 2px, var(--gray-0) 4px)'
                : 'repeating-linear-gradient(90deg, #ccc, #ccc 2px, var(--gray-0) 2px, var(--gray-0) 4px)'
        };
    }
    return { ...style, background: data.show ? 'var(--gray-600)' : '#ccc' };
};
const finished = () => {
    emits('finished');
};
const getXPositons = () => {
    return ChartDataViewRefs.value[0].convertToPixel();
};
defineExpose({ showTip, hideTip, getXPositons });
onMounted(() => {
    chartData.value = structuredClone(props.data);
});
</script>
<style lang="less" scoped>
.system-data {
    display: flex;
    flex-direction: column;
}
.chart-title {
    padding: 0 24px;
    padding-left: 0;

    &-name {
        min-width: max-content;
    }
    &-legend {
        flex: 1;
        &-box {
            flex: 1;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: end;
        }
    }
}
.chart-item {
    flex: 1;
    padding-bottom: 8px;
    display: flex;
    flex-direction: column;
    &:nth-child(2) {
        margin-top: 8px;
    }
}
.chart-view {
    height: 100%;
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    &-content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    &-tip {
        position: absolute;
        top: 24px;
        left: 60px;
        height: calc(100% - 48px);
        width: calc(100% - 88px);
    }
}
.chart-view-name {
    width: 100%;
    padding: 0 24px;
    padding-left: 0;
    white-space: nowrap;
    &-legend {
        flex-wrap: wrap;
        justify-content: end;
        gap: 12px;
    }
    &-text-unit {
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}
</style>
