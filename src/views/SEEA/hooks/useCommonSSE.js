// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT } from '@/utils/SSEEventTypes';
import { SUBSCRIBE_TYPE } from '../constants/index';
import { DETAIL } from '@/utils/globalVariables';
export const useCommonSSE = () => {
    const { base } = useStore();
    const eventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const setSEEASSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes = {}) => {
        const paramsMap = {
            CLOUD_IOT_DATA_CHANGE: {
                objectIdAndInfoCodes,
                templateTypes: ['CUSTOM_IOT']
            }
        };

        setSSEClientOption({
            subscribeType: SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: eventTypes.join('--') + '--' + 'SEEA'
        });
    };

    // 运行监控sse
    const opMonitorEventTypes = [INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE];
    const { sseClient: opMonitorSseClient, setSSEClientOption: _setOpMonitorSSEClientOption } = useSinglePOSTSSEClient();
    const setOpMonitorSSEClientOption = claasCode2objectIds => {
        const paramsMap = {
            [INFO_CODE_CONFIG_EVENT]: {
                templateType: DETAIL,
                groupCodes: ['cumulativeEnergy']
            },
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: [DETAIL]
            }
        };
        if (claasCode2objectIds) {
            _setOpMonitorSSEClientOption({
                subscribeType: SUBSCRIBE_TYPE,
                instanceId: base.projectId,
                instanceType: 'PROJECT',
                eventType: opMonitorEventTypes,
                eventParamMap: paramsMap,
                claasCode2objectIds,
                urlQuery: opMonitorEventTypes.join('--') + '--' + 'SEEA'
            });
        } else {
            opMonitorSseClient.setOptions();
        }
    };
    useResponsiveDockSSEHandle(sseClient, eventTypes);
    useResponsiveDockSSEHandle(opMonitorSseClient, opMonitorEventTypes);
    return {
        sseClient,
        setSEEASSEClientOption,
        setOpMonitorSSEClientOption
    };
};
