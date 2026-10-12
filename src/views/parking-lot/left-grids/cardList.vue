<template>
    <div
        v-for="(item, index) in filteredItems"
        :key="index"
        :style="{
            backgroundColor: getBackground(item)
        }"
        class="card-item"
        @click.stop="spanFuc()"
    >
        <div class="fcb">
            <span v-ellipsis :class="['f14', 'ft', 'm-ellipsis', item.workTime ? 'dis' : '']">{{ item.spaceName }}</span>
            <span v-if="item.workTime" class="f12 ft1">{{ i18n.global.t('meos_control_web.business') }} {{ item.workTime }}</span>
        </div>
        <div v-if="Number(item.parkIngSpaceStatistics.chargingParkingSpaceCount) !== 0" class="fc">
            <div class="mt8 mr12" style="width: 78px">
                <div>
                    <span class="f16 fb6 fmp">{{ displayValue(item.parkIngSpaceStatistics.vacantParkIngSpaceCount) }}</span>
                    <span class="f16 ft1">/</span>
                    <span class="f16 ft1 fmp">{{ displayValue(item.parkIngSpaceStatistics.parkIngSpaceCount) }}</span>
                </div>
                <div class="f14 ft1">{{ i18n.global.t('common.idle_parking_spaces') }}</div>
            </div>
            <div class="mt8">
                <div>
                    <span class="f16 fb6 fmp">{{ displayValue(item.parkIngSpaceStatistics.vacantChargingParkingSpaceCount) }}</span>
                    <span class="f16 ft1">/</span>
                    <span class="f16 ft1 fmp">{{ displayValue(item.parkIngSpaceStatistics.chargingParkingSpaceCount) }}</span>
                </div>
                <div class="f14 ft1">{{ i18n.global.t('meos_control_web.idle_charging_spaces') }}</div>
            </div>
        </div>
        <div v-else class="fc">
            <div class="mt8 mr12" style="width: 78px">
                <div>
                    <span class="f16 fb6 fmp">{{ displayValue(item.parkIngSpaceStatistics.parkIngSpaceCount) }}</span>
                </div>
                <div class="f14 ft1">{{ i18n.global.t('common.total_parking_spaces') }}</div>
            </div>
            <div class="mt8">
                <div>
                    <span class="f16 fb6 fmp">{{ displayValue(item.parkIngSpaceStatistics.vacantParkIngSpaceCount) }}</span>
                </div>
                <div class="f14 ft1">{{ i18n.global.t('common.idle_parking_spaces') }}</div>
            </div>
        </div>
        <div class="business-hours">
            <template v-if="getCustomInfoObj(item?.spaceId)?.length">
                <m-popover theme="darkTransparent" :show-arrow="false" :disabled="getCustomInfoObj(item?.spaceId)?.length <= 2">
                    <template #content>
                        <div style="max-width: 420px">
                            <div>{{ i18n.global.t('meos_control_web.business_hours') }}</div>
                            <div>
                                {{ formattedWorkTime(getCustomInfoObj(item?.spaceId)) }}
                            </div>
                        </div>
                    </template>
                    {{ formattedWorkTime(getCustomInfo(item?.spaceId, 'CALENDAR_WORK_TIME_SELF', 'calendarWorkTimeSelf')?.dataValue) }}
                </m-popover>
            </template>
            <template v-else>{{ i18n.global.t('meos_control_web.closed_today') }}</template>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { currentTimeKey } from '../constant/injectKey';
import { displayValue, formattedWorkTime } from '@/utils/viewUtils';
import DockSingleton from '@/hooks/responsiveDock';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsSameOrAfter, dayjsIsSameOrBefore } from '@/utils/dayjsTools';
const { getCustomInfo } = DockSingleton.getInstance();

const porps = defineProps({
    cardItem: {
        type: Array,
        default: () => []
    }
});
const filteredItems = computed(() => {
    return porps?.cardItem?.filter(item => item.parkIngSpaceStatistics.parkIngSpaceCount > 0);
});
const currentTime = inject(currentTimeKey);
const getBackground = computed(() => item => {
    const calendarObj = getCustomInfo(item?.spaceId, 'CALENDAR_WORK_TIME_SELF', 'calendarWorkTimeSelf');
    const calendarWorkTimeValue = calendarObj?.dataValue ?? [];
    if (!calendarWorkTimeValue || !calendarWorkTimeValue.length) {
        return 'rgba(139, 166, 203, 0.2)';
    }
    for (const it of calendarWorkTimeValue) {
        const [startTime, endTime] = it.split('-');
        // 验证 startTime 和 endTime 的格式
        if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
            continue;
        }
        const sTime = dayjs(getDayjsTz().format('YYYY-MM-DD') + ' ' + startTime);
        const eTime = dayjs(getDayjsTz().format('YYYY-MM-DD') + ' ' + endTime);

        if (dayjsIsSameOrAfter(dayjs(currentTime.value), sTime, 'minute') && dayjsIsSameOrBefore(dayjs(currentTime.value), eTime, 'minute')) {
            return 'rgba(0, 186, 78, 0.12)';
        }
    }

    return 'rgba(139, 166, 203, 0.2)';
});
const getCustomInfoObj = computed(() => id => {
    const calendarObj = getCustomInfo(id, 'CALENDAR_WORK_TIME_SELF', 'calendarWorkTimeSelf');
    return calendarObj?.dataValue ?? [];
});
const spanFuc = () => {};
</script>
<style lang="less" scoped>
.card {
    flex-wrap: wrap;
    gap: 12px;
    margin-left: 56px;

    &-item {
        width: 210px;
        border-radius: 4px;
        padding: 8px 12px 12px 12px;
        cursor: default;
        background-color: rgba(0, 186, 78, 0.12);
    }
    .business-hours {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        color: #8b949e;
        font-size: 12px;
        line-height: 20px;
        margin-top: 8px;
    }
}
.dis {
    max-width: calc(100% - 102px);
    display: inline-block;
}
</style>
