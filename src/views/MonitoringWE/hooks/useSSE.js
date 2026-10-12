import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { RELATION_VIEW } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
export default () => {
    const { base } = useStore();
    const equipmentSSEClientEventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE, ABNORMAL_EVENT];
    const { sseClient: equipmentSSEClient, setSSEClientOption } = useSinglePOSTSSEClient('SEWAGE');
    const setEquipmentSSEClientOption = (claasCode2objectIds, subscribeType) => {
        setSSEClientOption({
            subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: equipmentSSEClientEventTypes,
            eventParamMap: {
                CLOUD_IOT_DATA_CHANGE: {
                    templateType: RELATION_VIEW
                }
            },
            claasCode2objectIds
        });
    };
    useResponsiveDockSSEHandle(equipmentSSEClient, equipmentSSEClientEventTypes);
    return {
        equipmentSSEClient,
        setEquipmentSSEClientOption,
        equipmentSSEClientEventTypes
    };
};
