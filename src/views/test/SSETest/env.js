/**
 * APM 部分页面URL，用于应用中页面跳转
 */
window.apmPageUrl = {
    // 云端origin
    CLOUD_ORIGIN: 'https://tyxn.qa.meos.net.cn',
    // 跳转到MEOI实例详情路径PC
    MEOI_INSTANCE_DETAIL: 'https://dev.yushu.cloud/mid-frame-web/meoi-aim-web/fullScreenDetail',
    // STM 项目资料调研报告
    STM_AMC_DOC_SURVEY_REPORT: 'https://dev-amc.ysbdtp.cn/mid-frame-web/yiheng-stm-knowledge-web/doc-survey-report',
    // STM AMC 预览报告
    STM_AMC_PRE_REPORT: 'https://dev-amc.ysbdtp.cn/mid-frame-web/yiheng-stm-knowledge-web/amc-pre-report',
    // STM AMC 正式报告
    STM_AMC_OPERATION_REPORT: 'https://dev-amc.ysbdtp.cn/mid-frame-web/yiheng-stm-knowledge-web/amc-operation-report',
    // STM APC 评估报告
    STM_APC_EVALUATION_REPORT: 'https://dev.yushu.cloud/mid-frame-web/yiheng-stm-apc-web/apc-evaluation-report',
    // 会议纪要地址
    CONFERENCE_SUMMARY: 'https://dev-amc.ysbdtp.cn/mid-frame-web/mid-meeting-web/meeting-summary',
    // 资料库文件预览地址
    DOC_PREVIEW: '/bms/mid-document-web/doc-review',
    // 风险历史信息
    RISK_HISTORY_INFO: 'https://dev-amc.ysbdtp.cn/mid-frame-web/yiheng-facility-ops-web/risk-history-information-detail',
    // 风险事件详情
    RISK_EVENT_DETAIL: 'https://dev-amc.ysbdtp.cn/mid-frame-web/yiheng-facility-ops-web/risk-event-report-detail',
    // 鉴权页面地址
    SHARE_VERIFY: '/yiheng-common-web/validation-coding',
    // 报告纪要AMC
    AMC_REPORT_SUMMARY: 'https://dev-amc.ysbdtp.cn/mid-frame-web/mid-meeting-web/meeting-minutes',
    // 报告纪要APC
    APC_REPORT_SUMMARY: 'https://dev.yushu.cloud/mid-frame-web/mid-meeting-web/meeting-minutes',
    // 跳转到MEOI实例详情路径H5
    MEOI_INSTANCE_DETAIL_H5: 'https://dev.yushu.cloud/meoi-aim-h5/instanceDetail/index.html',
    // 跳转到MEOI数据分析页面
    MEOI_DATA_FREE_ANALYSIS: 'https://dev.yushu.cloud/mid-frame-web/meoi-aim-web/data-free-analysis',
    // 计划监控APC
    APC_PLAN_MONITORING: 'https://dev.yushu.cloud/mid-frame-web/yiheng-equip-facility-web/plan-monitoring-apc',
    // 文档预览
    DOCUMENT_REVIEW: 'https://dev-amc.ysbdtp.cn/mid-frame-web/yiheng-facility-ops-web/document-review',
    // 异常事件页面地址
    UNUSUAL_EVENTS: 'https://dev.yushu.cloud/mid-frame-web/yiheng-unattended-alarm-web/anomalous-event-detail',
    // 工单详情
    WORK_ORDER_DETAIL: 'https://dev.yushu.cloud/mid-frame-web/fm-workorder-web/workOrderManageDetail',
    // 跳转到创建员工整改工单
    CREATE_QUESTION_ORDER: 'https://dev.yushu.cloud/mid-frame-web/fm-workorder-web/createQuestionOrder',
    // 实例隐患树详情孤岛页
    INSTANCE_TREE_DETAIL: 'https://dev-amc.ysbdtp.cn/mid-frame-web/yiheng-facility-ops-web/danger-tree-detail'
};
/**
 *  APM各业务线通用配置
 */
window.apmCommonEnv = {
    // INTERFACE_PREFIX_APM_STATIC_CONFIG: 'https://apm-static-resources-1307155645.cos.ap-chengdu.myqcloud.com/test',
    // INTERFACE_PREFIX_AIM: 'https://192.168.101.32:30717/meos-control-server-edge/meoi-aim-server',
    // INTERFACE_PREFIX_MEOS: 'https://192.168.101.32:30717/meos-control-server-edge',
    // INTERFACE_PREFIX_EXP: 'http://192.168.101.33:31273/yiheng-edge-server',
    // INTERFACE_PREFIX_DMP_ALARM: 'https://qa-gw.yushu.cloud/dmp-alarm',
    // INTERFACE_PREFIX_DMP: 'https://qa-gw.yushu.cloud/rcc-data-server',
    // INTERFACE_PREFIX_RWD: 'https://192.168.101.32:30717/meos-control-server-edge',
    // INTERFACE_PREFIX_YUSHU_CDN: 'https://fastcdn.yushu.cloud',
    // INTERFACE_PREFIX_BDTP_FILE: 'https://qa.ysbdtp.com/dtp-file-server',
    // INTERFACE_PREFIX_MEOS_SOCKET: 'wss://192.168.101.32:30717/meos-control-compute-edge',

    INTERFACE_PREFIX_APM_STATIC_CONFIG: 'https://apm-static-resources-1307155645.cos.ap-chengdu.myqcloud.com/test',
    INTERFACE_PREFIX_AIM: 'http://192.168.101.32:40003/meoi-aim-server',
    INTERFACE_PREFIX_MEOS_COMPUTE: 'http://192.168.101.32:40001',
    INTERFACE_PREFIX_MEOS: 'http://192.168.101.32:40003',
    INTERFACE_PREFIX_EXP: 'http://192.168.101.33:31273/yiheng-edge-server',
    INTERFACE_PREFIX_DMP_ALARM: 'https://qa-gw.yushu.cloud/dmp-alarm',
    INTERFACE_PREFIX_DMP: 'http://qa-gw.yushu.cloud/rcc-data-server',
    INTERFACE_PREFIX_RWD: 'http://192.168.101.32:40003',
    INTERFACE_PREFIX_YUSHU_CDN: 'https://fastcdn.yushu.cloud',
    INTERFACE_PREFIX_BDTP_FILE: 'https://qa.ysbdtp.com/dtp-file-server',
    INTERFACE_PREFIX_MEOS_SOCKET: 'wss://192.168.101.32:40003/meos-control-compute-edge',

    // INTERFACE_PREFIX_APM_STATIC_CONFIG: 'https://apm-static-resources-1307155645.cos.ap-chengdu.myqcloud.com/test',
    // INTERFACE_PREFIX_AIM: 'http://192.168.101.32:30000/meos-control-server-edge/meoi-aim-server',
    // INTERFACE_PREFIX_MEOS: 'http://192.168.101.32:30000/meos-control-server-edge',
    // INTERFACE_PREFIX_EXP: 'http://192.168.101.33:31273/yiheng-edge-server',
    // INTERFACE_PREFIX_DMP_ALARM: 'https://qa-gw.yushu.cloud/dmp-alarm',
    // INTERFACE_PREFIX_DMP: 'https://qa-gw.yushu.cloud/rcc-data-server',
    // INTERFACE_PREFIX_RWD: 'http://192.168.101.32:30000/meos-control-server-edge',
    // INTERFACE_PREFIX_YUSHU_CDN: 'https://fastcdn.yushu.cloud',
    // INTERFACE_PREFIX_BDTP_FILE: 'https://qa.ysbdtp.com/dtp-file-server',
    // INTERFACE_PREFIX_MEOS_SOCKET: 'wss://192.168.101.32:30000/meos-control-compute-edge',
    Environment: 'dev'
};
