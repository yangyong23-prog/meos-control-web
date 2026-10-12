import { Editor } from '@yushu/relation-chart';
import { ref, provide, onUnmounted } from 'vue';
import { OVERALL_LAYOUT } from '@/utils/globalVariables';
import {
    editorKey,
    equipNamesKey,
    graphHeaderDataKey,
    graphIdKey,
    copyCompleteKey,
    infoPointsKey,
    containerBgsPostDataKey,
    isEditDetailsKey,
    globalFontSizeKey,
    currentHeaderItemKey
} from '@/utils/injectionKey';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
    editSystemGraph,
    saveAndUpdateSystemGraphDetailBatch,
    deleteSystemGraphDetail
} from '@/api/RelationChartEditor';
import { useMainStore } from '@/store';
/**
 * 默认导出一个函数，用于初始化和管理编辑器实例及其相关数据。
 *
 * @returns {Object} 返回包含编辑器实例和相关数据的对象。
 */
export default () => {
    const mainStore = useMainStore();
    // 初始化编辑器实例
    const editor = new Editor();
    // 设置编辑器的工作模式为整体布局
    editor.setMode(OVERALL_LAYOUT);
    const currentHeaderItem = ref({});
    // 用于存储信息点数据的响应式变量
    const infoPoints = editor.getInfoPointReactiveData();
    // 用于存储设备名称数据的响应式变量
    const equipNames = editor.getEquipNameReactiveData();

    const graphId = ref(); // 当前图id
    const graphHeaderData = ref(); // 当前图头数据
    const isEditDetails = ref(false); // 是否编辑过细节调整
    const globalFontSize = ref(24); // 设置全局字号大小
    const containerBgsPostData = ref([]); // 背景卡
    // 保存or修改细节调整
    const saveAndUpdateSystemGraphDetailFun = (infoPointDatas = [], callback) => {
        const postDatas = infoPointDatas.map(infoPointData => {
            return {
                id: infoPointData.id,
                systemGraphDuplicateId: graphId.value,
                projectId: mainStore.projectId,
                data: infoPointData
            };
        });
        console.log(postDatas);

        saveAndUpdateSystemGraphDetailBatch(postDatas).then(res => {
            if (res.result === 'success') {
                isEditDetails.value = true;
                const { data } = res;
                data.forEach((da, index) => {
                    infoPointDatas[index].id = da.id;
                });
                if (typeof callback === 'function') {
                    callback(infoPointDatas);
                }
            }
        });
    };

    const deleteInfoPointFun = id => {
        deleteSystemGraphDetail({
            id
        }).then(res => {
            console.log(res, '删除成功');
        });
    };

    // 删除细节调整
    editor.on('deleteInfoPoint', deleteInfoPointFun);

    editor.on('saveInfoPoints', saveAndUpdateSystemGraphDetailFun);

    const saveGraphFieldFun = data => {
        isEditDetails.value = true;
        editSystemGraph(graphId.value, data);
    };

    editor.on('saveGraphField', saveGraphFieldFun);

    // 在组件卸载时，清理编辑器实例，防止内存泄漏
    onUnmounted(() => {
        editor?.dispose?.();
    });

    // 提供编辑器实例和数据给子组件使用
    provide(editorKey, editor);
    provide(containerBgsPostDataKey, containerBgsPostData);
    provide(infoPointsKey, infoPoints); // 信息点数据
    provide(equipNamesKey, equipNames);
    provide(graphIdKey, graphId);
    provide(currentHeaderItemKey, currentHeaderItem);
    provide(copyCompleteKey, ref(false));
    provide(graphHeaderDataKey, graphHeaderData);
    provide(isEditDetailsKey, isEditDetails);
    provide(globalFontSizeKey, globalFontSize);

    // 返回编辑器实例和相关数据
    return { editor, infoPoints, equipNames, currentHeaderItem, graphId, graphHeaderData };
};
