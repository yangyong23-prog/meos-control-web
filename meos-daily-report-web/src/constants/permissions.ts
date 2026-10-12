/**
 * 权限点常量定义
 * 统一管理所有权限点 ID
 */
export const PERMISSIONS = {
    // 运行复盘报告编辑
    RUNRETROREPORT_EDIT: 'runretroreportedit',

    // 下载日报报告
    DOWNLOAD_DAILY_REPORT: 'runretroreportdownloadcsv',

    // 热源控制
    HEAT_CONTROL: 'heatControl',

    // 关注空间
    CONCERN_SPACE: 'Concernspace',

    // 冷源控制
    COLD_CONTROL: 'coldControl',

    // 监控组访问
    MONITOR_GROUP_ACCESS: 'MonitorGroupAccess',

    // 公共照明
    PUBLIC_LIGHTING: 'xPublicLighting',

    // 冷热源设备控制
    COOL_HOT_SYS_EQ_CONTROL: 'xpruncseqcontrol',

    // 空调冷源
    AIR_CONDITIONING_COLD_SOURCE: 'airConditioningColdSource',

    // 空调热源
    AIR_CONDITIONING_HEAT_SOURCE: 'airConditioningHeatSource',

    // ACCC
    ACCC: 'ACCC',

    // ACCH 手动干预
    ACCH_MANUAL_INTERVENTION: 'ACCHManual intervention',

    // 冷热源系统控制
    COOL_HOT_SYS_CONTROL: 'coolhotsyseqcontrol',

    // SPEVCD 状态与控制
    STATUS_AND_CONTROL_SPEVCD: 'StatusAndControl_SPEVCD',

    // AC 状态与控制
    STATUS_AND_CONTROL_AC: 'StatusAndControl_AC',

    // 照明监控
    LIGHT_MONITORING: 'LIGHT_MONITORING',

    // 编辑标准
    EDITING_STANDARDS: 'editingStandards'
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
