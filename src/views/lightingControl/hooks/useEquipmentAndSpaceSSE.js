// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { isEdge } from '@/utils/envUtils';
import useStore from '@/store';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
export const setEquipmentAndSpaceSSEClientOptionKey = Symbol('setEquipmentAndSpaceSSEClientOptionKey');
export const equipmentAndSpaceSSEClientKey = Symbol('equipmentAndSpaceSSEClientKey');
export default () => {
    const { base } = useStore();
    // 空间 & 广播 sse 通道
    const { sseClient: equipmentAndSpaceSSEClient, setSSEClientOption } = useSinglePOSTSSEClient('LIGHT_MONITORING');
    const setEquipmentAndSpaceSSEClientOption = (claasCode2objectIds = {}) => {
        setSSEClientOption({
            subscribeType: 'LIGHT_MONITORING',
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE],
            claasCode2objectIds
        });
    };
    provide(setEquipmentAndSpaceSSEClientOptionKey, setEquipmentAndSpaceSSEClientOption);
    provide(equipmentAndSpaceSSEClientKey, equipmentAndSpaceSSEClient);
    return {
        setEquipmentAndSpaceSSEClientOption,
        equipmentAndSpaceSSEClient
    };
};
