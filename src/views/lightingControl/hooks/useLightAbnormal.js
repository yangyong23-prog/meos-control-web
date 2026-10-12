import { provide } from 'vue';
import useAbnormalData from '@/views/Common/AbnormalListPlus/useAbnormalData';
import useStore from '@/store';
import { getLightAbnormalList } from '@/apis/lightingControl';

import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
const { base } = useStore();
const { projectId } = base || {};
export default (spaceSSEClient, findEquipmentIdAndSpaceIdInFloor, loadingSpaceData, isIndoorOutdoor, curFloorId, templateType, callToggleWidth, headerModelView) => {
    if (isIndoorOutdoor.value) {
        const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
            sseClient: spaceSSEClient,
            objectIds: findEquipmentIdAndSpaceIdInFloor
        });
        watch(
            () => [findEquipmentIdAndSpaceIdInFloor.value, loadingSpaceData.value],
            async () => {
                let _t = null;
                if (!loadingSpaceData.value) {
                    const params = {
                        projectId,
                        instanceIds: findEquipmentIdAndSpaceIdInFloor.value,
                        runningMonitorType: 'LIGHTING'
                    };
                    await onQueryAbnormalEventList(findEquipmentIdAndSpaceIdInFloor.value.length ? params : null);
                    if (!curFloorId.value && headerModelView.value !== 'model') {
                        nextTick(() => {
                            clearTimeout(_t);
                            _t = setTimeout(() => {
                                console.log(headerModelView);
                                callToggleWidth(abnormalEventList.value?.length > 0);
                            }, 1000);
                        });
                    }
                }
            },
            { deep: true }
        );
        provide('abnormalEventListLoading', abnormalEventListLoading);
        provide('abnormalEventListUpdateTime', abnormalEventListUpdateTime);
        provide('abnormalEventListLoadedTime', abnormalEventListLoadedTime);
        provide('abnormalEventList', abnormalEventList);

        return { abnormalEventList };
    } else {
        const queryData = ref(null);

        watchEffect(() => {
            if (!templateType.value) {
                queryData.value = null;
            } else {
                queryData.value = {
                    instanceId: projectId,
                    instanceType: 'PROJECT',
                    projectId,
                    demandTemplateType: templateType.value
                };
            }
        });
        const { abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList, abnormalEventListLoadedTime } = useAbnormalData(queryData, getLightAbnormalList);
        provide('abnormalEventListLoading', abnormalEventListLoading);
        provide('abnormalEventListUpdateTime', abnormalEventListUpdateTime);
        provide('abnormalEventListLoadedTime', abnormalEventListLoadedTime);
        provide('abnormalEventList', abnormalEventList);
        return { abnormalEventList };
    }
};
