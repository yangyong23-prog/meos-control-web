// @ts-ignore
import i18n from '@/localization';
import { ref, provide } from 'vue';
import {
    Hour24Forecast,
    getWorkTimes,
    jobResult,
    listObjects,
    getStrategDetail,
    getBroadcast,
    getJobState,
    getAcQuarter,
    CommonCityHourWeatherService,
    getProjectByIdService,
    getValueSelect,
    getACCCSystemRunning,
    getACACSystemRunning,
    listConfigsByInstance
} from '@/apis/AI';
import useStore from '@/store';
import infoCodeDataStore from '@/store/infoCodeData';
import { listObjectsByTackValueLogic, queryEquipsWithHttpConfig, querySpacesWithHttpConfig } from '@/apis/public';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { listInfoCodes } from '@/apis/common';
import { GeneralZone, getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import baseStore from '@/store/baseStore';
import dayjs from 'dayjs';
import { SPACE_PREDICTION_ID, SPACE_STRATEGY_ID, STRATEGY_EVALUATION_ID, AIR_SEASON } from '../variable';
import emitter from '@/utils/bus';
import { getInfoCodeUniqueKey } from '../utils';
import { useAISSE } from './useAISSE';
import { convertDateToQuarterMinute } from '../utils';
import useTemplateConfig from './useTemplateConfig';
import { listScheduleInfoCodeDefine } from '@/apis/ACAC';
import { isEqual } from 'lodash';
import { formatAIDebugTime, getJobResultSnapshot, getStrategyOverviewSnapshot, logAIDebug } from '../utils/debug';

//
export const AISystemLoadingKey = Symbol('AISystemLoadingKey');
//
export const AISystemNoDataKey = Symbol('AISystemNoDataKey');
// 系统列表
export const AISystemlistKey = Symbol('AISystemlistKey');
// 策略计算概况
export const strategyOverviewKey = Symbol('strategyOverviewKey');
// 获取策略计算概况
export const getStrategyOverviewKey = Symbol('getStrategyOverviewKey');

// 策略计算概况无数据
export const strategyOverviewNoDataKey = Symbol('strategyOverviewNoData');

export const infoCodesAllMapKey = Symbol('infoCodesAllMapKey');
// 所有静态数据
export const objectsMapKey = Symbol('objectsMapKey');

export const currentSystemIdKey = Symbol('currentSystemIdKey');
// 获取系统
export const currentSystemKey = Symbol('currentSystemKey');

// 策略数据loading中
export const strategyLoadingKey = Symbol('strategyLoadingKey');

// 获取播报数据
export const getBroadcastDataKey = Symbol('getBroadcastDataKey');

export const viewLoadingKey = Symbol('viewLoadingKey');
// 播报数据
export const broadcastKey = Symbol('broadcastKey');
export const coolStationCastDataKey = Symbol('coolStationCastDataKey');
export const acCastDataKey = Symbol('acCastDataKey');
export const spaceCastDataKey = Symbol('spaceCastDataKey');
export const getLoadAcQuarterKey = Symbol('getLoadAcQuarterKey');
export const getWeatherKey = Symbol('getWeatherKey');
export const airSearonCastDataKey = Symbol('airSearonCastDataKey');
export const Hour24ForecastDataKey = Symbol('Hour24ForecastDataKey');
export const getLastStrategyOverviewKey = Symbol('getLastStrategyOverviewKey');
export const opacityStrategyKey = Symbol('opacityStrategyKey');
export const nextStartTimeKey = Symbol('nextStartTimeKey');
export const strategyOverviewTempKey = Symbol('strategyOverviewTempKey');
export const setStrategyOverviewTempKey = Symbol('setStrategyOverviewTempKey');
export const resetStrategyOverviewTempKey = Symbol('resetStrategyOverviewTempKey');
export const viewLoadedKey = Symbol('viewLoadedKey');
export const chillerCodeDefineKey = Symbol('chillerCodeDefineKey');

// 获取设备实例及空间实例地图相关的数据Key
export const getSpaceIdsByEquipmentsInjectKey = Symbol('getSpaceIdsByEquipmentsInjectKey');
// 获取是否展示湿度
export const hasSomeEnableHumidityKey = Symbol('hasSomeEnableHumidityKey');
export const isRunningStandardLoadingKey = Symbol('isRunningStandardLoadingKey');

export const useStaticDataHook = () => {
    const AISystemlist = ref([]);
    const AISystemLoading = ref(true);
    const AISystemNoData = ref(true); // 系统无数据
    const strategyOverview = ref([]); // 策略计算概况
    const strategyOverviewNoData = ref(true); // 策略计算概况无数据
    const showSpaceStrategy = ref(false); // 是否显示空间策略详情
    const showSpacePrediction = ref(false); // 是否显示空间预测详情
    const showStrategyEvaluation = ref(false); // 策略评价
    const currentSystemId = ref('');
    const objectsMap = ref({});
    const beginDate = ref(getDayjsTz());
    const strategyLoading = ref(true);
    const broadcast = ref({}); // 播报数据
    const spaceIds = ref([]); // 缓存当前系统的spaceids
    const nextStartTime = ref(''); // 下次开始时间
    const strategyOverviewTemp = ref([]); // 策略计算概况
    const coolStationCastData = ref([]); // 用于播报的冷站基础数据
    const acCastData = ref([]); // 用于播报末端设备基础数据
    const spaceCastData = ref([]); // 用于播报空间基础数据
    const projectData = ref({}); // 项目详情
    const airSearonCastData = ref([]); // 用于播报的 未来24小时空调季时段
    const Hour24ForecastData = ref([]); // 用于播报的 24小时历史天气数据
    const opacityStrategy = ref(true); //
    const viewLoading = ref(true);
    const listWorkTimesLoading = ref(true);
    const chillerCodeDefine = ref();

    const humidityDataMap = ref(new Map());
    const hasSomeEnableHumidity = ref(false);
    const isRunningStandardLoading = ref(false);
    const fetchRunningStandardAbortController = ref();

    const castTargetInfo = {
        ACCCCC: [
            'ratedCool',
            'ratedP',
            'ratedCOP',
            'designEvapWaterOutTemp',
            'designEvapWaterInTemp',
            'designCondWaterInTemp',
            'designCondWaterOutTemp',
            'designChillWaterFlow',
            'designCoolWaterFlow'
        ],
        ACCCSC: [
            'ratedCool',
            'ratedP',
            'ratedCOP',
            'designEvapWaterOutTemp',
            'designEvapWaterInTemp',
            'designCondWaterInTemp',
            'designCondWaterOutTemp',
            'designChillWaterFlow',
            'designCoolWaterFlow'
        ],
        ACCCCP: ['ratedP', 'ratedFlow'],
        ACCCOP: ['ratedP', 'ratedFlow'],
        ACCCOT: ['ratedP', 'ratedWaterInTemp', 'ratedWaterOutTemp', 'ratedFanAirFlow', 'ratedWaterFlow', 'fanNum'],
        ACATAH: ['ratedP', 'summerDesignChillWaterFlow', 'supplyCap'],
        ACATFU: ['ratedP', 'ratedFanFlow', 'designChillWaterFlow', 'isCoolCoilSection', 'isHeatRecoverySection']
    };

    // 策略详细总共需要请求数量数量
    let strategyDetailTotalNumber = 0,
        // 策略详细已经请求数量数量
        strategyDetailNumber = ref(0),
        coolSystemTotallNumber = 0,
        // 策略详细已经请求数量数量
        coolSystemlNumber = ref(0);

    const { setAISSEClientOption, addAICalcListener } = useAISSE();

    const { templateConfigs } = useTemplateConfig();

    const strategyDetailCodes = computed(() => {
        const templateCode = 'mpcCrewStrategyDetails';
        const res = templateConfigs.value[templateCode] || [];
        return res.map(v => v?.id);
    });
    const strategyPredictCodes = computed(() => {
        const templateCode = 'mpcCrewOperationPrediction';
        const res = templateConfigs.value[templateCode] || [];
        return res.map(v => v?.id);
    });

    const strategyPredictCodeStationsCodes = computed(() => {
        const templateCode = 'mpcColdStationOperationPrediction';
        const resArr = templateConfigs.value[templateCode] || [];
        const allCodes = [];
        for (const item of resArr) {
            if (Array.isArray(item.classCodes)) {
                item.classCodes.forEach(code => allCodes.push(`pred${code}`));
            }
        }
        return allCodes;
    });

    const configEquipClassCodes = computed(() => {
        const allCodes = [...strategyDetailCodes.value, ...strategyPredictCodes.value, ...strategyPredictCodeStationsCodes.value];
        const codesSet = new Set();
        const baseInfoCodes = ['ACAC', 'ACCC', 'ACCCCC', 'ACCCSC', 'ACCCCP', 'ACCCOP', 'ACOTU', 'ACCCOT', 'ACATAH', 'ACATFU', 'ACATVA', 'ACATFC', 'ACVRVO', 'ACCHCH', 'ACCCGP'];
        baseInfoCodes.forEach(v => codesSet.add(v));
        allCodes.forEach(v => {
            if (v?.startsWith('pred')) {
                codesSet.add(v?.replace('pred', ''));
            } else if (v?.startsWith('stgy')) {
                codesSet.add(v?.replace('stgy', ''));
            } else {
                codesSet.add(v);
            }
        });
        return [...codesSet];
    });

    const configInstanceIds = computed(() => {
        const allCodeList = strategyOverview.value.map(v => v?.stgyCodeList || [])?.flat();
        const allCodes = [...strategyDetailCodes.value, ...strategyPredictCodes.value, ...strategyPredictCodeStationsCodes.value];

        const equipsSet = new Set();
        for (const codeItem of allCodeList) {
            const { content } = codeItem || {};
            const dataContent = content?.data?.[0] || {};

            allCodes.forEach(item => {
                const equipsObject = dataContent[item] || {};
                Object.keys(equipsObject).forEach(v => {
                    equipsSet.add(v);
                });
            });
        }
        return [...equipsSet];
    });

    addAICalcListener(data => {
        console.log('算法推送数据：', data);
        logAIDebug('static-data', '收到 AI SSE 计算状态推送', {
            calcStatus: data.calcStatus,
            startTime: formatAIDebugTime(data.startTime),
            endTime: formatAIDebugTime(data.endTime || data.cmpNextStartTime),
            currentSystemId: currentSystemId.value
        });
        const { calcStatus, endTime, cmpNextStartTime } = data;
        // 0开始计算，1计算成功，2计算失败；
        if (calcStatus === 0) {
            // 开始
            emitter.emit('AI-compute-start', {
                startTime: dayjs(data.startTime, 'YYYY-MM-DD HH:mm:ss', true)
            });
        } else if (calcStatus === 1) {
            // 结束
            const relEndTime = endTime || cmpNextStartTime;
            const finalEndTime = relEndTime ? dayjs(relEndTime, 'YYYY-MM-DD HH:mm:ss', true) : getDayjsTz();
            emitter.emit('AI-compute-end', {
                endTime: finalEndTime
            });
            getNextTimeStart();
        } else if (calcStatus === 2) {
            // 失败
            emitter.emit('AI-compute-fail');
            getNextTimeStart();
        }
    });

    const currentSystem = computed(() => {
        return AISystemlist.value.find(item => item.id === currentSystemId.value) || {};
    });
    const { base } = useStore();
    watch([strategyDetailNumber, coolSystemlNumber, listWorkTimesLoading], () => {
        if (strategyDetailTotalNumber !== 0 && strategyDetailNumber.value === strategyDetailTotalNumber) {
            if (coolSystemTotallNumber !== 0 && coolSystemlNumber.value === coolSystemTotallNumber) {
                if (!listWorkTimesLoading.value) {
                    strategyLoading.value = false;
                    strategyOverviewTemp.value = strategyOverview.value;
                    console.log('strategyOverview', strategyOverview);
                    logAIDebug('static-data', '策略概况与依赖明细加载完成', {
                        strategyDetailTotalNumber,
                        strategyDetailNumber: strategyDetailNumber.value,
                        coolSystemTotallNumber,
                        coolSystemlNumber: coolSystemlNumber.value,
                        snapshot: getStrategyOverviewSnapshot(strategyOverview.value)
                    });
                    nextTick(() => {
                        emitter.emit('AI-response-update');
                    });
                }
            }
        }
    });

    // 初始化加载或者切换系统重新请求设备、空间缓存
    emitter.off('init-system');
    emitter.on('init-system', () => {
        getStrategyOverview();
    });
    emitter.off('change-system');
    emitter.on('change-system', () => {
        emitter.emit('end-anime');
        viewLoading.value = true;
        getStrategyOverview();
    });

    // 切换系统重新请求设备、空间缓存
    watch(currentSystemId, systemId => {
        if (systemId) {
            setAISSEClientOption(systemId);
            listWorkTimesLoading.value = true;
            queryObjsData();
        }
    });

    const getJobResult = async (params, key) => {
        const res = await jobResult(params);
        return res;
    };

    // 获取策略状态
    const _getJobState = () => {
        getJobState({
            projectId: base.projectId,
            systemId: currentSystemId.value
        }).then(res => {
            if (res?.data?.state === 1) {
                emitter.emit('AI-compute-start', {
                    startTime: dayjs(res.data.timeStart, 'YYYY-MM-DD HH:mm:ss', true)
                });
            }
        });
    };

    // 获取下次开始时间 1、初始、 计算成功、 计算失败
    const getNextTimeStart = () => {
        getJobState({
            projectId: base.projectId,
            systemId: currentSystemId.value
        }).then(res => {
            if (res?.data) {
                nextStartTime.value = res?.data?.nextTimeStart;
            }
        });
    };

    // 获取策略计算概况
    const getStrategyOverview = async () => {
        getNextTimeStart();
        strategyOverview.value = [];
        const params = {
            projectId: base.projectId,
            systemId: currentSystemId.value
        };
        logAIDebug('static-data', '开始加载首页策略概况', {
            params,
            requestOffsets: [0, 1, 2]
        });
        strategyLoading.value = true;
        listWorkTimesLoading.value = true;
        strategyDetailTotalNumber = 0;
        coolSystemTotallNumber = 0;
        strategyDetailNumber.value = 0;
        coolSystemlNumber.value = 0;
        await getProjectData();
        Promise.all([
            getJobResult({
                ...params,
                dataOffset: 0
            }),
            getJobResult({
                ...params,
                dataOffset: 1
            }),
            getJobResult({
                ...params,
                dataOffset: 2
            })
        ]).then(arr => {
            logAIDebug('static-data', '首页策略概况 jobResult 返回', {
                responses: arr.map(item => getJobResultSnapshot(item.data))
            });
            // 检查是否有数据 （切换系统）
            const respArr = arr.filter(item => {
                return !!item.data;
            });
            if (respArr.length === 0) {
                strategyLoading.value = false;
                // 无数据页面
                strategyOverviewNoData.value = true;
                logAIDebug('static-data', '首页策略概况无数据', {
                    params
                });
            }
            for (let i = 0; i < respArr.length; i++) {
                const res = respArr[i];
                if (!res.data) {
                    strategyOverviewNoData.value = true;
                    break;
                }
                const { length } = res.data.stgyCodeList;
                if (length > 0) {
                    strategyOverviewNoData.value = false;
                }
                strategyOverview.value[i] = res.data;
                strategyOverview.value[i].outdoorWeather = { humidity: '--', temperature: '--', text: '--', receivetime: '--' };
                strategyOverview.value[i].IsSystemOpen = null;
                const startTime = res.data?.startTime;
                if (startTime) {
                    CommonCityHourWeatherService({
                        cityCode: projectData.value.city,
                        startDate: dayjs.tz(startTime).subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                        endDate: dayjs.tz(startTime).format('YYYY-MM-DD HH:mm:ss')
                    }).then(resp => {
                        strategyOverview.value[i].outdoorWeather = resp.data?.at(-1) || { humidity: '--', temperature: '--', text: '--', receivetime: '--' };
                    });
                    getValueSelect({
                        projectId: base.projectId,
                        date: startTime.split(' ')[0]
                    }).then(res => {
                        if (res.data) {
                            strategyOverview.value[i].valueSelectType = res.data.type;
                        }
                    });
                    _getSystemRunningState(startTime)
                        .then(data => {
                            strategyOverview.value[i].IsSystemOpen = data.IsSystemOpen;
                            strategyOverview.value[i].IsCoolingStorageOpen = data.IsCoolingStorageOpen;
                        })
                        .finally(() => {
                            coolSystemlNumber.value++;
                        });
                }
                strategyDetailTotalNumber += length;
                coolSystemTotallNumber += 1;
                for (let j = 0; j < length; j++) {
                    const item = res.data.stgyCodeList[j];
                    strategyOverview.value[i].stgyCodeList[j].isBest = res.data.stgyCodeList[j].idBest;
                    _getStrategyOverviewDetail(item.code, i, j);
                }
            }
        });
    };

    // 获取策略概况
    const _getStrategyOverviewDetail = (code, overviewIndex, detailIndex) => {
        return new Promise((resolve, reject) => {
            getStrategDetail({
                systemId: currentSystemId.value,
                stgyCode: [code]
            })
                .then(async res => {
                    strategyOverview.value[overviewIndex].stgyCodeList[detailIndex].content = res;
                    resolve();
                })
                .finally(() => {
                    strategyDetailNumber.value++;
                });
        });
    };

    // 获取当前系统开关状态
    const _getSystemRunningState = startTime => {
        return new Promise((resolve, reject) => {
            const { classCode } = AISystemlist.value.find(item => {
                return item.id === currentSystemId.value;
            });
            if (classCode === 'ACAC') {
                const paramCoolSupply = {
                    projectId: base.projectId,
                    systemId: currentSystemId.value,
                    consoleTypes: 'COOL_SUPPLY',
                    systemType: 'ACAC',
                    beginDateTime: startTime.split(' ')[0],
                    endDateTime: startTime.split(' ')[0]
                };
                const paramCoolStorage = {
                    projectId: base.projectId,
                    systemId: currentSystemId.value,
                    consoleTypes: 'COOL_INPUT',
                    systemType: 'ACAC',
                    beginDateTime: startTime.split(' ')[0],
                    endDateTime: startTime.split(' ')[0]
                };

                Promise.all([getACACSystemRunning(paramCoolSupply), getACACSystemRunning(paramCoolStorage)]).then(resArr => {
                    if (resArr.length === 2) {
                        const supplyRes = resArr[0];
                        const storageRes = resArr[1];
                        const supplySwitchSet = supplyRes?.data?.find(item => {
                            return item.infoCode === 'coolingSupplySwitchSet';
                        });
                        const storageSwitchSet = storageRes?.data?.find(item => {
                            return item.infoCode === 'coolingStorageSwitchSet';
                        });
                        let isSysOpen = null,
                            isStorgeOpen = null;
                        if (supplySwitchSet && supplySwitchSet.setValue === '1') {
                            isSysOpen = true;
                        } else if (supplySwitchSet && supplySwitchSet.setValue === '0') {
                            isSysOpen = false;
                        }
                        if (storageSwitchSet && storageSwitchSet.setValue === '1') {
                            isStorgeOpen = true;
                        } else if (storageSwitchSet && storageSwitchSet.setValue === '0') {
                            isStorgeOpen = false;
                        }
                        const result = {
                            IsSystemOpen: isSysOpen,
                            IsCoolingStorageOpen: isStorgeOpen
                        };
                        resolve(result);
                    }
                });
            } else {
                getACCCSystemRunning({
                    projectId: base.projectId,
                    acccSystemId: currentSystemId.value,
                    beginDateTime: startTime,
                    endDateTime: startTime
                }).then(res => {
                    let isOpen = null;
                    if (res.data.runStatus === 'OPEN') {
                        isOpen = true;
                    } else if (res.data.runStatus === 'CLOSE') {
                        isOpen = false;
                    }
                    resolve({ IsSystemOpen: isOpen });
                });
            }
        });
    };

    // 获取最新策略计算概况
    const getLastStrategyOverview = () => {
        if (strategyOverview.value.length === 0) {
            strategyOverviewNoData.value = false;
            opacityStrategy.value = false;
        }
        return new Promise((resolve, reject) => {
            const params = {
                projectId: base.projectId,
                systemId: currentSystemId.value
            };
            logAIDebug('static-data', '开始刷新最新第一页策略概况', {
                params,
                previousSnapshot: getStrategyOverviewSnapshot(strategyOverview.value)
            });
            getJobResult({
                ...params,
                dataOffset: 0
            }).then(res => {
                if (!res.data) {
                    logAIDebug('static-data', '刷新最新第一页策略概况失败，jobResult 无数据', {
                        params
                    });
                    return;
                }
                let hasLoadedOne = false;
                const { length } = res.data.stgyCodeList;
                logAIDebug('static-data', '最新第一页策略概况返回', {
                    latestSnapshot: getJobResultSnapshot(res.data)
                });
                res.data.outdoorWeather = { humidity: '--', temperature: '--', text: '--', receivetime: '--' };
                res.data.IsSystemOpen = null;
                const startTime = res.data?.startTime;
                if (startTime) {
                    CommonCityHourWeatherService({
                        cityCode: projectData.value.city,
                        startDate: dayjs(startTime).subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                        endDate: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
                    }).then(resp => {
                        res.data.outdoorWeather = resp.data?.at(-1) || { humidity: '--', temperature: '--', text: '--', receivetime: '--' };
                    });
                    const time = startTime.split(' ')[0];
                    getValueSelect({
                        projectId: base.projectId,
                        date: time
                    }).then(resp => {
                        if (resp.data) {
                            res.data.valueSelectType = resp.data.type;
                        }
                    });
                    _getSystemRunningState(startTime).then(data => {
                        logAIDebug('static-data', '最新第一页策略运行状态返回', {
                            startTime,
                            runningState: data,
                            note: '当前 getLastStrategyOverview 会把整个 data 对象赋值给 res.data.IsSystemOpen'
                        });
                        res.data.IsSystemOpen = data;
                        if (hasLoadedOne) {
                            resolve();
                        } else {
                            hasLoadedOne = true;
                        }
                    });
                }
                getStrategDetail({
                    systemId: currentSystemId.value,
                    stgyCode: res.data.stgyCodeList.map(item => item.code)
                }).then(resp => {
                    logAIDebug('static-data', '最新第一页策略详情返回', {
                        detailCount: Array.isArray(resp.data) ? resp.data.length : 0,
                        strategyCodes: res.data.stgyCodeList.map(item => item.code)
                    });
                    for (let j = 0; j < length; j++) {
                        const item = res.data.stgyCodeList[j];
                        item.isBest = res.data.stgyCodeList[j].idBest;
                        item.content = {
                            data: resp.data.filter(_item => {
                                return item.code === _item.stgyIndicator?.strategyCode;
                            })
                        };
                    }
                    for (let i = strategyOverview.value.length; i > -1; i--) {
                        if (i === 0) {
                            strategyOverview.value[i] = res.data;
                        } else if (i < 3) {
                            strategyOverview.value[i] = strategyOverview.value[i - 1];
                        }
                    }
                    opacityStrategy.value = true;
                    logAIDebug('static-data', '最新第一页策略已写回首页缓存', {
                        latestSnapshot: getJobResultSnapshot(res.data),
                        currentSnapshot: getStrategyOverviewSnapshot(strategyOverview.value)
                    });
                    nextTick(() => {
                        emitter.emit('AI-response-update');
                    });
                    if (hasLoadedOne) {
                        resolve();
                    } else {
                        hasLoadedOne = true;
                    }
                });
            });
        });
    };

    // 获取系统下拉
    const _getAISystemlist = () => {
        const params = {
            runningMonitorType: 'AI',
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACCC', 'ACAC'],
                    withColumns: ['id', 'localName', 'classCode'],
                    monitoringSurveillanceStatus: ['2', '3'],
                    orderCustoms: [
                        {
                            column: 'classCode',
                            asc: true
                        },
                        {
                            column: 'localName',
                            chineseOrder: true
                        }
                    ]
                }
            }
        };
        listObjectsByTackValueLogic(params)
            .then(({ code, data }) => {
                AISystemlist.value = data.map(d => {
                    d.label = d.localName;
                    d.key = d.id;
                    return d;
                });
                AISystemNoData.value = data.length === 0;
            })
            .finally(() => {
                AISystemLoading.value = false;
            });
    };

    // 获取播报数据
    const getBroadcastData = time => {
        return new Promise((resolve, reject) => {
            const now = getDayjsTz();
            getBroadcast({
                templateType: 'AIRCONDITIONING',
                date: now.format('YYYY-MM-DD'),
                computeTime: time.format('YYYY-MM-DD HH:mm:ss'),
                spaceIds: spaceIds.value,
                querySpaceCount: 150
            })
                .then(res => {
                    broadcast.value = res.data;
                    resolve(res);
                })
                .catch(() => {
                    reject();
                });
        });
    };

    /**
     * @description: 获取24小时未来天气数据
     * @return {*}
     */
    const getWeather = () => {
        return new Promise((resolve, reject) => {
            Hour24Forecast({
                cityCode: projectData.value.city
            })
                .then(res => {
                    resolve();
                    Hour24ForecastData.value = res.data?.[0]?.hourly || [];
                })
                .catch(() => {
                    reject();
                    Hour24ForecastData.value = [];
                });
        });
    };

    /**
     *
     * @param {*} targetList
     * @param {*} propertylist
     * @param {*} unitList
     * @param {*} ignore 当target.hasOwnProperty(property) 为false时 是否要忽略这条数据
     * @returns
     */
    const getCaseBaseData = (targetList, propertylist, unitList, ignore = true) => {
        const getUnit = (property, value) => {
            const unitInfo = unitList[property];
            if (unitInfo?.originDataType === 'Bool' || unitInfo?.originDataType === 'Enum') {
                const valueStr = unitInfo?.dataSources?.find(item => item.code === value);
                return `${unitInfo?.name} ${valueStr?.name ?? '--'}`;
            }
            return `${unitInfo?.name} ${value} ${unitInfo?.unit ?? '--'}`;
        };
        const ret = [];
        (targetList ?? []).forEach(target => {
            (propertylist ?? []).forEach(property => {
                if (target.hasOwnProperty(property)) {
                    ret.push(`${target.localName ?? '--'}${getUnit(property, target[property])}`);
                } else if (!ignore) {
                    ret.push(`${target.localName ?? '--'} --`);
                }
            });
        });
        return ret;
    };

    _getAISystemlist();
    const getProjectData = async () => {
        try {
            const res = await getProjectByIdService({ projectId: base.projectId, groupCode: base.groupCode });
            projectData.value = res.content?.[0] || {};
        } catch (error) {
            projectData.value = {};
        }
    };
    const apiToken = UseCancelTokenHooks();
    const queryObjsData = () => {
        apiToken.cancelToken();
        let param = {
            projectId: base.projectId,
            withColumns: ['id', 'buildingId', 'localName', 'floorId', 'classCode', 'buildArea', 'classCode', 'bimLocation', 'objType', 'roomFuncType', 'outline', 'spaceId'],
            filterEquipmentInSystemIds: [currentSystemId.value]
        };
        objectsMap.value = {};
        coolStationCastData.value = [];
        acCastData.value = [];
        spaceCastData.value = [];
        spaceIds.value = [];
        listObjects(param, { cancelToken: apiToken.cancelToken() }).then(rst0 => {
            rst0.data.forEach(({ relEquipments, serviceSpaces, infoCodeDefine }) => {
                let objectIds = serviceSpaces.map(s => s.id),
                    castDataTemp = [];
                spaceIds.value.push(...objectIds);

                // 获取冷站基础数据
                castDataTemp.push(...getCaseBaseData(relEquipments.ACCCCC, castTargetInfo.ACCCCC, infoCodeDefine));
                castDataTemp.push(...getCaseBaseData(relEquipments.ACCCSC, castTargetInfo.ACCCSC, infoCodeDefine));
                castDataTemp.push(...getCaseBaseData(relEquipments.ACCCCP, castTargetInfo.ACCCCP, infoCodeDefine));
                castDataTemp.push(...getCaseBaseData(relEquipments.ACCCOP, castTargetInfo.ACCCOP, infoCodeDefine));
                castDataTemp.push(...getCaseBaseData(relEquipments.ACCCOT, castTargetInfo.ACCCOT, infoCodeDefine));
                coolStationCastData.value = castDataTemp;

                // 获取末端基础数据
                castDataTemp = [];
                castDataTemp.push(...getCaseBaseData(relEquipments.ACATAH, castTargetInfo.ACATAH, infoCodeDefine));
                castDataTemp.push(...getCaseBaseData(relEquipments.ACATFU, castTargetInfo.ACATFU, infoCodeDefine));
                acCastData.value = castDataTemp;

                // 获取空间基础数据
                castDataTemp = [];
                castDataTemp.push(...getCaseBaseData(serviceSpaces, ['buildArea'], infoCodeDefine, false));
                spaceCastData.value = castDataTemp;

                Object.values(relEquipments)
                    .flatMap(a => a)
                    .forEach(e => {
                        objectsMap.value[e.id] = e;
                    });

                serviceSpaces.forEach(s => {
                    objectsMap.value[s.id] = s;
                });
                // 如果没有服务空间，则不需要请求listworkTime
                if (serviceSpaces.length) {
                    getWorkTimes({
                        objectIds: objectIds,
                        beginDate: beginDate.value.format('YYYY-MM-DD'),
                        endDate: beginDate.value.add(2, 'day').format('YYYY-MM-DD')
                    })
                        .then(res => {
                            res.data.forEach(item => {
                                item.details.forEach(space => {
                                    if (!item?.date || !space?.beginWorkTime || !space?.endWorkTime) {
                                        return;
                                    }
                                    const obj = {
                                        beginWorkTime: `${item.date} ${space.beginWorkTime}`,
                                        endWorkTime: `${item.date} ${space.endWorkTime}`
                                    };
                                    if (objectsMap.value[space.objectId].workTimes) {
                                        objectsMap.value[space.objectId].workTimes.push(obj);
                                    } else {
                                        objectsMap.value[space.objectId].workTimes = [obj];
                                    }
                                });
                            });
                        })
                        .finally(() => {
                            listWorkTimesLoading.value = false;
                        });
                } else {
                    listWorkTimesLoading.value = false;
                }
            });
            console.log('objectsMap:', objectsMap);
        });
    };
    const infoCodesAllMap = ref(new Map());
    const getInfoCodeData = async classCodes => {
        const res = await listInfoCodes({
            classCodes
        });
        const { data, code } = res || {};
        if (code === SUCCESSCODE) {
            const initMap = new Map();
            data.forEach(element => {
                const uniqueKey = getInfoCodeUniqueKey(element.classCode, element.code);
                initMap.set(uniqueKey, element);
            });
            infoCodesAllMap.value = initMap;
        }
    };

    // 请求空调季的数据
    const loadAcQuarter = () => {
        return new Promise((resolve, reject) => {
            const startDate = convertDateToQuarterMinute(getDayjsTz().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm');
            const endDate = dayjs(startDate).add(24, 'hour').format('YYYY-MM-DD HH:mm');
            const startDateStr = dayjs(startDate).format('YYYY-MM-DD');
            const endDateStr = dayjs(endDate).format('YYYY-MM-DD');
            const params = {
                objId: baseStore().projectId,
                beginDate: startDateStr,
                endDate: endDateStr
            };
            airSearonCastData.value = [];
            let airSearonData = {
                [startDateStr]: '',
                [endDateStr]: ''
            };
            getAcQuarter(params)
                .then(res => {
                    resolve();
                    if (res.code === SUCCESSCODE) {
                        res.data?.forEach(item => {
                            const currentDay = item?.currentDay?.split(' ')[0];
                            currentDay &&
                                item?.tagList?.forEach(tag => {
                                    if (AIR_SEASON[tag]) {
                                        airSearonData[currentDay] = AIR_SEASON[tag];
                                    }
                                });
                        });
                    }
                })
                .finally(() => {
                    if (airSearonData[startDateStr] === airSearonData[endDateStr] && airSearonData[startDateStr]) {
                        airSearonCastData.value = [i18n.global.t('meos_control_web.furture_day_is', { name: airSearonData[startDateStr] })];
                    } else if (airSearonData[startDateStr] === airSearonData[endDateStr] && !airSearonData[startDateStr]) {
                        airSearonCastData.value = [
                            i18n.global.t('meos_control_web.name_no_air_season', { name: `${dayjs(startDate).format('MM.DD HH:mm')} ~ ${dayjs(endDate).format('MM.DD HH:mm')} ` })
                        ];
                    } else {
                        const tempData = [];
                        if (airSearonData[startDateStr]) {
                            tempData.push(
                                i18n.global.t('meos_control_web.name_is_what', {
                                    name: `${dayjs(startDate).format('MM.DD HH:mm')}~${dayjs(startDate).format('MM.DD')} 24:00`,
                                    what: airSearonData[startDateStr]
                                })
                            );
                        } else {
                            tempData.push(
                                i18n.global.t('meos_control_web.name_no_air_season', {
                                    name: `${dayjs(startDate).format('MM.DD HH:mm')}~${dayjs(startDate).format('MM.DD')} 24:00`
                                })
                            );
                        }

                        if (airSearonData[endDateStr]) {
                            tempData.push(
                                i18n.global.t('meos_control_web.name_is_what', {
                                    name: `${dayjs(endDate).format('MM.DD')} 00:00~${dayjs(endDate).format('MM.DD HH:mm')}`,
                                    what: airSearonData[endDateStr]
                                })
                            );
                        } else {
                            tempData.push(
                                i18n.global.t('meos_control_web.name_no_air_season', { name: `${dayjs(endDate).format('MM.DD')} 00:00~${dayjs(endDate).format('MM.DD HH:mm')}` })
                            );
                        }
                        airSearonCastData.value = tempData;
                    }
                });
        });
    };
    const setStrategyOverviewTemp = () => {
        if (strategyOverview.value[0]) {
            strategyOverviewTemp.value = JSON.parse(JSON.stringify(strategyOverview.value));
        }
    };
    const resetStrategyOverviewTemp = () => {
        strategyOverviewTemp.value = strategyOverview.value;
    };

    const viewLoaded = () => {
        viewLoading.value = false;
        _getJobState();
    };

    /**
     * 查询冷机字典定义
     */
    const queryChillerCodeDefines = async () => {
        if (!currentSystem.value?.classCode) {
            return;
        }
        try {
            const params = {
                classCode: currentSystem.value?.classCode
            };
            const { data } = await listScheduleInfoCodeDefine(params);
            const rec = {};
            Object.keys(data)?.forEach(k => {
                rec[k] = {};

                const fields = data[k];
                fields.forEach((obj, index) => {
                    rec[k][obj.aliasCode] = obj;
                    rec[k][obj.code] = { ...obj, order: index };
                });
            });

            chillerCodeDefine.value = rec;
        } catch (e) {
            console.log('e: ', e);
        }
    };

    watch(
        currentSystem,
        () => {
            queryChillerCodeDefines();
        },
        { immediate: true }
    );

    const getHumidityStandardConfig = date => {
        const finalDate = date;
        if (!finalDate) {
            return;
        }

        fetchRunningStandardAbortController.value?.abort();
        fetchRunningStandardAbortController.value = new AbortController();
        const param = {
            templateType: 'AIRCONDITIONING',
            instanceType: 'PROJECT',
            instanceIds: [baseStore().projectId],
            date: finalDate,
            withColumns: ['instanceId', 'finalConfig']
        };
        isRunningStandardLoading.value = true;
        listConfigsByInstance(param, { signal: fetchRunningStandardAbortController.value.signal })
            .then(res => {
                if (res?.code === SUCCESSCODE) {
                    if (Array.isArray(res?.data)) {
                        const allSpaceConfigs = res?.data?.map(v => v?.finalConfig?.globalConfig?.environmentQuality).filter(v => !!v);
                        const isEnabled = allSpaceConfigs.some(v => v?.isRhQualityEnabled);
                        hasSomeEnableHumidity.value = isEnabled;
                        const itemKey = `${baseStore().projectId}-${finalDate}`;
                        humidityDataMap.value.set(itemKey, isEnabled);
                    }
                }
            })
            .finally(() => {
                isRunningStandardLoading.value = false;
            });
    };

    // 获取地图实例地图相关的数据
    const getEquipBaseInfo = ids => {
        return listObjectsByTackValueLogic({
            runningMonitorType: 'AI',
            takeValueLogic: {
                queryParam: {
                    id: ids,
                    withColumns: ['id', 'localName', 'buildingId', 'floorId', 'classCode', 'bimLocation', 'objType']
                }
            }
        }).then(res => {
            if (Array.isArray(res.data)) {
                res.data.forEach(item => {
                    if (!objectsMap.value[item.id]) {
                        objectsMap.value[item.id] = item;
                    }
                });
            }
        });
    };

    // 获取空间实例地图相关的数据
    const getSpaceBaseInfo = ids => {
        return listObjectsByTackValueLogic({
            runningMonitorType: 'AI',
            takeValueLogic: {
                queryParam: {
                    classCode: GeneralZone,
                    relationTo: {
                        graphCode: 'MechInArch',
                        relCode: 'Eq2Sp',
                        objFrom: ids
                    },
                    withColumns: [
                        'id',
                        'localName',
                        'relObjIds',
                        'buildingId',
                        'floorId',
                        'classCode',
                        'buildArea',
                        'bimLocation',
                        'objType',
                        'roomFuncType',
                        'outline',
                        'spaceId'
                    ],

                    valid: 1
                }
            }
        }).then(res => {
            if (Array.isArray(res.data)) {
                res.data.forEach(item => {
                    if (!objectsMap.value[item.id]) {
                        objectsMap.value[item.id] = item;
                    }
                    item.relObjIds.forEach(v => {
                        if (objectsMap.value[v] && !objectsMap.value[v].space) {
                            objectsMap.value[v].space = item;
                        }
                    });
                });
            }
        });
    };

    // 获取设备=>空间实例地图相关的数据
    const getSpaceIdsByEquipments = () => {
        const ids = configInstanceIds.value;
        if (!Array.isArray(ids) || !ids?.length) {
            return;
        }
        const isEveryEquipsInclude = ids.every(id => objectsMap.value[id]);
        if (isEveryEquipsInclude) {
            return;
        }

        Promise.allSettled([getEquipBaseInfo(ids), getSpaceBaseInfo(ids)]);
    };

    watch(
        () => configInstanceIds.value,
        (cur, pre) => {
            if (cur?.length) {
                const isEqualPre = isEqual(cur, pre);
                if (!isEqualPre) {
                    getSpaceIdsByEquipments();
                }
            }
        }
    );

    watch(
        () => configEquipClassCodes.value,
        cur => {
            if (cur?.length) {
                getInfoCodeData(cur);
            }
        }
    );

    onUnmounted(() => {
        humidityDataMap.value.clear();
    });

    // 提供给外界的方法
    provide(getStrategyOverviewKey, getStrategyOverview);
    // 提供外界的所有数据
    provide(AISystemLoadingKey, AISystemLoading);
    provide(AISystemlistKey, AISystemlist);
    provide(AISystemNoDataKey, AISystemNoData);
    provide(strategyOverviewKey, strategyOverview);
    provide(infoCodesAllMapKey, infoCodesAllMap);
    provide(objectsMapKey, objectsMap);
    provide(currentSystemIdKey, currentSystemId);
    provide(currentSystemKey, currentSystem);
    provide(strategyLoadingKey, strategyLoading);
    provide(strategyOverviewNoDataKey, strategyOverviewNoData);
    provide(broadcastKey, broadcast);
    provide(getBroadcastDataKey, getBroadcastData);
    provide(coolStationCastDataKey, coolStationCastData);
    provide(acCastDataKey, acCastData);
    provide(spaceCastDataKey, spaceCastData);
    provide(getLoadAcQuarterKey, loadAcQuarter);
    provide(getWeatherKey, getWeather);
    provide(airSearonCastDataKey, airSearonCastData);
    provide(Hour24ForecastDataKey, Hour24ForecastData);
    provide(getLastStrategyOverviewKey, getLastStrategyOverview);
    provide(opacityStrategyKey, opacityStrategy);
    provide(nextStartTimeKey, nextStartTime);
    provide(strategyOverviewTempKey, strategyOverviewTemp);
    provide(setStrategyOverviewTempKey, setStrategyOverviewTemp);
    provide(resetStrategyOverviewTempKey, resetStrategyOverviewTemp);
    provide(viewLoadingKey, viewLoading);
    provide(viewLoadedKey, viewLoaded);
    provide(chillerCodeDefineKey, chillerCodeDefine);

    provide(getSpaceIdsByEquipmentsInjectKey, getSpaceIdsByEquipments);
    provide(hasSomeEnableHumidityKey, hasSomeEnableHumidity);
    provide(isRunningStandardLoadingKey, isRunningStandardLoading);

    return {
        AISystemlist,
        AISystemLoading,
        AISystemNoData,
        strategyOverviewKey,
        showSpaceStrategy,
        showSpacePrediction,
        showStrategyEvaluation,
        strategyOverview,
        getStrategyOverview,
        coolStationCastData,
        acCastData,
        spaceCastData,
        coolStationCastDataKey,
        acCastDataKey,
        spaceCastDataKey,
        airSearonCastData,
        viewLoading,
        getSpaceIdsByEquipments,
        templateConfigs,
        getHumidityStandardConfig,
        currentSystemId,
        hasSomeEnableHumidity,
        humidityDataMap
    };
};
