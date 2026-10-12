// @ts-ignore
import i18n from '@/localization';
import { listInfoCodeConfigsByObject } from '@/apis/MonitoringWE';
import baseStore from '@/store/baseStore';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { RUNNING_MONITOR_TYPE } from '../constant/index';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import useLoading from '@/hooks/useLoading';
import { inFloorsKey } from './useDrawerCommon';
export default () => {
    const { openLoading, closeLoading } = useLoading('instance-basic-info-wrap', '#fff', 'ball');

    const queryDyncTreeToken = UseCancelTokenHooks();
    const basicInfoList = ref([]); // 基础信息
    const isLoading = ref(true);
    const inFloors = inject(inFloorsKey);
    const queryEquipmentInfo = id => {
        isLoading.value = true;
        openLoading();
        basicInfoList.value = [];
        inFloors.value = {};
        queryDyncTreeToken.cancelQuest();
        const params = {
            projectId: baseStore().projectId,
            runningMonitorType: RUNNING_MONITOR_TYPE,
            objectIds: id,
            templateCode: DETAIL,
            groupCodes: ['basicInfo', 'outsideFirm', 'inFloor']
        };
        listInfoCodeConfigsByObject(params, { cancelToken: queryDyncTreeToken.cancelToken() })
            .then(res => {
                if (res) {
                    const { code, data } = res;
                    if (code === SUCCESSCODE && data) {
                        isLoading.value = false;
                        closeLoading();
                        data[0]?.relInfoCodeGroupConfigs?.map(item => {
                            if (['basicInfo', 'outsideFirm'].includes(item.groupCode)) {
                                basicInfoList.value.push(item);
                            } else if (item.groupCode === 'inFloor') {
                                inFloors.value = item.relInfoCodeConfigs?.[0]?.dataValue?.[0] || {};
                            }
                        });
                    }
                }
            })
            .finally(() => {
                closeLoading();
                isLoading.value = false;
            });
    };
    return {
        queryEquipmentInfo,
        basicInfoList,
        isLoading
    };
};
