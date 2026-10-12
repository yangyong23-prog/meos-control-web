<script setup>
import { IconMeriComponentButtonAdd } from 'meri-icon';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import i18n from '@/localization';
import { dayjsIsSameOrBefore, dayjsIsSameOrAfter } from '@/utils/dayjsTools';

const props = defineProps({
    code: {
        type: String,
        default: ''
    },
    maxCount: {
        type: Number,
        default: 50
    },
    width: {
        type: Number,
        default: 458
    },
    title: {
        type: String,
        default: ''
    }
});
// 选取闰年作为标准比较
const leapYear = '2024';

const allFormItemInstances = ref([]);

const rangeList = defineModel('rangeList', { type: Array, default: () => [] });

const isAllYear = computed(() => {
    let totalDays = 0;
    for (const item of rangeList.value) {
        if (item.value && typeof item.value === 'string') {
            const dateParts = item.value.split('-');
            if (dateParts.length !== 2) {
                continue; // 跳过格式不正确的日期范围
            }

            const [start, end] = dateParts;
            if (!start || !end) {
                continue; // 跳过空值
            }
            try {
                const startDate = dayjs(`${leapYear}.${start}`);
                const endDate = dayjs(`${leapYear}.${end}`);

                const diffDays = endDate.diff(startDate, 'day', true);
                totalDays += diffDays + 1;
            } catch (error) {
                // 忽略无效日期格式，继续处理下一个
                continue;
            }
        }
    }
    return totalDays === 366;
});

const getValidateErrorString = data => {
    if (!data?.value || !data?.id) {
        return '';
    }
    const [start, end] = data.value.split('-') || [];
    const dataStart = `${leapYear}.${start}`;
    const dataEnd = `${leapYear}.${end}`;

    const otherRangeList = rangeList.value.filter(v => v?.id !== data.id && v?.value);
    const hasOverlap = otherRangeList.some(item => {
        const [otherStartStr, otherEndStr] = item.value.split('-');
        if (!otherStartStr || !otherEndStr) return false;

        const otherStart = dayjs(`${leapYear}.${otherStartStr}`);
        const otherEnd = dayjs(`${leapYear}.${otherEndStr}`);

        // 包含端点的重叠检查
        return dayjsIsSameOrBefore(dataStart, otherEnd) && dayjsIsSameOrAfter(dataEnd, otherStart);
    });

    if (hasOverlap) {
        return i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
    } else {
        return '';
    }
};
const validateListItem = (callback, data) => {
    const errorString = getValidateErrorString(data);
    if (errorString) {
        callback(new Error(errorString));
    } else {
        callback();
    }
};

const validateAllFields = () => {
    allFormItemInstances.value?.forEach(c => {
        c?.validate();
    });
};

const createItem = () => {
    if (isAllYear.value) {
        return;
    }

    rangeList.value = [
        ...rangeList.value,
        {
            value: '',
            id: nanoid()
        }
    ];
};
const deleteItem = delId => {
    const preList = [...rangeList.value];
    rangeList.value = preList.filter(v => v?.id !== delId);
    nextTick(() => {
        validateAllFields();
    });
};

const changeDate = () => {
    validateAllFields();
};

onMounted(() => {
    if (rangeList.value.length === 0) {
        createItem();
    }
});
</script>

<template>
    <div class="cold-box form-item-box">
        <slot></slot>
        <div class="form-item-box-left ft f14 mt8">{{ props.title }}</div>
        <div class="form-item-box-right">
            <template v-for="(item, index) in rangeList" :key="item.id">
                <m-form-item
                    :ref="ins => (allFormItemInstances[index] = ins)"
                    :prop="`${item.id}.${code}.${index}`"
                    label=""
                    label-width="0px"
                    :rules="[
                        {
                            validator: (value, rule, callback) => validateListItem(callback, item),
                            trigger: ['blur', 'change']
                        }
                    ]"
                >
                    <m-date-picker
                        v-model="item.value"
                        clearable
                        year-select-hide
                        type="daterange"
                        :popover-attrs="{
                            'popover-class': 'popoverClass',
                            arrowOverflow: false
                        }"
                        :placeholder="i18n.global.t('meos_control_web.start_time_end_time')"
                        format="MM.DD"
                        :width="width"
                        placement="bottomRight"
                        range-separator=" - "
                        @change="changeDate"
                    />
                    <m-tips :disabled="rangeList.length == 1" placement="top" :content="i18n.global.t('common.delete')" theme="darkTransparent">
                        <m-button v-if="rangeList.length > 1" type="icon" icon="IconMeriActionDelete" class="ml10" @click="deleteItem(item.id)" />
                    </m-tips>
                </m-form-item>
            </template>
            <m-tips
                v-if="rangeList.length < props.maxCount"
                :content="i18n.global.t('meos_control_web.selected_time_covers_full_year')"
                :disabled="!isAllYear"
                theme="darkTransparent"
                placement="bottom"
            >
                <div class="fcc link-btn" :class="{ disabled: isAllYear }" @click="createItem">
                    <IconMeriComponentButtonAdd :size="14" :color="isAllYear ? 'var(--gray-400)' : 'var(--blue-500)'" />&nbsp;{{ i18n.global.t('meos_control_web.add') }}
                </div>
            </m-tips>
        </div>
    </div>
</template>

<style scoped lang="less">
.form-box.m-form-item {
    margin-bottom: 0px;
}
.form-item-box {
    border-radius: 4px;
    height: 100%;

    width: 100%;
    position: relative;
    & + .form-item-box {
        margin-top: 16px;
    }
    .link-btn {
        color: var(--blue-500);
        width: max-content;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: var(--gray-300);
        }
        &.disabled {
            color: var(--gray-400);
            background-color: transparent;
            cursor: not-allowed;
        }
    }
    &-left {
        display: block;
        margin-bottom: 7px;
    }
    &-right {
        width: 100%;
    }
}
</style>
