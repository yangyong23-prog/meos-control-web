<template>
    <m-form-item
        label=""
        label-width="0px"
        :prop="uniqueId('data')"
        class="form-box"
        :rules="[
      {
        validator: (value: any, rule: any, callback: any) => validateList(callback),
        trigger: ['change']
      }
    ]"
    >
        <div class="cold-box form-item-box" :class="{ noRange: !type }">
            <slot></slot>
            <div class="form-item-box-left">
                <slot v-if="$slots.title" name="title"></slot>
                <div v-else class="mb8">
                    {{ title + ' : ' }}
                    <!-- &nbsp;<span v-if="type && required" style="color: var(--red-500)">*</span> -->
                </div>
            </div>
            <div class="form-item-box-right">
                <template v-if="!use">
                    <m-form-item
                        v-for="(item, i) in list"
                        :key="'item.' + item.id"
                        label=""
                        label-width="1px"
                        :prop="'item.' + item.id"
                        :item-model="item.value"
                        :rules="[
              {
                validator: (value: any, rule: any, callback: any) => validateListItem(callback, item),
                trigger: ['change']
              }
            ]"
                    >
                        <m-time-picker
                            v-if="type"
                            v-model="item.value"
                            :placeholder="placeholder"
                            :disabled="stepM === 15 ? params.dispatch === '0' || params.dispatch === '3' : false"
                            range
                            :popover-attrs="{
                                arrowOverflow: false
                            }"
                            format="hm"
                            :step-m="stepM"
                            :hide-clear="hideClear"
                            :class="[isWidth ? 'w4' : 'w3']"
                            @change="changeDate(item, i)"
                        />
                        <template v-else>
                            <m-time-picker
                                v-model="item.openValue"
                                :placeholder="i18n.global.t('meos_control_web.start_time')"
                                format="hm"
                                :step-m="stepM"
                                :hide-clear="hideClear"
                                :popover-attrs="{
                                    arrowOverflow: false
                                }"
                                @change="
                                    () => {
                                        item.closeValue = '';
                                        changeDate(item, i);
                                    }
                                "
                            />
                            &nbsp;-&nbsp;
                            <m-time-picker
                                v-model="item.closeValue"
                                :scope-time="item.openValue ? item.openValue + '-' + '23:55' : ''"
                                :placeholder="i18n.global.t('meos_control_web.end_time')"
                                format="hm"
                                :step-m="stepM"
                                :hide-clear="hideClear"
                                @change="changeDate(item, i)"
                            />
                        </template>
                        <m-tips :disabled="list.length == 1" :content="i18n.global.t('common.delete')" placement="top" theme="darkTransparent">
                            <m-button v-if="list.length > 1" type="icon" icon="IconMeriActionDelete" class="ml10" @click="deleteItem(list, i)" />
                        </m-tips>
                    </m-form-item>
                </template>
                <m-tips
                    v-if="list.length < 5"
                    :content="i18n.global.t('meos_control_web.selected_time_covers_full_day')"
                    :disabled="!isAllDay"
                    theme="darkTransparent"
                    placement="bottom"
                >
                    <div class="fcc link-btn" :class="{ disabled: isAllDay, isUse: use }" @click="createItem(list)">
                        <IconMeriComponentButtonAdd :size="14" :color="isAllDay ? 'var(--gray-400)' : 'var(--blue-500)'" />&nbsp;{{ i18n.global.t('meos_control_web.add') }}
                    </div>
                </m-tips>
                <template v-if="use">
                    <m-form-item
                        v-for="(item, i) in useList"
                        :key="item.id + i"
                        label=""
                        label-width="1px"
                        :prop="'item.' + item.id"
                        :item-model="item.value"
                        :rules="[
              {
                validator: (value: any, rule: any, callback: any) => validateListItem(callback, item),
                trigger: ['change']
              }
            ]"
                    >
                        <m-tips :content="i18n.global.t('meos_control_web.reference_value')" theme="darkTransparent">
                            <m-time-picker
                                v-if="type"
                                v-model="item.value"
                                :placeholder="placeholder"
                                range
                                :popover-attrs="{
                                    arrowOverflow: false
                                }"
                                format="hm"
                                :step-m="stepM"
                                :hide-clear="hideClear"
                                disabled
                                @change="changeDate(item, i)"
                            />
                            <template v-else>
                                <div class="fc">
                                    <m-time-picker
                                        v-model="item.openValue"
                                        :placeholder="i18n.global.t('meos_control_web.start_time')"
                                        format="hm"
                                        :popover-attrs="{
                                            arrowOverflow: false
                                        }"
                                        :step-m="stepM"
                                        :hide-clear="hideClear"
                                        disabled
                                        @change="
                                            () => {
                                                item.closeValue = '';
                                                changeDate(item, i);
                                            }
                                        "
                                    />
                                    &nbsp;-&nbsp;
                                    <m-time-picker
                                        v-model="item.closeValue"
                                        :scope-time="item.openValue ? item.openValue + '-' + '23:55' : ''"
                                        :placeholder="i18n.global.t('meos_control_web.end_time')"
                                        format="hm"
                                        :popover-attrs="{
                                            arrowOverflow: false
                                        }"
                                        :step-m="stepM"
                                        :hide-clear="hideClear"
                                        disabled
                                        @change="changeDate(item, i)"
                                    />
                                </div>
                            </template>
                        </m-tips>
                    </m-form-item>
                </template>
            </div>
        </div>
    </m-form-item>
</template>

<script lang="ts" setup>
import { PropType, Ref } from 'vue';
import { ListItem, Params } from '../types';
import { orderBy, uniqueId } from 'lodash';
import { IconMeriComponentButtonAdd } from 'meri-icon';
import dayjs from 'dayjs';
import i18n from '@/localization';
import { dayjsIsBefore, dayjsIsBetween, dayjsIsSame } from '@/utils/dayjsTools';

const props = defineProps({
    list: {
        type: Array as PropType<ListItem[]>,
        default: () => []
    },
    useList: {
        type: Array as PropType<ListItem[]>,
        default: () => []
    },
    businessList: {
        type: Array as PropType<ListItem[]>,
        default: () => []
    },
    title: {
        type: String,
        default: ''
    },
    type: {
        type: Boolean,
        default: true
    },
    hideClear: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: i18n.global.t('meos_control_web.start_time_end_time')
    },
    stepM: {
        type: Number,
        default: 5
    },
    required: {
        type: Boolean,
        default: true
    },
    isUse: {
        type: Boolean,
        default: false
    },
    isReferenced: {
        type: Boolean,
        default: false
    },
    isWidth: {
        type: Boolean,
        default: true
    }
});
const Form: any = inject('Form');
const params: Ref<Params> = inject('params', ref<any>({}));
const instanceType: Ref<string> = inject('instanceType', ref(''));
const use = ref(false);
const showDel = computed(() => props.list.length !== 1 || props.isUse || !props.type || !props.required);
const isAllDay = computed(() => {
    let number = 0;
    props.list.forEach(item => {
        if (item.value) {
            const start = `2023-01-01 ${item.value.split('-')[0]}`;
            const end = `2023-01-01 ${item.value.split('-')[1]}`;
            number = number + (dayjs(end).diff(start, 'minute', true) + 1);
        }
    });
    return number === 1441 - props.stepM + props.list.length - 1;
});
const validateList = (callback: any) => {
    let data: any = '';
    if (use.value) {
        data = props.useList.find(item => item.value !== '');
    } else {
        data = props.list;
    }
    if (data || !props.required) {
        callback();
    } else {
        callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_1')));
    }
};

const validateListItem = (callback: any, data: ListItem) => {
    if (data.value) {
        const dataStart = `2023-01-01 ${data.value.split('-')[0]}`;
        const dataEnd = `2023-01-01 ${data.value.split('-')[1]}`;
        const timeList = props.list.filter(item => item.id !== data.id);
        let flag = false;
        if (dataStart === dataEnd) {
            callback(new Error(i18n.global.t('meos_control_web.min_select_minutes', { num: props.stepM })));
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const item of timeList) {
            if (item.value) {
                const start = `2023-01-01 ${item.value.split('-')[0]}`;
                const end = `2023-01-01 ${item.value.split('-')[1]}`;

                if (dayjsIsBetween(dayjs(dataStart), start, end, 'minute')) {
                    flag = true;
                }
                if (dayjsIsBetween(dayjs(dataEnd), start, end, 'minute')) {
                    flag = true;
                }
                if (dayjsIsSame(dayjs(dataEnd), dayjs(start)) || dayjsIsSame(dayjs(dataEnd), dayjs(end))) {
                    flag = true;
                }
                if (dayjsIsSame(dayjs(dataStart), dayjs(start)) || dayjsIsSame(dayjs(dataStart), dayjs(end))) {
                    flag = true;
                }
            }
        }
        if (flag) {
            callback(new Error(i18n.global.t('meos_control_web.coincides_with_selected_time_slot_please_check')));
        } else {
            if (props.title.includes(i18n.global.t('meos_control_web.business_hours')) && (instanceType.value === 'SPACE' || instanceType.value === 'FLOOR')) {
                let type = false,
                    arr = props.businessList;
                arr = arr.length ? orderBy(arr, ['openValue'], ['asc']) : [];
                if (dayjsIsBefore(dayjs(dataStart), dayjs(`2023-01-01${arr[0]?.openValue}`))) {
                    type = true;
                }
                if (type) {
                    callback(new Error(i18n.global.t('meos_control_web.time_earlier_than_opening')));
                } else {
                    callback();
                }
            }
            callback();
        }
    } else {
        callback();
    }
};
const handleTime = (time: string) => {
    const start = `2023-2-3 ${time.split(',')[0]}`;
    const end = `2023-2-3 ${time.split(',')[1]}`;
    const obj = {
        value: `${dayjs(start).format('HH:mm')}-${dayjs(end).format('HH:mm')}`,
        openValue: dayjs(start).format('HH:mm'),
        closeValue: dayjs(end).format('HH:mm'),
        id: uniqueId('item')
    };
    return obj;
};
const createItem = (data: ListItem[]) => {
    if (isAllDay.value) {
        return;
    }
    nextTick(() => {
        use.value = false;
    });
    data.push({
        value: '',
        id: uniqueId('item')
    });
};
const deleteItem = (data: ListItem[], i: number) => {
    data.splice(i, 1);
    if (data.length === 0) {
        use.value = true;
    }
    data.forEach(val => {
        Form.validateField([`item.${val.id}`]);
    });
};
const changeDate = (data: ListItem, i: number) => {
    nextTick(() => {
        if (!props.type) {
            if (data.closeValue && data.openValue) {
                data.value = `${data.openValue}-${data.closeValue}`;
            }
        }
        if (data.value) {
            const dataStart = `2023-01-01 ${data.value.split('-')[0]}`;
            const dataEnd = `2023-01-01 ${data.value.split('-')[1]}`;
            if (dayjsIsBefore(dayjs(dataEnd), dayjs(dataStart), 'minute')) {
                data.value = `${data.value.split('-')[1]}-${data.value.split('-')[0]}`;
            }
        }
        props.list.forEach((item, j) => {
            if (i !== j) {
                Form.validateField([`item.${item.id}`]);
            }
        });
    });
};
onMounted(() => {
    use.value = props.isUse;
});
watch(
    () => props.isUse,
    () => {
        use.value = props.isUse;
    }
);
</script>
<style lang="less" scoped>
.w4 {
    :deep(.m-time-picker-trigger) {
        width: 458px;
    }
}
.w3 {
    :deep(.m-time-picker-trigger) {
        width: 345px;
    }
}
.form-item-box {
    // padding: 16px 12px;
    border-radius: 4px;
    // background-color: var(--gray-50);
    height: 100%;
    // display: grid;
    grid-template-columns: 122px auto;
    width: 100%;
    position: relative;
    & + .form-item-box {
        margin-top: 16px;
    }
    &.noRange {
        :deep(.m-time-picker-trigger) {
            width: 100px;
        }
    }
    .link-btn {
        color: var(--blue-500);
        width: max-content;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        height: 32px;
        margin-top: 0;
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
        width: 110px;
        height: 100%;
        color: var(--gray-600);
        padding-top: 6px;
    }
    &-right {
    }
}
</style>
