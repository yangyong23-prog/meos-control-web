<template>
    <GridLayout class="vent-row row" :gutter="12">
        <GridLayoutItem class="vent-col col bc" :span="6">
            <gridCardData :title="i18n.global.t('operation_duty_homepage.meos_home_number_of_boilers_in_operation')" :items="guolu" :data-status="statuses" />
        </GridLayoutItem>
        <GridLayoutItem class="vent-col col bc" :span="6">
            <gridCardData :title="i18n.global.t('operation_duty_homepage.meos_home_number_of_water_pumps_in_operation')" :items="waterNumber" />
        </GridLayoutItem>
        <GridLayoutItem class="vent-col col bc" :span="4">
            <gridCardData :title="i18n.global.t('common.outlet_water_temp')" :items="chushui" />
        </GridLayoutItem>
        <GridLayoutItem class="vent-col col bc" :span="4">
            <gridCardData :title="i18n.global.t('common.return_water_temp')" :items="huishui" />
        </GridLayoutItem>
        <GridLayoutItem class="vent-col col bc" :span="4">
            <gridCardData :title="i18n.global.t('common.supply_return_temp_diff')" :items="wencha" />
        </GridLayoutItem>
    </GridLayout>
</template>
<script setup>
import i18n from '@/localization';
import gridCardData from '../components/grid-card-data.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import GridCardBar from '../components/grid-card-bar.vue';
import GridLayout from '@/components/grid/GridLayout.vue';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
const combustionStateEnumMap = {
    1: i18n.global.t('common.big_fire'),
    2: i18n.global.t('common.small_fire'),
    3: i18n.global.t('common.no_fire')
};
const statuses = computed(() => {
    if (props.data?.runningStatistics?.boilerCombustionStates) {
        return props.data?.runningStatistics?.boilerCombustionStates.map(r => {
            return {
                ...r,
                status: combustionStateEnumMap[r.combustionStateEnum]
            };
        });
    }
    return [];
});
const guolu = computed(() => {
    if (props.data && props.data.runningStatistics && props.data.runningStatistics.boilerNum) {
        return [
            {
                value: props.data.runningStatistics.boilerNum,
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
const chushui = computed(() => {
    if (props.data && props.data.heatWaterMainSupplyTemp) {
        return [
            {
                value: Number(props.data.heatWaterMainSupplyTemp).toFixed(2),
                unit: '℃'
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
const huishui = computed(() => {
    if (props.data && props.data.heatWaterMainReturnTemp) {
        return [
            {
                value: Number(props.data.heatWaterMainReturnTemp).toFixed(2),
                unit: '℃'
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
const wencha = computed(() => {
    if (props.data && (props.data.heatWaterDetaTemp || props.data.waterDetaTemp)) {
        return [
            {
                value: Number(props.data.heatWaterDetaTemp || props.data.waterDetaTemp).toFixed(2),
                unit: '℃'
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
</script>
<style lang="less" scoped></style>
