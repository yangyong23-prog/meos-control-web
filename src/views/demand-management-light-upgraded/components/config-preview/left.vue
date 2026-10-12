<template>
    <div class="warp">
        <m-list-skeleton v-show="loading" />
        <div v-show="!loading" class="config-preview-left-wrap">
            <m-tree-select
                v-model="roomFuncTypeSel"
                :prefix="i18n.global.t('meos_control_web.space_function_type_colon')"
                clearable
                :data="globalLoopRoomFuncTypesTree"
                multiple
                has-confirm
                has-check-all
                panel-searchable
                :size="sidebarWidth - 32"
                @change="blurSearch"
                @clear="blurSearch"
            >
            </m-tree-select>
            <m-select
                v-if="hasFeedbackAdjustment"
                v-model="lightFeedback"
                :size="sidebarWidth - 32"
                :prefix="i18n.global.t('meos_control_web.illuminance_feedback_colon')"
                :options="data"
                clearable
                @change="blurSearch"
                @clear="blurSearch"
            ></m-select>
            <m-search
                ref="searchRef"
                v-model="keyword"
                :placeholder="i18n.global.t('meos_control_web.search_space_name')"
                :style="{ width: '100%', marginBottom: '7px' }"
                :height="32"
                trigger-on-focus
                type="real"
                label="value"
            ></m-search>
            <m-tree
                ref="treeComponent"
                v-model="curControlledObjId"
                :style="{ overflow: 'scroll' }"
                :data="treeControlledObject"
                :search-as-tree="true"
                :filter-node-method="filterNodeMethod"
                :filter-value="keyword"
            >
                <template #nodeSlot="node">
                    <TreeItem :node="node" :keyword="keyword" />
                </template>
            </m-tree>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import {
    configPreviewLoadingKey,
    currentSelTreeNodeKey,
    currentSelectObjKey,
    filterSpacesKey,
    sidebarWidthKey,
    lightFeedbackKey,
    roomFuncTypeSelKey,
    curControlledObjIdKey,
    hasFeedbackAdjustmentKey
} from '../../hooks/useConfigPreviewHook';
import { configuredInstanceIdsKey, curMenuIdKey, curSelectedPeriodIdKey, globalLoopRoomFuncTypesTreeKey } from '../../hooks/useGlobalData';
import { setSpaceTreeData } from '../../utils';
import TreeItem from './TreeItem.vue';
const loading = inject(configPreviewLoadingKey);
const sidebarWidth = inject(sidebarWidthKey);
const currentSelTreeNode = inject(currentSelTreeNodeKey);
const filterSpaces = inject(filterSpacesKey);
const configuredInstanceIds = inject(configuredInstanceIdsKey);
const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
const curControlledObjId = inject(curControlledObjIdKey);
const hasFeedbackAdjustment = inject(hasFeedbackAdjustmentKey);

// 功能类型
const globalLoopRoomFuncTypesTree = inject(globalLoopRoomFuncTypesTreeKey);
const roomFuncTypeSel = inject(roomFuncTypeSelKey);

// 照度反馈
const data = [
    {
        id: '1',
        name: i18n.global.t('meos_control_web.yes')
    },
    {
        id: '0',
        name: i18n.global.t('common.no')
    }
];
const lightFeedback = inject(lightFeedbackKey);

// 搜索

const searchRef = ref();

const keyword = ref('');

const blurSearch = () => {
    searchRef.value.clearInp();
    searchRef.value.searchHide();
};

// 树组件

const filterNodeMethod = (node, nodes, searchString) => {
    console.log(node, nodes, searchString);
    const { localName } = node || {};
    return localName?.toLocaleLowerCase().includes(searchString.toLocaleLowerCase());
};

const treeComponent = ref();

watch(curSelectedPeriodId, () => {
    blurSearch();
    roomFuncTypeSel.value = [];
    lightFeedback.value = '';
});

const treeControlledObject = computed(() => {
    const deal = (node, setOpen = true, level = 0) => {
        node.isCfg = false;

        if (setOpen && level < 2) {
            node.open = true;
        }

        if (node.children?.length > 0) {
            node.children.forEach(child => {
                deal(child, setOpen, level + 1);
            });
        }
    };
    const tree = {
        id: baseStore().projectId,
        localName: baseStore().projectName,
        objType: 'project',
        children: setSpaceTreeData(filterSpaces.value ?? [])
    };
    deal(tree, true);
    return [tree];
});

watch([treeControlledObject, configuredInstanceIds], () => {
    const deal = node => {
        node.isCfg = configuredInstanceIds.value.includes(node.id) || false;
        if (node.children?.length > 0) {
            node.children.forEach(child => {
                deal(child);
            });
        }
    };
    if (treeControlledObject.value.length > 0 && configuredInstanceIds.value.length > 0) {
        deal(treeControlledObject.value[0]);
    }
});

watch(
    curControlledObjId,
    () => {
        let selNode = null;
        const findNode = (node, id) => {
            if (node.id === id) {
                selNode = node;
            }
            if (node.children?.length > 0) {
                node.children.forEach(child => {
                    findNode(child, id);
                });
            }
        };

        if (treeControlledObject.value && curControlledObjId.value.length > 0) {
            findNode(treeControlledObject.value[0], curControlledObjId.value[0]);
            if (selNode) {
                const { id, objType, floorId, localName } = selNode;
                currentSelTreeNode.value = { id, objType, floorId, localName };
            }
        } else {
            currentSelTreeNode.value = null;
        }
    },
    {
        immediate: true
    }
);

watch([treeControlledObject, curControlledObjId], () => {
    if (treeControlledObject.value.length > 0 && curControlledObjId.value.length === 0) {
        nextTick(() => {
            curControlledObjId.value = [baseStore().projectId];
        });
    }
});
</script>

<style lang="less" scoped>
.warp {
    height: 100%;
    padding: 16px;
    background: #fff;
    border-right: 1px solid var(--gray-300, #e1e5eb);
    box-sizing: border-box;
}
.config-preview-left-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}
</style>
