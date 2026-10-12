<template>
    <div class="toilet wh100" :class="currentFloorObj?.id && d3bgColor ? '' : 'image-bg'" :style="currentFloorObj?.id && d3bgColor ? { backgroundColor: `#${d3bgColor}` } : ''">
        <ExpansionCollapseNew v-model="showExpansionCollapseNew" :hide-icon="showCommonDrawer">
            <template #left> <Left :loading="loading" /> </template>
            <template #right>
                <Right />
            </template>
        </ExpansionCollapseNew>
        <CommonDrawer v-model="showCommonDrawer" :select-obj="currentSelectObj" is-subscript-on-demand :running-monitor-type="RUNNING_MONITOR_TYPE" @close="closeDetailDrawer">
            <DrawerPane v-if="currentSelectObj.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('common.env_quality')" name="environmentalQuality">
                <EnvironmentalQuality
                    :data="envQualityData"
                    :is-abnormal="false"
                    :select-obj="currentSelectObj"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                ></EnvironmentalQuality>
            </DrawerPane>

            <!-- 设备 -->
            <DrawerPane v-if="currentSelectObj.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="controlConsole">
                <OperatingMonitoring :id="currentSelectObj?.id" :running-monitor-type="RUNNING_MONITOR_TYPE" :res="templateData" :stratification="false"></OperatingMonitoring>
            </DrawerPane>
            <DrawerPane v-if="currentSelectObj.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.related_info')" name="equipServiceSpace">
                <AngleViewByBuilding :select-obj="currentSelectObj" :group-list="processedDataFn(templateData?.relation)" @click-name="clickName"></AngleViewByBuilding>
            </DrawerPane>
            <DrawerPane v-if="currentSelectObj.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.related_info')" name="associatedEquip">
                <AssociatedDevicesNew
                    :select-obj="currentSelectObj"
                    :basic-data="templateData?.relation?.groupChildren || []"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    collapse
                    :res="templateData"
                    can-jump
                    :title-ellipsis="false"
                    @click-name="clickName"
                ></AssociatedDevicesNew>
            </DrawerPane>
            <DrawerPane v-if="currentSelectObj.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.abnormal_event')" name="equipAbnormalList">
                <AbnormalTabBox :select-obj="currentSelectObj"></AbnormalTabBox>
            </DrawerPane>
            <DrawerPane v-if="currentSelectObj.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.abnormal_event')" name="spaceAbnormalList">
                <AbnormalTabBox :select-obj="currentSelectObj"></AbnormalTabBox>
            </DrawerPane>
        </CommonDrawer>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ExpansionCollapseNew from '@/components/expansionCollapseAssemblyNew/index.vue';
import Left from './left/index.vue';
import Right from './right/index.vue';
import { useBaseDataHook } from './hooks/useBaseDataHook';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import EnvironmentalQuality from '@/components/ObjectInfoComponents/EnvironmentalQualityNew/index.vue'; // 环境品质
import { RUNNING_MONITOR_TYPE } from './variables';
import AssociatedDevicesNew from '@/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue'; // 关联设备
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import OperatingMonitoring from '@/components/ObjectInfoComponents/OperationMonitoring/index.vue'; // 运行监控
import AngleViewByBuilding from '@/components/ObjectInfoComponents/AssociatedDevicesNew/AngleViewByBuilding.vue';
import { usemessageInfo } from '@/utils/tools';
import { OBJ_TYPE } from '@/utils/globalVariables';

const {
    d3bgColor,
    loading,
    showCommonDrawer,
    showExpansionCollapseNew,
    currentSelectObj,
    currentFloorObj,
    templateData,
    abnormalEventListUpdateTime,
    buildFloorMapRef,
    dashboardData,
    closeDetailDrawer
} = useBaseDataHook();

const envQualityData = computed(() => {
    return (
        templateData?.value?.relInfoCodeGroupConfigs?.filter(group => {
            return ['curveStatistic', 'enviroParameter']?.includes(group.groupCode);
        }) || []
    );
});
const processedDataFn = data => {
    console.log(data);
    if (data) {
        return data.groupChildren.map(item => ({
            ...item,
            equipments: item.relInfoCodeConfigs?.[0]?.dataValue || []
        }));
    }
    return [];
};
const clickName = item => {
    if (currentFloorObj.value.id && currentFloorObj.value.id !== item.floorId) {
        usemessageInfo(i18n.global.t('meos_control_web.device_not_on_current_floor'));
    }
    currentSelectObj.value = item;
};
const loadedRelationObjs = arr => {
    buildFloorMapRef.value?.showMapRelationMode(arr);
};
const handleData = data => {
    const relEquipment = data[0]?.relInfoCodeGroupConfigs?.find(g => g.groupCode === 'relEquipment');
    return relEquipment ? [relEquipment] : [];
};
const unhoverMapObj = () => {
    buildFloorMapRef.value?.unhoverMapObj();
};

const hoverMapObj = obj => {
    buildFloorMapRef.value?.hover(obj);
};
const clickMapObj = obj => {
    buildFloorMapRef.value?.click(obj);
};
</script>
<style lang="less" scoped>
.toilet {
    // overflow-x: hidden;
}
.image-bg {
    background: url('@/assets/imgs/page_bg.png');
    background-color: rgb(235 246 255);
    background-size: cover;
    background-repeat: no-repeat;
}
</style>
