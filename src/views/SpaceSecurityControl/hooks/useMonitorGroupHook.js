import { queryObjectGroup } from '@/apis/SpaceSecurityControl';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';

export const currentGroupsInjectKey = Symbol('currentMonitorGroups');
export const otherGroupsInjectKey = Symbol('otherMonitorGroups');

export default useMonitorEditHook => {
    const currentMonitorGroups = ref([]);
    const otherMonitorGroups = ref([]);
    const loadingGroups = ref(false);
    const cancelToken = UseCancelTokenHooks();
    const queryGroups = async obj => {
        cancelToken.cancelQuest();
        if (loadingGroups.value) return;
        loadingGroups.value = true;
        try {
            currentMonitorGroups.value = [];
            otherMonitorGroups.value = [];
            const res = await queryObjectGroup(
                {
                    groupType: 'VEDIO_MONITORING'
                },
                {
                    cancelToken: cancelToken.cancelToken()
                }
            );
            if (res.code === SUCCESSCODE) {
                if (obj.floorId) {
                    res.data.forEach(item => {
                        item.camerasInCurrentFloor = 0;
                        item.objects.forEach(camera => {
                            if (camera.floorId === obj.floorId) {
                                item.camerasInCurrentFloor += 1;
                            }
                        });
                        if (item.camerasInCurrentFloor > 0) {
                            currentMonitorGroups.value.push(item);
                        } else {
                            otherMonitorGroups.value.push(item);
                        }
                    });
                } else {
                    currentMonitorGroups.value = res.data;
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            // console.log(loadingGroups.value);
            loadingGroups.value = false;
        }
    };

    provide(currentGroupsInjectKey, currentMonitorGroups);
    provide(otherGroupsInjectKey, otherMonitorGroups);
    return {
        currentMonitorGroups,
        loadingGroups,
        otherMonitorGroups,
        queryGroups
    };
};
