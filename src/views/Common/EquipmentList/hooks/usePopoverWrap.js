// @ts-ignore
import i18n from '@/localization';
import { batchSetOperatingParameters } from '@/apis/common';
import dayjs from 'dayjs';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { $Message } from 'meri-plus';
import { NEW_CONTROL_SYSTEM } from '@/views/Common/EquipmentList/constants';
import { getDayjsTz } from '@/utils/globalVariables';
export default (props, emit) => {
    const closePop = inject('closePop');
    const runningMonitorType = inject('runningMonitorType');
    const PopoverParams = ref({});
    const isLoading = ref(false); // 保存loading
    const { controlFn } = useGeneralControl();
    if (props.data) {
        PopoverParams.value = {
            ...props.data,
            manualAutoStatus: props?.manualAutoStatus,
            reason: '',
            dateTime: '',
            RadioError: '',
            dateTimeError: '',
            dataValueError: '',
            reasonError: ''
        };
    }

    const savePopover = () => {
        validate(PopoverParams.value);
    };

    //可选择日期
    const scopeTime = computed(() => {
        const dayjsTz = getDayjsTz();
        let bTime = dayjsTz.add(1, 'minute').format('YYYY.MM.DD HH:mm:ss');
        return bTime + '-3000.01.01';
    });

    // 验证弹框编辑内容
    const validate = data => {
        // 自动模式添加截止时间
        if (data?.manualAutoStatus === '1') {
            data.dateTime ? (data.dateTimeError = '') : (data.dateTimeError = i18n.global.t('meos_control_web.input_required_check_error_4'));
        }
        // 手动模式
        if (data.dataType === 'BOOLEAN') {
            // 布尔值类型只有备注
            data.reason ? (data.reasonError = '') : (data.reasonError = i18n.global.t('meos_control_web.input_required_check_error_4'));
            if (data.reasonError || (data?.manualAutoStatus === '1' && data.dateTimeError)) {
                $Message.error({
                    title: i18n.global.t('meos_control_web.please_input_required')
                });
                return;
            }
        } else {
            // 枚举和非枚举类型添加参数和备注
            data.dataValue || data.dataValue === 0 ? (data.dataValueError = '') : (data.dataValueError = i18n.global.t('meos_control_web.input_required_check_error_4'));
            data.reason ? (data.reasonError = '') : (data.reasonError = i18n.global.t('meos_control_web.input_required_check_error_4'));
            if (data.reasonError || data.dataValueError || (data.manualAutoStatus === '1' && data.dateTimeError)) {
                $Message.error({
                    title: i18n.global.t('meos_control_web.please_input_required')
                });
                return;
            }
        }
        // 时间过期校验
        if (dayjs(data.dateTime).format('YYYY-MM-DD HH:mm') <= getDayjsTz().format('YYYY-MM-DD HH:mm')) {
            data.dateTimeError = i18n.global.t('meos_control_web.date_check_error_1');
            return $Message.error({
                title: i18n.global.t('meos_control_web.please_input_required')
            });
        } else {
            data.dateTimeError = '';
        }
        changeBatchSetOperatingParameters();
    };

    // 截止时间传参转换
    const formatTime = timeStr => {
        const newString = timeStr.replaceAll('.', '').replaceAll(':', '').replaceAll(' ', '').replaceAll('-', '');
        return newString.length === 14 ? newString : newString + '00';
    };

    const save = () => {
        emit('save');
    };

    // 设置设定值
    const changeBatchSetOperatingParameters = async () => {
        console.log(props.dataValue, '---', props.projectId, '---', PopoverParams.value?.dataValue, '----');

        const params = {
            projectId: props.projectId,
            objectIds: props.objectIds,
            content: PopoverParams.value?.reason,
            infoCode: PopoverParams.value?.infoCode,
            infoValue:
                props.cellType === 'operate'
                    ? props.dataValue
                    : PopoverParams.value?.dataValue || PopoverParams.value?.dataValue === 0
                    ? PopoverParams.value?.dataValue
                    : props.dataValue
        };
        if (PopoverParams.value.dateTime) {
            params.expireTime = dayjs(PopoverParams.value?.dateTime).format('YYYYMMDDHHmmss');
        }
        try {
            isLoading.value = true;
            let responseData;
            if (NEW_CONTROL_SYSTEM.includes(runningMonitorType)) {
                await controlFn({
                    data: {
                        projectId: props.projectId,
                        objectIds: params.objectIds,
                        infoCode: params.infoCode,
                        infoValue: params.infoValue,
                        expireTime: params.expireTime,
                        content: params.content
                    },
                    callback: res => {
                        responseData = res;
                    }
                });
            } else {
                responseData = await batchSetOperatingParameters(params);
            }

            if (responseData.code === '00000') {
                isLoading.value = false;
                $Message.success({
                    title: `${i18n.global.t('common.operation_success')}`
                });
                save();
            }
        } catch (err) {
            isLoading.value = false;
            closePop?.();
        } finally {
            isLoading.value = false;
        }
    };

    return {
        PopoverParams,
        savePopover,
        isLoading,
        scopeTime
    };
};
