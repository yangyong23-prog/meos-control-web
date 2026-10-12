<!--
 * @Author: guoxiaohuan
 * @Date: 2023-09-18 19:52:08
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-09-26 16:41:23
 * @Description:
-->
<template>
    <div class="header-filter fcb">
        <div class="header-filter-left fc">
            <div class="back-box" @click.stop="goBack">
                <img class="back" src="@/assets/imgs/up.png" />
                <span class="back-text">{{ i18n.global.t('meos_control_web.back') }}</span>
            </div>
            <span class="line" :class="{ 'line-1920': screenWidth >= 1920, 'line-1366': screenWidth < 1920 }"></span>
            <div class="schedule" :class="{ 'schedule-1920': screenWidth >= 1920, 'schedule-1366': screenWidth < 1920 }">
                {{ i18n.global.t('meos_control_web.domestic_hot_water_schedule') }}
            </div>
            <span v-ellipsis class="system m-ellipsis" style="max-width: 300px">{{ currentSystem.localName }}</span>
            <m-tabs v-model="tabsType" :data="items" type="segment" size="small"></m-tabs>

            <template v-if="tabsType === 'weeks'">
                <m-date-picker
                    ref="range22"
                    v-model="weeksDate"
                    type="daterange"
                    class="ml8"
                    :scope="`${getDayjsTz().subtract(1, 'year').startOf('year')} - ${getDayjsTz().add(1, 'year').endOf('year')}`"
                    :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                    :clearable="false"
                    @change="handleChange"
                    @rang-selected="handleRangSelected"
                ></m-date-picker>
            </template>
            <template v-else>
                <m-date-picker
                    v-model="monthDate"
                    :scope="`${getDayjsTz().subtract(1, 'year').startOf('year')} - ${getDayjsTz().add(1, 'year').endOf('year')}`"
                    type="month"
                    :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                    :clearable="false"
                    class="ml8"
                    @change="handleMonthChange('month')"
                ></m-date-picker>
            </template>

            <m-popover :show-arrow="false" theme="darkTransparent" placement="right-start">
                <template #content>
                    <div>{{ i18n.global.t('meos_control_web.schedule_or_auto_run') }}</div>
                </template>
                <svg aria-hidden="true" class="row-tips-icon ml8">
                    <use :xlink:href="'#icon-info-small'" />
                </svg>
            </m-popover>
        </div>
        <div class="header-filter-right">
            <slot name="append" :params="params" :list="list"></slot>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { tabsTypeKey, weeksDateKey, monthDateKey } from '../../../hooks/useTimetableHook';
const tabsType = inject(tabsTypeKey);
const weeksDate = inject(weeksDateKey);
const monthDate = inject(monthDateKey);
const items = ref([
    {
        id: 'weeks',
        name: i18n.global.t('common.week')
    },
    {
        id: 'month',
        name: `${i18n.global.t('common.monthUnit')}`
    }
]);
const props = defineProps({
    currentSystem: {
        type: Object,
        default: () => {}
    },
    // 当前控制台类型
    curConsoleType: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['goBack', 'changeParams', 'changeTabs', 'changeWeeksParams']);
const screenWidth = ref(document.documentElement.clientWidth);
const range22 = ref(null);
const handleChange = value => {
    emit('changeWeeksParams');
};
const handleMonthChange = key => {
    emit('changeParams');
};
const handleRangSelected = ({ startTime, endTime }) => {
    const targetDate = getDayjsTz().add(1, 'year').endOf('year');
    const diff = targetDate.diff(dayjs(startTime, 'YYYY-MM-DD'), 'day');
    if (startTime && !endTime) {
        if (diff >= 6) {
            // eslint-disable-next-line no-param-reassign
            endTime = dayjs(startTime).add(6, 'day').format('YYYY.MM.DD');
            range22.value.handleSetRangeSelected({ startTime, endTime });
        } else {
            // eslint-disable-next-line no-param-reassign
            endTime = dayjs(startTime).subtract(6, 'day').format('YYYY.MM.DD');
            range22.value.handleSetRangeSelected({ startTime, endTime });
        }
    }
};

const goBack = () => {
    emit('goBack');
};
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
</script>
<style scoped lang="less">
.header-filter {
    padding: 0 16px;
    position: relative;
    &-left {
        font-family: Microsoft YaHei UI;
        color: #1b2129;
        .back-box {
            //border: 1px solid red;
            display: flex;
            align-items: center;
            padding: 5px 8px 5px 4px;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background: rgba(196, 201, 207, 0.3);
            }
        }
        :deep(.m-popper-trigger) {
            display: flex;
        }
        .row-tips-icon {
            width: 18px;
            height: 18px;
            color: @grey-500;
        }
        .back {
            cursor: pointer;
            width: 20px;
            height: 20px;
        }
        .back-1920 {
            width: 20px;
            height: 20px;
        }
        .back-1366 {
            width: 14px;
            height: 14px;
        }
        .back-text {
            text-align: center;
            cursor: pointer;
        }
        .back-text-1920 {
            font-size: 16px;
            line-height: 24px;
            // margin: 0 8px 0 2px;
        }
        .back-text-1366 {
            font-size: 12px;
            line-height: 18px;
            margin: 0 6px 0 1px;
        }
        .line {
            width: 1px;
            background: #c4c9cf;
        }
        .line-1920 {
            height: 20px;
            margin: 0 8px;
        }
        .line-1366 {
            height: 14px;
            margin: 0 5px;
        }
        .schedule {
            color: #32383e;
            font-weight: 700;
        }
        .schedule-1920 {
            font-size: 20px;
            line-height: 28px;
        }
        .schedule-1366 {
            font-size: 16px;
            line-height: 20px;
        }
        .system {
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            padding: 1px 8px;
            border-radius: 4px;
            background: #e8ecf0;
            margin: 0 8px;
        }
        .daterange-box {
            position: relative;
            cursor: pointer;
            .svg-left {
                z-index: 1;
                position: absolute;
                top: 5px;
                left: 0;
            }
            .svg-right {
                z-index: 1;
                position: absolute;
                top: 5px;
                right: 0;
            }
        }
        .month {
            :deep(.m-date-picker__result) {
                padding-left: 70px;
            }
        }
    }
    &-left-item {
        :deep(.m-date-picker__result) {
            padding-left: 30px;
            .date-icon {
                display: none;
            }
            span {
                color: var(--gray-500);
            }
            .m-date-picker__result_text {
                color: var(--gray-900);
            }
        }
    }
    .downLoad {
        margin-left: 12px;
    }
    .linear-svg {
        margin: 0 8px 0 12px;
    }
    .linear {
        color: var(--grey-grey-500, #8b949e);
        font-size: 12px;
        line-height: 20px;
    }
}
</style>
