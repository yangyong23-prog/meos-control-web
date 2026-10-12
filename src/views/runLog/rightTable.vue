<template>
    <div class="right-table">
        <div class="fc">
            <m-select v-model="selectValue" :options="options" :prefix="i18n.global.t('meos_control_web.system_name')" class="mr12" :clearable="!hasNodeDefaultVal"> </m-select>
            <m-date-picker
                v-model="dateTimeValue"
                :scope="timeRangeScope"
                :width="360"
                time-format="hm"
                type="datetimerange"
                :placeholder="i18n.global.t('meos_control_web.start_time_to_end_time')"
                :error-info="errMsg"
                :clearable="false"
                @change="onTimeChange"
            ></m-date-picker>
        </div>
        <div :class="{ mt20: true, 'table-warp': true, empty: isEmpty }">
            <m-table empty-text="--" :columns="columns" :merge-method="mergeMethod" :data-source="dataSource" :checkbox="false" :column-line="true"></m-table>
        </div>
        <div v-if="!isEmpty" class="footer-pagination mt16">
            <m-pagination
                v-model:page-num="pageState.pageNum"
                :total="pageTotalState.total"
                :page-size="pageState.pageSize"
                background
                layout="total,prev,pager,next,sizes"
                @size-change="sizeChange"
            ></m-pagination>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { MLoading } from 'meri-plus';
import { useTreeNodeStore } from './store';
import { getRunMonitorLogList, getRunMonitorLogListBySearch } from '@/apis/runLog';
import type { SelectOption, TableQuery, TreeData } from './types';
import { getComputedHeaders, getComputedData, useTimeQuery, useTableQuery } from './utils';

// 已选中树节点信息
const store = useTreeNodeStore();
const isLoadingNode = computed(() => store?.isLoadingNode);
const isLoadingIns = ref();
const computedNode = computed(() => store?.selectedNode);
const hasNodeDefaultVal = ref(false);
// 切换节点信息
const lazySwitchedNode = ref();
const isSwitching = ref(false);

// 下拉交互
const options = ref<SelectOption[]>([]);
const selectValue = ref();
const selectAbortController = ref();

// 查询时间
const { errMsg, timeRangeScope, onTimeChange, initCurrentDateTime } = useTimeQuery();
const dateTimeValue = ref(initCurrentDateTime());
const isWaitingTimeFetch = ref(false);

// 列表查询传参
const lazyQueryData = ref<TableQuery>({ curTime: initCurrentDateTime() });
const isTableLoading = ref(false);
const tableAbortController = ref();

async function fetchOptions(curNode?: TreeData, curTime?: string) {
    const beginTime = curTime?.split('-')[0].replaceAll('.', '-');
    const endTime = curTime?.split('-')[1].replaceAll('.', '-');
    const params = {
        templateId: curNode?.id,
        beginTime,
        endTime
    };

    selectValue.value = undefined;
    options.value = [];

    selectAbortController.value = new AbortController();
    const res = await getRunMonitorLogListBySearch(params, {
        signal: selectAbortController.value.signal
    });
    if (res?.code === '00000') {
        const resData = res?.data || [];
        if (Array.isArray(resData) && !!resData?.length) {
            const mapResData = resData.map(v => ({ ...v, name: v?.value }));
            options.value = mapResData as SelectOption[];
            // 若选中的模板节点有默认值，则取下拉选项中的第一个，否则不取值
            if (hasNodeDefaultVal.value) {
                selectValue.value = mapResData[0]?.id;
            }
        }
    }
}

// 列表数据
const { pageState, pageTotalState, columns, dataSource, sizeChange, isEmpty, mergeMethod, clearTableData } = useTableQuery();

async function fetchTableData(params?: { selectedNode?: TreeData; searchItem?: SelectOption; time?: string; page?: Record<string, number> }) {
    const { selectedNode, searchItem, time, page } = params || {};
    if (!selectedNode || isTableLoading.value) {
        return;
    }

    const beginTime = time?.split('-')?.[0]?.replaceAll('.', '-');
    const endTime = time?.split('-')?.[1]?.replaceAll('.', '-');
    const { key, nodeCode: nodecode, value } = searchItem || {};
    const postParams = {
        templateId: selectedNode?.id,
        params: searchItem
            ? [
                  {
                      key,
                      nodecode,
                      value
                  }
              ]
            : undefined,
        beginTime,
        endTime,
        size: page?.pageSize,
        current: page?.pageNum
    };

    let loading = MLoading.service({
        target: '.table-warp',
        fullscreen: false,
        duration: 3000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });

    isTableLoading.value = true;
    tableAbortController.value = new AbortController();
    const res = await getRunMonitorLogList(postParams, {
        signal: tableAbortController.value.signal
    }).finally(() => {
        loading?.destroy?.();
        isTableLoading.value = false;
    });
    if (res?.code === '00000') {
        const { data: resData, total } = res;
        const { headers, sheetData } = resData as Record<string, unknown>;
        if (Array.isArray(headers) && !!headers?.length) {
            const { newHeaders, headKeys } = getComputedHeaders(headers);
            columns.value = newHeaders;

            if (Array.isArray(sheetData) && !!sheetData?.length) {
                dataSource.value = getComputedData(sheetData, headKeys);
                pageTotalState.total = total || sheetData?.length;
            }
        } else {
            clearTableData();
        }
    }
}

watch(isLoadingNode, curLoading => {
    if (curLoading) {
        isLoadingIns.value = MLoading.service({
            target: '.right-table',
            fullscreen: false,
            duration: 3000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    } else {
        isLoadingIns.value?.destroy?.();
    }
});

watch(computedNode, (curNode, preNode) => {
    try {
        const itemArr = JSON.parse(curNode?.content ?? '{}');
        if (Array.isArray(itemArr) && !!itemArr?.length) {
            const showDefault = itemArr.some(v => !!v?.defaultValue?.toString());
            hasNodeDefaultVal.value = showDefault;
        }
    } catch (error) {
        hasNodeDefaultVal.value = false;
    }
    // 选中节点切换时取消请求，清空列表数据、时间设置默认，请求下拉项；
    if (curNode?.id && curNode?.id !== preNode?.id) {
        isSwitching.value = true;
        lazySwitchedNode.value = curNode;

        selectAbortController.value?.abort?.();
        tableAbortController.value?.abort?.();

        clearTableData();

        const curTime = initCurrentDateTime();
        dateTimeValue.value = curTime;

        fetchOptions(curNode, curTime).finally(() => {
            isSwitching.value = false;
        });
    }
});

watch(
    selectValue,
    curItem => {
        if (isWaitingTimeFetch.value) {
            // 时间请求下拉项时， 等待下拉选中数据更新，属性赋值，暂不触发请求表格数据
            lazyQueryData.value.curItem = curItem;
        } else {
            // 否则直接触发请求表格数据
            lazyQueryData.value = { ...lazyQueryData.value, curItem };
        }
    },
    {
        immediate: true
    }
);

watch(
    dateTimeValue,
    async curTime => {
        if (computedNode?.value?.id) {
            // 若为选中节点切换时段，时间设置默认，触发请求表格数据
            if (isSwitching.value) {
                lazyQueryData.value = { ...lazyQueryData.value, curTime };
                return;
            }

            isWaitingTimeFetch.value = true;
            await fetchOptions(computedNode?.value, curTime).finally(() => {
                isWaitingTimeFetch.value = false;
            });
            // 时间请求下拉项完成，全量更新，直接触发请求表格数据
            lazyQueryData.value = { ...lazyQueryData.value, curTime };
        }
    },
    {
        immediate: true
    }
);

watch([lazySwitchedNode, lazyQueryData, pageState], newValue => {
    const [curNode, curQuery, curPage] = newValue;
    if (!curNode?.id) {
        return;
    }
    const { curItem, curTime } = curQuery || {};
    const params = { selectedNode: curNode, searchItem: options.value.find(v => v.id === curItem), time: curTime };
    const finalParams = { ...params, page: curPage };
    fetchTableData(finalParams);
});

onUnmounted(() => {
    selectAbortController.value?.abort?.();
    tableAbortController.value?.abort?.();
});
</script>
<style lang="less" scoped>
.right-table {
    flex: 1;
    height: 100%;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;

    .table-warp {
        flex: 1;
        overflow: hidden;
        border-right: 0.5px solid #e1e5eb;
        border-bottom: 0.5px solid #e1e5eb;
        border-left: 0.5px solid #e1e5eb;
        border-radius: 4px;
    }

    .table-warp.empty {
        /deep/ .meri-table-body .meri-table-element {
            border: none;
        }
    }

    .footer-pagination {
        width: 100%;
        display: flex;
        justify-content: flex-end;

        :deep(.m-page-sizes) {
            margin-right: 0 !important;
        }
    }
}
</style>
