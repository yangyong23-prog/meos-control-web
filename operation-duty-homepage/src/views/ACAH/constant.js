// @ts-ignore
import i18n from '@/localization';
/**
 * @description 信息名称映射
 */
export const INFONAMES = {
    heatWaterMainReturnTemp: i18n.global.t('operation_duty_homepage.heatWaterMainReturnTemp'),
    '2heatWaterMainSupplyTemp': i18n.global.t('operation_duty_homepage.2heatWaterMainSupplyTemp'),
    '2heatWaterMainReturnTemp': i18n.global.t('operation_duty_homepage.2heatWaterMainReturnTemp')
};
/**
 * @description 供热开关设定
 */
export const HEATING_SWITCH_SET = 'heatingSwitchSet';

/**
 * @description 排序字段
 */
export const INFO_ORDERS = {
    heatWaterMainSupplyTemp: 0.5,
    heatWaterMainReturnTemp: 1,
    '2heatWaterMainSupplyTemp': 2,
    '2heatWaterMainReturnTemp': 3,
    ACCHXB: 4,
    ACAHC: 6,
    ACCCGH: 7,
    ACCCWH: 8,
    ACCCAC: 9
};
/**
 * @description 不在控值信息码列表中的信息码
 */
export const NO_IN_CONTROL_INFOCODES = ['heatWaterMainReturnTemp', '2heatWaterMainSupplyTemp', '2heatWaterMainReturnTemp'];
