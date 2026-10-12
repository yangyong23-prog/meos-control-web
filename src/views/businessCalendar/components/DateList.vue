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
                        @change="changeDate(i)"
                        @clear="clear()"
                    />
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
import { ListItem } from '../types';
import { uniqueId } from 'lodash';
import { IconMeriComponentButtonAdd } from 'meri-icon';
import dayjs from 'dayjs';
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
const isAllYear = computed(() => {
    let number = 0;
    // 用props传过来的值去做判断
    // const list = [...params.value.warmList, ...params.value.coldList]
    const list = [...props.list, ...props.otherList];
    // console.log(list);
    list.forEach(item => {
        if (item.value) {
            const start = item.value.split('-')[0];
            const end = item.value.split('-')[1];
            number = number + (dayjs(`2024.${end}`).diff(`2024.${start}`, 'day', true) + 1);
        }
    });
    return number === 366;
});
const emits = defineEmits(['item-selected']);
const clear = () => {
    emits('item-selected', props.code);
};
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
                // console.log(start, end, 'start');
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
                if (dayjsIsSame(dayjs(dataStart), dayjs(start)) || dayjsIsSame(dayjs(dataStart), dayjs(end))) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                }
                if (dayjsIsBefore(dayjs(dataStart), dayjs(start)) && dayjsIsAfter(dayjs(dataEnd), dayjs(end))) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                }
            }
        }
        if (!flag) {
            // eslint-disable-next-line no-restricted-syntax
            for (const item of props.otherList) {
                if (item.value) {
                    const start = year + item.value.split('-')[0];
                    const end = year + item.value.split('-')[1];
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
                    if (dayjsIsSame(dayjs(dataStart), dayjs(start)) || dayjsIsSame(dayjs(dataStart), dayjs(end))) {
                        flag = true;
                        text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                    }
                    if (dayjsIsBefore(dayjs(dataStart), dayjs(start)) && dayjsIsAfter(dayjs(dataEnd), dayjs(end))) {
                        flag = true;
                        text = i18n.global.t('meos_control_web.overlaps_with_selected_time_slot_please_check');
                    }
                }
            }
        }

        if (flag) {
            callback(new Error(text));
        } else {
            if (
                (props.code === 'airSummerRangeList' ||
                    props.code === 'airWinterRangeList' ||
                    props.code === 'airSeasonSpringRangeList' ||
                    props.code === 'airSeasonAutumnRangeList') &&
                !isAllYear.value
            ) {
                console.log(props.code);
                text = i18n.global.t('meos_control_web.hvac_season_period_not_full_year_check');
                callback(new Error(text));
            } else {
                callback();
            }
        }
    } else {
        callback();
    }
};
const createItem = (data: ListItem[]) => {
    if (isAllYear.value) {
        return;
    }
    emits('item-selected', props.code);
    data.push({
        value: '',
        id: uniqueId('item')
    });
};
const validateFieldFuc = () => {
    if (props.code === 'coldList' || props.code === 'warmList' || props.code === 'anniversaries') {
        const _props: any[] = [];
        Object.keys(params?.value).forEach(k => {
            if (k === 'warmList' || k === 'coldList' || k === 'anniversaries') {
                params?.value[k].forEach((v: any, idx: number) => {
                    console.log(`item.${k}${idx}.value`);
                    _props.push(`item.${k}${idx}.value`);
                });
            }
        });
        Form.validateField(_props);
    } else {
        const _props: any[] = [];
        Object.keys(params?.value?.obj).forEach(k => {
            params?.value?.obj[k].forEach((v: any, idx: number) => {
                _props.push(`item.${k}${idx}.value`);
            });
        });
        Form.validateField(_props);
    }
};
const deleteItem = (data: ListItem[], i: number) => {
    data.splice(i, 1);
    emits('item-selected', props.code);
    validateFieldFuc();
};
const changeDate = (i: number) => {
    // Form.validateField(['data']);
    emits('item-selected', props.code);
    validateFieldFuc();
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
