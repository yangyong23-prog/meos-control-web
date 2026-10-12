// @ts-ignore
import i18n from '@/localization';
/* eslint-disable camelcase */
import { getListEnergyCurveDataAxios, getStatisticsAxios } from '@/apis/runAnalysis';
import useLoading from '@/hooks/useLoading';
import { SUCCESSCODE } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import { toLower, uniqueId } from 'lodash';
import { fifteenMinuteTimesKey, globalTimeKey, oneHourTimesKey } from '../injectionKey';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { isEmptyNoReturn } from '@/utils/tools';
import { COOL_STORAGE, THERMAL_STORAGE } from '../variable';
const { cancelQuest, cancelToken } = UseCancelTokenHooks();

export const useEnergyHook = () => {
    const fifteenMinuteTimes = inject(fifteenMinuteTimesKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
    const oneHourTimes = inject(oneHourTimesKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
    const time = inject(globalTimeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
    const { openLoading, closeLoading, loading } = useLoading(
        'chart-box',
        '#fff',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const loadingStatistics = ref(false);
    const statistics = ref();
    const valueSelectionType = ref('');
    const noData = ref(false);
    const energyEchartData = ref([]);
    const legendObject = ref({});
    const coldAndHeatStorage = ref([]);
    const EnergyType = {
        OUTDOOR_TEMP_NAME: {
            type: 'OUTDOOR_TEMP_NAME',
            name: i18n.global.t('meos_control_web.outdoor_temperature')
        },
        ELECTRICITY_PRICE_NAME: {
            type: 'ELECTRICITY_PRICE_NAME',
            name: i18n.global.t('meos_control_web.electricity_tariff'),
            select: false
        },
        CARBON_FACTOR_NAME: {
            type: 'CARBON_FACTOR_NAME',
            name: i18n.global.t('meos_control_web.carbon_liability_factor'),
            select: false
        },
        IN_DOORTEMP_DATA: {
            type: 'IN_DOORTEMP_DATA',
            name: i18n.global.t('meos_control_web.indoor_temperature'),
            yName: i18n.global.t('meos_control_web.temperature'),
            select: true
        }
    };
    // 定义默认的配置对象
    const defaultConfig = {
        type: 'line',
        times: fifteenMinuteTimes.value,
        yAxisIndex: 1,
        xAxisIndex: 1,
        connectNulls: true,
        showSymbol: false,
        showLegend: true
    };

    /**
     * 异步获取统计数据
     * 此函数通过Axios请求获取特定日期的统计数据，并根据请求结果更新页面状态
     * 包括处理数据格式、更新全局状态以及错误处理
     */
    const getStatistics = async () => {
        // 请求开始时，设置加载状态为true
        loadingStatistics.value = true;
        try {
            // 发起Axios请求获取统计数据
            const { data, code } = await getStatisticsAxios({ queryDate: dayjs(time.value).format('YYYY-MM-DD') }, { cancelToken: cancelToken() });
            // 如果请求成功
            if (code === SUCCESSCODE) {
                // 同步数据格式
                data.valueSelection = data.valueSelection || {};
                data.valueSelection.valueSelectType = data.valueSelection?.valueSelectionType;
                data.valueSelection.fillRate = data.valueSelection?.tempFillRateConfig;
                data.valueSelection.elecDataList = [];
                // 处理能源统计数据
                if (data.energyStatistics) {
                    data.energyStatisticsList = [];
                    for (const key in data.energyStatistics) {
                        if (Object.prototype.hasOwnProperty.call(data.energyStatistics, key)) {
                            const element = data.energyStatistics[key];
                            element.value = element.dataValue;
                            data.energyStatisticsList.push(element);
                        }
                    }
                }
                // 更新全局状态
                statistics.value = data;
                valueSelectionType.value = statistics.value?.valueSelection?.valueSelectionType;
            }
        } catch (error) {
            // 错误处理
            console.log(error);
        } finally {
            // 请求结束后，设置加载状态为false
            loadingStatistics.value = false;
            // 根据选择类型进一步加载数据或显示无数据状态
            if (valueSelectionType.value) {
                getListEnergyCurveData();
            } else {
                closeLoading();
                noData.value = true;
            }
        }
    };
    // 创建数据对象的函数
    const createDataObject = (type, data, configOverrides) => {
        return {
            name: EnergyType[type].name,
            yName: EnergyType[type].yName,
            code: type,
            data: data || [],
            select: EnergyType[type].select,
            show: EnergyType[type].select === false ? false : true,
            ...defaultConfig,
            ...configOverrides
        };
    };
    // 获取数据的函数
    const getDataByType = data => {
        // 创建各个数据对象
        const outdoorTempData = createDataObject('OUTDOOR_TEMP_NAME', data.outdoorTempData, { xAxisIndex: 0, times: oneHourTimes.value });
        const electricityPriceData = createDataObject('ELECTRICITY_PRICE_NAME', data.electricityPriceData, { yAxisIndex: 2 });
        const carbonFactorData = createDataObject('CARBON_FACTOR_NAME', data.carbonFactorData, { yAxisIndex: 2 });
        const inDoorTempData = createDataObject('IN_DOORTEMP_DATA', data.inDoorTempData, { unit: '℃' });

        // 定义类型数据
        const typeData = {
            value_select_lowest_energy: [outdoorTempData, inDoorTempData],
            value_select_lowest_cast: [outdoorTempData, inDoorTempData, electricityPriceData],
            value_select_lowest_carbon_emissions: [outdoorTempData, inDoorTempData, carbonFactorData],
            value_select_quality_first: [outdoorTempData, inDoorTempData]
        };

        // 获取选择的类型
        const selectedType = toLower(valueSelectionType.value);
        // 检查是否存在该类型
        if (!typeData[selectedType]) {
            throw new Error(`Invalid type selection: ${selectedType}`);
        }

        return typeData[selectedType];
    };
    const handleEchartData = data => {
        data.id = uniqueId('echart-id-');
        data.unit = data.data?.[0]?.unit || data.unit || '';
        data.data = data.times.map(val => {
            const value = data.data.find(dataValue => dayjs(dataValue.dataTime).format('HH:mm') === val);
            const number = isEmptyNoReturn(value?.dataValue) ? null : (+value.dataValue).toFixed(2);
            return {
                value: isEmptyNoReturn(number) ? null : +number,
                unit: data.unit
            };
        });
        delete data.times;
    };
    const createBarItem = (name, data) => ({
        type: 'bar',
        stack: 'Energy',
        times: oneHourTimes.value,
        showLegend: true,
        name,
        barMaxWidth: '60px',
        barWidth: '40%',
        data: data || []
    });
    const getListEnergyCurveData = async () => {
        energyEchartData.value = [];
        coldAndHeatStorage.value = [];
        try {
            const { data, code } = await getListEnergyCurveDataAxios(
                { queryDate: dayjs(time.value).format('YYYY-MM-DD'), valueSelectionType: valueSelectionType.value },
                { cancelToken: cancelToken() }
            );
            if (code === SUCCESSCODE) {
                const echartData = [];
                data.coolResourceData && echartData.push(createBarItem(i18n.global.t('meos_control_web.cooling_source'), data.coolResourceData));
                data.hotResourceData && echartData.push(createBarItem(i18n.global.t('meos_control_web.heat_source'), data.hotResourceData));
                data.coolAndHotResourceData && echartData.push(createBarItem(i18n.global.t('meos_control_web.heating_cooling_source'), data.coolAndHotResourceData));
                data.terminalData && echartData.push(createBarItem(i18n.global.t('meos_control_web.terminal'), data.terminalData));
                echartData.push(...getDataByType(data));
                for (const item of echartData) {
                    handleEchartData(item);
                }
                energyEchartData.value = echartData;
                const list = structuredClone(data.tagData);
                for (let index = 0; index < data.tagData.length; index++) {
                    const element = data.tagData[index];
                    if (index !== data.tagData.length - 1) {
                        if (element.dataValue !== '0' && list[index + 1].dataValue === '0') {
                            list[index + 1].dataValue = element.dataValue;
                            console.log(element.dataValue);
                        }
                    }
                }

                const tagData = list?.filter(item => item.dataValue !== '0') || [];
                coldAndHeatStorage.value =
                    tagData?.map(item => {
                        const obj = {
                            time: dayjs(item.dataTime).format('HH:mm'),
                            type: item.dataValue === '1' ? COOL_STORAGE : THERMAL_STORAGE
                        };
                        return obj;
                    }) || [];
                console.log(echartData);
            }
        } catch (error) {
            console.log(error);
        } finally {
            console.log('finally');
            closeLoading();
        }
    };
    const init = () => {
        noData.value = false;
        valueSelectionType.value = '';
        cancelQuest();
        openLoading();
        getStatistics();
    };
    onMounted(() => {
        init();
    });
    watch(
        () => time.value,
        () => {
            init();
        }
    );
    return {
        loadingStatistics,
        loading,
        statistics,
        energyEchartData,
        legendObject,
        noData,
        coldAndHeatStorage
    };
};

export function groupTimeIntervals(arr) {
    // 将时间字符串转换为分钟数的函数
    function timeToMinutes(item) {
        const [hour, minute] = item.time.split(':').map(Number);
        item.NumberTime = hour * 60 + minute;
        return item;
    }

    const minutesArray = arr.map(item => timeToMinutes(item));
    return minutesArray
        .reduce((acc, cur, index) => {
            if (index === 0) {
                acc.push([cur]);
            } else {
                const lastSegment = acc[acc.length - 1];
                if (cur.NumberTime - lastSegment[lastSegment.length - 1].NumberTime <= 15 && cur.type === lastSegment[lastSegment.length - 1].type) {
                    lastSegment.push(cur);
                } else {
                    acc.push([cur]);
                }
            }
            return acc;
        }, [])
        .map(segment =>
            segment.length !== 1 ? [arr[minutesArray.indexOf(segment[0])], arr[minutesArray.indexOf(segment[segment.length - 1])]] : [arr[minutesArray.indexOf(segment[0])]]
        );
}
