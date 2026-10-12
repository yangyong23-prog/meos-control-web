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
        @close="() => (showModal = false)"
    >
        <template #content>
            <div v-show="!onlyLoopConfig && curStepIndex === 1" class="space-sel-content">
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
                            <m-button @click="() => (showModal = false)">{{ i18n.global.t('common.cancel') }}</m-button>
                            <m-button
                                type="primary"
                                :disabled="selectedCount <= 0"
                                @click="
                                    () => {
                                        btns?.confirm();
                                        curStepIndex = 2;
                                    }
                                "
                                >{{ i18n.global.t('meos_control_web.next_step') }}</m-button
                            >
                        </div>
                    </template>
                </TreeWithMapForSpaceSelectView>
            </div>
            <div v-show="onlyLoopConfig || curStepIndex === 2" class="loop-sel-content">
                <LoopConfigTable ref="loopConfigTable" :sel-space-ids="curSelSpaceIds" class="table"></LoopConfigTable>
                <div class="footer">
                    <div class="footer-btn-group">
                        <m-button type="text" :disabled="isSaving" @click="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
                        <m-button v-if="!onlyLoopConfig" type="default" :disabled="isSaving" @click="curStepIndex = 1">{{
                            i18n.global.t('meos_control_web.previous_step')
                        }}</m-button>
                        <m-tips
                            :content="loadingCircuit ? i18n.global.t('meos_control_web.temporarily_cannot_operate_loading') : ''"
                            :disabled="!loadingCircuit"
                            trigger="hover"
                            theme="darkTransparent"
                        >
                            <m-button type="primary" :disabled="loadingCircuit" :loading="isSaving" @click="configComplete">{{ i18n.global.t('common.confirm') }}</m-button>
                        </m-tips>
                    </div>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import TreeWithMapForSpaceSelectView from '@/views/Common/TreeWithMapForSpaceSelectView/index.vue';
import LoopConfigTable from './LoopConfigTable.vue';
import { currentBuildingTreeKey, queryLoopsBySpacesKey, selSpaceIdsKey, spaceDefaultSelectedDataKey, loadingCircuitKey } from '../../hooks/useScheduledTaskEdit';
import { INSTANCE_TYPE } from '../../variables';
import useStore from '@/store';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';

const props = defineProps({
    instanceType: {
        type: String,
        default: null
    }
});

const { base } = useStore();

const showModal = defineModel({ type: Boolean, default: false });
const curStepIndex = ref(1);
const loopConfigTable = ref(null);
const treeWithMapForSpaceSelectView = ref(null);
const currentBuildingTree = inject(currentBuildingTreeKey);
const queryLoopsBySpaces = inject(queryLoopsBySpacesKey);
const selSpaceIds = inject(selSpaceIdsKey);
const spaceDefaultSelectedData = inject(spaceDefaultSelectedDataKey);
const loadingCircuit = inject(loadingCircuitKey);

const curSelSpaceIds = ref(null);
const confirmSelectedSpaceObj = (selectedSpaces, relatedNodes) => {
    // console.log('selectedSpaces, relatedNodes: ', selectedSpaces, relatedNodes);
    curSelSpaceIds.value = selectedSpaces?.value;
    queryLoopsBySpaces(selectedSpaces?.value);
};

const reset = () => {
    curSelSpaceIds.value = null;
    curStepIndex.value = 1;
    spaceDefaultSelectedData.value = [];
    loopConfigTable.value?.reset();
};

const closeModal = () => {
    showModal.value = false;
    reset();
};
const title = computed(() => {
    if (onlyLoopConfig.value || curStepIndex.value === 2) {
        return i18n.global.t('meos_control_web.loop_onoff_config');
    }
    console.log('props.instanceType: ', props.instanceType);
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
const selectedCount = computed(() => {
    return treeWithMapForSpaceSelectView.value ? treeWithMapForSpaceSelectView.value.getSelectedCount() : 0;
});
const onlyLoopConfig = computed(() => {
    return props.instanceType === INSTANCE_TYPE.SPACE;
});
watch(showModal, () => {
    if (showModal.value) {
        curSelSpaceIds.value = selSpaceIds.value;
    }
});
const calcConfigData = () => {
    console.log('loopConfigTable.value: ', loopConfigTable.value);
    loopConfigTable.value?.calcConfigData();
};
const configComplete = () => {
    calcConfigData();
    if (props.instanceType !== INSTANCE_TYPE.SPACE) {
        selSpaceIds.value = curSelSpaceIds.value;
    }
    showModal.value = false;
    curStepIndex.value = 1;
};
defineExpose({
    calcConfigData,
    reset
});
</script>
<style lang="less" scoped>
.space-sel-content {
    width: 100%;
    height: 100%;
}
.loop-sel-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .table {
        width: 100%;
        height: calc(100% - 36px);
    }
    .footer {
        width: 100%;

        min-height: 36px;
        position: relative;

        .footer-btn-group {
            position: absolute;
            top: 0px;
            left: -24px;
            right: -24px;
            bottom: -20px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 12px 24px;
            border-top: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);
            gap: 12px;

            .btns {
                margin-left: auto;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
