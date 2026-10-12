/**
 * @property {string} actualInfoCode 实际值的信息点编码
 * @property {string} actualValue 实际值
 * @property {string} infoCode 信息点编码
 * @property {string} infoCodeName 信息点名称
 * @property {string} [interfereEndTime] 干预截至时间
 * @property {LockStatus} [lockStatus] 锁定（20250703改）
 * @property {string} manualAutoSet 手自动标签 0手动，1自动
 * @property {string} setInfoCode 设定值的信息点
 * @property {string} setValue 设定值
 * @property {SwitchSetRecordList[]} [switchSetRecordList] 开关指令的记录日志
 * @property {string} [unit] 单位
 * @property {UnitsNumberValue[]} [unitsNumberActualValue] 台数实际值（和实际值两个必有一个）
 * @property {UnitsNumberValue[]} [unitsNumberSetValue] 台数设定值（和设定值两个必有一个）
 * @property {boolean} [isCommonGroup] 是否公共泵组
 * @property {string} [airTerminalZoneId] 分区id
 * @property {string} [airTerminalZoneName] 分区名称
 * @property {PumpGroup[]} [pumpGroups] 泵组
 * @property {string} [commonGroupId] 公共泵组id
 * @property {string} [commonGroupName] 公共泵组名称
 * @property {ControlListItem[]} [pumpGroupInfoCodes] 泵组信息点
 * @property {string} [switchSetInfoCode] 开关设定开关
 * @property {string} [switchSetInfoCodeName] 开关设定开关名称
 * @property {string} [switchSetValue] 设定值
 */
export interface ControlListItem {
    actualInfoCode: string;
    actualValue: string;
    infoCode: string;
    infoCodeName: string;
    interfereEndTime?: string;
    lockStatus?: LockStatus;
    manualAutoSet: string;
    setInfoCode: string;
    setValue: string;
    switchSetRecordList?: SwitchSetRecordList[];
    unit?: string;
    unitsNumberActualValue?: UnitsNumberValue[];
    unitsNumberSetValue?: UnitsNumberValue[];
    sort?: number;
    id: string;
    classCode: string;
    dataValue: string;
    dataSource?: DataSource[];
    isCommonGroup?: boolean;
    airTerminalZoneId?: string;
    airTerminalZoneName?: string;
    pumpGroups?: PumpGroup[];
    commonGroupId?: string;
    commonGroupName?: string;
    pumpGroupInfoCodes?: ControlListItem[];
    switchSetInfoCode?: string;
    switchSetInfoCodeName?: string;
    switchSetValue?: string;
    scale: number;
}

/**
 * 锁定（20250703改）
 * @property {string} infoCode 信息点编码
 * @property {string} infoCodeName 信息点名称
 * @property {string} [infoCodeValue] 信息点值
 */
export interface LockStatus {
    infoCode: string;
    infoCodeName: string;
    infoCodeValue?: string;
    [property: string]: any;
}

/**
 * @property {string} actualValue 实际值（0关闭  1开启）
 * @property {string} manualAutoSet 手自动标签 0手动，1自动
 * @property {string} operateTime 操作时间
 */
export interface SwitchSetRecordList {
    actualValue: string;
    manualAutoSet: string;
    operateTime: string;
    [property: string]: any;
}

/**
 * @property {string} infoCode 台数编码，例：baseDualNumSet、baseDualSNumSet
 * @property {string} infoCodeName 名称
 * @property {string} infoCodeValue 台数编码对应的设定值，设定的台数值
 */
export interface UnitsNumberValue {
    infoCode: string;
    infoCodeName: string;
    infoCodeValue: string;
    [property: string]: any;
}

/**
 * @property {string} aliasCode 枚举定义的编码
 * @property {string} code 字典标准编码
 * @property {DataSource[]} [dataSource] 枚举类型的枚举定义
 * @property {string} name 枚举名称
 * @property {number} scale 小数位精度
 * @property {string} unit 单位
 */
export interface CodeConfig {
    aliasCode: string;
    code: string;
    dataSource?: DataSource[];
    consoleType?: string;
    name: string;
    scale: number;
    unit: string;
}

/**
 * @property {string} code 标识位
 * @property {string} name 标识位的名称
 */
export interface DataSource {
    code: string;
    name: string;
}

/**
 * @property {ControlListItem[]} airTerminalZones 空调分区list
 * @property {ControlListItem[]} commonGroups 公共泵组
 */
export interface AirData {
    airTerminalZones: ControlListItem[];
    commonGroups: ControlListItem[];
}

/**
 * @property {string} pumpGroupId 泵组id
 * @property {string} pumpGroupName 泵组名称
 * @property {string} classCode 类型
 * @property {string} id id
 * @property {ControlListItem[]} pumpGroupInfoCodes 泵组信息点
 */
export interface PumpGroup {
    id: string;
    classCode: string;
    pumpGroupId: string;
    pumpGroupInfoCodes: ControlListItem[];
    pumpGroupName: string;
}
