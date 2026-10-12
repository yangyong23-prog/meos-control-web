<template>
    <div class="control-item">
        <div class="item-title fcb">
            {{ setData.infoCodeName }}
            <div class="fcc" style="gap: 8px">
                <template v-if="setData.dataSource?.length && isManualAutoSetOrequipSwitchSet">
                    <SetButton v-for="info in setData.dataSource" :key="info.code" v-bind="disabledFun(info.code)" size="small" @click="e => handleClick(e, info)">
                        {{ i18n.global.t('common.all') }}{{ info.name }}
                    </SetButton>
                </template>
                <template v-else>
                    <SetButton size="small" @click="e => handleClick(e, data)"> {{ i18n.global.t('common.set') }} </SetButton>
                </template>
            </div>
        </div>
        <div v-if="isManualAutoSetOrequipSwitchSet" class="item-num fc" style="color: var(--gray-600)">
            <template v-for="item in infoCodeGroup"> {{ item.name }}: {{ item.number }}&nbsp; </template>
        </div>
    </div>
</template>

<script setup>
import SetButton from '@/components/common/SetButton.vue';
import DockSingleton from '@/hooks/responsiveDock';
import i18n from '@/localization';
import { IOT_RUNNING } from '@/utils/globalVariables';
const props = defineProps({
    data: {
        type: String,
        default: ''
    },
    equipments: {
        type: Array,
        default: () => []
    }
});
const isManualAutoSetOrequipSwitchSet = computed(() => {
    return setData.value.infoCode === 'manualAutoSet' || setData.value.infoCode === 'equipSwitchSet';
});
const { getIotData } = DockSingleton.getInstance();

const infoCodeGroup = computed(() => {
    const arr = props.data.dataSource.map(item => ({
        ...item,
        number: 0
    }));
    arr.forEach(item => {
        props.equipments.forEach(equipment => {
            const iotData = getIotData(equipment.id, props.data.infoCode);
            if (iotData.dataValue === item.code) {
                item.number += 1;
            }
        });
    });
    return arr;
});
const setData = computed(() => {
    if (props.data.infoCodeType === IOT_RUNNING) {
        return props.data?.relInfoCodeConfigs?.[0] || {};
    }
    return props.data;
});
const disabledFun = code => {
    // 非手自动设置不可禁用
    if (setData.value.infoCode !== 'manualAutoSet') {
        return {
            disabled: false,
            content: ''
        };
    }
    // 当前为手动设置时不禁用
    if (code === '0') {
        return {
            disabled: false,
            content: ''
        };
    }
    // 全部自动后，【全部自动】按钮置灰
    const obj = infoCodeGroup.value.find(item => item.code !== code);
    // 当前无${obj.name}状态无法操作
    return {
        disabled: obj.number === 0,
        content: obj.number === 0 ? i18n.global.t('meos_control_web.no_status_op', { name: obj.name }) : ''
    };
};
const emits = defineEmits(['click']);
const handleClick = (e, info) => {
    const obj = {
        el: e,
        dataValue: info.code || '',
        data: setData.value || '',
        valueName: info.name || setData.value?.infoCodeName || '',
        ids: props.equipments?.map(item => item.id) || []
    };
    emits('click', obj);
};
</script>
<style lang="less" scoped>
.control-item {
    padding: 8px 0;
    & + .control-item {
        border-top: 1px solid var(--gray-300);
    }
}
</style>
