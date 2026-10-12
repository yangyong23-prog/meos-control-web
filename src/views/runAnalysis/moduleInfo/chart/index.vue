<template>
    <div class="module-info-chart h100">
        <div v-for="(item, i) in batchQueryPeriodData" :key="item.id" class="chart-box">
            <div v-if="noHover" class="chart-box-no-hover wh100"></div>
            <ChartData :ref="getRef" :data="item" @hover="data => hoverLine(data, i)" @mouseleave="mouseleave" @finished="finished">
                <template #title>
                    <slot name="title"></slot>
                </template>
                <template #legend>
                    <slot name="legend"></slot>
                </template>
            </ChartData>
        </div>
    </div>
</template>

<script setup>
import ChartData from './ChartData.vue';
const props = defineProps({
    batchQueryPeriodData: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: ''
    },
    noHover: {
        type: Boolean,
        default: false
    }
});
const ChartDataRefs = ref([]);
const getRef = data => {
    if (props.batchQueryPeriodData.length !== ChartDataRefs.value.length) {
        ChartDataRefs.value.push(data);
    }
};
const emits = defineEmits(['finished']);
const hoverLine = (data, i) => {
    ChartDataRefs.value.forEach((item, index) => {
        if (i === index) {
            return;
        }
        item?.showTip(data);
    });
};
const mouseleave = id => {
    ChartDataRefs.value.forEach(item => {
        item?.hideTip(id);
    });
};
const getXPositons = () => {
    return ChartDataRefs.value[0].getXPositons();
};
const finished = () => {
    emits('finished');
};
defineExpose({
    hoverLine,
    mouseleave,
    getXPositons
});
onMounted(() => {});
</script>
<style lang="less" scoped>
.module-info-chart {
    border-left: 1px solid var(--gray-200);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    :deep(.m-scrollbar__bar.is-vertical) {
        z-index: 11;
    }
    .chart-box + .chart-box {
        border-top: 8px solid var(--gray-200);
    }
    .chart-box {
        flex: 1;
        position: relative;
        &:last-child {
            padding-bottom: 16px;
        }
    }
    .chart-box-no-hover {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
    }
    &::-webkit-scrollbar {
        width: 6px !important;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #fff !important;
    }
    &:hover {
        &::-webkit-scrollbar-thumb {
            background-color: rgba(196, 201, 207, 0.8) !important;
        }
    }
}
</style>
