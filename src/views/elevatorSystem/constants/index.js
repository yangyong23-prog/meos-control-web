// @ts-ignore
import i18n from '@/localization';
export const STRAIGHT_LADDER_CLASS_CODES = ['ELELEL']; // 直梯classCode
export const ESCALATOR_CLASS_CODES = ['ELELES']; // 扶梯classCode
export const TRACTION_CLASS_CODES = ['ELELET']; // 曳引机classCode
export const DOOR_GROUP_CLASS_CODES = ['CFDRG']; // 门组classCode
export const SHAFT_CLASS_CODES = ['SHAFT']; // 竖井classCode

// 出入口
export const ENTRANCE_AND_EXIT_CODES = ['SFT-03.01.02'];
// 卫生间
export const TOILET_CODES = ['SFT-01.06.00', 'SFT-01.06.01', 'SFT-01.06.02', 'SFT-01.06.03', 'SFT-01.06.04', 'SFT-01.06.05', 'SFT-01.06.06'];

// 移动方向映射图元状态
export const MOVEDIRECT_VAL_MAP_STATE = {
    1: 'goUp',
    2: 'goDown',
    3: 'static'
};

// 电梯运行状态
export const ELEVATOR_STATUS_NAME = {
    onlineStatus: i18n.global.t('meos_control_web.online'),
    lockStatus: i18n.global.t('common.meos_home_the_ladder_is_unlocked'),
    runStatus: i18n.global.t('common.operation')
};
