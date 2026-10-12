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
                            <m-tips :content="i18n.global.t('common.edit')" theme="darkTransparent">
                                <IconMeriActionEditor
                                    style="margin-top: -3px"
                                    :size="16"
                                    class="icon-bg"
                                    :disabled="exceed.wholeIsDisabled"
                                    @click="editFixedTimeStrategy(day.list[0])"
                                />
                            </m-tips>
                            <div class="icon-line"></div>
                            <div>
                                <m-tips
                                    v-if="exceed.halfIsDisabled"
                                    width="280px"
                                    :content="i18n.global.t('meos_control_web.past_schedule_cannot_delete_edit_future_config')"
                                    theme="darkTransparent"
                                >
                                    <IconMeriActionDelete :size="16" class="not-allowed-icon icon-bg" color="#8B949E" />
                                </m-tips>
                                <m-tips
                                    v-else-if="exceed.wholeIsDisabled"
                                    width="280px"
                                    :content="i18n.global.t('meos_control_web.strategy_times_past_cannot_delete')"
                                    theme="darkTransparent"
                                >
                                    <IconMeriActionDelete :size="16" class="not-allowed-icon icon-bg" color="#8B949E" />
                                </m-tips>
                                <m-tips v-else :content="i18n.global.t('common.delete')" theme="darkTransparent">
                                    <IconMeriActionDelete :size="16" class="icon-bg" @click="deleteIcons(day.list[0])" />
                                </m-tips>
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
                                <span v-if="c.runStatus == 'OPEN'"
                                    >{{ i18n.global.t('common.outlet_water_temp') }}
                                    {{ c.hotWaterOutTempSet + '' ? (Math.floor(c.hotWaterOutTempSet * 10) / 10).toFixed(1) : '--' }}
                                    °C</span
                                >
                                <span v-if="c.runStatus == 'CLOSE'">{{ i18n.global.t('common.status_close') }}</span>
                                &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                <span v-if="c.runStatus == 'OPEN' && c.hotWaterDetaSet"
                                    >{{
                                        c.hotWaterDetaSetType === 'heatSecondarySideWaterDetaTempSet'
                                            ? i18n.global.t('common.supply_return_temp_diff')
                                            : i18n.global.t('meos_control_web.supply_return_press_diff')
                                    }}{{ c.hotWaterDetaSet + '' ? (Math.floor(c.hotWaterDetaSet * 10) / 10).toFixed(1) : '--'
                                    }}{{ c.hotWaterDetaSetType === 'heatSecondarySideWaterDetaTempSet' ? '℃' : 'kPa' }}
                                </span>
                                &nbsp;<span v-if="c.runStatus == 'OPEN' && c.hotWaterDetaSet" class="line"></span>&nbsp;
                                <span v-if="c.runStatus == 'OPEN'"
                                    >{{ i18n.global.t('meos_control_web.continuous_duration') }}
                                    {{ c.sustainTime + '' ? (Math.floor(c.sustainTime * 10) / 10).toFixed(1) : '--' }} min</span
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
                                                <span v-if="c.runStatus == 'OPEN'"
                                                    >{{ i18n.global.t('common.outlet_water_temp') }}
                                                    {{ c.hotWaterOutTempSet + '' ? (Math.floor(c.hotWaterOutTempSet * 10) / 10).toFixed(1) : '--' }}
                                                    °C</span
                                                >
                                                <span v-if="c.runStatus == 'CLOSE'">{{ i18n.global.t('common.status_close') }}</span>
                                                &nbsp;<span v-if="c.runStatus == 'OPEN'" class="line"></span>&nbsp;
                                                <span v-if="c.runStatus == 'OPEN' && c.hotWaterDetaSet"
                                                    >{{
                                                        c.hotWaterDetaSetType === 'heatSecondarySideWaterDetaTempSet'
                                                            ? i18n.global.t('common.supply_return_temp_diff')
                                                            : i18n.global.t('meos_control_web.supply_return_press_diff')
                                                    }}{{ c.hotWaterDetaSet + '' ? (Math.floor(c.hotWaterDetaSet * 10) / 10).toFixed(1) : '--'
                                                    }}{{ c.hotWaterDetaSetType === 'heatSecondarySideWaterDetaTempSet' ? '℃' : 'kPa' }}
                                                </span>
                                                &nbsp;<span v-if="c.runStatus == 'OPEN' && c.hotWaterDetaSet" class="line"></span>&nbsp;
                                                <span v-if="c.runStatus == 'OPEN'"
                                                    >{{ i18n.global.t('meos_control_web.continuous_duration') }}
                                                    {{ c.sustainTime + '' ? (Math.floor(c.sustainTime * 10) / 10).toFixed(1) : '--' }}
                                                    min</span
                                                >
                                            </div>
                                        </m-scrollbar>
                                    </div>
                                </template>
                                <IconMeriActionMore v-if="(screenWidth >= 1920 && day.list[0]?.content.length > 3) || (screenWidth < 1920 && day.list[0]?.content.length > 2)"
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
    >
        <template #footer>
            <m-button type="default" size="medium" @click="strategyState = false">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="danger" size="medium" @click="deleteStrategy">{{ i18n.global.t('common.delete') }}</m-button>
        </template>
    </m-modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import CreateEditStrategy from './CreateEditStrategy.vue';
import UseHeatMainStrategy from './hooks/useHeatMainStrategy';
import { IconMeriActionEditor, IconMeriActionDelete, IconMeriActionMore } from 'meri-icon';
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
const PERMISSION = (window as any)[GET_MENU_CONFIG]?.().PERMISSION;

const props = defineProps({
    screenWidth: {
        type: Number,
        default: document.documentElement.clientWidth
    }
});
const emits = defineEmits(['getListFixedStrategyDateByMonth']);
const {
    days,
    title,
    exceed,
    editParams,
    daysOfWeek,
    currentDate,
    strategyState,
    showStrategyModal,
    Appendzero,
    isToday,
    isNotCurrentMonth,
    deleteIcons,
    deleteStrategy,
    editFixedTimeStrategy,
    handleMouseEnter,
    handleMouseLeave,
    getListFixedTimeStrategy
} = UseHeatMainStrategy(emits);
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
                        /* margin: 0;
                        width: 1px;
                        height: 12px;
                        background: #c4c9cf; */
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
                        /* display: inline-block;
                        width: 1px;
                        height: 12px;
                        background: #8b949e; */
                        position: relative;
                        &::before {
                            content: '';
                            position: absolute;
                            width: 1px;
                            height: 12px;
                            background: #8b949e;
                            top: 2px;
                            left: 0;
                        }
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
                padding: 0 4px;
                // width: 24px;
                // height: 24px;
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
                    /* display: inline-block;
                    width: 1px;
                    height: 12px;
                    background: #8b949e; */
                    position: relative;
                    &::before {
                        content: '';
                        position: absolute;
                        width: 1px;
                        height: 12px;
                        background: #8b949e;
                        top: 2px;
                        left: 0;
                    }
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
                    position: relative;
                    &::before {
                        content: '';
                        position: absolute;
                        width: 1px;
                        height: 12px;
                        background: #8b949e;
                        top: 2px;
                        left: 0;
                    }
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
        /* display: inline-block;
        margin: 0;
        width: 1px;
        height: 12px;
        background: #8b949e; */
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
.not-allowed-icon {
    cursor: not-allowed;
}
.icon-bg {
    padding: 2px;
    border-radius: 2px;
}
.icon-line {
    border: 1px solid #c4c9cf;
    height: 12px;
    margin: -2px 6px 0 6px;
}
</style>
