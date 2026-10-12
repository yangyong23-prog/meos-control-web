<template>
    <div class="left-container">
        <m-sidebar-custom width="300" :resident="false">
            <div class="tree-wrap">
                <div v-show="!store.isLoadingNode && treeTitle" class="tree-title">
                    {{ treeTitle }}
                </div>

                <div class="scrollbar-wrap">
                    <m-scrollbar>
                        <m-list-skeleton v-if="store.isLoadingNode" />
                        <m-tree v-else ref="treeRef" :data="data" :last-stage="lastStage" @change="clickItem"> </m-tree>
                    </m-scrollbar>
                </div>
            </div>
        </m-sidebar-custom>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import i18n from '@/localization';
import type { TreeNode } from 'meri-plus/dist/tree/src/TreeProps';
import { queryTemplateNodes } from '@/apis/runLog';

import { TreeData, TREE_NODE_TYPE } from './types';
import { useTreeNodeStore } from './store';
import { setDisabledGroupedTree } from './utils';

const data = ref<TreeData[]>([]);
const treeTitle = ref('');

const treeRef = ref();
// 默认每一级都可选中,lastStage为true可以设置仅末级可选
const lastStage = ref(false);
// 选中节点信息
const store = useTreeNodeStore();

onMounted(async () => {
    store.setLoading(true);
    const res = await queryTemplateNodes().finally(() => {
        store.setLoading(false);
    });

    if (res?.code === '00000') {
        const resData = res?.data || [];
        if (Array.isArray(resData) && !!resData?.length) {
            const mapResData = setDisabledGroupedTree(resData);
            data.value = mapResData;
            treeTitle.value = i18n.global.t('meos_control_web.cooling_station_switch_setpoint');
        }
    }
});

const clickItem = (ids: TreeNode[], selectNode?: TreeNode) => {
    const { type } = selectNode || {};
    if (type === TREE_NODE_TYPE.TREE_TEMPLATE) {
        store?.setNode?.(selectNode);
    }
};
// XXX: 需UI库升级版本，且不可选中分组节点，需disable
// const beforeClick = (curNode: TreeNode, prevNode: TreeNode | null, done: Function) => {
//     if (curNode.type === TREE_NODE_TYPE.TREE_GROUP) {
//         lastStage.value = false;
//     } else {
//         // 末级可选，无特殊操作则放行
//         lastStage.value = true;
//         done();
//     }
// };
</script>
<style lang="less" scoped>
.left-container {
    height: 100%;
    // FIXME 待优化side组件支持resize宽度限制
    --tree-min-width: 300px;
    --tree-max-width: 380px;

    /deep/.p-SidebarCustomProps-box .p-SidebarCustomProps {
        padding: 16px 12px;
    }
}

.tree-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
}

.tree-title {
    display: flex;
    align-items: center;
    width: calc(100% - 8px);
    height: 38px;
    margin-left: 4px;
    padding: 8px 8px 8px 28px;
    border-radius: 2px;
    background: var(--blue-100, #d9ebff);

    color: var(--blue-500, #246fe5);

    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
}

.p-SidebarCustomPropsHide {
    .tree-title {
        visibility: hidden;
    }
    .m-tree {
        visibility: hidden;
    }
}

/deep/ .p-SidebarCustomProps-box {
    height: 100%;
}

.p-SidebarCustomProps-box .myfirstshowfz {
    .tree-title {
        min-width: 200px;
        visibility: visible;
    }
}

.scrollbar-wrap {
    height: calc(100% - 48px);
}

.m-tree {
    min-height: 50px;
}

/deep/ .m-tree-node {
    & + .m-tree-node {
        margin-top: 4px;
    }
}

/deep/ .m-tree-node__children {
    margin-top: 4px;
}
</style>
