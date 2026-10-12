<template>
    <div class="machine-room-map-view-container">
        <div class="left">
            <div class="header">
                <div class="header-left">
                    <div class="header-icon" @click="backFromSpace3DView"><IconMeriComponentChevronLeft :size="20" :color="'#fff'" /></div>
                    <span v-ellipsis class="m-ellipsis name">{{ spaceName || '--' }}</span>
                </div>
                <div class="header-right-container">
                    <MapSearch
                        v-if="allEquips.length || !allSpaceInfoWithEquipsLoading"
                        :equips="validEqips"
                        :loading="allSpaceInfoWithEquipsLoading"
                        :only-type="searchType"
                        @choose="chooseObj"
                        @hover-obj="hoverObj"
                        @unhover-obj="unhoverObj"
                    ></MapSearch>
                    <div class="filter-item-wrap">
                        <m-checkbox v-model="spaceOnlyActMagRiskModel">{{ i18n.global.t('meos_control_web.risk_only_act_managed') }}</m-checkbox>
                    </div>
                    <m-tree-select
                        ref="treeSelect"
                        v-model="selEquipIds"
                        :prefix="`${i18n.global.t('meos_control_web.equipment')}：`"
                        :max-scroll-height="538"
                        :data="equipClassOption"
                        :size="160"
                        multiple
                        searchable
                        panel-searchable
                        has-check-all
                        has-confirm
                        :tips-tag-handle-name="tipsTagHandleName"
                        :popover-attrs="{ popoverClass: 'testClass' }"
                    >
                    </m-tree-select>
                    <div class="filter-item-wrap">
                        <m-switch v-model="switchIotHideModel" size="small"></m-switch>
                        <div>{{ i18n.global.t('meos_control_web.iot_infomation') }}</div>
                    </div>
                    <div class="header-right" @click="changeTableView">
                        <span v-ellipsis>{{ i18n.global.t('meos_control_web.operation_equipment_parameter') }}</span>
                    </div>
                </div>
            </div>
            <SpaceMap ref="spaceMapRef"></SpaceMap>
            <MachineRoomTable
                v-if="isTableView"
                :list-template-types="listTemplateTypes"
                :all-equips="allEquips"
                :class="{ 'is-open': isTableView }"
                @change-table-view="changeTableView"
            />
        </div>

        <div class="right">
            <spaceDetail />
        </div>
    </div>
    <CommonDrawer
        v-model="showModuleInfo"
        :use-new-api="true"
        :select-obj="selectModuleInfo"
        :running-monitor-type="runningMonitorType"
        :is-subscript-on-demand="true"
        @status-loaded="drawerObjectStatusLoaded"
        @close="closeDetailDrawer"
    >
        <template v-if="CAMERA_CLASS_CODES.includes(selectModuleInfo?.classCode)" #extra-icon="{}">
            <m-tips :content="i18n.global.t('meos_control_web.view_surveillance_video')" theme="darkTransparent" placement="left">
                <div class="monitor" @click="openMonitorPlayer(selectModuleInfo)">
                    <MointorPlainIcon />
                </div>
            </m-tips>
        </template>

        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="ControlConsole3">
            <ControlConsole
                :select-obj="selectModuleInfo"
                :use-new-api="true"
                :hide-abnormal-list="true"
                :hide-inspection="true"
                :running-monitor-type="runningMonitorType"
                :current-playing-obj="currentPlayingObj"
                @open-monitor-player="openMonitorPlayer"
            />
        </DrawerPane>
        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.abnormal_event')" name="ControlConsole4">
            <AbnormalTabBox :select-obj="selectModuleInfo"></AbnormalTabBox>
        </DrawerPane>
        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.status_unknown_risk')" name="ControlConsole5">
            <UnknownRiskListDrawer :is-loading="false" :loading-danger-events="riskAbnormalLoading" :risk-list="equipUnknownRiskList" />
        </DrawerPane>
    </CommonDrawer>
    <MonitorPlayer v-if="showPlayer" :select-obj="currentPlayingObj" :type="'computer'" @close="closeMonitorPlayer"></MonitorPlayer>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import MointorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import { curSpace3DViewDataInjectKey } from '../constant/injectKey';
import EquipOperatingStatus from './equipOperatingStatus.vue';
import SpaceMap from '../space-map/index.vue';
import spaceDetail from './spaceDetail.vue';
import MachineRoomTable from '../MachineRoomTable/index.vue';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import { CAMERA_CLASS_CODES } from '@/constants/camera';
import useSpace3DView from '../hooks/useSpace3DView';
import { OBJ_TYPE } from '@/utils/globalVariables';
import useDrawerCommon from '../hooks/useDrawerCommon';
import useSpaceInfo from '../hooks/useSpaceInfo';
import rewriteResponsiveDock from '../hooks/rewriteResponsiveDock';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import { isPipe, isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';
import DockSingleton from '@/hooks/responsiveDock';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import UnknownRiskListDrawer from '../components/UnknownRiskListDrawer.vue';
import { RISK_EVENT_STATUS_MAP } from '../variable';

const { clearAllObjectInfo } = DockSingleton.getInstance();

const searchType = ref('equipment');
const spaceMapRef = ref();
const toggleWidthDivRef = ref(null);

const unpackShow = ref(true);
const callToggleWidth = val => {
    if (toggleWidthDivRef.value) {
        toggleWidthDivRef.value.toggleWidth(val);
    }
};
const { backFromSpace3DView, spaceShowModuleInfo, spaceSelectModuleInfo, listTemplateTypes } = useSpaceInfo(true);

const {
    allEquips,
    allSpaceInfo,
    allSpaceInfoWithEquipsLoading,
    riskAbnormalLoading,
    switchIotHideModel,
    spaceOnlyActMagRiskModel,
    equipClassOption,
    selEquipIds,
    getRiskListByInstance,
    runningMonitorType
} = useSpace3DView({
    spaceShowModuleInfo,
    spaceSelectModuleInfo
});
const { selectModuleInfo, showModuleInfo, closeDetailDrawer } = useDrawerCommon();
const validEqips = computed(() => {
    const needFilterEquip = selEquipIds.value?.length > 0;
    const filterIdMap = {};
    if (needFilterEquip) {
        selEquipIds.value.forEach(id => {
            filterIdMap[id] = true;
        });
    }
    return allEquips.value.filter(equip => {
        const inFilterSels = !needFilterEquip || filterIdMap[equip.id];
        return inFilterSels && !isPipe(equip.classCode) && !isMachineRoomCF(equip.classCode);
    });
});

const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(selectModuleInfo, showModuleInfo);
const curSpace3DViewData = inject(curSpace3DViewDataInjectKey);
const isTableView = ref(false);

const spaceName = computed(() => {
    return curSpace3DViewData?.value?.localName || allSpaceInfo?.value?.localName;
});

const equipUnknownRiskList = computed(() => {
    const isEquip = selectModuleInfo?.value?.objType === OBJ_TYPE.EQUIPMENT;
    if (!isEquip) {
        return [];
    }
    const tempList = getRiskListByInstance({ equipId: selectModuleInfo?.value?.id, filterStatusId: RISK_EVENT_STATUS_MAP.UNKNOWN });
    return tempList;
});

const changeTableView = () => {
    isTableView.value = !isTableView.value;
};
const tagsValue = ref();
const drawerObjectStatusLoaded = tagsValues => {
    tagsValue.value = tagsValues;
    if (selectModuleInfo.value?.classCode && CAMERA_CLASS_CODES.includes(selectModuleInfo.value?.classCode)) {
        openMonitorPlayer(selectModuleInfo.value);
    }
};
const chooseObj = (obj, type) => {
    tagsValue.value = null;
    spaceMapRef.value?.clickMapObj(obj);
};
const hoverObj = obj => {
    spaceMapRef.value?.hoverMapObj(obj);
};
const unhoverObj = () => {
    spaceMapRef.value?.unhoverMapObj();
};
onBeforeUnmount(() => {
    clearAllObjectInfo();
});
</script>

<style lang="less" scoped>
.machine-room-map-view-container {
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 1280px;
    background: #51545b;
    .left {
        flex: 1;
        position: relative;
    }
    .right {
        min-width: 384px;
        margin: 16px;
        margin-left: 0px;
        background: #51545b;
        position: relative;
    }
}

.header {
    position: absolute;
    top: 16px;
    left: 0px;
    width: 100%;
    z-index: 99;
    padding-inline: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
        flex: 1;
        display: flex;
        align-items: center;
        column-gap: 4px;
        overflow: hidden;

        color: #fff;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;

        .header-icon {
            display: flex;
            align-items: center;
            width: 24px;
            height: 24px;
            cursor: pointer;
        }
        .name {
            flex: 1;
        }
    }

    .header-right-container {
        width: fit-content;
        display: flex;
        align-items: center;
        column-gap: 8px;
    }
    .filter-item-wrap {
        display: flex;
        height: 32px;

        align-items: center;
        gap: 4px;

        padding: 5px 12px;

        border-radius: 4px;
        background: var(--Grey-Grey-0, #fff);

        /* Shadow/shadow-1 */
        box-shadow: 0 2px 10px 0 rgba(27, 33, 41, 0.1);
        max-width: 160px;
        :deep(.m-checkbox) {
            width: 100%;
            .checkbox {
                flex: 0 0 auto;
                display: flex;
            }
            .m-checkbox-label {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .header-right {
        border-radius: 4px;
        background: #fff;
        box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        width: fit-content;
        height: 32px;
        padding: 5px 12px;
        width: 160px;

        span {
            width: 100%;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
.monitor {
    margin-right: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 4px;
    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
    }
    :deep(svg) {
        width: 18px;
        height: 18px;
    }
}
@media (max-width: 1600px) {
    .left {
        max-width: calc(100% - 400px);
    }
    .right {
        width: 384px;
    }
}
@media (min-width: 1600px) {
    .left {
        max-width: calc(100% - 480px);
    }
    .right {
        width: 464px;
    }
}
</style>
