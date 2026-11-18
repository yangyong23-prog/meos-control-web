/**
 * opt 运行标准过渡期接口（我方后端 meos-control-server-edge，分支 opt/standards-transition）。
 * 路径集中在这里，后端改名只改这一处。
 */
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
import baseStore from '@/store/baseStore';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { optOn, OPT_SWITCH } from '@/utils/opt/optSwitch';
import { standardsModeState, setStandardsMode, isStandardsMode } from '@/utils/opt/standardsModeState';

/** B1：项目是否已切新运行标准。后端开关关闭时恒为 LEGACY / readOnly=false */
export const getStandardsMode = (projectId, config = {}) => http.get(`${INTERFACE_PREFIX_MEOS}/standards/mode`, { projectId }, { autoHandleError: false, ...config });

/**
 * B4 同形影子接口（与 /demand/config/listConfigsByInstance 同入参同出参，数据源为 dtp-meos standard_compute_result*）。
 * 后端本轮只做了原样转发（computeResult / computeResultDetail），同形接口路径已预留、下一轮实现；
 * 所以前端开关 OPT_STANDARDS_DISPLAY 在后端同形接口上线前保持关闭。
 */
export const listStandardConfigsByInstance = (params, config = {}) => http.post(`${INTERFACE_PREFIX_MEOS}/standards/display/listConfigsByInstance`, params, config);

/** B4 同形影子接口（与 /demand/template/listDateSetting 同形），需求日历按年展示 */
export const listStandardDateSetting = (params, config = {}) => http.post(`${INTERFACE_PREFIX_MEOS}/standards/display/listDateSetting`, params, config);

/** B4 原样转发 dtp-meos /calculate/listStandardComputeResultService（后端本轮提供，前端暂未使用） */
export const listStandardComputeResult = (params, config = {}) => http.post(`${INTERFACE_PREFIX_MEOS}/standards/display/computeResult`, params, config);

/** B4 原样转发 dtp-meos /calculate/listStandardComputeResultDetailService（后端本轮提供，前端暂未使用） */
export const listStandardComputeResultDetail = (params, config = {}) => http.post(`${INTERFACE_PREFIX_MEOS}/standards/display/computeResultDetail`, params, config);

const pending = new Map();

const needMode = () => optOn(OPT_SWITCH.STANDARDS_READONLY) || optOn(OPT_SWITCH.STANDARDS_DISPLAY);

/**
 * 拉取项目模式（每个项目只请求一次）。前端两个开关都关时不发请求。
 * 接口不存在（旧后端）或报错按 LEGACY 处理：页面照旧可写、照旧读旧接口。
 */
export const loadStandardsMode = projectId => {
    if (!projectId || !needMode()) return Promise.resolve({ mode: 'LEGACY', readOnly: false });
    if (standardsModeState[projectId]?.loaded) return Promise.resolve(standardsModeState[projectId]);
    if (pending.has(projectId)) return pending.get(projectId);
    const p = getStandardsMode(projectId)
        .then(res => {
            const data = res?.code === SUCCESSCODE ? res.data || {} : {};
            setStandardsMode(projectId, { mode: data.mode === 'STANDARD' ? 'STANDARD' : 'LEGACY', readOnly: data.readOnly === true });
        })
        .catch(() => setStandardsMode(projectId, { mode: 'LEGACY', readOnly: false }))
        .then(() => {
            pending.delete(projectId);
            return standardsModeState[projectId];
        });
    pending.set(projectId, p);
    return p;
};

/**
 * W3：展示类标准值的读取入口。OPT_STANDARDS_DISPLAY 关闭、非空调模板、或项目未切时走原接口；
 * 否则走 B4 同形影子接口（我方后端转 dtp-meos）。开关关闭时同步返回原接口的 Promise，行为不变。
 */
export const withStandardsDisplay = (legacy, shadow) => (params, config) => {
    if (!optOn(OPT_SWITCH.STANDARDS_DISPLAY) || (params?.templateType && params.templateType !== 'AIRCONDITIONING')) {
        return legacy(params, config);
    }
    const projectId = baseStore().projectId;
    return loadStandardsMode(projectId).then(() => (isStandardsMode(projectId) ? shadow(params, config) : legacy(params, config)));
};
