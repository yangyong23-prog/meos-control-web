import dayjs from 'dayjs';
import { MLoading } from 'meri-plus';
import { listStrategy } from '@/apis/ACAC';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import baseStore from '@/store/baseStore';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { dayjsIsBetween } from '@/utils/dayjsTools';

export const weeksDateKey = Symbol('weeksDateKey'); //月日历时间
export const monthDateKey = Symbol('monthDateKey'); //月日历时间
export const tabsTypeKey = Symbol('tabsTypeKey'); //周月切换tabs
export const toDayKey = Symbol('toDayKey'); //日历选中某一天的数据
export const dataItemKey = Symbol('dataItemKey'); //日历数据
export const isLoadingKey = Symbol('isLoadingKey'); //日历数据
export const rightToDayKey = Symbol('rightToDayKey'); //日历数据

export const systemTypeKey = Symbol('systemTypeKey'); //系统类型
export const curConsoleTypeKey = Symbol('curConsoleTypeKey'); //当前控制台类型

//是否是过去时间
export const checkAllPastTime = (item, day) => {
    const currentTime = new Date();
    let allPast = true;
    item?.executeDetail?.strategyPlans.forEach(it => {
        const combinedDateTime = `${dayjs(day).format('YYYY-MM-DD')} ${it.strategyTime}`;
        const targetTime = new Date(combinedDateTime);
        if (targetTime >= currentTime) {
            allPast = false;
        }
    });
    return allPast;
};

export default function useTimetableHook(props) {
    const toDay = ref(getDayjsTz());
    const monthDate = ref(`${getDayjsTz().format('YYYY.MM')}`);
    const weeksDate = ref(`${getDayjsTz().format('YYYY.MM.DD')}-${getDayjsTz().add(6, 'day').format('YYYY.MM.DD')}`);
    const tabsType = ref('month');
    const dataItem = ref([]);
    const Mloading = ref(null);
    const isLoading = ref(false);
    const rightToDay = ref();

    const infoCodesCancelToke = UseCancelTokenHooks();

    const curQueryConsoleTypes = ref([]);
    const enableConsoleTypesInit = ref([]);

    const init = loading => {
        if (!curQueryConsoleTypes.value?.length) return;
        infoCodesCancelToke.cancelQuest();
        Mloading.value?.destroy();
        Mloading.value = null;
        isLoading.value = true;
        if (loading) {
            Mloading.value = MLoading.service({
                target: tabsType.value === 'weeks' ? '.calendar-weeks' : '.calendar-month',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
            const params = {
                projectId: baseStore().projectId,
                consoleTypes: curQueryConsoleTypes.value,
                systemType: props.systemType,
                objectId: '',
                systemId: props.currentSystem?.systemId,
                beginDate:
                    tabsType.value === 'weeks'
                        ? dayjs(weeksDate?.value?.split('-')[0]).format('YYYY-MM-DD')
                        : dayjs(monthDate.value + '-01')
                              .startOf('month')
                              .format('YYYY-MM-DD'),
                endDate:
                    tabsType.value === 'weeks'
                        ? dayjs(weeksDate?.value?.split('-')[1]).format('YYYY-MM-DD')
                        : dayjs(monthDate.value + '-01')
                              .endOf('month')
                              .format('YYYY-MM-DD')
            };
            listStrategy(params, { cancelToken: infoCodesCancelToke.cancelToken() })
                .then(res => {
                    if (res.code === SUCCESSCODE) {
                        dataItem.value = res?.data || [];
                        isDateInMonthFuc();
                    }
                })
                .finally(() => {
                    Mloading.value?.destroy();
                    isLoading.value = false;
                });
        }
    };

    const isDateInMonthFuc = () => {
        if (!rightToDay.value || !monthDate.value || !curQueryConsoleTypes.value?.length) return;

        try {
            // 解析日期
            const parsedDateA = dayjs(rightToDay.value.date);

            // 解析月份
            const [year, month] = monthDate.value.split('.');
            if (!year || !month) return false;

            const monthStart = dayjs(`${year}-${month}-01`);
            const monthEnd = monthStart.endOf('month');
            const isDateInMonth = dayjsIsBetween(parsedDateA, monthStart, monthEnd, null, '[]');
            // 判断是否在范围内
            if (!isDateInMonth) {
                const params1 = {
                    projectId: baseStore().projectId,
                    consoleTypes: curQueryConsoleTypes.value,
                    systemType: props.systemType,
                    objectId: '',
                    systemId: props.currentSystem?.systemId,
                    beginDate: dayjs(rightToDay.value.date).format('YYYY-MM-DD'),
                    endDate: dayjs(rightToDay.value.date).format('YYYY-MM-DD')
                };
                listStrategy(params1, { cancelToken: infoCodesCancelToke.cancelToken() })
                    .then(res => {
                        if (res.code === SUCCESSCODE) {
                            rightToDay.value.list = res.data?.length ? res.data[0]?.executeObjects : [];
                            console.log(rightToDay.value);
                        }
                    })
                    .finally(() => {
                        Mloading.value?.destroy();
                        isLoading.value = false;
                    });
            }
        } catch (error) {
            console.error('日期解析错误:', error);
        }
    };

    watch(
        [() => tabsType.value, () => curQueryConsoleTypes.value],
        () => {
            init(true);
        },
        { immediate: true }
    );

    onMounted(() => {
        enableConsoleTypesInit.value = props.enableConsoleTypes || [];
        curQueryConsoleTypes.value = props.enableConsoleTypes?.length ? props.enableConsoleTypes : [props.curConsoleType].filter(Boolean);
    });
    provide(weeksDateKey, weeksDate);
    provide(monthDateKey, monthDate);
    provide(tabsTypeKey, tabsType);
    provide(toDayKey, toDay);
    provide(dataItemKey, dataItem);
    provide(isLoadingKey, isLoading);
    provide(rightToDayKey, rightToDay);
    provide('init', init);

    provide(
        systemTypeKey,
        computed(() => props.systemType)
    );
    provide(
        curConsoleTypeKey,
        computed(() => props.curConsoleType)
    );
    return {
        monthDate,
        tabsType,
        toDay,
        weeksDate,
        init,
        isLoading,
        rightToDay,

        enableConsoleTypesInit
    };
}
