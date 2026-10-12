<template>
    <table :class="['m-calendar-table']" cellspacing="0" cellpadding="0">
        <thead v-if="!hideHeader">
            <th v-for="(day, i) in weekDays" :key="day" :class="{ 'is-week': i === 5 || i === 6 }">
                <slot name="date-th" :data="day">
                    <span> {{ day }}</span>
                </slot>
            </th>
        </thead>

        <tbody>
            <tr
                v-for="(row, index) in rows"
                :key="index"
                :class="{
                    ['m-calendar-table__row']: true,
                    ['m-calendar-table__row--hide-border']: index === 0 && hideHeader
                }"
            >
                <td v-for="(cell, key) in row" :key="key" :class="getCellClass(cell)" @click="handlePickDay(cell)">
                    <div class="m-calendar-day" :class="{ 'is-week': key === 5 || key === 6 }">
                        <slot name="date-cell" :data="getSlotData(cell)">
                            <span>{{ cell.text }}</span>
                        </slot>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
import { dateTableEmits, dateTableProps } from './date-table';
import { useDateTable } from './use-date-table';
import type { CalendarDateCell } from './date-table';
import { dayjsIsSame } from '@/utils/dayjsTools';
const props = defineProps(dateTableProps);
const emit = defineEmits(dateTableEmits);

const { now, rows, weekDays, getFormattedDate, handlePickDay, getSlotData } = useDateTable(props, emit);
const getCellClass = ({ text, type }: CalendarDateCell) => {
    const classes: string[] = [type];
    if (type === 'current') {
        const date = getFormattedDate(text, type);
        if (dayjsIsSame(date, props.selectedDay, 'day')) {
            classes.push('is-selected');
        }
        if (dayjsIsSame(date, now, 'day')) {
            classes.push('is-today');
        }
    }
    return classes;
};

defineExpose({
    /** @description toggle date panel */
    getFormattedDate
});
</script>
