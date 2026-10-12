<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-25 10:09:10
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-09-10 10:14:22
 * @Description:
-->
<template>
    <div v-loading="isLoading" :class="[publicControlVisible ? 'bg-d' : 'bg-b', headerModelView === 'list' ? 'bgc' : '', 'lighting-control']" element-loading-lottiename="circle">
        <!-- 室外照明：模板类型接口返回前只展示加载占位，避免先渲染空布局再闪成空态 -->
        <div v-if="isOutdoorPending" v-loading="true" class="lighting-control-empty" element-loading-lottiename="circle"></div>
        <!-- 项目未配置室外照明场景时，整页展示空状态，不渲染地图、控制面板等任何内容 -->
        <div v-else-if="isEmptyOutdoor" class="lighting-control-empty">
            <m-illustration :title="i18n.global.t('meos_control_web.project_no_outdoor_lighting_loop')" type="noContent" />
        </div>
        <template v-else>
            <ExpansionCollapse ref="toggleWidthDivRef" :is-unpack="unpackShow" :is-floor-view="isControls" :is-hide-expand="isHideExpand">
                <template #left>
                    <template v-if="isShow">
                        <div :class="['lighting-control-center']">
                            <template v-if="templateType">
                                <PublicLightingMap v-if="publicControlVisible && isIndoorOutdoor" @click-tempelte="clickTempelte" />
                                <BuildingLightingMap v-if="!publicControlVisible && !isIndoorOutdoor" @click-tempelte="clickTempelte" />
                            </template>
                        </div>
                    </template>
                </template>
                <template #right>
                    <div class="lighting-control-slider">
                        <div class="lighting-control-slider-top" :style="{ height: notifyList?.length ? 'calc(100% - 70px)' : '100%' }">
                            <ControlAberrantCard :has-spaces="publicControlVisible" />
                        </div>
                        <div v-if="notifyList?.length" class="lighting-control-slider-broadcast">
                            <common-notify v-if="notifyList?.length" :notify-list="notifyList" />
                        </div>
                    </div>
                </template>
            </ExpansionCollapse>

            <SimpleDrawer v-model="showDemandFulfillment" :z-index="zIndexCounter">
                <template #title> {{ i18n.global.t('meos_control_web.lighting_equipment_demand_not_met_list') }} </template>
                <template #content>
                    <DemandSituationWithTypes />
                </template>
            </SimpleDrawer>

            <SimpleDrawer v-model="showDemandDeviationList" :z-index="zIndexCounter">
                <template #title> {{ `${demandDeviationListData?.item?.localName ?? '--'}-${i18n.global.t('meos_control_web.demand_deviation_space')}` }} </template>
                <template #content>
                    <DemandDeviationList :data="demandDeviationListData?.list" :floor-item="demandDeviationListData?.item" />
                </template>
            </SimpleDrawer>

            <SimpleDrawer v-model="showDemandTargetList" :z-index="zIndexCounter">
                <template #title>{{ `${demandTargetListData?.name || ''}-${i18n.global.t('meos_control_web.requirement_target')}` }}</template>
                <template #content>
                    <div ref="demandTargetContainerRef" :style="{ height: 'calc(100%)' }">
                        <m-scrollbar :height="`calc(100%)`">
                            <div class="demand-target-tab-container">
                                <DemandTargetTab
                                    :default-config-item="demandTargetListData"
                                    :default-template-type="demandTargetListData.demandTemplateType"
                                    :container-height="demandTargetContainerHeight"
                                    @refresh-time-slot="refreshTimeSlot"
                                />
                            </div>
                        </m-scrollbar>
                    </div>
                </template>
            </SimpleDrawer>

            <spaceSidebar
                v-if="showSpaceInfo"
                :id="spaceModuleInfo?.id"
                :local-name="spaceModuleInfo?.localName"
                :object-type="spaceModuleInfo?.objType"
                :space-id="spaceModuleInfo?.id"
                :template-type="spaceModuleInfo?.templateType"
                :select-obj="spaceModuleInfo"
                @close="sidebarClose"
            />
            <moduleSidebar
                v-if="showModuleInfo"
                :id="spaceModuleInfo?.id"
                :local-name="spaceModuleInfo?.localName"
                :object-type="spaceModuleInfo?.objType"
                :space-id="spaceModuleInfo?.spaceId"
                :template-type="spaceModuleInfo?.templateType"
                @close="sidebarClose"
            />
            <buildingLightingSidebar
                v-if="showBuildingInfo"
                :local-name="spaceModuleInfo?.localName"
                :object-type="spaceModuleInfo?.objType"
                :template-type="spaceModuleInfo?.templateType"
                @close="sidebarClose"
            />
            <!-- <manualInterventionSidebar v-if="showInterventionInfo" @close="sidebarClose" /> -->
            <!-- 模块回路列表 -->
            <div
                v-if="loopListStore.type && templateType && loadStatus && funTypeInfoValue"
                class="loop-module-list-wrap"
                :style="{ height: loopListStore.listVisible ? '100%' : 0 }"
            >
                <LoopModuleList v-show="loopListStore.listVisible" />
            </div>
            <EquipmentList v-if="showEquipmentList" v-bind="equipmentObj" @back="closeEquipmentList" />"
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import useMenuInfo from './hooks/useMenuInfo';
import spaceSidebar from './components/sidebar/spaceSidebar.vue';
import moduleSidebar from './components/sidebar/moduleSidebar.vue';
import buildingLightingSidebar from './components/sidebar/buildingLightingSidebar.vue';
import PublicLightingMap from './publicLightingMap/index.vue';
import UseNotify from '@/components/commonNotify/hooks/useNotify';
import BuildingLightingMap from './buildingLightingMap/index.vue';
import ControlAberrantCard from './controlAberrantCard/index.vue';
import LoopModuleList from './loopModuleList/index.vue';
import useStore from '@/store';
import useLightAbnormal from './hooks/useLightAbnormal';
import useGlobalData from './hooks/useGlobalData';
import { loopControlList } from '@/store/loopControlList';

import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import baseStore from '@/store/baseStore';
import commonNotify from '@/components/commonNotify/index.vue';

import emitter from '@/utils/bus';
import useDrawerData from './hooks/useDrawerData';
import SimpleDrawer from './components/simple-drawer/index.vue';
import DemandSituationWithTypes from './controlAberrantCard/controls/DemandSituationWithTypes.vue';
import useDemandSituation from './hooks/useDemandSituation';
import DemandDeviationList from './components/demand-deviation-list/index.vue';
import DemandTargetTab from './controlAberrantCard/controls/DemandTargetTab.vue';
import useModuleList from './hooks/useModuleList';
import useDashboardData from './hooks/useDashboardData';
import useDashboardSSE from './hooks/useDashboardSSE';
import useMapSSE from './hooks/useMapSSE';
import useEquipmentAndSpaceSSE from './hooks/useEquipmentAndSpaceSSE';
import { ILLUM_INFO, LIGHT_DEMAND_CHANGE, LIGHT_EQUIPMENT_STATUS, LIGHT_LOOP } from '@/utils/SSEEventTypes';
import { uniq } from 'lodash';
import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';
import useDrawerVisible from '@/hooks/useDrawerVisible';
import EquipmentList from '@/components/equipmentList/index.vue';
const showEquipmentList = ref(false);
const equipmentObj = ref({});
useModuleList();
const isShow = ref(true);
const toggleWidthDivRef = ref(null);
const unpackShow = ref(true);
const callToggleWidth = val => {
    if (toggleWidthDivRef.value) {
        toggleWidthDivRef.value.toggleWidth(val);
    }
};

const demandTargetContainerRef = ref(null);
const { height: demandTargetContainerHeight } = useElementSize(demandTargetContainerRef);

const hideUnpack = ref(false);

// 照明列表数据
const funTypeInfoValue = ref(null);
provide('funTypeInfoValue', funTypeInfoValue);

const store = useStore();
const loopListStore = loopControlList();
const { projectId } = store.base;
const loadStatus = ref(false);
// 公共地图当前下转的楼层，当为空时表示全楼视角，右侧面板可以此判断
const curFloorId = ref('');
const curFloorName = ref('');
const curBuildingName = ref('');
const currentBuidingNum = ref('');
const isLoading = ref(false);
const loadingSpaceData = ref(false);
const eventObj = ref({});
const dashboardTemplateType = ref('');

provide('eventObj', eventObj);
provide('loadStatus', loadStatus);
provide('curFloorId', curFloorId);
provide('curFloorName', curFloorName);
provide('currentBuidingNum', currentBuidingNum);
provide('curBuildingName', curBuildingName);
provide('loadingSpaceData', loadingSpaceData);
provide('dashboardTemplateType', dashboardTemplateType);

const { isIndoorOutdoor, headerModelView } = useGlobalData();
const { templateType, templateName, templateTypeLoading } = useMenuInfo(isIndoorOutdoor);
// 室外照明：项目未配置室外照明场景（楼体/景观/标识照明）时整页为空状态
const isEmptyOutdoor = computed(() => !isIndoorOutdoor.value && !templateTypeLoading.value && !templateType.value);
// 室外照明：模板类型接口未返回时不渲染业务内容，避免先出现空布局再切换成空态
const isOutdoorPending = computed(() => !isIndoorOutdoor.value && templateTypeLoading.value);
// dashboard sse 按需订阅
const { dashboardSSEClient, setDashboardSSEClientOption } = useDashboardSSE();
// 地图 sse
const { mapSSEClient, setMapSSEClientOption, mapSSEClientEventTypes } = useMapSSE(templateType);
useEquipmentAndSpaceSSE();
const { CommonAreaDemandUpdateKey, ParkingLotDemandUpdateKey, CommonArea, ParkingLot, mapEquipemntAndSpaceIds } = useDashboardData(
    dashboardSSEClient,
    setDashboardSSEClientOption,
    headerModelView
);
const isControls = computed(() => {
    return headerModelView.value === 'model';
});
const findEquipmentIdAndSpaceIdInFloor = computed(() => {
    const ids = [];
    // if (headerModelView.value === 'list') {
    const builds = [...(CommonArea.value?.buildings || []), ...(ParkingLot.value?.buildings || [])];
    builds?.forEach(item => {
        item.floors.forEach(floor => {
            const { classCodeAndObjectIds = {} } = floor;
            if (curFloorId.value && curFloorId.value === floor.id) {
                ids.push(...(classCodeAndObjectIds.GeneralZone || []));
                ids.push(...(classCodeAndObjectIds.LTLTCC || []));
                ids.push(...(classCodeAndObjectIds.LTLTCU || []));
            }
            if (!curFloorId.value) {
                ids.push(...(classCodeAndObjectIds.LTLTCC || []));
                ids.push(...(classCodeAndObjectIds.GeneralZone || []));
                ids.push(...(classCodeAndObjectIds.LTLTCU || []));
            }
        });
    });
    // } else {
    // if (curFloorId.value) {
    //     const { GeneralZone = [], LTLTCC = [] } = mapEquipemntAndSpaceIds.value;
    //     const GeneralZonesByFloorId = GeneralZone.filter(item => item.floorId === curFloorId.value);
    //     const LTLTCCsByFloorId = LTLTCC.filter(item => item.floorId === curFloorId.value);
    //     const LTLTCCsByFloorIdIds = LTLTCCsByFloorId.map(item => item.id);
    //     const GeneralZonesByFloorIdIds = GeneralZonesByFloorId.map(item => item.id);
    //     ids.push(...(LTLTCCsByFloorIdIds || []));
    //     ids.push(...(GeneralZonesByFloorIdIds || []));
    // }
    // if (!curFloorId.value) {
    //     const GeneralZoneIds = mapEquipemntAndSpaceIds.value.GeneralZone.map(item => item.id);
    //     const LTLTCCIds = mapEquipemntAndSpaceIds.value.LTLTCC.map(item => item.id);
    //     ids.push(...(GeneralZoneIds || []));
    //     ids.push(...(LTLTCCIds || []));
    // }
    // }
    return uniq(ids);
});
const findClassCodeEquipmentIdAndSpaceIdInFloor = computed(() => {
    const classCodebyObjectIds = { GeneralZone: [], LTLTCC: [], LTLTCU: [] };
    // if (headerModelView.value === 'list') {
    const builds = [...(CommonArea.value?.buildings || []), ...(ParkingLot.value?.buildings || [])];
    builds?.forEach(item => {
        item.floors.forEach(floor => {
            const { classCodeAndObjectIds = {} } = floor;
            if (curFloorId.value && curFloorId.value === floor.id) {
                classCodebyObjectIds.GeneralZone.push(...(classCodeAndObjectIds.GeneralZone || []));
                classCodebyObjectIds.LTLTCC.push(...(classCodeAndObjectIds.LTLTCC || []));
                classCodebyObjectIds.LTLTCU.push(...(classCodeAndObjectIds.LTLTCU || []));
            }
            if (!curFloorId.value) {
                classCodebyObjectIds.LTLTCC.push(...(classCodeAndObjectIds.LTLTCC || []));
                classCodebyObjectIds.LTLTCU.push(...(classCodeAndObjectIds.LTLTCU || []));
                classCodebyObjectIds.GeneralZone.push(...(classCodeAndObjectIds.GeneralZone || []));
            }
        });
    });
    // } else {
    //     if (curFloorId.value) {
    //         const { GeneralZone = [], LTLTCC = [] } = mapEquipemntAndSpaceIds.value;
    //         const GeneralZonesByFloorId = GeneralZone.filter(item => item.floorId === curFloorId.value);
    //         const LTLTCCsByFloorId = LTLTCC.filter(item => item.floorId === curFloorId.value);
    //         const LTLTCCsByFloorIdIds = LTLTCCsByFloorId.map(item => item.id);
    //         const GeneralZonesByFloorIdIds = GeneralZonesByFloorId.map(item => item.id);
    //         classCodebyObjectIds.LTLTCC.push(...(LTLTCCsByFloorIdIds || []));
    //         classCodebyObjectIds.GeneralZone.push(...(GeneralZonesByFloorIdIds || []));
    //     }
    //     if (!curFloorId.value) {
    //         const GeneralZoneIds = mapEquipemntAndSpaceIds.value.GeneralZone.map(item => item.id);
    //         const LTLTCCIds = mapEquipemntAndSpaceIds.value.LTLTCC.map(item => item.id);
    //         classCodebyObjectIds.GeneralZone.push(...(GeneralZoneIds || []));
    //         classCodebyObjectIds.LTLTCC.push(...(LTLTCCIds || []));
    //     }
    // }
    classCodebyObjectIds.LTLTCC = uniq(classCodebyObjectIds.LTLTCC);
    classCodebyObjectIds.LTLTCU = uniq(classCodebyObjectIds.LTLTCU);
    classCodebyObjectIds.GeneralZone = uniq(classCodebyObjectIds.GeneralZone);
    return classCodebyObjectIds;
});
const { abnormalEventList } = useLightAbnormal(
    mapSSEClient,
    findEquipmentIdAndSpaceIdInFloor,
    loadingSpaceData,
    isIndoorOutdoor,
    curFloorId,
    templateType,
    callToggleWidth,
    headerModelView
); // 照明异常事件hook 注入

loopListStore.setVisible(false);
loopListStore.setType(null);

const { showDemandFulfillment, demandFulfillmentData, showDemandDeviationList, demandDeviationListData, showDemandTargetList, demandTargetListData, zIndexCounter } = useDrawerData(
    hideUnpack,
    headerModelView
);

const { isHideExpand, drawerVisibleState } = useDrawerVisible();
onMounted(() => {
    const simpleDrawerItemOne = {
        drawerId: `simple-drawer-one`,
        visible: computed(() => showDemandFulfillment?.value)
    };
    const simpleDrawerItemTwo = {
        drawerId: `simple-drawer-two`,
        visible: computed(() => showDemandDeviationList?.value)
    };
    const simpleDrawerItemThree = {
        drawerId: `simple-drawer-three`,
        visible: computed(() => showDemandTargetList?.value)
    };
    const sidebarItemOne = {
        drawerId: `sidebar-one`,
        visible: computed(() => showSpaceInfo?.value)
    };
    const sidebarItemTwo = {
        drawerId: `sidebar-two`,
        visible: computed(() => showModuleInfo?.value)
    };
    const sidebarItemThree = {
        drawerId: `sidebar-three`,
        visible: computed(() => showBuildingInfo?.value)
    };
    getNotifyList();
    drawerVisibleState.value = [simpleDrawerItemOne, simpleDrawerItemTwo, simpleDrawerItemThree, sidebarItemOne, sidebarItemTwo, sidebarItemThree];
});

// 获取建筑信息
const getTreeBuildingFloor = () => {
    // eslint-disable-next-line one-var
    let parasm = {
        projectId,
        isQuerySpace: false
    };
    return getListTreeBuildingFloorSpace(parasm).then(res => {
        const { data, code } = res;
        // eslint-disable-next-line eqeqeq
        if (code == '00000') {
            xplantindoorenvStore().setBuildingData(data);
            xplantindoorenvStore().setBuildingFloorData(data);
        }
    });
};

const buildingInfoPromise = getTreeBuildingFloor();
provide('buildingInfoPromise', buildingInfoPromise);

const dealEvent = data => {
    if (mapSSEClientEventTypes.includes(data.eventType)) {
        eventObj.value = {
            eventType: data.eventType,
            data: data.data
        };
    }
};
mapSSEClient.addEventListener(LIGHT_DEMAND_CHANGE, dealEvent);
mapSSEClient.addEventListener(LIGHT_LOOP, dealEvent);
mapSSEClient.addEventListener(LIGHT_EQUIPMENT_STATUS, dealEvent);
mapSSEClient.addEventListener(ILLUM_INFO, dealEvent);

onUnmounted(() => {
    mapSSEClient.removeEventListener(LIGHT_DEMAND_CHANGE, dealEvent);
    mapSSEClient.removeEventListener(LIGHT_LOOP, dealEvent);
    mapSSEClient.removeEventListener(LIGHT_EQUIPMENT_STATUS, dealEvent);
    mapSSEClient.removeEventListener(ILLUM_INFO, dealEvent);
    spaceModuleInfo.value = null;
});
watch(
    () => [findEquipmentIdAndSpaceIdInFloor.value, loadingSpaceData.value],
    () => {
        if (findEquipmentIdAndSpaceIdInFloor.value.length && !loadingSpaceData.value) {
            const insId = curFloorId.value ? curFloorId.value : projectId;
            const insType = curFloorId.value ? 'FLOOR' : 'PROJECT';
            setMapSSEClientOption(findClassCodeEquipmentIdAndSpaceIdInFloor.value, insId, insType);
        }
        console.log(abnormalEventList.value);
    },
    { deep: true }
);
const showSpaceInfo = ref(false);
const showModuleInfo = ref(false);
const showBuildingInfo = ref(false);
const spaceModuleInfo = ref({});
const showInterventionInfo = ref(false);

const sidebarClose = () => {
    showSpaceInfo.value = false;
    showModuleInfo.value = false;
    showBuildingInfo.value = false;
    showInterventionInfo.value = false;
    showDemandFulfillment.value = false;
    showDemandDeviationList.value = false;
    showDemandTargetList.value = false;
};
const clickTempelte = obj => {
    menusChange(obj);
};

// 切换菜单栏
const menusChange = item => {
    if (item.label === templateName?.value) {
        isShow.value = false;
        setTimeout(() => {
            isShow.value = true;
        }, 100);
    } else {
        templateName.value = item.label;
        templateType.value = item.key;
    }
};
const screenWidth = ref(document.documentElement.clientWidth);

provide('showSpaceInfo', showSpaceInfo);
provide('showModuleInfo', showModuleInfo);
provide('showBuildingInfo', showBuildingInfo);
provide('spaceModuleInfo', spaceModuleInfo);
provide('showInterventionInfo', showInterventionInfo);

const refreshTimeSlot = data => {
    if (data?.demandTemplateType === 'PUBLIC_AREA_LIGHTING') {
        nextTick(() => {
            CommonAreaDemandUpdateKey.value = new Date().toISOString();
        });
    }
    if (data?.demandTemplateType === 'PARKING_LOT_LIGHTING') {
        nextTick(() => {
            ParkingLotDemandUpdateKey.value = new Date().toISOString();
        });
    }
};
const handleResize = () => {
    screenWidth.value = document.documentElement.clientWidth;
};
onMounted(() => {
    useDemandSituation({ eventObj });
    window.addEventListener('resize', handleResize);
    emitter.on('viewDemandFulfillment', data => {
        sidebarClose();
        showDemandFulfillment.value = true;
        demandFulfillmentData.value = data;
    });
    emitter.on('viewDemandDeviationList', data => {
        sidebarClose();
        showDemandDeviationList.value = true;
        demandDeviationListData.value = data;
    });
    emitter.on('viewDemandTargetList', data => {
        sidebarClose();
        showDemandTargetList.value = true;
        demandTargetListData.value = data;
        refreshTimeSlot(data);
    });
    if (!isIndoorOutdoor.value) {
        watchEffect(() => {
            if (templateType.value) {
                setMapSSEClientOption();
            }
        });
    }
    loadStatus.value = false;
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);

    emitter.off('viewDemandFulfillment');
    emitter.off('viewDemandDeviationList');
    emitter.off('viewDemandTargetList');
});

//照明实例类型
const indIdVisible = computed(() => {
    return Object.keys(spaceModuleInfo.value).length !== 0 && showSpaceInfo.value ? spaceModuleInfo.value.id : curFloorId.value ? curFloorId.value : projectId;
});
//照明实例类型
const instanceTypeVisible = computed(() => {
    const res = Object.keys(spaceModuleInfo.value).length !== 0 && showSpaceInfo.value ? 'SPACE' : curFloorId.value ? 'FLOOR' : 'PROJECT';
    return res;
});
// 区分 室内照明  室外照明
const publicControlVisible = computed(() => {
    return ['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(templateType?.value);
});
const openEquipmentList = type => {
    equipmentObj.value = {
        runningMonitorSecondType: type
    };
    showEquipmentList.value = true;
};
const closeEquipmentList = () => {
    showEquipmentList.value = false;
    equipmentObj.value = {};
};
const { projectName } = baseStore();
const instanceName = computed(() => {
    if (instanceTypeVisible.value === 'SPACE') {
        return spaceModuleInfo.value?.localName;
    } else if (instanceTypeVisible.value === 'FLOOR') {
        return curFloorName.value;
    } else if (instanceTypeVisible.value === 'PROJECT') {
        return projectName;
    }
    return '';
});
const { notifyList, getNotifyList } = UseNotify();
provide('publicControlVisible', publicControlVisible);
provide('instanceTypeVisible', instanceTypeVisible);
provide('indIdVisible', indIdVisible);
provide('instanceName', instanceName);
provide('notifyList', notifyList);
provide('callToggleWidth', callToggleWidth);
provide('openEquipmentList', openEquipmentList);

watch(
    () => templateType?.value,
    () => {
        curFloorId.value = '';
        showSpaceInfo.value = false;
        showModuleInfo.value = false;
        showBuildingInfo.value = false;
        spaceModuleInfo.value = {};
        isLoading.value = false;
    },
    {
        deep: true
    }
);
watch(
    () => screenWidth.value,
    val => {
        screenWidth.value = val;
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.lighting-control-slider-broadcast {
    background-color: var(--gray-0, #fff);
    border-radius: 8px;
    margin-top: 16px;
}
@media screen and (max-width: 1600px) {
    .lighting-control .lighting-control-slider-top {
        // width: 384px;
        // min-width: 384px;
        // max-width: 384px;
    }
    .lighting-control-slider-broadcast {
        width: 384px;
    }
    .move-left-active {
        width: 414px;
    }
    .lighting-control .lighting-control-slider-model {
        width: 400px;
        min-width: 400px;
        max-width: 400px;
    }
    .lighting-control-slider-broadcast1 {
        width: 400px;
    }
}
@media screen and (min-width: 1600px) {
    .lighting-control .lighting-control-slider-top {
        // width: 464px;
        // min-width: 464px;
        // max-width: 464px;
    }
    .lighting-control-slider-broadcast {
        width: 464px;
    }
    .move-left-active {
        width: 494px;
    }
    .lighting-control .lighting-control-slider-model {
        width: 480px;
        min-width: 480px;
        max-width: 480px;
    }
    .lighting-control-slider-broadcast1 {
        width: 480px;
    }
}
.loop-module-list-wrap {
    overflow: hidden;
    position: absolute;
    background: #fff;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 88;
}
.lighting-control {
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 1280px;
    overflow-x: hidden;
    position: relative;
    &-empty {
        flex: 1;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--gray-0, #fff);
    }
    &-center {
        // flex: 1;
        width: 100%;
        height: 100%;
        position: relative;
        background-color: transparent;
    }
    &-slider {
        // padding: 16px 16px 0 0;
        height: 100%;
        width: 100%;
        &-top {
            border-radius: 8px;
            background: #fff;
            box-shadow: 0px 8px 10px 0px rgba(27, 33, 41, 0.03);
        }
        &-model {
            border-radius: 8px;
            background: #fff;
            box-shadow: 0px 8px 10px 0px rgba(27, 33, 41, 0.03);
        }
        &-broadcast {
            margin-top: 16px;
            height: 54px;
            border-radius: 8px;
            background: linear-gradient(0deg, rgba(241, 248, 255, 0.8) 0%, rgba(241, 248, 255, 0.8) 100%), rgba(225, 239, 255, 0.8);
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        }
    }
}
.bg-d {
    background-color: #d5dde3;
}
.bg-b {
    background-color: #23293b;
}
.bgc {
    background-color: var(--blue-50);
    background-image: url('@/assets/imgs/page_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
}

.lighting-monitoring {
    flex: 1;
    position: absolute;
    top: 0;

    height: 100%;
}
.wh {
    width: calc(100% - 460px);
}
.wh1 {
    width: calc(100% - 542px);
}
.wh100 {
    width: 100%;
}

.demand-target-tab-container {
    height: 100%;

    :deep(.demand-target-wrapper) {
        height: 100%;
        padding: 16px 24px;
        row-gap: 16px;
        --top-padding: 16px;
    }
}
</style>
