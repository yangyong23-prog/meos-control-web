<template>
    <div v-show="actShow" class="circuit-grouping-sel">
        <div class="filter-warp fcb">
            <div class="statics">
                {{ i18n.global.t('meos_control_web.group_list') }}
            </div>
            <div class="selects">
                <m-select
                    v-model="curLocalRemoteStatus"
                    :size="209"
                    :options="localRemoteOptions"
                    :prefix="`${i18n.global.t('meos_control_web.include_local_status_circuit')}:`"
                    clearable
                ></m-select>

                <m-search
                    immediate
                    type="enter"
                    :placeholder="i18n.global.t('meos_control_web.press_enter_search_group_name')"
                    @change="searchInputChange"
                    @clear="curSearchInput = ''"
                >
                </m-search>
            </div>
        </div>
        <div class="content">
            <div class="left">
                <div v-for="group in curFuncTypeList" :key="group.id" :class="{ act: group.id === curSelFuncType }" class="func-item" @click="curSelFuncType = group.id">
                    <div class="group-name">{{ group.name }}</div>
                    <div v-if="funcSelCountMap[group.id] > 0" class="sel-count">
                        {{ i18n.global.t('meos_control_web.selected_group_count', { count: funcSelCountMap[group.id] }) }}
                    </div>
                </div>
            </div>
            <m-table :columns="columnsList" class="group-table" :data-source="curTableData" :checkbox="true" @checked-change="checkedChange">
                <template #name="{ name }">
                    <div class="row-name" v-html="name"></div>
                </template>
                <template #purpose="{ purpose }">
                    <div v-ellipsis class="row-name m-ellipsis">{{ purpose }}</div>
                </template>
                <template #loopCount="{ loopCount }">
                    <div v-ellipsis class="row-name m-ellipsis">{{ loopCount }}</div>
                </template>

                <template #localCount="row">
                    <div class="local-remote" @click="handleLocalRemoteStatusClick(row)">
                        <m-popover v-if="row.localCount > 0" :arrow-overflow="false" theme="darkTransparent" trigger="hover">
                            <template #content>
                                <div class="popover-content">
                                    <div v-for="item in row.relObjects?.filter(item => item.local)" :key="item.id" class="item">{{ item.localName ?? '--' }}</div>
                                </div>
                            </template>
                            <div class="local-count">{{ row.localCount }}</div>
                        </m-popover>
                        <div v-else style="padding: 4px 8px">0</div>
                    </div>
                </template>
            </m-table>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import useLoading from '@/hooks/useLoading';
import DockSingleton from '@/hooks/responsiveDock';
import { nameMatch } from '@/utils/viewUtils';
import { SETTING_MODE, INFOCODE } from '../../variables';
import useCircuitGroup from './hooks/useCircuitGroup';
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
    },
    actShow: {
        type: Boolean,
        default: false
    }
});

const {
    curSelFuncType,
    curTableData,
    curSearchInput,
    curLocalRemoteStatus,
    curFuncTypeList,
    selItemCount,
    selLoopLocalCount,
    selGroupInfo,
    funcSelCountMap,
    setSelects,
    reset,
    checkedChange
} = useCircuitGroup(props);

const localRemoteOptions = [
    {
        id: INFOCODE.localRemoteStatus0.dataValue,
        name: i18n.global.t('common.yes')
    },
    {
        id: INFOCODE.localRemoteStatus1.dataValue,
        name: i18n.global.t('common.no')
    }
];
const columnsList = ref([
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.goupname'),
        ellipsis: true,
        width: 265
    },
    {
        dataIndex: 'purpose',
        title: i18n.global.t('meos_control_web.group_purpose'),
        width: 282
    },
    {
        dataIndex: 'loopCount',
        title: i18n.global.t('meos_control_web.loop_count'),
        width: 156
    },
    {
        dataIndex: 'localCount',
        title: `${i18n.global.t('meos_control_web.local_loop_count')}`,
        width: 156
    }
]);
const searchInputChange = val => {
    console.log('searchInputChange: ', val);
    curSearchInput.value = val;
};

defineExpose({
    reset,
    setSelects,
    selItemCount,
    selLoopLocalCount,
    selGroupInfo
});
</script>
<style lang="less" scoped>
.circuit-grouping-sel {
    display: flex;
    margin-top: 12px;
    flex: 1;
    overflow: hidden;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    flex-direction: column;
    gap: 12px;

    .filter-warp {
        width: 100%;
        .selects {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        width: 100%;
        display: flex;
        flex: 1;
        align-items: flex-start;
        gap: 8px;
        align-self: stretch;
        height: 100%;
        .left {
            display: flex;
            width: 304px;
            height: 100%;
            border-right: 1px solid var(--Grey-Grey-300, #e1e5eb);
            padding-right: 8px;
            flex-direction: column;
            align-items: flex-start;
            .func-item {
                display: flex;
                padding: 9px 12px 9px 8px;
                align-items: center;
                gap: 8px;
                width: 100%;
                cursor: pointer;
                &.act {
                    border-radius: 4px;
                    background: var(--Palette-Blue-100, #d9ebff);
                }
                .sel-count {
                    margin-left: 4px;
                    color: var(--Grey-Grey-600, #626c78);
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 20px; /* 166.667% */
                }
            }
        }
        .group-table {
            flex: 1;
            overflow-x: hidden;
            height: calc(100% - 46px);
        }
    }
    .local-count {
        color: var(--Palette-Blue-500, #246fe5);
        padding: 4px 8px;
    }
}
</style>
