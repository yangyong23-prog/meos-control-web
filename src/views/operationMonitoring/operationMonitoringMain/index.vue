<template>
    <div class="operation-monitoring-main">
        <!-- 头部操作区域 -->
        <Header @open-equipment-list="emit('openEquipmentList')"></Header>
        <div class="graph-container">
            <!-- 关系图视角 -->
            <SysRelationChart v-show="perspectiveType && perspectiveType === PERSPECTIVE_DICT['RELATIONAL_PERSPECTIVE']" ref="relationChartRef"></SysRelationChart>
            <!-- 模型视角 -->
            <ModelAngleScene v-show="perspectiveType && perspectiveType === PERSPECTIVE_DICT['MODEL_PERSPECTIVE']"></ModelAngleScene>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Header from './components/header.vue';
import ModelAngleScene from '@/views/operationMonitoring/operationMonitoringMain/ModelAngleScene/index.vue';
import SysRelationChart from './SysRelationChart/index.vue';
import { PERSPECTIVE_DICT } from '@/views/operationMonitoring/constants';
// import useSSE from '../hooks/useSSE';

// useSSE();

const relationChartRef = ref();

const perspectiveType = inject('perspectiveType');
const closeEquipmentiInfo = inject('closeEquipmentiInfo');
const emit = defineEmits(['openEquipmentList']);
watch(perspectiveType, () => {
    if (closeEquipmentiInfo) {
        closeEquipmentiInfo();
        relationChartRef.value?.triggerClose();
    }
});
</script>
<style lang="less" scoped>
.operation-monitoring-main {
    // flex: 1;
    width: 100%;
    height: 100%;
    min-width: 0;
    position: relative;
    // padding-right: 12px !important;
    .graph-container {
        width: 100%;
        height: 100%;
        // background: red;
    }
    overflow: hidden;
}
</style>
