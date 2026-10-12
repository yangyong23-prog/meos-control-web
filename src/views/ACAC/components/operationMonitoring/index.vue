<template>
    <div v-if="!equipmentInfo.controlledParameterSet && !dataValueList.length" class="fcc h100">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
    </div>
    <m-scrollbar v-else :key="equipmentInfo?.id" class="operation-monitoring wh100">
        <ConfigBox v-if="equipmentInfo.controlledParameterSet" :title="equipmentInfo?.controlledParameterSet?.groupName">
            <Console
                :controlled-parameter-set="equipmentInfo.controlledParameterSet"
                :select-obj="selectObj"
                :equipment-info="equipmentInfo"
                :running-monitor-type="runningMonitorType"
                :active-set-form-data="activeSetFormData"
            />
        </ConfigBox>
        <ConfigBox v-for="item in dataValueList" :key="item.id" :title="item.groupName">
            <RunningParams :data="item" :select-obj="selectObj" />
        </ConfigBox>
    </m-scrollbar>
    <m-popover
        virtual-triggering
        :content="i18n.global.t('meos_control_web.i_am_hint_text')"
        :virtual-ref="setFormBtn"
        trigger="manually"
        :is-open="isOpenSetForm"
        placement="bottom-end"
        style="--m-popover-padding: 0; --m-popover-border-radius: 8px"
        @scroll="closeSetForm"
    >
        <template #content>
            <SetForm
                style="width: 280px"
                :data="activeSetFormData"
                :control-list-data="[activeSetFormData]"
                :unlimit-time-range="true"
                :identify-local-or-remote="identifyLocalOrRemote"
                @submit="submit"
                @close="closeSetForm"
            />
        </template>
    </m-popover>
</template>

<script setup>
import { useEquipmentInfoHook } from '../../hooks/useEquipmentInfoHook';
import ConfigBox from './ConfigBox.vue';
import Console from './Console.vue';
import RunningParams from './RunningParams.vue';
import SetForm from '@/views/ACAC/components/setForm/index.vue';
import i18n from '@/localization';

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {
            return {};
        }
    },
    runningMonitorType: {
        type: String,
        default: ''
    },
    curTab: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['setRelEquipmentIds', 'detail-info-loaded']);

const { equipmentInfo, isOpenSetForm, setFormBtn, closeSetForm, activeSetFormData, submit, identifyLocalOrRemote } = useEquipmentInfoHook(props, emits);
const dataValueList = computed(() => {
    const arr = [];
    if (equipmentInfo.value.runningParameter) {
        arr.push(equipmentInfo.value.runningParameter);
    }
    if (equipmentInfo.value.techniqueParameter) {
        arr.push(equipmentInfo.value.techniqueParameter);
    }
    return arr;
});
watch(
    () => props.curTab,
    () => {
        closeSetForm();
    }
);
</script>
<style lang="less" scoped></style>
