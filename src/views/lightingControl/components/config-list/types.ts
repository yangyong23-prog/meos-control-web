// @ts-ignore
import i18n from '@/localization';
export interface SummaryItem {
    total?: number;
    openCount?: number;
    closeCount?: number;
    unConfigCount?: number;
}

export interface CircuitSetting {
    circuitId: string; //回路ID
    circuitLocalId: string; //回路本地编码
    circuitLocalName: string; //回路本地名称
    lampFuncType: string; //照明回路灯具功能类型
    lampFuncTypeName: string; //照明回路灯具功能类型名称

    settingMode?: string; //回路模式
    serviceAreaType?: string;
    funcType?: string; //照明回路功能类型
    autoCtrlType?: string[];

    summary?: SummaryItem;
}

export interface FuncTypeSetting {
    funcType: string; //照明回路功能类型
    funcTypeName: string; //照明回路功能类型名称
    circuitIds: string[]; // 回路ID
    circuitSettings: CircuitSetting[]; //回路配置

    settingMode?: string; //类型配置模式
    summary?: SummaryItem;
}

export interface SpaceFuncType {
    key: string;
    value: string;
}

// 全局配置
export interface GlobalSetting {
    funcTypeSettings: FuncTypeSetting[];
    summary: SummaryItem;
    configId?: string;
}

export interface spaceFeedbackAdjustSetting {
    configId: string;
    lightingCircuits: Array;
    spaceFeedbackAdjustSetting: Object;
}
// 空间功能配置
export interface SpaceFuncSetting {
    spaceFuncTypes: SpaceFuncType[]; //空间功能类型
    funcTypeSettings: FuncTypeSetting[];
    summary: SummaryItem;
}

export interface ConfigDataItem {
    global?: GlobalSetting;
    space?: {
        settings?: SpaceFuncSetting[];
    };
    spaceFeedbackAdjust?: {};
}

export interface ListItem {
    title: string;
    summary?: SummaryItem;
    arr?: any[];
    status?: string;
    isGlobal?: boolean;

    funcTypeSettings?: FuncTypeSetting[];
}
