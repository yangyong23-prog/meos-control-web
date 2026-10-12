import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import dataDockHandling from '@/hooks/dataDockHandling';
import { RUNNING_MONITOR_TYPE } from '../variables';
import { isEqual } from 'lodash';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import useStore from '@/store';
import { iterateObjct4InstanceInfo } from '@/utils/index';

export default loopIdMapInfoConfigs => {
    const { base } = useStore();
    const { loadDynaDataWithIotHandling, writeDataToResponsiveDock } = dataDockHandling();
    let fetchAbortController = null;

    // sse
    const eventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE, RELEASE_INTERVENTION];
    const { sseClient: dashboardSSEClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const config = window[GET_MENU_CONFIG]();
    const setLoopsSSEClientOption = claasCode2objectIds => {
        const paramsMap = {
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: [DETAIL]
            }
        };

        setSSEClientOption({
            subscribeType: config.SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: eventTypes.join('--')
        });
    };
    useResponsiveDockSSEHandle(dashboardSSEClient, eventTypes);
    const loadLoopsInfoConfig = async objectIds => {
        fetchAbortController?.abort();
        fetchAbortController = new AbortController();
        const params = {
            templateType: DETAIL,
            runningMonitorType: RUNNING_MONITOR_TYPE,
            objectIds,
            filterGroups: [
                {
                    groupCode: 'equipStatus'
                },
                {
                    groupCode: 'controlledParameterSet',
                    deepQuery: true
                },
                {
                    groupCode: 'runningParameter',
                    infoCodes: ['i']
                }
            ]
        };
        try {
            const { code, data } = await loadDynaDataWithIotHandling(params, listInfoCodeConfigsByObjectIdCommon, fetchAbortController?.signal);
            if (code === SUCCESSCODE && data?.length > 0) {
                writeDataToResponsiveDock(data);
                const { classCodeIds } = iterateObjct4InstanceInfo(data);
                setLoopsSSEClientOption(classCodeIds);
                data.forEach(obj => {
                    let equipStatus = null,
                        controlledParameterSet = null,
                        runningParameter = null,
                        controlledParameterSetCondition = null;
                    obj.relInfoCodeGroupConfigs?.forEach(g => {
                        if (g.groupCode === 'equipStatus') {
                            equipStatus = g.relInfoCodeConfigs;
                        } else if (g.groupCode === 'controlledParameterSet') {
                            controlledParameterSetCondition = g.groupChildren?.[0]?.relInfoCodeConfigs;
                            controlledParameterSet = g.relInfoCodeConfigs;
                        } else if (g.groupCode === 'runningParameter') {
                            runningParameter = g.relInfoCodeConfigs;
                        }
                    });
                    loopIdMapInfoConfigs.value[obj.id] = { equipStatus, runningParameter, controlledParameterSet, controlledParameterSetCondition };
                });
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };
    const getInfoCodeConfigByObjectId = loopList => {
        const objectIds = [...loopList.value.values()]?.map(obj => obj.id);
        objectIds?.length && loadLoopsInfoConfig(objectIds);
    };
    // watch(
    //     () => loopList.value,
    //     (newValue, oldValue) => {
    //         const newIds = newValue ? [...newValue.values()].map(obj => obj.id) : [];
    //         const oldIds = oldValue ? [...oldValue.values()].map(obj => obj.id) : [];
    //         if (isEqual(newIds, oldIds) && newValue?.length <= oldValue?.length) {
    //             return;
    //         }
    //         if (loopList.value) {
    //             const objectIds = [...loopList.value.values()]?.map(obj => obj.id);
    //             if (objectIds?.length > 0) {
    //                 loadLoopsInfoConfig(objectIds);
    //             }
    //         }
    //     },
    //     { immediate: true }
    // );

    return { getInfoCodeConfigByObjectId };
};
