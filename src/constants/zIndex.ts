/**
 * 根应用常用层级配置。
 *
 * 说明：
 * - 仅收敛跨组件复用、且容易发生层级冲突的默认值。
 * - 与 `src/styles/var.less` 中的 `--z-index-*` 变量保持同值，分别覆盖脚本和样式场景。
 * - 组件内部局部层级（如局部 hover、列表项覆盖）暂不统一迁移，避免扩大改动范围。
 */
export const Z_INDEX = {
    controlPop: 55,
    /** 系统图头部 */
    systemGraphHeader: 66,
    /** 通用抽屉 */
    commonDrawer: 150,
    /** 通用系统设置抽屉（如冷系统设置） */
    commonSystemSetDrawer: 80,
    /** 页内日程/面板 */
    timetable: 70,
    /** 详情抽屉 / 关联空间抽屉 */
    equipmentList: 100,
    /** 高优先级详情抽屉 */
    priorityDrawer: 200,
    /** 聚合悬浮卡片 */
    floatingCard: 200,
    /** hover 态浮层 */
    hoverCard: 999,
    /** 二级确认弹窗 */
    modalConfirm: 3000,
    /** 表格 tooltip 等全局提示 */
    tableTooltip: 4000,
    /** AC Operation Control - 右侧加载遮罩 */
    acOperationControlRightLoadingMask: 4000,
    /** 下拉选择类浮层 */
    selectDropdown: 10000
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
