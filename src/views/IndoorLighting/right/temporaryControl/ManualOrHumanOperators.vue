<template>
    <div class="manual-operators">
        <TaskList v-if="manualList.length" :list="manualList" :active-task="activeTask" @edit-task="handleEdit" @delete-task="handleDelete" @control-task="handleControlTask" />
        <div v-else class="empty fcc">
            {{ i18n.global.t('meos_control_web.no_content') }}
        </div>
        <m-collapse v-if="instanceType === ObjectTypeEnum.Project && manualFloorGroupList.length" v-model="collapseData" :hover-style="false" header-position="bottom">
            <m-collapse-item id="1" title="展开各楼层">
                <template #title="{ isActive }"> {{ isActive ? i18n.global.t('meos_control_web.collapse_floors') : i18n.global.t('meos_control_web.expand_floors') }} </template>
                <template #icon>
                    <span></span>
                </template>
                <div class="floor-wrapper mt8">
                    <div v-for="floor in manualFloorGroupList" :key="floor.floorId" class="floor-group">
                        <div class="floor-title">{{ getFloorName(floor) }}</div>
                        <TaskList :list="floor.children" :active-task="activeTask" @edit-task="handleEdit" @delete-task="handleDelete" @control-task="handleControlTask" />
                    </div>
                </div>
            </m-collapse-item>
        </m-collapse>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import i18n from '@/localization';
import { ExecuteTypeEnum, TaskEmit, ManualTaskEmitHandlers, TaskProps, ManualTask } from './types';
import { ObjectTypeEnum } from '@/types/common';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import TaskList from './TaskList.vue';

interface FloorGroup {
    floorId: string;
    localName: string;
    children: ManualTask[];
}
const emits = defineEmits<ManualTaskEmitHandlers>();
const props = withDefaults(defineProps<TaskProps>(), {
    taskList: () => [],
    instanceType: '',
    runningMonitorSecondType: ''
});
const collapseData = ref<string[]>([]);
const isProjectView = computed(() => props.instanceType === ObjectTypeEnum.Project);
const manualTasks = computed<ManualTask[]>(() => {
    return props.taskList.filter((task): task is ManualTask => task.configData.type === ExecuteTypeEnum.Manual && task.runningMonitorSecondType === props.runningMonitorSecondType);
});

const manualProjectList = computed(() => {
    return manualTasks.value.filter(task => task.configData.belong.instanceType === ObjectTypeEnum.Project);
});

const manualFloorList = computed(() => {
    return manualTasks.value.filter(task => task.configData.belong.instanceType === ObjectTypeEnum.Floor);
});

const manualFloorGroupList = computed<FloorGroup[]>(() => {
    const grouped = new Map<string, ManualTask[]>();
    manualFloorList.value.forEach(task => {
        const floorId = task.configData.belong.instanceId;
        if (!grouped.has(floorId)) {
            grouped.set(floorId, []);
        }
        grouped.get(floorId)!.push(task);
    });
    return Array.from(grouped.entries()).map(([floorId, children]) => ({ floorId, localName: treeBuildFloorStore().getBuildOrFloor(floorId)?.localName ?? floorId, children }));
});

const manualList = computed<ManualTask[]>(() => {
    if (isProjectView.value) {
        return manualProjectList.value;
    }
    return manualFloorList.value;
});

const getFloorName = (floor: FloorGroup) => {
    if (treeBuildFloorStore().treeBuildFloor.length > 1) {
        const buildingId = treeBuildFloorStore().getBuildOrFloor(floor.floorId)?.buildingId;
        if (buildingId) {
            const building = treeBuildFloorStore().getBuildOrFloor(buildingId);
            return ` ${floor.localName}(${building?.localName}) `;
        }
    }
    return floor.localName;
};

const handleEdit = (task: ManualTask) => {
    emits(TaskEmit.EditTask, task);
};

const handleDelete = (task: ManualTask) => {
    emits(TaskEmit.DeleteTask, task);
};
const handleControlTask = (e: HTMLElement, task: ManualTask, needTime: boolean) => {
    emits(TaskEmit.ControlTask, e, task, needTime);
};
</script>

<style lang="less" scoped>
.manual-operators {
    .empty {
        color: var(--gray-600);
        border-radius: 4px;
        background-color: var(--gray-50);
        padding: 12px;
    }
    :deep(.m-collapse-item) {
        .m-collapse-item__header {
            padding-left: 0;
            color: var(--blue-500);
            &:hover {
                color: var(--blue-700);
            }
        }
    }

    .floor-wrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .floor-group {
            .floor-title {
                margin-bottom: 8px;
                font-size: 12px;
                color: var(--gray-500);
            }
        }
    }
}
</style>
