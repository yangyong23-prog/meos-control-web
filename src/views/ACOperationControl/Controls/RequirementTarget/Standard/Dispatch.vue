<template>
    <div class="dispatch-container">
        <div class="dispatch-item">
            <div class="left">
                <span class="title">{{ i18n.global.t('meos_control_web.participate_in_dispatch') }}</span>
            </div>
            <div class="right">{{ environmentQuality?.isParticipateInScheduling ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no') }}</div>
        </div>
        <div
            v-for="(item, index) in list"
            :key="item"
        >
            <div class="dispatch-line"></div>
            <div class="dispatch-item-title">
                <div class="diamond"></div>
                <span v-if="index === 0">{{ i18n.global.t('meos_control_web.temperature_scheduling_requirement') }}</span>
                <span v-else>CO<sub>2</sub>{{ i18n.global.t('meos_control_web.dispatch_requirement') }}</span>
            </div>
            <div class="dispatch-item">
                <div class="left">
                    <span class="title">{{ i18n.global.t('meos_control_web.daily_scheduling_duration') }}</span>
                </div>
                <div class="right">{{ item.hourInDay || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</div>
            </div>
            <div class="dispatch-item">
                <div class="left">
                    <span class="title">{{ i18n.global.t('meos_control_web.continuous_schedulable_duration') }}</span>
                </div>
                <div class="right">{{ item.scheduledHour || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</div>
            </div>
            <div class="dispatch-item">
                <div class="left">
                    <span class="title">{{ i18n.global.t('meos_control_web.non_dispatchable_period') }}</span>
                </div>
                <div class="right">
                    <template v-if="item.timeRange?.length">
                        <span
                            v-for="child in item.timeRange"
                            :key="child"
                            class="time"
                            >{{ child?.beginTime?.absoluteTime }}-{{ child?.endTime?.absoluteTime }}</span
                        >
                    </template>
                    <template v-else>{{ i18n.global.t('meos_control_web.all_day_schedulable') }}</template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    environmentQuality: {
        type: Object,
        default: () => {}
    }
});
const list = ref([]);

const processTimeRange = timeRange => {
    if (!timeRange) return [];
    return timeRange.map(item => {
        return {
            ...item,
            beginTime: {
                ...item.beginTime,
                absoluteTime: item.beginTime.absoluteTime.slice(0, 5)
            },
            endTime: {
                ...item.endTime,
                absoluteTime: item.acrossDay ? i18n.global.t('meos_control_web.next_day') + item.endTime.absoluteTime.slice(0, 5) : item.endTime.absoluteTime.slice(0, 5)
            }
        };
    });
};

const computeList = computed(() => {
    try {
        const { tdbQuality, co2Quality, isParticipateInScheduling } = props.environmentQuality || {};

        const tdbData = tdbQuality
            ? {
                  hourInDay: tdbQuality.temperatureScheduledHourInDay,
                  scheduledHour: tdbQuality.temperatureContinuousScheduledHour,
                  timeRange: processTimeRange(tdbQuality.temperatureUnscheduledTimeRange)
              }
            : {};

        const co2Data = co2Quality
            ? {
                  hourInDay: co2Quality.carbonDioxideScheduledHourInDay,
                  scheduledHour: co2Quality.carbonDioxideContinuousScheduledHour,
                  timeRange: processTimeRange(co2Quality.carbonDioxideUnscheduledTimeRange)
              }
            : {};
        if (isParticipateInScheduling) {
            return [tdbData, co2Data];
        } else {
            return [];
        }
    } catch (error) {
        console.error(error);
        return [{}];
    }
});

watchEffect(() => {
    list.value = computeList.value;
});
</script>

<style lang="less" scoped>
.dispatch-container {
    padding: 16px 12px;
    background: #f7f9fa;
    margin-bottom: 16px;

    .dispatch-item-title {
        display: flex;
        align-items: center;
        color: #626c78;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        margin-bottom: 12px;
        .diamond {
            width: 7px;
            height: 7px;
            background-color: #626c78;
            transform: rotate(45deg);
            margin-right: 6px;
        }
    }
    .dispatch-line {
        margin: 12px 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(to left, transparent 0%, transparent 50%, #c4c9cf 50%, #c4c9cf 100%);
        background-size: 10px 1px;
        background-repeat: repeat-x;
    }
    .dispatch-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        .left {
            margin-right: 4px;
            width: 200px;
            flex: 0 0 200px;
            display: flex;
            align-items: center;
            .title {
                color: #626c78;
                font-size: 14px;
                margin-right: 4px;
            }
        }
        .right {
            color: #000;
            display: grid;
            gap: 8px 4px;
            grid-template-columns: repeat(auto-fill, 100px);
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
