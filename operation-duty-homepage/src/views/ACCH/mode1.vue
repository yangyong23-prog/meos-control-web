<template>
    <GridLayout class="vent-row row" :gutter="12">
        <GridLayoutItem v-if="isEdge()" class="vent-col col bc" :span="8">
            <GridCardPanel :data="data" />
        </GridLayoutItem>
        <GridLayoutItem class="vent-col col bc" :span="4">
            <GridCardData :title="i18n.global.t('operation_duty_homepage.meos_home_number_of_water_pumps_in_operation')" :items="waterNumber" />
        </GridLayoutItem>
        <GridLayoutItem class="vent-col col bc" :span="isEdge() ? 6 : 4">
            <GridCardList :title="i18n.global.t('operation_duty_homepage.meos_home_primary_side_index')" :column-layout="!isEdge()" :items="firstIndicators" />
        </GridLayoutItem>
        <GridLayoutItem class="vent-col col bc" :span="isEdge() ? 6 : 4">
            <GridCardList :title="i18n.global.t('operation_duty_homepage.meos_home_secondary_side_index')" :column-layout="!isEdge()" :items="secIndicators" />
        </GridLayoutItem>
    </GridLayout>
</template>
<script setup>
import i18n from '@/localization';
import GridCardData from '../components/grid-card-data.vue';
import GridCardList from '../components/grid-card-list.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import GridCardBar from '../components/grid-card-bar.vue';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridCardPanel from '../components/grid-card-panel.vue';
import { isEdge } from '@/utils/tools';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
const waterNumber = computed(() => {
    if (props.data && props.data.runningStatistics && props.data.runningStatistics.heatSupplyPumpNum) {
        return [
            {
                value: props.data.runningStatistics.heatSupplyPumpNum,
                unit: i18n.global.t('common.tai')
            }
        ];
    }
    return [
        {
            value: '--',
            unit: ''
        }
    ];
});
const firstIndicators = computed(() => {
    const items = [];
    if (props.data) {
        items.push({
            label: i18n.global.t('common.outlet_water_temp'),
            value: props.data.heatWaterMainSupplyTemp || '--'
        });
        items.push({
            label: i18n.global.t('common.return_water_temp'),
            value: props.data.heatWaterMainReturnTemp || '--'
        });
        items.push({
            label: i18n.global.t('common.supply_return_temp_diff'),
            value: props.data.waterDetaTemp || '--'
        });
    } else {
        items.push({
            label: i18n.global.t('common.outlet_water_temp'),
            value: '--'
        });
        items.push({
            label: i18n.global.t('common.return_water_temp'),
            value: '--'
        });
        items.push({
            label: i18n.global.t('common.supply_return_temp_diff'),
            value: '--'
        });
    }
    return items;
});

const secIndicators = computed(() => {
    const items = [];
    if (props.data) {
        items.push({
            label: i18n.global.t('common.outlet_water_temp'),
            value: props.data.heatWaterMainSupplyTemp2 || '--'
        });
        items.push({
            label: i18n.global.t('common.return_water_temp'),
            value: props.data.heatWaterMainReturnTemp2 || '--'
        });
        items.push({
            label: i18n.global.t('common.supply_return_temp_diff'),
            value: props.data.heatSecondarySideWaterDetaTemp || '--'
        });
    } else {
        items.push({
            label: i18n.global.t('common.outlet_water_temp'),
            value: '--'
        });
        items.push({
            label: i18n.global.t('common.return_water_temp'),
            value: '--'
        });
        items.push({
            label: i18n.global.t('common.supply_return_temp_diff'),
            value: '--'
        });
    }
    return items;
});
</script>
<style lang="less" scoped></style>
