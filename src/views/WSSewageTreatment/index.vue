<template>
    <div class="ws-sewage-treatment" :class="{ currentFloorObj: currentFloorObj?.id }">
        <ExpansionCollapse ref="toggleWidthDivRef" :is-unpack="unpackShow" :is-floor-view="floorView" :abnormal-event-list="abnormalEventList" :is-hide-expand="isHideExpand">
            <template #left>
                <div class="ws-left h100">
                    <Left
                        v-if="equipmentsMpa.size"
                        ref="leftComponentRef"
                        :loading="loading"
                        :loading-floor="loadingFloor"
                        :current-floor-obj="currentFloorObj"
                        :equipments-mpa="equipmentsMpa"
                        :card-statistics="cardStatistics"
                        :abnormal-event-list="abnormalEventList"
                        @open-equipment-list="openEquipmentList"
                    ></Left>
                    <Empty v-show="isLoaded && !equipmentsMpa.size" class="empty-container" />
                </div>
            </template>
            <template #right>
                <Right :card-statistics="cardStatistics" />
            </template>
        </ExpansionCollapse>
        <!-- 设备列表 -->
        <EquipmentList
            v-if="showEquipmentList"
            :floor-id="currentFloorObj?.id"
            :select-equip-id="selectedEquipmentId"
            style="left: 0; top: 0"
            @back="closeEquipmentList"
            @click-equip="handleEquipmentClick"
            @close-equipment-info="handleEquipmentInfoClose"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Empty from '@/components/common/Empty.vue';
import Left from './left/index.vue';
import Right from './right/index.vue';
import { useBaseData } from './hooks/useBaseData';
import EquipmentList from '@/components/equipmentList/index.vue';
import useSSE from './hooks/useSSE';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import useStore from '@/store';
import { RUNNING_MONITOR_TYPE_SEWAGE } from './constant';
import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';
import useDrawerVisible from '@/hooks/useDrawerVisible';

const { spaceSSEClient, setEquipmentSSEClientOption } = useSSE();
const toggleWidthDivRef = ref(null);
const leftComponentRef = ref(null);
const { loading, currentFloorObj, equipmentsMpa, loadingFloor, cardStatistics, findEquipmentIdAndSpaceIdInFloor, floorView, isLoaded } = useBaseData(setEquipmentSSEClientOption);
const { base } = useStore();
const { projectId } = base || {};

const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList, abnormalEventListLoadedTime } = useAbnormalDataWithSSE({
    sseClient: spaceSSEClient,
    objectIds: findEquipmentIdAndSpaceIdInFloor,
    defaultLoading: false
});
const callToggleWidth = val => {
    if (toggleWidthDivRef.value) {
        toggleWidthDivRef.value.toggleWidth(val);
    }
};

const { isHideExpand } = useDrawerVisible();

// 设备列表
const showEquipmentList = ref(false);
// 打开
const openEquipmentList = () => {
    showEquipmentList.value = true;
};
const closeEquipmentList = () => {
    showEquipmentList.value = false;
};
const selectedEquipmentId = computed(() => {
    return leftComponentRef.value?.selectObj?.id || leftComponentRef.value?.selectObj?.value?.id || '';
});
const handleEquipmentClick = data => {
    leftComponentRef.value?.openDetailDrawer?.(data);
};
const handleEquipmentInfoClose = () => {
    leftComponentRef.value?.closeDetailDrawer?.();
};
watch(
    () => findEquipmentIdAndSpaceIdInFloor.value,
    async () => {
        abnormalEventListLoading.value = true;
        let _t = null;
        if (findEquipmentIdAndSpaceIdInFloor?.value?.length > 0) {
            await abnormalFun();
            if (floorView.value) return;
            // watch(
            //     () => abnormalEventList.value,
            //     () => {
            //         if (abnormalEventList.value.length > 0) {
            //             callToggleWidth(true);
            //         } else {
            //             console.log(abnormalEventList.value, floorView.value, '222');
            //             nextTick(() => {
            //                 clearTimeout(_t);
            //                 _t = setTimeout(() => {
            //                     callToggleWidth(false);
            //                 }, 1000);
            //             });
            //         }
            //     },
            //     { once: true }
            // );
            if (abnormalEventList.value.length > 0) {
                callToggleWidth(true);
            } else {
                nextTick(() => {
                    clearTimeout(_t);
                    _t = setTimeout(() => {
                        callToggleWidth(false);
                    }, 1000);
                });
            }
        } else if (abnormalEventListLoading) {
            abnormalEventListLoading.value = false;
            abnormalEventListLoadedTime.value = new Date().toISOString();
        }
    }
);

const abnormalFun = () => {
    const params = {
        projectId: projectId,
        instanceIds: findEquipmentIdAndSpaceIdInFloor.value,
        runningMonitorType: RUNNING_MONITOR_TYPE_SEWAGE,
        // 二级风控目标过滤，E31"漫水"
        riskMeasureAimLevel2: ['E31']
    };
    return onQueryAbnormalEventList(params, true);
};

provide('showEquipmentListKey', showEquipmentList);
provide('abnormalEventListLoading', abnormalEventListLoading);
provide('abnormalEventListUpdateTime', abnormalEventListUpdateTime);
provide('abnormalEventListLoadedTime', abnormalEventListLoadedTime);
provide('abnormalEventList', abnormalEventList);
provide('loading', loading);
provide('callToggleWidth', callToggleWidth);
const unpackShow = ref(true);
const showUnpackShowDiv = ref(false);

const mainClick = () => {
    nextTick(() => {
        const drawerDom = document.querySelector('.m-drawer.m-drawer-enter-from');
        console.log('aaaqqqqqq: ', drawerDom, '这里判断drawerDom是否为空');
        showUnpackShowDiv.value = drawerDom ? true : false;
    });
};

onMounted(() => {
    window.addEventListener('click', mainClick);
});
onBeforeUnmount(() => {
    window.removeEventListener('click', mainClick);
});
</script>
<style lang="less" scoped>
.ws-sewage-treatment {
    width: 100%;
    height: 100%;
    min-width: 1280px;
    background-color: var(--blue-50);
    background-image: url('@/assets/imgs/page_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    overflow-x: hidden;
    position: relative;
    &.currentFloorObj {
        background: rgb(212, 221, 229);
    }
    .ws-left {
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: transparent;
        transition: all 0.5s ease;
    }
    // .ws-right {
    //     height: 100%;
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     padding: 16px 16px 16px 0;
    // }
}
.empty-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<style lang="less">
.ws-sewage-treatment {
    .left-right-layout {
        .expansion-collapse-left {
            &::-webkit-scrollbar {
                width: 2px !important;
            }
        }
    }
}
</style>
