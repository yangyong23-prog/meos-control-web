/**
 * 信息点扩展配置的数据值结构
 */
export interface InfoCodeExtendConfigValue {
    manualAutoSet?: number;
    heatDissipationTemperatureDifference?: string;
    coolWaterReturnTempMinValue?: string;
    [key: string]: any;
}

/**
 * 信息点扩展配置的数据值结构
 */
export interface EquipmentValue {
    id: string;
    localName: string;
    objType: string;
    classCode: string;
    dynamicName: string;
    relInfoCodeConfigs?: InfoCodeConfig[];
    relInfoCodeGroupConfigs?: InfoCodeGroupConfig[];
}

/**
 * 信息点配置项
 */
export interface InfoCodeConfig {
    id: string;
    localName: string;
    infoCode: string;
    infoCodeName: string;
    infoCodeType: string;
    existsIotRule: boolean;
    relTemplateTypeId: string;
    scale: number;
    sequence: number;
    unit: string;
    originDataType: string;
    dataTime: string;
    dataValue: string | InfoCodeExtendConfigValue | EquipmentValue[];
    showStyle?: string;
    additionalMapValue: Record<string, any>;
    relInfoCodeConfigs?: InfoCodeConfig[];
    relInfoCodeGroupConfigs?: InfoCodeGroupConfig[];
}

/**
 * 分组子节点配置
 */
export interface GroupChildConfig {
    groupCode: string;
    groupName: string;
    groupOrder: number;
    relInfoCodeConfigs: InfoCodeConfig[];
}

/**
 * 顶层分组配置
 */
export interface InfoCodeGroupConfig {
    groupCode: string;
    groupName: string;
    groupOrder: number;
    groupChildren?: GroupChildConfig[];
    relInfoCodeConfigs?: InfoCodeConfig[];
}

/**
 * 完整的系统信息配置对象
 */
export interface InfoConfig {
    id: string;
    localName: string;
    objType: string;
    classCode: string;
    dynamicName: string;
    templateTypeId: string;
    templateTypeName: string;
    relInfoCodeGroupConfigs: InfoCodeGroupConfig[];
}
