<template>
    <div class="table-report-container">
        <m-table class="table-content" :columns="columns" :data-source="props.tableData" :even-color="true" :empty-text="'--'" @row-click="handleRowClick">
            <template #reportType="{ reportType }">
                <!-- TODO 国际化 -->
                <m-tag v-if="reportType === ReportType.Monthly.type" color="#00A2A7" bg-color="#CBF7F3"> {{ `月报` }} </m-tag>
                <m-tag v-if="reportType === ReportType.Daily.type" color="#00A2A7" bg-color="#CBF7F3">{{ `日报` }}</m-tag>
            </template>

            <template #reportName="report">
                <!-- TODO 国际化 -->
                <span>{{ getReportName(report) }}</span>
            </template>

            <template #operations="row">
                <m-tips v-if="row.reportStatus === ReportStatus.Building" content="报告更新中，请稍候..." theme="darkTransparent">
                    <div class="operation-container" @click.stop>
                        <m-button disabled type="link" size="medium" @click.stop="goEdit(row)"> {{ i18n.global.t('common.edit') }} </m-button>
                        <m-button disabled type="link" size="medium" @click.stop="goView(row)"> {{ i18n.global.t('meos_control_web.details') }} </m-button>
                        <m-button disabled type="link" size="medium" @click.stop="generateReport(row)"> 更新报告 </m-button>
                    </div>
                </m-tips>
                <div v-else class="operation-container" @click.stop>
                    <m-tips :content="noAuthTip" theme="darkTransparent" :disabled="hasEditAuth">
                        <m-button :disabled="!hasEditAuth" type="link" size="medium" @click="goEdit(row)"> {{ i18n.global.t('common.edit') }} </m-button>
                    </m-tips>
                    <m-button type="link" size="medium" @click="goView(row)"> {{ i18n.global.t('meos_control_web.details') }} </m-button>
                    <m-tips :content="noAuthTip" theme="darkTransparent" :disabled="hasEditAuth">
                        <m-button :disabled="!hasEditAuth" type="link" size="medium" @click="updateReport(row)"> 更新报告 </m-button>
                    </m-tips>
                </div>
            </template>
            <template #nodata>
                <div class="noData">
                    <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
                </div>
            </template>
        </m-table>
        <div v-if="pageMeta.total != 0" class="meos-flex-ai-center meos-jc-fe pagination-container">
            <m-pagination
                :page-num="pageMeta.pageNum"
                :total="pageMeta.total"
                :page-size="pageMeta.pageSize"
                :disabled="pageMeta.total === 0"
                layout="total,prev,pager,next,sizes"
                @page-change="pageChange"
                @size-change="pageSizeChange"
            ></m-pagination>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { computed } from 'vue';
import { ReportType, ReportStatus } from '@/views/operationReviewReport/constant';
import { RUNRETROREPORT_EDIT } from '@/constants/permissions';
import baseStore from '@/store/baseStore';

const base = baseStore();

// 权限校验
const hasEditAuth = computed(() => base.hasAuth(RUNRETROREPORT_EDIT));
const noAuthTip = i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');

const props = defineProps({
    tableData: {
        type: Array,
        default: () => []
    },
    pageMeta: {
        type: Object,
        default: () => ({
            pageNum: 1,
            total: 0,
            pageSize: 10
        })
    }
});

const emits = defineEmits(['goEdit', 'goView', 'updateReport', 'pageChange', 'pageSizeChange']);

// TODO 国际化
const columns = ref([
    { dataIndex: 'reportName', title: '报告名称', ellipsis: true },
    { dataIndex: 'reportType', title: '报告周期类型', width: 114, ellipsis: true },
    { dataIndex: 'reportDate', title: '报告日期', width: 212, ellipsis: true },
    { dataIndex: 'createTime', title: '创建时间', width: 185, ellipsis: true },
    { dataIndex: 'updateTime', title: '最后一次更新时间', width: 163, ellipsis: true },
    { dataIndex: 'operator', title: '更新人', width: 164, ellipsis: true },
    { dataIndex: 'operations', title: '操作', width: 200 }
]);

const getReportName = report => {
    if (report.reportName) {
        return report.reportName;
    }
    if (report?.reportType === ReportType.Monthly.type) {
        return `运行复盘月报${report?.reportDate ?? ''}`;
    }
    if (report?.reportType === ReportType.Daily.type) {
        return `运行复盘日报${report?.reportDate ?? ''}`;
    }
    return report?.reportDate ?? '--';
};

const goEdit = row => {
    emits('goEdit', row);
};
const goView = row => {
    emits('goView', row);
};

const updateReport = row => {
    emits('updateReport', row);
};

const handleRowClick = (e, row) => {
    emits('goView', row);
};

const pageChange = pageNum => {
    emits('pageChange', pageNum);
};
const pageSizeChange = pageSize => {
    emits('pageSizeChange', pageSize);
};
</script>

<style lang="less" scoped>
.table-report-container {
    height: 100%;
    padding: 16px 24px;

    .table-content {
        max-height: calc(100% - 60px);
    }

    :deep(.meri-table-body-tr) {
        cursor: pointer;
        // meri-table-body-tr元素或者它的子孙元素有disabled类名则整行鼠标样式为默认
        &:has(.disabled) {
            cursor: default;
        }
    }

    .operation-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .pagination-container {
        margin-top: 16px;
        margin-bottom: 16px;
    }
}
.noData {
    height: 100%;
    display: flex;
    align-items: center;
}
</style>
