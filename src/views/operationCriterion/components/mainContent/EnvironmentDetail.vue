<template>
    <div class="environmental-quality-detail">
        <div class="environmental-quality-item">
            <LineDetail :list="temperatureList" type="temperature" />
            <LineInfo v-if="temperatureLineInfo" :data="temperatureLineInfo" />
        </div>
        <div class="environmental-quality-item">
            <LineDetail :list="carbonDioxideList" type="co2" />
            <LineInfo v-if="carbonLineInfo" :data="carbonLineInfo" />
        </div>
        <div v-if="humidityList?.length" class="environmental-quality-item">
            <LineDetail :list="humidityList" type="humidity" />
        </div>
        <div v-if="pressureDiffData?.length" class="environmental-quality-item">
            <LineDetail :list="pressureDiffData" type="pressureDiff" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import LineDetail from './LineDetail.vue';
import LineInfo from './LineInfo.vue';
import { transformTimesToView } from '@/views/operationCriterion/utils';
const props = defineProps({
    config: {
        type: Object,
        default: () => {}
    }
});

const temperatureList = computed(() => {
    if (props.config && props.config.tdbQuality && props.config.tdbQuality.seasonQuality) {
        const tempList = props.config.tdbQuality.seasonQuality.find(seasonQuality => seasonQuality.airSeason === props.config.seasonType);
        if (tempList) {
            return [
                { name: i18n.global.t('meos_control_web.temperature_overcold_threshold'), value: tempList.underCoolingSeasonLimitValue },
                { name: i18n.global.t('meos_control_web.temperature_comfort_zone_lower'), value: tempList.lowerComfortSeasonLimitValue },
                { name: i18n.global.t('meos_control_web.temperature_comfort_zone_upper'), value: tempList.upperComfortSeasonLimitValue },
                { name: i18n.global.t('meos_control_web.temperature_overheat_threshold'), value: tempList.overHeatingSeasonLimitValue }
            ];
        }
    }
    return [
        { name: i18n.global.t('meos_control_web.temperature_overcold_threshold'), value: '--' },
        { name: i18n.global.t('meos_control_web.temperature_comfort_zone_lower'), value: '--' },
        { name: i18n.global.t('meos_control_web.temperature_comfort_zone_upper'), value: '--' },
        { name: i18n.global.t('meos_control_web.temperature_overheat_threshold'), value: '--' }
    ];
});
const temperatureLineInfo = computed(() => {
    if (
        props.config &&
        props.config.tdbQuality &&
        (props.config.tdbQuality.temperatureScheduledHourInDay ||
            props.config.tdbQuality.temperatureContinuousScheduledHour ||
            props.config.tdbQuality.temperatureUnscheduledTimeRange)
    ) {
        return {
            hour1: props.config.tdbQuality.temperatureScheduledHourInDay ? props.config.tdbQuality.temperatureScheduledHourInDay + i18n.global.t('meos_control_web.hour') : '--',
            hour2: props.config.tdbQuality.temperatureContinuousScheduledHour
                ? props.config.tdbQuality.temperatureContinuousScheduledHour + i18n.global.t('meos_control_web.hour')
                : '--',
            range:
                props.config.tdbQuality.temperatureUnscheduledTimeRange && props.config.tdbQuality.temperatureUnscheduledTimeRange.length
                    ? transformTimesToView(props.config.tdbQuality.temperatureUnscheduledTimeRange).join('&nbsp;&nbsp;')
                    : props.config.participateInScheduling !== 'NON_SCHEDULE'
                    ? i18n.global.t('meos_control_web.all_day_schedulable')
                    : '--'
        };
    }
    return null;
});

const defaultHumidityList = [
    { name: i18n.global.t('meos_control_web.humidity_over_dry_threshold'), value: '--' },
    { name: i18n.global.t('meos_control_web.humidity_comfort_zone_lower_limit'), value: '--' },
    { name: i18n.global.t('meos_control_web.humidity_comfort_zone_upper_limit'), value: '--' },
    { name: i18n.global.t('meos_control_web.humidity_over_wet_threshold'), value: '--' }
];

const humidityList = computed(() => {
    if (props?.config?.rhQuality?.seasonQuality && props?.config?.seasonType) {
        const tempList = props.config.rhQuality.seasonQuality.find(seasonQuality => seasonQuality?.airSeason === props.config?.seasonType);
        if (tempList) {
            return [
                { name: i18n.global.t('meos_control_web.humidity_over_dry_threshold'), value: tempList.underCoolingSeasonLimitValue },
                { name: i18n.global.t('meos_control_web.humidity_comfort_zone_lower_limit'), value: tempList.lowerComfortSeasonLimitValue },
                { name: i18n.global.t('meos_control_web.humidity_comfort_zone_upper_limit'), value: tempList.upperComfortSeasonLimitValue },
                { name: i18n.global.t('meos_control_web.humidity_over_wet_threshold'), value: tempList.overHeatingSeasonLimitValue }
            ];
        } else {
            return [];
        }
    }
    return defaultHumidityList.value;
});

const pressureDiffData = computed(() => {
    if (props?.config?.pressureDiffQuality?.isPressureDiffQualityEnabled) {
        const configData = props.config?.pressureDiffQuality || {};
        return [
            { name: i18n.global.t('meos_control_web.pressure_diff_lower_limit_value'), value: configData.lowerLimitValue ?? '--' },
            { name: i18n.global.t('meos_control_web.pressure_diff_upper_limit_value'), value: configData.upperLimitValue ?? '--' }
        ];
    }
    return [];
});

const carbonDioxideList = computed(() => {
    if (props.config && props.config.co2Quality && (props.config.co2Quality.carbonDioxideLimitValue || props.config.co2Quality.carbonDioxideUpperLimitValue)) {
        const tempList = props.config.co2Quality;
        if (tempList) {
            return [
                { name: i18n.global.t('meos_control_web.co2_comfort_zone_upper_limit'), value: tempList.carbonDioxideLimitValue },
                { name: i18n.global.t('meos_control_web.co2_high_threshold'), value: tempList.carbonDioxideUpperLimitValue }
            ];
        }
    }
    return [
        { name: i18n.global.t('meos_control_web.co2_comfort_zone_upper_limit'), value: '--' },
        { name: i18n.global.t('meos_control_web.co2_high_threshold'), value: '--' }
    ];
});

const carbonLineInfo = computed(() => {
    if (
        props.config &&
        (props.config.co2Quality?.carbonDioxideScheduledHourInDay ||
            props.config.co2Quality?.carbonDioxideContinuousScheduledHour ||
            props.config.co2Quality?.carbonDioxideUnscheduledTimeRange?.length)
    ) {
        return {
            hour1: props.config.co2Quality.carbonDioxideScheduledHourInDay
                ? props.config.co2Quality.carbonDioxideScheduledHourInDay + i18n.global.t('meos_control_web.hour')
                : '--',
            hour2: props.config.co2Quality.carbonDioxideContinuousScheduledHour
                ? props.config.co2Quality.carbonDioxideContinuousScheduledHour + i18n.global.t('meos_control_web.hour')
                : '--',
            range:
                props.config.co2Quality.carbonDioxideUnscheduledTimeRange && props.config.co2Quality.carbonDioxideUnscheduledTimeRange.length
                    ? transformTimesToView(props.config.co2Quality.carbonDioxideUnscheduledTimeRange).join('&nbsp;&nbsp;')
                    : props.config.participateInScheduling !== 'NON_SCHEDULE'
                    ? i18n.global.t('meos_control_web.all_day_schedulable')
                    : '--'
        };
    }
    return null;
});
</script>
<style lang="less" scoped>
.environmental-quality-detail {
    display: grid;
    grid-template-columns: repeat(2, minmax(472px, 1fr));
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    gap: 20px 80px;
    .environmental-quality-item {
        width: 100%;
        max-width: 100%;
        position: relative;
        display: flex;
        flex-grow: 0;
        flex-direction: column;
        gap: 20px;
    }
}
</style>
