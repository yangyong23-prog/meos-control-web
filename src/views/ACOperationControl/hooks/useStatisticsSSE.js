// @ts-ignore
import i18n from '@/localization';
// 统计类型sse 定制接口
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';
import { AIR_TERMINAL } from '@/utils/globalVariables';

export const statisticsSSEInjectKey = Symbol('statisticsSSEInjectKey');

export default (headerModelView, currentFloorObj) => {
    const store = useStore();
    const { projectId } = store.base;
    let currentInstanceId = null;

    // 左侧地图，右侧统计等
    const rightEventType = ['BDTP_EQUIPMENT_STATUS_STATISTICS'];
    const { sseClient: statisticsSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(AIR_TERMINAL);
    const setStatisticsSSEClientOption = (instanceId, instanceType, eventType) => {
        if (currentInstanceId === instanceId) {
            return;
        }
        currentInstanceId = instanceId;
        setSSEClientOption({
            subscribeType: AIR_TERMINAL,
            instanceId,
            instanceType,
            eventType
        });
    };

    // 监听重联逻辑
    // 如果是网格图视角，监听项目级，且不监听地图推送类型
    // 若是模型地图视角，根据当前是项目，楼层视角监听
    watch(
        [headerModelView, currentFloorObj],
        () => {
            let instanceType = 'PROJECT',
                instanceId = projectId;
            if (headerModelView.value === 'model' && currentFloorObj?.value?.id) {
                instanceType = 'FLOOR';
                instanceId = currentFloorObj.value.id;
            }
            setStatisticsSSEClientOption(instanceId, instanceType, rightEventType);
        },
        {
            immediate: true
        }
    );

    provide(statisticsSSEInjectKey, statisticsSSEClient);
    return {
        statisticsSSEClient,
        setStatisticsSSEClientOption
    };
};
