<template>
    <div class="space-box wh100 fc">
        <div v-show="isRunningStandardLoading" class="standard-loading-container"></div>
        <div v-if="showMain && !isRunningStandardLoading" class="space-box-left">
            <TotalTwo :space-type="spaceType" :space-list="flatBuildingFloorSpaces" :tdb-colors="computedColors">
                <template #left>
                    <m-tabs v-model="spaceType" :data="spaceTypes" type="segment" size="medium"></m-tabs>
                </template>
            </TotalTwo>
            <SpaceListTwo
                v-if="flatBuildingFloorSpaces.length"
                v-model="curSelectedTime"
                :flat-building-floor-spaces="flatBuildingFloorSpaces"
                :current-map-spaces="currentMapSpaces"
                :fifteen-minute-times="fifteenMinuteTimes"
                :space-type="spaceType"
                :start-time="startTime"
                :end-time="endTime"
            />
        </div>
        <FloorMap
            v-model="currentFloorId"
            v-model:map-loading="mapLoading"
            class="space-box-right"
            :type="spaceType === DEMAND ? 'SpaceStrategyDemand' : spaceType === DISPATCH ? 'SpaceStrategyDispatch' : spaceType === HUMIDITY ? 'SpaceStrategyHumidity' : ''"
            :spaces="floorMapSpaces"
            :time="dateTime"
        ></FloorMap>
    </div>
</template>

<script setup>
import SpaceListTwo from '../components/SpaceListTwo.vue';
import { useSpaceStrategy } from '../hooks/useSpaceStrategy';
import TotalTwo from '../components/TotalTwo.vue';
import FloorMap from '../components/floorMap/index.vue';
import { DEMAND, DISPATCH, HUMIDITY } from '../variable';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { isRunningStandardLoadingKey } from '../hooks/useStaticData';
import { MLoading } from 'meri-plus';

const props = defineProps({
    selectData: {
        type: Object,
        default: () => ({})
    },
    fifteenMinuteTimes: {
        type: Array,
        default: () => []
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
    }
});

const mapLoading = ref(true);
const loadingInstance = ref(null);
const isRunningStandardLoading = inject(isRunningStandardLoadingKey);

// flatBuildingFloorSpaces, currentMapSpaces, loading, spaceTimeStatistics, curSelectedTime,
const { spaceMap, flatBuildingFloorSpaces, curSelectedTime, currentMapSpaces, tdbColors, humidityColors, curSelectedFloorObj, spaceType, spaceTypes, floorMapSpaces, dateTime } =
    useSpaceStrategy(props);

const currentFloorId = ref();

watch(currentFloorId, () => {
    curSelectedFloorObj.value = getFloorInfoByFloorId(currentFloorId.value);
});

const computedColors = computed(() => {
    if (spaceType.value === DISPATCH) {
        return tdbColors.value;
    } else if (spaceType.value === HUMIDITY) {
        return humidityColors.value;
    }
    return [];
});

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
    .space-box-left {
        width: 50%;
        height: 100%;
        // overflow: hidden;
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
