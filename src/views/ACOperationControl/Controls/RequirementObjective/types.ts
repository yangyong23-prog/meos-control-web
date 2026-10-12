// @ts-ignore
import i18n from '@/localization';
export interface DemandControlObject {
    open: boolean;
    id: string;
    name: string;
    localName: string; // 对象本地名称
    instanceType: string; // 实例类型
    isCustomizedSetting: boolean; // 是否自定义配置
    isCustomControlSpace: boolean; // 是否为自定义管控空间
    isShielded: boolean; // 是否被屏蔽
    children: DemandControlObject[];
}

export interface ListItem {
    value: string;
    id: string;
    openValue?: string;
    closeValue?: string;
}

export interface Tem {
    coldSeason: {
        target: number | null;
        usetarget?: number | null;
        upper: number | null;
        useupper?: number | null;
        save: number | null;
        usesave?: number | null;
    };
    warmSeason: {
        target: number | null;
        usetarget?: number | null;
        upper: number | null;
        useupper?: number | null;
        save: number | null;
        usesave?: number | null;
    };
    dayDispatch: number | null;
    usedayDispatch?: number | null;
    sustainDispatch: number | null;
    usesustainDispatch?: number | null;
    noDispatch: ListItem[];
    useNoDispatch?: ListItem[];
}
export interface CO {
    target: number | null;
    usetarget?: number | null;
    upper: number | null;
    useupper?: number | null;
    dayDispatch: number | null;
    usedayDispatch?: number | null;
    sustainDispatch: number | null;
    usesustainDispatch?: number | null;
    noDispatch: ListItem[];
    useNoDispatch?: ListItem[];
}
export interface Params {
    coldList: ListItem[]; // 供冷季
    warmList: ListItem[]; // 采暖季
    week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'[]; // 工作日
    workTime: ListItem[]; // 工作日营业时间
    useWorkTime?: ListItem[]; // 引用工作日营业时间
    restTime: ListItem[]; // 休息日营业时间
    useRestTime?: ListItem[]; // 引用休息日营业时间
    demandTime: ListItem[]; // 空调需求时间
    useDemandTime?: ListItem[]; // 空调需求时间
    switch: 'uncheck' | 'checked' | '0' | '1' | '2' | '3' | any; // 营业时间设置
    dispatch: string; // 是否参与调度
    shutdown: string; // 允许提前关机
    tem: Tem;
    CO: CO;
}

export interface ObjectSetting {
    isBusinessTimeReferenced?: boolean;
    isParticipateInSchedulingReferenced?: boolean;
    // coolingSeasonDateRangeList: string[] // 供冷季日期
    // heatingSeasonDateRangeList: string[] // 采暖季开日期
    // weekdays: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'[] // 工作日
    businessTimeRangeList: string[]; // 工作日营业时间
    // businessTimeRangeListOnNonWeekdays: string[] // 休息日营业时间
    airConditioningDemandTimeRangeList: string[]; // 空调需求时间
    isParticipateInScheduling: boolean; // 是否参与调度
    isAllowEarlyShutdown: boolean; // 是否允许提前关机
    coolingSeasonTargetValue: number | null; // 供冷季目标值
    coolingSeasonUpperLimitValue: number | null; // 供冷季上限值
    coolingSeasonColdStorageValue: number | null; // 供冷季蓄冷值
    heatingSeasonTargetValue: number | null; // 采暖季目标值
    heatingSeasonLowerLimitValue: number | null; // 采暖季下限值
    heatingSeasonHeatStorageValue: number | null; // 采暖季蓄热值
    temperatureScheduledHourInDay: number | null; // 温度日调度时长
    temperatureContinuousScheduledHour: number | null; // 温度可连续调度时长
    temperatureUnscheduledTimeRange: string[]; // 温度不可调度时段
    carbonDioxideTargetValue: number | null; // 二氧化碳目标值
    carbonDioxideUpperLimitValue: number | null; // 二氧化碳上限值
    carbonDioxideScheduledHourInDay: number | null; // 二氧化碳日调度时长
    carbonDioxideContinuousScheduledHour: number | null; // 二氧化碳可连续调度时长
    carbonDioxideUnscheduledTimeRange: string[]; // 二氧化碳不可调度时段
}
