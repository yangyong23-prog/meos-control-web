import i18n from '@/localization';
import { NO_JOIN_FEEDBACK } from '../constant';

export const ERROR = {
    REQUIRED: i18n.global.t('meos_control_web.input_required_check_error_4'),
    LX_RANGE: i18n.global.t('meos_control_web.range_0_to_1000000'),
    TIME_RANGE: i18n.global.t('meos_control_web.range_0_300'),
    MUST_BE_LESS: i18n.global.t('meos_control_web.must_be_less_than_close_threshold'),
    MUST_BE_GREATER: i18n.global.t('meos_control_web.must_be_greater_than_open_threshold')
};
export const SUBMIT_ERROR = {
    SETTING_MODE: i18n.global.t('meos_control_web.select_not_participate_must_select_on_or_off'),
    REQUIRED: i18n.global.t('meos_control_web.auto_on_off_condition_least_one'),
    COMPARE: i18n.global.t('meos_control_web.open_threshold_must_be_less_than_close_threshold')
};
export const UNDER_FIELDS_PAIR = ['underOutdoorIlluminance', 'underDuration'];
export const UPPER_FIELDS_PAIR = ['overtopOutdoorIlluminance', 'overtopDuration'];
export const LX_FIELDS_PAIR = ['underOutdoorIlluminance', 'overtopOutdoorIlluminance'];

// 统一判断 under 阈值是否小于 overtop 阈值
const checkThresholdCompare = (row, type) => {
    const isUnder = type === 'under';
    if (row.underOutdoorIlluminance != null && row.overtopOutdoorIlluminance != null && Number(row.underOutdoorIlluminance) > Number(row.overtopOutdoorIlluminance)) {
        return isUnder ? ERROR.MUST_BE_LESS : ERROR.MUST_BE_GREATER;
    }
    return '';
};

export const checkLxRange = (row, type, option) => {
    const { checkRequired = false, checkCompare = false } = option || {};
    if (row?.joinFeedBack === NO_JOIN_FEEDBACK) {
        return '';
    }
    const isUnder = type === 'under';
    const ownDuration = isUnder ? 'underDuration' : 'overtopDuration';
    const ownIlluminance = isUnder ? 'underOutdoorIlluminance' : 'overtopOutdoorIlluminance';
    const otherFields = isUnder ? UPPER_FIELDS_PAIR : UNDER_FIELDS_PAIR;
    const value = row[ownIlluminance];
    if (value == null) {
        if (!checkRequired) {
            return '';
        } else if (row[ownDuration] != null || (row[otherFields[0]] == null && row[otherFields[1]] == null)) {
            return ERROR.REQUIRED;
        } else {
            return '';
        }
    } else if (value > 1000000 || value < 0) {
        return ERROR.LX_RANGE;
    } else {
        if (checkCompare) {
            return checkThresholdCompare(row, type);
        } else {
            return '';
        }
    }
};

export const checkTimeRange = (row, type, option) => {
    const { checkRequired = false } = option || {};
    if (row?.joinFeedBack === NO_JOIN_FEEDBACK) {
        return '';
    }
    const isUnder = type === 'under';
    const ownDuration = isUnder ? 'underDuration' : 'overtopDuration';
    const ownIlluminance = isUnder ? 'underOutdoorIlluminance' : 'overtopOutdoorIlluminance';
    const otherFields = isUnder ? UPPER_FIELDS_PAIR : UNDER_FIELDS_PAIR;
    const value = row[ownDuration];
    if (value == null) {
        if (!checkRequired) {
            return '';
        } else if (row[ownIlluminance] != null || (row[otherFields[0]] == null && row[otherFields[1]] == null)) {
            return ERROR.REQUIRED;
        } else {
            return '';
        }
    } else if (value > 300 || value < 0) {
        return ERROR.TIME_RANGE;
    } else {
        return '';
    }
};
