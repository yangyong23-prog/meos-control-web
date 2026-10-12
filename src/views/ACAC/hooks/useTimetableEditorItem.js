import i18n from '@/localization';
/* eslint-disable camelcase */
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { COOLMODE, formatTime, COOl_MODE_OPTION_DEFINE, COOLMODE_OPTION_ARR, CHILLER_COOL_MODE_ALLOWED_CODES } from './timetableConfig';
import { CONSOLE_TYPES, CHILLER_ORDER } from '../variables';
import { strategyRuleKey, getFieldDefineKey, isCoolInputKey, isAirZoneKey } from '@/views/ACAC/hooks/useTimetableEditor';
dayjs.extend(isToday);

export const strategyTimeKey = Symbol('strategyTimeKey'); //策略时间

// 双工况冷机开启台数 类型
const DUAL_CODES = {
    BASE_DUAL: true,
    ACCCCC_DUAL: true,
    ACCCSC_DUAL: true,
    ACCCWH_DUAL: true,
    ACCCGH_DUAL: true
};

export default props => {
    // 保存中

    const strategyRule = inject(strategyRuleKey);

    const getFieldDefine = inject(getFieldDefineKey);
    const isCoolInput = inject(isCoolInputKey);
    const isAirZone = inject(isAirZoneKey);

    const itemRefs = ref({});
    // 勾选的供冷模式
    const coolingMode = ref([]);
    // 供冷开关设定值
    const coolingSupplySwitchSetData = ref('');
    // 蓄冷开关设定值
    const coolingStorageSwitchSetData = ref('');
    // 空调分区开关设定值
    const airConditionDemandData = ref('');
    // 泵组分区设备开关设定
    const enableCtrlData = ref('');
    const isOpen = ref(!!props.data?.defaultOpen);
    // 需要初始化渲染所有组件： 为优化渲染性能，
    const needInitRendered = ref(!!props.data?.defaultOpen);
    const hasValidateErr = ref(false);

    const reset = () => {
        isOpen.value = !!props.data?.defaultOpen;
        coolingMode.value = [];
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
            .sort((objA, objB) => (CHILLER_ORDER[objA.chillerType] ?? 0) - (CHILLER_ORDER[objB.chillerType] ?? 0));
    };

    const isEditDisabled = computed(() => {
        // return props.data?.isOld && isPastTimeFunc(props.data.strategyTime);
        return props.data?.isEditDisabled;
    });
    const currentStrategyRule = computed(() => {
        // 如果是编辑的老数据切是过期的时刻
        if (isEditDisabled.value) {
            // return dataToStrategyRule(props.data);
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
        // console.log('sourceData: ', objectId);
        let sourceData = props?.data;
        if (objectId) {
            sourceData = props.data?.objectInfos?.find(obj => obj.objectId === objectId);
        }
        return props?.data?.isOld ? sourceData?.pointInfos?.find(obj => obj.chillerType === chillerType) : null;
    };
    // 泵组模式
    const isEnableCtrlDataClose = computed(() => {
        return enableCtrlData.value === 'CLOSE';
    });
    // 有供冷模式
    const isCoolingSupplySwitchSetClose = computed(() => {
        // 供冷
        return coolingSupplySwitchSetData.value === 'CLOSE';
    });
    const isAirConditionDemandDataClose = computed(() => {
        return airConditionDemandData.value === 'CLOSE';
    });
    // 蓄冷开关设定为关闭
    const isCoolingStorageSwitchSetClose = computed(() => {
        return coolingStorageSwitchSetData.value === 'CLOSE';
    });
    const coolingModeOptions = computed(() => {
        const arr = [];
        if (isCoolingSupplySwitchSetClose.value) {
            return arr;
        }
        if (isEditDisabled?.value) {
            COOLMODE_OPTION_ARR.forEach(code => {
                if (coolingMode.value?.includes(code)) {
                    const val = COOl_MODE_OPTION_DEFINE[code];
                    if (val) {
                        arr.push({ ...val });
                    }
                }
            });
        } else {
            // 根据点位规则添加选项
            // 冷机供冷
            if (currentStrategyRule.value?.coolingSupplySwitchSet) {
                const val = COOl_MODE_OPTION_DEFINE[COOLMODE.CHILLER_COOL];
                // 供冷模式中“冷机供冷”模式，需要根据是否有冷机对象来做显隐，即：有冷机开启台数、离心机开启台数、螺杆机开启台数、双工况冷机开启台数、空气源热泵控制组开启台数、地源热泵开启台数、水源热泵开启台数、吸收式冷水机组开启台数任何一个参数。
                // 判断是否有相关的冷机
                const chillerRuleList = currentStrategyRule.value?.pointRuleInfo?.chillerRuleInfos;
                if (val && chillerRuleList?.length > 0) {
                    const validatorList = chillerRuleInfos(chillerRuleList);
                    if (validatorList?.some(obj => CHILLER_COOL_MODE_ALLOWED_CODES[obj.chillerType])) {
                        arr.push({ ...val });
                    }
                }
                // if (val) {
                //     arr.push({ ...val });
                // }
            }
            // 区域板换供冷
            if (currentStrategyRule.value?.districtCoolingPlateSwitchSet) {
                const val = COOl_MODE_OPTION_DEFINE[COOLMODE.CITY_COOL];
                if (val) {
                    arr.push({ ...val });
                }
            }
            // 放冷供冷
            if (currentStrategyRule.value?.dischargeCoolingSwitchSet) {
                const val = COOl_MODE_OPTION_DEFINE[COOLMODE.DE_ICE_COOL];
                if (val) {
                    arr.push({ ...val });
                }
                // arr.push({ label: '放冷供冷', value: COOLMODE.DE_ICE_COOL });
            }
            // 免费冷供冷
            if (currentStrategyRule.value?.freeCoolingSwitchSet) {
                const val = COOl_MODE_OPTION_DEFINE[COOLMODE.FREE_COOL];
                if (val) {
                    arr.push({ ...val });
                }
            }
            // 新建时，切只有一个选项，默认选中
            if (arr.length === 1) {
                coolingMode.value = [arr[0].value];
            }
        }
        return arr;
    });

    // 有供冷模式
    const hasCoolingMode = computed(() => {
        // 供冷
        return props.consoleType === CONSOLE_TYPES.COOL_SUPPLY.id && coolingModeOptions.value?.length > 0;
    });

    // 有冷机供冷
    const hasCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.CHILLER_COOL);
    });
    // 有放冷供冷
    const hasDischargeCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.DE_ICE_COOL);
    });
    const hasRegionalPlateCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.CITY_COOL);
    });
    // 有免费冷供冷
    const hasFreeCoolingSupply = computed(() => {
        return !isCoolingSupplySwitchSetClose.value && coolingMode.value.includes(COOLMODE.FREE_COOL);
    });

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
                    } else {
                        console.log('k,: ', k);
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
    watch(isCoolingSupplySwitchSetClose, () => {
        if (isCoolingSupplySwitchSetClose.value) {
            coolingMode.value = [];
        }
    });

    watch(
        () => props.data,
        () => {
            reset();
            // 回显供冷模式，
            if (props.data?.isOld) {
                if (props.data?.coolModes) {
                    coolingMode.value = props.data.coolModes;
                }
            }
        },
        { immediate: true }
    );

    const getValue = () => {
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
                            // console.log('valObj: ', k, valObj);
                            if (k.startsWith('objectRuleInfos-')) {
                                const keys = k.split('-');
                                const idx = keys[keys.length - 1];
                                if (objectInfos[idx]) {
                                    objectInfos[idx].pointInfos.push(valObj);
                                }
                                // console.log('k-objectRuleInfos: ', k, valObj);
                            } else {
                                pointInfos.push(valObj);
                            }
                        }
                    } else {
                        if (k === 'strategyTime') {
                            const valObj = component.getValue();
                            strategyPlan.strategyTime = formatTime(valObj.value);
                        }
                    }
                }
            }

            strategyPlan.pointInfos = pointInfos;
            strategyPlan.objectInfos = objectInfos.filter(obj => obj.pointInfos?.length > 0);
        }

        if (coolingMode.value?.length) {
            strategyPlan.coolModes = coolingMode.value?.sort((a, b) => {
                return COOLMODE_OPTION_ARR.indexOf(a) - COOLMODE_OPTION_ARR.indexOf(b);
            });
        }
        return strategyPlan;
    };

    // 用于存储所有 ref 的 Map（保持插入顺序）
    const allRefs = ref(new Map());
    // 用于生成唯一标识的计数器
    const refCounter = ref(0);

    // 注册 ref 的函数
    const registerRef = (el, context) => {
        if (!el) return; // 处理卸载情况

        const elKey = `__refId${props.data?.sign}`;

        if (el.$el) {
            // 为元素/组件生成唯一标识
            if (!el.$el[elKey]) {
                const id = `ref_${refCounter.value++}`;
                el.$el[elKey] = id; // 设置property
                el.$el.setAttribute(elKey, id); // 设置attribute，以便querySelectorAll可以选中
                // el.$el.__refId = `ref_${refCounter.value++}`;
            }
        }

        // 存储到 Map 中（按注册顺序）
        allRefs.value.set(el.$el[elKey], { ref: el, context });
    };

    // 按 DOM 顺序获取 ref 列表
    const getOrderedRefs = () => {
        const elKey = `__refId${props.data?.sign}`;
        // 1. 获取页面所有包含 __refId 的元素
        const elements = Array.from(document.querySelectorAll(`[${elKey}]`));
        // console.log('elements: ', elements);

        // 2. 按 DOM 顺序排序
        return elements.map(el => ({
            id: el[elKey],
            ref: allRefs.value.get(el[elKey])?.ref,
            context: allRefs.value.get(el[elKey])?.context
        }));
    };

    // 组件更新前清理无效 ref
    onBeforeUpdate(() => {
        const elKey = `__refId${props.data?.sign}`;
        const validIds = new Set(Array.from(document.querySelectorAll(`[${elKey}]`)).map(el => el[elKey]));

        // 删除不存在的 ref
        allRefs.value.forEach((_, id) => {
            if (!validIds.has(id)) {
                allRefs.value.delete(id);
            }
        });
    });

    provide(
        strategyTimeKey,
        computed(() => props.data?.strategyTime)
    );

    return {
        toggleOpen,
        chillerRuleInfos,
        pointRuleInfoFields,
        hasField,
        defaultDataByCode,
        validator,
        getValue,
        getChillerItemData,
        isCoolInput,
        isAirZone,
        needInitRendered,
        hasValidateErr,
        coolingStorageSwitchSetData,
        isCoolingStorageSwitchSetClose,
        airConditionDemandData,
        isAirConditionDemandDataClose,
        enableCtrlData,
        isEnableCtrlDataClose,
        coolingSupplySwitchSetData,
        isCoolingSupplySwitchSetClose,
        coolingModeOptions,
        getFieldDefine,
        hasCoolingSupply,
        hasRegionalPlateCoolingSupply,
        hasDischargeCoolingSupply,
        hasFreeCoolingSupply,
        hasCoolingMode,

        isEditDisabled,
        coolingMode,
        isOpen,
        currentStrategyRule,
        curMainClassCode,
        registerRef,
        allRefs
    };
};
