<template>
    <div v-if="!disabledFun" class="checkbox-input-set">
        <div class="checkbox-box">
            <m-checkbox v-model="value" @click="handleClick">{{ tips[0] }}</m-checkbox>
        </div>
        <div class="input-box">
            <m-tips theme="darkTransparent" :disabled="value === 'checked'" :content="i18n.global.t('meos_control_web.please_check_then_input')">
                <m-form-item :prop="field" :rules="value === 'checked' ? rules : []" :item-model="params[field]">
                    <div class="fcc">
                        <m-input-number
                            v-model="params[field]"
                            :disabled="value === 'uncheck'"
                            text-align="left"
                            :placeholder="i18n.global.t('common.placeholder_input')"
                            controls="rightButton"
                            :precision="1"
                            :min="0"
                            :max="data.max || 100"
                            style="--width: 120px"
                        >
                            <template #suffix> {{ unit }} </template>
                        </m-input-number>
                        &nbsp;&nbsp;{{ tips[1] }}
                    </div>
                </m-form-item>
            </m-tips>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/utils/globalVariables';
import { paramsKey, SetFormKey, currentDataKey } from '@/views/ACAC/hooks/useSetFormHook';
import { consoleTypesKey } from '@/views/ACAC/hooks/useRightHook';
import { CONSOLE_TYPES, DISCHARGE_COOLING_SWITCH_SET, COOLING_SUPPLY_SWITCH_SET } from '@/views/ACAC/variables';
import DockSingleton from '@/hooks/responsiveDock';
import { systemIdKey, currentSystemKey } from '@/views/ACAC/hooks/useBaseHook';
import { isLockV2 } from '@/components/SystemControl/config';
const { getIotData } = DockSingleton.getInstance();
// 定义组件的 props
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    controlListData: {
        type: Array,
        default: () => []
    }
});
const currentSystem = inject(currentSystemKey, ref({}));
const systemId = inject(systemIdKey); // 注入系统 ID
// 定义响应式变量
const value = ref('uncheck'); // 默认值为 'uncheck'
const field = ref(props.data.infoCode); // 字段名
const unit = ref(''); // 单位
const tips = ref([]); // 提示信息
const currentData = inject(currentDataKey);
// 注入依赖
const consoleTypes = inject(consoleTypesKey);
const params = inject(paramsKey);
const SetForm = inject(SetFormKey);
const disabledFun = computed(() => {
    if (currentData.value.infoCode === COOLING_SUPPLY_SWITCH_SET) {
        const item = props.controlListData.find(info => info.infoCode === props.data.correlationInfoCode);
        if (item) {
            if (item.lockStatus) {
                const lock = getIotData(currentSystem.value.systemId, item.lockStatus?.infoCode);
                if (isLockV2(lock)) {
                    return true;
                }
            }
            if (params.value[props.data.correlationInfoCode] !== '1') {
                return true;
            }
        } else {
            return true;
        }
    }
    return false;
});

// 定义表单验证规则
const rules = ref([{ type: 'number', required: true, message: EMPTYTEXT, trigger: [] }]);

/**
 * 处理复选框点击事件
 * @param {string} data - 当前复选框的值
 */
const handleClick = data => {
    if (data === 'uncheck') {
        SetForm?.value?.clearValidate(field.value);
    }
};

/**
 * 初始化字段和单位
 */
onMounted(() => {
    let unitStr = '',
        tipsArr = [i18n.global.t('meos_control_web.enable_early_end_discharge_ice_low'), i18n.global.t('meos_control_web.hours_ahead_end_discharge_cooling')];
    if (props.data.correlationInfoCode === 'freeCoolingSwitchSet') {
        tipsArr = [i18n.global.t('meos_control_web.enable_early_end_free_cooling_supply_temp_high'), i18n.global.t('meos_control_web.hours_ahead_end_free_cooling')];
        field.value = 'maximumWaterSupplyTemp';
        unitStr = '℃';
    } else {
        if (consoleTypes?.value && CONSOLE_TYPES[consoleTypes.value]) {
            if (consoleTypes.value === CONSOLE_TYPES.COOL_SUPPLY.id) {
                field.value = 'iceContent';
                unitStr = '%';
            } else {
                field.value = 'waterTemperature';
                unitStr = '℃';
            }
        }
    }
    tips.value = tipsArr;
    unit.value = props.data.unit || unitStr;
    // 确保 props.data 和 params 不为空
    if (props.data) {
        props.data.infoCode = props.data.infoCode || field.value;
    }
    if (params?.value) {
        value.value = 'uncheck';
        params.value[field.value] = '';
    }
});
watch(
    () => props.data.hide,
    () => {
        if (params?.value) {
            params.value[field.value] = '';
            value.value = 'uncheck';
        }
    }
);
</script>

<style lang="less" scoped>
.checkbox-input-set {
    padding: 8px;
    border-radius: 4px;
    background-color: var(--gray-100);
    margin-bottom: 10px;
    .checkbox-box {
        min-height: 27px;
        margin-bottom: 9px;
        :deep(.checkbox) {
            align-self: self-start;
            flex: 0 0 var(--size);
            margin-top: 4px;
        }
    }

    :deep(.m-input-number .suffix-text) {
        width: 32px;
    }
}
</style>
