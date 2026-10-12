<template>
    <CommonDashboard :grid-data="gridData" :custom-style="{ 'padding-left': '16px' }" :collapsed-keys="collapsedKeys" :media-query-rules="mediaQueryRules" @scroll="handleScroll">
        <template #card-info="{ cardData }">
            <CardItem v-bind="$attrs" :card-data="cardData"></CardItem>
        </template>
    </CommonDashboard>
</template>

<script setup>
import i18n from '@/localization';
import CommonDashboard from '@/components/template/dashboard/index.vue';
import CardItem from './widget/CardItem.vue';

const props = defineProps({
    dashboardData: {
        type: Array,
        default: () => []
    }
});

const gridData = computed(() => props.dashboardData);

const collapsedKeys = computed(() => gridData.value.map(s => s?.id));

const mediaQueryRules = [
    { minWidth: 1560, cards: 4 }, // ≥1560px 时显示4列
    { minWidth: 1200, cards: 3 }, // ≥1200px 时显示3列
    { default: true, cards: 2 } // 默认显示2列
];

const handleScroll = itemData => {};
</script>

<style lang="less" scoped></style>
