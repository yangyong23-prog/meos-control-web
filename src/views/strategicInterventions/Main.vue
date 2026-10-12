<!--  -->
<template>
    <div>
        <header class="fcb">
            <div v-for="day in daysOfWeek" :key="day" class="day fc" :class="[screenWidth >= 1920 && 'day-1920', screenWidth < 1920 && 'day-1366']">
                {{ day }}
            </div>
        </header>
        <div class="calendar-content" :class="[screenWidth >= 1920 && 'calendar-content-1920', screenWidth < 1920 && 'calendar-content-1366']">
            <div
                v-for="(day, index) in days"
                :key="index + 'd'"
                class="days"
                :class="{
                    'not-current-month': isNotCurrentMonth(day),
                    'days-1920': screenWidth >= 1920,
                    'days-1366': screenWidth < 1920,
                    'hover-item': !isNotCurrentMonth(day) && day.list.length,
                    'hover-item-1920': !isNotCurrentMonth(day) && day.list.length && !isToday(day) && screenWidth >= 1920,
                    'hover-item-1366': !isNotCurrentMonth(day) && day.list.length && !isToday(day) && screenWidth < 1920,
                    'hover-item-today-1920': isToday(day) && day.list.length && screenWidth >= 1920,
                    'hover-item-today-1366': isToday(day) && day.list.length && screenWidth < 1920
                }"
                @mouseenter="handleMouseEnter(day)"
                @mouseleave="handleMouseLeave"
            >
                <div class="days-container">
                    <div
                        class="title fcb"
                        :style="{
                            paddingTop: isToday(day) ? '6px' : screenWidth >= 1920 ? '12px' : '12px',
                            paddingBottom: !isNotCurrentMonth(day) && isToday(day) ? '6px' : screenWidth >= 1920 ? '8px' : '4px'
                        }"
                    >
                        <div
                            :style="{ paddingLeft: isToday(day) ? '12px' : screenWidth >= 1920 ? '20px' : '10px' }"
                            class="title-date fc"
                            :class="{
                                'title-date-not-current-month': isNotCurrentMonth(day)
                            }"
                        >
                            <span
                                v-if="day.day == 1"
                                class="title-month"
                                :class="{
                                    'title-current-mouth': !day.isNextMonth,
                                    'title-next-mouth': day.isNextMonth
                                }"
                                >{{ day.isNextMonth ? (currentDate.getMonth() === 11 ? 1 : currentDate.getMonth() + 2) : currentDate.getMonth() + 1
                                }}{{ i18n.global.t('common.monthUnit') }}</span
                            >
                            <span v-if="isToday(day)" class="today">{{ i18n.global.t('meos_control_web.today') }}</span>
                            <span v-else>{{ Appendzero(day.day) }}</span>
                        </div>
                        <!-- 策略编辑删除按钮 -->
                        <div
                            v-show="!isNotCurrentMonth(day) && (dayjs(day.date) > dayjs(new Date()) || isToday(day)) && day.list.length && baseStore().hasAuth(PERMISSION)"
                            class="title-icon fc"
                        >
                            <IconMeriActionEditor style="margin-top: -3px" :disabled="exceed.wholeIsDisabled" @click="editFixedTimeStrategy(day.list[0])" />
                            <div class="line"></div>
                            <div>
                                <m-tips
                                    v-if="exceed.halfIsDisabled"
                                    width="280px"
                                    :content="i18n.global.t('meos_control_web.past_schedule_cannot_delete_edit_future_config')"
                                    theme="darkTransparent"
                                >
                                    <IconMeriActionDelete style="cursor: not-allowed" color="#8B949E" />
                                </m-tips>
                                <m-tips
                                    v-else-if="exceed.wholeIsDisabled"
                                    width="280px"
                                    :content="i18n.global.t('meos_control_web.strategy_times_past_cannot_delete')"
                                    theme="darkTransparent"
                                >
                                    <IconMeriActionDelete style="cursor: not-allowed" color="#8B949E" />
                                </m-tips>
                                <IconMeriActionDelete v-else @click="deleteIcons(day.list[0])" />
                            </div>
                        </div>
                    </div>
                    <div v-if="!isNotCurrentMonth(day)" class="content flc">
                        <div v-if="day.list.length == 0" class="no-data">{{ i18n.global.t('common.no_data') }}</div>
                        <template v-else>
                            <div
                                v-for="(c, i) in screenWidth >= 1920 ? day.list[0].content.slice(0, 3) : day.list[0].content.slice(0, 2)"
                                :key="i + 'l'"
                                v-ellipsis
                                class="strategy m-ellipsis"
                            >
                                <span class="round" :style="{ background: c.runStatus == 'OPEN' ? '#246fe5' : '#8B949E' }"></span>
                                <span>{{ c.strategyTime.slice(0, 5) }}</span>
                                &nbsp;<span class="line"></span>&nbsp;
                                <template v-if="c.runStatus == 'OPEN'">
                                    <span v-if="route.query.isSizingMachine === '0'">{{ c.chillerLNum }}{{ i18n.global.t('common.tai') }}</span>
                                    <span v-else>{{
                                        i18n.global.t('common.large_small', {
                                            big: c.chillerLNum,
                                            sm: c.chillerSNum
                                        })
                                    }}</span>
                                </template>
                                <span v-if="c.runStatus == 'CLOSE'">{{ i18n.global.t('common.status_close') }}</span>
                                &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                <span v-if="c.runStatus == 'OPEN'"
                                    >{{ i18n.global.t('common.outlet_water_temp') }}
                                    {{ c.chillWaterOutTempSet + '' ? Math.floor(c.chillWaterOutTempSet * 10) / 10 : '--' }}
                                    °C</span
                                >
                                &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                <span v-if="c.runStatus == 'OPEN'"
                                    >{{ i18n.global.t('meos_control_web.continuous_duration') }} {{ c.sustainTime + '' ? Math.floor(c.sustainTime * 10) / 10 : '--' }} min</span
                                >
                            </div>
                            <m-popover :show-arrow="false">
                                <template #content>
                                    <div style="overflow: auto">
                                        <m-scrollbar content-max-height="302px">
                                            <div v-for="(c, i) in day.list[0].content" :key="i" class="strategy fc">
                                                <span
                                                    class="round"
                                                    :style="{
                                                        background: c.runStatus == 'OPEN' ? '#246fe5' : '#8B949E'
                                                    }"
                                                ></span>
                                                <span>{{ c.strategyTime.slice(0, 5) }}</span>
                                                &nbsp;<span class="line"></span>&nbsp;
                                                <template v-if="c.runStatus == 'OPEN'">
                                                    <span v-if="route.query.isSizingMachine === '0'">{{ c.chillerLNum }}{{ i18n.global.t('common.tai') }}</span>
                                                    <span v-else>{{
                                                        i18n.global.t('common.large_small', {
                                                            big: c.chillerLNum,
                                                            sm: c.chillerSNum
                                                        })
                                                    }}</span>
                                                </template>
                                                <span v-if="c.runStatus == 'CLOSE'">{{ i18n.global.t('common.status_close') }}</span>
                                                &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                                <span v-if="c.runStatus == 'OPEN'"
                                                    >{{ i18n.global.t('common.outlet_water_temp') }}
                                                    {{ c.chillWaterOutTempSet + '' ? Math.floor(c.chillWaterOutTempSet * 10) / 10 : '--' }}
                                                    °C</span
                                                >
                                                &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                                <span v-if="c.runStatus == 'OPEN'"
                                                    >{{ i18n.global.t('meos_control_web.continuous_duration') }}
                                                    {{ c.sustainTime + '' ? Math.floor(c.sustainTime * 10) / 10 : '--' }}
                                                    min</span
                                                >
                                            </div>
                                        </m-scrollbar>
                                    </div>
                                </template>
                                <IconMeriActionMore v-if="(screenWidth >= 1920 && day.list[0].content.length > 3) || (screenWidth < 1920 && day.list[0].content.length > 2)"
                            /></m-popover>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 编辑策略弹框 -->
    <CreateEditStrategy v-if="showStrategyModal" :query-params="editParams" @close="showStrategyModal = false" />
    <!-- 删除策略弹框 -->
    <m-modal
        v-model:visible="strategyState"
        :append-to="$modalAppendTo"
        type="error"
        :title="i18n.global.t('meos_control_web.confirm_delete')"
        :content="i18n.global.t('meos_control_web.delete_future_strategy_stopped')"
        @close="close"
    >
        <template #footer>
            <m-button type="default" size="medium" @click="strategyState = false">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="danger" size="medium" @click="deleteStrategy">{{ i18n.global.t('common.delete') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
/*eslint-disable eqeqeq*/
import { useRoute } from '@/hooks/setupHelper';
import { ref, unref, computed, onMounted, onBeforeUnmount } from 'vue';
import { IconMeriActionEditor, IconMeriActionDelete, IconMeriActionMore } from 'meri-icon';
import { listFixedTimeStrategy, deleteFixedTimeStrategy } from '@/apis/strategic';
import CreateEditStrategy from './CreateEditStrategy.vue';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { $Message } from 'meri-plus';
import i18n from '@/localization';
import { GET_MENU_CONFIG, getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsSame } from '@/utils/dayjsTools';
import baseStore from '@/store/baseStore';
const PERMISSION = window[GET_MENU_CONFIG]?.()?.PERMISSION;
const params = inject('params');
const emits = defineEmits(['getListFixedStrategyDateByMonth']);

const route = useRoute();
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
const selectedDate = ref(currentDate.value);
const daysOfWeek = computed(() => {
    return weekdays;
});
let tableData = ref([]);
const exceed = reactive({
    halfIsDisabled: false, //部分禁用
    wholeIsDisabled: false // 全部禁用
});
// 新建编辑策略弹框
// eslint-disable-next-line one-var
let showStrategyModal = ref(false);

const strategyState = ref(false); // 删除策略弹框
const deleteParams = ref([]);

// 编辑策略传过去的参数
const editParams = reactive(
    Object.assign(
        {
            name: 'edit',
            data: deleteParams
        },
        route.query
    )
);

emitter.off('refreshMain');

// 新建成功之后调用
emitter.on('refreshMain', () => {
    getListFixedTimeStrategy();
});

emitter.on('changeMonth', type => {
    // eslint-disable-next-line eqeqeq
    if (type == 'left') {
        prevMonth();
    } else if (type == 'right') {
        nextMonth();
    } else {
        clickMonth();
    }
});

const close = () => {};

// 默认展示的天
const days = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInLastMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

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
            days.push({ date, day, isLastMonth: false, isNextMonth: false, month: true, list: [] });
            day++;
        }
    }
    days.forEach(days => {
        if (days.month) {
            if (tableData.value.length) {
                tableData.value.forEach(item => {
                    if (dayjs(item.dateTime).format('YYYY-MM-DD') == dayjs(days.date).format('YYYY-MM-DD')) {
                        days.list.push({
                            content: item.content,
                            dateTime: item.dateTime,
                            dayOfWeek: item.dayOfWeek,
                            objectId: item.objectId,
                            objectLocalName: item.objectLocalName
                        });
                    }
                });
            }
        }
    });
    return days;
});

// 当前月
const title = computed(
    () =>
        `${currentDate.value.toLocaleString('default', {
            month: 'short'
        })}`
);

// 选择下拉的月份
const clickMonth = () => {
    currentDate.value = new Date(new Date(params.value.month).getFullYear(), new Date(params.value.month).getMonth(), 1);
};

// 上一个月
const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

// 下一个月
const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

// 单位数日+0
const Appendzero = obj => {
    if (obj < 10) return '0' + '' + obj;
    else return obj;
};

// 当天
const isToday = day => {
    return dayjsIsSame(dayjs(day.date), getDayjsTz(), 'day');
};
// 不是本月的月份
const isNotCurrentMonth = day => {
    return day.isLastMonth || day.isNextMonth;
};

// 查询冷站策略列表
const getListFixedTimeStrategy = () => {
    listFixedTimeStrategy({
        systemId: route.query.systemId,
        beginDateTime: dayjs(unref(params).month.replace('.', '-')).startOf('month').format('YYYY-MM-DD 00:00:00'),
        endDateTime: dayjs(unref(params).month.replace('.', '-')).endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    }).then(res => {
        const { code, data, result } = res;
        if (result !== 'success') return;
        if (data && data.length) {
            tableData.value = data;
        } else {
            tableData.value = [];
        }
    });
};

// 删除弹框
const deleteIcons = data => {
    strategyState.value = true;
    deleteParams.value = data;
};

// 删除策略
const deleteStrategy = () => {
    deleteFixedTimeStrategy({
        systemId: route.query.systemId,
        strategyId: deleteParams.value.content[0].strategyId,
        objectId: deleteParams.value.objectId,
        removeDate: dayjs(deleteParams.value.dateTime).format('YYYY-MM-DD')
    }).then(res => {
        if (res.result == 'success') {
            $Message.success({ title: `${i18n.global.t('meos_control_web.delete_success')}` });
            strategyState.value = false;
            getListFixedTimeStrategy();
            emits('getListFixedStrategyDateByMonth');
        }
    });
};

// 编辑策略
const editFixedTimeStrategy = item => {
    showStrategyModal.value = true;
    deleteParams.value = item;
};

// 今日时间表进入
const handleMouseEnter = item => {
    if (!isToday(item)) return;
    if (item.list && item.list.length && item.list[0].content.length) {
        let arr = [];
        arr = item.list[0].content.map(time => {
            return getDayjsTz().add(1, 'minute').format('HH:mm:ss') > time.strategyTime;
        });
        if (arr.includes(true) && arr.includes(false)) {
            console.log('有超出的有未超出的');
            exceed.halfIsDisabled = true;
        } else if (arr.includes(false)) {
            console.log('未超出的');
            exceed.halfIsDisabled = false;
            exceed.wholeIsDisabled = false;
        } else {
            exceed.halfIsDisabled = false;
            exceed.wholeIsDisabled = true;
            console.log('超出的');
        }
    }
};

const handleMouseLeave = () => {
    exceed.halfIsDisabled = false;
    exceed.wholeIsDisabled = false;
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

onMounted(() => {
    window.addEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
    getListFixedTimeStrategy();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});

// index调用
defineExpose({
    getListFixedTimeStrategy
});
</script>

<style scoped lang="less">
header {
    color: #1b2129;
    background: #f1f4f6;

    .day {
        width: 100%;
        border-right: 1px solid #e1e5eb;
    }
    .day-1920 {
        line-height: 40px;
        font-size: 14px;
        padding-left: 9px;
    }
    .day-1366 {
        line-height: 28px;
        font-size: 12px;
        padding-left: 6px;
    }
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
            min-width: 192px;
            height: 100%;
            position: relative;
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
                    color: #00a2a7;
                    background: #cbf7f3;
                }

                &-next-mouth {
                    color: #1b2129;
                    background: #e8ecf0;
                }

                &-date-not-current-month {
                    color: #8b949e;
                }

                .today {
                    color: #fff;
                    font-weight: 700;
                    border-radius: 90px;
                    background: #f55047;
                    font-family: Microsoft YaHei UI;
                    text-align: center;
                }

                &-icon {
                    height: 20px;
                    align-content: center;
                    padding-right: 14px;
                    z-index: -1;
                    cursor: pointer;

                    .line {
                        margin: 0;
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
            }

            .content {
                color: #424c59;
                .no-data {
                    text-align: center;
                    color: #8b949e;
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
        min-height: 128px;
        .title {
            height: 34px;
            &-date {
                height: 18px;
                line-height: 18px;
                font-size: 24px;
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
            padding: 0 8px 0px 20px;
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
        min-height: 88px;

        .title {
            height: 32px;
            &-date {
                height: 16px;
                line-height: 16px;
                font-size: 20px;
            }

            &-month {
                padding: 1px 6px;
                margin-right: 6px;
                font-size: 14px;
                line-height: 22px;
            }

            .today {
                font-size: 12px;
                padding: 0 4px;
                // width: 20px;
                // height: 20px;
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
    .hover-item {
        &:hover {
            cursor: pointer;
            background-color: rgba(235, 246, 255, 0.8);
            color: #246fe5;
        }
    }
    .hover-item-1920 {
        &:hover .title {
            border-top: 4px solid #246fe5;
            padding-top: 8px !important;
        }
    }
    .hover-item-1366 {
        &:hover .title {
            border-top: 3px solid #246fe5;
            //   color: red;
            padding-top: 9px !important;
        }
    }
    .hover-item-today-1920 {
        &:hover .title {
            border-top: 4px solid #246fe5;
            padding-top: 2px !important;
        }
    }
    .hover-item-today-1366 {
        &:hover .title {
            border-top: 3px solid #246fe5;
            padding-top: 3px !important;
        }
    }

    // 不是本月的
    .not-current-month {
        cursor: not-allowed;
        // background: url(../../assets/imgs/bg_line.png) no-repeat;
        // background-color: #00a2a7;
        background-image: url('../../assets/imgs/bg_line.png');
        background-size: cover;
        background-repeat: no-repeat;
    }
}

.calendar-content-1920 {
    height: calc(100vh - 165px);
}
.calendar-content-1366 {
    height: calc(100vh - 130px);
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
