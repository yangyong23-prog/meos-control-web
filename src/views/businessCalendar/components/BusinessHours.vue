<template>
    <div>
        <div class="ft f14 mb12">{{ props.title }}：</div>
        <div :id="BUSINESS_CONFIG_DOM_CONTAINER" class="mb8">
            <m-radio-group v-model="currentRadio">
                <div class="list">
                    <m-radio v-for="item in radioOptions" :key="item" class="f14" :label="item.value" @change="handleConfigWay">{{ item.label }}</m-radio>
                </div>
            </m-radio-group>
        </div>
        <template v-if="currentRadio === BUSINESS_CONFIG_TYPE.Default">
            <TimeRangeMultiple
                v-model="allList"
                v-model:switch="allSwitch"
                :title="i18n.global.t('meos_control_web.business_time_slot')"
                :prop-key="'business-hours-default'"
                :single-width="props.singleWidth"
                :icon-size="props.iconSize"
                @all-change="(type, val) => handleTimeRangeChange(type, val, 'business-hours-default')"
            ></TimeRangeMultiple>
        </template>

        <template v-else-if="currentRadio === BUSINESS_CONFIG_TYPE.Workday">
            <TimeRangeMultiple
                v-model="workDayList"
                v-model:switch="workDaySwitch"
                :title="i18n.global.t('meos_control_web.weekday_business_hours')"
                :prop-key="`${props.propsKey}-work-day`"
                :single-width="props.singleWidth"
                :icon-size="props.iconSize"
                @all-change="(type, val) => handleTimeRangeChange(type, val, `work-day`)"
            ></TimeRangeMultiple>
            <div class="get-line mt8 mb8"></div>
            <TimeRangeMultiple
                v-model="dayOffList"
                v-model:switch="dayOffSwitch"
                :title="i18n.global.t('meos_control_web.rest_day_business_hours')"
                :prop-key="`${props.propsKey}-day-off`"
                :single-width="props.singleWidth"
                :icon-size="props.iconSize"
                @all-change="(type, val) => handleTimeRangeChange(type, val, `day-off`)"
            ></TimeRangeMultiple>
        </template>
        <template v-else>
            <WeekNumberConfig v-model="weekNumberGroupsList" :single-width="props.weekNumberSingleWidth" :icon-size="props.iconSize" @change="handleWeekNumberChange" />
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { nanoid } from 'nanoid';
import TimeRangeMultiple from './TimeRangeSelectorWith24/FormItemMultiple.vue';
import { BUSINESS_CONFIG_RADIO_OPTIONS, BUSINESS_CONFIG_TYPE } from '../constants';
import WeekNumberConfig from './WeekNumberConfig.vue';
import { BUSINESS_CONFIG_DOM_CONTAINER } from '../constants';

const props = defineProps({
    propsKey: {
        type: String,
        default: ''
    },
    singleWidth: {
        type: Number,
        default: 219
    },
    iconSize: {
        type: String,
        default: '32px'
    },
    title: {
        type: String,
        default: ''
    },
    weekNumberSingleWidth: {
        type: Number,
        default: 192
    }
});

const currentRadio = defineModel('radio', {
    type: String,
    default: BUSINESS_CONFIG_TYPE.Default,
    validator: val => [BUSINESS_CONFIG_TYPE.Default, BUSINESS_CONFIG_TYPE.Workday, BUSINESS_CONFIG_TYPE.Week].includes(val)
});
const allList = defineModel('all', { type: Array, default: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `full-year-${nanoid()}` }] });
const workDayList = defineModel('work-day', { type: Array, default: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `work-day-${nanoid()}` }] });
const dayOffList = defineModel('day-off', { type: Array, default: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `day-off-${nanoid()}` }] });
const allSwitch = defineModel('all-switch', { type: String, default: 'checked', validator: val => ['checked', 'uncheck'].includes(val) });
const workDaySwitch = defineModel('work-day-switch', { type: String, default: 'checked', validator: val => ['checked', 'uncheck'].includes(val) });
const dayOffSwitch = defineModel('day-off-switch', { type: String, default: 'checked', validator: val => ['checked', 'uncheck'].includes(val) });
const weekNumberGroupsList = defineModel('week-number-groups-list', {
    type: Array,
    default: () => [
        { groupId: `group-${nanoid()}`, weekNumbers: [], rangeSwitch: 'checked', rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }] }
    ]
});
const emits = defineEmits(['change']);

const radioOptions = ref(BUSINESS_CONFIG_RADIO_OPTIONS);

const handleWeekNumberChange = (type, val) => {
    emits('change', `week-number-config-${type}`, val);
};
const handleTimeRangeChange = (type, val, parentType) => {
    emits('change', `${parentType}-${type}`, val);
};
const handleConfigWay = val => {
    emits('change', `business-way-radio`, val);
};
</script>
<style lang="less" scoped>
.get-line {
    height: 1px;
    width: 100%;
    border-top: 1px dashed #c4c9cf;
}
</style>
