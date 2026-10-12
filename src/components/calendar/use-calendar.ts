import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { INPUT_EVENT, UPDATE_MODEL_EVENT } from '@/utils/globalVariables';

import type { ComputedRef, SetupContext } from 'vue';
import type { Dayjs } from 'dayjs';
import type { CalendarDateType, CalendarEmits, CalendarProps } from './calendar';
import { dayjsIsAfter, dayjsIsSame } from '@/utils/dayjsTools';

const adjacentMonth = (start: Dayjs, end: Dayjs): [Dayjs, Dayjs][] => {
    const firstMonthLastDay = start.endOf('month');
    const lastMonthFirstDay = end.startOf('month');

    const isSameWeek = dayjsIsSame(firstMonthLastDay, lastMonthFirstDay, 'week');
    const lastMonthStartDay = isSameWeek ? lastMonthFirstDay.add(1, 'week') : lastMonthFirstDay;

    return [
        [start, firstMonthLastDay],
        [lastMonthStartDay.startOf('week'), end]
    ];
};

const threeConsecutiveMonth = (start: Dayjs, end: Dayjs): [Dayjs, Dayjs][] => {
    const firstMonthLastDay = start.endOf('month');
    const secondMonthFirstDay = start.add(1, 'month').startOf('month');

    const secondMonthStartDay = dayjsIsSame(firstMonthLastDay, secondMonthFirstDay, 'week') ? secondMonthFirstDay.add(1, 'week') : secondMonthFirstDay;

    const secondMonthLastDay = secondMonthStartDay.endOf('month');
    const lastMonthFirstDay = end.startOf('month');

    const lastMonthStartDay = dayjsIsSame(secondMonthLastDay, lastMonthFirstDay, 'week') ? lastMonthFirstDay.add(1, 'week') : lastMonthFirstDay;

    return [
        [start, firstMonthLastDay],
        [secondMonthStartDay.startOf('week'), secondMonthLastDay],
        [lastMonthStartDay.startOf('week'), end]
    ];
};

export const useCalendar = (props: CalendarProps, emit: SetupContext<CalendarEmits>['emit']) => {
    const selectedDay = ref<Dayjs>();
    const now = getDayjsTz();

    const realSelectedDay = computed<Dayjs | undefined>({
        get() {
            if (!props.modelValue) {
                return selectedDay.value;
            }
            return date.value;
        },
        set(val) {
            if (!val) {
                return;
            }
            selectedDay.value = val;
            const result = val.toDate();
            emit(INPUT_EVENT, result);
            emit(UPDATE_MODEL_EVENT, result);
        }
    });

    // if range is valid, we get a two-digit array
    const validatedRange = computed(() => {
        if (!props.range) {
            return [];
        }
        const rangeArrDayjs = props.range.map(_ => dayjs(_));
        const [startDayjs, endDayjs] = rangeArrDayjs;
        if (dayjsIsAfter(startDayjs, endDayjs)) {
            return [];
        }
        if (dayjsIsSame(startDayjs, endDayjs, 'month')) {
            // same month
            return calculateValidatedDateRange(startDayjs, endDayjs);
        }
        // two months
        if (startDayjs.add(1, 'month').month() !== endDayjs.month()) {
            return [];
        }
        return calculateValidatedDateRange(startDayjs, endDayjs);
    });

    const date: ComputedRef<Dayjs> = computed(() => {
        if (!props.modelValue) {
            return realSelectedDay.value || (validatedRange.value.length ? validatedRange.value[0][0] : now);
        }
        return dayjs(props.modelValue);
    });
    const prevMonthDayjs = computed(() => date.value.subtract(1, 'month').date(1));
    const nextMonthDayjs = computed(() => date.value.add(1, 'month').date(1));
    const prevYearDayjs = computed(() => date.value.subtract(1, 'year').date(1));
    const nextYearDayjs = computed(() => date.value.add(1, 'year').date(1));

    const calculateValidatedDateRange = (startDayjs: Dayjs, endDayjs: Dayjs): [Dayjs, Dayjs][] => {
        const firstDay = startDayjs.startOf('week');
        const lastDay = endDayjs.endOf('week');
        const firstMonth = firstDay.get('month');
        const lastMonth = lastDay.get('month');

        if (firstMonth === lastMonth) {
            return [[firstDay, lastDay]];
        }
        if ((firstMonth + 1) % 12 === lastMonth) {
            return adjacentMonth(firstDay, lastDay);
        }
        if (firstMonth + 2 === lastMonth || (firstMonth + 1) % 11 === lastMonth) {
            return threeConsecutiveMonth(firstDay, lastDay);
        }
        return [];
    };

    const pickDay = (day: Dayjs) => {
        realSelectedDay.value = day;
    };

    const selectDate = (type: CalendarDateType) => {
        const dateMap: Record<CalendarDateType, Dayjs> = {
            'prev-month': prevMonthDayjs.value,
            'next-month': nextMonthDayjs.value,
            'prev-year': prevYearDayjs.value,
            'next-year': nextYearDayjs.value,
            today: now
        };

        const day = dateMap[type];

        if (!dayjsIsSame(day, date.value, 'day')) {
            pickDay(day);
        }
    };

    return {
        calculateValidatedDateRange,
        date,
        realSelectedDay,
        pickDay,
        selectDate,
        validatedRange
    };
};
