import i18n from '@/localization';
import { setOperatingParameters, coolWaterReturnTemp } from '@/apis/systemDiagram';
import { EMPTYTEXT, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage, useErrorMessage } from '@/utils/tools';
import emitter from '@/utils/bus';
import { isNil, toNumber } from 'lodash';
export default props => {
    const openLoading = inject('openLoading');
    const closeLoading = inject('closeLoading');
    // 系统id
    const systemId = inject('systemId', ref(''));
    const querySettingInfoCodeConfigByObjectIds = inject('querySettingInfoCodeConfigByObjectIds');
    const Mform = ref();
    const isInputChange = ref(true);
    // 切换手自动按钮
    const isChangeRadio = ref(true);

    // 初始的数据
    const defaultProps = JSON.parse(JSON.stringify(unref(props).currentInfoCodeObject));
    const params = ref({
        data: unref(props).currentInfoCodeObject.dataValue,
        coolWaterReturnTempMinValue: '22',
        heatDissipationTemperatureDifference: unref(props).currentInfoCodeObject?.extendSetting?.heatDissipationTemperatureDifference || '',
        reason: '',
        content: '',
        manualAutoSet: unref(props).currentInfoCodeObject?.extendSetting?.manualAutoSet || 0
    });
    if (props?.currentInfoCodeObject?.extendSetting?.coolWaterReturnTempMinValue) {
        params.value.coolWaterReturnTempMinValue = unref(props).currentInfoCodeObject?.extendSetting?.coolWaterReturnTempMinValue;
    }

    const beforeValue = ref('');
    if (props.currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet') {
        if (props.currentInfoCodeObject?.extendSetting?.coolWaterReturnTempMinValue || props.currentInfoCodeObject?.extendSetting?.coolWaterReturnTempMinValue === '0') {
            beforeValue.value = JSON.parse(JSON.stringify(props.currentInfoCodeObject?.extendSetting?.coolWaterReturnTempMinValue));
        } else {
            beforeValue.value = JSON.parse(JSON.stringify('22'));
        }
    }
    const changeInputNumber = (infoCode, e) => {
        const coolWaterReturnTempMinValueRef = ref('');
        const { currentInfoCodeObject } = props;
        const { extendSetting } = currentInfoCodeObject;
        if (extendSetting) {
            const { coolWaterReturnTempMinValue } = extendSetting;
            coolWaterReturnTempMinValueRef.value = coolWaterReturnTempMinValue;
        }
        if (infoCode === 'coolWaterReturnTempMinValue' && coolWaterReturnTempMinValueRef.value && coolWaterReturnTempMinValueRef.value.toFixed(1) === e) {
            isInputChange.value = true;
        } else {
            isInputChange.value = false;
        }
    };
    const disabled = computed(() => {
        let value = props.currentInfoCodeObject.dataValue,
            heatDissipationTemperatureDifference = props.currentInfoCodeObject?.extendSetting?.heatDissipationTemperatureDifference || '';
        if (value) {
            value = toNumber(value);
        }

        if (isNil(props.currentInfoCodeObject.dataValue) && (params.value.data === '' || params.value.data === 0)) {
            return true;
        }

        if (props.currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet') {
            if (props.currentInfoCodeObject?.extendSetting) {
                if (params.value.heatDissipationTemperatureDifference) {
                    if (heatDissipationTemperatureDifference === params.value.heatDissipationTemperatureDifference && value === params.value.data) {
                        return true;
                    }
                } else {
                    if (value === params.value.data) {
                        return true;
                    }
                }
            } else {
                if (value === params.value.data) {
                    return true;
                }
            }
        } else {
            if (value === params.value.data) {
                return true;
            }
        }
        return false;
    });
    const validateNumber = (rule, value, callback) => {
        if (value === null || value === '') {
            callback(new Error(EMPTYTEXT));
        } else {
            callback();
        }
    };
    const changeRadio = item => {
        params.value.modelRadio = item;
        if (defaultProps?.extendSetting) {
            if (defaultProps?.extendSetting?.manualAutoSet !== item) {
                isChangeRadio.value = false;
            } else {
                isChangeRadio.value = true;
            }
        } else {
            if (item === 1) {
                isChangeRadio.value = false;
            } else {
                isChangeRadio.value = true;
            }
        }
    };

    const rules = {
        modelRadio: [{ type: 'number', required: true, message: EMPTYTEXT, trigger: 'change' }],
        data: [{ required: true, validator: validateNumber, trigger: ['blur', 'change'] }],
        coolWaterReturnTempMinValue: [{ required: true, validator: validateNumber, trigger: ['blur', 'change'] }],
        heatDissipationTemperatureDifference: [{ required: true, validator: validateNumber, trigger: ['blur', 'change'] }]
    };
    const sumbit = () => {
        Mform.value.validate(valid => {
            if (valid) {
                updateRuningOperationFun();
            } else {
                useErrorMessage(i18n.global.t('meos_control_web.input_required_check_error_4'));
            }
        });
    };
    const updateRuningOperationFun = async () => {
        openLoading();
        let defaultParams = {
            value: params.value.data,
            content: params.value.reason === 'OTHER' ? params.value.content : params.value.reason,
            infoCode: props.currentInfoCodeObject.infoCode,
            beforeModify: props.currentInfoCodeObject.dataValue
        };
        if (props.currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet') {
            defaultParams.extendSetting = {
                manualAutoSet: params.value.manualAutoSet,
                heatDissipationTemperatureDifference: params.value.heatDissipationTemperatureDifference
            };
        }
        const data = {
            objectId: systemId.value,
            systemId: systemId.value,
            pointInfos: [defaultParams]
        };
        const responseData = await (props.currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet'
            ? coolWaterReturnTemp({
                  systemId: systemId.value,
                  content: params.value.reason === 'OTHER' ? params.value.content : params.value.reason,
                  beforeValue: params.value.manualAutoSet ? beforeValue?.value : params.value.data,
                  infoCode: props.currentInfoCodeObject.infoCode,
                  extendSetting: {
                      manualAutoSet: params.value.manualAutoSet,
                      coolWaterReturnTempMinValue: params.value.coolWaterReturnTempMinValue,
                      heatDissipationTemperatureDifference: params.value.heatDissipationTemperatureDifference
                  }
              })
            : setOperatingParameters(data));

        if (responseData.code === SUCCESSCODE) {
            useSuccessMessage(i18n.global.t('common.save_success'));
            emitter.emit('refreshNotify', 'query');
            params.value.reason = '';
            params.value.content = '';
            querySettingInfoCodeConfigByObjectIds();
        } else {
            params.value.data = '';
            closeLoading();
        }
    };
    watch(
        () => props?.currentInfoCodeObject,
        newUser => {
            params.value.data = toNumber(newUser.dataValue);
            params.value.manualAutoSet = newUser?.extendSetting ? newUser.extendSetting.manualAutoSet : 0;
            params.value.coolWaterReturnTempMinValue = newUser?.extendSetting?.coolWaterReturnTempMinValue || '22';
            params.value.heatDissipationTemperatureDifference = newUser?.extendSetting?.heatDissipationTemperatureDifference || '';
        },
        { deep: true, immediate: true }
    );
    provide('currentInfoCodeObject', unref(props).currentInfoCodeObject);
    provide('params', params);
    return { defaultProps, params, Mform, isChangeRadio, disabled, rules, isInputChange, sumbit, changeRadio, changeInputNumber };
};
