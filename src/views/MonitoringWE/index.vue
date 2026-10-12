<template>
    <div class="monitoring-we-warp">
        <ExpansionCollapse
            ref="toggleWidthDivRef"
            :is-unpack="unpackShow"
            :is-hide-expand="isHideExpand"
        >
            <template #left>
                <MonitoringMain @selected-node="selectedNode" />
            </template>
            <template #right>
                <MonitoringAside />
            </template>
        </ExpansionCollapse>
        <!--通用详情 侧弹窗 -->
        <CommonDrawer
            v-model="showModuleInfo"
            :is-subscript-on-demand="true"
            :select-obj="selectModuleInfo"
            :running-monitor-type="'WEAK_POWER'"
            :in-floor="inFloors"
            @status-loaded="drawerObjectStatusLoaded"
            @close="closeDetailDrawer"
        >
            <DrawerPane
                :label="i18n.global.t('meos_control_web.device_ledger')"
                name="BaseInfo"
            >
                <BaseInfo :id="selectModuleInfo?.id" />
            </DrawerPane>
            <DrawerPane
                :label="i18n.global.t('meos_control_web.abnormal_event')"
                name="AbnormalList"
            >
                <AbnormalTabBox :select-obj="selectModuleInfo" />
            </DrawerPane>
            <DrawerPane
                v-if="showEquipServiceSpaceList.includes(selectModuleInfo?.classCode)"
                :label="i18n.global.t('meos_control_web.equipment_service_zone')"
                name="EquipServiceSpace"
            >
                <EquipServiceSpace :select-obj="selectModuleInfo"></EquipServiceSpace>
            </DrawerPane>
        </CommonDrawer>
        <BuildingFloorMapPopupTips
            ref="popuptipsRef"
            :pos="curHoverInfo.cardPosition"
            :query-data="curHoverInfo.popupQueryData"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
        >
            <!-- <template #default="{ params }">
                <m-button
                    v-if="params.dateilObj.showDetail"
                    style="margin-left: 8px; height: 20px; overflow: hidden; flex-shrink: 0"
                    type="link"
                    size="small"
                    @click="
                        () => {
                            onClickMoreInfo(params.dateilObj);
                        }
                    "
                    >{{ i18n.global.t('meos_control_web.details') }}</m-button
                >
            </template> -->
        </BuildingFloorMapPopupTips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import BaseInfo from './Drawer/baseInfo.vue';
import EquipServiceSpace from './Drawer/equipServiceSpace.vue'; // 设备服务空间
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import MonitoringMain from './MonitoringMain/index.vue';
import MonitoringAside from './MonitoringAside/index.vue';
import useCommonConfig from './hooks/useCommonConfig';
import useAbnormalList from './hooks/useAbnormalList';
import useDrawerCommon from './hooks/useDrawerCommon';
import { RUNNING_MONITOR_TYPE } from './constant/index';
import * as _ from 'lodash';
import useSSE from './hooks/useSSE';
import useDrawerVisible from '@/hooks/useDrawerVisible';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';

const tagsValue = ref();
const popuptipsRef = ref();
const { systemList, curSystemItem, toggleWidthDivRef, unpackShow, claasCode2objectIds, abnormalTargetObjIds, curHoverInfo, selectModuleInfo } = useCommonConfig();
const { equipmentSSEClient, setEquipmentSSEClientOption } = useSSE();
const { inFloors, showModuleInfo, showEquipServiceSpaceList, openDetailDrawer, closeDetailDrawer } = useDrawerCommon(selectModuleInfo, () => {
    // 新开弹窗要清空tagsValue
    tagsValue.value = null;
});
const drawerObjectStatusLoaded = tagsValues => {
    tagsValue.value = tagsValues;
};
const { callToggleWidth } = useAbnormalList(equipmentSSEClient, abnormalTargetObjIds, toggleWidthDivRef);

const { isHideExpand, drawerVisibleState } = useDrawerVisible();

onMounted(() => {
    const commonDrawerItem = {
        drawerId: `common-drawer`,
        visible: computed(() => showModuleInfo?.value)
    };

    drawerVisibleState.value = [commonDrawerItem];
});

watch(systemList, () => {
    if (!systemList?.length) {
        callToggleWidth(false);
    }
});
watch(curSystemItem, () => {
    callToggleWidth(curSystemItem.value);
});
watch(claasCode2objectIds, () => {
    if (_.isEmpty(claasCode2objectIds.value)) {
        equipmentSSEClient.close();
    } else {
        setEquipmentSSEClientOption(claasCode2objectIds.value, RUNNING_MONITOR_TYPE);
    }
});

const onClickMoreInfo = dataObject => {
    // console.log('onClickMoreInfo: ', dataObject, popuptipsRef.value);
    popuptipsRef.value?.hideTipsNow();
    closeDetailDrawer();
    nextTick(() => {
        selectModuleInfo.value = dataObject;
        openDetailDrawer(selectModuleInfo.value);
    });
};

const selectedNode = dataObject => {
    onClickMoreInfo(dataObject);
};
</script>

<style lang="less" scoped>
.monitoring-we-warp {
    height: 100%;
    width: 100%;
    min-width: 1280px;
    display: flex;
    justify-content: space-between;
    background: @grey-100;
    overflow: hidden;
    position: relative;
    :deep(.expansion-collapse-left) {
        overflow: hidden;
    }
}
</style>
