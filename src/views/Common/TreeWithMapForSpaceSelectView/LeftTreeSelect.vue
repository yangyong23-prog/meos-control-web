<template>
    <div class="left-container" :style="{ '--tree-min-height': `${minTreeHeight}px` }">
        <template v-if="treeDataLoading"> <m-list-skeleton class="loading-container" /></template>
        <template v-else>
            <slot></slot>
            <m-input v-model="keyword" :width="360" prefix-icon="IconMeriActionSearch" :placeholder="i18n.global.t('meos_control_web.search')"> </m-input>
            <div :class="['tree-container', selectedSpaces?.length ? '' : 'tree-empty']">
                <m-tree
                    ref="treeRef"
                    v-model="selectedSpaces"
                    :data="treeData"
                    :filter-value="filterString"
                    :filter-node-method="filterNodeMethod"
                    :virtual="true"
                    :height="minTreeHeight"
                    search-as-tree
                    multiple
                    :last-stage="!isAllCheckable"
                    :check-strictly="!isAllCheckable"
                    @node-enter="nodeEnter"
                    @node-leave="nodeLeave"
                    @node-click="nodeClick"
                >
                    <template #nodeSlot="node">
                        <TreeNodeItem :node="node" :keyword="keyword" :selected-floor-id="selectedFloorId" />
                    </template>
                </m-tree>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { debounce } from 'lodash';
import TreeNodeItem from './widget/TreeNodeItem.vue';
import { selectedFloorIdKey, selectedSpacesKey, filterStringKey, onlyLookSelectedKey, treeSearchKeywordKey, updateFilterStringKey } from './hooks/useGlobalData';
import { OBJ_TYPE } from '@/utils/globalVariables';

const props = defineProps({
    treeData: {
        type: Array,
        default: () => []
    },
    treeDataLoading: {
        type: Boolean,
        default: false
    },
    showModal: {
        type: Boolean,
        default: false
    },
    minTreeHeight: {
        type: Number,
        default: 566
    },
    treeFiltersMap: {
        type: Map,
        default: new Map()
        // {
        //     key: 'xxx',
        //     filterVal: computed(() => xxxVal.value),
        //     isEmpty: computed(() => !xxxVal.value),
        //     condition: (curVal, curFilter) => boolean
        // };
    },
    isAllCheckable: {
        type: Boolean,
        default: false
    }
});

const { treeData } = toRefs(props);

// const treeFilterValues = computed(() => {
//     const filterObj = {};
//     props.treeFiltersMap.forEach((value, key) => {
//         filterObj[key] = { key, value: value?.filterVal, isEmpty: value?.isEmpty };
//     });
//     return filterObj;
// });

const treeRef = ref(null);
const keyword = inject(treeSearchKeywordKey);
const filterString = inject(filterStringKey);
const onlyLookSelected = inject(onlyLookSelectedKey);
const updateFilterString = inject(updateFilterStringKey);
const debounceUpdateFilterString = debounce(updateFilterString, 500);

const selectedFloorId = inject(selectedFloorIdKey);
const selectedSpaces = inject(selectedSpacesKey);

const emits = defineEmits(['hover-space', 'unhover-space']);

const filterNodeMethod = (node, nodes, searchString) => {
    let findSearched = false,
        findSelected = false;
    const searchKeyword = searchString?.split('~')?.[0];
    const searchType = searchString?.split('~')?.[1];
    const searchWithSelected = searchString?.split('~')?.[2];
    const isLookAtSelected = searchType === 'onlyLook';
    const isSearchSelected = searchWithSelected === 'searchWithSelected';

    if (searchKeyword?.length) {
        findSearched = node?.name?.toUpperCase().includes(searchKeyword.toUpperCase());
    } else {
        findSearched = true;
    }

    if (isLookAtSelected) {
        // 仅看已选+选中
        if (isSearchSelected) {
            findSelected = selectedSpaces?.value?.includes?.(node.id);
        } else {
            findSelected = false;
        }
    } else {
        findSelected = true;
    }

    return findSearched && findSelected;
};

const handleTreeFloorSelect = (data, floorNodesSet) => {
    if (data?.objType === OBJ_TYPE.FLOOR || data?.instanceType === 'FLOOR') {
        if (!floorNodesSet.size) {
            floorNodesSet.add(data);
        }
    } else if (data?.children?.length) {
        if (data?.objType === OBJ_TYPE.BUILDING || data?.instanceType === 'BUILDING') {
            data.children = data.children.toSorted((a, b) => {
                return (b?.floorSequenceId ?? 0) - (a?.floorSequenceId ?? 0);
            });
        }
        data.children.forEach(item => {
            handleTreeFloorSelect(item, floorNodesSet);
        });
    }
};

const handleTreeFloorOpen = (data, floorPath) => {
    if (floorPath.includes(data.id)) {
        data.open = true;
    }
    if (data?.children?.length) {
        data.children.forEach(item => {
            handleTreeFloorOpen(item, floorPath);
        });
    }
};

const delayTimer = ref();
const delayBuildingTimer = ref();

const findPathToFloor = (treeList, floorId) => {
    for (const node of treeList) {
        const path = findPath(node, floorId);
        if (path) return path;
    }
    return null;
};

const findPath = (node, floorId) => {
    if (node.id === floorId) {
        return [node.id];
    }
    if (node.children && node.children.length) {
        for (const child of node.children) {
            const childPath = findPath(child, floorId);
            if (childPath) {
                return [node.id, ...childPath];
            }
        }
    }
    return null;
};

watch(
    [() => treeData?.value, () => props?.showModal],
    ([data, show]) => {
        if (show) {
            const floorNodesSet = new Set();
            data?.forEach(item => {
                handleTreeFloorSelect(item, floorNodesSet);
            });
            if ([...floorNodesSet]?.[0]) {
                const nodeId = [...floorNodesSet]?.[0]?.id;
                // 找寻项目-建筑-楼层的id，执行节点展开
                const floorPath = findPathToFloor(data, nodeId);
                if (Array.isArray(floorPath) && floorPath.length) {
                    data?.forEach(item => {
                        handleTreeFloorOpen(item, floorPath);
                    });
                }

                nextTick(() => {
                    selectedFloorId.value = nodeId;
                });
            }
        }
    },
    {
        immediate: true
    }
);

// 仅看已选与搜索，以及选中，交互叠加
watch([() => onlyLookSelected.value, keyword], ([, newKeyword], [, preKeyword]) => {
    if (newKeyword !== preKeyword) {
        debounceUpdateFilterString?.();
    } else {
        updateFilterString?.();
    }
});

const nodeEnter = (e, node) => {
    if (node?.objType === 'space' || node?.instanceType === 'SPACE') {
        emits('hover-space', node.id);
    }
};
const nodeLeave = (e, node) => {
    if (node?.objType === 'space' || node?.instanceType === 'SPACE') {
        emits('unhover-space', node.id);
    }
};

const debounceFloorClick = debounce(id => {
    selectedFloorId.value = id;
}, 400);

const nodeClick = node => {
    if (node?.objType === OBJ_TYPE.FLOOR || node?.instanceType === 'FLOOR') {
        debounceFloorClick?.(node.id);
    }
};

onBeforeUnmount(() => {
    if (delayTimer.value) {
        clearTimeout(delayTimer.value);
    }
    if (delayBuildingTimer.value) {
        clearTimeout(delayBuildingTimer.value);
    }
    delayTimer.value = null;
    delayBuildingTimer.value = null;
});
</script>

<style lang="less" scoped>
.left-container {
    width: 370px;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.loading-container {
    width: 370px;
    padding-right: 10px;
}
.tree-container {
    margin-top: 4px;
    padding-right: 10px;
    flex: 1;

    :deep {
        .m-tree {
            padding: 0px;
            line-height: 22px;
            min-height: var(--tree-min-height);
        }
        .nodeSlot {
            flex: 1;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
