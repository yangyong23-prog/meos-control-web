// @ts-ignore
import i18n from '@/localization';
/* eslint-disable */
export const currentDateKey = 'operCriterionCurrentDate';
export const currentSeasonTypeKey = 'operCriterionCurrentSeasonTypeKey';
export const globalConfigKey = 'operCriterionGlobalConfig';
export const currentSelectKey = 'operCriterionSelectKey';
export const hasChartDataKey = 'chartDataKey';
export const projectValueSelectKey = 'projectValueSelectKey';
export const projectValueLoadingKey = 'projectValueLoadingKey';
export const participateInSchedulingKey = 'participateInScheduling';
export const CalendarTagsMap = {
    workday: i18n.global.t('meos_control_web.weekday'),
    dayoff: i18n.global.t('meos_control_web.rest_day'),
    'ACSeason-1': i18n.global.t('meos_control_web.cooling_supply1'),
    'ACSeason-2': i18n.global.t('meos_control_web.heating_supply'),
    'ACSeason-3': i18n.global.t('meos_control_web.no_cooling_no_heating'),
    AirSummer: i18n.global.t('meos_control_web.summer'),
    AirSummerPeak: i18n.global.t('meos_control_web.summer_peak'),
    AirWinter: i18n.global.t('meos_control_web.winter'),
    AirSeasonSpring: i18n.global.t('meos_control_web.transition_spring_alt'),
    AirSeasonAutumn: i18n.global.t('meos_control_web.transition_autumn'),
    autumn: i18n.global.t('meos_control_web.transition_autumn'),
    spring: i18n.global.t('meos_control_web.transition_spring_alt'),
    minorVacation: i18n.global.t('meos_control_web.short_holiday'),
    nationalDay: i18n.global.t('meos_control_web.national_day'),
    newYear: i18n.global.t('meos_control_web.spring_festival'),
    anniversary: i18n.global.t('meos_control_web.store_anniversary_day')
};

export const CalendarTagsBaseMap = {
    workday: i18n.global.t('meos_control_web.weekday'),
    dayoff: i18n.global.t('meos_control_web.rest_day'),
    anniversary: i18n.global.t('meos_control_web.store_anniversary_day'),
    minorVacation: i18n.global.t('meos_control_web.holiday'),
    nationalDay: i18n.global.t('meos_control_web.holiday'),
    newYear: i18n.global.t('meos_control_web.holiday')
};

export const valueSelectTypeMap = {
    value_select_lowest_cast: i18n.global.t('meos_control_web.lowest_cost'),
    value_select_Lowest_carbon_emissions: i18n.global.t('meos_control_web.lowest_carbon_emission'),
    value_select_lowest_energy: i18n.global.t('meos_control_web.min_energy_consumption'),
    value_select_quality_first: i18n.global.t('meos_control_web.optimal_quality')
};

export const scheduleTypeMap = {
    PARTIAL_SCHEDULE: i18n.global.t('meos_control_web.partial_dispatch'),
    ALL_SCHEDULE: i18n.global.t('meos_control_web.participate_dispatch'),
    NON_SCHEDULE: i18n.global.t('meos_control_web.not_participate_dispatch'),
    NON_CONFIG: '--'
};
