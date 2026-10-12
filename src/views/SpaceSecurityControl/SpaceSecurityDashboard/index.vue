<template>
    <span>
        <m-scrollbar style="height: calc(100% - 38px); padding-top: 42px" bar-y-size="0px" bar-x-size="0px" @scroll="onScroll">
            <div class="space-security-dashboard">
                <div class="statistics-warp">
                    <ArmStatistics class="statistics-item" />
                    <!-- <AccessStatistics class="statistics-item" /> -->
                    <SecurityEquipmentStatistics :get-equipment-statistics-call-back="getEquipmentStatisticsCallBack" class="statistics-item" />
                </div>
                <BuildingFloorGird class="building-floor-gird"></BuildingFloorGird>
            </div>
        </m-scrollbar>
        <Legend />
    </span>
</template>
<script setup>
import ArmStatistics from '../component/ArmStatistics.vue';
// import AccessStatistics from '../component/AccessStatistics.vue';
import SecurityEquipmentStatistics from '../component/SecurityEquipmentStatistics.vue';
import BuildingFloorGird from './BuildingFloorGird/index.vue';
import Legend from './legend.vue';
import { getEquipmentStatisticsCallBackInjectKey } from '../hooks/useDashboard';
const getEquipmentStatisticsCallBack = inject(getEquipmentStatisticsCallBackInjectKey);

const emits = defineEmits(['content-scroll']);
const onScroll = scrollData => {
    emits('content-scroll', scrollData);
};
</script>
<style lang="less" scoped>
.space-security-dashboard {
    width: 100%;
    position: relative;
    overflow: auto;
    .statistics-warp {
        flex-shrink: 0;
        display: flex;
        padding: 16px;
        padding-right: 2px;
        gap: 12px;
        overflow-x: auto;
        .statistics-item {
            flex: 1;
            min-width: 340px;
        }
    }
}
</style>
