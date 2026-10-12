<template>
    <div class="right">
        <m-scrollbar :height="'100%'" content-class="timetable-edit-right-scroll-content" style="width: 100%; padding: 16px 24px 16px 16px">
            <m-list-skeleton v-if="loading" style="width: 100%" />
            <template v-else>
                <div class="header">
                    <div class="title-container">
                        <div class="left-border"></div>
                        <div v-ellipsis class="title">{{ i18n.global.t('meos_control_web.reference_info') }}</div>
                    </div>
                    <m-date-picker
                        v-if="canUseDatePick"
                        v-model="curSelDate"
                        :disabled="isEdit"
                        :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                        :width="160"
                        :clearable="false"
                        :scope="scopeTime"
                    ></m-date-picker>
                </div>
                <template v-if="canUseDatePick">
                    <template v-if="isAirZone">
                        <div v-if="supplyStrategy" class="supply-detail">
                            <div class="supply-detail-header">{{ supplyStrategy.localName ?? '--' }}</div>
                            <dataItemView :class-code="supplyStrategy.classCode" :list="supplyStrategy?.executeDetail?.strategyPlans"></dataItemView>
                        </div>
                        <div v-else class="empty">{{ i18n.global.t('meos_control_web.no_content') }}</div>
                    </template>
                    <template v-else-if="consoleType">
                        <div class="chart">
                            <Linechart :chart-info="chartInfo"></Linechart>
                        </div>
                        <div class="split-line"></div>
                        <div class="weather-wrap">
                            <div class="title">{{ i18n.global.t('meos_control_web.weather_forecast_data') }}</div>
                            <div v-if="isInNext14Day" class="next14-day">{{ i18n.global.t('meos_control_web.outdoor_weather_14_days_only') }}</div>
                            <div v-else class="detail">
                                <div class="item">
                                    <div class="label">{{ i18n.global.t('meos_control_web.weather_phenomenon') }}</div>
                                    <div class="val">{{ weatherData?.textDay ?? '--' }}</div>
                                </div>
                                <div class="item">
                                    <div class="label">{{ i18n.global.t('meos_control_web.today_temp_range') }}</div>
                                    <div class="val">{{ tempScope }}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <div v-else class="invalid-msg">
                    <template v-if="isAirZone">{{ i18n.global.t('meos_control_web.please_select_schedule_start_date_left') }}</template>
                    <template v-else>{{ i18n.global.t('meos_control_web.select_start_date_to_show_price_weather') }}</template>
                </div>
            </template>
        </m-scrollbar>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { baseDataKey } from '@/views/System-Heat-Source/hooks/useTimetableEditor';
import { CONSOLE_TYPES, SYSTEM_CLASS_CODE } from '@/views/System-Heat-Source/constant/variable';
import dataItemView from '../dataItemView.vue';
import Linechart from './linechart.vue';
import baseStore from '@/store/baseStore';
import { currentSystemKey } from '@/views/System-Heat-Source/hooks/useBaseHook';
import { listStrategy } from '@/apis/ACAC';
import { queryWeatherService } from '@/apis/public';
import { getCurrentElectricityInfo } from '@/apis/configUse';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { isEmptyNoReturn } from '@/utils/tools';
import { dayjsIsAfter, dayTz } from '@/utils/dayjsTools';
const props = defineProps({
    consoleType: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    objectId: {
        type: String,
        default: ''
    }
});
const baseData = inject(baseDataKey);
const currentSystem = inject(currentSystemKey);
const curSelDate = ref('');
const dataUseCancelToken = UseCancelTokenHooks();
const chartInfo = reactive({
    inited: false,
    xData: [],
    yData: [],
    setName: i18n.global.t('meos_control_web.electricity_price'),
    setUnit: i18n.global.t('meos_control_web.yuan'),
    title: i18n.global.t('meos_control_web.electricity_price_trend')
});

// 供冷策略（空调分区查询）
const supplyStrategy = ref();
const weatherData = ref();
const reset = () => {
    supplyStrategy.value = null;
    weatherData.value = null;
    chartInfo.xData = [];
    chartInfo.yData = [];
};

const canUseDatePick = computed(() => {
    return !!baseData?.value?.beginDate;
});

const tempScope = computed(() => {
    if (!isEmptyNoReturn(weatherData.value?.low) && !isEmptyNoReturn(weatherData.value?.high)) {
        return `${weatherData.value?.low}℃～${weatherData.value?.high}℃`;
    }
    return '--';
});
// 是空调分区
const isAirZone = computed(() => {
    return props.consoleType === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id;
});
const isInNext14Day = computed(() => {
    const next14Day = dayTz().add(14, 'day');
    const selDay = dayjs(curSelDate.value);
    // return selDay.isAfter(next14Day);
    return dayjsIsAfter(selDay, next14Day);
});
const scopeTime = computed(() => {
    if (!canUseDatePick.value) {
        return '';
    }
    const bTime = dayjs(baseData?.value?.beginDate).format('YYYY.MM.DD'),
        eTime = dayjs(baseData?.value?.endDate).format('YYYY.MM.DD');

    return `${bTime}-${eTime}`;
});
// 查询空冷时间表
const queryStrategy = async () => {
    const d = dayjs(curSelDate.value).format('YYYY-MM-DD');
    const params = {
        projectId: baseStore().projectId,
        consoleType: CONSOLE_TYPES.HEAT_SUPPLY.id,
        systemType: SYSTEM_CLASS_CODE,
        objectId: currentSystem.value.systemId,
        beginDate: d,
        endDate: d
    };
    try {
        const { data, code } = await listStrategy(params, { cancelToken: dataUseCancelToken.cancelToken() });
        if (code === SUCCESSCODE) {
            supplyStrategy.value = null;
            if (data?.length) {
                supplyStrategy.value = data[0].executeObjects?.find(obj => obj.consoleType === CONSOLE_TYPES.HEAT_SUPPLY.id);
            }
        }
    } catch (e) {
        supplyStrategy.value = null;
    }
};
// 查天气
const queryWeatherOfDay = async () => {
    const d = dayjs(curSelDate.value).format('YYYY-MM-DD');
    try {
        const { data, code } = await queryWeatherService(d, { cancelToken: dataUseCancelToken.cancelToken() });
        weatherData.value = data;
    } catch (e) {
        weatherData.value = null;
    }
};
// 查询电价
const queryElectricityValues = async () => {
    const startTime = dayjs(curSelDate.value).format('YYYY-MM-DD HH:mm:ss');
    const endTime = dayjs(curSelDate.value).add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
    const params = {
        projectId: baseStore().projectId,
        startTime,
        endTime
    };
    const makeDefaultXData = () => {
        const xData = [];
        if (curSelDate.value) {
            let curTime = dayjs(curSelDate.value);
            for (let i = 0; i < 96; i++) {
                xData.push(curTime.format('YYYY-MM-DD HH:mm:ss'));
                curTime = curTime.add(15, 'minutes');
            }
        }
        return xData;
    };
    try {
        const { data, code } = await getCurrentElectricityInfo(params);
        if (code === SUCCESSCODE) {
            // 图表数据
            let { elecDataList } = data,
                xData = [],
                yData = [];
            elecDataList?.forEach(item => {
                xData.push(item.dataTime);
                yData.push(item.dataValue);
            });
            if (xData.length === 0) {
                xData = makeDefaultXData();
            }
            chartInfo.xData = xData;
            chartInfo.yData = yData?.filter(v => v !== undefined);
            chartInfo.inited = true;
            // console.log('chartInfo: ', chartInfo, xData);
        }
    } catch (e) {
        chartInfo.xData = makeDefaultXData();
        chartInfo.yData = [];
    }
};
watch([() => curSelDate?.value, () => props.consoleType], () => {
    if (curSelDate.value) {
        reset();
        dataUseCancelToken.cancelQuest();
        if (isAirZone.value) {
            queryStrategy();
        } else {
            if (!isInNext14Day.value) {
                queryWeatherOfDay();
            }
            queryElectricityValues();
        }
    }
});
watch(
    () => baseData?.value?.beginDate,
    () => {
        if (baseData?.value?.beginDate) {
            curSelDate.value = baseData?.value?.beginDate;
        }
    }
);
</script>
<style>
.timetable-edit-right-scroll-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    align-self: stretch;
    height: 100%;
}
</style>
<style lang="less" scoped>
.right {
    display: flex;
    width: 340px;
    height: 100%;

    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    align-self: stretch;
    overflow: hide;
    background: var(--gray-50, #f7f9fa);
    .header {
        display: flex;
        gap: 9px;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        .title-container {
            display: flex;
            align-items: center;
            gap: 9px;
            min-width: 0;
            .left-border {
                width: 3px;
                height: 14px;
                background: var(--blue-500, #246fe5);
            }
            .title {
                color: var(--gray-800, #2e3742);
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .chart {
        display: flex;
        height: 232px;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
    }
    .split-line {
        width: 100%;
        height: 1px;
        border-bottom: 1px dashed #c4c9cf;
    }

    .weather-wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        align-self: stretch;
        .title {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-weight: 700;
            line-height: 22px; /* 157.143% */
        }
        .detail {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            align-self: stretch;
            .item {
                display: flex;
                align-items: flex-start;
                gap: 20px;

                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
                .label {
                    color: var(--gray-600, #646c73);
                }
                .val {
                    color: var(--gray-600, #1f2429);
                }
            }
        }
        .next14-day {
            width: 100%;
            display: flex;
            height: 54px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            align-self: stretch;
            border-radius: 4px;
            background: rgba(196, 201, 207, 0.12);
            color: var(--gray-500, #8b949e);
        }
    }

    .invalid-msg {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex: 1 0 0;
        align-self: stretch;

        color: var(--gray-600, #626c78);
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
    .supply-detail {
        width: 100%;
        flex: 1;
        display: flex;
        padding-left: 12px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        &-header {
            display: flex;
            width: 100%;
            padding: 8px;
            justify-content: start;
            align-items: center;
            gap: 10px;
            border-radius: 4px;
            background: linear-gradient(90deg, rgba(196, 201, 207, 0.3) 0%, rgba(99, 102, 105, 0) 100%);
        }
    }
    .empty {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex: 1 0 0;
    }
}
</style>
