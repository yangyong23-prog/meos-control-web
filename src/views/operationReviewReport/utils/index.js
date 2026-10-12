import { jumpToRunretroReportInfo } from '@/utils/envUtils';
import { ReportStatus } from '@/views/operationReviewReport/constant';

export const goToReportInfo = report => {
    console.log('goToReportInfo', report);
    if (report && report.reportStatus !== ReportStatus.Building) {
        jumpToRunretroReportInfo({
            reportId: report.id,
            reportDate: report.reportDate,
            reportType: report.reportType,
            f: 'runretroreport'
        });
    }
};

export const goToReportEdit = report => {
    if (report && report.reportStatus !== ReportStatus.Building) {
        jumpToRunretroReportInfo({
            reportId: report.id,
            reportDate: report.reportDate,
            reportType: report.reportType,
            reportMode: 1,
            f: 'runretroreport'
        });
    }
};

export const getPeriodOverPeriodText = (percentNumber = 0) => {
    const showNumber = Math.abs(percentNumber);
    if (isNaN(showNumber)) {
        return { color: '#626C78', title: '--' };
    }
    if (percentNumber > 0) {
        return { color: '#F55047', title: `增长${showNumber}%` };
    } else if (percentNumber < 0) {
        return { color: '#14C4C4', title: `下降${showNumber}%` };
    } else {
        return { color: '#626C78', title: `与上周相似日持平` };
    }
};
