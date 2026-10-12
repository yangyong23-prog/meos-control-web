<template>
    <div class="space-box wh100 fc">
        <div v-show="isRunningStandardLoading" class="standard-loading-container"></div>
        <div v-if="!isRunningStandardLoading && showMain" class="space-box-left">
            <Total :show="flatBuildingFloorSpaces?.length !== 0" :cur-selected-time="curSelectedTime" :space-type="spaceType" :space-time-statistics="spaceTimeStatistics">
                <template #left>
                    <m-tabs v-if="!fixType" v-model="spaceType" :data="spaceTypes" type="segment" size="medium" :style="{ maxWidth: '100%' }"></m-tabs>
                    <span v-else class="space-left-title">
                        <span class="left-title-icon"></span>
                        <span class="left-title-text">
                            {{
                                isDisContent
                                    ? `${i18n.global.t('meos_control_web.rigid_unsatisfied_space_list')}`
                                    : `${SAPCETYPE[spaceTypeData].name}${i18n.global.t('meos_control_web.space_list')}`
                            }}
                        </span>
                    </span>
                </template>
            </Total>
            <template v-if="loading">
                <div style="padding: 0 24px; height: calc(100% - 140px)">
                    <m-list-skeleton />
                </div>
            </template>
            <template v-else>
                <SpaceList
                    v-if="flatBuildingFloorSpaces.length"
                    v-model="curSelectedTime"
                    :flat-building-floor-spaces="flatBuildingFloorSpaces"
                    :current-map-spaces="currentMapSpaces"
                    :fifteen-minute-times="fifteenMinuteTimes"
                    :space-type="spaceType"
                    :start-time="startTime"
                    :end-time="endTime"
                />
                <div v-else class="fcc" style="height: calc(100% - 140px)">
                    <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
                </div>
            </template>
        </div>
        <FloorMap
            v-model="currentFloorId"
            v-model:map-loading="mapLoading"
            class="space-box-right"
            :type="spaceType === TEMPERATURE ? 'SapcetypeTemperature' : spaceType === CO2 ? 'SapcetypeCO2' : spaceType === HUMIDITY ? 'SpaceTypeHumidity' : ''"
            :spaces="floorMapSpaces"
            :time="dateTime"
        ></FloorMap>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Total from '../components/Total.vue';
import SpaceList from '../components/SpaceList.vue';
import FloorMap from '../components/floorMap/index.vue';
import useSpacePerdiction from '../hooks/useSpacePerdiction';
import { TEMPERATURE, HUMIDITY, CO2 } from '../variable';
import json from '../components/floorMap/Fl61011220101bc101e0978941c68884a1eacaccf322.json';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { SAPCETYPE } from '../variable';
import { isRunningStandardLoadingKey } from '../hooks/useStaticData';
import { MLoading } from 'meri-plus';

const currentFloorId = ref();

const mapLoading = ref(true);
const loadingInstance = ref(null);
const isRunningStandardLoading = inject(isRunningStandardLoadingKey);
onMounted(() => {});

watch(currentFloorId, () => {
    curSelectedFloorObj.value = getFloorInfoByFloorId(currentFloorId.value);
    console.log('curSelectedFloorObj.value :>> ', curSelectedFloorObj.value);
});

const props = defineProps({
    fifteenMinuteTimes: {
        type: Array,
        default: () => []
    },
    selectData: {
        type: Object,
        default: () => ({})
    },
    startTime: {
        type: String,
        default: ''
    },
    endTime: {
        type: String,
        default: ''
    },
    showMain: {
        type: Boolean,
        default: true
    },
    spaceTypeData: {
        type: String,
        default: TEMPERATURE
    },
    spaceIds: {
        type: Array,
        default: undefined
    },
    fixType: {
        type: Boolean,
        default: false
    },
    isDisContent: {
        type: Boolean,
        default: false
    }
});
const { floorMapSpaces, flatBuildingFloorSpaces, curSelectedTime, currentMapSpaces, loading, spaceTimeStatistics, spaceType, spaceTypes, curSelectedFloorObj, dateTime } =
    useSpacePerdiction(props);

watch(
    () => isRunningStandardLoading.value,
    cur => {
        if (cur) {
            loadingInstance.value = MLoading.service({
                target: '.standard-loading-container',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            nextTick(() => {
                loadingInstance.value?.destroy?.();
            });
        }
    },
    {
        immediate: true
    }
);

onUnmounted(() => {
    loadingInstance.value?.destroy?.();
    loadingInstance.value = null;
});
</script>
<style lang="less" scoped>
.space-box {
    & > .space-box-left {
        width: 50%;
        height: 100%;
        .space-left-title {
            color: var(--gray-800, #2e3742);
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            height: 32px;
            line-height: 22px;
            .left-title-icon {
                display: inline-block;
                width: 3px;
                height: 14px;
                position: relative;
                top: 1px;
                background: var(--blue-500, #246fe5);
                margin-right: 9px;
                margin-top: 6px;
            }
        }
    }

    .space-box-right {
        width: 50%;
        height: 100%;
    }
    .standard-loading-container {
        width: 50%;
        height: 100%;
    }
}
</style>
