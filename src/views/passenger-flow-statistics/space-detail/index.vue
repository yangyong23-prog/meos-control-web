<template>
    <m-scrollbar box-class="right-space-detail-wrapper">
        <m-list-skeleton v-if="loading" />
        <div v-else class="right-space-detail-container">
            <div class="row">
                <TitleWithPrefix :title="i18n.global.t('meos_control_web.today_cumulative_entry_exit_count')" />
                <div class="cards">
                    <div class="left">
                        <div class="count">{{ computedAmount(inFlowToday) }}</div>
                        <div class="label">{{ i18n.global.t('meos_control_web.today_entry_count') }}</div>
                    </div>
                    <div class="right">
                        <div class="count">{{ computedAmount(outFlowToday) }}</div>
                        <div class="label">{{ i18n.global.t('meos_control_web.today_exit_count') }}</div>
                    </div>
                </div>
                <div class="chart-name">{{ i18n.global.t('meos_control_web.hourly_entry_exit_count') }}</div>
                <div class="chart-container">
                    <BarChart :show-series="true" :in-series="inChartData" :out-series="outChartData" />
                </div>
            </div>
        </div>
    </m-scrollbar>
</template>

<script setup>
import i18n from '@/localization';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import TitleWithPrefix from '../components/TitleWithPrefix.vue';
import { extractAndFormatNumber } from '@/utils';
import BarChart from '../components/BarChart.vue';
import { listInfoCodeConfigsByObjectCommon } from '@/apis/public';
import { DETAIL, IOT_RUNNING, PASSENGER_FLOW } from '@/utils/globalVariables';

const props = defineProps({
    spaceDetail: {
        type: Object,
        default: () => {}
    }
});

const spaceId = computed(() => {
    return props.spaceDetail.id;
});
const loading = ref(false);
const abnormalEventList = ref([]);
const queryListAbortController = ref();

const currentCount = ref({});
const lineChartData = ref({});
const todayInCount = ref({});
const todayOutCount = ref({});
const barChartInData = ref({});
const barChartOutData = ref({});

const computedAmount = computed(() => count => {
    const res = ['number', 'string'].includes(typeof count) && count?.toString() ? extractAndFormatNumber(`${count}`) : '--';
    return res;
});

const inFlowToday = computed(() => {
    const res = todayInCount?.value?.relInfoCodeConfigs?.find(v => v?.infoCode === 'accmInPeopleFlow');
    return res?.dataValue ? Math.round(res?.dataValue) : res?.dataValue;
});

const outFlowToday = computed(() => {
    const res = todayOutCount?.value?.relInfoCodeConfigs?.find(v => v?.infoCode === 'accmOutPeopleFlow');
    return res?.dataValue ? Math.round(res?.dataValue) : res?.dataValue;
});

const inChartData = computed(() => {
    const res = barChartInData?.value?.relInfoCodeConfigs?.find(v => v?.infoCode === 'accdInPeopleFlow');
    return res?.dataValue;
});

const outChartData = computed(() => {
    const res = barChartOutData?.value?.relInfoCodeConfigs?.find(v => v?.infoCode === 'accdOutPeopleFlow');
    return res?.dataValue;
});

const clearPreData = () => {
    abnormalEventList.value = [];
    currentCount.value = {};
    lineChartData.value = {};
    todayInCount.value = {};
    todayOutCount.value = {};
    barChartInData.value = {};
    barChartOutData.value = {};
};

const initModule = async id => {
    queryListAbortController.value?.abort?.();
    clearPreData();
    loading.value = true;
    queryListAbortController.value = new AbortController();
    const params = { runningMonitorType: PASSENGER_FLOW, objectIds: [id], templateCode: DETAIL, notFilterIotInfoCodeRule: true };
    const res = await listInfoCodeConfigsByObjectCommon(params, queryListAbortController.value?.signal).finally(() => {
        loading.value = false;
    });
    if (res?.code === '00000') {
        const resData = res?.data || [];
        if (Array.isArray(resData) && resData?.length) {
            const temData = structuredClone(resData);
            temData[0]?.relInfoCodeGroupConfigs?.forEach(item => {
                if (item.groupCode === 'riskEvent') {
                    // "异常事件"
                    abnormalEventList.value = item?.relInfoCodeConfigs[0].dataValue || [];
                }
                if (item.groupCode === 'currentPassengerFlowStatistic') {
                    // "实时客流统计"
                    currentCount.value = {
                        relInfoCodeConfigs: item?.relInfoCodeConfigs || []
                    };
                    lineChartData.value = item?.groupChildren?.find(v => v?.groupCode === 'currentPassengerFlowStatisticTrend') || {};
                }
                if (item.groupCode === 'runningParameter') {
                    // "今日累计入出入场人数统计"
                    const inItem = item?.relInfoCodeConfigs?.find(v => v?.infoCodeType === IOT_RUNNING && v?.infoCode === 'accmInPeopleFlow') || {};
                    const outItem = item?.relInfoCodeConfigs?.find(v => v?.infoCodeType === IOT_RUNNING && v?.infoCode === 'accmOutPeopleFlow') || {};
                    todayInCount.value = {
                        relInfoCodeConfigs: [{ ...inItem }]
                    };
                    todayOutCount.value = {
                        relInfoCodeConfigs: [{ ...outItem }]
                    };
                }
                if (item.groupCode === 'cumulativePassengerFlowStatistics') {
                    // "今日累计入出入场人数统计"
                    // const inItem = item?.relInfoCodeConfigs?.find(v => v?.infoCodeType === 'IOT_RUNNING' && v?.infoCode === 'accmInPeopleFlow') || {};
                    // const outItem = item?.relInfoCodeConfigs?.find(v => v?.infoCodeType === 'IOT_RUNNING' && v?.infoCode === 'accmOutPeopleFlow') || {};
                    // console.log(inItem);
                    // todayInCount.value = {
                    //     relInfoCodeConfigs: [{ ...inItem }]
                    // };
                    // todayOutCount.value = {
                    //     relInfoCodeConfigs: [{ ...outItem }]
                    // };
                    const barChartItem = item?.groupChildren?.find(v => v?.groupCode === 'timeSlotEntryAndExitTrend') || {};
                    const inChartItem = barChartItem?.relInfoCodeConfigs?.find(v => v?.infoCodeType === 'IOT_PERSISTENCE_TREND' && v?.infoCode === 'accdInPeopleFlow') || {};
                    const outChartItem = barChartItem?.relInfoCodeConfigs?.find(v => v?.infoCodeType === 'IOT_PERSISTENCE_TREND' && v?.infoCode === 'accdOutPeopleFlow') || {};

                    barChartInData.value = {
                        relInfoCodeConfigs: [{ ...inChartItem }]
                    };
                    barChartOutData.value = {
                        relInfoCodeConfigs: [{ ...outChartItem }]
                    };
                }
            });
        }
    }
};

watch(
    () => spaceId?.value,
    cur => {
        if (cur) {
            initModule(cur);
        }
    },
    {
        immediate: true
    }
);

useEquipInfoSSEHandle(
    spaceId,
    {
        RISK_EVENT_DETAIL: abnormalEventList,
        iotCount: currentCount,
        lineChartData: lineChartData,
        todayInCount: todayInCount,
        todayOutCount: todayOutCount,
        barChartInData: barChartInData,
        barChartOutData: barChartOutData
    },
    false,
    DETAIL
);
</script>

<style lang="less" scoped>
:deep(.right-space-detail-wrapper) {
    padding: 12px 24px;
}
:deep(.abnormal-item) {
    margin-right: 0;
}
.right-space-detail-container {
    display: flex;
    flex-direction: column;
    row-gap: 32px;
}

.exception-list {
    // padding-right: 10px;
    &-item {
        position: relative;
        padding: 12px 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #fffbfb 0.85%, rgba(255, 255, 255, 0) 96.02%);
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    &-title {
        padding-left: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        line-clamp: 3;
    }
    &-title:before {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #f55047;
        border: 1px solid #fff;
        left: 10px;
        top: 18px;
    }
}
.exception-list-item:hover {
    cursor: pointer;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}
.equipment-good {
    width: 100%;
    padding: 12px 20px;
    background-color: #f7f9fa;
}

.cards {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    .left,
    .right {
        flex: 1;
        display: flex;
        padding: 12px;
        flex-direction: column;
        justify-content: center;
        border-radius: 4px;
        background: #f4f8ff;
    }

    .count {
        color: @grey-800;
        font-family: 'Persagy2.0';
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 28px;
    }

    .label {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}

.chart-name {
    width: 100%;
    padding-inline: 12px;
    margin-block: 12px;
    color: @grey-800;

    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}

.chart-container {
    max-width: 100%;
    height: 220px;
    position: relative;
}
</style>
