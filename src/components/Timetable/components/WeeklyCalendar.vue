<template>
    <div class="weekly-calendar" style="height: 100%">
        <header class="fcb">
            <div v-for="day in weekCalendar" :key="day.date.format('YYYY-MM-DD')" class="day fc" :class="[screenWidth >= 1920 && 'day-1920', screenWidth < 1920 && 'day-1366']">
                <div class="fcb" style="flex: 1">
                    <div>
                        <span class="f16 fb7 ffCustom-M">{{ day.date.format('MM.DD') }}</span>
                        <span class="ml8 ft">{{ weekdayLabels[day.weekday] }}</span>
                    </div>
                    <span v-if="isToday(day)" class="today">{{ t('meos_control_web.today') }}</span>
                </div>
            </div>
        </header>
        <div class="calendar-content" :class="[screenWidth >= 1920 && 'calendar-content-1920', screenWidth < 1920 && 'calendar-content-1366']">
            <div v-for="(day, index) in weekCalendar" :key="index + 'd'" class="days" :class="{ 'days-1920': screenWidth >= 1920, 'days-1366': screenWidth < 1920 }">
                <div style="width: 100%; height: 100%">
                    <div :ref="el => (contentDivs[index] = el)" class="days-container">
                        <div :ref="el => (childDiv[index] = el)" class="content flc">
                            <div v-if="day.list.length === 0" class="no-data">{{ t('meos_control_web.no_time_table_data') }}</div>
                            <template v-else>
                                <slot name="dayContent" :day="day" :items="day.list" :on-edit="handleEdit" :on-delete="handleDelete">
                                    <DateItem :list="day" :system-info="systemInfo" @edit-btn="handleEdit" @del-btn="handleDelete" />
                                </slot>
                            </template>
                        </div>
                        <div v-if="day.showMore" class="view-all">
                            <m-tips trigger="click" popover-class="more-popover">
                                <template #content>
                                    <div style="height: 600px; overflow: hidden; min-width: 400px">
                                        <DayItem
                                            type="more"
                                            :show-header="false"
                                            :list="selectedDay?.list"
                                            :system-info="systemInfo"
                                            @edit-btn="handleEdit"
                                            @del-btn="handleDelete"
                                        />
                                    </div>
                                </template>
                                <m-button :id="'btn' + index" type="link" size="small" @click="moreBtn(day)">{{ t('meos_control_web.view_all') }}</m-button>
                            </m-tips>
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
import weekday from 'dayjs/plugin/weekday';
import { weeksDateKey, rightToDayKey, dataItemKey, isLoadingKey, type SystemInfo, type CalendarDay, type TimetableItem } from '../types';
import DateItem from './DateItem.vue';
import DayItem from './DayItem.vue';

dayjs.extend(weekday);

const props = defineProps({ systemInfo: { type: Object as PropType<SystemInfo>, required: true } });
const emit = defineEmits<{ (e: 'edit', params: any): void; (e: 'delete', id: string): void }>();
const { t } = useI18n();

const weeksDate = inject(weeksDateKey);
const toDay = inject(rightToDayKey);
const dataItem = inject(dataItemKey);
const isLoading = inject(isLoadingKey);

const localWeeksDate = ref(`${dayjs().format('YYYY.MM.DD')}-${dayjs().add(6, 'day').format('YYYY.MM.DD')}`);
const localDataItem = ref<TimetableItem[]>([]);
const localToDay = ref<CalendarDay | null>(null);

const currentWeeksDate = computed(() => weeksDate?.value ?? localWeeksDate.value);
const currentDataItem = computed(() => dataItem?.value ?? localDataItem.value);
const selectedDay = computed(() => toDay?.value ?? localToDay.value);

const screenWidth = ref(document.documentElement.clientWidth);
const contentDivs = ref<any[]>([]);
const childDiv = ref<any[]>([]);

const weekdayLabels = computed(() => [
    t('common.weekday.day7'),
    t('common.weekday.day1'),
    t('common.weekday.day2'),
    t('common.weekday.day3'),
    t('common.weekday.day4'),
    t('common.weekday.day5'),
    t('common.weekday.day6')
]);

const weekCalendar = computed(() => {
    const [startDate] = currentWeeksDate.value.split('-');
    const start = dayjs(startDate);
    const days: any[] = [];
    for (let i = 0; i < 7; i++) {
        const date = start.add(i, 'day');
        const dateStr = date.format('YYYY-MM-DD');
        days.push({
            date,
            weekday: date.weekday(),
            list: findDayData(dateStr),
            showMore: false
        });
    }
    return days;
});

const findDayData = (date: string): TimetableItem[] => currentDataItem.value.filter((item: any) => dayjs(item.date).isSame(dayjs(date), 'day'));
const isToday = (day: any): boolean => day.date.isSame(dayjs(), 'day');

const handleEdit = (params: any) => emit('edit', params);
const handleDelete = (id: string) => emit('delete', id);
const moreBtn = (day: any) => {
    day.showMore = true;
};
</script>

<style lang="less" scoped>
.weekly-calendar {
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
        }
        .days-container {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .content {
            flex: 1;
            padding: 8px;
            overflow: hidden;
        }
        .no-data {
            color: var(--notes-color);
            font-size: 12px;
        }
        .today {
            background: var(--primary-color);
            color: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .view-all {
            padding: 8px;
            text-align: center;
        }
    }
}
</style>
