<template>
    <div class="right-demand-config-container">
        <template v-if="isRightConfigEdit">
            <EditSpecialConfigItem
                ref="formEditRef"
                v-model:has-fill-edit-id="hasFillEditId"
                :config-list-data="configListData"
                :list-loading="isLeftAndRightConfigLoading"
                @edit-save="editConfigSave"
                @edit-cancel="resetData('edit')"
            />
        </template>
        <template v-else-if="isRightConfigAdd">
            <AddSpecialConfigItem ref="formAddRef" @add-save="addConfigSave" @add-cancel="resetData('add')" />
        </template>
        <template v-else>
            <ConfigList
                :config-list-data="configListData"
                :list-loading="isLeftAndRightConfigLoading"
                @refresh-left-list="refreshLeftList"
                @refresh-right-list="refreshRightList"
            />
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { $Message } from 'meri-plus';
import EditSpecialConfigItem from './EditSpecialConfigItem.vue';
import AddSpecialConfigItem from './AddSpecialConfigItem.vue';
import ConfigList from './ConfigList.vue';
import {
    isRightConfigAddKey,
    isRightConfigEditKey,
    configListDataInjectKey,
    getProjectConfigInfoKey,
    useConfigListSubmitData,
    isLeftAndRightConfigLoadingKey,
    spaceFuncTypeCollapsedIdsKey,
    failFeedbackModalConfigKey
} from '../hooks/useConfigCommonHook';
import { useFeedbackConfigHook } from '../hooks/useFeedbackConfigHook';

const emits = defineEmits(['refresh-left-list', 'refresh-right-list']);
useFeedbackConfigHook();
const refreshLeftList = id => emits('refresh-left-list', id);
const refreshRightList = id => emits('refresh-right-list', id);

const isRightConfigAdd = inject(isRightConfigAddKey);
const isRightConfigEdit = inject(isRightConfigEditKey);
const getProjectConfigInfo = inject(getProjectConfigInfoKey);
const configListData = inject(configListDataInjectKey);
const isLeftAndRightConfigLoading = inject(isLeftAndRightConfigLoadingKey);
const hasFillEditId = ref(false);
const spaceFuncTypeCollapsedIds = ref({});
provide(spaceFuncTypeCollapsedIdsKey, spaceFuncTypeCollapsedIds);

const failFeedbackModalConfig = ref({ show: false, data: [] });
provide(failFeedbackModalConfigKey, failFeedbackModalConfig);
const beforeSubmit = async res => {
    const conflictCircuits = res?.data;
    let checkPass = true;
    if (Array.isArray(conflictCircuits) && conflictCircuits.length) {
        const errText = i18n.global.t('meos_control_web.lighting_circuit_feedback_condition_inconsistent_save_failed', { count: conflictCircuits?.length });
        const viewDetail = i18n.global.t('meos_control_web.view_detail');
        const showData = conflictCircuits.map(v => {
            return {
                ...v,
                spaceConfigs: v.spaceConfigs?.map(space => {
                    return { ...space, spaceId: space.instanceId, spaceName: space.instanceName };
                })
            };
        });
        $Message.error({
            title: errText,
            duration: 4000,
            showClose: true,
            button: viewDetail,
            buttonClick: () => {
                failFeedbackModalConfig.value.data = showData;
                failFeedbackModalConfig.value.show = true;
            }
        });
        checkPass = false;
    }
    return checkPass;
};

const { invokeSave, isAddLoadingRef, resetData, formAddRef, formEditRef } = useConfigListSubmitData(refreshLeftList, hasFillEditId);

const editConfigSave = d => {
    const { configData, objectSelection } = d;
    invokeSave(configData, { isEdit: true, objectSelection }, beforeSubmit);
};

const addConfigSave = async d => {
    const { configData, objectSelection } = d;
    const isSelectedFuncType = objectSelection?.type === 'ROOM_FUNC_TYPE';

    if (isSelectedFuncType) {
        const resData = await getProjectConfigInfo();
        if (Array.isArray(resData)) {
            invokeSave(configData, { objectSelection, newestConfigList: resData }, beforeSubmit);
        } else {
            isAddLoadingRef.value = false;
        }
    } else {
        invokeSave(configData, { objectSelection }, beforeSubmit);
    }
};
</script>

<style lang="less" scoped>
.right-demand-config-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
    background: #fff;
}
</style>
