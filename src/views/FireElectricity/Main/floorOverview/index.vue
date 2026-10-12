<template>
    <div class="floor-overview">
        <div class="floor-overview-filter">
            <m-select
                v-model="curCheckedSysClassCodes"
                :options="statisticsSelect"
                value-key="classCode"
                label-key="classCodeName"
                :prefix="i18n.global.t('meos_control_web.system_colon')"
                :size="180"
                menu-size="300"
                multiple
                clearable
            ></m-select>
            <m-select v-model="abnormalType" :options="abnormalTypeFiltering" :prefix="i18n.global.t('meos_control_web.abnormal_type_colon')" :size="180" clearable></m-select>
        </div>
        <m-collapse v-if="dashboardData?.length" v-model="collapseData" icon-position="left" :hover-style="false">
            <template v-for="build in dashboardData" :key="build.id">
                <m-collapse-item v-if="build.children.length" :id="build.buildingId" :title="build.buildingName">
                    <template #icon="{ isActive }">
                        <div class="icon-warp">
                            <IconMeriComponentArrowDown v-if="isActive" size="16" color="#8D9399" />
                            <IconMeriComponentArrowRight v-else size="16" color="#8D9399" />
                        </div>
                    </template>
                    <template #title>
                        <div class="title-content" @click.stop>
                            <div class="building-name">{{ build.buildingName }}</div>
                            <div v-if="build?.abnormalCounts.value > 0" class="title-content-item" @click.stop>
                                <span>{{ i18n.global.t('meos_control_web.abnormal_event') }}</span>
                                <span class="count abnormal">{{ build.abnormalCounts }}</span>
                            </div>
                            <div
                                v-if="build.alarmCounts.value > 0"
                                class="title-content-item"
                                @click.stop="openSidebar(build, i18n.global.t('meos_control_web.alarm_signal_device'), 'alarm')"
                            >
                                <span class="name hoverable" :class="{ isActive: isItemSelected(build.buildingName, i18n.global.t('meos_control_web.alarm_signal_device')) }">{{
                                    i18n.global.t('meos_control_web.alarm_signal')
                                }}</span>
                                <span
                                    class="count alarm hoverable"
                                    :class="{ isActive: isItemSelected(build.buildingName, i18n.global.t('meos_control_web.alarm_signal_device')) }"
                                    >{{ build.alarmCounts }}</span
                                >
                            </div>
                            <div
                                v-if="build.faultCounts.value > 0"
                                class="title-content-item"
                                @click.stop="openSidebar(build, i18n.global.t('meos_control_web.fault_signal_device'), 'fault')"
                            >
                                <span class="name hoverable" :class="{ isActive: isItemSelected(build.buildingName, i18n.global.t('meos_control_web.fault_signal_device')) }">{{
                                    i18n.global.t('meos_control_web.fault_signal')
                                }}</span>
                                <span
                                    class="count breakdown hoverable"
                                    :class="{ isActive: isItemSelected(build.buildingName, i18n.global.t('meos_control_web.fault_signal_device')) }"
                                    >{{ build.faultCounts }}</span
                                >
                            </div>
                        </div>
                    </template>
                    <div v-if="build.children?.length" class="collapse-warp" :style="spaceItemColumn">
                        <div v-for="item in build.children" :key="item" class="collapse-warp-item" @click.stop="toFloorMap(build, item)">
                            <div class="collapse-warp-item-top">
                                <span class="title">{{ item.floorName }}</span>
                                <span v-if="item.abnormalCounts.value > 0" class="abnormal-events"
                                    >{{ i18n.global.t('meos_control_web.abnormal_event_colon')
                                    }}<span class="fw700">{{ i18n.global.t('meos_control_web.certain_number', { count: item.abnormalCounts?.value }) }}</span></span
                                >
                                <div class="in-floor">{{ i18n.global.t('meos_control_web.enter_floor') }}</div>
                            </div>
                            <div class="collapse-warp-item-bottom">
                                <div class="collapse-warp-item-bottom-item no-click">
                                    <span class="name">{{ i18n.global.t('meos_control_web.monitorable_devices') }}</span>
                                    <span class="count">{{ formatNumber(item?.equipCounts) }}</span>
                                </div>
                                <div
                                    v-if="item.alarmCounts.value > 0"
                                    class="collapse-warp-item-bottom-item"
                                    @click.stop="openSidebar(item, i18n.global.t('meos_control_web.alarm_signal_device'), 'alarm')"
                                >
                                    <span class="name" :class="{ isActive: isItemSelected(item.floorName, i18n.global.t('meos_control_web.alarm_signal_device')) }">{{
                                        i18n.global.t('meos_control_web.alarm_signal')
                                    }}</span>
                                    <span class="count alarm" :class="{ isActive: isItemSelected(item.floorName, i18n.global.t('meos_control_web.alarm_signal_device')) }">{{
                                        item.alarmCounts
                                    }}</span>
                                </div>
                                <div
                                    v-if="item.faultCounts.value > 0"
                                    class="collapse-warp-item-bottom-item"
                                    @click.stop="openSidebar(item, i18n.global.t('meos_control_web.fault_signal_device'), 'fault')"
                                >
                                    <span class="name" :class="{ isActive: isItemSelected(item.floorName, i18n.global.t('meos_control_web.fault_signal_device')) }">{{
                                        i18n.global.t('meos_control_web.fault_signal')
                                    }}</span>
                                    <span class="count breakdown" :class="{ isActive: isItemSelected(item.floorName, i18n.global.t('meos_control_web.fault_signal_device')) }">{{
                                        item.faultCounts
                                    }}</span>
                                </div>
                                <div v-if="!item.alarmCounts.value > 0 && !item.faultCounts.value > 0" class="no-count">
                                    {{ i18n.global.t('meos_control_web.no_anomaly_signal') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </m-collapse-item>
            </template>
        </m-collapse>
        <Empty v-else class="no-data" :text="i18n.global.t('meos_control_web.no_content')" width="90px" height="76px" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { curCheckedSysClassCodesKey, abnormalTypeKey } from '../../hooks/useCommonConfig';
import { IconMeriComponentArrowRight, IconMeriComponentArrowDown } from 'meri-icon';
import useFloorOverview from '../../hooks/useFloorOverview';
import Empty from '@/components/common/Empty.vue';
const curCheckedSysClassCodes = inject(curCheckedSysClassCodesKey);
const abnormalType = inject(abnormalTypeKey);
const { collapseData, statisticsSelect, spaceItemColumn, dashboardData, abnormalTypeFiltering, isItemSelected, openSidebar, formatNumber, toFloorMap } = useFloorOverview();
watch(
    () => abnormalTypeFiltering.value,
    () => {
        if (!abnormalTypeFiltering.value.some(item => item.id === abnormalType.value)) {
            abnormalType.value = null;
        }
    }
);
</script>
<style lang="less" scoped>
.floor-overview {
    user-select: none;
    padding: 0 0 12px 0;
    position: relative;
    &-filter {
        position: absolute;
        right: 0;
        top: 4px;
        display: flex;
        gap: 12px;
    }
    .icon-warp {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
            background: rgba(196, 201, 207, 0.3);
        }
    }
    :deep(.m-collapse-item__header) {
        padding: 8px 0;
        font-size: 18px;
        font-weight: 700;
    }
    .title-content {
        width: 100%;
        height: 26px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: default;
        .building-name {
            color: var(--gray-800, #2e3742);
            font-size: 18px;
            font-weight: 700;
            line-height: 26px;
            cursor: default;
        }
        &-item {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            display: flex;
            align-items: center;
            gap: 4px;
            .count {
                font-family: 'Persagy2.0';
                font-size: 16px;
                font-weight: 600;
            }
            .abnormal {
                color: #f55047;
            }
            .alarm {
                color: #f18b3e;
            }
            .breakdown {
                color: #d2ac00;
            }
        }
        :hover .hoverable {
            cursor: pointer;
            color: var(--blue-500, #246fe5);
        }
        &:hover .alarm,
        &:hover .breakdown {
            color: var(--blue-500, #246fe5);
        }
    }
    .collapse-warp {
        grid-template-columns: var(--system-repeat);
        display: grid;
        gap: 12px;
        margin-top: 6px;
        &-item {
            display: flex;
            padding: 12px 16px 20px 16px;
            border: 1px solid transparent;
            flex-direction: column;
            gap: 16px;
            border-radius: 8px;
            background: #f9fcff;
            &-top {
                display: flex;
                align-items: center;
                gap: 8px;
                position: relative;
                .title {
                    color: var(--gray-800, #2e3742);
                    font-family: 'Persagy2.0';
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 26px;
                }
                .abnormal-events {
                    padding: 3px 8px;
                    border-radius: 2px;
                    background: linear-gradient(270deg, rgba(245, 80, 71, 0.05) 0%, rgba(245, 80, 71, 0.2) 100%);
                    color: var(--red-500, #f55047);
                    font-size: 14px;
                    font-weight: var(--platform-font-weight);
                    line-height: 20px;
                }
                .in-floor {
                    position: absolute;
                    right: 0;
                    padding: 3px 4px;
                    color: var(--blue-500, #246fe5);
                    font-size: 14px;
                    display: block;
                }
            }
            &-bottom {
                display: grid;
                align-items: center;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                &-item {
                    display: flex;
                    gap: 4px;
                    color: var(--gray-600, #626c78);
                    font-size: 14px;
                    font-weight: var(--platform-font-weight);
                    line-height: 14px;
                    user-select: none;
                    .count {
                        color: var(--gray-800, #2e3742);
                        font-family: 'Persagy2.0';
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 600;
                    }
                    .name {
                        white-space: nowrap;
                    }
                    .alarm {
                        color: #f18b3e;
                    }
                    .breakdown {
                        color: #d2ac00;
                    }
                    &:hover {
                        cursor: pointer;
                        color: var(--blue-500, #246fe5);
                    }

                    &:hover * {
                        color: var(--blue-500, #246fe5);
                    }
                }
                .no-count {
                    color: var(--gray-600, #626c78);
                    font-size: 14px;
                }
                .no-click {
                    &:hover {
                        cursor: default;
                    }
                    &:hover .name {
                        color: var(--gray-600, #626c78);
                    }
                    &:hover .count {
                        color: var(--gray-800, #2e3742);
                    }
                }
            }
            &:hover {
                cursor: pointer;
                border: 1px solid var(--blue-500, #246fe5);
            }
            &:hover .alarm,
            &:hover .breakdown {
                color: var(--blue-500, #246fe5);
            }
            &:hover .in-floor {
                display: block;
            }
        }
    }
    .no-data {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 380px);
    }
}
.isActive {
    color: var(--blue-500, #246fe5) !important;
}
</style>
