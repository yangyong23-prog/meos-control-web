// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';
import useStore from '@/store';
import { onUnmounted } from 'vue';
import { isEdge } from '@/utils/envUtils';
import { isEmpty } from 'lodash';
import { parkingCommonSSEClientKey } from '../constant/injectKey';
import { MODEL_VIEW } from '@/utils/globalVariables';

export default (currentFloorObj, allInstanceClassCodeMap) => {
    const store = useStore();
    const { projectId } = store.base;

    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient('PARKING');
    const eventType = [
        isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE,
        RELEASE_INTERVENTION,
        INFO_CODE_CONFIG_EVENT,
        ABNORMAL_EVENT,
        'PARKING_STATISTICS',
        'PARKING_EQUIP_STATISTICS',
        'FLOOR_PARKING_SPACE_STATISTICS',
        'PARKING_EQUIP_STATISTICS',
        'PARKING_SPACE_GIRD_STATISTICS'
    ];

    // 项目视角为'PROJECT', 建筑视角为'BUILDING', 楼层视角为'FLOOR'
    const setCommonSSEClientOption = (instanceId, instanceType, classCodeToObjectIds) => {
        if (isEmpty(classCodeToObjectIds)) {
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
            instanceId: instanceId,
            instanceType: instanceType,
            eventType: eventType,
            ...(hasEventParamMap ? { eventParamMap } : {}),
            claasCode2objectIds: classCodeToObjectIds
        });
    };

    const computedClassCodeToObjectIds = computed(() => {
        const classCodeToObjectIds = {};
        allInstanceClassCodeMap.value.forEach((value, key) => {
            const curTypeArr = value
                .filter(item => {
                    if (currentFloorObj?.value?.floorId) {
                        return item.floorId === currentFloorObj.value.floorId;
                    }
                    return true;
                })
                ?.map(item => item.id);
            if (curTypeArr.length) {
                classCodeToObjectIds[key] = curTypeArr;
            }
        });
        return classCodeToObjectIds;
    });

    watch(
        [() => currentFloorObj?.value?.floorId, () => computedClassCodeToObjectIds.value],
        ([curFloorId, curMapIds]) => {
            if (curFloorId) {
                setCommonSSEClientOption(curFloorId, 'FLOOR', curMapIds);
            } else {
                setCommonSSEClientOption(projectId, 'PROJECT', curMapIds);
            }
        },
        {
            immediate: true
        }
    );

    onUnmounted(() => {
        sseClient.destory();
    });

    provide(parkingCommonSSEClientKey, sseClient);

    return {
        sseClient,
        setSSEClientOption
    };
};
