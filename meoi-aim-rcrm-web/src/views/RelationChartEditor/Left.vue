<template>
    <div ref="leftdom" class="relation-chart-left">
        <m-scrollbar>
            <m-tree
                v-model="currentSelectedIds"
                class="cus-tree"
                last-stage
                :data="treeData"
                @change="handleChangeNode"
                @node-enter="mouseenterName"
                @node-leave="mouseleaveName"
            >
                <template #nodeSlot="row">
                    <div class="node-slot-item">
                        <span v-ellipsis class="node-slot-name">{{ row.name }} </span>
                        <!-- 编辑名称icon -->
                        <EditorIcon
                            v-if="!row.children && row.isShowEdit"
                            :show-action-editor="showActionEditor"
                            :rows="row"
                            @handle="handle"
                        ></EditorIcon>
                    </div>
                </template>
                <template #rowSuffix="row">
                    <div v-if="row.updateFlag" class="cus-tree-circle" />
                </template>
            </m-tree>
        </m-scrollbar>
    </div>
    <!--编辑名称的弹框  -->
    <PopoverName
        :type="'template'"
        :popover-virtual-ref="popoverVirtualRef"
        @submit-name-change="submitNameChange"
    ></PopoverName>
</template>
<script setup>
import { ref, computed, provide } from 'vue';
import EditorIcon from './SidebarOperation/common/EditorIcon.vue';
import PopoverName from './SidebarOperation/common/PopoverName.vue';
const emits = defineEmits(['update:modelValue', 'change']);
const leftdom = ref();
const props = defineProps({
    treeData: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: Array,
        default: () => []
    }
});
const currentSelectedIds = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});
const handleChangeNode = (ids, selectNode, currentNode) => {
    if (!selectNode) return;
    emits('change', ids, selectNode, currentNode);
};
const mouseenterName = (event, row) => {
    row.isShowEdit = true;
};
const mouseleaveName = (event, row) => {
    if (showActionEditor.value && row.id === currentItem.value.id) return;
    row.isShowEdit = false;
};
const showActionEditor = ref(false);
const popoverVirtualRef = ref({});
// 当前item
const currentItem = ref({});
const handle = (event, row) => {
    currentItem.value = row;
    popoverVirtualRef.value = '';
    showActionEditor.value = false;
    setTimeout(() => {
        popoverVirtualRef.value = event.target;
        showActionEditor.value = true;
    });
};
const submitNameChange = () => {
    showActionEditor.value = false;
};
provide('currentItem', currentItem);
provide('showActionEditor', showActionEditor);
</script>

<style lang="scss" scoped>
.relation-chart-left {
    flex-shrink: 0;
    width: 260px;
    display: flex;
    border-right: 1px solid var(--grey-300, #e1e5eb);
    background: var(--white, #ffffff);
    :deep(.m-scrollbar) {
        width: 100%;
    }
    :deep(.cus-tree) {
        padding: 12px 16px;
        .container {
            padding-right: 0;
        }
        .node-slot-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .node-slot-name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 100%;
            }
        }
        .cus-tree-circle {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--red-500);
            margin-right: 8px;
        }
    }
    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.nodeSlot) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
