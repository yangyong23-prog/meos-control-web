<template>
    <div v-if="!controlledParameterSet && !dataValueList.length" class="fcc h100">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
    </div>
    <m-scrollbar v-else :key="equipmentInfo?.id" class="operation-monitoring wh100" :style="margin">
        <ConfigBox v-if="controlledParameterSet" :title="controlledParameterSet.groupName">
            <ManualAotoSet
                v-if="manualAutoSet"
                :id="equipmentInfo?.id"
                :data="manualAutoSet"
                :reason-options="REASON_OPTIONS"
                :style="{ marginBottom: '16px' }"
                :system-id="systemId"
            />
            <TemplateThree
                :id="equipmentInfo?.id"
                :data="controlledParameterSet"
                :forced-control-fn="editForceControlStatus"
                :forced-model="forcedModel"
                :system-id="systemId"
            ></TemplateThree>
        </ConfigBox>
        <ConfigBox v-for="item in dataValueList" :key="item.id" :title="item.groupName">
            <RunningParams :data="item" :select-obj="selectObj" :filter-empty="true" />
        </ConfigBox>
    </m-scrollbar>
</template>

<script setup>
import ManualAotoSet from '@/components/ObjectInfoComponents/ManualAotoSet/index.vue';
import TemplateThree from '@/components/ObjectInfoComponents/SingleDeviceControl/TemplateThree.vue';
import { useEquipmentInfoHook } from '../../hooks/useEquipmentInfoHook';
import ConfigBox from './ConfigBox.vue';
import RunningParams from './RunningParams.vue';
import i18n from '@/localization';
import { REASON_OPTIONS } from '../../constant/variable';
import { editForceControlStatus, getForceControlStatus } from '@/apis/ACAC';
import { SUCCESSCODE } from '@/utils/globalVariables';

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
    },
    systemId: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['setRelEquipmentIds', 'detail-info-loaded']);

const { equipmentInfo, closeSetForm } = useEquipmentInfoHook(props, emits);

const controlledParameterSet = computed(() => {
    return equipmentInfo.value.controlledParameterSet;
});

const manualAutoSet = computed(() => {
    return (controlledParameterSet.value?.relInfoCodeConfigs || []).find(i => i.infoCode === 'manualAutoSet');
});

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

const forcedModel = ref('uncheck');

const getForceControl = () => {
    getForceControlStatus({ objectId: equipmentInfo.value.id }).then(res => {
        if (res.code === SUCCESSCODE) {
            forcedModel.value = res.data.status === 'OPEN' ? 'checked' : 'uncheck';
        }
    });
};

watch(equipmentInfo, () => {
    if (equipmentInfo.value.id) {
        getForceControl();
    }
});
</script>
<style lang="less" scoped></style>
