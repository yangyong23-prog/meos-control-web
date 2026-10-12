// @ts-ignore
import i18n from '@/localization';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import { useAbnormalSSEHook } from './useAbnormalSSEHook';
import { systemIdKey, viewModeKey, currentEquipmentIdsKey, curSubGraphInfoKey, currentSceneIdsKey } from './useStateHook';
import { useRoute } from 'vue-router';
import { SYSTEM_CONFIGS } from '@/views/System/constant/config';
import { VIEWMODE } from '@/views/System/constant/variables';
import useStore from '@/store';
export const abnormalEventListKey = Symbol('abnormalEventListKey'); // 异常事件列表
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); // 异常事件列表加载状态
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); // 异常事件列表更新时间
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey'); // 异常事件列表加载完成时间
export const onQueryAbnormalEventListKey = Symbol('onQueryAbnormalEventListKey'); // 查询异常事件列表方法

export default function useAbnormalHook() {
    const systemId = inject(systemIdKey);
    const viewMode = inject(viewModeKey);
    const currentSceneIds = inject(currentSceneIdsKey);
    const currentEquipmentIds = inject(currentEquipmentIdsKey);
    const curSubGraphInfo = inject(curSubGraphInfoKey);
    const route = useRoute();
    // 当前专业
    const majorCode = route.params.majorCode.toUpperCase();
    const currentConfig = SYSTEM_CONFIGS[majorCode];
    // 全局store
    const { base } = useStore();
    const { projectId } = base || {};
    // 计算当前异常监控对象ID列表
    const abnormalIds = computed(() => {
        const res = [...(viewMode.value === VIEWMODE.MAPVIEW || curSubGraphInfo.value ? [] : [systemId.value]), ...currentEquipmentIds.value];
        return res?.filter(s => !!s);
    });

    // 异常事件SSE客户端
    const { abnormalSSEClient, setAbnormalSSEClientOption } = useAbnormalSSEHook();
    // 异常事件相关数据
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        sseClient: abnormalSSEClient,
        objectIds: abnormalIds
    });

    /**
     * 查询异常事件列表
     * @param {Array} ids - 设备ID数组
     */
    const onQueryAbnormalEventListFun = ids => {
        if (abnormalIds.value?.length && currentConfig?.RUNNING_MONITOR_TYPE) {
            onQueryAbnormalEventList(
                {
                    projectId: projectId,
                    instanceIds: abnormalIds.value,
                    runningMonitorType: currentConfig?.RUNNING_MONITOR_TYPE
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
            setAbnormalSSEClientOption(currentSceneIds.value);
        } else {
            abnormalSSEClient.close();
        }
    });
    // 监听设备ID映射变化，查询异常事件
    watch(
        currentEquipmentIds,
        () => {
            onQueryAbnormalEventListFun(currentEquipmentIds.value);
        },
        {
            deep: true,
            immediate: true
        }
    );
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
