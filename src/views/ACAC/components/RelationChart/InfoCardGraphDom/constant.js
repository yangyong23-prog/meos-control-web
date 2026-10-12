// @ts-ignore
import i18n from '@/localization';
export const InfoPointDataType = {
    SINGLE_INFO_CODE: 'singleInfoCode', // 单信息点
    EQUIP_TO_INFO_CODES: 'equipToInfoCodes', // 单设备多信息点
    INFO_CODE_TO_EQUIPS: 'infoCodeToEquips', // 多设备单信息点
    GROUP_NAME: 'groupName', // 分组名称
    TAB: 'tab', // 标签
    TAB_GROUP: 'tabGroup'
};
// 状态列表映射

export const STATUS_NAME = {
    abnormal: 'abnormal',
    inconsistent: 'inconsistent',
    offline: 'offline',
    normal: 'normal',
    porwerDown: 'porwerDown'
};

export const defaultTextSort = 'B1>T2>L1>R1>L2>R2>T1>B2>C1>C2'.split('>');
export const centerTextSort = 'C2>C1>C3>B1>T2>L1>R1>L2>R2>T1'.split('>');
export const topTextSort = 'T1>T2>T3>L1>R1>L2>R2>C1>C2>B1'.split('>');
export const leftTextSort = 'L1>L2>L3>>R1>R2>R3>B1>T2>T1'.split('>');

// 颜色状态定义
export const STATUS_BG_COLOR = {
    [STATUS_NAME.abnormal]: 'rgba(245, 80, 71, 1)',
    [STATUS_NAME.inconsistent]: 'rgba(255, 157, 45, 1)',
    [STATUS_NAME.offline]: 'rgba(171, 173, 176, 1)',
    [STATUS_NAME.normal]: 'rgba(247, 249, 250, 0.8)',
    [STATUS_NAME.porwerDown]: 'rgba(170, 168, 115,1)'
};

// 字体颜色
export const STATUS_FONT_COLOR = {
    [STATUS_NAME.abnormal]: '#ffffff',
    [STATUS_NAME.inconsistent]: '#ffffff',
    [STATUS_NAME.offline]: '#ffffff',
    [STATUS_NAME.normal]: '#626C78',
    [STATUS_NAME.porwerDown]: '#ffffff'
};
