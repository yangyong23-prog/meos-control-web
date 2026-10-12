<template>
    <div class="spcae-analysis-right">
        <SpaceEquipMap v-bind="$attrs" :can-space-selected="true" :space-second-type="spaceType" :is-active="!curSelectedSpace?.id"></SpaceEquipMap>
        <SpaceInfo v-if="curSelectedSpace?.id"></SpaceInfo>
    </div>
</template>

<script setup>
import SpaceEquipMap from '@/views/runAnalysis/components/SpaceEquipMap/index.vue';
import SpaceInfo from './spaceInfo/index.vue';
import { curSelectedSpaceKey, spaceTypeKey } from '../injectionKey';
const curSelectedSpace = inject(curSelectedSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const spaceType = inject(spaceTypeKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
</script>
<style lang="less" scoped>
.spcae-analysis-right {
    position: relative;
    overflow: hidden;
}
</style>
