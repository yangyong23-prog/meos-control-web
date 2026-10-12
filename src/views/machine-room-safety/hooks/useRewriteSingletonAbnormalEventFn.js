import DockSingleton from '@/hooks/responsiveDock';

export default () => {
    // 获取单例实例
    const singletonInstance = DockSingleton.getInstance();
    // 保存原始的获取对象异常事件列表方法
    const { getAbnormalEventsList: getAbnormalEventsListNative } = singletonInstance;

    // 重写单例中的获取对象异常事件列表方法
    singletonInstance.getAbnormalEventsList = ids => {
        const arr = getAbnormalEventsListNative(ids);

        const newArr = arr.filter(item => {
            const hasRisk = item?.relatedRiskEvents?.length;
            return hasRisk;
        });

        return newArr;
    };

    // 在组件卸载前恢复原始方法
    onBeforeUnmount(() => {
        singletonInstance.getAbnormalEventsList = getAbnormalEventsListNative;
    });
};
