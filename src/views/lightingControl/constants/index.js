// @ts-ignore
import i18n from '@/localization';
// 公共照明地图tabs id枚举
export const PUB_MAP_TABS = {
    OPEN_CLOSE: 'openCloseStatus',
    ABNORMAL: 'abnormalStatus',
    INTERVENED: 'intervened'
};

export const INTERVENED_ENUM = {
    DEMAND_INTERVENTION: 'DEMAND_INTERVENTION',
    MANUAL_CONTROL: 'MANUAL_CONTROL'
};

//功能类型、灯具类型 settingMode 枚举
export const SMD_ALL_OPEN = 'ALL_OPEN';
export const SMD_ALL_CLOSE = 'ALL_CLOSE';
export const SMD_PARTIAL_OPEN = 'PARTIAL_OPEN';
export const NOT_CONFIGURED = 'NOT_CONFIGURED';
export const FEEDBACK_ADJUSTMENT = 'FEEDBACK_ADJUSTMENT';
export const INSTANCE_GROUP = 'INSTANCE_GROUP';

//全部回路反馈、部分回路反馈
export const ALL_FEEDBACK = 'ALL_FEEDBACK';
export const PARTIAL_FEEDBACK = 'PARTIAL_FEEDBACK';

// 参与反馈调节、不参与反馈调节
export const JOIN_FEEDBACK = 'JOIN_FEEDBACK';
export const NO_JOIN_FEEDBACK = 'NO_JOIN_FEEDBACK';

// 回路 settingMode 枚举
export const SMD_OPEN = 'OPEN';
export const SMD_CLOSE = 'CLOSE';
