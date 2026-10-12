<template>
    <div class="system-wrap">
        <slot name="viewMode" :mode="{ viewMode }" :current-system="currentSystem" :set-sse-console-client="setSseConsoleClient"></slot>
    </div>
    <MonitoringBoard v-if="showMonitoringBoard" @close="showMonitoringBoard = false" />
    <TimeTable v-if="isShowTimeTable" @go-back="goBack" />
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="showSpaceList"
        :shadow-click="true"
        width="480px"
        drawer-class="space-drawer"
        :z-index="Z_INDEX.equipmentList"
        :title="i18n.global.t('meos_control_web.guan_lian_space')"
        @close="showSpaceList = false"
    >
        <template #content>
            <SpaceList v-if="showSpaceList" :data="spaceListData" style="padding: 8px 24px" />
        </template>
    </m-drawer>
    <SystemInfo
        v-if="showSystemInfo"
        :system-object="currentSystem"
        :running-monitor-type="RUNNING_MONITOR_TYPE"
        :sse-console-client="sseConsoleClient"
        @close="showSystemInfo = false"
    />
</template>
<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import useBaseHook from './hooks/useBaseHook';
import MonitoringBoard from './components/monitoringBoard/index.vue';
import SpaceList from '@/components/SystemControl/SpaceList.vue';
import TimeTable from './timetable/index.vue';
import SystemInfo from './components/system-info/index.vue';
import { RUNNING_MONITOR_TYPE } from './constant/variable';

const { viewMode, showSpaceList, currentSystem, showSystemInfo, spaceListData, showMonitoringBoard, isShowTimeTable } = useBaseHook();
const sseConsoleClient = ref(null);
const setSseConsoleClient = client => {
    sseConsoleClient.value = client;
};
const goBack = () => {
    isShowTimeTable.value = false;
};
</script>
<style lang="less" scoped>
.system-wrap {
    width: 100%;
    height: 100%;
}
</style>

<style lang="less">
.space-drawer {
    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
    }
}
.space-drawer {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
}
// 断点适配
@media screen and (max-width: 1600px) {
    .space-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
}
</style>
