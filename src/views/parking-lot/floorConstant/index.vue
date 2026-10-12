<template>
    <div class="floor-parking-statistics">
        <m-scrollbar box-class="control-scrollbar">
            <div v-if="Object.keys(floorParkingStatisticsObj).length !== 0">
                <div class="title-item f16 fb7 mt28 mb12">{{ i18n.global.t('meos_control_web.floor_parking_statistics') }}</div>
                <projectParkingStatistics :project-parking-statistics-obj="floorParkingStatisticsObj" />
            </div>
            <div v-if="parkingSpace?.length && parkingSpace.find(item => item.count > 0)">
                <div class="title-item f16 fb7 mt28 mb12">{{ i18n.global.t('meos_control_web.parking_space_statistics') }}</div>
                <FoldWrap v-model="parkingSpaceEventList" :data="parkingSpace" :btn-distance-y="'4'">
                    <SpaceParkingStatistics :parking-space="parkingSpaceEventList" />
                </FoldWrap>
            </div>
            <div v-if="equipmentStatisticsArr?.length">
                <div class="title-item f16 fb7 mt28 mb12">{{ i18n.global.t('meos_control_web.device_statistics') }}</div>
                <equipmentStatistics :equipment-statistics-arr="equipmentStatisticsArr" />
            </div>
        </m-scrollbar>
    </div>
</template>
<script setup>
import equipmentStatistics from '../components/equipmentStatistics.vue';
import SpaceParkingStatistics from '../components/SpaceParkingStatistics.vue';
import FoldWrap from '@/components/common/FoldWrap.vue';
import { parkingSpaceStatistics, parkingEquipmentStatistics, floorParkingSpaceStatistics } from '@/apis/parkingLot';
import { MLoading } from 'meri-plus';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { currentFloorObjInjectKey, parkingCommonSSEClientKey } from '../constant/injectKey';
import { displayValue } from '@/utils/viewUtils';
import projectParkingStatistics from '../components/projectParkingStatistics.vue';
import i18n from '@/localization';

const sseClient = inject(parkingCommonSSEClientKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const floorParkingStatisticsObj = ref({});
const parkingSpace = ref([]);
const equipmentStatisticsArr = ref([]);
const parkingSpaceEventList = ref([]);

onMounted(() => {
    initFloorData(true);
    sseClient?.addEventListener('PARKING_STATISTICS', floorStallStatisticsFuc);
    sseClient?.addEventListener('FLOOR_PARKING_SPACE_STATISTICS', parkingSpaceFloorStatisticsFuc);
    sseClient?.addEventListener('PARKING_EQUIP_STATISTICS', floorEquipmentStatisticsFuc);
});
onBeforeUnmount(() => {
    sseClient?.removeEventListener('PARKING_STATISTICS', floorStallStatisticsFuc);
    sseClient?.removeEventListener('FLOOR_PARKING_SPACE_STATISTICS', parkingSpaceFloorStatisticsFuc);
    sseClient?.removeEventListener('PARKING_EQUIP_STATISTICS', floorEquipmentStatisticsFuc);
});
const floorStallStatisticsFuc = res => {
    floorParkingStatisticsObj.value = res.data;
};
const parkingSpaceFloorStatisticsFuc = res => {
    parkingSpace.value = res.data.filter(item => item.count !== 0);
};
const floorEquipmentStatisticsFuc = res => {
    equipmentStatisticsArr.value = res.data;
};
watch(
    () => currentFloorObj?.value?.floorId,
    () => {
        initFloorData(true);
    }
);
const initFloorData = loading => {
    let Mloading = null;
    if (loading) {
        Mloading = MLoading.service({
            target: '.floor-parking-statistics',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
        const obj = {
            instanceId: currentFloorObj?.value?.floorId,
            instanceType: 'FLOOR'
        };
        const promises = [parkingSpaceStatistics(obj), floorParkingSpaceStatistics(obj), parkingEquipmentStatistics(obj)];
        Promise.all(promises)
            .then(res => {
                if (res[0].code === SUCCESSCODE) {
                    floorParkingStatisticsObj.value = res[0].data;
                }
                if (res[1].code === SUCCESSCODE) {
                    parkingSpace.value = res[1].data.filter(item => item.count !== 0);
                }
                if (res[2].code === SUCCESSCODE) {
                    equipmentStatisticsArr.value = res[2].data;
                }
                Mloading?.destroy();
            })
            .catch(() => {
                Mloading?.destroy();
            });
    }
};
</script>
<style lang="less" scoped>
.floor-parking-statistics {
    height: 100%;
    position: relative;
    .floor-parking-item {
        border-radius: 4px;
        background: #f4f8ff;
        padding: 24px 16px;
    }
}
.title-item {
    position: relative;
    margin-left: 10px;

    &::before {
        position: absolute;
        width: 3px;
        height: 14px;
        background: #246fe5;
        left: -10px;
        top: 4px;
        content: '';
    }
}
:deep(.control-scrollbar) {
    padding: 0 16px 0px 16px;
}
</style>
