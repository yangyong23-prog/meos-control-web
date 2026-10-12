// @ts-ignore
import i18n from '@/localization';
/**
 * 控制弹窗相关hook
 * 包含打开/关闭控制弹窗、批量控制、恢复时间、解除干预等表单逻辑
 * 提供表单数据、当前控制对象、提交方法等响应式数据和操作
 */

import { INFO, INTERVENTION_TIME, REASON } from '@/components/ObjectInfoComponents/ControlForm/config';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import { getNextFiveMinutePoint } from '@/utils/tools';
import dayjs from 'dayjs';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { ref } from 'vue';
import DockSingleton from '@/hooks/responsiveDock';

// 控制弹窗相关依赖注入key
export const isControlFormKey = Symbol('isOpenControlForm');
export const virtualControlFormRefKey = Symbol('virtualControlFormRefKey');
export const openBatchControlFormKey = Symbol('openBatchControlFormKey');
export const openControlFormKey = Symbol('openControlFormKey');
export const openRecoveryDateTimeControlFormKey = Symbol('openRecoveryDateTimeControlFormKey');
export const openReleaseInterventionControlFormKey = Symbol('openReleaseInterventionControlFormKey');
export const closeFormKey = Symbol('closeFormKey');
export const curControlInfoCodeKey = Symbol('curControlInfoCodeKey');
export const useControlHook = () => {
    const { getIotData } = DockSingleton.getInstance();

    // 控制弹窗是否打开
    const isOpenControlForm = ref(false);
    // 控制弹窗挂载的DOM节点
    const virtualControlFormRef = ref(null);
    // 控制弹窗表单项列表
    const controlFormFormList = ref([]);
    // 当前控制的infoCode对象
    const curInfoCode = ref({});
    // 控制相关方法
    const { controlFn, showErrorList, errorList } = useGeneralControl();

    /**
     * 打开单个设备控制弹窗
     * @param {Object} obj - 控制弹窗参数
     */
    const openControlForm = obj => {
        closeForm();
        const { el, dataValue, data, ids, valueName } = obj;
        curInfoCode.value = data;
        curInfoCode.value.dataValue = dataValue;
        curInfoCode.value.valueName = valueName;
        curInfoCode.value.ids = ids;
        emitter.emit(CLOSE_CONTROL_FORM);
        virtualControlFormRef.value = el;
        // 自动模式下特殊处理
        if (data.infoCode === 'manualAutoSet' && dataValue === '1') {
            controlFormFormList.value = [INFO(i18n.global.t('meos_control_web.confirm_switch_to_auto_dup'))];
            nextTick(() => {
                isOpenControlForm.value = true;
            });
            return;
        }
        // 当选择的设备包含“手自动状态manualAutoStatus=1 自动”才需要填写截止时间
        let hasManualAutoStatus1 = false;
        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            const a = getIotData(id, 'manualAutoStatus');
            if (a && a.dataValue === '1') {
                hasManualAutoStatus1 = true;
                break;
            }
        }
        // 默认弹窗内容
        controlFormFormList.value = [REASON()];
        if (data.infoCode === 'manualAutoSet' || hasManualAutoStatus1) {
            controlFormFormList.value.unshift(
                INTERVENTION_TIME(`${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(3, 'day').format('YYYY.MM.DD HH:mm:00')}`, {
                    infoCode: 'manualAutoSet',
                    dataValue: '1'
                })
            );
        }

        // 需要自定义组件时

        if (!dataValue) {
            const a = {
                name: data.infoCodeName,
                required: true,
                ...data
            };
            if (data?.dataSource?.length) {
                a.component = FormItemRadio;
            } else {
                a.component = FormItemInputNumber;
                a.componentAttrs = {
                    precision: data.scale || 1
                };
            }
            controlFormFormList.value.unshift(a);
        }
        console.log(controlFormFormList.value);

        nextTick(() => {
            isOpenControlForm.value = true;
        });
    };

    /**
     * 关闭弹窗并重置表单数据
     */
    const closeForm = () => {
        curInfoCode.value = {};
        virtualControlFormRef.value = null;
        isOpenControlForm.value = false;
        controlFormFormList.value = [];
    };

    /**
     * 处理控制弹窗提交
     * @param {Object} data - 表单数据
     * @param {Function} fn - 回调函数
     */
    const handleSubmit = async (data, fn) => {
        const params = {
            objectIds: curInfoCode.value.ids,
            infoCode: curInfoCode.value.infoCode,
            valueName: curInfoCode.value.valueName,
            infoValue: curInfoCode.value.dataValue || data[curInfoCode.value.infoCode],
            expireTime: data.expireTime ? dayjs(data.expireTime).format('YYYY-MM-DD HH:mm:ss') : '',
            content: data.content
        };
        controlFn({
            data: params,
            callback: res => callback(res, fn),
            needMessage: true
        });
    };

    /**
     * 控制提交回调，关闭弹窗并提示
     * @param {Object} res - 接口返回结果
     * @param {Function} fn - 回调函数
     */
    const callback = (res, fn) => {
        closeForm();
        fn();
    };

    // 返回响应式数据和操作方法
    return {
        isOpenControlForm,
        virtualControlFormRef,
        controlFormFormList,
        curInfoCode,
        showErrorList,
        errorList,
        openControlForm,
        handleSubmit,
        closeForm
    };
};
