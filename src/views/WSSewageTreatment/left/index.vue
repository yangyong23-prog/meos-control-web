<template>
    <div class="ws-left-box h100">
        <FloorMap v-show="currentFloorObj?.id" ref="mapRef"></FloorMap>
        <template v-if="!currentFloorObj?.id">
            <div class="ws-left-box-top fs20 fw700" :class="{ scrollTop: scrollTop }">
                <div>{{ i18n.global.t('meos_control_web.wastewater_treatment') }}</div>
                <m-button v-if="cardStatistics?.length" type="default" size="small" @click="equipmentBtn">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
            </div>
            <div v-if="!loading" class="ws-left-box-bottom">
                <m-scrollbar class="no-scrollbar-bar" :always="false" @scroll="scroll">
                    <Statistics :loading-floor="loadingFloor" :card-statistics="cardStatistics" />
                    <ViewList
                        v-if="equipmentsMpa.size"
                        :equipments-mpa="equipmentsMpa"
                        :build-ids="buildIds"
                        :loading-floor="loadingFloor"
                        :abnormal-event-list="abnormalEventList"
                    />
                </m-scrollbar>
            </div>
        </template>
        <CommonDrawer
            v-model="showCommonDrawer"
            :select-obj="selectObj"
            :running-monitor-type="RUNNING_MONITOR_TYPE_SEWAGE"
            :is-subscript-on-demand="true"
            @close="closeDetailDrawer"
        >
            <DrawerPane v-if="selectObj.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.operation_monitoring')" name="runMonitor">
                <OperatingMonitoring :id="selectObj?.id" :running-monitor-type="RUNNING_MONITOR_TYPE_SEWAGE" :res="templateData" :group-codes="['runningParameter']">
                </OperatingMonitoring>
            </DrawerPane>
            <DrawerPane v-if="selectObj.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.related_info')" name="controlConsole">
                <LinkedInfo :select-obj="selectObj" :running-monitor-type="RUNNING_MONITOR_TYPE_SEWAGE" :processed-data="equipProcessedData" />
            </DrawerPane>
            <DrawerPane v-if="selectObj.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.related_info')" name="spaceControlConsole">
                <AssociatedDevicesNew
                    :select-obj="selectObj"
                    :processed-data="spaceProcessedData"
                    :running-monitor-type="RUNNING_MONITOR_TYPE_SEWAGE"
                    :show-by-group="false"
                    :res="templateData"
                    can-jump
                >
                </AssociatedDevicesNew>
            </DrawerPane>
            <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalList">
                <AbnormalTabBox :select-obj="selectObj" />
            </DrawerPane>
        </CommonDrawer>
    </div>
</template>

<script lang="js" setup>
import i18n from '@/localization';
import FloorMap from '../FloorMap/index.vue';
import Statistics from "./statistics/index.vue";
import ViewList from "./viewList/index.vue";
import { currentFloorObjInjectKey, mapRefKey } from '../constant/injectKey';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import OperatingMonitoring from '@/components/ObjectInfoComponents/OperationMonitoring/index.vue'; // 运行监控
import AssociatedDevicesNew from '@/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue'; // 关联设备
import { useObjectInfoDataByTemplateHook } from '@/hooks/useObjectInfoDataByTemplateHook';

import useDrawerCommon from '../hooks/useDrawerCommon'
import { RUNNING_MONITOR_TYPE_SEWAGE } from '../constant';
import { checkMonitorSurveillanceStatus } from '../utils/index'
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import LinkedInfo from './LinkedInfo.vue';
import { OBJ_TYPE } from '@/utils/globalVariables';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { orderBy } from 'lodash';

const emits = defineEmits(['openEquipmentList']);
const props = defineProps({
    loading: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    equipmentsMpa: Object,
    loadingFloor: Boolean,
    cardStatistics: {
        type: Array,
        default: () => []
    },
    abnormalEventList: {
        type: Array,
        default: () => []
    }
})
const { selectObj, showCommonDrawer, openDetailDrawer } = useDrawerCommon();

const { templateData, closeObjectInfoSSEClient } = useObjectInfoDataByTemplateHook(selectObj);
const closeDetailDrawer = () => {
        showCommonDrawer.value = false;
        selectObj.value = {};
        closeObjectInfoSSEClient?.();
    };
const sortEquipByFloor = equipments => {
    equipments.forEach(item => {
        const curFloorId = item.floorId ?? item?.inFloor?.id;
        if (curFloorId) {
            const floorInfo = treeBuildFloorStore().getBuildOrFloor(curFloorId);
            item.floorSequenceId = floorInfo?.floorSequenceId;
            item.floorLocalName = floorInfo?.localName || '';
        }
    });

    return orderBy(equipments, ['floorSequenceId'], 'desc');
};

const getEquipmentFn = relInfoCodeConfigs => {
    if (!relInfoCodeConfigs || !Array.isArray(relInfoCodeConfigs)) return [];

    const arr = relInfoCodeConfigs
        .map(item => {
            const groupArr = (item.dataValue || []).map(d => {
                const relArr = d?.relObjects?.map((r) => ({ ...r, floorId: r.floorId ?? r.inFloor?.id })) || [];
                return {
                    ...d,
                    floorId: d.floorId ?? d.inFloor?.id,
                    relInfo: {
                        groupName: i18n.global.t('meos_control_web.related_sewage_pump'),
                        objs: sortEquipByFloor(relArr)
                    }
                }

            });
            if (!groupArr.length) {
                return false
            }

            return [{
                groupCode: item.infoCode,
                groupName: item.aliasName,
                groupOrder: item.sequence,
                equipments: sortEquipByFloor(groupArr)
            }]

        }).filter(Boolean);
    return arr
};
const spaceProcessedData = computed(() => {
    const { relInfoCodeConfigs } = templateData?.value?.relEquipment || {};

    if (templateData?.value?.relEquipment) {
        const linkedEquips = getEquipmentFn(relInfoCodeConfigs);

        return linkedEquips.flat();
    }

    return [];
});

const equipProcessedData = computed(() => {
    const { relInfoCodeConfigs } = templateData?.value?.relEquipment || {};
    return relInfoCodeConfigs?.[0]?.dataValue || []
});

const equipmentBtn = () => {
    emits('openEquipmentList');
};

const currentFloorObj = inject(currentFloorObjInjectKey); // ==> src\views\WSSewageTreatment\hooks\useBaseData.js
const mapRef = inject(mapRefKey); // ==> src\views\WSSewageTreatment\hooks\useBaseData.js
const scrollTop = ref(0)
const scroll = (data) => {
    scrollTop.value = data.scrollTop
}
const clickObj = (data) => {

    // 点击设备详情关联设备不下转
    if (selectObj.value?.objType !== OBJ_TYPE.SPACE && data?.objType === OBJ_TYPE.EQUIPMENT) {
        // 设备关联设备直接返回
        return
    }
    mapRef?.value?.clickMapObj(data)

}
const buildIds = new Set();
// eslint-disable-next-line vue/no-setup-props-destructure
props.equipmentsMpa.forEach(item => {
    if (!checkMonitorSurveillanceStatus(item) && !item?.relEquipment?.length) {
        return;
    }
    buildIds.add(item.buildingId);

});
watch(
    () => currentFloorObj?.value?.id,
    (val) => {
        if (!val) {
            closeDetailDrawer()
        }
    },
    {
        immediate: true
    }
);
defineExpose({
		closeDetailDrawer,
        openDetailDrawer,
        selectObj
})
</script>
<style lang="less" scoped>
.ws-left-box {
    &-top {
        padding: 16px 24px 0 16px;
        padding-right: 0px;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        // &.scrollTop {
        //     background-color: #dbebfd;
        // }
    }

    &-bottom {
        // background-color: #dbebfd;
        padding: 8px 0;
        height: calc(100% - 48px);
    }
}
</style>
