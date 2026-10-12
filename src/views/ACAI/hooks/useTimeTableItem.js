import { COOLMODE, COOL_MODE_OPTION_DEFINE, CHILLER_COOL_MODE_ALLOWED_CODES } from '@/components/TimeTableEditorModal/timetableConfig';
import { CONSOLE_TYPE_MAP } from '../variables';

export default props => {
    const COOLMODE_OPTION_ARR = [COOLMODE.CHILLER_COOL];
    const coolingMode = ref([]);

    const reset = () => {
        coolingMode.value = [];
    };
    const coolingSupplySwitchSetData = ref('');
    const heatingSwitchSetData = ref('');
    const enableCtrlData = ref('');
    const airConditionDemandData = ref('');

    const chillerRuleInfos = computed(() => props.slotParams?.chillerRuleInfos ?? (() => []));
    const pointRuleInfoFields = computed(() => props.slotParams?.pointRuleInfoFields);
    const hasField = computed(() => props.slotParams?.hasField);
    const defaultDataByCode = computed(() => props.slotParams?.defaultDataByCode);
    const validator = computed(() => props.slotParams?.validator);
    const getValueBase = computed(() => props.slotParams?.getValueBase);
    const getChillerItemData = computed(() => props.slotParams?.getChillerItemData);
    const isCoolInput = computed(() => props.slotParams?.isCoolInput?.value);
    const isAirZone = computed(() => props.slotParams?.isAirZone?.value);
    const needInitRendered = computed(() => props.slotParams?.needInitRendered);
    const hasValidateErr = computed(() => props.slotParams?.hasValidateErr);
    const getFieldDefine = computed(() => props.slotParams?.getFieldDefine);
    const isEditDisabled = computed(() => props.slotParams?.isEditDisabled?.value);
    const isOpen = computed(() => props.slotParams?.isOpen?.value);
    const currentStrategyRule = computed(() => props.slotParams?.currentStrategyRule?.value);
    const curMainClassCode = computed(() => props.slotParams?.curMainClassCode?.value);
    const registerRef = computed(() => props.slotParams?.registerRef);
    const index = computed(() => props.slotParams?.index);
    const baseData = computed(() => props.slotParams?.baseData);

    const isEnableCtrlDataClose = computed(() => {
        return enableCtrlData.value === 'CLOSE';
    });
    const isCoolingSupplySwitchSetClose = computed(() => {
        return coolingSupplySwitchSetData.value === 'CLOSE';
    });
    const isHeatingSwitchSetClose = computed(() => {
        return heatingSwitchSetData.value === 'CLOSE';
    });
    const isAirConditionDemandDataClose = computed(() => {
        return airConditionDemandData.value === 'CLOSE';
    });

    const coolingModeOptions = computed(() => {
        const arr = [];
        if (isCoolingSupplySwitchSetClose.value) {
            return arr;
        }
        if (isEditDisabled.value) {
            COOLMODE_OPTION_ARR.forEach(code => {
                if (coolingMode.value?.includes(code)) {
                    const val = COOL_MODE_OPTION_DEFINE[code];
                    if (val) {
                        arr.push({ ...val });
                    }
                }
            });
        } else {
            if (currentStrategyRule.value?.coolingSupplySwitchSet) {
                const val = COOL_MODE_OPTION_DEFINE[COOLMODE.CHILLER_COOL];
                const chillerRuleList = currentStrategyRule.value?.pointRuleInfo?.chillerRuleInfos;
                if (val && chillerRuleList?.length > 0) {
                    const validatorList = chillerRuleInfos.value(chillerRuleList);
                    if (validatorList?.some(obj => CHILLER_COOL_MODE_ALLOWED_CODES[obj.chillerType])) {
                        arr.push({ ...val });
                    }
                }
            }

            if (arr.length === 1) {
                coolingMode.value = [arr[0].value];
            }
        }
        return arr;
    });

    const hasCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.CHILLER_COOL);
    });

    const hasCoolingMode = computed(() => {
        return props.consoleType === CONSOLE_TYPE_MAP?.COOL_SUPPLY?.id && coolingModeOptions.value?.length > 0;
    });
    const isHeatSupply = computed(() => {
        return props.consoleType === CONSOLE_TYPE_MAP?.HEAT_SUPPLY?.id;
    });

    watch(
        () => props.data,
        () => {
            if (props.slotParams?.resetCore && typeof props.slotParams.resetCore === 'function') {
                props.slotParams.resetCore();
            }
            reset();
            if (props.data?.isOld && props.data?.coolModes) {
                coolingMode.value = props.data.coolModes;
            }
        },
        { immediate: true }
    );

    return {
        isCoolingSupplySwitchSetClose,
        coolingSupplySwitchSetData,
        heatingSwitchSetData,
        isHeatingSwitchSetClose,
        isEnableCtrlDataClose,
        enableCtrlData,
        coolingModeOptions,
        hasCoolingSupply,
        coolingMode,
        chillerRuleInfos,
        pointRuleInfoFields,
        hasField,
        defaultDataByCode,
        validator,
        getValueBase,
        getChillerItemData,
        isCoolInput,
        isAirZone,
        needInitRendered,
        hasValidateErr,
        getFieldDefine,
        isEditDisabled,
        isOpen,
        currentStrategyRule,
        curMainClassCode,
        registerRef,
        index,
        baseData,
        hasCoolingMode,
        isHeatSupply,
        airConditionDemandData,
        isAirConditionDemandDataClose
    };
};
