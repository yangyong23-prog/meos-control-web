<template>
    <div class="system-and-control wh100" :class="curContainerClass">
        <ExpansionCollapseNew v-if="currentSystem && !loading" v-model="isExpanded" :hide-icon="hideIcon">
            <template #left>
                <div class="chart-or-map wh100">
                    <slot name="header">
                        <LeftHeader v-bind="headerProps" v-model:system-id="systemId" v-model:current-system="currentSystem" v-model:view-mode="viewMode" :system-list="systemList">
                            <template #left-content="data">
                                <slot name="left-content" v-bind="data" :view-mode="viewMode"></slot>
                            </template>
                            <template #subHeader="data">
                                <slot name="subHeader" v-bind="data" :view-mode="viewMode"></slot>
                            </template>
                            <template #right-content>
                                <slot
                                    name="right-content"
                                    :view-mode="viewMode"
                                    :map-space-list="mapSpaceList"
                                    :current-map-space-id="currentMapSpaceId"
                                    :is-chart-base-system="isRelationChartBaseSystem"
                                    :external-data-loading="externalDataLoading"
                                    :handle-equip-init="handleEquipInit"
                                    :handle-equip-all-change="handleEquipAllChange"
                                    :handle-equip-select-change="handleEquipSelectChange"
                                    :handle-space-select-change="handleSpaceSelectChange"
                                ></slot>
                            </template>
                            <template #right-tabs="data">
                                <slot name="right-tabs" v-bind="data" :view-mode="viewMode"></slot>
                            </template>
                        </LeftHeader>
                    </slot>
                    <slot name="relation-chart" :system-loading="loading" v-bind="bindObj">
                        <template v-if="useDefaultChart">
                            <Chart
                                v-show="viewMode === ViewModeEnum.GRAPH_CODE"
                                :ref="e => (chart = e)"
                                v-bind="{ ...bindObj, ...props.chartProps }"
                                @class-code-equip-ids-map="getClassCodeEquipIdsMap"
                                @object-id-and-info-codes="getObjectIdAndInfoCodes"
                                @open-equipment="openEquipmentFn"
                                @close-equipment="closeEquipmentFn"
                            >
                                <template #legend="{ defaultLegends, switchLegendData, pipelineLegendData }">
                                    <slot name="legend" :default-legends="defaultLegends" :switch-legend-data="switchLegendData" :pipeline-legend-data="pipelineLegendData">
                                        <Legend :equipment-data="defaultLegends" :switch-data="switchLegendData" :pipeline-data="pipelineLegendData" />
                                    </slot>
                                </template>
                            </Chart>
                        </template>
                    </slot>
                    <slot name="model-view-map" :system-loading="loading" v-bind="bindObj">
                        <template v-if="useDefaultSpaceMap">
                            <SpaceMapView
                                v-show="viewMode === ViewModeEnum.MAP_VIEW"
                                :show="viewMode === ViewModeEnum.MAP_VIEW"
                                :show-detail="showEquipmentInfo"
                                :has-space="!!mapSpaceList?.length"
                                :external-data-loading="externalDataLoading"
                                :current-space="currentMapSpaceObj"
                                :current-equips="space3dSelectData"
                                :all-equips="space3dAllData"
                                :running-monitor-type="props.runningMonitorType"
                                @open-equipment-info="openEquipmentFn"
                                @close-equipment-info="closeEquipmentFn"
                            >
                                <template v-if="$slots['map-legend']" #legend="{ pipelineData }">
                                    <slot name="map-legend" :pipeline-data="pipelineData"></slot>
                                </template>
                            </SpaceMapView>
                        </template>
                    </slot>
                </div>
            </template>
            <template #right>
                <div class="control-module wh100">
                    <div class="control-module-main" :class="{ 'has-notify': notifyList.length }">
                        <div v-if="controlTabs?.length > 1" class="control-tabs">
                            <m-tabs v-model="controlData" :data="controlTabs" type="segment" size="large">
                                <template #abnormal>
                                    <div class="fcc" style="display: flex; gap: 2px">
                                        <span class="m-tabs-name">{{ i18n.global.t('meos_control_web.abnormal_event') }}</span>
                                        <div v-if="abnormalEventList?.length" class="abnormal-total fcc fs12">
                                            {{ abnormalEventList.length > 99 ? '99+' : abnormalEventList.length }}
                                        </div>
                                    </div>
                                </template>
                            </m-tabs>
                        </div>
                        <div class="control-main" :class="{ 'one-tab': controlData.length === 1 }">
                            <div class="control-module-tabs wh100">
                                <m-scrollbar v-if="controlData === ControlTabsEnum.OPERATING_CONTROL">
                                    <template v-if="controlLoading">
                                        <m-list-skeleton style="margin-top: 14px" />
                                    </template>
                                    <template v-else>
                                        <!-- 系统的"监测监控状态(monitoringSurveillanceStatus)"=3  可监可控，右侧面板 “运行控制” tab下的内容完整显示（包括控制台、系统实时参数、室外天气、运行播报）。“异常事件”正常显示。 -->
                                        <slot
                                            v-if="monitoringSurveillanceStatus === MonitoringSurveillanceStatus.SUPERVISABLE_AND_CONTROLLABLE && !noSystemCotrolPanel"
                                            name="operating-control"
                                            v-bind="bindObj"
                                        >
                                            <Control
                                                :ref="e => (ControlRef = e)"
                                                v-model="currentConsoleTypeId"
                                                :console-types-data="consoleTypesData"
                                                :system-id="systemId"
                                                :running-monitor-type="runningMonitorType"
                                                :current-system="currentSystem"
                                                :current-console-type="currentConsoleType"
                                                :system-class-code="systemClassCode"
                                                :console-is-close="consoleIsClose"
                                                :show-plan-list="showPlanList"
                                                :open-system-set="openSystemSet"
                                                :open-space-list="openSpaceList"
                                                :open-time-table="() => emits(IndexEvent.OpenTimeTable, currentConsoleType)"
                                                :relation-chart-component="chart?.relationChartComponent"
                                                :show-system-set="showSystemSet"
                                                :show-control-intervention-time="showControlInterventionTime"
                                                v-bind="controlPanelProps"
                                            >
                                                <template v-for="slotName in controlComponentSlotNames" #[slotName]="slotProps">
                                                    <slot :name="`control-component-${slotName}`" v-bind="slotProps" />
                                                </template>
                                            </Control>
                                        </slot>
                                        <slot name="system-data" :data="runParams" :system-id="systemId" :charts-data="chartsData">
                                            <SystemData
                                                :key="systemId"
                                                v-model:show-space-list-drawer="showSpaceListDrawer"
                                                :data="runParams"
                                                :system-id="systemId"
                                                :charts-data="chartsData"
                                                :charts-data-by-space-scope="chartsDataBySpaceScope"
                                                :all-chart-spaces-count="allChartSpacesCount"
                                                :has-indoor-temperature="hasIndoorTemperature"
                                                v-bind="systemDataProps"
                                                @click="() => emits(IndexEvent.OpenBoard)"
                                            />
                                        </slot>
                                        <slot name="weather" :weather-list="weatherList">
                                            <Weather v-if="hasOutdoorTemperature" :key="systemId" :weather-list="weatherList" />
                                        </slot>
                                        <div v-if="controlIsEmpty" class="w100 h100 fcc" :style="{ position: 'absolute', top: '0', left: '0' }">
                                            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
                                        </div>
                                    </template>
                                </m-scrollbar>
                                <slot v-else-if="controlData === ControlTabsEnum.ABNORMAL_EVENTS" name="abnormal" v-bind="bindObj" :control-tabs="controlTabs"> </slot>
                            </div>
                        </div>
                    </div>
                    <div v-if="notifyList.length && hasNotify" class="control-module-notify">
                        <CommonNotify :notify-list="notifyList" />
                    </div>
                </div>
            </template>
        </ExpansionCollapseNew>
        <div v-else-if="!loading" class="wh100 fcc">
            <slot name="no-data">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"> </m-illustration>
            </slot>
        </div>
        <slot name="equipment-info" :show-equipment-info="showEquipmentInfo" :select-obj="equipmentNodeActiveData" :on-detail-drawer-close="onDetailDrawerClose">
            <CommonDrawer
                v-model="showEquipmentInfo"
                :select-obj="equipmentNodeActiveData"
                is-subscript-on-demand
                :running-monitor-type="runningMonitorType"
                :cancel-last-request="true"
                :use-new-api="true"
                :subscribe-type="subscribeType"
                v-bind="commonDrawerProps"
                @status-loaded="drawerObjectStatusLoaded"
                @close="onDetailDrawerClose"
            >
                <template #default="{ selectObj, curTab }">
                    <slot name="operatingControl" :select-obj="selectObj" :cur-tab="curTab" :res="templateData" :show-equipment-info="showEquipmentInfo">
                        <DrawerPane v-if="showOperatingMonitoringFn()" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="operatingControl">
                            <OperatingMonitoring
                                :id="selectObj.id"
                                :select-obj="selectObj"
                                :running-monitor-type="runningMonitorType"
                                :res="templateData"
                                :group-codes="[
                                    GROUP_CODE_KEY_MAP.controlGroupOfTheSeriesConnectedChiller,
                                    GROUP_CODE_KEY_MAP.controlledParameterSet,
                                    GROUP_CODE_KEY_MAP.coolingTowerFanInfo,
                                    GROUP_CODE_KEY_MAP.electricallyOperatedOnOffWaterValveInfo,
                                    GROUP_CODE_KEY_MAP.runningParameter,
                                    GROUP_CODE_KEY_MAP.techniqueParameter,
                                    GROUP_CODE_KEY_MAP.x1stTag3,
                                    GROUP_CODE_KEY_MAP.x1stTag5
                                ]"
                                use-component-type="new"
                                :data-value-filter="[GROUP_CODE_KEY_MAP.coolingTowerFanInfo, GROUP_CODE_KEY_MAP.electricallyOperatedOnOffWaterValveInfo]"
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
                                    ],
                                    ...peratingMonitoringComponentAttrs
                                }"
                                v-bind="operatingMonitoringProps"
                            >
                                <template #[GROUP_CODE_KEY_MAP.coolingTowerFanInfo]>
                                    <AssociatedDevicesNew
                                        v-if="(templateData as any).coolingTowerFanInfo"
                                        :select-obj="selectObj"
                                        :basic-data="[(templateData as any).coolingTowerFanInfo]"
                                        :running-monitor-type="runningMonitorType"
                                        collapse
                                        :res="templateData"
                                        can-jump
                                        :title-ellipsis="false"
                                        :need-tip="false"
                                        :can-click="false"
                                        :control-group-code="GROUP_CODE_KEY_MAP.controlledParameterSet"
                                        show-data-source
                                        :control-set-props="{ showControlBtnFn, hideIntervention: true, showDataSource: true }"
                                        class="fan-water"
                                    ></AssociatedDevicesNew>
                                </template>
                                <template #[GROUP_CODE_KEY_MAP.electricallyOperatedOnOffWaterValveInfo]>
                                    <AssociatedDevicesNew
                                        v-if="(templateData as any).electricallyOperatedOnOffWaterValveInfo"
                                        :select-obj="selectObj"
                                        :basic-data="[(templateData as any).electricallyOperatedOnOffWaterValveInfo]"
                                        :running-monitor-type="runningMonitorType"
                                        collapse
                                        :res="templateData"
                                        can-jump
                                        :title-ellipsis="false"
                                        :need-tip="false"
                                        :can-click="false"
                                        :control-group-code="GROUP_CODE_KEY_MAP.controlledParameterSet"
                                        show-data-source
                                        :control-set-props="{ showControlBtnFn, hideIntervention: true, showDataSource: true }"
                                        class="fan-water"
                                    ></AssociatedDevicesNew>
                                </template>
                            </OperatingMonitoring>
                        </DrawerPane>
                    </slot>
                    <slot name="extra-panes" :select-obj="selectObj" :cur-tab="curTab" :res="templateData" :show-equipment-info="showEquipmentInfo"> </slot>
                    <slot name="equipAbnormalList" :select-obj="selectObj" :cur-tab="curTab" :res="templateData" :show-equipment-info="showEquipmentInfo">
                        <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="equipAbnormalList">
                            <AbnormalTabBox :select-obj="selectObj" v-bind="abnormalTabBoxProps"></AbnormalTabBox>
                        </DrawerPane>
                    </slot>
                </template>
                <template #extra-icon="{ selectObj }">
                    <slot name="extra-icon" :select-obj="selectObj" :open-monitor-player="openMonitorPlayer" :CAMERA_CLASS_CODES="CAMERA_CLASS_CODES">
                        <m-tips
                            v-if="CAMERA_CLASS_CODES.includes(selectObj?.classCode)"
                            :content="i18n.global.t('meos_control_web.view_surveillance_video')"
                            theme="darkTransparent"
                            placement="left"
                        >
                            <div class="monitor" @click="openMonitorPlayer({ id: selectObj.id })">
                                <MonitorPlainIcon />
                            </div>
                        </m-tips>
                    </slot>
                </template>
            </CommonDrawer>
            <MonitorPlayer v-if="showPlayer && currentPlayingObj" :select-obj="currentPlayingObj" @close="closeMonitorPlayer"></MonitorPlayer>
        </slot>
        <SystemSet
            v-if="showSystemSet"
            :system-id="systemId"
            :current-system="currentSystem"
            :disability-alarm-reset="disabilityAlarmReset"
            :running-monitor-type="runningMonitorType"
            :system-class-code="systemClassCode"
            :is-station="isStation"
            :system-params-set-props="systemParamsSetProps"
            :system-auto-set-props="systemAutoSetProps"
            :handle-special-info-codes-data-sources-fn="handleSpecialInfoCodesDataSourcesFn"
            @close="closeSystemSet"
        >
            <template v-for="slotName in systemSetSlotNames" #[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps" />
            </template>
            <template v-for="slotName in systemSetSlotNames" #[`${slotName}Tag`]="slotProps">
                <slot :name="`${slotName}Tag`" v-bind="slotProps" />
            </template>
        </SystemSet>
        <m-drawer
            :append-to="$drawerAppendTo"
            :show="showSpaceList"
            :shadow-click="true"
            width="480px"
            drawer-class="control-space-drawer"
            :z-index="Z_INDEX.equipmentList"
            :title="i18n.global.t('meos_control_web.guan_lian_space')"
            @close="showSpaceList = false"
        >
            <template #content>
                <SpaceList v-if="showSpaceList" :data="spaceListData" style="padding: 8px 24px" />
            </template>
        </m-drawer>
    </div>
</template>

<script setup lang="ts">
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import { Z_INDEX } from '@/constants/zIndex';
import OperatingMonitoring from '@/components/ObjectInfoComponents/OperationMonitoring/index.vue'; // 运行监控
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import MonitorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import CommonNotify from '@/components/commonNotify/index.vue';
import useNotify from '@/components/commonNotify/hooks/useNotify';
import { getComponent } from '@/components/ObjectInfoComponents/OperationMonitoring/config';
import AssociatedDevicesNew from '@/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue'; // 关联设备
import { isUnrelatedToManualAutoSet } from '@/components/ObjectInfoComponents/utils';

import ExpansionCollapseNew from '@/components/expansionCollapseAssemblyNew/index.vue';
import LeftHeader from './LeftHeader.vue';
import Chart from './Chart.vue';
import SpaceMapView from '@/components/SpaceMapView/index.vue';
import { useBaseDataHook } from './hooks/useBaseDataHook';
import { ControlTabsEnum, DataTypeEnum, SystemControlNode, ViewModeEnum } from './types';
import { PropType, useSlots } from 'vue';
import { IndexProps } from './types/props';
import { ChartEvent, IndexEmits, IndexEvent } from './types/emits';
import i18n from '@/localization';
import Control from './Control.vue';
import SystemData from './SystemData.vue';
import { useSpaceMapHook } from './hooks/useSpaceMapHook';
import { useControlBoardHook } from './hooks/useControlBoardHook';
import Legend from './Legend.vue';
import Weather from './components/Weather.vue';
import useEchartsPie from './hooks/useEchartsPie';
import { MonitoringSurveillanceStatus } from './constant';
import { useEquipmentInfoHook } from './hooks/useEquipmentInfoHook';
import { CAMERA_CLASS_CODES } from '@/constants/camera';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import { GROUP_CODE_KEY_MAP, OTHER_REASON, INFO_CODE, IS_MANUAL } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import SystemSet from './components/SystemSet.vue';
import SpaceList from './components/control/SpaceList.vue';

import { useSystemSetHook } from './hooks/useSystemSetHook';
import { useSpaceListHook } from './hooks/useSpaceListHook';
import { clearModelType, setModelType } from '@/utils/tools';
const ControlRef = ref();
const props = withDefaults(defineProps<IndexProps>(), {
    headerProps: () => ({}),
    chartProps: () => ({}),
    objectIds: () => [],
    tabs: () => [
        { id: ControlTabsEnum.OPERATING_CONTROL, name: i18n.global.t('meos_control_web.operation_control') },
        { id: ControlTabsEnum.ABNORMAL_EVENTS, name: i18n.global.t('meos_control_web.abnormal_event'), slotName: 'abnormal' }
    ],
    useDefaultChart: true,
    useDefaultSpaceMap: true,
    runParamKey: () => GROUP_CODE_KEY_MAP.x1stTag3,
    showControlInterventionTime: true
});
const slots = useSlots();
const controlComponentSlotNames = Object.keys(slots)
    .filter(slotName => slotName.startsWith('control-component-'))
    .map(slotName => slotName.replace('control-component-', ''));
const systemSetSlotNames = computed(() => {
    const specialInfoCodes = props.systemParamsSetProps?.specialInfoCodes;
    if (!Array.isArray(specialInfoCodes)) {
        return [];
    }
    return specialInfoCodes
        .map(item => (typeof item === 'string' ? item : item?.infoCode))
        .filter((item): item is string => typeof item === 'string' && item.length > 0 && !!slots[item]);
});
const emits = defineEmits<IndexEmits>();
const {
    loading,
    systemList,
    currentSystem,
    monitoringSurveillanceStatus,
    controlData,
    controlTabs,
    classCodeEquipIdsMap,
    objectIdAndInfoCodes,
    getChiller,
    getCodeDefineConfig,
    chillerData,
    codeDefine
} = useBaseDataHook(props, emits);
const { showEquipmentInfo, equipmentNodeActiveData, templateData, openEquipmentFn, closeEquipmentFn, onDetailDrawerClose } = useEquipmentInfoHook(props, emits);
const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(equipmentNodeActiveData, showEquipmentInfo);

const systemId = defineModel({
    type: String as PropType<string>,
    default: '',
    required: true
});
const systemClassCode = defineModel('systemClassCode', {
    type: String as PropType<string>,
    default: ''
});

const controlLoading = defineModel('controlLoading', {
    type: Boolean,
    default: false
});
const showSpaceListDrawer = defineModel('showSpaceListDrawer', {
    type: Boolean,
    default: false
});
const { notifyList, getNotifyList } = useNotify(systemId, props.subscribeType, props.productCode);
const { getIotData } = DockSingleton.getInstance();

const showControlBtnFn = (data: any, id: string) => {
    // 根据配置文件决定设备的控制是否受"手自动状态设定"限制
    if (isUnrelatedToManualAutoSet(data)) {
        return true;
    }
    return getIotData(id, INFO_CODE.manualAutoStatus.infoCode)?.dataValue === IS_MANUAL;
};
const {
    runParams,
    systemDataLoading,
    weatherList,
    init: getSystemDataAndWeather,
    consoleTypesData,
    currentConsoleTypeId,
    currentConsoleType,
    consoleIsClose,
    disabilityAlarmReset,
    isStation,
    showPlanList
} = useControlBoardHook(props, systemId, emits, getCodeDefineConfig, getChiller, monitoringSurveillanceStatus);
const { showSystemSet, openSystemSet, closeSystemSet } = useSystemSetHook();
const { showSpaceList, openSpaceList, closeSpaceList, spaceListData } = useSpaceListHook();
const { chartsData, chartsDataBySpaceScope, allChartSpacesCount, queryListSpacesByRunningMonitor } = useEchartsPie(props);
const chart = ref();

const drawerObjectStatusLoaded = () => {
    if (equipmentNodeActiveData.value?.classCode && CAMERA_CLASS_CODES.includes(equipmentNodeActiveData.value?.classCode)) {
        openMonitorPlayer(equipmentNodeActiveData.value);
    }
};

const getObjectIdAndInfoCodes = (data: Record<string, string[]>) => {
    objectIdAndInfoCodes.value = data;
    emits(ChartEvent.ObjectIdAndInfoCodes, data);
};

const isExpanded = defineModel('isExpanded', {
    type: Boolean,
    default: true
});
const hideIcon = defineModel('hideIcon', {
    type: Boolean,
    default: false
});
const viewMode = defineModel('viewMode', {
    type: String as PropType<ViewModeEnum>,
    default: ViewModeEnum.GRAPH_CODE
});
const controlIsEmpty = computed(() => {
    if (props.customControlIsEmptyFn) {
        return props.customControlIsEmptyFn();
    } else {
        const obj = consoleTypesData.value?.find(item => item.controlList?.length);
        if (runParams.value.length === 0 && weatherList.value.length === 0 && (obj === undefined || props.noSystemCotrolPanel)) {
            return true;
        } else {
            return false;
        }
    }
});
// 关系图及其设备ids是否还在请求
const isChartAndEquipsLoading = ref(false);
const showOperatingMonitoringFn = () => {
    if (props.customOperatingControlShowRulesFn) {
        return props.customOperatingControlShowRulesFn(showEquipmentInfo, templateData.value);
    }
    return showEquipmentInfo.value;
};
const curContainerClass = computed(() => {
    const res = viewMode.value === ViewModeEnum.GRAPH_CODE ? 'SYSTEM_GRAPH' : 'SPACE_3D_GRAPH';
    return res;
});

// 关系图基准对象-是否是系统
const isRelationChartBaseSystem = computed(() => {
    const hasType = !!currentSystem?.value?.objType;
    const isSystem = hasType ? currentSystem?.value?.objType?.toUpperCase() === 'SYSTEM' : undefined;
    const isStartsWithSY = systemId?.value?.toUpperCase()?.startsWith('SY');
    return isSystem ?? isStartsWithSY;
});

// 关系图视角-收集关系图下所有设备ids
const getClassCodeEquipIdsMap = (data: Record<string, string[]>) => {
    if (Object.keys(data).length === 0) {
        return;
    }

    const cloneData = structuredClone(data);
    const cloneCurSystem = structuredClone(currentSystem.value || {});
    classCodeEquipIdsMap.value = cloneData;
    isChartAndEquipsLoading.value = false;
    emits(ChartEvent.ClassCodeEquipIdsMap, cloneData);
    emits(ChartEvent.AfterChartEquipsLoaded, {
        systemInfo: cloneCurSystem,
        equipsClassCodes: cloneData
    });
};

// 模型图视角-收集选中空间下的设备ids
const getClassCodeEquipIdsMapForSpace = (data: Record<string, string[]>, type?: string) => {
    if (Object.keys(data).length === 0) {
        return;
    }
    classCodeEquipIdsMap.value = data;
    emits(ChartEvent.ClassCodeEquipIdsMap, data, type);
};

const { querySpaceList, querySpaceLoading, mapSpaceList, currentMapSpaceObj, currentMapSpaceId, space3dSelectData, space3dAllData } = useSpaceMapHook({
    runningMonitorType: props.runningMonitorType,
    getClassCodeEquipIdsMap: getClassCodeEquipIdsMapForSpace,
    sortSpacesByClassCodes: props.spaceMapProps?.sortSpacesByClassCodes,
    queryEquipsParams: props.spaceMapProps?.queryEquipsParams,
    queryEquipsApi: props.spaceMapProps?.queryEquipsApi,
    findDefaultSpace: props.spaceMapProps?.findDefaultSpace
});

const externalDataLoading = computed(() => {
    // 关系图基准对象为系统时，则返回请求模型图空间的loading
    if (isRelationChartBaseSystem.value) {
        return querySpaceLoading.value;
    } else {
        // 关系图基准对象为设备时
        // 如果模型图依赖关系图及其设备ids，则返回请求关系图及其设备loading、请求模型图空间loading
        if (props?.spaceMapProps?.querySpacesByChartObjType) {
            return isChartAndEquipsLoading.value || querySpaceLoading.value;
        } else {
            return querySpaceLoading.value;
        }
    }
});

const handleEquipInit = () => {};
const handleEquipAllChange = (data: any) => {
    space3dAllData.value = data;
};
const handleEquipSelectChange = (data: any) => {
    space3dSelectData.value = data;
};
const handleSpaceSelectChange = (data: string) => {
    currentMapSpaceId.value = data;
};

const bindObj = computed(() => {
    return {
        systemList: systemList.value,
        currentSystem: currentSystem.value,
        systemId: systemId.value,
        viewMode: viewMode.value,
        runningMonitorType: props.runningMonitorType,
        menuCode: props.menuCode,
        subscribeType: props.subscribeType,
        productCode: props.productCode,
        useDefaultChart: props.useDefaultChart,
        useDefaultSpaceMap: props.useDefaultSpaceMap,
        mainGrapTypeCode: props.mainGrapTypeCode,
        abnormalEventList: props.abnormalEventList,
        tabs: props.tabs,
        classCodeEquipIdsMap: props.classCodeEquipIdsMap
    };
});

const changeData = (type: DataTypeEnum, data: SystemControlNode[] | SystemControlNode | ViewModeEnum) => {
    if (type === DataTypeEnum.SYSTEM_LIST) {
        systemList.value = data as SystemControlNode[];
    } else if (type === DataTypeEnum.CURRENT_SYSTEM) {
        currentSystem.value = data as SystemControlNode;
    } else if (type === DataTypeEnum.VIEW_MODE) {
        viewMode.value = data as ViewModeEnum;
    }
};
useWatchWithCleanup(
    () => currentSystem.value,
    () => {
        systemId.value = currentSystem.value?.systemId || currentSystem.value?.id || '';
        systemClassCode.value = currentSystem.value?.classCode || '';
    }
);
useWatchWithCleanup(
    () => [systemDataLoading.value],
    () => {
        controlLoading.value = systemDataLoading.value;
    }
);

useWatchWithCleanup(
    () => systemId.value,
    () => {
        // 切换系统时关闭上一系统的室内温度空间列表，避免新组件携带旧的打开状态重新挂载
        showSpaceListDrawer.value = false;
        if (systemId.value) {
            closeSystemSet();
            setModelType(systemId.value);
            getChiller(systemId.value);
            isChartAndEquipsLoading.value = true;
            const curSystem = currentSystem.value || {};
            const cloneCurSystem = structuredClone(curSystem);
            // 若查询空间依赖关系图类型，则当关系图基准对象是系统时，根据系统实例查询系统下的设备
            if (props?.spaceMapProps?.querySpacesByChartObjType) {
                if (isRelationChartBaseSystem.value) {
                    querySpaceList?.(systemId.value, cloneCurSystem);
                }
            } else {
                querySpaceList?.(systemId.value, cloneCurSystem);
            }

            getSystemDataAndWeather(monitoringSurveillanceStatus.value === MonitoringSurveillanceStatus.SUPERVISABLE_AND_CONTROLLABLE);
            props.hasIndoorTemperature && queryListSpacesByRunningMonitor(systemId.value);
            props.hasNotify && getNotifyList();
        }
    },
    {
        immediate: true
    }
);
useWatchWithCleanup(
    () => equipmentNodeActiveData.value?.id,
    () => {
        showSpaceListDrawer.value = false;
    }
);

useWatchWithCleanup(
    () => viewMode.value,
    () => {
        onDetailDrawerClose();
    }
);
useWatchWithCleanup(
    () => showEquipmentInfo.value,
    () => {
        closeSystemSet();
        closeSpaceList();
    }
);
defineExpose({
    systemList,
    currentSystem,
    systemId,
    viewMode,
    consoleTypesData,
    currentConsoleTypeId,
    chillerData,
    codeDefine,
    chart,
    ControlRef,
    isStation,
    changeData,
    getSystemDataAndWeather,
    queryListSpacesByRunningMonitor,
    querySpaceList,
    getCodeDefineConfig,
    openSpaceList,
    closeSpaceList
});
onMounted(() => {
    clearModelType();
});
onUnmounted(() => {
    clearModelType();
});
</script>
<style lang="less" scoped>
.system-and-control {
    .chart-or-map {
        position: relative;
    }
    .control-module {
        &-main {
            height: 100%;
            border-radius: 8px;
            background-color: var(--gray-0);
            &.has-notify {
                height: calc(100% - 70px);
            }
        }
        .control-tabs {
            padding: 16px 16px 0;
            :deep(.m-tabs.m-tabs-segment) {
                width: 100%;
                .m-tabs-item {
                    flex: 1;
                }
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
        }
        .control-main {
            height: calc(100% - 58px);
            &.one-tab {
                height: 100%;
            }
            .control-module-tabs {
                :deep(.m-scrollbar__content) {
                    padding: 0 16px 16px;
                }
            }
        }
        .control-module-notify {
            border-radius: 8px;
            margin-top: 16px;
            background: #dfeeffcc;
            height: 54px;
        }
    }
}

.system-and-control {
    &.SYSTEM_GRAPH {
        background: @system_graph_bg;
    }

    &.SPACE_3D_GRAPH {
        background: @space_3d_bg;
    }
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
.fan-water.associated-devices-new {
    padding: 0;
}
</style>
<style lang="less">
.control-space-drawer {
    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
    }
}
.control-space-drawer {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
}
// 断点适配
@media screen and (max-width: 1600px) {
    .control-space-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
}
</style>
