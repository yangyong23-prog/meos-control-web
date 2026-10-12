// @ts-ignore
import i18n from '@/localization';
import { batchQueryPeriodData } from '@/apis/public';
import useLoading from '@/hooks/useLoading';
import dayjs from 'dayjs';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { systemIdKey } from './useBaseHook';
import { dayGroupCode, monthGroupCode, anualGroupCode } from '../constants/index';
import { ECHART_COLORS, getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsBefore } from '@/utils/dayjsTools';
const { cancelQuest, cancelToken } = UseCancelTokenHooks();
export const generateArray = (startTime, endTime, interval = 1, unit, format = 'HH:mm') => {
    // 初始化结果数组
    const arrayObject = [];
    // 生成5分钟维度的时间数组
    let currentTime = startTime;
    while (dayjsIsBefore(currentTime, endTime)) {
        arrayObject.push({
            val: currentTime,
            key: currentTime.format(format)
        });
        currentTime = currentTime.add(interval, unit);
    }
    return arrayObject;
};
// 获取时间范围及时间点数组
const getTime = (precision, interval, unit, format) => {
    // 获取当前时间的前一个整点时间（按interval间隔）
    const startTime = `${getDayjsTz().startOf(precision).format('YYYYMMDDHHmmss')}`;
    const endTime = getDayjsTz().add(1, precision).startOf(precision).format('YYYYMMDDHHmmss');
    return {
        startDay: startTime,
        endDay: endTime,
        times: generateArray(dayjs.tz(startTime), dayjs.tz(endTime), interval, unit, format)
    };
};
const handleEchartData = ({ objectId, infoCode, values, unit, yAxisIndex, xAxisIndex }) => {
    return {
        name: objectId + '&&' + infoCode.id + '&&' + infoCode.name,
        type: infoCode.type,
        areaStyle: infoCode?.areaStyle,
        symbol: 'emptyCircle',
        showSymbol: true,
        show: true,
        barMaxWidth: infoCode.barMaxWidth,
        barWidth: infoCode.barWidth,
        axisPointer: infoCode.axisPointer,
        unit,
        yAxisIndex,
        xAxisIndex,
        // 根据当前对象的索引和对象数组的长度决定线型
        lineStyle: {
            type: infoCode.type === 'line' ? 'solid' : 'rect',
            color: ECHART_COLORS[0]
        },
        // 根据时间和数据生成图表的数据点
        data: values,
        infoCode
    };
};

export const useMonitoringBoard = () => {
    const { loading, openLoading, closeLoading } = useLoading(
        'monitoring-board-main',
        'transparent',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const isEmpty = ref(true);
    const chartConfigs = ref([
        {
            name: i18n.global.t('meos_control_web.today_power_generation'),
            objType: 'INFOCODE_TYPE',
            auxiliaryLine: true,
            yAxisIndex: 0,
            xAxisIndex: 0,
            objects: [],
            infoCode: {
                id: 'accddailyCumulativeEnergy',
                groupCode: dayGroupCode,
                name: i18n.global.t('meos_control_web.power_generation'),
                type: 'line',
                lineStyle: {
                    type: 'solid'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(36, 111, 229, 0.2)' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: '#246FE500' // 100% 处的颜色
                            }
                        ],
                        global: false
                    }
                }
            },
            unit: 'kWh'
        },
        {
            name: i18n.global.t('meos_control_web.monthly_power_generation'),
            objType: 'INFOCODE_TYPE',
            auxiliaryLine: true,
            yAxisIndex: 0,
            xAxisIndex: 0,
            objects: [],
            infoCode: {
                id: 'monthlyCumulativeEnergy',
                groupCode: monthGroupCode,
                name: i18n.global.t('meos_control_web.power_generation'),
                type: 'bar',
                barWidth: '60%',
                barMaxWidth: 60,
                lineStyle: {
                    type: 'bar'
                },
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: { color: '#C4C9CF4D' }
                }
            },
            unit: 'kWh'
        },
        {
            name: i18n.global.t('meos_control_web.annual_power_generation'),
            objType: 'INFOCODE_TYPE',
            auxiliaryLine: true,
            yAxisIndex: 0,
            xAxisIndex: 0,
            objects: [],
            infoCode: {
                id: 'annualCumulativeEnergy',
                groupCode: anualGroupCode,
                barWidth: '60%',
                barMaxWidth: 60,
                showBackground: true,
                name: i18n.global.t('meos_control_web.power_generation'),
                type: 'bar',
                lineStyle: {
                    type: 'bar'
                },
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: { color: '#C4C9CF4D' }
                }
            },
            unit: 'kWh'
        }
    ]);
    const getBatchQueryPeriodData = async (infoCodes, objectIds, config, enumTime, chartId) => {
        let time, format;
        switch (enumTime) {
            case '15min':
                format = 'HH:mm';
                time = getTime('day', 15, 'm', format);
                break;
            case '1d':
                format = 'DD';
                time = getTime('month', 1, 'day', format);
                break;
            case '1m':
                format = i18n.global.t('meos_control_web.date_format5');
                time = getTime('year', 1, 'month', format);
                break;
            default:
                format = 'HH:mm';
                time = getTime('day', 1, 'hour', format);
        }
        try {
            const { data } = await batchQueryPeriodData(
                {
                    beginDate: time.startDay,
                    endDate: time.endDay,
                    enumTime: enumTime,
                    infoCodes,
                    objectIds
                },
                config
            );
            // 格式化返回数据
            data.forEach(item => {
                item.data.forEach(dataItem => {
                    dataItem.data = dataItem.data.map(val => ({ value: val.ipValue, time: val.time }));
                });
            });
            const infoCodeObj = {};
            const arr = [];
            structuredClone(data).forEach(item => {
                item.data.forEach(dataItem => {
                    infoCodeObj[chartId] = dataItem;
                });
            });
            chartConfigs.value.forEach(config => {
                if (config.infoCode.id === chartId) {
                    const initChartData = time.times.map(ti => ({ time: ti.key, val: ti.val, value: null }));
                    const infoCodeData = infoCodeObj?.[config.infoCode.id]?.data || [];
                    if (infoCodeData.length === 0) {
                        config.empty = true;
                    } else {
                        isEmpty.value = false;
                    }
                    const { infoCode } = config;
                    // 用 Map 优化查找
                    const valueMap = new Map(infoCodeData.map(val => [dayjs(val.time).format(format), val]));
                    const values = initChartData.map(item => {
                        // 用格式化后的时间做 key，避免 dayjs.isSame 的 O(n) 查找
                        const val = valueMap.get(item.time);
                        return {
                            value: val ? val.value : null,
                            label: item.val.format(format === 'DD' ? i18n.global.t('meos_control_web.date_format3') : format),
                            time: item.time,
                            lineStyle: infoCode.lineStyle,
                            areaStyle: infoCode?.areaStyle,
                            unit: config.unit,
                            objectId: objectIds[0],
                            infoCodeName: infoCode.name,
                            groupCode: infoCode.groupCode,
                            key: 'infoCodeName'
                        };
                    });
                    config.chartData = handleEchartData({
                        objectId: objectIds[0],
                        infoCode,
                        values: values,
                        unit: config.unit,
                        yAxisIndex: config.yAxisIndex,
                        xAxisIndex: config.xAxisIndex
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getChartData = async () => {
        cancelQuest();
        try {
            const systemId = inject(systemIdKey);
            // 批量查询数据并更新图表
            await Promise.all([
                getBatchQueryPeriodData(
                    ['accddailyCumulativeEnergy'],
                    [systemId.value],
                    {
                        cancelToken: cancelToken()
                    },
                    '15min',
                    'accddailyCumulativeEnergy'
                ),
                getBatchQueryPeriodData(
                    ['accddailyCumulativeEnergy'],
                    [systemId.value],
                    {
                        cancelToken: cancelToken()
                    },
                    '1d',
                    'monthlyCumulativeEnergy'
                ),
                getBatchQueryPeriodData(
                    ['accddailyCumulativeEnergy'],
                    [systemId.value],
                    {
                        cancelToken: cancelToken()
                    },
                    '1m',
                    'annualCumulativeEnergy'
                )
            ]);
        } catch (error) {
            console.log(error);
        }
    };
    const init = async () => {
        openLoading();
        try {
            await getChartData();
        } finally {
            closeLoading();
        }
    };
    onMounted(() => {
        init().then();
    });
    return {
        loading,
        isEmpty,
        chartConfigs
    };
};
