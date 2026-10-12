import i18n from '@/localization';
/* eslint-disable camelcase */
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { COOLMODE, formatTime, COOLMODE_OPTION_ARR, CHILLER_COOL_MODE_ALLOWED_CODES, COOL_MODE_OPTION_DEFINE } from './timetableConfig';
dayjs.extend(isToday);
import { getFieldDefineKey } from './useTimetableEditor';

export const strategyTimeKey = Symbol('strategyTimeKey'); //策略时间

// 双工况冷机开启台数 类型
const DUAL_CODES = {
    BASE_DUAL: true,
    ACCCCC_DUAL: true,
    ACCCSC_DUAL: true,
    ACCCWH_DUAL: true,
    ACCCGH_DUAL: true
};

const useRefRegistry = props => {
    const allRefs = ref(new Map());
    const refCounter = ref(0);

    const registerRef = (el, context) => {
        if (!el) return;

        const elKey = `__refId${props.data?.sign}`;

        if (el.$el) {
            if (!el.$el[elKey]) {
                const id = `ref_${refCounter.value++}`;
                el.$el[elKey] = id;
                el.$el.setAttribute(elKey, id);
            }
            allRefs.value.set(el.$el[elKey], { ref: el, context });
        }
    };

    const getOrderedRefs = () => {
        const elKey = `__refId${props.data?.sign}`;
        const elements = Array.from(document.querySelectorAll(`[${elKey}]`));
        return elements.map(el => ({
            id: el[elKey],
            ref: allRefs.value.get(el[elKey])?.ref,
            context: allRefs.value.get(el[elKey])?.context
        }));
    };

    onBeforeUpdate(() => {
        const elKey = `__refId${props.data?.sign}`;
        const validIds = new Set(Array.from(document.querySelectorAll(`[${elKey}]`)).map(el => el[elKey]));

        allRefs.value.forEach((_, id) => {
            if (!validIds.has(id)) {
                allRefs.value.delete(id);
            }
        });
    });

    return {
        allRefs,
        registerRef,
        getOrderedRefs
    };
};

export const useTimetableEditorItemCore = props => {
    const strategyRule = computed(() => props.strategyRule) || {};
    const getFieldDefine = inject(getFieldDefineKey);
    const isCoolInput = computed(() => props.isCoolInput);
    const isAirZone = computed(() => props.isAirZone);
    const chillerOrder = computed(() => props.chillerOrder);
    const isOpen = ref(!!props.data?.defaultOpen);
    const needInitRendered = ref(!!props.data?.defaultOpen);
    const hasValidateErr = ref(false);

    const resetCore = () => {
        isOpen.value = !!props.data?.defaultOpen;
        hasValidateErr.value = false;
    };

    const pointRuleInfoFields = obj => {
        if (!obj) {
            return;
        }
        const fields = ['equipFreqSet', 'chillWaterDetaTempSet', 'chillWaterOutTempSet', 'worstTerminalDetaPressSet', 'chillWaterDetaPressSet'];
        return fields.filter(k => {
            return obj[k];
        });
    };
    const chillerRuleInfos = list => {
        // console.log('list: ', list);
        let hadDual = false;
        return list
            ?.filter(obj => {
                const numRUle = obj.chillerLNum || obj.chillerM1Num || obj.chillerSNum;
                // 双工况冷机开启台数 只取一个
                if (DUAL_CODES[obj.chillerType]) {
                    if (!hadDual) {
                        hadDual = true;
                        return numRUle;
                    } else {
                        return false;
                    }
                }
                // 根据点位
                return obj.chillerType && (obj.chillerLNum || obj.chillerM1Num || obj.chillerSNum);
            })
            .sort((objA, objB) => (chillerOrder[objA.chillerType] ?? 0) - (chillerOrder[objB.chillerType] ?? 0));
    };

    const isEditDisabled = computed(() => {
        return props.data?.isEditDisabled;
    });
    const currentStrategyRule = computed(() => {
        if (isEditDisabled.value) {
            return props.data;
        } else {
            return strategyRule?.value;
        }
    });
    const curMainClassCode = computed(() => {
        return strategyRule?.value?.classCode;
    });
    const hasField = field => {
        if (currentStrategyRule.value) {
            return currentStrategyRule.value[field];
        }
        return false;
    };

    // 获取默认值
    const defaultDataByCode = (field, objectId) => {
        let arr = props.data?.pointInfos;
        if (objectId) {
            arr = props.data?.objectInfos?.find(obj => obj.objectId === objectId)?.pointInfos;
        }
        return props.data?.isOld && arr?.find(obj => obj?.hasOwnProperty(field));
    };
    const getChillerItemData = (chillerType, objectId) => {
        let sourceData = props?.data;
        if (objectId) {
            sourceData = props.data?.objectInfos?.find(obj => obj.objectId === objectId);
        }
        return props?.data?.isOld ? sourceData?.pointInfos?.find(obj => obj.chillerType === chillerType) : null;
    };
    const toggleOpen = () => {
        if (!needInitRendered.value) {
            needInitRendered.value = true;
        }
        isOpen.value = !isOpen.value;
    };

    const validator = async () => {
        const validatorRst = { status: true };

        // 编辑禁用的不用校验
        if (isEditDisabled.value) {
            return validatorRst;
        }
        // 老数据且未初始化渲染过
        if (props.data?.isOld && !needInitRendered.value) {
            return validatorRst;
        }
        hasValidateErr.value = false;
        let hasErr = false,
            errMsg = '',
            isAllEmpty = true,
            errProp = '';
        const refInfoArr = getOrderedRefs();
        if (refInfoArr) {
            for (let i in refInfoArr) {
                const obj = refInfoArr[i];
                if (!obj) {
                    continue;
                }
                const component = obj.ref;
                const k = obj.context;
                if (component) {
                    if (component.validator) {
                        const { status, errorMsg, prop } = await component.validator();
                        if (!status) {
                            hasErr = true;
                            errMsg = errorMsg;
                            errProp = prop;
                            break;
                        } else {
                            // 非策略时间字段，输入值不为空
                            if (isAllEmpty && k !== 'strategyTime' && !component.isAllEmpty()) {
                                isAllEmpty = false;
                            }
                        }
                    }
                }
            }
        }

        hasValidateErr.value = hasErr;
        if (!hasErr && isAllEmpty) {
            hasValidateErr.value = true;
            hasErr = true;
            errMsg = i18n.global.t('meos_control_web.configure_at_least_one_item_per_time_slot');
            errProp = 'time-area-' + props.index;
        }
        return { status: !hasErr, errorMsg: errMsg, errProp };
    };
    const getValueBase = () => {
        // 老数据且未初始化渲染过,返回接口原本查到的数据
        if (props.data?.isOld && !needInitRendered.value) {
            const planData = props.data.originStrategyPlan;
            planData.strategyTime = formatTime(props.data.strategyTime);
            return planData;
        }
        const strategyPlan = {};
        const objectInfos =
            currentStrategyRule.value?.objectRuleInfos?.map(obj => {
                return {
                    objectId: obj.objectId,
                    classCode: obj.classCode,
                    localName: obj.localName,
                    pointInfos: []
                };
            }) || [];

        // 遍历输入组件，取值
        const refInfoArr = getOrderedRefs();
        if (refInfoArr) {
            const pointInfos = [];
            for (let i in refInfoArr) {
                const obj = refInfoArr[i];
                if (!obj) {
                    continue;
                }
                const component = obj.ref;
                const k = obj.context;
                if (component) {
                    if (component.isAllEmpty) {
                        if (!component.isAllEmpty()) {
                            const valObj = component.getValue();
                            if (k.startsWith('objectRuleInfos-')) {
                                const keys = k.split('-');
                                const idx = keys[keys.length - 1];
                                if (objectInfos[idx]) {
                                    objectInfos[idx].pointInfos.push(valObj);
                                }
                            } else {
                                pointInfos.push(valObj);
                            }
                        }
                    } else {
                        if (k === 'strategyTime') {
                            const valObj = component.getValue();
                            strategyPlan.strategyTime = formatTime(valObj.value);
                        } else if (k === 'coolingMode' && component.getValue) {
                            const val = component.getValue();
                            if (val?.length > 0) {
                                strategyPlan.coolModes = val.sort((a, b) => {
                                    return COOLMODE_OPTION_ARR.indexOf(a) - COOLMODE_OPTION_ARR.indexOf(b);
                                });
                            }
                            // console.log('component', component, k, val);
                        }
                    }
                }
            }

            strategyPlan.pointInfos = pointInfos;
            strategyPlan.objectInfos = objectInfos.filter(obj => obj.pointInfos?.length > 0);
        }
        return strategyPlan;
    };
    const { allRefs, registerRef, getOrderedRefs } = useRefRegistry(props);

    // 策略时间 - 供子组件使用（不再使用 provide）
    const strategyTime = computed(() => props.data?.strategyTime);

    return {
        toggleOpen,
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
        allRefs,
        resetCore,
        strategyTime // 新增：供子组件使用
    };
};

export const useTimetableEditorItemDefaultContent = (props, core) => {
    const consoleTypes = computed(() => props.consoleTypes);
    const coolModeOptionDefine = computed(() => props.coolModeOptionDefine || COOL_MODE_OPTION_DEFINE);
    const coolingSupplySwitchSetData = ref('');
    const coolingStorageSwitchSetData = ref('');
    const airConditionDemandData = ref('');
    const enableCtrlData = ref('');
    const coolingMode = ref([]);

    const resetDefault = () => {
        coolingMode.value = [];
    };

    const isEnableCtrlDataClose = computed(() => {
        return enableCtrlData.value === 'CLOSE';
    });
    const isCoolingSupplySwitchSetClose = computed(() => {
        return coolingSupplySwitchSetData.value === 'CLOSE';
    });
    const isAirConditionDemandDataClose = computed(() => {
        return airConditionDemandData.value === 'CLOSE';
    });
    const isCoolingStorageSwitchSetClose = computed(() => {
        return coolingStorageSwitchSetData.value === 'CLOSE';
    });
    const coolingModeOptions = computed(() => {
        const arr = [];
        if (isCoolingSupplySwitchSetClose.value) {
            return arr;
        }
        if (core.isEditDisabled?.value) {
            COOLMODE_OPTION_ARR.forEach(code => {
                if (coolingMode.value?.includes(code)) {
                    const val = coolModeOptionDefine.value[code];
                    if (val) {
                        arr.push({ ...val });
                    }
                }
            });
        } else {
            if (core.currentStrategyRule.value?.coolingSupplySwitchSet) {
                const val = coolModeOptionDefine.value[COOLMODE.CHILLER_COOL];
                const chillerRuleList = core.currentStrategyRule.value?.pointRuleInfo?.chillerRuleInfos;
                if (val && chillerRuleList?.length > 0) {
                    const validatorList = core.chillerRuleInfos(chillerRuleList);
                    if (validatorList?.some(obj => CHILLER_COOL_MODE_ALLOWED_CODES[obj.chillerType])) {
                        arr.push({ ...val });
                    }
                }
            }
            if (core.currentStrategyRule.value?.districtCoolingPlateSwitchSet) {
                const val = coolModeOptionDefine.value[COOLMODE.CITY_COOL];
                if (val) {
                    arr.push({ ...val });
                }
            }
            if (core.currentStrategyRule.value?.dischargeCoolingSwitchSet) {
                const val = coolModeOptionDefine.value[COOLMODE.DE_ICE_COOL];
                if (val) {
                    arr.push({ ...val });
                }
            }
            if (core.currentStrategyRule.value?.freeCoolingSwitchSet) {
                const val = coolModeOptionDefine.value[COOLMODE.FREE_COOL];
                if (val) {
                    arr.push({ ...val });
                }
            }
            if (arr.length === 1) {
                coolingMode.value = [arr[0].value];
            }
        }
        return arr;
    });

    const hasCoolingMode = computed(() => {
        return props.consoleType === consoleTypes.value?.COOL_SUPPLY?.id && coolingModeOptions.value?.length > 0;
    });

    const hasCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.CHILLER_COOL);
    });
    const hasDischargeCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.DE_ICE_COOL);
    });
    const hasRegionalPlateCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.CITY_COOL);
    });
    const hasFreeCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.FREE_COOL);
    });

    watch(isCoolingSupplySwitchSetClose, () => {
        if (isCoolingSupplySwitchSetClose.value) {
            coolingMode.value = [];
        }
    });

    watch(
        () => props.data,
        () => {
            core.resetCore();
            resetDefault();
            if (props.data?.isOld && props.data?.coolModes) {
                coolingMode.value = props.data.coolModes;
            }
        },
        { immediate: true }
    );

    const getValue = () => {
        const strategyPlan = core.getValueBase();
        if (coolingMode.value?.length) {
            strategyPlan.coolModes = coolingMode.value?.sort((a, b) => {
                return COOLMODE_OPTION_ARR.indexOf(a) - COOLMODE_OPTION_ARR.indexOf(b);
            });
        }
        return strategyPlan;
    };

    return {
        getValue,
        coolingStorageSwitchSetData,
        isCoolingStorageSwitchSetClose,
        airConditionDemandData,
        isAirConditionDemandDataClose,
        enableCtrlData,
        isEnableCtrlDataClose,
        coolingSupplySwitchSetData,
        isCoolingSupplySwitchSetClose,
        coolingModeOptions,
        hasCoolingSupply,
        hasRegionalPlateCoolingSupply,
        hasDischargeCoolingSupply,
        hasFreeCoolingSupply,
        hasCoolingMode,
        coolingMode
    };
};
