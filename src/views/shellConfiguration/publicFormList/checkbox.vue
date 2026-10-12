<!--
 * @Author: guoxiaohuan
 * @Date: 2024-05-15 15:28:33
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-16 11:24:25
 * @Description: 多选控件
-->
<template>
    <m-select v-model="curItem.valueInputLeft" multiple :before-click-item="beforeClick" :options="curItem.items"></m-select>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    curItem: {
        type: Object,
        default: () => {}
    }
});
props.curItem?.items &&
    props.curItem.items.map(item => {
        item.id = item.key;
        item.name = item.value;
    });
</script>
