/**
 *  APM各业务线通用配置
 */
window.apmCommonEnv = {
    INTERFACE_PREFIX_AIM: 'https://dev-paasgw.yushu.cloud/apm-aim',
    INTERFACE_PREFIX_COMMON: 'https://dev-paasgw.yushu.cloud/apm-common',
    INTERFACE_PREFIX_DMP: 'https://dev-paasgw.yushu.cloud/apm-dmp',
    INTERFACE_PREFIX_STM: 'https://dev-paasgw.yushu.cloud/apm-stm',
    INTERFACE_PREFIX_RDM: 'https://dev-paasgw.yushu.cloud/apm-rdm',
    INTERFACE_PREFIX_BDTP: 'https://qa.ysbdtp.com', //陈龙说开发环境用到bdtp联调全部用qa
    INTERFACE_PREFIX_REVIT: 'https://dev-revit.ysbdtp.com',
    INTERFACE_PREFIX_BMS: 'https://dev-paasgw.yushu.cloud/apm-bms',
    INTERFACE_PREFIX_FRM: 'https://dev-paasgw.yushu.cloud/apm-frm',
    INTERFACE_PREFIX_RCC: 'https://dev-paasgw.yushu.cloud/apm-rcc',
    INTERFACE_PREFIX_BOSSAUTH: 'https://dev-paasgw.yushu.cloud/boss-auth',
    INTERFACE_PREFIX_PAASACCOUNT: 'https://dev-paasgw.yushu.cloud/paas-account',
    INTERFACE_PREFIX_EXP: 'https://dev-paasgw.yushu.cloud/apm-exp',
    INTERFACE_PREFIX_YUSHU_CDN: 'https://fastcdn.yushu.cloud',
    INTERFACE_PREFIX_DOC_REIVEW: 'https://kkfile.yushu.cloud',
    INTERFACE_PREFIX_APM_STATIC_CONFIG: 'https://apm-static-resources-1307155645.cos.ap-chengdu.myqcloud.com/dev',
    Environment: 'test'
};
window.apmstmEnv = {
    // 接口前缀1
    INTERFACE_PREFIX_AIM: 'https://dev-paasgw.yushu.cloud/apm-aim',
    // 接口前缀2
    INTERFACE_PREFIX_COMMON: 'https://dev-paasgw.yushu.cloud/apm-common',
    // 接口前缀3
    INTERFACE_PREFIX_DMP: 'https://dev-paasgw.yushu.cloud/apm-dmp',
    // 接口前缀4
    INTERFACE_PREFIX_STM: 'https://dev-paasgw.yushu.cloud/apm-stm',
    // 接口前缀6
    INTERFACE_PREFIX_RDM: 'https://dev-paasgw.yushu.cloud/apm-rdm',
    // bdtp系统图服务
    INTERFACE_PREFIX_BDTP: 'https://dev.ysbdtp.com',
    INTERFACE_PREFIX_REVIT: 'https://dev-revit.ysbdtp.com',
    // 环境1
    Environment: 'test'
};

window.apmrdmEnv = {
    // 接口前缀1
    INTERFACE_PREFIX_AIM: 'https://dev-paasgw.yushu.cloud/apm-aim',
    // 接口前缀2
    INTERFACE_PREFIX_COMMON: 'https://dev-paasgw.yushu.cloud/apm-common',
    // 接口前缀3
    INTERFACE_PREFIX_DMP: 'https://dev-paasgw.yushu.cloud/apm-dmp',
    // 接口前缀4
    INTERFACE_PREFIX_STM: 'https://dev-paasgw.yushu.cloud/apm-stm',
    // 接口前缀5
    INTERFACE_PREFIX_FRM: 'https://dev-paasgw.yushu.cloud/apm-frm',
    // 接口前缀6
    INTERFACE_PREFIX_RDM: 'https://dev-paasgw.yushu.cloud/apm-rdm',
    // bdtp文件服务
    INTERFACE_PREFIX_BDTP: 'https://dev.ysbdtp.com',
    INTERFACE_PREFIX_REVIT: 'https://dev-revit.ysbdtp.com',
    // 环境1
    Environment: 'test'
};

window.apmbmsEnv = {
    // INTERFACE_PREFIX_BMS: "/api/bms/ys-dev/apm-bms/apm-bms",
    INTERFACE_PREFIX_BMS: 'https://dev-paasgw.yushu.cloud/apm-bms',
    INTERFACE_PREFIX_BDTP: 'https://dev.ysbdtp.com',
    INTERFACE_PREFIX_RDM: 'https://dev-paasgw.yushu.cloud/apm-rdm',
    INTERFACE_PREFIX_COMMON: 'https://dev-paasgw.yushu.cloud/apm-common',
    INTERFACE_PREFIX_BOSSAUTH: 'https://dev-paasgw.yushu.cloud/boss-auth',
    INTERFACE_PREFIX_DOC_REIVEW_CONFIG: true,
    // 项目业务对象实例数据初始化
    BUSINESS_OBJECT_INIT:
        '[{"group-code": "TYXM", "project-id": "Pj9909990006", "project-name": "禹数项目"},{"group-code": "JDKJ", "project-id": "Pj1101080665", "project-name": "京东科技大厦"}]',
    Environment: 'test'
};

window.apmamcEnv = {
    INTERFACE_PREFIX_BMS: 'https://dev-paasgw.yushu.cloud/apm-bms',
    INTERFACE_PREFIX_BDTP: 'https://dev.ysbdtp.com',
    INTERFACE_PREFIX_COMMON: 'https://dev-paasgw.yushu.cloud/apm-common',
    Environment: 'test'
};

window.apmappEnv = {
    WEBSITE_ID: '161',
    LOGIN_URL: '/apm-app/login/index.html',
    PUBLIC_KEY:
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCdn+NA5eVwV0NQ56chEZf6bq8i6NsdlEE8TdP7Ee9EN8kjw1b52J5s65ph4pZ4+BmK5vNEO/E4JWmCUR0DLPkd45/ni9Iwnh/bL2zB9O0k5LPgupa9yd6jSqC5ioBgWHjkf7NAPMP9l4CeKSGSfCF9ZXpaDpcDlOribQzDU4fh8QIDAQAB',
    CHILD_APP: {
        RDM_DUE_DILIGENCE: {
            name: '尽职调查',
            publicPath: '/due-diligence'
        }
    }
};
