import i18n from '@/localization';
import useLoading from '@/hooks/useLoading';
import { getListSystems, getTreeEquipments, listInfoCodeConfigsByObject } from '@/apis/MonitoringWE';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { RELATION_VIEW, SUCCESSCODE } from '@/utils/globalVariables';
import { findIdsByTree, makeClassIds, pruneTreeByTargetNode, addOnTreeTags } from '../utils/index';
import { RUNNING_MONITOR_TYPE } from '../constant/index';
import baseStore from '@/store/baseStore';
import dataDockHandling from '@/hooks/dataDockHandling';
import DockSingleton from '@/hooks/responsiveDock';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';

export const monitoringGlobalLoadingKey = Symbol('monitoringGlobalLoadingKey'); // 全局loading
export const monitoringMainLoadingKey = Symbol('monitoringMainLoadingKey'); // 左侧局部loading
export const abnormalEventListKey = Symbol('abnormalEventListKey'); // 异常事件列表
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); // 异常事件列表加载状态
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); // 异常事件列表更新时间
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey'); // 异常事件列表加载完时间
export const noRelationChartDataKey = Symbol('noRelationChartDataKey`'); // 异常事件列表无数据
export const systemListKey = Symbol('systemListKey`'); // 系统列表数据
export const curSystemItemKey = Symbol('curSystemItemKey`'); // 当前选择的系统
export const searchDataListKey = Symbol('searchDataListKey`'); // 搜索下拉框列表数据
export const claasCode2objectIdsKey = Symbol('claasCode2objectIdsKey`'); // 要订阅的图数据（{classCode:ids}）
export const pruneTreeByNodeIdKey = Symbol('pruneTreeByNodeIdKey`'); // 根据节点剪枝
export const equipDyncInfoListKey = Symbol('equipDyncInfoListKey`'); // 图设备动态数据{id,tags}
export const staticTreeDataKey = Symbol('staticTreeData`');
export const showModuleInfoInjectKey = Symbol('showModuleInfoInjectKey');
export const selectModuleInfoInjectKey = Symbol('selectModuleInfoInjectKey'); // 当前选中对象
export const curHoverInfoKey = Symbol('curHoverInfoKey'); //当前hover信息
export const graphUpdatingKey = Symbol('graphUpdatingKey'); //图渲染过程中

export default () => {
    const { openLoading, closeLoading } = useLoading('monitoring-we-warp', '#F1F4F6', 'ball');
    const { loadDynaDataWithIotHandling, writeDataToResponsiveDock } = dataDockHandling();
    const queryStaticTreeToken = UseCancelTokenHooks();
    const queryDyncTreeToken = UseCancelTokenHooks();
    const systemList = ref([]);
    const toggleWidthDivRef = ref(null);
    const unpackShow = ref(true);
    const graphUpdating = ref(true);
    const noRelationChartData = ref(true);
    const monitoringGlobalLoading = ref(true);
    const monitoringMainLoading = ref(false);
    const store = useStore();
    const { projectId } = store.base;
    const curSystemItem = ref();
    const staticTreeEquipIds = ref([]);
    const staticTreeData = ref({});
    const claasCode2objectIds = ref({});
    const curHoverInfo = ref({});
    const selectModuleInfo = ref(null);
    const abnormalTargetObjIds = ref([]);
    const statusCodes = ref([]);
    let idMapEquip = {};
    const { getIotData, getObjectAbnormalStatus } = DockSingleton.getInstance();

    const resetTreeData = () => {
        staticTreeEquipIds.value = [];
        staticTreeData.value = {};
        claasCode2objectIds.value = {};
        idMapEquip = {};
        statusCodes.value = [];
    };
    openLoading();
    getListSystems()
        .then(res => {
            if (res) {
                const { code, data } = res;
                if (code === SUCCESSCODE && data) {
                    systemList.value =
                        data.map(obj => {
                            return {
                                ...obj,
                                id: obj.systemId,
                                name: obj.systemLocalName
                            };
                        }) || [];
                    console.log('data: ', data);
                    if (systemList.value?.length > 0) {
                        curSystemItem.value = systemList.value[0];
                    }
                }
            }
        })
        .finally(() => {
            closeLoading();
        });

    // 树静态数据加载
    watch(curSystemItem, () => {
        // console.log('curSystemItem: ', curSystemItem);
        queryStaticTreeToken.cancelQuest();
        resetTreeData();
        if (curSystemItem.value) {
            openLoading();
            const params = {
                runningMonitorSecondType: curSystemItem.value.runningMonitorSecondType,
                systemId: curSystemItem.value.systemId
            };
            getTreeEquipments(params, { cancelToken: queryStaticTreeToken.cancelToken() })
                .then(res => {
                    if (res) {
                        const { code, data } = res;
                        if (code === SUCCESSCODE && data) {
                            const ids = findIdsByTree(data, idMapEquip);
                            // console.log('getTreeEquipments,data: ', data, ids);
                            staticTreeEquipIds.value = ids;
                            staticTreeData.value = data;
                            claasCode2objectIds.value = makeClassIds(ids, idMapEquip, curSystemItem.value);
                            // 图上设备ID+当前选择的系统ID
                            abnormalTargetObjIds.value = [...ids, curSystemItem.value?.systemId];
                        }
                    }
                })
                .finally(() => {
                    closeLoading();
                });
        }
    });
    // 加载图动态数据
    watch(staticTreeEquipIds, () => {
        queryDyncTreeToken.cancelQuest();
        if (staticTreeEquipIds.value?.length > 0) {
            const params = {
                projectId: baseStore().projectId,
                runningMonitorType: RUNNING_MONITOR_TYPE,
                objectIds: staticTreeEquipIds.value,
                templateCode: RELATION_VIEW
            };
            listInfoCodeConfigsByObject(params, { cancelToken: queryDyncTreeToken.cancelToken() }).then(res => {
                if (res) {
                    const { code, data } = res;
                    if (code === SUCCESSCODE && data) {
                        let maxSizeStatus = statusCodes.value;
                        data?.forEach(item => {
                            const status = item.relInfoCodeGroupConfigs?.find(obj => obj.groupCode === 'equipStatus')?.relInfoCodeConfigs?.map(obj => obj.infoCode);
                            if (status?.length > maxSizeStatus?.length) {
                                maxSizeStatus = status;
                            }
                        });
                        statusCodes.value = maxSizeStatus;

                        writeDataToResponsiveDock(data);
                    }
                }
            });
        }
    });

    const searchDataList = computed(() => {
        return staticTreeEquipIds.value
            ?.map(id => {
                if (idMapEquip) {
                    const n = idMapEquip[id];
                    return { ...n, name: n.localName };
                }
                return false;
            })
            .filter(Boolean);
    });
    const makeIotTag = (tags, id, infoCode) => {
        const info = getIotData(id, infoCode);
        if (info.dataValue !== undefined) {
            tags.push({ code: `${infoCode}-${info.dataValue}` });
        }
    };
    const equipDyncInfoList = computed(() => {
        return staticTreeEquipIds.value?.map(id => {
            const obj = { id, tags: [] };
            statusCodes.value?.forEach(code => {
                if (code === 'alarmeventdetail') {
                    if (getObjectAbnormalStatus(id)) {
                        obj.tags.push({ code: 'alarmstatus-alarmstatus' });
                    }
                } else {
                    makeIotTag(obj.tags, id, code);
                }
            });

            if (idMapEquip[id]) {
                idMapEquip[id].tags = obj.tags;
            }

            return obj;
        });
    });

    const pruneTreeByNodeId = targetId => {
        const newTree = pruneTreeByTargetNode(structuredClone(toRaw(staticTreeData.value)), targetId);
        addOnTreeTags(newTree, idMapEquip);
        return newTree;
    };

    getListTreeBuildingFloorSpace({
        projectId,
        isQuerySpace: false
    }).then(res => {
        const { data, code } = res;
        if (code === '00000') {
            xplantindoorenvStore().setBuildingData(data);
        }
    });

    provide(monitoringGlobalLoadingKey, monitoringGlobalLoading);
    provide(monitoringMainLoadingKey, monitoringMainLoading);

    provide(noRelationChartDataKey, noRelationChartData);
    provide(systemListKey, systemList);
    provide(curSystemItemKey, curSystemItem);
    provide(searchDataListKey, searchDataList);
    provide(claasCode2objectIdsKey, claasCode2objectIds);
    provide(pruneTreeByNodeIdKey, pruneTreeByNodeId);
    provide(equipDyncInfoListKey, equipDyncInfoList);
    provide(staticTreeDataKey, staticTreeData);
    provide(curHoverInfoKey, curHoverInfo);
    provide(selectModuleInfoInjectKey, selectModuleInfo);
    provide(graphUpdatingKey, graphUpdating);

    return {
        toggleWidthDivRef,
        unpackShow,
        monitoringGlobalLoading,
        systemList,
        curSystemItem,
        claasCode2objectIds,
        staticTreeEquipIds,
        abnormalTargetObjIds,
        curHoverInfo,
        selectModuleInfo
    };
};
