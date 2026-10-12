<template>
    <div class="system-data wh100">
        <div class="chart-title fs18 fcb">
            <div class="chart-title-name fw700" style="align-self: flex-start">{{ data.name }}&nbsp;<slot name="title"></slot></div>
            <div class="chart-title-legend h100 fc">
                <div class="chart-title-legend-box fc fs14">
                    <Legend
                        v-if="!objectIds.includes(systemId) && props.data.statisticalValue === undefined"
                        :list="data.objects"
                        :style-fun="sytleLine"
                        @item-click="item => objectClick(item, data)"
                    />
                </div>
                <slot name="legend"></slot>
            </div>
        </div>
        <div v-for="(value, index) in data.children" :key="value.id" class="chart-item">
            <div class="chart-view">
                <div class="chart-view-name fcb">
                    <span class="fw700 chart-view-name-text" style="align-self: flex-start; margin-bottom: 8px">
                        <span class="chart-view-name-text-name">{{ value.groupName }}</span>
                        <span class="chart-view-name-text-unit">{{ value.unit ? `（${value.unit}）` : '' }}</span
                        >&nbsp;
                    </span>
                    <div class="fc chart-view-name-legend">
                        <Legend
                            v-if="!objectIds.includes(systemId) && props.data.statisticalValue === undefined"
                            :list="value.infoCodes"
                            :style-fun="sytleLine2"
                            @item-click="item => infoCodeClick(item, value)"
                        />
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
                        :is-system="objectIds.includes(systemId)"
                        :no-hover="noHover"
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
import { systemIdKey } from '../../injectionKey';
import Legend from '../../components/Legend.vue';
const systemId = inject(systemIdKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const ChartDataViewRefs = ref([]);
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});
const objectIds = computed(() => props.data.objects.map(item => item.objectId));
const emits = defineEmits(['hover', 'mouseleave', 'finished']);
// const childrenGroup = computed(() => {
//     const children = [];
//     props.data.children.forEach(item => {
//         for (let i = 0; i < item.infoCodes.length; i += 2) {
//             const infoCodes = [];
//             if (item.infoCodes[i]) {
//                 infoCodes.push(item.infoCodes[i]);
//             }
//             if (item.infoCodes[i + 1]) {
//                 infoCodes.push(item.infoCodes[i + 1]);
//             }
//             const infoCodeStr = infoCodes.map(ite => ite.infoCode).join('-');
//             const echartData = item.echartData.filter(val => infoCodeStr.includes(val.infoCode));
//             children.push({ ...item, infoCodes, echartData });
//         }
//     });
//     return children;
// });
const getRef = data => {
    if (props.data.children.length !== ChartDataViewRefs.value.length) {
        ChartDataViewRefs.value.push(data);
    }
};
const objectClick = data => {
    const chartNameShow = {};
    data.show = !data.show;
    props.data.children.forEach(item => {
        item.infoCodes.forEach(val => {
            chartNameShow[val.infoCode + '&&' + (data.objectId || '--')] = data.show && val.show;
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
    const allFalse = props.data.objects.every(item => item.show === false);
    if (allFalse) {
        return;
    }
    ChartDataViewRefs.value.forEach(item => {
        const arr = props.data.objects.filter(val => val.show);
        arr.forEach(val => {
            item?.legendToggleSelectFun(infoCode.infoCode + '&&' + val.objectId, infoCode.show);
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
</script>
<style lang="less" scoped>
.system-data {
    display: flex;
    flex-direction: column;
}
.chart-title {
    padding: 12px 24px;
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
    flex: 1 1 200px;
    padding-bottom: 8px;
}
.chart-view {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    &-content {
        flex: 1;
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
