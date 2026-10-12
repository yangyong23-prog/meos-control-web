<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :width="420"
        type="default"
        :title="i18n.global.t('meos_control_web.by_building_floor')"
        :content-class-name="'floor-custom-content-modal'"
        :need-scrollbar="false"
        :escable="false"
        modal-class-name="floor-modal"
        @close="close"
    >
        <template #content>
            <m-scrollbar max-height="400px">
                <m-tree ref="treeRef" v-model="ids" class="tree-container" :data="treeList" last-stage multiple @change="treeChange"> </m-tree>
            </m-scrollbar>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import { handleTreeNodeOpen } from '@/utils/index';
import i18n from '@/localization';

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
const treeRef = ref();
const show = ref(false);
const ids = ref([]);
const treeList = ref();
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
.floor-modal {
    .is-uncheckable {
        .m-checkbox.disabled {
            display: none;
        }
    }

    .m-tree {
        min-height: 400px;
    }

    .floor-custom-content-modal.m-modal-main-content {
        padding-right: 0px !important;
        padding-left: 16px !important;
        padding-block: 16px !important;
        .tree-container {
            padding-right: 16px;
        }
    }
}
</style>
