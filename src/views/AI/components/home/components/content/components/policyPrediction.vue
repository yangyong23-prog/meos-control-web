<template>
    <div :id="outId" class="policy-prediction-card" :class="active ? 'policy-prediction-card-active' : 'policy-prediction-card-unactive'" @click="outClick">
        <div class="policy-prediction-card-title">
            <ClockSVG />
            <span v-ellipsis class="title-text">{{ i18n.global.t('meos_control_web.calculation_time_colon') }}{{ computedStartTime }}</span>
            <span v-if="last" class="last-tip">{{ i18n.global.t('meos_control_web.latest') }}</span>
        </div>
        <!-- 分割线 -->
        <div class="dashed-line">
            <svg xmlns="http://www.w3.org/2000/svg" width="616" height="2" viewBox="0 0 616 2" fill="none">
                <path d="M0 1H616" stroke="#C4C9CF" stroke-opacity="0.6" stroke-dasharray="5 4" />
            </svg>
        </div>
        <!-- 策略 -->
        <div v-for="(item, strategyCodeIndex) in currentStrategyList" :key="strategyCodeIndex" class="policy-item">
            <div :id="lineLeftIds[strategyCodeIndex]" class="policy-item-space policy-item-common" @click="policyItem(strategyCodeIndex, SPACE_PREDICTION.space.key)">
                <div class="item-common-title">
                    <span v-ellipsis class="meos-ellipsis-line">{{ i18n.global.t('meos_control_web.space_quality_forecast') }}</span>
                    <span v-ellipsis>{{ i18n.global.t('meos_control_web.strategy_code_colon') }}{{ item.code }}</span>
                </div>
                <div class="item-common-info">
                    <div class="common-info-col">
                        <div class="info-col-data">
                            <span v-ellipsis="{ title: `${tempComplianceRatio(strategyCodeIndex)}%` }" class="info-value">{{ tempComplianceRatio(strategyCodeIndex) }}</span>
                            <span class="info-unit">%</span>
                        </div>
                        <div v-ellipsis class="info-col-label meos-ellipsis-line">{{ i18n.global.t('meos_control_web.temperature_compliance_ratio') }}</div>
                    </div>
                    <div class="common-info-col">
                        <div class="info-col-data">
                            <span v-ellipsis="{ title: `${co2ComplianceRatio(strategyCodeIndex)}%` }" class="info-value">
                                {{ co2ComplianceRatio(strategyCodeIndex) }}
                            </span>
                            <span class="info-unit">%</span>
                        </div>
                        <div v-ellipsis class="info-col-label meos-ellipsis-line">{{ i18n.global.t('meos_control_web.co2_compliance_ratio') }}</div>
                    </div>
                </div>
            </div>
            <div :id="lineRightIds[strategyCodeIndex]" class="policy-item-cold policy-item-common" @click="policyItem(strategyCodeIndex, SPACE_PREDICTION.cold.key)">
                <div class="item-common-title">
                    <span v-ellipsis class="meos-ellipsis-line">{{ i18n.global.t('meos_control_web.cooling_station_operation_forecast') }}</span>
                    <span v-ellipsis>{{ i18n.global.t('meos_control_web.strategy_code_colon') }}{{ item.code }}</span>
                </div>
                <div class="item-common-info">
                    <div class="common-info-col">
                        <div class="info-col-data">
                            <span v-ellipsis="{ title: `${coldStationEnergySum(strategyCodeIndex)}kwh` }" class="info-value">
                                {{ coldStationEnergySum(strategyCodeIndex) }}
                            </span>
                            <span class="info-unit">kWh</span>
                        </div>
                        <div v-ellipsis class="info-col-label meos-ellipsis-line">{{ i18n.global.t('meos_control_web.cooling_station_energy_consumption') }}</div>
                    </div>
                    <div class="common-info-col">
                        <div class="info-col-data">
                            <span v-ellipsis="{ title: `${spaceNeedCoolingSum(strategyCodeIndex)}kwh` }" class="info-value">{{ spaceNeedCoolingSum(strategyCodeIndex) }}</span>
                            <span class="info-unit">kWh</span>
                        </div>
                        <div v-ellipsis class="info-col-label meos-ellipsis-line">{{ i18n.global.t('meos_control_web.cooling_supply') }}</div>
                    </div>
                    <div class="common-info-col">
                        <div class="info-col-data">
                            <span v-ellipsis="{ title: `${coldStationCostSum(strategyCodeIndex)}${i18n.global.t('meos_control_web.yuan')}` }" class="info-value">{{
                                coldStationCostSum(strategyCodeIndex)
                            }}</span>
                            <span class="info-unit">{{ i18n.global.t('meos_control_web.yuan') }}</span>
                        </div>
                        <div v-ellipsis class="info-col-label meos-ellipsis-line">{{ i18n.global.t('meos_control_web.cost') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { defineProps } from 'vue';
import ClockSVG from '@/assets/svg/clock.svg';
import { uuid } from 'yushu-js-utils';
import emitter from '@/utils/bus';
import { strategyOverviewKey } from '../../../../../hooks/useStaticData';
import { activeStrategyIndexKey, headerCenterStateKey } from '../../../../../injectionKey';
import { SPACE_PREDICTION } from '@/views/AI/variable';
import dayjs from 'dayjs';
import { round } from 'lodash';

const strategy = inject(strategyOverviewKey);
const activeIndex = inject(activeStrategyIndexKey);
const headerCenterState = inject(headerCenterStateKey);

const props = defineProps({
    index: {
        type: Number,
        default: 0
    }
});

const outId = ref(`PPCard${uuid(5)}`);
const lineRightIds = ref(['PPCard_lineRight1' + uuid(5), 'PPCard_lineRight2' + uuid(5), 'PPCard_lineRight3' + uuid(5)]);
const lineLeftIds = ref(['PPCard_lineLeft1' + uuid(5), 'PPCard_lineLeft2' + uuid(5), 'PPCard_lineLeft3' + uuid(5)]);

const last = computed(() => {
    return props.index === 0;
});

const active = computed(() => {
    return props.index === activeIndex.value;
});

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

const getStrategyIndicator = codeIndex => {
    return strategy?.value?.[props.index]?.stgyCodeList?.[codeIndex]?.content?.data?.[0]?.stgyIndicator ?? null;
};

const formatRatio = (value, digits = 1) => {
    if (typeof value === 'number') {
        return round(value, digits);
    }
    return value ?? '--';
};

const formatIntegerMetric = value => {
    if (value === null || value === undefined) {
        return '--';
    }
    return round(value, 0).toLocaleString();
};

const tempComplianceRatio = codeIndex => {
    return formatRatio(getStrategyIndicator(codeIndex)?.tempComplianceRatio, 1);
};

const co2ComplianceRatio = codeIndex => {
    return formatRatio(getStrategyIndicator(codeIndex)?.co2ComplianceRatio, 1);
};

const coldStationEnergySum = codeIndex => {
    return formatIntegerMetric(getStrategyIndicator(codeIndex)?.coldStationEnergySum);
};

const coldStationCostSum = codeIndex => {
    return formatIntegerMetric(getStrategyIndicator(codeIndex)?.coldStationCostSum);
};

const spaceNeedCoolingSum = codeIndex => {
    return formatIntegerMetric(getStrategyIndicator(codeIndex)?.spaceNeedCoolingSum);
};

onMounted(() => {
    nextTick(() => {
        emitter.emit('PPcard', {
            outId: outId.value,
            lineRightIds: lineRightIds.value,
            lineLeftIds: lineLeftIds.value,
            index: props.index
        });
    });
});

// watch(
//     () => [active],
//     arr => {
//         if (arr[0].value) {
//             nextTick(() => {
//                 emitter.emit('PPcard', {
//                     outId: outId.value,
//                     lineRightIds: lineRightIds.value,
//                     lineLeftIds: lineLeftIds.value
//                 });
//             });
//         }
//     },
//     {
//         immediate: true,
//         deep: true
//     }
// );

const policyItem = (index, type) => {
    if (!active.value) return;
    if (headerCenterState.value === 0 || headerCenterState.value === 1 || headerCenterState.value === 2) {
        emitter.emit('PP-item-click', {
            stgyIndex: props.index,
            stgyCodeIndex: index,
            type: type
        });
    }
};

const outClick = () => {
    emitter.emit('PP-out-click', {
        index: props.index
    });
};
</script>

<style lang="less" scoped>
.policy-prediction-card {
    overflow: hidden;
    padding: 12px 16px 20px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.8) inset;
    .policy-prediction-card-title {
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(216, 214, 221, 0.2) 0%, rgba(232, 228, 234, 0.08) 100%);
        .title-text {
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
    .policy-item {
        margin-bottom: 16px;
        &:last-child {
            margin-bottom: 0px;
        }
        .policy-item-space {
            width: 220px;
        }
        .policy-item-cold {
            width: calc(100% - 238px);
            margin-left: 16px;
            .common-info-col {
                .info-col-label {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .common-info-col:nth-child(1) {
                width: 32%;
            }
            .common-info-col:nth-child(2) {
                width: 32%;
            }
            .common-info-col:nth-child(3) {
                width: 36%;
            }
        }
        .policy-item-common {
            box-sizing: border-box;
            height: 112px;
            border-radius: 8px;
            border: 1px solid var(--gray-200, #e8ecf0);
            background: var(--gray-100, #f1f4f6);
            padding: 12px;
            display: inline-flex;
            flex-direction: column;
            justify-content: space-between;
            .item-common-title {
                height: 22px;
                padding: 0px 8px;
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                color: var(--gray-600, #626c78);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                display: flex;
                :first-child {
                    width: 78px;
                    display: inline-block;
                    vertical-align: middle;
                    color: var(--gray-600, #626c78);
                    font-weight: 700;
                    box-sizing: border-box;
                }
                :last-child {
                    flex-grow: 1;
                    width: calc(100% - 86px);
                    box-sizing: border-box;
                    display: inline-block;
                    vertical-align: middle;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-left: 8px;
                }
            }
            .item-common-info {
                height: 54px;
                display: flex;
                justify-content: space-between;
                .common-info-col {
                    display: flex;
                    flex: 1;
                    width: 0;
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
                            max-width: calc(100% - 40px);
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
                    }
                }
            }
        }
    }
}

.policy-prediction-card-active {
    margin-top: 0px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.6) inset;
    overflow: hidden;
    .policy-prediction-card-title {
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(213, 202, 240, 0.45) 0%, rgba(232, 228, 234, 0.08) 100%);
    }
    .policy-item-space {
        .item-common-title {
            :first-child {
                color: var(--turquoise-800, #008e96) !important;
            }
        }
    }
    .policy-item-cold {
        .item-common-title {
            :first-child {
                color: var(--blue-500, #246fe5) !important;
            }
        }
    }
    .policy-item:nth-last-child(3) {
        .policy-item-common {
            border: 1px solid #e1d4ff;
            background: linear-gradient(94deg, rgba(227, 215, 255, 0.2) 0%, rgba(206, 185, 255, 0.2) 50.44%);
            .item-common-title {
                background: #d8def8;
            }
        }
    }
    .policy-item:nth-last-child(2) {
        .policy-item-common {
            border: 1px solid #a3e6f6;
            background: linear-gradient(94deg, rgba(153, 235, 255, 0.2) 0%, rgba(153, 235, 255, 0.2) 50.44%);
            .item-common-title {
                background: #ceebfa;
            }
        }
    }
    .policy-item:nth-last-child(1) {
        .policy-item-common {
            border: 1px solid #f7e7c0;
            background: linear-gradient(94deg, rgba(255, 242, 194, 0.2) 0%, rgba(255, 231, 142, 0.2) 50.44%);
            .item-common-title {
                background: #f1edcf;
            }
        }
    }
    .policy-item-common:hover {
        cursor: pointer;
        border: 1px solid var(--blue-500, #246fe5) !important;
        background: var(--blue-100, #d9ebff) !important;
        box-shadow: 0px 4px 8px 0px rgba(99, 148, 230, 0.32) !important;
        .item-common-title {
            background: #c9dff4 !important;
        }
    }
}
.policy-prediction-card-unactive {
    &:hover {
        cursor: pointer;
    }
}
@media screen and(max-width: 1440px) {
    // .policy-item-space {
    //     width: calc(50% - 16px);
    // }
    // .policy-item-cold {
    //     width: 50%;
    // }
}
@media screen and(min-width: 1440px) {
    // .policy-item-space {
    //     width: calc(50% - 16px);
    // }
    // .policy-item-cold {
    //     width: 50%;
    // }
}
@media screen and(min-width: 1600px) {
    // .policy-item-space {
    //     width: 262px;
    // }
    // .policy-item-cold {
    //     width: calc(100% - 278px);
    // }
}
@media screen and(min-width: 1920px) {
}

@media screen and(max-width: 1500px) {
    .policy-item-cold {
        .info-value {
            width: 40px;
        }
    }
}
</style>
