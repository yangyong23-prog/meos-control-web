<template>
    <div class="ventilation-perception-wrapper">
        <ExpansionCollapseNew
            ref="expansionCollapseRef"
            v-model="showExpansionCollapseNew"
            :style="{ backgroundColor: headerModelView === 'model' ? mapBgColor : '' }"
            :hide-icon="showCommonDrawer || headerModelView === 'model'"
        >
            <template #left> <Left :loading="loading || dyncDataLoading" /> </template>
            <template #right>
                <Right />
            </template>
        </ExpansionCollapseNew>

        <!-- <Left :loading="loading" />
        <Right></Right> -->

        <CommonDrawer
            v-model="showCommonDrawer"
            :select-obj="selectObject"
            :subscribe-type="SUBSCRIBE_TYPE"
            :is-subscript-on-demand="true"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            :z-index="Z_INDEX.priorityDrawer"
            @close="closeDetailDrawer"
        >
            <!-- 空间 -->
            <DrawerPane v-if="selectObject?.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('common.env_quality')" name="environmentalQuality">
                <EnvironmentalQuality :data="[templateData?.enviroParameter]" :select-obj="selectObject"></EnvironmentalQuality>
            </DrawerPane>
            <DrawerPane v-if="selectObject?.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.abnormal_event')" name="spaceAbnormalList">
                <AbnormalTabBox :select-obj="selectObject"></AbnormalTabBox>
            </DrawerPane>
            <DrawerPane v-if="selectObject?.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.related_info')" name="spaceRelationShip">
                <AssociatedDevicesNew
                    :select-obj="selectObject"
                    :basic-data="templateData?.relation?.groupChildren || []"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    collapse
                    control-group-code="controlledParameterSet"
                    :res="templateData"
                    can-jump
                    :can-click="false"
                ></AssociatedDevicesNew>
            </DrawerPane>

            <!-- 设备 -->
            <DrawerPane v-if="selectObject?.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="controlConsole">
                <OperatingMonitoring
                    :id="selectObject?.id"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    :res="templateData"
                    :group-codes="['controlledParameterSet', 'runningParameter']"
                ></OperatingMonitoring>
            </DrawerPane>

            <DrawerPane v-if="selectObject?.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.related_info')" name="equipmentRelationShip">
                <AngleViewByBuilding :select-obj="selectObject" :res="templateData" :group-list="processedDataFn(templateData?.relation?.groupChildren)"></AngleViewByBuilding>
            </DrawerPane>

            <DrawerPane v-if="selectObject?.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.abnormal_event')" name="equipAbnormalList">
                <AbnormalTabBox :select-obj="selectObject"></AbnormalTabBox>
            </DrawerPane>
        </CommonDrawer>
        <EquipmentList
            v-if="showEquipmentList"
            v-bind="equipmentObj"
            :select-equip-id="selectObject?.id || ''"
            @back="closeEquipmentList"
            @click-equip="openDetailDrawer"
            @close-equipment-info="closeDetailDrawer"
        />
    </div>
</template>

<script setup>
import EquipmentList from '@/components/equipmentList/index.vue';
import ExpansionCollapseNew from '@/components/expansionCollapseAssemblyNew/index.vue';
import Left from './left/index.vue';
import Right from './right/index.vue';
import useBaseHook from './hooks/useBaseHook';
import useHeaderHook from './hooks/useHeaderHook';
import useVentStaticData from './hooks/useVentStaticData';

import { RUNNING_MONITOR_TYPE, SUBSCRIBE_TYPE } from './variables';
import { Z_INDEX } from '@/constants/zIndex';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';

// 设备用组件
import OperatingMonitoring from '@/components/ObjectInfoComponents/OperationMonitoring/index.vue'; // 运行监控

import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import useEquipmentLIst from './hooks/useEquipmentList';

import AssociatedDevicesNew from '@/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue'; // 关联设备
import EnvironmentalQuality from '@/components/ObjectInfoComponents/EnvironmentalQualityNew/index.vue'; // 环境品质
import AngleViewByBuilding from '@/components/ObjectInfoComponents/AssociatedDevicesNew/AngleViewByBuilding.vue';

import { useObjectInfoDataByTemplateHook } from '@/hooks/useObjectInfoDataByTemplateHook';

import i18n from '@/localization';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { OBJ_TYPE } from '@/utils/globalVariables';

useHeaderHook();
const {
    loading,
    dyncDataLoading,
    showExpansionCollapseNew,
    mapBgColor,
    selectObject,
    showCommonDrawer,
    closeDetailDrawer,
    openDetailDrawer,
    headerModelView,
    buildFloorMapRef,
    curEquiList,
    currentFloorObj
} = useBaseHook();
const equipmentObj = computed(() => ({ floorId: currentFloorObj.value?.id }));
const { showEquipmentList, closeEquipmentList } = useEquipmentLIst();
const { templateData, closeObjectInfoSSEClient } = useObjectInfoDataByTemplateHook(selectObject);
useVentStaticData(curEquiList);

const processedDataFn = data => {
    if (data) {
        console.log('processedDataFn--data: ', data);
        return data.map(item => {
            return {
                ...item,
                equipments: item.relInfoCodeConfigs?.[0]?.dataValue || []
            };
        });
    }
    return [];
};

const expansionCollapseRef = ref();

watch(headerModelView, () => {
    if (headerModelView.value === 'model') {
        expansionCollapseRef.value?.toggleWidth(true);
    }
});
watch(templateData, () => {
    if (templateData.value && headerModelView.value === 'model') {
        const arr = [];
        // console.log('templateData.value.relation: ', templateData.value.relation);
        templateData.value.relation?.groupChildren?.forEach(obj => {
            obj.relInfoCodeConfigs?.forEach(info => {
                info.dataValue?.forEach(item => {
                    arr.push(item);
                });
            });
        });
        if (arr.length > 0) {
            buildFloorMapRef.value?.showMapRelationMode(arr);
        }
    }
});
watch(showCommonDrawer, val => {
    if (!val) {
        closeObjectInfoSSEClient();
    }
});
useWatchWithCleanup(
    () => showEquipmentList.value,
    () => {
        closeDetailDrawer();
    }
);
</script>
<style lang="less">
.detail-commondrawer-abnormal-list-warp {
    padding: 16px 0 0 16px;
}
</style>
<style lang="less" scoped>
.ventilation-perception-wrapper {
    background: url('@/assets/imgs/page_bg.png');
    background-color: rgb(235 246 255);
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    height: 100%;
    width: 100%;
    // background-color: #d6dde5;
    display: flex;
    justify-content: space-between;
    min-width: 1280px;
}

.center {
    flex: 1;
    min-width: 429px;
    position: relative;
    top: 0;
    .header-container {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        // background-color: @grey-100;
        z-index: 100;
    }
    &-container {
        width: 100%;
        height: calc(100% - 54px);
        display: flex;
        position: absolute;
        top: 54px;
    }
}
.bg {
    background-color: @grey-100;
}

.right {
    padding: 16px;
    padding-left: 0px;
    min-width: 384px;
    &-broadcast {
        margin-top: 12px;
        height: 54px;
        border-radius: 8px;
        background: linear-gradient(0deg, rgba(241, 248, 255, 0.8) 0%, rgba(241, 248, 255, 0.8) 100%), rgba(225, 239, 255, 0.8);
        box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    }
}

@media (max-width: 1600px) {
    .right {
        width: 384px;
    }
}
@media (min-width: 1600px) {
    .right {
        width: 480px;
    }
}
</style>
