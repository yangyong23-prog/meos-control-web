// @ts-ignore
import i18n from '@/localization';
/**
 * 控制弹窗相关hook
 * 包含打开/关闭控制弹窗、批量控制、恢复时间、解除干预等表单逻辑
 * 提供表单数据、当前控制对象、提交方法等响应式数据和操作
 */

import { INFO, INTERVENTION_TIME, REASON, STYLE_INFO } from '@/components/ObjectInfoComponents/ControlForm/config';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM, INFO_CODE, IS_AUTO, IS_MANUAL, SUCCESSCODE } from '@/utils/globalVariables';
import { isNil, uniqBy } from 'lodash';
import DockSingleton from '@/hooks/responsiveDock';
import { getNextFiveMinutePoint, useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { selectTableListKey } from './useBaseHook';
import { inject, provide, ref, nextTick } from 'vue';
import { SUBMIT_TYPE, BATCH_MANUAUTO_TYPE } from '../variables';
import { handleRelInfoCode, isUnrelatedToManualAutoSet } from '@/components/ObjectInfoComponents/utils';

// 控制弹窗相关依赖注入key
export const isControlFormKey = Symbol('isOpenControlForm');
export const virtualControlFormRefKey = Symbol('virtualControlFormRefKey');
export const openBatchControlFormKey = Symbol('openBatchControlFormKey');
export const openControlFormKey = Symbol('openControlFormKey');
export const openRecoveryDateTimeControlFormKey = Symbol('openRecoveryDateTimeControlFormKey');
export const openReleaseInterventionControlFormKey = Symbol('openReleaseInterventionControlFormKey');
export const closeFormKey = Symbol('closeFormKey');
export const curControlInfoCodeKey = Symbol('curControlInfoCodeKey');
export const useControlHook = props => {
    // 获取设备物联数据
    const { getIotData } = DockSingleton.getInstance();
    // 获取选中的设备列表
    const selectTableList = inject(selectTableListKey);

    // 控制弹窗是否打开
    const isOpenControlForm = ref(false);
    // 控制弹窗挂载的DOM节点
    const virtualControlFormRef = ref(null);
    // 控制弹窗表单项列表
    const controlFormFormList = ref([]);
    // 当前控制的infoCode对象
    const curInfoCode = ref({});
    // 控制相关方法
    const { controlFn, changeInfoCodeExpireTimeFn, releaseIntervention, multiObjectBatchControlFn } = useGeneralControl();

    /**
     * 打开单个设备控制弹窗
     * @param {Object} data - 控制弹窗参数
     * @param {Object} dataSourceItem - 数据源项
     */
    const openControlForm = (data, dataSourceItem) => {
        closeForm();
        const { el, data: item, value, needSelfComponent } = data;
        item.objectId = item.id;
        emitter.emit(CLOSE_CONTROL_FORM);
        virtualControlFormRef.value = el;
        curInfoCode.value = { ...item };
        curInfoCode.value.dataSourceItem = dataSourceItem;
        curInfoCode.value.SUBMIT_TYPE = SUBMIT_TYPE.CONTROL;
        if (!isNil(value)) {
            curInfoCode.value.value = value;
        }
        // 解析显示样式配置
        let showStyle = {};
        try {
            if (item.showStyle) {
                showStyle = JSON.parse(item.showStyle);
            }
        } catch (error) {
            console.log(error);
        }
        console.log(showStyle);
        // 自动模式特殊弹窗
        if (item.infoCode === INFO_CODE.manualAutoSet.infoCode && value === IS_AUTO) {
            controlFormFormList.value = [INFO(i18n.global.t('meos_control_web.confirm_switch_to_auto_dup'))];
            nextTick(() => {
                isOpenControlForm.value = true;
            });
            return;
        }
        // 默认弹窗内容
        controlFormFormList.value = [REASON()];
        const manualAutoStatus = getIotData(item.id, INFO_CODE.manualAutoStatus.infoCode);
        // 自动模式需要填写截止时间
        if (!isUnrelatedToManualAutoSet(item)) {
            if (manualAutoStatus.dataValue === IS_AUTO || item.infoCode === INFO_CODE.manualAutoSet.infoCode) {
                controlFormFormList.value.unshift(
                    INTERVENTION_TIME(
                        `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(1, 'year').format('YYYY.MM.DD HH:mm:00')}`,
                        item.infoCode === 'manualAutoSet'
                            ? {
                                  infoCode: 'manualAutoSet',
                                  dataValue: '1'
                              }
                            : undefined,
                        { max: 527040 },
                        {
                            defaultValue: item.additionalMapValue?.recoveryDateTime ? dayjs(item.additionalMapValue.recoveryDateTime).format('YYYY.MM.DD HH:mm') : '',
                            scopeDisabledTipsText: i18n.global.t('meos_control_web.select_time_within_1_year_only')
                        }
                    )
                );
            }
        }

        // 处理相关信息编码
        const relArr = handleRelInfoCode(item, dataSourceItem, showStyle);
        console.log(relArr);
        // 遍历处理相关项并设置表单项
        relArr.forEach(relItem => {
            relItem.id = item.id;
            setFormItem(relItem, true);
        });
        curInfoCode.value.relInfoCodes = relArr.map(r => r.infoCode);
        setFormItem(item, needSelfComponent);
        nextTick(() => {
            isOpenControlForm.value = true;
        });
    };
    const setFormItem = (item, needSelfComponent, customAttrs = {}) => {
        // 需要自定义组件时
        const obj = {
            name: item.infoCodeName,
            required: true,
            defaultValue: getIotData(item.id, item.infoCode)?.dataValue,
            ...item,
            ...customAttrs
        };
        if (needSelfComponent) {
            if (item?.dataSource?.length) {
                obj.component = FormItemRadio;
            } else {
                obj.component = FormItemInputNumber;
                obj.componentAttrs = {
                    precision: item.scale || 1
                };
            }
            controlFormFormList.value.unshift(obj);
        }
    };
    /**
     * 打开修改干预时间控制弹窗
     * @param {Object} data - 弹窗参数
     */
    const openRecoveryDateTimeControlForm = data => {
        closeForm();
        const { el, data: item } = data;
        emitter.emit(CLOSE_CONTROL_FORM);
        virtualControlFormRef.value = el;
        curInfoCode.value = item;
        curInfoCode.value.SUBMIT_TYPE = SUBMIT_TYPE.RECOVERY_DATE_TIME;
        controlFormFormList.value = [REASON()];
        controlFormFormList.value.unshift(
            INTERVENTION_TIME(
                `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(1, 'year').format('YYYY.MM.DD HH:mm:00')}`,
                undefined,
                { max: 527040 },
                {
                    defaultValue: item.additionalMapValue?.recoveryDateTime ? dayjs(item.additionalMapValue.recoveryDateTime).format('YYYY.MM.DD HH:mm') : '',
                    scopeDisabledTipsText: i18n.global.t('meos_control_web.select_time_within_1_year_only')
                }
            )
        );
        nextTick(() => {
            isOpenControlForm.value = true;
        });
    };

    /**
     * 打开解除干预弹窗
     * @param {Object} data - 弹窗参数
     */
    const openReleaseInterventionControlForm = (data, type = SUBMIT_TYPE.RELEASE_INTERVENTION, infoText) => {
        closeForm();
        const { el, data: item } = data;
        emitter.emit(CLOSE_CONTROL_FORM);
        virtualControlFormRef.value = el;
        curInfoCode.value = item;
        curInfoCode.value.SUBMIT_TYPE = type;
        controlFormFormList.value = [INFO(infoText ?? i18n.global.t('meos_control_web.acknowledge_release_intervention_setpoint'))];
        nextTick(() => {
            isOpenControlForm.value = true;
        });
    };

    /**
     * 打开批量控制弹窗
     * @param {Object} data - 弹窗参数
     */
    const openBatchControlForm = data => {
        closeForm();
        const { el, data: item, value, batchManuautoType, needSelfComponent } = data;
        if (!item) {
            return;
        }
        emitter.emit(CLOSE_CONTROL_FORM);
        virtualControlFormRef.value = el;
        const _item = { ...item };
        curInfoCode.value = _item;
        curInfoCode.value.SUBMIT_TYPE = SUBMIT_TYPE.BATCH_CONTROL;
        if (!isNil(value)) {
            curInfoCode.value.value = value;
        }
        // 自动模式特殊弹窗
        if (item.infoCode === 'manualAutoSet') {
            controlFormFormList.value = [
                REASON(params => {
                    // 手动时需要展示原因
                    return params.manualAutoSet === '0';
                }),
                STYLE_INFO(i18n.global.t('meos_control_web.switch_to_auto_after_operation'), params => {
                    // 自动时需要展示说明
                    return params.manualAutoSet === '1';
                })
            ];
        } else {
            controlFormFormList.value = [REASON()];
        }
        console.log('_item', _item);
        const hasAutoControlDevice =
            item.infoCode === INFO_CODE.manualAutoSet.infoCode || batchManuautoType === BATCH_MANUAUTO_TYPE.MANU_AND_AUTU || batchManuautoType === BATCH_MANUAUTO_TYPE.ONLY_AUTU;
        const shouldAddManualAutoSetTime = hasAutoControlDevice && (item.infoCode === INFO_CODE.manualAutoSet.infoCode || !props.manualAutoSetControl);
        // 批量控制时，如果存在手动自动控制相关设备，则需要添加截止时间表单项，并且受手自动限制
        if (shouldAddManualAutoSetTime && !isUnrelatedToManualAutoSet(item)) {
            controlFormFormList.value.unshift(
                INTERVENTION_TIME(
                    `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(1, 'year').format('YYYY.MM.DD HH:mm:00')}`,
                    {
                        infoCode: INFO_CODE.manualAutoSet.infoCode,
                        dataValue: ['1', '']
                    },
                    { max: 527040 },
                    {
                        nameDesc:
                            item.infoCode !== INFO_CODE.manualAutoSet.infoCode && batchManuautoType === BATCH_MANUAUTO_TYPE.MANU_AND_AUTU
                                ? i18n.global.t('meos_control_web.only_effective_for_auto_devices')
                                : null,
                        scopeDisabledTipsText: i18n.global.t('meos_control_web.select_time_within_1_year_only')
                    }
                )
            );
        }
        let relArr = [];
        if (item.showStyle?.linkageControl?.infoCodes) {
            for (const code of item.showStyle.linkageControl.infoCodes) {
                for (const tableItem of selectTableList.value) {
                    const iotData = getIotData(tableItem.id, code);
                    if (iotData.infoCode) {
                        relArr.push(iotData);
                        break;
                    }
                }
            }
            relArr = uniqBy(relArr, 'infoCode');
            relArr.forEach(relItem => {
                setFormItem(relItem, true, {
                    defaultValue: '',
                    showFilter: params => {
                        const values = item?.showStyle?.linkageControl?.whenValueOr || [];
                        return values.includes(params[curInfoCode.value.infoCode]);
                    }
                });
            });
        }
        curInfoCode.value.relInfoCodes = relArr.map(r => r.infoCode);
        curInfoCode.value.whenValueOr = item?.showStyle?.linkageControl?.whenValueOr || [];
        setFormItem(item, needSelfComponent);
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
     * 处理解除干预提交
     * @param {Object} data - 表单数据
     * @param {Function} fn - 回调函数
     */
    const handleReleaseInterventionSubmit = (data, fn) => {
        const ids = curInfoCode.value.SUBMIT_TYPE === SUBMIT_TYPE.BATCH_RELEASE_INTERVENTION ? selectTableList.value.map(item => item.id) : [curInfoCode.value.id];
        const params = {
            objectIds: ids,
            infoCode: curInfoCode.value.infoCode,
            content: ''
        };
        props.systemId && (params.systemId = props.systemId);
        releaseIntervention(params, res => callback(res, fn));
    };

    /**
     * 处理恢复时间提交
     * @param {Object} data - 表单数据
     * @param {Function} fn - 回调函数
     */
    const handleTimeSubmit = (data, fn) => {
        const params = {
            objectId: curInfoCode.value.id,
            infoCode: curInfoCode.value.infoCode,
            expireTime: data.expireTime ? dayjs(data.expireTime).format('YYYY-MM-DD HH:mm:ss') : '',
            content: data.content
        };
        props.systemId && (params.systemId = props.systemId);
        changeInfoCodeExpireTimeFn(params, res => callback(res, fn));
    };

    /**
     * 处理控制弹窗提交
     * @param {Object} data - 表单数据
     * @param {Function} fn - 回调函数
     */
    const handleSubmit = async (data, fn) => {
        if (curInfoCode.value.SUBMIT_TYPE === SUBMIT_TYPE.RELEASE_INTERVENTION || curInfoCode.value.SUBMIT_TYPE === SUBMIT_TYPE.BATCH_RELEASE_INTERVENTION) {
            handleReleaseInterventionSubmit(data, fn);
            return;
        }
        if (curInfoCode.value.SUBMIT_TYPE === SUBMIT_TYPE.RECOVERY_DATE_TIME) {
            handleTimeSubmit(data, fn);
            return;
        }
        const params = {
            objectIds: [curInfoCode.value.id],
            infoCode: curInfoCode.value.infoCode,
            infoValue: curInfoCode.value.value || data[curInfoCode.value.infoCode],
            expireTime: data.expireTime ? dayjs(data.expireTime).format('YYYY-MM-DD HH:mm:ss') : '',
            content: data.content
        };
        props.systemId && (params.systemId = props.systemId);
        // 批量控制时，objectIds为选中设备id数组
        if (curInfoCode.value.SUBMIT_TYPE === SUBMIT_TYPE.BATCH_CONTROL) {
            params.objectIds = selectTableList.value.map(item => item.id);
            if (props.manualAutoSetControl && curInfoCode.value.infoCode !== INFO_CODE.manualAutoSet.infoCode && !isUnrelatedToManualAutoSet(curInfoCode.value)) {
                params.objectIds = params.objectIds.filter(item => {
                    const isManual = getIotData(item, INFO_CODE.manualAutoSet.infoCode).dataValue === IS_MANUAL;
                    return isManual;
                });
            }
            if (!curInfoCode.value.whenValueOr?.includes(data[curInfoCode.value.infoCode])) {
                curInfoCode.value.relInfoCodes = [];
            }
        }
        // 判断是否存在关联信息码，决定使用不同的处理方式
        if (curInfoCode.value.relInfoCodes?.length) {
            // 构建批量操作的命令参数
            const commandParams = [{ infoCode: curInfoCode.value.infoCode, infoValue: curInfoCode.value.value || data[curInfoCode.value.infoCode] }];
            curInfoCode.value.relInfoCodes.forEach(relInfoCode => {
                commandParams.push({
                    infoCode: relInfoCode,
                    infoValue: data[relInfoCode]
                });
            });

            // 执行批量控制操作
            multiObjectBatchControlFn({
                data: {
                    objects: params.objectIds.map(objectId => ({ objectId, commandParams: commandParams })),
                    systemId: props.systemId,
                    content: params.operateReason,
                    expireTime: params.expireTime
                },
                callback: res => {
                    const { code } = res;
                    if (code === SUCCESSCODE) {
                        useSuccessMessage();
                    }
                    closeForm();
                    fn();
                }
            });
            return;
        }
        controlFn({
            data: params,
            callback: res => callback(res, fn)
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
        if (res.code === SUCCESSCODE) useSuccessMessage(i18n.global.t('meos_control_web.control_command_sent_success'));
    };

    // 提供弹窗相关响应式数据和方法给子组件
    provide(isControlFormKey, isOpenControlForm);
    provide(virtualControlFormRefKey, virtualControlFormRef);
    provide(openBatchControlFormKey, openBatchControlForm);
    provide(openControlFormKey, openControlForm);
    provide(openRecoveryDateTimeControlFormKey, openRecoveryDateTimeControlForm);
    provide(openReleaseInterventionControlFormKey, openReleaseInterventionControlForm);
    provide(closeFormKey, closeForm);
    provide(curControlInfoCodeKey, curInfoCode);

    // 返回响应式数据和操作方法
    return {
        isOpenControlForm,
        virtualControlFormRef,
        controlFormFormList,
        curInfoCode,
        openControlForm,
        handleSubmit,
        closeForm,
        openBatchControlForm,
        openRecoveryDateTimeControlForm,
        openReleaseInterventionControlForm
    };
};
