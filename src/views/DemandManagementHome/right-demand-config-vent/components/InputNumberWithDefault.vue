<template>
    <m-form-item :prop="props?.envConfig?.code" :item-model="inputCurrentModel">
        <template #label>
            <div class="env-row">
                <span class="env-label">{{ props?.envConfig?.label }}</span>
                <span class="env-tips">{{ props?.envConfig?.scope }}</span>
            </div>
        </template>
        <m-input-num
            v-model="inputCurrentModel"
            text-align="left"
            :placeholder="reactivePlaceholder"
            controls="rightButton"
            :class="['has-btn-input-number', showGreyFlag ? 'show-grey-flag' : '']"
            width="100%"
            :step="props?.envConfig?.step"
            :precision="props?.envConfig?.precision"
            @input="handleInput"
        >
            <template #suffix>
                {{ props?.envConfig?.unit }}
            </template>
        </m-input-num>
    </m-form-item>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { defineModel } from 'vue';

type inputNumberVal = number | string | undefined | null;

interface InputNumberWithDefaultProps {
    envConfig: {
        label: string;
        code: string;
        scope: string;
        unit: string;
        step: number;
        precision: number;
    };
    defaultVal: number;
    isFromReference: boolean;
    editVal: number | undefined;
}
const props = defineProps<InputNumberWithDefaultProps>();

const inputCurrentModel = defineModel<inputNumberVal>('value');

const showGreyFlag = ref(false);

const reactivePlaceholder = computed(() => {
    return props?.defaultVal?.toString() || i18n.global.t('common.placeholder_input');
});

const handleInput = () => {
    showGreyFlag.value = false;
};

onMounted(() => {
    const diffVal = props?.editVal ?? props.defaultVal;
    if (props.isFromReference) {
        showGreyFlag.value = true;
        inputCurrentModel.value = null;
    } else {
        inputCurrentModel.value = diffVal;
    }
});
</script>

<style lang="less" scoped>
.env-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}

.env-label {
    color: @grey-600;
}
.env-tips {
    color: @grey-500;
}
:deep(.m-input-num .suffix-text) {
    width: 76px;
}
.show-grey-flag {
    :deep(input) {
        color: @grey-400;
    }
}
</style>
