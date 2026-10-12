<!--
 * @Author: guoxiaohuan
 * @Date: 2024-05-15 15:30:00
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-15 17:03:45
 * @Description: 步长输入框
-->
<template>
    <div class="step-container">
        <m-input-number
            v-if="curItem.unit"
            v-model="curItem.valueInputLeft"
            text-align="left"
            controls="rightButton"
            :width="curItem.width || '243px'"
            :placeholder="curItem.placeholder || i18n.global.t('common.placeholder_input')"
            :precision="curItem.decimalPlaces ? curItem.decimalPlaces * 1 : 0"
            :min="curItem.min"
            :max="curItem.max"
            :step="curItem.step"
            @input="Input(curItem)"
            @blur="InputBlur(curItem)"
        >
            <template #suffix>{{ curItem.unit }}</template>
        </m-input-number>
        <m-input-number
            v-else
            v-model="curItem.valueInputLeft"
            text-align="left"
            :width="curItem.width || '243px'"
            :placeholder="curItem.placeholder || i18n.global.t('common.placeholder_input')"
            :precision="curItem.decimalPlaces ? curItem.decimalPlaces * 1 : 0"
            :min="curItem.min"
            :max="curItem.max"
            :step="curItem.step"
            @input="Input(curItem)"
            @blur="InputBlur(curItem)"
        />
        <IconMeriComponentArrowUp
            class="arrow-up"
            :color="Number(curItem.valueInputLeft) + curItem.step - 1 >= curItem.max ? '#E1E5EB' : '#8B949E'"
            :class="{ 'arrow-up-unit': curItem.unit }"
            :style="{
                cursor: Number(curItem.valueInputLeft) + curItem.step - 1 >= curItem.max ? 'not-allowed' : 'pointer'
            }"
            @click="changeArrow(curItem, 'top')"
        />
        <IconMeriComponentArrowDown
            :disabled="curItem.valueInputLeft === 0"
            :color="Number(curItem.valueInputLeft) - curItem.step - 1 <= curItem.min ? '#E1E5EB' : '#8B949E'"
            class="arrow-down"
            :class="{ 'arrow-down-unit': curItem.unit }"
            :style="{
                cursor: Number(curItem.valueInputLeft) - curItem.step - 1 <= curItem.min ? 'not-allowed' : 'pointer'
            }"
            @click="changeArrow(curItem, 'bottom')"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentArrowDown, IconMeriComponentArrowUp } from 'meri-icon';

defineProps({
    curItem: {
        type: Object,
        default: () => {}
    }
});

// input中上下按钮切换
const changeArrow = (item, type) => {
    if (type === 'top') {
        if (item.valueInputLeft > item.max - (item.step - 1)) return;
        item.valueInputLeft += item.step;
    } else {
        if (Number(item.valueInputLeft) - (item.step - 1) <= 0) return;
        item.valueInputLeft -= item.step;
    }
    InputBlur(item);
};

const Input = item => {
    if (!item.valueInputLeft) {
        item.isUnit = true;
    }
};

const InputBlur = item => {
    // 超过最大值直接等于最大值
    if (item.valueInputLeft > item.max) {
        item.valueInputLeft = item.max;
    }
};
</script>
<style lang="less" scoped>
.step-container {
    position: relative;
    .arrow-up,
    .arrow-down {
        z-index: 10;
        position: absolute;
        right: 8px;
        height: 14px;
    }
    .arrow-up-unit,
    .arrow-down-unit {
        right: 84px;
    }
    .arrow-up {
        top: 4px;
    }
    .arrow-down {
        bottom: 4px;
    }
}
</style>
