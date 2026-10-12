<template>
    <Panel :loading="loading" :title="title" :card-tag="data?.cardTag" title-path="/kitchen-fumes">
        <div v-if="!loaded" class="cook-row-grid"></div>
        <GridLayout v-else-if="loaded && data?.childCardList" class="vent-row row" :gutter="8">
            <GridLayoutItem v-for="(card, index) in data.childCardList" :key="index" class="vent-col col bc" :span="index === 0 ? 8 : 4">
                <GridCard :item="card" />
            </GridLayoutItem>
        </GridLayout>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
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
defineProps({
    size: {
        type: String,
        default: '1*1'
    },
    title: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_exhaust_lampblack')
    }
});
const { data, getDutyHomeData, startDataPolling, loaded, loading } = useHomeDataHook();
onMounted(() => {
    // 获取数据
    startDataPolling({ systemList: ['KITCHEN_RANGE_HOOD'] });
    getDutyHomeData({ systemList: ['KITCHEN_RANGE_HOOD'] });
});
</script>
<style lang="less" scoped>
.cook-row-grid {
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
