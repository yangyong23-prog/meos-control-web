<template>
    <div>
        <div class="label-title">
            <div class="label-left">{{ props.title }}：</div>
        </div>

        <m-form-item
            ref="currentFormDateInstance"
            label=""
            label-width="0px"
            :prop="`${props.groupId}-date-range`"
            :rules="[
                {
                    validator: (value, rule, callback) => validateListItem(callback),
                    trigger: ['blur', 'change']
                }
            ]"
        >
            <m-date-picker
                v-model="dateRange"
                class="mb8"
                clearable
                type="daterange"
                :popover-attrs="{
                    arrowOverflow: false
                }"
                :scope="dateScope"
                :placeholder="i18n.global.t('meos_control_web.start_year_date_to_end_year_date')"
                format="YYYY.MM.DD"
                :width="240"
                placement="bottomRight"
                range-separator=" - "
                @change="changeDate"
            />
        </m-form-item>

        <TimeRangeMultiple
            v-model="rangeList"
            v-model:switch="rangeSwitch"
            :title="i18n.global.t('meos_control_web.business_time_slot')"
            :single-width="props.singleWidth"
            :icon-size="props.iconSize"
            :prop-key="`${props.groupId}-range-list`"
            @all-change="handleTimeRangeChange"
        ></TimeRangeMultiple>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import TimeRangeMultiple from './TimeRangeSelectorWith24/FormItemMultiple.vue';
import { nanoid } from 'nanoid';
import { dayjsIsSameOrBefore, dayjsIsSameOrAfter } from '@/utils/dayjsTools';
import { getDayjsTz } from '@/utils/globalVariables';

const props = defineProps({
    title: {
        type: String,
        default: i18n.global.t('meos_control_web.please_select_date_range')
    },
    groupId: {
        type: String,
        default: ''
    },
    singleWidth: {
        type: Number,
        default: 152
    },
    iconSize: {
        type: String,
        default: '24px'
    }
});
const emits = defineEmits(['change']);
const allGroup = defineModel('all-group', { type: Array, default: () => [] });
const dateRange = defineModel('date-range', { type: String, default: '' });
const rangeList = defineModel('range-list', { type: Array, default: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }] });
const rangeSwitch = defineModel('switch', { type: String, default: 'uncheck', validator: value => ['checked', 'uncheck'].includes(value) });

const dateScope = `${getDayjsTz().add(1, 'day').format('YYYY.MM.DD')}-${getDayjsTz().add(20, 'year').format('YYYY.MM.DD')}`;
const currentFormDateInstance = ref(null);

const changeDate = val => {
    emits('change', `special-date-range`, val);
};

const handleTimeRangeChange = (type, val) => {
    emits('change', `special-${type}`, val);
};

const validateListItem = callback => {
    if (!dateRange.value) {
        callback();
        return;
    }
    const [dataStart, dataEnd] = dateRange.value.split('-') || [];

    const otherDateRangeList = allGroup.value.filter(v => v?.groupId !== props.groupId && v?.dateRange);
    const hasOverlap = otherDateRangeList.some(item => {
        const [otherStart, otherEnd] = item.dateRange.split('-') || [];
        if (!otherStart || !otherEnd) return false;
        // 包含端点的重叠检查
        return dayjsIsSameOrBefore(dataStart, otherEnd) && dayjsIsSameOrAfter(dataEnd, otherStart);
    });

    if (hasOverlap) {
        callback(new Error(i18n.global.t('meos_control_web.overlaps_with_selected_date_slot_please_check')));
    } else {
        callback();
    }
};
defineExpose({
    validate: () => currentFormDateInstance?.value?.validate?.()
});
</script>

<style lang="less" scoped>
.label-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    .label-left {
        color: var(--gray-600);

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        position: relative;
    }
}
</style>
