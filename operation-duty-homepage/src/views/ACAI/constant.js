// @ts-ignore
import i18n from '@/localization';
/**
 * @description 信息名称映射
 */
export const INFONAMES = {
    heatWaterMainReturnTemp: i18n.global.t('operation_duty_homepage.heatWaterMainReturnTemp'),
    primaryChillWaterMainSupplyTemp: i18n.global.t('operation_duty_homepage.primaryChillWaterMainSupplyTemp'),
    primaryChillWaterMainReturnTemp: i18n.global.t('operation_duty_homepage.primaryChillWaterMainReturnTemp'),
    secondarySupplyTemp: i18n.global.t('operation_duty_homepage.secondarySupplyTemp'),
    secondaryReturnTemp: i18n.global.t('operation_duty_homepage.secondaryReturnTemp')
};
/**
 * @description 供热开关设定
 */
export const HEATING_SWITCH_SET = 'heatingSwitchSet';
export const COOLING_SUPPLY_SWITCH_SET = 'coolingSupplySwitchSet';

/**
 * @description 排序字段
 */
export const INFO_ORDERS = {
    primaryChillWaterMainSupplyTemp: 0.2,
    primaryChillWaterMainReturnTemp: 0.3,
    secondarySupplyTemp: 0.4,
    secondaryReturnTemp: 0.5,
    ACAHC: 5,
    ACCCGH: 6,
    ACCCWH: 7,
    ACCCAC: 8
};
/**
 * @description 不在控值信息码列表中的信息码
 */
export const NO_IN_CONTROL_INFOCODES = ['secondarySupplyTemp', 'secondaryReturnTemp', 'primaryChillWaterMainSupplyTemp', 'primaryChillWaterMainReturnTemp'];
