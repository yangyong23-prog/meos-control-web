<template>
    <div>
        <m-modal
            :key="new Date().getTime()"
            v-model:visible="visibleModel"
            :append-to="$modalAppendTo"
            type="default"
            :title="i18n.global.t('meos_control_web.space_type_config')"
            width="1260"
            :top-y="120"
            align-center
            content-class-name="light-req-spaces-set-modal"
            :auto-close="false"
            @close="closeModals"
        >
            <template #content>
                <div class="space-content">
                    <div class="content-left">
                        <m-select v-model="selectValue2" :options="list" panel-searchable multiple @blur="handleList(selectValue2)">
                            <template #trigger="scope">
                                <m-button type="link" size="medium" icon="IconMeriComponentButtonAdd" @click="clickSelectScreen">{{
                                    i18n.global.t('meos_control_web.add_space_type')
                                }}</m-button>
                                <span v-for="item in scope" :key="new Date().getTime() + item.id" class="select-item">{{ item.name }}</span>
                            </template>
                        </m-select>
                        <div class="left-list">
                            <m-scrollbar ref="scrollbarRef">
                                <div v-for="(item, idx) in selectList" :key="new Date().getTime() + item.id" class="list-display">
                                    <span>
                                        {{ item.name }}
                                    </span>
                                    <IconMeriComponentClose @click="iconDel(item, idx)" />
                                </div>
                            </m-scrollbar>
                        </div>
                    </div>
                    <div class="content-right">
                        <div class="right-header">
                            <div class="header">
                                <div class="title">{{ i18n.global.t('meos_control_web.lighting_config') }}</div>
                            </div>
                            <div class="all-statistics">
                                {{ i18n.global.t('meos_control_web.loop_colon') }}
                                <template v-if="allStatistics.total > 0">
                                    {{ i18n.global.t('common.total_count') }}
                                    <span>{{ allStatistics.total }}</span>
                                    / {{ i18n.global.t('common.status_open') }}
                                    <span>{{ allStatistics.openCount }}</span>
                                    / {{ i18n.global.t('meos_control_web.unconfiged') }}
                                    <span>{{ allStatistics.noCount }}</span>
                                </template>
                                <template v-else> -- </template>
                            </div>
                        </div>
                        <FunctypeConfigTable
                            ref="functypeCfgTable"
                            class="func-table"
                            :active="modelValue && !!scopeSpaceTypes"
                            :mode="'spaceType'"
                            :init-setting="initSpaces?.funcTypeSettings"
                            :scope-space-types="scopeSpaceTypes"
                            :init-space-types="initSpaces?.spaceFuncTypes"
                        >
                        </FunctypeConfigTable>
                    </div>
                </div>
                <m-modal
                    v-model:visible="showDelConfirm"
                    :append-to="$modalAppendTo"
                    type="info"
                    :title="i18n.global.t('meos_control_web.confirm_delete_dup')"
                    :content="i18n.global.t('meos_control_web.loop_configured_under_space_type_will_be_removed')"
                    @submit="sureDelConfirm"
                >
                </m-modal>
                <m-modal
                    v-model:visible="showExitConfirm"
                    :append-to="$modalAppendTo"
                    type="info"
                    :title="i18n.global.t('meos_control_web.confirm_exit')"
                    :content="i18n.global.t('meos_control_web.filled_content_not_recoverable')"
                    @submit="sureExitConfirm"
                >
                </m-modal>
                <m-modal
                    v-model:visible="showSaveConfirm"
                    :append-to="$modalAppendTo"
                    type="info"
                    :title="i18n.global.t('meos_control_web.confirm_save_changes')"
                    :content="i18n.global.t('meos_control_web.obj_will_drop_parent_config')"
                    @submit="sureSaveConfirm"
                >
                </m-modal>
            </template>
            <template #footer>
                <m-button type="default" @click.stop="closeModals(false)">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" :loading="isSaveLoading" @click.stop="saveSpaces(false)">{{ i18n.global.t('common.confirm') }}</m-button>
            </template>
        </m-modal>
    </div>
</template>
<script setup>
import { IconMeriComponentClose } from 'meri-icon';
import FunctypeConfigTable from './FunctypeConfigTable.vue';
import useFunctypeConfigEdit from '../hooks/useFunctypeConfigEdit';
import { querySpaceFuncTypeList } from '@/apis/lightingRequirements';
import { lightingQuerySpaceFuncTypeList } from '@/apis/lightingControl';
import baseStore from '@/store/baseStore';
import { $Message } from 'meri-plus';
import i18n from '@/localization';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    // 引用自上级
    isQuote: {
        type: Boolean,
        default: false
    },
    initSpaces: {
        type: Object,
        default: () => {}
    },
    defaultData: {
        type: Object,
        default: () => {}
    },
    typeDistinction: {
        type: String,
        default: () => ''
    }
});

const curSelectedPeriodId = inject('curSelectedPeriodId');
const curControlledObjId = inject('curControlledObjId');
const curControlledObjType = inject('curControlledObjType');
const templateType = inject('templateType');
const instanceTypeVisible = inject('instanceTypeVisible');
const indIdVisible = inject('indIdVisible');

const { allStatistics, isSaveLoading, saveSpaceEdit, genDataForSave, genShowResultData, addSpaceType, hasRemovedForSpaceTypeDel, deleteSpaceType } = useFunctypeConfigEdit();

//  空间类型
const selectValue2 = ref([]);
// 选中 展示列数据
const selectList = ref([]);
// 备份删除数据回填到空间类型内
const selectListBack = ref([]);
const functypeCfgTable = ref();

const showDelConfirm = ref(false);
const showExitConfirm = ref(false);
const showSaveConfirm = ref(false);

let curDelItemIdx = {},
    abortController = null;
const scopeSpaceTypes = ref(null);

const emits = defineEmits(['update:modelValue', 'afterSave']);

const visibleModel = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});

//需求配置
const querySpaceTypeBase = () => {
    let params = {
        projectId: baseStore().projectId,
        templateId: baseStore().templateId,
        sceneId: curSelectedPeriodId?.value,
        instanceId: curControlledObjId.value[0],
        referenceStatus: props.isQuote ? 1 : 0
    };
    params.instanceType = curControlledObjType?.value;
    abortController?.abort();
    abortController = new AbortController();
    querySpaceFuncTypeList(params, abortController.signal).then(res => {
        const { code, data } = res;

        if (code === '00000') {
            scopeSpaceTypes.value = data;

            list.value = data.filter(item => {
                item.id = item.spaceFuncType;
                item.name = item.spaceFuncTypeName;
                return !item.select;
            });
            selectList.value = [];

            if (props.initSpaces?.spaceFuncTypes?.length > 0) {
                props.initSpaces.spaceFuncTypes.forEach(item => {
                    const s = data.find(obj => {
                        return obj.id === item.key;
                    });
                    if (s) {
                        selectList.value.push(s);
                    }
                });
            }
        }
    });
};
//照明配置
const getQuerySpaceFuncTypeList = () => {
    let params = {
        interventionId: '',
        projectId: baseStore().projectId,
        instanceId: indIdVisible.value,
        instanceType: instanceTypeVisible.value,
        demandTemplateType: templateType.value
    };
    abortController?.abort();
    abortController = new AbortController();
    lightingQuerySpaceFuncTypeList(params, abortController.signal).then(res => {
        const { code, data } = res;

        if (code === '00000') {
            scopeSpaceTypes.value = data;
            selectList.value = [];

            list.value = data.filter(item => {
                item.id = item.spaceFuncType;
                item.name = item.spaceFuncTypeName;
                return !props.defaultData?.space.settings.find(obj => obj.spaceFuncTypes.find(s => s.key === item.spaceFuncType));
                // return !item.select;
            });
            console.log(props, 'props.initSpaces');
            if (props.initSpaces?.spaceFuncTypes?.length > 0) {
                props.initSpaces.spaceFuncTypes.forEach(item => {
                    const s = data.find(obj => {
                        return obj.id === item.key;
                    });
                    if (s) {
                        selectList.value.push(s);
                    }
                });
            }
        }
    });
};
watch(
    () => props.modelValue,
    val => {
        if (val) {
            scopeSpaceTypes.value = null;
            selectList.value = [];
            if (props.typeDistinction === 'illumination') {
                getQuerySpaceFuncTypeList();
            } else {
                querySpaceTypeBase();
            }
        }
    }
);

// 筛选判断是否有选中数据
const clickSelectScreen = () => {
    selectValue2.value = [];
    if (selectListBack.value.length > 0) {
        nextTick(() => {
            list.value = list.value.concat(selectListBack.value);
        });
    }

    list.value = list.value.filter(obj => {
        return !selectList.value.find(item => item.id === obj.id);
    });
    // console.log('after---list.value: ', list.value.length);
    selectListBack.value = [];
};
const deleteSelItem = () => {
    if (curDelItemIdx.value) {
        selectList.value.splice(curDelItemIdx.idx, 1);
        if (list.value.findIndex(obj => obj.id === curDelItemIdx.value?.id) < 0) {
            list.value.unshift(curDelItemIdx.value);
        }
        deleteSpaceType(curDelItemIdx.value);
        delete curDelItemIdx.value;
        delete curDelItemIdx.idx;
    }
};
// 删除 选中数据
const iconDel = (val, idx) => {
    curDelItemIdx.value = val;
    curDelItemIdx.idx = idx;
    if (hasRemovedForSpaceTypeDel(val)) {
        showDelConfirm.value = true;
    } else {
        deleteSelItem();
    }
};
// 处理list对比选中数据
const handleList = val => {
    console.log('val: ', val);
    val.forEach(id => {
        const item = list.value.find(obj => obj.id === id);
        if (item && !selectList.value.find(res => res.id === id)) {
            console.log('item: ', item);
            addSpaceType(item);
            selectList.value.push(item);
        }
    });
};

const list = ref([]);

const _closeThisModal = item => {
    console.log('item', item);
    selectValue2.value = [];
    list.value = [];
    selectList.value = [];
    curDelItemIdx = {};
    scopeSpaceTypes.value = null;
    emits('update:modelValue');
};
const hasEditChange = () => {
    let hadChanged = false;
    console.log('hadChanged: ', hadChanged);
    if (props.initSpaces?.spaceFuncTypes?.length > 0) {
        if (props.initSpaces.spaceFuncTypes.length !== selectList.value.length) {
            return true;
        } else {
            selectList.value.forEach(obj => {
                const k = props.initSpaces.spaceFuncTypes.find(item => item.key === obj.spaceFuncType);
                if (!k) {
                    hadChanged = true;
                }
            });
            if (hadChanged) {
                return true;
            }
        }
    } else {
        if (selectList.value.length > 0) {
            return true;
        }
    }
    return functypeCfgTable.value?.hasEditChanged();
};
const closeModals = () => {
    if (hasEditChange()) {
        showExitConfirm.value = true;
    } else {
        _closeThisModal();
    }
};
const _saveData = async (saveOther, globalSettings) => {
    if (selectList.value.length <= 0) {
        $Message.error({ title: i18n.global.t('meos_control_web.please_add_space_type_and_config') });
        return;
    }
    // if (verificSaveData()) {
    // }
    const spaces = selectList.value.map(obj => {
        return {
            key: obj.id,
            value: obj.name
        };
    });
    const _settings = genDataForSave();
    const _showSettings = genShowResultData();
    console.log('_settings: ', _settings);
    const configId = props.initSpaces?.configId;
    const spaceSettingsObj = { spaceFuncTypes: spaces, funcTypeSettings: _settings };
    if (configId) {
        spaceSettingsObj.configId = configId;
    }
    let spaceTypes = null;
    if (saveOther) {
        // 有引用的保存，需要保存其它
        // params.spaceSettings = [spaceSettingsObj];
        spaceTypes =
            props.defaultData?.space?.settings?.map(c => {
                if (c.configId === configId) {
                    return spaceSettingsObj;
                } else {
                    return c;
                }
            }) || [];
        // 若新建
        if (!configId) {
            spaceTypes.push(spaceSettingsObj);
        }
    } else {
        spaceTypes = [spaceSettingsObj];
    }

    if (props.typeDistinction !== 'illumination') {
        await saveSpaceEdit(spaces, spaceTypes, globalSettings);
    }
    emits('afterSave', {
        saveData: spaceTypes,
        showData: [{ spaceFuncTypes: spaces, funcTypeSettings: _showSettings }]
    });
    _closeThisModal();
};
const saveSpaces = () => {
    if (isSaveLoading?.value) {
        return;
    }
    if (props.isQuote) {
        showSaveConfirm.value = true;
        return;
    }
    console.log('closeModals');
    _saveData();
};

const sureSaveConfirm = () => {
    _saveData(true, props.defaultData?.global?.funcTypeSettings);
};

const sureDelConfirm = () => {
    deleteSelItem();
};
const sureExitConfirm = () => {
    _closeThisModal();
};
</script>
<style>
.light-req-spaces-set-modal {
    padding: 0 24px !important;
}
</style>
<style lang="less" scoped>
.space-content {
    display: flex;
    height: 100%;
    .content-left {
        width: 200px;
        height: 100%;
        align-items: flex-start;
        padding-top: 20px;
        border-right: 1px solid #e5e5e5;
        .left-span {
            color: #246fe5;
            cursor: pointer;
        }
        .left-list {
            height: calc(100% - 32px);
            .list-display {
                display: flex;
                margin: 8px 12px 8px 0;
                padding: 4px 8px;
                justify-content: space-between;
                align-items: center;
                align-self: stretch;
                border-radius: 4px;
                background: var(--gray-200, #e8ecf0);
                svg {
                    cursor: pointer;
                }
            }
        }
    }
    .content-right {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin: 0 12px;
        .right-header {
            width: 100%;
            // height: 32px;
            padding: 20px 0 8px 0;
            line-height: 32px;
            display: flex;
            justify-content: space-between;
            .header {
                padding: 5px 0;
                .title {
                    display: flex;
                    width: 136px;
                    gap: 9px;
                    align-items: center;
                    &::before {
                        display: block;
                        content: ' ';
                        width: 3px;
                        height: 14px;
                        background-color: var(--blue-500);
                    }
                    color: var(--gray-800);
                    text-overflow: ellipsis;
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 24px; /* 150% */
                }
            }
            .all-statistics {
                display: flex;
                align-items: center;
                gap: 4px;
                color: var(--gray-600);
                font-size: 12px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 20px; /* 166.667% */
                span {
                    color: var(--gray-900);
                    // display: inline-block;
                    // width: 3px;
                    // height: 14px;
                    // flex-shrink: 0;
                    // margin-right: 9px;
                    // background: var(--blue-500, #246fe5);
                }
            }
        }
        .func-table {
            flex: 1;
            overflow: hidden;
        }
    }
}
</style>
