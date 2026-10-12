<template>
    <div class="build-floor-tree" :class="{ 'no-data': !treeBuildFloorData.length && !loadingTree }">
        <m-tree v-if="!loadingTree" v-model="data.treeData" :data="treeBuildFloorData" :multiple="data.multiple" @node-click="nodeClick">
            <template #rowSuffix="node">
                <span class="fw500" style="color: var(--gray-600)">{{ node.totalObjectCount || 0 }}</span>
            </template>
        </m-tree>
        <template v-else>
            <div class="fcc loading-tree"><IconMeriComponentButtonGrey /></div>
        </template>
    </div>
</template>

<script setup>
import { treeBuildFloorDataKey, loadingTreeKey, isFirstFilterKey } from '../hooks/useBaseHook';
import { IconMeriComponentButtonGrey } from 'meri-icon';
const treeBuildFloorData = inject(treeBuildFloorDataKey);
const loadingTree = inject(loadingTreeKey);
const isFirstFilter = inject(isFirstFilterKey, ref(false));
defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const nodeClick = () => {
    isFirstFilter.value = false;
};
</script>
<style lang="less" scoped>
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.build-floor-tree {
    padding-left: 8px;
    padding-right: 8px;
    &.no-data {
        display: none;
    }
    :deep(.m-tree) {
        min-height: 40px;
    }
    .loading-tree {
        height: 40px;
        svg {
            animation: spin 1s linear infinite;
        }
    }
}
</style>
