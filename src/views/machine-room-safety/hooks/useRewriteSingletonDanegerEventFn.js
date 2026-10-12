import DockSingleton from '@/hooks/responsiveDock';
import { DANEGER_STATUS } from '@/utils/globalVariables';

const isExceptionOrPOTENTIAL = status => {
    return status === DANEGER_STATUS.CONJECTURE_EXCEPTION.code || status === DANEGER_STATUS.EXCEPTION.code || status === DANEGER_STATUS.POTENTIAL.code;
};
/**
 * @param {Object} followMark - 主动管理的风险，用于过滤风险事件列表
 * @param {any} followMark.value - 主动管理的风险
 * @returns {void}
 */
export default followMark => {
    // 获取单例实例
    const singletonInstance = DockSingleton.getInstance();
    // 保存原始的获取对象风险事件列表方法
    const getObjectDanegerEventsListNative = singletonInstance.getObjectDanegerEventsList;

    // 重写单例中的获取对象风险事件列表方法，添加主动管理的风险过滤逻辑
    singletonInstance.getObjectDanegerEventsList = id => {
        const arr = getObjectDanegerEventsListNative(id);
        // 如果 followMark 有值，则过滤出与 followMark 匹配的风险事件，否则返回所有风险事件
        // c. 未配置“主动管理”，但风险事件状态 = 发生/推测发生/潜在风险的风险事件实例 https://shimo.im/docs/47kgMawmplHy203V
        if (followMark.value) {
            return arr.filter(item => item.followMark === followMark.value || isExceptionOrPOTENTIAL(item.status));
        }
        return arr;
    };

    // 在组件卸载前恢复原始方法
    onBeforeUnmount(() => {
        singletonInstance.getObjectDanegerEventsList = getObjectDanegerEventsListNative;
    });
};
