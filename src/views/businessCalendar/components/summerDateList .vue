<template>
    <m-form-item
        label=""
        label-width="0px"
        prop="itemDate"
        class="form-box"
        :rules="[
      {
        validator: (value: any, rule: any, callback: any) => validateList(callback),
        trigger: ['change']
      }
    ]"
    >
        <div class="cold-box form-item-box">
            <slot></slot>
            <div class="form-item-box-left ft f14 mt8">{{ title + ' : ' }}</div>
            <div class="form-item-box-right">
                <m-form-item
                    v-for="(item, i) in list"
                    :key="item.id"
                    label=""
                    label-width="1px"
                    :prop="'item.' + code + i + '.value'"
                    :item-model="item.value"
                    :rules="[
                        {
                        validator: (value: any, rule: any, callback: any) => validateListItem(callback, item),
                        trigger: ['change']
                        }
                    ]"
                >
                    <m-tips :disabled="!disabled" placement="top" :content="i18n.global.t('meos_control_web.only_available_in_summer_period')" theme="darkTransparent">
                        <div>
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
                                :start-panel-default-date="startDefaultDate"
                                :end-panel-default-date="endDefaultDate"
                                :scope="scopeDateRange()"
                                :disabled="disabled"
                                @change="changeDate(i)"
                            />
                        </div>
                    </m-tips>
                    <m-tips :disabled="list.length == 1" placement="top" :content="i18n.global.t('common.delete')" theme="darkTransparent">
                        <m-button v-if="list.length > 1" type="icon" icon="IconMeriActionDelete" class="ml10" @click="deleteItem(list, i)" />
                    </m-tips>
                </m-form-item>
                <m-tips v-if="list.length < 5" :content="i18n.global.t('meos_control_web.selected_time_covers_full_year')" :disabled="!isAllYear" theme="darkTransparent" placement="bottom">
                    <div class="fcc link-btn" :class="{ disabled: isAllYear }" @click="createItem(list)">
                        <IconMeriComponentButtonAdd :size="14" :color="isAllYear ? 'var(--gray-400)' : 'var(--blue-500)'" />&nbsp;{{ i18n.global.t('meos_control_web.add') }}
                    </div>
                </m-tips>
            </div>
        </div>
    </m-form-item>
</template>

<script lang="ts" setup>
import { PropType, Ref } from 'vue';
import { ListItem, Params } from '../types';
import { uniqueId } from 'lodash';
import { IconMeriComponentButtonAdd } from 'meri-icon';
import dayjs from 'dayjs';
// @ts-ignore
import i18n from '@/localization';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsBetween, dayjsIsSame } from '@/utils/dayjsTools';

const props = defineProps({
    list: {
        type: Array as PropType<ListItem[]>,
        default: () => []
    },
    otherList: {
        type: Array as PropType<ListItem[]>,
        default: () => []
    },
    title: {
        type: String,
        default: ''
    },
    code: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: 458
    }
});
const Form: any = inject('Form');
const params: Ref<any> = inject('params', ref<any>({}));
const temporaryRestriction: any = inject('temporaryRestriction');
const disabled: any = ref(false);
const startDefaultDate = ref('');
const endDefaultDate = ref('');
const isAllYear = computed(() => {
    let number = 0;
    startDefaultDate.value = '';
    endDefaultDate.value = '';
    // 用props传过来的值去做判断
    // const list = [...params.value.warmList, ...params.value.coldList]
    const list = [...props.list, ...props.otherList];
    list.forEach(item => {
        if (item.value) {
            const start = item.value.split('-')[0];
            const end = item.value.split('-')[1];
            number = number + (dayjs(end).diff(start, 'day', true) + 1);
        }
    });
    return number === 365 || number === 366;
});
const scopeDateRange = () => {
    let minDate: any = null,
        maxDate: any = null;
    temporaryRestriction.value.forEach((item: any) => {
        // const start = '2024.' + item.value.split('-')[0];
        // const end = '2024.' + item.value.split('-')[1];
        const [startStr, endStr] = item.value.split('-');
        // 将日期字符串转换为 dayjs 对象
        if (startStr && endStr) {
            const startDate = dayjs(`2024-${startStr?.replace('.', '-')}`);
            const endDate = dayjs(`2024-${endStr?.replace('.', '-')}`);
            // 更新最小日期
            if (!minDate || dayjsIsBefore(dayjs(startDate), minDate)) {
                minDate = startDate;
            }
            // 更新最大日期
            if (!maxDate || dayjsIsAfter(dayjs(endDate), maxDate)) {
                maxDate = endDate;
            }
        }
    });

    //夏季都为空 夏季高峰禁用处理
    const allValuesEmpty = temporaryRestriction.value.every((item: any) => item.value === '');
    disabled.value = allValuesEmpty ? true : false;
    if (maxDate?.format('MM') !== '12' && minDate?.format('MM') === maxDate?.format('MM')) {
        // eslint-disable-next-line radix
        const num = parseInt(maxDate?.format('MM'), 10);
        const newNum = num + 1;
        startDefaultDate.value = minDate?.format('MM');
        endDefaultDate.value = newNum.toString();
    } else if (maxDate?.format('MM') === '12' && minDate?.format('MM') === maxDate?.format('MM')) {
        // eslint-disable-next-line radix
        const num = parseInt(maxDate?.format('MM'), 10);
        const newNum = num - 1;
        startDefaultDate.value = newNum.toString();
        endDefaultDate.value = maxDate?.format('MM');
    } else {
        startDefaultDate.value = minDate?.format('MM');
        endDefaultDate.value = maxDate?.format('MM');
    }
    return `${minDate?.format('MM.DD')}` + `-${maxDate?.format('MM.DD')}`;
};
const parseDateRange = (range: any) => {
    const [start, end] = range.split('-');
    if (start && end) {
        return {
            start: new Date(`2024-${start?.replace('.', '-')}`),
            end: new Date(`2024-${end?.replace('.', '-')}`)
        };
    }
};
const isRangeWithin = (range: any, containerRange: any) => {
    return range?.start >= containerRange?.start && range?.end <= containerRange?.end;
};
watch(
    () => temporaryRestriction.value,
    () => {
        props.list.forEach(bItem => {
            const bRange = parseDateRange(bItem.value);
            let isWithin = false;

            temporaryRestriction.value.forEach((aItem: any) => {
                const aRange = parseDateRange(aItem.value);
                if (isRangeWithin(bRange, aRange)) {
                    isWithin = true;
                }
            });

            if (!isWithin) {
                bItem.value = '';
            }
        });
        console.log(props.list, ' props.list');
    },
    {
        immediate: true,
        deep: true
    }
);

const validateList = (callback: any) => {
    //不做为空验证
    callback();

    // const data = props.list.find(item => item.value !== '')
    // if (data||props.title=='店庆日') {
    //   callback()
    // } else {
    //   callback(new Error('必填项，至少填写一个'))
    // }
};

const validateListItem = (callback: any, data: ListItem) => {
    if (data.value) {
        const year = '2024.'; //闰年非闰年问题 所以加上年份
        const dataStart = year + data.value.split('-')[0];
        const dataEnd = year + data.value.split('-')[1];
        const timeList = props.list.filter(item => item.id !== data.id);
        let flag = false,
            text = '';
        // eslint-disable-next-line no-restricted-syntax
        for (const item of timeList) {
            if (item.value) {
                const start = year + item.value.split('-')[0];
                const end = year + item.value.split('-')[1];
                console.log(dataStart, dataEnd, start, end);
                if (dayjsIsBetween(dayjs(dataStart), start, end)) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                }
                if (dayjsIsBetween(dayjs(dataEnd), start, end)) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                }
                if (dayjsIsSame(dayjs(dataEnd), dayjs(start)) || dayjsIsSame(dayjs(dataEnd), dayjs(end))) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                }
                if (dayjsIsSame(dayjs(dataStart), dayjs(start)) ||dayjsIsSame(dayjs(dataStart), dayjs(end))) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                }
                if (dayjsIsBefore(dayjs(dataStart), dayjs(start)) && dayjsIsAfter(dayjs(dataEnd), dayjs(end))) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                }
            }
        }
        if (flag) {
            callback(new Error(text));
        } else {
            callback();
        }
    } else {
        callback();
    }
};
const createItem = (data: ListItem[]) => {
    if (isAllYear.value) {
        return;
    }
    data.push({
        value: '',
        id: uniqueId('item')
    });
};
const deleteItem = (data: ListItem[], i: number) => {
    data.splice(i, 1);
    if (props.code) {
        const _props: any[] = [];
        Object.keys(params?.value?.obj).forEach(k => {
            params?.value?.obj[k].forEach((v: any, idx: number) => {
                _props.push(`item.${k}${idx}.value`);
            });
        });
        Form.validateField(_props);
    } else {
        props.list.forEach((item, j) => {
            if (i !== j) {
                Form.validateField([`item.${j}.value`]);
            }
        });
    }
};
const changeDate = (i: number) => {
    Form.validateField(['data']);
    if (props.code) {
        const _props: any[] = [];
        Object.keys(params?.value?.obj).forEach(k => {
            params?.value?.obj[k].forEach((v: any, idx: number) => {
                _props.push(`item.${k}${idx}.value`);
            });
        });
        Form.validateField(_props);
    } else {
        props.list.forEach((item, j) => {
            if (i !== j) {
                Form.validateField([`item.${j}.value`]);
            }
        });
    }
};
</script>
<style lang="less" scoped>
.form-item-box {
    // padding: 16px 12px;
    border-radius: 4px;
    height: 100%;
    // display: grid;
    grid-template-columns: 122px auto;
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
        // margin-top: -4px;
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
        height: 22px;
        margin-bottom: 7px;
    }
    &-right {
    }
}
</style>
