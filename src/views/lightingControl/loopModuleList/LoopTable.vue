<template>
    <div class="loop-list-wrap">
        <div v-show="tipClick" class="tip-modal" @click="closeModal"></div>
        <!-- <div v-show="checkShow" class="check-modal"></div> -->
        <header class="table-header-wrap">
            <HeaderWrap
                :btn-open="loopListStore.toggleLoopBtnOpen"
                :select-list="selectList"
                @table-height="tableHeightChange"
                @open-change="v => loopListStore.setLoopToggleBtn(v)"
                @query-change="queryChange"
                @truncate-position-changed="truncatePositionChanged"
            >
                <div v-show="showSelectCell(1)" class="input-wrap">
                    <m-search
                        v-show="showHeader"
                        ref="search"
                        v-model="keyword"
                        width="282"
                        type="enter"
                        :placeholder="i18n.global.t('meos_control_web.search_lighting_loop_name_code')"
                        @change="handleChange($event, 'change')"
                        @input="handleChange($event, 'input')"
                        @clear="clearSearch"
                    />
                </div>

                <div v-show="showSelectCell(2)" class="input-wrap">
                    <m-select
                        v-show="showHeader"
                        v-model="templateTypeList.value"
                        :prefix="i18n.global.t('meos_control_web.service_area_type_colon')"
                        popover-class="input-wrap-select-box"
                        :menu-size="282"
                        :disabled="loading"
                        :options="templateTypeList.options"
                        @clear="loopListStore.setList({ hlInfo: { templateType: '' } }, false)"
                        @change="loopListStore.setList({ hlInfo: { templateType: templateTypeList.value } }, false)"
                    />
                </div>
                <div v-show="(templateType === 'PUBLIC_AREA_LIGHTING' || templateType === 'PARKING_LOT_LIGHTING') && showSelectCell(3)" :key="queryStatus" class="input-wrap">
                    <m-cascader
                        v-model="space.value"
                        :options="space.option"
                        filterable
                        :disabled="loading"
                        :width="282"
                        :caption="i18n.global.t('meos_control_web.served_space')"
                        trigger="hover"
                        clearable
                        check-strictly
                        @clear="loopListStore.setList({ hlInfo: { instanceId: '', instanceType: '' } }, false)"
                        @change="item => loopListStore.setList({ hlInfo: { instanceType: item?.type, instanceId: item?.id } }, false)"
                    >
                    </m-cascader>
                </div>
                <div
                    v-for="(item, index) in inputList"
                    v-show="showSelectCell(templateType === 'PUBLIC_AREA_LIGHTING' || templateType === 'PARKING_LOT_LIGHTING' ? index + 4 : index + 3)"
                    :key="item.id"
                    class="input-wrap"
                >
                    <template v-if="item.multiple">
                        <m-select
                            v-show="showHeader"
                            :key="time"
                            v-model="item.value"
                            mode="tags"
                            popover-class="input-wrap-select-box"
                            :menu-size="282"
                            :max-tag-count="1"
                            :clearable="true"
                            :disabled="loading"
                            :options="item.options"
                            :multiple="item.multiple"
                            :prefix="item.prefix + '：'"
                            @blur="item.change(item.value)"
                            @clear="item.clear"
                            @remove="event => item?.remove?.(event)"
                        >
                        </m-select>
                    </template>
                    <template v-else>
                        <m-select
                            v-show="showHeader"
                            :key="time"
                            v-model="item.value"
                            mode="tags"
                            popover-class="input-wrap-select-box"
                            :menu-size="282"
                            :clearable="true"
                            :disabled="loading"
                            :options="item.options"
                            :max-tag-count="1"
                            :prefix="item.prefix + '：'"
                            @change="item.change"
                            @clear="item.clear"
                            @remove="item?.remove(item.value)"
                        >
                        </m-select>
                    </template>
                </div>
            </HeaderWrap>
        </header>
        <div class="content-wrap">
            <div class="loop-table-wrap" :class="{ 'table-loading': loading || dataSource.length === 0, 'loop-table-wrap-empty': loading || dataSource.length === 0 }">
                <m-table :key="isRefresh" :columns="headerList" :data-source="dataSource" :column-line="true" :checkbox="true" empty-text="--" @checked-change="checkedChange">
                    <template #tooltip="{ checkeds }">
                        <div class="nav-bar">
                            <span>{{ i18n.global.t('meos_control_web.already_selected') }} {{ checkeds.length }} {{ i18n.global.t('meos_control_web.project') }}</span>
                            <ManualModal
                                :object-ids="getCheckedIds(checkeds)"
                                :tip-click="tipClick"
                                :is-batch="true"
                                @cancel="cancelActive"
                                @save="refreshTable"
                                @show-message-box="showMessageBox"
                            >
                                <m-button size="small" style="margin: 0 12px" @click="activeBtn(0)">{{ i18n.global.t('meos_control_web.set_to_manual') }}</m-button>
                            </ManualModal>
                            <PopoverModal
                                :title="i18n.global.t('meos_control_web.confirm_switch_to_auto_dup')"
                                type="batchManualOrAuto"
                                :is-batch="true"
                                :object-ids="getCheckedIds(checkeds)"
                                @save="refreshTable"
                                @cancel="cancelActive"
                                @show-message-box="showMessageBox"
                            >
                                <m-button size="small" @click="activeBtn(1)">{{ i18n.global.t('meos_control_web.set_to_auto') }}</m-button>
                            </PopoverModal>
                            <div class="spilt"></div>
                            <BatchPopoverModal
                                :object-ids="getCheckedIds(checkeds)"
                                :equip-switch-set="'1'"
                                :tip-click="tipClick"
                                type="open"
                                @show-message-box="showMessageBox"
                                @cancel="cancelActive"
                                @save="refreshTable"
                            >
                                <m-button size="small" style="margin-right: 12px; width: 54px" @click="activeBtn(2)">{{ i18n.global.t('common.status_open') }}</m-button>
                            </BatchPopoverModal>
                            <BatchPopoverModal
                                :object-ids="getCheckedIds(checkeds)"
                                :equip-switch-set="'0'"
                                :tip-click="tipClick"
                                type="close"
                                @show-message-box="showMessageBox"
                                @cancel="cancelActive"
                                @save="refreshTable"
                            >
                                <m-button size="small" @click="activeBtn(3)">{{ i18n.global.t('common.status_close') }}</m-button>
                            </BatchPopoverModal>
                        </div>
                    </template>
                    <!-- 模块名称 -->
                    <template #localName="{ localName, id }">
                        <m-tips :content="i18n.global.t('meos_control_web.click_jump_to_object_detail')" theme="darkTransparent" placement="top" trigger="hover">
                            <div class="light-loop-control-hover-active text-hide" @click="jumpTo('detail', id)">{{ localName ?? '--' }}</div>
                        </m-tips>
                    </template>
                    <!-- 运行参数 -->
                    <template v-for="(item, index) in runningColumn" #[item.dataIndex]="{ runningParameters, id }" :key="index">
                        <m-tips theme="darkTransparent" placement="top" trigger="hover" :disabled="index + 1 === runningColumn.length">
                            <template #content>
                                <div class="tip-wrap">
                                    <div>
                                        {{ i18n.global.t('meos_control_web.data_update_time_colon')
                                        }}{{ formatDate(getRunningParamByInfoCode(runningParameters, item.infoCode)?.updateTime) }}
                                    </div>
                                    <div>{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</div>
                                </div>
                            </template>
                            <div v-if="index + 1 < runningColumn.length" @click="index + 1 !== runningColumn.length && jumpTo('analysis', { infoCode: item.infoCode, id: id })">
                                <StatusText
                                    :show-hover="index + 1 < runningColumn.length"
                                    :text="
                                        (getRunningParamByInfoCode(runningParameters, item.infoCode)?.dataSource?.[0].name ?? '') +
                                        (getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue?.unit ?? '')
                                    "
                                    type="normal"
                                ></StatusText>
                            </div>
                            <div
                                v-if="index + 1 === runningColumn.length"
                                class="xu-wrap"
                                @click="index + 1 !== runningColumn.length && jumpTo('analysis', { infoCode: item?.infoCode, id: '' })"
                            >
                                <StatusText
                                    :show-hover="index + 1 < runningColumn.length"
                                    :text="
                                        (getRunningParamByInfoCode(runningParameters, item.infoCode)?.infoCodeValue ?? '') +
                                        (getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue?.unit ?? '')
                                    "
                                    type="normal"
                                ></StatusText>
                                <span
                                    class="btn"
                                    :class="{
                                        'more-open':
                                            getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue?.infoCodeName === i18n.global.t('common.over_on'),
                                        'less-open':
                                            getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue?.infoCodeName === i18n.global.t('common.drive_less')
                                    }"
                                    >{{ getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue?.infoCodeName ?? '' }}</span
                                >
                            </div>
                        </m-tips>
                    </template>
                    <!-- 异常事件 -->
                    <template #abnormal="{ abnormal }">
                        <m-popover v-if="abnormal?.abnormalEvents?.length > 0" placement="bottom" trigger="click" popover-class="light-loop-module-popover-wrap">
                            <template #content>
                                <m-scrollbar v-if="abnormal?.abnormalEvents?.length > 0">
                                    <div class="abnormal-events-wrap" style="max-height: 318px">
                                        <div v-for="item in abnormal.abnormalEvents" :key="item.id" class="item-wrap" @click="jumpTo('abnormal', item)">
                                            <div class="title">
                                                {{ item.problemsName }}
                                            </div>
                                            <div class="info">
                                                <span class="name">{{ i18n.global.t('meos_control_web.departure_time_colon') }}</span>
                                                <span class="text">{{ formatDate(item.exceptionStartTime, 'YYYY.MM.DD hh:mm') }}</span>
                                            </div>
                                            <div class="info">
                                                <span class="name">{{ i18n.global.t('meos_control_web.risk_level_colon') }}</span>
                                                <span class="text">{{ importanceDegree(item).name }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </m-scrollbar>
                            </template>
                            <span
                                :class="[{ 'light-loop-control-hover-active': isHaveData(abnormal.abnormalEventCount) }, { red: isHaveData(abnormal.abnormalEventCount) }]"
                                class="abnormal-text"
                                >{{ abnormal.abnormalEventCount ?? '--' }}</span
                            >
                        </m-popover>
                        <span
                            v-else
                            :class="[{ 'light-loop-control-hover-active': isHaveData(abnormal.abnormalEventCount) }, { red: isHaveData(abnormal.abnormalEventCount) }]"
                            class="abnormal-text"
                            >{{ abnormal.abnormalEventCount ?? '--' }}</span
                        >
                    </template>
                    <!-- 基本信息 -->
                    <template v-for="(item, index) in baseInfoColumn" #[item.dataIndex]="{ basicInfos }" :key="index">
                        <TextTip :text="getBaseInfoName(basicInfos, item.dataIndex)"></TextTip>
                    </template>
                    <!-- 操作列 -->
                    <template #manualAutoSet="{ manualAutoSet, disable, id }">
                        <template v-if="String(manualAutoSet?.model) === '0' || String(manualAutoSet?.model) === '1'">
                            <template v-if="disable">
                                <m-radio :model-value="getCheckStatus(manualAutoSet.model, 'm')" disabled size="14" style="margin-right: 32px" @click="tipClick = true">{{
                                    i18n.global.t('meos_control_web.manual')
                                }}</m-radio>
                                <m-radio :model-value="getCheckStatus(manualAutoSet.model)" disabled :size="14">{{ i18n.global.t('meos_control_web.auto') }}</m-radio>
                            </template>
                            <template v-else>
                                <ManualModal
                                    :tip-click="tipClick"
                                    :object-ids="[manualAutoSet?.id ?? '']"
                                    :manual-auto-set="manualAutoSet"
                                    type="manual"
                                    @save="refreshTable"
                                    @cancel="cancelActive"
                                    @btn-loading="changeLoading"
                                >
                                    <div v-if="loadingType === 'manual' && loadingIds === id" class="radio-box mr36">
                                        <m-button class="mr8" type="icon" size="mini" loading></m-button>{{ i18n.global.t('meos_control_web.manual') }}
                                    </div>
                                    <m-radio v-else :model-value="getCheckStatus(manualAutoSet.model, 'm')" :size="14" style="margin-right: 32px" @click="tipClick = true">{{
                                        i18n.global.t('meos_control_web.manual')
                                    }}</m-radio>
                                </ManualModal>
                                <PopoverModal
                                    :title="i18n.global.t('meos_control_web.confirm_switch_to_auto_dup')"
                                    type="batchManualOrAuto"
                                    :object-ids="[manualAutoSet?.id ?? '']"
                                    :disabled="String(manualAutoSet?.model) === '1'"
                                    @save="refreshTable"
                                    @cancel="cancelActive"
                                    @btn-loading="changeLoading"
                                >
                                    <div v-if="loadingType === 'batchManualOrAuto' && loadingIds === id" class="radio-box">
                                        <m-button class="mr8" type="icon" size="mini" loading></m-button>{{ i18n.global.t('meos_control_web.auto') }}
                                    </div>
                                    <m-radio v-else :model-value="getCheckStatus(manualAutoSet.model)" :size="14">{{ i18n.global.t('meos_control_web.auto') }}</m-radio>
                                </PopoverModal>
                            </template>
                        </template>
                        <template v-else>--</template>
                    </template>
                    <template #equipSwitchSet="{ manualAutoSet, equipSwitchSet, disable, id }">
                        <template v-if="String(equipSwitchSet?.value) === '0' || String(equipSwitchSet?.value) === '1'">
                            <!-- 开启按钮 -->
                            <m-button v-if="disable" size="small" style="margin-right: 12px" disabled>{{ i18n.global.t('common.status_open') }}</m-button>
                            <PopoverModal
                                v-else-if="String(manualAutoSet?.model) === '0'"
                                :title="i18n.global.t('meos_control_web.confirm_turn_on_lighting_circuit')"
                                :object-ids="[manualAutoSet?.id ?? '']"
                                type="open"
                                @cancel="cancelActive"
                                @save="refreshTable"
                                @btn-loading="changeLoading"
                            >
                                <m-button
                                    size="small"
                                    style="margin-right: 12px; width: 54px"
                                    :loading="openLoading && loadingType === 'open' && loadingIds === id"
                                    @click="activeBtn(2)"
                                    >{{ i18n.global.t('common.status_open') }}</m-button
                                >
                            </PopoverModal>
                            <m-tips v-else-if="String(manualAutoSet?.model) !== '0'" :content="getTipContent(manualAutoSet?.model)" theme="darkTransparent" trigger="hover">
                                <m-button size="small" style="margin-right: 12px" disabled>{{ i18n.global.t('common.status_open') }}</m-button>
                            </m-tips>
                            <!-- 关闭按钮 -->
                            <m-button v-if="disable" size="small" disabled>{{ i18n.global.t('common.status_close') }}</m-button>
                            <PopoverModal
                                v-else-if="String(manualAutoSet?.model) === '0'"
                                :title="i18n.global.t('meos_control_web.confirm_turn_off_lighting_circuit')"
                                :object-ids="[manualAutoSet?.id ?? '']"
                                type="close"
                                @cancel="cancelActive"
                                @save="refreshTable"
                                @btn-loading="changeLoading"
                            >
                                <m-button size="small" style="width: 54px" :loading="closeLoading && loadingType === 'close' && loadingIds === id" @click="activeBtn(3)">{{
                                    i18n.global.t('common.status_close')
                                }}</m-button>
                            </PopoverModal>
                            <m-tips v-else-if="String(manualAutoSet?.model) !== '0'" :content="getTipContent(manualAutoSet?.model)" theme="darkTransparent" trigger="hover">
                                <m-button size="small" disabled>{{ i18n.global.t('common.status_close') }}</m-button>
                            </m-tips>
                        </template>
                        <template v-else>--</template>
                    </template>
                </m-table>
            </div>
        </div>
        <footer>
            <m-pagination
                background
                :page-num="pageMeta.pageNum"
                :total="pageMeta.total"
                :page-size="pageMeta.pageSize"
                :disabled="pageMeta.total === 0"
                layout="total,prev,pager,next,sizes"
                @page-change="pageFuc.pageChange"
                @size-change="pageFuc.sizeChange"
            ></m-pagination>
        </footer>
        <!-- 失败设备列表弹框 -->
        <CommonMessageModal v-if="showMessageModal" v-model="showMessageModal" :data="errorMessageList" @close="showMessageModal = false" />
    </div>
</template>
<script setup>
import StatusText from './components/StatusText.vue';
import HeaderWrap from './components/HeaderWrap.vue';
import ManualModal from './components/ManualModal.vue';
import PopoverModal from './components/PopoverModal.vue';
import BatchPopoverModal from './components/batchPopoverModal.vue';
import CommonMessageModal from '@/components/common/commonMessageModal/index.vue';
import useMessage from '@/components/hooks/useMessage';
import useLoopModal from './hooks/useLoopModal';
import { isHaveData, getBaseInfoName, getCheckedIds, formatDate, jumpTo } from './utils';
import { useInputHeader, useTableHeader } from './hooks/useLoopHeader';
import { loopControlList } from '@/store/loopControlList';
import TextTip from '@/components/common/TextTip.vue';
import { importanceDegree } from '@/utils/viewUtils';
import useLoopList from './hooks/useLoopList';
import i18n from '@/localization';

const { useSuccessMessage, useErrorMessage, showMessageModal, errorMessageList } = useMessage();
const loopListStore = loopControlList();
const templateType = inject('templateType');
// 筛选相关
const { space, inputList, templateTypeList } = useInputHeader();
// 表头相关
const {
    showHeader,
    time,
    search,
    loading,
    runningColumn,
    baseInfoColumn,
    headerList,
    tipClick,
    openLoading,
    closeLoading,
    loadingType,
    loadingIds,
    pageMeta,
    pageFuc,
    dataSource,
    keyword,
    isRefresh,
    activeBtn,
    closeModal,
    clearSearch,
    queryChange,
    refreshTable,
    cancelActive,
    handleChange,
    getTipContent,
    changeLoading,
    getCheckStatus,
    tableHeightChange
} = useTableHeader(templateTypeList, inputList, space);
const { checkedChange } = useLoopModal();
const { selectList } = useLoopList();
const isWatchIndex = ref(0);
const truncatePositionChanged = index => {
    isWatchIndex.value = index;
};
const getRunningParamByInfoCode = (runningParameters, infoCode) => {
    if (runningParameters && runningParameters.length) {
        return runningParameters.find(param => param.infoCode === infoCode);
    }
    return null;
};
const showSelectCell = num => {
    if (loopListStore.toggleLoopBtnOpen) {
        return true;
    } else {
        return isWatchIndex.value > num;
    }
};
const showMessageBox = (responseData, set) => {
    let message = '';
    if (set === '1') {
        message = i18n.global.t('common.status_open');
    } else if (set === '0') {
        message = i18n.global.t('common.status_close');
    } else if (set === 'manual') {
        message = i18n.global.t('meos_control_web.switch_manual');
    } else if (set === 'automatic') {
        message = i18n.global.t('meos_control_web.switch_auto');
    }
    if (responseData.data?.failureNum) {
        if (responseData.data?.successCount) {
            // 有成功
            useErrorMessage(
                i18n.global.t('meos_control_web.batch_control_message1', {
                    successCount: responseData.data?.successCount,
                    name: message,
                    failureNum: responseData.data?.failureNum
                }),
                5000,
                responseData.data?.errorCountObject
            );
        } else if (responseData.data?.noControlCount) {
            // 有不可控
            useErrorMessage(
                i18n.global.t('meos_control_web.batch_control_message2', {
                    successCount: responseData.data?.successCount,
                    name: message,
                    noControlCount: responseData.data?.noControlCount,
                    failureNum: responseData.data?.failureNum
                }),
                5000,
                responseData.data?.errorCountObject
            );
        } else {
            // 全部失败
            useErrorMessage(
                i18n.global.t('meos_control_web.batch_control_message3', {
                    name: message,
                    failureNum: responseData.data?.failureNum
                }),
                5000,
                responseData.data?.errorCountObject
            );
        }
    } else {
        if (responseData.data?.noControlCount) {
            // 有不可控
            useSuccessMessage(
                i18n.global.t('meos_control_web.batch_control_message4', {
                    successCount: responseData.data?.successCount,
                    name: message,
                    noControlCount: responseData.data?.noControlCount
                })
            );
        } else {
            // 全部成功
            useSuccessMessage(
                i18n.global.t('meos_control_web.batch_control_message5', {
                    successCount: responseData.data?.successCount,
                    name: message
                })
            );
        }
    }
};
</script>
<style lang="less" scoped>
.xu-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
        margin-left: 8px;
        padding: 0 4px;
        color: @grey-900;
        font-feature-settings: 'clig' off, 'liga' off;
        cursor: pointer;
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
        border-radius: 2px;
        background: @grey-200;
        display: inline-block;
    }
    .more-open {
        color: white;
        background: #e6b407;
    }
    .less-open {
        color: white;
        background: #ff9d2d;
    }
}
.radio-list {
    display: flex;
    align-items: center;
    margin-right: 32px;
    &:last-child {
        margin-right: 0;
    }
}
.nav-bar {
    display: flex;
    align-items: center;
    .spilt {
        height: 14px;
        width: 1px;
        background: @grey-400;
        margin: 0 12px;
    }
}
.loop-list-wrap {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    .tip-modal {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 3;
    }
    .check-modal {
        position: absolute;
        left: 75px;
        right: 0;
        bottom: 0;
        top: 180px;
        z-index: 2;
    }
    > .table-header-wrap {
        padding-top: 12px;
        .input-wrap {
            width: 282px;
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            .m-cascader {
                :deep(.m-cascader__result) {
                    line-height: 30px;
                }
            }
            :deep(.m-select-wrap) {
                .m-select-inner {
                    width: 282px !important;
                }
            }
        }
    }
    > .content-wrap {
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        min-height: calc(100% - 204px);
        > main {
            flex: 1;
        }
        .loop-table-wrap {
            max-height: 100%;
            border: 1px solid @grey-300;
            border-left: 0.5px solid @grey-300;
            border-radius: 4px;
            .meri-table {
                margin-top: -1px;
                margin-right: -1px;
            }
            &.table-loading {
                .meri-table {
                    border-left: none;
                }
            }
            .radio-text {
                color: @grey-900;
                font-feature-settings: 'clig' off, 'liga' off;

                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
            }
        }
        .loop-table-wrap-empty {
            height: 100%;
        }
    }
    > footer {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .m-pagination {
            transform: translateX(8px);
        }
        &.float {
            position: fixed;
            left: 0;
            bottom: 0;
            right: 24px;
            z-index: 2;
            background: #fff;
        }
    }
}
.tip-wrap {
    color: @white;
    font-feature-settings: 'clig' off, 'liga' off;

    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    div {
        &:nth-child(1) {
            font-size: 14px;
        }
        &:nth-child(2) {
            font-size: 12px;
            color: @grey-400;
        }
    }
}
.abnormal-events-wrap {
    width: 350px;
    .item-wrap {
        padding: 4px 8px;
        margin-right: 8px;
        cursor: pointer;
        margin-top: 6px;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        .title {
            color: @blue-500;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* 定义文本的行数 */
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .info {
            margin-top: 4px;
            .name {
                color: @grey-600;
                margin-right: 4px;
            }
            .text {
                color: @grey-800;
            }
        }
        &:nth-child(1) {
            margin-top: 0;
        }
        &:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
.abnormal-text {
    &.red {
        color: @red-600;
    }
}
.radio-box {
    display: flex;
    align-items: center;
}
.mr36 {
    margin-right: 33px;
}
</style>
