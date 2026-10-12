<template>
    <div :id="outId" class="policy-evaluation-card" :class="active ? 'policy-evaluation-card-active' : 'policy-evaluation-card-unactive'" @click="outClick">
        <div :id="titleId" class="policy-evaluation-card-title">
            <ClockSVG />
            <span v-ellipsis class="title-text">{{ i18n.global.t('meos_control_web.calculation_time_colon') }}{{ computedStartTime }}</span>
            <span v-if="last" class="last-tip">{{ i18n.global.t('meos_control_web.latest') }}</span>
        </div>
        <div class="dashed-line">
            <svg xmlns="http://www.w3.org/2000/svg" width="360" height="2" viewBox="0 0 360 2" fill="none">
                <path d="M0 1H616" stroke="#C4C9CF" stroke-opacity="0.6" stroke-dasharray="5 4" />
            </svg>
        </div>
        <!-- AI描述 -->
        <div class="AI-desc">
            {{ i18n.global.t('meos_control_web.current_value_selected_is') }}
            <span class="AI-desc-typeA"> {{ valueSelectText }} </span>
            {{ desc }}
            <a v-if="active" class="AI-desc-detailA" @click="policyItem(props.index)">{{ i18n.global.t('meos_control_web.view_strategy_evaluation_detail') }}</a>
        </div>
        <div
            v-for="(item, strategyCodeIndex) in currentStrategyList"
            :id="item.isBest ? bestId : ''"
            :key="strategyCodeIndex"
            class="policy-item"
            :class="item.isBest ? 'policy-best-item' : ''"
            @click="policyItem(strategyCodeIndex)"
        >
            <div v-ellipsis class="policy-code">{{ i18n.global.t('meos_control_web.strategy_code_colon') }}{{ item.code }}</div>
            <div class="policy-desc">
                <div class="common-info-col">
                    <div class="info-col-data">
                        <span v-ellipsis="{ title: `${tempComplianceRatio(strategyCodeIndex)}%` }" class="info-value">{{ tempComplianceRatio(strategyCodeIndex) }}</span>
                        <span class="info-unit">%</span>
                    </div>
                    <div v-ellipsis class="info-col-label">{{ i18n.global.t('meos_control_web.temperature_compliance_ratio') }}</div>
                </div>
                <div class="common-info-col">
                    <div class="info-col-data">
                        <span v-ellipsis="{ title: `${coldStationCostSum(strategyCodeIndex)}${i18n.global.t('meos_control_web.yuan')}` }" class="info-value">
                            {{ coldStationCostSum(strategyCodeIndex) }}
                        </span>
                        <span class="info-unit">{{ i18n.global.t('meos_control_web.yuan') }}</span>
                    </div>
                    <div v-ellipsis class="info-col-label">{{ i18n.global.t('meos_control_web.cost') }}</div>
                </div>
                <div class="common-info-col">
                    <div class="info-col-data">
                        <span v-ellipsis="{ title: `${rigidUnsatisfiedArea(strategyCodeIndex)}m²` }" class="info-value">
                            {{ rigidUnsatisfiedArea(strategyCodeIndex) }}
                        </span>
                        <span class="info-unit">m²</span>
                    </div>
                    <div v-ellipsis class="info-col-label">{{ i18n.global.t('meos_control_web.rigid_unsatisfied_area') }}</div>
                </div>
            </div>
            <div v-if="active && item.isBest" :id="iconId" class="best-icon">
                <StartSVG></StartSVG>
                <span v-ellipsis class="meos-ellipsis-line">{{ i18n.global.t('meos_control_web.optimal_evaluation') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { defineProps } from 'vue';
import ClockSVG from '@/assets/svg/clock.svg';
import StartSVG from '@/assets/svg/start.svg';
import emitter from '@/utils/bus';
import { uuid } from 'yushu-js-utils';
import { strategyOverviewKey } from '../../../../../hooks/useStaticData';
import { activeStrategyIndexKey, headerCenterStateKey } from '../../../../../injectionKey';
import dayjs from 'dayjs';
import { round } from 'lodash';

const strategy = inject(strategyOverviewKey);
const activeIndex = inject(activeStrategyIndexKey);
const headerCenterState = inject(headerCenterStateKey);

const outId = ref('PECard_outId_' + uuid(5));
const titleId = ref('PECard_tilte_' + uuid(5));
const bestId = ref('PECard_best_' + uuid(5));
const iconId = ref('PECard_iconId_' + uuid(5));

const valueSelectMap = {
    VALUE_SELECT_LOWEST_CAST: i18n.global.t('meos_control_web.lowest_cost'),
    VALUE_SELECT_LOWEST_CARBON_EMISSIONS: i18n.global.t('meos_control_web.lowest_carbon_emission'),
    VALUE_SELECT_LOWEST_ENERGY: i18n.global.t('meos_control_web.min_energy_consumption'),
    VALUE_SELECT_QUALITY_FIRST: i18n.global.t('meos_control_web.quality_priority')
};

const descMap = {
    VALUE_SELECT_LOWEST_CAST: '，' + i18n.global.t('meos_control_web.lower_total_cost_better_under_same_temperature_compliance_rate'),
    VALUE_SELECT_LOWEST_CARBON_EMISSIONS: '，' + i18n.global.t('meos_control_web.lower_total_carbon_better_under_same_temperature_compliance_rate'),
    VALUE_SELECT_LOWEST_ENERGY: '，' + i18n.global.t('meos_control_web.lower_total_energy_better_under_same_temperature_compliance_rate'),
    VALUE_SELECT_QUALITY_FIRST: '，' + i18n.global.t('meos_control_web.need_satisfy_all_space_quality_standards')
};

const props = defineProps({
    index: {
        type: Number,
        default: 0
    }
});

const last = computed(() => {
    return props.index === 0;
});

const active = computed(() => {
    return props.index === activeIndex.value;
});

const bestIndex = ref(null);

const currentStrategyList = computed(() => {
    return strategy?.value?.[props.index]?.stgyCodeList ?? [];
});

const computedStartTime = computed(() => {
    // 展示开始时间
    if (strategy?.value?.[props.index]?.startTime) {
        const date = dayjs(strategy.value[props.index].startTime, 'YYYY-MM-DD HH:mm:ss', true);
        return date.format('YYYY-MM-DD HH:mm');
    }
    return '--';
});

const valueSelectText = computed(() => {
    if (!strategy.value[props.index] || !strategy.value[props.index].valueSelectType) return '--';
    const type = strategy.value[props.index].valueSelectType.toUpperCase();
    return valueSelectMap[type] ? valueSelectMap[type] : '--';
});

const desc = computed(() => {
    if (!strategy.value[props.index] || !strategy.value[props.index].valueSelectType) return '';
    const type = strategy.value[props.index].valueSelectType.toUpperCase();
    return descMap[type] ? descMap[type] : '';
});

const getStrategyIndicator = codeIndex => {
    return strategy?.value?.[props.index]?.stgyCodeList?.[codeIndex]?.content?.data?.[0]?.stgyIndicator ?? null;
};

const formatRatio = (value, digits = 1) => {
    if (typeof value === 'number') {
        return round(value, digits);
    }
    return value ?? '--';
};

const formatNumberMetric = (value, digits = 0) => {
    if (value === null || value === undefined) {
        return '--';
    }
    return round(value, digits).toLocaleString();
};

const tempComplianceRatio = codeIndex => {
    return formatRatio(getStrategyIndicator(codeIndex)?.tempComplianceRatio, 1);
};

const coldStationCostSum = codeIndex => {
    return formatNumberMetric(getStrategyIndicator(codeIndex)?.coldStationCostSum, 0);
};

const rigidUnsatisfiedArea = codeIndex => {
    return formatNumberMetric(getStrategyIndicator(codeIndex)?.rigidUnsatisfiedArea, 1);
};

onMounted(() => {
    nextTick(() => {
        emitter.emit('PEcard', {
            outId: outId.value,
            titleId: titleId.value,
            bestId: bestId.value,
            iconId: iconId.value,
            index: props.index
        });
    });
});

const currentStgyCodeList = computed(() => {
    return {
        stgyCodeList: strategy?.[props.index]?.stgyCodeList || [],
        totalLen: strategy?.length || 0
    };
});

watch(
    currentStgyCodeList,
    value => {
        if (!value.stgyCodeList || value.totalLen === 0) return;
        const index = value.stgyCodeList.findIndex(item => {
            return item.isBest;
        });
        if ((bestIndex.value !== null || value.totalLen === 1) && bestIndex.value !== index) {
            nextTick(() => {
                emitter.emit('PEcard-best', {
                    titleId: titleId.value,
                    bestId: bestId.value,
                    iconId: iconId.value,
                    index: props.index
                });
            });
        }
        bestIndex.value = index;
    },
    {
        deep: true,
        immediate: true
    }
);

emitter.on('AI-response-update', () => {
    if (!strategy.value || strategy.value.length === 0) return;
    const index = strategy.value[props.index].stgyCodeList.findIndex(item => {
        return item.isBest;
    });
    if ((bestIndex.value !== null || strategy.value.length === 1) && bestIndex.value !== index) {
        nextTick(() => {
            emitter.emit('PEcard-best', {
                titleId: titleId.value,
                bestId: bestId.value,
                iconId: iconId.value,
                index: props.index
            });
        });
    }
    bestIndex.value = index;
});

const policyItem = index => {
    if (!active.value) return;
    if (headerCenterState.value === 0 || headerCenterState.value === 1 || headerCenterState.value === 2) {
        emitter.emit('PE-item-click', {
            stgyIndex: props.index,
            stgyCodeIndex: index
        });
    }
};

const outClick = () => {
    emitter.emit('PE-out-click', {
        index: props.index
    });
};

onBeforeUnmount(() => {
    emitter.off('AI-response-update');
});
</script>

<style lang="less" scoped>
.policy-evaluation-card {
    overflow: hidden;
    padding: 12px 16px 20px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.8) inset;
    .policy-evaluation-card-title {
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(216, 214, 221, 0.2) 0%, rgba(232, 228, 234, 0.08) 100%);
        .title-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 4px;
            color: var(--gray-600, #626c78);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .last-tip {
            padding: 4px;
            display: flex;
            padding: 0px 4px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border-radius: 2px;
            background: var(--violet-100, #f1e5fe);
            color: var(--violet-700, #683bd6);
            font-feature-settings: 'liga' off, 'clig' off;
            /* 内文辅助文本 */
            font-family: 'Microsoft YaHei UI';
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 166.667% */
        }
    }
    .dashed-line {
        margin: 12px 0px 12px 0px;
        height: 2px;
        position: relative;
        svg {
            width: 100%;
            position: absolute;
            top: 0px;
        }
    }
    .AI-desc {
        color: var(--gray-600, #626c78);
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: 'Microsoft YaHei UI';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 171.429% */
        .AI-desc-typeA {
            color: var(--gray-600, #626c78);
            font-weight: 700;
        }
        .AI-desc-detailA {
            color: var(--blue-500, #246fe5);
            &:hover {
                color: var(--blue-700);
            }
        }
    }
    .policy-item {
        position: relative;
        margin-top: 16px;
        display: flex;
        padding: 12px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        align-self: stretch;
        border-radius: 8px;
        border: 1px solid var(--gray-200, #e8ecf0);
        background: var(--gray-100, #f1f4f6);
        .policy-code {
            color: var(--gray-600, #626c78);
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            padding: 2px 8px;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            max-width: calc(100% - 80px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .policy-desc {
            width: 100%;
            height: 54px;
            display: flex;
            justify-content: space-between;
            .common-info-col {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .info-col-data {
                    height: 24px;
                    white-space: nowrap;
                    .info-value {
                        display: inline-block;
                        color: var(--gray-800, #2e3742);
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: 24px; /* 150% */
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-family: CustomMedium2;
                        max-width: calc(100% - 30px);
                    }
                    .info-unit {
                        display: inline-block;
                        vertical-align: top;
                        color: var(--gray-800, #2e3742);
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 28px; /* 200% */
                    }
                }
                .info-col-label {
                    color: var(--gray-600, #626c78);
                    text-overflow: ellipsis;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px; /* 157.143% */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .common-info-col:nth-child(1) {
                width: 33%;
            }
            .common-info-col:nth-child(2) {
                width: 31%;
            }
            .common-info-col:nth-child(3) {
                width: 36%;
            }
        }
    }
}

.policy-evaluation-card-active {
    margin-top: 0px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.6) inset;
    .policy-evaluation-card-title {
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(213, 202, 240, 0.45) 0%, rgba(232, 228, 234, 0.08) 100%);
    }
    .AI-desc {
        .AI-desc-typeA {
            color: var(--turquoise-600, #09b3b5);
            font-weight: 700;
        }
    }
    .policy-item {
        .best-icon {
            display: flex;
            align-items: center;
            position: absolute;
            height: 28px;
            right: 0px;
            top: 0px;
            padding: 0px 6px;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 20px; /* 142.857% */
            color: var(--Grey-Grey-0, #fff);
            border-radius: 0px 4px 0px 4px;
            background: linear-gradient(135deg, #22d1da -14.58%, #7d84ff 44.79%, #e67dff 104.17%);
        }
        &:has(.best-icon) {
            .policy-code {
                max-width: 50%;
            }
        }
    }
    .policy-item:nth-last-child(3) {
        border: 1px solid #e1d4ff;
        background: linear-gradient(94deg, rgba(227, 215, 255, 0.2) 0%, rgba(206, 185, 255, 0.2) 50.44%);
        .policy-code {
            background: #d8def8;
        }
    }
    .policy-item:nth-last-child(2) {
        border: 1px solid #a3e6f6;
        background: linear-gradient(94deg, rgba(153, 235, 255, 0.2) 0%, rgba(153, 235, 255, 0.2) 50.44%);
        .policy-code {
            background: #ceebfa;
        }
    }
    .policy-item:nth-last-child(1) {
        border: 1px solid #f7e7c0;
        background: linear-gradient(94deg, rgba(255, 242, 194, 0.2) 0%, rgba(255, 231, 142, 0.2) 50.44%);
        .policy-code {
            background: #f1edcf;
        }
    }
    .policy-item:hover {
        border: 1px solid var(--blue-500, #246fe5);
        background: var(--blue-100, #d9ebff);
        box-shadow: 0px 4px 8px 0px rgba(99, 148, 230, 0.32);
        .policy-code {
            background: #c9dff4 !important;
        }
    }
    .policy-best-item {
        border: 2px solid #8184ff !important;
    }
    .policy-item:hover {
        cursor: pointer;
        border: 1px solid var(--blue-500, #246fe5);
        background: var(--blue-100, #d9ebff);
        box-shadow: 0px 4px 8px 0px rgba(99, 148, 230, 0.32);
        .policy-code {
            background: #c9dff4 !important;
        }
    }
}
.policy-evaluation-card-unactive {
    &:hover {
        cursor: pointer;
    }
}
</style>
