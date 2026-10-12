/* eslint-disable no-shadow */
import { Unit } from '@/types/common';
import { PAGE_BROADCAST } from '@/utils/SSEEventTypes';
import { ComponentPublicInstance } from 'vue';
export type RefItem = Element | ComponentPublicInstance | null;
export type Size = {
    w: number;
    h: number;
};
export interface Location {
    x: number;
    y: number;
}

export interface DataObject {
    equipO2OLocalName: string;
    classCode: string;
    creationTime: string;
    creator: string;
    id: string;
    localId: string;
    localName: string;
    modifiedTime: string;
    modifier: string;
    name: string;
    objType: string;
    projectId: string;
    valid: number;
}
export type IIModelOption = {
    id: string;
    viewType: string;
    initData: any;
    data: {
        id: string;
        dataObject: DataObject;
        dataObjectId: string;
        location: Location;
        size: Location;
        [key: string]: any;
    };
    x?: number;
    y?: number;
    size?: Size;
    stateStyles?: {
        [key: string]:
            | { [key: string]: any }
            | {
                  [key: string]: { [key: string]: any };
              };
    };
    textMap: { [key: string]: { size: Location; location: Location } };
    [key: string]: any;
};
export interface IOTObject {
    textMap?: string;
    isStrategy?: boolean;
    infoCode: string;
    name: string;
    unit?: Unit;
    dataValue: number | string | null;
    max?: number;
    min?: number;
    forced?: number;
    dataSource?: Record<string, string>[] | null;
    createTime?: string;
    forceInfo?: IOTObject[];
    value?: number | string | null;
    isEdit?: boolean;
    ordered?: number;
    components?: string[];
    objectId: string;
    [key: string]: any;
}
export interface IOT {
    runInfosName: string;
    runInfos: IOTObject[];
    runSetName: string;
    runSet: IOTObject[];
    basicInfosName: string;
    basicInfos: IOTObject[];
    homeInfos: IOTObject[];
}
export interface EquipmentNodes extends IIModelOption {
    item: { homeInfos: any };
    states: string[];
    Iot: IOT;
    manualAutoSet: boolean;
    stateInfoCode: { [key: string]: any };
    isPassBy: boolean;
    select: boolean;
}
export interface Params {
    data: any;
    time: string;
    reason: string;
    content: string;
    max: string;
    min: string;
    sysSwitchSet: string;
    infoCode: string;
    enableCtrl: string;
}

export interface InfoCode {
    groupId: string;
    groupName: string;
    infoCodes: IOTObject[];
    parentId: string;
    children?: InfoCode[];
}
// 系统运行状况详情
export interface SystemRunningConditionInfo {
    basicInfoCode: InfoCode[];
    controlInfoCode: InfoCode[];
    extraInfo: Record<string, any>;
    homeInfoCode: InfoCode[];
    runInfoCode: InfoCode[];
    [key: string]: any;
}

export interface Weather {
    check: boolean;
    code: string;
    explain: string;
    name: string;
}
export interface WeatherList {
    icon: string;
    title: string;
    dataValue: number;
    unit: string;
}
export interface SystemRunInfoObject {
    id: string;
    name: string;
    list: IOTObject[];
}

export interface Strategy {
    name: string;
    id: string;
    infoCodes: IOTObject[];
}

export interface FanList {
    id: string;
    name: string;
    infoCodes: IOTObject[];
    classCode: string;
    states: string[];
    stateInfoCode: { [key: string]: { dataValue: any; dataValueName: string; name: string; [key: string]: any } };
}

export interface EchartLineData {
    name: string;
    data: Array<number | null>;
    smooth?: boolean;
    areaStyle?: Record<string, any>;
    lineStyle?: Record<string, any>;
}

export interface WebSocketObject {
    systemId: string;
    objectId: string;
    infoCode: string;
    dataValue: any;
    dataTime: string;
    dataStatus: number;
    invalid: number;
    type: number;
    webType: 'PARAM_SET' | typeof PAGE_BROADCAST | 'SYSTEM_DATE_CHANGE' | 'system_date_change';
    getDataTime: string;
}
