<template>
    <div class="left-floor-tree h100">
        <m-scrollbar ref="scrollbarRef" class="left-tree" :style="{ height: isHideFooter || isHideAction ? '100%' : 'calc(100% - 60px)' }">
            <m-tree
                v-if="!staticTreeIsLoading"
                ref="tree"
                v-model="selectedTreeNodeIds"
                :data="renderTreeData"
                lazy
                :load="load"
                :before-click="beforeClick"
                @change="changeTreeData"
            >
                <template #nodeSlot="node">
                    <LeftFloorTreeItem :node="node" :custom-config-ids="customConfigIds" :shielded-space-ids="shieldedSpaceIds" />
                </template>
            </m-tree>
        </m-scrollbar>
        <div v-if="!isHideFooter && !isHideAction" class="left-footer-container">
            <slot name="left-footer"></slot>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import LeftFloorTreeItem from './LeftFloorTreeItem.vue';
import {
    selectModuleInfoInjectKey,
    staticTreeInjectKey,
    staticTreeIsLoadingInjectKey,
    selectedTreeNodeIdsInjectKey,
    shieldedSpaceIdsInjectKey,
    customConfigIdsInjectKey,
    treeInstanceInjectKey,
    getDynamicSpacesDataInjectKey,
    reloadDynamicNodesInjectKey,
    isLoadingFloorIdsInjectKey,
    isHideActionKey
} from '../constant/injectKey';
import { OBJ_TYPE } from '@/utils/globalVariables';

const isHideAction = inject(isHideActionKey);

const emits = defineEmits(['changeTreeData', 'afterSelectedNode']);
const props = defineProps({
    buildingSelectId: {
        type: String,
        default: ''
    },
    isHideFooter: {
        type: Boolean,
        default: false
    }
});
const timeoutKey = ref();

const tree = inject(treeInstanceInjectKey);
const getDynamicSpacesData = inject(getDynamicSpacesDataInjectKey);
const reloadDynamicNodes = inject(reloadDynamicNodesInjectKey);

const templateType = inject('templateType');
const selectModuleInfo = inject(selectModuleInfoInjectKey);

const renderTreeData = ref([]);
const staticTreeData = inject(staticTreeInjectKey);
const staticTreeIsLoading = inject(staticTreeIsLoadingInjectKey);
const selectedTreeNodeIds = inject(selectedTreeNodeIdsInjectKey);
const isLoadingFloorIds = inject(isLoadingFloorIdsInjectKey);

watchEffect(() => {
    if (staticTreeData?.value) {
        renderTreeData.value = staticTreeData.value;
    }
});

const loadingInstance = ref(null);

const shieldedSpaceIds = inject(shieldedSpaceIdsInjectKey);
const customConfigIds = inject(customConfigIdsInjectKey);

const invokeClickNode = id => {
    if (isLoadingFloorIds?.value?.length) {
        const isCancelClick = isLoadingFloorIds.value.includes(id);
        if (isCancelClick) {
            return;
        }
    }
    // HACK Tree-懒加载树组件，绑定选中节点失效，手动触发选中
    nextTick(() => {
        const ele = document.getElementById(`tree_node_${id}`);

        ele?.click?.();
    });
};

const bindSelectedNode = id => {
    invokeClickNode(id);
    if (selectedTreeNodeIds?.value) {
        selectedTreeNodeIds.value = [id];
    }
    emits('afterSelectedNode', id);
};

watch(
    () => selectModuleInfo?.value?.id,
    async curSelectId => {
        if (curSelectId) {
            let needUpdateFloorId = '';
            if (selectModuleInfo.value?.objType === OBJ_TYPE.SPACE) {
                needUpdateFloorId = selectModuleInfo.value?.floorId;
            }
            if (selectModuleInfo.value?.objType === OBJ_TYPE.FLOOR) {
                needUpdateFloorId = curSelectId;
            }
            if (needUpdateFloorId) {
                const allFloors = tree.value?.data?.flatMap(project => project?.children?.flatMap(building => building?.children));
                const needUpdateFloorNode = allFloors?.find(node => node.id === needUpdateFloorId);
                // 若楼层节点未加载过数据且未加载中，则动态加载数据，选中不变,
                if (!needUpdateFloorNode?._tree_lazy_isLoaded && !needUpdateFloorNode?._tree_lazy_loading) {
                    const treeNodeConfig = { openFloor: true, selectTreeNoe: { ...(selectModuleInfo?.value || {}) }, cancelSelectTreeNode: false };
                    await reloadDynamicNodes?.(needUpdateFloorId, treeNodeConfig);
                    return;
                } else if (needUpdateFloorNode?._tree_lazy_isLoaded) {
                    // 若楼层节点加载过数据，则展开
                    needUpdateFloorNode.open = true;
                }
            }
            // 楼层需展开之后定位选中元素（排除屏蔽空间、黑名单）
            nextTick(() => {
                bindSelectedNode(curSelectId);
            });
        }
    },
    {
        immediate: true
    }
);

watch(
    () => staticTreeIsLoading?.value,
    cur => {
        if (cur) {
            loadingInstance.value?.destroy?.();
            loadingInstance.value = MLoading.service({
                target: '.left-floor-tree',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                },
                background: 'transparent'
            });
        } else {
            loadingInstance.value?.destroy?.();
        }
    },
    {
        immediate: true
    }
);

const beforeClick = (node, data, done) => {
    const isLoadingIds = isLoadingFloorIds.value;
    if (isLoadingIds?.length) {
        return;
    } else {
        done();
    }
};

const load = computed(() => async (node, done) => {
    const floorId = node.id;

    const { treeNodeConfig } = node;
    // openFloor: 楼层是否需展开，如定位选中元素，需【排除屏蔽空间】、【排除黑名单】
    // selectTreeNoe: 有特殊选中节点，如取消屏蔽后的空间节点，需【排除黑名单】
    // cancelSelectTreeNode: 不执行选中操作,仅执行数据更新，如黑名单更新
    const { openFloor, selectTreeNoe, cancelSelectTreeNode } = treeNodeConfig || {};

    // 无特殊选中节点，执行选中操作，如默认下拉展开选中楼层
    if (!selectTreeNoe?.id && !cancelSelectTreeNode) {
        emits('changeTreeData', { ids: [floorId], selectNode: node });
    }

    try {
        const resData = await getDynamicSpacesData?.(templateType.value, floorId);

        if (selectTreeNoe?.id) {
            if (openFloor) {
                node.open = true;
            }
            if (!cancelSelectTreeNode) {
                emits('changeTreeData', { ids: [selectTreeNoe.id], selectTreeNoe });
                timeoutKey.value = setTimeout(() => {
                    bindSelectedNode(selectTreeNoe.id);
                }, 600);
            }
        }

        done(resData);

        nextTick(() => {
            node.open = true;
        });

        return resData;
    } catch (error) {
        console.error('Load dynamic nodes failed:', error);
        done([]);
        return [];
    }
});

const changeTreeData = (ids, selectNode) => {
    emits('changeTreeData', { ids, selectNode });
};

onUnmounted(() => {
    if (timeoutKey.value) {
        clearTimeout(timeoutKey.value);
        timeoutKey.value = null;
    }
});
</script>

<style lang="less" scoped>
.left-floor-tree {
    position: relative;
    z-index: 101;
    height: 100%;
    .left-tree {
        height: calc(100% - 60px);
        padding-bottom: 12px;
        :deep(.m-scrollbar__box) {
            padding: 12px 12px 0 0;
            .m-tree-node.is-hover > .m-tree-node__content {
                background-color: var(--alpha-30);
            }
            .container-content {
                height: 100%;
                .nodeSlot {
                    height: 100%;
                    width: 100%;
                }
            }
            .m-tree-node__content .container {
                padding-right: 0;
            }
            .m-tree {
                min-height: 100px;
            }
        }
    }

    .left-footer-container {
        color: @blue-500;
        border-top: 1px solid var(--gray-300);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        line-height: 60px;
        user-select: none;
    }

    :deep(.m-tree-empty) {
        white-space: nowrap;
    }
}
</style>
