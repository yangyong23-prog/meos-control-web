<template>
    <div class="fc step-input-number">
        <m-input-number
            v-model="inputValue"
            :precision="precision"
            :max="max"
            :min="min"
            :controls="suffix ? 'rightButton' : 'operatorIcon'"
            class="input-number"
            text-align="left"
            :width="width"
            :disabled="disabled"
            :style="{ borderRadius: 0, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }"
            @blur="roundingVal"
        >
        </m-input-number>
        <m-tips
            :content="
                i18n.global.t('meos_control_web.range_min_max', {
                    min: min,
                    max: max
                })
            "
            :disabled="disabled"
            theme="darkTransparent"
        >
            <div class="fc fcol last-action" :class="[disabled ? 'action-disable' : '']">
                <arrow-up :class="inputValue >= max ? 'disable' : 'arrow-up'" @click.stop="increase"></arrow-up>
                <arrow-down :class="isEmpty || inputValue <= min ? 'disable' : 'arrow-down'" @click.stop="reduce"></arrow-down>
            </div>
        </m-tips>
        <div v-if="suffix" class="suffix">{{ suffix }}</div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ArrowUp from '@/assets/images/common/arrow_up.svg';
import ArrowDown from '@/assets/images/common/arrow_down.svg';
import { MEOS_LIGHT_SUSTAIN_STEP } from '@/config';

const props = defineProps({
    max: {
        type: Number,
        default: Infinity
    },
    min: {
        type: Number,
        default: -Infinity
    },
    blurRound: {
        type: Boolean,
        default: true
    },
    roundVal: {
        type: Number,
        default: 5
    },
    step: {
        type: Number,
        default: () => MEOS_LIGHT_SUSTAIN_STEP || 30
    },
    precision: {
        type: Number,
        default: 0
    },
    suffix: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '130px'
    },
    defaultValue: {
        type: Number,
        default: undefined
    },
    disabled: {
        type: Boolean,
        default: false
    },
    allowEmpty: {
        type: Boolean,
        default: false
    },
    infoValue: {
        type: String,
        default: ''
    }
});

const emits = defineEmits(['change', 'blur', 'update:modelValue']);
const inputValue = defineModel({ type: Number, default: null });
const isEmpty = computed(() => {
    return inputValue.value === undefined || inputValue.value === null;
});

const increase = () => {
    // if (isEmpty.value) {
    //     return;
    // }
    if (props.disabled) {
        return;
    }
    const targetV = (inputValue.value ?? 0) + props.step;
    const value = targetV > props.max ? props.max : targetV;
    emits('blur', value);
    emits('update:modelValue', value);
};
const reduce = () => {
    if (isEmpty.value || props.disabled) {
        return;
    }

    const targetV = (inputValue.value ?? 0) - props.step;
    const value = targetV < props.min ? props.min : targetV;
    emits('blur', value);
    emits('update:modelValue', value);
};
const roundingVal = e => {
    if (inputValue.value > props.max) {
        inputValue.value = props.max;
        emits('blur', props.max);
        return;
    } else if (inputValue.value < props.min) {
        // 允许为空且内容为空
        if (props.allowEmpty && inputValue.value.toString() === '') {
            return;
        }
        inputValue.value = props.min;
        emits('blur', props.min);
        return;
    }
    // 四舍五入，如取整粒度是5，43四舍五入=45，42四舍五入=40
    let finalValue = inputValue.value;
    if (props.blurRound && props.roundVal > 0 && finalValue % props.roundVal !== 0) {
        const remainder = finalValue % props.roundVal;
        const half = props.roundVal / 2;
        if (remainder >= half) {
            finalValue = finalValue - remainder + props.roundVal;
        } else {
            finalValue = finalValue - remainder;
        }
        inputValue.value = finalValue;
    }

    emits('blur', finalValue);
};
watch(inputValue, () => {
    emits('change');
});
onMounted(() => {
    // 设置默认值
    if (props.defaultValue !== undefined && !props.infoValue) {
        emits('blur', props.defaultValue);
        inputValue.value = props.defaultValue;
    }
});
defineExpose({
    roundingVal
});
</script>
<style lang="less" scoped>
.step-input-number {
    position: relative;
    overflow: 'hidden';
    border-radius: '4px';
    .last-action {
        background: #fff;
        height: 28px;
        width: 16px;
        margin-left: -18px;
        z-index: 10;
        // position: absolute;
        // right: 0;
        .arrow-up {
            &:hover {
                cursor: pointer;
                :deep(path) {
                    fill: #246fe5;
                }
            }
        }
        .arrow-down {
            &:hover {
                cursor: pointer;
                :deep(path) {
                    fill: #246fe5;
                }
            }
        }
        .disable {
            :deep(path) {
                fill: #c4c9cf;
            }
            &:hover {
                cursor: not-allowed;
            }
        }
    }
    .suffix {
        user-select: none;
        height: 32px;
        display: flex;
        padding: 5px 8px;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        gap: 2px;
        border-radius: 0px 4px 4px 0px;
        border: 1px solid var(--gray-400, #c4c9cf);
        background: var(--gray-200, #e8ecf0);
    }
    .action-disable {
        cursor: not-allowed;
        background-color: var(--gray-200);

        .arrow-up,
        .arrow-down,
        .disable {
            cursor: not-allowed;
            :deep(path) {
                fill: var(--gray-400);
            }
            &:hover {
                cursor: not-allowed;
                :deep(path) {
                    fill: var(--gray-400);
                }
            }
        }
    }
}
</style>
