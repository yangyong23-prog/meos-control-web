import { MMessageBox, $Message } from 'meri-plus';
import { removeInstanceConfig, cancelReferenceConfig } from '@/apis/DemandManagementHome';
import emitter from '@/utils/bus';
import { instanceTypeInjectKey, instanceIdInjectKey, templateIdInjectKey, selectModuleInfoInjectKey } from '../constant/injectKey';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';
export default ({ fetchConfigList }) => {
    const templateId = inject(templateIdInjectKey);
    const instanceType = inject(instanceTypeInjectKey);
    const instanceId = inject(instanceIdInjectKey);
    const selectModule = inject(selectModuleInfoInjectKey);
    const templateType = inject('templateType');

    const currentFloorId = computed(() => {
        let floorId;
        if (selectModule.value?.objType === OBJ_TYPE.SPACE) {
            floorId = selectModule.value?.floorId;
        }
        if (selectModule.value?.objType === OBJ_TYPE.FLOOR) {
            floorId = selectModule.value?.id;
        }
        return floorId;
    });

    const showCancelModal = ref(false);
    const cancelRadioOptions = ref([
        {
            label: i18n.global.t('meos_control_web.cancel_ref_keep_config'),
            value: 'RETAIN_CONFIG'
        },
        {
            label: i18n.global.t('meos_control_web.cancel_ref_clear_config'),
            value: 'DELETE_CONFIG'
        }
    ]);
    const cancelRadioVal = ref('RETAIN_CONFIG');
    const cancelRadioSubmitLoading = ref(false);

    const showClearModal = ref(false);
    const clearRadioOptions = ref([
        {
            label: i18n.global.t('meos_control_web.current_object'),
            value: 'CURRENT'
        },
        {
            label: i18n.global.t('meos_control_web.child_object'),
            value: 'CHILDREN'
        },
        {
            label: i18n.global.t('meos_control_web.current_and_sub_objects'),
            value: 'CURRENT_AND_CHILDREN'
        }
    ]);
    const clearRadioVal = ref('CURRENT');
    const clearRadioSubmitLoading = ref(false);

    // 取消引用
    const cancelRadioSubmit = async () => {
        const radioVal = cancelRadioVal.value;
        cancelRadioSubmitLoading.value = true;
        const params = {
            instanceType: instanceType.value,
            instanceId: instanceId.value,
            templateId: templateId.value,
            referenceType: radioVal
        };
        const res = await cancelReferenceConfig(params).finally(() => {
            cancelRadioSubmitLoading.value = false;
        });
        if (res?.code === '00000') {
            $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
            fetchConfigList?.value?.();
            if (templateType.value === 'AIRCONDITIONING') {
                emitter.emit('updateCustomConfigAndReference', { floorId: currentFloorId.value });
            } else {
                emitter.emit('refreshTree', { id: instanceId.value });
            }

            showCancelModal.value = false;
        } else {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
        }
    };

    // 非空间实例清除配置
    const clearRadioSubmit = async () => {
        const radioVal = clearRadioVal.value;
        clearRadioSubmitLoading.value = true;
        const params = {
            instanceType: instanceType.value,
            instanceId: instanceId.value,
            templateId: templateId.value,
            clearRange: radioVal
        };
        const res = await removeInstanceConfig(params).finally(() => {
            clearRadioSubmitLoading.value = false;
        });
        if (res?.code === '00000') {
            $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
            fetchConfigList?.value?.();
            if (templateType.value === 'AIRCONDITIONING') {
                emitter.emit('updateCustomConfigAndReference', { floorId: currentFloorId.value });
            } else {
                emitter.emit('refreshTree', { id: instanceId.value });
            }

            showClearModal.value = false;
        } else {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
        }
    };

    const onCancelReference = () => {
        console.log('取消引用');
        cancelRadioVal.value = 'RETAIN_CONFIG';
        showCancelModal.value = true;
    };

    // 清除配置入口
    const onClearConfig = computed(() => (isSpace, successMsg = i18n.global.t('common.operation_success'), reqConfig = {}) => {
        const params = { instanceType: instanceType.value, instanceId: instanceId.value, templateId: templateId.value, clearRange: 'CURRENT' };
        const { noConfirm, successCallback } = reqConfig || {};
        const goToRemove = async () => {
            const res = await removeInstanceConfig(params);
            if (res?.code === '00000') {
                $Message.success({ title: successMsg });
                successCallback?.();
                fetchConfigList?.value?.();
                if (templateType.value === 'AIRCONDITIONING') {
                    emitter.emit('updateCustomConfigAndReference', { floorId: currentFloorId.value });
                } else {
                    emitter.emit('refreshTree', { id: instanceId.value });
                }
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
            }
        };

        if (noConfirm) {
            return goToRemove();
        } else {
            if (isSpace) {
                MMessageBox({
                    type: 'danger',
                    customClass: 'customClearSpaceConfig',
                    title: `${i18n.global.t('meos_control_web.confirm_clear_configuration')}`,
                    confirmButtonText: i18n.global.t('meos_control_web.clear_and_inherit_parent'),
                    message: `${i18n.global.t('meos_control_web.clear_will_inherit_parent')}`
                })
                    .then(async () => {
                        await goToRemove();
                    })
                    .catch(() => {});
                return;
            } else {
                clearRadioVal.value = 'CURRENT';
                showClearModal.value = true;
            }
        }
    });

    return {
        showCancelModal,
        cancelRadioOptions,
        cancelRadioVal,
        cancelRadioSubmitLoading,
        showClearModal,
        clearRadioOptions,
        clearRadioVal,
        clearRadioSubmitLoading,
        cancelRadioSubmit,
        clearRadioSubmit,
        onCancelReference,
        onClearConfig
    };
};
