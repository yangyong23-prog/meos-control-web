<template>
    <div class="right-demand-config-container">
        <template v-if="isAcEdit">
            <!-- 特殊配置编辑(全局、空间功能类型配置需特殊处理) -->
            <EditSpecialConfigItem ref="formEditRef" :config-list-data="configListData" @edit-save="editConfigSave" @edit-cancel="resetData" />
        </template>

        <template v-else-if="isAcAdd">
            <!-- 特殊配置新增(空间功能类型配置需特殊处理) -->
            <AddSpecialConfigItem ref="formAddRef" @add-save="addConfigSave" @add-cancel="resetData" />
        </template>
        <template v-else>
            <!-- 需求配置预览 -->
            <ConfigList :config-list-data="configListData" :list-loading="detailLoading" :is-shield="isShield" @refresh-config-list="updateLeftAndRightProjectInfo" />
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import useConditioningOperation from '../hooks/useConditioningOperation';
import useConditioningStandardRight from '../hooks/useConditioningStandardRight';
import ConfigList from './components/ConfigList.vue';
import AddSpecialConfigItem from './components/AddEditConfigItem.vue';
import EditSpecialConfigItem from './components/EditGlobalConfigItem.vue';
import { listAirDateTagByRule, listConfigsByInstance } from '@/apis/DemandManagementHome';
import useStore from '@/store';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { isEqual } from 'lodash';
import {
    isAcEditKey,
    isAcAddKey,
    currentConfigItemKey,
    leftTreeListKey,
    formDirtyCheckKey,
    confirmModalKey,
    isChangeConfigKey,
    isProjectShowRHKey,
    isProjectShowPressureDiffKey
} from '../hooks/useAcCommon';
const emits = defineEmits(['refreshLeftList']);

const { base } = useStore();
const { projectId } = base || {};

const requiredFields = ref(false);
const showSelect = ref(false);
const formAddRef = ref(null);
const formEditRef = ref(null);

const formInitValue = ref(null);
const formDirtyCheck = inject(formDirtyCheckKey);
const confirmModal = inject(confirmModalKey);
const isChangeConfig = inject(isChangeConfigKey);
const isAcEdit = inject(isAcEditKey);
const isAcAdd = inject(isAcAddKey);
const currentConfigItem = inject(currentConfigItemKey);
const leftTreeList = inject(leftTreeListKey);
// TODO 接入屏蔽空间，影响查看右侧需求配置
const isShield = ref(false);

// 右侧配置详情hook
const { fetchConfigList, configListData, listLoading, templateId, templateType, pastDateString, queryWorkConditionByShellConfigData } = useConditioningStandardRight();

// 右侧配置新增/编辑hook
const { commonEditConfigSave, isAddLoadingRef } = useConditioningOperation();

const getFormValue = async () => {
    if (isAcAdd.value) {
        const res = await formAddRef?.value?.getFormValues?.();
        return res;
    } else if (isAcEdit.value) {
        const res = await formEditRef?.value?.getFormValues?.();
        return res;
    }
};

const submitFormValue = async () => {
    if (isAcAdd.value) {
        await formAddRef?.value?.submit?.();
    } else if (isAcEdit.value) {
        await formEditRef?.value?.submit?.();
    }
};

watch([isAcAdd, isAcEdit], async ([curAdd, curEdit]) => {
    if (curAdd || curEdit) {
        nextTick(async () => {
            const initValue = await getFormValue();
            formInitValue.value = initValue;
            formDirtyCheck.value.check = async () => {
                const newValue = await getFormValue();
                const rawValue = structuredClone(formInitValue.value);
                const isDirty = !isEqual(rawValue, newValue);
                return isDirty;
            };
            formDirtyCheck.value.submit = submitFormValue;
        });
    } else {
        formInitValue.value = null;
        formDirtyCheck.value = {
            check: async () => Promise.resolve(false),
            linkToGroupId: '',
            submit: () => {}
        };
    }
});

const resetData = () => {
    confirmModal.value = false;
    isChangeConfig.value = false;
    formInitValue.value = null;
    formDirtyCheck.value = {
        check: async () => Promise.resolve(false)
    };
};

const updateLeftAndRightProjectInfo = () => {
    emits('refreshLeftList');
};

const isProjectLoading = ref(false);
const isProjectShowRH = ref(true);
const isProjectShowPressureDiff = ref(true);

const detailLoading = computed(() => {
    return isProjectLoading.value || listLoading.value;
});

const getProjectConfigInfo = async () => {
    const globalParams = {
        templateType: templateType?.value,
        templateId: templateId?.value,
        instanceType: 'PROJECT',
        instanceIds: [projectId],
        ...(pastDateString?.value ? { date: pastDateString?.value } : {})
    };
    isProjectLoading.value = true;
    const res = await listConfigsByInstance(globalParams).finally(() => {
        isProjectLoading.value = false;
    });
    if (res?.code === '00000') {
        const resData = res.data || [];
        if (Array.isArray(resData)) {
            const { isRhQualityEnabled, isPressureDiffQualityEnabled } = resData[0]?.finalConfig?.globalConfig?.environmentQuality || {};
            isProjectShowRH.value = isRhQualityEnabled;
            isProjectShowPressureDiff.value = isPressureDiffQualityEnabled;
            return resData;
        }
    }
    return null;
};

watch(
    [() => currentConfigItem.value, templateType, templateId, () => pastDateString?.value],
    ([curSelect, curTem, curId]) => {
        if (Object.keys(curSelect).length > 0 && curTem && curId) {
            getProjectConfigInfo();
        }
    },
    {
        immediate: true
    }
);

const editConfigSave = d => {
    const { configData, objectSelection } = d;
    invokeSave(configData, { isEdit: true, objectSelection });
};
const addConfigSave = async d => {
    const { configData, objectSelection } = d;
    const isSelectedFuncType = objectSelection?.type === 'ROOM_FUNC_TYPE';

    if (isSelectedFuncType) {
        const resData = await getProjectConfigInfo();
        if (Array.isArray(resData)) {
            invokeSave(configData, { objectSelection, newestConfigList: resData });
        } else {
            isAddLoadingRef.value = false;
        }
    } else {
        invokeSave(configData, { objectSelection });
    }
};
const invokeSave = (editConfigData, { isEdit, objectSelection, newestConfigList }) => {
    const isSelectedFuncType = objectSelection?.type === 'ROOM_FUNC_TYPE';
    const isSelectedProject = objectSelection?.type === 'PROJECT';
    const funcTypes = objectSelection?.spaceFuncList?.map(v => ({ name: v?.name, code: v?.id })) || [];
    const curSelectedIds = funcTypes
        ?.map(v => v?.code)
        ?.toSorted?.()
        ?.join('|');

    const { instanceId, instanceType, finalConfig: preConfig } = newestConfigList ? newestConfigList?.[0] || {} : configListData?.value?.[0] || {};
    // 全局配置： null 对应清空，{} 对应默认配置
    // 空间配置：null 对应清空
    const preGlobal = Object.keys(preConfig?.globalConfig || {})?.length === 0 ? null : preConfig?.globalConfig || {};
    const preSpaces = preConfig?.spaceFuncTypeConfigs || [];
    // 默认提交全局配置
    let tempConfig = {
            globalConfig: editConfigData,
            spaceFuncTypeConfigs: []
        },
        objectSelectionConfig = {
            instanceIds: objectSelection?.instanceIds,
            configGroupName: objectSelection?.configGroupName,
            instanceType: objectSelection?.type,
            ...(isEdit ? { configGroupId: currentConfigItem?.value?.groupId } : {})
        },
        addRoomFuncType = false;
    // 项目取之前的空间功能类型配置, 无对象选择，取左侧的分组id和name
    if (isSelectedProject) {
        tempConfig.spaceFuncTypeConfigs = preSpaces;
        objectSelectionConfig = {
            instanceIds: [instanceId],
            configGroupName: currentConfigItem?.value?.groupName,
            ...(isEdit ? { configGroupId: currentConfigItem?.value?.groupId } : {}),
            instanceType: instanceType
        };
    }
    // 空间功能类型取之前的全局配置，外部取项目全局的分组id和name，内部取对象选择的name和左侧分组的id
    if (isSelectedFuncType) {
        tempConfig.globalConfig = preGlobal;
        const { groupId, groupName } = leftTreeList.value?.find(v => v?.objectType === 'PROJECT')?.children?.[0] || {};
        objectSelectionConfig = {
            instanceIds: [instanceId],
            configGroupName: groupName,
            configGroupId: groupId,
            instanceType: instanceType
        };

        if (isEdit) {
            //TODO 空间功能类型编辑需过滤
            const modifyItem = {
                funcTypes,
                config: editConfigData,
                ...(isEdit ? { relConfigGroupId: currentConfigItem?.value?.groupId } : {}),
                configGroupName: objectSelection?.configGroupName
            };
            tempConfig.spaceFuncTypeConfigs = preSpaces?.map(v => {
                const equalSelected =
                    v?.funcTypes
                        ?.map(t => t?.code)
                        ?.toSorted?.()
                        ?.join('|') === curSelectedIds;
                const equalGroupId = v?.relConfigGroupId === currentConfigItem?.value?.groupId;
                if (equalSelected || equalGroupId) {
                    return modifyItem;
                }
                return v;
            });
        } else {
            tempConfig.spaceFuncTypeConfigs = [{ funcTypes, config: editConfigData, configGroupName: objectSelection?.configGroupName, addRoomFuncType: true }, ...preSpaces];
            addRoomFuncType = true;
        }
    }

    const isEditSpaceFuncType = isSelectedFuncType && isEdit;
    const relConfigGroupId = currentConfigItem?.value?.groupId;
    console.log('-----save----data', { tempConfig, objectSelectionConfig });

    commonEditConfigSave({ tempConfig, objectSelectionConfig, isEdit, addRoomFuncType }, scrollId => {
        if (isEditSpaceFuncType) {
            emits('refreshLeftList', relConfigGroupId);
        } else {
            emits('refreshLeftList', scrollId);
        }

        // 更新项目下的工况配置数据
        if (isSelectedProject) {
            queryWorkConditionByShellConfigData();
        }
        nextTick(() => {
            formInitValue.value = null;
            formDirtyCheck.value = {
                check: async () => Promise.resolve(false)
            };
            confirmModal.value = false;
            isChangeConfig.value = false;

            showSelect.value = false;
            requiredFields.value = false;

            isAcEdit.value = false;
            isAcAdd.value = false;
        });
    });
};
const seasonQuality = ref([]);
const getListInstantiationDateTagFun = async () => {
    const list = ['AirSummer', 'AirSummerPeak', 'AirWinter', 'AirSeasonSpring', 'AirSeasonAutumn'];
    const seasonListMap = {
        AirSummer: {
            lowerComfortSeasonLimitValue: '24',
            upperComfortSeasonLimitValue: '26',
            underCoolingSeasonLimitValue: '22',
            overHeatingSeasonLimitValue: '27'
        },
        AirSummerPeak: {
            lowerComfortSeasonLimitValue: '22',
            upperComfortSeasonLimitValue: '25',
            underCoolingSeasonLimitValue: '20',
            overHeatingSeasonLimitValue: '27'
        },
        AirWinter: {
            lowerComfortSeasonLimitValue: '18',
            upperComfortSeasonLimitValue: '26',
            underCoolingSeasonLimitValue: '16',
            overHeatingSeasonLimitValue: '27'
        },
        AirSeasonSpring: { lowerComfortSeasonLimitValue: '18', upperComfortSeasonLimitValue: '26', underCoolingSeasonLimitValue: '16', overHeatingSeasonLimitValue: '27' },
        AirSeasonAutumn: {
            lowerComfortSeasonLimitValue: '18',
            upperComfortSeasonLimitValue: '26',
            underCoolingSeasonLimitValue: '16',
            overHeatingSeasonLimitValue: '27'
        }
    };
    seasonQuality.value = [];
    const res = await listAirDateTagByRule({});
    if (res.code === SUCCESSCODE) {
        const sureArr = res?.data
            .filter(item => {
                return list.includes(item);
            })
            ?.toSorted((a, b) => list.indexOf(a) - list.indexOf(b))
            ?.map(v => ({
                airSeason: v,
                ...(seasonListMap[v] || {}),
                oldTempSeasonTargetValue: '',
                oldTempSeasonUpperValue: '',
                oldTempSeasonLowerValue: ''
            }));
        if (sureArr?.length) {
            seasonQuality.value = sureArr;
        }
    } else {
        seasonQuality.value = [];
    }
    console.log('seasonQuality.value', seasonQuality.value);
};
onMounted(() => {
    getListInstantiationDateTagFun();
});
provide('seasonQuality', seasonQuality);
provide('requiredFields', requiredFields);
provide('showSelect', showSelect);
provide(isProjectShowRHKey, isProjectShowRH);
provide(isProjectShowPressureDiffKey, isProjectShowPressureDiff);

onUnmounted(() => {
    seasonQuality.value = null;
});
</script>

<style lang="less">
.m-modal-bg.clear-model-wrapper-container {
    .m-modal-main-content.clear-modal-content-container {
        padding: 0;
    }
}
</style>

<style lang="less" scoped>
.right-demand-config-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    justify-content: space-between;
    column-gap: 4px;
    border-bottom: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}

.header-left {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;

    .self-title {
        display: flex;
        align-items: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        color: @grey-800;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;

        .base-title {
            flex-shrink: 0;
        }

        .line,
        .obj-title {
            font-weight: var(--platform-font-weight);
        }
    }

    .reference-title {
        flex-shrink: 0;
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;

        display: flex;
    }

    .inheritance-title {
        max-width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.header-right {
    display: flex;
    align-items: center;

    .divider {
        width: 1px;
        height: 12px;
        background: #d9d9d9;
    }
}

.footer {
    position: relative;
    left: 0;
    bottom: 0;
    display: flex;
    height: 60px;
    padding: 16px;
    justify-content: center;
    align-items: center;

    border-top: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}

.shield-txt {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 22px;
    svg {
        width: 14px;
        height: 14px;
        margin-right: 4px;
    }
}

.center-wrapper {
    display: flex;
    flex-direction: column;

    .radio-tips {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-bottom: 12px;
    }

    .custom-clear-container {
        padding: 0px 24px 20px 24px;
    }

    .m-banner {
        max-width: 100% !important;
        width: 100%;
        padding: 9px 12px 9px 16px;
        margin-bottom: 20px;
        border-radius: 0;
    }

    :deep(.m-banner-message) {
        padding-right: 0px;
    }

    .radios-container {
        display: flex;
        align-items: center;
    }

    :deep(.m-radio) {
        display: flex;
        align-items: center;
        width: max-content;
    }

    :deep(.m-radio-label) {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}
</style>
