/**
 * opt W2：项目"是否已切新运行标准"的前端状态（不依赖 http，供 http 拦截器读取，避免循环引用）。
 *
 * 判定由后端 B1 给出：GET {INTERFACE_PREFIX_MEOS}/standards/mode → { mode: STANDARD|LEGACY, readOnly }。
 * readOnly 只有在后端两个开关（switch.opt.standardsMode、switch.opt.standardsReadonly）都开、且项目已切时才为 true；
 * 前端还要求 OPT_STANDARDS_READONLY 打开，任一关闭都照旧可写。
 */
import { reactive } from 'vue';
import { optOn, OPT_SWITCH } from './optSwitch';

export const READONLY_MESSAGE = '由云端运行标准管理';

/** 与后端 B2 默认拦截清单一致（后端可经 Nacos switch.opt.standards.readonly-paths 覆盖，前端这里只做提前提示） */
export const READONLY_WRITE_PATHS = [
    '/demand/addInstanceConfig',
    '/demand/addDemandConfig',
    '/demand/clearSettings',
    '/demand/referenceSettings',
    '/demand/copyConfigs',
    '/demand/blacklist/addRules',
    '/demand/instanceGroup/add',
    '/demand/instanceGroup/edit',
    '/demand/instanceGroup/copy',
    '/demand/template/applyTemplateByDate',
    '/demand/template/clearCalendar',
    '/valueSelection/saveConfig',
    '/shellConfig/mpcAgentCfg',
    // 11-19：壳配置、干预任务配置也归运行标准服务 / dtp-meos（解除干预等手动操作不拦）
    '/shellConfig/save',
    '/shellConfig/changeAlgorithmConfig',
    '/shellConfig/changeLtsmConfig',
    '/interventionTaskConfig/saveOrUpdate',
    '/interventionTaskConfig/remove',
    '/intervention/config/saveOrUpdate'
];

/** projectId -> { mode, readOnly, loaded } */
export const standardsModeState = reactive({});

export const setStandardsMode = (projectId, { mode = 'LEGACY', readOnly = false } = {}) => {
    if (!projectId) return;
    standardsModeState[projectId] = { mode, readOnly: !!readOnly, loaded: true };
};

export const isStandardsReadonly = projectId => optOn(OPT_SWITCH.STANDARDS_READONLY) && !!standardsModeState[projectId]?.readOnly;

export const isStandardsMode = projectId => standardsModeState[projectId]?.mode === 'STANDARD';

/** 写接口是否应拦截。只匹配 MEOS 后端路径的结尾，避免误伤同名的 dtp-meos 接口 */
export const isReadonlyWriteUrl = (url = '') => {
    const path = String(url).split('?')[0];
    return READONLY_WRITE_PATHS.some(p => path.endsWith(p));
};
