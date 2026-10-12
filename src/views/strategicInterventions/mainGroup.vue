<template>
    <div class="week" :style="{ width: '100%' }">
        <div v-for="item in daysList" :key="item.time" class="week-day" :class="[screenWidth >= 1920 && 'week-day-1920', screenWidth < 1920 && 'week-day-1366']">
            <div class="item-header" :class="{ 'item-header-1920': screenWidth >= 1920, 'item-header-1366': screenWidth < 1920 }">
                <div class="item-header-week">{{ weekday(item.time).text }}</div>
                <div
                    class="item-header-day fcb"
                    :style="{
                        marginTop: screenWidth >= 1920 ? (weekday(item.time).isToday ? '14px' : '16px') : weekday(item.time).isToday ? '4px' : '10px'
                    }"
                >
                    <div class="day-time">{{ weekday(item.time).day }}</div>
                    <div v-if="weekday(item.time).isToday" class="day-today fcc">{{ i18n.global.t('meos_control_web.today') }}</div>
                </div>
            </div>
            <div class="item-container">
                <div class="item-container-box">
                    <m-scrollbar>
                        <template v-if="item.list.length">
                            <div
                                v-for="(data, i) in item.list"
                                :key="i"
                                class="item-main"
                                :class="{ 'item-main-1920': screenWidth >= 1920, 'item-main-1366': screenWidth < 1920 }"
                                @mouseenter="handleMouseEnter(item, data)"
                                @mouseleave="handleMouseLeave"
                            >
                                <div class="item-main-box">
                                    <div class="title fb">
                                        <span class="title-span" :title="data.objectLocalName">
                                            {{ data.objectLocalName || '--' }}
                                        </span>
                                        <div v-if="dayjs(weekday(item.time).day).format('MM.DD') >= getDayjsTz().format('MM.DD')" class="title-icon fc">
                                            <IconMeriActionEditor @click="editFixedTimeStrategy(data)" />
                                            <div class="line"></div>
                                            <m-tips
                                                v-if="exceed.halfIsDisabled"
                                                width="280px"
                                                :content="i18n.global.t('meos_control_web.only_delete_strategy_after_1_hour_go_to_modify_page_to_delete_specific_time')"
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
                                            <IconMeriActionDelete v-else @click="deleteIcons(data)" />
                                        </div>
                                    </div>
                                    <div v-for="(str, strIndex) in data.strategy.slice(0, 3)" :key="strIndex" class="strategy fc">
                                        <span
                                            class="round"
                                            :style="{
                                                background: str.runStatus == 'OPEN' ? '#246fe5' : '#8B949E'
                                            }"
                                        ></span>
                                        <span>{{ dayjs(str.strategyTime).format('HH:mm') }}</span>
                                        <span class="line"></span>
                                        <span>{{ str.runStatus == 'OPEN' ? i18n.global.t('common.operation') : i18n.global.t('common.status_close') }}</span>
                                    </div>
                                    <m-popover v-if="data.strategy.length > 3" :show-arrow="false">
                                        <template #content>
                                            <div style="overflow: auto">
                                                <m-scrollbar content-max-height="302px">
                                                    <div v-for="(str, strIndex1) in data.strategy" :key="strIndex1" class="strategy fc">
                                                        <span
                                                            class="round"
                                                            :style="{
                                                                background: str.runStatus == 'OPEN' ? '#246fe5' : '#8B949E'
                                                            }"
                                                        ></span>
                                                        <span>{{ dayjs(str.strategyTime).format('HH:mm') }}</span>
                                                        <span class="line"></span>
                                                        <span>{{ str.runStatus == 'OPEN' ? i18n.global.t('common.operation') : i18n.global.t('common.status_close') }}</span>
                                                    </div>
                                                </m-scrollbar>
                                            </div>
                                        </template>
                                        <IconMeriActionMore v-if="data.strategy.length > 3" style="margin-left: 14px"
                                    /></m-popover>
                                </div>
                            </div>
                        </template>

                        <div v-else class="no-data">{{ i18n.global.t('common.no_data') }}</div>
                    </m-scrollbar>
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

<script lang="ts" setup>
import { useRoute } from '@/hooks/setupHelper';
import { enumerateDaysBetweenDates } from '@/utils/tools';
import { Ref, pushScopeId, unref } from 'vue';
import isToday from 'dayjs/plugin/isToday';
import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';
import { weekDayToChinese } from './type';
import emitter from '@/utils/bus';
import { $Message } from 'meri-plus';
import { IconMeriActionEditor, IconMeriActionDelete, IconMeriActionMore } from 'meri-icon';
import { lastFreezePumpGroupListFixedTimeStrategy, delFixedTimeStrategy } from '@/apis/strategic';
import CreateEditStrategy from './CreateEditStrategy.vue';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';

const route = useRoute();
const emits = defineEmits(['getListFixedStrategyDateByMonth']);

dayjs.extend(isToday);
dayjs.extend(isoWeek);

emitter.on('refresh', () => {
    getLastFreezePumpGroupListFixedTimeStrategy();
});
const deleteParams = ref([] as any);

const params: Ref<Record<string, any>> = inject('params')!;
const daysList = ref<Record<string, any>[]>([]);
const daysListFun = () => {
    const start = params.value.daterange.split('-')[0];
    const end = params.value.daterange.split('-')[1];
    return enumerateDaysBetweenDates(start, end).map(item => {
        const obj = {
            time: item,
            list: []
        };
        return obj;
    });
};
// 新建编辑策略弹框
let showStrategyModal = ref<boolean>(false);
const exceed = reactive({
    halfIsDisabled: false, //部分禁用
    wholeIsDisabled: false // 全部禁用
});
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
onMounted(() => {
    daysList.value = daysListFun();
    getLastFreezePumpGroupListFixedTimeStrategy();
});
/**
 * @description: 翻译日期对于的星期几
 * @param {*} day
 * @return {*}
 */
const weekday = (day: string) => {
    const dayText = dayjs(day).format('M.DD');
    const obj = {
        day: dayText,
        isToday: dayjs(day).isToday(),
        text: weekDayToChinese[dayjs(day).isoWeekday() * 1],
        isoWeekday: dayjs(day).isoWeekday() * 1
    };
    return obj;
};

const deleteIcons = (data: any) => {
    strategyState.value = true;
    deleteParams.value = data;
};

const deleteStrategy = () => {
    delFixedTimeStrategy({
        systemId: route.query.systemId,
        strategyId: deleteParams.value.strategy[0].strategyId,
        objectId: deleteParams.value.objectId,
        removeDate: dayjs(deleteParams.value.strategy[0].strategyTime).format('YYYY-MM-DD')
    }).then((res: any) => {
        if (res.result === 'success') {
            $Message.success({ title: `${i18n.global.t('meos_control_web.delete_success')}` });
            strategyState.value = false;
            getLastFreezePumpGroupListFixedTimeStrategy();
            emits('getListFixedStrategyDateByMonth');
        }
    });
};

// 获取策略列表
const getLastFreezePumpGroupListFixedTimeStrategy = () => {
    lastFreezePumpGroupListFixedTimeStrategy({
        systemId: route.query.systemId,
        beginDateTime: dayjs(unref(params).daterange.split('-')[0]).format('YYYY-MM-DD HH:mm:ss'),
        endDateTime: dayjs(unref(params).daterange.split('-')[1]).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    }).then((res: any) => {
        const { code, data, result } = res;
        if (result !== 'success') return;
        daysList.value = daysListFun();
        data &&
            data.length &&
            data.map((item: any) => {
                daysList.value.map((t: any) => {
                    if (dayjs(item.dateTime).format('YYYY-MM-DD HH:mm:ss') === dayjs(t.time).format('YYYY-MM-DD HH:mm:ss')) {
                        t.list.push({
                            strategy: item.content,
                            objectId: item.objectId,
                            objectLocalName: item.objectLocalName
                        });
                    }
                });
            });
    });
};

const strategyState = ref<boolean>(false); // 删除策略弹框

const close = () => {};

// 编辑策略
const editFixedTimeStrategy = (item: any) => {
    showStrategyModal.value = true;
    deleteParams.value = item;
    console.log(daysList, 'item');
};

// 今日时间表进入
const handleMouseEnter = (item: any, data: any) => {
    if (!weekday(item.time).isToday) return;
    if (data.strategy && data.strategy.length) {
        let arr = [] as any;
        arr = data.strategy.map((time: any) => {
            return getDayjsTz().add(1, 'hour').format('HH:mm:ss') > dayjs(time.strategyTime).format('HH:mm:ss');
        });
        if (arr.includes(true) && arr.includes(false)) {
            exceed.halfIsDisabled = true;
        } else if (arr.includes(false)) {
            exceed.halfIsDisabled = false;
            exceed.wholeIsDisabled = false;
        } else {
            exceed.halfIsDisabled = false;
            exceed.wholeIsDisabled = true;
        }
    }
};

const handleMouseLeave = () => {
    exceed.halfIsDisabled = false;
    exceed.wholeIsDisabled = false;
};
const screenWidth = ref(document.documentElement.clientWidth) as any;

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
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});

// index调用
defineExpose({
    getLastFreezePumpGroupListFixedTimeStrategy
});
</script>

<style lang="less" scoped>
.week {
    width: 100%;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    .week-day {
        border-right: 1px solid #e1e5eb;
        overflow: hidden;
        & + .week-day {
            &:nth-of-type(7) {
                border-radius: 0 8px 8px 0;
            }
        }
        .item-header {
            flex-direction: column;
            background: #f1f4f6;
            &-week {
                color: #1b2129;
                line-height: 22px;
            }
            &-day {
                .day-time {
                    font-style: normal;
                    font-weight: 700;
                }
                .day-today {
                    text-align: center;
                    color: #fff;
                    font-weight: 700;
                    background-color: #f55047;
                    border-radius: 90px;
                }
            }
        }
        .item-header-1920 {
            padding: 10px 16px 19px 19px;
            .item-header-week {
                font-size: 14px;
            }
            .item-header-day {
                .day-time {
                    font-size: 30px;
                    line-height: 22px;
                }
                .day-today {
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                }
            }
        }
        .item-header-1366 {
            padding: 7px 12px 14px 14px;
            .item-header-week {
                font-size: 12px;
            }
            .item-header-day {
                .day-time {
                    font-size: 20px;
                    line-height: 16px;
                }
                .day-today {
                    width: 22px;
                    height: 22px;
                    font-size: 12px;
                }
            }
        }
        .item-container {
            height: calc(100% - 89px);
            width: 100%;
            &-box {
                height: 100%;
                .item-main {
                    min-width: 192px;
                    width: calc(100% - 0px);
                    border-bottom: 1px solid #e8ecf0;
                    .title {
                        // width: calc(100% + 45px);
                        color: #2e3742;
                        font-weight: 700;
                        position: relative;
                        &-span {
                            width: 100%;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        &-icon {
                            position: absolute;
                            right: 0;
                            top: 0;
                            z-index: -1;
                            cursor: pointer;
                            .line {
                                margin: 0 4px;
                                width: 1px;
                                height: 12px;
                                background: #c4c9cf;
                            }
                            svg {
                                padding: 3px;
                                border-radius: 4px;
                                &:hover {
                                    background: rgba(196, 201, 207, 0.3);
                                }
                            }
                        }
                    }
                    &:hover .title {
                        width: calc(100% - 45px);
                    }
                    &:hover .title-icon {
                        z-index: 1;
                        right: -45px;
                    }
                    &:hover {
                        cursor: pointer;
                        border-top: 4px solid #246fe5;
                        background: rgba(235, 246, 255, 0.8);
                    }
                    .strategy {
                        color: #424c59;
                        .line {
                            display: inline-block;
                            margin: 0 4px;
                            width: 1px;
                            height: 12px;
                            background: #8b949e;
                        }
                        .round {
                            display: inline-block;

                            border-radius: 90px;
                            margin-right: 4px;
                        }
                        &:last-of-type {
                            margin-bottom: 0;
                        }
                    }
                }
                .item-main-1920 {
                    height: 164px;
                    padding: 20px 14px 0 20px;
                    .title {
                        font-size: 16px;
                        line-height: 22px;
                        &-span {
                            margin-bottom: 14px;
                        }
                        &-icon {
                            height: 22px;
                        }
                    }
                    &:hover {
                        padding-top: 16px;
                    }
                    .strategy {
                        line-height: 22px;
                        font-size: 14px;
                        height: 22px;
                        margin-bottom: 8px;

                        .round {
                            width: 10px;
                            height: 10px;
                        }
                    }
                }
            }
            .item-main-1366 {
                height: 116px;
                padding: 14px 14px 0 14px;
                .title {
                    font-size: 12px;
                    line-height: 16px;
                    &-span {
                        margin-bottom: 12px;
                    }
                    &-icon {
                        height: 16px;
                        svg {
                            padding: 1px;
                        }
                    }
                }
                &:hover {
                    padding-top: 10px;
                }
                .strategy {
                    line-height: 16px;
                    font-size: 12px;
                    height: 16px;
                    margin-bottom: 5px;

                    .round {
                        width: 7px;
                        height: 7px;
                    }
                }
            }
            .no-data {
                color: #8b949e;
                text-align: center;
                line-height: calc(100vh / 2);
            }
        }
    }
    .week-day-1920 {
        height: calc(100vh - 126px);
    }
    .week-day-1366 {
        height: calc(100vh - 106px);
    }
}

.strategy {
    line-height: 22px;
    font-size: 14px;
    height: 22px;
    color: #424c59;
    margin-bottom: 8px;
    .line {
        display: inline-block;
        margin: 0 4px;
        width: 1px;
        height: 12px;
        background: #8b949e;
    }
    .round {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 90px;
        margin-right: 4px;
    }
    &:last-of-type {
        margin-bottom: 0;
    }
}
</style>
