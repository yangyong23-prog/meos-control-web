<template>
    <div class="br-table">
        <m-table :id="id" :columns="columns" :merge-method="mergeMethod" :data-source="tableData" v-bind="$attrs">
            <template v-for="item in bodySlotColumns" :key="item.dataIndex" #[item.dataIndex]="row">
                <div
                    v-ellipsis="{ disabled: item.ellipsis === false ? true : false }"
                    :class="{ 'm-ellipsis': item.ellipsis === false ? false : true }"
                    class="meri-table-body-cell-text"
                >
                    <slot :name="item.dataIndex" :row="row">
                        <div style="display: inline">
                            {{ isEmpty((row as any)[item.dataIndex]) }}
                        </div>
                    </slot>
                </div>
            </template>
            <template v-for="item in headerSlotColumns" :key="item.headerSlot" #[item.headerSlot]>
                <slot v-if="item.headerSlot" :name="item.headerSlot"> </slot>
            </template>
        </m-table>
        <m-pagination
            v-if="total !== 0 && showPagination"
            v-model:page-num="pagination.pageIndex"
            background
            :total="total"
            :layout="layout"
            :sizes-tmp-string="sizeTmpString"
            class="cc-pagination"
            v-bind="paginationAttrs"
            @page-change="pageHandler"
            @size-change="pageSizeHandler"
        />
    </div>
</template>

<script lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { isEmpty } from '@/utils/tools';
import { defineComponent } from 'vue';
import props from './props';
import { useTableEvent } from './use-table';
const sizeTmpString = computed(() => {
    return '{value} / ' + i18n.global.t('meos_control_web.page');
});
export default defineComponent({
    name: 'BrTable',
    inheritAttrs: false,
    props,
    setup(props, context) {
        const { total, pagination, state, tableData, refreshData, pageSizeHandler, pageHandler, mergeMethod, id } = useTableEvent(props, context);

        // 将嵌套列拍平，便于为所有层级注册具名插槽
        const flattenColumns = (cols?: any[]): any[] => {
            const res: any[] = [];
            (cols || []).forEach(c => {
                res.push(c);
                if (Array.isArray(c?.children) && c.children.length) {
                    res.push(...flattenColumns(c.children));
                }
            });
            return res;
        };
        // 单元格插槽仅需要包含有 dataIndex 的列
        const bodySlotColumns = computed(() => flattenColumns(props.columns).filter((c: any) => c && c.dataIndex));
        // 表头插槽仅需要包含有 headerSlot 的列
        const headerSlotColumns = computed(() => flattenColumns(props.columns).filter((c: any) => c && c.headerSlot));

        context.expose({ refreshData });
        return { isEmpty, sizeTmpString, total, pagination, ...toRefs(state), tableData, pageSizeHandler, pageHandler, id, mergeMethod, bodySlotColumns, headerSlotColumns };
    }
});
</script>
<style scoped lang="less">
.br-table {
    height: 100%;
    width: 100%;
}
.meri-table {
    // border: 1px solid var(--gray-300);
    &.x-line {
        // border-top: none;
        // border-right: none;
    }
    height: calc(100% - 45px);
    :deep(.m-loading-mask) {
        top: 39px;
    }
}
.cc-pagination {
    padding: 16px 0;
    flex-direction: row-reverse;
    border-top: 1px solid var(--gray-300);
}
</style>
<style></style>
