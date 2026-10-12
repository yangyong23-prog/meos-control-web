// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { isEmpty } from 'lodash';
import { MODEL_VIEW } from '@/utils/globalVariables';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export default mapClassCodeIds => {
    const { base } = useStore();
    const { projectId } = base;
    const { sseClient: carNumberSSEClient, setSSEClientOption } = useSinglePOSTSSEClient('PARKING');

    const mapEventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE];

    const setCarNumberSSEClientOption = () => {
        if (isEmpty(mapClassCodeIds.value)) {
            return;
        }

        let eventParamMap = {
            // INFO_CODE_CONFIG_EVENT: { templateType: MODEL_VIEW }
        };
        // 云端订阅需传eventParamMap
        if (!isEdge()) {
            eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [MODEL_VIEW] };
        }
        const hasEventParamMap = Object.keys(eventParamMap)?.length;
        setSSEClientOption({
            subscribeType: 'PARKING',
            instanceId: projectId,
            instanceType: 'PROJECT',
            eventType: mapEventType,
            ...(hasEventParamMap ? { eventParamMap } : {}),
            claasCode2objectIds: mapClassCodeIds.value
        });
    };

    watch(
        [mapClassCodeIds],
        () => {
            setCarNumberSSEClientOption();
        },
        {
            immediate: true
        }
    );

    return {
        carNumberSSEClient,
        setCarNumberSSEClientOption
    };
};
