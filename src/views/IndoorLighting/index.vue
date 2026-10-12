<template>
    <div class="indoor-lighting wh100">
        <Left
            :loading="loading"
            :loop-list="loopList"
            :scene-list="sceneList"
            :exception-screen-list="exceptionScreenList"
            :sun-rise-and-set-data="sunRiseAndSetData"
            :lighting-sidebar-sensor-info-v-o="lightingSidebarSensorInfoVO"
        />
        <Right :loading="isRightPanelTempControlLoading" />
        <EquipmentList
            v-if="showEquipmentList"
            v-bind="equipmentObj"
            :select-equip-id="selectObject?.id || ''"
            @back="closeEquipmentList"
            @click-equip="openDetailDrawerByEquipmentList"
            @close-equipment-info="closeDetailDrawer"
        />
    </div>
    <!--统计详情侧弹窗 -->
    <m-drawer :append-to="$drawerAppendTo" :show="staticDetailInfo" drawer-class="indoor-lighting-drawer-box" :z-index="Z_INDEX.commonDrawer" @close="closeStaticDrawer">
        <template #title>
            <div class="drawer-text">
                <p v-ellipsis class="drawer-text-item">{{ staticDetailInfo?.title ?? '' }} - {{ staticDetailInfo?.secTitle }}({{ curStaticLoopCount }})</p>
            </div>
        </template>
        <template #content>
            <LoopStatisticalDetail v-show="showDetailContent" v-bind="staticDetailInfo" @close="closeStaticDrawer" />
        </template>
    </m-drawer>
    <!--对象详情侧弹窗 -->
    <CommonDrawer
        v-model="showCommonDrawer"
        :select-obj="selectObject"
        :running-monitor-type="RUNNING_MONITOR_TYPE"
        :subscribe-type="SUBSCRIBE_TYPE"
        :is-subscript-on-demand="true"
        @close="closeDetailDrawer"
    >
        <template v-if="selectObject?.objType === OBJ_TYPE.SPACE" #tags>
            <SpaceTags :space-id="selectObject?.id" :get-status-list-by-space-id="getStatusListBySpaceId" />
        </template>
        <template v-else-if="selectObject?.type === MODULE" #rewritetags="{ statusData }">
            <div class="title-tags">
                <div class="tag-group">
                    <m-tag v-for="tag in moduleDetailTagList(statusData)" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small"
                        >{{ tag.name }}
                    </m-tag>
                </div>
            </div>
        </template>

        <!-- 回路 -->
        <DrawerPane v-if="selectObject.type === LOOP" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="controlConsole">
            <LoopOperationMonitoring :data="selectObject"></LoopOperationMonitoring>
        </DrawerPane>

        <!-- 回路-服务空间 -->
        <DrawerPane v-if="selectObject?.type === LOOP" :label="i18n.global.t('meos_control_web.related_info')" name="equipServiceSpace">
            <RelSpaceList :list="selectObject.relSpace" :select-obj="selectObject"></RelSpaceList>
        </DrawerPane>
        <!-- 空间或控制模块 -->
        <DrawerPane
            v-if="selectObject?.objType === OBJ_TYPE.SPACE || selectObject?.type === MODULE"
            :label="i18n.global.t('meos_control_web.related_info')"
            name="relLoopOrController"
        >
            <RelLoopOrController :select-obj="selectObject"></RelLoopOrController>
        </DrawerPane>

        <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalList">
            <AbnormalTabBox :detail-with-list="detailWithList" />
        </DrawerPane>
    </CommonDrawer>
    <TemporaryControlEdit
        v-model="showTemporaryControlModal"
        :running-monitor-second-type="temporaryControlModalParams?.runningMonitorSecondType"
        :running-monitor-second-type-id="temporaryControlModalParams?.runningMonitorSecondTypeId"
        :running-monitor-type="temporaryControlModalParams?.runningMonitorType"
        :edit-data="temporaryControlModalParams?.editData"
        :instance-type="temporaryControlModalParams?.instanceType"
        :instance-id="temporaryControlModalParams?.instanceId"
        @on-after-save="() => {}"
        @save-success="saveSuccess"
    ></TemporaryControlEdit>
    <m-popover virtual-triggering :content="OPEN_DETAIL_TIPS" :virtual-ref="currentHoverElForDetail" trigger="manually" :is-open="isOpenDetailPop" theme="darkTransparent">
    </m-popover>
</template>

<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import EquipmentList from '@/components/equipmentList/index.vue';
import Left from './left/index.vue';
import Right from './right/index.vue';
import { useBaseHook } from './hooks/useBaseHook';
import useDrawerCommon from './hooks/useDrawerCommon';
import useTemporaryControlModal from './hooks/useTemporaryControlModal';
import LoopStatisticalDetail from './components/LoopStatisticalDetail/index.vue';
import SpaceTags from './components/SpaceTags.vue';
import TemporaryControlEdit from './components/TemporaryControlEdit/index.vue';
import RelLoopOrController from './components/ObjDetails/RelLoopOrController.vue';
import RelSpaceList from './components/ObjDetails/RelSpaceList.vue';
import LoopOperationMonitoring from './components/ObjDetails/LoopOperationMonitoring.vue';
import { RUNNING_MONITOR_TYPE, MODULE, LOOP, SUBSCRIBE_TYPE, OPEN_DETAIL_TIPS } from './variables';
import { OBJ_TYPE } from '@/utils/globalVariables';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import DockSingleton from '@/hooks/responsiveDock';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import useEquipmentLIst from './hooks/useEquipmentList';
import useModuleTags from './hooks/useModuleTags';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import useDetailTips from './hooks/useDetailTips';
const { getAbnormalEventsList } = DockSingleton.getInstance();
const {
    sceneList,
    exceptionScreenList,
    loading,
    isRightPanelTempControlLoading,
    sunRiseAndSetData,
    lightingSidebarSensorInfoVO,
    curStaticLoopCount,
    loopList,
    TemporaryRequirementRef,
    getStatusListBySpaceId,
    getAbnormalIdsByModuleId,
    getAbnormalIdsBySpaceId
} = useBaseHook();
const { selectObject, showCommonDrawer, staticDetailInfo, closeDetailDrawer, openDetailDrawerByEquipmentList, closeStaticDrawer } = useDrawerCommon();

// 延迟渲染：抽屉先打开，nextTick 后再渲染 LoopStatisticalDetail，避免单帧内同步创建 100+ 组件实例造成的 100ms+ 阻塞
const showDetailContent = ref(false);
watch(staticDetailInfo, val => {
    if (val) {
        nextTick(() => {
            showDetailContent.value = true;
        });
    } else {
        showDetailContent.value = false;
    }
});
const { temporaryControlModalParams, showTemporaryControlModal } = useTemporaryControlModal();
const { equipmentObj, showEquipmentList, closeEquipmentList } = useEquipmentLIst();

const { getModuleTagList } = useModuleTags(getAbnormalIdsByModuleId);
const saveSuccess = () => {
    TemporaryRequirementRef.value?.changeHandleData();
};
// 控制模块详情标签数据
const moduleDetailTagList = statusData => {
    if (selectObject?.value?.id && statusData) {
        return getModuleTagList(
            selectObject?.value.id,
            statusData.relInfoCodeConfigs?.map(info => info.infoCode)
        );
    }
    return [];
};
// 详情异常事件列表tabs
const detailAbnormalList = computed(() => {
    if (selectObject?.value?.id) {
        if (selectObject?.value.type === MODULE) {
            const targetids = getAbnormalIdsByModuleId(selectObject.value.id);
            return getAbnormalEventsList(targetids);
        } else if (selectObject?.value.objType === OBJ_TYPE.SPACE) {
            const spaceAbnormalIds = getAbnormalIdsBySpaceId(selectObject?.value.id);
            return getAbnormalEventsList(spaceAbnormalIds || []);
        } else {
            return getAbnormalEventsList([selectObject.value.id]);
        }
    }
    return [];
});
const detailWithList = computed(() => {
    return { abnormalEventList: detailAbnormalList.value };
});
useWatchWithCleanup(
    () => showEquipmentList.value,
    () => {
        closeDetailDrawer();
        closeStaticDrawer();
    }
);
const { currentHoverElForDetail, isOpenDetailPop } = useDetailTips();
</script>
<style lang="less">
@media screen and (min-width: 1600px) {
    .indoor-lighting-drawer-box {
        .m-drawer-container {
            width: 480px !important;
        }
    }
    .drawer-text {
        max-width: 408px;
    }
}

@media screen and (max-width: 1600px) {
    .indoor-lighting-drawer-box {
        .m-drawer-container {
            width: 400px !important;
        }
    }
    .drawer-text {
        max-width: 328px;
    }
}
.indoor-lighting-drawer-box {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
        .m-button + .m-button {
            margin-left: 0;
        }
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
    .m-drawer-container-header {
        height: auto;
    }

    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
        height: 100%;
    }
}
.indoor-lighting {
    background: url('@/assets/imgs/page_bg.png');
    background-color: rgb(235 246 255);
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    &-left {
        width: calc(100% - 480px);
    }
    &-right {
        width: 480px;
    }
}
@media screen and (max-width: 1600px) {
    .indoor-lighting-right {
        width: 400px;
    }
    .indoor-lighting-left {
        width: calc(100% - 400px);
    }
}
</style>
<style lang="less" scoped>
.title-tags {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    overflow: hidden;
    .tag-group {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        .info-tag {
            font-weight: var(--platform-font-weight) !important;
            margin-left: 0px !important;
        }
    }
}
</style>
