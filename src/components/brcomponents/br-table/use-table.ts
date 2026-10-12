// @ts-ignore
import i18n from '@/localization';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getTableLists } from '@/apis/public';
import { BaseResponse } from '@/types/common';
import { cloneDeep, toNumber, uniqueId } from 'lodash';
import { MLoading } from 'meri-plus';
import { Row } from 'meri-plus/dist/table/src/TableProps';
import { Ref, SetupContext, nextTick, computed, onMounted, ref, reactive } from 'vue';
import { getJSON, setJSON } from '@/utils/storageUtils';
import { TableProps } from './props';
interface State {
    timer: any;
    requestStartTime: number;
    requestEndTime: number;
    loading: any;
    tableData?: Row[];
    cacheLocalData: Row[];
    isLoadMore: boolean;
    tableId: string;
    lastTime: number;
    spanArr: any[];
    pos: number;
    [x: string]: any;
}

function useTableEvent(props: TableProps, context: SetupContext<Record<string, any>>) {
    const { emit } = context;
    const state: State = reactive({
        timer: '',
        requestStartTime: 0,
        requestEndTime: 0,
        loading: [],
        tableData: [],
        cacheLocalData: [],
        isLoadMore: false,
        tableId: '',
        lastTime: 0,
        spanArr: [],
        pos: 0
    });
    const id = ref(uniqueId('br-table'));
    const tableData = ref<Row[]>([]);
    const total = ref<number>(0);
    const pagination: Ref<{ pageIndex: number; pageSize: number }> = ref({
        pageIndex: props.setPageIndex,
        pageSize: (() => {
            const { pageSizes } = props;
            if (pageSizes.length > 0) {
                return pageSizes[1];
            }
            return 20;
        })()
    });
    onMounted(() => {
        initData();
    });
    // 获取缓存的分页数据
    const LocalPagination = getLocalPagination();
    if (props.tableId && LocalPagination.flag) {
        pagination.value = LocalPagination.pagination;
    }

    function initData() {
        const { type, autoLoad, dataSource, params } = props;
        if (type === 'remote' && autoLoad) {
            fetchHandler(params);
        } else if (type === 'local' && autoLoad) {
            loadLocalData(dataSource);
        }
    }
    function loadLocalData(dataSource: Row[]) {
        const { autoLoad } = props;
        if (!dataSource) {
            throw new Error('哈喽baby: 当前是本地数据加载模式, 你必须传递的dataSource是一个数组.');
        }
        const cacheData: Row[] = cloneDeep(dataSource);
        state.cacheLocalData = cacheData;
        if (autoLoad) {
            if (props.showPagination) {
                tableData.value = dataPaginationFilter(state.cacheLocalData);
            } else {
                tableData.value = state.cacheLocalData;
            }
            if (props.spanArrSet.length > 0) {
                getSpanArr(cloneDeep(tableData.value));
            }
            total.value = cacheData.length;
            emit('requestDone', tableData.value);
        }
    }
    /**
     * @description: 对本地数据进行分页
     * @param {Row} dataSource
     * @return {*}
     */
    const dataPaginationFilter = (dataSource: Row[]): Row[] => {
        const { pageIndex, pageSize } = pagination.value;
        return dataSource.filter((item, i) => i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize);
    };
    /**
     * @description: 获取表格数据
     * @return {*} Promise<any>
     */
    const fetchHandler = async (params: Record<string, any>): Promise<any> => {
        const { needLoading, url, method, pageIndexKey, pageSizeKey, showPagination } = props;
        clearTimeout(state.timer);
        destroyLoading();
        state.requestStartTime = new Date().valueOf();
        if (needLoading) {
            state.loading.push(
                MLoading.service({
                    target: `#${id.value}.meri-table`,
                    fullscreen: false,
                    duration: 100,
                    lottieName: 'ball',
                    loadTextOptions: {
                        text: i18n.global.t('common.loading'),
                        style: {}
                    },
                    loadIconStyle: {
                        width: '100px',
                        height: '100px'
                    }
                })
            );
        }
        if (showPagination) {
            // eslint-disable-next-line no-param-reassign
            params = Object.assign(params, {
                [pageIndexKey]: pagination.value.pageIndex,
                [pageSizeKey]: pagination.value.pageSize
            });
        }
        try {
            const response: BaseResponse<any> = await getTableLists(params, method, url);
            state.requestEndTime = new Date().valueOf();
            emit('responseMethod', response);
            getTableData(cloneDeep(response));
            getTableTotal(cloneDeep(response));
            emit('requestDone', tableData.value, {
                total: total.value,
                pagination: pagination.value
            });
            if (props.spanArrSet.length > 0) {
                getSpanArr(cloneDeep(tableData.value));
            }
            closeLoading();
        } catch (error) {
            tableData.value = [];
            closeLoading();
        }
    };
    // 处理数据，判断是否需要合并，处理数据
    function getSpanArr(data: Row[]) {
        props.spanArrSet.forEach((item, index) => {
            console.log(index);
            state[`spanArr${index}`] = [];
            for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                    state[`spanArr${index}`].push(1);
                    state.pos = 0;
                } else {
                    // 判断当前元素与上一个元素是否相同
                    const strs = item.keys.map((e: any) => `data[i].${e} === data[i - 1].${e}`);
                    // eslint-disable-next-line no-eval
                    if (eval(strs.join(' && '))) {
                        state[`spanArr${index}`][state.pos] += 1;
                        state[`spanArr${index}`].push(0);
                    } else {
                        state[`spanArr${index}`].push(1);
                        state.pos = i; // 上次操作的下标记录
                    }
                }
            }
        });
    }
    // 表格最终合并
    // eslint-disable-next-line consistent-return
    function mergeMethod(row: any, col: any, rowIndex: number, colIndex: number): any {
        for (let index = 0; index < props.spanArrSet.length; index++) {
            const item = props.spanArrSet[index];
            if (item.index.indexOf(colIndex) !== -1) {
                const rowMergeMethod: number = state[`spanArr${index}`][rowIndex];
                const colMergeMethod: number = rowMergeMethod > 0 ? 1 : 0;
                return {
                    rowspan: rowMergeMethod,
                    colspan: colMergeMethod
                };
            }
        }
        return {
            rowspan: 1,
            colspan: 1
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const infiniteScrollFun = () => {
        if (props.infiniteScroll) {
            const maxPageIndex = Math.ceil(total.value / props.pageSizes[0]);
            if (pagination.value.pageIndex < maxPageIndex) {
                pagination.value.pageIndex = pagination.value.pageIndex + 1;
                changeDataTableHandler();
            }
        }
    };
    /**
     * @description: 关闭loading
     * @return {*}
     */
    const closeLoading = (): void => {
        if (state.requestEndTime - state.requestStartTime < 300) {
            state.timer = setTimeout(() => {
                destroyLoading();
                clearTimeout(state.timer);
            }, 300);
        } else {
            destroyLoading();
        }
    };
    const destroyLoading = () => {
        state.loading.forEach((item: { destroy: () => void }) => {
            item?.destroy?.();
        });
        state.loading = [];
    };
    /**
     * @description: 获取表格数据
     * @param {BaseResponse} response
     * @return {*}
     */
    const getTableData = (response: BaseResponse<any>) => {
        let result = response;
        const { listField } = props;
        if (result && !(result instanceof Array)) {
            if (listField && listField.indexOf('.') !== -1) {
                listField.split('.').forEach(vv => {
                    result = result[vv];
                });
            } else {
                result = result[listField];
            }
        }
        if (!result || !(result instanceof Array)) {
            throw new Error(`当前数据key: ${listField} 不是一个数组哦.`);
        }
        if (props.dataHandler) {
            if (props.infiniteScroll) {
                tableData.value = response.data.current && response.data.current === 1 ? result.map(props.dataHandler) : tableData.value.concat(result.map(props.dataHandler));
            } else {
                tableData.value = result.map(props.dataHandler);
            }
        } else {
            tableData.value = result;
        }
    };
    /**
     * @description: 获取表格总条数
     * @param {BaseResponse} response
     * @return {*}
     */
    const getTableTotal = (response: BaseResponse<any>) => {
        const { totalField } = props;
        let totalValue: any = response;
        if (Object.prototype.toString.call(response) === '[object Array]') {
            totalValue = response.length;
        } else if (typeof response === 'object') {
            if (totalField && totalField.indexOf('.') !== -1) {
                totalField.split('.').forEach(vv => {
                    totalValue = totalValue[vv];
                });
            } else {
                totalValue = response[totalField];
            }
        } else {
            totalValue = 0;
        }
        total.value = toNumber(totalValue);
    };
    /**
     * @description: 刷新数据
     * @param {*} refresPage 是否刷新页码
     * @param {object} param:{isDeleteOne: 是否是删除一个数据}
     * @return {*}
     */
    function refreshData(refresPage: any = true, param: { isDeleteOne?: boolean } = { isDeleteOne: false }): any {
        const { isDeleteOne = false } = param;
        nextTick(() => {
            if (refresPage) {
                pagination.value.pageIndex = 1;
                if (props.infiniteScroll) {
                    tableData.value = [];
                    state.isLoadMore = false;
                }
            } else {
                // 最后一页最后一条删除和已读，页码到前一页
                if (isDeleteOne) {
                    total.value = total.value - 1;
                    const { pageSize } = pagination.value;
                    const totalPage = Math.ceil(total.value / pageSize);
                    const current = pagination.value.pageIndex > totalPage ? totalPage : pagination.value.pageIndex;
                    pagination.value.pageIndex = current < 1 ? 1 : current;
                    setLocalPagination();
                }
            }
            changeDataTableHandler();
        });
    }
    const dataFilterHandler = () => {
        const { cacheLocalData } = state;
        total.value = cacheLocalData.length;
        if (props.showPagination) {
            tableData.value = dataPaginationFilter(cacheLocalData);
        }
        emit('requestDone', tableData.value);
    };
    function changeDataTableHandler() {
        const { type, params } = props;
        if (type === 'local') {
            dataFilterHandler();
        } else if (type === 'remote') {
            // eslint-disable-next-line prefer-rest-params
            fetchHandler(params);
        }
    }
    /**
     * @description: 设置本地缓存分页
     * @param  {*}
     * @return {*}
     */
    function setLocalPagination() {
        const pagArr = getJSON('LocalPagination') || [];
        // 先判断缓存内的数组是否超出
        if (pagArr.length < 4) {
            changeLocalPagination(pagArr);
        } else {
            pagArr.pop();
            changeLocalPagination(pagArr);
        }
        setJSON('LocalPagination', pagArr);
    }
    /**
     * @description: 改变缓存的数组
     * @param  {*}
     * @return {*}
     * @param {*} pagArr
     */
    const changeLocalPagination = (pagArr: Record<string, any>): any => {
        // 判断是否需要缓存分页数据
        if (props.tableId) {
            let flag = false;
            pagArr.forEach((item: { [x: string]: { pageIndex: number; pageSize: number } }) => {
                // 如果存在已缓存的，则将需要替换
                if (item[props.tableId!]) {
                    item[props.tableId!] = pagination.value;
                    flag = true;
                }
            });
            // 如果是替换，则直接退出
            if (!flag) {
                pagArr.unshift({ [state.tableId]: pagination.value });
            }
        }
    };
    /**
     * @description: 去取当前tableId对应的缓存分页数据
     * @param  {*}
     * @return {*}
     */
    function getLocalPagination(): { flag: boolean; pagination: { pageIndex: number; pageSize: number } } {
        const pagArr = getJSON('LocalPagination') || [];
        // eslint-disable-next-line no-shadow
        let pagination: { pageIndex: number; pageSize: number } = { pageIndex: 0, pageSize: 10 },
            flag = false;
        pagArr.forEach((item: { [x: string]: any }) => {
            // 如果存在已缓存的,则取出
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (item[props.tableId!]) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                pagination = item[props.tableId!];
                flag = true;
            }
        });
        return { flag, pagination };
    }
    const nowSizeChange = ref(false);
    function pageSizeHandler(size: number) {
        nowSizeChange.value = true;
        nextTick(() => {
            pagination.value.pageSize = size;
            pagination.value.pageIndex = 1;
            paginationChange();
            nowSizeChange.value = false;
        });
    }
    function pageHandler() {
        if (!nowSizeChange.value) {
            paginationChange();
        }
    }
    function paginationChange() {
        setLocalPagination();
        changeDataTableHandler();
        emit('pagination-change', pagination.value);
    }
    return {
        fetchHandler,
        refreshData,
        initData,
        pageSizeHandler,
        pageHandler,
        mergeMethod,
        total,
        pagination,
        state,
        id,
        tableData
    };
}

export { useTableEvent };
