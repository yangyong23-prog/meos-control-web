import i18n from '@/localization';
/**
 * 设备参数设置弹窗相关hook
 * 包含表单项生成、参数初始化、表单提交、动态表单项切换等逻辑
 * 提供弹窗显示、表单数据、提交按钮loading、关闭弹窗等响应式数据和方法
 */

import { consoleSwitchSet } from '@/apis/ACAC';
import CoolerSet from '../components/setForm/CoolerSet.vue';
import InputSet from '../components/setForm/InputSet.vue';
import { CONSOLE_TYPES, SYSTEM_CLASSCODE, FREE_COOLING_SWITCH_SET, OTHER_REASON } from '../variables';
import { COMMON_CONFIG, FORM_CONFIG_FUN } from './config';
import { consoleTypesKey, getAirControlListDataKey, getControlListDataKey } from './useRightHook';
import { codeDefineKey, systemIdKey } from './useBaseHook';
import { isObject } from 'lodash';
import RadioSet from '../components/setForm/RadioSet.vue';
import { EMPTYTEXT, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage, useErrorMessage } from '@/utils/tools';
import DockSingleton from '@/hooks/responsiveDock';
import dayjs from 'dayjs';
import CheckBoxAndInputSet from '../components/setForm/CheckBoxAndInputSet.vue';
import { isLockV2 } from '@/components/SystemControl/config';

// 依赖注入的key定义
export const paramsKey = Symbol('params'); // 表单参数
export const SetFormKey = Symbol('SetFormKey'); // 表单ref
export const currentDataKey = Symbol('currentDataKey'); // 当前数据

export default function useSetFormHook(props, emit) {
    // 获取物联数据方法
    const { getIotData } = DockSingleton.getInstance();

    // 表单参数响应式对象
    const params = ref({
        operateType: '',
        operateReason: ''
    });

    // 注入基础数据和方法
    const codeDefine = inject(codeDefineKey); // 字段精度定义
    const getControlListData = inject(getControlListDataKey); // 刷新设备控制列表
    const getAirControlListData = inject(getAirControlListDataKey); // 刷新空调分区控制列表
    const consoleTypes = inject(consoleTypesKey); // 当前控制类型
    const show = ref(false); // 弹窗显示控制
    const SetForm = ref(null); // 表单ref
    const systemId = inject(systemIdKey); // 系统id
    const isClear = ref(false); // 是否清空表单项
    // 表单项配置，按infoCode生成
    const FormConfig = ref(FORM_CONFIG_FUN({ infoCode: props.data.infoCode, infoCodeName: props.data.infoCodeName })[props.data.infoCode]);
    const formItemList = ref([]); // 当前表单项列表
    const btnLoading = ref(false); // 提交按钮loading

    /**
     * 当前设备数据，包含infoCode、id等
     * 从props.controlListData中查找匹配项
     */
    const currentData = computed(() => {
        const arr = [...props.controlListData];
        props.controlListData.forEach(item => {
            item.pumpGroups?.forEach(pumpGroup => {
                if (pumpGroup.pumpGroupInfoCodes) {
                    arr.push(...pumpGroup.pumpGroupInfoCodes);
                }
            });
            if (item.pumpGroupInfoCodes) {
                arr.push(...item.pumpGroupInfoCodes);
            }
        });
        // 查找当前infoCode和id对应的数据
        return arr.find(item => item.infoCode === props.data.infoCode && item.id === props.data.id) || {};
    });

    /**
     * 关闭弹窗
     */
    const closeForm = () => {
        emit('close');
    };

    /**
     * 初始化表单参数，全部置空
     * @param {Array} data - 表单项数组
     */
    const setParams = async data => {
        params.value = {
            operateType: '',
            operateReason: ''
        };
        show.value = false;
        await nextTick();
        // 每个表单项都置空
        data.forEach(item => {
            if (item.infoCode) {
                params.value[item.infoCode] = '';
            }
        });
        show.value = true;
    };

    /**
     * 初始化表单参数，支持设置默认值
     * @param {Array} data - 表单项数组
     * @param {any} setValue - 指定infoCode的默认值
     */
    const initSetParams = async (data, setValue) => {
        params.value = {
            operateType: '',
            operateReason: ''
        };
        show.value = false;
        await nextTick();
        // 遍历表单项，设置默认值
        data.forEach(item => {
            if (item.infoCode) {
                const defaultValue = item.defaultValue ?? getIotData(props.data.id, item.infoCode)?.dataValue;
                params.value[item.infoCode] = defaultValue ?? '';
                // 首次进来且relatesInformationData为false时清空
                if (props.data.relatesInformationData === false) {
                    params.value[item.infoCode] = '';
                }
            }
        });
        show.value = true;
        // 如果有setValue，设置指定infoCode的值
        if (setValue) {
            params.value[props.data.infoCode] = setValue;
        }
    };

    /**
     * 表单项切换时处理
     * @param {any} data - 切换后的值
     * @param {string} infoCode - 切换的字段
     */
    const handleChangeFormItem = async (data, infoCode) => {
        console.log(data);
        // 切换的是主字段，重新生成表单项
        if (currentData.value.infoCode === infoCode || props.canChange) {
            formItemList.value = FormConfig.value[data];
            isClear.value = true;
            await setParams(formItemList.value, false, true);
            params.value[infoCode] = data;
        } else {
            // 切换的是相关字段，控制显示/隐藏
            formItemList.value.forEach(item => {
                item.correlationInfoCode === infoCode && (item.hide = data !== item.showValue);
            });
        }
    };

    /**
     * 表单提交
     * 校验通过后组装参数并调用接口
     */
    const handleSubmit = () => {
        SetForm.value.validate(async (valid, errors) => {
            if (valid) {
                btnLoading.value = true;
                // 本地/远程识别，直接emit
                if (props.identifyLocalOrRemote) {
                    emit('submit', params.value, btnLoading);
                    return;
                }
                // 组装参数
                const data = assembleParams();
                try {
                    let urlStr = 'infoCodeSetAndUnitsNumberSet';
                    // 空调分区特殊处理
                    if (consoleTypes.value === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id && CONSOLE_TYPES.AIR_TERMINAL_ZONE.code.includes(currentData.value?.infoCode)) {
                        data.airTerminalZoneId = data.objectId;
                        data.objectId = props.data.pumpGroups?.[0]?.pumpGroupId;
                    }
                    // 调用接口
                    const res = await consoleSwitchSet(urlStr, data);
                    closeForm();
                    if (res.code === SUCCESSCODE) useSuccessMessage(i18n.global.t('common.save_success'));
                    // 刷新设备列表
                    if (consoleTypes.value === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id) {
                        getAirControlListData();
                    } else {
                        getControlListData(consoleTypes.value);
                    }
                } catch (err) {
                    console.error('Error during form submission:', err);
                } finally {
                    btnLoading.value = false;
                }
            } else {
                // 校验失败，处理错误提示
                let empty = false;
                for (const key in errors) {
                    if (Object.prototype.hasOwnProperty.call(errors, key)) {
                        const element = errors[key];
                        const err = element.find(item => item.message === EMPTYTEXT);
                        if (err) {
                            empty = true;
                        }
                    }
                }
                useErrorMessage(empty ? EMPTYTEXT : i18n.global.t('meos_control_web.input_field_error'));
            }
        });
    };

    /**
     * 组装接口参数
     * @returns {Object} 提交参数对象
     */
    const assembleParams = () => {
        const data = {
            systemType: SYSTEM_CLASSCODE,
            consoleTypes: consoleTypes.value,
            operateType: params.value.operateReason || (params.value.operateType === OTHER_REASON ? '' : params.value.operateType),
            objectId: props.data.id,
            systemId: systemId.value
        };

        // 处理截止时间
        data.expireTime = dayjs(params.value.expireTime).format('YYYYMMDDHHmmss');
        const infoCodes = [];
        const unitsNumbers = [];

        // 遍历表单项，组装infoCodes和unitsNumbers
        formItemList.value.forEach(item => {
            const paramsValue = structuredClone(params.value[item.infoCode]);
            const obj = props.controlListData.find(i => i.infoCode === item.infoCode);
            let _lock = false;
            if (obj?.lockStatus) {
                const lock = getIotData(props.data.id, obj.lockStatus?.infoCode);
                _lock = isLockV2(lock);
            }
            if (!_lock) {
                if (isObject(paramsValue) || item.isCooler) {
                    // 冷机组参数特殊处理
                    const arr =
                        paramsValue?.map?.(v => {
                            delete v.coolerType;
                            delete v.parentClassCode;
                            delete v.dataValue;
                            delete v.order;
                            return v;
                        }) || [];

                    unitsNumbers.push({
                        chillerType: item.infoCode,
                        chillerCode: arr
                    });
                } else {
                    // 普通参数
                    if (!item.noPush) {
                        infoCodes.push({ infoCode: item.infoCode, infoCodeValue: paramsValue === null ? '' : paramsValue });
                    }
                }
            }
        });
        if (infoCodes.length) {
            data.infoCodes = infoCodes;
        }
        if (unitsNumbers.length) {
            data.unitsNumber = unitsNumbers;
        }

        return data;
    };

    /**
     * 判断本地/远程，生成表单项
     * @param {any} dataValue - 当前字段值
     */
    const identifyLocalOrRemote = dataValue => {
        if (props.identifyLocalOrRemote) {
            props.identifyLocalOrRemote(formItemList, dataValue, FormConfig);
            return;
        }
        if (FormConfig.value) {
            const { source, value, closeValue, exclude, addExtendInfoCodes, isAir } = FormConfig.value;

            if (source === 'remote' && !isAir) {
                // 远程模式，遍历泵组或控制列表
                const arr = props.data.pumpGroupInfoCodes || props.controlListData;
                arr.forEach(item => {
                    if (!exclude?.includes(item.infoCode)) {
                        const comp = {
                            ...item,
                            component: item.unitsNumberSetValue ? CoolerSet : item.dataSource?.length ? RadioSet : InputSet,
                            isCooler: item.unitsNumberSetValue ? true : false,
                            noRequired: true,
                            precision: codeDefine.value[item.classCode]?.[item.infoCode]?.scale || 1
                        };
                        FormConfig.value[value].push({
                            ...comp
                        });
                        typeof closeValue !== 'undefined' &&
                            FormConfig.value[closeValue].push({
                                ...comp,
                                hide: true
                            });
                    }
                    // 需要添加扩展字段
                    if (addExtendInfoCodes?.includes(item.infoCode)) {
                        let infoCode = '',
                            unit = '℃',
                            max = 100;
                        if (consoleTypes.value === CONSOLE_TYPES.COOL_SUPPLY.id) {
                            infoCode = 'iceContent';
                            unit = '%';
                        } else {
                            unit = '%';
                            infoCode = 'waterTemperature';
                        }
                        if (item.infoCode === FREE_COOLING_SWITCH_SET) {
                            infoCode = 'maximumWaterSupplyTemp';
                            max = 99;
                            unit = '℃';
                        }
                        FormConfig.value[value].push({
                            hide: item.setValue !== '1',
                            unit,
                            showValue: '1',
                            correlationInfoCode: item.infoCode,
                            infoCode: infoCode,
                            infoCodeName: '',
                            max,
                            component: CheckBoxAndInputSet
                        });
                    }
                });
                // 按order排序
                FormConfig.value[value].sort((a, b) => (b.order || 0) - (a.order || 0));
            } else if (source === 'remote' && isAir) {
                // 空调分区远程模式，直接使用传入的controlListData
                // 遍历泵组或控制列表
                const pumpGroupInfoCodes = currentData.value.pumpGroups[0]?.pumpGroupInfoCodes || [];
                pumpGroupInfoCodes.forEach(item => {
                    console.log(item);

                    const comp = {
                        ...item,
                        component: item.unitsNumberSetValue ? CoolerSet : item.dataSource?.length ? RadioSet : InputSet,
                        isCooler: item.unitsNumberSetValue ? true : false,
                        noRequired: true,
                        precision: codeDefine.value[item.classCode]?.[item.infoCode]?.scale || 1,
                        defaultValue: getIotData(item.id, item.infoCode)?.dataValue
                    };
                    FormConfig.value[value].push({
                        ...comp
                    });
                });
            }
            // 设置表单项
            formItemList.value = FormConfig.value[dataValue || '1'];
        } else {
            // 本地模式，生成默认表单项
            formItemList.value = [
                {
                    infoCode: currentData.value.infoCode,
                    precision: codeDefine.value[currentData.value.classCode]?.[currentData.value.infoCode]?.scale || 1,
                    infoCodeName: currentData.value.infoCodeName,
                    component: currentData.value?.unitsNumberSetValue ? CoolerSet : currentData.value?.dataSource?.length ? RadioSet : InputSet,
                    isCooler: currentData.value?.unitsNumberSetValue ? true : false
                }
            ];
            formItemList.value.push(...COMMON_CONFIG);
        }
    };

    /**
     * 组件挂载时初始化表单项和参数
     */
    onMounted(async () => {
        const value = getIotData(props.data.id, props.data.infoCode).dataValue;
        identifyLocalOrRemote(value);
        nextTick(() => {
            initSetParams(formItemList.value, value);
        });
    });

    // 提供响应式数据给子组件
    provide(paramsKey, params);
    provide(SetFormKey, SetForm);
    provide(currentDataKey, currentData);

    // 返回响应式数据和操作方法
    return {
        show,
        params,
        SetForm,
        formItemList,
        btnLoading,
        isClear,
        closeForm,
        handleChangeFormItem,
        handleSubmit,
        setParams
    };
}
