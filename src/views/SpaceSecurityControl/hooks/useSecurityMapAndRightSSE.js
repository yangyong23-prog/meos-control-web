// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { isEmpty } from 'lodash';
import { mapAndRightSSEClientKey } from '../constants/injectKey';
import { DETAIL, GRID, MODEL_VIEW, RELATION_VIEW, TABLE_LIST } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, PAGE_BROADCAST } from '@/utils/SSEEventTypes';

export default (headerModelView, currentFloorObj, mapClassCodeIds) => {
    const { base } = useStore();
    const { projectId } = base;
    const { sseClient: mapAndRightSSEClient, setSSEClientOption } = useSinglePOSTSSEClient('SECURITY');
    const setMapAndRightSSEClientOption = (instanceId, instanceType, eventType) => {
        if (isEmpty(mapClassCodeIds.value)) {
            return;
        }

        let eventParamMap = {
            // INFO_CODE_CONFIG_EVENT: { templateType: MODEL_VIEW }
        };
        // 云端订阅需传eventParamMap
        if (!isEdge()) {
            eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [GRID, MODEL_VIEW, RELATION_VIEW, DETAIL, TABLE_LIST] };
        }
        const hasEventParamMap = Object.keys(eventParamMap)?.length;
        setSSEClientOption({
            subscribeType: 'SECURITY',
            instanceId,
            instanceType,
            eventType,
            ...(hasEventParamMap ? { eventParamMap } : {}),
            claasCode2objectIds: mapClassCodeIds.value
        });
    };

    // 左侧地图，右侧对象详情、异常事件等
    // TODO ？？'SECURITY_MODEL_VIEW', 'INFO_CODE_CONFIG_BATCH'
    const mapEventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE];
    const rightEventType = [ABNORMAL_EVENT, PAGE_BROADCAST];

    // 监听重联逻辑
    // 因为是v-show，所以切换网格图视角，不监听
    // 根据当前是项目，楼层视角监听
    // mapClassCodeIds 全量传入，因为切换楼层 SSE 之前推送的楼层数据可能丢失
    watch(
        [currentFloorObj, mapClassCodeIds],
        () => {
            let instanceType = 'PROJECT',
                instanceId = projectId,
                eventType;

            if (currentFloorObj?.value?.id) {
                instanceType = 'FLOOR';
                instanceId = currentFloorObj.value.id;
                // setMapAndRightSSEClientOption(currentFloorObj.value.id, 'FLOOR');
            }
            eventType = [...mapEventType, ...rightEventType];
            setMapAndRightSSEClientOption(instanceId, instanceType, eventType);
        },
        {
            immediate: true
        }
    );

    provide(mapAndRightSSEClientKey, mapAndRightSSEClient);
    return {
        mapAndRightSSEClient,
        setMapAndRightSSEClientOption
    };
};
