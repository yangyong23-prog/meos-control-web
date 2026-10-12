// 导出一系列的Symbol常量，用于在编辑器及相关图形界面中作为唯一标识符
// 这些Symbol常量用于区分不同的数据键，确保它们在全局范围内是唯一的，从而避免命名冲突
export const editorKey = Symbol('editorKey'); // 关系图
export const infoPointsKey = Symbol('infoPointsKey'); // 信息点
export const equipNamesKey = Symbol('equipNamesKey');
export const graphIdKey = Symbol('graphIdKey');
export const copyCompleteKey = Symbol('copyCompleteKey'); // 复制完成
export const graphHeaderDataKey = Symbol('graphHeaderDataKey');
export const EquipmentNameKey = Symbol('EquipmentNameKey');
export const selectedInformationKey = Symbol('selectedInformationKey');

export const currentTemplateObjectKey = Symbol('currentTemplateObjectKey'); // 关系图 当前模板对象
export const initOriginChartFunKey = Symbol('initOriginChartFunKey'); // 关系图 初始化原图函数
export const recalculatePipelineFunKey = Symbol('recalculatePipelineFunKey'); // 关系图重新计算布局函数
export const legendScaleRatioKey = Symbol('legendScaleRatioKey'); // 放大倍数
export const isEditDetailsKey = Symbol('isEditDetailsKey');
export const globalFontSizeKey = Symbol('globalFontSizeKey');
export const copyGraphTypeListKey = Symbol('copyGraphTypeListKey'); // 副本列表

export const containerBgsPostDataKey = Symbol('containerBgsPostDataKey');

export const currentHeaderItemKey = Symbol('currentHeaderItemKey');
