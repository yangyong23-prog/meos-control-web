<template>
    <div class="air-cold-left fcc">
        <Header />
        <SysRelationChart v-show="viewMode === GraphCode" :show="viewMode === GraphCode" />
        <ModelViewMap v-show="viewMode === MapView" />
        <CommonDrawer
            v-model="showEquipmentInfo"
            :select-obj="equipmentNodeActiveData"
            is-subscript-on-demand
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            @close="onDetailDrawerClose"
            @status-loaded="drawerObjectStatusLoaded"
        >
            <template #default="{ selectObj }">
                <DrawerPane :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="operatingControl">
                    <OperationMonitoring
                        v-if="showEquipmentInfo"
                        :id="selectObj.id"
                        :select-obj="selectObj"
                        :running-monitor-type="RUNNING_MONITOR_TYPE"
                        :group-codes="[
                            GROUP_CODE_KEY_MAP.controlGroupOfTheSeriesConnectedChiller,
                            GROUP_CODE_KEY_MAP.controlledParameterSet,
                            GROUP_CODE_KEY_MAP.coolingTowerFanInfo,
                            GROUP_CODE_KEY_MAP.electricallyOperatedOnOffWaterValveInfo,
                            GROUP_CODE_KEY_MAP.runningParameter,
                            GROUP_CODE_KEY_MAP.techniqueParameter
                        ]"
                        :data-value-filter="[GROUP_CODE_KEY_MAP.coolingTowerFanInfo, GROUP_CODE_KEY_MAP.electricallyOperatedOnOffWaterValveInfo]"
                        :res="templateData"
                        :custom-control-component="() => getComponent(4)"
                        :component-attrs="{
                            systemId,
                            reasonOptions: [
                                {
                                    id: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation'),
                                    name: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation')
                                },
                                {
                                    id: i18n.global.t('meos_control_web.device_maintenance_or_commissioning'),
                                    name: i18n.global.t('meos_control_web.device_maintenance_or_commissioning')
                                },
                                { id: i18n.global.t('meos_control_web.equipment_fault_isolation'), name: i18n.global.t('meos_control_web.equipment_fault_isolation') },
                                { id: i18n.global.t('meos_control_web.cooling_demand_change'), name: i18n.global.t('meos_control_web.cooling_demand_change') },
                                { id: i18n.global.t('meos_control_web.adjust_equipment_params'), name: i18n.global.t('meos_control_web.adjust_equipment_params') },
                                { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
                            ]
                        }"
                    >
                        <template #[GROUP_CODE_KEY_MAP.coolingTowerFanInfo]>
                            <AssociatedDevicesNew
                                v-if="templateData.coolingTowerFanInfo"
                                :select-obj="selectObj"
                                :basic-data="[templateData.coolingTowerFanInfo]"
                                :running-monitor-type="RUNNING_MONITOR_TYPE"
                                collapse
                                :res="templateData"
                                can-jump
                                :title-ellipsis="false"
                                :need-tip="false"
                                :can-click="false"
                                :control-group-code="GROUP_CODE_KEY_MAP.controlledParameterSet"
                                show-data-source
                                :control-set-props="{ showControlBtnFn, hideIntervention: true, showDataSource: true }"
                                class="acac-fan-water"
                            ></AssociatedDevicesNew>
                        </template>
                        <template #[GROUP_CODE_KEY_MAP.electricallyOperatedOnOffWaterValveInfo]>
                            <AssociatedDevicesNew
                                v-if="templateData.electricallyOperatedOnOffWaterValveInfo"
                                :select-obj="selectObj"
                                :basic-data="[templateData.electricallyOperatedOnOffWaterValveInfo]"
                                :running-monitor-type="RUNNING_MONITOR_TYPE"
                                collapse
                                :res="templateData"
                                can-jump
                                :title-ellipsis="false"
                                :need-tip="false"
                                :can-click="false"
                                :control-group-code="GROUP_CODE_KEY_MAP.controlledParameterSet"
                                show-data-source
                                :control-set-props="{ showControlBtnFn: (data, id) => showControlBtnFn(data, id, selectObj), hideIntervention: true, showDataSource: true }"
                                class="acac-fan-water"
                            ></AssociatedDevicesNew>
                        </template>
                    </OperationMonitoring>
                </DrawerPane>
                <DrawerPane v-if="linkedInfoClassCodes.includes(selectObj.classCode)" :label="i18n.global.t('meos_control_web.related_info')" name="linkedInfo">
                    <AngleViewByBuilding
                        :select-obj="selectObj"
                        :res="templateData"
                        :group-list="processedDataFn(templateData?.relation?.groupChildren)"
                        :extra-equipment-group-codes="['runningParameter']"
                        :info-code-with-link="true"
                        :with-last-bottom-border="true"
                        :with-header-padding="true"
                        @click-name="handleClickName"
                    ></AngleViewByBuilding>
                </DrawerPane>
                <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalEvents">
                    <AbnormalBox :select-obj="selectObj" :ids="relEquipmentIds" />
                </DrawerPane>
            </template>
            <template #extra-icon="{ selectObj }">
                <m-tips
                    v-if="CAMERA_CLASS_CODES.includes(selectObj?.classCode)"
                    :content="i18n.global.t('meos_control_web.view_surveillance_video')"
                    theme="darkTransparent"
                    placement="left"
                >
                    <div class="monitor" @click="openMonitorPlayer(selectObj)">
                        <MonitorPlainIcon />
                    </div>
                </m-tips>
            </template>
        </CommonDrawer>
        <MonitorPlayer v-if="showPlayer" :select-obj="currentPlayingObj" @close="closeMonitorPlayer"></MonitorPlayer>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { systemIdKey, viewModeKey } from '@/views/ACAC/hooks/useBaseHook';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import { GraphCode, MapView, RUNNING_MONITOR_TYPE, CAMERA_CLASS_CODES } from '@/views/ACAC/variables';
import Header from './Header.vue';
import MonitorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import SysRelationChart from './SysRelationChart/index.vue';
import ModelViewMap from './mapView/index.vue';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import { useLeftHook } from '../hooks/useLeftHook';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import AbnormalBox from '@/views/ACAC/components/operationMonitoring/AbnormalBox.vue';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import emitter from '@/utils/bus';
import AngleViewByBuilding from '@/components/ObjectInfoComponents/AssociatedDevicesNew/AngleViewByBuilding.vue';
import { useObjectInfoDataByTemplateHook } from '../../../hooks/useObjectInfoDataByTemplateHook';
import OperationMonitoring from '@/components/ObjectInfoComponents/OperationMonitoring/index.vue'; // 运行监控
import { getComponent } from '@/components/ObjectInfoComponents/OperationMonitoring/config';
import AssociatedDevicesNew from '@/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue'; // 关联设备
import { isUnrelatedToManualAutoSet } from '@/components/ObjectInfoComponents/utils';
import { GROUP_CODE_KEY_MAP, INFO_CODE, IS_MANUAL, OTHER_REASON } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';

const { getIotData } = DockSingleton.getInstance();

const viewMode = inject(viewModeKey);
const systemId = inject(systemIdKey);
const { showEquipmentInfo, equipmentNodeActiveData, closeEquipmentInfo, openEquipmentInfo } = useLeftHook();
const { templateData } = useObjectInfoDataByTemplateHook(equipmentNodeActiveData);
const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(equipmentNodeActiveData, showEquipmentInfo);

// 离心式冷水机组、螺杆式冷水机组，需增加关联信息Tab
const linkedInfoClassCodes = ['ACCCCC', 'ACCCSC'];
const processedDataFn = data => {
    if (Array.isArray(data)) {
        return data.map(item => {
            return {
                ...item,
                equipments: item.relInfoCodeConfigs?.[0]?.dataValue || []
            };
        });
    }
    return [];
};
const showControlBtnFn = (data, id, selectObj) => {
    // 仅冷却塔控制单元的手自动状态设定=手动时才可进行控制
    if (selectObj && getIotData(selectObj.id, INFO_CODE.manualAutoStatus.infoCode)?.dataValue !== IS_MANUAL) {
        return false;
    }

    // 根据配置文件决定设备的控制是否受"手自动状态设定"限制
    return isUnrelatedToManualAutoSet(data) || getIotData(id, INFO_CODE.manualAutoStatus.infoCode)?.dataValue === IS_MANUAL;
};
const drawerObjectStatusLoaded = () => {
    if (equipmentNodeActiveData.value?.classCode && CAMERA_CLASS_CODES.includes(equipmentNodeActiveData.value?.classCode)) {
        openMonitorPlayer(equipmentNodeActiveData.value);
    }
};
const relEquipmentIds = ref([]);
const onDetailDrawerClose = () => {
    closeEquipmentInfo();
    // 取消系统图选中状态
    emitter.emit('monitorCloseEquipmentiInfo');
};

const handleClickName = item => {
    // 取消系统图选中状态
    emitter.emit('monitorCloseEquipmentiInfo');
    openEquipmentInfo(item);
};
watch(viewMode, () => {
    onDetailDrawerClose();
});
defineExpose({
    openEquipmentInfo,
    closeEquipmentInfo,
    equipmentNodeActiveData
});
</script>
<style lang="less" scoped>
.air-cold-left {
    position: relative;
}
.monitor {
    margin-right: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 4px;
    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
    }
    :deep(svg) {
        width: 18px;
        height: 18px;
    }
}
</style>

<style lang="less">
.acac-fan-water.associated-devices-new {
    padding: 0;
}
</style>
