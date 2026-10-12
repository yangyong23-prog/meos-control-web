import i18n from '@/localization';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import dataDockHandling from '@/hooks/dataDockHandling';
import { iterateObjct4InstanceInfo } from '@/utils';
import InputSet from '../components/setForm/InputSet.vue';
import { ExpireTimeComponent, ReasonComponent } from './config';
import { MANUAL_AUTO_SET, EQUIPMENT_OPTIONS } from '../variables';
import RadioSet from '../components/setForm/RadioSet.vue';
import TextSet from '../components/setForm/TextSet.vue';
import { batchCommandSend, commandExecuteChangeManualAutoStatus, getForceControlStatus, listInfoCodeConfigsByObjectId } from '@/apis/ACAC';
import { systemIdKey } from './useBaseHook';
import dayjs from 'dayjs';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import useLoading from '@/hooks/useLoading';
import DockSingleton from '@/hooks/responsiveDock';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { OTHER_REASON } from '@/views/ACAC/variables';
import { uniq, uniqBy } from 'lodash';

export const openSetFormKey = Symbol('openSetFormKey');
export const forcedModelKey = Symbol('forcedModelKey');
export const activeSetFormDataKey = Symbol('activeSetFormDataKey');
export const useEquipmentInfoHook = (props, emits) => {
    const { getIotData, setObject2RelatedObject, clearAllRelatedObjects } = DockSingleton.getInstance();
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
    const identifyLocalOrRemote = (formItemList, dataValue, FormConfig) => {
        const info = {
            infoCode: activeSetFormData.value.infoCode,
            infoCodeName: activeSetFormData.value.infoCodeName
        };
        const reasonComponent = ReasonComponent();
        reasonComponent.options = EQUIPMENT_OPTIONS[info.infoCode] || [];
        const commonComponents = info.infoCode === MANUAL_AUTO_SET ? [ExpireTimeComponent(), reasonComponent] : [];
        const Config = {
            default: [
                {
                    ...info,
                    component: InputSet,
                    unit: activeSetFormData.value.unit
                },
                ...commonComponents
            ],
            0: [
                {
                    ...info,
                    component: RadioSet,
                    dataSource: activeSetFormData.value.dataSource,
                    defaultValue: dataValue
                },
                ...commonComponents
            ],
            1: [
                {
                    ...info,
                    component: RadioSet,
                    dataSource: activeSetFormData.value.dataSource,
                    defaultValue: dataValue
                },
                ...(info.infoCode === MANUAL_AUTO_SET
                    ? [
                          {
                              ...info,
                              component: TextSet,
                              defaultText: i18n.global.t('meos_control_web.switch_auto_mode_device_auto'),
                              style: 'background: var(--gray-50); border-radius: 4px;padding: 4px;color: var(--gray-600);'
                          }
                      ]
                    : [])
            ]
        };
        if (activeSetFormData.value.dataSource?.length) {
            FormConfig.value = {
                0: Config[0],
                1: Config[1]
            };
            activeSetFormData.value.dataSource.forEach((item, i) => {
                FormConfig.value[item.code] = Config[i] || Config[0];
            });
            console.log(FormConfig.value);
            formItemList.value = FormConfig.value[dataValue || '0'];
        } else {
            FormConfig.value = {
                default: Config.default
            };
            formItemList.value = FormConfig.value.default;
        }
    };
    const submit = async (params, btnLoading) => {
        const data = {
            objectIds: [activeSetFormData.value.id],
            systemId: systemId.value,
            expireTime: params.expireTime ? dayjs(params.expireTime).format('YYYY-MM-DD HH:mm:ss') : '',
            infoCode: activeSetFormData.value.infoCode,
            infoValue: params[activeSetFormData.value.infoCode],
            content: params.operateReason || (params.operateType === OTHER_REASON ? '' : params.operateType)
        };
        const fun = activeSetFormData.value.infoCode === MANUAL_AUTO_SET ? commandExecuteChangeManualAutoStatus : batchCommandSend;
        try {
            const res = await fun(data);
            if (res.code === SUCCESSCODE) {
                if (activeSetFormData.value.infoCode === MANUAL_AUTO_SET) {
                    fetchEquipmentInfo(false);
                }
                useSuccessMessage(i18n.global.t('common.save_success'));
            }
        } catch (error) {
            console.error(error);
        } finally {
            btnLoading.value = false;
            closeSetForm();
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
        submit,
        closeSetForm,
        equipmentInfo,
        isOpenSetForm,
        setFormBtn,
        activeSetFormData,
        fetchEquipmentInfo,
        identifyLocalOrRemote
    };
};
