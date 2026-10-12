<template>
    <div class="si-main">
        <div v-for="(item, index) in daysList" :key="item.time" class="si-main-day">
            <div class="item-header">
                <div class="item-header-week">{{ weekday(item.time).text }}</div>
                <div class="item-header-day fcb">
                    <div class="day-time">{{ weekday(item.time).day }}</div>
                    <div v-if="weekday(item.time).isToday" class="day-today fcc">{{ i18n.global.t('meos_control_web.today') }}</div>
                </div>
            </div>
            <!-- <div class="no-data">暂无策略</div> -->
            <m-scrollbar class="item-main">
                <!-- 冷机策略 -->
                <template v-if="params.tabModel == '1'">
                    <template v-if="item.list.length">
                        <div v-for="(data, i) in item.list" :key="i" class="item-main-list1">
                            <div class="title">
                                {{ i18n.global.t('meos_control_web.temporary_strategy') }}
                                <div class="title-icon">
                                    <IconMeriActionEditor hover-color="#0491FF" size="16" />
                                    <div class="line"></div>
                                    <IconMeriActionDelete hover-color="#0491FF" size="16" @click="strategyState = true" />
                                </div>
                            </div>

                            <div class="item-main">
                                <!-- 临时 -->
                                <div class="item-main-temporary">
                                    <div class="item-main-temporary-data">7.25 09:30-7.26 09:30</div>
                                    <div class="item-main-temporary-time">
                                        <span>21:30</span>
                                        <span>｜</span>
                                        <span>{{ i18n.global.t('common.status_close') }}</span>
                                    </div>
                                    <span class="item-main-temporary-describe">{{ i18n.global.t('meos_control_web.add_unit_cooling_excess') }}</span>
                                </div>
                                <!-- 固定 -->
                                <!-- <div class="item-fixed" v-for="(child, childI) in data.data" style="border:1px solid red">08:30｜3大1小｜出水温度 8°C</div> -->
                            </div>
                        </div>
                    </template>

                    <div v-else class="no-data">{{ i18n.global.t('meos_control_web.no_strategy') }}</div>
                </template>
                <!-- 冷冻泵组策略 -->
                <template v-else>
                    <div v-for="(data, i) in item.list" :key="data.id" class="item-main-list" :class="{ 'is-open': data.open }">
                        <div class="item-main-list-header fcb" @click="openBox(data)">
                            {{ i + 1 }}号冷冻泵组策略
                            <IconMeriComponentArrowRight :class="{ 'is-open': data.open }" />
                        </div>
                        <div v-if="params.tabModel == '1'" class="item-main-list-box" style="border: 1px solid orange">34cvv</div>
                        <transition v-else name="fade">
                            <div v-show="data.open" class="item-main-list-box">
                                <div class="temporary-strategy strategy">
                                    <div class="strategy-header fcb">
                                        <div class="strategy-header-left fc">{{ i18n.global.t('meos_control_web.temporary_strategy') }}</div>
                                        <div class="strategy-header-right fcc">
                                            <IconMeriActionEditor hover-color="#0491FF" />
                                            <div class="line"></div>
                                            <IconMeriActionDelete hover-color="#0491FF" />
                                        </div>
                                    </div>
                                    <div class="strategy-main">
                                        <div v-for="strategy in 3" :key="strategy" class="strategy-main-item">
                                            <div class="strategy-item-header fcb">
                                                <span class="header-text">7.25 11:30-7.26 11:30</span>
                                                <span class="header-status">{{ i18n.global.t('meos_control_web.resolved') }}</span>
                                            </div>
                                            <div class="strategy-item-list">
                                                <div v-for="val in 1" :key="val" class="list-item fc">
                                                    <div class="list-item-bar"></div>
                                                    <div class="list-item-time">08:30</div>
                                                    <div class="list-item-number">3大1小</div>
                                                    <div class="list-item-tem">Tout 8°C</div>
                                                </div>
                                            </div>
                                            <div class="strategy-item-tags">
                                                <m-tag color="#626C78" bg-color="var(--gray-0)" size="medium">{{
                                                    i18n.global.t('meos_control_web.remove_unit_cooling_excess')
                                                }}</m-tag>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fixed-strategy strategy">
                                    <div class="strategy-header fcb">
                                        <div class="strategy-header-left fc">{{ i18n.global.t('meos_control_web.temporary_strategy') }}</div>
                                        <div class="strategy-header-right fcc">
                                            <IconMeriActionEditor hover-color="#0491FF" />
                                            <div class="line"></div>
                                            <IconMeriActionDelete hover-color="#0491FF" />
                                        </div>
                                    </div>
                                    <div class="strategy-main">
                                        <div v-for="strategy in 1" :key="strategy" class="strategy-main-item">
                                            <div class="strategy-item-list">
                                                <div v-for="val in 3" :key="val" class="list-item fc">
                                                    <div class="list-item-bar"></div>
                                                    <div class="list-item-time">08:30</div>
                                                    <template v-if="true">
                                                        <div class="list-item-number">3大1小</div>
                                                        <div class="list-item-tem">Tout 8°C</div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="list-item-status">{{ i18n.global.t('meos_control_web.shutdown') }}</div>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </template>
                <div v-if="index == 1" class="add">{{ i18n.global.t('meos_control_web.add_temporary_policy') }}</div>
            </m-scrollbar>
        </div>
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
                <m-button type="danger" size="medium" @click="strategyState = false">{{ i18n.global.t('common.delete') }}</m-button>
            </template>
        </m-modal>
    </div>
</template>

<script lang="ts" setup>
import { enumerateDaysBetweenDates } from '@/utils/tools';
import { Ref, unref, onMounted, watch, ref, inject } from 'vue';
import isToday from 'dayjs/plugin/isToday';
import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';
import { weekDayToChinese } from './type';
import { IconMeriActionEditor, IconMeriActionDelete, IconMeriComponentArrowRight } from 'meri-icon';
import i18n from '@/localization';

dayjs.extend(isToday);
dayjs.extend(isoWeek);
console.log(unref, '//////');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const params: Ref<Record<string, any>> = inject('params')!;
const daysList = ref<Record<string, any>[]>([]);
const daysListFun = () => {
    const start = params.value.daterange.split('-')[0];
    const end = params.value.daterange.split('-')[1];
    return enumerateDaysBetweenDates(start, end).map(item => {
        console.log('ooio', item);
        const obj = {
            time: item,
            list: [
                { open: true, id: '1', data: [{}, {}, {}] },
                {},
                {},
                {},
                {},
                {},
                {},
                {}
                // { open: false, id: '2' }
            ]
        };
        return obj;
    });
};
console.log('params====', params);
onMounted(() => {
    daysList.value = daysListFun();
    console.log(daysList.value);
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
const openBox = (data: { open: boolean }) => {
    data.open = !data.open;
};
const strategyState = ref<boolean>(false); // 删除策略弹框
console.log(strategyState, '------11111');
console.log(unref(strategyState), 'dwfefrv');

const close = () => {};

watch(
    () => params.value,
    () => {
        console.log('---------', params.value.daterange);
        console.log('&&&&&&&&&', unref(params.value).daterange);
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
    opacity: 1;
    transform: scaleY(1);
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform-origin: center top;
}
.fade-enter-from,
.fade-leave-active {
    opacity: 0;
    transform: scaleY(0);
}

.si-main {
    --border: 1px solid var(--gray-200);
    --temporary-color: #14c4c4;
    --fixed-color: #246fe5;
}
.bar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
}
.si-main {
    overflow: auto;
    // width: 100%;
    height: calc(100% - 88px);
    display: flex;
    margin: 0 14px;
    border-radius: 8px;
    border: 1px solid #e1e5eb;
    background: #fff;
    // border: 1px solid red;
    &-day {
        width: 270px;
        min-width: 270px;
        max-width: 270px;
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        & + .si-main-day {
            border-left: 1px solid #e1e5eb;
            &:nth-of-type(7) {
                border-radius: 0 8px 8px 0;
            }

            // margin-left: 12px;
        }
        .item-header {
            font-size: 16px;
            flex-direction: column;
            padding: 12px 16px 16px 20px;
            &-week {
                font-size: 14px;
                line-height: 22px;
            }
            &-day {
                margin-top: 6px;
                .day-time {
                    font-size: 30px;
                    font-style: normal;
                    font-weight: 700;
                }
                .day-today {
                    .bar;
                    background-color: #f55047;
                }
            }
        }
        .item-main {
            user-select: none;
            position: relative;
            .no-data {
                color: var(--grey-grey-600, #626c78);
                text-align: center;
                font-size: 14px;
            }
            &-list1 {
                margin: 0 4px 0;
                background: rgba(230, 252, 247, 0.9);
                border-top: 4px solid #14c4c4;
                margin-top: 10px;
                .title {
                    color: #1b2129;
                    height: 40px;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 22px;
                    padding: 0 10px 0 12px;
                    border-bottom: 1px solid #cbf7f3;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    &-icon {
                        display: flex;
                        align-items: center;
                        .line {
                            margin: 0 6px;
                            width: 1px;
                            height: 12px;
                            background: #c4c9cf;
                        }
                        svg {
                            cursor: pointer;
                        }
                    }
                }
                .item-main {
                    padding: 10px 12px 12px;
                    font-size: 14px;
                    &-temporary {
                        &-data {
                            color: var(--grey-grey-900, #1b2129);
                            font-family: Microsoft YaHei UI;
                            font-weight: 700;
                            height: 22px;
                            line-height: 22px;
                        }
                        &-time {
                            padding-left: 14px;
                            margin: 4px 0 6px 0;
                            height: 22px;
                            color: var(--grey-grey-800, #2e3742);
                            position: relative;
                            &::before {
                                position: absolute;
                                top: 6px;
                                left: 0;
                                content: '';
                                width: 10px;
                                height: 10px;
                                border-radius: 90px;
                                background: var(--grey-grey-500, #8b949e);
                            }
                            span:nth-of-type(2) {
                                color: var(--grey-grey-500, #8b949e);
                            }
                        }
                        &-describe {
                            padding: 4px 6px;
                            border-radius: 2px;
                            background: var(--grey-grey-0, #fff);
                            color: #626c78;
                            font-family: Microsoft YaHei UI;
                            line-height: 30px;
                        }
                    }
                }
            }
            &-list {
                background: var(--grey-grey-50, #f7f9fa);
                padding: 0 12px 0 12px;
                &.is-open {
                    padding-bottom: 12px;
                }
                & + .item-main-list {
                    margin-top: 12px;
                }
                &-header {
                    height: 50px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    svg {
                        transition: all 0.3s;
                    }
                    .is-open {
                        transform: rotate(90deg);
                    }
                }
            }

            :deep(.m-scrollbar__box) {
                padding: 0 8px 8px 8px;
            }
            .strategy {
                padding: 0 12px 12px 12px;
                &:hover {
                    .strategy-header-right {
                        display: flex;
                    }
                }
            }
            .strategy-header {
                border-bottom: 1px solid #d9ebff;
                &-left {
                    height: 40px;
                    font-size: 14px;
                    font-weight: 700;
                }
                &-right {
                    display: none;
                    svg {
                        cursor: pointer;
                    }
                    .line {
                        height: 12px;
                        width: 1px;
                        background: #c4c9cf;
                        margin: 0 6px;
                    }
                }
            }
            .strategy-main {
                &-item {
                    cursor: default;
                    .strategy-item-header {
                        margin-top: 10px;
                        .header-text {
                            font-weight: 700;
                        }
                        .header-status {
                            color: var(--gray-500);
                        }
                    }
                    .strategy-item-list {
                        margin: 10px 0;
                        .list-item {
                            & + .list-item {
                                margin-top: 10px;
                            }
                            &-bar {
                                width: 8px;
                                height: 8px;
                                flex-shrink: 0;
                                border-radius: 50%;
                            }
                            &-time {
                                color: #8b949e;
                                border-left: none !important;
                                padding-left: 0px !important;
                            }
                            div + div {
                                margin-left: 10px;
                                padding-left: 10px;
                                border-left: 1px solid #c4c9cf;
                            }
                            &-status {
                                color: #8b949e;
                            }
                            &-tem {
                                color: #8b949e;
                            }
                        }
                    }
                }
            }
            .temporary-strategy {
                border: 1px solid #fff;
                border-top: 4px solid var(--temporary-color);
                margin-bottom: 10px;
                min-height: 100px;
                background-color: rgba(230, 252, 247, 0.9);
                &:hover {
                    border: 1px solid var(--temporary-color);
                    border-top: 4px solid var(--temporary-color);
                }
                .list-item-number {
                    color: var(--temporary-color);
                }
                .list-item-bar {
                    background-color: var(--temporary-color);
                }
            }
            .fixed-strategy {
                border: 1px solid #fff;
                border-top: 4px solid var(--fixed-color);
                background-color: rgba(235, 246, 255, 0.9);
                min-height: 100px;
                &:hover {
                    border: 1px solid var(--fixed-color);
                    border-top: 4px solid var(--fixed-color);
                }
                .list-item-number {
                    color: var(--fixed-color);
                }
                .list-item-bar {
                    background-color: var(--fixed-color);
                }
            }
            .add {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 251px;
                height: 44px;
                fill: var(--grey-grey-0, #fff);
                filter: drop-shadow(0px -0.5px 3px rgba(27, 33, 41, 0.05)) drop-shadow(0px -2px 12px rgba(27, 33, 41, 0.06));
            }
        }

        &:nth-of-type(1) {
            border-radius: 8px 0 0 8px;
        }
    }
}
</style>
