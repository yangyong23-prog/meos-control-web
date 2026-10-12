<template>
    <div class="indoor-lighting-operating-control h100">
        <m-tabs
            :key="currentFloorObj?.id"
            v-model="consoleType"
            size="large"
            :data="consoleTypeTabs"
            :style="{ marginLeft: '-12px', width: currentFloorObj?.id ? 'calc(100% - 74px)' : 'calc(100%)' }"
        />
        <m-button
            v-if="currentFloorObj?.id"
            class="equipment-list"
            type="default"
            size="small"
            style="max-width: 74px"
            @click="openEquipmentList({ runningMonitorSecondType: sceneData === PUBLIC.id ? PUBLIC.code : PARKING.code, floorId: currentFloorObj.id })"
        >
            {{ i18n.global.t('meos_control_web.equipment_list') }}
        </m-button>
        <template v-if="consoleType === TEMPORARY_CONTROL.id">
            <TemporaryControl
                ref="TemporaryRequirementRef"
                :key="instanceObj.instanceId"
                v-bind="instanceObj"
                :has-public-loop="hasPublicLoop"
                :has-parking-loop="hasParkingLoop"
                :loading-main="loading"
            />
        </template>
        <template v-else-if="consoleType === REQUIREMENT_TARGET.id">
            <requirementTarget :instance-obj="instanceObj" :has-public-loop="hasPublicLoop" :has-parking-loop="hasParkingLoop"></requirementTarget>
        </template>
        <template v-else-if="consoleType === FLOOR_STATISTICS.id">
            <FloorRunStatistics :key="currentFloorObj?.id" v-bind="instanceObj" :service-area-type="sceneData"></FloorRunStatistics>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ref } from 'vue';
import { currentFloorObjInjectKey, getLoopListByFloorIdKey, loopListKey, sceneDataKey, TemporaryRequirementRefKey } from '../hooks/useBaseHook';
import { openEquipmentListKey } from '@/views/IndoorLighting/hooks/useEquipmentList';
import { TEMPORARY_CONTROL, REQUIREMENT_TARGET, PUBLIC, PARKING, FLOOR_STATISTICS } from '../variables';
import TemporaryControl from './temporaryControl/index.vue';
import requirementTarget from './requirementTarget/index.vue';
import FloorRunStatistics from './FloorRunStatistics.vue';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import baseStore from '@/store/baseStore';
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
const loopList = inject(loopListKey, ref(new Map()));
const hasPublicLoop = computed(() => {
    return Array.from(loopList.value.values()).filter(item => item.serviceAreaType === PUBLIC.id)?.length > 0;
});
const hasParkingLoop = computed(() => {
    return Array.from(loopList.value.values()).filter(item => item.serviceAreaType === PARKING.id)?.length > 0;
});
const TemporaryRequirementRef = inject(TemporaryRequirementRefKey);
const currentFloorObj = inject(currentFloorObjInjectKey, ref({}));
const openEquipmentList = inject(openEquipmentListKey);
const consoleType = ref(TEMPORARY_CONTROL.id);
const consoleTypeTabs = ref([TEMPORARY_CONTROL, REQUIREMENT_TARGET]);
const sceneData = inject(sceneDataKey, ref({}));
const getLoopListByFloorId = inject(getLoopListByFloorIdKey);
const instanceObj = computed(() => {
    if (currentFloorObj.value?.id) {
        let spaceIds = [];

        const spaces = [];
        const loops = getLoopListByFloorId(currentFloorObj.value.id);
        loops?.forEach(element => {
            if (element.relSpace) {
                spaces.push(...element.relSpace.map(space => space.id));
            }
        });
        spaceIds = spaces;
        return {
            instanceType: 'FLOOR',
            instanceId: currentFloorObj.value?.id,
            sceneData: sceneData.value,
            currentFloorObj: currentFloorObj.value,
            spaceIds
        };
    } else {
        return {
            instanceType: 'PROJECT',
            instanceId: baseStore().projectId
        };
    }
});
useWatchWithCleanup(
    () => currentFloorObj.value?.id,
    () => {
        if (currentFloorObj.value?.id) {
            consoleTypeTabs.value = [FLOOR_STATISTICS, TEMPORARY_CONTROL, REQUIREMENT_TARGET];
            consoleType.value = FLOOR_STATISTICS.id;
        } else {
            consoleTypeTabs.value = [TEMPORARY_CONTROL, REQUIREMENT_TARGET];
            consoleType.value = TEMPORARY_CONTROL.id;
        }
    }
);
</script>
<style lang="less" scoped>
.indoor-lighting-operating-control {
    position: relative;
    :deep(.m-tabs-list) {
        padding-top: 0;
    }
    :deep(.m-loading-mask) {
        z-index: 65 !important;
    }
    :deep(.m-tabs) {
        position: relative;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 10px;
            width: calc(100% - 20px);
            height: 1px;
            background-color: var(--gray-200);
        }
    }
    .operating-control-main {
        height: calc(100% - 37px);
        border-top: 1px solid var(--gray-200);
    }
    .equipment-list {
        position: absolute;
        top: 3px;
        right: 16px;
        z-index: 4;
    }
}
</style>
