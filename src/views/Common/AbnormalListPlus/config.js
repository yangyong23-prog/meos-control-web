import AbnormalHighTag from '@/assets/svg/abnormal/high-tag.svg';
import AbnormalMiddleTag from '@/assets/svg/abnormal/mid-tag.svg';
import AbnormalLowTag from '@/assets/svg/abnormal/low-tag.svg';
import i18n from '@/localization';
export const SORT_OPTION_ENUM = {
    BY_LEVEL: 'byLevel',
    BY_TIME: 'byTime'
};

export const SORT_OPTIONS = [
    { id: SORT_OPTION_ENUM.BY_LEVEL, name: i18n.global.t('meos_control_web.by_error_level') },
    { id: SORT_OPTION_ENUM.BY_TIME, name: i18n.global.t('meos_control_web.by_error_start_time') }
];

// 异常事件的响应状态
export const GROUP_ENUM = {
    FIND_EXCEPTION: 'FIND_EXCEPTION', //   "1,发现异常"
    SOLVING: 'SOLVING', //  "2,排查处理"
    VERIFICATION: 'VERIFICATION' //  "3,验证闭合"
};

export const TAGS_ID_ENUM = {
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW',
    UNKNOWN: 'UNKNOWN',
    OVERDUE: 'OVERDUE'
};

export const ALL_TAGS = [
    {
        id: TAGS_ID_ENUM.HIGH,
        name: i18n.global.t('meos_control_web.high'),
        importanceDegree: ['HIGH', 'MEDIUM_HIGH'],
        color: '#FF3C3C',
        showIcon: true,
        icon: AbnormalHighTag,
        hoverBg: '#fff5f5',
        hoverBorder: '#f55047',
        order: 1
    },
    {
        id: TAGS_ID_ENUM.MEDIUM,
        name: i18n.global.t('common.mid'),
        importanceDegree: ['MEDIUM'],
        color: '#FF943C',
        showIcon: true,
        icon: AbnormalMiddleTag,
        hoverBg: '#FFFBE6',
        hoverBorder: '#FFB800',
        order: 2
    },
    {
        id: TAGS_ID_ENUM.LOW,
        name: i18n.global.t('meos_control_web.low'),
        importanceDegree: ['LOW', 'EXTREMELY_LOW'],
        color: '#246FE5',
        showIcon: true,
        icon: AbnormalLowTag,
        hoverBg: '#EBF6FF',
        hoverBorder: '#246FE5',
        order: 3
    },
    {
        id: TAGS_ID_ENUM.UNKNOWN,
        name: i18n.global.t('meos_control_web.unknown'),
        importanceDegree: ['UNKNOWN'],
        color: '#7E8781',
        hoverBg: '#F7F9FA',
        hoverBorder: '#626C78',
        order: 4
    },
    {
        id: TAGS_ID_ENUM.OVERDUE,
        name: i18n.global.t('meos_control_web.overdue'),
        color: '#FF3C3C',
        order: 5
    }
];

export const getCardTagOrder = card => {
    const importanceDegree = card?.importanceDegree ? card?.importanceDegree : ALL_TAGS.find(t => t.id === TAGS_ID_ENUM.UNKNOWN);
    const withDegreeTag = ALL_TAGS.find(tag => tag.importanceDegree && tag.importanceDegree.includes(importanceDegree));
    if (withDegreeTag) {
        return withDegreeTag?.order;
    } else {
        return ALL_TAGS.length + 1;
    }
};
