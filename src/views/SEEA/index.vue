<template>
    <div class="SEEA system-wrap wh100">
        <ExpansionCollapseNew v-model="showExpansionCollapseNew" :hide-icon="true" :style="{ backgroundColor: curSceneBgColor }">
            <template #left>
                <Left />
            </template>
            <template #right>
                <Right />
            </template>
        </ExpansionCollapseNew>
        <CommonDrawer
            v-model="showCommonDrawer"
            :select-obj="selectObject"
            :subscribe-type="SUBSCRIBE_TYPE"
            :is-subscript-on-demand="true"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            :z-index="Z_INDEX.priorityDrawer"
            @close="onCloseDetailDrawer"
        >
            <DrawerPane v-if="hasOperationMonitoring" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="controlConsole">
                <OperatingMonitoring
                    :id="selectObject?.id"
                    :running-monitor-type="RUNNING_MONITOR_TYPE"
                    :res="templateData"
                    :group-codes="['controlledParameterSet', 'runningParameter', 'techniqueParameter']"
                ></OperatingMonitoring>
            </DrawerPane>

            <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalList">
                <AbnormalTabBox :select-obj="selectObject"></AbnormalTabBox>
            </DrawerPane>
        </CommonDrawer>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import { Z_INDEX } from '@/constants/zIndex';
import OperatingMonitoring from '@/components/ObjectInfoComponents/OperationMonitoring/index.vue'; // 运行监控
import BaseInfo from '@/views/Common/EquipDetails/BaseInfo/index.vue'; // 基础信息
import { RUNNING_MONITOR_TYPE, FIXED_INFOCODE, SUBSCRIBE_TYPE, OP_MONITOR_CLASSCODES } from './constants/index';
import ExpansionCollapseNew from '@/components/expansionCollapseAssemblyNew/index.vue';
import Left from './left/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import Right from './right/index.vue';
import useBaseHook from './hooks/useBaseHook';
import emitter from '@/utils/bus';
import { useObjectInfoDataByTemplateHook } from '@/hooks/useObjectInfoDataByTemplateHook';

const { selectObject, closeDetailDrawer, hideIcon, showCommonDrawer, curSceneBgColor, showExpansionCollapseNew, showElecAnalysis } = useBaseHook();
const { getAbnormalEventsList } = DockSingleton.getInstance();
const { templateData, closeObjectInfoSSEClient } = useObjectInfoDataByTemplateHook(selectObject);
const hasOperationMonitoring = computed(() => {
    if (selectObject?.value?.classCode) {
        return OP_MONITOR_CLASSCODES.includes(selectObject.value.classCode);
    }
    return false;
});
const onCloseDetailDrawer = () => {
    closeDetailDrawer();
    // 取消系统图选中状态
    emitter.emit('monitorCloseEquipmentiInfo');
    closeObjectInfoSSEClient();
};
</script>
<style lang="less">
.detail-commondrawer-abnormal-list-warp {
    padding: 16px 0 0 16px;
}
</style>
<style lang="less" scoped>
.SEEA {
    overflow-x: hidden;
    background: url('@/assets/imgs/page_bg.png');
    background-color: #d6dde5;
    background-size: cover;
    background-repeat: no-repeat;
    .SEEA-right {
        background-color: #fff;
        border-radius: 8px;
    }
}
</style>
