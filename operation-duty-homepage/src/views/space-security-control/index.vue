<template>
    <Panel :loading="loading" :title="title" title-path="/space-security-control" :card-tag="data?.cardTag">
        <div v-if="!loaded" class="ac-row-grid"></div>
        <GridLayout v-else-if="loaded && listCards.length" class="vent-row row" :gutter="listCards.length">
            <GridLayoutItem v-for="(card, index) in listCards" :key="index" class="vent-col col bc">
                <SpaceSecurityCard :item="card" />
            </GridLayoutItem>
        </GridLayout>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Panel from '@/views/components/base/panel.vue';
import Empty from '@/components/Empty.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import SpaceSecurityCard from './space-security-card.vue';
defineProps({
    title: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_space_security')
    }
});
const codeOrders = ['CAMERA', 'DOOR', 'BURGLARALARMDEVICE'];
const { getDutyHomeData, data, startDataPolling, loaded, loading } = useHomeDataHook();
const listCards = computed(() => {
    let ret = [];
    if (loaded.value && data.value?.listSecurityChildCard?.length) {
        data.value?.listSecurityChildCard.forEach(child => {
            const item = {
                name: child.name,
                namCode: child.nameCode,
                children: []
            };
            if (child?.onlineStatusTotal !== undefined) {
                item.children.push({
                    label: i18n.global.t('operation_duty_homepage.meos_home_online'),
                    runningTotal: child.onlineStatusTotal,
                    equipmentTotal: child.equipmentTotal,
                    color: '#2481F2'
                });
            }
            if (child?.runStatusTotal !== undefined) {
                item.children.push({
                    label: i18n.global.t('common.status_open'),
                    runningTotal: child.runStatusTotal,
                    equipmentTotal: child.equipmentTotal,
                    color: '#14C4C4'
                });
            }
            if (child?.armingStatusTotal !== undefined) {
                item.children.push({
                    label: i18n.global.t('common.arm'),
                    runningTotal: child.armingStatusTotal,
                    equipmentTotal: child.equipmentTotal,
                    color: '#14C4C4'
                });
            }
            if (item.children.length) {
                ret.push(item);
            }
        });
    }
    ret = ret.sort((a, b) => codeOrders.indexOf(a.namCode) - codeOrders.indexOf(b.namCode));
    return ret;
});
onMounted(() => {
    // TODO
    startDataPolling({ systemList: ['SECURITY'] });
    getDutyHomeData({ systemList: ['SECURITY'] });
});
</script>
<style lang="less" scoped>
.vent-row {
    flex-grow: 1;
    padding: 0 12px;
}
</style>
