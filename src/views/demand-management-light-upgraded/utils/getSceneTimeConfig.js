import i18n from '@/localization';
const padTime = num => String(num).padStart(2, '0');

let hours = [];
for (let i = 0; i <= 23; i++) {
    const hourId = padTime(i);
    const children = [];
    for (let j = 0; j < 60; j += 5) {
        const minuteId = padTime(j);
        children.push({
            id: `ABSOLUTE/${hourId}/${minuteId}`,
            name: i18n.global.t('meos_control_web.time_minute', {
                num: minuteId
            })
        });
    }
    hours.push({
        id: `ABSOLUTE/${hourId}`,
        name: i18n.global.t('meos_control_web.cur_hour', {
            hour: hourId
        }),
        children
    });
}

const generateOffsetMinutes = (prefix, isNegative = false) => {
    const result = [];
    for (let i = 5; i <= 60; i += 5) {
        const sign = isNegative ? '-' : '';
        result.push({
            id: `${prefix}${sign}${i}`,
            name: i18n.global.t('meos_control_web.time_minute', {
                num: padTime(i)
            })
        });
    }
    return result;
};

const SUN_RISE_BEGIN_OFFSET_MINUTES = generateOffsetMinutes('SUNRISE/1/', true);
const SUN_RISE_END_OFFSET_MINUTES = generateOffsetMinutes('SUNRISE/2/');
const SUN_SET_BEGIN_OFFSET_MINUTES = generateOffsetMinutes('SUNSET/1/', true);
const SUN_SET_END_OFFSET_MINUTES = generateOffsetMinutes('SUNSET/2/');

export const getSceneTimeConfig = () => {
    return {
        listsStart: [
            {
                id: 'ABSOLUTE',
                name: i18n.global.t('meos_control_web.absolute_time'),
                children: hours.concat({
                    id: 'ABSOLUTE/23/55',
                    name: i18n.global.t('meos_control_web.end_of_day')
                })
            },
            {
                id: 'SUNRISE',
                name: i18n.global.t('meos_control_web.sunrise_time'),
                children: [
                    {
                        id: 'SUNRISE/0/0',
                        name: i18n.global.t('meos_control_web.at_sunrise')
                    },
                    {
                        id: 'SUNRISE/1',
                        name: i18n.global.t('meos_control_web.before_sunrise'),
                        children: SUN_RISE_BEGIN_OFFSET_MINUTES
                    },
                    {
                        id: 'SUNRISE/2',
                        name: i18n.global.t('meos_control_web.after_sunrise'),
                        children: SUN_RISE_END_OFFSET_MINUTES
                    }
                ]
            },
            {
                id: 'SUNSET',
                name: i18n.global.t('meos_control_web.sunset_time'),
                children: [
                    {
                        id: 'SUNSET/0/0',
                        name: i18n.global.t('meos_control_web.at_sunset')
                    },
                    {
                        id: 'SUNSET/1',
                        name: i18n.global.t('meos_control_web.before_sunset'),
                        children: SUN_SET_BEGIN_OFFSET_MINUTES
                    },
                    {
                        id: 'SUNSET/2',
                        name: i18n.global.t('meos_control_web.after_sunset'),
                        children: SUN_SET_END_OFFSET_MINUTES
                    }
                ]
            }
        ],
        listsEnd: [
            {
                id: 'ABSOLUTE',
                name: i18n.global.t('meos_control_web.absolute_time'),
                children: hours.concat({
                    id: 'ABSOLUTE/00/00',
                    name: i18n.global.t('meos_control_web.end_of_day')
                })
            },
            {
                id: 'SUNRISE',
                name: i18n.global.t('meos_control_web.sunrise_time'),
                children: [
                    {
                        id: 'SUNRISE/0/0',
                        name: i18n.global.t('meos_control_web.at_sunrise')
                    },
                    {
                        id: 'SUNRISE/1',
                        name: i18n.global.t('meos_control_web.before_sunrise'),
                        children: SUN_RISE_BEGIN_OFFSET_MINUTES
                    },
                    {
                        id: 'SUNRISE/2',
                        name: i18n.global.t('meos_control_web.after_sunrise'),
                        children: SUN_RISE_END_OFFSET_MINUTES
                    }
                ]
            },
            {
                id: 'SUNSET',
                name: i18n.global.t('meos_control_web.sunset_time'),
                children: [
                    {
                        id: 'SUNSET/0/0',
                        name: i18n.global.t('meos_control_web.at_sunset')
                    },
                    {
                        id: 'SUNSET/1',
                        name: i18n.global.t('meos_control_web.before_sunset'),
                        children: SUN_SET_BEGIN_OFFSET_MINUTES
                    },
                    {
                        id: 'SUNSET/2',
                        name: i18n.global.t('meos_control_web.after_sunset'),
                        children: SUN_SET_END_OFFSET_MINUTES
                    }
                ]
            }
        ]
    };
};

const getSingleTimeText = (config, isAcrossDay = false) => {
    let timeText = '';
    if (config.timeType === 'ABSOLUTE' && config.absoluteTime) {
        const minutes = config.absoluteTime.slice(0, 5) || '--';
        if (isAcrossDay) {
            timeText = minutes === '00:00' ? `${i18n.global.t('meos_control_web.next_day')}${minutes}` : minutes;
        } else {
            timeText = minutes;
        }
    } else if (['SUNRISE', 'SUNSET'].includes(config.timeType)) {
        const timeCount = config?.timeDeviation?.offset ?? 0;
        const absoluteTimeCount = timeCount > 0 ? timeCount : -timeCount;
        const prefix = config.timeType === 'SUNRISE' ? i18n.global.t('meos_control_web.sunrise') : i18n.global.t('meos_control_web.sunset');
        timeText =
            timeCount > 0
                ? i18n.global.t('meos_control_web.after_num_minue', { name: prefix, num: absoluteTimeCount })
                : timeCount === 0
                ? i18n.global.t('meos_control_web.cur_hour', { hour: prefix })
                : i18n.global.t('meos_control_web.before_num_minue', { name: prefix, num: absoluteTimeCount });
    }
    return timeText;
};

export const getSceneTimeTitle = config => {
    const { beginTime, endTime } = config;
    const startTime = getSingleTimeText(beginTime);
    const overTime = getSingleTimeText(endTime, true);

    return `${startTime}-${overTime}`;
};
