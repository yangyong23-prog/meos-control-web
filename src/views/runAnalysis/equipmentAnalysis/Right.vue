<template>
    <div class="equip-analysis-right" :class="{ isSplitScreen: isSplitScreen }">
        <div v-if="isSplitScreen" class="close-wrap" @click="isSplitScreen = false">
            <IconMeriComponentClose class="close" color="#ffffff"></IconMeriComponentClose>
        </div>
        <SpaceEquipMap v-show="isSplitScreen" v-bind="$attrs" :can-space-selected="false" :is-active="isSplitScreen" :space-second-type="TEMPERATURE"></SpaceEquipMap>
    </div>
</template>

<script setup>
import { IconMeriComponentClose } from 'meri-icon';
import SpaceEquipMap from '@/views/runAnalysis/components/SpaceEquipMap/index.vue';
import { isSplitScreenKey } from '../injectionKey';
import { TEMPERATURE } from '../variable';
const isSplitScreen = inject(isSplitScreenKey); // => src\views\runAnalysis\hooks\useEquipAnalysis.js
</script>
<style lang="less" scoped>
.equip-analysis-right {
    position: relative;
    width: 0;
    transition: all 0.3s;
    &.isSplitScreen {
        width: 50%;
    }
    .close-wrap {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 1000;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
}
</style>
