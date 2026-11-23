/**
 * opt/edge-hide-abnormal-events：边缘盒子去掉“异常事件”页签和面板。
 *
 * 新边缘架构里异常监测、研判归 meos-hub 工作台，自控页面（meos-control-web）只负责运行监控和人工控制。
 * 开关 OPT_HIDE_ABNORMAL_EVENTS（window.meosEnv，默认关闭）打开后：
 * - 设备/空间详情抽屉里标签为“异常事件”的 DrawerPane 不注册、不渲染（见 CommonDrawer/DrawerPane.vue），
 *   里面的异常事件列表组件不挂载，也就不会再请求异常事件列表；
 * - 各页面右侧面板的“异常事件”页签从页签数组里过滤掉（withoutAbnormalTabs），对应内容不渲染。
 * 开关关闭时一切照旧（云端和其他边缘部署不受影响）。
 *
 * 所有页面的异常事件页签都用同一个文案 key（meos_control_web.abnormal_event），这里按文案识别，
 * 不需要给 30 多处调用方逐个加标记。
 */
import i18n from '@/localization';
import { optOn, OPT_SWITCH } from './optSwitch';

export const hideAbnormalEvents = () => optOn(OPT_SWITCH.HIDE_ABNORMAL_EVENTS);

const abnormalEventLabel = () => i18n.global.t('meos_control_web.abnormal_event');

/** 是否为“异常事件”页签/面板（按文案或 slotName='abnormal' 识别） */
export const isAbnormalEventTab = tab => {
    if (!tab) return false;
    const label = abnormalEventLabel();
    return tab.name === label || tab.label === label || tab.title === label || tab.slotName === 'abnormal';
};

/** DrawerPane 用：该面板是否应隐藏 */
export const shouldHideAbnormalPane = label => hideAbnormalEvents() && !!label && label === abnormalEventLabel();

/** 开关打开时从页签数组里去掉“异常事件”页签；关闭时原样返回 */
export const withoutAbnormalTabs = list => (hideAbnormalEvents() && Array.isArray(list) ? list.filter(tab => !isAbnormalEventTab(tab)) : list);

/**
 * meos-control 的异常事件查询接口（返回值都是 R<List|Collection|Set>，见 meos-control-parent
 * AbnormalDataController、StatePerceptionController 及各业务 Controller 的 getAbnormalDataList）。
 * 开关打开时 http 拦截器不发这些请求，本地直接返回成功 + 空列表，页面按“无异常事件”处理，
 * 1 分钟一次的异常事件轮询也随之消失。
 */
const ABNORMAL_EVENT_PATHS = [
    '/abnormalEvent/listAbnormalEvent',
    '/abnormalEvent/new/listAbnormalEvent',
    '/abnormalEvent/listAbnormalEventBySpaceWithEquipments',
    '/abnormalEvent/getAbnormalDataListDivideSystem',
    '/abnormalEvent/countAbnormalEvent',
    '/running-monitor/queryAbnormalEventList',
    '/running-monitor/querySingleAbnormalEventList',
    '/airTerminal/getAbnormalDataList',
    '/ventilation/getAbnormalDataList',
    '/security/getAbnormalDataList',
    '/lighting/getAbnormalDataList'
];

/** 开关打开且 url 是异常事件查询接口时返回 true（url 可带前缀和查询串） */
export const isSkippedAbnormalEventUrl = url => {
    if (!url || !hideAbnormalEvents()) return false;
    const path = url.split('?')[0];
    return ABNORMAL_EVENT_PATHS.some(p => path.endsWith(p));
};
