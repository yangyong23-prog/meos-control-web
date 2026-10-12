<template>
    <div class="value-container" :style="{ background: currentData.background }">
        <div class="title">
            <svg class="icon" aria-hidden="true" style="width: 20px; height: 20px">
                <use :xlink:href="currentData.icon"></use>
            </svg>
            <span :style="{ color: currentData.color }">
                {{ currentData.title }}
            </span>
        </div>
        <div class="tips">{{ currentData.tips }}</div>
    </div>
</template>
<script setup>
import i18n from '@/localization';

const props = defineProps({
    valueSelectType: {
        type: String,
        default: ''
    }
});
const currentData = ref([]);
const tipsMapArr = [
    {
        code: 'value_select_lowest_cast',
        icon: '#icon-playback-fee-low',
        color: '#E68600',
        background: '#FFF3E3',
        title: i18n.global.t('meos_control_web.lowest_cost'),
        tips: i18n.global.t('meos_control_web.lower_temp_when_tariff_low_higher_when_high')
    },
    {
        code: 'value_select_Lowest_carbon_emissions',
        icon: '#icon-playback-co2-low',
        color: '#0C9B4A',
        background: '#E0FFEC',
        title: i18n.global.t('meos_control_web.lowest_carbon_emission'),
        tips: i18n.global.t('meos_control_web.carbon_factor_temp_adjust')
    },
    {
        code: 'value_select_lowest_energy',
        icon: '#icon-playback-energy-low',
        color: '#215DD9',
        background: '#E0EDFF',
        title: i18n.global.t('meos_control_web.min_energy_consumption'),
        tips: i18n.global.t('meos_control_web.value_select_lowest_energy_desc')
    },
    {
        code: 'value_select_quality_first',
        icon: '#icon-playback-quality-best',
        color: '#00A2A7',
        background: '#D0FDFD',
        rateBg: 'rgba(255, 255, 255, 0.40)',
        title: i18n.global.t('meos_control_web.optimal_quality'),
        tips: i18n.global.t('meos_control_web.value_select_quality_first_desc')
    }
];
watchEffect(() => {
    if (props.valueSelectType) {
        currentData.value = tipsMapArr.find(item => item.code === props.valueSelectType);
    }
});
</script>

<style lang="less" scoped>
.value-container {
    font-size: 14px;
    width: 262px;
    padding: 12px 20px;
    border-radius: 4px;
    .title {
        display: flex;
        align-items: center;
        font-weight: 700;
        svg {
            margin-right: 6px;
        }
    }
    .tips {
        color: #8b949e;
        margin-top: 8px;
    }
}
</style>
