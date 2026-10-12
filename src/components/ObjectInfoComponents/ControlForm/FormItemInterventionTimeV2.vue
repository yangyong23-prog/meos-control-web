<template>
    <m-form-item
        v-if="show"
        :label="data.name"
        :prop="data.infoCode"
        :rules="[
            { type: 'number', validator: (value, rule, callback) => durationInputRule(callback), trigger: [] },
            {
                validator: (_value, _rule, callback) => validateLessNowFn(params[data.infoCode], callback, i18n.global.t('meos_control_web.past_connot_sel')),
                trigger: []
            }
        ]"
        class="form-intervention-time"
    >
        <template #label>
            <div class="label-wrap">
                <span>{{ data.name }} <span style="color: var(--red-500)">*</span></span
                ><span v-if="data.nameDesc" class="name-desc">{{ data.nameDesc }}</span>
            </div>
        </template>
        <div class="intervention-time-form">
            <div class="sustain-time-container">
                <m-form-item ref="sustainTimeRef" label="" :prop="data.extend.infoCode" style="--m-form-item-margin: 10px" class="StepInputNumber">
                    <span style="color: var(--gray-600); margin-right: 8px">{{ i18n.global.t('meos_control_web.duration') }}</span>
                    <m-tips
                        :content="isLongterm ? i18n.global.t('meos_control_web.longterm_no_duration_input') : ''"
                        :disabled="!isLongterm"
                        trigger="hover"
                        theme="darkTransparent"
                    >
                        <StepInputNumber
                            ref="stepInput"
                            v-model="params[data.extend.infoCode]"
                            :default-value="isLongterm ? undefined : 60"
                            :min="0"
                            :max="data.componentAttrs.max || defaultMax"
                            :precision="0"
                            :blur-round="true"
                            :suffix="i18n.global.t('meos_control_web.minute')"
                            :disabled="isLongterm"
                            width="90px"
                            @blur="handleBlur"
                        />
                    </m-tips>
                </m-form-item>
                <m-checkbox v-if="data.useLongterm" v-model="longtermCheckModel" style="margin-bottom: 10px" @change="onLongtermChange">{{
                    i18n.global.t('meos_control_web.longterm_intervention')
                }}</m-checkbox>
            </div>
            <div v-if="!isLongterm" class="btn-duration-group">
                <div
                    v-for="item in durationOptions"
                    :key="item.key"
                    :class="['btn-duration', params[data.extend?.infoCode] === item.value ? 'btn-act' : '', 'fcc']"
                    @click="clickDurationItem(item)"
                >
                    <div v-ellipsis class="m-ellipsis">{{ item.name }}</div>
                </div>
            </div>
            <div v-if="isLongterm">
                <span style="color: var(--gray-600); margin-right: 8px">{{ i18n.global.t('meos_control_web.estimated_deadline') }}</span>
                <span style="color: var(--gray-800)">{{ i18n.global.t('meos_control_web.longterm_until_manually_cancelled') }}</span>
            </div>
            <m-form-item v-else label="" :prop="data.infoCode" style="--m-form-item-margin: 4px">
                <span style="color: var(--gray-600); margin-right: 8px">{{ i18n.global.t('meos_control_web.estimated_deadline') }}</span>
                <m-date-picker
                    v-model="params[data.infoCode]"
                    simple-style
                    :clearable="false"
                    type="datetime"
                    :popover-attrs="{ autoUpdatePosition: false }"
                    :width="110"
                    :placeholder-style="{ color: 'var(--blue-500)' }"
                    v-bind="data.componentAttrs"
                    @change="handleChange"
                ></m-date-picker>
            </m-form-item>
        </div>
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/utils/globalVariables';
import { getNextFiveMinutePoint, validateLessNow } from '@/utils/tools';
import StepInputNumber from './StepInputNumber.vue';
import dayjs from 'dayjs';
import { isArray } from 'lodash';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    }
});
const durationOptions = [
    {
        key: 0,
        value: 30,
        name: `30${i18n.global.t('meos_control_web.minute')}`
    },
    {
        key: 1,
        value: 60,
        name: `60${i18n.global.t('meos_control_web.minute')}`
    },
    {
        key: 2,
        value: 120,
        name: i18n.global.t('meos_control_web.num_hour', { num: 2 })
    },
    {
        key: 3,
        value: 360,
        name: i18n.global.t('meos_control_web.num_hour', { num: 6 })
    },
    {
        key: 4,
        value: 720,
        name: i18n.global.t('meos_control_web.num_hour', { num: 12 })
    }
];
const longtermCheckModel = ref('checked');
const stepInput = ref('');
const sustainTimeRef = ref();

const _defaultMax = dayjs.duration(dayjs().add(1, 'year').diff(dayjs())).as('minute');
const defaultMax = computed(() => {
    const s = props.data?.componentAttrs?.scope;

    if (s) {
        const arr = s.split('-');
        if (arr?.length > 1) {
            const startTime = arr[0];
            const endTime = arr[1];
            return Math.ceil(dayjs.duration(dayjs(endTime).diff(dayjs(startTime))).as('minute'));
        }
    }
    return _defaultMax;
});

// 是长期干预的
const isLongterm = computed(() => {
    return props.data.useLongterm && longtermCheckModel.value === 'checked';
});
const show = computed(() => {
    if (props.data.showFilter) {
        return props.data.showFilter(props.params, props.data);
    }
    if (props.data.hide) {
        if (isArray(props.data.hide?.dataValue)) {
            return !props.data.hide?.dataValue?.includes(props.params[props.data.hide?.infoCode]);
        }
        return props.params[props.data.hide?.infoCode] !== props.data.hide?.dataValue;
    }
    return true;
});

const durationInputRule = callback => {
    if (!isLongterm.value) {
        const val = props.params[props.data.extend.infoCode];
        if (val === '' || val === undefined || val === null) {
            callback(new Error(EMPTYTEXT));
            return;
        }
    }
    callback();
};
const validateLessNowFn = (value, callback, message) => {
    if (isLongterm.value) {
        callback();
        return;
    }
    validateLessNow(value, callback, message);
};
const handleBlur = val => {
    nextTick(() => {
        // console.log('handleBlur---val !== null: ', val !== null, `=====${val}]]]]]]`);
        if (val !== null && val !== '') {
            const time = dayjs().add(val, 'minute');
            props.params[props.data.infoCode] = dayjs(getNextFiveMinutePoint(time)).format('YYYY.MM.DD HH:mm');
        } else {
            props.params[props.data.infoCode] = '';
        }
    });
};
const handleChange = () => {
    const nowTime = dayjs();
    const selectedTime = dayjs(props.params[props.data.infoCode]);
    const diffMinutes = selectedTime.diff(nowTime, 'minute');
    props.params[props.data.extend.infoCode] = diffMinutes > 0 ? diffMinutes : 0;
    nextTick(() => {
        stepInput.value?.roundingVal();
    });
};
const clickDurationItem = item => {
    // console.log('item: ', item);
    const v = props.params[props.data.extend?.infoCode];
    const itemValStr = item.value;
    if (v !== itemValStr) {
        props.params[props.data.extend?.infoCode] = itemValStr;
        handleBlur(itemValStr);
    }
};

//长期干预勾选事件 勾选了，长期干预，时间设置为空
const onLongtermChange = val => {
    sustainTimeRef.value?.clearValidate();
    if (val === 'checked') {
        props.params[props.data.infoCode] = '';
        props.params[props.data.extend.infoCode] = '';
    } else {
        props.params[props.data.extend.infoCode] = 60;
        handleBlur(60);
    }
};

watch(
    () => show.value,
    val => {
        if (!show.value) {
            props.params[props.data.infoCode] = '';
        }
    }
);
onMounted(() => {
    /**
     * 初始化默认值处理逻辑
     *
     * 该代码块用于处理组件初始化时的默认值设置逻辑。
     * 当存在默认值时，会触发 handleChange 和 handleBlur 两个处理函数，
     * 以确保默认值能够正确地反映到组件状态和相关参数中。
     *
     * 涉及的操作：
     * 1. 调用 handleChange() 更新组件内部状态
     * 2. 调用 handleBlur() 并传入对应的参数值，触发失焦相关的副作用处理
     */
    if (props.data.defaultValue) {
        handleChange();
        handleBlur(props.params[props.data.extend.infoCode]);
    }
    // console.log(' props.params[props.data.infoCode]: ', props.params[props.data.infoCode]);
    const paramInfoCodeVal = props.params[props.data.infoCode];

    // 有干预时间，则初始化组件回显
    if (!props.data.defaultValue && paramInfoCodeVal) {
        // 格式化显示时间
        props.params[props.data.infoCode] = dayjs(paramInfoCodeVal).format('YYYY.MM.DD HH:mm');
        // 计算持续时间分钟
        handleChange();
    }
    if (props.data.useLongterm && paramInfoCodeVal) {
        // 长期干预check选中
        longtermCheckModel.value = 'uncheck';
    } else if (paramInfoCodeVal === undefined || paramInfoCodeVal === null) {
        props.params[props.data.infoCode] = '';
    }
});
onBeforeUnmount(() => {
    props.params[props.data.extend.infoCode] = '';
});
</script>
<style lang="less" scoped>
.label-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // gap: 8px;
    .name-desc {
        color: var(--orange-700, #e68600);
        font-size: 12px;
        font-weight: 400;
        line-height: 22px; /* 183.333% */
    }
}
.intervention-time-form {
    width: 100%;
    border-radius: 4px;
    padding: 8px;
    padding-bottom: 0;
    background-color: var(--gray-100);

    .StepInputNumber {
        :deep(.m-form-item__error) {
            left: 63px;
        }
    }
    .sustain-time-container {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-bottom: 6px;
    }
    :deep(.m-date-picker) {
        .date-icon {
            display: none;
        }
        .m-date-picker__result {
            padding: 0;
        }
        .m-date-picker__result.simple:hover {
            background-color: transparent;
        }
        .m-date-picker__result_text {
            color: var(--blue-500);
        }
    }
    :deep(.m-input-number-rightButton.no-suffix) {
        border-radius: 4px 0 0 4px;
    }
}
.btn-duration-group {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    .btn-duration {
        height: 26px;
        padding: 4px;
        cursor: pointer;

        border-radius: 4px;
        border: 1px solid var(--grey-400, #c4c9cf);
        background: var(--Grey-Grey-0-Text, #fff);

        color: var(--Grey-Grey-600, #626c78);
        font-size: 14px;
        font-weight: 400;
    }
    .btn-act,
    .btn-duration:hover {
        border: 1px solid var(--blue-500, #246fe5);
        background: var(--blue-50, #ebf6ff);
        color: var(--blue-500, #246fe5);
    }
}
</style>
