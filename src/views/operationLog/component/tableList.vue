<!--运行日志列表视图-->
<template>
    <div class="table-list">
        <m-table class="table-list__table" :columns="columns" :column-line="true" :data-source="dataSource">
            <template #type="{ typeName, typeColor, typeBgColor }">
                <m-tag :color="typeColor" :bg-color="typeBgColor">{{ typeName }} </m-tag>
            </template>
            <template #operateContent="item">
                <m-tips trigger="manually" theme="darkTransparent" placement="right-start" popover-class="log-tablelist-tips" :is-open="item.isShowTip">
                    <template #content>
                        <div v-html="item.operateContentTips"></div>
                    </template>
                    <span class="operate-content" @mouseover="handleOperateContentMouseover($event, item)" @mouseleave="handleOperateContentMouseleave($event, item)">
                        {{ item.operateContent }}
                    </span>
                </m-tips>
            </template>
            <template #effectTime="{ effectTime }">
                <span>{{ effectTime }}</span>
            </template>
        </m-table>
        <m-pagination
            v-model:page-num="pageNumber"
            class="table-list__pagination"
            background
            :total="totalCount"
            :page-size="pageSize"
            layout="total,prev,pager,next,sizes"
            @page-change="handlePageChange"
            @size-change="handleSizeChange"
        ></m-pagination>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import _ from 'lodash';
import { queryLogListByPage, queryRunningLogListByPage } from '@/apis/operationLog';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { MLoading } from 'meri-plus';

const props = defineProps(['requestData', 'logCategoryListFlat', 'newLogSystem']);
let createTime = getDayjsTz().format('YYYY-MM-DD HH:mm:ss'),
    dataSource = ref([]),
    abortController = null;

const columns = ref([
    {
        dataIndex: 'createTime',
        title: i18n.global.t('meos_control_web.operation_time'),
        sorter: true,
        sortCallBack: ({ sortOrder = '' }) => {
            orderBy.value = sortOrder === 'descend' ? 'asc' : 'desc';
            fetchData();
        },
        width: 170,
        resizable: true
    },
    {
        dataIndex: 'thirdLevelCategoryName',
        title: i18n.global.t('meos_control_web.log_category'),
        width: 150,
        resizable: true
    },
    {
        dataIndex: 'type',
        title: i18n.global.t('meos_control_web.log_id'),
        width: 100,
        resizable: true
    },
    {
        dataIndex: 'createUser',
        title: i18n.global.t('meos_control_web.operator'),
        width: 120,
        resizable: true
    },
    {
        dataIndex: 'objectName',
        title: i18n.global.t('meos_control_web.operation_target'),
        resizable: true
    },
    {
        dataIndex: 'operateContent',
        title: i18n.global.t('meos_control_web.operation_content'),
        resizable: true
    },
    {
        dataIndex: 'effectTime',
        title: i18n.global.t('meos_control_web.effective_time'),
        width: 180,
        resizable: true
    },
    {
        dataIndex: 'reason',
        title: i18n.global.t('meos_control_web.operation_reason')
    }
]);

// eslint-disable-next-line one-var
let pageNumber = ref(1),
    totalCount = ref(0),
    pageSize = ref(20),
    orderBy = ref('desc'), // 排序方式：asc：升序，desc：降序
    // 是否显示Loading
    isInitLoading = ref('');

// 请求 - 列表数据
const fetchData = () => {
    // 筛选条件变更时，开启loading
    if (isInitLoading.value) {
        isInitLoading.value.destroy();
    }
    isInitLoading.value = MLoading.service({
        target: '.table-list__table',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: { width: '100px', height: '100px' },
        loadButton: () => {
            fetchData();
        }
    });

    abortController?.abort();
    abortController = null;
    abortController = new AbortController();

    // 初始化数组 - 重置滚动位置
    dataSource.value = [];
    // 在此处实际调用API获取数据，示例中使用setTimeout模拟异步加载
    let params = Object.assign(_.cloneDeep(props.requestData), {
            pageNumber: pageNumber.value,
            pageSize: pageSize.value,
            orderBy: orderBy.value
        }),
        apiPromise = queryLogListByPage;
    if (props.newLogSystem) {
        if (params.pageNumber === 1) {
            createTime = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');
        }
        apiPromise = queryRunningLogListByPage;
        params = Object.assign(params, {
            dataStartTime: props.requestData?.startTime,
            dataEndTime: props.requestData?.endTime,
            effectStartTime: props.requestData?.effectTime,
            workDate: createTime
        });
    }
    console.log(params);

    return apiPromise(params, abortController.signal)
        .then(({ code, data, total }) => {
            if (code === '00000') {
                totalCount.value = parseInt(total);
                dataSource.value = data.map(item => {
                    let operateContent = item.content.contentDesc,
                        operateDetail = '',
                        operateDetailTips = '';
                    if (Array.isArray(item.detail)) {
                        item.detail.forEach((detail, i) => {
                            operateDetail = item.detail.length > 1 ? `${operateDetail}${i + 1}.${detail.contentDesc};` : `${operateDetail}${detail.contentDesc}`;
                            operateDetailTips = item.detail.length > 1 ? `${operateDetailTips}${i + 1}.${detail.contentDesc};<br/>` : `${operateDetailTips}${detail.contentDesc}`;
                        });
                    } else if (props.newLogSystem) {
                        // 新日志系统中
                        operateDetail = '';
                        operateDetailTips = item.content.reasonSource;
                        operateContent = item.contentDesc;
                    }
                    const effectEndTime = item.effectEndTime && dayjs(item.effectEndTime).isValid() ? dayjs(item.effectEndTime).format('YYYY.MM.DD HH:mm:ss') : '';
                    const effectStartTime = item.effectStartTime && dayjs(item.effectStartTime).isValid() ? dayjs(item.effectStartTime).format('YYYY.MM.DD HH:mm:ss') : '';

                    return Object.assign(item, {
                        createTime: item.createTime && dayjs(item.createTime).isValid() ? dayjs(item.createTime).format('YYYY.MM.DD HH:mm:ss') : '',
                        effectTime: effectStartTime || effectEndTime ? `${effectStartTime} - ${effectEndTime}` : '--',
                        typeName: styleObj[item.type][0] || '--',
                        typeColor: styleObj[item.type][1] || '',
                        typeBgColor: styleObj[item.type][2] || '',
                        operateContent: operateDetail ? `${operateContent}：${operateDetail}` : operateContent,
                        operateContentTips: operateDetailTips ? `${operateContent}：<br/>${operateDetailTips}` : operateContent,
                        thirdLevelCategoryName: props.logCategoryListFlat[item.thirdLevelCategory]?.name || item.category || '--', // item.category 新版日志系统下取值
                        isShowTip: false,
                        reason: item.reason || item.content?.reasonSource || '--' // item.content?.reasonSource 新版日志系统下取值
                    });
                });
            } else {
                dataSource.value = [];
            }
        })
        .finally(() => {
            isInitLoading.value?.destroy?.();
        });
};

const styleObj = {
    1: [i18n.global.t('meos_control_web.auto'), '#683BD6', '#F1E5FE'],
    2: [i18n.global.t('meos_control_web.manual1'), '#E68600', '#FFF0CC'],
    3: [i18n.global.t('meos_control_web.alarm'), '#D72824', '#FFE6E5']
};

// 事件 - 页码变更
const handlePageChange = page => {
    if (page < 1) return;
    pageNumber.value = page;
    fetchData();
};

// 事件 - 每页数量变更
const handleSizeChange = size => {
    pageSize.value = size;
    fetchData();
};

// 事件 - 排序
// const handleSortChange = (data:any) => {
//   console.log('排序：',data)
// }

// 事件 - 操作内容 - 鼠标移入事件
const handleOperateContentMouseover = (e, item) => {
    e.stopPropagation();
    const hoverItem = dataSource.value.find(o => o.id === item.id);
    const offsetHeight = e.target?.offsetHeight;
    const scrollHeight = e.target?.scrollHeight;
    hoverItem.isShowTip = offsetHeight < scrollHeight;
};

// 事件 - 操作内容 - 鼠标移出事件
const handleOperateContentMouseleave = (e, item) => {
    e.stopPropagation();
    const hoverItem = dataSource.value.find(o => o.id === item.id);
    hoverItem.isShowTip = false;
};

// 初始化请求第一页数据
fetchData();

watch(
    () => props.requestData,
    (newVal, oldVal) => {
        pageNumber.value = 1;
        fetchData();
    },
    { deep: true }
);
</script>
<style lang="less" scoped>
.table-list {
    padding: 0 16px;
    height: 100%;

    &__table {
        height: calc(100% - 60px);

        .operate-content {
            line-height: 22px;
            -webkit-line-clamp: 3;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 14px 0;
        }
    }

    &__pagination {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: right;
    }
}
</style>
<style lang="less">
.log-tablelist-tips {
    min-width: 200px;
    max-width: 396px;
    line-height: 22px;
    font-size: 14px;
}
</style>
