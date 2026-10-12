import { h } from 'vue';
import dayjs from 'dayjs';
import i18n from '@/localization';
import TabListIcon from '../components/TabListIcon.vue';
import TabCalendarIcon from '../components/TabCalendarIcon.vue';
import useLoading from '@/hooks/useLoading';
import { ref, computed, onMounted, watch } from 'vue';
import { getReportList, generateReport } from '@/apis/report';
import { ReportType, ReportStatus } from '@/views/operationReviewReport/constant';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { $Message } from 'meri-plus';
import baseStore from '@/store/baseStore';

export const useGlobalData = loadingTarget => {
    const store = baseStore();

    const { loading, openLoading, closeLoading } = useLoading(loadingTarget, 'var(--gray-0)', 'ball', { width: '100px', height: '100px' }, 0);

    const activeTab = ref('calendarView');
    // TODO 国际化
    const tabItems = ref([
        {
            id: 'listView',
            name: '列表视图',
            renderPreSlot: {
                component: h(TabListIcon, { active: computed(() => activeTab.value === 'listView') })
            }
        },
        {
            id: 'calendarView',
            name: '日历视图',
            renderPreSlot: {
                component: h(TabCalendarIcon, { active: computed(() => activeTab.value === 'calendarView') })
            }
        }
    ]);
    // 日历视图 下选择的时间
    const currentYearMonth = ref(dayjs().format('YYYY.MM'));
    // 列表视图 选择的时间段
    const selectedDateRange = ref('');
    // 报告列表
    // 元素 demo
    // {
    //     id: '1',
    //     reportType: 'date',
    //     reportDate: '2025.09.27',
    //     createTime: '2025.09.27',
    //     updateTime: '2025.09.27',
    //     modifier: '张三'
    // }
    const reportList = ref([]);
    // 分页信息
    const pageMeta = ref({
        pageNum: 1,
        total: 0,
        pageSize: 10
    });
    // 接口请求句柄
    let abortController = null;

    onMounted(() => {
        const today = getDayjsTz();
        const start = today.add(-30, 'day');
        selectedDateRange.value = `${start.format('YYYY.MM.DD')}-${today.format('YYYY.MM.DD')}`;
        loadReportList();
    });

    const clearRequestStatus = () => {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
        if (loading.value) {
            closeLoading();
        }
    };

    const loadReportList = async () => {
        clearRequestStatus();
        openLoading();
        abortController = new AbortController();
        try {
            const { data, code, total } = await getReportList(getReportListParams(), { signal: abortController.signal });
            if (code === SUCCESSCODE) {
                reportList.value = data;
                pageMeta.value.total = total;
            } else {
                reportList.value = [];
                pageMeta.value.total = 0;
            }
        } catch (error) {
            console.error('Error loading report list:', error);
        } finally {
            clearRequestStatus();
        }
    };

    const getReportListParams = () => {
        const params = {
            reportType: ReportType.Daily.type
        };
        if (activeTab.value === 'calendarView') {
            const monthStart = dayjs(currentYearMonth.value + '.01');
            const monthEnd = monthStart.endOf('month');
            params.startDate = monthStart.format('YYYY-MM-DD');
            params.endDate = monthEnd.format('YYYY-MM-DD');
            params.pageNo = 1;
            params.pageSize = 100;
        } else {
            const parts = selectedDateRange.value.split('-');
            params.startDate = parts[0].replaceAll('.', '-');
            params.endDate = parts[1].replaceAll('.', '-');
            params.pageNo = pageMeta.value.pageNum;
            params.pageSize = pageMeta.value.pageSize;
        }
        return params;
    };

    watch(
        () => currentYearMonth.value,
        () => {
            loadReportList();
        }
    );

    watch(
        () => selectedDateRange.value,
        () => {
            pageMeta.value.pageNum = 1;
            loadReportList();
        }
    );

    watch(
        () => activeTab.value,
        () => {
            pageMeta.value = {
                pageNum: 1,
                total: 0,
                pageSize: 10
            };
            loadReportList();
        }
    );

    const getUpdateReportMsg = (report, msgLevel) => {
        const { reportDate, reportType } = report;
        let msg = '';
        if (msgLevel === 'error') {
            msg = reportType === ReportType.Monthly.type ? `运行复盘月报${reportDate}更新失败` : `运行复盘日报${reportDate}更新失败`;
        } else {
            msg = reportType === ReportType.Monthly.type ? `运行复盘月报${reportDate}更新成功` : `运行复盘日报${reportDate}更新成功`;
        }
        return msg;
    };

    // 根据 reportDate 和 reportType 在 reportList 中找到对应的报告
    const findReportInList = report => {
        return reportList.value.find(item => item.reportDate === report.reportDate && item.reportType === report.reportType);
    };

    const updateReport = async report => {
        if (!report || report.reportStatus === ReportStatus.Building) return;

        // 在 reportList 中找到对应的报告并更新状态
        const targetReport = findReportInList(report);
        if (!targetReport) return;

        targetReport.reportStatus = ReportStatus.Building;
        let msgType = 'success',
            updateTime = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');
        const operator = store?.userInfo?.name || store?.userInfo?.account || store?.userInfo?.userName || store?.userInfo?.userId || '--';
        try {
            const { data, code } = await generateReport({
                reportDate: report.reportDate,
                reportType: report.reportType,
                operator: operator
            });
            if (code !== SUCCESSCODE || !data) {
                msgType = 'error';
            }
        } catch (error) {
            console.error('Error generating report:', error);
            msgType = 'error';
        } finally {
            // 重新查找报告（防止切换页面后引用失效）
            const currentTargetReport = findReportInList(report);
            if (currentTargetReport) {
                currentTargetReport.reportStatus = ReportStatus.Confirm;
                if (msgType === 'success') {
                    currentTargetReport.operator = operator;
                    currentTargetReport.updateTime = updateTime;
                    $Message.success(getUpdateReportMsg(report, msgType));
                } else {
                    $Message.error(getUpdateReportMsg(report, msgType));
                }
            }
        }
    };

    const pageChange = pageNum => {
        pageMeta.value.pageNum = pageNum;
        loadReportList();
    };

    const pageSizeChange = pageSize => {
        pageMeta.value.pageNum = 1;
        pageMeta.value.pageSize = pageSize;
        loadReportList();
    };

    return {
        activeTab,
        tabItems,
        currentYearMonth,
        selectedDateRange,
        reportList,
        loading,
        openLoading,
        closeLoading,
        updateReport,
        pageMeta,
        pageChange,
        pageSizeChange
    };
};
