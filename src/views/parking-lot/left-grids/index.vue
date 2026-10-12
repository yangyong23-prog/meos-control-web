<template>
    <div class="left-grids-wrapper">
        <div class="legends">
            <div class="fc">
                <div class="ft f14">{{ i18n.global.t('meos_control_web.space_business_status_colon') }}</div>
                <div v-for="(item, index) in legnds" :key="index" class="fc mr12">
                    <div class="bgc mr4" :style="{ background: item.color }"></div>
                    <div class="f14">{{ item.name }}</div>
                </div>
            </div>
        </div>
        <div class="content-container">
            <m-scrollbar v-loading="show" box-class="control-scrollbar" element-loading-lottiename="circle" style="height: 100%; overflow-y: auto">
                <gridMap
                    :key="keys"
                    :grid-list="gridList"
                    @open-floor="
                        item => {
                            emits('openFloor', item);
                        }
                    "
                />
            </m-scrollbar>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import gridMap from './gridMap.vue';
import { parkingSpaceGridStatistics, listInfoCodeConfigsByObject } from '@/apis/parkingLot';
import { GRID, SUCCESSCODE } from '@/utils/globalVariables';
import baseStore from '@/store/baseStore';
import dataDockHandling from '@/hooks/dataDockHandling';
import DockSingleton from '@/hooks/responsiveDock';
import { parkingCommonSSEClientKey } from '../constant/injectKey';
const { clearAllObjectInfo } = DockSingleton.getInstance();
const { writeDataToResponsiveDock } = dataDockHandling();

const sseClient = inject(parkingCommonSSEClientKey);
const emits = defineEmits(['openFloor']);
const legnds = ref([
    { name: i18n.global.t('meos_control_web.in_business'), color: 'rgba(0, 186, 78, 0.40)' },
    { name: i18n.global.t('meos_control_web.non_business_hours'), color: 'rgba(139, 166, 203, 0.2)' }
]);
const gridList = ref([]);
const keys = ref(new Date().getTime());
const show = ref(false);
const allSpace = ref([]);
const calendarWorkTimeData = ref([]);
onMounted(() => {
    console.log('initGridData');
    initGridData(true);
    sseClient?.addEventListener('PARKING_SPACE_GIRD_STATISTICS', gridsSseClient);
});
onBeforeUnmount(() => {
    clearAllObjectInfo();
    sseClient?.removeEventListener('PARKING_SPACE_GIRD_STATISTICS', gridsSseClient);
});
const gridsSseClient = res => {
    handleResponseData(res.data);
    writeDataToResponsiveDock(calendarWorkTimeData?.value);
};
const initGridData = () => {
    show.value = true;
    parkingSpaceGridStatistics({
        instanceId: baseStore().projectId,
        instanceType: 'PROJECT'
    })
        .then(res => {
            if (res.code === SUCCESSCODE) {
                handleResponseData(res.data);
                queryListInfoCodeConfigsByObject(allSpace.value);
            }
            show.value = false;
        })
        .catch(() => {
            show.value = false;
        });
};

// 查营业时间
const queryListInfoCodeConfigsByObject = spaceIds => {
    calendarWorkTimeData.value = [];
    listInfoCodeConfigsByObject({
        objectIds: spaceIds,
        runningMonitorType: 'PARKING',
        templateCode: GRID
    }).then(res => {
        const { result, data } = res;
        if (result === 'success' && data) {
            calendarWorkTimeData.value = data;
            writeDataToResponsiveDock(data);
        }
    });
};
const handleResponseData = data => {
    keys.value = new Date().getTime();
    if (!data || !Array.isArray(data)) {
        gridList.value = [];
        allSpace.value = [];
        return;
    }

    gridList.value = data;
    allSpace.value = data.flatMap(item => (item.floorParkingSpaceStatistics || []).flatMap(floor => (floor.spaceParkIngSpaceStatistics || []).map(space => space.spaceId)));
};
</script>

<style lang="less" scoped>
.left-grids-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;

    .legends {
        position: absolute;
        top: 20px;
        right: 4px;
        .bgc {
            width: 14px;
            height: 14px;
            border-radius: 2px;
        }
    }

    .content-container {
        width: 100%;
        height: 100%;
        padding: 58px 0 16px 16px;
        // overflow-y: auto
        // background: transparent;
    }
}
:deep(.el-loading-mask) {
    background: transparent !important;
    .el-loading-spinner .path {
        stroke: #626c78;
    }
    .el-loading-spinner .circular {
        width: 32px;
        height: 32px;
    }
}
:deep(.m-scrollbar__thumb) {
    display: none;
}
</style>
