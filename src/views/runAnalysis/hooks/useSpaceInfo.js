// @ts-ignore
import i18n from '@/localization';
import { getSpaceDetailAxios } from '@/apis/runAnalysis';
import { AIR_SPACE_STATUS, SPACE_INFO_ANALYSIS, SPACE_INFO_RELATED_EQUIPEMNT, TEMPERATURE } from '../variable';
import { curSelectedSpaceKey, globalTimeKey, spaceTypeKey } from '../injectionKey';
import dayjs from 'dayjs';
import { generateTimeArrayByMinutes, getFiveMinuteData } from '@/utils/tools';
import { isArray, round } from 'lodash';
import useLoading from '@/hooks/useLoading';
import Decimal from 'decimal.js';
import _ from 'lodash';
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);
export default () => {
    const { openLoading, closeLoading, loading } = useLoading(
        'space-info-content',
        '#e9f1f8',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const loadingData = ref(false);
    const curSelectedSpace = inject(curSelectedSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
    const time = inject(globalTimeKey);
    const dataAnalysis = ref();
    const relatedEquipemnt = ref();
    const proportionStatistics = ref({
        TOO_COLD: 0,
        COLD: 0,
        APPROPRIATE: 0,
        HOT: 0,
        TOO_HOT: 0
    });
    const baseInfo = ref({
        businessTimeRangeList: [],
        airConditioningDemandTimeRangeList: [],
        isAlgorithmCompute: false
    });
    const airSeason = ref('');
    const temperatureBars = ref([]);
    const CO2Bars = ref({ carbonDioxideLimitValue: 0, carbonDioxideUpperLimitValue: 0 });
    const tabList = ref([
        {
            id: SPACE_INFO_ANALYSIS,
            name: i18n.global.t('meos_control_web.data_analysis')
        },
        {
            id: SPACE_INFO_RELATED_EQUIPEMNT,
            name: i18n.global.t('meos_control_web.related_equipment')
        }
    ]);
    const tabData = ref(SPACE_INFO_ANALYSIS);
    const echartDatas = ref([]);
    const spaceType = inject(spaceTypeKey);
    const handleTimeStr = val => {
        const start = '2020-01-01' + val.split(',')[0];
        const end = '2020-01-01' + val.split(',')[1];
        return `${dayjs(start).format('HH:mm')}-${dayjs(end).format('HH:mm')}`;
    };
    function roundTimeToFiveMinute(data, direction = 'up') {
        const [hour, minute] = data.split(':').map(Number);
        const minutes = hour * 60 + minute;
        if (minutes % 5 === 0) {
            return data;
        }
        let roundedMinutes;
        if (direction === 'up') {
            roundedMinutes = Math.ceil(minutes / 5) * 5;
        } else if (direction === 'down') {
            roundedMinutes = Math.floor(minutes / 5) * 5;
        }
        const hourPart = Math.floor(roundedMinutes / 60)
            .toString()
            .padStart(2, '0');
        const minutePart = (roundedMinutes % 60).toString().padStart(2, '0');
        return `${hourPart}:${minutePart}`;
    }

    const getSpaceInfo = async () => {
        tabData.value === SPACE_INFO_ANALYSIS && openLoading();
        loadingData.value = true;
        const timeArray = generateTimeArrayByMinutes(5);
        try {
            const res = await getSpaceDetailAxios({ queryDate: dayjs(time.value).format('YYYY-MM-DD'), spaceId: curSelectedSpace.value.id, secondType: spaceType.value });
            const { data } = res;
            baseInfo.value.airConditioningDemandTimeRangeList = data.basicInfo?.airConditioningDemandTimeRangeList?.map(handleTimeStr) || [];
            baseInfo.value.businessTimeRangeList = data.basicInfo?.businessTimeRangeList?.map(handleTimeStr) || [];
            baseInfo.value.isAlgorithmCompute = data.basicInfo?.isAlgorithmCompute;
            const businessTimeList = [];
            baseInfo.value.businessTimeRangeList.forEach(val => {
                let start = val.split('-')[0],
                    end = val.split('-')[1];
                if (start && end) {
                    start = roundTimeToFiveMinute(start);
                    end = roundTimeToFiveMinute(end, 'down');
                    businessTimeList.push(...getFiveMinuteData(start, end));
                }
            });
            const temperatureDataAnalysis = data.dataAnalysis;
            if (spaceType.value === TEMPERATURE) {
                airSeason.value = temperatureDataAnalysis?.temperatureStandard?.airSeason;
                echartDatas.value.push(handleEchartData(i18n.global.t('meos_control_web.actual_temperature'), timeArray, temperatureDataAnalysis?.temperatureRealValue || []));
                echartDatas.value.push(handleEchartData(i18n.global.t('meos_control_web.target_temperature'), timeArray, temperatureDataAnalysis?.targetTemperature || []));
                echartDatas.value.push(
                    handleEchartData(
                        i18n.global.t('meos_control_web.over_cooled_threshold'),
                        timeArray,
                        temperatureDataAnalysis?.temperatureStandard?.underCoolingSeasonLimitValue ?? null
                    )
                );
                echartDatas.value.push(
                    handleEchartData(
                        i18n.global.t('meos_control_web.comfort_zone_lower'),
                        timeArray,
                        temperatureDataAnalysis?.temperatureStandard?.lowerComfortSeasonLimitValue ?? null
                    )
                );
                echartDatas.value.push(
                    handleEchartData(
                        i18n.global.t('meos_control_web.comfort_zone_upper'),
                        timeArray,
                        temperatureDataAnalysis?.temperatureStandard?.upperComfortSeasonLimitValue ?? null
                    )
                );
                echartDatas.value.push(
                    handleEchartData(
                        i18n.global.t('meos_control_web.over_heat_threshold'),
                        timeArray,
                        temperatureDataAnalysis?.temperatureStandard?.overHeatingSeasonLimitValue ?? null
                    )
                );
                temperatureBars.value = [
                    {
                        name: i18n.global.t('meos_control_web.over_cooled_threshold'),
                        value: data.temperatureStandard?.underCoolingSeasonLimitValue
                    },
                    {
                        name: i18n.global.t('meos_control_web.comfort_zone_lower'),
                        value: data.temperatureStandard?.lowerComfortSeasonLimitValue
                    },
                    {
                        name: i18n.global.t('meos_control_web.comfort_zone_upper'),
                        value: data.temperatureStandard?.upperComfortSeasonLimitValue
                    },
                    {
                        name: i18n.global.t('meos_control_web.over_heat_threshold'),
                        value: data.temperatureStandard?.overHeatingSeasonLimitValue
                    }
                ];
            } else {
                airSeason.value = temperatureDataAnalysis?.temperatureStandard?.airSeason;
                CO2Bars.value.carbonDioxideLimitValue = data.co2Standard?.carbonDioxideLimitValue;
                CO2Bars.value.carbonDioxideUpperLimitValue = data.co2Standard?.carbonDioxideUpperLimitValue;
                echartDatas.value.push(handleEchartData(i18n.global.t('meos_control_web.actual_value'), timeArray, temperatureDataAnalysis?.co2RealValue || []));
                echartDatas.value.push(handleEchartData(i18n.global.t('meos_control_web.target_value'), timeArray, temperatureDataAnalysis?.targetCo2 || []));
                echartDatas.value.push(
                    handleEchartData(i18n.global.t('meos_control_web.comfort_zone_upper'), timeArray, temperatureDataAnalysis?.co2Standard?.carbonDioxideLimitValue ?? null)
                );
                echartDatas.value.push(
                    handleEchartData(i18n.global.t('meos_control_web.high_threshold'), timeArray, temperatureDataAnalysis?.co2Standard?.carbonDioxideUpperLimitValue ?? null)
                );
            }
        } finally {
            closeLoading();
            loadingData.value = false;
        }
    };

    const handleEchartData = (name, timeArray, data = []) => {
        const chartObj = {
            type: 'line',
            name,
            showSymbol: false,
            symbol: 'none',
            connectNulls: true
        };
        if (isArray(data)) {
            return {
                ...chartObj,
                data: timeArray.map(item => {
                    const obj = data?.find(val => item === dayjs(val.dataTime).format('HH:mm'));
                    if (obj) {
                        return {
                            value: obj.dataValue
                        };
                    }
                    return {
                        value: null
                    };
                })
            };
        } else {
            return {
                ...chartObj,
                lineStyle: {
                    type: 'dashed'
                },
                data: timeArray.map(() => ({
                    value: data
                }))
            };
        }
    };
    const change = data => {
        if (data.id === SPACE_INFO_RELATED_EQUIPEMNT) {
            closeLoading();
        } else {
            loadingData.value && openLoading();
        }
    };

    const handelTotal = () => {
        proportionStatistics.value = {
            TOO_COLD: 0,
            COLD: 0,
            APPROPRIATE: 0,
            HOT: 0,
            TOO_HOT: 0
        };
        curSelectedSpace.value.timeRanges.forEach(item => {
            if (item.status === 'TOO_HIGH') {
                item.status = 'TOO_HOT';
            }
            if (item.status === 'HIGH') {
                item.status = 'HOT';
            }
        });
        let total = 0;
        const keys = Object.keys(proportionStatistics.value).filter(item => item !== AIR_SPACE_STATUS.APPROPRIATE);
        keys.forEach(key => {
            let statusTimes = curSelectedSpace.value.timeRanges.filter(item => item.status === key);
            const totalNum = curSelectedSpace.value.timeRanges.length;
            const num = new Decimal(round(statusTimes.length / totalNum, 4)).mul(100).toFixed(2);
            proportionStatistics.value[key] = {
                times: statusTimes,
                value: num
            };
            total += num * 1;
        });
        proportionStatistics.value[AIR_SPACE_STATUS.APPROPRIATE] = {
            times: curSelectedSpace.value.timeRanges.filter(item => item.status === AIR_SPACE_STATUS.APPROPRIATE),
            value: new Decimal(100 - total < 0 ? 0 : 100 - total).toFixed(2)
        };
    };
    const init = () => {
        echartDatas.value = [];
        getSpaceInfo();
        handelTotal();
    };
    onMounted(() => {
        init();
    });
    watch(
        () => curSelectedSpace.value.id,
        () => {
            init();
        }
    );
    return {
        dataAnalysis,
        relatedEquipemnt,
        tabList,
        tabData,
        temperatureBars,
        CO2Bars,
        baseInfo,
        echartDatas,
        loading,
        proportionStatistics,
        airSeason,
        getSpaceInfo,
        change
    };
};
