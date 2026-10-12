<!--
 * @Author: wuyangyang
 * @Date: 2024-01-17 16:11:42
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-03-13 14:34:50
 * @Description: 
-->
<template>
    <div class="m-calendar">
        <div class="m-calendar__header">
            <slot name="header" :date="titleDate">
                <div class="m-calendar__title">{{ titleDate.year }} {{ titleDate.month }}</div>
            </slot>
        </div>
        <div v-if="validatedRange.length === 0" class="m-calendar__body">
            <date-table :date="date" :selected-day="realSelectedDay" @pick="pickDay">
                <template v-if="$slots['date-cell'] || $slots.dateCell" #date-cell="data">
                    <slot v-if="$slots['date-cell']" name="date-cell" v-bind="data"></slot>
                    <slot v-else name="dateCell" v-bind="data"></slot>
                </template>
                <template v-if="$slots['date-th']" #date-th="data">
                    <slot v-if="$slots['date-th']" name="date-th" v-bind="data"></slot>
                </template>
            </date-table>
        </div>
        <div v-else class="m-calendar__body">
            <date-table
                v-for="(range_, index) in validatedRange"
                :key="index"
                :date="range_[0]"
                :selected-day="realSelectedDay"
                :range="range_"
                :hide-header="index !== 0"
                @pick="pickDay"
            >
                <template v-if="$slots['date-cell'] || $slots.dateCell" #date-cell="data">
                    <slot v-if="$slots['date-cell']" name="date-cell" v-bind="data"></slot>
                    <slot v-else name="dateCell" v-bind="data"></slot>
                </template>
                <template v-if="$slots['date-th']" #date-th="data">
                    <slot v-if="$slots['date-th']" name="date-th" v-bind="data"></slot>
                </template>
            </date-table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import DateTable from './date-table.vue';
import { useCalendar } from './use-calendar';
import { calendarEmits, calendarProps } from './calendar';

const props = defineProps(calendarProps);
const emit = defineEmits(calendarEmits);

const { calculateValidatedDateRange, date, pickDay, realSelectedDay, selectDate, validatedRange } = useCalendar(props, emit);

const titleDate = computed(() => ({
    year: date.value.year(),
    month: date.value.month() + 1,
    day: date.value.date()
}));

defineExpose({
    selectedDay: realSelectedDay,
    pickDay,
    selectDate,
    calculateValidatedDateRange
});
</script>
