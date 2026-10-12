<template>
    <Panel :loading="loading" :title="title" :title-path="'/ventilation-perception'" :card-tag="data?.cardTag">
        <div v-if="!loaded" class="vent-row-grid"></div>
        <!-- 5、6 个数据时每行展示 3 列，其他数量保持原有布局 -->
        <GridLayout v-else-if="cards?.length" class="vent-row row" :gutter="cards.length > 4 ? 12 : 8">
            <template v-if="cards.length > 3">
                <GridLayoutItem v-for="(card, index) in cards" :key="index" class="vent-col col bc" :span="4">
                    <GridCard :item="card" :pie-color="'#246FE5'" />
                </GridLayoutItem>
            </template>
            <template v-else-if="cards.length === 3">
                <GridLayoutItem v-for="(card, index) in cards.slice(0, 2)" :key="index" class="vent-col col bc" :span="4">
                    <GridCard :item="card" :pie-color="'#246FE5'" />
                </GridLayoutItem>
                <GridLayoutItem class="vent-col col bc" :span="8">
                    <GridCard :item="cards[2]" :pie-color="'#246FE5'" />
                </GridLayoutItem>
            </template>
            <template v-else-if="cards.length <= 2">
                <GridLayoutItem v-for="(card, index) in cards" :key="index" class="vent-col col bc" :span="8">
                    <GridCard :item="card" :pie-color="'#246FE5'" />
                </GridLayoutItem>
            </template>
        </GridLayout>
        <Empty v-else :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>

<script setup>
import i18n from '@/localization';
import Empty from '@/components/Empty.vue';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import Panel from '../components/base/panel.vue';
import GridCard from '../components/grid-card.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
const VENTILATION_FAN_TYPES = [
    'ACVTSF_SEND_FAN', // '通风风机-送风机'
    'FFSCMF_SEND_FAN', // '送风兼消防补风机'
    'ACVTSF_RECEIVE_FAN', // '通风风机-排风机'
    'FFSCAF_RECEIVE_FAN' // '排风兼机械排烟风机'
];
const { data, getDutyHomeData, startDataPolling, loaded, loading } = useHomeDataHook();
defineProps({
    size: {
        type: String,
        default: '1*1'
    },
    title: {
        type: String,
        default: i18n.global.t('common.meos_home_ventilation')
    }
});
const cards = computed(() => {
    if (data.value?.childCardList) {
        return data.value?.childCardList?.map(child => {
            return {
                ...child,
                interveneTotal: 0,
                canJump: false,
                demandTemplate: null
            };
        });
        // .sort((a, b) => {
        //     return VENTILATION_FAN_TYPES.indexOf(a?.nameCode) - VENTILATION_FAN_TYPES.indexOf(b?.nameCode);
        // });
    }
    return [];
});
onMounted(() => {
    // 获取数据
    startDataPolling({ systemList: ['VENTILATION'] }, '.vent-row-grid');
    getDutyHomeData({ systemList: ['VENTILATION'] }, '.vent-row-grid');
});
</script>
<style lang="less" scoped>
.vent-row-grid {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
}
.vent-row {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
    grid-auto-rows: minmax(auto, 110px);
}
</style>
