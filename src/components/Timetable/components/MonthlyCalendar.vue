<template>
    <div class="monthly-calendar" style="height: 100%">
        <header class="fcb">
            <div v-for="day in daysOfWeek" :key="day" class="day fc" :class="[screenWidth >= 1920 && 'day-1920', screenWidth < 1920 && 'day-1366']">
                {{ day }}
            </div>
        </header>
        <div class="calendar-content" :class="[screenWidth >= 1920 && 'calendar-content-1920', screenWidth < 1920 && 'calendar-content-1366']">
            <div
                v-for="(day, index) in calendarDays"
                :key="index"
                :ref="el => (dayRefs[index] = el)"
                class="days"
                :class="{ 'not-current-month': isNotCurrentMonth(day), 'days-1920': screenWidth >= 1920, 'days-1366': screenWidth < 1920 }"
            >
                <div
                    style="width: 100%; height: 100%; border: 2px solid transparent"
                    :class="{ 'hover-item': !isNotCurrentMonth(day), active: isDaySelected(day) && !isNotCurrentMonth(day) }"
                    @click="handleDayClick(day, index)"
                >
                    <div class="days-container">
                        <div class="title fcb" :style="titleStyle(day)">
                            <div :style="{ paddingLeft: '12px' }" class="title-date fcb" :class="{ 'title-date-not-current-month': isNotCurrentMonth(day) }">
                                <span class="fc">
                                    <span class="ffCustom-M">{{ day.day }}</span>
                                    <span v-if="day.day === 1" class="title-month ml4">{{ getMonthLabel(day) }}</span>
                                </span>
                                <span v-if="isToday(day)" class="today">{{ t('meos_control_web.today') }}</span>
                            </div>
                        </div>
                        <div v-if="!isNotCurrentMonth(day)" class="content flc">
                            <div v-if="day.list.length === 0" class="no-data">{{ t('meos_control_web.no_time_table_data') }}</div>
                            <template v-else>
                                <slot name="dayContent" :day="day" :items="day.list">
                                    <template v-if="systemInfo.consoleTypes === 'AIR_TERMINAL_ZONE'">
                                        <div v-for="(item, idx) in day.list" :key="idx">
                                            <template v-if="item && item.consoleType === 'AIR_TERMINAL_ZONE'">
                                                <div class="air-conditioning-zoning f14 mb8">
                                                    <div v-ellipsis="{ title: item.localName }" class="m-ellipsis" style="height: 22px; line-height: 22px">
                                                        {{ item.localName }}
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div v-for="(item, idx) in day.list" :key="idx">
                                            <template v-if="item && item.consoleType === 'COOL_SUPPLY'">
                                                <div class="cooling-supply f14">{{ t('meos_control_web.cooling_supply1') }}</div>
                                            </template>
                                            <template v-if="item && item.consoleType === 'COOL_INPUT'">
                                                <div class="cold-storage f14 mt8">{{ t('meos_control_web.thermal_storage_cold') }}</div>
                                            </template>
                                        </div>
                                    </template>
                                </slot>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { monthDateKey, dataItemKey, rightToDayKey, isLoadingKey, type SystemInfo, type CalendarDay, type TimetableItem } from '../types';

const props = defineProps({ systemInfo: { type: Object as PropType<SystemInfo>, required: true } });
const emit = defineEmits<{ (e: 'dayClick', day: CalendarDay, index: number): void; (e: 'edit', params: any): void }>();
const { t } = useI18n();

const monthDate = inject(monthDateKey);
const dataItem = inject(dataItemKey);
const rightToDay = inject(rightToDayKey);
const isLoading = inject(isLoadingKey);

const localMonthDate = ref(dayjs().format('YYYY.MM'));
const localDataItem = ref<TimetableItem[]>([]);
const localRightToDay = ref<CalendarDay | null>(null);

const currentMonthDate = computed(() => monthDate?.value ?? localMonthDate.value);
const currentDataItem = computed(() => dataItem?.value ?? localDataItem.value);
const selectedDay = computed(() => rightToDay?.value ?? localRightToDay.value);
const screenWidth = ref(document.documentElement.clientWidth);
const dayRefs = ref<any[]>([]);

const currentDate = computed(() => {
    const [year, month] = currentMonthDate.value.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
});

const daysOfWeek = computed(() => [
    t('common.weekday.day7'),
    t('common.weekday.day1'),
    t('common.weekday.day2'),
    t('common.weekday.day3'),
    t('common.weekday.day4'),
    t('common.weekday.day5'),
    t('common.weekday.day6')
]);

const calendarDays = computed<CalendarDay[]>(() => {
    const days: CalendarDay[] = [];
    const [year, month] = currentMonthDate.value.split('.');
    const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
    const lastDay = new Date(parseInt(year), parseInt(month), 0);
    const firstDayWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(parseInt(year), parseInt(month) - 1, 0).getDate();

    for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const date = dayjs(new Date(parseInt(year), parseInt(month) - 2, day)).format('YYYY-MM-DD');
        days.push({ date, day, isNextMonth: false, list: [] });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = dayjs(new Date(parseInt(year), parseInt(month) - 1, i)).format('YYYY-MM-DD');
        days.push({ date, day: i, isNextMonth: false, list: findDayData(date) });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        const date = dayjs(new Date(parseInt(year), parseInt(month), i)).format('YYYY-MM-DD');
        days.push({ date, day: i, isNextMonth: true, list: [] });
    }
    return days;
});

const findDayData = (date: string): TimetableItem[] => currentDataItem.value.filter((item: any) => dayjs(item.date).isSame(dayjs(date), 'day'));
const isNotCurrentMonth = (day: CalendarDay): boolean => {
    const [_, month] = currentMonthDate.value.split('.');
    return dayjs(day.date).month() + 1 !== parseInt(month);
};
const isToday = (day: CalendarDay): boolean => dayjs(day.date).isSame(dayjs(), 'day');
const isDaySelected = (day: CalendarDay): boolean => (selectedDay.value ? dayjs(day.date).isSame(dayjs(selectedDay.value.date), 'day') : false);
const titleStyle = (day: CalendarDay) => ({ paddingTop: '8px', paddingBottom: !isNotCurrentMonth(day) && isToday(day) ? '12px' : '12px' });
const getMonthLabel = (day: CalendarDay): string =>
    `${day.isNextMonth ? (currentDate.value.getMonth() === 11 ? 1 : currentDate.value.getMonth() + 2) : currentDate.value.getMonth() + 1}${t('common.monthUnit')}`;

const handleDayClick = (day: CalendarDay, index: number) => {
    if (isNotCurrentMonth(day)) return;
    if (rightToDay) {
        rightToDay.value = day;
    } else {
        localRightToDay.value = day;
    }
    emit('dayClick', day, index);
};
</script>

<style lang="less" scoped>
.monthly-calendar {
    header {
        height: 40px;
        background: #f8f9fa;
        border-bottom: 1px solid #e1e5eb;
        .day {
            flex: 1;
            height: 100%;
            font-weight: 700;
            color: var(--title-color);
        }
        .day-1920 {
            font-size: 14px;
        }
        .day-1366 {
            font-size: 12px;
        }
    }
    .calendar-content {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        height: calc(100% - 40px);
        overflow-y: auto;
        .days {
            border-right: 1px solid #e1e5eb;
            border-bottom: 1px solid #e1e5eb;
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
                background: #f5f7fa;
            }
            &.not-current-month {
                background: #fafbfc;
                .title-date {
                    color: #c4c9cf;
                }
            }
            &.active {
                border: 2px solid var(--primary-color) !important;
            }
        }
        .days-container {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .title {
            padding: 8px 0;
        }
        .title-date {
            color: var(--title-color);
        }
        .today {
            background: var(--primary-color);
            color: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .content {
            flex: 1;
            padding: 0 8px 8px;
            overflow: hidden;
        }
        .no-data {
            color: var(--notes-color);
            font-size: 12px;
        }
        .cooling-supply {
            color: #246fe5;
        }
        .cold-storage {
            color: #3fbe72;
        }
    }
}
</style>
