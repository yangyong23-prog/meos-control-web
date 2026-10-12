import i18n from '@/localization';
import { PERSPECTIVE_DICT, GRAPH_TYPE_DICT } from '@/views/ACoperationMonitoring/constants';
import { getMenuConfig, queryModelInstancesBySystemId } from '@/apis/monitor';
import { MLoading } from 'meri-plus';
import { useRoute } from 'vue-router';
import { nanoid } from 'nanoid';
import baseStore from '@/store/baseStore';
import iotExpireManager from '@/utils/iotExpireManager';
import { setRunningMonitorType } from '@/views/ACoperationMonitoring/use-utils';
import { batchQueryInfoCodeConfig } from '@/apis/monitor';
import DockSingleton from '@/hooks/responsiveDock';
import * as _ from 'lodash';
import { isPipe } from '@/views/GraphMVC/utils/classCodeJudge';

export const currentSceneIdsInjectKey = Symbol('currentSceneIdsInjectKey');
export const sysChartClassCodeEquipIdMapKey = Symbol('sysChartClassCodeEquipIdMapKey');
export const generalZoneIdsKey = Symbol('generalZoneIdsKey');
export const isAbnormalIdsAllLoadedKey = Symbol('isAbnormalIdsAllLoadedKey');

// 合并对象，格式为：{[classCode]:[...ids]}
const mergeClassCodeEquipIds = (mapA = {}, mapB = {}, mapC = {}) => {
    return _.mergeWith({ ...mapA }, { ...mapB }, { ...mapC }, (objValue, srcValue) => {
        if (_.isArray(objValue)) {
            return [...new Set([...objValue, ...srcValue])];
        }
    });
};

export default () => {
    const { setIotData, getIotData } = DockSingleton.getInstance();
    const relationChartComponent = ref(null);
    const equipmentNodeVosList = ref([]);
    const systemId = ref(''); // 系统id
    const systemList = ref([]); // 系统列表
    const selectedSystemObj = ref({}); // 被选中的系统对象 { systemId: ‘xxxx’,classCode: 'xxx', graphTypeCode: 'xxx'}
    const perspectiveType = ref(PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE); // 视角类型
    const curGraphType = ref(GRAPH_TYPE_DICT.SYSTEM_GRAPH); // 当前图类型
    const modelDefatlGraph = ref(GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH); // 模型视角默认类型
    const modelCurFloorId = ref(); // 模型视角当前楼层id
    const curEnterSpace = ref(null);
    const space3dSelectData = ref(null);
    const space3dAllData = ref(null);
    const currentBuildingObj = ref({}); // 当前选中的建筑对象
    const modelInstanceData = ref(); // 模型视角实例数据
    const abnormalListData = ref([]); // 异常事件列表
    const loadingService = ref();
    const noRelationChartData = ref(true);
    const currentMenuCode = ref('');
    const route = useRoute();
    const modelClassCodeEquipIdMap = ref({});
    const generalZoneIds = ref({});
    // 系统图设备类对应id数据
    const sysChartClassCodeEquipIdMap = ref({});
    const isAbnormalIdsAllLoaded = reactive({
        model: false,
        system: false
    });
    const isLoadEmpty = ref(false);

    const currentSceneIds = ref({}); // 当前场景的ids
    provide(currentSceneIdsInjectKey, currentSceneIds);

    const majorCode = computed(() => {
        return route.params.majorCode;
    });

    function getSystemList() {
        if (majorCode.value === currentMenuCode.value) return;
        currentMenuCode.value = majorCode.value;
        loadingService.value = MLoading.service({
            target: '.operation-monitoring-wrap',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
        getMenuConfig({
            menuCode: currentMenuCode.value
        })
            .then(res => {
                if (res.code === '00000') {
                    systemList.value = parseSystemList(res.data);
                    const { sysName, graphTypeCode, sourceClassCode, systemObjectId } = route.query;
                    const graph = systemList.value.find(item => {
                        if (sysName) {
                            return !item.isGroup && item.localName === decodeURIComponent(sysName) && item.graphTypeCode === decodeURIComponent(graphTypeCode);
                        } else {
                            return !item.isGroup;
                        }
                    }) || {
                        classCode: sourceClassCode || '',
                        graphTypeCode: graphTypeCode ? decodeURIComponent(graphTypeCode) : '',
                        localName: sysName ? decodeURIComponent(sysName) : '',
                        systemId: systemObjectId || ''
                    };
                    setRunningMonitorType(graph.classCode);
                    systemId.value = graph?.systemId;
                    selectedSystemObj.value = graph;

                    isLoadEmpty.value = !res?.data?.length;
                }
            })
            .finally(() => {
                loadingService.value?.destroy();
            });
    }

    const parseSystemList = treeData => {
        if (Array.isArray(treeData) && treeData.length > 0 && Array.isArray(treeData?.[0].children)) {
            let result = [];

            (treeData[0].children || []).forEach(outer => {
                const outerData = {
                    isGroup: true,
                    key: nanoid(),
                    ...outer
                };
                result.push(outerData);
                (outer?.children || []).forEach(inner => {
                    result.push({
                        isGroup: false,
                        key: nanoid(),
                        parent: outerData,
                        ...inner
                    });
                });
            });
            return result;
        }
        return [];
    };

    let batchQueryInfoCodeController = null,
        sysViewBatchQueryController = null,
        abortControler = null;

    const makeModelClassIds = equipments => {
        // 写入id
        const classCodeEquipIdMap = {};
        equipments?.forEach(eq => {
            const { classCode, id } = eq;
            if (!classCodeEquipIdMap[classCode]) {
                classCodeEquipIdMap[classCode] = [];
            }
            classCodeEquipIdMap[classCode].push(id);
        });
        // 清理 modelClassCodeEquipIdMap时机？
        modelClassCodeEquipIdMap.value = mergeClassCodeEquipIds(classCodeEquipIdMap, modelClassCodeEquipIdMap.value);
        isAbnormalIdsAllLoaded.model = true;
    };
    const getModelIotData = async ({ equipments = [] }) => {
        batchQueryInfoCodeController?.abort();
        batchQueryInfoCodeController = new AbortController();
        const objects = equipments.map(equip => {
            return {
                objectId: equip.id,
                infoCodes: [
                    'runStatus', // 开启关闭
                    'onlineStatus', // 在线离线
                    'orderFailAlarm' // 控返不一致
                ]
            };
        });

        if (objects.length === 0) return;
        let params;
        if (selectedSystemObj.value.diagramBaseObject === 'project') {
            params = {
                systemId: baseStore().projectId,
                projectId: baseStore().projectId,
                systemClassCode: 'project'
            };
        } else if (selectedSystemObj.value.classCode) {
            params = {
                projectId: baseStore().projectId,
                systemId: selectedSystemObj.value.systemId,
                systemClassCode: selectedSystemObj.value.classCode
            };
        }

        params.object = objects;
        const { code, data } = await batchQueryInfoCodeConfig(params, batchQueryInfoCodeController.signal);
        if (code === '00000') {
            Object.keys(data).forEach(equipId => {
                const iots = data[equipId];
                iots.forEach(iot => {
                    setIotData(equipId, iot.infoCode, iot);
                });
            });
        }
    };
    // 获取系统图iot数据（除系统图上自带的信息点之外的：rcRunStatus）
    const getSysViewIotData = async (ids = []) => {
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

        if (objects.length === 0) return;
        let params;
        if (selectedSystemObj.value.diagramBaseObject === 'project') {
            params = {
                systemId: baseStore().projectId,
                projectId: baseStore().projectId,
                systemClassCode: 'project'
            };
        } else if (selectedSystemObj.value.classCode) {
            params = {
                projectId: baseStore().projectId,
                systemId: selectedSystemObj.value.systemId,
                systemClassCode: selectedSystemObj.value.classCode
            };
        }

        params.object = objects;
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

    watch(
        selectedSystemObj,
        newVal => {
            if (newVal) {
                let params;
                if (selectedSystemObj.value.diagramBaseObject === 'project') {
                    params = {
                        systemId: baseStore().projectId,
                        projectId: baseStore().projectId,
                        systemClassCode: 'project',
                        graphTypeCode: selectedSystemObj.value.graphTypeCode
                    };
                } else if (newVal.classCode) {
                    params = {
                        projectId: baseStore().projectId,
                        systemId: selectedSystemObj.value.systemId,
                        systemClassCode: selectedSystemObj.value.classCode,
                        graphTypeCode: selectedSystemObj.value.graphTypeCode
                    };
                }

                // 清理掉管理的iot数据
                iotExpireManager.clear();

                if (!params) {
                    modelInstanceData.value = null;
                    return;
                }

                modelClassCodeEquipIdMap.value = {};
                abortControler?.abort();
                abortControler = new AbortController();
                queryModelInstancesBySystemId(params, abortControler.signal).then(res => {
                    if (res.code === '00000') {
                        modelInstanceData.value = res.data;
                        getModelIotData(modelInstanceData.value);
                        makeModelClassIds(modelInstanceData.value?.equipments);
                    }
                });
            }
        },
        { immediate: true }
    );

    watch(majorCode, () => {
        getSystemList();
    });

    watch(sysChartClassCodeEquipIdMap, () => {
        let idSet = new Set();
        if (!_.isEmpty(sysChartClassCodeEquipIdMap.value)) {
            Object.entries(sysChartClassCodeEquipIdMap.value)?.forEach(([classCode, ids]) => {
                ids.forEach(id => idSet.add(id));
            });
        }
        if (idSet.size > 0) {
            getSysViewIotData([...idSet]);
        }
    });
    watch(space3dAllData, () => {
        const classCodeEquipIdMap = {};
        space3dAllData.value?.forEach(eq => {
            const { classCode, id } = eq;
            // 排除管道不查询信息点和异常事件
            if (isPipe(classCode)) {
                return;
            }
            if (!classCodeEquipIdMap[classCode]) {
                classCodeEquipIdMap[classCode] = [];
            }
            classCodeEquipIdMap[classCode].push(id);
        });

        modelClassCodeEquipIdMap.value = mergeClassCodeEquipIds(classCodeEquipIdMap, modelClassCodeEquipIdMap.value);
        let equipmentIds = Object.values(classCodeEquipIdMap).flatMap(a => a);
        getModelIotData({ equipments: equipmentIds.map(id => ({ id })) });
    });
    watch([perspectiveType], () => {
        if (perspectiveType.value === PERSPECTIVE_DICT.MODEL_PERSPECTIVE) {
            getModelIotData(modelInstanceData.value);
            // currentSceneIds.value = modelClassCodeEquipIdMap.value;
        }
    });
    watchEffect(() => {
        console.log('watchEffect:---===== ');
        const originObj = mergeClassCodeEquipIds(sysChartClassCodeEquipIdMap.value, modelClassCodeEquipIdMap.value, generalZoneIds.value);
        const curSelectId = selectedSystemObj.value?.systemId;
        if (curSelectId && Object.keys(originObj).length) {
            const hasSystemId = Object.values(originObj || {}).includes(curSelectId);
            if (hasSystemId) {
                currentSceneIds.value = originObj;
            } else {
                // 老系统图增加系统实例的异常事件请求：https://shimo.im/docs/m5kvdmaz8Ph4083X
                const finalObj = { ...originObj, [selectedSystemObj.value.classCode]: [curSelectId] };
                currentSceneIds.value = finalObj;
            }
        } else {
            currentSceneIds.value = originObj;
        }
    });
    // 当前视角对象ID
    const curPerspectiveObjIds = computed(() => {
        const idSet = new Set();
        const classCodeIdMap = perspectiveType.value === PERSPECTIVE_DICT.MODEL_PERSPECTIVE ? modelClassCodeEquipIdMap.value : sysChartClassCodeEquipIdMap.value;
        Object.values(classCodeIdMap).forEach(val => {
            val?.forEach(id => {
                idSet.add(id);
            });
        });
        // 老系统图增加系统实例的异常事件请求：https://shimo.im/docs/m5kvdmaz8Ph4083X
        if (systemId.value) {
            idSet.add(systemId.value);
        }
        return [...idSet];
    });

    onMounted(() => {
        getSystemList();
    });

    provide('relationChartComponent', relationChartComponent);
    provide('systemId', systemId);
    provide('selectedSystemObj', selectedSystemObj);
    provide('perspectiveType', perspectiveType);
    provide('curGraphType', curGraphType);
    provide('systemList', systemList);
    provide('modelDefatlGraph', modelDefatlGraph);
    provide('modelCurFloorId', modelCurFloorId);
    provide('curEnterSpaceKey', curEnterSpace);
    provide('space3dSelectDataKey', space3dSelectData);
    provide('space3dAllDataKey', space3dAllData);
    provide('currentBuildingObj', currentBuildingObj);
    provide('modelInstanceData', modelInstanceData);
    provide('abnormalListData', abnormalListData);
    provide('noRelationChartData', noRelationChartData);
    provide('majorCode', majorCode);
    provide('equipmentNodeVosList', equipmentNodeVosList);
    provide(sysChartClassCodeEquipIdMapKey, sysChartClassCodeEquipIdMap);
    provide(generalZoneIdsKey, generalZoneIds);
    provide(isAbnormalIdsAllLoadedKey, isAbnormalIdsAllLoaded);

    onUnmounted(() => {
        relationChartComponent.value = null;
        systemId.value = null;
        selectedSystemObj.value = null;
        systemList.value = null;
        perspectiveType.value = null;
        curGraphType.value = null;
        modelDefatlGraph.value = null;
        modelCurFloorId.value = null;
        currentBuildingObj.value = null;
        modelInstanceData.value = null;
        abnormalListData.value = null;
        noRelationChartData.value = null;
        majorCode.value = null;
        equipmentNodeVosList.value = null;
    });

    return {
        relationChartComponent,
        systemId,
        selectedSystemObj,
        systemList,
        perspectiveType,
        curGraphType,
        noRelationChartData,
        majorCode,
        currentSceneIds,
        curPerspectiveObjIds,
        isAbnormalIdsAllLoaded,
        isLoadEmpty
    };
};
