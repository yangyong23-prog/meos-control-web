import i18n from '@/localization';
export const templateDemandTypeInjectKey = Symbol('templateDemandTypeInjectKey');
export const runningMonitorTypeInjectKey = Symbol('runningMonitorTypeInjectKey');
export const runningMonitorSecondTypeInjectKey = Symbol('runningMonitorSecondTypeInjectKey');

export const buildingFloorSpaceTreeKey = Symbol('buildingFloorSpaceTreeKey');
export const buildingFloorSpaceTreeLoadingKey = Symbol('buildingFloorSpaceTreeLoadingKey');
// 是否为今日的过去的日期配置
export const isBeforeTodayDateConfigKey = Symbol('isBeforeTodayDateConfigKey');
// 今日及过去的日期值
export const pastDateStringKey = Symbol('pastDateStringKey');
// 是否隐藏操作配置按钮
export const isHideActionKey = Symbol('isHideActionKey');

// 静态树
export const staticTreeInjectKey = Symbol('staticTreeInjectKey');
export const staticTreeIsLoadingInjectKey = Symbol('staticTreeIsLoadingInjectKey');
export const updateStaticTreeInjectKey = Symbol('updateStaticTreeInjectKey');
export const selectedTreeNodeIdsInjectKey = Symbol('selectedTreeNodeIdsInjectKey');
export const treeInstanceInjectKey = Symbol('treeInstanceInjectKey');
// 动态加载的空间数据
export const dynamicSpacesDataInjectKey = Symbol('dynamicSpacesDataInjectKey');
export const getDynamicSpacesDataInjectKey = Symbol('getDynamicSpacesDataInjectKey');
export const reloadDynamicNodesInjectKey = Symbol('reloadDynamicNodesInjectKey');
export const dynamicSpacesDataLoadingInjectKey = Symbol('dynamicSpacesDataLoadingInjectKey');
export const isLoadingFloorIdsInjectKey = Symbol('isLoadingFloorIdsInjectKey');
// 屏蔽和黑名单
export const shieldedAndBlackListInjectKey = Symbol('shieldedAndBlackListInjectKey');
export const shieldedSpaceIdsInjectKey = Symbol('shieldedSpaceIdsInjectKey');
export const blackListSpaceIdsInjectKey = Symbol('blackListSpaceIdsInjectKey');
export const treeShieldedSpaceCountInjectKey = Symbol('treeShieldedSpaceCountInjectKey');
export const treeBlackListSpaceCountInjectKey = Symbol('treeBlackListSpaceCountInjectKey');
export const updateShieldedAndBlackListInjectKey = Symbol('updateShieldedAndBlackListInjectKey');
export const isShieldedAndBlackListLoadingInjectKey = Symbol('isShieldedAndBlackListLoadingInjectKey');
// 黑名单树数据
export const blackListInitTreeLoadingInjectKey = Symbol('blackListInitTreeLoadingInjectKey');
export const blackListInitTreeDataInjectKey = Symbol('blackListInitTreeDataInjectKey');
// 黑名单空间功能类型列表
export const blackListSpaceTypeListInjectKey = Symbol('blackListSpaceTypeListInjectKey');
export const blackListSpaceTypeListLoadingInjectKey = Symbol('blackListSpaceTypeListLoadingInjectKey');

// 特殊配置的实例
export const customConfigIdsInjectKey = Symbol('customConfigIdsInjectKey');
export const customConfigInstancesInjectKey = Symbol('customConfigInstancesInjectKey');
// 楼层下引用上级的空间
export const floorIdToReferenceSpacesInjectKey = Symbol('floorIdToReferenceSpacesInjectKey');
// 需求配置列表默认tab
export const configListTabInjectKey = Symbol('configListTabInjectKey');

export const currentFloorObjInjectKey = Symbol('currentFloorObjInjectKey');
export const floorViewInjectKey = Symbol('floorViewInjectKey');

export const showModuleInfoInjectKey = Symbol('showModuleInfoInjectKey');
export const selectModuleInfoInjectKey = Symbol('selectModuleInfoInjectKey');
export const instanceTypeInjectKey = Symbol('instanceTypeInjectKey');
export const instanceIdInjectKey = Symbol('instanceIdInjectKey');

export const templateIdInjectKey = Symbol('templateIdInjectKey');
export const templateTagInjectKey = Symbol('templateTagInjectKey');
export const configListDataInjectKey = Symbol('configListDataInjectKey');

export const rightConfigExpandDisabledTxtInjectKey = Symbol('rightConfigExpandDisabledTxtInjectKey');
export const rightConfigExpandInjectKey = Symbol('rightConfigExpandInjectKey');
export const isProjectKey = Symbol('isProjectKey');
export const isSpaceKey = Symbol('isSpaceKey');
export const acEditFormKey = Symbol('acEditFormKey');
export const isFuncTypeKey = Symbol('isFuncTypeKey');
