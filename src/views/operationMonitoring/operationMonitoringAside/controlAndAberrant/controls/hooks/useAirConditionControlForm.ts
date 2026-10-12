import { consoleSwitchSet } from '@/apis/ACAC';
import { listInstantiationDateTag } from '@/apis/calendar';
import { INTERVENTION_TIME_V3, REASON_SELECT } from '@/components/ObjectInfoComponents/ControlForm/config';
import FormCooler from '@/components/ObjectInfoComponents/ControlForm/FormCooler.vue';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import DockSingleton from '@/hooks/responsiveDock';
import i18n from '@/localization';
import { getNextFiveMinutePoint, setModelType, useSuccessMessage } from '@/utils/tools';
import { getDayjsTz, OTHER_REASON, SUCCESSCODE } from '@/utils/globalVariables';
import { chillerDataKey } from '@/views/Common/SystemsAndControl/hooks/useBaseDataHook';
import { CLOSE, INFOCODE_SET_AND_UNITSNUMBERS_SET, OPEN } from '@/views/Common/SystemsAndControl/constant';
import type { ChillerData } from '@/views/Common/SystemsAndControl/types';
import type { ControlListItem } from '@/views/Common/SystemsAndControl/types/control';
import type { ControlProps } from '@/views/Common/SystemsAndControl/types/props';
import { isLock } from '@/views/Common/SystemsAndControl/utils';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

const SEASON = {
    COOLING: ['SEASON_COOLING', 'ACSeason-1'],
    HEATING: ['SEASON_HEATING', 'ACSeason-2']
};

const OTHER_OPTION = () => ({ id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') });

const COOLING_REASON_OPTIONS = {
    [OPEN]: [
        { id: i18n.global.t('meos_control_web.indoor_overheated_insufficient_cooling'), name: i18n.global.t('meos_control_web.indoor_overheated_insufficient_cooling') },
        { id: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'), name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase') },
        { id: i18n.global.t('meos_control_web.local_overheating'), name: i18n.global.t('meos_control_web.local_overheating') },
        OTHER_OPTION()
    ],
    [CLOSE]: [
        { id: i18n.global.t('meos_control_web.indoor_overcooled_excess_cooling'), name: i18n.global.t('meos_control_web.indoor_overcooled_excess_cooling') },
        { id: i18n.global.t('meos_control_web.temporary_cooling_demand_decrease'), name: i18n.global.t('meos_control_web.temporary_cooling_demand_decrease') },
        { id: i18n.global.t('meos_control_web.local_overcooling'), name: i18n.global.t('meos_control_web.local_overcooling') },
        OTHER_OPTION()
    ]
};

const HEATING_REASON_OPTIONS = {
    [OPEN]: [
        { id: i18n.global.t('meos_control_web.indoor_overcooled_insufficient_heating'), name: i18n.global.t('meos_control_web.indoor_overcooled_insufficient_heating') },
        { id: i18n.global.t('meos_control_web.temporary_heating_demand_increase'), name: i18n.global.t('meos_control_web.temporary_heating_demand_increase') },
        { id: i18n.global.t('meos_control_web.local_overcooling'), name: i18n.global.t('meos_control_web.local_overcooling') },
        OTHER_OPTION()
    ],
    [CLOSE]: [
        { id: i18n.global.t('meos_control_web.indoor_overheated_excess_heating'), name: i18n.global.t('meos_control_web.indoor_overheated_excess_heating') },
        { id: i18n.global.t('meos_control_web.temporary_heating_demand_decrease'), name: i18n.global.t('meos_control_web.temporary_heating_demand_decrease') },
        { id: i18n.global.t('meos_control_web.local_overheating'), name: i18n.global.t('meos_control_web.local_overheating') },
        OTHER_OPTION()
    ]
};

/**
 * 空调分区控制表单逻辑，由通用控制表单 Hook 独立复制，便于按分区业务维护。
 */
export const useAirConditionControlForm = (props: ControlProps) => {
    const { getIotData } = DockSingleton.getInstance();
    const chillerData = inject(chillerDataKey, ref<ChillerData>());
    const isOpen = ref(false);
    const virtualRef = ref<HTMLElement | null>(null);
    const formList = ref<any[]>([]);
    const relateFormList = ref<any[]>([]);
    const currentData = ref<ControlListItem>();
    const ControlFormRef = ref<any>(null);
    const seasonTags = ref<string[]>([]);

    // 日历接口可能返回业务标签或旧版 ACSeason 标签，两种格式均兼容。
    const queryTodaySeason = async () => {
        const today = getDayjsTz().format('YYYY-MM-DD');
        try {
            const res: any = await listInstantiationDateTag({ beginDate: today, endDate: today });
            seasonTags.value = res.code === SUCCESSCODE ? res.data?.[0]?.calendarTags || [] : [];
        } catch (error) {
            seasonTags.value = [];
            console.error('Failed to fetch current season:', error);
        }
    };

    const getReasonOptions = (operation?: string) => {
        if (SEASON.COOLING.some(tag => seasonTags.value.includes(tag))) {
            return COOLING_REASON_OPTIONS[operation as keyof typeof COOLING_REASON_OPTIONS] || [OTHER_OPTION()];
        }
        if (SEASON.HEATING.some(tag => seasonTags.value.includes(tag))) {
            return HEATING_REASON_OPTIONS[operation as keyof typeof HEATING_REASON_OPTIONS] || [OTHER_OPTION()];
        }
        return [OTHER_OPTION()];
    };

    queryTodaySeason();

    const setItemForm = (item: ControlListItem, required = true, hideDom = false) => {
        const formItem: any = {
            name: item.infoCodeName,
            required,
            hideDom,
            defaultValue: hideDom ? '' : getIotData(item.id, item.infoCode)?.dataValue,
            componentAttrs: {},
            ...item
        };
        if (item.unitsNumberSetValue) {
            formItem.component = FormCooler;
            formItem.chillerData = chillerData.value;
            formItem.isLockV2 = isLock;
            formItem.isLock = isLock;
            formItem.id = item.id;
            formItem.controlListData = props.currentConsoleType?.controlList || [];
        } else if (item.dataSource?.length) {
            formItem.component = FormItemRadio;
        } else {
            formItem.component = FormItemInputNumber;
            formItem.componentAttrs = { precision: item.scale || 1 };
        }
        return formItem;
    };

    const openSetForm = (element: HTMLElement, item: ControlListItem) => {
        if (item.id === currentData.value?.id && item.infoCode === currentData.value?.infoCode) {
            return;
        }
        closeForm();
        nextTick(() => {
            virtualRef.value = element;
            isOpen.value = true;
            formList.value = [];
            relateFormList.value = [];
            currentData.value = item;
            formList.value.unshift(REASON_SELECT((params: Record<string, string>) => getReasonOptions(params[item.infoCode]), { input: { maxlength: 200 } }));
            if (props.showControlInterventionTime) {
                formList.value.unshift(
                    INTERVENTION_TIME_V3(`${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(3, 'day').format('YYYY.MM.DD HH:mm:00')}`, undefined, undefined, {
                        useLongterm: false
                    })
                );
            }

            const visibleItems: any[] = [];
            const hiddenItems: any[] = [];
            if (props.currentConsoleType?.code.includes(item.infoCode)) {
                props.currentConsoleType.controlList?.forEach(controlItem => {
                    if (item.infoCode !== controlItem.infoCode || controlItem.id !== item.id) {
                        return;
                    }
                    const codes = controlItem.pumpGroupInfoCodes || controlItem.pumpGroups?.[0]?.pumpGroupInfoCodes || [];
                    codes.forEach(info => {
                        visibleItems.push(setItemForm(info, false));
                        hiddenItems.push(setItemForm(info, false, true));
                    });
                });
            }

            const currentItem = setItemForm(item);
            if (props.currentConsoleType?.code.includes(item.infoCode)) {
                const dataValue = getIotData(item.id, item.infoCode)?.dataValue;
                nextTick(() => {
                    relateFormList.value = cloneDeep(dataValue === OPEN ? visibleItems : hiddenItems);
                });
            }
            currentItem.componentAttrs.onChange = (value: string) => {
                if (!props.currentConsoleType?.code.includes(item.infoCode)) {
                    return;
                }
                if (ControlFormRef.value) {
                    ControlFormRef.value.params.operateType = '';
                    ControlFormRef.value.params.operateReason = '';
                }
                nextTick(() => {
                    relateFormList.value = cloneDeep(value === OPEN ? visibleItems : hiddenItems);
                    relateFormList.value.forEach(formItem => {
                        formItem.defaultValue = '';
                    });
                });
            };
            formList.value.unshift(currentItem);
        });
    };

    const normalizeChillerCode = (value: any) => {
        if (!Array.isArray(value)) {
            return [];
        }
        return value.map(item => {
            const normalized = { ...(item || {}) };
            delete normalized.coolerType;
            delete normalized.parentClassCode;
            delete normalized.dataValue;
            delete normalized.order;
            return normalized;
        });
    };

    const assembleParams = (params: any) => {
        const data: any = {
            systemType: props.systemClassCode,
            consoleTypes: props.currentConsoleType?.id,
            operateType: params.operateReason || (params.operateType === OTHER_REASON ? '' : params.operateType),
            objectId: currentData.value?.id,
            systemId: props.systemId,
            infoCodes: [],
            unitsNumber: [],
            expireTime: params.expireTime ? dayjs(params.expireTime).format('YYYYMMDDHHmmss') : undefined
        };
        const infoCodes: any[] = [];
        const unitsNumbers: any[] = [];
        const list = [...formList.value, ...relateFormList.value];
        const isCloseCurrentControl = Boolean(
            currentData.value && props.currentConsoleType?.code.includes(currentData.value.infoCode) && params[currentData.value.infoCode] === CLOSE
        );

        list.forEach(item => {
            const value = params[item.infoCode];
            if (Array.isArray(value)) {
                unitsNumbers.push({ chillerType: item.infoCode, chillerCode: normalizeChillerCode(value) });
            } else if (!item.noPush) {
                infoCodes.push({ infoCode: item.infoCode, infoCodeValue: value === null ? '' : value });
            }
        });
        if (isCloseCurrentControl) {
            infoCodes.forEach(code => {
                if (code.infoCode !== currentData.value?.infoCode) {
                    code.infoCodeValue = '';
                }
            });
            unitsNumbers.forEach(unit => {
                if (unit.chillerType !== currentData.value?.infoCode) {
                    unit.chillerCode?.forEach((code: { infoCodeValue: string }) => {
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

    const closeForm = () => {
        isOpen.value = false;
        virtualRef.value = null;
        currentData.value = undefined;
        formList.value = [];
        relateFormList.value = [];
    };

    const handleSubmit = async (value: any) => {
        const params = assembleParams(value);
        try {
            if (props.currentConsoleType?.code.includes(currentData.value?.infoCode || '')) {
                const firstInfoCode = params.infoCodes?.find((item: { infoCode: string }) => item.infoCode === currentData.value?.infoCode);
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
            const res = await consoleSwitchSet(INFOCODE_SET_AND_UNITSNUMBERS_SET, params);
            closeForm();
            if (res.code === SUCCESSCODE) {
                useSuccessMessage(i18n.global.t('common.save_success'));
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
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
