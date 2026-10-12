import { PERSPECTIVE_DICT, GRAPH_TYPE_DICT } from '@/views/test/RelationChartMemoryTest/constants';
import { getMenuConfig } from '@/apis/monitor';
import { MLoading } from 'meri-plus';
import { useRoute } from 'vue-router';
import { nanoid } from 'nanoid';
import { setRunningMonitorType } from '@/views/test/RelationChartMemoryTest/use-utils';

export const currentSceneIdsInjectKey = Symbol('currentSceneIdsInjectKey');

export default () => {
    const relationChartComponent = ref(null);
    const equipmentNodeVosList = ref([]);
    const systemId = ref(''); // 系统id
    const systemList = ref([]); // 系统列表
    const selectedSystemObj = ref({}); // 被选中的系统对象 { systemId: ‘xxxx’,classCode: 'xxx', graphTypeCode: 'xxx'}
    const perspectiveType = ref(PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE); // 视角类型
    const curGraphType = ref(GRAPH_TYPE_DICT.SYSTEM_GRAPH); // 当前图类型
    const modelDefatlGraph = ref(GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH); // 模型视角默认类型
    const modelCurFloorId = ref(); // 模型视角当前楼层id
    const currentBuildingObj = ref({}); // 当前选中的建筑对象
    const modelInstanceData = ref(); // 模型视角实例数据
    const abnormalListData = ref([]); // 异常事件列表
    const loadingService = ref();
    const noRelationChartData = ref(true);
    const currentMenuCode = ref('');
    const route = useRoute();

    const currentSceneIds = ref({}); // 当前场景的ids
    provide(currentSceneIdsInjectKey, currentSceneIds);

    const majorCode = computed(() => {
        return 'AC';
    });

    const getSystemList = () => {
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
                    const { sysName, graphTypeCode } = route.query;
                    const graph =
                        systemList.value.find(item => {
                            if (sysName) {
                                return !item.isGroup && item.localName === decodeURIComponent(sysName) && item.graphTypeCode === decodeURIComponent(graphTypeCode);
                            } else {
                                return !item.isGroup;
                            }
                        }) || {};
                    setRunningMonitorType(graph.classCode);
                    systemId.value = graph?.systemId;
                    selectedSystemObj.value = graph;
                }
            })
            .finally(() => {
                loadingService.value?.destroy();
            });
    };

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

    watch(majorCode, () => {
        getSystemList();
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
    provide('currentBuildingObj', currentBuildingObj);
    provide('modelInstanceData', modelInstanceData);
    provide('abnormalListData', abnormalListData);
    provide('noRelationChartData', noRelationChartData);
    provide('majorCode', majorCode);
    provide('equipmentNodeVosList', equipmentNodeVosList);

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
        currentSceneIds
    };
};
