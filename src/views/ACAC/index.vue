<template>
    <div class="air-cold scrollbar wh100" :class="curContainerClass">
        <template v-if="systemList?.length > 0 && systemId">
            <LeftComponent v-if="systemId" ref="LeftComponentRef" />
            <RightComponent v-if="systemId && Refresh" ref="RightComponentRef" :notify-list="notifyList" :page-broadcast-s-s-e-client="pageBroadcastSSEClient" />
            <TimeTable v-if="isShowTimeTable" @go-back="goBack" />
        </template>
        <div v-else class="empty-item">
            <Empty :text="i18n.global.t('meos_control_web.no_content')"></Empty>
        </div>
        <MonitoringBoard v-if="showMonitoringBoard" @close="showMonitoringBoard = false" />
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
        <EquipmentList
            v-if="showEquipmentList"
            v-bind="equipmentListData"
            :select-equip-id="selectedEquipmentId"
            @back="handleEquipmentListBack"
            @click-equip="handleEquipmentClick"
            @close-equipment-info="handleEquipmentInfoClose"
        />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import Empty from '@/components/common/Empty.vue';
import useBaseHook from './hooks/useBaseHook';
import LeftComponent from './left/index.vue';
import RightComponent from './right/index.vue';
import TimeTable from './timetable/index.vue';
import { GraphCode } from '@/views/ACAC/variables';
import MonitoringBoard from './components/monitoringBoard/index.vue';
import SpaceList from './components/SpaceList.vue';
import EquipmentList from '@/components/equipmentList/index.vue';

const LeftComponentRef = ref(null);

const {
    isShowTimeTable,
    showEquipmentList,
    systemId,
    Refresh,
    viewMode,
    notifyList,
    RightComponentRef,
    systemList,
    pageBroadcastSSEClient,
    showMonitoringBoard,
    showSpaceList,
    spaceListData,
    equipmentListData,
    equipmentListBackCallback
} = useBaseHook();

const goBack = () => {
    isShowTimeTable.value = false;
};

// 复用左侧现有设备详情抽屉能力，避免重复维护一套状态。
const selectedEquipmentId = computed(() => {
    return LeftComponentRef.value?.equipmentNodeActiveData?.id || LeftComponentRef.value?.equipmentNodeActiveData?.value?.id || '';
});

const handleEquipmentListBack = () => {
    const backCallback = equipmentListBackCallback.value;
    showEquipmentList.value = false;
    equipmentListData.value = {};
    equipmentListBackCallback.value = null;
    // 从系统设置内进入设备列表时，关闭设备列表后按入口要求恢复系统设置抽屉
    backCallback?.();
};

const handleEquipmentClick = data => {
    LeftComponentRef.value?.openEquipmentInfo?.(data);
};

const handleEquipmentInfoClose = () => {
    LeftComponentRef.value?.closeEquipmentInfo?.();
};

// 当前容器的css class（背景色）
const curContainerClass = computed(() => {
    return viewMode?.value === GraphCode ? 'SYSTEM_GRAPH' : 'SPACE_3D_GRAPH';
});
</script>
<style lang="less" scoped>
@media screen and (min-width: 1600px) {
    .air-cold-right {
        width: 496px;
    }
    .air-cold-left {
        width: calc(100% - 496px);
    }
}
@media screen and (max-width: 1600px) {
    .air-cold-right {
        width: 416px;
    }
    .air-cold-left {
        width: calc(100% - 416px);
    }
}
.air-cold {
    display: flex;
    background-color: var(--gray-100);
    position: relative;
    &.SYSTEM_GRAPH {
        background: @system_graph_bg;
    }

    &.SPACE_3D_GRAPH {
        background: @space_3d_bg;
    }
}
.empty-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--gray-100);
    color: var(--describe-color);
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
