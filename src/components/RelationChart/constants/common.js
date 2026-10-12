// @ts-ignore
import i18n from '@/localization';
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

export const SHOW_DOM_COM_MAP = {
    Name: 'Name',
    IotList: 'IotList',
    LoadingStatus: 'LoadingStatus',
    NodeMark: 'NodeMark',
    PorwerDown: 'PorwerDown'
};

// 需要显示液位的设备类
export const SHOW_LIQUID_CLASSCODE = ['WSSTCP', 'WSSTOS', 'WSSTOR', 'WSSTLU']; // 集水坑 隔油池 餐饮除油成套设备 污废水一体式提升机组

/**
 * 管线流动配置相关
 */
export const LINE_FLOW_CONFIGS = {
    // 冷热源
    COLD_HEAT_SOURCE: {
        // 需要识别的相对的管线类型
        lineTypesInPairs: [{ graphCode: 'ChillWaterLoop' }, { graphCode: 'CoolingWaterLoop' }, { graphCode: 'BuriedWaterNetwork' }],
        // 分集水器对象相关线上需要识别的线类型编码：采暖水关系 地埋管关系
        // 规则2：仅在A、B设备为分水器【ACGEDB】或集水器【ACGECL】且规则1找不到水泵时使用；如果A与B是采暖水关系，那么找to A或 from B具有采暖水关系的水泵；如果A与B是地埋管关系，那么找to A或 from B具有地埋管关系的水泵
        graphCodeForPumps: ['ChillWaterLoop', 'CoolingWaterLoop', 'BuriedWaterNetwork'],
        // 水泵classCode 范围
        pumpClassCodes: ['ACCHCH', 'ACGEFP', 'ACCISP', 'ACCCOP', 'ACCHHP', 'ACCCCP', 'ACCCGP', 'ACCGP', 'ACCPC', 'ACOPC']
    }
};
