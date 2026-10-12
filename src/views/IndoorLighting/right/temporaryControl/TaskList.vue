<template>
    <div class="task-list">
        <div v-for="item in list" :key="item.taskId" class="task-row" :class="{ 'show-pop': activeId === item.taskId, 'active-task': activeTask?.taskId === item.taskId }">
            <div class="fcb">
                <div class="task-name fc">
                    <div class="task-name-title fc">
                        <div v-ellipsis class="m-ellipsis">{{ item.taskName }}&nbsp;</div>
                        <template v-if="item.configData.controlEndTime">
                            <m-tag v-if="item.configData.config.settingMode === SettingModeEnum.Open" color="var(--green-700)" bg-color="var(--green-100)" size="small">
                                {{ i18n.global.t('meos_control_web.on') }}
                            </m-tag>
                            <m-tag v-else-if="item.configData.config.settingMode === SettingModeEnum.Close" color="var(--gray-900)" bg-color="var(--gray-200)" size="small">
                                {{ i18n.global.t('meos_control_web.off') }}
                            </m-tag>
                        </template>
                    </div>
                    <SetDiv class="fcc" :content="i18n.global.t('common.edit')" show-tip>
                        <template #default="{ disabled }">
                            <div class="icon-btn" :style="{ 'pointer-events': disabled ? 'none' : 'auto' }" @click.stop="emit(TaskEmit.EditTask, item)">
                                <IconMeriActionEditor :size="14" :color="disabled ? 'var(--gray-600)' : 'var(--gray-900)'" />
                            </div>
                        </template>
                    </SetDiv>
                    <SetDiv class="fcc" :content="i18n.global.t('common.delete')" show-tip>
                        <template #default="{ disabled }">
                            <div class="icon-btn" :style="{ 'pointer-events': disabled ? 'none' : 'auto' }">
                                <m-popconfirm
                                    :content="i18n.global.t('meos_control_web.confirm_delete_message')"
                                    status="primary"
                                    :cancel-button-text="i18n.global.t('common.cancel')"
                                    :confirm-button-text="i18n.global.t('common.confirm')"
                                    @confirm="emit(TaskEmit.DeleteTask, item)"
                                    @show="showTip(item.taskId)"
                                    @hide="hideTip()"
                                >
                                    <IconMeriActionDelete :size="14" :color="disabled ? 'var(--gray-600)' : 'var(--gray-900)'" />
                                </m-popconfirm>
                            </div>
                        </template>
                    </SetDiv>
                </div>
                <slot name="status" :item="item">
                    <SetButton size="small" type="link" @click="e => handleControl(e, item, item.configData?.controlEndTime ? false : true)">
                        {{ getStatusText(item) }}
                    </SetButton>
                </slot>
            </div>
            <div v-if="item.configData?.controlEndTime" style="color: var(--gray-600)">
                {{ i18n.global.t('meos_control_web.deadline') }}：
                <SetDiv @click="e => handleControl(e, item)">
                    <span class="fw700 ffCP">{{ dayjs(item.configData.controlEndTime).format('YYYY-MM-DD HH:mm') }}</span>
                </SetDiv>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localization';
import { IconMeriActionEditor, IconMeriActionDelete } from 'meri-icon';
import SetButton from '@/components/common/SetButton.vue';
import { TaskEmit, ManualTaskEmitHandlers, ManualTask, type ManualTaskListProps, SettingModeEnum } from './types';
import dayjs from 'dayjs';
import SetDiv from '@/components/common/SetDiv.vue';

const props = withDefaults(defineProps<ManualTaskListProps>(), {
    list: () => []
});

const emit = defineEmits<ManualTaskEmitHandlers>();

const list = computed(() => props.list);
const getStatusText = (item: ManualTask) => {
    if (item.configData?.controlEndTime) {
        return i18n.global.t('meos_control_web.early_termination');
    }
    const mode = item.configData.config.settingMode;
    if (mode === SettingModeEnum.Open) {
        return i18n.global.t('meos_control_web.on');
    }
    if (mode === SettingModeEnum.Close) {
        return i18n.global.t('meos_control_web.off');
    }
    return '';
};

const handleControl = (e: HTMLElement, task: ManualTask, needTime = true) => {
    emit(TaskEmit.ControlTask, e, task, needTime);
};
const activeId = ref('');
const showTip = (id: string) => {
    activeId.value = id;
};
const hideTip = () => {
    activeId.value = '';
};
</script>

<style scoped lang="less">
.task-list {
    .task-row {
        background-color: var(--gray-50);
        border: 1px solid var(--gray-200);
        border-radius: 4px;
        padding: 10px;
        & + .task-row {
            margin-top: 8px;
        }
        .task-name {
            width: calc(100% - 64px);
            padding-right: 8px;
            .task-name-title {
                max-width: 100%;
            }
            .icon-btn {
                align-items: center;
                border-radius: 2px;
                cursor: pointer;
                display: none;
                height: 16px;
                margin: 0 4px;
                width: 16px;
            }
            :deep(.set-div) {
                display: inline-flex;
                & + .set-div {
                    margin-left: 0;
                }
            }
        }
        &:hover {
            background-color: var(--blue-50);
            border-color: var(--blue-500);
            .task-name {
                .task-name-title {
                    max-width: calc(100% - 40px);
                }
                .icon-btn {
                    display: flex;
                }
            }
        }
        &.show-pop {
            .task-name {
                .task-name-title {
                    max-width: calc(100% - 40px);
                }
                .icon-btn {
                    display: flex;
                }
            }
        }
        &.active-task {
            background-color: var(--blue-50);
            border-color: var(--blue-500);
        }
    }
}
</style>
