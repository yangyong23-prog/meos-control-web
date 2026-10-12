<!--
 * @Author: guoxiaohuan
 * @Date: 2024-05-15 15:26:05
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-15 17:03:34
 * @Description: 基础输入框
-->
<template>
    <div class="common-container">
        <m-input-number
            v-if="curItem.unit"
            v-model="curItem.valueInputLeft"
            :width="curItem.width || '243px'"
            text-align="left"
            controls="rightButton"
            :placeholder="curItem.placeholder || i18n.global.t('common.placeholder_input')"
            :precision="curItem.decimalPlaces ? curItem.decimalPlaces * 1 : 0"
            :min="curItem.min"
            :max="curItem.max"
            @input="Input(curItem)"
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
            @input="Input(curItem)"
            @blur="InputBlur(curItem)"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
defineProps({
    curItem: {
        type: Object,
        default: () => {}
    }
});

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
