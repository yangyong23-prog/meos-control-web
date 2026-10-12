<template>
    <div class="spcae-analysis-left">
        <Total :show="flatBuildingFloorSpaces?.length !== 0" />
        <template v-if="loading">
            <div style="padding: 0 24px; height: calc(100% - 140px)">
                <m-list-skeleton />
            </div>
        </template>
        <template v-else>
            <SpaceList v-if="flatBuildingFloorSpaces.length" :flat-building-floor-spaces="flatBuildingFloorSpaces" :current-map-spaces="currentMapSpaces" />
            <div v-else class="fcc" style="height: calc(100% - 140px)">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Total from './components/Total.vue';
import SpaceList from './components/SpaceList.vue';
defineProps({
    flatBuildingFloorSpaces: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    currentMapSpaces: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.spcae-analysis-left {
    height: 100%;
}
</style>
