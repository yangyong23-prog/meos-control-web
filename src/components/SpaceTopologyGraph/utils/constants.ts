/*
 * @Author: wulong wulong@yushu.biz
 * @Date: 2026-05-06 17:33:16
 * @LastEditors: wulong wulong@yushu.biz
 * @LastEditTime: 2026-05-06 17:35:15
 * @FilePath: /meos-control-web/src/components/SpaceTopologyGraph/utils/constants.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 拓扑图常量配置
 */
import type { DeviceTypeConfig, LayoutOptions, ConnectionStyle } from '../types/topology';

/** 设备类型配置列表（仅元数据，无硬编码尺寸） */
export const DEVICE_TYPE_CONFIGS: DeviceTypeConfig[] = [
    { type: 'ahu', icon: 'ahu', color: '#409eff' },
    { type: 'ahu_small', icon: 'ahu_small', color: '#67c23a' },
    { type: 'vav', icon: 'vav', color: '#e6a23c' },
    { type: 'valve', icon: 'valve', color: '#909399' },
    { type: 'reheat_coil', icon: 'reheat_coil', color: '#f56c6c' },
    { type: 'filter', icon: 'filter', color: '#909399' },
    { type: 'fan_coil', icon: 'fan_coil', color: '#67c23a' },
    { type: 'exhaust', icon: 'exhaust', color: '#e6a23c' },
    { type: 'control_group', icon: 'control_group', color: '#9c27b0' },
    { type: 'custom', icon: 'custom', color: '#606266' }
];

/** 默认布局选项 */
export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
    nodeWidth: 120,
    nodeHeight: 80,
    horizontalGap: 100,
    verticalGap: 50,
    levelGap: 28
};

/** 默认连接样式（设计图规范：蓝色虚线+箭头，宽度1.5px） */
export const DEFAULT_CONNECTION_STYLE: ConnectionStyle = {
    stroke: '#246EE5',
    strokeWidth: 1.5,
    arrowSize: 8,
    dashed: true
};

/** 汇总连接样式 */
export const AGGREGATED_CONNECTION_STYLE: ConnectionStyle = {
    stroke: '#246EE5',
    strokeWidth: 2.5,
    arrowSize: 10,
    dashed: false
};

/** 环状连接样式 */
export const LOOP_CONNECTION_STYLE: ConnectionStyle = {
    stroke: '#e6a23c',
    strokeWidth: 1.5,
    arrowSize: 8,
    dashed: true
};

/** 连线间距 */
export const CONNECTION_GAP = 28;

/** 汇总箭头基础宽度 */
export const AGGREGATED_ARROW_BASE_WIDTH = 1.5;

/** 环状连接弯折偏移量 */
export const LOOP_OFFSET_X = 50;
export const LOOP_OFFSET_Y = 30;

/** 画布缩放范围 */
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2;

/** 节点选中样式 */
export const SELECTED_NODE_STYLE = {
    borderColor: '#409eff',
    boxShadow: '0 0 0 2px rgba(64, 158, 255, 0.3)'
};

/** 节点悬浮样式 */
export const HOVER_NODE_STYLE = {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    borderColor: '#409eff'
};

/** 获取设备类型配置 */
export function getDeviceTypeConfig(type: string): DeviceTypeConfig | undefined {
    return DEVICE_TYPE_CONFIGS.find(config => config.type === type);
}
