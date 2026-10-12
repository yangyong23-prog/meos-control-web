<template>
    <div v-show="popoverModalBG" class="tip-modal" :style="{ top: qiankunWindow?.__POWERED_BY_QIANKUN__ ? '48px' : 0 }" @click="closeModal"></div>
    <div class="right-table">
        <header class="header-container">
            <div class="sblb-header" :style="{ height: open ? 'auto' : '44px' }">
                <div ref="headerRef" :class="['header-list-wrap', open ? 'open' : '']">
                    <div class="left" :style="{ maxWidth: open ? '100%' : leftWidth + 'px' }">
                        <div class="input-wrap">
                            <m-search
                                ref="searchRef"
                                :key="placeholder"
                                v-model="searchValue"
                                :default-value="searchValue"
                                :placeholder="placeholder"
                                type="enter"
                                :width="260"
                                :clearable="true"
                                @clear="onSearch(true)"
                                @input="onInputDelay"
                                @change="onSearch(false)"
                            />
                        </div>
                        <template v-if="runningMonitorType === 'LIGHTING'">
                            <div v-if="serveSpaceOptions?.length && currentItem?.classCode === LIGHTCLASSCODES.LOOP" class="input-wrap">
                                <m-cascader
                                    v-model="serviceSpaces.value"
                                    :options="serveSpaceOptions"
                                    :drop-panel-single-width="240"
                                    :caption="serviceSpaces.name"
                                    :clearable="true"
                                    :width="260"
                                    :disabled="isCasDisabled"
                                    check-strictly
                                    trigger="hover"
                                    filterable
                                >
                                </m-cascader>
                            </div>
                            <div v-if="inSpaceOptions?.length && currentItem?.classCode === LIGHTCLASSCODES.CONTROL" class="input-wrap">
                                <m-cascader
                                    :key="isCasDisabled"
                                    v-model="inSpaces.value"
                                    :options="inSpaceOptions"
                                    :drop-panel-single-width="240"
                                    :caption="inSpaces.name"
                                    :clearable="true"
                                    :width="260"
                                    :disabled="isCasDisabled"
                                    check-strictly
                                    trigger="hover"
                                    filterable
                                >
                                </m-cascader>
                            </div>
                        </template>
                        <div v-if="spaceMeta?.option?.length" class="input-wrap-service">
                            <span v-if="runningMonitorType === 'SEWAGE'" class="input-select-left">{{ i18n.global.t('meos_control_web.located_space') }}</span>
                            <m-select v-else v-model="spaceMeta.titleValue" :options="spaceMeta.titleOption" prefix="" :clearable="false" :width="90" :disabled="isTableLoading">
                            </m-select>
                            <m-cascader
                                :key="isCasDisabled"
                                v-model="spaceMeta.value"
                                :options="spaceMeta.option"
                                :drop-panel-single-width="240"
                                caption=""
                                :clearable="true"
                                :width="runningMonitorType === 'SEWAGE' ? 188 : 162"
                                :disabled="isCasDisabled"
                                check-strictly
                                trigger="hover"
                                filterable
                            >
                            </m-cascader>
                        </div>
                        <div v-for="item in selectList" :key="item.infoCode" class="input-wrap">
                            <m-select
                                v-model="item.value"
                                :multiple="item.multiple"
                                :options="item.options"
                                :prefix="item.name + '：'"
                                :clearable="true"
                                :menu-size="260"
                                popover-class="common-input-wrap-select-box"
                                :disabled="isTableLoading"
                            >
                            </m-select>
                        </div>
                        <div v-for="item in staticInputList" :key="item.infoCode" class="input-wrap">
                            <m-select
                                v-model="item.value"
                                :options="item.options"
                                :prefix="item.name + '：'"
                                :clearable="true"
                                :menu-size="260"
                                popover-class="common-input-wrap-select-box"
                                :disabled="isTableLoading"
                            >
                            </m-select>
                        </div>
                        <div v-if="open" class="right">
                            <div v-if="showFoldBtn" class="btn-wrap" @click="changeOpen">
                                <span class="title">{{ open ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}</span>
                                <IconMeriComponentChevronDown color="#1b2129" class="arrow" :class="{ rotate: open }" />
                            </div>
                            <div class="header-btn">
                                <m-button type="link" size="medium" @click="filterTable('query')">{{ i18n.global.t('meos_control_web.query') }}</m-button>
                                <m-button type="link" size="medium" @click="resetTable()">{{ i18n.global.t('meos_control_web.reset') }}</m-button>
                            </div>
                        </div>
                    </div>
                    <div v-if="!open" class="right">
                        <div v-if="showFoldBtn" class="btn-wrap" @click="changeOpen">
                            <span class="title">{{ open ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}</span>
                            <IconMeriComponentChevronDown color="#1b2129" class="arrow" :class="{ rotate: open }" />
                        </div>
                        <div class="header-btn">
                            <m-button type="link" size="medium" @click="filterTable('query')">{{ i18n.global.t('meos_control_web.query') }}</m-button>
                            <m-button type="link" size="medium" @click="resetTable()">{{ i18n.global.t('meos_control_web.reset') }}</m-button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <section class="list-content-wrap">
            <CheckedHeader
                v-if="selectedList?.length > 0"
                :selected-list="selectedList"
                :btn-list="btnList"
                :running-monitor-type="props.runningMonitorType"
                @table-init="init"
            ></CheckedHeader>
            <main v-if="tableData?.length" class="table-wrap-cs">
                <m-table :key="timeKey" :columns="tableHead" :data-source="tableData" :column-line="true" empty-text="--" :checkbox="true" @checked-change="checkedChange">
                    <template #objectName="row">
                        <span class="word-break" v-html="highlightKeyword(row.objectName || row.localName)"></span>
                    </template>
                    <template v-for="item in headInfoCode" #[item]="row" :key="item">
                        <!-- 带操作信息点 -->
                        <template v-if="row[`${item}-obj`]?.relInfoCodeConfig?.showStyle === 'SET_VALUE_ACTION_COLUMN'">
                            <!-- 操作列 -->
                            <template v-if="item.includes('-operate')">
                                <div style="display: flex">
                                    <ManualCell
                                        :key="timeKey"
                                        :cell-type="'operate'"
                                        :running-monitor-type="runningMonitorType"
                                        :data="row[`${item}-obj`]?.relInfoCodeConfig"
                                        :data-default="row[`${item}-obj`]"
                                        :disabled="row.disable || isCloud"
                                        :object-ids="[row['objectId']]"
                                        :auto-recovery-date-time="row['autoRecoveryDateTime']"
                                        :project-id="row['projectId']"
                                        :manual-auto-status="row['manualAutoStatus-obj']?.relInfoCodeConfig?.dataValue"
                                        :default-value="row[item]"
                                        @table-init="init"
                                    ></ManualCell>
                                </div>
                            </template>
                            <!-- 实际值 设定值 -->
                            <template v-else>
                                <template v-if="item.includes('-config')">
                                    <div>
                                        {{ row[item] }}
                                        <!-- 干预 -->
                                        <OtherCell
                                            v-if="row[`${item}-obj`]?.relInfoCodeConfig?.additionalMapValue?.recoveryDateTime"
                                            :key="timeKey"
                                            :disabled="row.disable || isCloud"
                                            :object-ids="[row['objectId']]"
                                            :data="row?.[`${item}-obj`]"
                                            :model="row['manualAutoStatus-obj']?.relInfoCodeConfig?.dataValue"
                                            :auto-recovery-date-time="row['autoRecoveryDateTime']"
                                            @table-init="init"
                                        ></OtherCell>
                                    </div>
                                </template>
                                <template v-else>
                                    <DefaultCell :row="row" :item="item" :running-monitor-type="runningMonitorType"></DefaultCell>
                                </template>
                            </template>
                        </template>
                        <!-- 设定值编辑列 -->
                        <template v-else-if="item.includes('-config')">
                            <!-- 手自动样式 -->
                            <template v-if="row[`${item}-obj`]?.relInfoCodeConfig?.showStyle === 'SET_VALUE_RADIO'">
                                <ManualCell
                                    :key="timeKey"
                                    :running-monitor-type="runningMonitorType"
                                    :data="row[`${item}-obj`]?.relInfoCodeConfig"
                                    :disabled="row.disable || isCloud"
                                    :object-ids="[row['objectId']]"
                                    :project-id="row['projectId']"
                                    :auto-recovery-date-time="row['autoRecoveryDateTime']"
                                    @table-init="init"
                                ></ManualCell>
                            </template>
                            <div
                                v-else
                                style="display: flex; flex-direction: column"
                                :style="{
                                    paddingTop: row[`${item}-obj`]?.relInfoCodeConfig?.additionalMapValue?.recoveryDateTime ? '12px' : 0,
                                    paddingBottom: row[`${item}-obj`]?.relInfoCodeConfig?.additionalMapValue?.recoveryDateTime ? '12px' : 0
                                }"
                            >
                                <ManualCell
                                    :key="timeKey"
                                    :cell-type="'set'"
                                    :running-monitor-type="runningMonitorType"
                                    :data="row?.[`${item}-obj`]?.showStyle === 'SET_VALUE_SINGLE_COLUMN' ? row?.[`${item}-obj`] : row[`${item}-obj`]?.relInfoCodeConfig"
                                    :data-default="row[`${item}-obj`]"
                                    :disabled="row.disable || isCloud"
                                    :object-ids="[row['objectId']]"
                                    :auto-recovery-date-time="row['autoRecoveryDateTime']"
                                    :project-id="row['projectId']"
                                    :manual-auto-status="row['manualAutoStatus-obj']?.relInfoCodeConfig?.dataValue"
                                    :data-value="
                                        row?.[`${item}-obj`]?.showStyle === 'SET_VALUE_SINGLE_COLUMN'
                                            ? row?.[`${item}-obj`]?.dataValue ?? '--'
                                            : row?.[`${item}-obj`]?.relInfoCodeConfig?.dataValue
                                    "
                                    :default-value="getValueWithUnit(row, item)"
                                    @table-init="init"
                                ></ManualCell>
                                <!-- 干预 -->
                                <OtherCell
                                    v-if="row[`${item}-obj`]?.relInfoCodeConfig?.additionalMapValue?.recoveryDateTime"
                                    :key="timeKey"
                                    :disabled="row.disable || isCloud"
                                    :object-ids="[row['objectId']]"
                                    :data="row?.[`${item}-obj`]"
                                    :model="row['manualAutoStatus-obj']?.relInfoCodeConfig?.dataValue"
                                    :auto-recovery-date-time="row['autoRecoveryDateTime']"
                                    @table-init="init"
                                ></OtherCell>
                            </div>
                        </template>
                        <!-- 实际值列 -->
                        <template v-else>
                            <DefaultCell :row="row" :item="item" :running-monitor-type="runningMonitorType"></DefaultCell>
                        </template>
                    </template>
                </m-table>
            </main>
            <section v-else class="no-content-wrap">
                <m-illustration v-if="currentItem?.templateTypeId || !isTableLoading" :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
            </section>
            <footer v-if="tableData?.length && pageMeta && !isTableLoading">
                <m-pagination
                    background
                    :page-num="pageMeta.pageNum"
                    :total="pageMeta.total"
                    :page-size="pageMeta.pageSize"
                    layout="total,prev,pager,next,sizes"
                    @page-change="pageFuc.pageChange"
                    @size-change="pageFuc.sizeChange"
                ></m-pagination>
            </footer>
        </section>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import ManualCell from './ManualCell.vue';
import OtherCell from './OtherCell.vue';
import DefaultCell from './DefaultCell.vue';
import CheckedHeader from './CheckedHeader.vue';
import useHeaderStyle from '../hooks/useHeaderStyle';
import useTipModal from '../hooks/useTipModal';
import useRightTable from '../hooks/useRightTable';
import { qiankunWindow } from '@/utils/helper';
import { IconMeriComponentChevronDown } from 'meri-icon';
import { isEdge } from '@/utils/envUtils';
import { useElementSize } from '@vueuse/core';
const searchValue = ref('');
const searchRef = ref();
const { popoverModalBG, closeModal } = useTipModal();

const isCloud = computed(() => !isEdge());
const { changeOpen, headerRef, rowNum, open, setFoldBtnStatus } = useHeaderStyle();

const getValueWithUnit = (row, item) => {
    const itemObjInfo = row?.[`${item}-obj`];
    const { dataValue, unit } = itemObjInfo || {};
    const finalVal = dataValue?.toString() ? `${dataValue}${unit}` : '--';
    const itemInfo = row[item];
    return itemObjInfo?.showStyle === 'SET_VALUE_SINGLE_COLUMN' ? finalVal : itemInfo;
};

const { width: headerWidth } = useElementSize(headerRef);
const props = defineProps({
    // 设备列表类型
    runningMonitorType: {
        type: String,
        default: ''
    },
    pageSize: {
        type: Number,
        default: 20
    },
    allLoops: {
        type: Array,
        default: () => []
    }
});

const {
    init,
    timeKey,
    inSpaces,
    serviceSpaces,
    keywordValue,
    btnList,
    pageFuc,
    pageMeta,
    spaceMeta,
    inSpaceOptions,
    serveSpaceOptions,
    tableData,
    tableHead,
    selectList,
    placeholder,
    staticInputList,
    serviceAreaSelect,
    currentItem,
    selectedList,
    headInfoCode,
    isTableLoading,
    filterTable,
    checkedChange,
    LIGHTCLASSCODES,
    highlightKeyword
} = useRightTable(setFoldBtnStatus, open, changeOpen, props);
provide('highlightKeywordKey', highlightKeyword);
// 输入事件
const onInputDelay = e => {
    keywordValue.value = e.target.value.trim();
};
const onSearch = (clear = false) => {
    if (clear) {
        keywordValue.value = '';
    }
    filterTable('query');
};
const resetTable = () => {
    searchValue.value = '';
    searchRef.value?.clearInp();
    filterTable('reset');
};
const leftColumns = computed(() => {
    let ret = 1;
    // 当照明时服务空间或者所在空间是必有的
    if (props.runningMonitorType === 'LIGHTING') {
        ret += 1;
    } else if (spaceMeta.value?.option?.length) {
        ret += 1;
    }

    ret += selectList.value?.length;
    ret += staticInputList.value?.length;
    return ret;
});
const showFoldBtn = computed(() => {
    return leftColumns.value > Math.floor((headerWidth.value - 96) / 272);
});

const isCasDisabled = computed(() => {
    return isTableLoading.value || spaceMeta.value.option?.length === 0;
});

const leftWidth = computed(() => {
    let offset = 96;
    if (showFoldBtn.value) {
        offset = 186;
    }
    return Math.min(leftColumns.value, Math.floor((headerWidth.value - offset) / 272)) * 272;
});
</script>

<style lang="less" scoped>
.tip-modal {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
}
.right-table {
    height: 100%;
    flex: 1;
    min-width: 0;
    display: flex;
    overflow: hidden;
    justify-content: space-between;
    flex-direction: column;
    .word-break {
        word-break: break-all;
    }
    .header-container {
        display: flex;
        justify-content: flex-start;
        .sblb-header {
            padding: 0 0 0 16px;
            padding-top: 12px;
            box-sizing: content-box;
            border: none;
            overflow: hidden;
            width: 100%;
            transition: height 0.25s linear;
            .header-list-wrap {
                display: flex;
                width: 100%;
                justify-content: flex-start;
                &.open {
                    flex-direction: column;
                    .left {
                    }
                    .right {
                        margin-bottom: 12px;
                    }
                }
                .left {
                    display: flex;
                    overflow: hidden;
                    min-width: 260px;
                    flex-grow: 1;
                    flex-wrap: wrap;
                    gap: 12px;
                    .placeholder,
                    .input-wrap {
                        width: 260px;
                        height: 32px;
                        :deep(.m-select-wrap) {
                            width: 260px !important;
                            .m-select-inner {
                                width: 260px !important;
                                display: flex;
                                align-items: center;
                                flex-wrap: nowrap;
                            }
                        }
                        :deep(.m-select-inner-prefix) {
                            max-width: 148px;
                            display: inline-block;
                        }
                    }
                    .input-wrap-service {
                        height: 32px;
                        display: flex;
                        width: 260px;
                        align-items: center;
                        overflow: hidden;
                        .input-select-left {
                            border-top-left-radius: 4px;
                            padding: 4px 8px;
                            text-align: center;
                            white-space: nowrap;
                            box-sizing: border-box;
                            border-bottom-left-radius: 4px;
                            border-top-right-radius: 0;
                            border-bottom-right-radius: 0;
                            width: 72px;
                            border: 1px solid rgba(196, 201, 207, 1);
                            border-right: none;
                            background: var(--gray-200, #e8ecf0);
                            font-weight: 400;
                            font-size: 14px;
                            line-height: 22px;
                            letter-spacing: 0px;
                            color: rgba(27, 33, 41, 1);
                        }
                        :deep(.m-select-wrap) {
                            .m-select-inner {
                                width: 90px !important;
                                border-top-right-radius: 0;
                                border-bottom-right-radius: 0;
                                border-right: none;
                                background: var(--gray-200, #e8ecf0);
                            }
                        }
                        :deep(.m-cascader) {
                            .m-select-inner {
                                border-top-left-radius: 0;
                                border-bottom-left-radius: 0;
                            }
                            .m-cascader__result {
                                border-top-left-radius: 0;
                                border-bottom-left-radius: 0;
                            }
                        }
                    }
                }

                .right {
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    .btn-wrap {
                        display: flex;
                        cursor: pointer;
                        // width: 62px;
                        padding: 4px 8px;
                        height: 32px;
                        justify-content: center;
                        align-items: center;
                        .title {
                            font-size: 14px;
                            font-weight: var(--platform-font-weight);
                            line-height: 22px;
                            user-select: none;
                        }
                        .icon {
                            width: 18px;
                            height: 18px;
                        }
                        &:hover {
                            border-radius: 4px;
                            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                        }
                    }
                }

                .arrow {
                    transition: transform 0.3s linear;
                }
                .rotate {
                    transform: rotate(180deg);
                    transition: transform 0.3s linear;
                }
            }
        }
        .header-btn {
            display: flex;
            margin-right: 16px;
        }
    }
    .list-content-wrap {
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin: 0 16px 16px;
        min-height: 0;
        position: relative;
        // overflow: hidden;
        > .table-wrap-cs {
            max-height: 100%;
            min-width: 0;
            overflow: hidden;
            border: 1px solid @grey-300;
            border-radius: 4px;
            border-left: none;
            :deep(.meri-table) {
                border-left: none;
                /* margin-top: -1px;
                margin-left: 0.5px;
                :deep(.meri-table-element-td) {
                    padding: 0 16px 0 16px;
                } */
            }
            .default-data {
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                color: #1b2129;
                word-break: break-all;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                text-overflow: ellipsis;
                line-height: 20px;
                max-height: 40px;
                width: 100%;
            }
            .modify {
                color: #246fe5;
                cursor: pointer;
            }
            .modify-column {
                margin-right: 12px;
                &:last-of-type {
                    margin-right: 0;
                }
                &:hover {
                    color: @blue-700;
                }
            }
            .disabled {
                color: @grey-400!important;
                cursor: not-allowed !important;
            }
        }
        > .no-content-wrap {
            flex: 1;
            min-height: 0;
            overflow: hidden;
            display: flex;
            justify-content: center;
            flex-direction: column;
        }
        > footer {
            height: 30px;
            display: flex;
            margin-top: 16px;
            align-items: center;
            justify-content: flex-end;
            .m-pagination {
                transform: translateX(8px);
            }
        }
    }
}
</style>
