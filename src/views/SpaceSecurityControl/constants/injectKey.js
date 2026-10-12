// @ts-ignore
import i18n from '@/localization';
export const openDetailDrawerInjectKey = Symbol('openDetailDrawerInjectKey');
export const closeDetailDrawerInjectKey = Symbol('closeDetailDrawerInjectKey');
export const showModuleInfoInjectKey = Symbol('showModuleInfoInjectKey');
export const selectModuleInfoInjectKey = Symbol('selectModuleInfoInjectKey');

export const currentModelInjectKey = Symbol('currentModelInjectKey');

// 静态数据-空间
export const deploymentSpacesKey = Symbol('deploymentSpacesKey');
export const accessSpacesKey = Symbol('accessSpacesKey');
export const staticSpacesKey = Symbol('staticSpacesKey');
export const staticSpacesLoadingKey = Symbol('staticSpacesLoadingKey');
export const getStaticSpacesKey = Symbol('getStaticSpacesKey');

// 静态数据-设备
export const staticEquipsKey = Symbol('staticEquipsKey');
export const staticEquipsLoadingKey = Symbol('staticEquipsLoadingKey');
export const getStaticEquipsKey = Symbol('getStaticEquipsKey');

// 楼层异常id映射
export const floorAbnormalRecordInjectKey = Symbol('floorAbnormalRecordInjectKey');

// 静态对象-ids
export const staticObjectIdsKey = Symbol('staticObjectIdsKey');

// 地图及右侧面板SSE 客户端
export const mapAndRightSSEClientKey = Symbol('mapAndRightSSEClientKey');

// 动态数据-请求
export const getSpaceEquipDynamicDataKey = Symbol('getSpaceEquipDynamicDataKey');

// 建筑树共享 promise（index.vue provide，楼层图复用）
export const buildingTreePromiseInjectKey = Symbol('buildingTreePromiseInjectKey');
