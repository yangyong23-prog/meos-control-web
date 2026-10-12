/**
 * 信息点分精度接口注册表（removeDefaultIpType 标记头）— 按模块（路由上下文）区分
 * 关联文档：docs/信息点分精度前端技术方案.md
 *
 * - 同一接口在不同模块打标需求不同，故规则带路由上下文；模块规则在 router.afterEach
 *   解析一次写入 store（precisionCurrentRule），拦截器仅消费，避免每请求重复匹配。
 * - 匹配：routePatterns 支持 :param 动态段 + majorCodes/excludeMajorCodes 白/黑名单；
 *   exact 为 pathname endsWith（跨服务前缀无关），prefixes 为 includes。
 *   ⚠️ endsWith/includes 会命中其它微服务的同名路径，新增条目需确认路径全局唯一。
 * - 接口条目需与后端《PRD-260901-接口改造最终清单.md》一一对应。
 *   在改造范围：空调冷源 /ACAC、空调热源 /system/ACAH、空调冷热源 /system/ACAI、
 *   冷源 /filter-system-graph/AC、冷热源 /ACCI；
 *   不在范围（不配规则）：热源 /ACCH、生活给水 /ws、气源系统 /system/:majorCode、光伏 /system/SEEA。
 * - 回滚：删除/注释对应规则或条目即可逐模块、逐接口回滚。
 */
import { isEdge } from '@/utils/envUtils';

/** 单模块规则 */
export interface PrecisionModuleRule {
    /** 模块标识（仅用于排查定位，不参与匹配） */
    module: string;
    /** 模块路由匹配模式，支持 :param 动态段，如 '/operation-monitor/:majorCode/graph' */
    routePatterns: string[];
    /** 可选：路由 :majorCode 参数白名单，配置后仅命中这些值时该规则生效 */
    majorCodes?: string[];
    /** 可选：路由 :majorCode 参数黑名单，命中则该规则不生效（如热源 ACAH） */
    excludeMajorCodes?: string[];
    /** 该模块下需要打标的接口（精确匹配） */
    exact: string[];
    /** 该模块下需要打标的接口（前缀匹配，动态 id 段） */
    prefixes?: string[];
}

// ===== 各模块通用接口片段 =====
/** 系统图/模型图相关 */
const SYS_GRAPH_EXACT = [
    '/instance/listObjectsByTackValueLogic',
    '/systemGraphEditor/getSystemGraphDetailById',
    '/infoCodeConfig/listInfoCodeConfigsByObjectId',
    '/infoCodeConfig/listInfoCodeConfigsByTemplateId',
    '/equipment/infoCodeConfig/listInfoCodeConfigsByObject',
    '/running-monitor/batchQueryInfoCode',
    '/running-monitor/queryInfoCodeConfigByObjectIds',
    '/running-monitor/batchQueryInfoCodeConfig'
];
/** 系统图/模型图动态 id 段（前缀匹配） */
const SYS_GRAPH_PREFIXES = ['/system/graph/instance/', '/airconditioning/listEquipmentsToModuleView/'];
/** 控制台/控制面板（冷源、冷热源共用，见影响范围梳理 §4(2)/§5） */
const CONSOLE_EXACT = [
    '/running-monitor/querySystemRunningParam',
    '/strategyIntervention/chillerStrategy/listRunningStrategy',
    '/strategyIntervention/lastFreezePumpGroup/listRunningStrategy'
];
/** 冷热源专属（§5：冷热源在冷源基础上额外多出） */
const HOT_COLD_CONSOLE_EXACT = ['/hotColdStationStrategyIntervention/listRunningStrategy'];
/** 各模块通用（对象弹窗标签、SSE 订阅、室外天气） */
const MISC_EXACT = ['/airTerminal/getObjectTag', '/server-event/sse/subscribe', '/weather/queryWeather'];

export const PRECISION_MODULE_RULES: PrecisionModuleRule[] = [
    {
        module: '空调冷源(/ACAC)',
        routePatterns: ['/ACAC'],
        exact: [...SYS_GRAPH_EXACT, ...MISC_EXACT],
        prefixes: [...SYS_GRAPH_PREFIXES]
    },
    {
        module: '空调冷热源(/system/ACAI)',
        routePatterns: ['/system/ACAI'],
        exact: [...SYS_GRAPH_EXACT, ...MISC_EXACT],
        prefixes: [...SYS_GRAPH_PREFIXES]
    },
    {
        module: '空调热源(/system/ACAH)',
        routePatterns: ['/system/ACAH'],
        exact: [...SYS_GRAPH_EXACT, ...MISC_EXACT],
        prefixes: [...SYS_GRAPH_PREFIXES]
    },
    // 热源 /ACCH、生活给水 /ws、气源、光伏不在改造范围，不配规则
    {
        module: '冷源(/filter-system-graph/AC)',
        routePatterns: ['/filter-system-graph/:majorCode'],
        majorCodes: ['AC'],
        exact: [...SYS_GRAPH_EXACT, ...CONSOLE_EXACT, ...MISC_EXACT],
        prefixes: [...SYS_GRAPH_PREFIXES]
    },
    {
        // /ACCH 显式排除，防止 /:majorCode 动态规则误匹配热源
        module: '冷热源(/ACCI)',
        routePatterns: ['/operation-monitor/:majorCode/graph', '/:majorCode'],
        majorCodes: ['ACCI'],
        excludeMajorCodes: ['ACCH'],
        exact: [...SYS_GRAPH_EXACT, ...CONSOLE_EXACT, ...HOT_COLD_CONSOLE_EXACT, ...MISC_EXACT],
        prefixes: [...SYS_GRAPH_PREFIXES]
    }
];

/** 归一化 URL 为 pathname（去 query） */
export const normalizeApiPath = (url: string): string => {
    if (!url) return '';
    try {
        return new URL(url, window.location.origin).pathname;
    } catch (e) {
        return url.split('?')[0];
    }
};

/** 路由模式 → 正则（先转义正则特殊字符，再替换 :param 段） */
const routePatternToRegex = (pattern: string): RegExp => new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:[^/]+/g, '[^/]+')}(?:/|$)`);

/** 当前路由上下文是否命中规则 */
const matchRouteContext = (rule: PrecisionModuleRule, path: string, params: Record<string, any>): boolean =>
    rule.routePatterns.some(pattern => routePatternToRegex(pattern).test(path)) &&
    (!rule.majorCodes || (params?.majorCode ? rule.majorCodes.includes(params.majorCode) : false)) &&
    (!rule.excludeMajorCodes || !params?.majorCode || !rule.excludeMajorCodes.includes(params.majorCode));

/** 请求 url 是否命中规则内接口列表 */
const matchApiInRule = (rule: PrecisionModuleRule, apiPath: string): boolean =>
    rule.exact.some(item => apiPath.endsWith(item)) || (rule.prefixes ?? []).some(item => apiPath.includes(item));

/** 解析当前路由上下文命中的模块规则（路由导航时调用一次），未命中返回 null */
export const resolvePrecisionModule = (path: string, params: Record<string, any>): PrecisionModuleRule | null =>
    PRECISION_MODULE_RULES.find(rule => matchRouteContext(rule, path, params)) || null;

/** 判断请求 url 是否命中指定模块规则下的接口列表（rule 来自 store） */
export const matchPrecisionApi = (url: string, rule: PrecisionModuleRule | null): boolean => {
    if (!rule) return false;
    const apiPath = normalizeApiPath(url);
    if (!apiPath) return false;
    return matchApiInRule(rule, apiPath);
};

/** removeDefaultIpType 标记头名称 */
export const PRECISION_MARKER_HEADER = 'removeDefaultIpType';

/** 共用打标入口：命中规则时向 headers 写入标记，axios 拦截器与 SSEClient 共用 */
export const applyPrecisionMarker = (url: string, rule: PrecisionModuleRule | null, headers: Record<string, any>): boolean => {
    if (isEdge()) return false;
    if (!matchPrecisionApi(url, rule)) return false;
    headers[PRECISION_MARKER_HEADER] = 'true';
    if (import.meta.env.DEV) {
        console.debug(`[precision] ${PRECISION_MARKER_HEADER} 命中模块: ${rule?.module}`, url);
    }
    return true;
};
