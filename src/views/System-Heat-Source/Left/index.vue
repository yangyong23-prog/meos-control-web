<template>
    <div
        v-if="RUNNING_MONITOR_TYPE"
        class="left-container fcc"
    >
        <Header />
        <SysRelationChart
            v-show="viewMode === VIEW_MODE.GRAPH_CODE"
            :show="viewMode === VIEW_MODE.GRAPH_CODE"
        />
        <ModelViewMap v-show="viewMode === VIEW_MODE.MAP_VIEW" />
        <CommonDrawer
            v-model="showEquipmentInfo"
            :select-obj="equipmentNodeActiveData"
            is-subscript-on-demand
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            :cancel-last-request="true"
            :use-new-api="true"
            :subscribe-type="SUBSCRIBE_TYPE"
            @close="onDetailDrawerClose"
            @status-loaded="drawerObjectStatusLoaded"
        >
            <template #default="{ selectObj, curTab }">
                <DrawerPane
                    :label="i18n.global.t('meos_control_web.operation_monitoring_alt')"
                    name="operatingControl"
                >
                    <OperationMonitoring
                        v-if="showEquipmentInfo"
                        :select-obj="selectObj"
                        :running-monitor-type="RUNNING_MONITOR_TYPE"
                        :cur-tab="curTab"
                        :system-id="currentSystem.systemId"
                        @set-rel-equipment-ids="setRelEquipmentIds"
                        @detail-info-loaded="detailInfoLoaded"
                    />
                </DrawerPane>
                <DrawerPane
                    :label="i18n.global.t('meos_control_web.abnormal_event')"
                    name="abnormalEvents"
                >
                    <AbnormalBox
                        :select-obj="selectObj"
                        :ids="relEquipmentIds"
                    />
                </DrawerPane>
            </template>
            <template #extra-icon="{ selectObj }">
                <m-tips
                    v-if="CAMERA_CLASS_CODES.includes(selectObj?.classCode)"
                    :content="i18n.global.t('meos_control_web.view_surveillance_video')"
                    theme="darkTransparent"
                    placement="left"
                >
                    <div
                        class="monitor"
                        @click="openMonitorPlayer(selectObj)"
                    >
                        <MonitorPlainIcon />
                    </div>
                </m-tips>
            </template>
        </CommonDrawer>
        <MonitorPlayer
            v-if="showPlayer"
            :select-obj="currentPlayingObj"
            @close="closeMonitorPlayer"
        ></MonitorPlayer>
    </div>
    <div
        v-else
        class="wh100 fcc"
    >
        <m-illustration
            :title="i18n.global.t('meos_control_web.no_content')"
            type="noContent"
        ></m-illustration>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import { CAMERA_CLASS_CODES } from '@/constants/camera';
import MonitorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import emitter from '@/utils/bus';

import AbnormalBox from '@/views/System/components/commonAbnormalBox/index.vue';
import SysRelationChart from './SysRelationChart.vue';
import ModelViewMap from './ModelViewMap.vue';
import Header from './Header.vue';
import OperationMonitoring from '../components/operationMonitoring/index.vue';

import { VIEW_MODE } from '../constant/variable';
import { useLeftHook } from '../hooks/useLeftHook';
import { currentSystemKey, viewModeKey } from '../hooks/useBaseHook';
import { RUNNING_MONITOR_TYPE, SUBSCRIBE_TYPE } from '../constant/variable';
const currentSystem = inject(currentSystemKey);
const viewMode = inject(viewModeKey);
const { showEquipmentInfo, equipmentNodeActiveData, closeEquipmentInfo } = useLeftHook();

const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(equipmentNodeActiveData, showEquipmentInfo);
const drawerObjectStatusLoaded = () => {
    if (equipmentNodeActiveData.value?.classCode && CAMERA_CLASS_CODES.includes(equipmentNodeActiveData.value?.classCode)) {
        openMonitorPlayer(equipmentNodeActiveData.value);
    }
};

const templateData = ref({});
const detailInfoLoaded = info => {
    templateData.value = info;
};

const relEquipmentIds = ref([]);
const setRelEquipmentIds = ids => {
    if (ids.length > 0) {
        relEquipmentIds.value = ids;
    } else {
        relEquipmentIds.value = [];
    }
};

const onDetailDrawerClose = () => {
    closeEquipmentInfo();
    // 取消系统图选中状态
    emitter.emit('monitorCloseEquipmentiInfo');
};

watch(
    () => viewMode.value,
    (curView, preView) => {
        if (preView && preView !== curView) {
            onDetailDrawerClose();
        }
    }
);
</script>
<style lang="less" scoped>
.left-container {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
