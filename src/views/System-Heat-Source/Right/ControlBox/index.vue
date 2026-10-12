<template>
    <div class="control-main">
        <div class="control-main-header fcb">
            <div class="left-content">
                <div v-if="consoleTypesTabs.length === 1" class="fw600 fs16">
                    {{ consoleTypesTabs[0].name }}
                </div>
                <m-tabs
                    v-if="consoleTypesTabs.length > 1"
                    v-model="consoleTypes"
                    size="large"
                    :data="consoleTypesTabs"
                    :scroll-position="'end'"
                    style="margin-left: -12px"
                    @change="changeConsoleTypes"
                />
            </div>
            <div class="fcc right-btn-group">
                <m-button type="link" size="medium" @click="openTimeTableFun">{{ CONSOLE_TYPES[consoleTypes].timeTableName }}</m-button>
                <div style="background-color: var(--gray-300); width: 1px; height: 14px"></div>
                <m-button
                    type="icon"
                    icon="IconMeriActionSetting"
                    :content="i18n.global.t('meos_control_web.system_settings')"
                    size="medium"
                    show-tip
                    @click="openSystemInfo"
                ></m-button>
            </div>
        </div>
        <div class="control-main-content">
            <template v-if="consoleTypes === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id">
                <AirBox
                    :control-list-data="controlListData"
                    :active-set-form-data="activeSetFormData"
                    :system-id="currentSystem.systemId"
                    :console-types="consoleTypes"
                    :system-type="SYSTEM_CLASS_CODE"
                    @open-set-form="openSetForm"
                    @open-space-list="openSpaceList"
                    @show-plan-list="showPlanList"
                />
            </template>
            <template v-else>
                <ControlItem
                    v-for="item in controlListData"
                    :key="item.infoCode"
                    :data="item"
                    :class="item.infoCode"
                    :system-id="currentSystem.systemId"
                    :console-types="consoleTypes"
                    :system-type="SYSTEM_CLASS_CODE"
                >
                    <template #default="{ manualAutoSetData }">
                        <component
                            :is="CONTROL_CONFIG_FUN(item).component"
                            :id="currentSystem.systemId"
                            v-bind="disabledFun(item)"
                            :data="item"
                            :active-set-form-data="activeSetFormData"
                            :manual-auto-set-data="manualAutoSetData"
                            :system-id="currentSystem.systemId"
                            :console-types="consoleTypes"
                            :system-type="SYSTEM_CLASS_CODE"
                            @open-set-form="e => openSetForm(e, item)"
                            @show-plan-list="showPlanList"
                        >
                            <template v-if="item.infoCode === MUNICIPAL_HEATING_PLATE_HEAT_EXCHANGER_SWITCH_SET" #header>
                                <m-tips :content="i18n.global.t('meos_control_web.municipal_heating_plate_heat_exchanger_switch_set')" theme="darkTransparent">
                                    <div class="fcc icon-info">
                                        <SvgIcon name="info" />
                                    </div>
                                </m-tips>
                            </template>
                        </component>
                    </template>
                </ControlItem>
            </template>
        </div>
        <ControlForm
            ref="ControlFormRef"
            v-model="isOpen"
            width="370px"
            :system-id="currentSystem.systemId"
            :virtual-ref="virtualRef"
            :form-list="formList"
            :relate-form-list="relateFormList"
            @submit="handleSubmit"
            @close="closeForm"
        />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { currentSystemKey, isShowTimeTableKey, chillerDataKey, openSpaceListKey } from '@/views/System-Heat-Source/hooks/useBaseHook';
import { consoleIsCloseKey, consoleTypesKey, getAirControlListDataKey, getControlListDataKey } from '@/views/System-Heat-Source/hooks/useRightHook';
import {
    AIR_CONDITION_DEMAND,
    CONSOLE_TYPES,
    ENABLE_CTRL,
    HEATING_SWITCH_SAFETY_STATUS,
    HEATING_SWITCH_SET,
    MUNICIPAL_HEATING_PLATE_HEAT_EXCHANGER_SWITCH_SET,
    showSystemInfoKey,
    SYSTEM_CLASS_CODE
} from '@/views/System-Heat-Source/constant/variable';
import SetButton from '@/components/common/SetButton.vue';
import { isEdge } from '@/utils/envUtils';
import ControlItem from '@/components/SystemControl/ControlItem.vue';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import AirBox from '@/components/SystemControl/AirBox.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { CONTROL_CONFIG_FUN, isLockV2 } from '@/components/SystemControl/config';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import FormCooler from '@/components/ObjectInfoComponents/ControlForm/FormCooler.vue';
import { getNextFiveMinutePoint, useSuccessMessage } from '@/utils/tools';
import { INTERVENTION_TIME_V2, REASON, REASON_SELECT } from '@/components/ObjectInfoComponents/ControlForm/config';
import dayjs from 'dayjs';
import { IS_OPEN, OTHER_REASON, SUCCESSCODE } from '@/utils/globalVariables';
import { cloneDeep, isArray, isObject } from 'lodash';
import { consoleSwitchSet } from '@/apis/ACAC';
import SvgIcon from '@/components/SystemControl/SvgIcon.vue';

const ControlFormRef = ref(null);
const { getIotData } = DockSingleton.getInstance();
const openSpaceList = inject(openSpaceListKey);
const props = defineProps({
    consoleTypesTabs: {
        type: Array,
        default: () => []
    },
    controlListData: {
        type: Array,
        default: () => []
    }
});
const chillerData = inject(chillerDataKey, ref({}));
const consoleTypes = inject(consoleTypesKey, ref(''));
const currentSystem = inject(currentSystemKey, ref({}));
const consoleIsClose = inject(consoleIsCloseKey, ref(false));
const showSystemInfo = inject(showSystemInfoKey, ref(false));
const isShowTimeTable = inject(isShowTimeTableKey, ref(false));
const getControlListData = inject(getControlListDataKey); // 刷新设备控制列表
const getAirControlListData = inject(getAirControlListDataKey); // 刷新空调分区控制列表
const currentData = ref({});

const isOpen = ref(false);
const virtualRef = ref(null);
const formList = ref([]);
const relateFormList = ref([]);
const openTimeTableFun = () => {
    closeForm();
    isShowTimeTable.value = true;
    currentSystem.value.consoleTypes = consoleTypes.value;
};
const openSystemInfo = () => {
    closeForm();
    showSystemInfo.value = true;
};
const disabledFun = item => {
    let disabledText = item.infoCodeName + i18n.global.t('meos_control_web.locked_cannot_modify');
    if (consoleIsClose.value && item.infoCode !== HEATING_SWITCH_SET) {
        disabledText = i18n.global.t('meos_control_web.name_cannot_operate', {
            name: i18n.global.t('meos_control_web.heat_supply')
        });
    }
    //  控制台界面中控制参数的实际值正常显示，设定值均显示--，修改操作均置灰（hover给出提示：供热开关安全状态锁定时不可操作）。
    const lock = getIotData(currentSystem.value.systemId, HEATING_SWITCH_SAFETY_STATUS);
    if (isLockV2(lock) && item.infoCode !== HEATING_SWITCH_SET) {
        disabledText = i18n.global.t('meos_control_web.heatting_locked_cannot_modify');
        return {
            disabled: true,
            disabledText,
            disabledNoValue: item.infoCode !== HEATING_SWITCH_SET,
            lockDisabled: true
        };
    }
    if (item.infoCode === HEATING_SWITCH_SET) {
        if (isLockV2(lock)) {
            return {
                disabled: true,
                disabledText,
                disabledNoValue: item.infoCode !== HEATING_SWITCH_SET && consoleIsClose.value,
                lockDisabled: true
            };
        }
        return {
            disabled: false,
            disabledText: ''
        };
    }
    if (consoleIsClose.value) {
        return {
            disabled: true,
            disabledText,
            disabledNoValue: true
        };
    }
    return {
        disabled: false,
        disabledText: ''
    };
};
const openSetForm = async (e, item) => {
    if (item.infoCode === currentData.value.infoCode && item.id === currentData.value.id) {
        return;
    }
    closeForm();
    await nextTick();
    virtualRef.value = e;
    isOpen.value = true;
    formList.value = [];
    currentData.value = item;
    formList.value.unshift(
        REASON_SELECT(params => {
            if (
                item.infoCode === HEATING_SWITCH_SET ||
                item.infoCode === MUNICIPAL_HEATING_PLATE_HEAT_EXCHANGER_SWITCH_SET ||
                item.infoCode === ENABLE_CTRL ||
                item.infoCode === AIR_CONDITION_DEMAND
            ) {
                // 操作：选择开启
                if (params[item.infoCode] === '1') {
                    return CONSOLE_TYPES[consoleTypes.value].reason.open || [];
                }
                // 操作：选择关闭
                if (params[item.infoCode] === '0') {
                    return CONSOLE_TYPES[consoleTypes.value].reason.close || [];
                }
                return [];
            }
            return CONSOLE_TYPES[consoleTypes.value].reason.default || [];
        })
    );
    formList.value.unshift(
        INTERVENTION_TIME_V2(`${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(3, 'day').format('YYYY.MM.DD HH:mm:00')}`, undefined, undefined, {
            useLongterm: false
        })
    );
    const arr = [];
    const hideArr = [];
    if (item.infoCode === HEATING_SWITCH_SET) {
        props.controlListData.forEach(controlItem => {
            if (item.infoCode !== controlItem.infoCode && controlItem.id === item.id) {
                arr.push(setItemForm(controlItem, false));
                hideArr.push(setItemForm(controlItem, false, true)); // 用于隐藏
            }
        });
    }
    if (item.infoCode === ENABLE_CTRL) {
        props.controlListData.forEach(controlItem => {
            if (item.infoCode === controlItem.infoCode && controlItem.id === item.id) {
                controlItem.pumpGroupInfoCodes?.forEach(pumpGroupInfoCode => {
                    arr.push(setItemForm(pumpGroupInfoCode, false));
                    hideArr.push(setItemForm(pumpGroupInfoCode, false, true));
                });
            }
        });
    }
    const a = setItemForm(item);
    // 获取控制列表数据 初始值是开启情况
    if (item.infoCode === HEATING_SWITCH_SET || item.infoCode === ENABLE_CTRL) {
        const dataValue = getIotData(item.id, item.infoCode)?.dataValue;
        if (dataValue === IS_OPEN) {
            nextTick(() => {
                relateFormList.value = cloneDeep(arr);
            });
        } else {
            nextTick(() => {
                relateFormList.value = cloneDeep(hideArr);
            });
        }
    }
    const infoCodes = arr.map(v => v.infoCode);
    a.componentAttrs.onChange = val => {
        if (item.infoCode === HEATING_SWITCH_SET || item.infoCode === MUNICIPAL_HEATING_PLATE_HEAT_EXCHANGER_SWITCH_SET) {
            // 操作：清空原因数据
            ControlFormRef.value.params.operateType = '';
            ControlFormRef.value.params.operateReason = '';
        }
        if (item.infoCode === HEATING_SWITCH_SET || item.infoCode === ENABLE_CTRL) {
            // 操作：选择开启
            if (val === IS_OPEN) {
                nextTick(() => {
                    relateFormList.value = cloneDeep(arr);
                });
            } else {
                nextTick(() => {
                    relateFormList.value = cloneDeep(hideArr);
                });
            }
            nextTick(() => {
                for (const key in ControlFormRef.value.params) {
                    // 忽略本身、时间
                    if (key !== item.infoCode && infoCodes.includes(key)) {
                        const element = ControlFormRef.value.params[key];
                        if (isArray(element)) {
                            element.forEach(element => {
                                element.infoCodeValue = '';
                            });
                        } else {
                            ControlFormRef.value.params[key] = '';
                        }
                    }
                }
            });
        }
    };
    formList.value.unshift(a);
};
const setItemForm = (item, required = true, hideDom = false) => {
    const obj = {
        name: item.infoCodeName,
        required,
        // hideDom 用于隐藏显示的dom ，区别时间组件里面的hide字段
        hideDom: hideDom,
        defaultValue: hideDom ? '' : getIotData(item.id, item.infoCode)?.dataValue,
        componentAttrs: {},
        ...item
    };

    if (item.unitsNumberSetValue) {
        obj.component = FormCooler;
        obj.chillerData = chillerData.value;
        obj.isLockV2 = isLockV2;
        obj.id = item.id;
        obj.controlListData = props.controlListData;
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
const showPlanList = () => {
    if (consoleTypes.value === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id) {
        getAirControlListData(false);
    } else {
        getControlListData(consoleTypes.value);
    }
};
/**
 * 组装接口参数
 * @returns {Object} 提交参数对象
 */
const assembleParams = params => {
    const data = {
        systemType: SYSTEM_CLASS_CODE,
        consoleTypes: consoleTypes.value,
        operateType: params.operateReason || (params.operateType === OTHER_REASON ? '' : params.operateType),
        objectId: currentData.value.id,
        systemId: currentSystem.value.systemId
    };

    // 处理截止时间
    data.expireTime = dayjs(params.expireTime).format('YYYYMMDDHHmmss');
    const infoCodes = [];
    const unitsNumbers = [];

    // 遍历表单项，组装infoCodes和unitsNumbers
    [...formList.value, ...relateFormList.value].forEach(item => {
        const paramsValue = structuredClone(params[item.infoCode]);
        if (isObject(paramsValue) || item.isCooler) {
            // 机组参数特殊处理
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
    });
    if (infoCodes.length) {
        data.infoCodes = infoCodes;
    }
    if (unitsNumbers.length) {
        data.unitsNumber = unitsNumbers;
    }

    return data;
};
const handleSubmit = async v => {
    const params = assembleParams(v);
    console.log(params);
    try {
        let urlStr = 'infoCodeSetAndUnitsNumberSet';
        // 空调分区特殊处理
        if (consoleTypes.value === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id && CONSOLE_TYPES.AIR_TERMINAL_ZONE.code.includes(currentData.value?.infoCode)) {
            params.infoCode = params.infoCodes[0].infoCode;
            params.infoCodeValue = params.infoCodes[0].infoCodeValue;
            delete params.infoCodes;
            urlStr = 'airConditionDemandSet';
        }
        // 调用接口
        const res = await consoleSwitchSet(urlStr, params);
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
    }
};
const closeForm = () => {
    isOpen.value = false;
    virtualRef.value = null;
    currentData.value = {};
    formList.value = [];
    relateFormList.value = [];
};
const changeConsoleTypes = val => {
    closeForm();
    if (val.id === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id) {
        getAirControlListData(false);
    } else {
        getControlListData(val.id);
    }
};
</script>
<style lang="less" scoped>
.control-main-header {
    height: 42px;
    border-bottom: 1px solid var(--gray-200);
    width: 100%;
    overflow: visible;
    .left-content {
        flex: 1;
        min-width: 0;
    }
    .right-btn-group {
        white-space: nowrap;
        display: flex;
        gap: 8px;
    }
}
.control-main-content {
    padding-top: 12px;
}
</style>
