import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import { Ref } from 'vue';
import { uniq } from 'lodash';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
export const useAbnormalEventHook = (data: { subscribeType: string; runningMonitorType: string }, systemId: Ref<string>, classCodeEquipIdsMap: Ref<Record<string, string[]>>) => {
    const equipmentIds = ref<string[]>([]);
    // 异常事件SSE客户端
    const { abnormalSSEClient, setAbnormalSSEClientOption, closeSSEClient } = useAbnormalSSEHook(data.subscribeType);
    const objectIds = computed(() => uniq([...equipmentIds.value]).filter(id => !!id));
    // 异常事件相关数据
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        customRequest: null,
        sseClient: abnormalSSEClient,
        objectIds: objectIds
    });
    const { base } = useStore();

    const getAbnormalEventList = async () => {
        if (objectIds.value.length) {
            try {
                await onQueryAbnormalEventList(
                    {
                        projectId: base.projectId,
                        instanceIds: objectIds.value,
                        runningMonitorType: data.runningMonitorType
                    },
                    true
                );
            } catch (error) {
                console.error('异常事件列表查询错误：', error);
            } finally {
                abnormalEventListLoading.value = false;
                abnormalEventListLoadedTime.value = new Date().toISOString();
            }
        } else {
            abnormalEventListLoadedTime.value = new Date().toISOString();
        }
    };
    useWatchWithCleanup(
        () => classCodeEquipIdsMap.value,
        () => {
            getAbnormalEventList();
            setAbnormalSSEClientOption(classCodeEquipIdsMap.value);
        }
    );
    onUnmounted(() => {
        closeSSEClient();
    });
    return {
        equipmentIds,
        abnormalEventList,
        abnormalEventListLoading,
        abnormalEventListUpdateTime,
        abnormalEventListLoadedTime,
        getAbnormalEventList
    };
};

export const useAbnormalSSEHook = (subscribeType: string) => {
    const { base } = useStore();
    const abnormalEventTypes = [ABNORMAL_EVENT];
    const { sseClient: abnormalSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(subscribeType);
    const setAbnormalSSEClientOption = (claasCode2objectIds: Record<string, string[]>) => {
        if (!subscribeType) {
            return;
        }
        const paramsMap = {};
        setSSEClientOption({
            subscribeType: subscribeType,
            eventParamMap: paramsMap,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: abnormalEventTypes,
            eventTypeParam: undefined,
            claasCode2objectIds,
            urlQuery: ABNORMAL_EVENT,
            demandTemplateType: undefined
        });
    };
    useResponsiveDockSSEHandle(abnormalSSEClient, abnormalEventTypes);
    const closeSSEClient = () => {
        abnormalSSEClient.setOptions();
    };
    return {
        abnormalSSEClient,
        setAbnormalSSEClientOption,
        closeSSEClient
    };
};
