<template>
    <div class="enable-row">
        <m-form-item
            ref="fieldRef"
            :prop="propKey + fieldCode"
            label=""
            :rules="{
                validator: (rule, value, callback) => validateBothInput(inputValue, callback),
                trigger: 'none'
            }"
            label-width="0px"
            class="form-item"
        >
            <m-checkbox v-model="dischargeCoolingEnable" :disabled="disabled">{{ descFront }} </m-checkbox>
            <m-tips
                :content="dischargeCoolingEnable !== 'checked' ? i18n.global.t('meos_control_web.please_check_then_input') : ''"
                :disabled="dischargeCoolingEnable === 'checked'"
                trigger="hover"
                theme="darkTransparent"
            >
                <m-input-number
                    v-model="inputVal"
                    :width="116"
                    :disabled="disabled || dischargeCoolingEnable !== 'checked'"
                    :precision="precision"
                    :max="max"
                    :min="min"
                    controls="rightButton"
                    class="input-item"
                    :clearable="true"
                >
                    <template #suffix>{{ suffix }}</template>
                </m-input-number>
            </m-tips>
            {{ descAfter }}
        </m-form-item>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/views/ACAC/variables';
import { isEmptyNoReturn } from '@/utils/tools';
const props = defineProps({
    propKey: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    fieldCode: {
        type: String,
        default: ''
    },
    coolMode: {
        type: String,
        default: ''
    },
    precision: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 100
    },
    min: {
        type: Number,
        default: 0
    },
    suffix: {
        type: String,
        default: ''
    },
    descFront: {
        type: String,
        default: ''
    },
    descAfter: {
        type: String,
        default: ''
    },
    defaultData: {
        type: Object,
        default: () => null
    },
    // 禁用
    disabled: {
        type: Boolean,
        default: false
    }
});
const dischargeCoolingEnable = ref('uncheck');
const inputVal = ref();

const fieldRef = ref([]);

const validateBothInput = (val, callback) => {
    const isEmpty1 = dischargeCoolingEnable.value === 'uncheck';
    const isEmpty2 = isEmptyNoReturn(inputVal.value);

    if (!isEmpty1 && isEmpty2) {
        callback(new Error(EMPTYTEXT));
    } else {
        callback();
        return true;
    }
};

const validator = async () => {
    const rst = await fieldRef.value
        ?.validate()
        .then(() => {
            return { status: true };
        })
        .catch(e => {
            console.log('e: ', e);
            const error = e.errors?.find(obj => true);
            return { status: false, errorMsg: error.message ?? '' };
        });

    return { status: rst.status, errorMsg: EMPTYTEXT };
};
const getValue = () => {
    const isEmpty1 = dischargeCoolingEnable.value === 'uncheck';
    if (isEmpty1) {
        return null;
    }
    return { extendInfo: { [props.fieldCode]: inputVal.value }, coolMode: props.coolMode };
};
watch(
    () => props.defaultData,
    () => {
        // 回显供冷模式，
        if (props.defaultData) {
            // 放冷融冰逻辑/免费冷
            const extendInfoPointInfo = props.defaultData.pointInfos?.find(obj => obj.coolMode === props.coolMode && obj.extendInfo);
            if (extendInfoPointInfo?.extendInfo) {
                dischargeCoolingEnable.value = isEmptyNoReturn(extendInfoPointInfo.extendInfo[props.fieldCode]) ? 'uncheck' : 'checked';
                inputVal.value = extendInfoPointInfo.extendInfo[props.fieldCode];
            }
        }
    },
    { immediate: true }
);
const isAllEmpty = () => {
    const isEmpty1 = dischargeCoolingEnable.value === 'uncheck';
    // const isEmptyInput2 = isEmptyNoReturn(inputVal.value);
    // console.log('isEmpty1: ', isEmpty1, isEmptyInput2);
    return isEmpty1;
};
defineExpose({
    validator,
    getValue,
    isAllEmpty
});
</script>
<style lang="less" scoped>
.enable-row {
    display: flex;
    padding: 6px 8px 6px 12px;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-top: 8px;

    border-radius: 4px;
    background: rgba(196, 201, 207, 0.24);
    .form-item {
        margin-bottom: 0;
    }
    .input-item {
        margin-left: 8px;
        margin-right: 8px;
    }
    :deep(.m-form-item__error) {
        margin-top: 6px;
    }
}
</style>
