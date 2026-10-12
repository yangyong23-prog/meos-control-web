<template>
    <div class="map-view-container">
        <ModelMap :running-monitor-type="currentConfig?.RUNNING_MONITOR_TYPE">
            <template #legend="{ pipelineData }">
                <Legend :switch-data="[]" :pipeline-data="pipelineData"></Legend>
            </template>
        </ModelMap>
    </div>
</template>

<script setup>
import Legend from '../Legend.vue';
import { getCurrentSystemConfig } from '../../utils/index';
import ModelMap from '../../shared/ModelMap/index.vue';

const { currentConfig } = getCurrentSystemConfig();
</script>

<style lang="less" scoped>
.map-view-container {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
