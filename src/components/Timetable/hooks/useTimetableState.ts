/**
 * 时间表组件状态管理 Hook
 * @description 提供时间表组件的核心状态和数据处理逻辑
 */

import { ref, provide, inject, watch, type Ref } from 'vue';
import dayjs from 'dayjs';
import { MLoading } from 'meri-plus';
import {
    weeksDateKey,
    monthDateKey,
    tabsTypeKey,
    toDayKey,
    dataItemKey,
    isLoadingKey,
    rightToDayKey,
    systemInfoKey,
    type SystemType,
    type CalendarViewType,
    type TimetableItem,
    type CalendarDay,
    type SystemInfo,
    type TimetableDataLoader
} from '../types';

/**
 * 获取当前时区的 dayjs
 */
const getDayjsTz = () => dayjs();

/**
 * 时间表状态管理 Hook
 */
export function useTimetableState(systemInfo: Ref<SystemInfo>, dataLoader?: TimetableDataLoader) {
    // 核心状态
    const toDay = ref(getDayjsTz());
    const monthDate = ref(`${getDayjsTz().format('YYYY.MM')}`);
    const weeksDate = ref(`${getDayjsTz().format('YYYY.MM.DD')}-${getDayjsTz().add(6, 'day').format('YYYY.MM.DD')}`);
    const tabsType = ref<CalendarViewType>('weeks');
    const dataItem = ref<TimetableItem[]>([]);
    const isLoading = ref(false);
    const rightToDay = ref<CalendarDay | null>(null);
    const Mloading = ref<ReturnType<typeof MLoading.service> | null>(null);

    // 项目 ID（从外部传入或从 store 获取）
    const projectId = ref('');

    /**
     * 加载数据
     */
    const loadData = async (showLoading = true) => {
        if (!dataLoader) {
            console.warn('Timetable: dataLoader is not provided');
            return;
        }

        Mloading.value?.destroy();
        Mloading.value = null;
        isLoading.value = true;

        if (showLoading) {
            Mloading.value = MLoading.service({
                target: tabsType.value === 'weeks' ? '.calendar-weeks' : '.calendar-month',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });

            try {
                const params = {
                    projectId: projectId.value,
                    consoleTypes: getConsoleTypes(),
                    systemType: 'ACAC',
                    objectId: systemInfo.value.consoleTypes !== 'AIR_TERMINAL_ZONE' ? systemInfo.value.systemId : '',
                    beginDate: getBeginDate(),
                    endDate: getEndDate()
                };

                const result = await dataLoader(params);
                dataItem.value = result.data || [];
            } catch (error) {
                console.error('Timetable: Failed to load data', error);
                dataItem.value = [];
            } finally {
                Mloading.value?.destroy();
                isLoading.value = false;
            }
        }
    };

    /**
     * 获取控制台类型数组
     */
    const getConsoleTypes = (): SystemType[] => {
        const type = systemInfo.value.consoleTypes;
        if (type === 'COOL_SUPPLY' || type === 'COOL_INPUT') {
            return ['COOL_SUPPLY', 'COOL_INPUT'];
        }
        return ['AIR_TERMINAL_ZONE'];
    };

    /**
     * 获取开始日期
     */
    const getBeginDate = (): string => {
        if (tabsType.value === 'weeks') {
            return dayjs(weeksDate.value?.split('-')[0]).format('YYYY-MM-DD');
        }
        return dayjs(monthDate.value + '-01')
            .startOf('month')
            .format('YYYY-MM-DD');
    };

    /**
     * 获取结束日期
     */
    const getEndDate = (): string => {
        if (tabsType.value === 'weeks') {
            return dayjs(weeksDate.value?.split('-')[1]).format('YYYY-MM-DD');
        }
        return dayjs(monthDate.value + '-01')
            .endOf('month')
            .format('YYYY-MM-DD');
    };

    /**
     * 设置项目 ID
     */
    const setProjectId = (id: string) => {
        projectId.value = id;
    };

    /**
     * 切换视图类型
     */
    const setViewType = (type: CalendarViewType) => {
        tabsType.value = type;
    };

    /**
     * 设置月份日期
     */
    const setMonthDate = (date: string) => {
        monthDate.value = date;
    };

    /**
     * 设置周日期范围
     */
    const setWeeksDate = (date: string) => {
        weeksDate.value = date;
    };

    /**
     * 设置选中日期
     */
    const setSelectedDate = (date: CalendarDay | null) => {
        rightToDay.value = date;
    };

    // 监听视图类型变化，重新加载数据
    watch(
        () => tabsType.value,
        () => {
            loadData(true);
        },
        { immediate: false }
    );

    // 提供依赖注入
    provide(weeksDateKey, weeksDate);
    provide(monthDateKey, monthDate);
    provide(tabsTypeKey, tabsType);
    provide(toDayKey, toDay);
    provide(dataItemKey, dataItem);
    provide(isLoadingKey, isLoading);
    provide(rightToDayKey, rightToDay);
    provide(systemInfoKey, systemInfo);

    return {
        // 状态
        toDay,
        monthDate,
        weeksDate,
        tabsType,
        dataItem,
        isLoading,
        rightToDay,

        // 方法
        loadData,
        setProjectId,
        setViewType,
        setMonthDate,
        setWeeksDate,
        setSelectedDate,
        getBeginDate,
        getEndDate
    };
}

/**
 * 使用时间表状态的 Hook（子组件使用）
 */
export function useTimetableContext() {
    const weeksDate = inject(weeksDateKey);
    const monthDate = inject(monthDateKey);
    const tabsType = inject(tabsTypeKey);
    const toDay = inject(toDayKey);
    const dataItem = inject(dataItemKey);
    const isLoading = inject(isLoadingKey);
    const rightToDay = inject(rightToDayKey);
    const systemInfo = inject(systemInfoKey);

    if (!weeksDate || !monthDate || !tabsType || !dataItem || !isLoading) {
        throw new Error('useTimetableContext must be used within Timetable component');
    }

    return {
        weeksDate,
        monthDate,
        tabsType,
        toDay,
        dataItem,
        isLoading,
        rightToDay,
        systemInfo
    };
}

export type UseTimetableStateReturn = ReturnType<typeof useTimetableState>;
