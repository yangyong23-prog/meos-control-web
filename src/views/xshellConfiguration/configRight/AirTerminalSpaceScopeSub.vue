<template>
    <div class="air-terminal-space-scope-sub">
        <div
            ref="loadingElement"
            class="container-loading"
            :style="{
                visibility: isSpaceScopeLoading ? 'visible' : 'hidden'
            }"
        ></div>
        <div v-show="!isSpaceScopeLoading" class="sub-content" :style="{ height: `${Math.round(height)}px` }">
            <div class="mode-row">
                <span class="mode-title">{{ i18n.global.t('meos_control_web.air_terminal_scope_select_mode') }}</span>
                <m-radio-group v-model="scopeMode">
                    <div class="mode-radios-box">
                        <m-radio :label="'FULL'">{{ i18n.global.t('meos_control_web.air_terminal_scope_mode_all') }}</m-radio>
                        <m-radio :label="'CUSTOM'">{{ i18n.global.t('meos_control_web.air_terminal_scope_mode_whitelist') }}</m-radio>
                    </div>
                </m-radio-group>
            </div>

            <div v-if="!isWhitelistMode" class="mode-tips">
                {{ modeTips }}
            </div>

            <div v-if="isWhitelistMode" class="space-scope-toolbar">
                <span class="toolbar-title">{{ i18n.global.t('meos_control_web.please_select_space_range') }}</span>
                <div class="toolbar-actions">
                    <m-button type="link" size="medium" class="toolbar-link-btn" @click="openAddByIotModal">
                        {{ i18n.global.t('meos_control_web.air_terminal_scope_add_by_iot') }}
                    </m-button>
                    <div class="toolbar-divider"></div>
                    <m-button type="link" size="medium" class="toolbar-link-btn" @click="openAddBySpaceMapModal">
                        {{ i18n.global.t('meos_control_web.air_terminal_scope_add_by_floor') }}
                    </m-button>
                </div>
            </div>

            <div class="table-header-row">
                <span class="table-title">{{ i18n.global.t('meos_control_web.space_list') }}</span>
                <div v-if="!isDataEmpty" class="table-right-tools">
                    <m-search v-model="keyword" :width="240" type="enter" :placeholder="i18n.global.t('meos_control_web.search_space_name')" />
                    <m-popconfirm
                        v-if="isWhitelistMode"
                        status="danger"
                        :content="i18n.global.t('meos_control_web.air_terminal_scope_confirm_remove_all_desc')"
                        :confirm-button-text="i18n.global.t('meos_control_web.air_terminal_scope_remove')"
                        @confirm="confirmClearAll"
                    >
                        <m-button type="default" size="medium" class="remove-all-btn" :disabled="!whitelistSpaceIds.length">
                            {{ i18n.global.t('meos_control_web.air_terminal_scope_remove_all') }}
                        </m-button>
                    </m-popconfirm>
                </div>
            </div>

            <div class="space-table-wrap">
                <div v-show="spaceListLoading" class="table-loading"></div>
                <template v-if="!spaceListLoading">
                    <div v-if="isDataEmpty" class="empty-wrapper">
                        <Empty :text="i18n.global.t('meos_control_web.no_content')" />
                    </div>
                    <template v-else>
                        <m-table
                            :key="`${scopeMode}-${tableResetKey}`"
                            :columns="tableColumns"
                            :data-source="finalTableData"
                            :column-line="true"
                            :checkbox="isWhitelistMode"
                            :empty-text="i18n.global.t('common.no_data')"
                            class="space-table"
                            @checked-change="handleCheckedChange"
                        >
                            <template #tooltip="{ checkeds }">
                                <div v-if="isWhitelistMode && checkeds?.length" class="batch-toolbar">
                                    <span class="batch-toolbar-text">
                                        {{ i18n.global.t('meos_control_web.selected') }}
                                        <i class="batch-toolbar-number">{{ checkeds.length }}</i>
                                        {{ i18n.global.t('meos_control_web.item') }}
                                    </span>
                                    <m-button type="primary" size="small" class="batch-toolbar-btn" @click="handleRemoveSelected(checkeds)">
                                        {{ i18n.global.t('meos_control_web.air_terminal_scope_remove') }}
                                    </m-button>
                                </div>
                            </template>
                            <template #buildingName="row">
                                <div v-ellipsis class="ellipsis-two-line">{{ row.buildingName }}</div>
                            </template>
                            <template #floorName="row">
                                <div v-ellipsis class="ellipsis-two-line">{{ row.floorName }}</div>
                            </template>
                            <template #spaceName="row">
                                <div v-ellipsis class="ellipsis-two-line">{{ row.spaceName }}</div>
                            </template>
                            <template #iotTags="row">
                                <div v-if="row.iotTags.length" class="col-iot">
                                    <m-tag v-for="tag in row.iotTags" :key="`${row.id}-${tag}`" size="small" color="#1A4ACB" bg-color="#DBECFF">
                                        {{ tag }}
                                    </m-tag>
                                </div>
                                <span v-else>{{ '--' }}</span>
                            </template>
                            <template #ops="row">
                                <m-button type="link" size="medium" class="row-remove-btn" @click="handleRemoveSpace(row.id)">
                                    {{ i18n.global.t('meos_control_web.air_terminal_scope_remove') }}
                                </m-button>
                            </template>
                        </m-table>
                        <m-pagination
                            v-show="!!paginationData.total"
                            v-model:page-num="paginationData.pageNum"
                            class="page-container"
                            background
                            :total="paginationData.total"
                            :page-size="paginationData.pageSize"
                            :sizes-list="[20, 50, 100, 200, 300, 400, 500]"
                            layout="total,prev,pager,next,sizes"
                            style="justify-self: end"
                            @page-change="pageChange"
                            @size-change="sizeChange"
                        ></m-pagination>
                    </template>
                </template>
            </div>
        </div>

        <m-modal
            v-model:visible="showAddByIotModal"
            :append-to="$modalAppendTo"
            :title="i18n.global.t('meos_control_web.air_terminal_scope_iot_modal_title')"
            :width="420"
            :height="420"
            align-center
            :need-scrollbar="true"
            :escable="false"
            :auto-close="false"
            modal-class-name="add-by-iot-modal"
            @close="closeAddByIotModal"
        >
            <template #content>
                <div v-show="showIotLoading" class="loading-iot-container"></div>
                <div v-if="!showIotLoading" class="iot-modal-content">
                    <div class="iot-modal-desc">{{ i18n.global.t('meos_control_web.air_terminal_scope_iot_modal_desc') }}</div>
                    <m-checkbox-group v-model="iotSelectedConditions" class="iot-modal-checkbox-group">
                        <m-checkbox v-for="option in iotConditionOptions" :key="option.code" :label="option.code" class="iot-modal-checkbox">
                            <span>
                                <template v-for="segment in option.segments" :key="`${option.code}-${segment.text}-${segment.class || 'plain'}`">
                                    <span :class="segment.class">{{ segment.text }}</span>
                                </template>
                            </span>
                        </m-checkbox>
                    </m-checkbox-group>
                </div>
            </template>
            <template #footer>
                <div class="iot-modal-footer">
                    <m-button type="default" size="medium" @click="closeAddByIotModal">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="medium" :loading="addByIotLoading" @click="confirmAddByIot">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </template>
        </m-modal>
        <TreeWithMapForSpaceSelectModal
            v-model="showAddBySpaceMapModal"
            :title="i18n.global.t('meos_control_web.air_terminal_scope_add_by_floor')"
            :tree-data-loading="spaceTreeLoading"
            :tree-data="spaceTreeData"
            :is-all-checkable="true"
            :empty-text="i18n.global.t('meos_control_web.no_configurable_content')"
            :open-clear-cache="true"
            :open-reset-default-selected="true"
            :before-confirm-callback="beforeConfirmCallback"
            @submit="confirmAddBySpaceMap"
        />
    </div>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import { useElementBounding } from '@vueuse/core';
import i18n from '@/localization';
import Empty from '@/components/common/Empty.vue';
import { MLoading, $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import TreeWithMapForSpaceSelectModal from '@/views/Common/TreeWithMapForSpaceSelectModal/index.vue';
import { useAirTerminalSpaceScope } from './composables/useAirTerminalSpaceScope';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';
import { submitWhitelist } from '@/apis/xshellConfiguration';
import { AIR_TERMINAL, GeneralZone, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';

const LEFT_ACTIVE_MENU_ID = ACTIVE_MENUS_ID_ENUM.VIEW_HALF_SECTION_SETTING;

const loadingInstance = ref();
const loadingContainerInstance = ref();
const loadingIotInstance = ref();
const closeLoading = (isContainer = false, isIot = false) => {
    if (isContainer) {
        loadingContainerInstance.value?.destroy?.();
    } else if (isIot) {
        loadingIotInstance.value?.destroy?.();
    } else {
        loadingInstance.value?.destroy?.();
    }
};
const submitLoading = ref(false);
const setLoading = (isContainer = false, isIot = false) => {
    if (isContainer) {
        loadingContainerInstance.value?.destroy?.();
        loadingContainerInstance.value = MLoading.service({
            target: '.container-loading',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    } else if (isIot) {
        loadingIotInstance.value?.destroy?.();
        loadingIotInstance.value = MLoading.service({
            target: '.loading-iot-container',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    } else {
        loadingInstance.value?.destroy?.();
        loadingInstance.value = MLoading.service({
            target: '.table-loading',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    }
};

const emits = defineEmits(['update']);
const showSubPage = defineModel('show', { default: false, type: Boolean });
const scopeMode = defineModel('scopeMode', { default: 'FULL', type: String });
const lastSavedWhitelistConfig = defineModel('lastSavedWhitelistConfig', { default: () => ({}), type: Object });
const isSpaceScopeLoading = defineModel('loading', { default: false, type: Boolean });

const keyword = ref('');

const {
    referencedSpaceList,
    buildingFloorSpaceList,
    whitelistSpaceIds,
    tableResetKey,
    spaceListLoading,
    showAddByIotModal,
    iotConditionOptions,
    iotSelectedConditions,
    addByIotLoading,
    showIotLoading,
    showAddBySpaceMapModal,
    spaceTreeLoading,
    spaceTreeData,
    beforeConfirmCallback,
    initSpaceScopeData,
    setLastSavedWhiteList,
    handleCheckedChange,
    handleRemoveSpace,
    handleRemoveSelected,
    openAddBySpaceMapModal,
    openAddByIotModal,
    closeAddByIotModal,
    confirmAddByIot,
    confirmAddBySpaceMap,
    confirmClearAll
} = useAirTerminalSpaceScope();

const baseColumns = [
    {
        dataIndex: 'buildingName',
        title: i18n.global.t('common.build'),
        width: 162,
        ellipsis: true
    },
    {
        dataIndex: 'floorName',
        title: i18n.global.t('common.floor'),
        width: 84,
        minWidth: 84,
        ellipsis: true
    },
    {
        dataIndex: 'spaceName',
        title: i18n.global.t('meos_control_web.space_name'),
        minWidth: 84,
        ellipsis: true
    },
    {
        dataIndex: 'iotTags',
        title: i18n.global.t('meos_control_web.iot_monitoring'),
        width: 320,
        minWidth: 84
    }
];

const el = useTemplateRef('loadingElement');
const { height } = useElementBounding(el);

const finalTableData = ref([]);

// 分页数据
const paginationData = ref({
    pageNum: 1,
    pageSize: 20,
    total: 0
});

const modeTips = computed(() => {
    return scopeMode.value === 'CUSTOM'
        ? i18n.global.t('meos_control_web.air_terminal_scope_mode_whitelist_tips')
        : i18n.global.t('meos_control_web.air_terminal_scope_mode_all_tips');
});

const isWhitelistMode = computed(() => scopeMode.value === 'CUSTOM');

const tableColumns = computed(() => {
    if (isWhitelistMode.value) {
        return [
            ...baseColumns,
            {
                dataIndex: 'ops',
                title: i18n.global.t('meos_control_web.operation_column'),
                width: 84,
                minWidth: 84,
                maxWidth: 84
            }
        ];
    } else {
        return baseColumns;
    }
});

const normalizeText = text => (text || '').toString().trim().toLowerCase();
const isDataEmpty = computed(() => {
    const list = isWhitelistMode.value ? buildingFloorSpaceList.value : referencedSpaceList.value;
    return !list?.length;
});

const visibleSpaceList = computed(() => {
    const whitelistSet = new Set(whitelistSpaceIds.value);
    const sourceList = isWhitelistMode.value ? buildingFloorSpaceList.value.filter(item => whitelistSet.has(item.id)) : referencedSpaceList.value;
    const searchText = normalizeText(keyword.value);
    return sourceList.filter(item => {
        if (!searchText) return true;
        return normalizeText(item.spaceName).includes(searchText);
    });
});

const isSameConfig = computed(() => {
    const { whitelistType = 'FULL', objects } = lastSavedWhitelistConfig.value || {};
    const isSameMode = scopeMode.value === whitelistType;
    const isSameCustomList =
        whitelistSpaceIds.value?.length &&
        whitelistSpaceIds.value?.length === objects?.length &&
        whitelistSpaceIds.value.every(id => objects?.some(item => item.id === id)) &&
        objects?.every(item => whitelistSpaceIds.value.includes(item.id));
    if (whitelistType === 'FULL') {
        return isSameMode;
    } else {
        return isSameMode && isSameCustomList;
    }
});

watch(
    () => isSpaceScopeLoading.value,
    val => {
        if (val) {
            setLoading(true);
        } else {
            closeLoading(true);
        }
    }
);

watch(
    () => spaceListLoading.value,
    val => {
        if (val) {
            setLoading(false);
        } else {
            closeLoading(false);
        }
    }
);

watch(
    () => showIotLoading.value,
    val => {
        if (val) {
            setLoading(false, true);
        } else {
            closeLoading(false, true);
        }
    }
);

watch(
    () => scopeMode.value,
    () => {
        keyword.value = '';
        if (scopeMode.value === 'CUSTOM' && spaceListLoading.value) {
            spaceListLoading.value = false;
        }
        // 如果切换到全量模式且当前没有引用空间数据，则需要重新拉取数据
        if (scopeMode.value === 'FULL' && !referencedSpaceList.value?.length) {
            initSpaceScopeData(true);
        }
    }
);

watch(
    () => lastSavedWhitelistConfig.value,
    cur => {
        if (cur?.whitelistType === 'CUSTOM') {
            // 白名单模式下，回显需要更新空间范围数据
            setLastSavedWhiteList(cur, true);
        } else {
            initSpaceScopeData(true);
        }
    }
);

watch([() => isSameConfig.value, () => showSubPage.value], () => {
    if (showSubPage.value) {
        emitter.emit('confirmDisabled', { status: isSameConfig.value, isSave: true });
    }
});

const filterData = () => {
    if (paginationData.value.pageNum <= 0) {
        paginationData.value.pageNum = 1;
    }
    const data = visibleSpaceList.value;
    paginationData.value.total = data.length;
    const rows = [];
    data.slice((paginationData.value.pageNum - 1) * paginationData.value.pageSize, paginationData.value.pageNum * paginationData.value.pageSize).forEach(item => {
        rows.push({
            ...item
        });
    });
    nextTick(() => {
        finalTableData.value = rows;
    });
};

const pageChange = val => {
    paginationData.value.pageNum = val;
    filterData();
};

const sizeChange = size => {
    paginationData.value.pageSize = +size;
    filterData();
};

watch(
    [() => spaceListLoading.value, () => visibleSpaceList.value],
    () => {
        if (!spaceListLoading.value && Array.isArray(visibleSpaceList.value)) {
            filterData();
        }
    },
    {
        immediate: true
    }
);

const submitData = () => {
    if (submitLoading.value) return;
    if (isWhitelistMode.value && !whitelistSpaceIds.value?.length) {
        // 请至少选择一个空间
        $Message.error({ title: `${i18n.global.t('meos_control_web.please_select_at_least_one_zone')}` });
        return;
    }
    //localName: item.spaceName, floorId: item.floorId
    let finalObjects = [];
    if (isWhitelistMode.value) {
        finalObjects = buildingFloorSpaceList.value
            .filter(item => whitelistSpaceIds.value.includes(item.id))
            .map(item => ({
                id: item.id,
                objType: OBJ_TYPE.SPACE,
                classCode: GeneralZone
            }));
    }
    const submitConfig = {
        runningMonitorType: AIR_TERMINAL,
        whitelistType: scopeMode.value,
        objType: OBJ_TYPE.SPACE,
        ...(finalObjects?.length ? { objects: finalObjects } : {})
    };
    submitLoading.value = true;
    submitWhitelist(submitConfig)
        .then(res => {
            if (res?.code === SUCCESSCODE) {
                $Message.success({ title: `${i18n.global.t('common.save_success')}` });
                keyword.value = '';
                // initSpaceScopeData(false);
                emitter.emit('confirmDisabled', { status: true, isSave: true });
                emits('update');
            }
        })
        .finally(() => {
            submitLoading.value = false;
        });
};

const resetData = () => {
    scopeMode.value = lastSavedWhitelistConfig.value?.whitelistType || 'FULL';
    setLastSavedWhiteList(lastSavedWhitelistConfig.value, false);
    tableResetKey.value += 1;
    keyword.value = '';
};

const handleInputEmitter = data => {
    if (data.menu === LEFT_ACTIVE_MENU_ID && showSubPage.value) {
        if (data.type === 'confirm') {
            submitData();
        } else if (data.type === 'cancel') {
            resetData();
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        }
    }
};

emitter.on('InputEmitter', handleInputEmitter);

onBeforeUnmount(() => {
    emitter.off('InputEmitter', handleInputEmitter);
    loadingInstance.value?.destroy?.();
    loadingContainerInstance.value?.destroy?.();
    loadingIotInstance.value?.destroy?.();
    loadingInstance.value = null;
    loadingContainerInstance.value = null;
    loadingIotInstance.value = null;
    tableResetKey.value = 0;
});
</script>

<style scoped lang="less">
.air-terminal-space-scope-sub {
    min-height: 100%;
    background: #fff;
}

.sub-content {
    padding-inline: 36px;
    padding-left: 0px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mode-row {
    height: 32px;
    display: flex;
    align-items: center;

    .mode-title {
        color: #1b2129;
        font-size: 14px;
        line-height: 22px;
        width: 357px;
    }
}

.mode-tips {
    background: #ebf6ff;
    // min-height: 38px;
    padding: 8px;
    color: #8a939e;
    font-size: 14px;
    line-height: 22px;
}

.space-scope-toolbar {
    height: 32px;
    display: flex;
    align-items: center;

    .toolbar-title {
        color: #1b2129;
        font-size: 14px;
        line-height: 22px;
        width: 357px;
    }

    .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .toolbar-divider {
        width: 1px;
        height: 16px;
        background: #d9d9d9;
    }

    .toolbar-link-btn {
        padding-inline: 0;
    }
}

.table-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .table-title {
        color: #636d79;
        font-size: 14px;
        line-height: 22px;
    }

    .table-right-tools {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .remove-all-btn {
        min-width: 114px;
        padding-inline: 16px;
    }
}

.space-table-wrap {
    /* 顶部固定区域总高度：包含工具栏、表头区域及相关垂直间距 */
    --space-table-offset-height: 120px;
    /* 表格内部分页器预留高度 */
    --space-table-pagination-height: 42px;

    height: calc(100% - var(--space-table-offset-height));
    padding-bottom: 12px;

    :deep(.meri-table) {
        height: calc(100% - var(--space-table-pagination-height));
    }

    :deep(.meri-table-body .meri-table-element) {
        position: relative;
        border-left: none;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 100%;
            background: #e1e5eb;
            pointer-events: none;
            z-index: 2;
        }
    }
}

.col-iot {
    display: flex;
    padding-block: 12px;
    gap: 8px;
    flex-wrap: wrap;
}

.row-remove-btn {
    padding-inline: 0;
}

.batch-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.batch-toolbar-text {
    color: #626c78;
    font-size: 14px;
    line-height: 22px;
}

.batch-toolbar-number {
    color: #1b2129;
    font-style: normal;
    font-weight: 600;
    margin: 0 2px;
}

.batch-toolbar-btn {
    min-width: 64px;
    height: 28px;
    padding: 0 8px;
    flex: 0 0 auto;
}

.ellipsis-two-line {
    width: 100%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
}

.empty-wrapper,
.table-loading {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.iot-modal-content {
    padding: 0px;
}

.iot-modal-desc {
    color: #1a2028;
    font-size: 14px;
    line-height: 24px;
}

.iot-modal-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.iot-modal-checkbox {
    width: 100%;
    display: flex;
    align-items: center;
    height: 24px;
    margin-top: 12px;
}

.iot-modal-highlight {
    color: #1a2028;
    font-weight: 700;
}

.iot-modal-co2-sub {
    color: #1a2028;
    font-size: 9px;
    font-weight: 700;
    line-height: 22px;
    position: relative;
    top: -2px;
}

.iot-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

:global(.add-by-iot-modal) {
    .m-modal-main-content {
        padding: 0 !important;
    }

    .m-modal-main-title {
        color: #2e3742 !important;
    }

    .m-checkbox__label,
    .m-checkbox-label {
        color: #1a2028;
        font-size: 14px;
        line-height: 22px;
    }
}
.mode-radios-box {
    display: flex;
    align-items: center;
    gap: 16px;
    :deep(.m-radio) {
        margin: 0px;
    }
}
.page-container {
    margin-top: 12px;
}

.loading-iot-container {
    height: 350px;
}
</style>
