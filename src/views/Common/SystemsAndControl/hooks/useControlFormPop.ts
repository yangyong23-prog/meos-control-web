import { INTERVENTION_TIME_V2, REASON_SELECT, REASON_SELECT_INPUT } from '@/components/ObjectInfoComponents/ControlForm/config';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import FormCooler from '@/components/ObjectInfoComponents/ControlForm/FormCooler.vue';
import { ControlListItem } from '../types/control';
import { ControlProps } from '../types/props';
import { CLOSE, INFOCODE_SET_AND_UNITSNUMBERS_SET, OPEN } from '../constant';
import { getNextFiveMinutePoint, setModelType, useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import DockSingleton from '@/hooks/responsiveDock';
import { isLock } from '../utils';
import { chillerDataKey } from './useBaseDataHook';
import { ChillerData } from '../types';
import { cloneDeep } from 'lodash';
import { OTHER_REASON, SUCCESSCODE } from '@/utils/globalVariables';
import { consoleSwitchSet } from '@/apis/ACAC';
import i18n from '@/localization';

export const useControlFormPop = (props: ControlProps) => {
    const { getIotData } = DockSingleton.getInstance();
    const chillerData = inject(chillerDataKey, ref<ChillerData>());
    const isOpen = ref(false);
    const virtualRef = ref<HTMLElement | null>(null);
    const formList = ref<any[]>([]);
    const relateFormList = ref<any[]>([]);
    const currentData = ref<ControlListItem>();
    const ControlFormRef = ref<any>(null);
    const openSetForm = async (e: HTMLElement, item: ControlListItem) => {
        if (item.infoCode === currentData.value?.infoCode && item.id === currentData.value?.id) {
            return;
        }
        closeForm();
        await nextTick();
        virtualRef.value = e;
        isOpen.value = true;
        formList.value = [];
        relateFormList.value = [];
        currentData.value = item;
        formList.value.unshift(
            props.currentConsoleType?.reason.default?.length
                ? REASON_SELECT((params: { [x: string]: string }) => {
                      if (props.currentConsoleType?.noUseDefaultReasonCodes.includes(item.infoCode)) {
                          // 操作：选择开启
                          if (params[item.infoCode] === OPEN) {
                              return props.currentConsoleType?.reason.open || [];
                          }
                          // 操作：选择关闭
                          if (params[item.infoCode] === CLOSE) {
                              return props.currentConsoleType?.reason.close || [];
                          }
                          return props.currentConsoleType?.reason.default || [];
                      }
                      return props.currentConsoleType?.reason.default || [];
                  })
                : REASON_SELECT_INPUT()
        );
        if (props.showControlInterventionTime) {
            formList.value.unshift(
                INTERVENTION_TIME_V2(`${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(3, 'day').format('YYYY.MM.DD HH:mm:00')}`, undefined, undefined, {
                    useLongterm: false
                })
            );
        }

        const arr: any[] = [];
        const hideArr: any[] = [];
        if (item.infoCode === props.currentConsoleType?.code) {
            props.currentConsoleType?.controlList?.forEach(controlItem => {
                if (item.infoCode !== controlItem.infoCode && controlItem.id === item.id) {
                    arr.push(setItemForm(controlItem, false));
                    hideArr.push(setItemForm(controlItem, false, true)); // 用于隐藏
                }
            });
        }
        if (props.currentConsoleType?.isAir && props.currentConsoleType?.code.includes(item.infoCode)) {
            props.currentConsoleType?.controlList?.forEach(controlItem => {
                if (item.infoCode === controlItem.infoCode && controlItem.id === item.id) {
                    const codes = controlItem?.pumpGroupInfoCodes || controlItem?.pumpGroups?.[0]?.pumpGroupInfoCodes || [];
                    codes?.forEach(pumpGroupInfoCode => {
                        console.log(pumpGroupInfoCode);

                        arr.push(setItemForm(pumpGroupInfoCode, false));
                        hideArr.push(setItemForm(pumpGroupInfoCode, false, true));
                    });
                }
            });
        }
        const a = setItemForm(item);
        // 获取控制列表数据 初始值是开启情况
        if (props.currentConsoleType?.code.includes(item.infoCode)) {
            const dataValue = getIotData(item.id, item.infoCode)?.dataValue;
            if (dataValue === OPEN) {
                nextTick(() => {
                    relateFormList.value = cloneDeep(arr);
                });
            } else {
                nextTick(() => {
                    relateFormList.value = cloneDeep(hideArr);
                });
            }
        }
        a.componentAttrs.onChange = (val: any) => {
            if (props.currentConsoleType?.code.includes(item.infoCode)) {
                // 操作：清空原因数据
                if (ControlFormRef.value) {
                    ControlFormRef.value.params.operateType = '';
                    ControlFormRef.value.params.operateReason = '';
                }
                // 操作：选择开启
                if (val === OPEN) {
                    nextTick(() => {
                        relateFormList.value = cloneDeep(arr);
                    });
                } else {
                    nextTick(() => {
                        relateFormList.value = cloneDeep(hideArr);
                    });
                }
                nextTick(() => {
                    relateFormList.value.forEach(vall => {
                        vall.defaultValue = '';
                    });
                });
            }
        };
        formList.value.unshift(a);
    };
    const setItemForm = (item: ControlListItem, required = true, hideDom = false) => {
        const obj: any = {
            name: item.infoCodeName,
            required,
            hideDom: hideDom,
            defaultValue: hideDom ? '' : getIotData(item.id, item.infoCode)?.dataValue,
            componentAttrs: {},
            ...item
        };

        if (item.unitsNumberSetValue) {
            obj.component = FormCooler;
            obj.chillerData = chillerData.value;
            obj.isLockV2 = isLock;
            obj.isLock = isLock;
            obj.id = item.id;
            obj.controlListData = props.currentConsoleType?.controlList || [];
        } else if (item?.dataSource?.length) {
            obj.component = FormItemRadio;
        } else {
            obj.component = FormItemInputNumber;
            obj.componentAttrs = {
                precision: item.scale || 1
            };
        }
        return obj;
    };
    /**
     * 组装接口参数
     * @returns {Object} 提交参数对象
     */
    const assembleParams = (params: any): object => {
        const normalizeChillerCode = (value: any) => {
            if (!Array.isArray(value)) {
                return [];
            }
            return value.map((v: any) => {
                const itemValue = { ...(v || {}) };
                delete itemValue.coolerType;
                delete itemValue.parentClassCode;
                delete itemValue.dataValue;
                delete itemValue.order;
                return itemValue;
            });
        };

        const data: any = {
            systemType: props.systemClassCode,
            consoleTypes: props.currentConsoleType?.id,
            operateType: params.operateReason || (params.operateType === OTHER_REASON ? '' : params.operateType),
            objectId: currentData.value?.id,
            systemId: props.systemId,
            infoCodes: [],
            unitsNumber: [],
            expireTime: ''
        };

        // 处理截止时间
        data.expireTime = params.expireTime ? dayjs(params.expireTime).format('YYYYMMDDHHmmss') : undefined;
        const infoCodes: any[] = [];
        const unitsNumbers: any[] = [];
        const list = [...formList.value, ...relateFormList.value];
        const isCloseCurrentControl = Boolean(
            currentData.value && props.currentConsoleType?.code.includes(currentData.value.infoCode) && params[currentData.value.infoCode] === CLOSE
        );

        // 遍历表单项，组装infoCodes和unitsNumbers
        list.forEach(item => {
            const paramsValue = params[item.infoCode];
            if (Array.isArray(paramsValue)) {
                // 机组参数特殊处理
                const arr = normalizeChillerCode(paramsValue);
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
        });

        // 处理关闭操作时，将数据除开它本身的数据置为空
        if (isCloseCurrentControl) {
            infoCodes.forEach(code => {
                if (code.infoCode !== currentData.value?.infoCode) {
                    code.infoCodeValue = '';
                }
            });
            unitsNumbers.forEach(unit => {
                if (unit.chillerType !== currentData.value?.infoCode) {
                    (unit.chillerCode || []).forEach((code: { infoCodeValue: string }) => {
                        code.infoCodeValue = '';
                    });
                }
            });
        }
        if (infoCodes.length) {
            data.infoCodes = infoCodes;
        }
        if (unitsNumbers.length) {
            data.unitsNumber = unitsNumbers;
        }

        return data;
    };

    const handleSubmit = async (v: any) => {
        const params: any = assembleParams(v);
        try {
            const urlStr = INFOCODE_SET_AND_UNITSNUMBERS_SET;
            // 空调分区特殊处理
            if (props.currentConsoleType?.isAir && props.currentConsoleType.code.includes(currentData.value?.infoCode || '')) {
                const firstInfoCode = params.infoCodes?.find((item: { infoCode: string | undefined }) => item.infoCode === currentData.value?.infoCode);
                if (!firstInfoCode) {
                    console.error('airConditionDemandSet params.infoCodes is empty');
                    return;
                }
                params.infoCode = firstInfoCode.infoCode;
                params.infoCodeValue = firstInfoCode.infoCodeValue;
                params.airTerminalZoneId = currentData.value?.id;
                params.objectId = currentData.value?.pumpGroups?.[0]?.pumpGroupId;
            }
            setModelType(props.systemId);
            // 调用接口
            const res = await consoleSwitchSet(urlStr, params);
            closeForm();
            if (res.code === SUCCESSCODE) useSuccessMessage(i18n.global.t('common.save_success'));
        } catch (err) {
            console.error('Error during form submission:', err);
        }
    };
    const closeForm = () => {
        isOpen.value = false;
        virtualRef.value = null;
        currentData.value = undefined;
        formList.value = [];
        relateFormList.value = [];
    };
    return {
        isOpen,
        virtualRef,
        formList,
        relateFormList,
        currentData,
        ControlFormRef,
        openSetForm,
        handleSubmit,
        closeForm
    };
};
