// 风口类(使用‘回’可缩放图标的)
const ReturnAirOutlet = {
    ACATIO: '空调风口',
    ACVTIO: '通风风口',
    ACKLIO: '厨房排油烟风口',
    ACADIO: '人防通风口',
    FFSCIO: '消防排烟口',
    FFSCEO: '排风兼消防排烟口',
    FFSCPO: '加压送风口',
    FFSCMO: '消防补风口',
    FFSCSO: '送风兼消防补风口'
};

/**
 * 判断是回风口类(使用‘回’可缩放图标的)
 * @param {设备类编码} classCode
 * @returns
 */
export const isReturnAirOutlet = classCode => !!ReturnAirOutlet[classCode];

/**
 * 是管道类
 * @param {*} classCode
 * @returns
 */
export const isPipe = classCode => typeof classCode === 'string' && classCode && classCode.slice(2, 4) === 'PP';

// 是否是机房土建设备类
export const isMachineRoomCF = classCode => {
    return typeof classCode === 'string' && classCode && classCode.slice(0, 2) === 'CF' && !['CFSSAD', 'CFCSDR', 'CFCSED', 'CFCSFR'].includes(classCode);
};
