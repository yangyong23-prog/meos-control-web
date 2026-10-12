<template>
    <div class="timetable-header fcb">
        <div class="timetable-header-left fc">
            <!-- 返回按钮 -->
            <div v-if="showBackButton" class="back-box" @click.stop="handleGoBack">
                <img class="back" src="@/assets/imgs/up.png" />
                <span class="back-text">{{ t('meos_control_web.back') }}</span>
            </div>

            <!-- 分割线 -->
            <span v-if="showBackButton" class="line" :class="lineClass"></span>

            <!-- 标题 -->
            <div class="schedule" :class="scheduleClass">
                {{ scheduleTitle }}
            </div>

            <!-- 系统名称 -->
            <span v-ellipsis class="system m-ellipsis" style="max-width: 300px">
                {{ systemInfo.localName }}
            </span>

            <!-- 视图切换 -->
            <m-tabs v-model="viewType" :data="tabItems" type="segment" size="small"></m-tabs>

            <!-- 周视图日期选择 -->
            <template v-if="viewType === 'weeks'">
                <m-date-picker
                    ref="datePickerRef"
                    v-model="weeksDate"
                    type="daterange"
                    class="ml8"
                    :scope="dateScope"
                    :scope-disabled-tips-text="t('meos_control_web.selected_date_out_of_range')"
                    :clearable="false"
                    @change="handleWeekChange"
                    @rang-selected="handleRangSelected"
                />
            </template>

            <!-- 月视图日期选择 -->
            <template v-else>
                <m-date-picker
                    v-model="monthDate"
                    :scope="dateScope"
                    type="month"
                    :scope-disabled-tips-text="t('meos_control_web.selected_date_out_of_range')"
                    :clearable="false"
                    class="ml8"
                    @change="handleMonthChange"
                />
            </template>

            <!-- 提示图标 -->
            <m-popover :show-arrow="false" theme="darkTransparent" placement="right-start">
                <template #content>
                    <div>{{ t('meos_control_web.schedule_or_auto_run') }}</div>
                </template>
                <svg aria-hidden="true" class="row-tips-icon ml8">
                    <use :xlink:href="'#icon-info-small'" />
                </svg>
            </m-popover>
        </div>

        <!-- 右侧插槽 -->
        <div class="timetable-header-right">
            <slot name="append" :params="{}" :list="[]"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { tabsTypeKey, weeksDateKey, monthDateKey, type SystemInfo, type CalendarViewType } from '../types';

const props = defineProps({
    /** 系统信息 */
    systemInfo: {
        type: Object as PropType<SystemInfo>,
        required: true
    },
    /** 是否显示返回按钮 */
    showBackButton: {
        type: Boolean,
        default: true
    },
    /** 是否显示搜索 */
    showSearch: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits<{
    (e: 'goBack'): void;
    (e: 'changeParams'): void;
    (e: 'changeTabs', type: CalendarViewType): void;
    (e: 'changeWeeksParams'): void;
}>();

const { t } = useI18n();

// 注入状态
const injectedViewType = inject(tabsTypeKey);
const injectedWeeksDate = inject(weeksDateKey);
const injectedMonthDate = inject(monthDateKey);

// 本地状态（如果未提供注入则使用本地状态）
const localViewType = ref<CalendarViewType>('weeks');
const localWeeksDate = ref('');
const localMonthDate = ref('');

// 计算属性
const viewType = computed({
    get: () => injectedViewType?.value ?? localViewType.value,
    set: val => {
        if (injectedViewType) {
            injectedViewType.value = val;
        } else {
            localViewType.value = val;
        }
    }
});

const weeksDate = computed({
    get: () => injectedWeeksDate?.value ?? localWeeksDate.value,
    set: val => {
        if (injectedWeeksDate) {
            injectedWeeksDate.value = val;
        } else {
            localWeeksDate.value = val;
        }
    }
});

const monthDate = computed({
    get: () => injectedMonthDate?.value ?? localMonthDate.value,
    set: val => {
        if (injectedMonthDate) {
            injectedMonthDate.value = val;
        } else {
            localMonthDate.value = val;
        }
    }
});

// 屏幕宽度
const screenWidth = ref(document.documentElement.clientWidth);

// 日期选择器引用
const datePickerRef = ref();

// Tab 选项
const tabItems = ref([
    { id: 'weeks', name: t('common.week') },
    { id: 'month', name: t('common.monthUnit') }
]);

// 日期范围
const getDayjsTz = () => dayjs();
const dateScope = computed(() => `${getDayjsTz().subtract(1, 'year').startOf('year')} - ${getDayjsTz().add(1, 'year').endOf('year')}`);

// 样式类
const lineClass = computed(() => ({
    'line-1920': screenWidth.value >= 1920,
    'line-1366': screenWidth.value < 1920
}));

const scheduleClass = computed(() => ({
    'schedule-1920': screenWidth.value >= 1920,
    'schedule-1366': screenWidth.value < 1920
}));

// 标题
const scheduleTitle = computed(() => {
    return props.systemInfo.consoleTypes === 'AIR_TERMINAL_ZONE' ? t('meos_control_web.zone_schedule') : t('meos_control_web.cooling_station_schedule');
});

// 初始化日期
const initDates = () => {
    const now = getDayjsTz();
    if (!weeksDate.value) {
        weeksDate.value = `${now.format('YYYY.MM.DD')}-${now.add(6, 'day').format('YYYY.MM.DD')}`;
    }
    if (!monthDate.value) {
        monthDate.value = now.format('YYYY.MM');
    }
};

// 事件处理
const handleGoBack = () => {
    emit('goBack');
};

const handleWeekChange = () => {
    emit('changeWeeksParams');
};

const handleMonthChange = () => {
    emit('changeParams');
};

const handleRangSelected = ({ startTime, endTime }: { startTime: string; endTime: string }) => {
    const targetDate = getDayjsTz().add(1, 'year').endOf('year');
    // 处理日期范围选择逻辑
};

// 初始化
initDates();
</script>

<style lang="less" scoped>
.timetable-header {
    height: 40px;

    .line {
        width: 1px;
        height: 20px;
        background: #c4c9cf;
    }

    .back-box {
        display: flex;
        align-items: center;
        padding: 8px 8px 8px 4px;
        border-radius: 4px;
        background: transparent;
        cursor: pointer;

        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }

        .back {
            width: 20px;
            height: 20px;
        }

        .back-text {
            margin-left: 4px;
            color: var(--title-color);
        }
    }

    .schedule {
        font-weight: 700;
        color: var(--title-color);
    }

    .system {
        margin-left: 8px;
        color: var(--title-color);
    }

    .ml8 {
        margin-left: 8px;
    }

    .row-tips-icon {
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
}
</style>
