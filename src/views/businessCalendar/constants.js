import i18n from '@/localization';

export const BUSINESS_CONFIG_TYPE = {
    Default: 'Default',
    Workday: 'Workday',
    Week: 'Week'
};

export const BUSINESS_CONFIG_RADIO_OPTIONS = [
    {
        label: i18n.global.t('meos_control_web.uniform_throughout_year'),
        value: 'Default'
    },
    {
        label: i18n.global.t('meos_control_web.distinguish_work_rest_day'),
        value: 'Workday'
    },
    {
        label: i18n.global.t('meos_control_web.week_number_configuration'),
        value: 'Week'
    }
];

export const BUSINESS_CONFIG_DOM_CONTAINER = 'business-config-dom-container';

export const WEEK_OPTIONS = [
    { label: i18n.global.t('common.weekday.day1'), value: 'MONDAY' },
    { label: i18n.global.t('common.weekday.day2'), value: 'TUESDAY' },
    { label: i18n.global.t('common.weekday.day3'), value: 'WEDNESDAY' },
    { label: i18n.global.t('common.weekday.day4'), value: 'THURSDAY' },
    { label: i18n.global.t('common.weekday.day5'), value: 'FRIDAY' },
    { label: i18n.global.t('common.weekday.day6'), value: 'SATURDAY' },
    { label: i18n.global.t('common.weekday.day7'), value: 'SUNDAY' }
];

export const HOVER_DATA_TYPE = {
    WITH_YEAR: 'withYear'
};

export const WEEK_DAYS_MATCH_MAP = {
    MONDAY: { title: i18n.global.t('common.weekday.week1'), order: 1, alias: i18n.global.t('common.weekday.day1') },
    TUESDAY: { title: i18n.global.t('common.weekday.week2'), order: 2, alias: i18n.global.t('common.weekday.day2') },
    WEDNESDAY: { title: i18n.global.t('common.weekday.week3'), order: 3, alias: i18n.global.t('common.weekday.day3') },
    THURSDAY: { title: i18n.global.t('common.weekday.week4'), order: 4, alias: i18n.global.t('common.weekday.day4') },
    FRIDAY: { title: i18n.global.t('common.weekday.week5'), order: 5, alias: i18n.global.t('common.weekday.day5') },
    SATURDAY: { title: i18n.global.t('common.weekday.week6'), order: 6, alias: i18n.global.t('common.weekday.day6') },
    SUNDAY: { title: i18n.global.t('common.weekday.week7'), order: 7, alias: i18n.global.t('common.weekday.day7') }
};

export const SEASON_MATCH_MAP = {
    airSummerRangeList: { title: i18n.global.t('meos_control_web.summer'), order: 2 },
    airWinterRangeList: { title: i18n.global.t('meos_control_web.winter'), order: 5 },
    airSummerPeakRangeList: { title: i18n.global.t('meos_control_web.summer_peak'), order: 3 },
    airSeasonSpringRangeList: { title: i18n.global.t('meos_control_web.transition_spring'), order: 1 },
    airSeasonAutumnRangeList: { title: i18n.global.t('meos_control_web.transition_season_autumn'), order: 4 }
};
