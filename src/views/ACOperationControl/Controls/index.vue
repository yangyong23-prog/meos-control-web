<template>
    <div ref="controlContainer" class="control-container">
        <template v-if="!isFromDashboard">
            <div class="tab-top">
                <div class="tab-box">
                    <m-tabs v-model="curTab" :data="tabItems" size="large" :style="{ width: 'calc(100% - 80px)' }" @change="tabsChange"></m-tabs>
                    <m-button v-if="!isEquipListEmpty" size="small" @click="equipmentBtn">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
                </div>
            </div>
            <div class="tab-bottom">
                <div v-show="curTab === 'DataStatistics'" class="tab-data-statistics-container">
                    <m-scrollbar ref="scrollbarRef" class="container" :height="'100%'" @scroll="scroll">
                        <DataStatistics />
                    </m-scrollbar>
                </div>
                <component
                    :is="currentComponent"
                    v-if="curTab !== 'DataStatistics' && currentComponent"
                    :cur-floor-id="currentFloorObj?.id || ''"
                    class="container"
                    :height="'100%'"
                ></component>
                <div v-if="curTab === 'TemporaryRequirement'" class="h100" style="padding: 0 16px">
                    <TemporaryRequirement
                        ref="TemporaryRequirementRef"
                        :types="[{ id: AIR_TERMINAL, name: i18n.global.t('meos_control_web.temporary_requirement'), code: RUNNING_MONITOR_TYPE }]"
                        :list-obj="TemporaryRequirementListObj"
                        :add-obj="TemporaryRequirementAddObj"
                        :collapse-text="i18n.global.t('meos_control_web.collapse_air_conditioning_requirement_configuration')"
                        :expand-text="i18n.global.t('meos_control_web.expand_air_conditioning_requirement_configuration')"
                        @open-scheduled-task="openScheduledTask"
                    >
                        <template #content="{ task }">
                            <TaskConfig :task="task" />
                        </template>
                    </TemporaryRequirement>
                </div>
                <BatchControl v-if="curTab === 'BatchControl'" :batch-list="batchList" :loading-batch-list="loadingBatchList" :floor-id="currentFloorObj?.id" />
            </div>
        </template>
        <template v-else>
            <div class="target-header">
                <m-tabs v-model="on" :data="dashboardTabList" size="large" />
            </div>
            <div class="tab-bottom">
                <RequirementTarget v-show="on === 'RequirementTarget'" key="dashboard" />
                <div v-if="on === 'TemporaryRequirement'" class="h100" style="padding: 0 16px">
                    <TemporaryRequirement
                        ref="TemporaryRequirementRef"
                        :types="[{ id: AIR_TERMINAL, name: i18n.global.t('meos_control_web.temporary_requirement'), code: RUNNING_MONITOR_TYPE }]"
                        :list-obj="TemporaryRequirementListObj"
                        :add-obj="TemporaryRequirementAddObj"
                        :collapse-text="i18n.global.t('meos_control_web.collapse_air_conditioning_requirement_configuration')"
                        :expand-text="i18n.global.t('meos_control_web.expand_air_conditioning_requirement_configuration')"
                        @open-scheduled-task="openScheduledTask"
                    >
                        <template #content="{ task }">
                            <TaskConfig :task="task" />
                        </template>
                    </TemporaryRequirement>
                </div>
                <BatchControl v-if="on === 'BatchControl'" :batch-list="batchList" :loading-batch-list="loadingBatchList" :floor-id="currentFloorObj?.id" />
            </div>
        </template>
        <ScheduledTask v-model="showScheduledTask" v-bind="ScheduledTaskProps" @save-success="saveSuccess" />
    </div>
</template>
<script setup>
import { AIR_TERMINAL } from '@/utils/globalVariables';
import DataStatistics from './DataStatistics/index.vue';
import RequirementTarget from './RequirementTarget/index.vue';
import useControlsInfo from '../hooks/useControlsInfo';
import { isEdge } from '@/utils/envUtils';
import TemporaryRequirement from '@/views/Common/TemporaryRequirement/index.vue';
import { spacesAndEquipsStaticDataKey, currentFloorObjKey, headerModelViewKey } from '../injectKeys';
import i18n from '@/localization';
import ScheduledTask from './ScheduledTask/index.vue';
import { useBatchHook } from '../hooks/useBatchHook';
import BatchControl from './BatchControl/index.vue';
import TaskConfig from '../components/TaskConfig.vue';
import { RUNNING_MONITOR_TYPE } from '../variables';
import { isEquipListEmptyKey } from '../hooks/useACGlobalData';

useControlsInfo();
const showScheduledTask = ref(false);
const ScheduledTaskProps = ref({});
const openScheduledTask = data => {
    ScheduledTaskProps.value = data;
    showScheduledTask.value = true;
};
const TemporaryRequirementRef = ref(null);
const on = ref('RequirementTarget');
const headerModelView = inject(headerModelViewKey);
const currentFloorObj = inject(currentFloorObjKey);
const isEquipListEmpty = inject(isEquipListEmptyKey);

const spacesAndEquipsStaticData = inject(spacesAndEquipsStaticDataKey);
const allSpaces = computed(() => spacesAndEquipsStaticData.value?.spaces || []);

const isFromDashboard = computed(() => {
    return headerModelView?.value === 'list' && !currentFloorObj?.value?.id;
});
const getSpaceIdsByFloorId = computed(() => {
    if (currentFloorObj?.value?.id) {
        const spaceIds = allSpaces.value.filter(item => item.floorId === currentFloorObj.value.id).map(item => item.id);
        return spaceIds;
    }
    return allSpaces.value.map(item => item.id);
});
const TemporaryRequirementListObj = computed(() => {
    if (currentFloorObj?.value?.id) {
        return { instanceIds: getSpaceIdsByFloorId.value, instanceType: 'SPACE' };
    }
    return { instanceIds: [] };
});
const TemporaryRequirementAddObj = computed(() => {
    return {
        instanceId: currentFloorObj.value?.id,
        instanceType: currentFloorObj.value?.id ? 'FLOOR' : undefined
    };
});
const saveSuccess = () => {
    TemporaryRequirementRef.value?.changeHandleData();
};
const emits = defineEmits(['openEquipmentList']);
const curTab = ref('DataStatistics');
const scrollbarRef = ref();
const top = ref(0);
const controlContainer = ref(null);
const scroll = ({ scrollTop }) => {
    top.value = scrollTop;
};
const currentComponent = ref(null);
currentComponent.value = RequirementTarget;
const isCurTabBatchingControl = computed(() => curTab.value === 'BatchControl' || on.value === 'BatchControl');

const { batchList, loadingBatchList } = useBatchHook(isCurTabBatchingControl);

const equipmentBtn = () => {
    emits('openEquipmentList');
};

const tabsChange = data => {
    currentComponent.value = data.code;
    if (curTab.value === 'DataStatistics') {
        scrollbarRef.value?.setScrollTop(top.value);
    }
};

const tabItems = computed(() => {
    const baseTabs = [
        {
            id: 'DataStatistics',
            code: DataStatistics,
            name: i18n.global.t('meos_control_web.data_statistics')
        },
        {
            id: 'RequirementTarget',
            code: RequirementTarget,
            name: i18n.global.t('meos_control_web.requirement_target')
        },
        { id: 'TemporaryRequirement', name: i18n.global.t('meos_control_web.temporary_requirement') }
    ];

    if (!isEdge() || isEquipListEmpty.value) {
        return baseTabs;
    }

    return [...baseTabs, { id: 'BatchControl', name: i18n.global.t('meos_control_web.batch_control') }];
});

const dashboardTabList = computed(() => {
    const baseTabs = [
        { id: 'RequirementTarget', name: i18n.global.t('meos_control_web.requirement_target') },
        { id: 'TemporaryRequirement', name: i18n.global.t('meos_control_web.temporary_requirement') }
    ];

    return isEquipListEmpty.value ? baseTabs : [...baseTabs, { id: 'BatchControl', name: i18n.global.t('meos_control_web.batch_control') }];
});

watch(
    () => isEquipListEmpty.value,
    empty => {
        if (empty) {
            if (curTab.value === 'BatchControl') {
                curTab.value = 'DataStatistics';
            }
            if (on.value === 'BatchControl') {
                on.value = 'RequirementTarget';
            }
        }
    },
    {
        immediate: true
    }
);

watch(
    () => top.value,
    () => {
        if (curTab.value === 'DataStatistics') {
            scrollbarRef.value?.setScrollTop(top.value);
        }
    }
);
watch(
    () => currentFloorObj?.value?.id,
    () => {
        top.value = 0;
        scrollbarRef.value?.setScrollTop(top.value);
    }
);
</script>
<style lang="less" scoped>
:deep(.m-tabs-name) {
    line-height: 22px;
}
:deep(.m-loading-mask) {
    z-index: 44 !important;
}
.control-container {
    height: calc(100% - 64px);
    width: 100%;
    position: relative;
    .tab-top {
        height: 42px;
        width: calc(100% - 32px);
        margin: 0 auto;
        border-bottom: 1px solid #e8ecf0;
        padding: 0 16px;
        position: relative;
        .tab-box {
            position: absolute;
            top: 0;
            left: -12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 103%;
        }
    }
    .tab-bottom {
        width: 100%;
        height: calc(100% - 40px);
        padding-bottom: 20px;

        .tab-data-statistics-container {
            width: 100%;
            height: 100%;
            padding-left: 16px;
        }
    }
}
.target-header {
    margin: 0 16px;
    border-bottom: 1px solid var(--gray-200);
    :deep(.m-tabs) {
        margin-left: -12px;
    }
}
.config-data {
    background-color: var(--alpha-30);
    border-radius: 4px;
    padding: 12px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
</style>
