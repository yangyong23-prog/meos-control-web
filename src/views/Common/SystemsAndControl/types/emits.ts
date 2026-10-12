import { ConsoleType, EquipmentData, EquipmentDetail, SystemControlNode } from './index';
import type { ControlListItem } from './control';

export enum ChartEvent {
    OpenEquipment = 'openEquipment',
    CloseEquipment = 'closeEquipment',
    ObjectIdAndInfoCodes = 'objectIdAndInfoCodes',
    ClassCodeEquipIdsMap = 'classCodeEquipIdsMap',
    AfterChartEquipsLoaded = 'afterChartEquipsLoaded'
}

export enum IndexEvent {
    Finally = 'finally',
    OpenBoard = 'openBoard',
    SystemDetailLoaded = 'systemDetailLoaded',
    ControlListLoaded = 'controlListLoaded',
    OpenTimeTable = 'openTimeTable'
}

export enum AirBoxEvent {
    OpenSetForm = 'openSetForm',
    ShowPlanList = 'showPlanList',
    OpenSpaceList = 'openSpaceList'
}

/**
 * 图表事件类型
 * @event openEquipment (event: 'openEquipment', data: unknown): void 打开设备
 * @event closeEquipment (event: 'closeEquipment', type?: boolean): void 关闭设备
 */
export interface ChartEmit {
    (event: ChartEvent.OpenEquipment, data: EquipmentData): void;
    (event: ChartEvent.CloseEquipment, type?: boolean): void;
    (event: ChartEvent.ObjectIdAndInfoCodes, data: Record<string, string[]>): void;
    (event: ChartEvent.ClassCodeEquipIdsMap, data: Record<string, string[]>, type?: string): void;
    (event: ChartEvent.AfterChartEquipsLoaded, data: { systemInfo: SystemControlNode; equipsClassCodes: Record<string, string[]> }): void;
}

export interface IndexEmits extends ChartEmit {
    (event: IndexEvent.Finally, systemList: SystemControlNode[], currentSystem: SystemControlNode | null): void;
    (event: IndexEvent.OpenBoard): void;
    (event: IndexEvent.SystemDetailLoaded, systemData: EquipmentDetail): void;
    (event: IndexEvent.ControlListLoaded, obj: Record<string, string[]>): void;
    (event: IndexEvent.OpenTimeTable, currentConsoleType: ConsoleType | null): void;
}

export interface AirBoxEmits {
    (event: AirBoxEvent.OpenSetForm, ...args: any[]): void;
    (event: AirBoxEvent.ShowPlanList, item: ControlListItem): void;
    (event: AirBoxEvent.OpenSpaceList, item: { airTerminalZoneId: string; airTerminalZoneName: string }): void;
}
