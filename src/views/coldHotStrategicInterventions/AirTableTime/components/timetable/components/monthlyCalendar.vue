<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<!-- vue/no-side-effects-in-computed-properties -->
<!--  -->
<template>
    <div style="height: 100%">
        <header class="fcb">
            <div v-for="day in daysOfWeek" :key="day" class="day fc" :class="[screenWidth >= 1920 && 'day-1920', screenWidth < 1920 && 'day-1366']">
                {{ day }}
            </div>
        </header>
        <div class="calendar-content" :class="[screenWidth >= 1920 && 'calendar-content-1920', screenWidth < 1920 && 'calendar-content-1366']">
            <div
                v-for="(day, index) in days"
                :key="index + 'd'"
                :ref="el => (dayRefs[index] = el)"
                class="days"
                :class="{
                    'not-current-month': isNotCurrentMonth(day),
                    'days-1920': screenWidth >= 1920,
                    'days-1366': screenWidth < 1920,
                    'hover-item-1920': true,
                    'hover-item-1366': true && screenWidth < 1920,
                    'hover-item-today-1920': isToday(day) && true && screenWidth >= 1920,
                    'hover-item-today-1366': isToday(day) && true && screenWidth < 1920
                }"
            >
                <div
                    style="width: 100%; height: 100%; border: 2px solid transparent"
                    :class="{ 'hover-item': true && !isNotCurrentMonth(day), active: dayjsIsSame(dayjs(day.date), rightToDay?.date, 'dayjs') && !isNotCurrentMonth(day) }"
                    @click="clickDay(day, index)"
                >
                    <div class="days-container">
                        <div
                            v-if="isNotHolidays(day)"
                            class="holidays-festivals f10 fb7"
                            :class="{
                                'title-holidays-festivals': isNotCurrentMonth(day)
                            }"
                        >
                            {{ i18n.global.t('meos_control_web.section') }}
                        </div>
                        <div
                            class="title fcb"
                            :style="{
                                paddingTop: isToday(day) ? '8px' : screenWidth >= 1920 ? '8px' : '8px',
                                paddingBottom: !isNotCurrentMonth(day) && isToday(day) ? '12px' : screenWidth >= 1920 ? '12px' : '12px'
                            }"
                        >
                            <div
                                :style="{ paddingLeft: isToday(day) ? '12px' : screenWidth >= 1920 ? '12px' : '12px' }"
                                class="title-date fcb"
                                :class="{
                                    'title-date-not-current-month': isNotCurrentMonth(day)
                                }"
                            >
                                <span class="fc">
                                    <span class="ffCustom-M">{{ day.day }}</span>
                                    <span
                                        v-if="day.day == 1"
                                        class="title-month ml4"
                                        :class="{
                                            'title-current-mouth': !day.isNextMonth,
                                            'title-next-mouth': day.isNextMonth
                                        }"
                                    >
                                        {{ day.isNextMonth ? (currentDate.getMonth() === 11 ? 1 : currentDate.getMonth() + 2) : currentDate.getMonth() + 1
                                        }}{{ i18n.global.t('common.monthUnit') }}
                                    </span>
                                </span>
                                <span v-if="isToday(day)" class="today">{{ i18n.global.t('meos_control_web.today') }}</span>
                            </div>
                        </div>
                        <div v-if="!isNotCurrentMonth(day)" class="content flc">
                            <div v-if="day.list.length == 0" class="no-data">{{ i18n.global.t('meos_control_web.no_time_table_data') }}</div>
                            <template v-else>
                                <template v-if="curConsoleType === ConsoleTypesEnum.AIR_TERMINAL_ZONE">
                                    <div v-for="(items, idx) in day?.list" :key="idx">
                                        <template v-if="items && items.consoleType === ConsoleTypesEnum.AIR_TERMINAL_ZONE">
                                            <div class="air-conditioning-zoning f14 mb8">
                                                <div
                                                    v-ellipsis="{ title: items.localName }"
                                                    class="m-ellipsis"
                                                    style="height: 22px; line-height: 22px; padding-right: 20px; position: relative; width: fit-content; max-width: 100%"
                                                >
                                                    {{ items.localName }}
                                                    <SpaceIcon v-if="items.classCode === 'ACZone'" :data="items" :open-space-list="openAirConditionSpaceList" />
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                                <template v-else>
                                    <div v-for="(items, idx) in day?.list" :key="idx">
                                        <template v-if="items && items.consoleType === 'WSDH_SYSTEM'">
                                            <div class="cooling-supply f14">{{ i18n.global.t('meos_control_web.domestic_hot_water') }}</div>
                                        </template>
                                    </div>
                                </template>
                            </template>
                        </div>
                        <div class="more-ellipsis">
                            <div v-if="isCellItemsOverHeight(index, day?.list?.length)" class="Omit f14">...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { monthDateKey, toDayKey, dataItemKey, rightToDayKey, isLoadingKey } from '../../../hooks/useTimetableHook';
import { openAirConditionSpaceListKey } from '../../../injectKeys';
import i18n from '@/localization';

import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsSame } from '@/utils/dayjsTools';
import { ConsoleTypesEnum } from '@/views/Common/SystemsAndControl/types';
import SpaceIcon from '@/components/TimeTableEditorModal/SpaceIcon.vue';

const monthDate = inject(monthDateKey);
const dataItem = inject(dataItemKey);
const rightToDay = inject(rightToDayKey);
const isLoading = inject(isLoadingKey);
const openAirConditionSpaceList = inject(openAirConditionSpaceListKey);
const weekdays = [
    i18n.global.t('common.weekday.day7'),
    i18n.global.t('common.weekday.day1'),
    i18n.global.t('common.weekday.day2'),
    i18n.global.t('common.weekday.day3'),
    i18n.global.t('common.weekday.day4'),
    i18n.global.t('common.weekday.day5'),
    i18n.global.t('common.weekday.day6')
];
const currentDate = ref(new Date());
const temporarilyDay = ref();

const daysOfWeek = computed(() => {
    return weekdays;
});
const props = defineProps({
    currentSystem: {
        type: Object,
        default: () => {}
    },
    curConsoleType: {
        type: String,
        default: ''
    }
});

const dayRefs = reactive({});
const dayCellHeights = reactive({});
// 时间季节对象

// emitter.on('changeMonth', type => {
//     clickMonth();
// });

// 默认展示的天
const days = computed(() => {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    currentDate.value = new Date(new Date(monthDate.value).getFullYear(), new Date(monthDate.value).getMonth(), 1);
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInLastMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // console.log((currentDate.value = new Date(new Date(monthDate.value).getFullYear(), new Date(monthDate.value).getMonth(), 1)), 'dataItem');
    const days = [];
    let day = 1,
        lastMonthDay = daysInLastMonth - firstDayOfMonth + 1,
        nextMonthDay = 1;
    for (let i = 0; i < 6 * 7; i++) {
        if (i < firstDayOfMonth) {
            days.push({
                date: new Date(year, month - 1, lastMonthDay),
                day: lastMonthDay,
                isLastMonth: true,
                isNextMonth: false,
                list: []
            });
            lastMonthDay++;
        } else if (i >= firstDayOfMonth + daysInMonth) {
            days.push({
                date: new Date(year, month + 1, nextMonthDay),
                day: nextMonthDay,
                isLastMonth: false,
                isNextMonth: true,
                list: []
            });
            nextMonthDay++;
        } else {
            const date = new Date(year, month, day);
            days.push({
                date,
                day,
                isLastMonth: false,
                isNextMonth: false,
                month: true,
                list: []
            });
            day++;
        }
    }

    days.forEach(daysItem => {
        dataItem.value.forEach(item => {
            // console.log(dayjs(daysItem.date).format('YYYY-MM-DD'), dayjs(item.strategyDate).format('YYYY-MM-DD'), '1111');
            if (dayjs(daysItem.date).format('YYYY-MM-DD') === dayjs(item.strategyDate).format('YYYY-MM-DD')) {
                daysItem.holidayTag = item.holidayTag;
                daysItem.list = item.executeObjects;
            }
        });
    });

    return days;
});

// 不是本月的月份
const isNotCurrentMonth = day => {
    return day.isLastMonth || day.isNextMonth;
};
// 当天
const isToday = day => {
    const todayDayjs = getDayjsTz();
    const dateFromA = day.date;
    const isSameDay = dayjsIsSame(todayDayjs, dateFromA, 'day');
    return isSameDay;
};

// 节假日
const isNotHolidays = day => {
    return day.holidayTag;
};
// 今日时间表进入
const clickDay = (item, index) => {
    if (isNotCurrentMonth(item)) return;
    rightToDay.value = item;
    temporarilyDay.value = item;
};
// 单元格里数据条数超出高度
const isCellItemsOverHeight = (index, count) => {
    const cellHeight = dayCellHeights[index];

    if (count > 0 && cellHeight !== undefined) {
        return cellHeight - 38 - count * 30 + 8 <= 0;
    }
    return false;
};
const updateCellHeight = () => {
    Object.keys(dayRefs).forEach(index => {
        const el = dayRefs[index];

        if (el) {
            dayCellHeights[index] = el.clientHeight;
        }
    });
};
watch(
    () => isLoading.value,
    () => {
        const today = getDayjsTz();
        if (temporarilyDay.value) {
            days.value?.forEach((item, index) => {
                if (temporarilyDay.value.date.toDateString() === item.date.toDateString()) {
                    rightToDay.value = item;
                }
            });
        } else {
            days.value?.forEach((item, index) => {
                if (dayjsIsSame(dayjs(item.date), today, 'day')) {
                    rightToDay.value = item;
                }
            });
        }
        if (!isLoading.value) {
            updateCellHeight();
        }
    },
    { immediate: true }
);
const screenWidth = ref(document.documentElement.clientWidth);
watch(
    () => screenWidth.value,
    val => {
        screenWidth.value = val;
    },
    {
        deep: true
    }
);

onMounted(async () => {
    window.addEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
        updateCellHeight();
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});

// index调用
defineExpose({});
</script>
<style scoped lang="less">
header {
    color: #1b2129;
    background: #e8ecf0;

    .day {
        width: 100%;
        border-right: 1px solid #e1e5eb;
        color: #626c78;
    }

    .day-1920 {
        line-height: 40px;
        font-size: 14px;
        padding-left: 9px;
    }

    .day-1366 {
        line-height: 40px;
        font-size: 12px;
        padding-left: 6px;
    }
}

.calendar-content {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    // grid-template-rows: repeat(5, minmax(0, 1fr));
    .days {
        border-right: 1px solid #e1e5eb;
        border-top: 1px solid #e1e5eb;
        overflow: hidden;
        .holidays-festivals {
            position: absolute;
            left: -2px;
            top: -2px;
            color: #fff;
            width: 24px;
            height: 24px;
            background-color: #f55047;
            clip-path: polygon(0 0, 100% 0, 0 100%);
            display: flex;
            padding-left: 2px;
        }
        &-container {
            // min-width: 192px;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            // border: 2px solid transparent;
            .title {
                width: 100%;

                &-date {
                    font-family: Arial;
                    font-weight: 700;
                }

                &-month {
                    font-family: Microsoft YaHei UI;
                    border-radius: 4px;
                }

                &-current-mouth {
                    color: #626c78;
                    background: rgba(196, 201, 207, 0.3);
                }

                &-next-mouth {
                    color: #626c78;
                    background: rgba(196, 201, 207, 0.3);
                    // opacity: 0.3;
                }

                &-date-not-current-month {
                    // color: #8b949e;
                    opacity: 0.3;
                }
                &-holidays-festivals {
                    opacity: 0.5;
                }
                .today {
                    color: #fff;
                    font-weight: 700;
                    border-radius: 90px;
                    background: #246fe5;
                    text-align: center;
                    font-family: Microsoft YaHei UI;
                }

                &-icon {
                    height: 20px;
                    align-content: center;
                    padding-right: 14px;
                    z-index: -1;
                    cursor: pointer;

                    .line {
                        margin: 0 4px;
                        width: 1px;
                        height: 12px;
                        background: #c4c9cf;
                    }

                    svg {
                        border-radius: 4px;

                        &:hover {
                            background: rgba(196, 201, 207, 0.3);
                        }
                    }
                }

                &-season {
                    font-weight: normal;
                    margin-left: 8px;
                }
            }

            .content {
                color: #424c59;
                overflow: hidden;
                .no-data {
                    text-align: center;
                    color: #c4c9cf;
                    font-family: Microsoft YaHei UI;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .strategy {
                    color: #424c59;

                    .line {
                        display: inline-block;
                        width: 1px;
                        height: 12px;
                        background: #8b949e;
                    }

                    .round {
                        display: inline-block;
                        background: #246fe5;
                        border-radius: 90px;
                    }

                    &:last-of-type {
                        margin-bottom: 0;
                    }
                }
            }
        }

        :hover .title-icon {
            z-index: 1;
        }
    }

    .days-1920 {
        min-height: 107px;

        .title {
            //height: 34px;

            &-date {
                height: 18px;
                line-height: 18px;
                font-size: 24px;
                width: 100%;
                padding-right: 12px;
            }

            &-month {
                padding: 1px 12px;
                margin-right: 8px;
                font-size: 14px;
                line-height: 24px;
            }

            .today {
                font-size: 14px;
                // width: 24px;
                // height: 24px;
                padding: 0 4px;
                line-height: 24px;
            }

            &-icon {
                svg {
                    padding: 3px;
                }
            }
        }

        .content {
            padding: 0px 12px 8px 12px;
            font-size: 14px;
            line-height: 22px;
            .no-data {
                font-size: 14px;
            }

            .strategy {
                line-height: 22px;
                font-size: 14px;
                height: 22px;
                color: #424c59;
                margin-bottom: 0;

                .line {
                    display: inline-block;
                    //   margin: 0 4px;
                    width: 1px;
                    height: 12px;
                    background: #8b949e;
                }

                .round {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #246fe5;
                    border-radius: 90px;
                    margin-right: 4px;
                }

                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }
    }

    .days-1366 {
        min-height: 107px;

        .title {
            //height: 32px;

            &-date {
                height: 16px;
                line-height: 16px;
                font-size: 20px;
                width: 100%;
                padding-right: 12px;
            }

            &-month {
                padding: 1px 6px;
                margin-right: 6px;
                font-size: 14px;
                line-height: 22px;
            }

            .today {
                font-size: 12px;
                // width: 20px;
                // height: 20px;
                padding: 0 4px;
                line-height: 20px;
            }

            &-icon {
                svg {
                    padding: 1px;
                }
            }
        }

        .content {
            padding: 0 8px 0 10px;
            font-size: 12px;
            line-height: 16px;

            .no-data {
                font-size: 12px;
            }

            .strategy {
                line-height: 16px;
                font-size: 12px;
                height: 16px;
                color: #424c59;
                margin-bottom: 5px;

                .line {
                    display: inline-block;
                    margin: -1 0;
                    width: 1px;
                    height: 12px;
                    background: #8b949e;
                }

                .round {
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    background: #246fe5;
                    border-radius: 90px;
                    margin-right: 4px;
                }

                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }
    }
    .more-ellipsis {
        padding-top: 4px;
        margin-left: 12px;
    }
    .Omit {
        line-height: 7px;
        width: 24px;
        height: 24px;
        padding: 4px 6px;
        border-radius: 2px;
        background: rgba(196, 201, 207, 0.2);
    }
    .air-conditioning-zoning {
        color: #1b2129;
        padding: 0 8px;
        height: 22px;
        border-radius: 2px;
        background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0) 100%);
        :deep(.guan-lian) {
            path {
                fill: var(--gray-600);
            }
        }
    }
    .cooling-supply {
        color: #1b4acc;
        padding: 4px 8px;
        height: 22px;
        line-height: 14px;
        border-radius: 2px;
        background: linear-gradient(90deg, rgba(100, 166, 247, 0.12) 0%, rgba(100, 166, 247, 0) 100%);
    }
    .heat-supply {
        color: #f55047;
        padding: 4px 8px;
        height: 22px;
        line-height: 14px;
        border-radius: 2px;
        background: linear-gradient(90deg, rgba(245, 80, 71, 0.12) 0%, rgba(245, 80, 71, 0) 100%);
    }
    .hover-item {
        &:hover {
            cursor: pointer;
            // background-color: rgba(235, 246, 255, 0.8);
            border: 2px solid var(--blue-400, #2481f2) !important;
        }
    }
    .active {
        border: 2px solid var(--blue-500, #246fe5) !important;
        background: var(--blue-50, #ebf6ff);
    }
    // .hover-item-1920 {
    //     &:hover .title {
    //         border: 2px solid #246fe5;
    //     }
    // }

    // .hover-item-1366 {
    //     &:hover .title {
    //         border: 2px solid #246fe5;
    //         //   color: red;
    //     }
    // }

    // .hover-item-today-1920 {
    //     &:hover .title {
    //         border: 2px solid #246fe5;
    //     }
    // }

    // .hover-item-today-1366 {
    //     &:hover .title {
    //         border: 2px solid #246fe5;
    //     }
    // }

    // 不是本月的
    .not-current-month {
        // cursor: not-allowed;
        background: url(@/assets/imgs/bg_line.png) no-repeat;
        background-size: cover;
    }
}

.calendar-content-1920 {
    height: calc(100% - 40px);
}

.calendar-content-1366 {
    height: calc(100% - 40px);
}

.strategy {
    line-height: 22px;
    font-size: 14px;
    height: 22px;
    color: #424c59;
    margin-bottom: 8px;

    .line {
        display: inline-block;
        margin: 0;
        width: 1px;
        height: 12px;
        background: #8b949e;
    }

    .round {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #246fe5;
        border-radius: 90px;
        margin-right: 4px;
    }

    &:last-of-type {
        margin-bottom: 0;
    }
}
</style>
