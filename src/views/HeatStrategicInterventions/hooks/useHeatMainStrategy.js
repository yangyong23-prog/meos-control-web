import { useRoute } from '@/hooks/setupHelper';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { $Message } from 'meri-plus';
import { listFixedTimeStrategy, deleteFixedTimeStrategy } from '@/apis/HeatStrateg';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';

export default emits => {
    const params = inject('params');
    const route = useRoute();
    const currentDate = ref(new Date());
    const daysOfWeek = computed(() => {
        return [
            i18n.global.t('common.weekday.day7'),
            i18n.global.t('common.weekday.day1'),
            i18n.global.t('common.weekday.day2'),
            i18n.global.t('common.weekday.day3'),
            i18n.global.t('common.weekday.day4'),
            i18n.global.t('common.weekday.day5'),
            i18n.global.t('common.weekday.day6')
        ];
    });
    const tableData = ref([]);
    const exceed = reactive({
        halfIsDisabled: false, //部分禁用
        wholeIsDisabled: false // 全部禁用
    });
    // 新建编辑策略弹框
    const showStrategyModal = ref(false);

    const strategyState = ref(false); // 删除策略弹框
    const deleteParams = ref([]);

    // 编辑策略传过去的参数
    const editParams = reactive(
        Object.assign(
            {
                name: 'edit',
                data: deleteParams
            },
            route.query
        )
    );

    emitter.off('refreshMain');

    // 新建成功之后调用
    emitter.on('refreshMain', () => {
        getListFixedTimeStrategy();
    });

    emitter.on('changeMonth', type => {
        if (type === 'left') {
            prevMonth();
        } else if (type === 'right') {
            nextMonth();
        } else {
            clickMonth();
        }
    });

    // 默认展示的天
    const days = computed(() => {
        const year = currentDate.value.getFullYear();
        const month = currentDate.value.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInLastMonth = new Date(year, month, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        let defaultDays = [],
            day = 1,
            lastMonthDay = daysInLastMonth - firstDayOfMonth + 1,
            nextMonthDay = 1;
        for (let i = 0; i < 6 * 7; i++) {
            if (i < firstDayOfMonth) {
                defaultDays.push({
                    date: new Date(year, month - 1, lastMonthDay),
                    day: lastMonthDay,
                    isLastMonth: true,
                    isNextMonth: false,
                    list: []
                });
                lastMonthDay++;
            } else if (i >= firstDayOfMonth + daysInMonth) {
                defaultDays.push({
                    date: new Date(year, month + 1, nextMonthDay),
                    day: nextMonthDay,
                    isLastMonth: false,
                    isNextMonth: true,
                    list: []
                });
                nextMonthDay++;
            } else {
                const date = new Date(year, month, day);
                defaultDays.push({ date, day, isLastMonth: false, isNextMonth: false, month: true, list: [] });
                day++;
            }
        }
        if (!Array.isArray(defaultDays) || !Array.isArray(tableData.value)) {
            return;
        }
        const dateMap = tableData.value.reduce((acc, item) => {
            const formattedDate = dayjs(item.dateTime).format('YYYY-MM-DD');
            if (formattedDate) {
                acc[formattedDate] = acc[formattedDate] || [];
                acc[formattedDate].push(item);
            }
            return acc;
        }, {});

        defaultDays.forEach(day => {
            if (day.month && day.list) {
                const formattedDate = dayjs(day.date).format('YYYY-MM-DD');
                if (formattedDate && dateMap[formattedDate]) {
                    dateMap[formattedDate].forEach(item => {
                        day.list.push({
                            content: item.content,
                            dateTime: item.dateTime,
                            dayOfWeek: item.dayOfWeek,
                            objectId: item.objectId,
                            objectLocalName: item.objectLocalName
                        });
                    });
                }
            }
        });
        return defaultDays;
    });
    // 选择下拉的月份
    const clickMonth = () => {
        currentDate.value = new Date(new Date(params.value.month).getFullYear(), new Date(params.value.month).getMonth(), 1);
    };
    // 上一个月
    const prevMonth = () => {
        currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
    };
    // 下一个月
    const nextMonth = () => {
        currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
    };

    // 单位数日+0
    const Appendzero = obj => {
        if (obj < 10) return '0' + '' + obj;
        else return obj;
    };

    // 当天
    const isToday = day => {
        const today = new Date();
        return day.date.toDateString() === today.toDateString();
    };
    // 不是本月的月份
    const isNotCurrentMonth = day => {
        return day.isLastMonth || day.isNextMonth;
    };

    // 删除弹框
    const deleteIcons = data => {
        strategyState.value = true;
        deleteParams.value = data;
    };

    // 删除策略
    const deleteStrategy = () => {
        deleteFixedTimeStrategy({
            systemType: 'ACCH',
            systemId: route.query.systemId,
            strategyId: deleteParams.value.content[0].strategyId,
            objectId: deleteParams.value.objectId,
            removeDate: dayjs(deleteParams.value.dateTime).format('YYYY-MM-DD')
        }).then(res => {
            if (res.result === 'success') {
                $Message.success({ title: `${i18n.global.t('meos_control_web.delete_success')}` });
                strategyState.value = false;
                getListFixedTimeStrategy();
                emits('getListFixedStrategyDateByMonth');
            }
        });
    };

    // 编辑策略
    const editFixedTimeStrategy = item => {
        deleteParams.value = item;
        showStrategyModal.value = true;
    };
    // 今日时间表进入
    const handleMouseEnter = item => {
        if (!isToday(item)) return;
        if (item?.list && item.list.length && item.list[0]?.content.length) {
            const arr = item.list[0].content.map(time => {
                return getDayjsTz().add(1, 'minute').format('HH:mm:ss') > time.strategyTime;
            });
            if (arr.includes(true) && arr.includes(false)) {
                // 有超出的有未超出的
                exceed.halfIsDisabled = true;
            } else if (arr.includes(false)) {
                // 未超出的
                exceed.halfIsDisabled = false;
                exceed.wholeIsDisabled = false;
            } else {
                // 超出的
                exceed.halfIsDisabled = false;
                exceed.wholeIsDisabled = true;
            }
        }
    };

    const handleMouseLeave = () => {
        exceed.halfIsDisabled = false;
        exceed.wholeIsDisabled = false;
    };
    const getListFixedTimeStrategy = () => {
        tableData.value = [];
        listFixedTimeStrategy({
            systemId: route.query?.systemId,
            beginDateTime: dayjs(unref(params).month.replace('.', '-')).startOf('month').format('YYYY-MM-DD 00:00:00'),
            endDateTime: dayjs(unref(params).month.replace('.', '-')).endOf('month').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        }).then(res => {
            const { data, result } = res;
            if (result !== 'success') return;
            tableData.value = data || [];
        });
    };
    onMounted(() => {
        getListFixedTimeStrategy();
    });

    return {
        days,
        exceed,
        editParams,
        daysOfWeek,
        currentDate,
        strategyState,
        showStrategyModal,
        Appendzero,
        isToday,
        isNotCurrentMonth,
        deleteIcons,
        deleteStrategy,
        editFixedTimeStrategy,
        handleMouseEnter,
        handleMouseLeave,
        getListFixedTimeStrategy
    };
};
