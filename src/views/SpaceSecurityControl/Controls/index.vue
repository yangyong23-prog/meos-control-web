<template>
    <div class="control-container">
        <div style="height: 100%">
            <m-scrollbar box-class="control-scrollbar">
                <m-button v-if="isEdge()" class="to-control-btn" type="default" size="medium" @click="toEquipList('')">{{
                    i18n.global.t('meos_control_web.equipment_list')
                }}</m-button>
                <ArmStatistics v-if="haveDisArm" class="statistics-item" :in-side="true" :current-floor-id="currentFloorObj?.id" />
                <SecurityEquipmentStatistics v-if="haveOverallFunction" class="statistics-item" :current-floor-id="currentFloorObj?.id" :in-side="true" />
                <VideoGroupEditor
                    v-if="base.hasAuth('MonitorGroupAccess')"
                    :current-floor-id="currentFloorObj?.id"
                    :in-side="true"
                    @hover-monitor-group="hoverMonitorGroup"
                    @unhover-monitor-group="unhoverMonitorGroup"
                    @click-monitor-group="clickMonitorGroup"
                    @open-edit-group="openEditGroup"
                />
            </m-scrollbar>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import ArmStatistics from '../component/ArmStatistics.vue';
import SecurityEquipmentStatistics from '../component/SecurityEquipmentStatistics.vue';
import VideoGroupEditor from '../component/VideoGroupEditor/Index.vue';
import { haveDisArmInjectKey, haveOverallFunctionInjectKey } from '../hooks/useDashboard';
import { openEquipmentListInjectKey } from '../hooks/useEquipmentList';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
const base = baseStore();
const haveDisArm = inject(haveDisArmInjectKey);
const haveOverallFunction = inject(haveOverallFunctionInjectKey);
const openEquipmentList = inject(openEquipmentListInjectKey);
const currentFloorObj = inject('currentFloorObj');
const emit = defineEmits(['clickMonitorGroup', 'hover-monitor-group', 'unhover-monitor-group', 'open-edit-group']);

const toEquipList = type => {
    openEquipmentList(type);
};
const clickMonitorGroup = group => {
    emit('clickMonitorGroup', group);
};
const hoverMonitorGroup = group => {
    emit('hover-monitor-group', group);
};
const unhoverMonitorGroup = () => {
    emit('unhover-monitor-group');
};
const openEditGroup = group => {
    emit('open-edit-group', group);
};
</script>
<style lang="less" scoped>
.control-container {
    height: calc(100% - 72px);
    overflow: hidden;
    position: relative;
    .to-control-btn {
        position: absolute;
        top: 8px;
        right: 16px;
        z-index: 9;
    }
}

:deep(.control-scrollbar) {
    .m-scrollbar__content {
        height: 100%;
        position: relative;
    }
}
</style>
