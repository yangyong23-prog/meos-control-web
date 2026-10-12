// @ts-ignore
import i18n from '@/localization';
import { getCheckStatus, getFormatDate } from '../utils';
import { $Message } from 'meri-plus';
import dayjs from 'dayjs';
import { changeManualAutoStatusByObjectIds } from '@/apis/LightingDetail';
import { changeManualAutoStatusByObjectId } from '@/apis/common';
import { isEdge } from '@/utils/envUtils';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { NEW_CONTROL_SYSTEM } from '../constants';
import { getDayjsTz } from '@/utils/globalVariables';

export default (props, emit) => {
    const clearChecked = inject('clearChecked');
    const popoverModalBG = inject('popoverModalBG');
    const modalType = ref(''); // 弹框类型 auto|manual|edit|set
    const textLoading = ref(false);
    const showError = ref(false); // 校验
    const pickerTimeError = ref(''); // 时间校验
    const areaValue = ref(''); // 原因
    const pickerTime = ref(getFormatDate(props?.data?.additionalMapValue?.recoveryDateTime, '')); // 截止时间绑定值
    const { controlFn, changeInfoCodeExpireTimeFn } = useGeneralControl();
    // 手自动修改接口确认
    const changeManualAutoStatus = async data => {
        let params = {
            objectIds: data.objectIds,
            model: data.model,
            objectType: data.objectType
        };
        // 手动修改校验
        if (params.model === 0) {
            showError.value = true;
            if (!pickerTime.value) {
                pickerTimeError.value = i18n.global.t('meos_control_web.input_required_check_error_4');
                return $Message.error({
                    title: i18n.global.t('meos_control_web.please_input_required')
                });
            } else {
                if (dayjs(pickerTime.value).format('YYYY-MM-DD HH:mm') <= getDayjsTz().format('YYYY-MM-DD HH:mm')) {
                    pickerTimeError.value = i18n.global.t('meos_control_web.date_check_error_1');
                    return $Message.error({
                        title: i18n.global.t('meos_control_web.please_input_required')
                    });
                } else {
                    pickerTimeError.value = '';
                }
            }
            if (!areaValue.value) {
                return $Message.error({
                    title: i18n.global.t('meos_control_web.please_input_required')
                });
            }
            params.operateReason = areaValue.value;
            params.expireTime = formatTime(pickerTime.value);
        }
        try {
            textLoading.value = true;
            let responseData;
            if (NEW_CONTROL_SYSTEM.includes(props.runningMonitorType)) {
                if (data.type === 'edit') {
                    await changeInfoCodeExpireTimeFn(
                        {
                            objectId: params.objectIds[0],
                            expireTime: params.expireTime,
                            content: params.operateReason,
                            infoCode: 'manualAutoSet'
                        },
                        res => {
                            responseData = res;
                        }
                    );
                } else {
                    await controlFn({
                        data: {
                            projectId: props.projectId,
                            objectIds: params.objectIds,
                            infoCode: 'manualAutoSet',
                            infoValue: params.model,
                            expireTime: params.expireTime,
                            content: params.operateReason,
                            oneClick: false
                        },
                        callback: res => {
                            responseData = res;
                        }
                    });
                }
            } else {
                responseData = await changeManualAutoStatusByObjectIds(params);
            }

            if (responseData.code === '00000') {
                $Message.success({
                    title: `${params.model === 0 ? i18n.global.t('meos_control_web.switch_manual_success') : i18n.global.t('meos_control_web.switch_auto_success')}`
                });
                // 批量开启关闭
                save();
            } else {
                $Message.error({
                    title: i18n.global.t('meos_control_web.failed_please_retry')
                });
            }
        } catch (err) {
            $Message.error({
                title: i18n.global.t('meos_control_web.failed_please_retry')
            });
        } finally {
            textLoading.value = false;
        }
    };

    const save = () => {
        closePop();
        emit('tableInit');
        clearChecked();
    };

    // 弹出全局弹框
    const showModal = type => {
        showError.value = false;
        modalType.value = type;
        popoverModalBG.value = true;
    };

    // 关闭全局弹框
    const closePop = () => {
        modalType.value = '';
        popoverModalBG.value = false;
    };

    const disabled = computed(() => props.disabled);

    // 手自动状态 0 手动 1 自动
    const model = computed(() => {
        return String(props?.data?.dataValue) || '';
    });

    // tips 提示内容
    const tipsContent = computed(() => {
        if (!isEdge()) return i18n.global.t('meos_control_web.cloud_platform_control_not_supported_please_use_edge');
        if (disabled.value) return i18n.global.t('meos_control_web.equipment_offline_local_no_control_dup');
        // 手动显示时间  手动model 是 0
        if (props.data?.infoCode === 'manualAutoSet' && model.value === '0' && props.data?.additionalMapValue?.recoveryDateTime)
            return i18n.global.t('meos_control_web.time_returns_auto', {
                time: getFormatDate(props.data?.additionalMapValue?.recoveryDateTime)
            });
        return '';
    });

    // 自动模式下的model
    const autoModel = computed(() => {
        return getCheckStatus(model.value);
    });

    // 手动模式下的model
    const manualModel = computed(() => {
        return getCheckStatus(model.value, 'manual');
    });

    //可选择日期
    const scopeTime = computed(() => {
        const dayjsTz = getDayjsTz();
        let bTime = dayjsTz.add(1, 'minute').format('YYYY.MM.DD HH:mm:ss');
        return bTime + '-3000.01.01';
    });

    //截止时间change
    const timeChange = value => {
        if (!value) {
            showError.value = true;
        }
    };

    // 截止时间传参转换
    const formatTime = timeStr => {
        const newString = timeStr.replaceAll('.', '').replaceAll(':', '').replaceAll(' ', '').replaceAll('-', '');
        return newString.length === 14 ? newString : newString + '00';
    };

    provide('textLoading', textLoading);
    provide('closePop', closePop);
    provide('changeManualAutoStatus', changeManualAutoStatus);
    provide('scopeTime', scopeTime);
    provide('showError', showError);
    provide('pickerTimeError', pickerTimeError);
    provide('timeChange', timeChange);
    provide('areaValue', areaValue);
    provide('pickerTime', pickerTime);

    return {
        model,
        disabled,
        modalType,
        autoModel,
        manualModel,
        tipsContent,
        save,
        showModal,
        closePop
    };
};
