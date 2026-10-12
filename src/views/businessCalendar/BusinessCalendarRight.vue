<template>
    <div class="business-calendar-right">
        <div :class="['business-calendar-right-header', 'fcb']">
            <div class="fcb mr12">
                <div class="time fb7 mr12 f16">{{ i18n.global.t('common.year_format', { year: state.date }) }}</div>
                <div class="cp fc">
                    <m-popover
                        :disabled="!state.leftDisabled"
                        :content="i18n.global.t('meos_control_web.only_this_and_next_year')"
                        theme="darkTransparent"
                        :show-arrow="false"
                    >
                        <m-button
                            type="icon"
                            icon="IconMeriComponentChevronLeft"
                            :disabled="state.leftDisabled"
                            size="medium"
                            @click="prevYear"
                        ></m-button>
                    </m-popover>
                </div>
                <div class="cp fc">
                    <m-popover
                        :disabled="!state.rightDisabled"
                        :content="i18n.global.t('meos_control_web.only_this_and_next_year')"
                        theme="darkTransparent"
                        :show-arrow="false"
                    >
                        <m-button
                            type="icon"
                            icon="IconMeriComponentChevronRight"
                            size="medium"
                            :disabled="state.rightDisabled"
                            @click="nextYear"
                        ></m-button>
                    </m-popover>
                </div>
            </div>
            <div class="fc legend-container">
                <div
                    v-show="state.list[4] == 'is-AirSummer'"
                    class="fc mr16 legend-item"
                >
                    <div
                        class="color-item"
                        style="background: #fff0cc"
                    ></div>
                    <div
                        v-ellipsis
                        class="ml8 ft f12 legend-text"
                    >
                        {{ i18n.global.t('meos_control_web.summer') }}
                    </div>
                </div>
                <div
                    v-show="state.list[5] == 'is-AirWinter'"
                    class="fc mr16 legend-item"
                >
                    <div
                        class="color-item"
                        style="background: #d3eafd"
                    ></div>
                    <div
                        v-ellipsis
                        class="ml8 ft f12 legend-text"
                    >
                        {{ i18n.global.t('meos_control_web.winter') }}
                    </div>
                </div>
                <!-- <div v-show="state.list[6] == 'is-AirSummerPeak'" class="fc mr16">
                    <div class="color-item" style="background: #fddfdd"></div>
                    <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.summer_peak') }}</div>
                </div> -->
                <div
                    v-show="state.list[7] == 'is-AirSeasonSpring'"
                    class="mr16 legend-item"
                >
                    <div
                        class="color-item"
                        style="background: #d0ebd7"
                    ></div>
                    <div
                        v-ellipsis
                        class="ml8 ft f12 legend-text"
                    >
                        {{ i18n.global.t('meos_control_web.transition_spring') }}
                    </div>
                </div>
                <div
                    v-show="state.list[8] == 'is-AirSeasonAutumn'"
                    class="mr16 legend-item"
                >
                    <div
                        class="color-item"
                        style="background: #ebdff1"
                    ></div>
                    <div
                        v-ellipsis
                        class="ml8 ft f12 legend-text"
                    >
                        {{ i18n.global.t('meos_control_web.transition_season_autumn') }}
                    </div>
                </div>
                <div
                    v-show="state.list[3] == 'is-holiday'"
                    class="fc mr16 legend-item"
                >
                    <div class="triangle"></div>
                    <div
                        v-ellipsis
                        class="ml8 ft f12 legend-text"
                    >
                        {{ i18n.global.t('meos_control_web.holiday') }}
                    </div>
                </div>
                <div
                    v-show="state.list[2] == 'is-shop'"
                    class="fc mr16 legend-item"
                >
                    <SvgIcon
                        name="shop"
                        width="12px"
                        height="12px"
                    />
                    <div
                        v-ellipsis
                        class="ml8 ft f12 legend-text"
                    >
                        {{ i18n.global.t('meos_control_web.store_anniversary_day') }}
                    </div>
                </div>
                <div
                    v-show="state.list[1] == 'is-hot'"
                    class="fc mr16 legend-item"
                >
                    <SvgIcon
                        name="heating"
                        width="12px"
                        height="12px"
                    />
                    <div
                        v-ellipsis
                        class="ml8 ft f12 legend-text"
                    >
                        {{ i18n.global.t('meos_control_web.heating_supply') }}
                    </div>
                </div>
                <div
                    v-show="state.list[0] == 'is-cool'"
                    class="fc mr16 legend-item"
                >
                    <SvgIcon
                        name="cooling"
                        width="12px"
                        height="12px"
                    />
                    <div
                        v-ellipsis
                        class="ml8 ft f12 legend-text"
                    >
                        {{ i18n.global.t('meos_control_web.cooling_supply1') }}
                    </div>
                </div>
            </div>
        </div>
        <div class="calendar">
            <div
                v-for="(month, index) in monthlist"
                :key="index"
                class="calendar-month"
            >
                <div :class="['text-14', 'fcb', { dimmed: isMonthDimmed(`${month.date}`.padStart(2, '0')) }]">
                    <div class="fb7 mouth-class">{{ state.mouth[index] }}</div>
                </div>
                <div :class="['f', 'dayWeek', { dimmed: isMonthDimmed(`${month.date}`.padStart(2, '0')) }]">
                    <div :class="[month.monday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day1') }}</div>
                    <div :class="[month.tuesday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day2') }}</div>
                    <div :class="[month.wednesday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day3') }}</div>
                    <div :class="[month.thursday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day4') }}</div>
                    <div :class="[month.friday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day5') }}</div>
                    <div :class="[month.workday ? 'text-tip' : 'is-weekend']">{{ i18n.global.t('common.weekday.short_day6') }}</div>
                    <div :class="[month.dayoff ? 'text-tip' : 'is-weekend']">{{ i18n.global.t('common.weekday.short_day7') }}</div>
                </div>
                <ul
                    class="flex-wrap text-sub"
                    style="margin: 0"
                >
                    <li
                        v-for="(item, indexs) in month.days"
                        :key="indexs"
                        :class="[dayClasses(item), 'oneDay', item.className, { highlight: isHighlighted(item), dimmed: isDimmed(item) }]"
                        :data-id="item.date"
                        @mouseover="(e: any) => Mouseover(e, item)"
                    >
                        <m-popover
                            id="popoverItem"
                            :disabled="state.tipsDisabled"
                            :arrow-overflow="true"
                            :mouse-enter-delay="500"
                            :mouse-leave-delay="100"
                            placement="top"
                        >
                            <template #content>
                                <div class="f">
                                    <div class="f16 fb7">{{ dayjs(item.date).format(i18n.global.t('meos_control_web.date_format2')) }}</div>
                                </div>
                                <!--  v-if="existsInArray(item.className)" -->
                                <div class="fc bg-c mt10">
                                    <div
                                        v-if="item.className.includes('is-workday') || item.className.includes('is-dayoff')"
                                        class="ft f14"
                                    >
                                        {{
                                            item.className.includes('is-workday')
                                                ? i18n.global.t('meos_control_web.weekday')
                                                : item.className.includes('is-dayoff')
                                                ? i18n.global.t('meos_control_web.rest_day')
                                                : ''
                                        }}
                                    </div>
                                    <div
                                        v-if="item.className.includes('is-cool')"
                                        class="fc mr8"
                                    >
                                        <SvgIcon
                                            name="cooling"
                                            width="12px"
                                            height="12px"
                                        />
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.cooling_supply1') }}</div>
                                    </div>
                                    <div
                                        v-if="item.className.includes('is-hot')"
                                        class="fc mr8"
                                    >
                                        <SvgIcon
                                            name="heating"
                                            width="12px"
                                            height="12px"
                                        />
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.heating_supply') }}</div>
                                    </div>
                                    <div
                                        v-if="item.className.includes('is-holiday')"
                                        class="fc mr8"
                                    >
                                        <div class="triangle"></div>
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.holiday') }}</div>
                                    </div>
                                    <div
                                        v-if="item.className.includes('is-shop')"
                                        class="fc mr8"
                                    >
                                        <SvgIcon
                                            name="shop"
                                            width="12px"
                                            height="12px"
                                        />
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.store_anniversary_day') }}</div>
                                    </div>
                                    <div
                                        v-if="item.className.includes('is-AirSummer')"
                                        class="fc mr8"
                                    >
                                        <div
                                            class="color-item"
                                            style="background: #fce6b3"
                                        ></div>
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.summer') }}</div>
                                    </div>
                                    <div
                                        v-if="item.className.includes('is-AirWinter')"
                                        class="fc mr8"
                                    >
                                        <div
                                            class="color-item"
                                            style="background: #c1e1fc"
                                        ></div>
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.winter') }}</div>
                                    </div>
                                    <!-- <div v-if="item.className.includes('is-AirSummerPeak')" class="fc mr8">
                                        <div class="color-item" style="background: #fcd7d5"></div>
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.summer_peak') }}</div>
                                    </div> -->
                                    <div
                                        v-if="item.className.includes('is-AirSeasonSpring')"
                                        class="fc mr8"
                                    >
                                        <div
                                            class="color-item"
                                            style="background: #d0e8d6"
                                        ></div>
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.transition_spring') }}</div>
                                    </div>
                                    <div
                                        v-if="item.className.includes('is-AirSeasonAutumn')"
                                        class="fc mr8"
                                    >
                                        <div
                                            class="color-item"
                                            style="background: #e9dcf0"
                                        ></div>
                                        <div class="ml8 ft f14">{{ i18n.global.t('meos_control_web.transition_season_autumn') }}</div>
                                    </div>
                                </div>
                                <div
                                    v-if="businessHours?.length"
                                    class="ft f14 mt10"
                                >
                                    <span>{{ i18n.global.t('meos_control_web.business_hours_colon') }}</span>
                                    <span
                                        v-for="(item, index) in businessHours"
                                        :key="index"
                                    >
                                        <template v-if="item.isAllDay">{{ i18n.global.t('meos_control_web.all_day') }}</template>
                                        <template v-else>
                                            {{ item.left.slice(0, -3) }}-{{ item.right.slice(0, -3) }} <span v-if="index < businessHours.length - 1"> , </span>
                                        </template>
                                    </span>
                                </div>
                            </template>
                            <div
                                :class="[dayClasses(item).includes('is-day') && item.type == 'current' ? 'day' : 'everyDay']"
                                @mouseenter="mouseShow(item, true)"
                                @mouseleave="mouseShow(item, false)"
                            >
                                <div
                                    v-if="item.className.includes('is-shop') && item.type == 'current'"
                                    class="day-icon"
                                >
                                    <SvgIcon
                                        name="Cake"
                                        width="21px"
                                        height="21px"
                                    />
                                </div>
                                <div
                                    v-if="item.className.includes('is-hot') && item.type == 'current'"
                                    class="day-icon1"
                                >
                                    <SvgIcon
                                        name="heating"
                                        width="8px"
                                        height="8px"
                                    />
                                </div>
                                <div
                                    v-if="item.className.includes('is-cool') && item.type == 'current'"
                                    class="day-icon1"
                                >
                                    <SvgIcon
                                        name="cooling"
                                        width="8px"
                                        height="8px"
                                    />
                                </div>
                                <div
                                    v-if="
                                        (item.selected || state.day == item) &&
                                        item.type == 'current' &&
                                        !dayClasses(item).includes('is-formerlyWeekd') &&
                                        !dayClasses(item).includes('is-formerly')
                                    "
                                    :class="['tick-icon']"
                                >
                                    <SvgIcon
                                        name="tick"
                                        width="10px"
                                        height="10px"
                                    />
                                </div>
                                <div
                                    v-if="item.className.includes('is-holiday') && item.type == 'current'"
                                    class="triangle por"
                                ></div>
                                <p class="day-class">{{ item.day }}</p>
                            </div>
                        </m-popover>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
/* eslint-disable eqeqeq*/
import { onMounted } from 'vue';
import dayjs from 'dayjs';
import SvgIcon from '@/components/common/SvgIcon.vue';
import baseStore from '@/store/baseStore';
import { MLoading } from 'meri-plus';
import emitter from '@/utils/bus';
import debounce from 'lodash/debounce';
import { listInstantiationDateTag, getLastUpdateGlobalRuleTime, listBusinessTimeByObjId } from '@/apis/calendar';
import { dateRangeGenerator, isLeapYear } from '@/utils/index';
import { isRightPreviewLoadingKey, isLeftAndRightLoadingKey } from './injectKeys';
import { getDayjsTz } from '@/utils/globalVariables';
import { HOVER_DATA_TYPE } from './constants';

interface Month {
    date: string;
    checkboxShow: boolean;
    days: Day[];
    week: number;
    checkboxMonth: string;
    workday: boolean;
    dayoff: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
}
interface Day {
    date: string;
    day: any;
    type: string;
    hover: boolean;
    selected: boolean;
    mouseoverBgc: boolean;
    boderColor: any;
    relTemplate: Object;
    className: string[];
}
const state = reactive<any>({
    date: '',
    color: '#9FC9FB',
    today: getDayjsTz().format('YYYY-MM-DD'),
    dateTime: '',
    day: {},
    mouth: [
        i18n.global.t('common.month.month1'),
        i18n.global.t('common.month.month2'),
        i18n.global.t('common.month.month3'),
        i18n.global.t('common.month.month4'),
        i18n.global.t('common.month.month5'),
        i18n.global.t('common.month.month6'),
        i18n.global.t('common.month.month7'),
        i18n.global.t('common.month.month8'),
        i18n.global.t('common.month.month9'),
        i18n.global.t('common.month.month10'),
        i18n.global.t('common.month.month11'),
        i18n.global.t('common.month.month12')
    ],
    list: [],
    dateList: [],
    tipsDisabled: false,
    leftDisabled: true,
    rightDisabled: false,
    todays: getDayjsTz(),
    twoYearsAgo: ''
});
const businessHours: any = ref([]);
// const isShow = ref(false);
const monthlist = ref<Month[]>([]);
const dayClasses = (data: any) => {
    const classes: string[] = [];
    // eslint-disable-next-line eqeqeq
    if (state.today == data.date) {
        classes.push('is-day'); //今日class
    }
    if (!isweekd(data.date)) {
        // classes.push('is-weekend') //周末class
    }
    if (isweekd(data.date)) {
        // classes.push('is-workingDay') //工作日
    }
    if (data.type == 'pre' || data.type == 'next') {
        classes.push('is-formerly'); //小于今天的工作日class
    }
    // if (isweekd(data.date) == false && data.date <= state.today && !month.workday && !month.dayoff) {
    //     classes.push('is-formerlyWeekd'); //小于今天的周末class
    // }
    // if (data.date <= state.today && data.className.includes('is-workday')) {
    //     classes.push('is-formerly');
    // }
    // if (data.date <= state.today && !data.className.includes('is-workday') && isweekd(data.date) == false) {
    //     classes.push('is-formerlyWeekd');
    // }
    return classes;
};
//判断是否是周末
const isweekd = (day: any) => {
    // 获取今天的星期几（0-6，其中0表示星期天）
    let dayOfWeek = dayjs(day).day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false; //周末
    } else {
        return true; //工作日
    }
};
//接收左侧菜单参数
emitter.on('updateList', () => {
    getListInstantiationDateTag();
    getLastUpdateGlobalRuleTimeFuc();
});

onMounted(() => {
    getLastUpdateGlobalRuleTimeFuc();
    let date = new Date().getFullYear();
    state.date = date;
    state.twoYearsAgo = state.date;
    getListInstantiationDateTag();
});

//查询时间
const getLastUpdateGlobalRuleTimeFuc = () => {
    getLastUpdateGlobalRuleTime({}).then((res: any) => {
        state.dateTime = res.data?.dateTime || '';
    });
};
const getListBusinessTimeByObjId = (data: any, status: boolean) => {
    if (status) {
        if (data.type == 'current') {
            state.tipsDisabled = false;
            listBusinessTimeByObjId({ objId: baseStore().projectId, date: data.date }).then((res: any) => {
                businessHours.value = res?.data?.map((item: any) => {
                    let parts = item.split(',');
                    const isAllDay = ['00:00:00'].includes(parts[0]) && ['23:59:00'].includes(parts[1]);
                    const left = parts[0];
                    const right = parts[1].replace('23:59', '24:00');
                    return { left, right, isAllDay };
                });
            });
        } else {
            state.tipsDisabled = true;
        }
        console.log(status, state.tipsDisabled);
    } else {
        businessHours.value = [];
        state.tipsDisabled = false;
    }
};
const mouseShow = debounce(getListBusinessTimeByObjId, 500);
const Mouseover = (e: Event, day: Day) => {
    if (day.type != 'current') {
        state.tipsDisabled = true;
        return;
    } else {
        state.tipsDisabled = false;
    }
};
const loadingInstance = ref<any>();
const isSwitchYearLoading = ref(false);
const isRightLoading = inject(isRightPreviewLoadingKey, ref(false));
const isLeftAndRightLoading = inject(isLeftAndRightLoadingKey, ref(false));

watch(
    [() => isLeftAndRightLoading.value, isSwitchYearLoading],
    ([curLoading, switching]) => {
        if (curLoading || switching) {
            loadingInstance.value = MLoading.service({
                target: '.business-calendar-right',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                },
                customClass: 'loading-calendar-container'
            });
        } else {
            loadingInstance.value?.destroy();
        }
    },
    {
        immediate: true
    }
);

//查询右侧日历
const getListInstantiationDateTag = (isSwitchYear?: boolean) => {
    if (!isSwitchYear) {
        isRightLoading.value = true;
    } else {
        isSwitchYearLoading.value = true;
    }

    listInstantiationDateTag({
        beginDate: `${state.date}-01-01`,
        endDate: `${state.date}-12-31`
    })
        .then((res: any) => {
            state.dateList = res.data || [];
            state.list = [];
            state.dateList?.forEach((item: any) => {
                if (item.calendarTags) {
                    item.calendarTags.map((io: any) => {
                        if (io == 'ACSeason-1') {
                            state.list[0] = 'is-cool'; //供冷
                        }
                        if (io == 'ACSeason-2') {
                            state.list[1] = 'is-hot'; //供暖
                        }
                        if (io == 'anniversary') {
                            state.list[2] = 'is-shop'; //店庆
                        }
                        if (io == 'minorVacation' || io == 'nationalDay' || io == 'newYear') {
                            state.list[3] = 'is-holiday'; //节假
                        }
                        if (io == 'AirSummer') {
                            state.list[4] = 'is-AirSummer';
                        }
                        if (io == 'AirWinter') {
                            state.list[5] = 'is-AirWinter';
                        }
                        // if (io == 'AirSummerPeak') {
                        //     state.list[6] = 'is-AirSummerPeak';
                        // }
                        if (io == 'AirSeasonSpring') {
                            state.list[7] = 'is-AirSeasonSpring';
                        }
                        if (io == 'AirSeasonAutumn') {
                            state.list[8] = 'is-AirSeasonAutumn';
                        }
                    });
                }
            });
            getYears(state.date);
        })
        .finally(() => {
            if (!isSwitchYear) {
                isRightLoading.value = false;
            } else {
                isSwitchYearLoading.value = false;
            }
        });
};
//获取年日历
const getYears = (year: number) => {
    monthlist.value = [];
    for (let i = 0; i < 12; i++) {
        let firstdate = dayjs(String(year)).add(i, 'month').startOf('month'),
            enddate = dayjs(String(year)).add(i, 'month').endOf('month'),
            date = firstdate.toDate(), //每个月的开始日期
            enddates = enddate.toDate(), //每个月的结束日期
            firstWeek: any = firstdate.day(),
            lastWeek = enddate.day(),
            days: Day[] = [];
        if (firstWeek == 0) {
            firstWeek = 7;
        }
        if (firstWeek >= 1) {
            for (let j = 1; j < firstWeek; j++) {
                days.push({
                    date: dayjs(date).subtract(j, 'day').format('YYYY-MM-DD'),
                    type: 'pre',
                    day: dayjs(date).subtract(j, 'day').date() + '', //每个月具体的day
                    hover: false,
                    selected: false,
                    mouseoverBgc: false,
                    boderColor: '',
                    relTemplate: {},
                    className: []
                });
            }
            days.sort(function (a, b) {
                return a.day - b.day;
            });
        }
        //获取每个月的天数
        for (let j = 0; j < enddate.diff(date, 'days') + 1; j++) {
            let date1 = dayjs(date).add(j, 'day').toDate();
            days.push({
                date: dayjs(date1).format('YYYY-MM-DD'),
                type: 'current',
                day: dayjs(date1).date() + '', //每个月具体的day
                hover: false,
                selected: false,
                mouseoverBgc: false,
                boderColor: '',
                relTemplate: {},
                className: []
            });
        }
        if (lastWeek >= 1) {
            for (let j = 1; j <= 7 - lastWeek; j++) {
                days.push({
                    date: dayjs(enddates).add(j, 'day').format('YYYY-MM-DD'),
                    type: 'next',
                    day: dayjs(enddates).add(j, 'day').date() + '', //每个月具体的day
                    hover: false,
                    selected: false,
                    mouseoverBgc: false,
                    boderColor: '',
                    relTemplate: {},
                    className: []
                });
            }
        }
        days.forEach((items: any) => {
            if (state.dateList?.length) {
                state.dateList.forEach((item: any) => {
                    if (items.date == item.date) {
                        items.relTemplate = item.relTemplate;
                    }
                });
            }
            state.dateList.forEach((io: any) => {
                if (items.date == io.date && io.calendarTags) {
                    io.calendarTags.forEach((iv: any) => {
                        if (iv == 'ACSeason-1' && items.type == 'current') {
                            items.className.push('is-cool');
                        }
                        if (iv == 'ACSeason-2' && items.type == 'current') {
                            items.className.push('is-hot');
                        }
                        if (iv == 'AirSummer' && items.type == 'current') {
                            //夏
                            items.className.push('is-AirSummer');
                        }
                        // if (iv == 'AirSummerPeak' && items.type == 'current') {
                        //     //夏高峰
                        //     items.className.push('is-AirSummerPeak');
                        // }
                        if (iv == 'AirWinter' && items.type == 'current') {
                            //冬
                            items.className.push('is-AirWinter');
                        }
                        if (iv == 'AirSeasonSpring' && items.type == 'current') {
                            //过度春
                            items.className.push('is-AirSeasonSpring');
                        }
                        if (iv == 'AirSeasonAutumn' && items.type == 'current') {
                            //过度秋
                            items.className.push('is-AirSeasonAutumn');
                        }
                        if (iv == 'anniversary') {
                            items.className.push('is-shop');
                        }
                        if (iv == 'workday') {
                            items.className.push('is-workday');
                        }
                        if (iv == 'dayoff') {
                            items.className.push('is-dayoff');
                        }
                        if (iv == 'minorVacation' || iv == 'nationalDay' || iv == 'newYear') {
                            items.className.push('is-holiday');
                        }
                    });
                }
            });
        });
        monthlist.value.push({
            date: dayjs(firstdate).format('M'),
            days: days,
            checkboxShow: false, //判断复选框
            week: firstdate.day(), //空几格
            checkboxMonth: 'uncheck',
            workday: false,
            dayoff: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false
        });
    }
    monthlist.value.map(item => {
        item.days.map(io => {
            if (io.className.includes('is-workday') && io.date >= state.today) {
                if (dayjs(io.date).day() === 6) {
                    item.workday = true;
                }
                if (dayjs(io.date).day() === 0) {
                    item.dayoff = true;
                }
            }
            if (io.className.includes('is-dayoff') && io.date >= state.today) {
                if (dayjs(io.date).day() === 1) {
                    item.monday = true;
                }
                if (dayjs(io.date).day() === 2) {
                    item.tuesday = true;
                }
                if (dayjs(io.date).day() === 3) {
                    item.wednesday = true;
                }
                if (dayjs(io.date).day() === 4) {
                    item.thursday = true;
                }
                if (dayjs(io.date).day() === 5) {
                    item.friday = true;
                }
            }
        });
    });
};
// 上一年
const prevYear = () => {
    state.date--;
    getListInstantiationDateTag(true);
    if (state.date == state.twoYearsAgo) {
        state.leftDisabled = true;
        state.rightDisabled = false;
    } else {
        state.leftDisabled = false;
        state.rightDisabled = true;
    }
};
// 下一年
const nextYear = () => {
    const year = state.todays.year();
    state.date++;
    getListInstantiationDateTag(true);
    if (state.date > year) {
        state.rightDisabled = true;
        state.leftDisabled = false;
    } else if (state.date <= year) {
        state.rightDisabled = false;
        state.leftDisabled = true;
    }
};

const hoverDates = ref<string[]>([]);
const hoverMonths = computed(() => {
    const allMonths = hoverDates.value.reduce((acc: Record<string, string[]>, cur) => {
        const curMonth = cur?.split('-')?.[1];
        if (!acc[curMonth]) {
            acc[curMonth] = [];
        }
        acc[curMonth].push(cur);
        return acc;
    }, {});
    const noRepeatMonths = Object.keys(allMonths);
    return noRepeatMonths;
});
const isHighlighted = ({ date }: Day) => {
    return hoverDates.value.includes(date);
};
const isDimmed = ({ date }: Day) => {
    return hoverDates?.value?.length > 0 && !hoverDates?.value?.includes(date);
};

const isMonthDimmed = (month: number | string) => {
    return hoverDates?.value?.length > 0 && !hoverMonths?.value?.includes(`${month}`);
};
emitter.on('hoverCalendarDates', (config: any) => {
    const { ranges, type: showType } = config || {};
    if (Array.isArray(ranges) && ranges?.length > 0) {
        let finalStringArr: string[] = [];
        ranges.forEach(range => {
            const [start, end] = range;
            const year = state.date;
            let dateStart, dateEnd;
            if (start) {
                if (showType === HOVER_DATA_TYPE.WITH_YEAR) {
                    dateStart = new Date(start);
                } else {
                    // 非闰年时，但日期是2月29号，则取3月01号
                    if (!isLeapYear(year) && start === '02.29') {
                        dateStart = new Date(`${year}.03.01`);
                    } else {
                        dateStart = new Date(`${year}.${start}`);
                    }
                }
            }
            if (end) {
                if (showType === HOVER_DATA_TYPE.WITH_YEAR) {
                    dateEnd = new Date(end);
                } else {
                    // 非闰年时，但日期是2月29号，则取2月28号
                    if (!isLeapYear(year) && end === '02.29') {
                        dateEnd = new Date(`${year}.02.28`);
                    } else {
                        dateEnd = new Date(`${year}.${end}`);
                    }
                }
            }
            if (dateStart && dateEnd) {
                const finalArr = [...dateRangeGenerator(dateStart, dateEnd)].map(v => dayjs(v).format('YYYY-MM-DD'));
                finalStringArr = [...finalStringArr, ...finalArr];
            }
        });
        hoverDates.value = [...new Set(finalStringArr)];
    }
});
emitter.on('unhoverCalendarDates', () => {
    hoverDates.value = [];
});

onBeforeUnmount(() => {
    emitter.off('hoverCalendarDates');
    emitter.off('unhoverCalendarDates');
    emitter.off('updateList');
});
</script>

<style scoped lang="less">
@media screen and (min-width: 1681px) {
    .mouth-class {
        font-size: 16px;
    }
    .day-class {
        font-size: 16px;
    }
}
@media screen and (max-width: 1680px) {
    .mouth-class {
        font-size: 16px;
    }
    .day-class {
        font-size: 14px;
    }
}
@media screen and (max-width: 1440px) {
    .mouth-class {
        font-size: 14px;
    }
    .day-class {
        font-size: 12px;
    }
}
@media screen and (max-height: 700px) {
    .mouth-class {
        font-size: 14px;
    }
    .day-class {
        font-size: 12px;
    }
    .calendar-month li {
        height: 20px !important;
    }
    .day {
        height: 20px !important;
    }
}
.bg-c {
    background-color: #f7f9fa;
    padding: 4px;
    gap: 10px;
    width: fit-content;
}
.calendar {
    flex: 1;
    display: grid;
    gap: 9px 24px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    // grid-template-rows: auto;
}
.dayWeek {
    width: 100%;
    display: flex;
    div {
        flex: 1;
        height: 36px;
        line-height: 36px;
        text-align: center;
    }
}
.triangle {
    width: 0;
    height: 0;
    border-top: 8px solid #f8766f;
    border-right: 8px solid transparent;
}
.por {
    position: absolute;
    left: 0;
    top: 0;
}
.business-calendar-right {
    height: 100%;
    position: relative;
    padding: 16px;
    border-radius: 8px;
    background: #fff;
    display: flex;
    flex-direction: column;

    &-header {
        height: 28px;
        margin-bottom: 9px;
        // background-color: bisque
        .legend-container {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            max-width: 100%;
        }
        .legend-item {
            // flex: 0 0 auto;
            display: flex;
            align-items: center;
            min-width: 0;
        }

        .legend-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .legend-container::-webkit-scrollbar {
            display: none;
        }
        .legend-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    }
    .is-hot {
        // background-color: var(--orange-100);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .is-cool {
        // background-color: var(--blue-50);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .is-workday,
    .is-workingDay {
        color: #000;
    }
    .is-weekend,
    .is-dayoff {
        color: #e68600;
    }
    .is-formerly {
        color: rgba(128, 128, 128, 0.5);
        cursor: default;
    }
    .is-formerlyWeekd {
        color: rgba(255, 165, 0, 0.5);
        cursor: default;
    }
    .is-AirSummer {
        background-color: rgba(255, 240, 204, 0.8);
    }
    .is-AirWinter {
        background-color: #ebf6ff;
    }
    .is-AirSummerPeak {
        background-color: rgba(255, 230, 229, 0.8);
    }
    .is-AirSeasonSpring {
        background-color: rgba(218, 247, 225, 0.8);
    }
    .is-AirSeasonAutumn {
        background-color: rgba(241, 227, 247, 0.8);
    }
    .day {
        background-color: #246fe5;
        color: white;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
    }
    .everyDay {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
@media screen and (max-width: 1280px) {
    .business-calendar-right {
        min-width: 860px;
    }
}
.color-item {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    // background-color: #000;
}
ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

li {
    display: list-item;
    text-align: -webkit-match-parent;
}

ol,
ul {
    list-style: none;
}

.flex-wrap {
    flex-wrap: wrap;
    display: flex;
}
.mt-24 {
    margin-bottom: 10px;
}

.ml-16 {
    margin-left: 16px;
}

.text-primary {
    color: #333;
}

.text-sub,
.text-tip {
    line-height: 1.5;
}

.text-center {
    text-align: center;
}

.text-14 {
    font-size: 14px;
    // line-height: 1.5;
}

.pb-8 {
    padding-bottom: 8px;
}

.text-sub {
    color: #666;
}

.text-tip {
    // background-color: #f5f7fa;
    color: #999;
}

.color-red {
    color: #f5222d;
}
.oneDay {
    position: relative;
    // cursor: pointer;
    width: 100%;
    // height: 100%;
    border: 1px solid transparent;
    z-index: 1;
    .day-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
    }
    .day-icon1 {
        position: absolute;
        top: -7px;
        right: 0px;
        // width: 10px;
        // height: 10px;
    }
    .tick-icon {
        position: absolute;
        top: -6px;
        left: 0;
        width: 10px;
        height: 10px;
    }
}
.oneDay:hover {
    border: 1px solid #429fff;
}

.relative {
    position: relative;
}
.absolute {
    position: absolute;
}

.calendar-month {
    display: flex;
    flex-direction: column;
}

.calendar-month ul {
    // width: 380px;

    padding: 1px;
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.calendar-month li {
    text-align: center;
    flex: 1;
    // height: 36px;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    //border: 1px dashed #8c939d;
}
.calendar-month li span {
    font-size: 8px;
    bottom: -12px;
    left: -2px;
    text-align: center;
    transform: scale(0.6);
}
.calendar-month .isSelected {
    // background: #b3c8ff;
    color: #162d53;
}
.calendar-month .isOver {
    background-color: #f0f0f0;
    color: #999;
}

.highlight {
    opacity: 1;
}
.dimmed {
    opacity: 0.2;
}

:deep(.m-loading-mask.loading-calendar-container) {
    border-radius: 8px;
}
</style>
