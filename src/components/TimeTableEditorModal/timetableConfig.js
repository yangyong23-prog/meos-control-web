/* eslint-disable camelcase */
import dayjs from 'dayjs';
import i18n from '@/localization';

export const COOLMODE = {
    CHILLER_COOL: 'CHILLER_COOL',
    DE_ICE_COOL: 'DE_ICE_COOL',
    FREE_COOL: 'FREE_COOL',
    CITY_COOL: 'CITY_COOL'
};

export const SAVE_DATA_TYPE = {
    ADD_OPER: 'ADD_OPER',
    EDIT_OPER: 'EDIT_OPER'
};

export const CHILLER_COOL_MODE_ALLOWED_CODES = {
    ACSCG: true,
    BASE: true,
    ACCCCC: true,
    ACCCSC: true,
    BASE_DUAL: true,
    ACCCCC_DUAL: true,
    ACCCSC_DUAL: true,
    ACCCWH_DUAL: true,
    ACCCGH_DUAL: true,
    ACAHC: true,
    ACCCGH: true,
    ACCCWH: true,
    ACCCAC: true
};

export const COOLMODE_OPTION_ARR = [COOLMODE.CHILLER_COOL, COOLMODE.CITY_COOL, COOLMODE.DE_ICE_COOL, COOLMODE.FREE_COOL];

export const formatTime = (originTime, needSec = true) => {
    return dayjs('1900-01-01 ' + originTime).format('HH:mm') + (needSec ? ':00' : '');
};

export const WEEK_OPTIONS = [
    { label: i18n.global.t('common.weekday.day1'), value: '1' },
    { label: i18n.global.t('common.weekday.day2'), value: '2' },
    { label: i18n.global.t('common.weekday.day3'), value: '3' },
    { label: i18n.global.t('common.weekday.day4'), value: '4' },
    { label: i18n.global.t('common.weekday.day5'), value: '5' },
    { label: i18n.global.t('common.weekday.day6'), value: '6' },
    { label: i18n.global.t('common.weekday.day7'), value: '7' }
];

export const WEEK_TAG_OPTIONS = [
    { label: i18n.global.t('meos_control_web.weekday'), value: 'workday' },
    { label: i18n.global.t('meos_control_web.rest_day'), value: 'dayoff' }
];

export const COOL_MODE_OPTION_DEFINE = {
    [COOLMODE.CHILLER_COOL]: { label: i18n.global.t('meos_control_web.chiller_cooling'), value: COOLMODE.CHILLER_COOL },
    [COOLMODE.DE_ICE_COOL]: { label: i18n.global.t('meos_control_web.cold_discharge_cooling'), value: COOLMODE.DE_ICE_COOL },
    [COOLMODE.FREE_COOL]: { label: i18n.global.t('meos_control_web.free_cooling_supply'), value: COOLMODE.FREE_COOL },
    [COOLMODE.CITY_COOL]: { label: i18n.global.t('meos_control_web.city_cooling_supply'), value: COOLMODE.CITY_COOL }
};

export const EMPTYTEXT = i18n.global.t('meos_control_web.input_required_check_error_4');

// 冷机代码定义
export const CHILLER_CODE = () => ({
    LARGE: { id: 'LARGE', name: i18n.global.t('common.large'), shortName: i18n.global.t('common.large_short') }, // 大冷机
    M1: { id: 'M1', name: i18n.global.t('common.mid'), shortName: i18n.global.t('common.mid_short') }, // 中冷机
    SMALL: { id: 'SMALL', name: i18n.global.t('common.small'), shortName: i18n.global.t('common.small_short') } // 小冷机
});

export const EFFECT_DATE_TYPES = {
    GENERAL: { id: 'GENERAL', name: i18n.global.t('meos_control_web.by_date_zone') },
    WEEK_TAG: { id: 'WEEK_TAG', name: i18n.global.t('meos_control_web.by_date_type') },
    WORK_TAG: { id: 'WORK_TAG', name: i18n.global.t('meos_control_web.by_work_reset_day') }
};

export const WORK_TAGS = {
    WORKDAY: 'workday',
    DAYOFF: 'dayoff'
};

/**
 *
 * @param {*} chillerType
 * @returns
 */
export const getChillerMeasureWord = chillerType => {
    return chillerType === 'ACSCG' ? i18n.global.t('common.group') : i18n.global.t('common.tai');
};

export const STRATEGY_STYLE_MAP = {
    HEAT_SUPPLY: {
        background: 'linear-gradient(90deg, rgba(245, 80, 71, 0.12) 0%, rgba(245, 80, 71, 0) 100%)',
        color: '#f55047'
    },
    COOL_INPUT: {
        background: 'linear-gradient(90deg, rgba(0, 162, 167, 0.12) 0%, rgba(0, 162, 167, 0) 100%)',
        color: '#00a2a7'
    },
    COOL_SUPPLY: {
        background: 'linear-gradient(90deg, rgba(100, 166, 247, 0.12) 0%, rgba(100, 166, 247, 0) 100%)',
        color: '#1b4acc'
    }
};
