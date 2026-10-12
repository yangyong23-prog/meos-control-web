<template>
    <div :class="['air-container', headerModelView === 'list' ? 'air-bgc' : 'air-floor-bgc']">
        <div class="air-container-left">
            <Header :scroll-top="scrollTop" @grid-tab-change="onGridTabChange" @grid-sub-tab-change="onGridSubTabChange"></Header>
            <BuildFloorMap v-show="headerModelView === 'model'" ref="buildFloorMapRef" :header-model-view="headerModelView" @get-equipments="getEquipments"></BuildFloorMap>
            <ACDashboard
                v-show="headerModelView === 'list'"
                ref="dashboardContainerRef"
                @choose-space="onSpaceSelect"
                @open-equipment-list="openEquipmentList"
                @open-running-statistics="openRunningStatistics"
                @entry-floor="onEntryFloor"
                @scroll="onScroll"
                @filter-change="delaySidebarClose"
                @open-space-schedule-modal="delaySidebarClose"
            ></ACDashboard>
            <div v-if="topologyPassThroughProps.visible" class="topology-view-wrapper">
                <SpaceTopology
                    :visible="topologyPassThroughProps.visible"
                    :loading="topologyPassThroughProps.loading"
                    :space="topologySpaceWithEnv"
                    :config="topologyPassThroughProps.config"
                    :cur-select-obj="currentSelectObj"
                    @close="closeTopology('manual')"
                    @click-equip="clickEquipWithMap"
                    @click-space="clickSpaceWithMap"
                />
            </div>
            <div v-show="showHalfView" class="half-view-wrapper">
                <HalfSectionView
                    v-model:show="showHalfView"
                    :target-data="currentSelectObj"
                    :template-data="curTemplate"
                    :info-groups="infoGroups"
                    :is-loading="isHalfViewLoading"
                />
            </div>
        </div>
        <div class="air-container-right">
            <div class="air-container-right-content" :style="{ height: notifyList?.length ? 'calc(100% - 64px)' : '100%' }">
                <div class="tab">
                    <m-tabs v-model="curTab" size="large" :data="tabItems" type="segment">
                        <template #abnormal>
                            <div class="fcc" style="display: flex; gap: 2px">
                                <span class="m-tabs-name">{{ i18n.global.t('meos_control_web.abnormal_event') }}</span>
                                <div v-if="abnormalEventCount" class="abnormal-total fcc fs12">
                                    {{ (abnormalEventCount ?? 0) > 99 ? '99+' : abnormalEventCount ?? 0 }}
                                </div>
                            </div>
                        </template>
                    </m-tabs>
                </div>
                <span v-show="curTab === 'control'">
                    <Controls @open-equipment-list="openEquipmentList" @close-equipment-list="closeEquipmentList" />
                </span>
                <span v-if="curTab === 'abnormal'">
                    <AbnormalList
                        class="abnormal-list-warp"
                        :abnormal-event-list="abnormalEventList"
                        :abnormal-event-list-loading="abnormalEventListLoading"
                        :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                        :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                    />
                </span>
            </div>
            <div v-if="notifyList?.length" class="air-container-right-broadcast">
                <common-notify v-if="notifyList?.length" :notify-list="notifyList" />
            </div>
        </div>

        <!--侧弹窗 -->
        <CommonDrawer
            v-model="showModuleInfo"
            :select-obj="currentSelectObj"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            :is-subscript-on-demand="true"
            :use-new-api="true"
            :sse-refresh-callback="refreshCallback"
            :use-half-view-handler="inHalfViewClassCodes"
            :filter-tags="shouldShowScheduleStatusTag"
            @close="sidebarClose"
        >
            <!-- 空间 -->
            <DrawerPane v-if="currentSelectObj?.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('common.env_quality')" name="environmentalQuality">
                <template #default="{ active }">
                    <EnvironmentalQuality
                        :show="active"
                        :is-abnormal="false"
                        :select-obj="currentSelectObj"
                        :space-id="currentSelectObj?.spaceId"
                        :running-monitor-type="RUNNING_MONITOR_TYPE"
                    >
                        <template #title="{ graphicData }">
                            <div class="fcb w100">
                                <span> {{ graphicData?.groupName || '' }}</span>
                                <EnvironmentalShielding :select-obj="currentSelectObj" :group-children="graphicData?.groupChildren || []" />
                            </div>
                        </template>
                        <template #info="{ graphicData }">
                            <EnvironmentalShieldingInfo :select-obj="currentSelectObj" :group-children="graphicData?.groupChildren || []" />
                        </template>
                        <template v-if="topologyHasEntry" #top>
                            <ViewSpaceTopologyEntry class="mt20" @detail-space-select="handleDetailSpaceSelect" />
                        </template>
                    </EnvironmentalQuality>
                </template>
            </DrawerPane>
            <!-- 关联信息 -->
            <DrawerPane v-if="currentSelectObj?.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.related_info')" name="associatedEquip">
                <AssociatedEquip
                    :select-obj="currentSelectObj"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    @click-name="obj => selectObject(obj, SELECT_SOURCE.RELATION)"
                    @loaded-equips="loadedRelationObjs"
                    @hover-equip="hoverMapObj"
                    @unhover-equip="unhoverMapObj"
                ></AssociatedEquip>
                <!-- <AssociatedEquip
                    :id="currentSelectObj?.id"
                    :space-id="currentSelectObj?.spaceId"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    :type-name="'terminal'"
                    :select-obj="currentSelectObj"
                    :cur-floor-id="currentFloorObj?.id || ''"
                    @loaded-equips="loadedRelationObjs"
                    @hover-equip="hoverMapObj"
                    @unhover-equip="unhoverMapObj"
                    @click-equip="clickMapObj"
                ></AssociatedEquip> -->
            </DrawerPane>
            <DrawerPane
                v-if="currentSelectObj?.objType === OBJ_TYPE.SPACE && showSpaceRequirement"
                :label="i18n.global.t('meos_control_web.demand_target')"
                name="requirementObjective"
            >
                <RequirementTarget :type="OBJ_TYPE.SPACE" />
            </DrawerPane>
            <DrawerPane v-if="currentSelectObj?.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.temporary_requirement')" name="spaceTemporaryRequirement">
                <div class="temporary-requirement-warp">
                    <TemporaryRequirement
                        ref="TemporaryRequirementRef"
                        :types="[{ id: AIR_TERMINAL, name: i18n.global.t('meos_control_web.temporary_requirement'), code: RUNNING_MONITOR_TYPE }]"
                        :list-obj="TemporaryRequirementListObj"
                        :margin-right="20"
                        :add-obj="TemporaryRequirementAddObj"
                        :collapse-text="i18n.global.t('meos_control_web.collapse_air_conditioning_requirement_configuration')"
                        :expand-text="i18n.global.t('meos_control_web.expand_air_conditioning_requirement_configuration')"
                        @open-scheduled-task="openScheduledTask"
                    >
                        <template #content="{ task }">
                            <TaskConfig :task="task" />
                        </template>
                    </TemporaryRequirement>
                </div>
            </DrawerPane>
            <DrawerPane v-if="currentSelectObj?.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.abnormal_event')" name="spaceAbnormalList">
                <AbnormalTabBox :select-obj="currentSelectObj"></AbnormalTabBox>
            </DrawerPane>

            <!-- 设备 -->
            <DrawerPane
                v-if="currentSelectObj.objType === OBJ_TYPE.EQUIPMENT || currentSelectObj.objType === OBJ_TYPE.EQUIPGROUP"
                :label="i18n.global.t('meos_control_web.operation_monitoring_alt')"
                name="controlConsole"
            >
                <OperatingMonitoring
                    v-if="NEW_CLASS_CODE_LIST.includes(currentSelectObj.classCode)"
                    :id="currentSelectObj.id"
                    :res="templateData"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    :select-obj="currentSelectObj"
                    :group-codes="[
                        GROUP_CODE_KEY_MAP.ACAHGinfoofACATAH,
                        GROUP_CODE_KEY_MAP.equipParameterSet,
                        GROUP_CODE_KEY_MAP.ACATAHinfotoACAHG,
                        GROUP_CODE_KEY_MAP.ACVVERinfotoACAHG,
                        GROUP_CODE_KEY_MAP.runningParameter,
                        GROUP_CODE_KEY_MAP.techniqueParameter
                    ]"
                    :data-value-filter="[GROUP_CODE_KEY_MAP.ACATAHinfotoACAHG, GROUP_CODE_KEY_MAP.ACVVERinfotoACAHG]"
                    :custom-control-component="() => getComponent(2)"
                    :component-attrs="{
                        serialUnitContainsTextFn: serialUnitContainsTextFn,
                        canClick: true,
                        groupCode: GROUP_CODE_KEY_MAP.equipParameterSet,
                        onClickName: clickName,
                        showEnableControlTip: false,
                        needManualAotoSet: false,
                        filterInfoCodes: [],
                        enableCtrlActualInfoCode: '',
                        alawysShowSetButtons: true,
                        showDataSource: true
                    }"
                    class="acOperatingMonitoring"
                >
                    <template v-if="hasHalfSectionView" #halfSectionView>
                        <HalfViewEntry v-model="showHalfView" />
                    </template>
                    <template #[GROUP_CODE_KEY_MAP.ACATAHinfotoACAHG]>
                        <AssociatedDevicesNew
                            v-if="templateData.ACATAHinfotoACAHG"
                            :select-obj="currentSelectObj"
                            :basic-data="[templateData.ACATAHinfotoACAHG]"
                            :running-monitor-type="RUNNING_MONITOR_TYPE"
                            collapse
                            :res="templateData"
                            can-jump
                            :title-ellipsis="false"
                            :need-tip="false"
                            :can-click="true"
                            :control-group-code="GROUP_CODE_KEY_MAP.equipParameterSet"
                            show-data-source
                            :control-set-props="{ showDataSource: true }"
                            class="ac-ACAHG"
                            @click-name="clickName"
                        ></AssociatedDevicesNew>
                    </template>
                    <template #[GROUP_CODE_KEY_MAP.ACVVERinfotoACAHG]>
                        <AssociatedDevicesNew
                            v-if="templateData.ACVVERinfotoACAHG"
                            :select-obj="currentSelectObj"
                            :basic-data="[templateData.ACVVERinfotoACAHG]"
                            :running-monitor-type="RUNNING_MONITOR_TYPE"
                            collapse
                            :res="templateData"
                            can-jump
                            :title-ellipsis="false"
                            :need-tip="false"
                            :can-click="true"
                            :control-group-code="GROUP_CODE_KEY_MAP.equipParameterSet"
                            show-data-source
                            :control-set-props="{ showDataSource: true }"
                            class="ac-ACAHG"
                            @click-name="clickName"
                        ></AssociatedDevicesNew>
                    </template>
                </OperatingMonitoring>
                <ControlConsole
                    v-else
                    :select-obj="currentSelectObj"
                    :hide-abnormal-list="true"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    :use-new-api="true"
                    @hover-obj="hoverMapObj"
                    @unhover-obj="unhoverMapObj"
                    @click-obj="obj => selectObject(obj, SELECT_SOURCE.CONTROL_CONSOLE)"
                >
                    <template v-if="hasHalfSectionView" #top>
                        <HalfViewEntry v-model="showHalfView" class="mt20" />
                    </template>
                </ControlConsole>
            </DrawerPane>
            <DrawerPane
                v-if="currentSelectObj?.objType === OBJ_TYPE.EQUIPMENT || currentSelectObj?.objType === OBJ_TYPE.EQUIPGROUP"
                :label="i18n.global.t('meos_control_web.related_info')"
                name="equipServiceSpace"
            >
                <AngleViewByBuilding
                    :select-obj="currentSelectObj"
                    :extra-equipment-group-codes="['runningParameter', 'curveStatistic']"
                    :group-list="processedDataFn(templateData?.relation?.groupChildren)"
                    @loaded-objects="loadedRelationObjs"
                    @hover-equip="obj => hoverMapObj(obj, true)"
                    @unhover-equip="unhoverMapObj"
                    @click-name="clickName"
                >
                </AngleViewByBuilding>
            </DrawerPane>
            <DrawerPane
                v-if="currentSelectObj?.objType === OBJ_TYPE.EQUIPMENT || currentSelectObj?.objType === OBJ_TYPE.EQUIPGROUP"
                :label="i18n.global.t('meos_control_web.abnormal_event')"
                name="abnormalList"
            >
                <AbnormalTabBox :select-obj="currentSelectObj"></AbnormalTabBox>
            </DrawerPane>
        </CommonDrawer>
        <!-- 设备列表 -->
        <EquipmentList
            v-if="showEquipmentList"
            v-bind="equipmentObj"
            :select-equip-id="currentSelectObj?.id || ''"
            @back="closeEquipmentList"
            @click-equip="clickEquip"
            @close-equipment-info="closeEquipmentInfo"
        />
        <RunningStatistics v-if="showRunningStatistics" :equipment-list-data="equipmentListData" @close="closeRunningStatistics" />
        <ScheduledTask v-model="showScheduledTask" v-bind="ScheduledTaskProps" @save-success="saveSuccess" />
    </div>
</template>
<script setup>
import OperatingMonitoring from '@/components/ObjectInfoComponents/OperationMonitoring/index.vue'; // 运行监控
import { throttle } from 'lodash';
import Header from './Header/index.vue';
import BuildFloorMap from './BuildingFloorMap/index.vue';
import Controls from './Controls/index.vue';
import EquipmentList from '@/components/equipmentList/index.vue';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import useStore from '@/store';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import ACDashboard from './ACDashboard/index.vue';
import { listConfigResultsByInstances } from '@/apis/DemandManagementHome';
import { RUNNING_MONITOR_TYPE, envToScheduleStatusMap, envToControlAimMap, envToParamsMap, NEW_CLASS_CODE_LIST } from './variables';
import AssociatedEquip from './components/associatedEquip.vue';
import AngleViewByBuilding from '@/components/ObjectInfoComponents/AssociatedDevicesNew/AngleViewByBuilding.vue';
import TemporaryRequirement from '@/views/Common/TemporaryRequirement/index.vue';
import ScheduledTask from './Controls/ScheduledTask/index.vue';
import AssociatedDevicesNew from '@/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue'; // 关联设备

// hooks
import useACGlobalData from './hooks/useACGlobalData';
import useStatisticsSSE from './hooks/useStatisticsSSE';
import useMapAndDashboardSSE from './hooks/useMapAndDashboardSSE';
import useLegendData from './hooks/useLegendData';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import useDashboard from './hooks/useDashboard';
import SpaceTopology from '@/components/SpaceTopologyGraph/index.vue';
import useSpaceTopologyHook from '@/components/SpaceTopologyGraph/useSpaceTopologyHook';
import useTopologySpaceEnvironment from '@/components/SpaceTopologyGraph/useTopologySpaceEnvironment';
import useTemplateShellConfigConfig from './hooks/useTemplateShellConfigConfig';
import { resetHalfSectionConfig } from '@/hooks/UseHalfSectionConfigHooks';

// 设备用组件
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue'; // 运行控制
// 空间用组件
import EnvironmentalQuality from '@/views/Common/environmentalQuality/index.vue'; // 环境品质
import EnvironmentalShielding from '@/components/ObjectInfoComponents/EnvironmentalShielding/index.vue';
import EnvironmentalShieldingInfo from '@/components/ObjectInfoComponents/EnvironmentalShielding/Info.vue';
import RequirementTarget from './Controls/RequirementTarget/index.vue';
import ViewSpaceTopologyEntry from '@/components/SpaceTopologyGraph/ViewSpaceTopologyEntry.vue';

// import AssociatedEquip from '@/views/Common/associatedEquip/index.vue'; // 关联设备
import commonNotify from '@/components/commonNotify/index.vue';
import UseNotify from '@/components/commonNotify/hooks/useNotify';
import { setMenuConfig } from '../../router/routes';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import i18n from '@/localization';
import TaskConfig from './components/TaskConfig.vue';
import { AIR_TERMINAL, getDayjsTz, GROUP_CODE_KEY_MAP, INFO_CODE, IS_MANUAL, OBJ_TYPE } from '@/utils/globalVariables';
import RunningStatistics from './components/runningStatistics/index.vue';
import HalfSectionView from '@/components/HalfSectionView/index.vue';
import HalfViewEntry from '@/components/HalfSectionView/HalfViewEntry.vue';
import useHalfViewDataHook from '@/components/HalfSectionView/hooks/useHalfViewDataHook';
import { topologyControllerKey, envParamShellConfigKey, curEnvHasShellConfigScheduleStatusKey, curEnvHasShellConfigControlAimKey, selectObjectInjectKey } from './injectKeys';
import { SELECT_SOURCE } from './constants/constant';
import DockSingleton from '@/hooks/responsiveDock';
import { computed } from 'vue';
import {
    TOPOLOGY_TEMPERATURE_STATUS_MAP,
    TOPOLOGY_CO2_STATUS_MAP,
    TOPOLOGY_RH_STATUS_MAP,
    TOPOLOGY_PRESSURE_DIFF_STATUS_MAP,
    DASHBOARD_ENV_BELONG_IDS,
    NONE_RENDER_IN_3D,
    ACATAH
} from './constants/constant';
import { getComponent } from '@/components/ObjectInfoComponents/OperationMonitoring/config';
import { getFloorInfoByFloorId, getBuildingInfoByFloorId } from '@/utils/buildingUtils';
import { $Message } from 'meri-plus';

const { base } = useStore();
const treeBuildFloorPromise = treeBuildFloorStore().handleTreeBuildingFloorData();
const { getIotData, clearAllObjectInfo } = DockSingleton.getInstance();
// 空间sse通道
const {
    dashboardCurrentEnv,
    updateSpaceEnvStatus,
    dashboardOnlyShowIOTMonitorSpace,
    dashboardEnvTabs,
    dashboardCurrentBuildingObj,
    flattenedSpaces,
    flattenedSpacesMap,
    tdbEnvStatusMap,
    co2EnvStatusMap,
    rhEnvStatusMap,
    pressureDiffEnvStatusMap
} = useDashboard();
const { mapAndDashboardSSEClient, setMapAndDashboardSSEClientOption } = useMapAndDashboardSSE(updateSpaceEnvStatus);

const {
    currentTab,
    currentEnvAttr,
    currentEnvAttrFloor,
    currentFloorObj,
    buildFloorMapRef,
    clickMapObj,
    headerModelView,
    floorFrome,
    abnormalParamIds,
    allEquipIdMap,
    allInstanceIds,
    spaceIotDataLoading,
    currentSelectObj,
    currentSelectSource,
    closeObjectInfoSSEClient,
    templateData,
    templateLoading,
    is3DView,
    acControlGroupIdMaps,
    idMapACAHGIds
} = useACGlobalData(
    setMapAndDashboardSSEClientOption,
    updateSpaceEnvStatus,
    dashboardEnvTabs,
    dashboardOnlyShowIOTMonitorSpace,
    dashboardCurrentBuildingObj,
    flattenedSpaces,
    flattenedSpacesMap,
    treeBuildFloorPromise
);

let refreshIds = new Set();
const throttleRefreshCallback = throttle(() => updateSpaceEnvStatus([...refreshIds]), 1000);

// 空调机组且有所属控制组
const ACATAHHasACAHG = computed(() => {
    // const hasACAHG = templateData?.value?.ACAHGinfoofACATAH?.relInfoCodeConfigs?.find(item => item.infoCode === 'ACAHGinfoofACATAH')?.dataValue?.length > 0;
    const hasACAHG = getACControlGroupId(currentSelectObj.value?.id);
    // console.log('hasACAHG: ', hasACAHG, currentSelectObj.value?.classCode, templateData?.value?.ACAHGinfoofACATAH?.relInfoCodeConfigs);

    return currentSelectObj.value?.classCode === ACATAH && hasACAHG;
});
const {
    hasHalfSectionView,
    showHalfView,
    infoGroups,
    curTemplate,
    isLoading: isHalfViewLoading,
    inHalfViewClassCodes
} = useHalfViewDataHook(currentSelectObj, RUNNING_MONITOR_TYPE, ACATAHHasACAHG);

const SPACE_ID_PREFIX = 'Sp';
const refreshCallback = updateData => {
    const { objectId } = updateData;
    if (!objectId || !objectId.toString().startsWith(SPACE_ID_PREFIX)) {
        return;
    }

    refreshIds.add(objectId);
    throttleRefreshCallback();
};

const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList, abnormalEventListLoadedTime, abnormalEventCount } =
    useAbnormalDataWithSSE({
        sseClient: mapAndDashboardSSEClient,
        objectIds: abnormalParamIds
    });
const equipmentObj = ref({});
// 设备列表
const showEquipmentList = ref(false);
const showRunningStatistics = ref(false);
const equipmentListData = ref(null);
const getEquipments = data => {
    // 要求设备的监测监控状态（monitoringSurveillanceStatus）= 2、3
    equipmentListData.value = data.filter(item => item.monitoringSurveillanceStatus === '2' || item.monitoringSurveillanceStatus === '3');
};
// 打开设备列表
const openEquipmentList = () => {
    equipmentObj.value = { floorId: currentFloorObj.value?.id };
    showEquipmentList.value = true;
    closeEquipmentInfo();
};

const closeEquipmentList = () => {
    showEquipmentList.value = false;
    closeEquipmentInfo();
};

const openRunningStatistics = () => {
    showRunningStatistics.value = true;
};
const closeRunningStatistics = () => {
    showRunningStatistics.value = false;
};
// 右侧统计面板sse
useStatisticsSSE(headerModelView, currentFloorObj);

useLegendData(currentTab, currentEnvAttr, currentEnvAttrFloor, currentFloorObj);

const { notifyList, getNotifyList } = UseNotify();

const dashboardContainerRef = ref();
const scrollTop = ref(0);

const TemporaryRequirementRef = ref(null);
const showScheduledTask = ref(false);
const ScheduledTaskProps = ref({});
const openScheduledTask = data => {
    ScheduledTaskProps.value = data;
    showScheduledTask.value = true;
};

const TemporaryRequirementListObj = computed(() => {
    if (currentSelectObj?.value?.objType === OBJ_TYPE.SPACE && currentSelectObj?.value?.id) {
        return { instanceIds: [currentSelectObj.value.id], instanceType: 'SPACE' };
    }
    return { instanceIds: [] };
});
const TemporaryRequirementAddObj = computed(() => {
    return {
        instanceId: currentSelectObj.value?.id,
        instanceType: 'SPACE'
    };
});
const saveSuccess = () => {
    TemporaryRequirementRef.value?.changeHandleData();
};

const onScroll = data => {
    scrollTop.value = data.scrollTop;
};

// 地图渲染关联模式
const loadedRelationObjs = arr => {
    // 未打开详情或不是3D视图视角，不显示关联模式
    if (!showModuleInfo.value || !is3DView.value) {
        return;
    }

    // 在同一控制组下的空调机组ID
    const inSameCtlGroupIds =
        acControlGroupIdMaps.value[currentSelectObj.value?.id]?.filter(id => {
            // 若是楼层图，过滤出本楼层的
            return currentFloorObj.value?.id ? allEquipIdMap.value[id]?.floorId === currentFloorObj.value?.id : true;
        }) ?? [];

    if (inSameCtlGroupIds.length > 0) {
        buildFloorMapRef.value?.unselectModel();
    } else {
        // 若不是空调机组，且是不在3D视图中渲染的，则不显示它的关联模式
        if (NONE_RENDER_IN_3D.includes(currentSelectObj.value?.classCode)) {
            return;
        }
    }
    buildFloorMapRef.value?.showMapRelationMode(arr, inSameCtlGroupIds);
};

const unhoverMapObj = () => {
    buildFloorMapRef.value?.unhoverMapObj();
};

const hoverMapObj = (obj, fromRel) => {
    buildFloorMapRef.value?.hoverMapObj(obj, fromRel);
};
const serialUnitContainsTextFn = equipments => {
    const separator = i18n.global.locale === 'en' ? ', ' : '、';
    const name = equipments.map(item => item.localName).join(separator);
    return name ? i18n.global.t('meos_control_web.equipment_name_colon') + name : '';
};

watch(
    allInstanceIds,
    ids => {
        if (ids.length) {
            onQueryAbnormalEventList({
                runningMonitorType: AIR_TERMINAL,
                projectId: base.projectId,
                instanceIds: ids,
                // 二级风控目标过滤，E5"空气质量差"，E34"偏冷",E35"偏热"
                riskMeasureAimLevel2: ['E5', 'E34', 'E35']
            });
        }
    },
    { immediate: true }
);

// 注入异常事件列表相关参数
provide('abnormalEventList', abnormalEventList);
provide('abnormalEventListLoading', abnormalEventListLoading);
provide('abnormalEventListUpdateTime', abnormalEventListUpdateTime);

const tabItems = ref([
    {
        id: 'control',
        name: i18n.global.t('meos_control_web.operation_control')
    },
    {
        id: 'abnormal',
        name: i18n.global.t('meos_control_web.abnormal_event'),
        slotName: 'abnormal'
    }
]);
const curTab = ref(tabItems.value[0].id);

const showModuleInfo = ref(false);
// const currentSelectObj = ref({});
const showSpaceRequirement = ref(true);

const { loadShellConfig, halfSectionConfig, topologyPassThroughProps, topologyHasEntry, handleSpaceSelect, applyDetailSelection, openTopologyBySpace, closeTopology } =
    useSpaceTopologyHook({
        currentSelectObj,
        showModuleInfo,
        templateData,
        templateLoading
    });
const { iotConditionOptions, getIOTRuleOptions, getEnvironmentSelectedIds } = useTemplateShellConfigConfig();

const getACControlGroupId = id => {
    return idMapACAHGIds.value[id];
};

// 检查补充楼层ID字段
const checkAndSupplyFloorId = obj => {
    // 可能点击自详情里的对象
    if (!obj.floorId && obj.inFloor) {
        obj.floorId = obj.inFloor.id;
        obj.floorLocalName = obj.inFloor.localName;
    }
};
// 统一对象选择入口 —— 所有来源的"点击打开详情"都经过此函数
const transformBySource = (obj, _source) => {
    // 预留：地图来源的 AC 设备 → 转换为控制组
    const fromMap = _source === SELECT_SOURCE.MAP || _source === SELECT_SOURCE.SEARCH;
    if (fromMap && obj.classCode === ACATAH) {
        const controlGroupId = getACControlGroupId(obj.id);
        return allEquipIdMap.value[controlGroupId] || obj;
    }
    return obj;
};

const applyDetailDrawer = (needNextTick, obj) => {
    if (needNextTick) {
        nextTick(() => {
            applyDetailSelection(obj);
        });
    } else {
        applyDetailSelection(obj);
    }
};
// 点击对象，关联楼层变化
const selObjRelChangeFloor = (obj, isChangeFloor, source) => {
    if (currentFloorObj.value?.id && isChangeFloor) {
        if (source === SELECT_SOURCE.RELATION) {
            // $Message.Default({ title: `${i18n.global.t('meos_control_web.device_not_on_current_floor')}` });
            return;
        }
        if (source === SELECT_SOURCE.SEARCH) {
            const floorInfo = getFloorInfoByFloorId(obj.floorId);
            const buildingInfo = getBuildingInfoByFloorId(obj.floorId);
            if (floorInfo) {
                currentFloorObj.value = { ...floorInfo, buildingLocalName: buildingInfo?.localName ?? '--', buildingId: buildingInfo?.id || '' };

                $Message.Default({ title: i18n.global.t('meos_control_web.change_floor_num', { floor: floorInfo.localName ?? '--' }) });
                return;
            }
        }
    }
};
const selectObject = (rawObj, source) => {
    if (!rawObj) {
        currentSelectObj.value = null;
        showModuleInfo.value = false;
        return;
    }

    // 记录来源
    currentSelectSource.value = source;

    // 标准化（用 toRaw 解包 reactive proxy，避免循环引用导致堆栈溢出）
    // console.log('rawObj: ', rawObj);
    const normalized = {
        ...toRaw(rawObj),
        id: rawObj.id,
        localName: rawObj.localName ?? '--',
        objType: rawObj.objType || rawObj.type || OBJ_TYPE.EQUIPMENT,
        spaceId: rawObj.objType === OBJ_TYPE.SPACE || rawObj.type === OBJ_TYPE.SPACE ? rawObj.spaceId || rawObj.id : '',
        classCode: rawObj.classCode || ''
    };
    checkAndSupplyFloorId(normalized);

    const isChangeFloor = currentFloorObj.value?.id !== normalized.floorId;
    selObjRelChangeFloor(normalized, isChangeFloor, source);
    // 来源驱动转换（预留：地图 AC 设备 → 控制组）
    const displayObj = transformBySource(normalized, source);
    // console.log('displayObj: ', displayObj);

    if (normalized.objType === OBJ_TYPE.SPACE) {
        // 空间走拓扑控制器（含壳配置检查）
        const result = handleSpaceSelect(displayObj, source);
        if (result.selectObj) {
            applyDetailDrawer(isChangeFloor, result.selectObj);
        }
        showModuleInfo.value = result.openDrawer;
        if (result.openTopology && result.selectObj) {
            openTopologyBySpace(result.selectObj, source);
        }
    } else {
        // 设备直接应用详情
        applyDetailSelection(displayObj);
        applyDetailDrawer(isChangeFloor, displayObj);
    }

    const controlGroupId = getACControlGroupId(rawObj.id);
    // 是3D视角

    // 需要联动选中地图的来源，拓扑图、关联关系、地图（没有控制组），搜索选中
    const needMapSelectSources = [SELECT_SOURCE.TOPOLOGY, SELECT_SOURCE.RELATION].includes(source) || ((SELECT_SOURCE.SEARCH || source === SELECT_SOURCE.MAP) && !controlGroupId);
    const isAlowedClassCode = !NONE_RENDER_IN_3D.includes(normalized.classCode);
    if (is3DView.value && needMapSelectSources && isAlowedClassCode) {
        if (isChangeFloor) {
            nextTick(() => {
                clickMapObj(normalized, source === SELECT_SOURCE.RELATION);
            });
        } else {
            clickMapObj(normalized, source === SELECT_SOURCE.RELATION);
        }
    }
};

// Provide 给子组件（useMapHook 等）
provide(selectObjectInjectKey, selectObject);

const clickSpaceWithMap = () => {
    selectObject(topologyPassThroughProps?.value?.space, SELECT_SOURCE.TOPOLOGY);
};

const clickEquipWithMap = data => {
    selectObject(data, SELECT_SOURCE.TOPOLOGY);
};

const { topologySpaceWithEnv, clearTopologySpaceEnvironmentCache } = useTopologySpaceEnvironment({
    topologySpace: computed(() => topologyPassThroughProps.value?.space || {}),
    currentSelectObj,
    templateData,
    getIotData,
    envStatusMaps: {
        tdbEnvStatusMap,
        co2EnvStatusMap,
        rhEnvStatusMap,
        pressureDiffEnvStatusMap,
        TOPOLOGY_TEMPERATURE_STATUS_MAP,
        TOPOLOGY_CO2_STATUS_MAP,
        TOPOLOGY_RH_STATUS_MAP,
        TOPOLOGY_PRESSURE_DIFF_STATUS_MAP
    }
});

// 环境参数配置

const envParamShellConfig = computed(() => {
    const shellConfigArr = halfSectionConfig.value?.hsec_env_indicator || [];
    if (iotConditionOptions?.value?.length) {
        return iotConditionOptions.value.map(v => {
            const defaultIds = v.options.map(option => option.id);
            const lastSavedData = shellConfigArr.find(env => env?.code === v.code);
            const validIds = getEnvironmentSelectedIds(lastSavedData, defaultIds);
            return { code: v.code, value: validIds };
        });
    }
    return shellConfigArr;
});

const curEnvShellConfig = computed(() => {
    const currentEnv = dashboardCurrentEnv.value;
    const upperEnvCodeItem = (envParamShellConfig.value || []).find(v => {
        const curArr = v?.value || [];
        const envCode = Object.entries(envToParamsMap).find(([key, valueArr]) => {
            return curArr?.some(val => valueArr.includes(val));
        })?.[0];
        return envCode?.toUpperCase() === currentEnv?.toUpperCase();
    });
    return upperEnvCodeItem?.value || [];
});

const selectedEnvConfigMap = computed(() => {
    const configMap = {};
    (envParamShellConfig.value || []).forEach(item => {
        const curArr = item?.value || [];
        const envCode = Object.entries(envToParamsMap).find(([key, valueArr]) => {
            return curArr?.some(val => valueArr.includes(val));
        })?.[0];
        if (envCode) {
            configMap[envCode] = curArr;
        }
    });
    return configMap;
});

const shouldShowScheduleStatusTag = info => {
    const envCode = info?.infoCode;
    if (!envCode) {
        return true;
    }
    if (!envParamShellConfig?.value?.length) {
        return true;
    }

    const curEnvScheduleStatus = envToScheduleStatusMap[envCode] ?? '';
    return selectedEnvConfigMap.value?.[envCode]?.includes?.(curEnvScheduleStatus) ?? false;
};

const curEnvHasShellConfigScheduleStatus = computed(() => {
    // 目前仅温度、二氧化碳支持在AMC壳配置里，调度状态动态配置，其他默认不展示调度状态筛选组件
    if (['tdb', 'cO2'].includes(dashboardCurrentEnv.value)) {
        // 默认无壳配置的时候，都需要展示
        if (!envParamShellConfig.value?.length) {
            return true;
        }
        return curEnvShellConfig.value.includes(envToScheduleStatusMap[dashboardCurrentEnv.value]);
    }
    return false;
});

const curEnvHasShellConfigControlAim = computed(() => {
    // 目前仅温度、二氧化碳、湿度、压差支持在AMC壳配置里，控制目标动态配置，其他默认不展示控制目标筛选组件
    if ([DASHBOARD_ENV_BELONG_IDS.TDB, DASHBOARD_ENV_BELONG_IDS.CO2, DASHBOARD_ENV_BELONG_IDS.RH, DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF].includes(dashboardCurrentEnv.value)) {
        // 默认无壳配置的时候，都需要展示
        if (!envParamShellConfig.value?.length) {
            return true;
        }
        return curEnvShellConfig.value.includes(envToControlAimMap[dashboardCurrentEnv.value]);
    }
    return false;
});

provide('selectModuleInfo', currentSelectObj);
provide('showModuleInfo', showModuleInfo);
provide(topologyControllerKey, {
    handleSpaceSelect,
    applyDetailSelection,
    openTopologyBySpace,
    closeTopology
});
provide(envParamShellConfigKey, envParamShellConfig);
provide(curEnvHasShellConfigScheduleStatusKey, curEnvHasShellConfigScheduleStatus);
provide(curEnvHasShellConfigControlAimKey, curEnvHasShellConfigControlAim);

const sidebarClose = () => {
    showModuleInfo.value = false;
    currentSelectObj.value = null;
    closeObjectInfoSSEClient();
};

const delaySidebarClose = () => {
    if (spaceIotDataLoading.value) {
        return;
    }
    nextTick(() => {
        sidebarClose();
    });
};

const onGridTabChange = item => {
    // scrollTop.value = 0;
    if (item) sidebarClose();

    if (headerModelView.value === 'list') {
        scrollTop.value = 0;
        dashboardContainerRef?.value?.resetFilter?.();
    }
};

const onGridSubTabChange = item => {
    if (item) sidebarClose();
};

const onSpaceSelect = space => {
    selectObject(space, SELECT_SOURCE.DASHBOARD);
};
const handleDetailSpaceSelect = () => {
    openTopologyBySpace(currentSelectObj.value, 'detail');
};

const onEntryFloor = floorObj => {
    // 关闭弹窗
    sidebarClose();

    currentFloorObj.value = floorObj;

    headerModelView.value = 'model';
    floorFrome.value = 'dashboard';
};

const clickName = item => {
    const enriched = {
        ...item,
        type: item.type || item.objType,
        spaceId: item.type === OBJ_TYPE.SPACE || item.objType === OBJ_TYPE.SPACE ? item.spaceId || item.id : ''
    };
    selectObject(enriched, SELECT_SOURCE.RELATION);
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

const clickEquip = data => {
    selectObject(data, SELECT_SOURCE.EQUIPMENT_LIST);
};
const closeEquipmentInfo = () => {
    currentSelectObj.value = null;
    showModuleInfo.value = false;
};
watch(
    // 解决详情抽屉关闭后，currentSelectObj.value 值未置空
    () => showModuleInfo?.value,
    val => {
        if (!val) {
            currentSelectObj.value = null;
        }
    },
    {
        immediate: true
    }
);
watch(currentSelectObj, async () => {
    if (currentSelectObj.value?.objType === OBJ_TYPE.SPACE && currentSelectObj.value.spaceId) {
        const params = {
            templateType: 'AIRCONDITIONING',
            instanceType: 'SPACE',
            instanceIds: [currentSelectObj.value.spaceId],
            date: getDayjsTz().format('YYYY-MM-DD'),
            queryInstanceTag: true,
            filterShieldedSpaces: false
        };
        try {
            const res = await listConfigResultsByInstances(params);
            const hasData = !!res?.data?.length;
            showSpaceRequirement.value = hasData ? !res?.data?.[0]?.instanceTag?.inBlacklisted : true;
        } catch (error) {
            showSpaceRequirement.value = false;
        }
    }
});
onMounted(() => {
    getNotifyList();
    setMenuConfig(() => import('@/views/ACOperationControl/variables'));
    loadShellConfig();
    getIOTRuleOptions();
});
onBeforeUnmount(() => {
    clearAllObjectInfo();
});
onUnmounted(() => {
    resetHalfSectionConfig();
    currentSelectObj.value = null;
    showModuleInfo.value = false;
    clearTopologySpaceEnvironmentCache();

    throttleRefreshCallback.cancel();
    refreshIds.clear();
    refreshIds = null;
});
</script>
<style lang="less" scoped>
.air-container {
    display: flex;
    height: 100%;
    min-width: 1280px;
    overflow: hidden;
    background-color: #d6dde5;
    position: relative;
    &-left {
        height: 100%;
        // min-width: 1000px;
        width: calc(100% - var(--broken-width));
        position: relative;
        display: flex;
        flex-direction: column;
        .half-view-wrapper {
            position: absolute;
            z-index: var(--z-index-half-view-wrapper);
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            padding: 16px;
        }
        .topology-view-wrapper {
            position: absolute;
            z-index: var(--z-index-topology-view-wrapper);
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            padding: 16px;
        }
    }
    &-right {
        width: var(--broken-width);
        padding: 16px 16px 16px 0;
        height: 100%;
        &-content {
            height: calc(100% - 100px);
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 8px 10px 0 rgba(27, 33, 41, 0.03);
            .tab {
                padding: 12px 16px 8px 16px;
            }
        }
        &-broadcast {
            margin-top: 12px;
            height: 54px;
            border-radius: 8px;
            background: linear-gradient(0deg, rgba(241, 248, 255, 0.8) 0%, rgba(241, 248, 255, 0.8) 100%), rgba(225, 239, 255, 0.8);
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        }
    }
    .abnormal-list-warp {
        margin-top: 8px;
        padding: 0 0 0 16px;
        height: calc(100% - 84px);
    }
}

.air-bgc {
    background-color: var(--blue-50);
    background-image: url('@/assets/imgs/page_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
}

.air-floor-bgc {
    background: #d6dde5;
}

:deep(.m-tabs.m-tabs-segment) {
    width: 100%;
    .m-tabs-item {
        flex: 1;
    }
    .m-tabs-body {
        padding-right: 0 !important;

        .m-tabs-trigger {
            display: none !important;
        }
    }
}
.config-data {
    background-color: var(--alpha-30);
    border-radius: 4px;
    padding: 12px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
.abnormal-total {
    border-radius: 9px;
    height: 18px;
    padding: 0 6px;
    width: fit-content;
    background-color: var(--red-500);
    color: var(--gray-0);
    font-family: Arial;
}
.temporary-requirement-warp {
    height: 100%;
    padding-left: 20px;
}
:deep(.operation-monitoring-container-item.ACAHGinfoofACATAH) {
    &:not(:has(.template-five-container)) {
        margin-top: -16px;
        .group-name-detail-configuration {
            display: none;
        }
    }
}
</style>
<style lang="less">
.ac-ACAHG.associated-devices-new {
    padding: 0;
}
.acOperatingMonitoring .template-two-container .control-set {
    .control-set-item[type='is-manual-auto-set'] {
        margin-bottom: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        position: relative;
        &::before {
            content: '';
            position: absolute;
            bottom: 0;
            width: calc(100% - 24px);
            left: 12px;
            border-bottom: 1px solid var(--gray-200);
        }
    }
    .control-set-item.not-first-manual-auto-set {
        border-radius: 0;
    }
}
</style>
