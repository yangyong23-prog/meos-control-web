<template>
    <div class="lighting-monitoring-board">
        <div v-if="globalLoading" class="lighting-monitoring-board-loading-warp"></div>

        <template v-else>
            <m-scrollbar v-if="CommonArea?.buildings?.length || ParkingLot?.buildings?.length" class="floorsList-noscrollbar">
                <topAssembly />
                <floorsList />
            </m-scrollbar>
            <div v-if="!globalLoading && !CommonArea?.buildings?.length && !ParkingLot?.buildings?.length" class="nodata">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
            </div>
        </template>
    </div>
</template>
<script setup>
import floorsList from './floorsList.vue';
import topAssembly from './topAssembly.vue';
import { MLoading } from 'meri-plus';
const globalLoading = inject('globalLoading');
const loadingInstance = ref();
const CommonArea = inject('CommonArea');
const ParkingLot = inject('ParkingLot');
watch(
    () => globalLoading.value,
    () => {
        if (globalLoading.value) {
            nextTick(() => {
                loadingInstance.value = MLoading.service({
                    target: `.lighting-monitoring-board-loading-warp`,
                    fullscreen: false,
                    duration: 100,
                    lottieName: 'ball',
                    loadIconStyle: {
                        width: '100px',
                        height: '100px'
                    },
                    background: 'transparent'
                });
            });
        } else {
            loadingInstance.value?.destroy();
        }
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
:deep(.floorsList-noscrollbar) {
    // &.m-scrollbar .m-scrollbar__box {
    //     overflow: hidden;
    // }
    & > .m-scrollbar__bar {
        display: none !important;
    }
}
:deep(.m-loading-mask) {
    background-color: transparent !important;
}
.lighting-monitoring-board {
    width: 100%;
    height: 100%;
    padding: 66px 16px 16px 16px;
}
.lighting-monitoring-board-loading-warp {
    width: 100%;
    height: 100%;
}
.nodata {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
