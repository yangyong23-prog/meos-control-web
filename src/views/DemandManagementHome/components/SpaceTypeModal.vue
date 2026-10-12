<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :width="420"
        type="default"
        :title="i18n.global.t('meos_control_web.by_space')"
        :content-class-name="'space-custom-content-modal'"
        :need-scrollbar="false"
        :escable="false"
        modal-class-name="build-modal"
        @close="close"
    >
        <template #content>
            <m-search v-model="filterValue" class="search-input" :width="388"> </m-search>
            <m-scrollbar max-height="400px">
                <m-tree
                    ref="treeRef"
                    v-model="ids"
                    class="tree-container"
                    search-as-tree
                    :filter-value="filterValue"
                    :filter-node-method="filterNodeMethod"
                    :data="treeList"
                    multiple
                    last-stage
                    @change="treeChange"
                >
                </m-tree>
            </m-scrollbar>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import { handleTreeNodeOpen } from '@/utils/index';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    treeData: {
        type: Array,
        default: () => []
    }
});
const treeRef = ref(null);
const filterValue = ref('');
const show = ref(false);
const ids = ref([]);
const treeList = ref([]);
const emits = defineEmits(['close', 'confirm']);
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
const confirm = () => {
    show.value = false;
    emits('confirm', structuredClone(ids.value));
};
const filterNodeMethod = node => {
    if (node.name.includes(filterValue.value)) {
        return true;
    }
    return false;
};
onMounted(() => {
    show.value = true;
    ids.value = props.data;
    treeList.value = structuredClone(props.treeData);
    nextTick(() => {
        if (Array.isArray(treeRef.value?.data)) {
            treeRef.value?.data?.forEach(item => {
                handleTreeNodeOpen(item, { lv: 0 });
            });
        }
    });
});
</script>
<style lang="less">
.build-modal {
    .m-tree {
        min-height: 400px;
        padding: 0px;
    }

    .search-input {
        margin-bottom: 4px;
    }

    .space-custom-content-modal.m-modal-main-content {
        padding-right: 0px !important;
        padding-left: 16px !important;
        padding-block: 16px !important;
        .tree-container {
            padding-right: 16px;
        }
    }
}
</style>
