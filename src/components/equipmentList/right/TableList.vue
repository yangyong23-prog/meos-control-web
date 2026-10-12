<template>
    <div class="table-list w100">
        <div class="table-list-table">
            <HeaderBatchControl v-if="selectTableList?.length > 0" :selected-list="selectTableList" :params="batchOpBtnParams"></HeaderBatchControl>
            <m-popover
                v-if="isEdge()"
                placement="bottom-end"
                trigger="manually"
                width="440px"
                :is-open="isOpenHeaderSet"
                style="--m-popover-padding: 0"
                :show-arrow="false"
                @click-event="clickEvent"
            >
                <template #content>
                    <HeaderSet v-if="isOpenHeaderSet" :columns="columns" @close="isOpenHeaderSet = false" />
                </template>
                <div class="hedaer-set-btn fcc" :title="i18n.global.t('meos_control_web.config_search_filter')" @click="isOpenHeaderSet = true">
                    <IconMeriActionSetting hover-color="var(--blue-500)" />
                </div>
            </m-popover>
            <m-tips v-else :content="i18n.global.t('meos_control_web.cloud_not_operate')" theme="darkTransparent">
                <div class="hedaer-set-btn fcc disabled" style="cursor: not-allowed">
                    <IconMeriActionSetting color="var(--gray-400)" />
                </div>
            </m-tips>

            <m-table
                :key="refreshTableKey"
                :columns="columnsData"
                :data-source="tableData"
                :checkbox="true"
                column-line
                :active-rows="activeRows"
                :row-class-name="rowClassName"
                @checked-change="checkedChange"
            >
                <template #detailActionColumn="data">
                    <div class="detail-action-cell">
                        <span class="detail-action-btn" @click.stop="handleDetailClick(data)">{{ i18n.global.t('meos_control_web.details') }}</span>
                    </div>
                </template>
                <template v-for="(column, i) in slots" #[column.dataIndex]="data" :key="column.dataIndex + column.title + i">
                    <TdBox :data="data" :column="column" />
                </template>
            </m-table>
        </div>

        <div class="table-list-pagination fcb">
            <div></div>
            <m-pagination
                v-show="paginationData.total > 0"
                v-model:page-num="paginationData.pageNum"
                background
                :total="paginationData.total"
                :page-size="paginationData.pageSize"
                :sizes-list="[10, 30, 50, 100, 200, 300, 400, 500]"
                layout="total,prev,pager,next,sizes"
                style="justify-self: end"
                @page-change="pageChange"
                @size-change="sizeChange"
            ></m-pagination>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { canControl } from '@/utils/tools';
import { paginationDataKey, pageChangeKey, sizeChangeKey, checkedChangeKey, clearDataCheckKey, isOpenHeaderSetKey } from '../hooks/useTableDataHook';
import { commonPropsKey, selectTableListKey } from '../hooks/useBaseHook';
import TdBox from './TdBox.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { IconMeriActionSetting } from 'meri-icon';
import HeaderSet from './HeaderSet.vue';

import HeaderBatchControl from './HeaderBatchControl.vue';
import { getBatchBtnInfoList } from '../utils';
import { operationPermissionsKey } from '../hooks/useBaseHook';
import { uniqueId } from 'lodash';
import { isEdge } from '@/utils/envUtils';
import { CLOSE_CONTROL_FORM, IOT_SETTING } from '@/utils/globalVariables';
import emitter from '@/utils/bus';
import { SHOW_TYPE } from '../variables';

const DETAIL_ACTION_COLUMN_KEY = 'detailActionColumn';
const paginationData = inject(paginationDataKey);
const pageChange = inject(pageChangeKey);
const sizeChange = inject(sizeChangeKey);
const checkedChange = inject(checkedChangeKey);
const clearDataCheck = inject(clearDataCheckKey);
const selectTableList = inject(selectTableListKey);
const isOpenHeaderSet = inject(isOpenHeaderSetKey);
const commonProps = inject(commonPropsKey);
const emits = defineEmits(['click-equip']);

const { getIotData } = DockSingleton.getInstance();

const props = defineProps({
    tableData: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        default: () => []
    },

    refreshTableKey: {
        type: String,
        default: ''
    },
    selectEquipId: {
        type: String,
        default: ''
    },
    hasEquipmentInfo: {
        type: Boolean,
        default: true
    }
});
// const handleColumns = arr => {
//     arr?.forEach(level1 => {
//         delete level1.relInfoCodeConfigs;
//         if (!level1.children?.length) {
//             slots.value.push(level1);
//         } else {
//             // 处理操作列
//             const SET_VALUE_ACTION_COLUMN = item.children?.find(i => i.showStyle?.showType === SHOW_TYPE.SET_VALUE_ACTION_COLUMN && i.infoCodeType === 'IOT_SETTING');
//             if (SET_VALUE_ACTION_COLUMN) {
//                 item.children.push({
//                     ...SET_VALUE_ACTION_COLUMN,
//                     title: i18n.global.t('meos_control_web.operation_column'),
//                     showStyle: {
//                         showType: SHOW_TYPE.SET_VALUE_ACTION_COLUMN
//                     },
//                     infoCodeType: 'IOT_SETTING',
//                     isOperation: true,
//                     dataIndex: SET_VALUE_ACTION_COLUMN.infoCode + '&&isOperation',
//                     minWidth: 110
//                 });
//             }
//             item.children = item.children.filter(v => v.show);
//             handleColumns(item.children);
//         }
//     });
// };
const handleColumn = children => {
    // 处理操作列
    const SET_VALUE_ACTION_COLUMN = children?.find(i => i.showStyle?.showType === SHOW_TYPE.SET_VALUE_ACTION_COLUMN && i.infoCodeType === IOT_SETTING);
    if (SET_VALUE_ACTION_COLUMN) {
        children.push({
            ...SET_VALUE_ACTION_COLUMN,
            title: i18n.global.t('meos_control_web.operation_column'),
            showStyle: {
                ...SET_VALUE_ACTION_COLUMN.showStyle,
                showType: SHOW_TYPE.SET_VALUE_ACTION_COLUMN
            },
            infoCodeType: IOT_SETTING,
            isOperation: true,
            dataIndex: uniqueId('isOperation'),
            minWidth: 110
        });
    }
};
const handleColumns = columns => {
    console.log(columns);

    columns.forEach(level1 => {
        level1.children = level1.children?.filter(v => v.show);
        if (!level1.children?.length) {
            slots.value.push(level1);
        }
        // handleSET_VALUE_ACTION_COLUMN(level1.children);
        level1.children?.forEach(level2 => {
            level2.children = level2.children?.filter(v => v.show);
            if (!level2.children?.length) {
                slots.value.push(level2);
            }
            // 处理操作列
            handleColumn(level2.children);
            level2.children?.forEach(level3 => {
                slots.value.push(level3);
            });
        });
    });
};
const slots = ref([]);
const columnsData = ref([]);
const operationPermissions = inject(operationPermissionsKey);
const rowClassName = row => {
    if (operationPermissions.value.disabled) {
        return;
    }
    const infoCodesData = [];
    infoCodesData.push(getIotData(row.id, 'localRemoteStatus'));
    infoCodesData.push(getIotData(row.id, 'onlineStatus'));
    const canControlObj = canControl(infoCodesData);
    row.disable = !canControlObj.value;
    if (row.disable) {
        clearDataCheck([row.id]);
    }
    return;
};
const clickEvent = (e, type) => {
    if (!type) {
        isOpenHeaderSet.value = false;
    }
};
const createDetailActionColumn = () => ({
    title: i18n.global.t('meos_control_web.operation_column'),
    dataIndex: DETAIL_ACTION_COLUMN_KEY,
    key: DETAIL_ACTION_COLUMN_KEY,
    minWidth: 98,
    weight: 1,
    fixed: 'right',
    isDetailEntry: true
});
const batchOpBtnParams = computed(() => {
    // return getBatchBtnInfoList(selectTableList.value);
    return getBatchBtnInfoList(selectTableList.value, props.columns, commonProps.manualAutoSetControl);
});
const activeRows = computed(() => {
    if (props.selectEquipId) {
        return [props.selectEquipId];
    }
    return [];
});
const handleDetailClick = row => {
    emitter.emit(CLOSE_CONTROL_FORM, { needHide: true, needClose: true });
    emits('click-equip', row);
};
const setColumnsData = newVal => {
    slots.value = [];
    columnsData.value = [];
    const arr = structuredClone(newVal);
    handleColumns(arr);
    columnsData.value = arr.filter(v => v.children?.length || v.dataIndex === 'localName');
    const hasOperationColumn = columnsData.value.some(item => item.dataIndex === DETAIL_ACTION_COLUMN_KEY);
    if (!hasOperationColumn && props.hasEquipmentInfo) {
        columnsData.value.push(createDetailActionColumn());
    }
};

watch(
    () => props.columns,
    newVal => {
        setColumnsData(newVal);
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.table-list {
    padding: 0 16px;
    flex: 1;
    &-table {
        height: calc(100% - 60px);
        width: 100%;
        position: relative;
    }
    &-pagination {
        position: relative;
        z-index: 11;
        height: 60px;
    }
    .hedaer-set-btn {
        height: 40px;
        width: 38px;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 9;
        cursor: pointer;
        box-shadow: -6px 0px 6px -6px #1f242933;
        border: 1px solid var(--gray-300);
        background-color: var(--gray-100);
    }
    .detail-action-cell {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 12px;
    }
    .detail-action-btn {
        color: var(--blue-500);
        cursor: pointer;
        white-space: nowrap;
    }
}
</style>
