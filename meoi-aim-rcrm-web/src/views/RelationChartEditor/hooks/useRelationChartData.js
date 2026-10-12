import { ref, watch, provide, computed } from 'vue';
import { listSystemGraphDuplicate, initSystemGraph, recalculatePipeline } from '@/api/RelationChartEditor';
import useLoading from '@/hooks/useLoading';
import {
    initOriginChartFunKey,
    recalculatePipelineFunKey,
    legendScaleRatioKey,
    copyGraphTypeListKey
} from '@/utils/injectionKey';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useErrorMessage } from '@/utils';

export default (currentTemplateObject, graphId, graphHeaderData, chartEditCom) => {
    const copyGraphTypeList = ref([]);
    const tabList = ref([]);
    const legendScaleRatio = ref(1);
    const loadTextOptions = ref({
        text: '',
        style: {}
    });

    const defaultChartData = computed(() => {
        return tabList.value?.find(item => item.graphType === 0) || {};
    });
    const {
        loading: relationChartLoading,
        openLoading,
        closeLoading
    } = useLoading('relation-chart-editor-container', '#F1F4F6', 'ball', loadTextOptions);

    const setTabList = (data, status) => {
        tabList.value = data.map(da => {
            da.slotName = 'tabContent';
            da.isShowEdit = false;
            return da;
        });
        if (tabList.value.length) {
            const isRelease = tabList?.value.filter(f => f?.status === 1);
            const isGraphType = tabList?.value.filter(f => f?.graphType === 0);
            if (isRelease?.length && status) {
                graphHeaderData.value = isRelease[0];
                graphId.value = isRelease[0]?.id;
            } else if (isGraphType?.length) {
                graphHeaderData.value = isGraphType[0];
                graphId.value = isGraphType[0]?.id;
            } else {
                graphHeaderData.value = tabList.value[0];
                graphId.value = tabList.value[0]?.id;
            }
        }
    };

    // 获取副本列表
    const getGraphDuplicateList = async () => {
        if (!currentTemplateObject.value?.code || !currentTemplateObject.value?.systemGraphCode) {
            return;
        }

        clearData();
        try {
            openLoading();
            const res = await listSystemGraphDuplicate(
                {
                    systemObjectId: currentTemplateObject.value.code,
                    graphTypeCode: currentTemplateObject.value.systemGraphCode
                },
                'listSystemGraphDuplicate'
            );
            if (res.result === 'success') {
                // 定位到已发布图纸
                setTabList(res.data, 'init');
                copyGraphTypeList.value = res.data?.filter(item => item.graphType === 1);
            }
        } catch (e) {
            tabList.value = [];
            closeLoading();
        } finally {
            closeLoading();
        }
    };
    const clearData = () => {
        loadTextOptions.value = {
            text: '',
            style: {}
        };
        tabList.value = null;
        graphId.value = '';
        graphHeaderData.value = {};
    };

    const handleChangeTab = val => {
        graphId.value = val?.id;
        graphHeaderData.value = val;
    };

    const updateAllNode = node => {
        if (node.children?.length) {
            node.children.forEach(item => {
                updateAllNode(item);
            });
            node.updateFlag = node.children.some(item => {
                return item.updateFlag;
            });
        }
    };

    const updateTemplateTree = () => {
        currentTemplateObject.value.updateFlag = false;
        let root = currentTemplateObject.value.parent;
        while (root.parent) {
            root = root.parent;
        }
        updateAllNode(root);
    };

    const initOriginChart = async () => {
        try {
            loadTextOptions.value = {
                text: '图纸获取中，过程可能超过1分钟，请耐心等候...',
                style: {
                    color: '#626C78'
                }
            };
            openLoading();

            const res = await initSystemGraph({
                referenceObjectId: currentTemplateObject.value.code,
                graphTypeCode: currentTemplateObject.value.systemGraphCode
            });
            if (res.result === 'success') {
                // 定位到需要更新的原始图纸
                setTabList(res.data);
                updateTemplateTree();
            } else {
                useErrorMessage('获取失败，请重新操作');
            }
        } catch (e) {
            console.error(e);
            closeLoading();
        } finally {
            closeLoading();
        }
    };

    /**
     * 
     *  参数示列
     * 
     *  {
        "referenceObjectId": "Sy99099900071567042985003003906",
        "graphTypeCode": "供水关系图",
        "generateId": "fd648e65-5187-41e2-818f-2070b466af84",
        "fontSize": 20,
        "parent2ObjectId2SortValue": {
            "d907daf0-536f-11ee-bfa9-a5e2613d0e21": {
                "Eq9909990007efefc1381ce349e087a6f5b08fa15cab": 0,
                "Eq9909990007580dc9ec41974513bc443ac30d4407ae": 1,
                "Eq990999000781f307441bdd435a955b48b2de31878a": 2,
                "Eq99099900072757bdee318f4ec188aa0787e5230c92": 3,
                "Eq9909990007b972c97751534ce49156f4747467b2f9": 4
            }
        },
        "equipmentGroupDetails": {
            "d907daf0-536f-11ee-bfa9-a5e2613d0e21": {
                "textMapSize": {
                    "localName": 500
                }
            }
        }
    }} 
     */

    const recalculatePipelineFun = async (data, id, callback) => {
        const postData = {
            duplicateId: graphId.value,
            referenceObjectId: graphHeaderData.value.systemObjectId,
            graphTypeCode: graphHeaderData.value.graphTypeCode,
            generateId: defaultChartData.value.generateId,
            ...data
        };
        console.log('postData>>>>', postData, graphHeaderData.value.id);
        const res = await recalculatePipeline(id, postData);
        if (res.code === SUCCESSCODE) {
            callback?.();
            console.log(chartEditCom.value);
            chartEditCom.value?.loadChartData();
        } else {
            useErrorMessage(res.message);
        }
    };

    watch(
        currentTemplateObject,
        () => {
            closeLoading();
            if (!currentTemplateObject.value) return;
            getGraphDuplicateList();
        },
        {
            immediate: true
        }
    );

    provide(initOriginChartFunKey, initOriginChart);
    provide(recalculatePipelineFunKey, recalculatePipelineFun);
    provide(legendScaleRatioKey, legendScaleRatio);
    provide(copyGraphTypeListKey, copyGraphTypeList);

    return {
        relationChartLoading,
        tabList,
        getGraphDuplicateList,
        handleChangeTab,
        initOriginChart
    };
};
