/*
 * @Author: wuyangyang
 * @Date: 2024-01-17 16:11:42
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-03-06 17:53:33
 * @Description:
 */
import i18n from '@/localization';
import { computed } from 'vue';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import localeData from 'dayjs/plugin/localeData';
import { getMonthDays, getPrevMonthLastDays, rangeArr, toNestedArr } from './date-table';

import type { SetupContext } from 'vue';
import type { Dayjs } from 'dayjs';
import type { CalendarDateCell, CalendarDateCellType, DateTableEmits, DateTableProps } from './date-table';
export const WEEK_DAYS = [
    i18n.global.t('common.weekday.short_day1'),
    i18n.global.t('common.weekday.short_day2'),
    i18n.global.t('common.weekday.short_day3'),
    i18n.global.t('common.weekday.short_day4'),
    i18n.global.t('common.weekday.short_day5'),
    i18n.global.t('common.weekday.short_day6'),
    i18n.global.t('common.weekday.short_day7')
] as const;
export const useDateTable = (props: DateTableProps, emit: SetupContext<DateTableEmits>['emit']) => {
    dayjs.extend(localeData);
    const firstDayOfWeek: number = dayjs.localeData().firstDayOfWeek();

    const rows = computed(() => {
        let days: CalendarDateCell[] = [];
        const firstDay = props.date.startOf('month').day();
        const prevMonthDays: CalendarDateCell[] = getPrevMonthLastDays(props.date, (firstDay - firstDayOfWeek + 6) % 7).map(day => ({
            text: day,
            type: 'prev'
        }));
        const currentMonthDays: CalendarDateCell[] = getMonthDays(props.date).map(day => ({
            text: day,
            type: 'current'
        }));
        days = [...prevMonthDays, ...currentMonthDays];
        const remaining = 7 - (days.length % 7 || 7);
        const nextMonthDays: CalendarDateCell[] = rangeArr(remaining).map((_, index) => ({
            text: index + 1,
            type: 'next'
        }));
        days = days.concat(nextMonthDays);
        return toNestedArr(days);
    });

    const weekDays = computed(() => {
        const start = firstDayOfWeek;
        if (start === 0) {
            return WEEK_DAYS;
        }
        return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start));
    });

    // eslint-disable-next-line consistent-return
    const getFormattedDate = (day: number, type: CalendarDateCellType): Dayjs => {
        // eslint-disable-next-line default-case
        switch (type) {
            case 'prev':
                return props.date.startOf('month').subtract(1, 'month').date(day);
            case 'next':
                return props.date.startOf('month').add(1, 'month').date(day);
            case 'current':
                return props.date.date(day);
        }
    };

    const handlePickDay = ({ text, type }: CalendarDateCell) => {
        const date = getFormattedDate(text, type);
        emit('pick', date);
    };

    const getSlotData = ({ text, type }: CalendarDateCell) => {
        const day = getFormattedDate(text, type);
        return {
            isSelected: false,
            type: `${type}-month`,
            day: day.format('YYYY-MM-DD'),
            date: day.toDate()
        };
    };
    const now = getDayjsTz();
    return {
        now,
        rows,
        weekDays,
        getFormattedDate,
        handlePickDay,
        getSlotData
    };
};
