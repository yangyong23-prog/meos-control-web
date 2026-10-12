import i18n from '@/localization';
import { curEditDataKey, formRefKey, isEditTypeKey } from '@/views/IndoorLighting/hooks/useTemporaryControlEdit';
import { getNextFiveMinutePoint, useSuccessMessage } from '@/utils/tools';
import { getDayjsTz } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { dayjsIsAfter, dayjsIsBefore } from '@/utils/dayjsTools';
import { EMPTYTEXT, SUCCESSCODE } from '@/utils/globalVariables';

dayjs.extend(duration);
export const TIME_MODE = {
    // 执行一次
    once: 'once',
    // 执行多次
    multi: 'multi',
    // 手动执行
    manual: 'manual',
    // 立即执行
    immediately: 'immediately'
};
const IN_RANGE_ERR_TEXT = i18n.global.t('meos_control_web.past_connot_sel');
const SEL_TIME_ERR_TIPS = i18n.global.t('meos_control_web.select_time_not_meet_requirement');
export default props => {
    const timeModeOptions = [
        {
            label: i18n.global.t('meos_control_web.timed_execution'),
            value: 'scheduled_execution'
        },
        {
            label: i18n.global.t('meos_control_web.manual_execution'),
            value: TIME_MODE.manual
        }
    ];
    const formModel = ref({});
    const curEditData = inject(curEditDataKey);
    const formRef = inject(formRefKey);
    const isEditType = inject(isEditTypeKey);
    const timeBaseMode = ref('scheduled_execution');
    const timeMode = ref(TIME_MODE.once);

    const timeTempData = reactive({
        [TIME_MODE.once]: {
            sustainTime: 60,
            beginTime: '',
            endDate: '',
            endTime: computed({
                get: () => {
                    const _beginTime = timeTempData[TIME_MODE.once].beginTime;

                    if (!_beginTime) {
                        return '';
                    }
                    return dayjs(_beginTime ?? '')
                        .add(timeTempData.once.sustainTime, 'minute')
                        .format('YYYY.MM.DD HH:mm');
                },

                set: value => {
                    // console.log('value: ', value);
                    // timeTempData[TIME_MODE.once].endDate = dayjs(value).format('YYYY.MM.DD');
                    const sustainTime = dayjs.duration(dayjs(value).diff(dayjs(timeTempData.once.beginTime))).as('minute');
                    // console.log('aa: ', sustainTime);
                    timeTempData.once.sustainTime = sustainTime;
                }
            })
        },
        [TIME_MODE.multi]: {
            acrossDay: 'current',
            loopStartTime: '',
            loopEndTime: '',
            beginDate: '',
            endDate: '',
            loopTimeRange: computed({
                get: () => {
                    if (!timeTempData.multi.beginDate || !timeTempData.multi.endDate) {
                        return '';
                    }
                    return `${timeTempData.multi.beginDate}-${timeTempData.multi.endDate}`;
                },
                set: value => {
                    if (value) {
                        const [beginDate, endDate] = value.split('-');

                        timeTempData.multi.beginDate = beginDate;
                        timeTempData.multi.endDate = endDate;
                    } else {
                        timeTempData.multi.beginDate = '';
                        timeTempData.multi.endDate = '';
                    }
                }
            })
        },
        [TIME_MODE.immediately]: {
            sustainTime: computed({
                get: () => {
                    const sustainTime = dayjs.duration(dayjs(timeTempData.immediately.endTime).diff(dayjs(timeTempData.immediately.beginTime))).as('minute');
                    return sustainTime;
                },
                set: value => {
                    // timeTempData.immediately.sustainTime = value;
                    timeTempData.immediately.endTime = dayjs(timeTempData.immediately.beginTime).add(value, 'minute').format('YYYY.MM.DD HH:mm');
                }
            }),
            beginTime: getDayjsTz().format('YYYY.MM.DD HH:mm'),
            endDate: '',
            endTime: getDayjsTz().add(60, 'minute').format('YYYY.MM.DD HH:mm')
        }
    });

    const reset = () => {
        timeMode.value = TIME_MODE.once;
        timeBaseMode.value = 'scheduled_execution';
        timeTempData.once.sustainTime = 60;
        timeTempData.once.beginTime = '';
        timeTempData.multi.acrossDay = 'current';
        timeTempData.multi.loopTimeRange = '';
        timeTempData.multi.loopStartTime = '';
        timeTempData.multi.loopEndTime = '';
        timeTempData.immediately.beginTime = getDayjsTz().format('YYYY.MM.DD HH:mm');
        timeTempData.immediately.endTime = getDayjsTz().add(60, 'minute').format('YYYY.MM.DD HH:mm');
    };

    const isMuiltMode = computed(() => {
        return timeBaseMode.value !== TIME_MODE.manual && timeMode.value === TIME_MODE.multi;
    });

    const timeBeforeNow = time => {
        return dayjsIsBefore(time, getDayjsTz());
    };

    const beginTimeDisabled = computed(() => {
        const bTime = timeTempData[timeMode.value].beginTime;
        if (!bTime) {
            return false;
        }
        const isBefore = timeBeforeNow(bTime);
        return isEditType.value && isBefore;
    });
    const endScopeTime = () => {
        if (isMuiltMode.value) {
            return '';
        }
        const data = timeTempData[timeMode.value];
        const beginTime = dayjs(data.beginTime);
        const bTime = beginTime.add(5, 'minute').format('YYYY.MM.DD HH:mm:00'),
            eTime = beginTime.add(1, 'year').format('YYYY.MM.DD HH:mm:00');

        return `${bTime}-${eTime}`;
    };
    const loopTimeRangeScope = () => {
        const bTime = getDayjsTz().format('YYYY.MM.DD'),
            eTime = getDayjsTz().add(1, 'year').format('YYYY.MM.DD');
        return `${bTime}-${eTime}`;
    };

    const validateDayLoopInRange = (val, callback, isEnd) => {
        if (!isMuiltMode.value) {
            callback();
            return;
        }
        const data = timeTempData[timeMode.value];
        try {
            const { acrossDay, loopTimeRange, beginDate, loopStartTime, loopEndTime } = data;
            if (!loopTimeRange || !val) {
                callback();
                return;
            }
            const startDay = beginDate;
            console.log('beginDate: ', beginDate);
            // 选择的日期区间包含今天
            if (startDay === getDayjsTz().format('YYYY.MM.DD')) {
                // 开始时间早于当前时间
                if (!isEnd && dayjsIsAfter(getDayjsTz(), dayjs(`${startDay} ${val}`))) {
                    callback(new Error(IN_RANGE_ERR_TEXT));
                    return;
                }
                // 结束时间早于当前时间
                if (isEnd && acrossDay === 'current') {
                    if (dayjsIsAfter(getDayjsTz(), dayjs(`${startDay} ${val}`))) {
                        callback(new Error(IN_RANGE_ERR_TEXT));
                        return;
                    }
                }
            }

            callback();
        } catch (e) {
            console.log('e: ', e);
        }
    };
    const validateTimeAfterNow = (targetTime, needValidate, callback, text = i18n.global.t('meos_control_web.past_connot_sel')) => {
        if (!targetTime || !needValidate) {
            callback();
            return;
        }
        const _time = dayjs(targetTime);
        // 开始时间早于当前时间
        if (timeBeforeNow(_time)) {
            callback(new Error(text));
        } else {
            callback();
        }
    };
    const validateEndAfterStart = (curTimeType, callback) => {
        const data = timeTempData[timeMode.value];
        if (!data) {
            callback();
            return;
        }
        try {
            const currentDate = getDayjsTz().format('YYYY-MM-DD');
            // 选择了日期范围，且包含今天的

            if (isMuiltMode.value) {
                const { loopStartTime, loopEndTime, acrossDay } = data;
                const startTime = dayjs(currentDate + ' ' + loopStartTime);
                const endTime = dayjs(currentDate + ' ' + loopEndTime);
                if (acrossDay === 'current') {
                    // 如果开始时刻不早于结束时刻
                    if (!dayjsIsBefore(startTime, endTime)) {
                        callback(new Error(i18n.global.t('meos_control_web.cannot_earlier_than_start')));
                        return;
                    }
                } else {
                    // 开始时刻要晚于结束时刻
                    if (!dayjsIsAfter(startTime, endTime)) {
                        callback(new Error(SEL_TIME_ERR_TIPS));
                        return;
                    }
                }
            } else {
                const { endTime } = data;
                if (dayjsIsAfter(getDayjsTz(), dayjs(endTime))) {
                    callback(new Error(i18n.global.t('meos_control_web.past_connot_sel')));
                    return;
                }
            }
            callback();
            // console.log('curEditData.value.loopStartTime: ', curEditData.value.loopStartTime);
        } catch (e) {
            console.log('e: ', e);
        }
    };
    const validRequired = (val, callback) => {
        if (val === undefined || val === null || val === '') {
            callback(new Error(EMPTYTEXT));
        } else {
            callback();
        }
    };

    const getBeginEndTimeFmt = (b, e) => {
        return {
            beginTime: dayjs(b).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(e).format('YYYY-MM-DD HH:mm:ss')
        };
    };
    const loopTimeScope = curTimeType => {
        if (timeBaseMode.value === TIME_MODE.manual || timeMode.value !== TIME_MODE.multi) {
            return '';
        }
        // console.log('loopTimeScope: ', curTimeType);
        try {
            const currentDate = getDayjsTz().format('YYYY-MM-DD');
            const data = timeTempData[timeMode.value];
            // 选择了日期范围，且包含今天的
            let startHM = '';

            const { beginDate, endDate, acrossDay } = data;
            if (data.loopTimeRange) {
                const startDay = beginDate;
                if (startDay === getDayjsTz().format('YYYY.MM.DD')) {
                    startHM = getDayjsTz().add(5, 'minute').format('HH:mm');
                }
            }
            // console.log('curEditData.value.loopStartTime: ', curEditData.value.loopStartTime);
            if (curTimeType === 'beginTime') {
                console.log('data: ', data);
                if (data.loopEndTime) {
                    if (acrossDay === 'current') {
                        if (data.loopEndTime) {
                            const endTime = dayjs(currentDate + ' ' + data.loopEndTime)
                                .subtract(5, 'minute')
                                .format('HH:mm');
                            return `${startHM ? startHM : '00:00'}-${endTime}`;
                        } else {
                            return `${startHM ? startHM : '00:00'}-23:59`;
                        }
                    } else {
                        if (data.loopEndTime) {
                            const endTime = dayjs(currentDate + ' ' + data.loopEndTime);
                            const endTimeHM = endTime.add(5, 'minute').format('HH:mm');
                            console.log('endTimeHM: ', startHM, endTimeHM);
                            if (startHM && dayjsIsBefore(endTime, getDayjsTz())) {
                                return `${endTimeHM}-23:59`;
                            } else {
                                return `${startHM ? startHM : endTimeHM ?? '00:00'}-23:59`;
                            }
                        } else {
                            return `${startHM ? startHM : '00:00'}-23:59`;
                        }
                    }
                } else {
                    return `${startHM ? startHM : '00:00'}-23:59`;
                }
            } else {
                if (data.loopStartTime) {
                    if (data.acrossDay === 'current') {
                        const startTime = dayjs(currentDate + ' ' + data.loopStartTime)
                            .add(5, 'minute')
                            .format('HH:mm');

                        return `${startTime}-23:59`;
                    } else {
                        const after24HoursStartTime = dayjs(currentDate + ' ' + data.loopStartTime)
                            .add(24, 'hour')
                            .format('HH:mm');
                        if (after24HoursStartTime === '00:00') {
                            return '01:00-00:00';
                        }
                        return `00:00-${after24HoursStartTime}`;
                    }
                } else {
                    return `${startHM ? startHM : '00:00'}-23:59`;
                }
            }
        } catch (e) {
            console.log('e: ', e);
        }
        // return curTimeScope;
    };
    const beginTimeScope = () => {
        return `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(1, 'year').format('YYYY.MM.DD HH:mm:00')}`;
    };

    const collectEditData = () => {
        const isScheduledExecution = timeBaseMode.value === timeModeOptions[0].value;

        const configData = {
            type: isScheduledExecution ? timeMode.value : timeBaseMode.value
        };
        const timeSlot = [];
        let _beginTime = '',
            _endTime = '';
        if (isScheduledExecution) {
            const isMuilt = timeMode.value === TIME_MODE.multi;
            const curTimeData = timeTempData[timeMode.value];

            configData.acrossDay = isMuilt && curTimeData.acrossDay === 'next';
            if (timeMode.value === TIME_MODE.immediately) {
                if (isEditType.value) {
                    _beginTime = curTimeData.beginTime;
                } else {
                    _beginTime = getDayjsTz().format('YYYY.MM.DD HH:mm');
                }
            } else {
                _beginTime = isMuilt ? curTimeData.beginDate + ' ' + curTimeData.loopStartTime : curTimeData.beginTime;
            }
            _endTime = isMuilt ? curTimeData.endDate + ' ' + curTimeData.loopEndTime : curTimeData.endTime;
        } else {
            _beginTime = getDayjsTz().format('YYYY.MM.DD HH:mm');
            _endTime = getDayjsTz('9999.12.31 23:59').format('YYYY.MM.DD HH:mm');
        }
        const tileSolitItem = getBeginEndTimeFmt(_beginTime, _endTime);
        if (tileSolitItem) {
            timeSlot.push(tileSolitItem);
        }
        return { configData, timeSlot };
    };
    const setEditData = editData => {
        console.log('setEditData----editData: ', editData);
        if (editData) {
            const { configData, beginTime, endTime } = editData;

            if (configData) {
                const { type, acrossDay } = configData;
                if (type === TIME_MODE.manual) {
                    timeBaseMode.value = TIME_MODE.manual;
                } else {
                    console.log('beginTime: ', beginTime);
                    const _beginTime = dayjs(beginTime);
                    const _endTime = dayjs(endTime);
                    timeBaseMode.value = 'scheduled_execution';
                    timeMode.value = type;
                    if (type === TIME_MODE.once) {
                        timeTempData[type].beginTime = _beginTime.format('YYYY.MM.DD HH:mm');
                        timeTempData[type].endTime = _endTime.format('YYYY.MM.DD HH:mm');
                        console.log('_beginTime: ', _beginTime, timeTempData[type].beginTime);
                    } else if (type === TIME_MODE.multi) {
                        timeTempData[type].loopStartTime = _beginTime.format('HH:mm');
                        timeTempData[type].loopEndTime = _endTime.format('HH:mm');
                        timeTempData[type].beginDate = _beginTime.format('YYYY.MM.DD');
                        timeTempData[type].endDate = _endTime.format('YYYY.MM.DD');
                        timeTempData[type].acrossDay = acrossDay ? 'next' : 'current';
                    } else if (type === TIME_MODE.immediately) {
                        timeTempData[type].beginTime = _beginTime.format('YYYY.MM.DD HH:mm');
                        timeTempData[type].endTime = _endTime.format('YYYY.MM.DD HH:mm');
                    }
                }
            }
        }
    };
    const switchTimeBaseMode = (enable, type) => {
        if (enable) {
            timeBaseMode.value = type;
        }
    };

    return {
        timeBaseMode,
        timeMode,
        timeTempData,
        timeModeOptions,
        formModel,
        curEditData,
        formRef,
        beginTimeDisabled,
        isEditType,
        beginTimeScope,
        reset,
        switchTimeBaseMode,
        setEditData,
        endScopeTime,
        loopTimeRangeScope,
        getBeginEndTimeFmt,
        loopTimeScope,
        collectEditData,
        validateEndAfterStart,
        validateDayLoopInRange,
        validRequired,
        validateTimeAfterNow
    };
};
