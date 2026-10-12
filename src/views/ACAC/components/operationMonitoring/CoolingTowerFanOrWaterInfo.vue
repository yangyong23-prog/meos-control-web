<template>
    <ConfigBox v-if="coolingTowerFanInfo" :title="coolingTowerFanInfo?.groupName" style="padding: 0; margin-top: 24px" collapse>
        <FanAndWaterConsole v-for="item in fans" :key="item.id" :data="item" :select-obj="selectObj"></FanAndWaterConsole>
    </ConfigBox>
    <ConfigBox v-if="electricallyOperatedOnOffWaterValveInfo" :title="electricallyOperatedOnOffWaterValveInfo?.groupName" style="padding: 0" collapse>
        <FanAndWaterConsole v-for="item in waters" :key="item.id" :data="item" :select-obj="selectObj"></FanAndWaterConsole>
    </ConfigBox>
</template>

<script setup>
import ConfigBox from './ConfigBox.vue';
import FanAndWaterConsole from './FanAndWaterConsole.vue';
const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {
            return {};
        }
    },
    coolingTowerFanInfo: {
        type: Array,
        default: () => {
            return [];
        }
    },
    electricallyOperatedOnOffWaterValveInfo: {
        type: Array,
        default: () => {
            return [];
        }
    }
});
const fans = computed(() => {
    const relCoolingTowerFanInfo = props.coolingTowerFanInfo?.relInfoCodeConfigs.find(item => item.infoCode === 'relCoolingTowerFanInfo');
    return relCoolingTowerFanInfo?.dataValue || [];
});
const waters = computed(() => {
    const relCoolingTowerFanInfo = props.electricallyOperatedOnOffWaterValveInfo?.relInfoCodeConfigs.find(item => item.infoCode === 'relCoolingTowerFanInfo');
    return relCoolingTowerFanInfo?.dataValue || [];
});
</script>
<style lang="less" scoped></style>
