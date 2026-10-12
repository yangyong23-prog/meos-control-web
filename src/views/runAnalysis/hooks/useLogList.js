import dayjs from 'dayjs';
import { queryRunningLogListByPage, queryRunningLogType } from '@/apis/operationLog';
import { queryLogListByPage, listSecondLevelCategory } from '@/apis/runAnalysis';
import { globalTimeKey } from '../injectionKey';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { systemKey } from './useBaseData';
import i18n from '@/localization';
import { debounce, throttle, uniqueId } from 'lodash';
import { getDayjsTz } from '@/utils/globalVariables';
const { cancelQuest, cancelToken } = UseCancelTokenHooks();

export default emits => {
    const noData = ref(false);
    const logLoading = ref(true);
    const showMore = ref(false);
    const isOpen = ref(false); // 默认不展开
    const globalTime = inject(globalTimeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
    const selectMarkList = ref([]);
    const markValue = ref('');
    const levelValue = ref('');
    const levelList = [
        {
            id: [],
            name: i18n.global.t('meos_control_web.control_demand_adjustment')
        },
        {
            id: [],
            name: i18n.global.t('meos_control_web.system_control_parameter_modify')
        },
        {
            id: [],
            name: i18n.global.t('meos_control_web.device_manual_force_operation')
        },
        {
            id: [],
            name: i18n.global.t('meos_control_web.control_command_execution_result')
        },
        {
            id: [],
            name: i18n.global.t('meos_control_web.device_exception')
        }
    ];
    const system = inject(systemKey);
    const selectLevelList = ref([]);
    const colorDict = {
        1: {
            name: i18n.global.t('meos_control_web.auto'),
            color: '#683BD6',
            bgColor: '#F1E5FE'
        },
        2: {
            name: i18n.global.t('meos_control_web.manual1'),
            color: '#E68600',
            bgColor: '#FFF0CC'
        },
        3: {
            name: i18n.global.t('meos_control_web.alarm'),
            color: '#D72824',
            bgColor: '#FFE6E5'
        }
    };
    const logData = ref([]);
    const pageNumber = ref(1);
    const isQequest = ref(true);
    // 日志标识
    queryRunningLogType().then(({ result, data }) => {
        selectMarkList.value = [];
        if (result === 'success') {
            const resData = Object.entries(data).map(entry => ({ id: parseInt(entry[0]), name: entry[1] }));
            selectMarkList.value = resData;
        }
    });
    listSecondLevelCategory({ firstLevelCategory: ['ACCC'] }).then(({ result, data }) => {
        if (result === 'success') {
            selectLevelList.value = data.map(item => {
                return {
                    id: item.secondLevelCategory,
                    name: item.secondLevelCategoryName
                };
            });
        }
    });
    const getNewLogList = async () => {
        return await queryRunningLogListByPage(
            {
                pageNumber: pageNumber.value,
                pageSize: 100,
                dataEndTime: `${dayjs(globalTime?.value).format('YYYY-MM-DD')} 23:59:00`,
                dataStartTime: `${dayjs(globalTime?.value).format('YYYY-MM-DD')} 00:00:00`,
                systemId: system.value.id,
                type: markValue.value ? markValue.value : null,
                firstLevelCategory: 'airConditioningColdSource',
                secondLevelCategory: system.value.id,
                workDate: getDayjsTz().format('YYYY-MM-DD HH:mm:ss'),
                desc: false
            },
            null,
            { cancelToken: cancelToken() }
        );
    };
    const queryListRunningLogByDate = async status => {
        if (status === 'reset') {
            isQequest.value = true;
            pageNumber.value = 1;
        }
        // 取消上一次未完成的请求，以避免请求累积
        cancelQuest();
        logLoading.value = true;
        if (system.value.classCode === 'ACAC') {
            try {
                const res = await getNewLogList();
                logData.value = res.data || [];
            } catch (error) {
                console.log(error);

                logData.value = [];
            } finally {
                logLoading.value = false;
            }

            return;
        }
        queryLogListByPage(
            {
                orderBy: 'asc',
                startTime: `${dayjs(globalTime?.value).format('YYYY-MM-DD')} 00:00:00`,
                endTime: `${dayjs(globalTime?.value).format('YYYY-MM-DD')} 23:59:00`,
                type: markValue.value ? markValue.value : null,
                firstLevelCategory: [system.value.classCode],
                secondLevelCategory: levelValue.value ? [levelValue.value] : null,
                pageNumber: pageNumber.value,
                pageSize: 100
            },
            { cancelToken: cancelToken() }
        )
            .then(({ result, data }) => {
                if (result === 'success') {
                    logData.value = data;
                    logLoading.value = false;
                }
            })
            .catch(() => {
                logLoading.value = false;
            });
    };
    const throttleScroll = throttle(aa => {
        scrollToBoundary(aa);
    }, 1000);
    const scrollToBoundary = async boundary => {
        if (showMore.value) {
            return;
        }
        if (boundary === 'bottom') {
            showMore.value = true;
            pageNumber.value++;
            if (isQequest.value) {
                if (system.value.classCode === 'ACAC') {
                    try {
                        const res = await getNewLogList();
                        if (res.data?.length === 0) {
                            isQequest.value = false;
                            showMore.value = false;
                        }
                        logData.value = [...logData.value, ...res.data];
                    } catch (error) {
                        console.log(error);
                    } finally {
                        showMore.value = false;
                    }
                    return;
                }
                queryLogListByPage(
                    {
                        orderBy: 'asc',
                        startTime: `${dayjs(globalTime?.value).format('YYYY-MM-DD')} 00:00:00`,
                        endTime: `${dayjs(globalTime?.value).format('YYYY-MM-DD')} 23:59:00`,
                        type: markValue.value ? markValue.value : null,
                        firstLevelCategory: ['ACCC'],
                        secondLevelCategory: levelValue.value.length ? levelValue.value : null,
                        pageNumber: pageNumber.value,
                        pageSize: 100
                    },
                    { cancelToken: cancelToken() }
                )
                    .then(({ result, data }) => {
                        if (result === 'success') {
                            if (data?.length === 0) {
                                isQequest.value = false;
                                showMore.value = false;
                            }
                            logData.value = [...logData.value, ...data];
                            showMore.value = false;
                        }
                    })
                    .catch(() => {
                        showMore.value = false;
                    });
            } else {
                showMore.value = false;
            }
        }
    };
    const getPrevious15MinutesTime = inputTime => {
        const date = new Date(inputTime);
        const currentHours = date.getHours();
        const currentMinutes = date.getMinutes();
        date.setMinutes(Math.floor(currentMinutes / 15) * 15 + 15);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if (currentHours === 23 && currentMinutes >= 45) {
            return '23:45';
        } else {
            return dayjs(date).format('HH:mm');
        }
    };
    const hover = data => {
        const time = getPrevious15MinutesTime(data.createTime);
        emits('hover', time);
    };
    const logList = computed(() => logData.value.map(item => ({ key: uniqueId('keyField'), ...item })));
    const unhover = () => {
        emits('unhover');
    };
    watch(
        () => globalTime.value,
        () => {
            queryListRunningLogByDate();
        },
        {
            immediate: true
        }
    );
    return {
        isOpen,
        logData,
        logList,
        logLoading,
        colorDict,
        selectMarkList,
        selectLevelList,
        markValue,
        levelValue,
        showMore,
        hover,
        unhover,
        scrollToBoundary,
        throttleScroll,
        queryListRunningLogByDate
    };
};
