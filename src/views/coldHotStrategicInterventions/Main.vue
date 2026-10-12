<template>
    <div class="calendar-layout">
        <div class="calendar-main">
            <div class="calendar-header">
                <div v-for="day in daysOfWeek" :key="day" class="day fc">
                    {{ day }}
                </div>
            </div>
            <div class="calendar-content">
                <div
                    v-for="(day, index) in days"
                    :key="index + 'd'"
                    class="day"
                    :class="{
                        'not-current-month': isNotCurrentMonth(day),
                        'hover-item': !isNotCurrentMonth(day),
                        'selected-item': isSelectedDate(day)
                    }"
                    @click="selectDate(day)"
                >
                    <div class="day-container">
                        <div class="day-title fcb">
                            <div>
                                <span v-if="day.day == 1" class="day-title-month">
                                    01
                                    <m-tag size="small" color="var(--gray-500)" bg-color="var(--gray-200)">{{ formatMonthTitle(day) }}</m-tag>
                                </span>
                                <span v-else class="ffCP">{{ Appendzero(day.day) }}</span>
                                <m-tips
                                    v-if="!isNotCurrentMonth(day) && day.seasonName"
                                    :content="i18n.global.t('meos_control_web.sourced_from_work_calendar_modify_there')"
                                    theme="darkTransparent"
                                >
                                    <m-tag
                                        class="day-title-season"
                                        size="small"
                                        color="#626C78"
                                        :bg-color="day.seasonType === 'ACSeason-1' ? '#D9EBFF' : '#FFF0CC'"
                                        style="margin-left: 4px"
                                        >{{ day.seasonName }}
                                    </m-tag>
                                </m-tips>
                            </div>

                            <div v-if="isToday(day)" class="today fcc">{{ i18n.global.t('meos_control_web.today') }}</div>
                        </div>
                        <div v-if="!isNotCurrentMonth(day)" class="day-content">
                            <div v-if="day.list.length == 0" class="no-data fcc">{{ i18n.global.t('common.no_data') }}</div>
                            <template v-else>
                                <div v-for="(c, i) in day.list[0].content.slice(0, 2)" :key="i + 'l'" v-ellipsis class="strategy m-ellipsis">
                                    <span class="round" :style="{ background: c.runStatus == 'OPEN' ? 'var(--blue-500)' : '#8B949E' }"></span>
                                    <span>{{ c.strategyTime.slice(0, 5) }}</span>
                                    &nbsp;<span class="line"></span>&nbsp;
                                    <span v-if="c.runStatus == 'OPEN'">{{ c.chillerLNum }}{{ i18n.global.t('common.tai') }}</span>
                                    <span v-if="c.runStatus == 'CLOSE'">{{ i18n.global.t('common.status_close') }}</span>
                                    &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                    <span v-if="c.runStatus == 'OPEN'"
                                        >{{ i18n.global.t('common.outlet_water_temp') }}
                                        {{ !isNaN(parseFloat(c.chillWaterOutTempSet)) ? parseFloat(c.chillWaterOutTempSet).toFixed(1) : '--' }}°C</span
                                    >
                                    &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                    <span v-if="c.runStatus == 'OPEN'"
                                        >{{ i18n.global.t('meos_control_web.continuous_duration') }}
                                        {{ !isNaN(parseFloat(c.sustainTime)) ? c.sustainTime.toFixed(1) : '--' }}min</span
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
                                                            background: c.runStatus == 'OPEN' ? 'var(--blue-500)' : '#8B949E'
                                                        }"
                                                    ></span>
                                                    <span>{{ c.strategyTime.slice(0, 5) }}</span>
                                                    &nbsp;<span class="line"></span>&nbsp;
                                                    <span v-if="c.runStatus == 'OPEN'">{{ c.chillerLNum }}{{ i18n.global.t('common.tai') }}</span>
                                                    <span v-if="c.runStatus == 'CLOSE'">{{ i18n.global.t('common.status_close') }}</span>
                                                    &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                                    <span v-if="c.runStatus == 'OPEN'"
                                                        >{{ i18n.global.t('common.outlet_water_temp') }}
                                                        {{ !isNaN(parseFloat(c.chillWaterOutTempSet)) ? parseFloat(c.chillWaterOutTempSet).toFixed(1) : '--' }}
                                                        °C</span
                                                    >
                                                    &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                                    <span v-if="c.runStatus == 'OPEN'"
                                                        >{{ i18n.global.t('meos_control_web.continuous_duration') }}
                                                        {{ !isNaN(parseFloat(c.sustainTime)) ? c.sustainTime.toFixed(1) : '--' }}min</span
                                                    >
                                                </div>
                                            </m-scrollbar>
                                        </div>
                                    </template>
                                    <IconMeriActionMore v-if="day.list[0].content.length > 2" />
                                </m-popover>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail-board">
            <div class="detail-header fcb">
                <div class="detail-date fc">
                    <span class="detail-date-text">{{ selectedDateTitle }}</span>
                    <span class="detail-week-text">{{ selectedDateWeek }}</span>
                </div>
                <span v-if="isSelectedToday" class="detail-today-tag">{{ i18n.global.t('meos_control_web.today') }}</span>
            </div>
            <div class="detail-body">
                <div class="detail-mode-bar">
                    <span class="detail-mode-text">{{ selectedModeTitle }}</span>
                    <div v-if="canOperateSelectedDate" class="detail-actions fc">
                        <m-button type="icon" icon="IconMeriActionEditor" size="small" icon-size="16px" @click.stop="editFixedTimeStrategy(selectedStrategy)"></m-button>
                        <m-button type="icon" icon="IconMeriActionDelete" size="small" icon-size="16px" @click.stop="deleteIcons(selectedStrategy)"></m-button>
                    </div>
                </div>
                <div v-if="selectedStrategyItems.length" class="detail-list">
                    <div v-for="group in selectedStrategyGroups" :key="group.strategyTime" class="detail-time-group">
                        <div class="detail-time">{{ group.strategyTime }}</div>
                        <div v-for="(item, itemIndex) in group.items" :key="`${group.strategyTime}-${itemIndex}`" class="detail-item">
                            <span class="detail-dot"></span>
                            <span class="detail-item-text">{{ formatDetailStrategy(item) }}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="detail-empty">{{ i18n.global.t('common.no_data') }}</div>
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
<script lang="ts" setup>
/*eslint-disable one-var*/
/*eslint-disable eqeqeq*/
import { ref, Ref, unref, computed, onMounted, onBeforeUnmount, inject, reactive } from 'vue';
import { IconMeriActionMore } from 'meri-icon';
import { listFixedTimeStrategy, deleteFixedTimeStrategy, querySeasonByTime } from '@/apis/hotColdStationStrategyIntervention';
import CreateEditStrategy from './CreateEditStrategy.vue';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { $Message } from 'meri-plus';
import { useRoute } from '@/hooks/setupHelper';
import useLoading from '@/hooks/useLoading';
import { setModelType } from '@/utils/tools';
import i18n from '@/localization';
import { GET_MENU_CONFIG, getDayjsTz } from '@/utils/globalVariables';
import baseStore from '@/store/baseStore';
const PERMISSION = (window as any)[GET_MENU_CONFIG]?.().PERMISSION;
const params: Ref<Record<string, any>> = inject('params')!;
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
let tableData = ref([] as any);
// 新建编辑策略弹框
let showStrategyModal = ref<boolean>(false);

const strategyState = ref<boolean>(false); // 删除策略弹框
const deleteParams = ref([] as any);

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

// 时间季节对象
// eslint-disable-next-line one-var
let seasonTimeData = ref({} as any);

// 初始化页面 loading
const { openLoading, closeLoading } = useLoading(
    'calendar-layout',
    '#f7f9fa',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);

emitter.off('refreshMain');

// 新建成功之后调用
emitter.on('refreshMain', () => {
    getListFixedTimeStrategy();
});

emitter.on('changeMonth', type => {
    if (type == 'left') {
        prevMonth();
    } else if (type == 'right') {
        nextMonth();
    } else {
        clickMonth();
    }
});

const close = () => {};

const normalizeDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');

const getCurrentMonthToday = () => {
    const today = getDayjsTz();
    const monthDate = dayjs(currentDate.value);
    if (today.year() === monthDate.year() && today.month() === monthDate.month()) {
        return today.toDate();
    }
    return monthDate.startOf('month').toDate();
};

// 默认展示的天
const days = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInLastMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays = [];
    let day = 1,
        lastMonthDay = daysInLastMonth - firstDayOfMonth + 1,
        nextMonthDay = 1;
    for (let i = 0; i < 6 * 7; i++) {
        if (i < firstDayOfMonth) {
            calendarDays.push({
                date: new Date(year, month - 1, lastMonthDay),
                day: lastMonthDay,
                isLastMonth: true,
                isNextMonth: false,
                list: [] as any
            });
            lastMonthDay++;
        } else if (i >= firstDayOfMonth + daysInMonth) {
            calendarDays.push({
                date: new Date(year, month + 1, nextMonthDay),
                day: nextMonthDay,
                isLastMonth: false,
                isNextMonth: true,
                list: [] as any
            });
            nextMonthDay++;
        } else {
            const date = new Date(year, month, day);
            const seasonType = seasonTimeData.value[dayjs(date).format('YYYY-MM-DD')] || '';
            calendarDays.push({
                date,
                day,
                isLastMonth: false,
                isNextMonth: false,
                month: true,
                list: [] as any,
                seasonName:
                    seasonType === 'ACSeason-1'
                        ? i18n.global.t('meos_control_web.cooling_mode')
                        : seasonType === 'ACSeason-2'
                        ? i18n.global.t('meos_control_web.heating_mode')
                        : '',
                seasonType
            });
            day++;
        }
    }
    calendarDays.forEach((calendarDay: any) => {
        if (calendarDay.month) {
            if (tableData.value.length) {
                tableData.value.forEach((item: any) => {
                    if (dayjs(item.dateTime).format('YYYY-MM-DD') == dayjs(calendarDay.date).format('YYYY-MM-DD')) {
                        calendarDay.list.push({
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
    return calendarDays;
});

// 选择下拉的月份
const clickMonth = () => {
    currentDate.value = new Date(new Date(params.value.month).getFullYear(), new Date(params.value.month).getMonth(), 1);
    selectedDate.value = getCurrentMonthToday();
};

// 上一个月
const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
    selectedDate.value = getCurrentMonthToday();
};

// 下一个月
const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
    selectedDate.value = getCurrentMonthToday();
};

// 单位数日+0
const Appendzero = (obj: any) => {
    if (obj < 10) return '0' + '' + obj;
    else return obj;
};

// 格式化月标题：每月 1 号展示“月份 + 月单位”，跨到下月时按下一月计算
const formatMonthTitle = (day: any) => {
    const month = day.isNextMonth ? (currentDate.value.getMonth() === 11 ? 1 : currentDate.value.getMonth() + 2) : currentDate.value.getMonth() + 1;
    return `${month}${i18n.global.t('common.monthUnit')}`;
};

// 当天
const isToday = (day: any) => {
    const today = new Date();
    return day.date.toDateString() === today.toDateString();
};

// 不是本月的月份
const isNotCurrentMonth = (day: any) => {
    return day.isLastMonth || day.isNextMonth;
};

const isSelectedDate = (day: any) => {
    return !isNotCurrentMonth(day) && normalizeDate(day.date) === normalizeDate(selectedDate.value);
};

const selectDate = (day: any) => {
    if (isNotCurrentMonth(day)) return;
    selectedDate.value = day.date;
};

const selectedDay = computed(() => {
    const matchedDay = days.value.find((day: any) => day.month && normalizeDate(day.date) === normalizeDate(selectedDate.value));
    return matchedDay || days.value.find((day: any) => day.month);
});

const selectedStrategy = computed(() => selectedDay.value?.list?.[0] || null);

const selectedStrategyItems = computed(() => selectedStrategy.value?.content || []);

const formatStrategyTime = (item: any) => {
    return item?.strategyTime ? item.strategyTime.slice(0, 5) : '--';
};

const selectedStrategyGroups = computed(() => {
    return selectedStrategyItems.value.reduce((groups: any[], item: any) => {
        const strategyTime = formatStrategyTime(item);
        const lastGroup = groups[groups.length - 1];
        if (lastGroup?.strategyTime === strategyTime) {
            lastGroup.items.push(item);
        } else {
            groups.push({
                strategyTime,
                items: [item]
            });
        }
        return groups;
    }, []);
});

const selectedDateTitle = computed(() => dayjs(selectedDate.value).format('YYYY.MM.DD'));

const selectedDateWeek = computed(() => weekdays[dayjs(selectedDate.value).day()]);

const isSelectedToday = computed(() => normalizeDate(selectedDate.value) === normalizeDate(new Date()));

const selectedModeTitle = computed(() => selectedDay.value?.seasonName || i18n.global.t('meos_control_web.no_cooling_no_heating'));

const selectedOperateDisabled = computed(() => {
    if (!isSelectedToday.value || !selectedStrategyItems.value.length) return false;
    return selectedStrategyItems.value.every((time: any) => getDayjsTz().format('HH:mm:ss') >= time.strategyTime);
});

const canOperateSelectedDate = computed(() => {
    return selectedStrategy.value && baseStore().hasAuth(PERMISSION) && (dayjs(selectedDate.value) > dayjs(new Date()) || isSelectedToday.value);
});

const formatNumber = (value: any, digit = 1) => {
    return !isNaN(parseFloat(value)) ? parseFloat(value).toFixed(digit) : '--';
};

const formatDetailStrategy = (item: any) => {
    if (item.runStatus == 'CLOSE') {
        return `${i18n.global.t('common.status_close')}`;
    }
    return `${item.chillerLNum ?? '--'}${i18n.global.t('common.tai')} | ${i18n.global.t('common.outlet_water_temp')} ${formatNumber(item.chillWaterOutTempSet)}°C | ${i18n.global.t(
        'meos_control_web.continuous_duration'
    )} ${formatNumber(item.sustainTime)}min`;
};

// 请求 - 查询供冷/暖季
const helpQuerySeasonByTime = async () => {
    const { code, data }: { code: any; data: any } = await querySeasonByTime({
        beginDateTime: dayjs(unref(params).month.replace('.', '-')).startOf('month').format('YYYY-MM-DD'),
        endDateTime: dayjs(unref(params).month.replace('.', '-')).endOf('month').add(1, 'day').format('YYYY-MM-DD')
    });
    seasonTimeData.value = {};

    if (code === '00000') {
        for (const key in data) {
            const keys = key.split('T');
            if (Array.isArray(keys) && keys.length && data[key]) {
                seasonTimeData.value[keys[0]] = data[key];
            }
        }
    }
};

// 查询冷站策略列表
const getListFixedTimeStrategy = async (showLoading = true) => {
    try {
        if (showLoading) openLoading();
        const res: any = await listFixedTimeStrategy({
            systemType: 'ACCI',
            systemId: route.query.systemId,
            beginDateTime: dayjs(unref(params).month.replace('.', '-')).startOf('month').format('YYYY-MM-DD 00:00:00'),
            endDateTime: dayjs(unref(params).month.replace('.', '-')).endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        });
        const { data, result } = res;
        if (result !== 'success') return;
        if (data && data.length) {
            tableData.value = data;
        } else {
            tableData.value = [];
        }
    } catch (e) {
        console.log(e);
    } finally {
        if (showLoading) closeLoading();
    }
};

// 删除弹框
const deleteIcons = (data: any) => {
    if (selectedOperateDisabled.value) {
        $Message.error({ title: i18n.global.t('meos_control_web.strategy_time_past_cannot_delete') });
        return;
    }
    strategyState.value = true;
    deleteParams.value = data;
};

// 删除策略
const deleteStrategy = () => {
    setModelType((route.query.systemId as string) || '');
    deleteFixedTimeStrategy({
        systemType: 'ACCI',
        systemId: route.query.systemId,
        strategyId: deleteParams.value.content[0].strategyId,
        objectId: deleteParams.value.objectId,
        removeDate: dayjs(deleteParams.value.dateTime).format('YYYY-MM-DD')
    }).then((res: any) => {
        if (res.result == 'success') {
            $Message.success({ title: `${i18n.global.t('meos_control_web.delete_success')}` });
            strategyState.value = false;
            getListFixedTimeStrategy();
        }
    });
};

// 编辑策略
const editFixedTimeStrategy = (item: any) => {
    showStrategyModal.value = true;
    deleteParams.value = item;
};

const getCalendarData = async () => {
    openLoading();
    try {
        await helpQuerySeasonByTime();
    } catch (e) {
        console.log(e);
    } finally {
        await getListFixedTimeStrategy(false);
        closeLoading();
    }
};

onMounted(() => {
    getCalendarData();
});

onBeforeUnmount(() => {});

// index调用
defineExpose({
    getListFixedTimeStrategy,
    helpQuerySeasonByTime,
    getCalendarData
});
</script>
<style scoped lang="less">
.calendar-layout {
    display: flex;
    gap: 8px;
    height: 100%;
    .calendar-main {
        height: 100%;
        width: calc(100% - 480px);
        .calendar-header {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background-color: var(--gray-200);
            height: 40px;
            border-top-right-radius: 8px;
            border-top-left-radius: 8px;
            & > div {
                padding: 8px 12px;
                border-right: 1px solid var(--gray-300);
                &:last-child {
                    border-right: none;
                }
            }
        }
        .calendar-content {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: repeat(6, minmax(0, 1fr));
            height: calc(100% - 40px);
            border-bottom: 1px solid var(--gray-300);
            border-left: 1px solid var(--gray-300);
            border-bottom-right-radius: 8px;
            border-bottom-left-radius: 8px;
            .day {
                border-top: 1px solid var(--gray-300);
                border-right: 1px solid var(--gray-300);
                overflow: hidden;
                transition: background-color 0.2s ease, box-shadow 0.2s ease;
                cursor: pointer;
                min-height: 0;
                &:hover {
                    box-shadow: inset 0 0 0 2px var(--blue-500);
                }
                &-title {
                    height: 28px;
                    margin-bottom: 8px;
                    .today {
                        border-radius: 12px;
                        background-color: var(--blue-500);
                        height: 24px;
                        min-width: 24px;
                        padding: 0 4px;
                        color: #fff;
                        font-size: 12px;
                    }
                }
                &-container {
                    height: 100%;
                    position: relative;
                    padding: 8px;
                    .day-content {
                        color: #424c59;
                        height: calc(100% - 36px);
                        .no-data {
                            height: 100%;
                            color: var(--gray-500);
                        }

                        .strategy {
                            line-height: 22px;
                            font-size: 14px;
                            height: 22px;
                            color: #424c59;
                            margin-bottom: 4px;

                            .line {
                                display: inline-block;
                                margin: 0;
                                width: 1px;
                                height: 12px;
                                background: #8b949e;
                            }

                            .round {
                                display: inline-block;
                                width: 8px;
                                height: 8px;
                                background: var(--blue-500);
                                border-radius: 90px;
                                margin-right: 4px;
                            }

                            &:last-of-type {
                                margin-bottom: 0;
                            }
                        }
                    }
                }
                &.not-current-month {
                    cursor: not-allowed;
                    .day-title {
                        color: var(--gray-400);
                    }
                    &:hover {
                        box-shadow: none;
                    }
                }
            }
            .selected-item {
                position: relative;
                background-color: #f2f7ff;
                box-shadow: inset 0 0 0 2px var(--blue-500);
            }
        }
    }
}

.detail-board {
    width: 480px;
    height: calc(100%);
    overflow: hidden;
    border: 1px solid #e1e5eb;
    border-radius: 8px;
    flex: 0 0 480px;

    .detail-header {
        height: 44px;
        padding: 8px 12px;
        background: #e8ecf0;
        border-bottom: 1px solid #e1e5eb;
    }

    .detail-date {
        gap: 8px;
    }

    .detail-date-text {
        color: #2e3742;
        font-family: Arial;
        font-size: 16px;
        font-weight: 700;
        line-height: 28px;
    }

    .detail-week-text {
        color: #626c78;
        font-family: Microsoft YaHei UI;
        font-size: 14px;
        line-height: 22px;
    }

    .detail-today-tag {
        min-width: 24px;
        height: 24px;
        padding: 0 4px;
        color: #fff;
        background: var(--blue-500);
        border-radius: 100px;
        font-family: Microsoft YaHei UI;
        font-size: 12px;
        line-height: 24px;
        text-align: center;
    }

    .detail-body {
        height: calc(100% - 44px);
        padding: 8px;
        overflow: auto;
        background: var(--gray-50);
    }

    .detail-mode-bar {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        min-height: 36px;
        padding: 4px;
        border-radius: 2px;
        background: linear-gradient(90deg, rgba(166, 166, 166, 0.12) 0%, rgba(165, 165, 165, 0) 100%);
    }

    .detail-mode-text {
        min-width: 0;
        color: #424c59;
        font-family: Microsoft YaHei UI;
        font-size: 14px;
        line-height: 16px;
    }

    .detail-actions {
        gap: 8px;
        color: #1b2129;
        cursor: pointer;
    }

    .detail-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 0 0 4px;
    }

    .detail-time-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .detail-time {
        color: #2e3742;
        font-family: Microsoft YaHei UI;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
    }

    .detail-item {
        display: flex;
        gap: 4px;
        align-items: flex-start;
        color: #626c78;
        font-family: Microsoft YaHei UI;
        font-size: 14px;
        line-height: 22px;
    }

    .detail-dot {
        width: 4px;
        height: 4px;
        margin-top: 10px;
        background: #8b949e;
        border-radius: 50%;
        flex: 0 0 auto;
    }

    .detail-item-text {
        flex: 1;
        min-width: 0;
        word-break: break-all;
    }

    .detail-empty {
        padding-top: 32px;
        color: #8b949e;
        font-family: Microsoft YaHei UI;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
    }
}
</style>
