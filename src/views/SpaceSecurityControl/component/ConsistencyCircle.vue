<template>
    <div class="consistency-circle" :style="bgStyle">
        <div v-if="!loading" ref="chartDom" class="chart-dom"></div>
        <div v-if="!loading && !empty" class="circle-describe">
            <p class="num">{{ ratio }}%</p>
            <p class="num-info">{{ i18n.global.t('meos_control_web.demand_consistency') }}</p>
        </div>
        <div v-if="empty" class="empty-info">{{ i18n.global.t('meos_control_web.no_global_demand') }}</div>
        <div v-if="loading" class="loading">
            <div id="consistency-circle-loading-dom" class="loading-icon"></div>
            <span>{{ i18n.global.t('meos_control_web.demand_consistency_calculating') }}</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import * as echarts from 'echarts';
import { isNumber } from 'lodash';
import { MLoading } from 'meri-plus';

const props = defineProps({
    ratio: {
        type: Number,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const chartDom = ref();

let chart = null,
    loadingHandler = null;

const empty = computed(() => {
    return !isNumber(props.ratio);
});

const bgStyle = computed(() => {
    if (props.loading || empty.value) {
        return {
            background: 'linear-gradient(90deg, rgba(148, 148, 148, 0.12) 0%, rgba(148, 148, 148, 0.04) 100%)'
        };
    }

    if (props.ratio >= 100) {
        return {
            background: 'linear-gradient(90deg, rgba(60, 199, 120, 0.08) 0%, rgba(60, 199, 120, 0.02) 100%)'
        };
    }
    return {
        background: 'linear-gradient(90deg, rgba(255, 130, 125, 0.12) 0%, rgba(255, 130, 125, 0.04) 100%)'
    };
});

const updateChart = () => {
    nextTick(() => {
        chart = echarts.init(chartDom.value);
        let data = [];
        if (empty.value) {
            data = [
                {
                    value: 100,
                    itemStyle: {
                        color: '#D5D9DE'
                    }
                }
            ];
        } else {
            data = [
                {
                    value: props.ratio,
                    itemStyle: {
                        color: '#91DCB3'
                    }
                },
                {
                    value: 100 - props.ratio,
                    itemStyle: {
                        color: '#F8766F'
                    }
                }
            ];
        }

        const staticOption = {
            series: [
                {
                    type: 'pie',
                    radius: ['66.66%', '100%'],
                    labelLine: {
                        show: false
                    },
                    emphasis: {
                        disabled: true
                    },
                    data
                }
            ]
        };

        chart.setOption(staticOption);
    });
};

watch(
    [() => props.loading, () => props.ratio],
    () => {
        if (props.loading) {
            chart?.clear();
        } else {
            updateChart();
        }
    },
    {
        immediate: true
    }
);

watch(
    () => props?.loading,
    () => {
        nextTick(() => {
            loadingHandler?.destroy?.();
            if (props.loading) {
                loadingHandler = MLoading.service({
                    target: '#consistency-circle-loading-dom',
                    fullscreen: false,
                    duration: 30000,
                    lottieName: 'circle',
                    background: 'transparent',
                    loadIconStyle: {
                        width: '160px',
                        height: '160px'
                    }
                });
            }
        });
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    chart?.dispose();
    loadingHandler?.destroy?.();
    chartDom.value = null;
});
</script>
<style lang="less" scoped>
.consistency-circle {
    width: 100%;
    height: 86px;
    border-radius: 8px;
    padding: 16px 12px;
    display: flex;
    gap: 12px;
    align-items: center;

    .chart-dom {
        width: 50px;
        height: 50px;
        :deep(canvas) {
            cursor: default;
        }
    }

    .circle-describe {
        display: flex;
        flex-direction: column;
        gap: 4px;
        .num {
            color: var(--gray-800);
            font-size: 28px;
            font-weight: 700;
            line-height: 100%;
            text-align: ;
            font-family: 'CustomMedium2', 'Persagy2.0';
        }
        .num-info {
            color: var(--gray-500);
            font-size: 14px;
            list-style: 22px;
        }
    }

    .loading {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--gray-600);

        .loading-icon {
            width: 32px;
            height: 32px;
        }
    }
    .empty-info {
        color: var(--gray-600);
    }
}
</style>
