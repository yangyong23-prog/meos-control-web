<template>
    <div class="kitchen-fumes-wrapper">
        <div class="left">
            <div v-show="!isFloorView" class="grid-container">
                <div class="left-loading">
                    <LeftGrids></LeftGrids>
                </div>
                <div class="bottom-warp">
                    <Legend></Legend>
                </div>
            </div>
            <floor-map v-show="isFloorView"></floor-map>
        </div>
        <div id="flexItem" class="right">
            <RightSideBar :style="{ height: notifyList?.length ? 'calc(100% - 66px)' : '100%' }"></RightSideBar>
            <div v-if="notifyList?.length" class="right-broadcast">
                <common-notify v-if="notifyList?.length" :notify-list="notifyList" />
            </div>
        </div>

        <!--侧弹窗 -->
        <CommonDrawer
            v-model="showModuleInfo"
            :select-obj="selectModuleInfo"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            :is-subscript-on-demand="true"
            :use-new-api="true"
            @close="closeDetailDrawer"
        >
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.related_info')" name="AssociatedEquip">
                <AssociatedDevicesNew
                    :select-obj="selectModuleInfo"
                    :processed-data="serviceSpaceEquipmentGroup"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    collapse
                    control-group-code="equipParameterSet"
                    :res="templateData"
                    can-jump
                    :can-click="true"
                    @click-name="clickObj"
                    @hover-equip="obj => hoverMapObj(obj, true)"
                    @unhover-equip="unhoverMapObj"
                ></AssociatedDevicesNew>
            </DrawerPane>

            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="controlConsole">
                <!-- <ControlConsole
                    :hide-abnormal-list="true"
                    :select-obj="selectModuleInfo"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    :current-floor-obj="currentFloorObj || ''"
                    @click-obj="clickObj"
                /> -->
                <OperatingMonitoring
                    :id="selectModuleInfo?.id"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    :res="templateData"
                    :group-codes="['equipParameterSet', 'runningParameter', 'techniqueParameter']"
                ></OperatingMonitoring>
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.related_info')" name="equipmentRelationShip">
                <AngleViewByBuilding
                    :select-obj="selectModuleInfo"
                    :extra-equipment-group-codes="['runningParameter', 'curveStatistic']"
                    :group-list="processedDataFn(templateData?.relation?.groupChildren)"
                    @loaded-objects="loadedRelationObjs"
                    @hover-equip="obj => hoverMapObj(obj, true)"
                    @unhover-equip="unhoverMapObj"
                    @click-name="clickObj"
                >
                </AngleViewByBuilding>
            </DrawerPane>
            <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalList">
                <AbnormalTabBox :select-obj="selectModuleInfo"></AbnormalTabBox>
            </DrawerPane>
            <!-- <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.equipment_service_zone')" name="EquipmentServiceSpace">
                <EquipmentServiceSpace
                    :select-obj="selectModuleInfo"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    @open-space-detail="openSpaceDetail"
                    @open-equip-detail="openEquipDetail"
                />
            </DrawerPane> -->
        </CommonDrawer>
        <EquipmentList
            v-if="showEquipmentList"
            :floor-id="currentFloorObj?.id"
            :select-equip-id="selectModuleInfo?.id || ''"
            @back="close"
            @click-equip="clickObj"
            @close-equipment-info="closeDetailDrawer"
        />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Legend from './components/Legend.vue';
import LeftGrids from './left-grids/index.vue';
import RightSideBar from './right-side-bar/index.vue';
import EquipmentList from '@/components/equipmentList/index.vue';

import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import AssociatedDevicesNew from '@/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue'; // 关联设备
import AngleViewByBuilding from '@/components/ObjectInfoComponents/AssociatedDevicesNew/AngleViewByBuilding.vue';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';

import useKitchenFumesGlobal from './hooks/useKitchenFumesGlobal';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useGridData from './hooks/useGridData';
import { gridSseclientKey } from './constant/injectKey';
import { OBJ_TYPE } from '@/utils/globalVariables';
import { RUNNING_MONITOR_TYPE } from './constant/index';
import CommonNotify from '@/components/commonNotify/index.vue';
import UseNotify from '@/components/commonNotify/hooks/useNotify';

// 设备用组件
import OperatingMonitoring from '@/components/ObjectInfoComponents/OperationMonitoring/index.vue'; // 运行监控
import { useObjectInfoDataByTemplateHook } from '@/hooks/useObjectInfoDataByTemplateHook';
import FloorMap from './FloorMap/index.vue';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';

const {
    showModuleInfo,
    selectModuleInfo,
    closeDetailDrawer,
    selectOwnId,
    spaceData,
    isFloorView,
    equipsForMap,
    currentFloorObj,
    floorMapRef,
    curFloorSpaceList,
    curFloorEquipmentList
} = useKitchenFumesGlobal();
const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(RUNNING_MONITOR_TYPE);
const { equipClassCode2objectIds } = useGridData(spaceData, equipsForMap, currentFloorObj, curFloorSpaceList, curFloorEquipmentList);

const { templateData, closeObjectInfoSSEClient } = useObjectInfoDataByTemplateHook(selectModuleInfo);

const eventType = [CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, RELEASE_INTERVENTION];
useResponsiveDockSSEHandle(sseClient, [...eventType]);
const { notifyList, getNotifyList } = UseNotify();
const showEquipmentList = ref(false);

const serviceSpaceEquipmentGroup = computed(() => {
    const obj = toRaw(unref(templateData?.value));
    const equipments = obj?.serviceSpaceEquipment?.relInfoCodeConfigs?.reduce((acc, cur) => (cur?.dataValue ? acc.concat(cur.dataValue) : acc), []) || [];
    equipments?.forEach(obj => {
        obj.floorId = obj.inFloor?.id;
    });
    if (equipments.length > 0) {
        return [
            {
                ...obj?.serviceSpaceEquipment,
                equipments
            }
        ];
    }
    return [];
});
const close = () => {
    showEquipmentList.value = false;
};
watch(equipClassCode2objectIds, () => {
    if (equipClassCode2objectIds.value) {
        setSSEClientOption({
            claasCode2objectIds: equipClassCode2objectIds.value,
            eventType
        });
    }
});

watch(serviceSpaceEquipmentGroup, () => {
    if (showModuleInfo?.value && serviceSpaceEquipmentGroup.value?.length > 0) {
        loadedRelationObjs(serviceSpaceEquipmentGroup.value[0].equipments);
    }
});

watch(showModuleInfo, val => {
    if (!val) {
        closeObjectInfoSSEClient();
    }
});

const moreItemType = ref(''); //区分更多空间选中

const clickObj = obj => {
    selectOwnId.value = '';
    showModuleInfo.value = true;
    selectModuleInfo.value = obj;
};

const processedSpaceDataFn = data => {
    if (data) {
        const equipments = data.relInfoCodeConfigs?.reduce((acc, cur) => (cur?.dataValue ? cur.dataValue.concat(acc) : acc), []) || [];
        if (showModuleInfo?.value) {
            loadedRelationObjs(equipments);
        }
        if (equipments.length > 0) {
            return [
                {
                    ...data,
                    equipments
                }
            ];
        }
    }
    return [];
};
const processedDataFn = data => {
    if (data) {
        return data.map(item => {
            return {
                ...item,
                equipments: item.relInfoCodeConfigs?.[0]?.dataValue || []
            };
        });
    }
    return [];
};

const unhoverMapObj = () => {
    if (isFloorView.value) {
        floorMapRef.value?.hover();
    }
};

const hoverMapObj = (obj, fromRel) => {
    if (isFloorView.value) {
        floorMapRef.value?.hover(obj, fromRel);
    }
};
const loadedRelationObjs = obj => {
    if (showModuleInfo?.value && isFloorView.value) {
        floorMapRef.value?.showRelation(obj);
    }
};

//侧边栏设备服务空间
const openSpaceDetail = (item, type, spaceId) => {
    selectOwnId.value = '';
    showModuleInfo.value = true;
    selectModuleInfo.value = item;
};
useWatchWithCleanup(
    () => showEquipmentList.value,
    () => {
        closeDetailDrawer();
    }
);
provide('moreItemType', moreItemType);
provide('showEquipmentList', showEquipmentList);
provide(gridSseclientKey, sseClient);
onMounted(() => {
    getNotifyList();
});
</script>

<style lang="less" scoped>
.kitchen-fumes-wrapper {
    width: 100%;
    height: 100%;
    background: #f7f9fa;
    display: flex;
    min-width: 950px;

    .left {
        flex: 1;
        position: relative;
        background-color: transparent;
        .grid-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;

            // padding: 16px 0px 16px 24px;
            .bottom-warp {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    .right {
        // margin: 16px;
        // margin-left: 0px;
        // min-width: 384px;
        position: relative;
        padding: 16px 16px 16px 0;
        &-broadcast {
            position: absolute;
            bottom: 16px;
            right: 16px;
            height: 54px;
            border-radius: 8px;
            background: linear-gradient(0deg, rgba(241, 248, 255, 0.8) 0%, rgba(241, 248, 255, 0.8) 100%), rgba(225, 239, 255, 0.8);
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        }
    }
}

.left-loading {
    width: 100%;
    height: calc(100% - 44px);
    display: flex;
    flex-direction: column;
    background-color: transparent;
    padding: 16px 16px 0px 24px;
}

@media (max-width: 1600px) {
    .left {
        max-width: calc(100% - 400px);
    }
    .right {
        width: 400px;
        &-broadcast {
            width: 384px;
        }
    }
}
@media (min-width: 1600px) {
    .left {
        max-width: calc(100% - 480px);
    }
    .right {
        width: 480px;
        &-broadcast {
            width: 464px;
        }
    }
}
</style>
