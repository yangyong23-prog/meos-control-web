<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        :z-index="20"
        type="default"
        :title="title"
        :width="1260"
        :height="698"
        :max-height="698"
        :footer="false"
        @close="close"
    >
        <template #content>
            <div class="space-sel-content">
                <TreeWithMapForSpaceSelectView
                    ref="treeWithMapForSpaceSelectView"
                    :tree-data-loading="spaceTreeLoading"
                    :tree-data="currentBuildingTree"
                    :empty-text="i18n.global.t('meos_control_web.no_configurable_content')"
                    :default-selected="spaceDefaultSelectedData"
                    :is-all-checkable="true"
                    @submit="confirmSelectedSpaceObj"
                >
                    <template #buttons="{ btns }">
                        <div class="fc" :style="{ gap: '12px' }">
                            <m-button size="medium" @click="close">{{ i18n.global.t('common.cancel') }}</m-button>
                            <m-button size="medium" type="primary" @click="btns.confirm">{{ i18n.global.t('common.confirm') }}</m-button>
                        </div>
                    </template>
                </TreeWithMapForSpaceSelectView>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import TreeWithMapForSpaceSelectView from '@/views/Common/TreeWithMapForSpaceSelectView/index.vue';
import { currentBuildingTreeKey, spaceDefaultSelectedDataKey, spaceTreeLoadingKey } from './useScheduledTaskEdit';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
const INSTANCE_TYPE = {
    PROJECT: 'PROJECT',
    BUILDING: 'BUILDING',
    FLOOR: 'FLOOR',
    SPACE: 'SPACE'
};
const props = defineProps({
    instanceType: {
        type: String,
        default: null
    }
});
const showModal = defineModel({ type: Boolean, default: false });
const treeWithMapForSpaceSelectView = ref(null);
const currentBuildingTree = inject(currentBuildingTreeKey);
const spaceTreeLoading = inject(spaceTreeLoadingKey);
const spaceDefaultSelectedData = inject(spaceDefaultSelectedDataKey);
const confirmSelectedSpaceObj = selectedSpaces => {
    emits('confirm', selectedSpaces.value || []);
    close();
};
const emits = defineEmits(['close', 'confirm']);
const title = computed(() => {
    if (!props.instanceType || props.instanceType === INSTANCE_TYPE.PROJECT) {
        return `${i18n.global.t('meos_control_web.select_object_2')}${baseStore()?.projectName ?? ''}`;
    } else if (props.instanceType === INSTANCE_TYPE.FLOOR) {
        const floorName = currentBuildingTree?.value?.length > 0 ? currentBuildingTree?.value[0].children.find(f => true)?.name ?? '--' : '--';
        return `${i18n.global.t('meos_control_web.select_object_2')}${floorName}`;
    } else if (props.instanceType === INSTANCE_TYPE.BUILDING) {
        const buildingName = currentBuildingTree?.value?.length > 0 ? currentBuildingTree?.value[0].name : '';
        return `${i18n.global.t('meos_control_web.select_object_2')}${buildingName}`;
    }
    return '';
});
const close = () => {
    showModal.value = false;
};
</script>
<style lang="less" scoped>
.space-sel-content {
    width: 100%;
    height: 100%;
}
</style>
