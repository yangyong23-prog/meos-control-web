import { SUCCESSCODE, OBJ_TYPE, CLASS_CODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';

import DockSingleton from '@/hooks/responsiveDock';
import dataDockHandling from '@/hooks/dataDockHandling';
import switchOpen from '@/assets/images/operateMonitoring/switch-open.png';
import switchClose from '@/assets/images/operateMonitoring/switch-close.png';
import switchNoData from '@/assets/images/operateMonitoring/switch-nodata.png';
import switchNoIot from '@/assets/images/operateMonitoring/switch-no-iot.png';
import { listObjectsByTackValueLogic } from '@/apis/public';
import {
    currentSystemKey,
    chartIdMapInfoCodesKey,
    abnormalEventListKey,
    sysChartClassCodeEquipIdMapKey,
    relationChartComponentKey,
    curSubGraphInfoKey,
    setRunningMonitorType,
    openEquipmentListKey
} from '@/views/ACAC/hooks/useBaseHook';
import { openEquipmentInfoKey, closeEquipmentInfoKey, showEquipmentInfoKey, equipmentNodeActiveDataKey } from '@/views/ACAC/hooks/useLeftHook';
import baseStore from '@/store/baseStore';
import emitter from '@/utils/bus';
import {
    RUNNING_MONITOR_TYPE,
    SYSTEM_CLASSCODE,
    EQUIP_GROUP_HAD_SUB_GRAPH,
    EQUIP_GROUP_DISABLE_SELECT,
    COOL_TOWER_CTR_UNIT_CLASSCODE,
    COOL_TOWER_CTL_GROUP_CLASSCODE,
    COOLING_TOWER_FAN_CLASSCODE,
    MAIN_GRAP_TYPE_CODE,
    TANDEM_FROM_CLASSCODES
} from '@/views/ACAC/variables';
import i18n from '@/localization';

export default () => {
    // import { sysChartClassCodeEquipIdMapKey } from '../../hooks/useCommonConfig';

    const { setIotData, getIotData, setObject2RelatedObject, setAbnormalEventStrategy, AbnormalEventStrategy, clearOneObjectInfo } = DockSingleton.getInstance();
    const { loadBatchQueryInfoCodeIotHandling } = dataDockHandling();
    const relationChartComponent = inject(relationChartComponentKey);

    const selectedSystemObj = inject(currentSystemKey);
    // 当前子图
    const curSubGraphInfo = inject(curSubGraphInfoKey, ref());
    const chartIdMapInfoCodes = inject(chartIdMapInfoCodesKey);
    const abnormalEventList = inject(abnormalEventListKey);
    const openEquipmentInfo = inject(openEquipmentInfoKey);
    const closeEquipmentInfo = inject(closeEquipmentInfoKey);
    const equipmentNodeActiveData = inject(equipmentNodeActiveDataKey);
    const openEquipmentList = inject(openEquipmentListKey);
    // const noRelationChartData = inject('noRelationChartData');
    const noRelationChartData = ref();
    // 串联冷机组从对象id映射组
    const tandemFromIdMapGroups = ref();

    // 空间映射水阀
    const spaceMapValves = ref({});

    const majorCode = ref(SYSTEM_CLASSCODE);
    // const equipmentNodeVosList = inject('equipmentNodeVosList');
    const equipmentNodeVosList = ref();
    const groupVos = ref();
    const runningMonitorType = RUNNING_MONITOR_TYPE;
    const sysChartClassCodeEquipIdMap = inject(sysChartClassCodeEquipIdMapKey);

    const equipGroupUseCancelToken = UseCancelTokenHooks();

    const ctrlEquipsCancelToken = UseCancelTokenHooks();

    let sysViewBatchQueryController = null,
        shakeNameTimer = null,
        shakeDurationTimer = null;
    const seLengendData = {
        equipmentData: [
            {
                name: i18n.global.t('meos_control_web.abnormal'),
                bgColor: '#ffffff',
                color: '#F55047'
            },

            {
                name: i18n.global.t('meos_control_web.offline'),
                bgColor: '#ffffff',
                color: '#C4C9CF'
            }
        ],
        switchData: []
    };

    const triggerClose = () => {
        relationChartComponent.value?.removeChoose();
    };

    onMounted(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Related);
        emitter.on('monitorCloseEquipmentiInfo', triggerClose);
    });

    onUnmounted(() => {
        emitter.off('monitorCloseEquipmentiInfo', triggerClose);
    });
    onBeforeUnmount(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Single);
    });
    const equipmentData = [
        { id: 'abnormal_event', name: i18n.global.t('meos_control_web.abnormal_event'), bgColor: '#ffffff', color: '#F55047' },
        { id: 'power_outage', name: i18n.global.t('meos_control_web.power_off'), bgColor: '#ffffff', color: '#B5A777' }
    ];

    const chartAttr = ref(null);
    const equipGroupIdMap = ref(null);
    const equipCountInGroup = ref(null);

    const currentGraphInfo = computed(() => {
        return curSubGraphInfo.value || selectedSystemObj.value;
    });

    watch(
        currentGraphInfo,
        () => {
            if (!currentGraphInfo?.value) {
                chartAttr.value = null;
            } else {
                if (selectedSystemObj.value.diagramBaseObject === 'project') {
                    chartAttr.value = {
                        systemObjectId: baseStore().projectId,
                        classCode: 'project',
                        graphTypeCode: currentGraphInfo.value.graphTypeCode
                        // imageOrProductName: selectedSystemObj.value.imageOrProductName
                    };
                } else {
                    chartAttr.value = {
                        systemObjectId: currentGraphInfo.value.systemId,
                        classCode: currentGraphInfo.value.classCode,
                        graphTypeCode: currentGraphInfo.value.graphTypeCode
                        // imageOrProductName: selectedSystemObj.value.imageOrProductName
                    };
                }
            }
        },
        {
            immediate: true
        }
    );

    const clickNode = data => {
        let postData = {
            ...data,
            systemObjectId: chartAttr.value.systemObjectId,
            systemClassCode: chartAttr.value.classCode
        };
        console.log(postData, 'postData');
        try {
            const equipmap = new Map();
            for (const [key, value] of Object.entries(equipGroupIdMap.value)) {
                for (const item of value) {
                    equipmap.set(item.id, key);
                }
            }

            // 1. 点击冷却塔控制单元下的水阀时：打开冷却塔控制单元的详情
            if (data.classCode === CLASS_CODE.ACVVEO.id && equipmap.get(data.id)) {
                const dataObj = groupVos.value.find(item => item.dataObjectId === equipmap.get(data.id));
                console.log('dataObj: ', dataObj);
                postData = {
                    ...dataObj.dataObject,
                    systemObjectId: chartAttr.value.systemObjectId,
                    systemClassCode: chartAttr.value.classCode
                };
            }
        } catch (error) {
            console.log('clickNode-equipGroupIdMap-error: ', error);
        }

        if (openEquipmentInfo) {
            openEquipmentInfo(postData);
        }
    };

    const clearClickNode = () => {
        closeEquipmentInfo(false);
    };

    // 从图中跳转
    const switchRelationChart = data => {
        if (!data) return;

        setRunningMonitorType(data.interactiveObjectCode);
        curSubGraphInfo.value = {
            systemId: data.systemObjectId,
            classCode: data.interactiveObjectCode,
            graphTypeCode: data.graphTypeCode,
            imageOrProductName: data.jumpTarget,
            localName: data.graphName,
            key: data.systemObjectId
        };
    };
    const shouldHadSubGraph = obj => {
        console.log('shouldHadSubGraph--obj: ', obj);
        if (currentGraphInfo.value?.graphTypeCode === MAIN_GRAP_TYPE_CODE && obj.isPackNode) {
            return true;
        }
        if (obj.classCode === 'ACCPC') {
            // 关系图中针对冷冻水泵控制组跳转末端分视图的判断
            // 冷冻水泵控制组ACCPC，根据泵组的信息点：是否末级水泵组（isTerminalPump）=1 是，可以跳转末端分视图。这个判断条件只适用于源端供水关系图。其他关系图类中均无需做此判断。
            return currentGraphInfo.value?.graphTypeCode === MAIN_GRAP_TYPE_CODE && obj.isTerminalPump === '1';
        }
        return EQUIP_GROUP_HAD_SUB_GRAPH.includes(obj.classCode);
    };
    const equipGroupCannotSelect = obj => {
        if (currentGraphInfo.value?.graphTypeCode === MAIN_GRAP_TYPE_CODE && obj.classCode === 'ACCPC') {
            return obj.isTerminalPump !== '1';
        }
        return EQUIP_GROUP_DISABLE_SELECT.includes(obj.classCode);
    };

    const allSwitchData = [
        {
            id: 'noIot',
            name: i18n.global.t('meos_control_web.no_iot_status'),
            imgSrc: switchNoIot
        },
        {
            id: 'statusOpen',
            name: i18n.global.t('meos_control_web.on'),
            imgSrc: switchOpen
        },
        {
            id: 'statusClose',
            name: i18n.global.t('meos_control_web.off'),
            imgSrc: switchClose
        },
        {
            id: 'noData',
            name: i18n.global.t('meos_control_web.no_data1'),
            imgSrc: switchNoData
        }
    ];
    const omitNoIotSwitchData = allSwitchData.filter(item => item.name !== i18n.global.t('meos_control_web.no_iot_status'));
    const switchLegendData = ref();
    const chartPipelineLegendData = ref([]);
    const pipelineLegendData = computed(() => {
        // 判断有非有效工况
        const arr = [...chartPipelineLegendData.value];
        if (relationChartComponent.value?.hasNoneWorkCondition) {
            arr.push({
                name: i18n.global.t('meos_control_web.relation_chart_not_cur_work_cond_legend'),
                color: '#AEB6C0'
            });
        }
        return arr;
    });
    onUnmounted(() => {
        chartPipelineLegendData.value = [];
    });

    const getEquipOpenCloseStatus = ({ equipId, filterStatus, parentId, parentFilterStatus, classCode }) => {
        const runStatusInfoCodeObj = getIotData(equipId, filterStatus);
        let runStatusDataValue = runStatusInfoCodeObj?.dataValue ?? '';
        if (classCode === 'ACCCAH' && parentId && parentFilterStatus && !runStatusDataValue) {
            const parentRunStatusInfoCodeObj = getIotData(parentId, parentFilterStatus);
            runStatusDataValue = parentRunStatusInfoCodeObj?.dataValue ?? '';
        }

        // 无数据
        if (filterStatus && !runStatusDataValue) {
            return 'noData';
        }

        // 关闭
        if (['0', '2'].includes(runStatusDataValue)) {
            return 'close';
        } else if (runStatusDataValue === '1') {
            // 开启
            return 'open';
        }
    };

    const beforeLoadChart = () => {
        closeEquipmentInfo();
    };

    const computeLegendsShow = ({ data, classCodeEquipIdsMap }) => {
        const openCloseStatusSet = new Set();
        const allEquipIds = Object.values(classCodeEquipIdsMap)?.flat() || [];
        const allEquipNodes =
            data?.equipmentNodeVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
            }) || [];
        const allGroupNodes =
            data?.groupVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
            }) || [];
        const allPassByNodes =
            data?.passByVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
            }) || [];
        const allNodesMap = [...allEquipNodes, ...allGroupNodes, ...allPassByNodes];
        try {
            allEquipIds?.forEach(eqId => {
                const { dataObject, filterStatus, filterStatusVO } = allNodesMap.find(v => v?.dataObjectId === eqId) || {};
                const { relObjIds, classCode } = dataObject || {};
                const parentId = relObjIds ? relObjIds[0] : '';
                const { filterStatus: parentFilterStatus, filterStatusVO: parentFilterStatusVO } = parentId ? allNodesMap?.find(v => v?.dataObjectId === parentId) || {} : {};
                const status = getEquipOpenCloseStatus({
                    equipId: eqId,
                    filterStatus: filterStatus || filterStatusVO?.infoCode,
                    parentId,
                    parentFilterStatus: parentFilterStatus || parentFilterStatusVO?.infoCode,
                    classCode
                });

                // 无孪生数据-IOT状态
                if (typeof filterStatusVO === 'object' && filterStatusVO?.existsIotRule === false) {
                    openCloseStatusSet.add('noIot');
                } else if (typeof filterStatusVO === 'object' && Object.keys(filterStatusVO).length === 0) {
                    // 无滤镜
                    openCloseStatusSet.add('noFilter');
                } else if (status) {
                    openCloseStatusSet.add(status);
                }
            });
        } catch (error) {
            console.log('afterLoadChart-getEquipOpenCloseStatus 出错', error);
        }

        if (openCloseStatusSet.has('noIot') && [...openCloseStatusSet].some(v => v !== 'noIot' && v !== 'noFilter')) {
            switchLegendData.value = allSwitchData;
        } else if (openCloseStatusSet.size && [...openCloseStatusSet].some(v => v !== 'noIot' && v !== 'noFilter')) {
            switchLegendData.value = omitNoIotSwitchData;
        } else {
            switchLegendData.value = [];
        }
        return allEquipIds;
    };

    const queryCtrlEquipsRel = async (ctrIds, classCodeEquipIdsMap) => {
        if (!ctrIds || ctrIds.length === 0) {
            return;
        }
        ctrlEquipsCancelToken.cancelQuest();
        const params = {
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    relationTo: {
                        graphCode: 'CombineSubset',
                        relCode: 'Eg2Eq',
                        objFrom: ctrIds
                    },
                    withColumns: ['id', 'localName', 'classCode', 'relObjIds']
                }
            }
        };
        try {
            const { code, data } = await listObjectsByTackValueLogic(params, { cancelToken: ctrlEquipsCancelToken.cancelToken() });
            if (code === SUCCESSCODE && data) {
                if (classCodeEquipIdsMap) {
                    data?.forEach(obj => {
                        const { classCode } = obj;
                        if (!classCodeEquipIdsMap[classCode]) {
                            classCodeEquipIdsMap[classCode] = [];
                        }
                        if (!classCodeEquipIdsMap[classCode].includes(obj.id)) {
                            classCodeEquipIdsMap[classCode].push(obj.id);
                        }
                        obj.relObjIds?.forEach(id => {
                            // 建立关系
                            setObject2RelatedObject(id, obj.id);
                        });
                    });
                }
                return data;
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };
    // 查询串联冷机组关系
    const queryTandemColdRel = async fromIds => {
        if (!fromIds || fromIds.length === 0) {
            return;
        }

        const params = {
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACSCG'],
                    relationFrom: {
                        graphCode: 'CombineSubset',
                        relCode: 'Eg2Eq',
                        objTo: fromIds
                    },
                    withColumns: ['id', 'localName', 'classCode', 'relObjIds']
                }
            }
        };
        try {
            const { code, data } = await listObjectsByTackValueLogic(params);
            if (code === SUCCESSCODE && data) {
                const idMapObj = {};
                if (data && data.length > 0) {
                    const obj = data[0];
                    obj.relObjIds?.forEach(id => {
                        // 建立关系
                        idMapObj[id] = obj;
                    });
                }

                tandemFromIdMapGroups.value = idMapObj;
                return data;
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const queryEquipsRelGroup = async (equipGroupIds, classCodeEquipIdsMap, eqGroupIdMap) => {
        // console.log('equipGroupIds: ', equipGroupIds, classCodeEquipIdsMap, eqGroupIdMap);
        if (!equipGroupIds || equipGroupIds.length === 0) {
            return;
        }
        const ctrlIds = [];
        equipGroupUseCancelToken.cancelQuest();
        const params = {
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    relationTo: {
                        graphCode: 'CombineSubset',
                        relCode: 'Eg2Eq',
                        objFrom: equipGroupIds
                    },
                    withColumns: ['id', 'localName', 'classCode', 'relObjIds', 'objType']
                }
            }
        };
        try {
            const { code, data } = await listObjectsByTackValueLogic(params, { cancelToken: equipGroupUseCancelToken.cancelToken() });
            if (code === SUCCESSCODE && data) {
                const groupIdMapEquips = {};
                const groupIdMapCounts = {};

                if (classCodeEquipIdsMap) {
                    data?.forEach(obj => {
                        const { classCode, objType } = obj;
                        if (!classCodeEquipIdsMap[classCode]) {
                            classCodeEquipIdsMap[classCode] = [];
                        }
                        classCodeEquipIdsMap[classCode].push(obj.id);
                        // 设备组
                        if (objType === OBJ_TYPE.EQUIPGROUP && !ctrlIds.includes(obj.id)) {
                            ctrlIds.push(obj.id);
                        }
                        obj.relObjIds?.forEach(id => {
                            if (!groupIdMapEquips[id]) {
                                groupIdMapEquips[id] = [];
                            }
                            groupIdMapEquips[id].push(obj);
                            if (!groupIdMapCounts[id]) {
                                groupIdMapCounts[id] = 0;
                            }
                            const eqGroupObj = eqGroupIdMap[id];
                            // 当控制组是“冷却塔控制组”且对应组下设备是冷却塔风机才统计数量；其它控制组都统计
                            if (
                                (eqGroupObj?.classCode === COOL_TOWER_CTL_GROUP_CLASSCODE && obj.classCode === COOLING_TOWER_FAN_CLASSCODE) ||
                                eqGroupObj?.classCode !== COOL_TOWER_CTL_GROUP_CLASSCODE
                            ) {
                                groupIdMapCounts[id] += 1;
                            }
                            if (eqGroupObj?.objType === OBJ_TYPE.EQUIPGROUP && !ctrlIds.includes(id)) {
                                ctrlIds.push(id);
                            }
                            // 冷却塔控制单元建立异常事件关系
                            if (eqGroupObj?.classCode === COOL_TOWER_CTR_UNIT_CLASSCODE) {
                                if (!ctrlIds.includes(id)) {
                                    ctrlIds.push(id);
                                }
                                // 建立关系
                                setObject2RelatedObject(id, obj.id);
                            }
                        });
                    });
                }
                if (ctrlIds.length) {
                    await queryCtrlEquipsRel(ctrlIds, classCodeEquipIdsMap);
                }
                equipGroupIdMap.value = groupIdMapEquips;
                equipCountInGroup.value = groupIdMapCounts;
                return data;
            }
        } catch (e) {
            equipGroupIdMap.value = null;
            equipCountInGroup.value = null;
            console.log('e: ', e);
        }
    };

    /**
     * @description: 查询空间下阀门
     * @param {*} zoneObjs 空间对象列表
     * @returns
     */
    const queryValveInZone = async zoneObjs => {
        if (!zoneObjs || zoneObjs.length === 0) {
            return;
        }
        const ids = zoneObjs.map(obj => obj.id);
        const params = {
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACVVEO', 'ACVVEJ'],
                    relationFrom: {
                        graphCode: 'MechInArch',
                        relCode: 'Eq2Sp',
                        objTo: ids
                    },
                    withColumns: ['id', 'localName', 'classCode', 'relObjIds']
                }
            }
        };
        try {
            const { code, data } = await listObjectsByTackValueLogic(params);
            if (code === SUCCESSCODE && data) {
                const idMapObj = {};
                if (data && data.length > 0) {
                    data.forEach(obj => {
                        obj.relObjIds?.forEach(id => {
                            if (!idMapObj[id]) {
                                idMapObj[id] = [];
                            }
                            // 建立关系
                            idMapObj[id].push(obj);
                        });
                    });
                }

                spaceMapValves.value = idMapObj;
                return data;
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const batchQueryIots = async (idAndInfoCodes, classCodeMap) => {
        if (!idAndInfoCodes) {
            return;
        }
        const idMapClassCode = {};
        Object.entries(classCodeMap).forEach(([k, ids]) => {
            ids?.forEach(id => {
                idMapClassCode[id] = k;
            });
        });
        // console.log('idMapClassCode: ', idMapClassCode);

        sysViewBatchQueryController?.abort();
        sysViewBatchQueryController = new AbortController();
        const params = {
            object: Object.keys(idAndInfoCodes).map(id => ({
                objectId: id,
                infoCodes: idAndInfoCodes[id],
                classCode: idMapClassCode[id]
            })),
            queryInfoCodeRule: true,
            queryInfoCodeDefine: true
        };

        await loadBatchQueryInfoCodeIotHandling(params, null, sysViewBatchQueryController.signal);
    };

    const afterLoadChart = async ({ data, legendData, renderDomList, idMapInfoCodes, classCodeEquipIdsMap }) => {
        equipmentNodeVosList.value = data?.equipmentNodeVos;
        groupVos.value = data?.groupVos;
        computeLegendsShow({ data, classCodeEquipIdsMap });

        // currentSceneIds.value = classCodeEquipIdsMap;
        // console.log('classCodeEquipIdsMap: ', idMapInfoCodes, data, classCodeEquipIdsMap);
        const eqGroupIdMap = {};
        let equipGroupIds =
            renderDomList
                ?.filter(obj => obj.dataObject?.objType === OBJ_TYPE.EQUIPGROUP)
                .map(obj => {
                    eqGroupIdMap[obj.dataObject?.id] = obj.dataObject;
                    return obj.dataObject?.id;
                }) || [];
        equipGroupIds = [...new Set(equipGroupIds)];
        noRelationChartData.value = !data;
        if (idMapInfoCodes) {
            Object.values(idMapInfoCodes)?.forEach(infoCodes => {
                infoCodes?.push('rcRunStatus');
            });
        }
        chartIdMapInfoCodes.value = idMapInfoCodes;

        // 设置图例数据
        chartPipelineLegendData.value = legendData.map(it => {
            return {
                name: it.lineNames[0],
                color: it.style.backgroundColor
            };
        });
        const tandemFromIds = renderDomList?.filter(obj => TANDEM_FROM_CLASSCODES.includes(obj.dataObject?.classCode)).map(obj => obj.dataObject?.id) || [];
        queryTandemColdRel(tandemFromIds);
        await queryEquipsRelGroup(equipGroupIds, classCodeEquipIdsMap, eqGroupIdMap);
        const _classCodeEquipIdsMap = classCodeEquipIdsMap || {};

        const acZoneObjs = [];
        data?.equipmentNodeVos?.forEach(node => {
            // 打包节点把打包下设备也加进去
            if (node.compType === 'packNode') {
                node.dataObject?.items?.forEach(obj => {
                    if (!_classCodeEquipIdsMap[obj.classCode]) {
                        _classCodeEquipIdsMap[obj.classCode] = [];
                    }
                    _classCodeEquipIdsMap[obj.classCode].push(obj.id);
                });
            } else if (node.dataObject?.classCode === 'ACZone') {
                acZoneObjs.push(node.dataObject);
            }
        });
        queryValveInZone(acZoneObjs);
        // 兼容二次编辑设置了系统参数
        const sysClassCode = currentGraphInfo.value.classCode;
        if (!_classCodeEquipIdsMap[sysClassCode] && currentGraphInfo.value.systemId) {
            _classCodeEquipIdsMap[sysClassCode] = [currentGraphInfo.value.systemId];
        }
        sysChartClassCodeEquipIdMap.value = _classCodeEquipIdsMap;
        batchQueryIots(idMapInfoCodes, _classCodeEquipIdsMap);
        // queryChartRcRunStatus(allEquipIds);

        setTimeout(() => {
            relationChartComponent.value?.updateAbnormalData(abnormalEventList.value || []);
        });
    };

    // 节点选择行为定义
    const nodeSelectDefine = {
        // 节点是否可选
        enableSelectFunc: modelData => {
            if (!modelData) return false;
            const data = modelData;
            const { dataObject } = data;

            if (dataObject?.classCode === 'ACZone') {
                // console.log('data----: ', spaceMapValves.value?.[dataObject.id]?.length > 0, dataObject.id, data);
                return spaceMapValves.value?.[dataObject.id]?.length > 0;
            }
            const isPackNode = data.compType === 'packNode';
            return dataObject?.objType === OBJ_TYPE.EQUIPMENT || dataObject?.objType === OBJ_TYPE.EQUIPMENTNODE || dataObject?.objType === OBJ_TYPE.EQUIPGROUP || isPackNode;
        },
        // 节点选择执行函数
        execSelectFunc: dataObject => {
            if (dataObject?.classCode === 'ACZone') {
                if (spaceMapValves.value?.[dataObject.id]?.length > 0) {
                    relationChartComponent.value?.unhoverNode();
                    openEquipmentList(dataObject.id);
                    return true;
                }
            }
            return false;
        }
    };

    watch(abnormalEventList, () => {
        relationChartComponent.value?.updateAbnormalData(abnormalEventList.value);
    });

    watch(equipmentNodeActiveData, () => {
        // 清除所有现有的定时器
        clearTimeout(shakeNameTimer);
        clearTimeout(shakeDurationTimer);

        if (equipmentNodeActiveData?.value && TANDEM_FROM_CLASSCODES.includes(equipmentNodeActiveData.value.classCode)) {
            const relTandemFromIds = tandemFromIdMapGroups.value?.[equipmentNodeActiveData.value.id]?.relObjIds;

            if (relTandemFromIds?.length > 0) {
                // 延迟一段时间后开始闪烁
                shakeNameTimer = setTimeout(() => {
                    relationChartComponent.value?.shakeName(relTandemFromIds);

                    // 设置闪烁持续时间，在时间结束后停止闪烁
                    shakeDurationTimer = setTimeout(() => {
                        relationChartComponent.value?.clearShakeName();
                    }, 1500); // 300毫秒后停止闪烁
                }, 100); // 200毫秒延迟后开始闪烁
            }
        } else {
            // 如果不符合条件，立即清除闪烁效果
            relationChartComponent.value?.clearShakeName();
        }
    });

    provide('templateTypeAllLoading', ref());
    return {
        relationChartComponent,
        chartAttr,
        curSubGraphInfo,
        equipGroupIdMap,
        equipCountInGroup,
        runningMonitorType,
        equipmentData,
        switchLegendData,
        pipelineLegendData,
        equipGroupCannotSelect,
        shouldHadSubGraph,
        switchRelationChart,
        clickNode,
        clearClickNode,
        beforeLoadChart,
        afterLoadChart,
        triggerClose,
        nodeSelectDefine
    };
};
