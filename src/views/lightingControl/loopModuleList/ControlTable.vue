<template>
    <div class="loop-list-wrap">
        <header class="table-header-wrap">
            <HeaderWrap
                :btn-open="loopListStore.toggleCoBtnOpen"
                :select-list="selectList"
                @table-height="tableHeightChange"
                @open-change="v => loopListStore.setCoToggleBtn(v)"
                @query-change="queryChange"
                @truncate-position-changed="truncatePositionChanged"
            >
                <div v-for="(item, index) in selectList" v-show="showSelectCell(index + 1)" :key="item.keyword" class="input-wrap">
                    <template v-if="item.id === 'keyword'">
                        <m-search
                            v-show="showHeader"
                            ref="search"
                            v-model="keyword"
                            :width="item.width"
                            type="enter"
                            :placeholder="item.name"
                            @change="handleChange($event, 'change')"
                            @input="handleChange($event, 'input')"
                            @clear="clearSearch"
                        />
                    </template>
                    <template v-else-if="item.id === 'instanceId'">
                        <m-cascader
                            v-show="showHeader"
                            v-model="space.value"
                            :options="space.option"
                            filterable
                            :disabled="loading"
                            :width="item.width"
                            :caption="item.name"
                            trigger="hover"
                            clearable
                            check-strictly
                            @clear="loopListStore.setList({ coInfo: { instanceId: '', instanceType: '' } }, false)"
                            @change="item => loopListStore.setList({ coInfo: { instanceType: item?.type, instanceId: item?.id } }, false)"
                        >
                        </m-cascader>
                    </template>
                    <template v-else-if="item.id === 'templateType'">
                        <m-select
                            v-show="showHeader"
                            v-model="templateTypeList.value"
                            :prefix="i18n.global.t('meos_control_web.service_area_type_colon')"
                            popover-class="input-wrap-select-box"
                            :menu-size="282"
                            :disabled="loading"
                            :options="templateTypeList.options"
                            @clear="
                                loopListStore.setList(
                                    {
                                        coInfo: {
                                            templateType: ''
                                        }
                                    },
                                    false
                                )
                            "
                            @change="loopListStore.setList({ coInfo: { templateType: templateTypeList.value } }, false)"
                        />
                    </template>
                    <template v-else-if="item.id === 'onlineStatus'">
                        <m-select
                            v-show="showHeader"
                            v-model="onlineStatus.value"
                            :prefix="i18n.global.t('meos_control_web.online_status_colon')"
                            popover-class="input-wrap-select-box"
                            :menu-size="item.width"
                            :clearable="true"
                            :disabled="loading"
                            :options="onlineStatus.option"
                            @clear="loopListStore.setList({ coInfo: { onlineStatus: '' } }, false)"
                            @change="loopListStore.setList({ coInfo: { onlineStatus: onlineStatus.value } }, false)"
                        />
                    </template>
                    <template v-else>
                        <m-select
                            v-show="showHeader"
                            v-model="faultConditions.value"
                            :prefix="i18n.global.t('meos_control_web.fault_status_colon')"
                            popover-class="input-wrap-select-box"
                            :menu-size="item.width"
                            :clearable="true"
                            :disabled="loading"
                            :options="faultConditions.option"
                            @clear="loopListStore.setList({ coInfo: { faultConditions: '' } }, false)"
                            @change="loopListStore.setList({ coInfo: { faultConditions: faultConditions.value } }, false)"
                        />
                    </template>
                </div>
            </HeaderWrap>
        </header>
        <div class="content-wrap">
            <div class="loop-table-wrap" :class="{ 'table-loading': loading || dataSource.length === 0, 'loop-table-wrap-empty': loading || dataSource.length === 0 }">
                <m-table :key="time" :columns="controlHeaderList" :data-source="dataSource" :column-line="true" empty-text="--">
                    <!-- 模块名称 -->
                    <template #localName="{ localName, id }">
                        <m-tips :content="i18n.global.t('meos_control_web.click_jump_to_object_detail')" theme="darkTransparent" placement="top" trigger="hover">
                            <span class="light-loop-control-hover-active text-hide" @click="jumpTo('detail', id)">{{ localName ?? '--' }}</span>
                        </m-tips>
                    </template>
                    <!-- 运行参数 -->
                    <template v-for="(item, index) in runningColumn" #[item.dataIndex]="{ runningParameters }" :key="index">
                        <m-tips theme="darkTransparent" placement="top" trigger="hover">
                            <template #content>
                                <div class="tip-wrap">
                                    <div>
                                        {{ i18n.global.t('meos_control_web.data_update_time_colon')
                                        }}{{ formatDate(getRunningParamByInfoCode(runningParameters, item.infoCode)?.updateTime) }}
                                    </div>
                                    <div>{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</div>
                                </div>
                            </template>
                            <div
                                v-if="!getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue"
                                @click="jumpTo('analysis', { infoCode: getRunningParamByInfoCode(runningParameters, item.infoCode)?.infoCode, id: id })"
                            >
                                <StatusText
                                    :text="
                                        (getRunningParamByInfoCode(runningParameters, item.infoCode)?.dataSource?.[0].name ?? '') +
                                        (getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue?.unit ?? '')
                                    "
                                    type="normal"
                                ></StatusText>
                            </div>
                            <div
                                v-if="getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue"
                                @click="jumpTo('analysis', { infoCode: getRunningParamByInfoCode(runningParameters, item.infoCode)?.infoCode, id: id })"
                            >
                                <StatusText
                                    :text="
                                        getRunningParamByInfoCode(runningParameters, item.infoCode)?.infoCodeValue ??
                                        '' + (getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue?.unit ?? '')
                                    "
                                    type="normal"
                                ></StatusText>
                                <span>{{ getRunningParamByInfoCode(runningParameters, item.infoCode)?.additionalMapValue?.infoCodeName ?? '' }}</span>
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
    </div>
</template>
<script setup>
import i18n from '@/localization';
import StatusText from './components/StatusText.vue';
import HeaderWrap from './components/HeaderWrap.vue';
import { useInputHeader, useTableHeader } from './hooks/useControlHeader';
import { loopControlList } from '@/store/loopControlList';
import { importanceDegree } from '@/utils/viewUtils';
import { isHaveData, formatDate, jumpTo } from './utils';
import useControltList from './hooks/useControltList';
const loopListStore = loopControlList();
// 筛选栏相关
const { space, templateTypeList, onlineStatus, faultConditions } = useInputHeader();

// 表头相关
const { time, search, loading, keyword, pageFuc, showHeader, pageMeta, dataSource, runningColumn, controlHeaderList, clearSearch, handleChange, queryChange, tableHeightChange } =
    useTableHeader(space);
const { selectList } = useControltList();
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
    if (loopListStore.toggleCoBtnOpen) {
        return true;
    } else {
        return isWatchIndex.value > num;
    }
};
</script>
<style lang="less" scoped>
.loop-list-wrap {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    > .table-header-wrap {
        padding-top: 12px;
        .input-wrap {
            width: 282px;
            height: 34px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
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
        overflow: hidden;
        .loop-table-wrap {
            max-height: 100%;
            border: 1px solid @grey-300;
            border-right: 0.5px solid @grey-300;
            border-left: 0.5px solid @grey-300;

            border-radius: 4px;
            .meri-table {
                margin-top: -1px;
                margin-left: -1px;
            }
            &.table-loading {
                .meri-table {
                    border-left: none;
                }
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
            -webkit-line-clamp: 2;
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
</style>
