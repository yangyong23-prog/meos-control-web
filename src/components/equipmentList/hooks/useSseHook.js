import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';
import { commonPropsKey } from './useBaseHook';

export const useSseHook = () => {
    const props = inject(commonPropsKey);
    const { base } = useStore();
    const eventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE, RELEASE_INTERVENTION];
    // 开启每小时主动轮换。
    const { sseClient: equipmentListSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(undefined, undefined, true);
    const setEquipmentListSSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes = {}) => {
        const paramsMap = {
            CLOUD_IOT_DATA_CHANGE: {
                objectIdAndInfoCodes,
                templateTypes: ['CUSTOM_IOT']
            }
        };
        setSSEClientOption({
            subscribeType: props.subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: eventTypes.join('--') + '--' + 'EQUIPMENT_LIST'
        });
    };
    useResponsiveDockSSEHandle(equipmentListSSEClient, eventTypes);
    return {
        equipmentListSSEClient,
        setEquipmentListSSEClientOption
    };
};
