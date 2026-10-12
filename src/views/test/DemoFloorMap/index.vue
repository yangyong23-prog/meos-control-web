<template>
    <div class="floor-scene-warp">
        <div class="objs-controls">
            <div class="switch-item">
                <m-switch v-model="showEquips" :loading="mapLoading"></m-switch>
                展示设备
            </div>
            <div class="switch-item">
                <m-switch v-model="showSpaceIconInfos" :loading="mapLoading"></m-switch>
                展示空间名称
            </div>
        </div>
        <div ref="graphWarp" class="webgl-dom" @mouseleave="leaveChart" />
        <!-- 操作按钮 -->
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, toRaw, watch } from 'vue';
import floorMapHook from './FloorMapHook';
import { $Message, MMessageBox } from 'meri-plus';
// eslint-disable-next-line import/extensions
import '@/views/GraphMVC/styles/cssobjects.less';

const props = defineProps({
    data: {
        type: Object,
        default: () => null
    },
    // 是否显示
    show: {
        type: Boolean,
        default: false
    },
    floorId: {
        type: String,
        default: ''
    }
});

// const NoMapData = ref(null);
const webglDom = ref(null);
const currentFloorId = ref(null);
const showEquips = ref('checked');
const showSpaceIconInfos = ref('checked');

const {
    goDefault,
    graphWarp,
    mapLoading,
    onClickMoreInfo,
    buildFloors,
    curHoverObj,
    hoverCardPosition,
    showMapRelationMode,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj,
    setEquipOnPlay,
    unsetEquipOnPlay
} = floorMapHook(currentFloorId);
// const { create3DAppScene, web3dApp, web3dScene, getFloorInfo, fetchSpaceInFloor, fetchEquipData, initCheckedEquips, initcheckedPipes } = floorMapHook();
setTimeout(() => {
    currentFloorId.value = 'Fl61011220107ca564431e4e4b6c8b1dfb9b2740d88a';
}, 2000);
</script>
<style lang="less" scoped>
.floor-scene-warp {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .webgl-dom {
        width: 100%;
        height: 100%;
    }

    .map-handle-group {
        position: absolute;
        right: 16px;
        bottom: 16px;
        z-index: 3000;
    }
    .objs-controls {
        position: absolute;
        top: 10px;
        right: 40px;
        z-index: 30;
        display: flex;
        gap: 22px;
        .switch-item {
            display: flex;
            color: @grey-700;
            font-size: 14px;
        }
    }
}
</style>
