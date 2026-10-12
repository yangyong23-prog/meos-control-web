<template>
    <div class="controls-box card-box">
        <template v-if="loading">
            <br />
            <m-list-skeleton />
        </template>
        <template v-else>
            <div
                v-if="selectedSystemObj?.imageOrProductName !== i18n.global.t('meos_control_web.vacant_hot_pot_system_graph') && isColdHotControl !== 'HeatSource'"
                class="run-set-top fcb"
            >
                <!-- 冷热源title -->
                <div class="left-content">
                    <div v-if="isColdHotControl === 'ColdHotControl'" class="fcc" style="height: 42px">
                        <span style="font-weight: 600">{{ i18n.global.t('meos_control_web.heating_cooling_station_control') }} &nbsp;&nbsp;</span>
                        <m-tag v-if="runModel[coldHotModel]" color="#626C78" bg-color="#D9EBFF" size="small">
                            {{ runModel[coldHotModel] }}{{ i18n.global.t('meos_control_web.mode') }}
                        </m-tag>
                    </div>

                    <!-- 冷站title -->
                    <m-tabs v-else-if="isColdHotControl === 'ColdSource'" v-model="runSetTab" size="large" :data="runSetTabs" />
                </div>
                <!-- 冷热源title -->
                <div v-if="isColdHotControl === 'ColdHotControl'" class="right fc">
                    <m-tips :disabled="hasControls" :content="enableCtrlContent()" theme="darkTransparent">
                        <m-button type="link" size="small" :disabled="!hasControls" @click="toStrategicInterventions">{{
                            i18n.global.t('meos_control_web.heating_cooling_station_schedule')
                        }}</m-button>
                    </m-tips>
                    <m-tips :disabled="hasControls" :content="enableCtrlContent()" theme="darkTransparent">
                        <div :class="[hasControls ? 'xpruncsmanualAutoSet' : 'wd', 'fcc']" @click="settingsBtn()">
                            <SettingSvg v-if="hasControls" />
                            <settingGreyOutSvg v-else />
                        </div>
                    </m-tips>
                </div>

                <!-- 冷源 -->
                <div v-else-if="isColdHotControl === 'ColdSource'" class="right fc">
                    <m-tips :disabled="hasControls" :content="enableCtrlContent()" theme="darkTransparent">
                        <m-button type="link" size="small" :disabled="!hasControls" @click="toStrategicInterventions">{{
                            runSetTab === '0' ? i18n.global.t('meos_control_web.cooling_station_schedule') : i18n.global.t('meos_control_web.pump_group_schedule')
                        }}</m-button>
                    </m-tips>
                    <m-tips :disabled="hasControls" :content="enableCtrlContent()" theme="darkTransparent">
                        <div :class="[hasControls ? 'xpruncsmanualAutoSet' : 'wd', 'fcc']" @click="settingsBtn()">
                            <SettingSvg v-if="hasControls" />
                            <settingGreyOutSvg v-else />
                        </div>
                    </m-tips>
                </div>
            </div>

            <div
                v-if="selectedSystemObj?.imageOrProductName !== i18n.global.t('meos_control_web.vacant_hot_pot_system_graph') && isColdHotControl === 'HeatSource' && hasControls"
                class="run-set-top fcb"
            >
                <div class="left-content">
                    <!-- 热源title -->
                    <div v-if="isColdHotControl === 'HeatSource'" class="fcc" style="height: 42px">
                        <span class="heat-title">{{ i18n.global.t('meos_control_web.heat_station_control') }} &nbsp;&nbsp;</span>
                        <!-- <m-tag v-if="runModel[coldHotModel]" color="#626C78" bg-color="#D9EBFF" size="small"> {{ runModel[coldHotModel] }}模式 </m-tag> -->
                    </div>
                </div>
                <!-- 热源 -->
                <div v-if="isColdHotControl === 'HeatSource'" class="right fc">
                    <m-tips :disabled="hasControls" :content="enableCtrlContent()" theme="darkTransparent">
                        <m-button type="link" size="small" :disabled="!hasControls" @click="toStrategicInterventions">{{
                            i18n.global.t('meos_control_web.heat_station_schedule')
                        }}</m-button>
                    </m-tips>
                    <m-tips :disabled="hasControls" :content="enableCtrlContent()" theme="darkTransparent">
                        <div :class="[hasControls ? 'xpruncsmanualAutoSet' : 'wd', 'fcc']" @click="settingsBtn()">
                            <SettingSvg v-if="hasControls" />
                            <settingGreyOutSvg v-else />
                        </div>
                    </m-tips>
                </div>
            </div>
            <div
                class="run-set-bottom-container"
                :style="{ height: selectedSystemObj?.imageOrProductName !== i18n.global.t('meos_control_web.vacant_hot_pot_system_graph') ? 'calc(100% - 55px)' : '100%' }"
            >
                <m-scrollbar v-if="!isLoading" class="run-set-bottom" @scroll="onScroll">
                    <!-- 冷热源 -->
                    <coldHotRunSet v-if="isColdHotControl === 'ColdHotControl'" :run-set="coldHotListInfoCodes" @cancel="cancelLoop"></coldHotRunSet>
                    <!-- 冷源 -->
                    <tempalte v-else-if="isColdHotControl === 'ColdSource'">
                        <!-- 冷站控制 -->
                        <template v-if="runSetTab === '0'">
                            <RunSet v-if="coolListInfoCodes?.length" :run-set="coolListInfoCodes" @cancel="cancelLoop" />
                            <m-illustration
                                v-if="!coolListInfoCodesLoading && !coolListInfoCodes?.length"
                                class="posCenter"
                                :title="i18n.global.t('meos_control_web.no_content')"
                                type="noContent"
                            ></m-illustration>
                        </template>

                        <!-- 末级泵组控制 -->
                        <template v-else>
                            <PumpList v-if="listFixedTimeStrategyList?.length" :list-fixed-time-strategy-list="listFixedTimeStrategyList" @cancel="cancelLoop" />
                            <div v-if="!listFixedTimeStrategyListLoading && !listFixedTimeStrategyList?.length" style="height: 270px; border: 1px solid transparent">
                                <m-illustration class="posCenter" :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
                            </div>
                        </template>
                    </tempalte>

                    <!-- 热源（没有空状态） -->
                    <HotRunSet
                        v-if="hotListInfoCodes?.length && selectedSystemObj?.imageOrProductName !== i18n.global.t('meos_control_web.vacant_hot_pot_system_graph') && hasControls"
                        :run-set="hotListInfoCodes"
                        @cancel="cancelLoop"
                    ></HotRunSet>
                    <!-- 数据统计 -->
                    <MonitoringDashboard />
                    <!-- 室外天气显示 -->
                    <div ref="weatherRef" class="weather">
                        <div class="auto-set-title fc">{{ i18n.global.t('meos_control_web.outdoor_weather_data') }}</div>
                        <WeatherList :weather-list="weatherList" />
                    </div>
                </m-scrollbar>
            </div>
            <!-- 系统iot信息 -->
            <template v-if="isColdHotControl === 'ColdHotControl'">
                <!-- 冷热源 -->
                <ColdHotSystemInfo
                    v-if="showSystemInfo"
                    :run-set="runSet"
                    :automatic-reset-arr="automaticResetArr"
                    :hot-cool-model="coldHotModel"
                    :expire-time="expireTime"
                    @close="showSystemInfo = false"
                ></ColdHotSystemInfo>
            </template>
            <template v-else-if="isColdHotControl === 'ColdSource'">
                <!-- 冷源 -->
                <ColdSystemInfo
                    v-if="showSystemInfo"
                    :run-set="settingInfo"
                    :pump-set-arr="pumpSetArr"
                    :automatic-reset-arr="automaticResetArr"
                    @close="showSystemInfo = false"
                ></ColdSystemInfo>
            </template>
            <template v-else>
                <!-- 热源 -->
                <HotSystemInfo v-if="showSystemInfo" :run-set="settingInfo" :automatic-reset-arr="automaticResetArr" @close="closeSystemInfo"></HotSystemInfo>
            </template>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getSystemRunningConditionInfo } from '@/views/ACoperationMonitoring/use-utils';
import MonitoringDashboard from '../../MonitoringDashboard/index.vue';
import useControlMain from './hooks/useControlMain';
import SettingSvg from '@/assets/images/operateMonitoring/setting.svg';
import settingGreyOutSvg from '@/assets/images/operateMonitoring/setting-grey-out.svg';
import RunSet from './RunSet.vue';
import coldHotRunSet from './coldHotRunSet/index.vue';
import PumpList from './PumpList.vue';
import ColdSystemInfo from './coldRunSet/SystemInfo.vue';
import HotSystemInfo from './HotRunSet/SystemSetting/SystemInfo.vue';
import HotRunSet from './HotRunSet/ControlPanel/index.vue';
import ColdHotSystemInfo from './coldHotRunSet/coldHotSystemInfo/index.vue';
import WeatherList from './WeatherList.vue';
import useSystemIotInfo from './hooks/useSystemIotInfo';
import useColdData from './hooks/useColdData';
import useFinalPumpData from './hooks/useFinalPumpData';
import useControlView from './hooks/useControlView';
import useWeatherData from './hooks/useWeatherData';
import useColdHotData from './hooks/useColdHotData';
import useHotData from './hooks/useHotData';
import useControlsLoading from './hooks/useControlsLoading';
import { useRouter } from 'vue-router';
import { isEdge } from '@/utils/envUtils';
import emitter from '@/utils/bus';

const router = useRouter();

const runModel = {
    1: i18n.global.t('meos_control_web.make_cold'),
    2: i18n.global.t('meos_control_web.make_hot'),
    3: i18n.global.t('common.meos_home_ventilation'),
    4: i18n.global.t('meos_control_web.dehumidify')
};

const systemId = inject('systemId', ref(''));
const majorCode = inject('majorCode', ref(''));
const showSystemInfo = inject('showSystemInfo', ref(''));
const selectedSystemObj = inject('selectedSystemObj');
const systemRunningConditionInfo = ref();
const hasControls = computed(() => {
    if (!isEdge()) {
        return false;
    }
    return true;
});
const enableCtrlContent = computed(() => (code = '') => {
    return i18n.global.t('meos_control_web.cloud_platform_control_not_supported_please_use_edge');
});
// 冷热源 冷源 热源控制判断
const isColdHotControl = computed(() => {
    return selectedSystemObj.value?.imageOrProductName === i18n.global.t('meos_control_web.heating_cooling_source_water_diagram')
        ? 'ColdHotControl'
        : majorCode?.value === 'ACCH'
        ? 'HeatSource'
        : 'ColdSource';
});

const runSetTabs = ref([
    { id: '0', name: i18n.global.t('meos_control_web.cooling_station_control'), text: i18n.global.t('meos_control_web.cooling_station_schedule') },
    { id: '1', name: i18n.global.t('meos_control_web.pump_group_control'), text: i18n.global.t('meos_control_web.pump_group_schedule') }
]);

const runSetTab = ref('0');
const popoverRef = ref(null);
const onScroll = () => {
    popoverRef?.value?.popoverRef.updatePosition();
};
// 控制 视图层 hook
const { setTop, weatherRef, setTopHeight, onSetTopHeight } = useControlView();

// 冷站控制相关
const { coolListInfoCodes, coolListInfoCodesLoading, getListCoolStrategy, getNumberOfChillersFun, isSizingMachine } = useColdData();

// 末级泵组相关
const { listFixedTimeStrategyList, listFixedTimeStrategyListLoading, getListFixedTimeStrategy } = useFinalPumpData();

// 冷&热 源相关
const { coldHotModel, coldHotListInfoCodes, getListColdHotStrategy, querySystemRunningModel, runSet, expireTime, queryCheckSystemRunningModelStatus } =
    useColdHotData(systemRunningConditionInfo);

// 热站控制相关
const { hotListInfoCodes, hotListInfoCodesLoading, getListHotStrategy } = useHotData();

// 天气相关
const { getWeatherList, weatherList, isStation } = useWeatherData(setTop, onSetTopHeight, isColdHotControl);

// 系统信息相关
const { querySettingInfoCodeConfigByObjectIds, settingInfo, listPumpGroupStrategyFun, pumpSetArr, listAccRuntimeClassFun, automaticResetArr } = useSystemIotInfo(isStation);

const { cancelLoop, loading } = useControlMain(
    isColdHotControl,
    setTop,
    runSetTab,
    onSetTopHeight,
    getWeatherList,
    getListCoolStrategy,
    getListFixedTimeStrategy,
    getListColdHotStrategy,
    getListHotStrategy,
    querySystemRunningModel,
    getNumberOfChillersFun
);

const settingsBtn = () => {
    if (!isEdge()) return;
    showSystemInfo.value = true;
    if (isColdHotControl.value === 'ColdHotControl') {
        queryCheckSystemRunningModelStatus(); //冷热源
        listAccRuntimeClassFun();
    } else if (isColdHotControl.value === 'ColdSource') {
        querySettingInfoCodeConfigByObjectIds(); //冷源
        listPumpGroupStrategyFun();
        listAccRuntimeClassFun();
    } else {
        querySettingInfoCodeConfigByObjectIds(); //热源
        listAccRuntimeClassFun();
    }
};
const closeSystemInfo = () => {
    emitter.emit('monitorCloseEquipmentiInfo');
    showSystemInfo.value = false;
};

const toStrategicInterventions = () => {
    const query = {
        systemId: systemId.value,
        systemName: selectedSystemObj.value.localName,
        type: runSetTab.value,
        isSizingMachine: isColdHotControl.value === 'ColdSource' ? (isSizingMachine.value ? '0' : '1') : ''
    };

    if (isColdHotControl.value === 'ColdHotControl') {
        router.push({
            path: '/cold-hot-strategic-interventions',
            query
        });
    } else if (isColdHotControl.value === 'ColdSource') {
        router.push({
            path: '/strategicinterventions',
            query
        });
    } else {
        router.push({
            path: '/heat-strategic-interventions',
            query: {
                systemId: systemId.value,
                systemName: selectedSystemObj.value.localName
            }
        });
    }
};
watch(selectedSystemObj, () => {
    if (!selectedSystemObj.value?.systemId) {
        return;
    }
    getSystemRunningConditionInfo(selectedSystemObj.value?.systemId, selectedSystemObj.value?.systemId, data => {
        systemRunningConditionInfo.value = data;
    });
});
watch(
    () => setTopHeight?.value,
    v => {
        setTopHeight.value = v;
    },
    {
        deep: true
    }
);
const { isLoading } = useControlsLoading(isColdHotControl, selectedSystemObj, runSetTab, coldHotListInfoCodes, coolListInfoCodes, hotListInfoCodes);
provide('systemRunningConditionInfo', systemRunningConditionInfo);
provide('getListCoolStrategy', getListCoolStrategy);
provide('getListFixedTimeStrategy', getListFixedTimeStrategy);
provide('getListHotStrategy', getListHotStrategy);
provide('getNumberOfChillersFun', getNumberOfChillersFun);
provide('popoverRef', popoverRef);
provide('hasControls', hasControls);
provide('isSizingMachine', isSizingMachine);
</script>

<style lang="less" scoped>
.bgc-color {
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
    padding: 12px;
}
.run-set-top {
    height: 62px;
}
.heat-title {
    color: #1b2129;

    font-size: 16px;
}
.card-box {
    /* overflow: auto; */
    height: calc(100% - 20px);
    &-list {
        padding-bottom: 12px;
        cursor: default;
        &:last-child {
            padding-bottom: 0;
        }
        &-key {
            color: #646c73;
        }
        &-value {
            min-width: 92px;
        }
    }
}
.card-box + .card-box {
    margin-top: 12px;
}
.run-set {
    .card-box-list-value {
        :deep(span) {
            font-weight: 700;
            &:first-child {
                font-size: 20px;
            }
        }
    }
    &-top {
        padding-top: 20px;
        border-bottom: 1px solid #e1e5eb;
        display: flex;
        align-items: center;
        width: 100%;
        .left-content {
            flex: 1;
            min-width: 0;
        }
        .line {
            height: 20px;
            width: 1px;
            background-color: #e1e5eb;
            margin-right: 8px;
        }
        svg {
            // cursor: pointer;
        }
        .xpruncsmanualAutoSet {
            cursor: pointer;
            width: 28px;
            height: 28px;
            &:hover {
                background-color: var(--alpha-30);
                border-radius: 4px;
            }
        }
        .wd {
            width: 28px;
            height: 28px;
        }
        .right {
            transform: translateY(1px);
            white-space: nowrap;
            display: flex;
            gap: 8px;
        }

        :deep(.m-tabs-item) {
            padding-left: 4px;
            padding-right: 4px;
        }
    }
    &-bottom {
        /* margin: 12px 0; */
        /* height: calc(100% - 40px); */
        /* height: auto;
        flex: 1; */
        /* padding: 12px 0; */
        height: 100%;
        :deep(.m-scrollbar__box) {
            position: relative;
            .m-scrollbar__content {
                width: calc(100% - 16px);
                .empty {
                    height: max-content;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
        :deep(.pump-list-item) {
            border: 1px solid var(--gray-300);
            padding: 12px;
            padding-bottom: 0;
            border-radius: 4px;
            background-color: rgba(247, 249, 250, 0.8);
            & + .pump-list-item {
                margin-top: 12px;
            }
            .pump-list-item-content-box + .pump-list-item-content-box {
                // margin-top: 12px;
            }
        }
    }
    &-btn {
        border-top: 1px solid #e1e5eb;
        height: 44px;
    }
}

.weather {
    .auto-set-title {
        font-size: 16px;
        color: @grey-900;
        padding: 6px 0 12px 0;
        border-bottom: 1px solid @grey-200;
        margin-bottom: 10px;
    }
}

.posCenter {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 82px;
}
.run-set-bottom-container {
    overflow: hidden;
    height: calc(100% - 55px);
    width: calc(100% + 16px);
    margin-right: 16px;
    padding-bottom: 16px;
}
@media only screen and (max-width: 1366px) {
    .run-set-top {
        height: 50px;
        padding-top: 8px;
    }
}
:deep(.m-loading-mask) {
    z-index: 44 !important;
}
</style>
