<template>
    <div class="parking-statistics">
        <m-scrollbar box-class="control-scrollbar">
            <div v-if="showCarTotal || Object.keys(projectParkingStatisticsObj).length !== 0">
                <div class="title-item f16 fb7 mt28 mb12">{{ i18n.global.t('meos_control_web.project_parking_statistics') }}</div>
                <projectParkingStatistics :project-parking-statistics-obj="projectParkingStatisticsObj" :show-car-total="showCarTotal" is-project-view />
            </div>
            <div v-if="equipmentStatisticsArr?.length">
                <div class="title-item f16 fb7 mt28 mb12">{{ i18n.global.t('meos_control_web.device_statistics') }}</div>
                <equipmentStatistics :equipment-statistics-arr="equipmentStatisticsArr" />
            </div>
        </m-scrollbar>
        <svg v-show="show" class="mark-icon" aria-hidden="true">
            <use :xlink:href="'#icon-placeholderSvg'" />
        </svg>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import projectParkingStatistics from '../components/projectParkingStatistics.vue';
import equipmentStatistics from '../components/equipmentStatistics.vue';
import { parkingSpaceStatistics, parkingEquipmentStatistics } from '@/apis/parkingLot';
import { MLoading } from 'meri-plus';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { parkingCommonSSEClientKey } from '../constant/injectKey';
import baseStore from '@/store/baseStore';
const sseClient = inject(parkingCommonSSEClientKey);
const show = ref(true);
const showCarTotal = ref(false);
const projectParkingStatisticsObj = ref({
    CAR_TOTAL: 500,
    PARKING_SPACE: 1234,
    VACANT_PARKING_SPACE: 123,
    CHARGING_PARKING_SPACE: 123,
    VACANT_CHARGING_PARKING_SPACE: 123,
    FAST_CHARGING_PARKING_SPACE: 123,
    VACANT_FAST_CHARGING_PARKING_SPACE: 123
});
const equipmentStatisticsArr = ref([]);
onMounted(() => {
    getHeight();
    initData(true);
    window.addEventListener('resize', getHeight);
    sseClient?.addEventListener('PARKING_STATISTICS', parkingSpaceStatisticsFuc);
    sseClient?.addEventListener('PARKING_EQUIP_STATISTICS', equipmentStatisticsFuc);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', getHeight);
    sseClient?.removeEventListener('PARKING_STATISTICS', parkingSpaceStatisticsFuc);
    sseClient?.removeEventListener('PARKING_EQUIP_STATISTICS', equipmentStatisticsFuc);
});
const parkingSpaceStatisticsFuc = res => {
    projectParkingStatisticsObj.value = res.data;
};
const equipmentStatisticsFuc = res => {
    equipmentStatisticsArr.value = res.data;
};
const getHeight = () => {
    const height = window.innerHeight;
    show.value = height >= 900 ? true : false;
};

const initData = loading => {
    let Mloading = null;
    if (loading) {
        Mloading = MLoading.service({
            target: '.parking-statistics',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
        const promises = [
            parkingSpaceStatistics({
                instanceId: baseStore().projectId,
                instanceType: 'PROJECT'
            }),
            parkingEquipmentStatistics({
                instanceId: baseStore().projectId,
                instanceType: 'PROJECT'
            })
        ];
        Promise.all(promises)
            .then(res => {
                if (res[0].code === SUCCESSCODE) {
                    showCarTotal.value = res[0].data.CAR_TOTAL !== undefined;
                    projectParkingStatisticsObj.value = res[0].data;
                }
                if (res[1].code === SUCCESSCODE) {
                    equipmentStatisticsArr.value = res[1].data;
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
.parking-statistics {
    height: 100%;
    position: relative;
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
        top: 5px;
        content: '';
    }
}
@media (max-width: 1600px) {
    .mark-icon {
        width: 302px;
        height: 193px;
    }
}
@media (min-width: 1600px) {
    .mark-icon {
        width: 373px;
        height: 239px;
    }
}
.mark-icon {
    position: absolute;
    bottom: 0px;
    right: 57px;
}
:deep(.control-scrollbar) {
    padding: 0 16px 0px 16px;
}
</style>
