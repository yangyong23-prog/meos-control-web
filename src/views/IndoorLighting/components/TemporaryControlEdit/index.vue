<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        :z-index="20"
        type="default"
        :width="1260"
        :height="698"
        :max-height="698"
        :footer="false"
        @close="() => (showModal = false)"
    >
        <template #header>
            <Header v-model="curSelType" :step="curStepIndex" :main-title="mainTitle" :sub-title="subTitle" @close="() => (showModal = false)" />
        </template>
        <template #content>
            <div class="indoor-temp-ctl-edit-content">
                <div v-show="isSpaceSel && curStepIndex === 1" class="space-sel-content">
                    <TreeWithMapForSpaceSelectView
                        ref="treeWithMapForSpaceSelectView"
                        :tree-data-loading="spaceTreeLoading"
                        :tree-data="currentBuildingTree"
                        :empty-text="i18n.global.t('meos_control_web.no_configurable_content')"
                        :default-selected="spaceDefaultSelectedData"
                        :is-all-checkable="true"
                        :with-only-look-selected="!step1Loading"
                        @submit="confirmSelectedSpaceObj"
                    >
                        <template v-if="!step1Loading" #buttons="{ btns }">
                            <div class="fc" :style="{ gap: '12px' }">
                                <m-button @click="() => (showModal = false)">{{ i18n.global.t('common.cancel') }}</m-button>
                                <m-tips :content="nextBtnDisabledInfo?.disabledTips" :disabled="!nextBtnDisabledInfo?.disabled" trigger="hover" theme="darkTransparent">
                                    <m-button
                                        type="primary"
                                        :disabled="nextBtnDisabledInfo?.disabled"
                                        @click="
                                            () => {
                                                btns?.confirm();
                                                curStepIndex = 2;
                                            }
                                        "
                                        >{{ i18n.global.t('meos_control_web.next_step') }}</m-button
                                    >
                                </m-tips>
                            </div>
                        </template>
                    </TreeWithMapForSpaceSelectView>
                </div>
                <OnOffRadios v-show="(isSpaceSel && curStepIndex === 2) || (!isSpaceSel && curStepIndex === 1)" v-model="settingMode"></OnOffRadios>
                <CircuitGroupingSel
                    v-bind="{ ...props, ...$attrs }"
                    ref="circuitGroupingSelRef"
                    :act-show="!isSpaceSel && curStepIndex === 1"
                    class="circuit-grouping-sel"
                ></CircuitGroupingSel>
                <LoopConfigTable v-show="isSpaceSel && curStepIndex === 2" ref="loopConfigTableRef" class="loop-sel-content" :sel-space-ids="curSelSpaceIds"></LoopConfigTable>
                <BaseEdit v-show="curStepIndex === 3 || (!isSpaceSel && curStepIndex === 2)" ref="baseEditRef" class="base-edit-content"></BaseEdit>

                <Footer
                    v-if="!step1Loading && !(isSpaceSel && curStepIndex === 1)"
                    :step="curStepIndex"
                    :sel-type="curSelType"
                    :disabled-next="nextBtnDisabledInfo?.disabled"
                    :disabled-next-tips="nextBtnDisabledInfo?.disabledTips"
                    :is-saving="isSaving"
                    @cancel="closeModal"
                    @next-step="curStepIndex += 1"
                    @last-step="curStepIndex -= 1"
                    @confirm="clickSave"
                >
                    <template #left>
                        <div v-if="isSpaceSel && curStepIndex === 2" class="selected-count">
                            <m-checkbox v-model="onlySelForSpace">{{ i18n.global.t('meos_control_web.selected_count', { count: selItemCount }) }}</m-checkbox>
                            <template v-if="selLoopLocalCount > 0">
                                <div class="split"></div>
                                <div class="local-count">{{ i18n.global.t('meos_control_web.local_status_cannot_be_controlled', { count: selLoopLocalCount }) }}</div>
                            </template>
                        </div>
                        <div v-if="!isSpaceSel && curStepIndex === 1" class="selected-count">
                            <m-checkbox v-model="onlySelForGroup">{{ i18n.global.t('meos_control_web.selected_group_count', { count: selItemCount }) }}</m-checkbox>
                            <template v-if="selLoopLocalCount > 0">
                                <div class="split"></div>
                                <div class="local-count">{{ i18n.global.t('meos_control_web.local_status_cannot_be_controlled', { count: selLoopLocalCount }) }}</div>
                            </template>
                        </div>
                    </template>
                </Footer>
            </div>
            <LoopRepetitionModal v-model="repeatErrShow" :err-data="repeatErrData"></LoopRepetitionModal>
        </template>
    </m-modal>
</template>

<script setup>
import TreeWithMapForSpaceSelectView from '@/views/Common/TreeWithMapForSpaceSelectView/index.vue';
import LoopConfigTable from './LoopConfigTable.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import BaseEdit from './BaseEdit.vue';
import LoopRepetitionModal from './LoopRepetitionModal.vue';
import CircuitGroupingSel from './CircuitGroupingSel.vue';
import useTemporaryControlEdit from '../../hooks/useTemporaryControlEdit';
import OnOffRadios from './OnOffRadios.vue';
// import { currentBuildingTreeKey, queryLoopsBySpacesKey, selSpaceIdsKey, spaceDefaultSelectedDataKey, loadingCircuitKey } from '../../hooks/useScheduledTaskEdit';
import { INSTANCE_TYPE, TEMP_CTL_EDIT_SELECT_TYPE } from '../../variables';
import useStore from '@/store';

import i18n from '@/localization';

const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    runningMonitorSecondType: {
        type: String,
        default: ''
    },
    runningMonitorSecondTypeId: {
        type: String,
        default: ''
    },
    editData: {
        type: Object,
        default: () => null
    },
    instanceType: {
        type: String,
        default: ''
    },
    instanceId: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['saveSuccess']);
const { base } = useStore();

const showModal = defineModel({ type: Boolean, default: false });

const treeWithMapForSpaceSelectView = ref(null);

const {
    curSelSpaceIds,
    curSelType,
    spaceDefaultSelectedData,
    currentBuildingTree,
    curStepIndex,
    baseEditRef,
    isSaving,
    loopConfigTableRef,
    circuitGroupingSelRef,
    formRef,
    isSpaceSel,
    step1Loading,
    settingMode,
    onlySelForSpace,
    onlySelForGroup,
    repeatErrShow,
    repeatErrData,
    queryLoopsBySpaces,
    clickSave
} = useTemporaryControlEdit(props, showModal, emits);

const confirmSelectedSpaceObj = (selectedSpaces, relatedNodes) => {
    // console.log('selectedSpaces, relatedNodes: ', selectedSpaces, relatedNodes);
    curSelSpaceIds.value = selectedSpaces?.value;
    queryLoopsBySpaces(selectedSpaces?.value);
};

const closeModal = () => {
    showModal.value = false;
};

const mainTitle = computed(() => {
    if (curStepIndex.value === 1) {
        return curSelType.value === TEMP_CTL_EDIT_SELECT_TYPE.SPACE ? i18n.global.t('meos_control_web.sel_circuit_by_space') : i18n.global.t('meos_control_web.group_config');
    }
    if (curSelType.value === TEMP_CTL_EDIT_SELECT_TYPE.SPACE && curStepIndex.value === 2) {
        return i18n.global.t('meos_control_web.sel_circuit_by_space');
    } else {
        return i18n.global.t('meos_control_web.select_time');
    }
});
const selectedSpaceCount = computed(() => {
    return treeWithMapForSpaceSelectView.value ? treeWithMapForSpaceSelectView.value?.getSelectedCount() ?? 0 : 0;
});
const selLoopLocalCount = computed(() => {
    return isSpaceSel.value ? loopConfigTableRef.value?.selLoopLocalCount : circuitGroupingSelRef.value?.selLoopLocalCount;
});
const selItemCount = computed(() => {
    return isSpaceSel.value ? loopConfigTableRef.value?.selItemCount : circuitGroupingSelRef.value?.selItemCount;
});
const subTitle = computed(() => {
    if (curSelType.value === TEMP_CTL_EDIT_SELECT_TYPE.SPACE && curStepIndex.value === 2) {
        return `(${i18n.global.t('meos_control_web.selected_space')}: ${selectedSpaceCount.value})`;
    }
    return '';
});

//
const nextBtnDisabledInfo = computed(() => {
    let disabled = false,
        disabledTips = '';

    if (isSpaceSel.value) {
        disabled = curStepIndex.value === 1 ? selectedSpaceCount.value <= 0 : selItemCount.value <= 0;
        if (disabled) {
            disabledTips = curStepIndex.value === 1 ? i18n.global.t('meos_control_web.please_select_space') : i18n.global.t('meos_control_web.please_select_loop');
        }
    } else {
        disabled = selItemCount.value <= 0;
        disabledTips = i18n.global.t('meos_control_web.please_select_loop_group');
    }
    return { disabled, disabledTips };
});
</script>
<style lang="less" scoped>
.space-sel-content {
    width: 100%;
    height: 100%;
}
.loop-sel-content,
.base-edit-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    height: calc(100% - 36px);
}
.indoor-temp-ctl-edit-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.selected-count {
    display: flex;
    align-items: center;
    gap: 12px;
    .local-count {
        color: var(--Palette-Red-500, #f55047);
        font-size: 14px;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
    .split {
        width: 1px;
        height: 12px;
        background: #d9d9d9;
    }
}
</style>
