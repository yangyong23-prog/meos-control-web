// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { globalTimeKey, curSelectedFloorKey, curSelectedTimeKey, changeTimeKey, fiveMinuteTimesKey, isSplitScreenKey } from '../injectionKey';
import _ from 'lodash';
import baseStore from '@/store/baseStore';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { transeAirSpaceRecord, findSpaceStatusInTime, makeEquipTree, disableUncheckedTreeNode, makeEquipParamTree, makeEquipAnaChartDatas } from '../utils/index';
import {
    getAirSpaceRecord,
    getSpaceListByIds,
    getAirEquipListByClassCode,
    getInfoCodeListByEquipIds,
    getBatchQueryPeriodDataAxios,
    listTerminalClassCode
} from '@/apis/runAnalysis';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { AC_EQUIPMENT_ANALYSIS, EQUIP_FRESH_AIR_ANALYSIS, TEMPERATURE, MAX_EQUIP_SEL, MAX_IOT_INFO_SEL } from '../variable';
import { useRoute } from 'vue-router';
import useLoading from '@/hooks/useLoading';

export default () => {
    // const { base } = useStore();
    const { openLoading, closeLoading } = useLoading(
        'equip-analysis-left',
        '#fff',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const options = ref([
        {
            key: AC_EQUIPMENT_ANALYSIS,
            label: i18n.global.t('meos_control_web.terminal_equipment_analysis')
        },
        {
            key: EQUIP_FRESH_AIR_ANALYSIS,
            label: i18n.global.t('meos_control_web.fresh_air_analysis')
        }
    ]);
    const isSplitScreen = ref(false);
    const refreshChart = ref(true);
    const equipType = ref(AC_EQUIPMENT_ANALYSIS);
    const globalTime = inject(globalTimeKey);

    // 辅助线当前选择的时间，默认12:00
    const curSelectedTime = ref('12:00');
    const curSelectClassCode = ref();
    const curSelectedEquipIds = ref();
    const curSelectedParams = ref();

    const curSelectedFloorObj = ref();

    const spaceRecordApiToken = UseCancelTokenHooks();
    const spaceModelApiToken = UseCancelTokenHooks();
    const periodDataAxiosApiToken = UseCancelTokenHooks();
    const listTerminalClassCodeApiToken = UseCancelTokenHooks();

    // 设备参数，下拉选项
    const paramsSelOptions = ref();
    // 设备选择下拉选项
    const equipSelOptions = ref();

    // 设备选择下拉选择组件
    const equipTreeSelectRef = ref();
    const paramTreeSelectRef = ref();

    // 空间模型数据
    const spaceDetailList = ref();
    // 空间分析记录数据
    const spaceRecordlList = ref();
    const chartData = ref();
    const classCodeOpt = ref([]);

    const equipIdMapObj = {};
    const infoCodeMapObj = {};
    // 获取15分钟时间间隔列表，用于特定的定时或查询功能
    const fiveMinuteTimes = inject(fiveMinuteTimesKey);

    const { query } = useRoute();

    let lastSelEquipIds = null;

    // 平铺结构的左侧列表数据

    const changeTime = data => {
        console.log('changeTime: ', data);

        curSelectedTime.value = data;
    };
    // 修改设备分析类型
    const changeEquipType = id => {
        equipType.value = id;
    };

    // 查询设备选择下拉选项
    const queryEquips = async () => {
        if (!curSelectClassCode.value) {
            return;
        }
        try {
            const params = { classCode: curSelectClassCode.value, secondType: equipType.value };
            const { code, data } = await getAirEquipListByClassCode(params);

            if (code === SUCCESSCODE && data) {
                data.forEach(obj => {
                    equipIdMapObj[obj.id] = obj;
                });
                const treeData = makeEquipTree(data);
                equipSelOptions.value = treeData;
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };
    // 查询设备对应的iot参数
    const queryEquipIots = async () => {
        if (!curSelectedEquipIds.value?.length) {
            return;
        }
        try {
            const params = { objectIds: curSelectedEquipIds.value, secondType: equipType.value };
            const { code, data } = await getInfoCodeListByEquipIds(params);
            if (code === SUCCESSCODE && data) {
                data.forEach(obj => {
                    infoCodeMapObj[obj.code] = obj;
                });
                const treeData = makeEquipParamTree(data);
                paramsSelOptions.value = treeData;
                nextTick(() => {
                    // 请求回来，过滤已选参数
                    curSelectedParams.value = curSelectedParams.value.filter(infoCode => infoCodeMapObj[infoCode]);
                });
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };
    // 查询设备服务空间模型数据
    const querySpaceModels = async spaceIds => {
        if (!spaceIds?.length) {
            return;
        }
        spaceDetailList.value = null;
        spaceModelApiToken.cancelQuest();
        const params = { projectId: baseStore().projectId, spaceIds };
        try {
            const { code, data } = await getSpaceListByIds(params, { cancelToken: spaceModelApiToken.cancelToken() });
            if (code === SUCCESSCODE && data) {
                spaceDetailList.value = data;
                return data;
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    // 查询空间对应的状态记录
    const querySpaceRecord = async spaceIds => {
        if (!globalTime.value || !spaceIds?.length) {
            return;
        }
        spaceRecordApiToken.cancelQuest();

        const params = { type: TEMPERATURE, instanceType: 'SPACE', instanceIds: spaceIds, date: dayjs(globalTime.value).format('YYYY-MM-DD') };

        try {
            const { code, data } = await getAirSpaceRecord(params, { cancelToken: spaceRecordApiToken.cancelToken() });

            if (code === SUCCESSCODE && data) {
                const { spacesAnalysisList } = data;

                // console.log('querySpaceRecord-----data: ', spacesAnalysisList);
                transeAirSpaceRecord(spacesAnalysisList);
                spaceRecordlList.value = spacesAnalysisList;

                return spacesAnalysisList;
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    // 按信息点大类、单位分组
    const makeInfoGroups = infoCodes => {
        const infoObjs = infoCodes
            .map(code => {
                return infoCodeMapObj[code];
            })
            .filter(Boolean);
        let lastGroupCode = null,
            lastUnit = null,
            groupCount = 0,
            lastGroup = null;
        const groups = [];
        _.orderBy(infoObjs, ['groupCode', 'unit']).forEach(obj => {
            if (obj.groupCode !== lastGroupCode) {
                lastGroupCode = obj.groupCode;
                lastGroup = [];
                groupCount = 0;
                groups.push(lastGroup);
            }
            if (lastGroup.length > 0 && (lastUnit !== obj.unit || !obj.unit)) {
                lastGroup = [];
                groupCount = 0;
                groups.push(lastGroup);
            }
            if (lastGroup.length > 0 && groupCount > 1) {
                groupCount = 0;
                lastGroup = [];
                groups.push(lastGroup);
            }
            groupCount += 1;
            lastUnit = obj.unit;
            lastGroup.push(obj);
        });

        return groups;
    };
    // 查询设备分精度数据
    const queryPeriodDataAxios = async (equipIds, infoCodes) => {
        if (!equipIds?.length || !infoCodes?.length) {
            return;
        }

        const infoGroups = makeInfoGroups(infoCodes);

        // 计算结束日期，加一天以确保包含所有需要的数据
        const endDate = dayjs(globalTime.value).add(1, 'day').format('YYYYMMDD000000');
        // 初始化查询参数
        const params = {
            beginDate: dayjs(globalTime.value).format('YYYYMMDD000000'),
            endDate,
            infoCodes,
            objectIds: equipIds,
            enumTime: '5min'
        };
        openLoading();
        try {
            const { code, data } = await getBatchQueryPeriodDataAxios(params, { token: periodDataAxiosApiToken.cancelToken() });
            if (code === SUCCESSCODE && data) {
                chartData.value = makeEquipAnaChartDatas(data, equipIdMapObj, infoGroups, fiveMinuteTimes.value);

                refreshChart.value = false;
                nextTick(() => {
                    refreshChart.value = true;
                });
            }
        } catch (e) {
            console.log('e: ', e);
        } finally {
            closeLoading();
        }
    };

    const makeMapSpaces = (spaceRecordlListP, spaceDetailListP) => {
        console.log('===============');

        if (spaceRecordlListP?.length > 0 && spaceDetailListP?.length) {
            const idMapBase = {};
            spaceRecordlListP.forEach(obj => {
                idMapBase[obj.spaceId] = obj;
            });
            return spaceDetailListP
                ?.map(space => {
                    const baseInfo = idMapBase[space.id];
                    if (baseInfo) {
                        const status = findSpaceStatusInTime(baseInfo, curSelectedTime.value);

                        if (status) {
                            return {
                                status,
                                ...baseInfo,
                                ...space
                            };
                        }
                    }
                    return null;
                })
                .filter(Boolean);
        }

        return [];
    };

    const queryEquipIotsDebounce = _.debounce(queryEquipIots, 5);
    // 设备选择处理，最多能选6个
    const equipSelChange = (ids, node, nNode) => {
        // console.log('ids, node, nNode: ', ids, node, nNode);
        if (!nNode) {
            return;
        }

        disableUncheckedTreeNode(toRaw(equipTreeSelectRef.value.data), ids.length >= MAX_EQUIP_SEL);
    };

    // 选择设备面板attr
    const equipPopoverAttrs = {};
    equipPopoverAttrs.onShow = () => {
        const ids = curSelectedEquipIds?.value || [];
        lastSelEquipIds = [...ids];
    };

    // 面板收起触发
    equipPopoverAttrs.onHide = () => {
        nextTick(() => {
            //  根据已选设备查询参数数据
            if (curSelectedEquipIds?.value.length > 0) {
                if (!_.isEqual(lastSelEquipIds, curSelectedEquipIds?.value)) {
                    queryEquipIotsDebounce();
                }
            } else {
                curSelectedParams.value = [];
                paramsSelOptions.value = [];
            }
        });
    };
    // 参数选择处理，最多选择10个
    const paramsSelChange = (ids, node, nNode) => {
        if (!nNode) {
            return;
        }

        disableUncheckedTreeNode(toRaw(paramTreeSelectRef.value.data), ids.length >= MAX_IOT_INFO_SEL);
    };

    const clearChartData = () => {
        chartData.value = [];
    };
    const clearMapData = () => {
        spaceRecordlList.value = null;
        spaceDetailList.value = null;
    };

    const currentMapData = computed(() => {
        const spaceIdMap = {};
        const links = [];
        const equipments = [];
        let spaces = null;
        if (curSelectedTime.value && spaceDetailList.value?.length > 0 && spaceRecordlList.value?.length > 0) {
            const _spaces = makeMapSpaces(spaceRecordlList.value, spaceDetailList.value);
            spaces = toRaw(_spaces);
            spaces = spaces.filter(obj => {
                // 若选择楼层，则过滤楼层
                if (!curSelectedFloorObj.value?.id || (curSelectedFloorObj.value?.id && obj.floorId === curSelectedFloorObj.value?.id)) {
                    spaceIdMap[obj.id] = obj;
                    return true;
                }
                return false;
            });
        }
        curSelectedEquipIds?.value?.forEach(id => {
            const equipObj = equipIdMapObj[id];
            if (equipObj) {
                // 若选择楼层，则过滤楼层
                if (!curSelectedFloorObj.value?.id || (curSelectedFloorObj.value?.id && equipObj.floorId === curSelectedFloorObj.value?.id)) {
                    equipObj.relObjIds?.forEach(spaceId => {
                        const spaceObj = spaceIdMap[spaceId];
                        if (spaceObj) {
                            links.push({
                                fromObj: equipObj,
                                toObj: spaceObj
                            });
                        }
                    });
                    equipments.push(equipObj);
                }
            }
        });
        return { spaces, equipments, links };
        // return null;
    });

    // 查询设备分析数据
    const doQueryAnalysisData = async () => {
        if (curSelectedEquipIds.value?.length && curSelectedParams.value?.length) {
            // console.log('curSelectedParams.value: ', curSelectedParams.value);
            const spaceIdSet = new Set();
            const equipIdSet = new Set();
            curSelectedEquipIds?.value?.forEach(id => {
                equipIdSet.add(id);
                const relIds = equipIdMapObj[id]?.relObjIds;
                relIds?.forEach(spaceId => {
                    spaceIdSet.add(spaceId);
                });
            });
            queryPeriodDataAxios([...equipIdSet], toRaw(curSelectedParams.value));
            // console.log('doQueryAnalysisData: ', spaceIdSet.size, Object.keys(equipIdMapObj).length);
            if (spaceIdSet.size > 0) {
                const spaceIds = [...spaceIdSet];
                await Promise.allSettled([querySpaceRecord(spaceIds), querySpaceModels(spaceIds)]);
            }
            return;
        } else {
            // clear
            clearMapData();
            clearChartData();
        }
    };

    // 根据URL 参数初始化选项，查询
    const initQueryParams = async () => {
        const { equipType: et, classCode, equipIds, infoCodes } = query;
        if (!et || !classCode) {
            return;
        }
        openLoading();
        equipType.value = et;
        console.log('initQueryParams--et: ', et, classCode);
        await nextTick();
        await reloadEquipClassCodesOpt(false);
        curSelectClassCode.value = classCode;
        curSelectedEquipIds.value = equipIds?.split(',');

        curSelectedParams.value = infoCodes?.split(',');
        await Promise.allSettled([queryEquips(), queryEquipIots()]);
        return doQueryAnalysisData();
    };

    // 加载设备类下拉框数据相关
    const reloadEquipClassCodesOpt = async (relTrigger = true) => {
        listTerminalClassCodeApiToken.cancelQuest();

        try {
            const { code, data } = await listTerminalClassCode(equipType.value, { cancelToken: listTerminalClassCodeApiToken.cancelToken() });
            // console.log('data--=====: ', data);
            if (code === SUCCESSCODE && data?.length > 0) {
                classCodeOpt.value = data.map(obj => {
                    return {
                        id: obj.classCode,
                        name: obj.className
                    };
                });
                // console.log('classCodeOpt.value: ', classCodeOpt.value, curSelectClassCode.value);
                const oldClassCode = curSelectClassCode.value;
                curSelectClassCode.value = classCodeOpt.value[0].id;
                if (relTrigger && oldClassCode === curSelectClassCode.value) {
                    lastSelEquipIds = null;
                    curSelectedEquipIds.value = [];
                    curSelectedParams.value = [];
                    paramsSelOptions.value = [];
                    queryEquips();
                }
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    // 初始化watch
    const initWatchers = immediate => {
        watch(
            equipType,
            () => {
                reloadEquipClassCodesOpt();
            },
            {
                immediate
            }
        );

        watch(
            () => globalTime?.value,
            () => {
                doQueryAnalysisData();
            },
            {
                immediate
            }
        );
        watch(
            () => curSelectClassCode?.value,
            () => {
                lastSelEquipIds = null;
                curSelectedEquipIds.value = [];
                curSelectedParams.value = [];
                paramsSelOptions.value = [];
                queryEquips();
            },
            {
                immediate
            }
        );
    };

    const { equipType: et, classCode, equipIds, infoCodes } = query;
    // 参数跳转
    if (et && classCode && equipIds && infoCodes) {
        initQueryParams().then(() => {
            initWatchers(false);
        });
    } else {
        initWatchers(true);
    }

    onMounted(() => {});
    provide(curSelectedFloorKey, curSelectedFloorObj);

    provide(changeTimeKey, changeTime);
    provide(curSelectedTimeKey, curSelectedTime);
    provide(isSplitScreenKey, isSplitScreen);
    return {
        curSelectedTime,

        curSelectedFloorObj,
        options,
        equipType,
        curSelectClassCode,
        curSelectedEquipIds,
        curSelectedParams,
        equipSelOptions,
        paramsSelOptions,
        equipTreeSelectRef,
        isSplitScreen,
        refreshChart,
        currentMapData,
        classCodeOpt,
        chartData,
        paramTreeSelectRef,
        equipPopoverAttrs,
        changeTime,
        equipSelChange,
        doQueryAnalysisData,
        changeEquipType,
        paramsSelChange
    };
};
