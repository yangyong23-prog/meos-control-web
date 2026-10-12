// @ts-ignore
import i18n from '@/localization';
export type StandardRecTangleType = 'auto';

export type DiffRectangleType = 'project' | 'building' | 'floor' | 'space' | 'aggregation';

export type RectangleType = StandardRecTangleType | DiffRectangleType;

export interface Rectangle {
    type: RectangleType;
    configId?: string;
    instanceType?: string;

    timeRange?: string[];
    timeScope?: string;
    timeRangeString?: string;
    name?: string;
    left?: string;
    width?: string;

    isSelf?: boolean;
    isNone?: boolean;
    isMini?: boolean;
    isActive?: boolean;
    isSelected?: boolean;
    isHide?: boolean;

    tempName?: string;
    isAllEmpty?: boolean;
}

export interface RectangleStatus {
    timeRange: string[];
    startTime: number;
    endTime: number;
    type: RectangleType;
    isSelf?: boolean;
    isNone?: boolean;
    name?: string;

    configId?: string;
    instanceType?: string;
}

export interface DemandTreeNode {
    id: string;
    name: string;
    localId?: string;
    localName?: string; // 对象本地名称
    objType?: string; // 对象类型，如空间或设备

    templateType?: string;
    children?: DemandTreeNode[];
}
