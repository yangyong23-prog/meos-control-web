<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        type="default"
        modal-class-name="black-list-space-modal"
        :width="1260"
        :height="558"
        :max-height="658"
        :title="i18n.global.t('meos_control_web.space_scope_config')"
        :footer="false"
        :need-scrollbar="false"
        @close="closeModal"
    >
        <template #header>
            <div class="title-wrap">
                <div class="main-title">{{ i18n.global.t('meos_control_web.space_scope_config') }}</div>
                <div class="subtitle">{{ i18n.global.t('meos_control_web.data_saved_in_realtime') }}</div>
            </div>
        </template>
        <template #content>
            <div ref="filterRef" class="filter-container">
                <m-tree-select
                    v-model="notColdHeatModel"
                    :size="320"
                    :max-scroll-height="362"
                    :data="notColdHeatOptions"
                    multiple
                    searchable
                    virtual
                    :height="362"
                    panel-searchable
                    :teleport="filterRef"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.spaces_not_served_by_cold_heat_source')"
                    clearable
                >
                </m-tree-select>
                <m-select
                    v-model="hasTempIotModel"
                    :size="342"
                    :options="hasTempIotOptions"
                    :max-scroll-height="362"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.temp_iot_monitoring_colon')"
                    clearable
                ></m-select>
                <m-select
                    v-model="spaceTypeModel"
                    :size="237"
                    :max-scroll-height="362"
                    :options="spaceTypeOptions"
                    searchable
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    panel-search
                    :-placeholder="i18n.global.t('common.placeholder_input')"
                    multiple
                    panel-searchable
                    clearable
                    :prefix="i18n.global.t('meos_control_web.space_type_colon')"
                >
                </m-select>
            </div>
            <div v-show="!buildingFloorTree?.length" class="fcc" style="height: calc(100% - 44px)">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
            </div>
            <div v-show="buildingFloorTree?.length > 0" class="mid-container">
                <div class="left-wrap">
                    <m-scrollbar ref="leftScroll" style="width: 100%" @scroll="onLeftTreeScroll">
                        <div class="tree-container">
                            <m-tree v-model="curSelectedFloor" :size="320" :default-expand-all="true" :data="buildingFloorTree" virtual :teleport="filterRef" last-stage />
                        </div>
                    </m-scrollbar>
                </div>
                <div class="right-wrap">
                    <div class="top">
                        <div class="ops">
                            <template v-if="onlySelected !== 'checked'">
                                <m-button type="link" :disabled="isOpBusy" @click="selectAll">
                                    {{
                                        i18n.global.t('meos_control_web.all_page_num', {
                                            pageTotal: pageTotal
                                        })
                                    }}
                                </m-button>
                                <div class="split-line"></div>
                                <m-button type="link" :disabled="isOpBusy" @click="clearCurSeleced">{{ i18n.global.t('meos_control_web.clear_selection') }}</m-button>
                            </template>
                        </div>
                        <m-search ref="search" v-model="keyword" type="enter" :placeholder="i18n.global.t('meos_control_web.search_spaces_under_list')" @change="changeKeyword">
                        </m-search>
                    </div>
                    <div class="table-container">
                        <m-table
                            :columns="tableColumns"
                            :data-source="tableListSpaces"
                            :show-header-checkbox="false"
                            :cell-style-fn="cellStyleFn"
                            :checkbox="onlySelected !== 'checked'"
                            @checked-change="checkedChangeSpace"
                        >
                            <template #0="{ index }">
                                <span :style="{ paddingLeft: onlySelected === 'checked' ? '46px' : 0 }">{{ (pageNum - 1) * pageSize + index + 1 }} </span>
                            </template>
                            <template #status="space">
                                <template v-for="(item, i) in tags" :key="i">
                                    <m-tag
                                        v-if="item?.show(space, { notColdHeatModel, hasTempIotModel, spaceTypeModel })"
                                        size="small"
                                        :color="item?.color"
                                        :bg-color="item?.bg"
                                        :style="{ marginLeft: '8px' }"
                                        >{{ item.txt(space, { notColdHeatModel, hasTempIotModel, spaceTypeModel }) }}
                                    </m-tag>
                                </template>
                            </template>
                        </m-table>
                    </div>
                    <m-pagination v-model:page-num="pageNum" :total="pageTotal" :page-size="pageSize" layout="total,prev,pager,next"></m-pagination>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="footer">
                <div class="left">
                    <m-checkbox :model-value="onlySelected" @change="changeOnlyShowSelected">{{ i18n.global.t('meos_control_web.show_selected_only') }}</m-checkbox>
                    <template v-if="onlySelected === 'checked' && blackListSpaceIds?.length > 0">
                        <div class="split-line"></div>
                        <m-button type="link" :disabled="isOpBusy" style="margin-left: 0" @click="clearAllSeleced">{{ i18n.global.t('meos_control_web.all_empty') }}</m-button>
                    </template>
                </div>
                <div class="right">
                    <m-button type="primary" @click="clickSaveBtn">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import useBlacklist from '../hooks/useBlacklist';
import i18n from '@/localization';

const showModal = defineModel({ type: Boolean, default: false });
const filterRef = ref();

const cellStyleFn = (row, col) => {
    if (col.dataIndex === '0') {
        return { paddingLeft: 0 };
    }
    return {};
};

const {
    hasTempIotModel,
    hasTempIotOptions,
    notColdHeatModel,
    notColdHeatOptions,
    spaceTypeModel,
    spaceTypeOptions,
    buildingFloorTree,
    curSelectedFloor,
    tableListSpaces,
    tags,
    keyword,
    onlySelected,
    pageNum,
    pageTotal,
    pageSize,
    isOpBusy,
    blackListSpaceIds,
    leftScroll,
    changeOnlyShowSelected,
    closeModal,
    selectAll,
    clearCurSeleced,
    clearAllSeleced,
    checkedChangeSpace,
    clickSaveBtn,
    onLeftTreeScroll
} = useBlacklist(showModal);

const tableColumns = computed(() => {
    return [
        {
            dataIndex: '0',
            title: `${i18n.global.t('meos_control_web.serial_number')}`,
            // weight: 1,
            width: onlySelected.value === 'checked' ? 126 : 78
            // minWidth: 78
        },
        {
            dataIndex: 'localName',
            title: `${i18n.global.t('meos_control_web.object_name')}`,
            ellipsis: true,
            width: 293,
            minWidth: 293
        },
        {
            dataIndex: 'status',
            title: `${i18n.global.t('meos_control_web.status')}`
            // weight: 1
        }
    ];
});

const changeKeyword = val => {
    // console.log('val: ', val);
    keyword.value = val;
};
</script>
<style lang="less">
.black-list-space-modal.m-modal-bg {
    .m-modal-main .m-modal-main-content {
        padding: 0;
    }

    .m-modal-main .m-main-handle {
        padding-block: 12px;
    }

    .m-main-handle-line {
        border-top: 1px solid @grey-200;
    }
}
</style>
<style lang="less" scoped>
.title-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    .main-title {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }
    .subtitle {
        color: var(--gray-500, #8b949e);
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;
    }
}
.loading-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
}
.filter-container {
    display: flex;
    align-items: center;
    column-gap: 8px;

    padding: 8px 24px;
    border-bottom: 1px solid var(--Gray-200, #e8ecf0);

    // :deep(.m-select-placeholder) {
    //     color: @grey-900;
    // }

    // border-bottom: 1px solid @grey-200;
}

.mid-container {
    width: 100%;
    height: 509px;
    display: flex;
    align-items: center;
    align-self: stretch;

    .left-wrap {
        display: flex;
        width: 350px;
        align-items: flex-start;
        align-self: stretch;
        border-right: 1px solid var(--gray-300, #e1e5eb);
        overflow-y: auto;
        .tree-container {
            width: 100%;
            padding: 12px 24px;
        }
    }
    .right-wrap {
        display: flex;
        padding: 12px 24px;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
        flex: 1 0 0;
        align-self: stretch;
        overflow: hidden;

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;
            height: 32px;
            .ops {
                display: flex;
                align-items: center;
            }
        }

        .table-container {
            width: 100%;
            flex: 1;
            height: calc(100% - 72px);

            :deep(.meri-table-header-tr) {
                height: 28px;
                :first-child {
                    .meri-table-header-cell {
                        padding-left: 32px;
                    }
                }
            }
            :deep(.meri-table-body-tr) {
                height: 36px;
            }
        }
    }
}

.split-line {
    width: 1px;
    height: 12px;
    margin-left: 4px;
    background: #d9d9d9;
}

.selected-count-row {
    color: @grey-800;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.selected-tips {
    color: @grey-600;
    font-size: 12px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    margin-top: 4px;
}

:deep(.m-tree-node__content) {
    .suffix {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }
}
.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    .left {
        display: flex;
        align-items: center;
        gap: 4px;
    }
}
</style>
