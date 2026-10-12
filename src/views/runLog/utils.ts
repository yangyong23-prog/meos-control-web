// @ts-ignore
import i18n from '@/localization';
import { ref, reactive, computed } from 'vue';
import dayjs from 'dayjs';
import { $Message } from 'meri-plus';
import { TreeData, TREE_NODE_TYPE } from './types';
import { getDayjsTz } from '@/utils/globalVariables';

type UnknownObj = Record<string, unknown>;

export const setDisabledGroupedTree = (tree: TreeData[]) => {
    const replaceKey = (arr: TreeData[]) => {
        return arr.map((v: TreeData) => {
            if (Array.isArray(v?.children) && !!v?.children?.length) {
                const newChildren: any[] = replaceKey(v?.children);
                const newItem = {
                    ...v,
                    disabled: v.type !== TREE_NODE_TYPE.TREE_TEMPLATE,
                    children: newChildren
                };
                return newItem;
            } else {
                const newItem = {
                    ...v,
                    disabled: v.type !== TREE_NODE_TYPE.TREE_TEMPLATE
                };
                return newItem;
            }
        });
    };
    const newTree: TreeData[] = replaceKey(tree);
    return newTree;
};

export const getComputedHeaders = (headers: UnknownObj[]) => {
    const leafHeadKeys: string[] = [];
    const replaceKey = (arr: any[]) => {
        return arr.map((v: UnknownObj) => {
            if (Array.isArray(v?.children) && !!v?.children?.length) {
                const newChildren: any[] = replaceKey(v?.children);
                const newHeader = {
                    ...v,
                    children: newChildren,
                    dataIndex: v.id,
                    title: v.name,
                    resizable: true,
                    maxWidth: 400
                };
                return newHeader;
            } else {
                const newHeader = {
                    ...v,
                    dataIndex: v.id,
                    title: v.name,
                    resizable: true,
                    maxWidth: 400
                };
                const idStr = v?.id?.toString();
                if (idStr) {
                    leafHeadKeys.push(idStr);
                }
                return newHeader;
            }
        });
    };
    const newHeaders: UnknownObj[] = replaceKey(headers);
    return { newHeaders, headKeys: [...new Set(leafHeadKeys)] };
};

export const getComputedData = (data: UnknownObj[], keys: string[]) => {
    return data.map((v, i) => ({
        id: `id-${i}`,
        ...v,
        [keys[i]]: v[keys[i]]
    }));
};

export const useTimeQuery = () => {
    const initCurrentDateTime = () => {
        return `${getDayjsTz().format('YYYY.MM.DD 00:00:00')}-${getDayjsTz().format('YYYY.MM.DD 23:59:59')}`;
    };
    const showTimeErr = ref(false);
    const errMsg = computed(() => {
        return showTimeErr.value ? i18n.global.t('meos_control_web.select_date_max_7_days') : '';
    });
    const timeRangeScope = computed(() => {
        return `1990.12.31 23:59:59-${getDayjsTz().format('YYYY.MM.DD HH:mm:ss')}`;
    });
    const onTimeChange = (value: string) => {
        const startDay = value.split('-')[0];
        const endDay = value.split('-')[1];

        const daysDiff = dayjs(endDay).diff(dayjs(startDay), 'day');
        if (daysDiff > 7) {
            $Message.error({ title: i18n.global.t('meos_control_web.select_date_max_7_days') });
            showTimeErr.value = true;
        } else {
            showTimeErr.value = false;
        }
    };
    return { errMsg, timeRangeScope, onTimeChange, initCurrentDateTime };
};

export const useTableQuery = () => {
    const pageState = reactive({
        pageNum: 1,
        pageSize: 10
    });
    const pageTotalState = reactive({
        total: 0
    });
    const columns = ref<unknown[]>([]);
    const dataSource = ref<unknown[]>([]);
    const sizeChange = (size: number) => {
        pageState.pageSize = size;
    };
    const isEmpty = computed(() => {
        const hasData = (pageTotalState.total ?? 0) > 0;
        return !hasData;
    });

    const mergeMethod = () => {
        return {
            rowspan: 1,
            colspan: 1
        };
    };

    const clearTableData = () => {
        dataSource.value = [];
        columns.value = [];
        pageState.pageNum = 1;
        pageState.pageSize = 10;
        pageTotalState.total = 0;
    };

    return { pageState, pageTotalState, columns, dataSource, sizeChange, isEmpty, mergeMethod, clearTableData };
};
