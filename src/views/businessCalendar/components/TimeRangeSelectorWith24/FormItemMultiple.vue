<template>
    <div class="label-title" :style="{ width: `${computedRowWidth}px` }">
        <div class="label-left">{{ props.title }}</div>
        <div class="label-right">
            <m-switch v-model="showRangeSwitch" size="small" @change="handleSwitchChange"> </m-switch>
            <span>{{ showRangeSwitch === 'checked' ? i18n.global.t('meos_control_web.business') : i18n.global.t('meos_control_web.closed') }}</span>
        </div>
    </div>
    <div v-show="showRangeSwitch === 'checked'" class="all-rows">
        <template v-for="(row, index) in timeRangeList" :key="row.key">
            <div class="time-row">
                <FormItemSingle
                    :ref="ins => (allFormItemInstances[index] = ins)"
                    v-model="row.rowTimeRange"
                    v-model:list="timeRangeList"
                    :prop-key="row.key"
                    :row-key="row.key"
                    :row-index="index"
                    :check-strictly="props.checkStrictly"
                    :single-width="props.singleWidth"
                    :required="showRangeSwitch === 'checked'"
                    @row-change="val => handleChange(val, row)"
                ></FormItemSingle>
                <m-tips :disabled="timeRangeList.length === 1" :content="i18n.global.t('common.delete')" placement="top" theme="darkTransparent">
                    <m-button v-if="timeRangeList.length > 1" type="icon" icon="IconMeriActionDelete" class="delete-btn-icon" @click="deleteItem(row)" />
                </m-tips>
            </div>
        </template>
    </div>
    <m-tips
        v-if="timeRangeList.length < 5"
        :content="i18n.global.t('meos_control_web.selected_time_covers_full_day')"
        :disabled="!isAllDay"
        theme="darkTransparent"
        placement="bottom"
    >
        <div v-show="showRangeSwitch === 'checked'" class="btn-icon" :class="{ disabled: isAllDay }" @click="addTimeRange">
            <IconMeriComponentButtonAdd :size="14" :color="isAllDay ? 'var(--gray-400)' : 'var(--blue-500)'" />&nbsp;{{ i18n.global.t('meos_control_web.add') }}
        </div>
    </m-tips>
    <div v-show="showRangeSwitch === 'uncheck'" class="no-config-container" :style="{ width: `${computedRowWidth}px` }">
        {{ i18n.global.t('meos_control_web.business_hours_ranges_none') }}
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { IconMeriComponentButtonAdd } from 'meri-icon';
import FormItemSingle from './FormItemSingle.vue';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsSame } from '@/utils/dayjsTools';

const props = defineProps({
    propKey: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    checkStrictly: {
        type: Boolean,
        default: true
    },
    singleWidth: {
        type: Number,
        default: 208
    },
    iconSize: {
        type: String,
        default: '24px'
    }
});
const emits = defineEmits(['row-change', 'row-add', 'row-delete', 'switch-change', 'all-change']);
const timeRangeList = defineModel({ type: Array, default: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `range-single-${nanoid()}` }] });
const showRangeSwitch = defineModel('switch', { type: String, default: 'checked', validator: val => ['checked', 'uncheck'].includes(val) });
const allFormItemInstances = ref([]);

const computedRowWidth = computed(() => {
    return props.singleWidth * 2 + 24;
});

const validateAll = () => {
    allFormItemInstances.value?.forEach(c => {
        c?.validate();
    });
};

const handleAllChangeEvents = (type, val) => {
    emits('all-change', type, val);
};

const handleChange = (val, row) => {
    emits('row-change', val, row);
    handleAllChangeEvents('row-change', { row, val });
    validateAll();
};
const handleSwitchChange = val => {
    emits('switch-change', val);
    handleAllChangeEvents('switch-change', { val });
};

const isAllDay = computed(() => {
    const oneDayMinutes = 1440;
    let accMinutes = 0;
    timeRangeList.value.forEach(row => {
        const { rowTimeRange } = row;
        const { startTime, endTime } = rowTimeRange;
        if (startTime && endTime) {
            const today = getDayjsTz().format('YYYY-MM-DD');
            const start = dayjs(`${today} ${startTime}`);
            const end = dayjs(`${today} ${endTime}`);
            const curDiff = end.diff(start, 'minute');
            accMinutes = accMinutes + curDiff;
        }
    });
    return accMinutes > oneDayMinutes - 1;
});

const deleteItem = row => {
    const list = timeRangeList.value.filter(it => it.key !== row.key);
    if (list.length === 0) {
        return;
    }

    timeRangeList.value = list;
    emits('row-delete', row);
    handleAllChangeEvents('row-delete', { row });
    nextTick(() => {
        validateAll();
    });
};
const addTimeRange = () => {
    if (isAllDay.value) {
        return;
    }
    const newId = nanoid();
    const row = {
        key: `add-range-${newId}`,
        rowTimeRange: { startTime: '', endTime: '' }
    };
    const newItems = [...timeRangeList.value, row];
    timeRangeList.value = newItems;
    emits('row-add', row);
    handleAllChangeEvents('row-add', { row });
};

const isOverlap = (range1, range2) => {
    const [range1Start, range1End] = range1;
    const [range2Start, range2End] = range2;
    const isABeforeB = dayjsIsBefore(range1Start, range2End) && dayjsIsBefore(range2Start, range1End);
    const isBBeforeA = dayjsIsBefore(range2Start, range1End) && dayjsIsBefore(range1Start, range2End);
    const isRepeat = isABeforeB || isBBeforeA;
    return isRepeat;
};
const checkAllErrorArr = (arr = []) => {
    const today = getDayjsTz().format('YYYY-MM-DD');

    const allTimes = [];
    const errorArr = [];

    arr.forEach((row, index) => {
        const { rowTimeRange: range, key } = row;
        const { startTime, endTime } = range;
        if (startTime && endTime) {
            const start = dayjs(`${today} ${startTime}`);
            const end = dayjs(`${today} ${endTime}`);
            allTimes.push({ key, index, range: [start, end] });
        }
    });

    if (allTimes.length === 1) {
        const [rangeStart, rangeEnd] = allTimes[0].range;
        const hasError = dayjsIsAfter(rangeStart, rangeEnd) || dayjsIsSame(rangeStart, rangeEnd);
        if (hasError) {
            errorArr.push({ message: i18n.global.t('meos_control_web.start_time_cannot_gte_end_time'), repeatKeys: [allTimes[0].key], indexes: [allTimes[0].index] });
        }
    } else if (allTimes.length > 1) {
        for (let i = 0; i < allTimes.length - 1; i++) {
            for (let j = i + 1; j < allTimes.length; j++) {
                const time1 = allTimes[i];
                const time2 = allTimes[j];
                // 判断两个时间段是否有交集
                const [start1, end1] = time1.range;
                const [start2, end2] = time2.range;

                const isSameRange = dayjsIsSame(start1, start2) && dayjsIsSame(end1, end2);
                const isSameStartOrEnd = dayjsIsSame(start1, end2) || dayjsIsSame(end1, start2);
                const isOverlapping = isOverlap(time1.range, time2.range);

                if (props.checkStrictly) {
                    if (isSameRange || isSameStartOrEnd || isOverlapping) {
                        errorArr.push({
                            message: i18n.global.t('meos_control_web.coincides_with_selected_time_slot_please_check'),
                            repeatKeys: [time1.key, time2.key],
                            indexes: [time1.index, time2.index]
                        });
                    }
                } else {
                    if (isSameRange || isOverlapping) {
                        errorArr.push({
                            message: i18n.global.t('meos_control_web.coincides_with_selected_time_slot_please_check'),
                            repeatKeys: [time1.key, time2.key],
                            indexes: [time1.index, time2.index]
                        });
                    }
                }
            }
        }
    }

    return errorArr;
};

defineExpose({ checkAllErrorArr });
</script>

<style lang="less" scoped>
.label-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label-left {
        color: var(--gray-600);
        margin-bottom: 8px;

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
    .label-right {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: 4px;
        margin-bottom: 8px;
    }
}
:deep(.m-form-item__content) {
    display: flex;
    flex-direction: column;
    align-items: start;
}

.all-rows {
    display: flex;
    flex-direction: column;
}

.time-row {
    display: flex;
    align-items: center;
}

.delete-btn-icon {
    margin-left: 8px;
    margin-bottom: 16px;
    width: v-bind('props.iconSize');
    height: v-bind('props.iconSize');
}

.btn-icon {
    display: flex;
    align-items: center;

    color: var(--blue-500);
    width: fit-content;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    height: 32px;

    &.disabled {
        color: var(--gray-400);
        background-color: transparent;
        cursor: not-allowed;
    }
    &:hover {
        background-color: var(--gray-300);
    }
    &.disabled {
        color: var(--gray-400);
        background-color: transparent;
        cursor: not-allowed;
    }
}
.no-config-container {
    display: flex;
    padding: 5px 0;
    justify-content: center;
    align-items: center;

    border-radius: 4px;
    border: 1px solid v#c4c9cf;
    background: #e8ecf0;

    color: #8b949e;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
}
</style>
