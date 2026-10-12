<template>
    <div class="report-container">
        <div class="report-header">
            <h1 class="report-title">运行复盘报告</h1>
            <div class="date-range-picker">
                <m-date-picker
                    v-model="dateRange"
                    type="daterange"
                    :width="280"
                    placeholder="选择日期范围"
                    :popover-attrs="{
                        appendTo: 'body'
                    }"
                    @change="handleDateChange"
                />
            </div>
        </div>

        <div class="report-table">
            <m-table
                :columns="columns"
                :data-source="tableData"
                :column-line="true"
                :even-color="true"
                empty-text="--"
            >
                <template #reportType="{ reportType }">
                    <m-tag
                        color="#00A8CC"
                        bg-color="#E0F7FF"
                        size="small"
                        >{{ reportType }}</m-tag
                    >
                </template>
                <template #operation="row">
                    <span
                        class="detail-link"
                        @click="handleDetail(row)"
                        >详情</span
                    >
                </template>
            </m-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { $Message } from 'meri-plus';
import dayjs from 'dayjs';

interface ReportItem {
    id: string;
    reportName: string;
    reportType: string;
    reportDate: string;
    url?: string; // 报告文件URL
}

interface ReportData {
    date: string;
    url: string;
}

// 日期范围，格式为："2024-01-01-2024-12-31"
// 默认选择从今天开始往前30天
const getDefaultDateRange = () => {
    const end = dayjs().format('YYYY.MM.DD');
    const start = dayjs().subtract(30, 'day').format('YYYY.MM.DD');
    return `${start}-${end}`;
};

const dateRange = ref<string>(getDefaultDateRange());
const tableData = ref<ReportItem[]>([]);
const reportDataList = ref<ReportData[]>([]); // 存储从服务器下载的报告数据

// 下载报告列表数据
const fetchReportList = async () => {
    try {
        // 添加时间戳避免缓存
        const timestamp = new Date().getTime();
        const response = await fetch(`https://apm-static-resources-1307155645.cos.ap-chengdu.myqcloud.com/dev/dailyreport/report-list.json?t=${timestamp}`);
        if (!response.ok) {
            throw new Error('下载报告列表失败');
        }
        const data = await response.json();
        reportDataList.value = data;
        console.log('报告列表数据加载成功:', data);
        // 下载完成后加载表格数据
        loadTableData();
    } catch (error) {
        console.error('下载报告列表失败:', error);
        $Message.error({ title: '加载报告列表失败，请稍后重试', duration: 3000 });
        reportDataList.value = [];
    }
};

// 日期范围变化处理
const handleDateChange = (value: string) => {
    // 根据日期范围重新加载表格数据
    loadTableData();
};

// 表格列配置
const columns = ref([
    {
        dataIndex: 'reportName',
        title: '报告名称',
        minWidth: 200
    },
    {
        dataIndex: 'reportType',
        title: '报告周期类型',
        minWidth: 150
    },
    {
        dataIndex: 'reportDate',
        title: '报告日期',
        minWidth: 180
    },
    {
        dataIndex: 'operation',
        title: '操作',
        minWidth: 150,
        fixed: 'right'
    }
]);

// 加载表格数据
const loadTableData = () => {
    if (!dateRange.value) {
        tableData.value = [];
        return;
    }

    // 解析日期范围
    const [startDate, endDate] = dateRange.value.split('-');
    const start = dayjs(startDate, 'YYYY.MM.DD');
    const end = dayjs(endDate, 'YYYY.MM.DD');

    // 创建日期到URL的映射
    const dateToUrlMap = new Map<string, string>();
    reportDataList.value.forEach(item => {
        // 将日期统一格式化为 YYYY.MM.DD 格式
        const formattedDate = dayjs(item.date).format('YYYY.MM.DD');
        dateToUrlMap.set(formattedDate, item.url);
    });

    // 根据日期范围和JSON数据生成表格数据
    const data: ReportItem[] = [];
    let currentDate = start,
        index = 1;

    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
        const dateStr = currentDate.format('YYYY.MM.DD');
        // 只有JSON中存在该日期的数据才添加到表格
        if (dateToUrlMap.has(dateStr)) {
            data.push({
                id: String(index),
                reportName: `运行复盘日报${dateStr}`,
                reportType: '日报',
                reportDate: dateStr,
                url: dateToUrlMap.get(dateStr)
            });
            index++;
        }
        currentDate = currentDate.add(1, 'day');
    }

    // 按日期倒序排列（最新的在前）
    tableData.value = data.reverse();

    console.log(`加载了 ${data.length} 条报告数据`);
};

// 详情操作
const handleDetail = (row: ReportItem) => {
    console.log('查看详情:', row);
    if (row.url) {
        // 添加时间戳避免缓存
        const timestamp = new Date().getTime();
        const separator = row.url.includes('?') ? '&' : '?';
        const urlWithTimestamp = `${row.url}${separator}t=${timestamp}`;
        // 在新标签页中打开报告链接
        window.open(urlWithTimestamp, '_blank');
    } else {
        $Message.warning({ title: '该报告暂无可用链接', duration: 2000 });
    }
};

onMounted(() => {
    // 页面挂载后下载报告列表数据
    fetchReportList();
});
</script>

<style scoped lang="scss">
.report-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 50%, #e8f4f8 100%);
    display: flex;
    flex-direction: column;

    .report-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        position: relative;
        z-index: 10;

        .report-title {
            font-size: 20px;
            font-weight: 500;
            color: #303133;
            margin: 0;
        }

        .date-range-picker {
            position: relative;

            :deep(.m-date-picker) {
                width: 280px;
            }
        }
    }

    .report-table {
        flex: 1;
        background: #fff;
        border-radius: 4px;
        padding: 16px;
        overflow: hidden;

        :deep(.m-table) {
            height: 100%;
        }

        :deep(.m-button--link) {
            padding: 0;
            margin-right: 12px;
            &:last-child {
                margin-right: 0;
            }
        }

        .detail-link {
            color: var(--blue-500);
            cursor: pointer;
            transition: color 0.2s;

            &:hover {
                color: var(--blue-600);
            }
        }
    }
}
</style>
