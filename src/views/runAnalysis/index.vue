<template>
    <div class="run-analysis wh100">
        <template v-if="showModuleInfo">
            <component :is="component()" :analysis-type-list="analysisTypeList" :system-list="systemList" />
        </template>
        <Energy v-else :analysis-type-list="analysisTypeList" />
    </div>
</template>

<script setup>
import Energy from './energy/index.vue';
import { useBaseData } from './hooks/useBaseData';
import ModuleInfo from './moduleInfo/index.vue';
import SpaceAnalysis from './spaceAnalysis/index.vue';
import EquipmentAnalysis from './equipmentAnalysis/index.vue';
import { EQUIPMENT_ANALYSIS, SPACE_ANALYSIS } from './variable';
import { useRoute } from 'vue-router';
const { showModuleInfo, analysisTypeList, systemList, analysisType, globalTime } = useBaseData();
const { query } = useRoute();
const component = () => {
    switch (analysisType.value) {
        case SPACE_ANALYSIS.id:
            return SpaceAnalysis;
        case EQUIPMENT_ANALYSIS.id:
            return EquipmentAnalysis;
        default:
            return ModuleInfo;
    }
};
onMounted(() => {
    if (query.showModuleInfo && query.analysisType) {
        showModuleInfo.value = query.showModuleInfo;
        analysisType.value = query.analysisType;
    }
    if (query.curSelectedDate) {
        globalTime.value = query.curSelectedDate;
    }
});
</script>
<style lang="less" scoped></style>
