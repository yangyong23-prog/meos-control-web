import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';

import DockSingleton from '@/hooks/responsiveDock';
import switchOpen from '@/assets/images/operateMonitoring/switch-open.png';
import switchClose from '@/assets/images/operateMonitoring/switch-close.png';
import switchNoData from '@/assets/images/operateMonitoring/switch-nodata.png';
import switchNoIot from '@/assets/images/operateMonitoring/switch-no-iot.png';
import { listObjectsByTackValueLogic } from '@/apis/public';
import baseStore from '@/store/baseStore';
import emitter from '@/utils/bus';
import { setRunningMonitorType, getCurrentSystemConfig } from '@/views/System/utils/index';

import { currentSystemKey, chartIdMapInfoCodesKey, sysChartClassCodeEquipIdMapKey, relationChartComponentKey, curSubGraphInfoKey } from './useStateHook';
import { abnormalEventListKey } from './useAbnormalHook';
import { openEquipmentInfoKey, closeEquipmentInfoKey } from './useLeftHook';
import { batchQueryInfoCodeConfig } from '@/apis/monitor';
import i18n from '@/localization';

export default () => {
    const { setIotData, getIotData, setObject2RelatedObject, setAbnormalEventStrategy, AbnormalEventStrategy } = DockSingleton.getInstance();
    const relationChartComponent = inject(relationChartComponentKey);

    const selectedSystemObj = inject(currentSystemKey);
    // 当前子图
    const curSubGraphInfo = inject(curSubGraphInfoKey, ref());
    const chartIdMapInfoCodes = inject(chartIdMapInfoCodesKey);
    const abnormalEventList = inject(abnormalEventListKey);
    const openEquipmentInfo = inject(openEquipmentInfoKey);
    const closeEquipmentInfo = inject(closeEquipmentInfoKey);

    const noRelationChartData = ref();

    const equipmentNodeVosList = ref();

    const { currentConfig } = getCurrentSystemConfig();
    const { RUNNING_MONITOR_TYPE: runningMonitorType } = currentConfig || {};
    const { CHECK_EQUIP_GROUP_HAD_SUB_GRAPH, CHECK_EQUIP_GROUP_DISABLE_SELECT, CHECK_INSTANCE_RELATED_ABNORMAL_EVENTS } = currentConfig?.LEFT_CONFIG || {};
    const sysChartClassCodeEquipIdMap = inject(sysChartClassCodeEquipIdMapKey);

    const equipGroupUseCancelToken = UseCancelTokenHooks();

    let sysViewBatchQueryController = null;

    const triggerClose = () => {
        relationChartComponent?.value?.removeChoose?.();
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

    const currentGraphInfo = computed(() => {
        return curSubGraphInfo.value || selectedSystemObj.value;
    });

    watch(
        currentGraphInfo,
        () => {
            if (!currentGraphInfo?.value) {
                chartAttr.value = null;
            } else {
                baseStore().isCoolHotSystem = selectedSystemObj.value?.imageOrProductName === i18n.global.t('meos_control_web.heating_cooling_source_water_diagram');

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
        const postData = {
            ...data,
            systemObjectId: chartAttr.value.systemObjectId,
            systemClassCode: chartAttr.value.classCode
        };
        console.log(postData, 'postData');

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
        if (CHECK_EQUIP_GROUP_HAD_SUB_GRAPH) {
            return CHECK_EQUIP_GROUP_HAD_SUB_GRAPH(obj);
        }
        return false;
    };
    const equipGroupCannotSelect = obj => {
        if (CHECK_EQUIP_GROUP_DISABLE_SELECT) {
            return CHECK_EQUIP_GROUP_DISABLE_SELECT(obj);
        }
        return false;
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
    const pipelineLegendData = ref([]);
    onUnmounted(() => {
        pipelineLegendData.value = [];
    });

    const getEquipOpenCloseStatus = ({ equipId, filterStatus, parentId, parentFilterStatus, classCode }) => {
        const runStatusInfoCodeObj = getIotData(equipId, filterStatus);
        let runStatusDataValue = runStatusInfoCodeObj?.dataValue ?? '';
        if (classCode && parentId && parentFilterStatus && !runStatusDataValue) {
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
    const queryEquipsRelGroup = async (equipGroupIds, classCodeEquipIdsMap, eqGroupIdMap) => {
        // console.log('equipGroupIds: ', equipGroupIds);
        if (!equipGroupIds || equipGroupIds.length === 0) {
            return;
        }
        equipGroupUseCancelToken.cancelQuest();
        const params = {
            runningMonitorType: runningMonitorType,
            takeValueLogic: {
                queryParam: {
                    relationTo: {
                        graphCode: 'CombineSubset',
                        relCode: 'Eg2Eq',
                        objFrom: equipGroupIds
                    },
                    withColumns: ['id', 'localName', 'classCode', 'relObjIds']
                }
            }
        };
        try {
            const { code, data } = await listObjectsByTackValueLogic(params, { cancelToken: equipGroupUseCancelToken.cancelToken() });
            if (code === SUCCESSCODE && data) {
                const groupIdMapEquips = {};

                if (classCodeEquipIdsMap) {
                    data?.forEach(obj => {
                        const { classCode } = obj;
                        if (!classCodeEquipIdsMap[classCode]) {
                            classCodeEquipIdsMap[classCode] = [];
                        }
                        classCodeEquipIdsMap[classCode].push(obj.id);

                        obj.relObjIds?.forEach(id => {
                            if (!groupIdMapEquips[id]) {
                                groupIdMapEquips[id] = [];
                            }
                            groupIdMapEquips[id].push(obj);
                            const eqGroupObj = eqGroupIdMap[id];
                            // 建立异常事件关系
                            if (CHECK_INSTANCE_RELATED_ABNORMAL_EVENTS && CHECK_INSTANCE_RELATED_ABNORMAL_EVENTS(eqGroupObj)) {
                                // 建立关系
                                setObject2RelatedObject(id, obj.id);
                            }
                        });
                    });
                }
                equipGroupIdMap.value = groupIdMapEquips;
                return data;
            }
        } catch (e) {
            equipGroupIdMap.value = null;
            console.log('e: ', e);
        }
    };

    const queryChartRcRunStatus = async ids => {
        if (!ids || ids.length === 0) {
            return;
        }
        sysViewBatchQueryController?.abort();
        sysViewBatchQueryController = new AbortController();
        const objects = ids.map(id => {
            return {
                objectId: id,
                infoCodes: [
                    'rcRunStatus' // 开启/关闭中
                ]
            };
        });
        const params = {
            projectId: baseStore().projectId,
            systemId: selectedSystemObj.value.systemId,
            systemClassCode: selectedSystemObj.value.classCode,
            object: objects
        };
        const { code, data } = await batchQueryInfoCodeConfig(params, sysViewBatchQueryController.signal);
        if (code === '00000') {
            Object.keys(data).forEach(equipId => {
                const iots = data[equipId];
                iots.forEach(iot => {
                    setIotData(equipId, iot.infoCode, iot);
                });
            });
        }
    };

    const afterLoadChart = async ({ data, legendData, renderDomList, idMapInfoCodes, classCodeEquipIdsMap }) => {
        equipmentNodeVosList.value = data?.equipmentNodeVos;

        const allEquipIds = computeLegendsShow({ data, classCodeEquipIdsMap });
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
        if (chartIdMapInfoCodes) {
            chartIdMapInfoCodes.value = idMapInfoCodes;
        }

        // 设置图例数据
        pipelineLegendData.value = legendData.map(it => {
            return {
                name: it.lineNames[0],
                color: it.style.backgroundColor
            };
        });
        await queryEquipsRelGroup(equipGroupIds, classCodeEquipIdsMap, eqGroupIdMap);
        sysChartClassCodeEquipIdMap.value = classCodeEquipIdsMap;

        queryChartRcRunStatus(allEquipIds);

        setTimeout(() => {
            relationChartComponent?.value?.updateAbnormalData?.(abnormalEventList?.value || []);
        });
    };

    watch(abnormalEventList, () => {
        relationChartComponent?.value?.updateAbnormalData?.(abnormalEventList.value);
    });

    provide('templateTypeAllLoading', ref());
    return {
        relationChartComponent,
        chartAttr,
        curSubGraphInfo,
        equipGroupIdMap,
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
        triggerClose
    };
};
