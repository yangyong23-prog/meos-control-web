import i18n from '@/localization';

export const weekDayToChinese: Record<number, string> = {
    1: i18n.global.t('common.weekday.day1'),
    2: i18n.global.t('common.weekday.day2'),
    3: i18n.global.t('common.weekday.day3'),
    4: i18n.global.t('common.weekday.day4'),
    5: i18n.global.t('common.weekday.day5'),
    6: i18n.global.t('common.weekday.day6'),
    7: i18n.global.t('common.weekday.day7')
};
