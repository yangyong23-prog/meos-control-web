// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { GRID } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, PAGE_BROADCAST } from '@/utils/SSEEventTypes';

export default () => {
    const { base } = useStore();
    // 空间 & 广播 sse 通道
    const spaceSSEClientEventTypes = [IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, PAGE_BROADCAST, ABNORMAL_EVENT];
    const { sseClient: spaceSSEClient, setSSEClientOption } = useSinglePOSTSSEClient('VENTILATION');
    const setSpaceSSEClientOption = claasCode2objectIds => {
        setSSEClientOption({
            subscribeType: 'VENTILATION',
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: spaceSSEClientEventTypes,
            eventParamMap: {
                INFO_CODE_CONFIG_EVENT: {
                    templateType: GRID
                }
            },
            claasCode2objectIds
        });
    };
    useResponsiveDockSSEHandle(spaceSSEClient, spaceSSEClientEventTypes);
    return {
        spaceSSEClient,
        setSpaceSSEClientOption,
        spaceSSEClientEventTypes
    };
};
