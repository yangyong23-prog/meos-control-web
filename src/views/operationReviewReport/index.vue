<template>
    <div class="container-wrap">
        <div class="header">
            <div class="left-title">{{ leftTitle }}</div>
            <div class="right-container">
                <m-date-picker v-if="activeTab === 'listView'" v-model="selectedDateRange" type="daterange" :clearable="false"></m-date-picker>
                <m-tabs v-model="activeTab" :data="tabItems" type="segment"></m-tabs>
            </div>
        </div>
        <div class="content">
            <div class="content-inner">
                <CalendarList v-if="activeTab === 'calendarView'" v-model="currentYearMonth">
                    <template #headerAction>
                        <!-- TODO 国际化 -->
                        <!-- <m-button type="primary" size="medium" icon-position="right" icon="IconMeriComponentChevronRight"> 月报已生成 </m-button> -->
                    </template>
                    <template #dateAction="{ data }">
                        <!-- TODO 国际化 -->
                        <div v-if="!data?.curDateItem?.isDisabled && dateReportMap[data?.curDateItem?.key]" class="date-item-container">
                            <div
                                :class="{ 'custom-date-action': true, disable: dateReportMap[data?.curDateItem?.key]?.reportStatus === ReportStatus.Building }"
                                @click="() => goToReportInfo(dateReportMap[data?.curDateItem?.key])"
                            >
                                <div style="display: flex; align-items: center">
                                    <span>日报已生成</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M7.02648 4.69173C6.78837 4.93456 6.80322 5.3142 7.05965 5.53968L10.9949 9L7.05965 12.4603C6.80322 12.6858 6.78837 13.0654 7.02648 13.3083C7.26459 13.5511 7.6655 13.5652 7.92192 13.3397L12.8572 9L7.92192 4.66033C7.6655 4.43484 7.26459 4.44891 7.02648 4.69173Z"
                                            fill="#246FE5"
                                        />
                                    </svg>
                                </div>

                                <div class="action-container">
                                    <m-tips :content="hasEditAuth ? '编辑' : noAuthTip" theme="darkTransparent">
                                        <div
                                            :class="{ 'action-icon meos-flex-center': true, 'action-icon-disabled': !hasEditAuth }"
                                            @click.stop="() => hasEditAuth && goToReportEdit(dateReportMap[data?.curDateItem?.key])"
                                        >
                                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.0033 0C10.6024 7.22022e-05 11.8948 1.31095 11.8949 2.92383C11.8949 3.78765 11.5218 4.59083 10.89 5.14062L4.78845 11.5244C4.47413 11.8531 4.03912 12.0389 3.58435 12.0391H1.67908C0.758545 12.0391 0.012085 11.2926 0.012085 10.3721V8.64062C0.012085 8.20935 0.179675 7.79498 0.478882 7.48438L5.30896 2.46973L6.30212 1.40625L6.37341 1.31055C6.908 0.590043 8.09007 0 9.0033 0ZM6.19861 3.30762L6.19275 3.31445L1.35876 8.33203C1.27901 8.41485 1.23474 8.52565 1.23474 8.64062V10.3721C1.23474 10.6175 1.4336 10.8164 1.67908 10.8164H3.58435C3.7056 10.8163 3.82186 10.7674 3.90564 10.6797L9.29822 5.03613L6.85681 2.60352L6.19861 3.30762ZM9.0033 1.22266C8.64351 1.22266 8.14903 1.41187 7.77478 1.66211L10.349 3.93164C10.5559 3.64505 10.6732 3.29453 10.6732 2.92383C10.6731 1.98221 9.92356 1.22268 9.0033 1.22266Z"
                                                    :fill="hasEditAuth ? '#246EE5' : '#C4C9CF'"
                                                />
                                                <path
                                                    d="M0 12.8522C0 12.5147 0.273621 12.2411 0.611149 12.2411H11.0007C11.3382 12.2411 11.6118 12.5147 11.6118 12.8522C11.6118 13.1898 11.3382 13.4634 11.0007 13.4634H0.611149C0.273621 13.4634 0 13.1898 0 12.8522Z"
                                                    :fill="hasEditAuth ? '#246EE5' : '#C4C9CF'"
                                                />
                                            </svg>
                                        </div>
                                    </m-tips>
                                    <m-tips :content="hasEditAuth ? '更新报告' : noAuthTip" theme="darkTransparent">
                                        <div
                                            :class="{ 'action-icon meos-flex-center': true, 'action-icon-disabled': !hasEditAuth }"
                                            @click.stop="hasEditAuth && updateReport(dateReportMap[data?.curDateItem?.key])"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2.40486 1.68953C3.62237 0.636801 5.20947 0 6.9453 0C10.7811 0 13.8906 3.10952 13.8906 6.9453C13.8906 8.42889 13.4254 9.80385 12.633 10.9323L10.418 6.9453H12.5015C12.5015 3.87667 10.0139 1.38906 6.9453 1.38906C5.45194 1.38906 4.09618 1.97821 3.09777 2.93677L2.40486 1.68953ZM11.4857 12.2011C10.2682 13.2538 8.68114 13.8906 6.9453 13.8906C3.10952 13.8906 0 10.7811 0 6.9453C0 5.46169 0.46519 4.08673 1.25766 2.95831L3.47265 6.9453H1.38906C1.38906 10.0139 3.87667 12.5015 6.9453 12.5015C8.43868 12.5015 9.79441 11.9124 10.7929 10.9539L11.4857 12.2011Z"
                                                    :fill="hasEditAuth ? '#246EE5' : '#C4C9CF'"
                                                />
                                            </svg>
                                        </div>
                                    </m-tips>
                                </div>
                            </div>

                            <m-tips v-if="dateReportMap[data?.curDateItem?.key]?.reportStatus === ReportStatus.Building" content="报告更新中，请稍候..." theme="darkTransparent">
                                <div class="disabled-mask"></div>
                            </m-tips>
                        </div>
                    </template>
                </CalendarList>
                <TableReport
                    v-if="activeTab === 'listView'"
                    :table-data="reportList"
                    :page-meta="pageMeta"
                    @go-view="row => goToReportInfo(row)"
                    @go-edit="row => goToReportEdit(row)"
                    @update-report="row => updateReport(row)"
                    @page-change="pageNum => pageChange(pageNum)"
                    @page-size-change="pageSize => pageSizeChange(pageSize)"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { computed } from 'vue';

import { useGlobalData } from './hooks/useGlobalData';
import CalendarList from './components/CalendarList.vue';
import TableReport from './components/TableReport.vue';
import { goToReportInfo, goToReportEdit } from './utils/index';
import { dayjsIsSame } from '@/utils/dayjsTools';
import { ReportStatus } from '@/views/operationReviewReport/constant';
import { getDayjsTz } from '@/utils/globalVariables';
import { RUNRETROREPORT_EDIT } from '@/constants/permissions';
import baseStore from '@/store/baseStore';

const base = baseStore();

// 权限校验
const hasEditAuth = computed(() => base.hasAuth(RUNRETROREPORT_EDIT));
const noAuthTip = i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');

// TODO 国际化
const leftTitle = `运行复盘报告`;
const { activeTab, tabItems, currentYearMonth, selectedDateRange, reportList, pageMeta, loading, openLoading, closeLoading, updateReport, pageChange, pageSizeChange } =
    useGlobalData('content-inner');
const isSameDay = (date1, date2) => {
    if (!date1 || !date2) {
        return false;
    }
    return dayjsIsSame(date1, date2, 'day');
};

const dateReportMap = computed(() => {
    const map = {};
    const items = reportList.value || [];
    for (const item of items) {
        const key = dayjs(item.reportDate).format('YYYY.MM.DD');
        map[key] = item;
    }
    return map;
});
</script>

<style lang="less" scoped>
.container-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 1360px;
    padding-bottom: 16px;

    position: relative;
    background-size: cover;
    background-image: url(@/assets/imgs/page_bg.png);
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 0 20px;
}
.left-title {
    color: #2e3742;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
}
.right-container {
    display: flex;
    align-items: center;
    gap: 8px;
}
.content {
    flex: 1;
    padding: 16px;
    padding-top: 0px;
    margin-top: 16px;
    overflow: auto;

    .content-inner {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        background: #fff;
    }
}

.date-item-container {
    position: relative;

    .disabled-mask {
        position: absolute;
        inset: 0;
        cursor: not-allowed;
        background-color: rgba(196, 201, 207, 0.3);
    }
}

.custom-date-action {
    display: flex;
    padding: 8px 16px;
    align-items: center;
    justify-content: space-between;
    gap: 4px;

    border-radius: 4px;
    background: #ebf6ff;
    cursor: pointer;

    color: #246fe5;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;

    &.disable {
        color: var(--gray-400);
        svg {
            path {
                fill: var(--gray-400);
            }
        }
    }

    .action-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;

        .action-icon {
            width: 18px;
            height: 18px;

            &:hover {
                background-color: rgba(196, 201, 207, 0.3);
                border-radius: 4px;
            }

            &.action-icon-disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }
        }
    }
}
:deep(.custom-content-inner-loading) {
    border-radius: 8px;
}
</style>
