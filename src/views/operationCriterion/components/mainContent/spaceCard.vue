<template>
    <div class="criterion-spaceinfo-card">
        <div class="criterion-spaceinfo-card-title">
            <span v-ellipsis class="ocg-space-card-title-type m-ellipsis">{{
                building ? item?.instanceName || topName?.buildingLocalName : item?.instanceName || topName?.floorLocalName
            }}</span>
            <span class="ocg-space-card-title-building">
                {{ topBracketName }}
            </span>
            <div v-if="ACtimeRange" v-ellipsis class="ocg-space-card-title-info m-ellipsis" v-html="ACtimeRange"></div>
            <div v-if="adjustTimeRange" v-ellipsis class="ocg-space-card-title-info m-ellipsis" v-html="adjustTimeRange"></div>
        </div>
        <div class="criterion-spaceinfo-card-info">
            <div class="ocg-card-info-data">
                <div class="ocg-card-info-data-tag">
                    <span>{{ i18n.global.t('meos_control_web.temperature') }}</span>
                </div>
                <div class="ocg-card-info-data-values">
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ temperatureList.val1 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.comfort_range') }}
                        </div>
                    </div>
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ temperatureList.val2 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.high_threshold') }}
                        </div>
                    </div>
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ temperatureList.val3 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.low_threshold') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="ocg-card-info-data">
                <div class="ocg-card-info-data-tag">
                    <span>CO₂</span>
                </div>
                <div class="ocg-card-info-data-values">
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ carbonDioxideList.val1 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.comfort_zone_upper') }}
                        </div>
                    </div>
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ carbonDioxideList.val2 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.high_threshold') }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isRhQualityEnabled" class="ocg-card-info-data">
                <div class="ocg-card-info-data-tag">
                    <span>{{ i18n.global.t('meos_control_web.humidity') }}</span>
                </div>
                <div class="ocg-card-info-data-values">
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ humidityList.val1 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.comfort_range') }}
                        </div>
                    </div>
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ humidityList.val2 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.high_threshold') }}
                        </div>
                    </div>
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ humidityList.val3 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.low_threshold') }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isPressureDiffQualityEnabled" class="ocg-card-info-data">
                <div class="ocg-card-info-data-tag">
                    <span>{{ i18n.global.t('meos_control_web.differential_pressure') }}</span>
                </div>
                <div class="ocg-card-info-data-values">
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ pressureDiffList.val1 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.pressure_diff_lower_limit_value') }}
                        </div>
                    </div>
                    <div class="ocg-cidv-part">
                        <div v-ellipsis class="ocg-cidv-part-label">
                            {{ pressureDiffList.val2 }}
                        </div>
                        <div v-ellipsis class="ocg-cidv-part-value">
                            {{ i18n.global.t('meos_control_web.pressure_diff_upper_limit_value') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="criterion-spaceinfo-card-btn">
            <dropdownBtn v-bind="$props" :item="item" :space-title="i18n.global.t('meos_control_web.space_refers_to_this_standard')"></dropdownBtn>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import dropdownBtn from '../common/dropdownBtn.vue';
import { transformTimesToView } from '@/views/operationCriterion/utils';
import { currentSeasonTypeKey } from '@/views/operationCriterion/constant';

const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    },
    building: {
        type: Boolean,
        default: false
    }
});

const currentSeasonType = inject(currentSeasonTypeKey);

const ACtimeRange = computed(() => {
    if (props.item?.isAlgorithmCompute) {
        return `${i18n.global.t('meos_control_web.hvac_demand_time_auto_calculated')}`;
        // 无需求
    } else if (props.item?.noDemand) {
        return `${i18n.global.t('meos_control_web.hvac_demand_time_no_demand')}`;
    } else {
        return `${i18n.global.t('meos_control_web.hvac_demand_time_colon')}${
            props.item?.airConditioningDemandTimeIntervals && props.item?.airConditioningDemandTimeIntervals.length
                ? transformTimesToView(props.item.airConditioningDemandTimeIntervals).join('&nbsp;&nbsp;')
                : '--'
        }`;
    }
});
const adjustTimeRange = computed(() => {
    return `${
        props.item?.isAllowResponseRegulation && props.item?.responseRegulationTimeIntervals && props.item?.responseRegulationTimeIntervals.length
            ? i18n.global.t('meos_control_web.allow_response_adjustment_colon') + transformTimesToView(props.item.responseRegulationTimeIntervals).join('&nbsp;&nbsp;')
            : ''
    }`;
});
const topBracketName = computed(() => {
    if (props.item.buildingName && props.item.floorName) {
        return `(${props.item.buildingName}-${props.item.floorName})`;
    }
    if (props.item.buildingName) {
        return `(${props.item.buildingName})`;
    }
    if (props.item.floorName) {
        return `(${props.item.floorName})`;
    }
    return '';
});
const topName = computed(() => {
    if (props.item && props.item.referenceSpace) {
        return props.item.referenceSpace.spaceDetail?.find(space => {
            if (space.floorId) {
                return true;
            }
        });
    }
    return null;
});
function fmtNum(val, unit) {
    if (val == null) return '--';
    const n = Number(val);
    return isNaN(n) ? '--' : n + unit;
}

function fmtRange(lo, hi, unit) {
    if (lo == null || hi == null) return '--';
    const nLo = Number(lo);
    const nHi = Number(hi);
    return isNaN(nLo) || isNaN(nHi) ? '--' : `${nLo}${unit}-${nHi}${unit}`;
}

const temperatureList = computed(() => {
    if (props.item && props.item?.tdbQuality && props.item.tdbQuality.seasonQuality) {
        const tempList = props.item.tdbQuality.seasonQuality.find(seasonQuality => seasonQuality.airSeason === currentSeasonType.value);
        if (tempList) {
            return {
                val1: fmtRange(tempList.lowerComfortSeasonLimitValue, tempList.upperComfortSeasonLimitValue, '°C'),
                val2: fmtNum(tempList.overHeatingSeasonLimitValue, '°C'),
                val3: fmtNum(tempList.underCoolingSeasonLimitValue, '°C')
            };
        }
    }
    return {
        val1: '--',
        val2: '--',
        val3: '--'
    };
});

const humidityList = computed(() => {
    if (props?.item?.rhQuality?.seasonQuality) {
        const tempList = props.item.rhQuality.seasonQuality.find(seasonQuality => seasonQuality.airSeason === currentSeasonType.value);
        if (tempList) {
            return {
                val1: fmtRange(tempList.lowerComfortSeasonLimitValue, tempList.upperComfortSeasonLimitValue, '%RH'),
                val2: fmtNum(tempList.overHeatingSeasonLimitValue, '%RH'),
                val3: fmtNum(tempList.underCoolingSeasonLimitValue, '%RH')
            };
        }
    }
    return {
        val1: '--',
        val2: '--',
        val3: '--'
    };
});

const pressureDiffList = computed(() => {
    if (props?.item?.pressureDiffQuality) {
        const tempList = props.item.pressureDiffQuality;
        return {
            val1: fmtNum(tempList.lowerLimitValue, 'Pa'),
            val2: fmtNum(tempList.upperLimitValue, 'Pa')
        };
    }
    return {
        val1: '--',
        val2: '--'
    };
});

const isRhQualityEnabled = computed(() => {
    return props?.item?.isRhQualityEnabled;
});

const isPressureDiffQualityEnabled = computed(() => {
    return props?.item?.isPressureDiffQualityEnabled;
});

const carbonDioxideList = computed(() => {
    if (props.item && props.item.co2Quality) {
        const tempList = props.item.co2Quality;
        if (tempList) {
            return {
                val1: tempList.carbonDioxideLimitValue ? tempList.carbonDioxideLimitValue + 'ppm' : '--',
                val2: tempList.carbonDioxideUpperLimitValue ? tempList.carbonDioxideUpperLimitValue + 'ppm' : '--'
            };
        }
    }
    return {
        val1: '--',
        val2: '--'
    };
});
</script>
<style lang="less" scoped>
.criterion-spaceinfo-card {
    display: flex;
    padding: 12px 20px 16px 20px;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 4px;
    background: rgba(196, 201, 207, 0.12);
    min-height: 162px;
    min-width: 500px;
    padding: 8px 16px;
    white-space: nowrap;
    .criterion-spaceinfo-card-title {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        margin-bottom: 12px;
        gap: 4px;
        .ocg-space-card-title-type {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px; /* 157.143% */
            max-width: 260px;
        }
        .ocg-space-card-title-building {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
        .ocg-space-card-title-info {
            flex: 1;
            overflow: hidden;
            color: var(--gray-500, #8b949e);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
    }
    .criterion-spaceinfo-card-info {
        display: flex;
        flex-direction: row;
        gap: 12px;
        margin-bottom: 6px;
        .ocg-card-info-data {
            display: flex;
            flex-direction: column;
            gap: 8px;
            .ocg-card-info-data-tag {
                display: flex;
                flex-direction: row;
                span {
                    display: flex;
                    padding: 0px 4px;
                    align-items: center;
                    flex-grow: 0;
                    flex-basis: 0;
                    flex-shrink: 0;
                    border-radius: 4px;
                    background: rgba(196, 201, 207, 0.5);
                    color: var(--gray-900, #1b2129);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: var(--platform-font-weight);
                    line-height: 22px; /* 157.143% */
                }
            }
            .ocg-card-info-data-values {
                display: flex;
                flex-direction: row;
                gap: 14px;
                .ocg-cidv-part {
                    display: flex;
                    flex-direction: column;
                    min-width: 80px;
                    max-width: 120px;
                    .ocg-cidv-part-label {
                        color: var(--gray-900, #1b2129);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: var(--platform-font-weight);
                        line-height: 22px; /* 157.143% */
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .ocg-cidv-part-value {
                        color: var(--gray-500, #8b949e);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: var(--platform-font-weight);
                        line-height: 22px; /* 157.143% */
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
    .criterion-spaceinfo-card-btn {
        border-radius: 4px;
        width: 100%;
        overflow: hidden;
    }
}
</style>
