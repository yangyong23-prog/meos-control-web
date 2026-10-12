// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { findSpaceStatusInTime, getTemperatureCodeAndColor, getHumidityCodeAndColor, makeFlatBuildingFloorSpaces } from '../utils';
import { DEMAND, DEMAND_STATUS, DEMAND_TYPE, DISPATCH, HUMIDITY, SPACE_STRATEGY_TYPE } from '../variable';
import { currentSystemKey, infoCodesAllMapKey, objectsMapKey, hasSomeEnableHumidityKey } from './useStaticData';
import { getInfoCodeUniqueKey } from '../utils';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { isNil, max, min, orderBy, round, uniq } from 'lodash';
import { getOriginalTimeKey } from '../injectionKey';
import { ECHART_COLORS, getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter, dayjsIsBefore } from '@/utils/dayjsTools';
import { templateConfigsKey } from './useTemplateConfig';

/**
 * 生成从最小值到最大值的连续数字数组（包含边界值）
 * @param {number} valueMin - 最小值
 * @param {number} valueMax - 最大值
 * @returns {number[]} 包含最小值和最大值的连续数字数组
 */
const generateConsecutiveNumberArray = (valueMin, valueMax) => {
    const arr = [valueMin, valueMax];
    for (let i = valueMin; i <= valueMax; i++) {
        if (i < valueMax) {
            arr.push(i);
        }
    }
    return arr;
};

export const getChartDataKey = Symbol('getChartData');
export const currentEquipmentIdKey = Symbol('currentEquipmentId');
export const isCurrentEquipLoadedKey = Symbol('isCurrentEquipLoaded');
export const isCurrentEquipLoadingKey = Symbol('isCurrentEquipLoading');

export const useSpaceStrategy = props => {
    const spaceType = ref(DEMAND);
    const spaceTypes = ref([SPACE_STRATEGY_TYPE[DEMAND], SPACE_STRATEGY_TYPE[DISPATCH]]);
    const spaceMap = ref(new Map());
    const curSelectedTime = ref(dayjs(props.startTime).format('HH:mm'));
    const tdbColors = ref();
    const humidityColors = ref();
    const objectsMap = inject(objectsMapKey);
    const curSelectedFloorObj = ref();
    const clearData = () => {
        spaceMap.value = new Map();
    };

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
        return makeFlatBuildingFloorSpaces(spaces || []);
    });
    const currentMapSpaces = computed(() => {
        if (spaceMap.value?.size > 0) {
            const spaces = Array.from(spaceMap.value.values());
            return spaces
                .map(space => {
                    find;
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
        return Array.from(spaceMap.value.values()).map(s => {
            s.extraData = {};
            return s;
        });
    });

    const hasSomeEnableHumidity = inject(hasSomeEnableHumidityKey);

    watchEffect(() => {
        floorMapSpaces.value.forEach(s => {
            const { tdbGoal, acNeed, rhGoal } = findSpaceStatusInTime(s, curSelectedTime.value);
            if (spaceType.value === DEMAND) {
                s.extraData.acNeed = acNeed;
                s.extraData.tdbGoal = undefined;
                s.extraData.rhGoal = undefined;
            } else if (spaceType.value === DISPATCH) {
                s.extraData.acNeed = undefined;
                s.extraData.tdbGoal = tdbGoal;
                s.extraData.rhGoal = undefined;
            } else if (spaceType.value === HUMIDITY) {
                s.extraData.acNeed = undefined;
                s.extraData.tdbGoal = undefined;
                s.extraData.rhGoal = rhGoal;
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

    const getOriginalTime = inject(getOriginalTimeKey);

    const dateTime = computed(() => {
        return dayjs(getOriginalTime(curSelectedTime.value)).format(i18n.global.t('meos_control_web.date_format3') + ' HH:mm');
    });

    // 将时间范围按15分钟间隔拆分为时间点数组
    function splitInto15MinuteIntervals(timeRanges) {
        const allTimePoints = [];

        timeRanges.forEach(range => {
            if (!range?.startTime || !range?.endTime) {
                return;
            }
            // 解析开始和结束时间
            let currentTime = dayjs(range.startTime);
            const endTime = dayjs(range.endTime);

            // 按15分钟间隔生成时间点
            while (dayjsIsBefore(currentTime, endTime)) {
                // 添加当前时间点
                allTimePoints.push(currentTime.format('YYYY-MM-DD HH:mm:ss'));
                // 增加15分钟
                currentTime = currentTime.add(15, 'minute');
            }
        });

        // 按时间排序（确保不同日期的时间点顺序正确）
        return allTimePoints.sort((a, b) => dayjs(a.time).diff(dayjs(b.time)));
    }
    const setBusinessTimes = data => {
        const { workTimes = [] } = objectsMap.value[data.id];
        data.workTimes = workTimes.map(item => {
            const { beginWorkTime, endWorkTime } = item;
            let startTime = '',
                endTime = '';
            // 计算业务时间 判断是否超过开始时间props.startTime
            if (dayjsIsBefore(dayjs(props.startTime), dayjs(beginWorkTime))) {
                startTime = beginWorkTime;
                endTime = endWorkTime;
            }
            // 判断是否在工作时间内
            if (dayjsIsAfter(dayjs(props.startTime), dayjs(beginWorkTime)) && dayjsIsBefore(dayjs(props.startTime), dayjs(endWorkTime))) {
                // eslint-disable-next-line prefer-destructuring
                startTime = props.startTime;
                endTime = endWorkTime;
            }
            // 如果结束时间小于props.endTime，则使用props.endTime
            if (dayjsIsBefore(dayjs(props.endTime), dayjs(endWorkTime))) {
                // eslint-disable-next-line prefer-destructuring
                endTime = props.endTime;
            }
            // 如果开始时间大于工作结束时间，则不显示
            if (dayjsIsAfter(dayjs(props.startTime), dayjs(endWorkTime))) {
                startTime = '';
                endTime = '';
            }
            return { startTime, endTime };
        });
        const workRanges = [];
        splitInto15MinuteIntervals(data.workTimes).forEach(item => {
            const time = dayjs(item);
            const newTime = time.add(15, 'minute');
            const time1 = dayjs(time).format('HH:mm');
            const time2 = dayjs(newTime).format('HH:mm');
            workRanges.push({
                startStr: time1,
                endStr: time2,
                start: dayjs(time),
                end: newTime,
                status: DEMAND_STATUS.BUSINESS
            });
        });
        // 优化：使用 Map 提高查找效率，避免每次都遍历 workRanges
        const workRangeMap = new Map(workRanges.map(wr => [wr.startStr, wr]));
        data.workRanges = props.fifteenMinuteTimes.map(item => {
            const startStr = dayjs(item).format('HH:mm');
            const workTime = workRangeMap.get(startStr);
            const endStr = workTime?.endStr || dayjs(item).add(15, 'minute').format('HH:mm');
            const start = workTime?.start || dayjs(item);
            const end = workTime?.end || dayjs(item).add(15, 'minute');
            const status = workTime?.status || '';
            return { startStr, endStr, start, end, status };
        });
    };
    const querySpaceRecord = async () => {
        if (!spaceType.value) {
            return;
        }
        clearData();

        const { stgySpace = {} } = props.selectData;
        const tdbs = new Set();
        const humidities = new Set();
        for (const key in stgySpace) {
            if (Object.prototype.hasOwnProperty.call(stgySpace, key)) {
                const element = stgySpace[key];
                const timeRanges = [];
                // getTemperatureCodeAndColor;
                // 优化：减少不必要的 dayjs 实例化和对象扩展操作
                for (let i = 0; i < element.length; i++) {
                    const data = element[i];
                    if (!data) continue;

                    // 优化：减少对象扩展和函数调用次数
                    let status,
                        tempData = { ...data };

                    if (data.time) {
                        // 只格式化一次日期字符串
                        const timeHHmm = dayjs(data.time).format('HH:mm');
                        const todayStr = getDayjsTz().format('YYYYMMDD');
                        const time = dayjs(`${todayStr}${timeHHmm}`);
                        const newTime = time.add(15, 'minute');
                        const time1 = time.format('HH:mm');
                        const time2 = newTime.format('HH:mm');

                        tempData = {
                            ...data,
                            startStr: time1,
                            endStr: time2,
                            start: time,
                            end: newTime
                        };
                    }
                    if (data.tdbGoal?.toString()) {
                        tdbs.add(data.tdbGoal);
                    }
                    if (data.rhGoal?.toString()) {
                        humidities.add(data.rhGoal);
                    }

                    if (spaceType.value === DEMAND) {
                        status = data.acNeed?.toString() ? DEMAND_TYPE[data.acNeed] : undefined;
                    } else if (spaceType.value === DISPATCH) {
                        status = data.tdbGoal?.toString() ? getTemperatureCodeAndColor(data.tdbGoal) : undefined;
                    } else if (spaceType.value === HUMIDITY) {
                        status = data.rhGoal?.toString() ? getHumidityCodeAndColor(data.rhGoal) : undefined;
                    }
                    tempData.status = status;
                    timeRanges.push(tempData);
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
                    spaceName: objectsMap.value[key]?.localName || '',
                    floorId: objectsMap.value[key]?.floorId || '',
                    buildingId: objectsMap.value[key]?.buildingId || '',
                    type: 'space',
                    timeRanges
                };
                obj.floorSequenceId = treeBuildFloorStore().getBuildOrFloor(obj.floorId)?.floorSequenceId;
                if (spaceType.value === DEMAND) {
                    // 设置营业时间 workRanges
                    setBusinessTimes(obj);
                } else {
                    // 删除营业时间 workRanges
                    delete obj.workRanges;
                }
                spaceMap.value.set(key, obj);
            }
        }
        const hasTdb = tdbs.size > 0;
        if (hasTdb) {
            const valueMin = min(Array.from(tdbs));
            const valueMax = max(Array.from(tdbs));
            const tempArr = generateConsecutiveNumberArray(valueMin, valueMax);
            tdbColors.value = getTemperatureCodeAndColor(orderBy(uniq(tempArr)));
        }

        const hasHumidity = humidities.size > 0;

        if (hasHumidity) {
            const humidityValueMin = min(Array.from(humidities));
            const humidityValueMax = max(Array.from(humidities));
            const humidityArr = generateConsecutiveNumberArray(humidityValueMin, humidityValueMax);
            humidityColors.value = getHumidityCodeAndColor(orderBy(uniq(humidityArr)));
        }

        console.log(tdbColors.value);
    };
    onMounted(() => {
        querySpaceRecord();
    });
    watch(
        () => [props.showMain, spaceType.value],
        () => {
            querySpaceRecord();
        }
    );

    watch(
        () => hasSomeEnableHumidity.value,
        () => {
            if (hasSomeEnableHumidity.value) {
                spaceTypes.value = [SPACE_STRATEGY_TYPE[DEMAND], SPACE_STRATEGY_TYPE[DISPATCH], SPACE_STRATEGY_TYPE[HUMIDITY]];
            } else {
                spaceTypes.value = [SPACE_STRATEGY_TYPE[DEMAND], SPACE_STRATEGY_TYPE[DISPATCH]];
            }
        },
        { immediate: true }
    );

    return {
        floorMapSpaces,
        spaceMap,
        spaceType,
        spaceTypes,
        flatBuildingFloorSpaces,
        curSelectedTime,
        dateTime,
        currentMapSpaces,
        tdbColors,
        humidityColors,
        curSelectedFloorObj
    };
};

export const useAircrewStrategy = (props, isPredict = false) => {
    const curSelectedTime = ref(dayjs(props.startTime).format('HH:mm'));
    const infoCodesAllMap = inject(infoCodesAllMapKey);
    const objectsMap = inject(objectsMapKey);
    const xPositions = ref([]);
    const ChartRef = ref(null);
    const isEmpty = ref(false);
    const curSelectedFloorObj = ref();

    const currentEquipmentId = ref('');
    const waitMapLoading = ref(false);
    const isCurrentEquipLoading = ref(false);
    const isCurrentEquipLoaded = ref(false);
    const templateConfigs = inject(templateConfigsKey, ref({}));

    const templateOptions = computed(() => {
        const templateCode = isPredict ? 'mpcCrewOperationPrediction' : 'mpcCrewStrategyDetails';
        return templateConfigs.value[templateCode] || [];
    });

    const options = computed(() => {
        const obj = structuredClone(props.selectData);
        const allObjectIds = Object.keys(objectsMap.value || {});
        const res = templateOptions.value.filter(v => {
            const objectId = v?.id;
            const curEquipData = objectId ? obj[objectId] : null;
            const curEquipIds = Object.keys(curEquipData || {});

            // 仅展示有设备对象的类型
            const hasInstance = allObjectIds.some(id => curEquipIds.includes(id));

            return hasInstance;
        });
        return res;
    });
    const aircrewData = ref('');
    const chartData = ref();
    const currentClassCode = computed(() => {
        const prefix = isPredict ? 'pred' : 'stgy';
        if (!aircrewData.value) return '';
        return aircrewData.value.startsWith(prefix) ? aircrewData.value.slice(prefix.length) : aircrewData.value;
    });
    const floorMapEquips = computed(() => {
        const obj = structuredClone(props.selectData);
        const data = obj[aircrewData.value] || {};
        const arr = [];
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const eq = objectsMap.value[key];
                if (eq) {
                    eq.extraData = {};
                    arr.push(eq);
                }
            }
        }
        return arr;
    });

    const floorMapSpaces = computed(() => {
        const arr = [];
        floorMapEquips.value.forEach(eq => {
            const space = objectsMap.value[eq.space?.id];
            if (space) {
                let outlineArray;
                if (typeof space.outline === 'string') {
                    try {
                        outlineArray = JSON.parse(space.outline);
                    } catch (error) {
                        outlineArray = [];
                    }
                }
                arr.push({ ...space, outline: outlineArray });
            }
        });
        return arr;
    });

    watch(
        () => options.value,
        cur => {
            if (cur?.length) {
                aircrewData.value = cur?.[0]?.id || '';
            }
        },
        {
            immediate: true
        }
    );

    watchEffect(() => {
        const obj = structuredClone(props.selectData);
        const data = obj[aircrewData.value] || {};

        floorMapEquips.value.forEach(e => {
            const element = data[e.id];
            if (element) {
                const o = element.find(item => dayjs(item.time).format('HH:mm') === curSelectedTime.value);
                e.extraData = o;
            }
        });
    });

    const getChartData = () => {
        const obj = structuredClone(props.selectData);

        const data = obj[aircrewData.value] || {};
        const keys = Object.keys(data);
        if (!keys.length || !aircrewData.value || !currentEquipmentId.value) {
            isEmpty.value = true;
            isCurrentEquipLoading.value = false;
            isCurrentEquipLoaded.value = true;
            return;
        } else {
            isEmpty.value = false;
        }
        const tempGroup = options.value.find(v => v?.id === aircrewData.value)?.chartGroups || [];
        const group = tempGroup.map(v => {
            const infoCode = v?.infoCodeArr?.[0];
            const infoCodeName = infoCodesAllMap.value?.get(getInfoCodeUniqueKey(currentClassCode.value, infoCode))?.name;
            return { ...v, groupName: v?.groupName || infoCodeName || '' };
        });

        chartData.value = setEquipmentData([aircrewData.value], group, {
            [currentEquipmentId.value]: data[currentEquipmentId.value] || []
        });

        isCurrentEquipLoading.value = false;
        isCurrentEquipLoaded.value = true;
    };

    const setEquipmentData = (keys, group, dataObj) => {
        let equipmentData = {};
        keys.forEach(() => {
            equipmentData = { ...equipmentData, ...dataObj };
        });

        const keysArr = Object.keys(equipmentData);
        const objects = keysArr.map(item => ({
            objectId: item,
            localName: objectsMap.value[item]?.localName || item,
            classCode: objectsMap.value[item]?.classCode,
            show: true
        }));

        const children = group.map((item, j) => {
            const infoCodes = [];
            const seenInfoCodes = new Set();
            const echartData = [];
            const allEquipsData = (Object.values(equipmentData) || []).flat();
            item.infoCodeArr.forEach((infoCode, index) => {
                for (const key in equipmentData) {
                    const element = equipmentData[key];
                    const equipClassCode = objectsMap.value[key]?.classCode;
                    const infoCodeItem = infoCodesAllMap.value.get(getInfoCodeUniqueKey(equipClassCode, infoCode));
                    const hasEquipData = allEquipsData.some(val => !isNil(val[infoCode]));
                    if (!infoCodeItem || !hasEquipData) continue;

                    const infoCodeName = item.groupName || infoCodeItem.name;
                    const scale = infoCodeItem.scale || 1;
                    if (!seenInfoCodes.has(infoCode)) {
                        seenInfoCodes.add(infoCode);
                        infoCodes.push({
                            name: infoCodeName,
                            infoName: infoCodeName,
                            scale,
                            infoCode,
                            show: true,
                            defaultUnit: infoCodeItem.unit || ''
                        });
                    }

                    echartData.push({
                        name: `${infoCodeName}&&${objectsMap.value[key]?.localName || key}`,
                        infoCode: infoCode,
                        infoName: infoCodeName,
                        objectName: objectsMap.value[key]?.localName || key,
                        objectId: key,
                        type: 'line',
                        symbol: 'none',
                        show: true,
                        connectNulls: true,
                        dataSources: infoCodeItem?.dataSources || [],
                        lineStyle: {
                            type: index % 2 === 0 ? 'solid' : 'dashed',
                            color: ECHART_COLORS[j % ECHART_COLORS.length]
                        },
                        data: element.map(val => {
                            return {
                                infoName: infoCodeItem?.name,
                                color: ECHART_COLORS[j % ECHART_COLORS.length],
                                time: dayjs(val.time).format('HH:mm'),
                                value: !isNil(val[infoCode]) ? round(val[infoCode] * 1, scale) : null,
                                infoCode: infoCode,
                                dataSources: infoCodeItem?.dataSources || []
                            };
                        })
                    });
                }
            });
            const firstInfoCodeUnit = infoCodes[0]?.defaultUnit || '';

            return {
                groupName: item.groupName,
                infoCodeArr: infoCodes.map(v => v.infoCode),
                unit: infoCodes.length > 0 ? firstInfoCodeUnit : '',
                infoCodes,
                objectIdArr: keysArr,
                objects: keysArr.map((key, i) => ({
                    objectId: key,
                    localName: objectsMap.value[key]?.localName || key,
                    show: true,
                    color: ECHART_COLORS[i % ECHART_COLORS.length]
                })),
                echartData
            };
        });

        return {
            id: keys.join('_'),
            name: i18n.global.t('meos_control_web.device_data'),
            objects,
            children: children.filter(v => v?.infoCodeArr?.length)
        };
    };
    const clearData = () => {
        currentEquipmentId.value = '';
        chartData.value = null;
        xPositions.value = [];
    };
    const finished = () => {
        xPositions.value = ChartRef.value.getXPositons();
    };

    const getOriginalTime = inject(getOriginalTimeKey);

    const dateTime = computed(() => {
        return dayjs(getOriginalTime(curSelectedTime.value)).format(i18n.global.t('meos_control_web.date_format3') + ' HH:mm');
    });
    provide(getChartDataKey, getChartData);
    provide(currentEquipmentIdKey, currentEquipmentId);
    provide(isCurrentEquipLoadedKey, isCurrentEquipLoaded);
    watch(
        () => currentEquipmentId.value,
        () => {
            if (currentEquipmentId.value) {
                waitMapLoading.value = false;
                isCurrentEquipLoaded.value = false;
                isCurrentEquipLoading.value = true;
                nextTick(() => {
                    getChartData();
                });
            }
        }
    );
    watch(
        () => aircrewData.value,
        cur => {
            clearData();
            if (cur) {
                waitMapLoading.value = true;
            }
        },
        {
            immediate: true
        }
    );
    return {
        options,
        aircrewData,
        chartData,
        ChartRef,
        curSelectedTime,
        xPositions,
        isEmpty,
        finished,
        getChartData,
        floorMapEquips,
        floorMapSpaces,
        dateTime,
        curSelectedFloorObj,
        currentEquipmentId,
        isCurrentEquipLoaded,
        isCurrentEquipLoading,
        waitMapLoading
    };
};
