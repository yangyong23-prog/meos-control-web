import { ref, onMounted, provide } from 'vue';
import { listSystemTemplate } from '@/api/RelationChartEditor';
import useLoading from '@/hooks/useLoading';
import { currentTemplateObjectKey } from '@/utils/injectionKey';

export default () => {
    const { loading, openLoading, closeLoading } = useLoading('relation-chart-editor-wrap', '#F1F4F6');
    const treeData = ref([]);
    const currentSelectedIds = ref([]);
    const currentTemplateObject = ref();

    //处理树数据
    const transformTreeData = arr => {
        let trees = arr || [];
        let firstLeafNode = '';
        const dealTree = (list, open, classCode) => {
            list.forEach((node, index) => {
                if (index === 0) {
                    node.open = open;
                }
                node.classCode = classCode;
                node.id = node.code;
                node.isShowEdit = false; // 是否展示编辑icon
                if (node.children?.length) {
                    dealTree(node.children, null, classCode);
                } else {
                    if (!firstLeafNode) {
                        firstLeafNode = node;
                    }
                }
            });
        };
        trees.forEach((node, index) => {
            node.classCode = node.code;
            if (index === 0) {
                node.open = true;
                node.id = node.code;
            }
            if (node.children?.length) {
                dealTree(node.children, node.open, node.classCode);
            }
        });
        return {
            trees,
            firstLeafNode
        };
    };

    const getTreeData = async () => {
        try {
            openLoading();
            const res = await listSystemTemplate();
            if (res.result === 'success') {
                const { trees, firstLeafNode } = transformTreeData(res.data);
                treeData.value = trees;
                currentTemplateObject.value = firstLeafNode;

                if (currentTemplateObject.value) {
                    currentSelectedIds.value = [currentTemplateObject.value.id];
                } else {
                    currentSelectedIds.value = [];
                }
            }
        } catch {
            treeData.value = [];
        } finally {
            closeLoading();
        }
    };

    const handleChangeNode = (ids, selectNode) => {
        currentTemplateObject.value = selectNode;
    };

    onMounted(() => {
        getTreeData();
    });

    provide(currentTemplateObjectKey, currentTemplateObject);

    return {
        loading,
        treeData,
        currentTemplateObject,
        currentSelectedIds,
        getTreeData,
        handleChangeNode
    };
};
