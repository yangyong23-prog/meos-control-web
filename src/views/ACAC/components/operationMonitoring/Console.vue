<template>
    <div class="operation-monitoring-console">
        <InfoCodeList :id="selectObj.id" :control-list="controlList" :select-obj-id="selectObj.id" :equipment-info="equipmentInfo" />
        <CoolingTowerFanOrWaterInfo
            v-if="equipmentInfo.coolingTowerFanInfo || equipmentInfo.electricallyOperatedOnOffWaterValveInfo"
            :select-obj="selectObj"
            :cooling-tower-fan-info="equipmentInfo.coolingTowerFanInfo"
            :electrically-operated-on-off-water-valve-info="equipmentInfo.electricallyOperatedOnOffWaterValveInfo"
        />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ENABLE_CTRL, MANUAL_AUTO_SET } from '@/views/ACAC/variables';
import CoolingTowerFanOrWaterInfo from './CoolingTowerFanOrWaterInfo.vue';
import InfoCodeList from './InfoCodeList.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { forcedModelKey } from '../../hooks/useEquipmentInfoHook';
import { IOT_SETTING } from '@/utils/globalVariables';
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
    controlledParameterSet: {
        type: Object,
        default: () => {
            return {};
        }
    },
    equipmentInfo: {
        type: Object,
        default: () => {
            return {};
        }
    }
});
const { setIotData, getIotData } = DockSingleton.getInstance();
const forcedModel = inject(forcedModelKey, ref(''));

const setControlList = () => {
    const arr = [];
    props.controlledParameterSet?.relInfoCodeConfigs?.forEach(item => {
        const actualInfo = item.relInfoCodeConfigs?.[0] || {};
        item.setInfoCode = item.infoCode;
        item.actualInfoCode = item.infoCode !== ENABLE_CTRL ? actualInfo.infoCode : ENABLE_CTRL;
        item.id = props.selectObj.id;
        item.type = item.infoCode === MANUAL_AUTO_SET ? MANUAL_AUTO_SET : ENABLE_CTRL;
        item.relInfoCodeConfigs?.forEach(val => {
            const actualInfo = val.relInfoCodeConfigs?.[0] || {};
            val.id = item.id;
            val.setInfoCode = val.infoCode;
            val.actualInfoCode = actualInfo.infoCode;
            setIotData(item.id, val.setInfoCode, val);
            actualInfo && setIotData(item.id, actualInfo.infoCode, actualInfo);
        });
    });
    const manualAutoSet = props.controlledParameterSet?.relInfoCodeConfigs?.find(item => item.infoCode === MANUAL_AUTO_SET);
    const enableCtrlInfoCodes = props.controlledParameterSet?.relInfoCodeConfigs?.filter(item => item.infoCode !== MANUAL_AUTO_SET) || [];
    manualAutoSet && arr.push(manualAutoSet);
    arr.push(...enableCtrlInfoCodes.filter(v => v.infoCodeType === IOT_SETTING));
    arr.forEach((item, i) => {
        if (arr[i + 1] && arr[i + 1]?.type === item?.type) {
            item.isGroup = true;
        }
    });
    return structuredClone(arr);
};
const controlList = ref([]);
onMounted(() => {
    controlList.value = setControlList();
});

// 设备详情中的强制按钮，增加联动逻辑：当设备的“手自动状态设定（manualAutoSet）”的值变成"1 自动"时，强制按钮变成关闭状态，不可操作。提示：“设备仅支持在手动状态下可控，自动状态下不可控。”
watchEffect(() => {
    const { dataValue } = getIotData(props.selectObj.id, 'manualAutoSet');
    if (dataValue === '1' && forcedModel.value === 'checked') {
        forcedModel.value = 'uncheck';
    }
});
</script>
<style lang="less" scoped>
.operation-monitoring-console {
    :deep(.control-item-main) {
        width: 100%;
    }
}
</style>
