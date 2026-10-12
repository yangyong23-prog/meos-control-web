<template>
    <Panel :loading="loading" :title="title" :card-tag="data?.cardTag">
        <div v-if="!loaded" class="lighting-row-grid"></div>
        <GridLayout v-if="loaded && data?.childCardList?.length" class="vent-row row" :gutter="8">
            <template v-for="(card, index) in data.childCardList" :key="index">
                <GridLayoutItem v-if="card.canJump" class="vent-col col bc" :span="8">
                    <GridCardPro :item="card" />
                </GridLayoutItem>
            </template>
        </GridLayout>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>

<script setup>
import i18n from '@/localization';
import Empty from '@/components/Empty.vue';
import Panel from '../components/base/panel.vue';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import GridCardPro from '../components/grid-card-pro.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
defineProps({
    size: {
        type: String,
        default: '1*1'
    },
    title: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_lighting_system')
    }
});
const { data, getDutyHomeData, startDataPolling, loaded, loading } = useHomeDataHook();
onMounted(() => {
    // 获取照明数据
    startDataPolling({ systemList: ['LIGHTING'] }, '.lighting-row-grid');
    getDutyHomeData({ systemList: ['LIGHTING'] }, '.lighting-row-grid');
});
</script>
<style lang="less" scoped>
.lighting-row-grid {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
}
.vent-row {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
    height: 230px;
    grid-auto-rows: minmax(auto, 71.33px);
}
</style>
