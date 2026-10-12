<!--
 * @Author: guoxiaohuan
 * @Date: 2024-05-15 15:27:58
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-16 11:05:04
 * @Description: 单选控件
-->
<template>
    <div class="radio-container">
        <m-radio-group v-model="curItem.valueInputLeft">
            <m-radio v-for="(item, index) in curItem.items" :key="index + 'r'" :label="item.key">{{ item.value }}</m-radio>
        </m-radio-group>
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
</script>
<style lang="less" scoped>
.radio-container {
    line-height: 32px;
    display: flex;
    align-items: center;
}
</style>
