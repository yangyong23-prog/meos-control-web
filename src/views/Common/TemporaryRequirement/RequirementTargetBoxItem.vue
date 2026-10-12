<template>
    <div class="requirement-box-item">
        <div class="task-header fw700">{{ task.taskName }}</div>
        <div class="task-time fcb">
            <div class="task-time-left fc" style="gap: 12px">
                <div>
                    <div class="ffCP fw700 fs16 mb4">{{ dayjs(task.beginTime).format('HH:mm') }}</div>
                    <div class="fw500 ffCP" style="color: var(--gray-600)">{{ dayjs(task.beginTime).format('YYYY-MM-DD') }}</div>
                </div>
                <div style="background-color: var(--gray-800); width: 10px; height: 1px"></div>
                <div>
                    <div class="ffCP fw700 fs16 mb4">{{ dayjs(task.endTime).format('HH:mm') }}</div>
                    <div class="fw500 ffCP" style="color: var(--gray-600)">{{ dayjs(task.endTime).format('YYYY-MM-DD') }}</div>
                </div>
            </div>
            <div class="task-time-right fcc" style="align-self: start; gap: 4px">
                <SetButton type="link" size="small" :disabled="task.isEffect" :content="task.isEffect ? i18n.global.t('meos_control_web.effective_edit') : ''" @click="editItem">{{
                    i18n.global.t('common.edit')
                }}</SetButton>
                <div class="fcc" style="background-color: #d9d9d9; height: 17px; width: 1px"></div>
                <SetButton
                    type="link"
                    size="small"
                    :disabled="task.isEffect"
                    :content="task.isEffect ? i18n.global.t('meos_control_web.effective_delete') : ''"
                    @click="removeItem"
                    >{{ i18n.global.t('common.delete') }}</SetButton
                >
            </div>
        </div>
        <div v-if="task.isEffect" class="task-effect">
            <m-tag color="#0C9B4A" bg-color="#DAF7E1" size="small"> {{ i18n.global.t('meos_control_web.effective') }} </m-tag>
        </div>

        <div v-if="task.reason" class="task-reason">{{ i18n.global.t('common.remarks') }}：{{ task.reason }}</div>
        <div v-if="task.instance?.length" v-ellipsis class="task-instance" :style="{ borderTop: task.reason ? ' 1px solid #d4d0bd' : '', paddingTop: task.reason ? '8px' : '' }">
            {{ i18n.global.t('common.space') }}：{{ task.instance?.map(item => item.localName).join('、') }}
        </div>
        <div class="task-content">
            <m-collapse v-model="data" :hover-style="false">
                <m-collapse-item id="1" :title="data.length ? collapseText : expandText" icon="">
                    <template #title="{ title, isActive }">
                        <m-button type="link" size="small" icon-position="right">
                            <template #icon>
                                <span class="m-collapse-item__header-icon" :class="{ 'is-active': isActive }" style="margin: 0; padding: 0; background-color: transparent">
                                    <IconMeriComponentChevronDown />
                                </span>
                            </template>
                            {{ title }}
                        </m-button>
                    </template>
                    <template #icon>
                        <span> </span>
                    </template>
                    <slot name="content" :task="task"></slot>
                </m-collapse-item>
            </m-collapse>
        </div>
    </div>
</template>

<script setup>
import SetButton from '@/components/common/SetButton.vue';
// import LoopResultTree from '../LoopResultTree/index.vue';
import { IconMeriComponentChevronDown } from 'meri-icon';
import dayjs from 'dayjs';
import { removeTaskConfig } from '@/apis/IndoorLighting';
import { useSuccessMessage } from '@/utils/tools';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { MMessageBox } from 'meri-plus';
import i18n from '@/localization';

const props = defineProps({
    task: {
        type: Object,
        required: true
    },
    changeHandleData: {
        type: Function,
        default: () => {}
    },
    collapseText: {
        type: String,
        default: i18n.global.t('meos_control_web.collapse')
    },
    expandText: {
        type: String,
        default: i18n.global.t('meos_control_web.expand')
    }
});
const emits = defineEmits(['edit']);
const data = ref([]);
const setStatus = (openNum, list) => {
    if (openNum === 0) {
        return 'ALL_CLOSE';
    } else if (openNum === list.length) {
        return 'ALL_OPEN';
    } else if (openNum > 0 && openNum < list.length) {
        return 'PART_OPEN';
    } else {
        return 'CLOSE';
    }
};
const removeItem = () => {
    MMessageBox({
        type: 'danger',
        title: i18n.global.t('meos_control_web.delete_temporary_air_conditioning_demand'),
        confirmButtonText: i18n.global.t('common.delete'),
        hasLoading: true,
        message: i18n.global.t('meos_control_web.delete_temporary_air_conditioning_demand_message'),
        beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
                try {
                    const { code } = await removeTaskConfig({ taskId: props.task.taskId });
                    if (code === SUCCESSCODE) {
                        useSuccessMessage(i18n.global.t('meos_control_web.delete_success'));
                        props.changeHandleData();
                    }
                    done();
                } catch (error) {
                    done();
                    console.error('删除任务配置失败:', error);
                }
            } else {
                done();
            }
        }
    });
};
const editItem = () => {
    // 编辑任务配置逻辑
    emits('edit', props.task);
};
</script>
<style lang="less" scoped>
.requirement-box-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 12px 6px 12px;
    border-radius: 4px;
    background-color: var(--orange-50);
    & + .requirement-box-item {
        margin-top: 10px;
    }
    .task-header {
        min-height: 22px;
        line-height: 22px;
    }
    .task-time {
        height: 52px;
    }
    .task-effect {
    }
    .task-reason {
        color: var(--gray-600);
    }
    .task-instance {
        color: var(--gray-600);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .task-content {
        :deep(.m-collapse-item__header) {
            padding: 0 0 8px 0 !important;
        }
        :deep(.m-collapse-item__header-icon.is-active svg) {
            transform: rotate(-180deg);
        }
        &-main {
            border-radius: 4px;
            background-color: #f1eeda;
        }
    }
}
</style>
