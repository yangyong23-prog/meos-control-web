// @ts-ignore
import i18n from '@/localization';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import dataDockHandling from '@/hooks/dataDockHandling';
import { iterateObjct4InstanceInfo } from '@/utils';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import useLoading from '@/hooks/useLoading';
import { uniq } from 'lodash';
import DockSingleton from '@/hooks/responsiveDock';
import { DETAIL } from '@/utils/globalVariables';

export const useEquipmentInfoHook = (props, emits) => {
    const fetchAbortController = ref();
    const commonDrawerRoot = inject(commonDrawerRootContextKey);
    const { setObject2RelatedObject, clearAllRelatedObjects } = DockSingleton.getInstance();
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { openLoading, closeLoading } = useLoading(
        'm-drawer-container-content',
        '#FFFFFF',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const equipmentInfo = ref({});

    const getConfigList = async () => {
        fetchAbortController?.value?.abort?.();
        fetchAbortController.value = new AbortController();
        const res = await loadDynaDataWithIotHandling(
            {
                runningMonitorType: props.runningMonitorType,
                objectIds: [props.selectObj.id],
                templateType: DETAIL
            },
            listInfoCodeConfigsByObjectIdCommon,
            fetchAbortController.value?.signal
        );
        return res;
    };
    const fetchEquipmentInfo = async (type = true) => {
        try {
            type && openLoading();
            const res = await getConfigList();
            // 按需订阅时收集sse订阅参数
            if (commonDrawerRoot?.props.isSubscriptOnDemand && type) {
                const { classCodeIds } = iterateObjct4InstanceInfo(res?.data || {});
                for (const key in classCodeIds) {
                    if (Object.prototype.hasOwnProperty.call(classCodeIds, key)) {
                        classCodeIds[key] = uniq(classCodeIds[key]);
                    }
                }
                commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
            }
            const config = res.data.find(item => item.id === props.selectObj.id) || {};

            // 冷却塔控制单元下的冷却塔风机、电动通断水阀异常事件
            const fans = config.coolingTowerFanInfo?.relInfoCodeConfigs?.find(item => item.infoCode === 'relCoolingTowerFanInfo')?.dataValue || [];
            const waters = config.electricallyOperatedOnOffWaterValveInfo?.relInfoCodeConfigs?.find(item => item.infoCode === 'relCoolingTowerFanInfo')?.dataValue || [];
            const ids = fans.map(item => item.id).concat(waters.map(item => item.id));
            config.fans = fans;
            config.waters = waters;
            equipmentInfo.value = config;
            clearAllRelatedObjects([props.selectObj.id]);
            ids.forEach(id => {
                setObject2RelatedObject(props.selectObj.id, id);
            });

            emits('setRelEquipmentIds', ids);
        } finally {
            closeLoading();
        }
    };

    watch(
        () => props.selectObj.id,
        curId => {
            if (curId) {
                fetchEquipmentInfo();
            }
        },
        {
            immediate: true
        }
    );

    onUnmounted(() => {
        fetchAbortController.value = null;
    });
    return {
        equipmentInfo,
        fetchEquipmentInfo
    };
};
