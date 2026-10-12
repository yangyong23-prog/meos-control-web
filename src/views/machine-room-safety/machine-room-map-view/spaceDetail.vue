<template>
    <div class="space-detail">
        <div v-show="allSpaceInfoWithEquipsLoading" class="inner-space-loading">
            <m-list-skeleton />
        </div>
        <CommonDrawer
            v-show="!allSpaceInfoWithEquipsLoading"
            v-model="showModuleInfo"
            :use-drawer="false"
            :select-obj="selectModuleInfo"
            :running-monitor-type="runningMonitorType"
            :is-subscript-on-demand="true"
        >
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalEvent">
                <AbnormalTabBox :select-obj="selectModuleInfo" :detail-with-list="spaceAbnormalDetailWithList"></AbnormalTabBox>
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.status_unknown_risk')" name="unknownRiskList">
                <UnknownRiskListDrawer :is-loading="false" :loading-danger-events="allSpaceInfoWithEquipsLoading" :risk-list="spaceUnknownRiskList" />
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.risk_management_scope')" name="riskScope">
                <SpaceRiskManagementScope
                    :is-loading="false"
                    :loading-danger-events="allSpaceInfoWithEquipsLoading"
                    :risk-list="spaceRiskList"
                    :space-risk-list-with-name="spaceRiskListWithName"
                />
            </DrawerPane>
        </CommonDrawer>
    </div>
    <MonitorPlayer v-if="showPlayer" :select-obj="currentPlayingObj" :type="'computer'" @close="closeMonitorPlayer"></MonitorPlayer>
</template>
<script setup>
import { spaceShowModuleInfoInjectKey, spaceSelectModuleInfoInjectKey, runningMonitorTypeInjectKey, riskAbnormalLoadingInjectKey } from '../constant/injectKey';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import SpaceOperatingStatus from '../components/spaceOperatingStatus.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import i18n from '@/localization';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import UnknownRiskListDrawer from '../components/UnknownRiskListDrawer.vue';
import SpaceRiskManagementScope from '../components/SpaceRiskManagementScope.vue';
import { RISK_EVENT_STATUS_MAP } from '../variable';
import { getRiskListNameViewByInstanceKey, getRiskListByInstanceKey, spaceAbnormalDetailWithListKey } from '../hooks/useSpace3DView';
import { OBJ_TYPE } from '@/utils/globalVariables';
// import { getRiskListNameViewByInstanceKey, getRiskListByInstanceKey, spaceAbnormalDetailWithListKey } from '../hooks/useSpace3DView';

const showModuleInfo = inject(spaceShowModuleInfoInjectKey);
const selectModuleInfo = inject(spaceSelectModuleInfoInjectKey);
const runningMonitorType = inject(runningMonitorTypeInjectKey);
const getRiskListByInstance = inject(getRiskListByInstanceKey);
const getRiskListNameViewByInstance = inject(getRiskListNameViewByInstanceKey);
const allSpaceInfoWithEquipsLoading = inject(riskAbnormalLoadingInjectKey);
const spaceAbnormalDetailWithList = inject(spaceAbnormalDetailWithListKey);
const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(selectModuleInfo, showModuleInfo);

const spaceUnknownRiskList = computed(() => {
    const isSpace = selectModuleInfo?.value?.objType === OBJ_TYPE.SPACE;
    if (!isSpace) {
        return [];
    }
    const tempList = getRiskListByInstance({ spaceId: selectModuleInfo?.value?.id, filterStatusId: RISK_EVENT_STATUS_MAP.UNKNOWN });
    return tempList;
});

const spaceRiskList = computed(() => {
    const isSpace = selectModuleInfo?.value?.objType === OBJ_TYPE.SPACE;
    if (!isSpace) {
        return [];
    }
    const tempList = getRiskListByInstance({ spaceId: selectModuleInfo?.value?.id });
    return tempList;
});
const spaceRiskListWithName = computed(() => {
    const isSpace = selectModuleInfo?.value?.objType === OBJ_TYPE.SPACE;
    if (!isSpace) {
        return [];
    }
    const tempList = getRiskListNameViewByInstance({ spaceId: selectModuleInfo?.value?.id });
    return tempList;
});
</script>
<style lang="less" scoped>
.space-detail {
    min-width: 384px;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
}
.inner-space-loading {
    width: 100%;
    height: 100%;
    padding: 24px;
}
</style>
