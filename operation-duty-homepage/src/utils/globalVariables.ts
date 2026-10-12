// @ts-ignore
import i18n from '@/localization';
/*
 * @Author: huanghao 755687004@qq.com
 * @Date: 2023-03-30 13:55:26
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2024-12-13 11:20:02
 * @FilePath: \runningcontrolsaasweb\src\utils\globalVariables.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export const EMPTYTEXT = i18n.global.t('operation_duty_homepage.meos_home_required_items_are_not_filled_in');
export const CATEGORY = 'csgc';
export const SUCCESSCODE = '00000';
export const AIR_TERMINAL = 'AIR_TERMINAL';
export const WEEKDAYS: any = {
    MONDAY: i18n.global.t('operation_duty_homepage.meos_home_one'),
    TUESDAY: i18n.global.t('operation_duty_homepage.meos_home_two'),
    WEDNESDAY: i18n.global.t('operation_duty_homepage.meos_home_three'),
    THURSDAY: i18n.global.t('operation_duty_homepage.meos_home_four'),
    FRIDAY: i18n.global.t('operation_duty_homepage.meos_home_five'),
    SATURDAY: i18n.global.t('operation_duty_homepage.meos_home_six'),
    SUNDAY: i18n.global.t('operation_duty_homepage.meos_home_day')
};
export const NameCodeToPath: any = {
    LOGISTICS_VENTILATION: '/ventilation-perception', // 机房后勤
    PARKING_VENTILATION: '/ventilation-perception', // 停车场
    DOME_VENTILATION: '/ventilation-perception', // 穹顶
    TOILET_VENTILATION: '/ventilation-perception', // 卫生间
    NIGHT_SCENE_LIGHTING: '/outdoorlighting', // 夜景照明
    PARKING_LOT_LIGHTING: '/lightxplantrunmonitor', // 停车场照明
    PUBLIC_AREA_LIGHTING: '/lightxplantrunmonitor' // 公共照明
};
export const NameCodeToParams: any = {
    LOGISTICS_VENTILATION: { demandType: 'LOGISTICS_VENTILATION' }, // 机房后勤
    PARKING_VENTILATION: { demandType: 'PARKING_VENTILATION' }, // 停车场
    DOME_VENTILATION: { demandType: 'DOME_VENTILATION' }, // 穹顶
    TOILET_VENTILATION: { demandType: 'TOILET_VENTILATION' }, // 卫生间
    NIGHT_SCENE_LIGHTING: { demandType: 'BUILDING_LIGHTING' }, // 夜景照明
    PARKING_LOT_LIGHTING: { demandType: 'PARKING_LOT_LIGHTING' }, // 停车场照明
    PUBLIC_AREA_LIGHTING: { demandType: 'PUBLIC_AREA_LIGHTING' } // 公共照明
};
export const ERRORMESSAGE = i18n.global.t('common.content_verification_error_please_check');
export const SUCCESSMESSAGE = i18n.global.t('common.operation_success');
export const UPDATE_MODEL_EVENT = 'update:modelValue';
export const CHANGE_EVENT = 'change';
export const INPUT_EVENT = 'input';
export const POSITION = (type?: string) => {
    if (type === 'NoC') {
        return {
            B1: false,
            B2: false,
            T1: false,
            L1: false,
            L2: false,
            R1: false,
            R2: false
        };
    }
    return {
        C1: false,
        C2: false,
        B1: false,
        B2: false,
        T1: false,
        L1: false,
        L2: false,
        R1: false,
        R2: false
    };
};
