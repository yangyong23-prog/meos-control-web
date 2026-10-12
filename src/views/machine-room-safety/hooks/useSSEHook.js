// @ts-ignore
import i18n from '@/localization';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { RUNNING_MONITOR_TYPE } from '../variable';
import { isEdge } from '@/utils/envUtils';
import { DETAIL, GRID } from '@/utils/globalVariables';
import {
    ABNORMAL_EVENT,
    CLOUD_IOT_DATA_CHANGE,
    DANGER_EVENT,
    INFO_CODE_CONFIG_EVENT,
    IOT_DATA_CHANGE,
    RELEASE_INTERVENTION,
    DANGER_EVENT_MONITORING_SITUATION
} from '@/utils/SSEEventTypes';

export const SSEHook = initDangerEventIds => {
    // SSE
    const claasCode2objectIds = ref({});

    // SSE
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(RUNNING_MONITOR_TYPE);
    // 订阅事件类型
    const eventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, RELEASE_INTERVENTION, INFO_CODE_CONFIG_EVENT, DANGER_EVENT, DANGER_EVENT_MONITORING_SITUATION];
    const eventParamMap = { INFO_CODE_CONFIG_EVENT: { templateType: GRID } };
    if (!isEdge()) {
        eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateType: DETAIL };
    }
    useResponsiveDockSSEHandle(sseClient, eventType);

    watch([() => claasCode2objectIds.value, () => initDangerEventIds.value], () => {
        if (claasCode2objectIds.value) {
            console.log(claasCode2objectIds.value);

            if (initDangerEventIds.value?.length) {
                eventParamMap.DANGER_EVENT_MONITORING_SITUATION = initDangerEventIds.value;
            }

            setSSEClientOption({
                claasCode2objectIds: claasCode2objectIds.value,
                eventParamMap,
                eventType: [...eventType, ABNORMAL_EVENT]
            });
        }
    });

    return {
        claasCode2objectIds,
        sseClient,
        setSSEClientOption
    };
};
