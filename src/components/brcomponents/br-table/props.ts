import type { Column, Row } from 'meri-plus/dist/table/src/TableProps';
import { ExtractPropTypes, PropType } from 'vue';
import { Method } from 'axios';

export type TabelType = 'remote' | 'local';
export const dataSource = {
    type: Array as PropType<Row[]>,
    default: () => []
};

const props = {
    type: {
        type: String as PropType<TabelType>,
        default: 'remote',
        validator(value: TabelType) {
            const types = ['remote', 'local'];
            const validType = types.indexOf(value) !== -1;
            if (!validType) {
                throw new Error(`Invalid type of '${value}', please set one type of 'remote' or 'local'.`);
            }
            return validType;
        }
    },
    url: {
        type: String as PropType<string>,
        default: ''
    },
    method: {
        type: String as PropType<Method>,
        default: 'get',
        validator: (value: Method) => {
            const methodTypes = ['get', 'post', 'put', 'delete'];
            return methodTypes.indexOf(value.toLowerCase()) !== -1;
        }
    },
    listField: {
        type: String as PropType<string>,
        default: 'data.records'
    },
    totalField: {
        type: String as PropType<string>,
        default: 'data.total'
    },
    params: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({})
    },
    columns: {
        type: Array as PropType<Column[]>,
        default: () => []
    },
    dataSource,
    autoLoad: {
        type: Boolean,
        default: true,
        validator(value: boolean) {
            const types = [true, false];
            const validType = types.indexOf(value) !== -1;
            if (!validType) {
                throw new Error(`Invalid type of '${value}', please set one type of 'true' or 'false'.`);
            }
            return validType;
        }
    },

    showPagination: { type: Boolean as PropType<boolean>, default: true },
    pageSizes: {
        type: Array as PropType<number[]>,
        default: () => [10, 20, 30, 50]
    },

    setPageIndex: {
        type: Number as PropType<number>,
        default: 1
    },

    layout: {
        type: String as PropType<string>,
        default: 'total,prev,pager,next,sizes'
    },

    pageIndexKey: {
        type: String as PropType<string>,
        default: 'current'
    },
    pageSizeKey: {
        type: String as PropType<string>,
        default: 'size'
    },
    paginationAttrs: Object as PropType<Record<string, any>>,
    needLoading: {
        type: Boolean as PropType<boolean>,
        default: true
    },
    dataHandler: {
        type: Function as PropType<(value: any, index: number, array: any[]) => any>
    },
    infiniteScroll: Boolean as PropType<boolean>,
    isLoadMore: Boolean as PropType<boolean>,
    tableId: String as PropType<string>,
    spanArrSet: {
        type: Array as PropType<{ keys: string[]; index: number[] }[]>,
        default: () => []
    }
};
export type TableProps = ExtractPropTypes<typeof props>;
export default props;
