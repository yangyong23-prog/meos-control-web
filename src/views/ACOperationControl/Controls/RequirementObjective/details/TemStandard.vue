<template>
    <div class="tem-standard">
        <div class="box-item-title">{{ i18n.global.t('meos_control_web.temp_criterion') }}</div>
        <div class="tem-standard-main">
            <div class="tem-standard-box fcc">
                <div class="item-box">
                    <div class="item-box-name">{{ i18n.global.t('meos_control_web.cooling_season') }}</div>
                    <div class="item-box-list fc">
                        <div class="list-name">{{ i18n.global.t('meos_control_web.target_value') }}</div>
                        <div class="list-value fc">{{ handleVlaue(handUseData(objectSetting, objectParentSetting, 'coolingSeasonTargetValue', '')) || '--' }}°C</div>
                    </div>
                    <div class="item-box-list fc">
                        <div class="list-name fc">
                            {{ i18n.global.t('meos_control_web.upper_limit_value') }}&nbsp;
                            <m-tips :content="i18n.global.t('meos_control_web.max_temperature_limit_cooling_season_high_electricity_carbon')" theme="darkTransparent" width="400px">
                                <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                                    <use xlink:href="#icon-info" />
                                </svg>
                            </m-tips>
                        </div>
                        <div class="list-value">{{ handleVlaue(handUseData(objectSetting, objectParentSetting, 'coolingSeasonUpperLimitValue', '')) || '--' }}°C</div>
                    </div>
                    <div class="item-box-list fc">
                        <div class="list-name fc">
                            {{ i18n.global.t('meos_control_web.thermal_storage_value') }}&nbsp;
                            <m-tips
                                :content="i18n.global.t('meos_control_web.min_space_temperature_cold_storage_cooling_season_low_electricity_carbon')"
                                theme="darkTransparent"
                                width="400px"
                            >
                                <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                                    <use xlink:href="#icon-info" />
                                </svg>
                            </m-tips>
                        </div>
                        <div class="list-value">{{ handleVlaue(handUseData(objectSetting, objectParentSetting, 'coolingSeasonColdStorageValue', '')) || '--' }}°C</div>
                    </div>
                </div>
                <div class="item-box">
                    <div class="item-box-name">{{ i18n.global.t('meos_control_web.heating_season') }}</div>
                    <div class="item-box-list fc">
                        <div class="list-name">{{ i18n.global.t('meos_control_web.target_value') }}</div>
                        <div class="list-value">{{ handleVlaue(handUseData(objectSetting, objectParentSetting, 'heatingSeasonTargetValue', '')) || '--' }}°C</div>
                    </div>
                    <div class="item-box-list fc">
                        <div class="list-name fc">
                            {{ i18n.global.t('meos_control_web.lower_limit_value') }}&nbsp;
                            <m-tips :content="i18n.global.t('meos_control_web.min_temperature_limit_heating_season_high_electricity_carbon')" theme="darkTransparent" width="400px">
                                <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                                    <use xlink:href="#icon-info" />
                                </svg>
                            </m-tips>
                        </div>
                        <div class="list-value fc">{{ handleVlaue(handUseData(objectSetting, objectParentSetting, 'heatingSeasonLowerLimitValue', '')) || '--' }}°C</div>
                    </div>
                    <div class="item-box-list fc">
                        <div class="list-name fc">
                            {{ i18n.global.t('meos_control_web.heat_storage_value') }}&nbsp;
                            <m-tips
                                :content="i18n.global.t('meos_control_web.max_space_temperature_heat_storage_heating_season_low_electricity_carbon')"
                                theme="darkTransparent"
                                width="400px"
                            >
                                <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                                    <use xlink:href="#icon-info" />
                                </svg>
                            </m-tips>
                        </div>
                        <div class="list-value">{{ handleVlaue(handUseData(objectSetting, objectParentSetting, 'heatingSeasonHeatStorageValue', '')) || '--' }}°C</div>
                    </div>
                </div>
            </div>
            <template v-if="handUseData(objectSetting, objectParentSetting, 'isParticipateInScheduling', false)">
                <div class="tem-standard-item">
                    <div class="item-name fc">
                        {{ i18n.global.t('meos_control_web.daily_scheduling_duration') }}&nbsp;
                        <m-tips
                            :content="i18n.global.t('meos_control_web.daily_cooling_upper_or_heating_lower_limit_default_sacrificable_2')"
                            theme="darkTransparent"
                            width="400px"
                        >
                            <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                                <use xlink:href="#icon-info" />
                            </svg>
                        </m-tips>
                    </div>
                    <div class="item-value fc">
                        {{ handUseData(objectSetting, objectParentSetting, 'temperatureScheduledHourInDay', '') || '--' }}{{ i18n.global.t('meos_control_web.hour') }}
                    </div>
                </div>
                <div class="tem-standard-item">
                    <div class="item-name fc">
                        {{ i18n.global.t('meos_control_web.continuous_schedulable_duration') }}&nbsp;
                        <m-tips :content="i18n.global.t('meos_control_web.continuous_set_temp_limit_duration')" theme="darkTransparent" width="400px">
                            <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                                <use xlink:href="#icon-info" />
                            </svg>
                        </m-tips>
                    </div>
                    <div class="item-value fc">
                        {{ handUseData(objectSetting, objectParentSetting, 'temperatureContinuousScheduledHour', '') || '--' }}{{ i18n.global.t('meos_control_web.hour') }}
                    </div>
                </div>
                <div class="tem-standard-item">
                    <div class="item-name fc">
                        {{ i18n.global.t('meos_control_web.non_dispatchable_period') }}&nbsp;
                        <m-tips
                            :content="i18n.global.t('meos_control_web.non_schedulable_time_periods_prevent_sacrifice_during_special_periods')"
                            theme="darkTransparent"
                            width="400px"
                        >
                            <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                                <use xlink:href="#icon-info" />
                            </svg>
                        </m-tips>
                    </div>
                    <div class="item-value fc">
                        <template v-if="handUseData(objectSetting, objectParentSetting, 'temperatureUnscheduledTimeRange', [])?.length">
                            <div v-for="item in handUseData(objectSetting, objectParentSetting, 'temperatureUnscheduledTimeRange', [])" :key="item">
                                {{ handleTime(item) }}
                            </div>
                        </template>
                        <template v-else>{{ i18n.global.t('meos_control_web.all_day_adjustable') }}</template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { PropType } from 'vue';
import { ObjectSetting } from '../types';
import { handleVlaue, handleTime, handUseData } from '../utils';
defineProps({
    objectSetting: {
        type: Object as PropType<ObjectSetting>,
        default: () => ({})
    },
    objectParentSetting: {
        type: Object as PropType<ObjectSetting>,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.tem-standard {
    &-main {
        margin-left: 12px;
    }
    &-box {
        height: 162px;
        background-color: var(--gray-50);
        border-radius: 4px;
        margin-bottom: 16px;
        margin-left: -12px;
        margin-top: 16px;
        .item-box {
            padding: 12px;
            height: 100%;
            flex: 1;
            & + .item-box {
                border-left: 1px solid var(--gray-300);
            }
            .item-box-name {
                font-weight: 700;
                margin-bottom: 16px;
            }
            .item-box-list {
                height: 22px;
                & + .item-box-list {
                    margin-top: 16px;
                }
            }
            .list-name {
                width: 62px;
                color: var(--gray-600);
                margin-right: 12px;
                :deep(.m-popper-trigger) {
                    height: 14px;
                }
            }
        }
    }
    .tem-standard-item {
        display: flex;
        margin-bottom: 16px;
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    .item-name {
        height: 24px;
        width: 116.3px;
        margin-right: 12px;
        color: var(--gray-600);
        :deep(.m-popper-trigger) {
            height: 14px;
        }
    }
    .item-value {
        width: calc(100% - 132px);
        display: flex;
        grid-gap: 8px;
        flex-wrap: wrap;
        & > div {
            text-align: center;
            border-radius: 4px;
            padding: 0 4px;
            background: var(--gray-200);
            height: 24px;
            line-height: 24px;
        }
    }
}
</style>
