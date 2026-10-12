<template>
    <div class="value-choice-container" :style="{ 'row-gap': isRightSmallSize ? '12px' : '20px' }">
        <TitleWithPrefix :title="i18n.global.t('meos_control_web.value_selection')" />
        <div class="card-tips-data-container" :style="{ background: currentItem?.background }">
            <div class="tips-container">
                <div class="top">
                    <svg v-if="currentItem?.icon" class="icon" aria-hidden="true" style="height: 20px; width: 20px">
                        <use :xlink:href="currentItem?.icon" />
                    </svg>
                    <div class="title" :style="{ color: currentItem?.color }">{{ currentItem?.title || '--' }}</div>
                </div>
                <span v-ellipsis :class="['tips', isRightSmallSize ? 'm-ellipsis' : '']">{{ currentItem?.tips || '--' }}</span>
            </div>
            <div class="data-container" :style="{ background: currentItem?.rateBg }">
                <div v-if="isQualityFirst || isEnergyLowest" class="data-title">
                    {{ `${i18n.global.t('meos_control_web.satisfaction_rate_percent_item', { item: curEnvParamName })}：${singleRate?.toString() ? singleRate + '%' : '--'}` }}
                </div>
                <template v-else-if="isCastLowest || isCarbonEmissionsLowest">
                    <div class="data-title">
                        {{ i18n.global.t('meos_control_web.satisfaction_rate_percent_item', { item: curEnvParamName }) }}
                    </div>
                    <ExpandFoldBox v-if="Object.keys(curChoiceItem)?.length" :slot-key="currentPlayingTime">
                        <div v-if="fillRate?.length" class="rows-container">
                            <div v-for="(item, index) in fillRate" :key="index" class="row-item">
                                <div class="row-title">
                                    {{
                                        `${item?.intervalMin ?? '--'}${index === 0 ? '≤' : '<'}${curChoiceItem?.name || ''}≤${item?.intervalMax ?? '--'}${
                                            curChoiceItem?.unit || ''
                                        }：`
                                    }}
                                </div>
                                <div class="row-data">{{ `${item[curEnvFillRateKey] ?? 0}%` }}</div>
                            </div>
                        </div>
                        <div v-else>--</div>
                    </ExpandFoldBox>
                </template>
            </div>
        </div>
        <template v-if="showLineChartStatistic">
            <div v-if="isCastLowest || isCarbonEmissionsLowest" class="data-chart-container" :style="{ height: isRightSmallSize ? '180px' : '230px' }">
                <LineChartStatistic v-if="curEnvParam === 'CO2'" :cur-choice-item="curChoiceItem" :statistic="elecDataList" />
                <LineChartStatistic v-else :cur-choice-item="curChoiceItem" :statistic="elecDataList" />
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import TitleWithPrefix from '@/components/title-prefix/index.vue';
import { currentEnvParamInjectKey, isRightSmallSizeInjectKey, currentPlayingTimeInjectKey } from '../constant/injectKey';
import { ENV_TABS } from '../../constants/constant';
import ExpandFoldBox from '@/components/expand-fold-box/index.vue';
import LineChartStatistic from './LineChartStatistic.vue';
import Decimal from 'decimal.js';
import { toRef } from 'vue';

const props = defineProps({
    valueSelection: {
        type: Object,
        default: () => {}
    },
    isRightSmallSize: {
        type: Boolean,
        default: undefined
    },
    showLineChartStatistic: {
        type: Boolean,
        default: true
    },
    curEnvParamKey: {
        type: String,
        default: 'temperature'
    }
});

const currentPlayingTime = inject(currentPlayingTimeInjectKey);
const isRightSmallSize = typeof props.isRightSmallSize === 'undefined' ? inject(isRightSmallSizeInjectKey) : toRef(props, 'isRightSmallSize');
const curEnvParam = inject(currentEnvParamInjectKey) || toRef(props, 'curEnvParamKey');
const curEnvParamName = computed(() => {
    const res = ENV_TABS.find(v => v?.id === curEnvParam?.value)?.name;
    return res;
});
const curEnvMapValueChoice = {
    CO2: {
        name: i18n.global.t('meos_control_web.carbon_factor'),
        unit: 'kgCO₂/kWh',
        key: 'co2FillRate'
    },
    temperature: {
        name: i18n.global.t('meos_control_web.electricity_price'),
        unit: i18n.global.t('meos_control_web.yuan'),
        key: 'tempFillRate'
    }
};

const valueSelectType = computed(() => {
    return props.valueSelection?.valueSelectType;
});
const isCastLowest = computed(() => valueSelectType.value === 'value_select_lowest_cast');
const isCarbonEmissionsLowest = computed(() => valueSelectType.value === 'value_select_Lowest_carbon_emissions');
const isEnergyLowest = computed(() => valueSelectType.value === 'value_select_lowest_energy');
const isQualityFirst = computed(() => valueSelectType.value === 'value_select_quality_first');

const curChoiceItem = computed(() => {
    if (isCastLowest.value) {
        return curEnvMapValueChoice.temperature;
    }
    if (isCarbonEmissionsLowest.value) {
        return curEnvMapValueChoice.CO2;
    }
    return {};
});

const curEnvFillRateKey = computed(() => {
    const res = curEnvMapValueChoice[curEnvParam.value]?.key;
    return res;
});

const fillRate = computed(() => {
    return props.valueSelection?.fillRate;
});
const singleRate = computed(() => {
    const fillRateArr = fillRate.value;
    if (isEnergyLowest.value) {
        const keyString = curEnvFillRateKey?.value || '';
        return fillRateArr?.[0]?.[keyString];
    }
    return 100;
});

const elecDataList = computed(() => {
    const fillRateArr = fillRate.value;
    const curChoiceKey = curEnvFillRateKey.value;
    const listArr = props.valueSelection?.elecDataList;
    const finalRes = listArr?.map(item => {
        const { dataValue } = item || {};
        const curFillRateItem = fillRateArr?.find(v => {
            const { intervalMin, intervalMax } = v || {};
            if (intervalMin && intervalMax && dataValue) {
                const num1 = new Decimal(intervalMin);
                const num2 = new Decimal(intervalMax);
                const curNum = new Decimal(dataValue);
                const isBiggerMin = curNum.greaterThanOrEqualTo(num1);
                const isSmallerMax = curNum.lessThanOrEqualTo(num2);
                return isBiggerMin && isSmallerMax;
            }
            return false;
        });
        return {
            ...item,
            dataValue: dataValue ?? null,
            curFillRate: curFillRateItem?.[curChoiceKey]
        };
    });
    return finalRes;
});

const tipsMapArr = [
    {
        code: 'value_select_lowest_cast',
        icon: '#icon-playback-fee-low',
        color: '#E68600',
        background: 'linear-gradient(272deg, #fde9d0 0%, rgba(253, 233, 208, 0.48) 100%)',
        rateBg: 'rgba(255, 255, 255, 0.40)',
        title: i18n.global.t('meos_control_web.lowest_cost'),
        tips: i18n.global.t('meos_control_web.lower_temp_when_tariff_low_higher_when_high')
    },
    {
        code: 'value_select_Lowest_carbon_emissions',
        icon: '#icon-playback-co2-low',
        color: '#0C9B4A',
        background: 'linear-gradient(272deg, #D6F1E1 0%, rgba(214, 241, 225, 0.48) 100%)',
        rateBg: 'rgba(255, 255, 255, 0.40)',
        title: i18n.global.t('meos_control_web.lowest_carbon_emission'),
        tips: i18n.global.t('meos_control_web.carbon_factor_temp_adjust')
    },
    {
        code: 'value_select_lowest_energy',
        icon: '#icon-playback-energy-low',
        color: '#215DD9',
        background: 'linear-gradient(272deg, #D0E4FD 0%, rgba(208, 228, 253, 0.48) 100%)',
        rateBg: 'rgba(255, 255, 255, 0.40)',
        title: i18n.global.t('meos_control_web.min_energy_consumption'),
        tips: i18n.global.t('meos_control_web.value_select_lowest_energy_desc')
    },
    {
        code: 'value_select_quality_first',
        icon: '#icon-playback-quality-best',
        color: '#00A2A7',
        background: 'linear-gradient(272deg, #B0ECED 0%, rgba(195, 238, 238, 0.48) 100%)',
        rateBg: 'rgba(255, 255, 255, 0.40)',
        title: i18n.global.t('meos_control_web.optimal_quality'),
        tips: i18n.global.t('meos_control_web.value_select_quality_first_desc')
    }
];

const currentItem = computed(() => {
    if (valueSelectType.value) {
        return tipsMapArr.find(v => v?.code === valueSelectType.value) || {};
    }
    return undefined;
});
</script>

<style lang="less" scoped>
.value-choice-container {
    display: flex;
    flex-direction: column;
}

.card-tips-data-container {
    display: flex;
    flex-direction: column;

    border-radius: 4px;

    .tips-container {
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        padding: 12px 20px;
    }

    .top {
        display: flex;
        align-items: center;
        column-gap: 6px;
    }

    .icon {
        color: white;
    }
    .title {
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
    }

    .tips {
        color: @grey-500;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }

    .data-container {
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        padding: 12px 20px;
    }

    .data-title {
        color: @grey-800;

        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
    }

    .rows-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        column-gap: 32px;
        row-gap: 8px;
    }

    .row-item {
        display: flex;
        align-items: center;
    }

    .row-title {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
    }

    .row-data {
        color: @grey-800;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
}

.data-chart-container {
    min-height: 180px;
}
</style>
