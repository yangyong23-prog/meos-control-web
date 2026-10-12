<template>
    <div class="calendar-list-container">
        <div class="header-container">
            <template v-if="$slots.header">
                <slot name="header" :data="{ currentYear, currentMonth, currentYearMonth }"></slot>
            </template>
            <div v-else class="header-default">
                <!-- TODO 国际化 -->
                <div class="cur-year-month">
                    <m-date-picker v-model="currentYearMonth" type="month" :clearable="false" :simple-style="true"></m-date-picker>
                </div>
                <div class="switch-buttons">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="switch-icon" @click="toPre">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M13.1452 5.21304C13.4098 5.48284 13.3933 5.90466 13.1083 6.1552L8.73588 10L13.1083 13.8448C13.3933 14.0953 13.4098 14.5172 13.1452 14.787C12.8806 15.0568 12.4352 15.0724 12.1503 14.8219L6.66665 10L12.1503 5.17814C12.4352 4.92761 12.8806 4.94323 13.1452 5.21304Z"
                            fill="#1B2129"
                        />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="switch-icon" @click="toNext">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.85481 14.787C6.59024 14.5172 6.60674 14.0953 6.89165 13.8448L11.2641 10L6.89166 6.1552C6.60674 5.90466 6.59024 5.48284 6.85481 5.21304C7.11937 4.94323 7.56482 4.92761 7.84974 5.17814L13.3334 10L7.84974 14.8219C7.56482 15.0724 7.11937 15.0568 6.85481 14.787Z"
                            fill="#1B2129"
                        />
                    </svg>
                </div>
                <template v-if="$slots.headerAction">
                    <slot name="headerAction" :data="{ currentYear, currentMonth, currentYearMonth }"></slot>
                </template>
            </div>
        </div>
        <div class="weeks-container">
            <div v-for="weekDay in weeks" :key="weekDay.value" class="week-day-item">
                {{ weekDay.label }}
            </div>
        </div>
        <div class="dates-container" :style="{ '--calendar-row-count': calendarRowCount }">
            <template v-for="curDateItem in currentDates" :key="curDateItem.key">
                <div
                    :class="{
                        'date-item': true,
                        'date-item-today': curDateItem.isToday,
                        'date-item-disabled': curDateItem.isDisabled
                    }"
                    @click="handleClickDate(curDateItem)"
                >
                    <template v-if="$slots.renderDate">
                        <slot name="renderDate" :data="{ curDateItem }"></slot>
                    </template>
                    <div v-else class="date-item-inner">
                        <div class="date-name">{{ curDateItem.day }}</div>
                        <template v-if="$slots.dateAction">
                            <slot name="dateAction" :data="{ curDateItem }"></slot>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';

const props = defineProps({
    monthFormat: {
        type: String,
        default: 'YYYY.MM'
    },
    dayFormat: {
        type: String,
        default: 'YYYY.MM.DD'
    }
});

const weeks = [
    { label: i18n.global.t('common.weekday.day1'), value: '1' },
    { label: i18n.global.t('common.weekday.day2'), value: '2' },
    { label: i18n.global.t('common.weekday.day3'), value: '3' },
    { label: i18n.global.t('common.weekday.day4'), value: '4' },
    { label: i18n.global.t('common.weekday.day5'), value: '5' },
    { label: i18n.global.t('common.weekday.day6'), value: '6' },
    { label: i18n.global.t('common.weekday.day7'), value: '7' }
];

const emits = defineEmits(['clickDate']);
const currentYearMonth = defineModel({ type: String, default: dayjs().format('YYYY.MM') });
// 1-12 月
const currentMonth = computed(() => {
    return dayjs(currentYearMonth.value, props.monthFormat).month() + 1;
});

const currentYear = computed(() => {
    return dayjs(currentYearMonth.value, props.monthFormat).year();
});

const calendarRowCount = computed(() => {
    return currentDates.value.length > 35 ? 6 : currentDates.value.length > 28 ? 5 : 4;
});

const currentDates = computed(() => {
    const year = dayjs(currentYearMonth.value, props.monthFormat).year();
    const month = dayjs(currentYearMonth.value, props.monthFormat).month() + 1;

    // First day of the month
    const firstDayOfMonth = dayjs(`${year}-${month}-01`);
    // Last day of the month
    const lastDayOfMonth = firstDayOfMonth.endOf('month');

    // Day of week for first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.day();
    // Day of week for last day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const lastDayWeekday = lastDayOfMonth.day();

    const dates = [];

    // Add previous month's trailing days
    if (firstDayWeekday !== 1) {
        const allDays = firstDayWeekday < 1 ? 6 - firstDayWeekday : firstDayWeekday - 1;
        for (let i = allDays; i >= 1; i--) {
            const date = firstDayOfMonth.subtract(i, 'day');
            dates.push({
                key: date.format(props.dayFormat),
                date: date.format(props.dayFormat),
                day: date.date(),
                weekday: date.day(),
                isToday: date.isSame(dayjs(), 'day'),
                isDisabled: true
            });
        }
    }

    // Add current month's days
    const daysInMonth = firstDayOfMonth.daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
        const date = firstDayOfMonth.date(i);
        dates.push({
            key: date.format(props.dayFormat),
            date: date.format(props.dayFormat),
            day: i,
            weekday: date.day(),
            isToday: date.isSame(dayjs(), 'day'),
            isDisabled: false
        });
    }

    // Add next month's leading days
    if (lastDayWeekday > 0) {
        for (let i = 1; i <= 7 - lastDayWeekday; i++) {
            const date = lastDayOfMonth.add(i, 'day');
            dates.push({
                key: date.format(props.dayFormat),
                date: date.format(props.dayFormat),
                day: i,
                weekday: date.day(),
                isToday: date.isSame(dayjs(), 'day'),
                isDisabled: true
            });
        }
    }

    return dates;
});

const toPre = () => {
    let newYear = currentYear.value,
        newMonth = currentMonth.value - 1;
    if (newMonth < 1) {
        newMonth = 12;
        if (newYear - 1) {
            newYear = newYear - 1;
        }
    }
    const data = dayjs([newYear, newMonth]);
    currentYearMonth.value = data.format(props.monthFormat);
};
const toNext = () => {
    let newYear = currentYear.value,
        newMonth = currentMonth.value + 1;
    if (newMonth > 12) {
        newMonth = 1;
        newYear = newYear + 1;
    }
    const data = dayjs([newYear, newMonth]);
    currentYearMonth.value = data.format(props.monthFormat);
};
const handleClickDate = date => {
    emits('clickDate', date);
};
</script>

<style lang="less" scoped>
.calendar-list-container {
    width: 100%;
    height: 100%;
    min-height: 642px;
    padding: 16px;
    border-radius: 8px;
    background: #fff;
    display: flex;
    flex-direction: column;
}

.header-container {
    display: flex;
    align-items: center;
}

.header-default {
    display: flex;
    align-items: center;
    width: fit-content;
    gap: 4px;
    position: relative;
}
.cur-year-month {
    position: absolute;
    top: -2px;
    left: 0;
    :deep(.m-date-picker__result .date-icon) {
        display: none;
    }
    :deep(.m-date-picker__result_text) {
        color: #1b2129;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px;
    }
}
.switch-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    margin-left: 84px;
}
.switch-icon {
    cursor: pointer;
    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
        border-radius: 3px;
    }
}

.weeks-container {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 9px;
}
.week-day-item {
    flex: 1;
    display: flex;
    padding: 6px 16px;
    align-items: center;

    color: #626c78;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
.dates-container {
    min-height: 0px;
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(var(--calendar-row-count), minmax(90px, 1fr));
}
.date-item {
    display: flex;
    padding: 4px 8px;
    flex-direction: column;
    border-top: 1px solid #e1e5eb;
    border: 1px solid transparent;
    border-top: 1px solid #e1e5eb;
    &:hover {
        border: 1px solid #246fe5;
    }
}
.date-item-inner {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.date-name {
    display: flex;
    width: 44px;
    height: 44px;
    justify-content: center;
    align-items: center;

    color: #000;
    font-family: PersagyBold;
    font-size: 22px;
    font-style: normal;
    font-weight: 600;
}
.date-item-disabled {
    .date-name {
        color: #c4c9cf;
    }
}
.date-item-today {
    .date-name {
        border-radius: 100px;
        background: #246fe5;
        color: #fff;
    }
}
</style>
