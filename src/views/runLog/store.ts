import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TreeData } from './types';

export const useTreeNodeStore = defineStore('selectedTreeNode', () => {
    const selectedNode = ref<TreeData>();
    const isLoadingNode = ref(false);
    function setNode(node: any) {
        selectedNode.value = node;
    }

    function setLoading(loading: boolean) {
        isLoadingNode.value = loading;
    }

    return { selectedNode, setNode, isLoadingNode, setLoading };
});
