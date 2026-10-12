<template>
    <div class="legend-and-timeline">
        <div class="legend">
            <div v-for="item in legendData" :key="item.name" class="legend-item">
                <div class="legend-item-color" :style="{ backgroundColor: item.color }"></div>
                <div class="legend-item-text">{{ item.name }}</div>
            </div>
        </div>
        <div style="height: 54px">
            <div class="time-view">
                <div v-for="item in timeViewList" :key="item.id" class="time-view-item" :style="getStyle(item)" @mouseenter="handleMouseEnter(item)" @mouseleave="handleMouseLeave">
                    <m-popover class="custom-popover" :show-arrow="false" theme="darkTransparent" placement="top">
                        <template #content>
                            <div class="hover-title">{{ i18n.global.t('meos_control_web.disarm_period') }}</div>
                            <div>{{ i18n.global.t('meos_control_web.time_09_22_30') }}</div>
                        </template>
                        <div class="time-view-item-inner"></div>
                    </m-popover>
                </div>
                <div class="cur-time" :style="{ left: `${curTimePosition}` }">
                    <div class="cur-coordinate">
                        <div class="cur-coordinate-inner">{{ i18n.global.t('meos_control_web.current') }}</div>
                    </div>
                </div>
            </div>
            <div class="time-line"></div>
            <div class="time-minutes">
                <span v-for="time in endTime" :key="time" class="time-item">{{ time }}</span>
            </div>
        </div>
        <div class="title">
            {{ i18n.global.t('meos_control_web.current_demand_colon') }}<span class="sub-title">{{ i18n.global.t('meos_control_web.auto_demand') }}(03:00-09:00)</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import dayjs from 'dayjs';
const legendData = inject('legendData');
const endTime = ['00:00', '12:00', '24:00'];
const timeViewList = [
    { id: 1, bgColor: '#E1E5EB', width: 20, borderColor: '#8B949E', shadow: '0px 2px 10px 0px #E5E5E5' },
    { id: 2, bgColor: '#FFB7B4', width: 20, borderColor: '#F55047', shadow: '0px 2px 10px 0px #F8DBDB' },
    { id: 3, bgColor: '#FFB7B4', width: 10, borderColor: '#F55047', shadow: '0px 2px 10px 0px rgba(255, 184, 181, 0.65)' },
    { id: 4, bgColor: '#E1E5EB', width: 50, borderColor: '#8B949E', shadow: '0px 2px 10px 0px #E5E5E5' }
];
let curHover = ref(null);
const getStyle = item => {
    if (curHover.value === item.id) {
        return { backgroundColor: `${item.bgColor}`, width: `${item.width}%`, borderColor: `${item.borderColor}`, boxShadow: `${item.shadow}` };
    }
    return { backgroundColor: `${item.bgColor}`, width: `${item.width}%` };
};
const handleMouseEnter = item => {
    curHover.value = item.id;
};
const handleMouseLeave = () => {
    curHover.value = null;
};
const curTimePosition = computed(() => {
    // 获取当前时间
    const now = getDayjsTz();
    // 获取一天的毫秒数
    const millisecondsInDay = 24 * 60 * 60 * 1000; // 每小时60分钟，每分钟60秒，每秒1000毫秒
    // 计算当前时间在一天中的毫秒数
    const millisecondsSinceStartOfDay =
        now.hour() * 3600000 + // 小时转毫秒
        now.minute() * 60000 + // 分钟转毫秒
        now.second() * 1000 + // 秒转毫秒
        now.millisecond(); // 毫秒数

    // 计算占比
    const percentage = (millisecondsSinceStartOfDay / millisecondsInDay) * 100;
    return `calc(${percentage}% - 14px)`;
});
</script>
<style lang="less" scoped>
.legend-and-timeline {
    .legend {
        margin-top: 12px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        grid-gap: 8px;
        height: 15px;
        &-item {
            display: flex;
            align-items: center;
            grid-gap: 8px;
            &-color {
                width: 14px;
                height: 14px;
            }
            &-text {
                color: #626c78;
                font-size: 12px;
            }
        }
    }
    .time-view {
        display: flex;
        height: 24px;
        position: relative;
        &-item {
            margin-right: 4px;
            &:last-of-type {
                margin: 0;
            }
            &-inner {
                width: 100%;
                height: 100%;
            }
            &:hover {
                border-width: 1px;
                border-style: solid;
            }
        }
        .custom-popover {
            .hover-title {
                color: #fff;
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
                margin-bottom: 8px;
            }
        }
        .cur-time {
            position: absolute;
            bottom: -25px;
            .cur-coordinate {
                height: 16px;
                line-height: 16px;
                width: 28px;
                border-radius: 2px;
                background: #424c59;
                position: relative;
                &::after {
                    content: '';
                    position: absolute;
                    top: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 3px;
                    border-style: solid;
                    border-color: transparent transparent #424c59 transparent;
                }

                .cur-coordinate-inner {
                    height: 100%;
                    width: 100%;
                    position: relative;
                    font-size: 10px;
                    color: #fff;
                    text-align: center;
                    &::before {
                        position: absolute;
                        content: '';
                        top: -33px;
                        left: calc(50% - 0.5px);
                        width: 1px;
                        height: 28px;
                        border-left: 1px dashed #000;
                    }
                }
            }
        }
    }
    .time-line {
        height: 1px;
        margin: 4px 0;
        background: #e8ecf0;
    }
    .time-minutes {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 22px;
        height: 22px;
        .time-item {
            color: #626c78;
            text-align: center;
            font-size: 12px;
        }
    }
    .title {
        color: #2e3742;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        height: 22px;
        margin: 20px 0 12px 0;
        .sub-title {
            font-weight: var(--platform-font-weight);
        }
    }
}
</style>
