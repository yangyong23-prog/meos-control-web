/**
 * 通用时间表组件类型定义
 * @description 提供时间表组件的所有类型接口
 */

import type { Ref, InjectionKey } from 'vue';

/**
 * 系统类型枚举
 */
export type SystemType = 'COOL_SUPPLY' | 'COOL_INPUT' | 'AIR_TERMINAL_ZONE';

/**
 * 日历视图类型
 */
export type CalendarViewType = 'weeks' | 'month';

/**
 * 时间表数据项
 */
export interface TimetableItem {
    id: string;
    localName: string;
    consoleType: SystemType;
    classCode?: string;
    date: string;
    executeDetail?: {
        strategyPlans: StrategyPlan[];
    };
    executeObjects?: ExecuteObject[];
}

/**
 * 策略计划
 */
export interface StrategyPlan {
    strategyTime: string;
    [key: string]: any;
}

/**
 * 执行对象
 */
export interface ExecuteObject {
    id: string;
    localName: string;
    [key: string]: any;
}

/**
 * 日历日期数据
 */
export interface CalendarDay {
    date: string;
    day: number;
    isNextMonth: boolean;
    list: TimetableItem[];
    showMore?: boolean;
}

/**
 * 周日历日期数据
 */
export interface WeekCalendarDay {
    date: dayjs.Dayjs;
    weekday: number;
    list: TimetableItem[];
    showMore?: boolean;
}

/**
 * 系统信息
 */
export interface SystemInfo {
    systemId: string;
    localName: string;
    consoleTypes: SystemType;
    isShowCoolStore?: boolean;
    unHideCoolingControl?: boolean;
    classCode?: string;
}

/**
 * 编辑弹窗参数
 */
export interface EditorModalParams {
    consoleType: SystemType;
    objectId?: string;
    currentDate?: string;
    [key: string]: any;
}

/**
 * 时间表组件 Props
 */
export interface TimetableProps {
    /** 系统信息 */
    systemInfo: SystemInfo;
    /** 初始视图类型 */
    defaultViewType?: CalendarViewType;
    /** 是否显示返回按钮 */
    showBackButton?: boolean;
    /** 是否显示新建按钮 */
    showCreateButton?: boolean;
    /** 是否显示批量删除按钮 */
    showBatchDelete?: boolean;
    /** 是否禁用操作 */
    disabled?: boolean;
    /** 按钮类型配置 */
    buttonType?: 'dropdown' | 'coolSupply' | 'coolInput' | 'airTerminalZone' | null;
    /** 下拉选项配置 */
    dropdownOptions?: Array<{ label: string; key: string }>;
    /** 自定义类名 */
    customClass?: string;
}

/**
 * 时间表组件 Emits
 */
export interface TimetableEmits {
    /** 返回按钮点击 */
    (e: 'goBack'): void;
    /** 新建时间表 */
    (e: 'create', type: SystemType): void;
    /** 编辑时间表 */
    (e: 'edit', params: EditorModalParams): void;
    /** 删除时间表 */
    (e: 'delete', ids: string[]): void;
    /** 视图类型切换 */
    (e: 'viewTypeChange', type: CalendarViewType): void;
    /** 日期切换 */
    (e: 'dateChange', date: { start: string; end: string }): void;
    /** 数据加载完成 */
    (e: 'dataLoaded', data: TimetableItem[]): void;
}

/**
 * 时间表组件暴露的方法
 */
export interface TimetableExpose {
    /** 刷新数据 */
    refresh: () => void;
    /** 获取当前视图类型 */
    getViewType: () => CalendarViewType;
    /** 获取当前日期范围 */
    getDateRange: () => { start: string; end: string };
    /** 获取选中日期 */
    getSelectedDate: () => CalendarDay | WeekCalendarDay | null;
}

/**
 * 时间表数据加载函数类型
 */
export type TimetableDataLoader = (params: {
    projectId: string;
    consoleTypes: SystemType[];
    systemType: string;
    objectId: string;
    beginDate: string;
    endDate: string;
}) => Promise<{ data: TimetableItem[]; total: number }>;

/**
 * 依赖注入 Keys
 */
export const weeksDateKey: InjectionKey<Ref<string>> = Symbol('weeksDateKey');
export const monthDateKey: InjectionKey<Ref<string>> = Symbol('monthDateKey');
export const tabsTypeKey: InjectionKey<Ref<CalendarViewType>> = Symbol('tabsTypeKey');
export const toDayKey: InjectionKey<Ref<string>> = Symbol('toDayKey');
export const dataItemKey: InjectionKey<Ref<TimetableItem[]>> = Symbol('dataItemKey');
export const isLoadingKey: InjectionKey<Ref<boolean>> = Symbol('isLoadingKey');
export const rightToDayKey: InjectionKey<Ref<CalendarDay | null>> = Symbol('rightToDayKey');
export const systemInfoKey: InjectionKey<Ref<SystemInfo>> = Symbol('systemInfoKey');

/**
 * 时间表组件插槽类型
 */
export interface TimetableSlots {
    /** 头部额外内容插槽 */
    headerExtra?: (props: { systemInfo: SystemInfo }) => any;
    /** 日期项自定义内容插槽 */
    dateItem?: (props: { item: TimetableItem; date: CalendarDay }) => any;
    /** 空状态插槽 */
    empty?: () => any;
    /** 加载中插槽 */
    loading?: () => any;
}
