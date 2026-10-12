// @ts-ignore
import i18n from '@/localization';
// 价值选择编码
export const VALUE_SELECTION_CODE = {
    LOWEST_CAST: 'value_select_lowest_cast',
    LOWEST_CARBON_EMISSIONS: 'value_select_Lowest_carbon_emissions',
    LOWEST_ENERGY: 'value_select_lowest_energy',
    QUALITY_FIRST: 'value_select_quality_first'
};
export const LIMIT_VAL_DEF = {
    underCoolingSeasonLimitValue: { title: i18n.global.t('meos_control_web.temperature_overcold_threshold'), index: 0 },
    lowerComfortSeasonLimitValue: { title: i18n.global.t('meos_control_web.temperature_comfort_zone_lower'), index: 1 },
    upperComfortSeasonLimitValue: { title: i18n.global.t('meos_control_web.temperature_comfort_zone_upper'), index: 2 },
    overHeatingSeasonLimitValue: { title: i18n.global.t('meos_control_web.temperature_overheat_threshold'), index: 3 }
};

export const HUMIDITY_LIMIT_VAL_DEF = {
    underCoolingSeasonLimitValue: { title: i18n.global.t('meos_control_web.humidity_over_dry_threshold'), index: 0, valueKey: 'underCoolingSeasonLimitValue' },
    lowerComfortSeasonLimitValue: { title: i18n.global.t('meos_control_web.humidity_comfort_zone_lower_limit'), index: 1, valueKey: 'lowerComfortSeasonLimitValue' },
    upperComfortSeasonLimitValue: { title: i18n.global.t('meos_control_web.humidity_comfort_zone_upper_limit'), index: 2, valueKey: 'upperComfortSeasonLimitValue' },
    overHeatingSeasonLimitValue: { title: i18n.global.t('meos_control_web.humidity_over_wet_threshold'), index: 3, valueKey: 'overHeatingSeasonLimitValue' }
};

export const PRESSURE_DIFF_LIMIT_VAL_DEF = {
    lowerLimitValue: { title: i18n.global.t('meos_control_web.pressure_diff_lower_limit_value'), index: 0, valueKey: 'lowerLimitValue' },
    upperLimitValue: { title: i18n.global.t('meos_control_web.pressure_diff_upper_limit_value'), index: 1, valueKey: 'upperLimitValue' }
};

// 是否显示湿度配置
export const SHOW_HUMIDITY_ENUM = {
    YES: 'YES',
    NO: 'NO'
};

// 是否显示温度/CO2调度配置
export const SHOW_DISPATCH_ENUM = {
    YES: 'YES',
    NO: 'NO'
};

// 是否显示压差配置
export const SHOW_PRESSURE_DIFF_ENUM = {
    YES: 'YES',
    NO: 'NO'
};

export const AIR_SEASON_DEF = {
    AirSummer: i18n.global.t('meos_control_web.summer'),
    AirSummerPeak: i18n.global.t('meos_control_web.summer_peak'),
    AirWinter: i18n.global.t('meos_control_web.winter'),
    AirSeasonSpring: i18n.global.t('meos_control_web.transition_spring_alt'),
    AirSeasonAutumn: i18n.global.t('meos_control_web.transition_autumn')
};
