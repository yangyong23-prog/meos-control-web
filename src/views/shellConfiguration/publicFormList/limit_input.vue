<!--
 * @Author: guoxiaohuan
 * @Date: 2024-05-15 15:29:25
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-15 17:19:47
 * @Description: 上下限输入框
-->
<template>
    <div class="limit-container">
        <template v-if="value === 'left'">
            <m-input-number
                v-if="curItem.unit"
                v-model="curItem.valueInputLeft"
                :width="curItem.width || '110px'"
                text-align="left"
                controls="rightButton"
                :placeholder="curItem.placeholder || i18n.global.t('common.placeholder_input')"
                :precision="curItem.decimalPlaces ? curItem.decimalPlaces * 1 : 0"
                :min="curItem.min"
                :max="curItem.max"
                :step="curItem.step"
            >
                <template #suffix>{{ curItem.unit }}</template>
            </m-input-number>
            <m-input-number
                v-else
                v-model="curItem.valueInputLeft"
                :width="curItem.width || '110px'"
                text-align="left"
                :placeholder="curItem.placeholder || i18n.global.t('common.placeholder_input')"
                :precision="curItem.decimalPlaces ? curItem.decimalPlaces * 1 : 0"
                :min="curItem.min"
                :max="curItem.max"
                :step="curItem.step"
        /></template>
        <template v-else>
            <m-input-number
                v-if="curItem.unit"
                v-model="curItem.valueInputRight"
                :width="curItem.width || '110px'"
                text-align="left"
                controls="rightButton"
                :placeholder="curItem.placeholder || i18n.global.t('common.placeholder_input')"
                :precision="curItem.decimalPlaces ? curItem.decimalPlaces * 1 : 0"
                :min="curItem.min"
                :max="curItem.max"
                :step="curItem.step"
            >
                <template #suffix>{{ curItem.unit }}</template>
            </m-input-number>
            <m-input-number
                v-else
                v-model="curItem.valueInputRight"
                :width="curItem.width || '110px'"
                text-align="left"
                :placeholder="curItem.placeholder || i18n.global.t('common.placeholder_input')"
                :precision="curItem.decimalPlaces ? curItem.decimalPlaces * 1 : 0"
                :min="curItem.min"
                :max="curItem.max"
                :step="curItem.step"
            />
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
defineProps({
    curItem: {
        type: Object,
        default: () => {}
    },
    value: {
        type: String,
        default: 'left'
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
<style scoped lang="less">
.limit-container {
    /deep/ .m-input-number .suffix-text {
        width: 44px;
    }
}
</style>
