import { TEMPERATURE, SAPCETYPE, CO2, HUMIDITY, TDB_TYPE, CO2_TYPE, HUMIDITY_TYPE, CHART_TYPE } from '../variable';
import { makeFlatBuildingFloorSpaces, findSpaceStatusInTime } from '../utils/index';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import i18n from '@/localization';
import { ECHART_COLORS, getDayjsTz } from '@/utils/globalVariables';
import { isNil, orderBy, round } from 'lodash';
import { currentSystemKey, infoCodesAllMapKey, objectsMapKey, hasSomeEnableHumidityKey } from './useStaticData';
import { getInfoCodeUniqueKey } from '../utils';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { queryProjectCarbonData, queryProjectElecPrice } from '@/apis/common';
import baseStore from '@/store/baseStore';
import { getOriginalTimeKey } from '../injectionKey';
import { templateConfigsKey } from './useTemplateConfig';

export const curSelectedTimeKey = Symbol('curSelectedTime');
export const curSelectedSpaceObjKey = Symbol('curSelectedSpaceObj');
export const curSelectedFloorObjKey = Symbol('curSelectedFloorObj');
export const spaceTypeKey = Symbol('spaceType');
export const spaceTypesKey = Symbol('spaceTypes');
export const chartTypesKey = Symbol('chartTypes');

export default props => {
    const spaceTypes = ref([SAPCETYPE[TEMPERATURE], SAPCETYPE[CO2]]);
    const spaceType = ref(props.spaceTypeData);
    const curSelectedTime = ref(dayjs(props.startTime).format('HH:mm'));
    // 当前选中空间对象
    const curSelectedSpaceObj = ref();

    const curSelectedFloorObj = ref();

    const loading = ref(false);
    const spaceMap = ref(new Map());

    const objectsMap = inject(objectsMapKey);
    const hasSomeEnableHumidity = inject(hasSomeEnableHumidityKey);

    watch(
        () => hasSomeEnableHumidity.value,
        () => {
            if (hasSomeEnableHumidity.value) {
                spaceTypes.value = [SAPCETYPE[TEMPERATURE], SAPCETYPE[CO2], SAPCETYPE[HUMIDITY]];
            } else {
                spaceTypes.value = [SAPCETYPE[TEMPERATURE], SAPCETYPE[CO2]];
            }
        },
        { immediate: true }
    );

    // 平铺结构的左侧列表数据
    const flatBuildingFloorSpaces = computed(() => {
        let spaces = Array.from(spaceMap.value.values());
        spaces = spaces.sort((a, b) =>
            a.localName?.localeCompare(b.localName, 'zh', {
                numeric: true,
                sensitivity: 'base'
            })
        );
        if (curSelectedFloorObj.value?.id) {
            spaces = spaces.filter(space => space.floorId === curSelectedFloorObj.value?.id);
        }
        if (props.spaceIds) {
            spaces = spaces.filter(space => props.spaceIds.includes(space.id));
        }
        const list = orderBy(spaces, 'floorSequenceId', 'desc');
        return makeFlatBuildingFloorSpaces(list || []);
    });

    const clearData = () => {
        spaceMap.value = new Map();
    };

    const currentMapSpaces = computed(() => {
        if (spaceMap.value?.size > 0) {
            let spaces = Array.from(spaceMap.value.values());
            if (curSelectedFloorObj.value?.id) {
                spaces = spaces.filter(space => space.floorId === curSelectedFloorObj.value?.id);
            }
            return spaces
                .map(space => {
                    const item = findSpaceStatusInTime(space, curSelectedTime.value);
                    if (item) {
                        return {
                            ...item,
                            ...space
                        };
                    }
                    return null;
                })
                .filter(Boolean);
        }
        return [];
    });

    const floorMapSpaces = computed(() => {
        let spaces = Array.from(spaceMap.value.values());
        if (props.spaceIds) {
            spaces = spaces.filter(space => props.spaceIds.includes(space.id));
        }
        return spaces.map(s => {
            s.extraData = {};
            return s;
        });
    });

    watchEffect(() => {
        floorMapSpaces.value.forEach(s => {
            const { cO2, cO2Type, co2, co2Type, tdbType, tdb, rhType, rh } = findSpaceStatusInTime(s, curSelectedTime.value);
            if (spaceType.value === TEMPERATURE) {
                s.extraData.tdbType = tdbType;
                s.extraData.tdb = tdb;
                s.extraData.cO2Type = undefined;
                s.extraData.cO2 = undefined;
                s.extraData.rhType = undefined;
                s.extraData.rh = undefined;
            } else if (spaceType.value === CO2) {
                s.extraData.tdbType = undefined;
                s.extraData.tdb = undefined;
                s.extraData.cO2Type = cO2Type ?? co2Type;
                s.extraData.cO2 = cO2 ?? co2;
                s.extraData.rhType = undefined;
                s.extraData.rh = undefined;
            } else if (spaceType.value === HUMIDITY) {
                s.extraData.tdbType = undefined;
                s.extraData.tdb = undefined;
                s.extraData.cO2Type = undefined;
                s.extraData.cO2 = undefined;
                s.extraData.rhType = rhType;
                s.extraData.rh = rh;
            }
        });
    });

    // 空间状态按时刻统计
    const spaceTimeStatistics = computed(() => {
        const res = {};
        currentMapSpaces.value?.forEach(obj => {
            const { status } = obj;
            if (!res[status]) {
                res[status] = 0;
            }
            res[status] += 1;
        });
        return res;
    });

    const querySpaceRecord = async () => {
        if (!spaceType.value) {
            return;
        }
        clearData();
        const { stgySpace = {} } = props.selectData;
        const finalSpace = stgySpace;
        for (const key in finalSpace) {
            if (Object.prototype.hasOwnProperty.call(finalSpace, key)) {
                const element = finalSpace[key];
                const timeRanges = [];
                const TYPE = spaceType.value === TEMPERATURE ? TDB_TYPE : spaceType.value === CO2 ? CO2_TYPE : spaceType.value === HUMIDITY ? HUMIDITY_TYPE : {};
                const keyType = spaceType.value === TEMPERATURE ? 'tdbType' : spaceType.value === CO2 ? 'co2Type' : spaceType.value === HUMIDITY ? 'rhType' : '';

                // 优化：批量处理，减少 dayjs 实例创建和对象扩展操作
                if (Array.isArray(element) && element.length > 0) {
                    const timeRangesArr = new Array(element.length);
                    for (let i = 0; i < element.length; i++) {
                        const item = element[i];

                        // 只构造需要的属性，避免不必要的对象扩展
                        const typeKey = keyType === 'co2Type' ? item?.cO2Type ?? item.co2Type : item[keyType];
                        let tempObj = {
                            status: TYPE[typeKey],
                            time: item.time,
                            tdb: item.tdb,
                            tdbType: item.tdbType,
                            cO2: item?.cO2 ?? item.co2,
                            cO2Type: item?.cO2Type ?? item.co2Type,
                            rh: item.rh,
                            rhType: item.rhType
                        };

                        if (item?.time) {
                            const timeHHmm = dayjs(item.time).format('HH:mm');
                            const todayStr = getDayjsTz().format('YYYYMMDD');
                            const baseTime = dayjs(`${todayStr}${timeHHmm}`);
                            const newTime = baseTime.add(15, 'minute');

                            timeRangesArr[i] = {
                                startStr: baseTime.format('HH:mm'),
                                endStr: newTime.format('HH:mm'),
                                start: baseTime,
                                end: newTime,
                                ...tempObj
                            };
                        }
                    }
                    Array.prototype.push.apply(timeRanges, timeRangesArr);
                }

                const space = objectsMap.value[key];
                let outlineArray = null;
                if (typeof space.outline === 'string') {
                    try {
                        outlineArray = JSON.parse(space.outline);
                    } catch (error) {
                        outlineArray = [];
                    }
                }

                const obj = {
                    spaceId: key,
                    id: key,
                    ...space,
                    outline: outlineArray,
                    spaceName: space?.localName || '--',
                    floorId: space?.floorId || '',
                    buildingId: space?.buildingId || '',
                    type: 'space',
                    timeRanges
                };
                obj.floorSequenceId = treeBuildFloorStore().getBuildOrFloor(obj.floorId)?.floorSequenceId;
                spaceMap.value.set(key, obj);
            }
        }
    };

    /**
     * 修改空间类型
     * 此函数用于更新全局或共享变量spaceType的值
     * 它通过接受一个新的id参数来改变空间类型
     *
     * @param id - 新的空间类型标识符
     *        这个参数的类型取决于空间类型是如何定义的，
     *        通常是数字或字符串
     */
    const changeSpaceType = id => {
        spaceType.value = id;
    };

    const changeTime = data => {
        curSelectedTime.value = data;
    };
    const clickSpace = data => {
        if (!data) {
            curSelectedSpaceObj.value = {};
            return;
        }
        if (data.type === 'space') {
            curSelectedSpaceObj.value = data;
        }
    };
    const init = async (resetSelTime = true) => {
        curSelectedSpaceObj.value = {};
        if (resetSelTime) {
            curSelectedTime.value = dayjs(props.startTime).format('HH:mm');
        }
        await querySpaceRecord();
    };

    const getOriginalTime = inject(getOriginalTimeKey);

    const dateTime = computed(() => {
        return dayjs(getOriginalTime(curSelectedTime.value)).format(i18n.global.t('meos_control_web.date_format3') + ' HH:mm');
    });

    watch(
        () => [spaceType.value, props.showMain],
        () => {
            init();
        }
    );

    onMounted(() => {
        init();
    });
    provide(curSelectedTimeKey, curSelectedTime);
    provide(curSelectedSpaceObjKey, curSelectedSpaceObj);
    provide(curSelectedFloorObjKey, curSelectedFloorObj);
    provide(spaceTypeKey, spaceType);
    provide(spaceTypesKey, spaceTypes);
    return {
        floorMapSpaces,
        flatBuildingFloorSpaces,
        curSelectedTime,
        dateTime,
        currentMapSpaces,
        curSelectedSpaceObj,
        curSelectedFloorObj,
        spaceTypes,
        spaceType,
        spaceTimeStatistics,
        loading,
        changeSpaceType,
        changeTime,
        clickSpace
    };
};

export const useColdChartData = props => {
    const infoCodesAllMap = inject(infoCodesAllMapKey);
    const objectsMap = inject(objectsMapKey);
    const system = inject(currentSystemKey);
    const dataType = ref('all');
    const CODE_SYSTEMS_TYPE = { id: 'ACCC_ACAC', name: i18n.global.t('common.cooling_source_system'), data: null };
    const dataTypes = ref([
        { id: 'all', name: i18n.global.t('meos_control_web.overall_view') },
        { id: 'ACCC_ACAC', name: i18n.global.t('common.cooling_source_system'), data: null }
    ]);
    const templateConfigs = inject(templateConfigsKey);

    const computedDataType = computed(() => {
        return dataTypes.value.find(item => item.id === dataType.value);
    });
    const getLegendData = ref([]);
    const chartType = ref(props.chartTypeData);
    const baseCustomFormatter = (arr, showTotal = false) => {
        const itemFun = (item, precision = 2) => {
            return `
						${
                            item.seriesType === 'bar'
                                ? `<span class="echarts-tooltip-icon" style="background-color: ${item.color};width: 12px;height: 12px;border-radius: 2px;"></span>`
                                : `<span class="echarts-tooltip-icon" style="background-color: ${item.color};width: 12px;height: 4px;"></span>`
                        }
						<span class="echarts-tooltip-name">${item.seriesName}：</span>
						<span class="echarts-tooltip-value">${item.data.value === null ? '--' : precision ? round(item.data.value, precision) : item.data.value}${item.data.unit}</span>
					`;
        };

        const lines = arr.filter(item => item.seriesType === 'line');
        const bars = arr.filter(item => item.seriesType === 'bar');
        const linetime = lines?.[0]?.data?.time ? dayjs(lines?.[0]?.data?.time) : '';
        const bartime = dayjs(bars[1]?.data?.time || bars[0].data.time);
        const nextTime = bartime.add(1, 'hour');
        let total = 0;
        bars.forEach(item => {
            const value = item.value ? round(item.data.value, 2) : 0;
            total = new Decimal(value).add(new Decimal(total));
        });
        const content = `
					<div class="echarts-tooltip-chart">
						<div class="echarts-tooltip-title" style="${showTotal ? 'padding-bottom: 0' : ''};border-bottom: none;margin-bottom: 0;font-weight: 500;color:var(--gray-600)">
							${bartime.format(i18n.global.t('meos_control_web.date_format1') + ' HH:mm')}-${nextTime.format('HH:mm')}
						</div>
						${
                            showTotal
                                ? `<div class="fw700" style="color: #2E3742;margin: 8px 0;">${i18n.global.t('meos_control_web.total_energy_consumption_colon')}：${round(
                                      total,
                                      2
                                  )} ${arr[0]?.data.unit}</div>`
                                : ''
                        }
						${bars
                            .map(
                                item => `
							<div class="echarts-tooltip-item fc">
								${itemFun(item)}
							</div>
						`
                            )
                            .join('')}
					</div>
					${
                        linetime
                            ? `<div class="echarts-tooltip-chart" style="padding: 12px 0;margin: 0 12px;border-top: 1px solid #ebeef5;">
						<div class="echarts-tooltip-title" style="padding-bottom: 0;border-bottom: none;margin-bottom: 0;font-weight: 500;color:var(--gray-600)">
							${linetime.format(i18n.global.t('meos_control_web.date_format1') + ' HH:mm')}
						</div>
						${lines
                            .map(
                                item => `
							<div class="echarts-tooltip-item fc">
								${itemFun(item, null)}
							</div>
						`
                            )
                            .join('')}
					</div>`
                            : ''
                    }
					`;

        return content;
    };
    const chartTypes = ref([
        {
            id: CHART_TYPE.CoolingCapacityView,
            name: i18n.global.t('meos_control_web.cooling_load_view'),
            data: [],
            customFormatter: arr => {
                const itemFun = item => {
                    return `
						<span class="echarts-tooltip-icon" style="background-color: ${item.color}"></span>
						<span class="echarts-tooltip-name">${item.seriesName}：</span>
						<span class="echarts-tooltip-value">${item.data.value === null ? '--' : round(item.data.value, 2)}${item.data.unit}</span>
					`;
                };
                const content = `
					<div class="echarts-tooltip-chart">
						<div class="echarts-tooltip-title" style="padding-bottom: 0;border-bottom: none;">
							${dayjs(arr[1]?.data?.time || arr[0].data.time).format(i18n.global.t('meos_control_web.date_format1') + ' HH:mm')}
						</div>
						${arr
                            .map(
                                (item, i) => `
							<div class="echarts-tooltip-item fc">
								${itemFun(item)}
							</div>
						`
                            )
                            .join('')}
					</div>`;

                return content;
            },
            grid: { left: 15, right: 40 }
        },
        {
            id: CHART_TYPE.EnergyConsumptionView,
            name: i18n.global.t('meos_control_web.energy_view'),
            data: [],
            tooltip: {
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(196, 201, 207, 0.30)'
                    }
                }
            },
            grid: { left: 15, right: 40 },
            customFormatter: arr => baseCustomFormatter(arr, true)
        },
        {
            id: CHART_TYPE.CostView,
            name: i18n.global.t('meos_control_web.cost_view'),
            data: [],
            tooltip: {
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(196, 201, 207, 0.30)'
                    }
                }
            },
            grid: { left: 15, right: 40 },
            customFormatter: baseCustomFormatter
        },
        {
            id: CHART_TYPE.CarbonEmissionView,
            name: i18n.global.t('meos_control_web.carbon_emission_view'),
            data: [],
            tooltip: {
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(196, 201, 207, 0.30)'
                    }
                }
            },
            grid: { left: 24, right: 40 },
            customFormatter: baseCustomFormatter
        }
    ]);
    const computedChartType = computed(() => {
        return chartTypes.value.find(item => item.id === chartType.value);
    });
    // 使用Day.js按小时累加数据
    function aggregateByHour(data) {
        const hourlyData = {};
        data?.forEach(item => {
            // 使用Day.js解析时间
            const time = dayjs(item.time);

            // 格式化时间到小时级别（作为分组的唯一标识）
            // 格式为 "YYYY-MM-DD HH"，确保同一天的同一小时被分到一组
            const hourKey = time.format('YYYY-MM-DD HH');

            // 累加数据
            if (hourlyData[hourKey]) {
                hourlyData[hourKey] += item.data;
            } else {
                hourlyData[hourKey] = item.data;
            }
        });

        // 转换为数组并格式化时间格式
        return Object.entries(hourlyData)
            .map(([hourKey, total]) => ({
                time: `${hourKey}:00:00`, // 补全分钟和秒为00:00
                data: total
            }))
            .sort((a, b) => dayjs(a.time).diff(dayjs(b.time))); // 按时间排序
    }
    const hourTimes = props.hourMinuteTimes;
    const fifteenTimes = props.fifteenMinuteTimes;
    const ProjectCarbonData = ref();
    const ProjectElecPrice = ref();
    const getOtherData = () => {
        if (ProjectCarbonData.value) {
            chartTypes.value[3].data.push(ProjectCarbonData.value);
        } else {
            queryProjectCarbonData({
                groupCode: baseStore().groupCode,
                categoryCode: 'CREL',
                beginTime: dayjs(props.startTime).format('YYYYMMDDHHmmss'),
                endTime: dayjs(props.startTime).add(1, 'day').format('YYYYMMDDHHmmss')
            }).then(res => {
                const dataList = res?.data?.dataList ?? [];
                dataList.forEach(item => {
                    item.time = item.date;
                    item.value = item.dataList[0]?.value || null;
                });

                const obj = {
                    name: i18n.global.t('meos_control_web.carbon_emission_factor'),
                    type: 'line',
                    show: true,
                    unit: 'kgCO₂e/kWh',
                    yAxisIndex: 1,
                    xAxisIndex: 1,
                    connectNulls: false,
                    showSymbol: false,
                    legendShow: true,
                    data: dataList.map(item => ({ time: item.time, value: !isNil(item.value) ? item.value : null, unit: 'kgCO₂e/kWh' })),
                    object: {
                        id: system.value.id,
                        name: system.value.localName || '--',
                        show: true
                    },
                    infoCode: {
                        id: 'elecPrice',
                        name: i18n.global.t('meos_control_web.carbon_emission_factor'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'line',
                            color: '#33D4D2'
                        }
                    },
                    itemStyle: {
                        color: '#33D4D2'
                    },
                    lineStyle: {
                        color: '#33D4D2'
                    }
                };
                ProjectCarbonData.value = obj;
                chartTypes.value[3].data.push(obj);
            });
        }
        if (ProjectElecPrice.value) {
            chartTypes.value[2].data.push(ProjectElecPrice.value);
        } else {
            queryProjectElecPrice({
                electricityType: '1',
                startTime: dayjs(props.startTime).format('YYYY-MM-DD HH:mm:ss'),
                endTime: dayjs(props.startTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
            }).then(res => {
                const resData = Array.isArray(res?.data) ? res?.data ?? [] : [];
                const arr = resData.map(item => ({ time: item.ipTime, data: !isNil(item.ipValue) ? item.ipValue : null, unit: i18n.global.t('meos_control_web.yuan_kwh') }));
                const obj = {
                    name: i18n.global.t('meos_control_web.tariff_curve'),
                    type: 'line',
                    show: true,
                    unit: i18n.global.t('meos_control_web.yuan_kwh'),
                    yAxisIndex: 1,
                    xAxisIndex: 1,
                    connectNulls: false,
                    showSymbol: false,
                    legendShow: true,
                    data: setData(arr, fifteenTimes, i18n.global.t('meos_control_web.yuan_kwh')),
                    object: {
                        id: system.value.id,
                        name: system.value.localName || '--',
                        show: true
                    },
                    labelLine: {
                        show: true
                    },
                    infoCode: {
                        id: 'carbon',
                        name: i18n.global.t('meos_control_web.tariff_curve'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'line',
                            color: '#33D4D2'
                        }
                    },
                    itemStyle: {
                        color: '#33D4D2'
                    },
                    lineStyle: {
                        color: '#33D4D2'
                    }
                };
                ProjectElecPrice.value = obj;
                chartTypes.value[2].data.push(obj);
            });
        }
    };

    const setData = (data, times = hourTimes, unit = '') => {
        return times.map(item => {
            const time = dayjs(item);
            const value = data.find(v => dayjs(v.time).format('YYYY-MM-DD HH:mm:ss') === time.format('YYYY-MM-DD HH:mm:ss'));
            return {
                ...value,
                time: time.format('YYYY-MM-DD HH:mm:ss'),
                value: isNil(value?.data) ? null : value?.data,
                unit
            };
        });
    };
    const setAllData = () => {
        chartTypes.value.forEach(item => {
            item.data = [];
        });
        const getData = (data, obj = { unit: 'kWh' }) => data.map(item => ({ ...item, ...obj }));
        // -------------------------------------------- 冷量视图
        const stgyIndicator = props.selectData.stgyIndicator || {};

        const CoolingCapacityView = [
            {
                name: i18n.global.t('meos_control_web.space_cooling_demand'),
                type: 'line',
                show: true,
                unit: 'kWh',
                yAxisIndex: 0,
                xAxisIndex: 0,
                connectNulls: false,
                showSymbol: false,
                legendShow: true,
                data: getData(setData(aggregateByHour(stgyIndicator.spaceNeedCooling || []))),
                object: {
                    id: system.value.id,
                    name: system.value.localName || '--',
                    show: true
                },
                infoCode: {
                    id: 'spaceNeedCooling',
                    name: i18n.global.t('meos_control_web.space_cooling_demand'),
                    type: 'line',
                    interval: 60,
                    lineStyle: {
                        type: 'line',
                        color: '#0091FF'
                    }
                },
                itemStyle: {
                    color: '#0091FF'
                },
                lineStyle: {
                    color: '#0091FF'
                }
            },
            {
                name: i18n.global.t('meos_control_web.cooling_station_system_cooling_capacity'),
                type: 'line',
                show: true,
                unit: 'kWh',
                yAxisIndex: 0,
                xAxisIndex: 0,
                connectNulls: false,
                legendShow: true,
                showSymbol: false,
                data: getData(setData(aggregateByHour(stgyIndicator.coldStationSupCooling || []))),
                object: {
                    id: system.value.id,
                    name: system.value.localName || '--',
                    show: true
                },
                infoCode: {
                    id: 'coldStationSupCooling',
                    name: i18n.global.t('meos_control_web.cooling_station_system_cooling_capacity'),
                    type: 'line',
                    interval: 60,
                    lineStyle: {
                        type: 'line',
                        color: '#33D4D2'
                    }
                },
                itemStyle: {
                    color: '#33D4D2'
                },
                lineStyle: {
                    color: '#33D4D2'
                }
            }
        ];
        chartTypes.value[0].data = CoolingCapacityView;
        getLegendData.value = structuredClone(CoolingCapacityView);
        // --------------------------------------------
        //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 能耗视图
        const coldStationEnergy = stgyIndicator.coldStationEnergy || {};
        const EnergyConsumptionClassCodes = [
            {
                classCode: 'CHILLER',
                name: i18n.global.t('meos_control_web.chiller'),
                itemStyle: {
                    color: '#246FE5'
                },
                lineStyle: {
                    color: '#246FE5'
                }
            },
            {
                classCode: 'ACCCCP',
                name: i18n.global.t('meos_control_web.chilled_water_pump_alt'),
                itemStyle: {
                    color: '#33D4D2'
                },
                lineStyle: {
                    color: '#33D4D2'
                }
            },
            {
                classCode: 'ACCCOP',
                name: i18n.global.t('meos_control_web.cooling_water_pump_alt'),
                itemStyle: {
                    color: '#FFD873'
                },
                lineStyle: {
                    color: '#FFD873'
                }
            },
            {
                classCode: 'ACOTU',
                name: i18n.global.t('meos_control_web.cooling_tower'),
                itemStyle: {
                    color: '#B286F5'
                },
                lineStyle: {
                    color: '#B286F5'
                }
            },

            {
                classCode: 'ACCHCH',
                name: i18n.global.t('meos_control_web.cold_hot_water_circulation_pump'),
                itemStyle: {
                    color: '#7188A6'
                },
                lineStyle: {
                    color: '#7188A6'
                }
            },
            {
                classCode: 'ACCCGP',
                name: i18n.global.t('meos_control_web.supply_glycol_pump'),
                itemStyle: {
                    color: '#9FC9FB'
                },
                lineStyle: {
                    color: '#9FC9FB'
                }
            }
        ];

        const EnergyConsumptionView = EnergyConsumptionClassCodes.map(item => {
            if (!coldStationEnergy?.hasOwnProperty(item.classCode)) {
                return null;
            }
            return {
                ...item,
                type: 'bar',
                show: true,
                unit: 'kWh',
                yAxisIndex: 0,
                xAxisIndex: 0,
                connectNulls: false,
                stack: 'Total',
                barWidth: '40%',
                legendShow: true,
                data: getData(setData(aggregateByHour(coldStationEnergy[item.classCode] || [])))
            };
        })?.filter(Boolean);
        chartTypes.value[1].data = EnergyConsumptionView;
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // ############################################## 费用视图
        const coldStationCost = stgyIndicator.coldStationCost || {};
        const CostClassCodes = [
            {
                classCode: 'CHILLER',
                name: i18n.global.t('meos_control_web.chiller'),
                itemStyle: {
                    color: '#246FE5'
                },
                lineStyle: {
                    color: '#246FE5'
                }
            },
            {
                classCode: 'ACCCCP',
                name: i18n.global.t('meos_control_web.chilled_water_pump_alt'),
                itemStyle: {
                    color: '#33D4D2'
                },
                lineStyle: {
                    color: '#33D4D2'
                }
            },
            {
                classCode: 'ACCCOP',
                name: i18n.global.t('meos_control_web.cooling_water_pump_alt'),
                itemStyle: {
                    color: '#FFD873'
                },
                lineStyle: {
                    color: '#FFD873'
                }
            },
            {
                classCode: 'ACOTU',
                name: i18n.global.t('meos_control_web.cooling_tower'),
                itemStyle: {
                    color: '#B286F5'
                },
                lineStyle: {
                    color: '#B286F5'
                }
            },
            {
                classCode: 'ACCHCH',
                name: i18n.global.t('meos_control_web.cold_hot_water_circulation_pump'),
                itemStyle: {
                    color: '#7188A6'
                },
                lineStyle: {
                    color: '#7188A6'
                }
            },
            {
                classCode: 'ACCCGP',
                name: i18n.global.t('meos_control_web.supply_glycol_pump'),
                itemStyle: {
                    color: '#9FC9FB'
                },
                lineStyle: {
                    color: '#9FC9FB'
                }
            }
        ];
        const CostView = CostClassCodes.map(item => {
            if (!coldStationCost?.hasOwnProperty(item.classCode)) {
                return null;
            }
            return {
                ...item,
                type: 'bar',
                show: true,
                unit: i18n.global.t('meos_control_web.yuan'),
                yAxisIndex: 0,
                xAxisIndex: 0,
                connectNulls: false,
                stack: 'Total',
                barWidth: '40%',
                legendShow: true,
                data: getData(setData(aggregateByHour(coldStationCost[item.classCode] || [])), { unit: i18n.global.t('meos_control_web.yuan') })
            };
        })?.filter(Boolean);
        chartTypes.value[2].data = CostView;
        // ##############################################
        // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& 碳排放视图
        const coldStationCarbon = stgyIndicator.coldStationCarbon || {};
        const CarbonEmissionClassCodes = [
            {
                classCode: 'CHILLER',
                name: i18n.global.t('meos_control_web.chiller'),
                itemStyle: {
                    color: '#246FE5'
                },
                lineStyle: {
                    color: '#246FE5'
                }
            },
            {
                classCode: 'ACCCCP',
                name: i18n.global.t('meos_control_web.chilled_water_pump_alt'),
                itemStyle: {
                    color: '#33D4D2'
                },
                lineStyle: {
                    color: '#33D4D2'
                }
            },
            {
                classCode: 'ACCCOP',
                name: i18n.global.t('meos_control_web.cooling_water_pump_alt'),
                itemStyle: {
                    color: '#FFD873'
                },
                lineStyle: {
                    color: '#FFD873'
                }
            },
            {
                classCode: 'ACOTU',
                name: i18n.global.t('meos_control_web.cooling_tower'),
                itemStyle: {
                    color: '#B286F5'
                },
                lineStyle: {
                    color: '#B286F5'
                }
            },
            {
                classCode: 'ACCHCH',
                name: i18n.global.t('meos_control_web.cold_hot_water_circulation_pump'),
                itemStyle: {
                    color: '#7188A6'
                },
                lineStyle: {
                    color: '#7188A6'
                }
            },
            {
                classCode: 'ACCCGP',
                name: i18n.global.t('meos_control_web.supply_glycol_pump'),
                itemStyle: {
                    color: '#9FC9FB'
                },
                lineStyle: {
                    color: '#9FC9FB'
                }
            }
        ];
        const CarbonEmissionView = CarbonEmissionClassCodes.map(item => {
            if (!coldStationCarbon?.hasOwnProperty(item.classCode)) {
                return null;
            }
            return {
                ...item,
                type: 'bar',
                show: true,
                unit: 'kgCO₂e',
                yAxisIndex: 0,
                xAxisIndex: 0,
                connectNulls: false,
                stack: 'Total',
                barWidth: '40%',
                legendShow: true,
                data: getData(setData(aggregateByHour(coldStationCarbon[item.classCode] || [])), { unit: 'kgCO₂e' })
            };
        })?.filter(Boolean);
        chartTypes.value[3].data = CarbonEmissionView;
        getOtherData();
    };
    const setSystemData = () => {
        const predACAC = props.selectData?.predACAC?.[system.value.id] || [];
        const targetItem = predACAC?.find(item => Object.keys(item).length > 1) || {};
        const keys = Object.keys(targetItem).filter(key => key !== 'time');
        const infoCodes = keys.map(key => {
            const curClassCode = system.value.classCode;
            const infoCodeItem = infoCodesAllMap.value.get(getInfoCodeUniqueKey(curClassCode, key));
            return {
                infoCode: key,
                name: infoCodeItem?.name || key,
                infoName: infoCodeItem?.name || key,
                dataSources: infoCodeItem?.dataSources || [],
                scale: infoCodeItem?.scale || 1,
                unit: infoCodeItem?.unit || '',
                show: true
            };
        });
        const params = {
            objects: [
                {
                    objectId: system.value.id,
                    localName: system.value.localName || '--',
                    classCode: 'ACCC',
                    show: true,
                    color: '#2481F2'
                }
            ],
            objectIdArr: [system.value.id],
            echartData: [],
            parentName: i18n.global.t('meos_control_web.system_parameter'),
            unit: '℃'
        };
        const groups = [
            {
                groupName: i18n.global.t('meos_control_web.chilled_side_supply_return_temp'),
                groupId: 'ACCC_ACAC_01',
                parentId: 'first477',
                infoCodeArr: ['primaryChillWaterMainSupplyTemp', 'primaryChillWaterMainReturnTemp'],
                ...params
            },
            {
                groupName: i18n.global.t('meos_control_web.cooling_side_supply_return_temp'),
                groupId: 'ACCC_ACAC_02',
                parentId: 'first478',
                infoCodeArr: ['coolWaterMainSupplyTemp', 'coolWaterMainReturnTemp'],
                ...params
            },
            {
                groupName: i18n.global.t('meos_control_web.water_flow_rate'),
                groupId: 'ACCC_ACAC_03',
                parentId: 'first479',
                infoCodeArr: ['primaryChillWaterFlow', 'coolWaterFlow'],
                ...params
            }
        ];
        const data = {
            id: 'ACCC_ACAC',
            name: i18n.global.t('common.cooling_source_system'),
            isSystem: true,
            objects: [
                {
                    objectId: system.value.id,
                    localName: system.value.localName || '--',
                    classCode: 'ACCC',
                    show: true,
                    color: '#2481F2'
                }
            ],
            infoCodes,
            children: groups.map(group => {
                const obj = group;
                obj.infoCodes = infoCodes.filter(item => obj.infoCodeArr.includes(item.infoCode));
                obj.unit = obj.infoCodes[0]?.unit || '';
                obj.echartData = obj.infoCodes.map(item => {
                    const v = {
                        ...item,
                        show: true,
                        type: 'line',
                        symbol: 'none',
                        connectNulls: true,
                        name: item.name + '&&' + system.value.localName,
                        objectName: system.value.localName,
                        objectId: system.value.id,
                        lineStyle: {
                            type: 'solid',
                            color: null
                        },
                        data: predACAC.map(a => {
                            return {
                                ...item,
                                time: dayjs(a.time).format('HH:mm'),
                                value: !isNil(a[item.infoCode]) ? round(a[item.infoCode] * 1, item.scale) : null
                            };
                        })
                    };
                    return v;
                });
                return obj;
            })
        };
        // dataTypes.value[1].data = data;
        return data;
    };
    const setEquipmentData = (
        keys = ['stgyACCCSC', 'stgyACCCCC'],
        group = [
            {
                groupName: i18n.global.t('meos_control_web.operation_status'),
                infoCodeArr: ['runStatus']
            },
            {
                groupName: i18n.global.t('meos_control_web.chilled_side_temperature'),
                infoCodeArr: ['evapWaterInTemp', 'evapWaterOutTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.cooling_side_temperature'),
                infoCodeArr: ['condWaterInTemp', 'condWaterOutTemp']
            }
        ],
        allowedClassCodes
    ) => {
        let equipmentData = {};
        keys.forEach(key => {
            equipmentData = { ...equipmentData, ...props.selectData[key] };
        });
        const keysArr = Object.keys(equipmentData);

        if (!keysArr?.length) return null;
        // eslint-disable-next-line one-var
        let objects = keysArr.map((key, i) => ({
            objectId: key,
            id: key,
            localName: objectsMap.value[key]?.localName || key,
            classCode: objectsMap.value[key]?.classCode,
            show: true,
            data: equipmentData[key] || []
        }));
        objects = objects.sort((a, b) =>
            a.localName?.localeCompare(b.localName, 'zh', {
                numeric: true,
                sensitivity: 'base'
            })
        );
        objects.forEach((item, i) => {
            item.color = ECHART_COLORS[i % ECHART_COLORS.length];
        });

        const data = {
            id: keys.join('_'),
            name: i18n.global.t('meos_control_web.device_data'),
            objects,
            children: group
                .map(item => {
                    const infoCodes = [];
                    const seenInfoCodes = new Set();
                    const echartData = [];
                    item.infoCodeArr.forEach((infoCode, index) => {
                        let i = 0;
                        for (const element of objects) {
                            const hasInfoCode = element.data.some(val => val.hasOwnProperty(infoCode));

                            if (!hasInfoCode || !allowedClassCodes.includes(element.classCode)) continue;

                            const infoCodeItem = infoCodesAllMap.value.get(getInfoCodeUniqueKey(element.classCode, infoCode));
                            if (!infoCodeItem) continue;

                            const infoCodeName = infoCodeItem?.name || infoCode;
                            const scale = infoCodeItem?.scale || 1;
                            const defaultUnit = infoCodeItem?.unit || '';
                            if (!seenInfoCodes.has(infoCode)) {
                                seenInfoCodes.add(infoCode);
                                infoCodes.push({
                                    name: infoCodeName,
                                    infoNam: infoCodeName,
                                    scale,
                                    infoCode,
                                    show: true,
                                    defaultUnit
                                });
                            }

                            echartData.push({
                                name: infoCodeName + '&&' + element?.localName,
                                infoCode: infoCode,
                                infoName: infoCodeName,
                                objectName: element?.localName,
                                objectId: element.id,
                                type: 'line',
                                symbol: 'none',
                                show: true,
                                connectNulls: true,
                                dataSources: infoCodeItem?.dataSources || [],
                                lineStyle: {
                                    type: index % 2 === 0 ? 'solid' : 'dashed',
                                    color: ECHART_COLORS[i % ECHART_COLORS.length]
                                },
                                data: element.data.map(val => ({
                                    time: dayjs(val.time).format('HH:mm'),
                                    value: !isNil(val[infoCode]) ? round(val[infoCode] * 1, scale) : null,
                                    infoCode: infoCode,
                                    dataSources: infoCodeItem?.dataSources || []
                                }))
                            });

                            i++;
                        }
                    });

                    const firstInfoCodeUnit = infoCodes[0]?.defaultUnit || '';

                    return {
                        groupName: item.groupName,
                        infoCodeArr: item.infoCodeArr,
                        unit: item.infoCodeArr.length > 0 ? firstInfoCodeUnit : '',
                        infoCodes,
                        objects,
                        echartData
                    };
                })
                ?.filter(obj => obj.echartData?.length > 0)
        };

        return data;
    };

    // 生成类型数据
    const genTypeDatas = () => {
        setAllData();
        const arr = [{ id: 'all', name: i18n.global.t('meos_control_web.overall_view') }];
        arr.push({
            ...CODE_SYSTEMS_TYPE,
            data: setSystemData()
        });
        const infoConfigs = templateConfigs.value.mpcColdStationOperationPrediction;
        if (!infoConfigs) {
            return;
        }
        infoConfigs
            ?.map(item => {
                const itemClassCodes = item.classCodes || [];
                const fields = item.classCodes?.map(code => `pred${code}`);
                const groups = item.chartGroups ?? [];
                groups.forEach(group => {
                    let groupname = group.groupName;
                    if (!groupname) {
                        const infoCode = group.infoCodeArr?.length > 0 ? group.infoCodeArr[0] : null;
                        if (infoCode) {
                            groupname = infoCodesAllMap.value.get(getInfoCodeUniqueKey(item.classCodes[0], infoCode))?.name || '';
                        }
                    }
                    group.groupName = groupname;
                });
                const data = setEquipmentData(fields, groups, itemClassCodes);
                if (!data) {
                    return null;
                }
                arr.push({ ...item, data });
            })
            ?.filter(Boolean);
        dataTypes.value = arr;
    };
    watchEffect(() => {
        genTypeDatas();
    });
    onMounted(() => {
        // init();
    });
    watch(
        () => [props.showMain],
        () => {
            if (props.showMain) {
                genTypeDatas();
                // init();
            }
        }
    );
    provide(chartTypesKey, chartTypes);
    return {
        dataType,
        dataTypes,
        chartType,
        chartTypes,
        computedChartType,
        computedDataType,
        getLegendData
    };
};
