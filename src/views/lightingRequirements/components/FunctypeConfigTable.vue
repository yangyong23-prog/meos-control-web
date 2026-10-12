<template>
    <div class="functype-config-table">
        <m-table :columns="columnList" :data-source="unionSetting" :cell-class-name-fn="cellClassNameFn">
            <template #name="{ name, lampFuncType }">
                <div class="row-name" :class="{ 'child-name': lampFuncType }">{{ name }}</div>
            </template>
            <template #summary="row">
                <div class="row-summary">
                    <span v-ellipsis>
                        {{ i18n.global.t('common.total_count') }} {{ row.total }} / {{ i18n.global.t('common.status_open') }} {{ row.openCount }} /
                        {{ i18n.global.t('meos_control_web.unconfiged') }} {{ row.noCount }}
                    </span>
                    <m-popover :content="i18n.global.t('common.edit')" :enterable="true" theme="darkTransparent">
                        <EditIcon v-show="row.funcType && row.settingMode === SMD_PARTIAL_OPEN" class="edit-icon" @click="clickEditCircuit(row)"></EditIcon>
                    </m-popover>
                </div>
            </template>
            <template #ops="row">
                <div class="op-warp">
                    <div class="item" :class="{ act: row.settingMode === SMD_ALL_OPEN }" @click="openOrCloseAll(row, SMD_ALL_OPEN)">
                        {{ i18n.global.t('meos_control_web.fully_on') }}
                    </div>
                    <div class="item" :class="{ act: row.settingMode === SMD_ALL_CLOSE }" @click="openOrCloseAll(row, SMD_ALL_CLOSE)">
                        {{ i18n.global.t('meos_control_web.fully_off') }}
                    </div>
                    <m-popover
                        :content="i18n.global.t('meos_control_web.no_subnode_configured')"
                        :enterable="true"
                        theme="darkTransparent"
                        :disabled="!row.funcType || !unlawfulRecord[row.funcType]"
                        :popover-class="'functype-cfg-table-err-tips'"
                    >
                        <div class="item" :class="{ act: row.settingMode === SMD_PARTIAL_OPEN, err: row.funcType && unlawfulRecord[row.funcType] }" @click="afterPartOpen(row)">
                            {{ i18n.global.t('meos_control_web.partial_on') }}
                        </div>
                    </m-popover>
                </div>
            </template>
        </m-table>
        <m-modal
            v-model:visible="showChangeModeConfirm"
            :append-to="$modalAppendTo"
            type="info"
            :title="i18n.global.t('meos_control_web.confirm_modify_object_config')"
            :content="i18n.global.t('meos_control_web.operation_will_clear_sub_config')"
            @close="closeModeChangeConfirm"
            @submit="afterConfirmClear"
        >
        </m-modal>
        <m-modal
            v-model:visible="showCircuitModal"
            :append-to="$modalAppendTo"
            :content-class-name="'funcTypeConfigTableContent'"
            type="default"
            :title="i18n.global.t('meos_control_web.configuration')"
            :width="840"
            :top-y="120"
            :auto-close="false"
            align-center
            @close="commonCancel"
        >
            <template #content>
                <GroupLoopConfigEdit
                    v-model:radio="curConfigRadio"
                    v-model:group="curGroupList"
                    :config-radio-options="configRadioOptions"
                    :func-type-obj="curFuncTypeObj"
                ></GroupLoopConfigEdit>

                <m-modal
                    v-model:visible="showCloseCircuitConfirm"
                    :append-to="$modalAppendTo"
                    type="info"
                    :title="i18n.global.t('meos_control_web.confirm_exit')"
                    :content="i18n.global.t('meos_control_web.filled_content_not_recoverable')"
                    @close="noCloseCircuit"
                    @submit="confirmCloseCircuit"
                >
                </m-modal>
            </template>
            <template #footer>
                <m-button type="default" @click.stop="commonCancel">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" @click.stop="commonSave">{{ i18n.global.t('common.save') }}</m-button>
            </template>
        </m-modal>
    </div>
</template>

<script setup>
import { ref, watch, toRaw, inject } from 'vue';
import EditIcon from '@/assets/images/lighting-requirements/edit.svg?component';
// import CircuitSettingEdit from './CircuitSettingEdit.vue';
import GroupLoopConfigEdit from './GroupLoopConfigEdit.vue';
import { $Message } from 'meri-plus';
import { SMD_ALL_OPEN, SMD_ALL_CLOSE, SMD_PARTIAL_OPEN, NOT_CONFIGURED } from '../constants';
import { useCircuitGroupSettings } from '../hooks/useCircuitGroupSettings';
import i18n from '@/localization';

const MODE_GLOBAL = 'global';

const props = defineProps({
    params: {
        type: Object,
        default: () => {}
    },
    initSetting: {
        type: Array,
        default: () => []
    },
    initSpaceTypes: {
        type: Array,
        default: () => []
    },
    scopeSpaceTypes: {
        type: Array,
        default: () => []
    },
    mode: {
        type: String,
        default: 'global'
    },
    active: {
        type: Boolean,
        default: false
    }
});

const querySettingBase = inject('querySettingBase');
const initSapceTypeSetting = inject('initSapceTypeSetting');
const addSpaceType = inject('addSpaceType');
const resetAll = inject('resetAll');
const makeUnionByBase = inject('makeUnionByBase');
const makeUnionByInit = inject('makeUnionByInit');
const closeModeChangeConfirm = inject('closeModeChangeConfirm');
const confirmModeChange = inject('confirmModeChange');
const openOrCloseAll = inject('openOrCloseAll');
const partOpen = inject('partOpen');
const hasEditChanged = inject('hasEditChanged');
const saveCircuitTemp = inject('saveCircuitTemp');
const hasCircuitSettingsChange = inject('hasCircuitSettingsChange');
const resetLastSavedCircuit = inject('resetLastSavedCircuit');
const isCircuitAllNone = inject('isCircuitAllNone');
const updateFuncTypeCount = inject('updateFuncTypeCount');
const unionSetting = inject('unionSetting');
const showChangeModeConfirm = inject('showChangeModeConfirm');
const showCircuitModal = inject('showCircuitModal');
// const curLampObj = inject('curLampObj');
const curFuncTypeObj = inject('curFuncTypeObj');
const showCloseCircuitConfirm = inject('showCloseCircuitConfirm');
const unlawfulRecord = inject('unlawfulRecord');
const clickEditCircuit = inject('clickEditCircuit');
const curControlledObjType = inject('curControlledObjType');

const columnList = ref([
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.configuration_object'),
        width: 372
    },
    {
        dataIndex: 'summary',
        title: i18n.global.t('meos_control_web.loop_config_statistics'),
        ellipsis: true,
        width: 248
    },
    {
        dataIndex: 'ops',
        title: `${i18n.global.t('meos_control_web.operation1')}`,
        width: 172
    }
]);

const { configRadioOptions, curConfigRadio, curGroupList, resetLastSavedGroup, saveGroupSetting, closeGroupModal } = useCircuitGroupSettings(
    curFuncTypeObj,
    curControlledObjType,
    showCircuitModal,
    unionSetting,
    showCloseCircuitConfirm
);

const noCloseCircuit = () => {};
const confirmCloseCircuit = () => {
    if (curFuncTypeObj?.value?.radioConfig) {
        curConfigRadio.value = curFuncTypeObj?.value?.radioConfig;
    } else if (curFuncTypeObj.value?.circuitGroupSettings?.length) {
        curConfigRadio.value = 'group';
    } else {
        curConfigRadio.value = 'loop';
    }

    resetLastSavedCircuit();
    // TODO 记录上次group的数据
    resetLastSavedGroup();
    showCircuitModal.value = false;
};

const commonCancel = () => {
    if (curConfigRadio?.value === 'group') {
        closeGroupModal();
    } else {
        closeCircuitModal();
    }
};

const closeCircuitModal = () => {
    console.log('closeCircuitModal');
    const newLoop = curFuncTypeObj.value?.circuitSettings?.filter(s => (s?.settingMode ?? NOT_CONFIGURED) !== NOT_CONFIGURED);
    const hasGroupConfig = curGroupList.value?.some(s => (s?.lastSavedMode ?? NOT_CONFIGURED) !== NOT_CONFIGURED);
    // 之前未配置回路，则弹窗确认，转为编组配置
    if (!newLoop.length && hasGroupConfig) {
        showCloseCircuitConfirm.value = true;
        return;
    }
    // if (hasCircuitSettingsChange(curLampObj.value?.circuitSettings)) {
    if (hasCircuitSettingsChange(curFuncTypeObj.value?.circuitSettings)) {
        showCloseCircuitConfirm.value = true;
    } else {
        const preRadio = curFuncTypeObj.value?.radioConfig;
        if (preRadio === 'group') {
            curConfigRadio.value = 'group';
            curFuncTypeObj.value.radioConfig = 'group';
        }
        showCircuitModal.value = false;
    }
};

const commonSave = () => {
    if (curConfigRadio?.value === 'group') {
        saveGroupSetting();
    } else {
        saveCircuitSetting();
    }
};

const afterPartOpen = row => {
    partOpen?.(row);
    if (row?.settingMode === NOT_CONFIGURED) {
        curConfigRadio.value = 'group';
    }
};

const afterConfirmClear = () => {
    const curEditToMode = confirmModeChange?.();
    // 部分开启点击部分开启、全开、全关，确认后都清空编组配置，点击部分开启即无配置，则默认选中编组，点击全开全关则默认选中回路
    if (curEditToMode !== NOT_CONFIGURED) {
        configRadioOptions.value = configRadioOptions.value.map(s => ({ ...s, defaultSelected: s.value === 'loop' }));
    } else {
        configRadioOptions.value = configRadioOptions.value.map(s => ({ ...s, defaultSelected: s.value === 'group' }));
    }
};

const saveCircuitSetting = () => {
    if (isCircuitAllNone()) {
        console.log('未配置任何回路');
        $Message.error({ title: i18n.global.t('meos_control_web.no_circuit_configured'), duration: 500 });
        return;
    }
    saveCircuitTemp();
    curFuncTypeObj.value.radioConfig = 'loop';
    // curLampObj.value.settingMode = SMD_PARTIAL_OPEN;
    curFuncTypeObj.value.settingMode = SMD_PARTIAL_OPEN;
    showCircuitModal.value = false;

    // const funcTypeObj = unionSetting.value.find(obj => {
    //     return obj.funcType === curLampObj.value.parentFuncType;
    // });
    const funcTypeObj = curFuncTypeObj.value;
    updateFuncTypeCount(funcTypeObj);
};

const cellClassNameFn = (row, col) => {
    if (col.dataIndex === 'ops') {
        return ['ops-cell'];
    } else if (col.dataIndex === 'name' && row.children?.length > 0) {
        return ['name-p-cell'];
    }
    return [];
};

watch(
    () => props.active,
    newVal => {
        // console.log('active--newVal: ', newVal);
        if (newVal) {
            if (props.mode === MODE_GLOBAL) {
                if (!props.initSetting?.length) {
                    querySettingBase().then(rst => {
                        if (rst.code === '00000') {
                            const baseSetting = rst.data;
                            makeUnionByBase(baseSetting);
                        }
                    });
                } else {
                    makeUnionByInit(toRaw(props.initSetting));
                }
                // console.log('unionSetting.value', unionSetting.value);
            } else {
                if (!props.scopeSpaceTypes?.length) {
                    console.warn('可配置空间类型列表为空，请确认！');
                    return;
                }
                if (props.initSpaceTypes?.length > 0) {
                    // 编辑配置过的数据
                    if (!props.initSetting?.length) {
                        console.warn('待编辑的setting数据为空，请确认！');
                        return;
                    }
                    makeUnionByInit(toRaw(props.initSetting), 0);
                    initSapceTypeSetting(props.scopeSpaceTypes, props.initSpaceTypes);
                }
            }
        } else {
            resetAll();
        }
    },
    { immediate: true }
);
onBeforeUnmount(() => {
    resetAll();
});
defineExpose({
    addSpaceType,
    hasEditChanged
});
</script>
<style lang="less">
.functype-config-table .meri-table {
    .ops-cell {
        padding: 10px 12px 10px 8px;
    }
    .name-p-cell {
        padding: 4px;
    }
}
.functype-cfg-table-err-tips {
    padding: 8px 12px !important;
    background-color: var(--red-500) !important;
    border-radius: 8px !important;
    .m-flexible-overlay__arrow {
        border-top-color: var(--red-500) !important;
    }
}
</style>
<style lang="less" scoped>
.functype-config-table {
    height: 100%;

    .funcs-table {
        height: calc(100% - 28px);
    }
    .row-name {
        color: var(--gray-900);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
    .row-summary {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 4px;

        color: var(--gray-600);
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
        span {
            // flex: 1;
            max-width: calc(100% - 18px);
            // max-width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .edit-icon {
            cursor: pointer;
            &:hover {
                background: var(--alpha-30);
                border-radius: 2px;
            }
        }
    }

    .op-warp {
        display: flex;
        align-items: center;
        gap: 8px;
        .item {
            padding: 3px 4px;
            color: var(--blue-500);
            text-align: center;
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
            border-radius: 4px;
            cursor: pointer;
            &.act {
                background: var(--blue-100);
            }
            &.err {
                border: 1px solid var(--red-500);
            }
            &:hover {
                background: var(--alpha-30);
            }
        }
    }
}
</style>
<style lang="less">
.m-modal-bg .m-modal-main {
    .m-modal-main-content.funcTypeConfigTableContent {
        padding-block: 12px;
    }
}
</style>
