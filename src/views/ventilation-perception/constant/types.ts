// @ts-ignore
import i18n from '@/localization';
export interface MenuItem {
    id: string;
    name: string;
    icon: string;
}

export interface FloorItem {
    id: string;
    localId: string;
    dot?: boolean;
    floorSequenceId?: number;
    buildingId?: string;
    [key: string]: any;
}

export interface BuildingFloorItem {
    id: string; // 建筑ID
    name?: string;
    localName?: string;
    disabled?: boolean;
    floorList?: FloorItem[];
}
