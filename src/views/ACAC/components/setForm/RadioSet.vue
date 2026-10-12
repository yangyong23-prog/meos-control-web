<template>
    <m-tips :offset="-30" theme="darkTransparent" :disabled="!disabledFun.disabled" :content="disabledFun.disabledText" placement="top">
        <m-form-item v-show="!data.hide" :label="data.infoCodeName" :prop="data.infoCode" :rules="rules">
            <m-radio-group v-model="params[data.infoCode]" :disabled="disabledFun.disabled" cancel @change="handleChange">
                <m-radio v-for="item in dataSource" :key="item.code" :label="item.code" :disabled="disabledFun.disabled" :size="14" style="margin-right: 10px">
                    {{ item.name }}</m-radio
                >
            </m-radio-group>
        </m-form-item>
    </m-tips>
</template>

<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/utils/globalVariables';
import { DISCHARGE_COOLING_SWITCH_SET, COOLING_SUPPLY_SWITCH_SET } from '@/views/ACAC/variables';
import { currentDataKey, paramsKey } from '@/views/ACAC/hooks/useSetFormHook';
import { orderBy } from 'lodash';
import { currentSystemKey } from '@/views/ACAC/hooks/useBaseHook';
import DockSingleton from '@/hooks/responsiveDock';
import { isLockV2 } from '@/components/SystemControl/config';
const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    noRequired: {
        type: Boolean,
        default: false
    },
    controlListData: {
        type: Array,
        default: () => []
    }
});
const currentSystem = inject(currentSystemKey, ref({}));
const emit = defineEmits(['changeFormItem']);
const params = inject(paramsKey);
const currentData = inject(currentDataKey);
const rules = ref([{ required: props.data.noRequired ? false : true, message: EMPTYTEXT, trigger: [] }]);
const dataSource = computed(() => {
    let arr = [];
    if (props.data.infoCode === currentData.value.infoCode) {
        arr = currentData.value.dataSource || props.data.dataSource || [];
    } else {
        arr = props.data.dataSource || currentData.value.dataSource || [];
    }
    return orderBy(arr, ['code'], ['desc']);
});
const disabledFun = computed(() => {
    if (props.data.infoCode === DISCHARGE_COOLING_SWITCH_SET && currentData.value.infoCode === COOLING_SUPPLY_SWITCH_SET) {
        const item = props.controlListData.find(info => info.infoCode === DISCHARGE_COOLING_SWITCH_SET);
        let disabledText = item.infoCodeName + i18n.global.t('meos_control_web.locked_cannot_modify');
        if (item) {
            if (item.lockStatus) {
                const lock = getIotData(currentSystem.value.systemId, item.lockStatus.infoCode);
                if (isLockV2(lock)) {
                    return {
                        disabled: true,
                        disabledText
                    };
                }
            }
        }
    }
    return {
        disabled: false,
        disabledText: ''
    };
});
const handleChange = value => {
    if (!value) {
        return;
    }
    emit('changeFormItem', value, props.data.infoCode);
};
</script>
<style lang="less" scoped></style>
