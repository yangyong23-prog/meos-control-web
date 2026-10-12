<!--  -->
<!--  -->
<template>
    <div style="height: 100%">
        <header class="fcb">
            <div v-for="day in weekCalendar" :key="day.date.format('YYYY-MM-DD')" class="day fc" :class="[screenWidth >= 1920 && 'day-1920', screenWidth < 1920 && 'day-1366']">
                <div
                    v-if="isNotHolidays(day)"
                    class="holidays-festivals f10 fb7"
                    :class="{
                        'title-holidays-festivals': isNotHolidays(day)
                    }"
                >
                    <span style="margin-top: -12px">{{ i18n.global.t('meos_control_web.section') }}</span>
                </div>
                <div class="fcb" style="flex: 1">
                    <div>
                        <span class="f16 fb7 ffCustom-M"> {{ day.date.format('MM.DD') }}</span>
                        <span class="ml8 ft">{{
                            [
                                i18n.global.t('common.weekday.day7'),
                                i18n.global.t('common.weekday.day1'),
                                i18n.global.t('common.weekday.day2'),
                                i18n.global.t('common.weekday.day3'),
                                i18n.global.t('common.weekday.day4'),
                                i18n.global.t('common.weekday.day5'),
                                i18n.global.t('common.weekday.day6')
                            ][day.weekday]
                        }}</span>
                    </div>
                    <span v-if="isToday(day)" class="today">{{ i18n.global.t('meos_control_web.today') }}</span>
                </div>
            </div>
        </header>
        <div class="calendar-content" :class="[screenWidth >= 1920 && 'calendar-content-1920', screenWidth < 1920 && 'calendar-content-1366']">
            <div
                v-for="(day, index) in weekCalendar"
                :key="index + 'd'"
                class="days"
                :class="{
                    'days-1920': screenWidth >= 1920,
                    'days-1366': screenWidth < 1920
                }"
            >
                <div style="width: 100%; height: 100%">
                    <!-- <div class="days-container"> -->
                    <div :ref="el => (contentDivs[index] = el)" class="days-container">
                        <div :ref="el => (childDiv[index] = el)" class="content flc">
                            <!-- <div :ref="el => containerFun(el, day)" class="content flc"> -->
                            <div v-if="day.list.length == 0" class="no-data">{{ i18n.global.t('meos_control_web.no_time_table_data') }}</div>
                            <template v-else>
                                <dateItem :list="day" :current-system="currentSystem" @edit-btn="editSubmit" @del-btn="delBtn" />
                            </template>
                        </div>
                        <!-- v-if="day.showMore" -->
                        <div v-if="day.showMore" class="view-all">
                            <m-tips trigger="click" popover-class="more-popover">
                                <template #content>
                                    <div style="height: 600px; overflow: hidden; min-width: 400px">
                                        <dayItem :type="'more'" :show-header="false" :list="toDay?.list" :current-system="currentSystem" @edit-btn="editSubmit" @del-btn="delBtn" />
                                    </div>
                                </template>
                                <m-button :id="'btn' + index" type="link" size="small" @click="moreBtn(day)">{{ i18n.global.t('meos_control_web.view_all') }}</m-button>
                            </m-tips>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
/*eslint-disable one-var*/
/*eslint-disable eqeqeq*/
import dayItem from './dayItem.vue';
import dateItem from './dateItem.vue';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { weeksDateKey, rightToDayKey, dataItemKey, isLoadingKey } from '../../hooks/useTimetableHook';
import weekday from 'dayjs/plugin/weekday';
import { useIntersectionObserver } from '@vueuse/core';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsSame, dayjsIsSameOrBefore } from '@/utils/dayjsTools';

dayjs.extend(weekday);
const emit = defineEmits(['editBtn']);
const isLoading = inject(isLoadingKey);
const weeksDate = inject(weeksDateKey);
const toDay = inject(rightToDayKey);
const dataItem = inject(dataItemKey); //周日历数据
const contentDivs = ref([]);
const childDiv = ref([]);
const days = ref([]);
const props = defineProps({
    currentSystem: {
        type: Object,
        default: () => {}
    }
});

// 默认展示的天
const generateWeekCalendar = () => {
    const [startDateStr, endDateStr] = weeksDate.value.split('-');
    const startDate = dayjs(startDateStr.replace(/\./g, '-'));
    const endDate = dayjs(endDateStr.replace(/\./g, '-'));
    days.value = [];
    let currentDate = startDate;
    while (dayjsIsSameOrBefore(currentDate, endDate)) {
        days.value.push({
            date: currentDate,
            weekday: currentDate.weekday(),
            showMore: false,
            list: []
        });
        currentDate = currentDate.add(1, 'day');
    }
    days.value.forEach(daysItem => {
        dataItem.value.forEach(item => {
            if (dayjs(daysItem.date).format('YYYY-MM-DD') === dayjs(item.strategyDate).format('YYYY-MM-DD')) {
                daysItem.holidayTag = item.holidayTag;
                dayItem.list = dayItem.list || [];
                daysItem.list = item.executeObjects;
            }
        });
    });
    return days.value;
};
const weekCalendar = computed(generateWeekCalendar);

// 单位数日+0
// const Appendzero = obj => {
//     if (obj < 10) return '0' + '' + obj;
//     else return obj;
// };
const moreBtn = item => {
    toDay.value = item;
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
const editSubmit = obj => {
    emit('editBtn', obj);
};
watch(
    () => isLoading.value,
    () => {
        nextTick(() => {
            resizeFuc();
        });
    }
);
const resizeFuc = () => {
    nextTick(() => {
        weekCalendar.value.forEach((_, index) => {
            const observer = new ResizeObserver(() => checkOverflow(index));
            const contentDiv = contentDivs.value[index];
            const childDivs = childDiv.value[index];
            if (contentDiv && childDivs) {
                observer.observe(contentDiv);
                observer.observe(childDivs);
            }
        });
    });
};
const checkOverflow = index => {
    nextTick(() => {
        const contentDiv = contentDivs.value[index];
        const childDivs = childDiv.value[index];
        if (contentDiv && childDivs) {
            const parentHeight = contentDiv.offsetHeight;
            const childHeight1 = childDivs?.offsetHeight ? childDivs?.offsetHeight : 0;
            const totalChildHeight = childHeight1;
            if (totalChildHeight > parentHeight) {
                weekCalendar.value[index].showMore = true;
            } else {
                weekCalendar.value[index].showMore = false;
            }
        }
    });
};
onMounted(async () => {
    window.addEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
    resizeFuc();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});
// index调用
defineExpose({});
</script>
<style lang="less">
.more-popover {
    padding: 0 !important;
}
</style>
<style scoped lang="less">
.m-tag-small + .m-tag-small {
    margin-left: 0 !important;
}
header {
    color: #1b2129;
    background: #e8ecf0;

    .day {
        width: 100%;
        border-right: 1px solid #e1e5eb;
        position: relative;
    }

    .day-1920 {
        line-height: 40px;
        font-size: 14px;
        padding: 0 8px;
    }

    .day-1366 {
        line-height: 40px;
        font-size: 12px;
        padding: 0 8px;
    }
}
.holidays-festivals {
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    width: 24px;
    height: 24px;
    background-color: #f55047;
    clip-path: polygon(0 0, 100% 0, 0 100%);
    display: flex;
    padding-left: 2px;
}
.today {
    color: #fff;
    font-weight: 700;
    border-radius: 90px;
    background: #246fe5;
    text-align: center;
    font-family: Microsoft YaHei UI;
    font-size: 14px;
    // width: 24px;
    // height: 24px;
    padding: 0 4px;
    line-height: 24px;
}
.calendar-content {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    // grid-template-rows: repeat(auto-fill, 1fr);

    .days {
        border-right: 1px solid #e1e5eb;
        border-top: 1px solid #e1e5eb;
        overflow: hidden;

        &-container {
            // min-width: 192px;
            height: 100%;
            position: relative;
            // border: 2px solid transparent;
            .view-all {
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 4px 12px;
                background-color: #fff;
            }
            .content {
                color: #424c59;
                display: flex;
                flex-direction: column;
                min-height: 100%;
                .no-data {
                    text-align: center;
                    color: #c4c9cf;
                    font-family: Microsoft YaHei UI;
                    position: absolute;
                    top: 32px;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }

    .days-1920 {
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
            // padding: 0 8px 0px 20px;
            font-size: 14px;
            line-height: 22px;

            .no-data {
                font-size: 14px;
            }
        }
    }

    .days-1366 {
        // min-height: 88px;

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
            // padding: 0 8px 0 10px;
            font-size: 12px;
            line-height: 16px;

            .no-data {
                font-size: 12px;
            }
        }
    }
}

.calendar-content-1920 {
    height: calc(100% - 40px);
}

.calendar-content-1366 {
    height: calc(100% - 40px);
}
</style>
