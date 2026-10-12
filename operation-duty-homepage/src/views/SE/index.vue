<template>
    <Panel :loading="loading || menuloading" :title="title" title-path="/SE" :title-params="titleParams" :card-tag="data?.cardTag">
        <div v-if="!loaded" class="ac-row-grid"></div>
        <GridLayout v-else-if="loaded && list.length" class="vent-row row" :gutter="list.length">
            <GridLayoutItem v-for="(card, index) in list" :key="index" class="vent-col col" :span="1">
                <SeCard :item="card" />
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
import { useMenuDataHook } from '@/hooks/useMenuDataHook';
import { isNumber } from 'lodash';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import SeCard from './se-card.vue';
defineProps({
    title: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_power_transformation_and_distribution_system')
    }
});
const { getDutyHomeData, data, startDataPolling, loaded, loading } = useHomeDataHook();
const { menuloaded, menuloading, getMenuData, menus } = useMenuDataHook();
const isEmpty = data => data === '' || data === null || typeof data === 'undefined';
const list = computed(() => {
    let res = [],
        first = [], // 前三
        last = []; // 后三
    if (data.value && data.value?.childCardList?.length) {
        const objects = data.value?.childCardList || [];

        objects.forEach(item => {
            item.luloadRate = !isEmpty(item.luloadRate) ? +item.luloadRate : null;
        });

        const ret = objects.sort((a, b) => {
            const aValue = isNumber(+a.luloadRate) ? a.luloadRate : -1;
            const bValue = isNumber(b.luloadRate) ? b.luloadRate : -1;
            return bValue - aValue;
        });
        // 大于等于6个分两组且，每组为3个
        if (ret.length > 5) {
            first = ret.slice(0, 3);
            last = ret.reverse().slice(0, 3);
            res = [
                {
                    title: i18n.global.t('operation_duty_homepage.meos_home_top_3_in_real-time_load_rate'),
                    children: first
                },
                {
                    title: i18n.global.t('operation_duty_homepage.meos_home_last_3_in_real-time_load_rate'),
                    children: last
                }
            ];
        } else if (ret.length === 5) {
            // 小于6个时，如果不能均分，对半分前面多分，后面少分
            first = ret.slice(0, 3);
            last = ret.slice(-2);
            res = [
                {
                    title: i18n.global.t('operation_duty_homepage.meos_home_real-time_load_rate_ranking'),
                    children: first
                },
                {
                    title: '',
                    children: last
                }
            ];
        } else if (ret.length === 4) {
            first = ret.slice(0, 2);
            last = ret.slice(-2);
            res = [
                {
                    title: i18n.global.t('operation_duty_homepage.meos_home_real-time_load_rate_ranking'),
                    autoGrow: true,
                    children: first
                },
                {
                    title: '',
                    autoGrow: true,
                    children: last
                }
            ];
        } else if (ret.length === 3) {
            res = [
                {
                    title: i18n.global.t('operation_duty_homepage.meos_home_real-time_load_rate_ranking'),
                    children: ret
                }
            ];
        } else {
            res = [
                {
                    title: i18n.global.t('operation_duty_homepage.meos_home_real-time_load_rate_ranking'),
                    children: ret
                }
            ];
        }
    }

    return res;
});
const titleParams = computed(() => {
    if (menus.value) {
        const item = menus.value.children.find(child => child.id === '低压配电系统');
        if (item && item.children && item.children.length) {
            const info = item.children[0];
            return {
                sysName: info.localName,
                graphTypeCode: info.graphTypeCode,
                classCode: ''
            };
        }
        return {};
    }
    return {};
});
onMounted(() => {
    // TODO
    getMenuData();
    startDataPolling({ systemList: ['POWER_DISTRIBUTION'] }, '.ac-row-grid');
    getDutyHomeData({ systemList: ['POWER_DISTRIBUTION'] }, '.ac-row-grid');
});
</script>
<style lang="less" scoped>
.vent-row {
    flex-grow: 1;
    padding: 0 12px;
}
</style>
