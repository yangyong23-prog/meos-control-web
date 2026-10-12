<template>
    <div>
        <div class="label-title">
            <div class="label-left">{{ props.title }}</div>
        </div>
        <div class="checkbox-container">
            <m-form-item
                :prop="props.propKey"
                label=""
                label-width="0px"
                :rules="[
                    {
                        validator: (_value, _rule, callback) => validatorCheckbox(callback),
                        trigger: ['blur', 'change']
                    }
                ]"
            >
                <m-checkbox-group v-model="weekNumbers">
                    <div class="checkbox-group">
                        <template v-for="item in WEEK_OPTIONS" :key="item.value">
                            <m-tips
                                :content="i18n.global.t('meos_control_web.week_number_configured')"
                                :disabled="!(props.allWeekNumbers.includes(item.value) && !weekNumbers.includes(item.value))"
                                theme="darkTransparent"
                                placement="bottom"
                            >
                                <m-checkbox
                                    :label="item.value"
                                    :disabled="props.allWeekNumbers.includes(item.value) && !weekNumbers.includes(item.value)"
                                    @change="handleCheckChange"
                                    >{{ item.label }}</m-checkbox
                                >
                            </m-tips>
                        </template>
                    </div>
                </m-checkbox-group>
            </m-form-item>
        </div>
        <TimeRangeMultiple
            v-model="rangeList"
            v-model:switch="rangeSwitch"
            :title="i18n.global.t('meos_control_web.business_time_slot')"
            :single-width="props.singleWidth"
            :icon-size="props.iconSize"
            :prop-key="`${props.propKey}-range-list`"
            @all-change="handleTimeRangeChange"
        ></TimeRangeMultiple>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import TimeRangeMultiple from './TimeRangeSelectorWith24/FormItemMultiple.vue';
import { WEEK_OPTIONS } from '../constants';
import { nanoid } from 'nanoid';

const props = defineProps({
    title: {
        type: String,
        default: i18n.global.t('meos_control_web.week_number_configuration_label')
    },
    propKey: {
        type: String,
        default: ''
    },
    allWeekNumbers: {
        type: Array,
        default: () => []
    },
    singleWidth: {
        type: Number,
        default: 192
    },
    iconSize: {
        type: String,
        default: '32px'
    }
});
const emits = defineEmits(['change']);
const weekNumbers = defineModel('week-numbers', { type: Array, default: [] });
const rangeList = defineModel('range-list', { type: Array, default: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }] });
const rangeSwitch = defineModel('switch', { type: String, default: 'checked', validator: value => ['checked', 'uncheck'].includes(value) });

const validatorCheckbox = callback => {
    if (weekNumbers.value.length === 0) {
        callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_4')));
    } else {
        callback();
    }
};
const handleTimeRangeChange = (type, val) => {
    emits('change', type, val);
};
const handleCheckChange = val => {
    emits('change', 'week-numbers', val);
};
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
        &::after {
            display: inline-block;
            position: absolute;
            width: 7px;
            top: -2px;
            right: -10px;
            content: '*';
            color: #f55047;
            font-size: 10px;
        }
    }
}
.checkbox-container {
    :deep(.m-form-item .m-form-item__content) {
        min-height: 24px;
    }
}
.checkbox-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 16px;
}
</style>
