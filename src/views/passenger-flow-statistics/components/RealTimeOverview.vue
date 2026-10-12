<template>
    <div ref="parentTargetRef" class="realtime-overview-content">
        <div class="content-container">
            <TitleWithPrefix :title="i18n.global.t('meos_control_web.passenger_flow_statistics')" />
            <div class="statistics-chart-container">
                <div class="card-statistics">
                    <div class="card-icon">
                        <PassengerFlowGroupIcon />
                    </div>
                    <div class="card-detail">
                        <div class="card-number">{{ finalVal }}</div>
                        <div class="card-desc">{{ i18n.global.t('meos_control_web.current_occupancy') }}</div>
                    </div>
                </div>
                <div class="line-chart-container">
                    <div class="chart-title">{{ i18n.global.t('meos_control_web.realtime_passenger_trend') }}</div>
                    <div class="chart-content">
                        <LineChart :statistic="props?.lineData" />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="props.showBg && !hideImg" class="extra-bg">
            <img class="bg" src="@/assets/imgs/passengerFlowBg.png" />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
import { extractAndFormatNumber } from '@/utils';
import TitleWithPrefix from '../components/TitleWithPrefix.vue';
import PassengerFlowGroupIcon from '@/assets/imgs/passengerFlow.svg';
import LineChart from '../components/LineChart.vue';

const props = defineProps({
    showBg: {
        type: Boolean,
        default: true
    },
    totalCount: {
        type: Number,
        default: null
    },
    lineData: {
        type: Array,
        default: () => []
    }
});

const parentTargetRef = ref(null);
const hideImg = ref(false);

useResizeObserver(parentTargetRef, entries => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    if (height < 618) {
        hideImg.value = true;
    } else {
        hideImg.value = false;
    }
});

const finalVal = computed(() => {
    const total = props?.totalCount;
    const res = ['number', 'string'].includes(typeof total) ? extractAndFormatNumber(`${total}`) : '--';
    return res;
});
</script>

<style lang="less" scoped>
.realtime-overview-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    row-gap: 12px;
}

.content-container {
    display: flex;
    flex-direction: column;
}

.statistics-chart-container {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}

.card-statistics {
    width: 100%;
    height: 76px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    column-gap: 24px;
    border-radius: 4px;
    background: #f4f8ff;

    .card-icon {
        width: 44px;
        height: 44px;
    }

    .card-detail {
        display: flex;
        flex-direction: column;
        row-gap: 2px;
    }

    .card-number {
        color: @grey-800;
        font-family: 'Persagy2.0';
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 28px;
    }

    .card-desc {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}

.line-chart-container {
    display: flex;
    flex-direction: column;
    row-gap: 16px;

    .chart-title {
        padding-inline: 12px;
    }

    .chart-content {
        height: 220px;
    }
}

.extra-bg {
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: 352px;
    min-height: 193px;
}

.bg {
    position: absolute;
    bottom: 0;
    left: 0;
    max-width: 100%;
    height: auto;
    object-fit: cover;
    // transform: translateY(12px);
}

@media (max-width: 1600px) {
    .bg {
        max-width: 352px;
    }
}
@media (min-width: 1600px) {
    .bg {
        min-width: 394px;
    }
}
</style>
