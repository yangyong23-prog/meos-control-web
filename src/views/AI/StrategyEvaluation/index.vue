<template>
    <div class="conatiner wh100">
        <div class="content">
            <div class="header">
                <div class="header-back fcc" @click="emits('back')"><IconMeriComponentChevronLeft color="#8B949E" />{{ i18n.global.t('meos_control_web.back') }}</div>
                <div class="title fcc">
                    <span>{{ i18n.global.t('meos_control_web.strategy_evaluation') }}</span>
                    <!-- <StrategyIcon /> -->
                </div>
            </div>

            <div class="body">
                <div class="first-column">
                    <!-- 卡片 -->
                    <div v-for="(d, index) in firstColumnData" :key="d.title" class="frame-parent" :class="[d.action ? 'hover' : '', index === 1 ? 'frame-parent-grow' : '']">
                        <div class="icon-parent">
                            <component :is="d.svg"></component>
                            <b class="co2">{{ d.title }}</b>
                        </div>
                        <div class="wrapper">
                            <div v-if="d.html" class="div" :style="{ paddingRight: '12px' }" v-html="d.desc"></div>
                            <div v-else class="div" :style="{ paddingRight: '12px' }">
                                {{ d.desc }} <span @click="toDemandManage">{{ d.action }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-for="(s, index) in stgyIndicatorList" :key="index" class="column" :class="[s.isBest ? 'best' : '', selectCode === s.code ? 'active' : '']">
                    <bestStra v-if="s.isBest" class="tag"></bestStra>
                    <template v-for="(row, i) in s.data" :key="row.title">
                        <div v-if="i === 0" class="star-parent">
                            <star v-if="s.isBest"></star>
                            <greyStar v-else></greyStar>
                            <div class="parent">
                                <div class="div">{{ row.title }}</div>
                                <b v-ellipsis class="b m-ellipsis">{{ row.value }}</b>
                            </div>
                        </div>
                        <div v-else class="instance-parent">
                            <div class="group" @click="toDetail(s, row)">
                                <div class="div">{{ row.title }}</div>
                                <div class="parent3">
                                    <b class="div" :style="{ color: row.isBest ? '#8252E3' : '#1B2129' }">{{ row.showText || row.value }}</b>
                                    <div class="frame">
                                        <b class="div5" :style="{ color: row.isBest ? '#8252E3' : '#1B2129' }">{{ row.unit }}</b>
                                    </div>
                                    <iconStar v-if="row.isBest" />
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n, { SupportLanguage, getLocaleLang, DEFAULT_LANG } from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import icon from '@/assets/svg/AI/icon.svg';
import icon1 from '@/assets/svg/AI/icon-1.svg';
import icon2 from '@/assets/svg/AI/icon-2.svg';
import icon3 from '@/assets/svg/AI/icon-3.svg';
import icon4 from '@/assets/svg/AI/icon-4.svg';
import iconStar from '@/assets/svg/AI/icon-star.svg';
import star from '@/assets/svg/AI/star.svg';
import greyStar from '@/assets/svg/AI/greyStar.svg';
import { jumpToOperationCriterionPage } from '@/utils/envUtils';
import { formatNumber } from '@/utils';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { CHART_TYPE, SPACE_PREDICTION, TEMPERATURE, CO2, HUMIDITY } from '../variable';
import { strategyOverviewKey, hasSomeEnableHumidityKey } from '../hooks/useStaticData';
import { $Message } from 'meri-plus';
import { defineAsyncComponent } from 'vue';
import { isUndefined } from 'lodash';

const bestStra = defineAsyncComponent(() =>
    getLocaleLang(DEFAULT_LANG) === SupportLanguage.en ? import('@/assets/locales/en/best-stra.svg') : import('@/assets/locales/zh/best-stra.svg')
);

const props = defineProps({
    selectCode: {
        type: String,
        default: () => ''
    },
    startTime: {
        type: String,
        default: () => ''
    },
    stgyCodeList: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(['back']);

const strategyOverview = inject(strategyOverviewKey);
const hasSomeEnableHumidity = inject(hasSomeEnableHumidityKey);

const firstColumnData = ref([
    {
        svg: icon,
        title: i18n.global.t('meos_control_web.quality_operation_standard'),
        desc: i18n.global.t('meos_control_web.quality_standard_core_basis'),
        action: i18n.global.t('meos_control_web.view_quality_standard')
    },
    {
        svg: icon1,
        title: i18n.global.t('meos_control_web.rigid_unsatisfied_area'),
        desc: i18n.global.t('meos_control_web.rigid_non_compliant_area'),
        html: true
    },
    {
        svg: icon2,
        title: i18n.global.t('meos_control_web.temperature_compliance_ratio'),
        desc: i18n.global.t('meos_control_web.space_temp_comfort_ratio')
    },
    {
        svg: icon3,
        title: i18n.global.t('meos_control_web.co2_concentration_compliance_ratio'),
        desc: i18n.global.t('meos_control_web.zone_co2_comfort_ratio')
    },
    {
        svg: icon4,
        title: i18n.global.t('meos_control_web.cooling_station_energy_cost'),
        desc: i18n.global.t('meos_control_web.energy_cost_minimization_under_environmental_quality_compliance')
    }
]);

const stgyIndicatorList = computed(() => {
    const round = v => {
        return v === null || v === undefined || Number.isNaN(Number(v)) ? '--' : Math.round(Number(v) * 10) / 10;
    };

    const integer = v => {
        return v === null || v === undefined || Number.isNaN(Number(v)) ? '--' : Math.round(Number(v));
    };

    return markBestValues(
        props.stgyCodeList.map(s => {
            const stgyIndicator = s.content?.data?.[0]?.stgyIndicator;
            const data = [
                {
                    title: i18n.global.t('meos_control_web.strategy_code'),
                    value: s.code
                },
                {
                    title: i18n.global.t('meos_control_web.rigid_unsatisfied_area'),
                    value: round(stgyIndicator?.rigidUnsatisfiedArea),
                    unit: 'm²',
                    type: SPACE_PREDICTION.space.key,
                    systemId: TEMPERATURE,
                    isDisContent: true
                },
                {
                    title: i18n.global.t('meos_control_web.temperature_compliance_ratio'),
                    value: round(stgyIndicator?.tempComplianceRatio),
                    unit: '%',
                    type: SPACE_PREDICTION.space.key,
                    systemId: TEMPERATURE
                },
                {
                    title: i18n.global.t('meos_control_web.co2_concentration_compliance_ratio'),
                    value: round(stgyIndicator?.co2ComplianceRatio),
                    unit: '%',
                    type: SPACE_PREDICTION.space.key,
                    systemId: CO2
                },
                !isUndefined(stgyIndicator?.rhComplianceRatio) && hasSomeEnableHumidity?.value
                    ? {
                          title: i18n.global.t('meos_control_web.humidity_compliance_ratio'),
                          value: round(stgyIndicator?.rhComplianceRatio),
                          unit: '%',
                          type: SPACE_PREDICTION.space.key,
                          systemId: HUMIDITY
                      }
                    : null,
                {
                    title: i18n.global.t('meos_control_web.cooling_station_energy_consumption'),
                    value: integer(stgyIndicator?.coldStationEnergySum),
                    unit: 'kWh',
                    type: SPACE_PREDICTION.cold.key,
                    systemId: CHART_TYPE.EnergyConsumptionView
                },
                {
                    title: i18n.global.t('meos_control_web.cooling_station_cost'),
                    value: integer(stgyIndicator?.coldStationCostSum),
                    showText: integer(stgyIndicator?.coldStationCostSum) === '--' ? '--' : formatNumber(integer(stgyIndicator?.coldStationCostSum)),
                    unit: i18n.global.t('meos_control_web.yuan'),
                    type: SPACE_PREDICTION.cold.key,
                    systemId: CHART_TYPE.CostView
                },
                {
                    title: i18n.global.t('meos_control_web.cooling_station_carbon_emission'),
                    value: integer(stgyIndicator?.coldStationCarbonSum),
                    unit: 'kgCO₂e',
                    type: SPACE_PREDICTION.cold.key,
                    systemId: CHART_TYPE.CarbonEmissionView
                }
            ].filter(Boolean);
            return {
                isBest: s.isBest,
                code: s.code,
                data
            };
        })
    );
});

/**
 * 标记每个指标的最优值（最小值或最大值）
 * @param {Array} strategies 策略数组
 * @returns 添加了isBest标记后的策略数组
 */
function markBestValues(strategies) {
    const metricsRules = [
        { title: i18n.global.t('meos_control_web.rigid_unsatisfied_area'), type: 'min' },
        { title: i18n.global.t('meos_control_web.temperature_compliance_ratio'), type: 'max' },
        { title: i18n.global.t('meos_control_web.humidity_compliance_ratio'), type: 'max' },
        { title: i18n.global.t('meos_control_web.co2_concentration_compliance_ratio'), type: 'max' },
        { title: i18n.global.t('meos_control_web.cooling_station_energy_consumption'), type: 'min' },
        { title: i18n.global.t('meos_control_web.cooling_station_cost'), type: 'min' },
        { title: i18n.global.t('meos_control_web.cooling_station_carbon_emission'), type: 'min' }
    ];

    // 第一步：收集所有策略中可比较的数值
    const metricValues = {};

    metricsRules.forEach(rule => {
        const { title } = rule;
        metricValues[title] = [];

        strategies.forEach(s => {
            const item = s.data.find(d => d.title === title);
            // 只收集数字类型的值（忽略空字符串）
            if (item && !isNaN(parseFloat(item.value))) {
                metricValues[title].push(parseFloat(item.value));
            }
        });
    });

    // 第二步：计算每个指标的最优值
    const bestValues = {};

    Object.keys(metricValues).forEach(title => {
        const values = metricValues[title];
        if (values.length === 0) return;

        const rule = metricsRules.find(r => r.title === title);
        bestValues[title] = rule.type === 'min' ? Math.min(...values) : Math.max(...values);
    });

    // 第三步：给最优值添加标记
    strategies.forEach(s => {
        s.data.forEach(item => {
            // 跳过策略编码和空值
            if (item.title === i18n.global.t('meos_control_web.strategy_code') || item.value === '') return;

            const numericValue = parseFloat(item.value);
            if (!isNaN(numericValue)) {
                const bestVal = bestValues[item.title];
                // 在误差范围内比较浮点数（处理精度问题）
                item.isBest = Math.abs(numericValue - bestVal) < 1e-5;
            }
        });
    });

    return strategies;
}

const toDemandManage = () => {
    jumpToOperationCriterionPage({ date: dayjs(props.startTime).format('YYYY-MM-DD') });
};

const toDetail = (stra, param) => {
    const { code } = props.stgyCodeList?.[0] || {};
    const node = strategyOverview?.value?.find?.(item => {
        const { stgyCodeList } = item || {};
        const strategyNode = stgyCodeList?.find?.(strategyItem => {
            return code === strategyItem?.code;
        });
        return !!strategyNode;
    });

    if (!node) {
        return $Message.error({ title: i18n.global.t('meos_control_web.latest_strategy_generated_no_history') });
    }

    emitter.emit('PE-detail-click', {
        ...stra,
        ...param,
        stgyCodeList: props.stgyCodeList
    });
};
</script>

<style lang="less" scoped>
.conatiner {
    background-image: url('@/assets/imgs/strategy-evaluation.jpg');
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--gray-0);
    z-index: 10;

    .content {
        overflow: scroll;
        height: 100%;
        width: 100%;
        display: flex;
        padding: 48px 24px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 28px;
        flex: 1 0 0;
        align-self: stretch;

        .header {
            display: flex;
            flex-direction: row;
            align-items: center;
            max-width: 1608px;
            width: 100%;
            .header-back {
                cursor: pointer;
                margin-right: 8px;
                padding: 4px 8px 4px;
                border-radius: 4px;
                height: 30px;
                &:hover {
                    background-color: var(--gray-200);
                }
            }
            .title {
                flex: 1;
                gap: 10px;
                span {
                    color: var(--gray-900, #1b2129);
                    font-size: 32px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                }
            }
        }

        .body {
            display: flex;
            flex-direction: row;
            justify-content: center;
            column-gap: 20px;
            width: 100%;

            .first-column {
                display: flex;
                flex-direction: column;
                row-gap: 20px;
                flex: 1.5;
                max-width: 550px;
                justify-content: space-between;
                // max-height: 748px;
                min-height: 594px;

                .frame-parent {
                    position: relative;
                    backdrop-filter: blur(4px);
                    border-radius: 8px;
                    background-color: rgba(255, 255, 255, 0.5);
                    border: 1px solid #fff;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    padding: 12px 0px 12px 12px;
                    gap: 12px;

                    text-align: center;
                    font-size: 16px;
                    color: #2e3742;
                    // height: 108px;
                    flex-shrink: 2;
                    // max-height: 236px;

                    &.frame-parent-grow {
                        height: auto;
                        min-height: 108px;
                        // max-height: 236px;
                        flex: 1;
                    }

                    .icon-parent {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        gap: 4px;
                    }
                    .div {
                        flex: 1;
                        position: relative;

                        span {
                            color: #246fe5;
                        }
                    }
                    .wrapper {
                        line-height: 24px;
                        align-self: stretch;
                        padding: 0px 0px 0px 29px;
                        text-align: left;
                        font-size: 14px;
                        color: #626c78;
                        overflow: hidden;
                        &:hover {
                            overflow: auto;
                        }
                    }
                    &.hover {
                        .div {
                            span {
                                &:hover {
                                    cursor: pointer;
                                    color: #1b4acc;
                                }
                            }
                        }
                    }
                }
            }
        }
        .column {
            display: flex;
            flex-direction: column;
            flex: 1;
            position: relative;
            backdrop-filter: blur(4px);
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.6);

            border: 1px solid #fff;
            box-sizing: border-box;

            overflow: hidden;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            max-width: 332px;
            // min-width: 332px;
            // max-height: 748px;
            min-height: 594px;

            font-size: 14px;
            color: #626c78;

            &.best {
                border: 2px solid #8184ff;
                .star-parent {
                    background-color: #e2e2fe;
                }

                .instance-parent {
                    .group {
                        background: #f3f3ff;
                    }
                }
                .instance-parent:hover {
                    .group {
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                    .parent3 {
                        .div {
                            color: var(--blue-500, #246fe5) !important;
                        }
                        .frame {
                            .div5 {
                                color: var(--blue-500, #246fe5) !important;
                            }
                        }
                    }
                }
            }

            .tag {
                position: absolute;
                top: -5px;
                right: -9px;
                z-index: 1;
            }

            .star-parent {
                align-self: stretch;
                backdrop-filter: blur(4px);
                border-radius: 8px 8px 0px 0px;
                background-color: #f1f4f6;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                padding: 24px 16px;
                gap: 4px;

                .parent {
                    align-self: stretch;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 8px;
                }

                .b {
                    max-width: 100%;
                    position: relative;
                    font-size: 24px;
                    line-height: 24px;
                    color: #2e3742;
                }
            }
            .instance-parent {
                cursor: pointer;
                align-self: stretch;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                flex: 1;
                &:last-child .group {
                    border-bottom: 0px;
                }
                .group {
                    align-self: stretch;
                    backdrop-filter: blur(4px);
                    border-bottom: 1px solid #e8ecf0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 0 16px;
                    flex: 1;
                    row-gap: 8px;

                    .div {
                        position: relative;
                        line-height: 24px;
                    }

                    .parent3 {
                        display: flex;
                        flex-direction: row;
                        align-items: flex-end;
                        justify-content: flex-start;
                        gap: 4px;
                        font-size: 22px;
                        color: #8252e3;

                        .frame {
                            height: 18px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            text-align: left;
                            font-size: 12px;
                        }

                        .div5 {
                            position: relative;
                        }
                    }
                }
            }
            .instance-parent:hover {
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                .parent3 {
                    .div {
                        color: var(--blue-500, #246fe5) !important;
                    }
                    .frame {
                        .div5 {
                            color: var(--blue-500, #246fe5) !important;
                        }
                    }
                }
            }
        }

        .active {
            animation: 850ms cubic-bezier(0.25, 0.1, 0.25, 1) 50ms 2 fadeGray;
        }

        @keyframes fadeGray {
            0% {
                border-color: #fff;
            }
            35.29% {
                border-color: #9b6ced;
            }
            41.18% {
                border-color: #9b6ced;
            }
            100% {
                border-color: #fff;
            }
        }
    }
}
@media screen and (min-width: 1440px) {
    .conatiner {
        .content {
            padding: 48px 24px;
            gap: 28px;

            .body {
                column-gap: 12px;
                height: calc(100% - 88px);
                .first-column {
                    row-gap: 12px;
                }
            }
        }
    }
}
@media screen and (max-width: 1440px) {
    .conatiner {
        .content {
            padding: 12px 24px;
            gap: 14px;

            .body {
                column-gap: 12px;
                height: calc(100% - 52px);
                .first-column {
                    row-gap: 12px;
                }
            }
        }
    }
}
</style>
