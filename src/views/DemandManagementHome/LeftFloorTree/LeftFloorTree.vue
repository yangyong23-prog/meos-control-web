<template>
    <div class="left-floor-tree h100">
        <m-scrollbar ref="scrollbarRef" class="left-tree" :style="{ height: isHideFooter ? '100%' : 'calc(100% - 60px)' }">
            <m-tree v-if="!treeIsLoading" ref="tree" v-model="buildingModel" :data="buildingFloorSpaceTreeData" @change="changeTreeData">
                <template #nodeSlot="node">
                    <LeftFloorTreeItem :node="node" />
                </template>
            </m-tree>
        </m-scrollbar>
        <div v-if="!isHideFooter" class="left-footer-container">
            <slot name="left-footer"></slot>
        </div>
    </div>
</template>
<script setup>
import LeftFloorTreeItem from './LeftFloorTreeItem.vue';
import { buildingFloorSpaceTreeKey, buildingFloorSpaceTreeLoadingKey, selectModuleInfoInjectKey } from '../constant/injectKey';
import { MLoading } from 'meri-plus';

const buildingFloorSpaceTree = inject(buildingFloorSpaceTreeKey);
const selectModuleInfo = inject(selectModuleInfoInjectKey);
const treeIsLoading = inject(buildingFloorSpaceTreeLoadingKey);
const emit = defineEmits(['changeTreeData', 'afterSelectedNode']);
const props = defineProps({
    buildingSelectId: {
        type: Array,
        default: () => []
    },
    isHideFooter: {
        type: Boolean,
        default: false
    }
});
const buildingModel = ref([]);
const loadingInstance = ref();

watch(
    () => treeIsLoading.value,
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

const changeTreeData = (ids, selectNode) => {
    buildingModel.value = ids;
    emit('changeTreeData', { ids, selectNode });
};

watchEffect(() => {
    if (selectModuleInfo?.value?.id) {
        buildingModel.value = [selectModuleInfo.value.id];
        nextTick(() => {
            emit('afterSelectedNode', selectModuleInfo.value.id);
        });
        return;
    }
    buildingModel.value = props.buildingSelectId;
});
const filterTreeData = roots => {
    const deal = node => {
        const newNode = { ...node };
        newNode.children = newNode.children?.filter(c => !c.instanceTag?.inBlacklisted && (c.instanceType !== 'SPACE' || !c.instanceTag?.shielded)).map(c => deal(c));
        return newNode;
    };
    return roots?.map(prj => deal(prj));
};

const buildingFloorSpaceTreeData = computed(() => {
    return filterTreeData(buildingFloorSpaceTree.value);
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
