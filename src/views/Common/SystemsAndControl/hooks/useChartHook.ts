import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import emitter from '@/utils/bus';

import DockSingleton from '@/hooks/responsiveDock';
import dataDockHandling from '@/hooks/dataDockHandling';
import { isEdge } from '@/utils/envUtils';
import { useShellPrecisionConfig, ACAI_RUNNING_MONITOR_TYPE } from '@/hooks/useShellPrecisionConfig';
import { ChartAttr, ChartNode, ChartObject, ChartObjectData, CompTypeEnum, EquipmentData, ObjTypeEnum, SubChartObject } from '../types';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { listObjectsByTackValueLogic } from '@/apis/common';
import { SUCCESSCODE } from '@/utils/globalVariables';
import switchOpen from '@/assets/images/operateMonitoring/switch-open.png';
import switchClose from '@/assets/images/operateMonitoring/switch-close.png';
import switchNoData from '@/assets/images/operateMonitoring/switch-nodata.png';
import switchNoIot from '@/assets/images/operateMonitoring/switch-no-iot.png';
import { ChartEmit, ChartEvent } from '../types/emits';
import { ChartProps } from '../types/props';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
export const setRunningMonitorType = (runningMonitorType: string) => {
    if (isEdge()) return;
    baseStore().setHeaderConfig({ runningMonitorType: runningMonitorType });
    // 仅空调冷热源需要查询壳配置控制「更新时间」显隐（SystemAndControl 亦被生活给水等模块复用）
    if (runningMonitorType === ACAI_RUNNING_MONITOR_TYPE) {
        useShellPrecisionConfig().fetchShellPrecisionConfig();
    }
};
export default (props: ChartProps, emits: ChartEmit) => {
    const { cancelToken, cancelQuest } = UseCancelTokenHooks();

    const { getIotData, setAbnormalEventStrategy, AbnormalEventStrategy, setObject2RelatedObject, clearOneObjectInfo } = DockSingleton.getInstance();
    const { loadBatchQueryInfoCodeIotHandling } = dataDockHandling();
    const relationChartComponent = ref<any>(null);

    const equipmentNodeVosList = ref();

    const triggerClose = () => {
        relationChartComponent?.value?.removeChoose?.();
    };
    let controller: AbortController | null = null,
        curChartClassCodeEquipIdsMap: any = null;

    // -----------------------------1.获取当前图数据---------------------------------
    // 当前图数据
    const chartAttr = ref<ChartAttr>();
    const curSubGraphInfo = ref();

    const currentGraphInfo = computed(() => {
        return curSubGraphInfo.value || props?.currentSystem;
    });

    useWatchWithCleanup(
        () => currentGraphInfo.value,
        () => {
            if (!currentGraphInfo?.value) {
                chartAttr.value = undefined;
                return;
            }

            if (props?.currentSystem?.diagramBaseObject === 'project') {
                chartAttr.value = {
                    systemObjectId: baseStore().projectId,
                    classCode: 'project',
                    graphTypeCode: currentGraphInfo.value.graphTypeCode
                };
            } else {
                chartAttr.value = {
                    systemObjectId: currentGraphInfo.value.systemId,
                    classCode: currentGraphInfo.value.classCode,
                    graphTypeCode: currentGraphInfo.value.graphTypeCode
                };
            }
        },
        {
            immediate: true
        }
    );
    // -----------------------------1.获取当前图数据end---------------------------------

    // ----------------------------2.处理图数据加载完成后的逻辑-----------------------

    const equipGroupInfo = ref();
    const switchLegendData = ref();
    const pipelineLegendData = ref<Array<{ name: string; color: string | number }>>([]);
    const allSwitchData = [
        {
            id: 'noIot',
            name: i18n.global.t('meos_control_web.no_iot_status'),
            imgSrc: switchNoIot
        },
        {
            id: 'statusOpen',
            name: i18n.global.t('common.status_open'),
            imgSrc: switchOpen
        },
        {
            id: 'statusClose',
            name: i18n.global.t('common.status_close'),
            imgSrc: switchClose
        },
        {
            id: 'noData',
            name: i18n.global.t('meos_control_web.no_data1'),
            imgSrc: switchNoData
        }
    ];
    const omitNoIotSwitchData = allSwitchData.filter(item => item.id !== 'noIot');

    const getEquipOpenCloseStatus = ({
        equipId,
        filterStatus,
        parentId,
        parentFilterStatus,
        classCode
    }: {
        equipId: string;
        filterStatus?: string;
        parentId: string;
        parentFilterStatus?: string;
        classCode: string;
    }) => {
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
    const computeLegendsShow = (obj: { data: ChartObjectData; classCodeEquipIdsMap: Record<string, string[]> }) => {
        const { data, classCodeEquipIdsMap } = obj;
        const openCloseStatusSet = new Set();
        const allEquipIds = Object.values(classCodeEquipIdsMap)?.flat() || [];
        const allEquipNodes =
            data?.equipmentNodeVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus, dataObject: v?.dataObject };
            }) || [];
        const allGroupNodes =
            data?.groupVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus, dataObject: v?.dataObject };
            }) || [];
        const allPassByNodes =
            data?.passByVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus, dataObject: v?.dataObject };
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
                    classCode: classCode || ''
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
    };
    /**
     * 获取IoTs数据函数
     * @param idMapInfoCodes - ID映射信息码对象，键为ID，值为信息码数组
     * @param classCodeEquipIdsMap - 类别码设备ID映射对象，键为类别码，值为设备ID数组
     */
    const getIotsData = (idMapInfoCodes: Record<string, string[]>, classCodeEquipIdsMap: Record<string, string[]>) => {
        // 取消之前的请求并创建新的控制器
        controller?.abort();
        controller = new AbortController();

        // 构建对象列表，包含objectId、infoCodes和classCode信息
        const objectList: Array<{ objectId: string; infoCodes: string[]; classCode: string }> = [];
        for (const classCode in classCodeEquipIdsMap) {
            const ids = classCodeEquipIdsMap[classCode];
            if (ids) {
                for (const id of ids) {
                    const infoCodes = idMapInfoCodes[id];
                    if (infoCodes) {
                        objectList.push({
                            objectId: id,
                            infoCodes,
                            classCode
                        });
                    }
                }
            }
        }

        // 构造请求参数并调用批量查询接口
        const params = {
            object: objectList,
            queryInfoCodeRule: true,
            queryInfoCodeDefine: true
        };
        loadBatchQueryInfoCodeIotHandling(params, null, controller.signal);
    };
    /**
     * @description 获取设备组关联设备信息
     * @param ids 设备组ID列表
     * @param classCodeEquipIdsMap 类别码设备ID映射
     * @param equipGroupIdMap 设备组ID映射对象
     */
    const queryEquipsRelGroup = async (ids: string[], classCodeEquipIdsMap: Record<string, string[]>) => {
        cancelQuest();
        const params = {
            runningMonitorType: props.runningMonitorType,
            takeValueLogic: {
                queryParam: {
                    relationTo: {
                        graphCode: 'CombineSubset',
                        relCode: 'Eg2Eq',
                        objFrom: ids
                    },
                    withColumns: ['id', 'localName', 'classCode', 'relObjIds']
                }
            }
        };
        try {
            const res: any = await listObjectsByTackValueLogic(params, { cancelToken: cancelToken() });

            if (res.code === SUCCESSCODE && res.data) {
                const groupIdMapEquips: Record<string, any[]> = {};
                // 处理返回的数据，将设备添加到classCodeEquipIdsMap
                res.data.forEach((obj: any) => {
                    const { classCode } = obj;
                    if (!classCodeEquipIdsMap[classCode]) {
                        classCodeEquipIdsMap[classCode] = [];
                    }
                    classCodeEquipIdsMap[classCode].push(obj.id);
                    obj.relObjIds?.forEach((id: string) => {
                        if (!groupIdMapEquips[id]) {
                            groupIdMapEquips[id] = [];
                        }
                        groupIdMapEquips[id].push(obj);
                        // 建立关系
                        setObject2RelatedObject(id, obj.id);
                    });
                });
                equipGroupInfo.value = groupIdMapEquips;
            }
        } catch (error) {
            console.log('获取设备组数据失败：', error);
        }
    };
    /**
     * @description 2.加载完成后回调
     * @param chartObj
     */
    const afterLoadChart = async (chartObj: ChartObject) => {
        const { data, idMapInfoCodes, classCodeEquipIdsMap, renderDomList, legendData } = chartObj;

        // 1.计算图例显示状态
        computeLegendsShow({ data, classCodeEquipIdsMap });

        if (idMapInfoCodes) {
            Object.values(idMapInfoCodes)?.forEach(infoCodes => {
                infoCodes?.push('rcRunStatus');
            });
        }

        // 设置图例数据
        pipelineLegendData.value = legendData.map(it => {
            return {
                name: it.lineNames[0],
                color: it.style.backgroundColor
            };
        });
        equipmentNodeVosList.value = data?.equipmentNodeVos || [];
        // 2.获取设备组的信息点数据
        const equipGroups = renderDomList?.filter(obj => obj.dataObject?.objType === ObjTypeEnum.EQUIP_GROUP);
        const equipGroupIds = equipGroups?.map(obj => obj.dataObjectId);

        equipGroupIds?.length && (await queryEquipsRelGroup(equipGroupIds, classCodeEquipIdsMap));
        // 返回objectIdAndInfoCodes映射
        emits(ChartEvent.ObjectIdAndInfoCodes, idMapInfoCodes);
        // 3.获取设备、系统的信息点数据
        data?.equipmentNodeVos?.forEach(node => {
            // 打包节点把打包下设备也加进去
            if (node.compType === CompTypeEnum.PACK_NODE) {
                node.dataObject?.items?.forEach(obj => {
                    if (!classCodeEquipIdsMap[obj.classCode]) {
                        classCodeEquipIdsMap[obj.classCode] = [];
                    }
                    classCodeEquipIdsMap[obj.classCode].push(obj.id);
                });
            }
        });
        curChartClassCodeEquipIdsMap = classCodeEquipIdsMap;
        // 返回classCodeEquipIdsMap映射
        emits(ChartEvent.ClassCodeEquipIdsMap, classCodeEquipIdsMap);
        getIotsData(structuredClone(idMapInfoCodes), structuredClone(classCodeEquipIdsMap));
        nextTick(() => {
            relationChartComponent?.value?.updateAbnormalData?.();
        });
    };

    // ----------------------------2.处理图数据加载完成后的逻辑end-----------------------
    const enableHoverGroup = (obj: ChartNode) => {
        if (props.enableHoverGroup) {
            return props.enableHoverGroup?.(obj, currentGraphInfo.value);
        }
        // 打包设备可hover
        if (obj?.compType === CompTypeEnum.PACK_NODE) {
            return obj.dataObject?.items;
        }
        return false;
    };
    // ----------------------------3.其它交互逻辑end------------------------------------
    /**
     * 点击节点处理函数
     * @param data 节点数据对象
     */
    const clickNode = (data: EquipmentData, modalData: any) => {
        // 构造传递给设备打开事件的数据，包含节点数据和图表属性中的系统对象ID及类编码
        const postData = {
            ...data,
            systemObjectId: chartAttr.value?.systemObjectId,
            systemClassCode: chartAttr.value?.classCode
        };
        if (props.beforeClickNode) {
            props.beforeClickNode(postData, modalData, () => {
                emits(ChartEvent.OpenEquipment, postData);
            });
        } else {
            emits(ChartEvent.OpenEquipment, postData);
        }
    };

    const clearClickNode = () => {
        emits(ChartEvent.CloseEquipment, false);
    };
    const beforeLoadChart = () => {
        emits(ChartEvent.CloseEquipment);
    };

    /**
     * 下转子关系图
     * @param data
     */
    const switchRelationChart = (data: SubChartObject) => {
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
    const shouldHadSubGraph = (nodeInfo: any) => {
        if (props.shouldHadSubGraph) {
            return props.shouldHadSubGraph(nodeInfo, currentGraphInfo.value);
        }
        return false;
    };
    useWatchWithCleanup(
        () => props?.abnormalEventList,
        () => {
            relationChartComponent?.value?.updateAbnormalData?.();
        }
    );
    onMounted(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Related);
        emitter.on('monitorCloseEquipmentiInfo', triggerClose);
    });

    onUnmounted(() => {
        controller?.abort();
        controller = null;
        emitter.off('monitorCloseEquipmentiInfo', triggerClose);
    });
    onBeforeUnmount(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Single);
    });
    return {
        relationChartComponent,
        chartAttr,
        equipGroupInfo,
        switchLegendData,
        pipelineLegendData,
        curSubGraphInfo,
        clickNode,
        clearClickNode,
        beforeLoadChart,
        afterLoadChart,
        enableHoverGroup,
        triggerClose,
        switchRelationChart,
        shouldHadSubGraph
    };
};
