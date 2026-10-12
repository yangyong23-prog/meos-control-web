<template>
    <div class="config-container">
        <div class="config-item">
            <div class="left">
                <span
                    v-ellipsis
                    class="title"
                    >{{ i18n.global.t('meos_control_web.hvac_demand_time') }}</span
                >
                <PopoverIcon
                    :content="i18n.global.t('meos_control_web.hvac_demand_time_tips')"
                    :width="'420px'"
                    :theme="'darkTransparent'"
                />
            </div>
            <div
                class="right"
                :style="{ 'grid-template-columns': baseConfig?.airConditioningDemandTimeIntervals?.length ? '1fr 1fr' : '' }"
            >
                <template v-if="baseConfig?.airConditioningDemandTimeIntervals?.length">
                    <span
                        v-for="item in demandTimeIntervals"
                        :key="item"
                        class="time"
                        >{{ item?.beginTime?.absoluteTime }}-{{ item?.endTime?.absoluteTime }}</span
                    >
                </template>
                <span v-else-if="baseConfig?.noDemand">{{ i18n.global.t('meos_control_web.no_demand1') }}</span>
                <span v-else>{{ i18n.global.t('meos_control_web.algorithm_auto_calculate') }}</span>
            </div>
        </div>
        <div
            v-if="curModel === 'global' && props.isProject"
            class="config-item"
        >
            <div class="left">
                <span
                    v-ellipsis
                    class="title"
                    >{{ i18n.global.t('meos_control_web.allow_early_shutdown_flag') }}</span
                >
                <PopoverIcon
                    :content="i18n.global.t('meos_control_web.space_quality_allow_sacrifice_when_price_or_carbon_high')"
                    :theme="'darkTransparent'"
                />
            </div>
            <div class="right">{{ baseConfig?.isAllowEarlyShutdown ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no') }}</div>
        </div>
        <div class="config-item">
            <div class="left">
                <span
                    v-ellipsis
                    class="title"
                    >{{ i18n.global.t('meos_control_web.allow_response_regulation') }}</span
                >
                <PopoverIcon
                    :content="i18n.global.t('meos_control_web.auto_judge_ac_demand_by_terminal_and_overtime_request_during_response_adjustment')"
                    :width="'420px'"
                    :theme="'darkTransparent'"
                />
            </div>
            <div class="right">
                <template v-if="baseConfig?.isAllowResponseRegulation">
                    <template v-if="regulationTimeIntervals?.length">
                        <span
                            v-for="item in regulationTimeIntervals"
                            :key="item"
                            class="time"
                            >{{ item?.beginTime?.absoluteTime }}-{{ item?.endTime?.absoluteTime }}</span
                        >
                    </template>
                    <template v-else>--</template>
                </template>
                <span v-else>{{ i18n.global.t('common.no') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import PopoverIcon from './popoverIcon.vue';
const props = defineProps({
    curModel: {
        type: String,
        default: ''
    },
    isProject: {
        type: Boolean,
        default: true
    },
    baseConfig: {
        type: Object,
        default: () => {}
    }
});
const demandTimeIntervals = ref([]);
const regulationTimeIntervals = ref([]);

watch(
    () => props.baseConfig,
    newBaseConfig => {
        if (newBaseConfig) {
            const { airConditioningDemandTimeIntervals, responseRegulationTimeIntervals } = newBaseConfig;
            if (Array.isArray(airConditioningDemandTimeIntervals) && airConditioningDemandTimeIntervals.length > 0) {
                try {
                    demandTimeIntervals.value = airConditioningDemandTimeIntervals.map(item => {
                        if (!item.beginTime || !item.endTime || typeof item.beginTime.absoluteTime !== 'string' || typeof item.endTime.absoluteTime !== 'string') {
                            throw new Error('Invalid time interval data');
                        }

                        return {
                            ...item,
                            beginTime: {
                                ...item.beginTime,
                                absoluteTime: item.beginTime.absoluteTime.slice(0, 5)
                            },
                            endTime: {
                                ...item.endTime,
                                absoluteTime: item.acrossDay
                                    ? i18n.global.t('meos_control_web.next_day') + item.endTime.absoluteTime.slice(0, 5)
                                    : item.endTime.absoluteTime.slice(0, 5)
                            }
                        };
                    });
                } catch (error) {
                    console.error(error);
                }
            }

            if (Array.isArray(responseRegulationTimeIntervals) && responseRegulationTimeIntervals.length > 0) {
                try {
                    regulationTimeIntervals.value = responseRegulationTimeIntervals.map(item => {
                        if (!item.beginTime || !item.endTime || typeof item.beginTime.absoluteTime !== 'string' || typeof item.endTime.absoluteTime !== 'string') {
                            throw new Error('Invalid time interval data');
                        }

                        return {
                            ...item,
                            beginTime: {
                                ...item.beginTime,
                                absoluteTime: item.beginTime.absoluteTime.slice(0, 5)
                            },
                            endTime: {
                                ...item.endTime,
                                absoluteTime: item.acrossDay
                                    ? i18n.global.t('meos_control_web.next_day') + item.endTime.absoluteTime.slice(0, 5)
                                    : item.endTime.absoluteTime.slice(0, 5)
                            }
                        };
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.config-container {
    .config-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        .left {
            margin-right: 4px;
            width: 130px;
            min-width: 130px;
            max-width: 130px;
            display: flex;
            .title {
                color: #626c78;
                font-size: 14px;
                margin-right: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
            }
            :deep svg {
                min-height: 14px;
                min-width: 14px;
                margin-top: 2px;
            }
        }
        .right {
            display: grid;
            gap: 8px 4px;
            // grid-template-columns: 1fr 1fr;
            color: #000;
            .time {
                text-align: center;
                width: 95px;
                color: #1b2129;
                display: inline-block;
                height: 24px;
                line-height: 24px;
                border-radius: 4px;
                background: #e8ecf0;
                white-space: nowrap;
            }
        }
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
    }
}
</style>
