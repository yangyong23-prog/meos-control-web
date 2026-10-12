<template>
    <template v-if="needInitRendered">
        <ItemSwitchSet
            v-show="isOpen"
            v-if="hasField('sysSwitchSet')"
            :ref="el => registerRef(el, 'sysSwitchSet')"
            v-model="sysSwitchSetData"
            :use-sustain-time="false"
            :prop-key="'sysSwitchSet' + index"
            :field="getFieldDefine(curMainClassCode, 'sysSwitchSet')"
            :disabled="isEditDisabled"
            :default-data="defaultDataByCode('sysSwitchSet')"
        ></ItemSwitchSet>

        <template v-if="!isSysSwitchSetDataClose">
            <ItemInput
                v-for="(code, k) in pointRuleInfoFields(currentStrategyRule?.pointRuleInfo)"
                v-show="isOpen"
                :ref="el => registerRef(el, code)"
                :key="k"
                :use-sustain-time="false"
                :disabled="isEditDisabled"
                :prop-key="code + index"
                :field="getFieldDefine(curMainClassCode, code)"
                :default-data="defaultDataByCode(code)"
            ></ItemInput>
        </template>
    </template>
</template>
<script setup>
import ItemSwitchSet from '@/components/TimeTableEditorModal/ItemSwitchSet.vue';
import ItemInput from '@/components/TimeTableEditorModal/ItemInput.vue';

import useTimeTableItem from '../hooks/useTimeTableItem';
import i18n from '@/localization';

const props = defineProps({
    currentSystem: {
        type: Object,
        default: () => ({})
    },
    codeDefine: {
        type: Object,
        default: () => ({})
    },
    chillerData: {
        type: Object,
        default: () => ({})
    },
    consoleType: {
        type: String,
        default: ''
    },
    slotParams: {
        type: Object,
        default: () => ({})
    }
});
watch(
    () => props.slotParams,
    () => {
        console.log('props.slotParams: ', props.slotParams);
    }
);

const {
    sysSwitchSetData,
    isSysSwitchSetDataClose,
    pointRuleInfoFields,
    hasField,
    defaultDataByCode,

    needInitRendered,

    getFieldDefine,
    isEditDisabled,
    isOpen,
    currentStrategyRule,
    curMainClassCode,
    registerRef,
    index
} = useTimeTableItem(props);
</script>
<style lang="less" scoped>
.split-line {
    height: 1px;
    width: 100%;
    border-bottom: 1px dashed #c4c9cf;
}
.categorize-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    .title {
        color: var(--Gray-800, #2e3742);
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
    }
}
.items-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
}
.local-names {
    color: var(--gray-800, #2e3742);
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; /* 157.143% */
}
.info-desc {
    color: var(--gray-600, #626c78);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
}
</style>
