const isDev = import.meta.env.MODE === 'development';
const proxyHit = '/proxy-api'; // 代理命中前嘴
const wssProxyHit = '/proxy-wss'; // wss代理命中前缀

// 不需要代理的url
const notNeedProxyUrl = [];

/**
 *
 * @param {*} nameSpace  命名空间
 * @param {*} nameSpaceSpare  备用命名空间
 * @param {*} serverCode  服务编码
 */
const getInterfacePrefix = (...params) => {
    if (params.length === 0) {
        console.error('getInterfacePrefix 参数不能为空');
        return '';
    }
    let urlPerfix = '';
    if (params.length === 1) {
        const serverCode = params[0];
        urlPerfix = window.proxy?.[serverCode] || window[serverCode];
    } else if (params.length === 2) {
        const nameSpace = params[0];
        const serverCode = params[1];
        urlPerfix = window.proxy?.[nameSpace]?.[serverCode] || window[nameSpace]?.[serverCode];
    } else {
        const nameSpace = params[0];
        const nameSpaceSpare = params[1];
        const serverCode = params[2];
        urlPerfix =
            window.proxy?.[nameSpace]?.[serverCode] || window[nameSpace]?.[serverCode] || window.proxy?.[nameSpaceSpare]?.[serverCode] || window[nameSpaceSpare]?.[serverCode];
    }
    // if (isDev && urlPerfix && urlPerfix.includes('edge.com')) {
    //     try {
    //         const urlObj = new URL(urlPerfix);

    //         // 一些URL 不需要代理
    //         if (notNeedProxyUrl.includes(urlObj.origin)) {
    //             return urlPerfix;
    //         }
    //         if (urlObj.protocol === 'wss:') {
    //             urlPerfix = wssProxyHit + urlObj.pathname + urlObj.search;
    //         } else {
    //             urlPerfix = proxyHit + urlObj.pathname + urlObj.search;
    //         }
    //     } catch (e) {
    //         urlPerfix = proxyHit + urlPerfix;
    //     }
    //     urlPerfix = window.location.origin + urlPerfix;
    // }
    return urlPerfix;
};

// 将环境/配置值归一化为布尔值：值为空时返回默认值（默认 true），支持 boolean、'true'/'false' 字符串、其余经 Boolean 转换
const toBooleanConfig = (value, defaultValue = true) => {
    if (value == null) {
        return defaultValue;
    }
    try {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            const content = value.trim().toLowerCase();
            if (content === 'true') {
                return true;
            }
            if (content === 'false') {
                return false;
            }
        }
        return Boolean(value);
    } catch (error) {
        return defaultValue;
    }
};

// 转发前缀
export const MEOI_AIM_PREFIX = '/meoi-aim-server';

// MEOI_INSTANCE_DETAIL // 跳转到实例全屏详情地址
export const MEOI_INSTANCE_DETAIL = getInterfacePrefix('apmPageUrl', 'MEOI_INSTANCE_DETAIL');
// window.proxy?.apmPageUrl?.MEOI_INSTANCE_DETAIL || window.apmPageUrl?.MEOI_INSTANCE_DETAIL;

// MEOI_DATA_FREE_ANALYSIS // 跳转到数据分析
export const MEOI_DATA_FREE_ANALYSIS = getInterfacePrefix('apmPageUrl', 'MEOI_DATA_FREE_ANALYSIS');
// window.proxy?.apmPageUrl?.MEOI_DATA_FREE_ANALYSIS || window.apmPageUrl?.MEOI_DATA_FREE_ANALYSIS;

// UNUSUAL_EVENTS // 跳转到异常事件
export const UNUSUAL_EVENTS = getInterfacePrefix('apmPageUrl', 'UNUSUAL_EVENTS');
// window.proxy?.apmPageUrl?.UNUSUAL_EVENTS || window.apmPageUrl?.UNUSUAL_EVENTS;

// RISK_EVENTS // 跳转到风险事件
export const RISK_EVENTS = getInterfacePrefix('apmPageUrl', 'RISK_INSTANCE_DETAIL');
// window.proxy?.apmPageUrl?.RISK_EVENTS || window.apmPageUrl?.RISK_EVENTS;

// RISK_EVENTS // 跳转到风险事件
export const ENERGY_ENERGY_SINGLE_PROJECT = getInterfacePrefix('apmPageUrl', 'ENERGY_ENERGY_SINGLE_PROJECT');

// 能耗模型
export const INTERFACE_PREFIX_ENERGY_RESEARCH = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_ENERGY_RESEARCH');

// 跳转到项目运行标准
export const MEOS_OPERATION_CRITERION = getInterfacePrefix('apmPageUrl', 'MEOS_OPERATION_CRITERION');

// MEOS_RUN_ANALYSIS // 跳转到运行分析
export const MEOS_RUN_ANALYSIS = getInterfacePrefix('apmPageUrl', 'MEOS_RUN_ANALYSIS');

// MEOS_LIGHTING_DEMAND // 跳转运行标准--照明需求
export const MEOS_LIGHTING_DEMAND = getInterfacePrefix('apmPageUrl', 'MEOS_LIGHTING_DEMAND');

// INTERFACE_PREFIX_DTP_MEOS // 云端bdtp-dtp服务
export const INTERFACE_PREFIX_DTP_MEOS = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_DTP_MEOS');

// DEMANDMANAGEMENT_AC_HOME // 跳转末端运行标准配置
export const DEMANDMANAGEMENT_AC_HOME = getInterfacePrefix('apmPageUrl', 'DEMANDMANAGEMENT_AC_HOME');

export const INTERFACE_PREFIX_AIM = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_AIM');

// window.proxy?.meosEnv?.INTERFACE_PREFIX_AIM ||
//     window.meosEnv?.INTERFACE_PREFIX_AIM ||
//     window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_AIM ||
//     window.apmCommonEnv?.INTERFACE_PREFIX_AIM; // aim 后端服务

export const INTERFACE_PREFIX_MEOS = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_MEOS');
// '/meos-control-server-edge' ||
// window.proxy?.meosEnv?.INTERFACE_PREFIX_MEOS ||
// window.meosEnv?.INTERFACE_PREFIX_MEOS ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_MEOS ||
// window.apmCommonEnv?.INTERFACE_PREFIX_MEOS; // moes 后端服务

export const INTERFACE_PREFIX_BDTP_WEATHER = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_BDTP_WEATHER');
// '/meos-control-server-edge' ||
// window.proxy?.meosEnv?.INTERFACE_PREFIX_BDTP_WEATHER ||
// window.meosEnv?.INTERFACE_PREFIX_BDTP_WEATHER ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_BDTP_WEATHER ||
// window.apmCommonEnv?.INTERFACE_PREFIX_BDTP_WEATHER; // moes 后端服务

export const INTERFACE_PREFIX_MID_PERMISSION = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_MID_PERMISSION');
// '/meos-control-server-edge' ||
// window.proxy?.meosEnv?.INTERFACE_PREFIX_MID_PERMISSION ||
// window.meosEnv?.INTERFACE_PREFIX_MID_PERMISSION ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_MID_PERMISSION ||
// window.apmCommonEnv?.INTERFACE_PREFIX_MID_PERMISSION; // moes 后端服务

export const INTERFACE_PREFIX_BDTP_PERSIST = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_BDTP_PERSIST');
// '/meos-control-server-edge' ||
// window.proxy?.meosEnv?.INTERFACE_PREFIX_MEOS ||
// window.meosEnv?.INTERFACE_PREFIX_MEOS ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_MEOS ||
// window.apmCommonEnv?.INTERFACE_PREFIX_MEOS; // moes 后端服务

export const INTERFACE_PREFIX_BDTP_ELECTRICITY = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_BDTP_ELECTRICITY');
// '/meos-control-server-edge' ||
// window.proxy?.meosEnv?.INTERFACE_PREFIX_MEOS ||
// window.meosEnv?.INTERFACE_PREFIX_MEOS ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_MEOS ||
// window.apmCommonEnv?.INTERFACE_PREFIX_MEOS; // moes 后端服务

export const INTERFACE_PREFIX_MEOS_DTP = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_MEOS_DTP');
// '/meos-control-server-edge' ||
// window.proxy?.meosEnv?.INTERFACE_PREFIX_MEOS_DTP ||
// window.meosEnv?.INTERFACE_PREFIX_MEOS_DTP ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_MEOS_DTP ||
// window.apmCommonEnv?.INTERFACE_PREFIX_MEOS_DTP; // moes 后端服务

export const INTERFACE_PREFIX_TWIN_DTP = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_TWIN_DTP');

export const INTERFACE_PREFIX_EMS = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_EMS');
// '/meos-control-server-edge' ||
// window.proxy?.meosEnv?.INTERFACE_PREFIX_EMS ||
// window.meosEnv?.INTERFACE_PREFIX_EMS ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_EMS ||
// window.apmCommonEnv?.INTERFACE_PREFIX_EMS;
//INTERFACE_PREFIX_MEOS_COMPUTE

export const INTERFACE_PREFIX_ENERGY_QUALITY = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_ENERGY_QUALITY');
// '/meos-control-server-edge' ||
// window.proxy?.meosEnv?.INTERFACE_PREFIX_ENERGY_QUALITY ||
// window.meosEnv?.INTERFACE_PREFIX_ENERGY_QUALITY ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_ENERGY_QUALITY ||
// window.apmCommonEnv?.INTERFACE_PREFIX_ENERGY_QUALITY;

export const INTERFACE_PREFIX_IOTHUB = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_IOTHUB');
// window.proxy?.meosEnv?.INTERFACE_PREFIX_IOTHUB ||
// window.meosEnv?.INTERFACE_PREFIX_IOTHUB ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_IOTHUB ||
// window.apmCommonEnv?.INTERFACE_PREFIX_IOTHUB; // iothub 服务

export const INTERFACE_PREFIX_MEOS_COMPUTE = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_MEOS_COMPUTE');
// window.proxy?.meosEnv?.INTERFACE_PREFIX_MEOS_COMPUTE ||
// window.meosEnv?.INTERFACE_PREFIX_MEOS_COMPUTE ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_MEOS_COMPUTE ||
// window.apmCommonEnv?.INTERFACE_PREFIX_MEOS_COMPUTE; // moes 计算服务

export const INTERFACE_PREFIX_DMP_ALARM = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_DMP_ALARM');
// window.proxy?.meosEnv?.INTERFACE_PREFIX_DMP_ALARM ||
// window.meosEnv?.INTERFACE_PREFIX_DMP_ALARM ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_DMP_ALARM ||
// window.apmCommonEnv?.INTERFACE_PREFIX_DMP_ALARM; // dpm-alarm 后端服务

export const INTERFACE_PREFIX_DMP = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_DMP');
// window.proxy?.meosEnv?.INTERFACE_PREFIX_DMP ||
// window.meosEnv?.INTERFACE_PREFIX_DMP ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_DMP ||
// window.apmCommonEnv?.INTERFACE_PREFIX_DMP;

export const INTERFACE_PREFIX_RWD = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_RWD');
// window.proxy?.meosEnv?.INTERFACE_PREFIX_RWD ||
// window.meosEnv?.INTERFACE_PREFIX_RWD ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_RWD ||
// window.apmCommonEnv?.INTERFACE_PREFIX_RWD;

export const INTERFACE_PREFIX_BDTP_DMP_RWD = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_BDTP_DMP_RWD');
// window.proxy?.meosEnv?.INTERFACE_PREFIX_BDTP_DMP_RWD ||
// window.meosEnv?.INTERFACE_PREFIX_BDTP_DMP_RWD ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_BDTP_DMP_RWD ||
// window.apmCommonEnv?.INTERFACE_PREFIX_BDTP_DMP_RWD;

export const INTERFACE_PREFIX_YUSHU_CDN = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_YUSHU_CDN');
// export const INTERFACE_PREFIX_YUSHU_CDN = 'https://cdn.meos.center';
// window.proxy?.meosEnv?.INTERFACE_PREFIX_YUSHU_CDN ||
// window.meosEnv?.INTERFACE_PREFIX_YUSHU_CDN ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_YUSHU_CDN ||
// window.apmCommonEnv?.INTERFACE_PREFIX_YUSHU_CDN;

export const INTERFACE_PREFIX_MEOS_SOCKET = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_MEOS_SOCKET');
// window.proxy?.meosEnv?.INTERFACE_PREFIX_MEOS_SOCKET ||
// window.meosEnv?.INTERFACE_PREFIX_MEOS_SOCKET ||
// window.proxy?.apmCommonEnv?.INTERFACE_PREFIX_MEOS_SOCKET ||
// window.apmCommonEnv?.INTERFACE_PREFIX_MEOS_SOCKET;

export const INTERFACE_PREFIX_BDTP_KNOWLEDGE = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_BDTP_KNOWLEDGE');

export const Environment = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'Environment');
// window.proxy?.meosEnv?.Environment || window.meosEnv?.Environment || window.proxy?.apmCommonEnv?.Environment || window.apmCommonEnv?.Environment;

// 自主运行照明需求空间数量上限
export const MEOS_LIGHT_SPACE_MAXCOUNT = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'MEOS_LIGHT_SPACE_MAXCOUNT');
// window.proxy?.meosEnv?.MEOS_LIGHT_SPACE_MAXCOUNT ||
//     window.meosEnv?.MEOS_LIGHT_SPACE_MAXCOUNT ||
//     window.proxy?.apmCommonEnv?.MEOS_LIGHT_SPACE_MAXCOUNT ||
//     window.apmCommonEnv?.MEOS_LIGHT_SPACE_MAXCOUNT;

export const CLOUD_ORIGIN = getInterfacePrefix('apmPageUrl', 'CLOUD_ORIGIN');
// window.proxy?.apmPageUrl?.CLOUD_ORIGIN || window.apmPageUrl?.CLOUD_ORIGIN;

export const MEOS_TMP_TAG_STYLES = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'MEOS_TMP_TAG_STYLES');

// 是否开启楼层地图图标旋转动画
export const USE_MAP_EQ_ICON_ANIM = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'USE_MAP_EQ_ICON_ANIM');
// 启用-楼层图碰撞设置
export const USE_FLOOR_COLLISION_SETTING = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'USE_FLOOR_COLLISION_SETTING');

export const SHOW_ALLSPACES_ONLY = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'SHOW_ALLSPACES_ONLY');
// window.proxy?.meosEnv?.MEOS_TMP_TAG_STYLES ||
// window.meosEnv?.MEOS_TMP_TAG_STYLES ||
// window.proxy?.apmCommonEnv?.MEOS_TMP_TAG_STYLES ||
// window.apmCommonEnv?.MEOS_TMP_TAG_STYLES;

export const APM_MONITORING_CONFIGS = getInterfacePrefix('apmMonitoringConfigs');
// window.proxy?.apmMonitoringConfigs || window.apmMonitoringConfigs;

// 持续时长步长设置
export const MEOS_LIGHT_SUSTAIN_STEP = window.apmMeosAutoControl?.MEOS_LIGHT_SUSTAIN_STEP;
// window.proxy?.apmMeosAutoControl?.MEOS_LIGHT_SUSTAIN_STEP ||
// window.apmMeosAutoControl?.MEOS_LIGHT_SUSTAIN_STEP;

// 监控视频控制防抖，等待时间间隔(单位：毫秒)；非必填
export const MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT');
// window.proxy?.meosEnv?.MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT ||
// window.meosEnv?.MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT ||
// window.proxy?.apmCommonEnv?.MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT ||
// window.apmCommonEnv?.MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT;

export const INTERFACE_PREFIX_AI_AUTORUN = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_AI_AUTORUN');

export const INTERFACE_PREFIX_MID_CALENDAR = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_MID_CALENDAR');

export const INTERFACE_PREFIX_IT_OPS = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'INTERFACE_PREFIX_IT_OPS');

export const MEOS_AI_AUTORUN_EDGE = getInterfacePrefix('apmPageUrl', 'MEOS_AI_AUTORUN_EDGE');

export const MEOS_RUNRETROREPORT_INFO = getInterfacePrefix('apmPageUrl', 'MEOS_RUNRETROREPORT_INFO');

// 网格图配置 分页
export const MEOS_GRID_CONFIG_SPLICE_SIZE = getInterfacePrefix('apmCommonEnv', 'MEOS_GRID_CONFIG_SPLICE_SIZE') || 1000;

export const useMapEqIconAnim = toBooleanConfig(USE_MAP_EQ_ICON_ANIM);

// 是否启用楼层图碰撞设置（控制 FloorMapSetting 是否展示使用）
export const useFloorCollisionSetting = toBooleanConfig(USE_FLOOR_COLLISION_SETTING, false);

export const showAllSpacesOnly = toBooleanConfig(SHOW_ALLSPACES_ONLY, false);

// SSE自动重连时长(单位：分钟)
export const sseReConnectMinutes = getInterfacePrefix('meosEnv', 'apmCommonEnv', 'RECONNECT_MINUTES');

// 管道颜色配置 用于空间三维图中管道渲染
export const pipeColorConfig = getInterfacePrefix('apmCommonEnv', 'MEOS_PIPE_COLOR_CONFIG');
