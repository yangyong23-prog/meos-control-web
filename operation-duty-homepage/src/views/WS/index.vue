<template>
    <Panel id="ws-panel" :loading="loading" :title="title" :card-tag="data?.cardTag">
        <div v-if="!loaded" class="ws-row-grid"></div>
        <GridLayout v-else-if="loaded && cardList?.length" class="vent-row row" :gutter="12">
            <template v-if="cardList?.length >= 4">
                <GridLayoutItem v-for="(card, index) in cardList.slice(0, 4)" :key="index" class="vent-col col bc" :span="6">
                    <WsGridCard :item="card"></WsGridCard>
                </GridLayoutItem>
            </template>
            <template v-else-if="cardList?.length === 3">
                <GridLayoutItem class="vent-col col bc" :span="12">
                    <WsGridCard :item="cardList[0]" :show-pie="cardList[0].classCode === 'WSDWPP'"></WsGridCard>
                </GridLayoutItem>
                <GridLayoutItem v-for="(card, index) in cardList.slice(1, 3)" :key="index" class="vent-col col bc" :span="6">
                    <WsGridCard :item="card"></WsGridCard>
                </GridLayoutItem>
            </template>
            <template v-else>
                <GridLayoutItem class="vent-col col bc" :span="12">
                    <WsGridCard :item="cardList[0]" :show-pie="cardList[0].classCode === 'WSDWPP'"></WsGridCard>
                </GridLayoutItem>
                <GridLayoutItem v-for="(card, index) in cardList.slice(1, 3)" :key="index" class="vent-col col bc" :span="12">
                    <WsGridCard :item="card"></WsGridCard>
                </GridLayoutItem>
            </template>
        </GridLayout>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Empty from '@/components/Empty.vue';
import Panel from '@/views/components/base/panel.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import WsGridCard from './ws-grid-card.vue';
// 排序用到的classCode
// 1. 生活给水水泵【WSDWPP】
// 2. 集水坑【WSSTCP】
// 3. 隔油池【WSSTOS】
// 4. 餐饮除油成套设备【WSSTOR】
// 5. 污废水一体式提升机组【WSSTLU】
const MAP_FILTER_CLSDDCODES = ['WSDWPP', 'WSSTCP', 'WSSTOS', 'WSSTOR', 'WSSTLU'];

defineProps({
    title: {
        type: String,
        default: i18n.global.t('common.water_supply_and_drainage')
    },
    cardCount: {
        type: Number,
        default: 3
    }
});
const { getDutyHomeData, data, startDataPolling, loaded, loading } = useHomeDataHook();
const cardList = computed(() => {
    if (data.value && data.value.childCardList) {
        return data.value.childCardList
            .filter(card => card.levelAlarm || card.equipmentTotal)
            .sort((a, b) => MAP_FILTER_CLSDDCODES.indexOf(a.classCode) - MAP_FILTER_CLSDDCODES.indexOf(b.classCode));
    }
    return [];
});
onMounted(() => {
    // TODO
    startDataPolling({ systemList: ['WATER_SUPPLY'] }, '.ws-row-grid');
    getDutyHomeData({ systemList: ['WATER_SUPPLY'] }, '.ws-row-grid');
});
</script>
<style lang="less" scoped>
.vent-row {
    flex-grow: 1;
    padding: 0 12px;
    grid-template-rows: repeat(2, 1fr);
}
</style>
