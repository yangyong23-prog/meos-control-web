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
            :style="{ borderRadius: 0, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }"
            @blur="roundingVal"
        >
        </m-input-number>
        <div class="fc fcol last-action">
            <m-tips :content="inputValue >= max ? disableText : ''" :disabled="inputValue < max" trigger="hover" theme="darkTransparent">
                <arrow-up :class="inputValue >= max ? 'disable' : 'arrow-up'" @click.stop="increase"></arrow-up>
            </m-tips>
            <m-tips :content="isEmpty || inputValue <= min ? disableText : ''" :disabled="!isEmpty && inputValue > min" trigger="hover" theme="darkTransparent">
                <arrow-down :class="isEmpty || inputValue <= min ? 'disable' : 'arrow-down'" @click.stop="reduce"></arrow-down>
            </m-tips>
        </div>
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
    }
});

const emits = defineEmits(['change', 'blur']);
const inputValue = defineModel({ type: Number, default: null });
const isEmpty = computed(() => {
    return inputValue.value === undefined || inputValue.value === null;
});

const disableText = computed(() => {
    return i18n.global.t('meos_control_web.range_time', {
        min: props.min ?? 0,
        max: props.max ?? 0
    });
});
const increase = () => {
    // if (isEmpty.value) {
    //     return;
    // }
    const targetV = (inputValue.value ?? 0) + props.step;
    inputValue.value = targetV > props.max ? props.max : targetV;
    emits('blur', inputValue.value);
};
const reduce = () => {
    if (isEmpty.value) {
        return;
    }
    const targetV = (inputValue.value ?? 0) - props.step;
    inputValue.value = targetV < props.min ? props.min : targetV;
    emits('blur', inputValue.value);
};
const roundingVal = () => {
    if (inputValue.value > props.max) {
        inputValue.value = props.max;
        return;
    } else if (inputValue.value < props.min) {
        inputValue.value = props.min;
        return;
    }
    // 四舍五入，如取整粒度是5，43四舍五入=45，42四舍五入=40
    if (props.blurRound && props.roundVal > 0 && inputValue.value % props.roundVal !== 0) {
        const remainder = inputValue.value % props.roundVal;
        const half = props.roundVal / 2;
        if (remainder >= half) {
            inputValue.value = inputValue.value - remainder + props.roundVal;
        } else {
            inputValue.value = inputValue.value - remainder;
        }
    }
    emits('blur', inputValue.value);
};
watch(inputValue, () => {
    emits('change');
});
onMounted(() => {
    // 设置默认值
    if (props.defaultValue !== undefined) {
        emits('blur', props.defaultValue);
        inputValue.value = props.defaultValue;
    }
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
}
</style>
