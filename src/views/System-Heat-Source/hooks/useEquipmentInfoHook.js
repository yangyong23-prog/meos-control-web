import i18n from '@/localization';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import dataDockHandling from '@/hooks/dataDockHandling';
import { iterateObjct4InstanceInfo } from '@/utils';
import dayjs from 'dayjs';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import useLoading from '@/hooks/useLoading';
import DockSingleton from '@/hooks/responsiveDock';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { uniq } from 'lodash';
import { systemIdKey } from './useBaseHook';

import { getForceControlStatus, listInfoCodeConfigsByObjectId } from '@/apis/ACAH';

export const openSetFormKey = Symbol('openSetFormKey');
export const forcedModelKey = Symbol('forcedModelKey');
export const activeSetFormDataKey = Symbol('activeSetFormDataKey');
export const useEquipmentInfoHook = (props, emits) => {
    const { getIotData, setObject2RelatedObject } = DockSingleton.getInstance();
    const { cancelQuest, cancelToken } = UseCancelTokenHooks();
    const commonDrawerRoot = inject(commonDrawerRootContextKey);
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
    const forcedModel = ref('uncheck');
    const equipmentInfo = ref({});
    const setFormBtn = ref(null);
    const activeSetFormData = ref({});
    const isOpenSetForm = ref(false);
    const systemId = inject(systemIdKey);
    const closeSetForm = () => {
        isOpenSetForm.value = false;
        activeSetFormData.value = null;
        setFormBtn.value = null;
    };
    const openSetForm = (e, data) => {
        if (isOpenSetForm.value) {
            isOpenSetForm.value = false;
        }
        const iotData = getIotData(data.id, data.infoCode);
        data.time = iotData?.additionalMapValue?.recoveryDateTime || '';
        setFormBtn.value = e.target;
        activeSetFormData.value = structuredClone(data);
        nextTick(() => {
            isOpenSetForm.value = true;
        });
    };
    const getConfigList = async () => {
        cancelQuest();
        return await loadDynaDataWithIotHandling(
            {
                runningMonitorType: props.runningMonitorType,
                objectIds: [props.selectObj.id],
                templateType: DETAIL
            },
            listInfoCodeConfigsByObjectId,
            { cancelToken: cancelToken() }
        );
    };
    const fetchEquipmentInfo = async (type = true) => {
        try {
            type && openLoading();
            const res = await getConfigList();
            // 按需订阅时收集sse订阅参数
            if (commonDrawerRoot?.props.isSubscriptOnDemand && type) {
                const { classCodeIds } = iterateObjct4InstanceInfo(res.data);
                for (const key in classCodeIds) {
                    if (Object.prototype.hasOwnProperty.call(classCodeIds, key)) {
                        classCodeIds[key] = uniq(classCodeIds[key]);
                    }
                }
                commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
            }
            const config = res.data.find(item => item.id === props.selectObj.id) || {};
            const fans = config.coolingTowerFanInfo?.relInfoCodeConfigs?.find(item => item.infoCode === 'relCoolingTowerFanInfo')?.dataValue || [];
            const waters = config.electricallyOperatedOnOffWaterValveInfo?.relInfoCodeConfigs?.find(item => item.infoCode === 'relCoolingTowerFanInfo')?.dataValue || [];
            const ids = fans.map(item => item.id).concat(waters.map(item => item.id));
            // clearAllRelatedObjects([props.selectObj.id]);
            ids.forEach(id => {
                setObject2RelatedObject(props.selectObj.id, id);
            });
            config.fans = fans;
            config.waters = waters;
            equipmentInfo.value = config;
            emits('setRelEquipmentIds', ids);
            emits('detail-info-loaded', res.data?.[0] || {});
        } finally {
            closeLoading();
        }
    };

    const getForceControl = () => {
        getForceControlStatus({ objectId: props.selectObj.id }).then(res => {
            if (res.code === SUCCESSCODE) {
                forcedModel.value = res.data.status === 'OPEN' ? 'checked' : 'uncheck';
            }
        });
    };

    const init = () => {
        if (props.selectObj?.id) {
            getForceControl();
            fetchEquipmentInfo();
        }
    };
    onMounted(() => {
        init();
    });
    watch(
        () => props.selectObj.id,
        () => {
            init();
            closeSetForm();
        }
    );
    provide(openSetFormKey, openSetForm);
    provide(forcedModelKey, forcedModel);
    provide(activeSetFormDataKey, activeSetFormData);
    return {
        openSetForm,
        closeSetForm,
        equipmentInfo,
        isOpenSetForm,
        setFormBtn,
        activeSetFormData,
        fetchEquipmentInfo
    };
};
