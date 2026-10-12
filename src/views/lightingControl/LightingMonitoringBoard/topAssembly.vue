<template>
    <m-scrollbar class="topAssembly-scrollbar">
        <div class="topAssembly">
            <div v-if="commonArea?.demandConsistency" :class="[ParkingLot?.demandConsistency ? 'w33' : 'w50', 'topAssembly-box']">
                <div v-if="CommunalDemandShow" style="width: 100%">
                    <m-list-skeleton :item-num="4" />
                </div>
                <template v-else>
                    <div class="fcb">
                        <div class="fb7 f18">{{ i18n.global.t('meos_control_web.public') }}</div>
                        <div class="fc">
                            <div class="ft f14">{{ i18n.global.t('meos_control_web.demand_description') }}</div>
                            <m-popover :width="336 + 'px'" :show-arrow="false" placement="right-start">
                                <template #content>
                                    <div v-loading="show" style="min-height: 57px" element-loading-lottiename="circle">
                                        <span v-if="Object.keys(spaceStatisticsObj).length > 0">
                                            {{
                                                i18n.global.t('meos_control_web.space_statistics_detail', {
                                                    total: spaceStatisticsObj.total,
                                                    matchingCount: spaceStatisticsObj.matchingCount,
                                                    autoCount: spaceStatisticsObj.autoCount,
                                                    interventionCount: spaceStatisticsObj.interventionCount
                                                })
                                            }}
                                        </span>
                                    </div>
                                </template>
                                <svg aria-hidden="true" class="row-tips-icon ml4" @mouseenter="mouseShow('PUBLIC_AREA_LIGHTING', true)" @mouseleave="mouseShow(false)">
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                    </div>
                    <div :class="[demandConsistencyBgc(convertAndFloor(commonArea?.demandConsistency)), 'chart-item', 'mt12', 'fc']">
                        <template v-if="commonArea?.demandConsistency">
                            <pirChart :satisfy="convertAndFloor(commonArea?.demandConsistency || 0)" :dissatisfy="100 - convertAndFloor(commonArea?.demandConsistency || 0)" />
                        </template>
                        <div>
                            <div
                                v-if="convertAndFloor(commonArea?.demandConsistency)"
                                :class="[convertAndFloor(commonArea?.demandConsistency) === 100 ? 'font-g' : '', 'f28', 'fb7', 'font-f']"
                            >
                                {{ convertAndFloor(commonArea?.demandConsistency) }}%
                            </div>
                            <div class="f14 ft1">
                                {{
                                    convertAndFloor(commonArea?.demandConsistency)
                                        ? i18n.global.t('meos_control_web.demand_consistency')
                                        : i18n.global.t('meos_control_web.no_global_demand')
                                }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="fcb mt10">
                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.demand_target') }}</div>
                            <m-button type="link" size="small" @click="viewDemandTargetList(i18n.global.t('meos_control_web.public'))">{{
                                i18n.global.t('meos_control_web.demand_and_intervention')
                            }}</m-button>
                        </div>
                        <timeAxisRectangles
                            :key="CommonAreaDemandUpdateKey"
                            :list-data="CommunalDemand"
                            :legend-items="legendItems"
                            :group-by-legend-show="false"
                            :show-current-time="false"
                            :format-time-scope="`${i18n.global.t('meos_control_web.time_colon')}`"
                            @click-rectangle="data => clickRectangle(data, i18n.global.t('meos_control_web.public'))"
                        >
                            <template #currentTimeContent="{ computedActiveTimeLeftPercent, computedActiveTimePoolName, activeTimePool }">
                                <div
                                    :class="[CommunalDemand.length === 1 ? 'mt24' : 'mt10', 'current-demand-tip-warp']"
                                    :style="`--position-left: ${computedActiveTimeLeftPercent}%`"
                                >
                                    <div :class="[CommunalDemand.length === 1 ? 'no-intervention' : 'have-intervention', 'time-pointer']"></div>
                                    <div class="current-demand-tip-content">
                                        <template v-if="computedActiveTimePoolName != i18n.global.t('meos_control_web.no_demand1')">
                                            <div class="global-mark">{{ i18n.global.t('meos_control_web.current_global') }}</div>
                                            <div v-ellipsis class="time-show">{{ getTimeShowText(activeTimePool) }}</div>
                                        </template>
                                        <template v-else>
                                            <div class="time-show">{{ i18n.global.t('meos_control_web.global_not_configured') }}</div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </timeAxisRectangles>
                    </div>
                </template>
            </div>
            <div v-if="ParkingLot?.demandConsistency" :class="[commonArea?.demandConsistency ? 'w33' : 'w50', 'topAssembly-box']">
                <div v-if="ParkingLotDemandShow" style="width: 100%">
                    <m-list-skeleton :item-num="4" />
                </div>
                <template v-else>
                    <div class="fcb">
                        <div class="fb7 f18">{{ i18n.global.t('common.meos_home_parking_lot') }}</div>
                        <div class="fc">
                            <div class="ft f14">{{ i18n.global.t('meos_control_web.demand_description') }}</div>
                            <m-popover :width="336 + 'px'" :show-arrow="false" placement="right-start">
                                <template #content>
                                    <div v-loading="show" style="min-height: 57px" element-loading-lottiename="circle">
                                        <span v-if="Object.keys(spaceStatisticsObj).length > 0">
                                            {{
                                                i18n.global.t('meos_control_web.space_statistics_detail', {
                                                    total: spaceStatisticsObj.total,
                                                    matchingCount: spaceStatisticsObj.matchingCount,
                                                    autoCount: spaceStatisticsObj.autoCount,
                                                    interventionCount: spaceStatisticsObj.interventionCount
                                                })
                                            }}
                                        </span>
                                    </div>
                                </template>
                                <svg aria-hidden="true" class="row-tips-icon ml4" @mouseenter="mouseShow('PARKING_LOT_LIGHTING', true)" @mouseleave="mouseShow(false)">
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                    </div>
                    <div :class="['chart-item', 'mt12', 'fc', demandConsistencyBgc(convertAndFloor(ParkingLot?.demandConsistency))]">
                        <template v-if="ParkingLot?.demandConsistency">
                            <pirChart :satisfy="convertAndFloor(ParkingLot?.demandConsistency || 0)" :dissatisfy="100 - convertAndFloor(ParkingLot?.demandConsistency || 0)" />
                        </template>
                        <div>
                            <div
                                v-if="convertAndFloor(ParkingLot?.demandConsistency)"
                                :class="[convertAndFloor(ParkingLot?.demandConsistency) === 100 ? 'font-g' : '', 'f28', 'fb7', 'font-f']"
                            >
                                {{ convertAndFloor(ParkingLot?.demandConsistency) }}%
                            </div>
                            <div class="f14 ft1">
                                {{
                                    convertAndFloor(ParkingLot?.demandConsistency)
                                        ? i18n.global.t('meos_control_web.demand_consistency')
                                        : i18n.global.t('meos_control_web.no_global_demand')
                                }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="fcb mt10">
                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.demand_target') }}</div>
                            <m-button type="link" size="small" @click="viewDemandTargetList(i18n.global.t('common.meos_home_parking_lot'))">{{
                                i18n.global.t('meos_control_web.demand_and_intervention')
                            }}</m-button>
                        </div>
                        <timeAxisRectangles
                            :key="ParkingLotDemandUpdateKey"
                            :list-data="ParkingLotDemand"
                            :legend-items="legendItems"
                            :group-by-legend-show="false"
                            :show-current-time="false"
                            :format-time-scope="`${i18n.global.t('meos_control_web.time_colon')}`"
                            @click-rectangle="data => clickRectangle(data, i18n.global.t('common.meos_home_parking_lot'))"
                        >
                            <template #currentTimeContent="{ computedActiveTimeLeftPercent, computedActiveTimePoolName, activeTimePool }">
                                <div
                                    :class="[ParkingLotDemand.length === 1 ? 'mt24' : 'mt10', 'current-demand-tip-warp']"
                                    :style="`--position-left: ${computedActiveTimeLeftPercent}%`"
                                >
                                    <div :class="[ParkingLotDemand.length === 1 ? 'no-intervention' : 'have-intervention', 'time-pointer']"></div>
                                    <div class="current-demand-tip-content">
                                        <template v-if="computedActiveTimePoolName != i18n.global.t('meos_control_web.no_demand1')">
                                            <div class="global-mark">{{ i18n.global.t('meos_control_web.current_global') }}</div>
                                            <div v-ellipsis class="time-show">{{ getTimeShowText(activeTimePool) }}</div>
                                        </template>
                                        <template v-else>
                                            <div class="time-show">{{ i18n.global.t('meos_control_web.global_not_configured') }}</div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </timeAxisRectangles>
                    </div>
                </template>
            </div>
            <div class="topAssembly-box" :class="[ParkingLot?.demandConsistency ? (commonArea?.demandConsistency ? 'w33' : 'w50') : 'w50', 'topAssembly-box']">
                <div v-if="EquipmentStatisticsShow" style="width: 100%">
                    <m-list-skeleton :item-num="4" />
                </div>
                <template v-else>
                    <div class="fc">
                        <div class="fb7 f18 mr12">{{ i18n.global.t('meos_control_web.lighting_equipment') }}</div>
                        <m-button v-if="commonArea?.demandConsistency && isEdge()" type="default" size="medium" @click="showList('PUBLIC_AREA_LIGHTING', { type: 'loop' })">{{
                            i18n.global.t('meos_control_web.public_equipment')
                        }}</m-button>
                        <m-button
                            v-if="ParkingLot?.demandConsistency && isEdge()"
                            class="ml8"
                            type="default"
                            size="medium"
                            @click="showList('PARKING_LOT_LIGHTING', { type: 'loop' })"
                            >{{ i18n.global.t('meos_control_web.parking_facility') }}</m-button
                        >
                    </div>
                    <div class="mt24 mb24">
                        <div style="height: 100px" class="fc">
                            <div class="fc">
                                <div class="img-box mr12">
                                    <SvgIcon name="equip-img"></SvgIcon>
                                </div>
                                <div>
                                    <div
                                        v-ellipsis
                                        :class="['f26', 'fb7', 'm-ellipsis', 'font-f']"
                                        :style="{
                                            minWidth: '90px'
                                        }"
                                    >
                                        {{ EquipmentStatistics?.circuitStatistics?.totalCircuitCount || '0' }}
                                    </div>
                                    <div class="f14">{{ i18n.global.t('meos_control_web.lighting_circuit') }}</div>
                                </div>
                            </div>
                            <div class="get-line ml24 mr24"></div>
                            <div>
                                <div>
                                    <div class="f16" style="font-family: 'CustomRegular2'">
                                        {{ EquipmentStatistics?.circuitStatistics?.offlineCount || '0' }}/{{ EquipmentStatistics?.circuitStatistics?.orderFailAlarmCount || '0' }}
                                    </div>
                                    <div class="f14 ft1">{{ i18n.global.t('meos_control_web.offline_control_feedback_mismatch') }}</div>
                                </div>
                                <div class="mt24">
                                    <div class="f16" style="font-family: 'CustomRegular2'">
                                        {{ EquipmentStatistics?.circuitStatistics?.manualCount || '0' }}/{{ EquipmentStatistics?.circuitStatistics?.autoCount || '0' }}
                                    </div>
                                    <div class="f14 ft1">{{ i18n.global.t('meos_control_web.manual_auto') }}</div>
                                </div>
                            </div>
                        </div>
                        <div style="height: 48px" class="fc mt32">
                            <div class="fc">
                                <div class="img-box mr12">
                                    <SvgIcon name="equip-img"></SvgIcon>
                                </div>
                                <div>
                                    <div
                                        v-ellipsis
                                        :class="['f26', 'fb7', 'm-ellipsis', 'font-f']"
                                        :style="{
                                            minWidth: '90px'
                                        }"
                                    >
                                        {{ EquipmentStatistics?.controllerStatistics?.totalControllerCount || '0' }}
                                    </div>
                                    <div class="f14">{{ i18n.global.t('meos_control_web.control_module') }}</div>
                                </div>
                            </div>
                            <div class="get-line ml24 mr24"></div>

                            <div>
                                <div class="f16" style="font-family: 'CustomRegular2'">{{ EquipmentStatistics?.controllerStatistics?.offlineCount || '0' }}</div>
                                <div class="f14 ft1">{{ i18n.global.t('meos_control_web.offline') }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="convertAndFloor(commonArea?.demandConsistency) > 0 && convertAndFloor(commonArea?.demandConsistency) < 100" class="detail-item fcb">
                        <SvgIcon name="y-warn" />
                        <span style="flex: 1" class="ml8">{{ i18n.global.t('meos_control_web.lighting_equipment_demand_not_met') }}</span>
                        <m-button v-if="isEdge()" type="link" size="small" @click="viewDemandFulfillment">{{ i18n.global.t('meos_control_web.view_detail') }}</m-button>
                    </div>
                </template>
            </div>
        </div>
    </m-scrollbar>
</template>
<script setup>
import pirChart from './pirChart.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import timeAxisRectangles from '@/components/time-axis-rectangles/index.vue';
import { isEdge } from '@/utils/envUtils';
import emitter from '@/utils/bus';
import debounce from 'lodash/debounce';
import { spaceStatistics } from '@/apis/lightingControl';
import useStore from '@/store';
import i18n from '@/localization';
import dayjs from 'dayjs';
import { loopControlList } from '@/store/loopControlList';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsSame } from '@/utils/dayjsTools';

const { base } = useStore();
const { projectId } = base || {};

const commonArea = inject('CommonArea');
const ParkingLot = inject('ParkingLot');
const EquipmentStatistics = inject('EquipmentStatistics');

const CommunalDemand = inject('CommunalDemand');
const ParkingLotDemand = inject('ParkingLotDemand');

const CommunalDemandShow = inject('CommunalDemandShow');
const ParkingLotDemandShow = inject('ParkingLotDemandShow');
const EquipmentStatisticsShow = inject('EquipmentStatisticsShow');

const CommonAreaDemandUpdateKey = inject('CommonAreaDemandUpdateKey');
const ParkingLotDemandUpdateKey = inject('ParkingLotDemandUpdateKey');

const templateType = inject('templateType');
const show = ref(true);
const viewDemandFulfillment = () => {
    emitter.emit('viewDemandFulfillment', {});
};

const nameTypeMap = {
    [i18n.global.t('common.meos_home_parking_lot')]: 'PARKING_LOT_LIGHTING',
    [i18n.global.t('meos_control_web.public')]: 'PUBLIC_AREA_LIGHTING'
};

const viewDemandTargetList = name => {
    emitter.emit('viewDemandTargetList', { name, demandTemplateType: nameTypeMap[name] });
};

const clickRectangle = (item, name) => {
    const defaultConfigId = item?.configId ? item?.configId : item?.isNone ? `${item?.type}-${item?.timeRangeString}` : '';
    const currentTimeString = new Date().toISOString();
    emitter.emit('viewDemandTargetList', { ...item, name, configId: defaultConfigId, currentTimeString, demandTemplateType: nameTypeMap[name] });
};

const getTimeShowText = currentObjs => {
    const interventionItem = currentObjs?.find(v => v?.type === 'intervention' && !v?.isNone);
    const demandItem = currentObjs?.find(v => v?.type === 'auto');
    const { timeRange, isNone, title, type } = interventionItem || demandItem || {};
    const startOfDayTime = getDayjsTz().startOf('day');
    let showTxt = '';
    if (timeRange) {
        const finalName =
            type === 'auto'
                ? `${isNone ? i18n.global.t('meos_control_web.demand_scene_not_yet_set') : title || '--'}`
                : `${isNone ? i18n.global.t('meos_control_web.no_intervention') : i18n.global.t('meos_control_web.manual_intervention1')}`;
        const startTimeStamp = dayjs(timeRange?.[0]);
        const startTime = dayjsIsBefore(startTimeStamp, startOfDayTime) ? startOfDayTime : startTimeStamp;
        const transformEndTime = dayjs(timeRange?.[1]).format('HH:mm');
        showTxt = `${finalName}(${startTime.format('HH:mm')} - ${transformEndTime === '00:00' ? '24:00' : transformEndTime})`;
    } else {
        showTxt = `${i18n.global.t('meos_control_web.no_demand1')}(00:00 - 24:00)`;
    }
    return showTxt;
};

const curFloorId = inject('curFloorId');
const dashboardTemplateType = inject('dashboardTemplateType');
const loopListStore = loopControlList();
const listData = ref([]);
const spaceStatisticsObj = ref({});
listData.value = [];
const legendItems = ref([
    { color: '#9FC9FB', title: i18n.global.t('meos_control_web.auto_demand') },
    { color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)', title: i18n.global.t('meos_control_web.no_demand1') },
    { color: '#ECC00C', title: i18n.global.t('meos_control_web.self_interven') }
]);
const showList = (type, metaList) => {
    // if (!type || type <= 0) return;
    dashboardTemplateType.value = type;
    let baseObj, params;
    if (curFloorId?.value) {
        baseObj = { instanceType: 'FLOOR', instanceId: curFloorId.value };
    } else {
        baseObj = { type: type };
    }
    if (metaList.type === 'loop') {
        params = baseObj ? Object.assign(metaList, { hlInfo: baseObj }) : metaList;
    } else {
        params = baseObj ? Object.assign(metaList, { coInfo: baseObj }) : metaList;
    }
    loopListStore.setList(params, false);
    loopListStore.setVisible(true);
};
const getListBusinessTimeByObjId = (type, status) => {
    if (status) {
        spaceStatisticsObj.value = {};
        show.value = true;
        const params = {
            instanceId: projectId,
            configId: '-1',
            runningMonitorSecondType: type,
            instanceType: 'PROJECT'
        };
        spaceStatistics(params)
            .then(res => {
                spaceStatisticsObj.value = res.data;
                show.value = false;
            })
            .finally(() => {
                show.value = false;
            });
    } else {
        spaceStatisticsObj.value = {};
        show.value = false;
    }
};
const mouseShow = debounce(getListBusinessTimeByObjId, 500);

const convertAndFloor = value => {
    return value === '--' ? '--' : (Number(value) * 100).toFixed(0);
};
const demandConsistencyBgc = count => {
    let str = '';
    if (Number(count)) {
        if (Number(count) === 0) {
            str = 'bgc-no';
        } else if (Number(count) === 100) {
            str = 'bgc-g';
        } else if (100 - Number(count) > 0) {
            str = 'bgc-r';
        }
    } else {
        return 'bgc-no';
    }
    return str;
};
</script>
<style lang="less" scoped>
.font-g {
    color: #15ae55;
}
:deep(.el-loading-mask) {
    background: white !important;
    .el-loading-spinner {
        line-height: 57px !important;
    }
    .el-loading-spinner .path {
        stroke: #626c78;
    }
    .el-loading-spinner .circular {
        width: 28px;
        height: 28px;
    }
}
.font-f {
    font-family: 'CustomMedium2', 'PersagyBold2', 'Persagy-Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC', 'Noto Sans',
        'Noto Sans CJK SC', 'Microsoft YaHei', '微软雅黑', sans-serif;
}
.topAssembly {
    width: 100%;
    display: flex;
    gap: 12px;

    .topAssembly-box {
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.8);
        padding: 16px 24px;
        min-width: 340px;

        min-height: 341px;

        .row-tips-icon {
            width: 16px;
            height: 16px;
            color: @grey-500;
        }
        .chart-item {
            border-radius: 8px;
            padding: 16px;
        }
        .img-box {
            border-radius: 4px;
            background: linear-gradient(84deg, rgba(149, 159, 180, 0.32) 1.65%, rgba(149, 159, 180, 0.12) 98.1%);
            padding: 7px;
            width: 38px;
            height: 38px;
        }
        .detail-item {
            background-color: #fff0cc;
            border-radius: 4px;
            padding: 4px 16px;
        }
    }
    :deep(.m-scrollbar__content) {
    }
}
.w33 {
    width: 33%;
}
.w50 {
    width: 50%;
}
.bgc-r {
    background: linear-gradient(90deg, rgba(255, 130, 125, 0.12) 0%, rgba(255, 130, 125, 0.04) 100%);
}
.bgc-g {
    background: linear-gradient(90deg, rgba(60, 199, 120, 0.08) 0%, rgba(60, 199, 120, 0.02) 100%);
}
.bgc-no {
    background: linear-gradient(90deg, rgba(148, 148, 148, 0.12) 0%, rgba(148, 148, 148, 0.04) 100%);
}
.get-line {
    height: 100%;
    width: 1px;
    background-color: #e1e5eb;
}
:deep(.m-popper-trigger) {
    display: flex;
    align-items: center;
}
.current-demand-tip-warp {
    width: 100%;
    display: flex;
    height: 32px;
    padding: 2px 8px 2px 6px;
    align-items: center;
    gap: 4px;
    border-radius: 4px;
    border: 1px solid var(--gray-300);
    background: var(--gray-200);
    position: relative;

    .time-pointer {
        position: absolute;
        left: var(--position-left);
        transform: translateY(-100%) translateX(-50%);
        width: 1px;
        border-left: 1px dashed var(--gray-900);
        &::before {
            content: '';
            border-top: 6px solid var(--gray-900);
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
            border-bottom: 0px solid var(--gray-900);
            position: absolute;
            bottom: 0;
            transform: translateX(-59%);
        }
    }
    .no-intervention {
        height: 63px;
        top: -13px;
    }
    .have-intervention {
        height: 64px;
        top: -12px;
    }
    &::before {
        content: '';
        width: 12px;
        height: 12px;
        background: var(--gray-200);
        position: absolute;
        top: -5px;
        left: var(--position-left);
        transform: rotateZ(45deg) translateX(-6px) translateY(3px);
        border-top: 1px solid var(--gray-300);
        border-left: 1px solid var(--gray-300);
    }

    .current-demand-tip-content {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 4px;

        .global-mark {
            border-radius: 2px;
            background: var(--gray-600, #626c78);
            padding: 3px 4px;
            color: #fff;
            font-size: 10px;
            line-height: 12px;
            display: flex;
            align-items: center;
        }

        .time-show {
            width: 100%;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--gray-600);
            white-space: nowrap;
        }

        .special-space {
            cursor: pointer;
            color: var(--orange-700);
            font-size: 14px;
            line-height: 22px;
        }
    }
}
</style>
