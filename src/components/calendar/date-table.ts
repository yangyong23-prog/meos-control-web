import type { ExtractPropTypes, PropType } from 'vue';
import type { Dayjs } from 'dayjs';
// eslint-disable-next-line init-declarations
declare const isObject: (val: unknown) => val is Record<any, any>;
const definePropType = <T>(val: any): PropType<T> => val;
export const rangeArr = (number: number) => Array.from(Array.from({ length: number }).keys());
export type CalendarDateCellType = 'next' | 'prev' | 'current';
export type CalendarDateCell = {
    text: number;
    type: CalendarDateCellType;
};

export const getPrevMonthLastDays = (date: Dayjs, count: number) => {
    const lastDay = date.subtract(1, 'month').endOf('month').date();
    return rangeArr(count).map((_, index) => lastDay - (count - index - 1));
};

export const getMonthDays = (date: Dayjs) => {
    const days = date.daysInMonth();
    return rangeArr(days).map((_, index) => index + 1);
};

export const toNestedArr = (days: CalendarDateCell[]) =>
    rangeArr(days.length / 7).map(index => {
        const start = index * 7;
        return days.slice(start, start + 7);
    });

export const dateTableProps = {
    selectedDay: {
        type: definePropType<Dayjs>(Object)
    },
    date: {
        type: definePropType<Dayjs>(Object),
        required: true
    },
    hideHeader: {
        type: Boolean
    }
} as const;
export type DateTableProps = ExtractPropTypes<typeof dateTableProps>;

export const dateTableEmits = {
    pick: (value: Dayjs) => isObject(value)
};
export type DateTableEmits = typeof dateTableEmits;
