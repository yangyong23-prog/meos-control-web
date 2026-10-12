import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import useStore from '@/store';

import { systemIdKey, viewModeKey, currentEquipmentIdsKey, currentSceneIdsKey, isAbnormalIdsAllLoadedKey } from './useBaseHook';
import { useAbnormalSSEHook } from './useSSEHook';
import { VIEW_MODE, RUNNING_MONITOR_TYPE, MAJOR_CODE } from '../constant/variable';

export const abnormalEventListKey = Symbol('abnormalEventListKey'); // 异常事件列表
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); // 异常事件列表加载状态
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); // 异常事件列表更新时间
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey'); // 异常事件列表加载完成时间
export const onQueryAbnormalEventListKey = Symbol('onQueryAbnormalEventListKey'); // 查询异常事件列表方法

export default function useAbnormalHook() {
    const systemId = inject(systemIdKey);
    const currentSceneIds = inject(currentSceneIdsKey);
    const currentEquipmentIds = inject(currentEquipmentIdsKey);
    const isAbnormalIdsAllLoaded = inject(isAbnormalIdsAllLoadedKey);
    const viewMode = inject(viewModeKey);
    // 全局store
    const { base } = useStore();
    const { projectId } = base || {};
    // 计算当前异常监控对象ID列表
    const abnormalIds = computed(() => {
        const res = [systemId.value, ...currentEquipmentIds.value];
        const noRepeatRes = [...new Set(res)];
        return noRepeatRes?.filter(s => !!s);
    });

    // 异常事件SSE客户端
    const { abnormalSSEClient, setAbnormalSSEClientOption } = useAbnormalSSEHook(MAJOR_CODE);
    // 异常事件相关数据
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        sseClient: abnormalSSEClient,
        objectIds: abnormalIds
    });

    const onQueryAbnormalEventListFun = () => {
        if (abnormalIds.value?.length && RUNNING_MONITOR_TYPE) {
            onQueryAbnormalEventList(
                {
                    projectId: projectId,
                    instanceIds: abnormalIds.value,
                    // 提测时切 qa 环境空调冷源：'AIR_CONDITIONING_COLD_SOURCE'
                    runningMonitorType: RUNNING_MONITOR_TYPE
                },
                true
            );
        } else {
            abnormalEventListLoading.value = false;
            abnormalEventListLoadedTime.value = new Date().toISOString();
        }
    };
    // 监听场景ID和systemId变化，设置异常事件SSE推送
    watch([currentSceneIds, systemId], () => {
        if (Object.values(currentSceneIds.value).length || systemId.value) {
            if (viewMode.value === VIEW_MODE.GRAPH_CODE) {
                if (!isAbnormalIdsAllLoaded.system) {
                    return;
                }
                setAbnormalSSEClientOption(currentSceneIds.value);
                onQueryAbnormalEventListFun();
            } else {
                if (!isAbnormalIdsAllLoaded.model) {
                    return;
                }
                setAbnormalSSEClientOption(currentSceneIds.value);
                onQueryAbnormalEventListFun();
            }
        } else {
            abnormalSSEClient.close();
        }
    });

    provide(abnormalEventListKey, abnormalEventList);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    provide(onQueryAbnormalEventListKey, onQueryAbnormalEventListFun);
    return {
        abnormalEventList,
        abnormalEventListLoading,
        abnormalEventListUpdateTime,
        onQueryAbnormalEventListFun
    };
}
