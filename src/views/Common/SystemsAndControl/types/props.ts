import { HttpResponse } from '@/types/common';
import {
    ChartNode,
    ConsoleType,
    ConsoleTypeMap,
    ConsoleTypes,
    ControlTabsEnum,
    DataObject,
    EquipmentData,
    GroupConfig,
    SystemControlNode,
    SystemClassCode,
    UseComponentByInfoCode,
    SystemParamsSetProps
} from './index';
import { ControlListItem, PumpGroup } from './control';
import { Ref } from 'vue';
import { InfoCodeGroupConfig } from '@/types/InfoCodeConfig';

/**
 * 主页属性接口
 * @property {Partial<HeaderProps>} [headerProps] 头部展示配置，透传至 LeftHeader
 * @property {Partial<ChartProps>} [chartProps] 关联图区块配置，可覆写交互与图例
 * @property {Partial<SpaceMapProps>} [spaceMapProps] 空间地图配置，控制数据查询与排序
 * @property {Partial<SystemDataProps>} [systemDataProps] 系统数据面板附加属性
 * @property {Record<string, any>} [operatingMonitoringProps] 运行监控页签附加参数
 * @property {Record<string, any>} [abnormalTabBoxProps] 异常事件页签附加参数
 * @property {Record<string, any>} [commonDrawerProps] 设备抽屉通用配置（宽度、标签等）
 * @property {Record<string, any>} [controlPanelProps] 右侧控制面板通用配置
 * @property {SystemParamsSetProps} [systemParamsSetProps] 系统参数设置抽屉通用配置
 * @property {string} menuCode 菜单Code，决定系统树与默认系统
 * @property {string} subscribeType 抽屉订阅类型，控制物联网推送
 * @property {string} runningMonitorType 运行监控类型，贯穿图表、抽屉与头部配置
 * @property {string} [productCode] 产品/模块过滤条件
 * @property {boolean} [useDefaultChart=true] 是否挂载默认关联图
 * @property {boolean} [useDefaultSpaceMap=true] 是否挂载默认空间地图
 * @property {any[]} [abnormalEventList] 异常事件数据源
 * @property {string} [mainGrapTypeCode] 主图 graphTypeCode，传给关联图接口
 * @property {Array<{ id: ControlTabsEnum; name: string; slotName?: string }>} [tabs] 右侧控制面板页签
 * @property {Record<string, string[]>} [classCodeEquipIdsMap] 类型与设备ID映射，禁用默认图表时可注入
 * @property {boolean} [hasIndoorTemperature] 是否展示室内温度指标
 * @property {boolean} [hasOutdoorTemperature] 是否展示室外天气
 * @property {boolean} [hasNotify] 是否展示控制面板底部通知列表
 * @property {string} [runParamKey] 运行参数数据在系统详情接口的字段名，默认为'RUN_X1STTAG_3'
 * @property {SystemClassCode} systemClassCode 系统类型
 * @property {ConsoleTypeMap} consoleTypeMap 运行控制类型配置，决定控制面板展示与交互
 * @property {Record<string, number>} [sortByInfoCode] 信息编码排序配置，控制控制面板内信息点展示顺序
 * @property {Boolean} [noSystemCotrolPanel] 是否不展示控制面板相关内容（包括页签与tab内容），默认为false
 * @property {() => HttpResponse<SystemControlNode[]>} [getDataFn] 自定义系统树请求
 * @property {boolean} [showControlInterventionTime] 是否展示控制干预时间
 * @property {(data: SystemControlNode[]) => { systemList: SystemControlNode[]; currentSystem: SystemControlNode | null }} [customFetchMenuConfigFn] 自定义系统解析与默认选中
 * @property {(tabs: Ref<Array<{ id: string; name: string; slotName?: string }>>, monitoringSurveillanceStatus: Ref<string | undefined>) => void} [customVisibilityRulesFn] 运行控制页签显隐策略
 * @property {(show: Ref<boolean>, templateData: any) => void} [customOperatingControlShowRulesFn] 运行控制抽屉页签显隐策略
 * @property {() => boolean} [customControlIsEmptyFn] 自定义右侧面板空状态判断
 * @property {(infoCode: string) => Array<{ code: string; name: string }>} handleSpecialInfoCodesdataSourcesFn 特殊信息编码数据源处理函数，传入信息编码，返回数据源数组
 * @property {(consoleTypesData: Ref<ConsoleTypes>, currentConsoleTypeId: Ref<keyof ConsoleTypeMap | undefined>) => void} [customControlParams] 自定义控制面板参数处理函数，传入所有控制类型数据
 */
export interface IndexProps {
    headerProps?: Partial<HeaderProps>;
    chartProps?: Partial<ChartProps>;
    spaceMapProps?: Partial<SpaceMapProps>;
    systemDataProps?: Partial<SystemDataProps>;
    operatingMonitoringProps?: Record<string, any>;
    abnormalTabBoxProps?: Record<string, any>;
    commonDrawerProps?: Record<string, any>;
    controlPanelProps?: Record<string, ControlProps>;
    systemParamsSetProps?: SystemParamsSetProps;
    systemAutoSetProps?: Record<string, any>;
    menuCode: string;
    noSystemCotrolPanel: boolean;
    subscribeType: string;
    productCode?: string;
    runningMonitorType: string;
    useDefaultChart?: boolean;
    useDefaultSpaceMap?: boolean;
    mainGrapTypeCode?: string;
    abnormalEventList?: any[];
    tabs?: Array<{ id: ControlTabsEnum; name: string; slotName?: string }>;
    classCodeEquipIdsMap?: Record<string, string[]>;
    hasIndoorTemperature?: boolean;
    hasOutdoorTemperature?: boolean;
    hasNotify?: boolean;
    runParamKey?: string;
    disabilityAlarmResetKey?: string;
    systemClassCode: SystemClassCode;
    consoleTypeMap: ConsoleTypeMap;
    sortByInfoCode?: Record<string, number>;
    showControlInterventionTime: boolean;
    peratingMonitoringComponentAttrs?: Record<string, any>;
    getDataFn?: () => HttpResponse<SystemControlNode[]>;
    customFetchMenuConfigFn?: (data: SystemControlNode[]) => { systemList: SystemControlNode[]; currentSystem: SystemControlNode | null };
    customVisibilityRulesFn?: (tabs: Ref<Array<{ id: string; name: string; slotName?: string }>>, monitoringSurveillanceStatus: Ref<string | undefined>) => void;
    customOperatingControlShowRulesFn?: (show: Ref<boolean>, templateData: any) => void;
    customControlIsEmptyFn?: () => boolean;
    customControlParams?: (consoleTypesData: Ref<ConsoleTypes>) => void;
    handleSpecialInfoCodesDataSourcesFn: (infoCode: string) => Array<{ code: string; name: string }> | null;
}

/**
 * 头部属性接口
 * @property {SystemControlNode[]} systemList 系统列表
 * @property {Array<{ id: string; name: string; slotName: string }>} [viewModeTabs] 视图模式标签页
 * @property {string} [viewModeDisabledId] 视图模式禁用ID
 */
export interface HeaderProps {
    systemList: SystemControlNode[];
    viewModeTabs?: Array<{ id: string; name: string; slotName: string }>;
    viewModeDisabledId?: string;
}

/**
 * 图表属性接口
 * @property {string} systemId 系统ID
 * @property {SystemControlNode | null} currentSystem 当前系统
 * @property {string} runningMonitorType 运行监控类型
 * @property {any[]} abnormalEventList 异常事件列表
 * @property {string} menuCode 菜单Code
 * @property {string} mainGrapTypeCode 主图graphTypeCode
 */
export interface ChartProps {
    systemId: string;
    currentSystem: SystemControlNode | null;
    runningMonitorType: string;
    abnormalEventList?: any[];
    menuCode: string;
    mainGrapTypeCode?: string;
    canHoverGroupSelect?: boolean;
    defaultLegends?: { id: string; name: string; color: string; bgColor: string }[];
    shouldHadSubGraph?: (curSystemInfo: any, obj: DataObject) => boolean;
    enableHoverGroup?: (obj: ChartNode, currentGraphInfo: SystemControlNode | null) => boolean | DataObject[];
    equipGroupCannotSelect?: (obj: DataObject) => boolean;
    beforeClickNode?: (obj: EquipmentData, modalData: any, done: () => void) => boolean;
}

export interface AbnormalProps extends IndexProps {
    systemId: string;
    currentSystem: SystemControlNode | null;
    runningMonitorType: string;
    isSubPanel: boolean;
    classCodeEquipIdsMap: Record<string, string[]>;
}

export interface SystemDataProps {
    data: GroupConfig[];
    systemId: string;
    chartsData: Array<any>;
    /** 室内温度按空间需求范围分组后的图表数据。 */
    chartsDataBySpaceScope?: Record<string, Array<any>>;
    allChartSpacesCount?: number;
    showMonitoringDashboard?: boolean;
    hasIndoorTemperature?: boolean;
}

export interface SpaceMapProps {
    runningMonitorType: string;
    getClassCodeEquipIdsMap: (data: Record<string, string[]>, type?: string) => void;

    querySpacesByChartObjType?: boolean;
    queryEquipsParams?: (curSystem: Record<string, any>, equipsClassCodes?: Record<string, string[]>) => Record<string, any>;
    queryEquipsApi?: (params: Record<string, any>, config?: Record<string, any>) => Promise<any>;
    sortSpacesByClassCodes?: (params: {
        data: Record<string, any>;
        spaces: Array<Record<string, any>>;
        spaceIdMapClassCodes: Record<string, Set<string>>;
    }) => Array<Record<string, any>>;
    findDefaultSpace?: (spaces: Array<Record<string, any>>, idMapClassCodes: Record<string, Set<string>>) => Record<string, any> | null;
}

/**
 * 控制属性接口
 * @property {ConsoleTypes} consoleTypesData 控制类型数据
 * @property {string} systemId 系统ID
 * @property {SystemControlNode | null} currentSystem 当前系统
 * @property {string} runningMonitorType 运行监控类型
 * @property {SystemClassCode} systemClassCode 系统类型
 * @property {Record<string, number>} [groupKeyMap] 分组Key映射，用于控制面板分组展示顺序
 * @property {Record<string, number>} sortByInfoCode 信息编码排序
 * @property {UseComponentByInfoCode} useComponents 组件使用函数
 * @property {boolean} showSystemSet 是否展示系统设置入口，控制面板右上角按钮显示与否
 * @property {boolean} consoleIsClose 控制面板是否关闭，影响组件交互与展示
 * @property {boolean} showControlInterventionTime 是否展示控制干预时间
 * @property {() => void} showPlanList 显示计划列表函数，传入控制面板用于特定控制类型调用
 * @property {() => void} openSystemSet 打开系统设置抽屉函数，传入控制面板用于特定控制类型调用
 * @property {(currentConsoleType: ConsoleType | null) => void} openTimeTable 打开时间表抽屉函数，传入控制面板用于特定控制类型调用
 * @property {(data: { airTerminalZoneId: string; airTerminalZoneName: string }) => void} openSpaceList 打开空间列表函数，传入控制面板用于特定控制类型调用
 */
export interface ControlProps {
    consoleTypesData: ConsoleTypes;
    currentConsoleType: ConsoleType | null;
    systemId: string;
    currentSystem: SystemControlNode | null;
    runningMonitorType: string;
    systemClassCode: SystemClassCode;
    groupKeyMap?: Record<string, number>;
    sortByInfoCode?: Record<string, number>;
    useComponent?: UseComponentByInfoCode;
    consoleIsClose: boolean;
    relationChartComponent?: RelationChartComponent;
    showSystemSet: boolean;
    showControlInterventionTime: boolean;
    showPlanList: () => void;
    openSystemSet: () => void;
    openTimeTable: (currentConsoleType: ConsoleType | null) => void;
    openSpaceList: (data: { airTerminalZoneId: string; airTerminalZoneName: string }) => void;
}

export interface RelationChartComponent {
    getEquipsByInGroup?: (id: string) => Array<{ id: string }>;
    shakeName?: (ids: string[]) => void;
    clearShakeName?: () => void;
}

export interface AirBoxProps {
    controlListData: ControlListItem[];
    activeSetFormData?: Record<string, any>;
    relationChartComponent?: RelationChartComponent;
    systemId?: string;
    systemClassCode?: string;
    consoleTypes?: string;
    showControlInterventionTime?: boolean;
    useComponent?: UseComponentByInfoCode;
}

export type AirBoxHoverItem = ControlListItem | PumpGroup;

export interface SystemSetProps {
    systemId?: string;
    isStation: boolean;
    runningMonitorType: string;
    systemClassCode: SystemClassCode;
    disabilityAlarmReset?: InfoCodeGroupConfig;
    currentSystem?: SystemControlNode | null;
    systemParamsSetProps?: SystemParamsSetProps;
    systemAutoSetProps?: Record<string, any>;
    handleSpecialInfoCodesDataSourcesFn?: (infoCode: string) => Array<{ code: string; name: string }> | null;
}
