<template>
    <div class="ventilation-perception-wrapper">
        <div class="left">
            <IframeMenu v-model="templateType" :menu-data="menuData" @menus-change="menusChange" />
        </div>
        <template v-if="!reloading">
            <div v-if="templateType" class="center" :class="{ bg: headerModelView === 'list' }">
                <Header
                    class="header-container"
                    :template-name="templateName"
                    @grid-tab-change="onGridTabChange"
                    @grid-sub-tab-change="onGridSubTabChange"
                    @search-choose-obj="clickMapObj"
                />
                <div class="center-container">
                    <vent-dashboard v-if="headerModelView === 'list'" ref="dashboardRef" @choose-space="onSpaceSelect" @entry-floor="onEntryFloor" />
                    <vent-map
                        v-show="headerModelView === 'model'"
                        ref="buildFloorMapRef"
                        :header-model-view="headerModelView"
                        :template-name="templateName"
                        :template-type="templateType"
                        :sse-client="sseClient"
                        :closed-space-time="closedSpaceTime"
                        @grid-space-select="onGridSpaceSelect"
                        @grid-sub-tab-change="onGridSubTabChange"
                        @grid-tab-change="onGridTabChange"
                    />
                </div>
            </div>
            <div class="right" :style="{ background: headerModelView === 'list' ? '#f1f4f6' : 'inherit' }">
                <div :style="{ height: notifyList?.length ? 'calc(100% - 64px)' : '100%' }">
                    <right-side-bar />
                </div>
                <div v-if="notifyList?.length" class="right-broadcast">
                    <common-notify v-if="notifyList?.length" :notify-list="notifyList" />
                </div>
            </div>
        </template>
        <CommonDrawer v-model="showModuleInfo" :sse-client="sseClient" :select-obj="selectModuleInfo" :running-monitor-type="RUNING_MONITOR_TYPEM" @close="sidebarClose">
            <!-- 空间 -->
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('common.env_quality')" name="environmentalQuality">
                <EnvironmentalQuality
                    :select-obj="selectModuleInfo"
                    :type-name="'ventilate'"
                    :space-id="selectModuleInfo?.spaceId"
                    :running-monitor-type="RUNING_MONITOR_TYPEM"
                ></EnvironmentalQuality>
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.demand_target')" name="demandTarget">
                <DemandTargetTab :is-from-space="true" />
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.related_equipment')" name="associatedEquip">
                <AssociatedEquip
                    :id="selectModuleInfo?.id"
                    :space-id="selectModuleInfo?.spaceId"
                    :running-monitor-type="RUNING_MONITOR_TYPEM"
                    :running-monitor-second-type="templateType"
                    :type-name="'ventilate'"
                    :select-obj="selectModuleInfo"
                    :cur-floor-id="currentFloorObj?.id || ''"
                    @loaded-equips="loadedRelationObjs"
                    @hover-equip="hoverMapObj"
                    @unhover-equip="unhoverMapObj"
                    @click-equip="clickMapObj"
                ></AssociatedEquip>
            </DrawerPane>
            <!-- 设备 -->
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="controlConsole">
                <ControlConsole
                    :select-obj="selectModuleInfo"
                    :running-monitor-type="RUNING_MONITOR_TYPEM"
                    @hover-obj="hoverMapObj"
                    @unhover-obj="unhoverMapObj"
                    @click-obj="clickMapObj"
                ></ControlConsole>
            </DrawerPane>

            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.equipment_service_zone')" name="equipServiceSpace">
                <EquipServiceSpace
                    :id="selectModuleInfo?.id"
                    :cur-floor-id="currentFloorObj?.id || ''"
                    :running-monitor-type="RUNING_MONITOR_TYPEM"
                    :running-monitor-second-type="templateType"
                    :select-obj="selectModuleInfo"
                    @loaded-spaces="loadedRelationObjs"
                    @click-space="clickMapObj"
                    @hover-space="hoverMapObj"
                    @unhover-space="unhoverMapObj"
                ></EquipServiceSpace>
            </DrawerPane>
        </CommonDrawer>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import IframeMenu from '@/components/common/IframeMenu.vue';
import useMenuTabs from './hooks/useMenuTabs';
import useHVACGlobalData from './hooks/useHVACGlobalData';
import useHVACControlSSE from './hooks/useHVACControlSSE';
import VentMap from './vent-map/index.vue';
import Header from './Header/index.vue';
import VentDashboard from './VentDashboard/index.vue';
import useDashboard from './hooks/useDashboard';
import useSpaceSSE from './hooks/useSpaceSSE';

import RightSideBar from './right-side-bar/index.vue';

import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';

// 设备用组件
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue'; // 运行控制
import EquipServiceSpace from '@/components/equipment-service-space/index.vue'; // 设备服务空间
import { OBJ_TYPE } from '@/utils/globalVariables';

// 空间用组件
import EnvironmentalQuality from '@/views/Common/environmentalQuality/index.vue'; // 环境品质
import AssociatedEquip from '@/views/Common/associatedEquip/index.vue'; // 关联设备
import DemandTargetTab from './components/DemandTargetTab.vue';
import xplantindoorenvStore from '@/store/xplantindoorenv';

import baseStore from '@/store/baseStore';
import commonNotify from '@/views/Common/commonNotify/index.vue';
import UseNotify from '@/views/Common/commonNotify/hooks/useNotify';
const RUNING_MONITOR_TYPEM = 'VENTILATION';

const { menuData, templateType, templateName, reloading, menusChange } = useMenuTabs();
// 空间sse通道
const { spaceSSEClient, setSpaceSSEClientOption } = useSpaceSSE();
const { writeFloorInfoComputed } = useDashboard(templateName, templateType);
const { currentFloorObj, currentBuildingObj, headerModelView, floorFrome, buildFloorMapRef } = useHVACGlobalData(
    setSpaceSSEClientOption,
    writeFloorInfoComputed,
    templateName,
    templateType
);
const { sseClient, setSSEClientOption } = useHVACControlSSE(currentFloorObj, templateType);
const { notifyList } = UseNotify('VENTILATION', sseClient);

const showModuleInfo = ref(false);
const selectModuleInfo = ref({});
const dashboardRef = ref();
provide('selectModuleInfo', selectModuleInfo);
provide('showModuleInfo', showModuleInfo);
const searchChooseObj = (obj, type) => {
    buildFloorMapRef.value?.clickMapObj(obj, type);
};
const { projectId } = baseStore();
const onSpaceSelect = space => {
    if (space) {
        showModuleInfo.value = false;

        nextTick(() => {
            selectModuleInfo.value = {
                ...space,
                floorLocalName: space?.floorLocalName || space?.floorLocalId,
                spaceId: space?.id,
                type: 'space'
            };
            showModuleInfo.value = true;
        });
    } else {
        selectModuleInfo.value = {};
        showModuleInfo.value = false;
    }
};

const onEntryFloor = floorObj => {
    if (currentFloorObj.value?.id === floorObj.id) return;
    currentFloorObj.value = floorObj;
    headerModelView.value = 'model';
    floorFrome.value = 'dashboard';
};
//实例ID
const computedInstanceId = computed(() => {
    const res = selectModuleInfo.value?.objType === OBJ_TYPE.SPACE && showModuleInfo.value ? selectModuleInfo.value?.id : currentFloorObj.value?.id || projectId;
    return res;
});
//实例类型
const computedInstanceType = computed(() => {
    const res = selectModuleInfo.value?.objType === OBJ_TYPE.SPACE && showModuleInfo.value ? 'SPACE' : currentFloorObj.value?.id ? 'FLOOR' : 'PROJECT';
    return res;
});
const selectList = computed(() => {
    const allBuildingData = xplantindoorenvStore().buildingData;
    return allBuildingData?.map(obj => {
        return { ...obj, name: obj.localName || obj.name || '--' };
    });
});
provide('computedInstanceId', computedInstanceId);
provide('computedInstanceType', computedInstanceType);
const selectedBuildingId = ref('');
const floorSelectRef = ref();

const closedSpaceTime = ref('');

const sidebarClose = () => {
    closedSpaceTime.value = new Date().toLocaleString();
    showModuleInfo.value = false;
    selectModuleInfo.value = {};
};

const loadedRelationObjs = arr => {
    buildFloorMapRef.value?.showMapRelationMode(arr);
};

const unhoverMapObj = () => {
    buildFloorMapRef.value?.unhoverMapObj();
};

const hoverMapObj = obj => {
    buildFloorMapRef.value?.hoverMapObj(obj);
};

const clickMapObj = obj => {
    buildFloorMapRef.value?.clickMapObj(obj);
};
const defaultBuildingId = computed(() => {
    const curFloorId = currentFloorObj?.value?.floorId;
    const curOptions = selectList.value;
    if (curFloorId) {
        const hasCurFloorBuild = curOptions?.find(v => {
            const curFloorIds = v?.floors?.map(f => f.id);
            return curFloorIds?.includes(curFloorId);
        });
        return hasCurFloorBuild?.id;
    } else {
        return curOptions?.[0]?.id;
    }
});
const onGridSpaceSelect = space => {
    if (space) {
        showModuleInfo.value = false;

        nextTick(() => {
            selectModuleInfo.value = {
                ...space,
                floorLocalName: space?.floorLocalName || space?.floorLocalId,
                spaceId: space?.id,
                type: 'space'
            };
            showModuleInfo.value = true;
        });
    } else {
        selectModuleInfo.value = {};
        showModuleInfo.value = false;
    }
};
watch(
    () => floorSelectRef?.value?.buildingId,
    cur => {
        if (cur) {
            selectedBuildingId.value = cur;
        }
    }
);
const onGridSubTabChange = item => {
    if (item) {
        selectModuleInfo.value = {};
        showModuleInfo.value = false;
    }
};

const onGridTabChange = item => {
    headerModelView.value = item;
    if (item) {
        selectModuleInfo.value = {};
        showModuleInfo.value = false;
    }
    if (item === 'list' && currentFloorObj.value?.id) {
        scrollToFloor(currentFloorObj.value?.id);
    }
};
const scrollToFloor = id => {
    nextTick(() => {
        dashboardRef?.value.dashboardFrame(id);
    });
};
watch(
    [() => headerModelView.value, () => currentFloorObj?.value?.id, templateType],
    ([cur, curFloorId, curTemplate]) => {
        if (curTemplate) {
            if (cur === 'list') {
                setSSEClientOption(projectId, 'PROJECT', curTemplate);
            } else {
                if (curFloorId) {
                    setSSEClientOption(curFloorId, 'FLOOR', curTemplate);
                } else {
                    setSSEClientOption(projectId, 'PROJECT', curTemplate);
                }
            }
        }
    },
    {
        immediate: true
    }
);

watch(templateType, () => {
    currentFloorObj.value = null;
    showModuleInfo.value = false;
    selectModuleInfo.value = {};
});
</script>

<style lang="less" scoped>
.ventilation-perception-wrapper {
    height: 100%;
    width: 100%;
    background-color: #d6dde5;
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
