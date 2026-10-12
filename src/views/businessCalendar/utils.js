import { dayjsIsSame, dayjsIsAfter, dayjsIsBetween } from '@/utils/dayjsTools';
import { getDayjsTz } from '@/utils/globalVariables';
import i18n from '@/localization';
import { WEEK_DAYS_MATCH_MAP } from './constants';
import { nanoid } from 'nanoid';

export const getAfterTodayRangeSingle = val => {
    if (typeof val !== 'string' || val === '') {
        return '';
    }
    const [start, end] = val?.split(',') || [];
    const curDate = getDayjsTz();
    const hasToday = dayjsIsBetween(curDate, start, end);
    const isStartSameToday = dayjsIsSame(start, curDate);
    const isStartAfterToday = dayjsIsAfter(start, curDate);

    if (hasToday) {
        return `${curDate.format('YYYY-MM-DD')},${end}`;
    } else if (isStartSameToday) {
        return `${curDate.add(1, 'day').format('YYYY-MM-DD')},${end}`;
    } else if (isStartAfterToday) {
        return val;
    } else {
        return '';
    }
};

export const getAfterTodayRange = list => {
    const res = list
        .map(s => {
            const val = getAfterTodayRangeSingle(s);
            return val;
        })
        .filter(s => !!s);
    return res;
};

export const transformWeekToLocal = (arr, showAlias = false) => {
    if (Array.isArray(arr)) {
        return (
            arr
                ?.map(v => WEEK_DAYS_MATCH_MAP[v])
                ?.filter(v => !!v)
                ?.toSorted((a, b) => a?.order - b?.order)
                ?.map(v => (showAlias ? v?.alias : v?.title)) || []
        );
    }
    return [];
};

export const transformDayToRange = arr => {
    if (Array.isArray(arr)) {
        const res = arr.map(v => {
            return (v?.split(',') || [])?.map(item => item?.replaceAll('-', '.'));
        });
        return res;
    }
    return [];
};

export const transformTimeToRange = (arr, limit = 5) => {
    if (Array.isArray(arr)) {
        const res = arr.map(v => {
            return (v?.split(',') || [])?.map(item => item?.slice(0, limit));
        });
        return res;
    }
    return [];
};

export const transformRangeToRender = (ranges, showTimeAllDay = false, rangeTimeEmptyStr = i18n.global.t('meos_control_web.closed')) => {
    const finalString = ranges
        ?.map(v => {
            const timeStr = v?.join('-');
            if (showTimeAllDay && timeStr === '00:00-23:59') {
                return i18n.global.t('meos_control_web.all_day');
            }
            return timeStr.replace('23:59', '24:00');
        })
        ?.join('、');
    if (showTimeAllDay) {
        return finalString || rangeTimeEmptyStr;
    }
    return finalString;
};

export const transformDateToRender = ranges => {
    const finalString = ranges
        ?.map(v => v?.join('-'))
        ?.filter(v => !!v)
        ?.join('、');
    return finalString || i18n.global.t('meos_control_web.none');
};

export const initWeekNumberRange = (arr, isEdit = false) => {
    const originData = arr ?? [];
    const weekKey = isEdit ? 'weekNumbers' : 'weekdays';
    if (originData.length === 0) {
        return [
            {
                groupId: `group-${nanoid()}`,
                [weekKey]: [],
                rangeSwitch: 'checked',
                rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }]
            }
        ];
    } else {
        const list = originData.map(item => {
            const { weekdays = [], weekNumberBusinessTimeRangeList = [] } = item || {};
            const hasArr = (weekNumberBusinessTimeRangeList || [])?.length;
            const rangeList = (weekNumberBusinessTimeRangeList || [])?.map(v => {
                const startTime = v.split(',')[0].slice(0, -3);
                const endTime = v.split(',')[1].slice(0, -3);
                const finalEndTime = endTime === '23:59' ? '24:00' : endTime;
                return {
                    rowTimeRange: { startTime: startTime || '', endTime: finalEndTime || '' },
                    key: `week-number-${nanoid()}`
                };
            });
            return {
                groupId: `group-${nanoid()}`,
                [weekKey]: weekdays || [],
                rangeSwitch: hasArr ? 'checked' : 'uncheck',
                rangeList: rangeList?.length
                    ? rangeList
                    : [
                          {
                              rowTimeRange: { startTime: '', endTime: '' },
                              key: `week-number-${nanoid()}`
                          }
                      ]
            };
        });
        return list;
    }
};

export const convertWeekNumberRange = (list, isEdit = true) => {
    const weekKey = isEdit ? 'weekNumbers' : 'weekdays';
    return list.map(v => {
        return {
            weekdays: v[weekKey],
            weekNumberBusinessTimeRangeList:
                v?.rangeSwitch === 'uncheck'
                    ? []
                    : v?.rangeList?.map(l => {
                          const { startTime, endTime } = l?.rowTimeRange || {};
                          const finalEndTime = endTime === '24:00' ? '23:59:00' : `${endTime}:00`;
                          return `${startTime}:00,${finalEndTime}`;
                      })
        };
    });
};

export const convertBusinessHours = list => {
    return list
        .map(item => {
            const { startTime, endTime } = item?.rowTimeRange || {};
            if (startTime && endTime) {
                const finalEndTime = endTime === '24:00' ? '23:59:00' : `${endTime}:00`;
                return `${startTime}:00,${finalEndTime}`;
            }
            return '';
        })
        .filter(v => !!v);
};
