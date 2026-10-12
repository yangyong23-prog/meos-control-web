<template>
    <div :class="['dayItem', type === 'more' ? 'bd4' : 'bd8']">
        <div v-if="showHeader" class="top-header fcb">
            <div>
                <span class="f16 fb7">{{ formattedDate }}</span>
                <span class="f14 ft ml8">{{ weekDayText }}</span>
            </div>
            <div v-if="isToday(rightToDay)" class="today">{{ i18n.global.t('meos_control_web.today') }}</div>

            <div
                v-if="isNotHolidays(rightToDay)"
                class="holidays-festivals f10 fb7"
                :class="{
                    'title-holidays-festivals': isNotHolidays(rightToDay)
                }"
            >
                <span style="margin-top: -12px">{{ i18n.global.t('meos_control_web.section') }}</span>
            </div>
        </div>
        <template v-if="rightToDay?.list?.length">
            <div class="content" :style="{ height: showHeader ? 'calc(100% - 42px)' : '100%' }">
                <m-scrollbar box-class="day-scrollbar">
                    <dateItem :list="rightToDay" :current-system="currentSystem" @edit-btn="editItem" @del-btn="delBtn" />
                </m-scrollbar>
            </div>
        </template>
        <div v-else class="no-data">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
    </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { rightToDayKey } from '../../hooks/useTimetableHook';
import weekday from 'dayjs/plugin/weekday';
import dateItem from './dateItem.vue';
import i18n from '@/localization';

dayjs.extend(weekday);

const rightToDay = inject(rightToDayKey);
const formattedDate = ref('');
const weekDayText = ref('');

const emit = defineEmits(['editBtn', 'delBtn']);

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        default: ''
    },
    showHeader: {
        type: Boolean,
        default: true
    },
    currentSystem: {
        type: Object,
        default: () => {}
    }
});
const editItem = obj => {
    emit('editBtn', obj);
};
watch(
    () => rightToDay.value,
    () => {
        const weekDayMap = [
            i18n.global.t('common.weekday.day7'),
            i18n.global.t('common.weekday.day1'),
            i18n.global.t('common.weekday.day2'),
            i18n.global.t('common.weekday.day3'),
            i18n.global.t('common.weekday.day4'),
            i18n.global.t('common.weekday.day5'),
            i18n.global.t('common.weekday.day6')
        ];
        formattedDate.value = props.type === 'more' ? dayjs(rightToDay.value.date).format('MM-DD') : dayjs(rightToDay.value.date).format('YYYY-MM-DD');
        weekDayText.value = weekDayMap[dayjs(rightToDay.value.date).weekday()];
    },
    { immediate: true }
);
// 节假日
const isNotHolidays = day => {
    return day.holidayTag;
};
// 当天
const isToday = day => {
    const today = new Date();
    const todayDayjs = dayjs(today);
    const dateFromA = dayjs(day.date);
    const isSameDay = todayDayjs.isSame(dateFromA, 'day');
    return isSameDay;
};
</script>
<style lang="less" scoped>
.m-tag-small + .m-tag-small {
    margin-left: 0 !important;
}
// :deep(.day-scrollbar) {
//     .m-scrollbar__content {
//         min-height: 100% !important;
//         display: flex;
//         flex-direction: column;
//     }
// }
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
.bd4 {
    border-radius: 4px;
}
.bd8 {
    border-radius: 8px;
}
.dayItem {
    background: var(--gray-200, #e8ecf0);

    height: 100%;
    overflow: hidden;
    .top-header {
        line-height: 40px;
        padding: 0 12px;
        border-bottom: 1px solid #e1e5eb;
        position: relative;
        .today {
            color: #fff;
            font-weight: 700;
            border-radius: 90px;
            background: #246fe5;
            text-align: center;
            font-family: Microsoft YaHei UI;
            font-size: 12px;
            // width: 20px;
            // height: 20px;
            padding: 0 4px;
            line-height: 20px;
        }
    }
    .content {
        background: var(--gray-50, #fff);
        // height: calc(100% - 42px);
        .button-display {
            min-width: 65px;
        }
        .air-conditioning-zoning {
            padding: 8px;
            &-title {
                color: #1b2129;
                padding: 0px 8px;
                border-radius: 2px;
                flex: 1;
                background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0) 100%);
            }
            .button-display {
                opacity: 0;
                transition: opacity 0.3s;
            }
        }
        .cooling {
            padding: 8px;
            &-title {
                color: #1b4acc;
                padding: 0px 8px;
                border-radius: 2px;
                flex: 1;
                background: linear-gradient(90deg, rgba(100, 166, 247, 0.12) 0%, rgba(100, 166, 247, 0) 100%);
            }
            .button-display {
                opacity: 0;
                transition: opacity 0.3s;
            }
        }
        .cold-storage {
            padding: 8px;
            border-top: 2px solid #e1e5eb;
            &-title {
                color: #00a2a7;
                padding: 0px 8px;
                border-radius: 2px;
                flex: 1;
                background: linear-gradient(90deg, rgba(0, 162, 167, 0.12) 0%, rgba(0, 162, 167, 0) 100%);
            }
            .button-display {
                opacity: 0;
                transition: opacity 0.3s;
            }
        }
        .air-conditioning-zoning:hover {
            background: var(--gray-50, #f7f9fa);
            .button-display {
                opacity: 1;
            }
        }
        .cooling:hover {
            background: var(--gray-50, #f7f9fa);
            .button-display {
                opacity: 1;
            }
        }
        .cold-storage:hover {
            background: var(--gray-50, #f7f9fa);
            .button-display {
                opacity: 1;
            }
        }
    }
    .title-content {
        position: relative;
        padding-left: 8px;
    }
    .title-content::before {
        content: ''; /* 使用content属性来创建伪元素 */
        position: absolute;
        left: 0; /* 圆圈位于容器的左侧 */
        top: 0.6em; /* 调整圆圈的垂直位置，以使其与基线对齐 */
        width: 4px; /* 圆圈的宽度 */
        height: 4px; /* 圆圈的高度 */
        border-radius: 50%; /* 使得圆角变为圆形 */
        background-color: #8b949e; /* 圆圈的颜色 */
    }
    .no-data {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }
}
</style>
