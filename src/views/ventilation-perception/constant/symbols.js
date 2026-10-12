// @ts-ignore
import i18n from '@/localization';
// 左侧 menu tab
export const templateNameKey = 'templateName';
export const templateTypeKey = 'templateType';

// 顶部 tab 异常状态
export const showAbnormalStateKey = Symbol();

// 切换 menu tab 加载空间数据
export const loadingSpaceDataKey = Symbol();
export const currentSpaceDataKey = Symbol();

// 选中的楼层
export const curFloorIdKey = Symbol();

// 选中的空间信息
export const showSpaceInfoKey = Symbol();

// 选中的模块信息
export const showModuleInfoKey = Symbol();

// 空间模块信息
export const spaceModuleInfoKey = Symbol();

// sse client 实例
export const sseClientKey = Symbol();

// 建筑信息异步获取
export const buildingInfoPromiseKey = Symbol();
//   allEquipsData.value = [];
//   allSpacesData.value = [];

export const allEquipsInjectKey = Symbol('allEquips');
export const allSpacesInjectKey = Symbol('allSpaces');
export const spacesAndEquipsLoadingInjectKey = Symbol('spacesAndEquipsLoading');

export const EQUIP_TYPE_DICT = {
    SEND_FAN: i18n.global.t('meos_control_web.supply_fan'),
    RECEIVE_FAN: i18n.global.t('meos_control_web.exhaust_fan')
};
export const RECEIVE_FAN = 'RECEIVE_FAN';
export const SEND_FAN = 'SEND_FAN';
// 排风机
export const FFSCAF_CLASSCODE = 'FFSCAF';
// 送风机
export const FFSCMF_CLASSCODE = 'FFSCMF';

export const clickMapObjInjectKey = Symbol('clickMapObjKey');
export const buildFloorMapRefInjectKey = Symbol('buildFloorMapRefKey');
export const headerModelViewKey = Symbol('headerModelViewKey');

export const buildingFloorSpacesStaticTreeKey = Symbol('buildingFloorSpacesStaticTree');
export const spaceStaticDataLoadingKey = Symbol('spaceStaticDataLoading');
export const mapStaticDataLoadingKey = Symbol('mapStaticDataLoading');
export const spaceIotDataLoadingKey = Symbol('spaceIotDataLoading');
export const mapAndRightSSEClientKey = Symbol('mapAndRightSSEClientKey');
export const abnormalParamIdsKey = Symbol('abnormalParamIdsKey');
export const mapClassCodeIdsKey = Symbol('mapClassCodeIdsKey');

export const floorFromeKey = Symbol('floorFromeKey');
