<template>
    <m-form-item v-if="show" :label="data.name">
        <template #label>
            <div class="label-wrap">
                <span>{{ data.name }} <span style="color: var(--red-500)">*</span></span
                ><span v-if="data.nameDesc" class="name-desc">{{ data.nameDesc }}</span>
            </div>
        </template>
        <div class="intervention-time-form">
            <m-form-item
                label=""
                :prop="data.extend.infoCode"
                :rules="[{ type: 'number', required: true, message: EMPTYTEXT, trigger: [] }]"
                style="--m-form-item-margin: 10px"
                class="StepInputNumber"
            >
                <span style="color: var(--gray-600); margin-right: 8px">{{ i18n.global.t('meos_control_web.duration') }}</span>
                <StepInputNumber
                    v-model="params[data.extend.infoCode]"
                    :default-value="stepInputNumberDefault"
                    :info-value="data.defaultValue"
                    :min="0"
                    :max="data.componentAttrs.max || 4320"
                    :precision="0"
                    :blur-round="true"
                    :suffix="i18n.global.t('meos_control_web.minute')"
                    width="90px"
                    @blur="handleBlur"
                />
            </m-form-item>
            <m-form-item
                label=""
                :prop="data.infoCode"
                :rules="[
                    { required: true, message: '', trigger: [] },
                    {
                        validator: (_value, _rule, callback) => validateLessNow(params[data.infoCode], callback, i18n.global.t('meos_control_web.past_connot_sel')),
                        trigger: []
                    }
                ]"
                style="--m-form-item-margin: 4px"
            >
                <span style="color: var(--gray-600); margin-right: 8px">{{ i18n.global.t('meos_control_web.estimated_deadline') }}</span>
                <m-date-picker
                    v-model="params[data.infoCode]"
                    simple-style
                    :clearable="false"
                    type="datetime"
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
import { EMPTYTEXT, getDayjsTz } from '@/utils/globalVariables';
import { getNextFiveMinutePoint, validateLessNow } from '@/utils/tools';
import StepInputNumber from './StepInputNumber.vue';
import dayjs from 'dayjs';
import { isArray } from 'lodash';
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
const stepInputNumberDefault = ref(60);
const show = computed(() => {
    if (props.data.showFilter) {
        return props.data.showFilter(props.params, props.data);
    }
    if (props.data.hide) {
        if (isArray(props.data.hide?.dataValue)) {
            return !props.data.hide?.dataValue.includes(props.params[props.data.hide?.infoCode]);
        }
        return props.params[props.data.hide?.infoCode] !== props.data.hide?.dataValue;
    }
    return true;
});
const handleBlur = val => {
    nextTick(() => {
        if (val !== null) {
            const time = getDayjsTz().add(val, 'minute');
            props.params[props.data.infoCode] = dayjs(getNextFiveMinutePoint(time)).format('YYYY.MM.DD HH:mm');
        } else {
            props.params[props.data.infoCode] = '';
        }
    });
};
const handleChange = () => {
    const nowTime = getDayjsTz();
    const selectedTime = dayjs(props.params[props.data.infoCode]);
    const diffMinutes = dayjs(selectedTime.format('YYYY-MM-DD HH:mm')).diff(dayjs(nowTime.format('YYYY-MM-DD HH:mm')), 'minute');
    props.params[props.data.extend.infoCode] = diffMinutes > 0 ? diffMinutes : 0;
    return diffMinutes > 0 ? diffMinutes : 0;
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
    console.log(props.data);

    if (props.data.defaultValue) {
        const number = handleChange();
        stepInputNumberDefault.value = number;
        props.params[props.data.infoCode] = props.data.defaultValue;
    }
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
}
</style>
