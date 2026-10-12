<template>
    <div class="dispatch">
        <div
            v-if="props.showRadio"
            class="row-item pd12"
        >
            <div class="label-left wh">
                <div
                    v-ellipsis
                    class="ft label-field"
                >
                    {{ i18n.global.t('meos_control_web.participate_in_dispatch') }}
                </div>
                <m-popover
                    :width="336 + 'px'"
                    :show-arrow="false"
                    placement="right-start"
                    theme="darkTransparent"
                >
                    <template #content>
                        <div>{{ i18n.global.t('meos_control_web.space_quality_allow_sacrifice_when_price_or_carbon_high') }}</div>
                    </template>
                    <svg
                        aria-hidden="true"
                        class="row-tips-icon ml4"
                    >
                        <use :xlink:href="'#icon-info-small'" />
                    </svg>
                </m-popover>
            </div>
            <div class="ml10">{{ dataObj?.isParticipateInScheduling ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no') }}</div>
        </div>
        <template v-if="dataObj?.isParticipateInScheduling">
            <div
                v-if="showTemperature"
                class="pd12"
            >
                <div>
                    <div class="row-item">
                        <div class="label-left wh">
                            <div
                                v-ellipsis
                                class="ft label-field"
                            >
                                {{ i18n.global.t('meos_control_web.daily_scheduling_duration') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.daily_cooling_upper_or_heating_lower_limit_default_sacrificable_2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <div class="ml10">{{ dataObj?.tdbQuality?.temperatureScheduledHourInDay || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</div>
                    </div>
                    <div class="row-item mt12">
                        <div class="label-left wh">
                            <div
                                v-ellipsis
                                class="ft label-field"
                            >
                                {{ i18n.global.t('meos_control_web.continuous_schedulable_duration') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.continuous_set_temp_limit_duration_dup1') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <div class="ml10">{{ dataObj?.tdbQuality?.temperatureContinuousScheduledHour || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</div>
                    </div>
                    <div class="row-item mt12">
                        <div class="label-left wh">
                            <div
                                v-ellipsis
                                class="ft label-field"
                            >
                                {{ i18n.global.t('meos_control_web.non_dispatchable_period') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.non_schedulable_time_periods_prevent_sacrifice_during_special_periods_2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <div class="time-value-list ml10">
                            <template v-if="dataObj?.tdbQuality?.temperatureUnscheduledTimeRange?.length">
                                <div
                                    v-for="(item, index) in dataObj?.tdbQuality.temperatureUnscheduledTimeRange"
                                    :key="index"
                                    class="time-value"
                                >
                                    {{ item.beginTime.absoluteTime.slice(0, -3) }}-{{ item.endTime.absoluteTime.slice(0, -3) }}
                                </div>
                            </template>
                            <template v-else
                                ><div>{{ i18n.global.t('meos_control_web.all_day_schedulable') }}</div></template
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-else
                class="pd12"
            >
                <div>
                    <div class="row-item">
                        <div class="label-left wh">
                            <div
                                v-ellipsis
                                class="ft label-field"
                            >
                                {{ i18n.global.t('meos_control_web.daily_scheduling_duration') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.daily_cooling_upper_or_heating_lower_limit_default_sacrificable_2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <div class="ml10">{{ dataObj?.co2Quality?.carbonDioxideScheduledHourInDay || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</div>
                    </div>
                    <div class="row-item mt12">
                        <div class="label-left wh">
                            <div
                                v-ellipsis
                                class="ft label-field"
                            >
                                {{ i18n.global.t('meos_control_web.continuous_schedulable_duration') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.continuous_set_temp_limit_duration_dup2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <div class="ml10">{{ dataObj?.co2Quality?.carbonDioxideContinuousScheduledHour || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</div>
                    </div>
                    <div class="row-item mt12">
                        <div class="label-left wh">
                            <div
                                v-ellipsis
                                class="ft label-field"
                            >
                                {{ i18n.global.t('meos_control_web.non_dispatchable_period') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.non_schedulable_time_periods_prevent_sacrifice_during_special_periods_2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <div class="time-value-list ml10">
                            <template v-if="dataObj?.co2Quality?.carbonDioxideUnscheduledTimeRange?.length">
                                <div
                                    v-for="(item, index) in dataObj?.co2Quality?.carbonDioxideUnscheduledTimeRange"
                                    :key="index"
                                    class="time-value"
                                >
                                    {{ item.beginTime.absoluteTime.slice(0, -3) }}-{{ item.endTime.absoluteTime.slice(0, -3) }}
                                </div>
                            </template>
                            <template v-else
                                ><div>{{ i18n.global.t('meos_control_web.all_day_schedulable') }}</div></template
                            >
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    dataObj: {
        type: Object,
        default: () => {}
    },
    type: {
        type: String,
        default: 'temperature'
    },
    showRadio: {
        type: Boolean,
        default: true
    }
});
const showTemperature = computed(() => props.type === 'temperature');
</script>
<style lang="less" scoped>
.row-tips-icon {
    width: 16px;
    height: 16px;
    color: @grey-500;
    padding-top: 2px;
}

.dispatch {
    background: var(--gray-50, #f7f9fa);
    padding: 16px 12px;
    padding-left: 0px;
    .diamond-title {
        width: 100%;
        position: relative;
        padding-left: 17px;
    }
    .diamond-title::before {
        content: '';
        position: absolute;
        left: 1px;
        top: 34%; /* 将菱形的中点与文本对齐 */
        transform: translateY(-50%);
        width: 7px; /* 菱形宽度 */
        height: 7px; /* 菱形高度 */
        background-color: #626c78; /* 菱形颜色 */
        border-right: 1px solid #626c78; /* 右边线 */
        border-bottom: 1px solid #626c78; /* 下边线 */
        border-radius: 1.5px;
        transform: rotate(45deg); /* 旋转菱形 */
    }
    .time-value-list {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        // max-width: 399px;
        flex: 1;
    }
    .time-value {
        background-color: #e8ecf0;
        display: flex;
        padding: 1px 8px;
        align-items: center;
        border-radius: 4px;
    }
}
.wh {
    width: 231px;
}
.label-field {
    display: -webkit-box;
    max-width: calc(231px - 20px);
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.border-b:not(:last-child) {
    border-bottom: 1px dashed #c4c9cf;
}
.pd12:not(:last-child) {
    padding-bottom: 12px;
}
.row-item {
    font-size: 14px;
    display: flex;
}
.label-left {
    display: flex;
}
</style>
