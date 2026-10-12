<template>
    <div ref="myHoverableElement" class="wh100 td-box" :style="getStyles">
        <component :is="getComponent()" v-if="isComponent" :id="data.id" :data="{ ...column, ...getInfoCode }" :value="getInfoCode.dataValue" v-bind="disabledFun" />
        <div v-else class="td-box-text fc wh100">
            <TdBoxText :data="data" :column="column" :get-info-code="getInfoCode" v-bind="disabledFun" />
        </div>
    </div>
</template>

<script setup>
import SetValueRadio from '../components/control/SetValueRadio.vue';
import SetValueActionColumn from '../components/control/SetValueActionColumn.vue';
import SetValue from '../components/control/SetValue.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { getColorConfig, getInterveneStatusColorConfig } from '@/utils/viewUtils';
import { canControl } from '@/utils/tools';
import { useElementHover } from '@vueuse/core';
import { useTemplateRef } from 'vue';
import { openRecoveryDateTimeKey, closeRecoveryDateTimeKey } from '../hooks/useTableDataHook';
import { isIotInfoType } from '@/utils/infoTemplate';
import TdBoxText from './TdBoxText.vue';
import { maxBy } from 'lodash';
import { SHOW_TYPE } from '../variables';
import { commonPropsKey } from '../hooks/useBaseHook';
import { INFO_CODE, IOT_SETTING, IS_MANUAL } from '@/utils/globalVariables';
import i18n from '@/localization';
import { isUnrelatedToManualAutoSet } from '@/components/ObjectInfoComponents/utils/index';

const myHoverableElement = useTemplateRef('myHoverableElement');
const isHovered = useElementHover(myHoverableElement, { delayEnter: 500 });
const { getIotData, getCustomInfo } = DockSingleton.getInstance();
const openRecoveryDateTime = inject(openRecoveryDateTimeKey);
const closeRecoveryDateTime = inject(closeRecoveryDateTimeKey);
const commonProps = inject(commonPropsKey);

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    column: {
        type: Object,
        default: () => ({})
    }
});
const isComponent = computed(() => {
    if (!getInfoCode.value.existsIotRule) {
        return false;
    }
    if (props.column.isOperation) {
        return true;
    }
    return props.column.infoCodeType === IOT_SETTING && props.column.showStyle.showType !== SHOW_TYPE.SET_VALUE_ACTION_COLUMN;
});
const getComponent = () => {
    if (props.column.isOperation) {
        return SetValueActionColumn;
    }
    const { showType } = props.column.showStyle;
    switch (showType) {
        case SHOW_TYPE.SET_VALUE_RADIO:
            return SetValueRadio;
        case SHOW_TYPE.SET_VALUE_ACTION_COLUMN:
            return SetValueActionColumn;
        default:
            return SetValue;
    }
};
const getInfoCode = computed(() => {
    // 父级信息码,如果查询到有dataValue并且是数组，则id使用父级信息码的id
    if (props.column.parentInfoCode) {
        const { infoCodeType, infoCode } = props.column.parentInfoCode;
        const parentInfoCode = getCustomInfo(props.data.id, infoCodeType, infoCode);
        const ids = parentInfoCode.dataValue?.map(item => item.id) || [];
        if (ids.length) {
            const id = ids[0];
            return handleInfoCode({ infoCodeType: props.column.infoCodeType, infoCode: props.column.infoCode, id });
        }
    }
    return handleInfoCode({ infoCodeType: props.column.infoCodeType, infoCode: props.column.infoCode, id: props.data.id });
});
const handleInfoCode = ({ infoCodeType, infoCode, id }) => {
    if (isIotInfoType(infoCodeType)) {
        return getIotData(id, infoCode);
    }
    return getCustomInfo(id, infoCodeType, infoCode);
};
const disabledFun = computed(() => {
    const obj = { disabled: false, disabledText: '' };
    const infoCodesData = [];
    infoCodesData.push(getIotData(props.data.id, 'localRemoteStatus'));
    infoCodesData.push(getIotData(props.data.id, 'onlineStatus'));
    const canControlObj = canControl(infoCodesData);

    obj.disabled = !canControlObj.value;
    obj.content = canControlObj.text;
    if (!obj.disabled && commonProps.manualAutoSetControl && props.column.infoCode !== INFO_CODE.manualAutoSet.infoCode) {
        // 如果不受手自动限制的情况
        if (isUnrelatedToManualAutoSet(props.column)) {
            obj.disabled = false;
        } else {
            // 如果是手动自动控制，并且当前是手动，则可以控制；如果当前是自动，则不可控制
            const isManual = getIotData(props.data.id, INFO_CODE.manualAutoSet.infoCode).dataValue === IS_MANUAL;
            if (isManual) {
                obj.disabled = false;
            } else {
                obj.disabled = true;
                obj.content = i18n.global.t('meos_control_web.automatic_mode_unable_to_control');
            }
        }
    }
    return obj;
});
const getStyles = computed(() => {
    const arr = [getColorConfig({ infoCode: getInfoCode.value.infoCode, value: getInfoCode.value.dataValue })];
    if (props.column.infoCodeType === IOT_SETTING && getInfoCode.value.additionalMapValue?.recoveryDateTime) {
        arr.push(getInterveneStatusColorConfig());
    }
    const obj = maxBy(arr, 'priority');
    return {
        backgroundColor: obj?.cellBackgroundColor
    };
});
watch(
    () => isHovered.value,
    val => {
        if (val) {
            disabledFun.value.disabled === false && openRecoveryDateTime(myHoverableElement.value, getInfoCode.value);
        } else {
            closeRecoveryDateTime();
        }
    }
);
</script>
<style lang="less" scoped>
.td-box {
    .td-box-text {
        padding: 8px 12px;
    }
    :deep(.set-value-box) {
        .set-div {
            padding: 8px 12px;
        }
    }
    :deep(.m-radio) {
        margin-right: 7px;
    }
}
</style>
