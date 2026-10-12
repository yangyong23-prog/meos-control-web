import { Ref } from 'vue';
import CoolerControl from '../components/control/CoolerControl.vue';
import InputControl from '../components/control/InputControl.vue';
import SwitchControl from '../components/control/SwitchControl.vue';
import { CodeConfig, ControlListItem } from './control';

/**
 * 系统控制节点接口
 * @property {boolean} [isGroup] 是否为分组
 * @property {string} [key] 唯一标识键
 * @property {string} [name] 节点名称
 * @property {string} [id] 节点ID
 * @property {string} [localName] 本地化名称/显示名称
 * @property {SystemControlNode[]} [children] 子节点列表
 * @property {string} [productModule] 产品模块名称
 * @property {string} [imageOrProductName] 图片或产品名称
 * @property {string} [dynamicName] 动态名称字段
 * @property {string} [diagramBaseObject] 图形基础对象
 * @property {string} [graphTypeCode] 图形类型Code
 * @property {string} [localId] 本地ID
 * @property {string} [systemId] 系统ID
 * @property {string} [classCode] 类型Code
 * @property {number} [isControl] 是否受控 (1: 是, 0: 否)
 * @property {string} [monitoringSurveillanceStatus] 监控状态
 * @property {boolean} [isShowCoolStore] 是否显示冷库/蓄冷
 * @property {SystemControlNode} [parent] 父节点引用
 * @property {string} [objType] 对象类型
 */
export interface SystemControlNode {
    isGroup?: boolean;
    key?: string;
    name?: string;
    id?: string;
    localName?: string;
    children?: SystemControlNode[];
    productModule?: string;
    imageOrProductName?: string;
    dynamicName?: string;
    diagramBaseObject?: string;
    graphTypeCode?: string;
    localId?: string;
    systemId?: string;
    classCode?: string;
    isControl?: number;
    monitoringSurveillanceStatus?: string;
    isShowCoolStore?: boolean;
    parent?: SystemControlNode;
    objType?: string;
}

/**
 * 视图模式枚举
 * @property {string} GRAPH_CODE Graph 图形Code标识
 * @property {string} MAP_VIEW MapView 地图视图标识
 */
export enum ViewModeEnum {
    GRAPH_CODE = 'Graph',
    MAP_VIEW = 'MapView'
}

/**
 * 数据类型枚举
 * @property {string} SYSTEM_LIST 系统列表
 * @property {string} CURRENT_SYSTEM 当前系统
 * @property {string} VIEW_MODE 视图模式
 * @property {string} SYSTEM_ID 系统ID
 */
export enum DataTypeEnum {
    SYSTEM_LIST = 'systemList',
    CURRENT_SYSTEM = 'currentSystem',
    VIEW_MODE = 'viewMode',
    SYSTEM_ID = 'systemId'
}

/**
 * 图形基础对象枚举
 * @property {string} PROJECT 项目
 */
export enum DiagramBaseObjectEnum {
    PROJECT = 'project'
}
/**
 * 对象类型枚举
 * @property {string} EQUIPMENT 设备
 * @property {string} EQUIP_GROUP 设备组
 * @property {string} SPACE 空间
 */
export enum ObjTypeEnum {
    EQUIPMENT = 'equipment',
    EQUIP_GROUP = 'equipGroup',
    SPACE = 'space'
}

/**
 * 组件类型枚举
 * @property {string} EQUIPMENT_NODE 设备节点
 * @property {string} PACK_NODE 包节点
 * @property {string} GRAPH_LEGEND_NODE 图例节点
 * @property {string} GRAPH_TEXT_NODE 图形文本节点
 */
export enum CompTypeEnum {
    EQUIPMENT_NODE = 'equipmentNode',
    PACK_NODE = 'packNode',
    GRAPH_LEGEND_NODE = 'graph_legend_node',
    GRAPH_TEXT_NODE = 'graph_text_node'
}

/**
 * 控制台页签枚举
 * @property {string} OPERATING_CONTROL 操作控制
 * @property {string} ABNORMAL_EVENTS 异常事件
 */
export enum ControlTabsEnum {
    OPERATING_CONTROL = 'OPERATING_CONTROL', // 操作控制标识
    ABNORMAL_EVENTS = 'ABNORMAL_EVENTS' // 异常事件标识
}

/**
 * 控制台类型枚举
 * @property {string} COOL_SUPPLY 供冷
 * @property {string} COOL_INPUT 蓄冷输入
 * @property {string} HEAT_SUPPLY 供热
 * @property {string} AIR_TERMINAL_ZONE 空调末端区域
 */
export enum ConsoleTypesEnum {
    COOL_SUPPLY = 'COOL_SUPPLY',
    COOL_INPUT = 'COOL_INPUT',
    HEAT_SUPPLY = 'HEAT_SUPPLY',
    AIR_TERMINAL_ZONE = 'AIR_TERMINAL_ZONE'
}

/**
 * 数据对象接口
 * @property {string} [modifiedTime] 修改时间
 * @property {string} [boundingBox] 包围盒
 * @property {string} [defaultQRCode] 默认二维码
 * @property {string} [creationTime] 创建时间
 * @property {string} [modifier] 修改人
 * @property {string} [updateApp] 更新应用
 * @property {string} [equipInstallHeight] 设备安装高度
 * @property {Array<{ path: string; itemType: string; key: string }>} [pic] 图片列表
 * @property {string} [localId] 本地ID
 * @property {number} [valid] 是否有效
 * @property {string} [floorId] 楼层ID
 * @property {string} [waterTankType] 水箱类型
 * @property {string} [assetManagementSerialNumber] 资产管理序列号
 * @property {string} [outline] 轮廓
 * @property {string} [major] 专业
 * @property {number} [tankLength] 水箱长度
 * @property {string} [bimId] BIM ID
 * @property {string} [id] ID
 * @property {string} [containerId] 容器ID
 * @property {string} [deliveryMethodFlag] 交付方式标志
 * @property {string} [objType] 对象类型
 * @property {string} [groupCode] 分组代码
 * @property {number} [height] 高度
 * @property {string} [classCode] 类型代码
 * @property {string} [publishTime] 发布时间
 * @property {string} [creator] 创建人
 * @property {string} [bimLocation] BIM位置
 * @property {string} [managementCategory] 管理类别
 * @property {string} [businessEffectiveTime] 业务生效时间
 * @property {number} [length] 长度
 * @property {string} [monitoringSurveillanceStatus] 监控状态
 * @property {string} [equipState] 设备状态
 * @property {string[]} [relObjIds] 相关对象ID列表
 * @property {number} [grouping] 分组
 * @property {string} [digitalDeliveryName] 数字化交付名称
 * @property {number} [tankWidth] 水箱宽度
 * @property {string} [buildingId] 建筑ID
 * @property {string} [equipSpecification] 设备规格
 * @property {string} [localName] 本地名称
 * @property {string} [equipStatus] 设备状态
 * @property {string} [name] 名称
 * @property {number} [width] 宽度
 * @property {string} [projectId] 项目ID
 * @property {number} [tankHeight] 水箱高度
 */
export interface DataObject {
    modifiedTime?: string;
    boundingBox?: string;
    defaultQRCode?: string;
    creationTime?: string;
    modifier?: string;
    updateApp?: string;
    equipInstallHeight?: string;
    pic?: Array<{ path: string; itemType: string; key: string }>;
    localId: string;
    valid?: number;
    floorId: string;
    waterTankType?: string;
    assetManagementSerialNumber?: string;
    outline?: string;
    major?: string;
    tankLength?: number;
    bimId?: string;
    id: string;
    containerId: string;
    deliveryMethodFlag?: string;
    objType: ObjTypeEnum;
    groupCode: string;
    height?: number;
    classCode: string;
    publishTime?: string;
    creator?: string;
    bimLocation?: string;
    managementCategory?: string;
    businessEffectiveTime?: string;
    length?: number;
    monitoringSurveillanceStatus?: string;
    equipState?: string;
    relObjIds?: string[];
    grouping?: number;
    digitalDeliveryName?: string;
    tankWidth?: number;
    buildingId: string;
    equipSpecification?: string;
    localName: string;
    equipStatus?: string;
    name: string;
    width?: number;
    projectId?: string;
    tankHeight?: number;
    [key: string]: any;
    items: DataObject[];
}

/**
 * 过滤状态VO接口
 * @property {string} infoCode 信息代码
 * @property {boolean} existsIotRule 是否存在IOT规则
 */
export interface FilterStatusVO {
    infoCode: string;
    existsIotRule: boolean;
}
/**
 * 图实例节点接口
 * @property {string} dataObjectId 数据对象ID
 * @property {FilterStatusVO} filterStatusVO 过滤状态VO
 * @property {string} [filterStatus] 过滤状态
 * @property {DataObject} dataObject 数据对象
 * @property {CompTypeEnum} compType 组件类型
 */
export interface ChartNode {
    dataObjectId: string;
    filterStatusVO: FilterStatusVO;
    filterStatus?: string;
    dataObject: DataObject;
    compType: CompTypeEnum;
}

/**
 * 图对象数据集合
 * @property {ChartNode[]} equipmentNodeVos 设备节点列表
 * @property {ChartNode[]} groupVos 分组节点列表
 * @property {ChartNode[]} passByVos 过路节点列表
 */
export interface ChartObjectData {
    equipmentNodeVos: ChartNode[];
    groupVos: ChartNode[];
    passByVos: ChartNode[];
}

/**
 * 图表属性接口
 * @property {string} [systemObjectId] 系统对象ID
 * @property {string} [classCode] 类型Code
 * @property {string} [graphTypeCode] 图形类型Code
 */
export interface ChartAttr {
    systemObjectId?: string;
    classCode?: string;
    graphTypeCode?: string;
}

/**
 * 图表对象接口
 * @property {Record<string, string[]>} classCodeEquipIdsMap 类型Code设备ID映射
 * @property {ChartObjectData} data 数据
 * @property {Record<string, string[]>} idMapInfoCodes ID映射信息Code
 * @property {Array<{ style: Record<string, string | number>; lineNames: string[] }>} legendData 图例数据
 * @property {Array<Record<string, any>>} renderDomList 渲染DOM列表
 */
export interface ChartObject {
    classCodeEquipIdsMap: Record<string, string[]>;
    data: ChartObjectData;
    idMapInfoCodes: Record<string, string[]>;
    legendData: Array<{ style: Record<string, string | number>; lineNames: string[] }>;
    renderDomList: Array<Record<string, any>>;
}

/**
 * 子图跳转对象接口
 * @property {string} clickEvent 点击事件
 * @property {string} interactiveObjectCode 交互对象编码
 * @property {string} jumpTarget 跳转目标
 * @property {string} mapTitle 地图标题
 * @property {string} skipProductModule 跳过的产品模块
 * @property {string} systemObjectId 系统对象ID
 * @property {boolean} canJump 是否可跳转
 * @property {string} graphTypeCode 图形类型编码
 * @property {string} relation 关联关系
 * @property {string} graphName 图形名称
 */
export interface SubChartObject {
    clickEvent: string;
    interactiveObjectCode: string;
    jumpTarget: string;
    mapTitle: string;
    skipProductModule: string;
    systemObjectId: string;
    canJump: boolean;
    graphTypeCode: string;
    relation: string;
    graphName: string;
}

/**
 * 天气项接口
 * @property {string} icon 图标
 * @property {string} title 标题
 * @property {string | number} dataValue 数值
 * @property {string} unit 单位
 */
export interface WeatherItem {
    icon: string;
    title: string;
    dataValue: string | number;
    unit: string;
}

/**
 * 数据源项接口
 * @property {string} code 代码
 * @property {string} name 名称
 */
export interface DataSourceItem {
    code: string;
    name: string;
}

/**
 * 相关信息点配置接口
 * @property {DataSourceItem[]} dataSource 数据源列表
 * @property {string} infoCode 信息代码
 * @property {string} infoCodeName 信息代码名称
 * @property {string} infoCodeType 信息代码类型
 * @property {string} relTemplateTypeId 相关模板类型ID
 * @property {number} sequence 排序
 * @property {string} originDataType 原始数据类型
 * @property {Record<string, any>} [additionalMapValue] 额外映射值
 * @property {string} [dataTime] 数据时间
 * @property {string} [dataValue] 数据值
 * @property {boolean} [existsIotRule] 是否存在IOT规则
 */
export interface RelInfoCodeConfig {
    dataSource: DataSourceItem[];
    infoCode: string;
    infoCodeName: string;
    infoCodeType: string;
    relTemplateTypeId: string;
    sequence: number;
    originDataType: string;
    additionalMapValue?: Record<string, any>;
    dataTime?: string;
    dataValue?: string;
    existsIotRule?: boolean;
}

/**
 * 分组配置接口
 * @property {string} groupCode 分组代码
 * @property {string} groupName 分组名称
 * @property {number} groupOrder 分组排序
 * @property {RelInfoCodeConfig[]} relInfoCodeConfigs 相关信息代码配置列表
 * @property {GroupConfig[]} [groupChildren] 分组子项
 */
export interface GroupConfig {
    groupChildren?: GroupConfig[];
    groupCode: string;
    groupName: string;
    groupOrder: number;
    relInfoCodeConfigs: RelInfoCodeConfig[];
}

/**
 * 设备数据接口
 * @property {string} id 设备ID
 * @property {string} classCode 设备类型Code
 * @property {string} floorId 楼层ID
 * @property {string} buildingId 楼栋ID
 * @property {ObjTypeEnum} objType 对象类型
 * @property {string} name 设备名称
 * @property {string} localName 本地名称
 * @property {string} localId 本地ID
 * @property {string} floorLocalName 楼层本地名称
 * @property {string} runningMonitorType 运行监控类型
 */
export interface EquipmentData {
    id: string;
    classCode: string;
    floorId: string;
    buildingId: string;
    objType: ObjTypeEnum;
    name: string;
    localName: string;
    localId: string;
    floorLocalName: string;
    runningMonitorType: string;
    systemObjectId?: string;
    systemClassCode?: string;
}
/**
 * 设备详情接口
 * @property {string} id 设备ID
 * @property {string} localName 本地名称
 * @property {string} objType 对象类型
 * @property {string} classCode 类型代码
 * @property {string} dynamicName 动态名称
 * @property {string} templateTypeId 模板类型ID
 * @property {string} templateTypeName 模板类型名称
 * @property {GroupConfig[]} relInfoCodeGroupConfigs 相关信息代码分组配置列表
 */
export interface EquipmentDetail {
    [key: string]: any;
    id: string;
    localName: string;
    objType: string;
    classCode: string;
    dynamicName: string;
    templateTypeId: string;
    templateTypeName: string;
    relInfoCodeGroupConfigs: GroupConfig[];
}

/**
 * 系统类型
 * @description 当前支持 ACAC、ACAI、ACAH，保留字符串扩展能力
 */
export type SystemClassCode = 'ACAC' | 'ACAI' | 'ACAH' | string;

/**
 * 控制参数接口
 * @property {SystemClassCode} systemClassCode 系统类型
 * @property {string} systemId 系统ID
 * @property {string} [consoleTypes] 控制台类型
 * @property {string} beginDate 开始时间
 * @property {string} endDate 结束时间
 */
export interface ControllerParameter {
    systemType: SystemClassCode;
    systemId: string;
    consoleTypes?: string;
    beginDate: string;
    endDate: string;
}

/**
 * 控制台类型映射
 * @description 以 ConsoleTypesEnum 的键为索引，映射控制台展示与控制配置
 */
export type ConsoleTypeMap = Record<
    keyof typeof ConsoleTypesEnum,
    {
        id: keyof typeof ConsoleTypesEnum;
        name: string;
        timeTableName: string;
        code: string[] | string;
        isAir?: boolean;
        lockStatusCode: string;
        lockTip?: string;
        hasLockStatuCodes: string[];
        noUseDefaultReasonCodes: string[];
        show: boolean;
        reason: {
            [key: string]: {
                id: string;
                name: string;
            }[];
        };
        controlList?: ControlListItem[];
    }
>;

/**
 * 控制台类型
 */
export type ConsoleType = ConsoleTypeMap[keyof ConsoleTypeMap];

/**
 * 控制台类型数组
 */
export type ConsoleTypes = Array<ConsoleType>;

/**
 * 获取代码定义配置函数类型
 */
export type GetCodeDefineConfig = (code: string, systemClassCode?: SystemClassCode) => CodeConfig | null;

/**
 * 根据信息点编码返回控制组件函数类型
 */
export type UseComponentByInfoCode = (infoCode: string) => typeof SwitchControl | typeof InputControl | typeof CoolerControl;

/**
 * 冷机数据
 * @description 第一层 key 为设备或分组标识，第二层 key 为信息点编码，value 为数值
 */
export type ChillerData = Record<string, Record<string, number>>;

export interface SystemParamsSetOption {
    id: string;
    name: string;
}

export interface SystemParamsSetLimit {
    min?: number;
    max?: number;
}

export type SystemParamsSpecialInfoCode = string | { infoCode: string };

export interface SystemParamsSetProps {
    systemId?: string;
    runningMonitorType?: string;
    specialInfoCodes?: SystemParamsSpecialInfoCode[];
    specialInfoCodeKey?: Record<string, string>;
    maxAndMin?: Record<string, SystemParamsSetLimit>;
    optionsObj?: Record<string, SystemParamsSetOption[]>;
    handleSpecialInfoCodes?: (
        value: { dataValue?: Record<string, unknown>; infoCode?: string; infoCodeName?: string },
        list: Ref<unknown[]>,
        relateFormList: Ref<unknown[]>
    ) => unknown;
    handleSpecialSubmitFn?: (data: Record<string, unknown>, currentData: { infoCode: string | number; infoCodeType?: unknown }, cb: () => void, cb1?: () => void) => void;
    sseConsoleClient?: Pick<EventTarget, 'addEventListener' | 'removeEventListener'> | null;
    handleSpecialInfoCodesFn?: (
        value: { dataValue?: Record<string, unknown>; infoCode?: string; infoCodeName?: string },
        list: Ref<unknown[]>,
        relateFormList: Ref<unknown[]>
    ) => unknown;
}
