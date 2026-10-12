/**
 * 设备拓扑图类型定义
 */

/** 设备类型枚举 */
export type DeviceType =
    | 'ahu' // 空调机组 (Air Handling Unit)
    | 'ahu_small' // 小型空调机组
    | 'vav' // 变风量箱 (Variable Air Volume)
    | 'valve' // 阀门
    | 'reheat_coil' // 再热盘管
    | 'filter' // 过滤器
    | 'fan_coil' // 风机盘管
    | 'exhaust' // 排风机
    | 'control_group' // 控制组（包含多个子设备）
    | 'custom'; // 自定义类型

/** 子设备项（用于控制组） */
export interface SubDeviceItem {
    id: string;
    name: string;
    type: DeviceType;
    /** 设备类编码，对应 assets/svg/SpaceTopologyGraph/card_icon_{classCode}.svg */
    classCode?: string;
    /** 子设备参数数据 */
    data?: Record<string, unknown>;
}

/** 信息点数据结构 */
export interface InfoPoint {
    infoCode: string;
    infoCodeName: string;
    dataValue: string | number;
    unit: string;
    dataSources?: unknown[];
}

/** 设备节点 */
export interface DeviceNode {
    id: string;
    name: string;
    type: DeviceType;
    level: number;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    /** 设备类编码，对应 assets/svg/SpaceTopologyGraph/card_icon_{classCode}.svg */
    classCode?: string;
    data?: Record<string, unknown>;
    /** 控制组专用：子设备列表 */
    children?: SubDeviceItem[];
}

/** 连接类型 */
export type ConnectionType = 'flow' | 'control' | 'data' | 'energy';

/** 连接线 */
export interface Connection {
    id: string;
    source: string;
    target: string;
    type?: ConnectionType;
    label?: string;
    style?: ConnectionStyle;
    hasLoop?: boolean;
}

/** 连接样式 */
export interface ConnectionStyle {
    stroke?: string;
    strokeWidth?: number;
    arrowSize?: number;
    dashed?: boolean;
}

/** 拓扑图数据 */
export interface TopologyData {
    nodes: DeviceNode[];
    connections: Connection[];
    metadata?: {
        name?: string;
        description?: string;
        isolated?: boolean;
    };
}

/** 节点尺寸配置 */
export interface NodeSizeConfig {
    width: number;
    height: number;
}

/** 节点关系 */
export interface NodeRelation {
    nodeId: string;
    incoming: string[];
    outgoing: string[];
}

/** 布局选项 */
export interface LayoutOptions {
    nodeWidth: number;
    nodeHeight: number;
    horizontalGap: number;
    verticalGap: number;
    levelGap: number;
    padding?: { top: number; right: number; bottom: number; left: number };
}

/** 连线路径点 */
export interface ConnectionPath {
    source: { x: number; y: number };
    target: { x: number; y: number };
    points: { x: number; y: number }[];
    path: string;
    isLoop: boolean;
    isAggregated: boolean;
    aggregatedCount?: number;
}

/** 设备类型配置（仅元数据：图标+颜色，无硬编码尺寸和名称） */
export interface DeviceTypeConfig {
    type: DeviceType;
    icon: string;
    color: string;
}

/** 空间环境参数项 */
export interface SpaceEnvItem {
    label: string;
    value: string;
    unit: string;
}

/** 空间统计信息 */
export interface SpaceStats {
    name: string;
    location: string;
    area: string;
    environment: SpaceEnvItem[];
}

/** 设备分组数据 */
export interface EquipmentData {
    groups: TopologyData[];
}
