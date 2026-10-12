<template>
    <div class="requirment-target h100">
        <m-list-skeleton v-if="loading" :style="{ marginRight: `${props.marginRight}px` }" />
        <template v-else>
            <div class="requirment-target-content">
                <m-scrollbar max-height="100%" style="overflow: inherit" class="requirment-target-content-scrollbar">
                    <m-collapse v-if="types.length > 1" v-model="collapseData" icon-position="left" :hover-style="false" only-icon-click>
                        <template v-for="type in typesData" :key="type.code">
                            <m-collapse-item :id="type.code" :title="type.name">
                                <template #title="{ title }">
                                    <div class="fcb" :style="{ flex: 1, 'margin-right': `${props.marginRight}px` }">
                                        <div style="height: 28px; line-height: 28px">{{ title }}</div>
                                        <SetButton type="link" size="small" @click="openScheduledTask(type)">{{ btnText }}</SetButton>
                                    </div>
                                </template>
                                <RequirementTargetBox
                                    v-if="type.tasks.length"
                                    :tasks="type.tasks"
                                    :change-handle-data="changeHandleData"
                                    :margin-right="marginRight"
                                    v-bind="$attrs"
                                    @edit="data => openScheduledTask(type, data)"
                                >
                                    <template #content="{ task }">
                                        <slot name="content" :task="task"></slot>
                                    </template>
                                </RequirementTargetBox>
                                <div v-else class="task-empty fcc">{{ i18n.global.t('common.no_data') }}</div>
                            </m-collapse-item>
                        </template>
                    </m-collapse>
                    <div v-else>
                        <template v-for="type in typesData" :key="type.code">
                            <div class="group-name-detail-configuration fcb" :style="{ 'font-size': '14px', 'margin-right': `${props.marginRight}px` }">
                                <span class="configuration-name">{{ type.name }}</span>
                                <SetButton class="configuration-btn" type="link" size="small" @click="openScheduledTask(type)">{{ btnText }}</SetButton>
                            </div>
                            <RequirementTargetBox
                                v-if="type.tasks.length"
                                :tasks="type.tasks"
                                :change-handle-data="changeHandleData"
                                :margin-right="marginRight"
                                v-bind="$attrs"
                                @edit="data => openScheduledTask(type, data)"
                            >
                                <template #content="{ task }">
                                    <slot name="content" :task="task"></slot>
                                </template>
                            </RequirementTargetBox>
                            <div v-else class="empty-box w100 fcc" style="height: calc(100% - 40px)">
                                <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
                            </div>
                        </template>
                    </div>
                </m-scrollbar>
            </div>
        </template>
    </div>
</template>

<script setup>
import { interventionTaskConfig } from '@/apis/IndoorLighting';
import { GET_MENU_CONFIG, getDayjsTz } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import RequirementTargetBox from './RequirementTargetBox.vue';
import { isEqual, uniq } from 'lodash';
import SetButton from '@/components/common/SetButton.vue';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import UseCancelTokenHooks from '../../../hooks/UseCancelTokenHooks';
import { dayjsIsBetween } from '@/utils/dayjsTools';
const { cancelQuest, cancelToken } = UseCancelTokenHooks();
const props = defineProps({
    instanceType: {
        type: String,
        default: undefined
    },
    beginTime: {
        type: String,
        default: () => getDayjsTz().format('YYYY-MM-DD HH:mm:ss')
    },
    runningMonitorType: {
        type: String,
        default: () => window[GET_MENU_CONFIG]()?.RUNNING_MONITOR_TYPE
    },
    runningMonitorSecondType: {
        type: String,
        default: () => window[GET_MENU_CONFIG]()?.RUNNING_MONITOR_SECOND_TYPE
    },
    types: {
        type: Array,
        default: () => []
    },
    instanceIds: {
        type: Array,
        default: () => []
    },
    listObj: {
        type: Object,
        default: () => ({})
    },
    addObj: {
        type: Object,
        default: () => ({})
    },
    btnText: {
        type: String,
        default: () => i18n.global.t('meos_control_web.add_temporary_air_conditioning_demand')
    },
    marginRight: {
        type: Number,
        default: 0
    }
});
const ScheduledTaskProps = ref({});
const showScheduledTask = ref(false);
const taskList = ref([]);
const collapseData = ref([]);
const typesData = ref([]);
const loading = ref(false);
const emits = defineEmits(['openScheduledTask']);
const openScheduledTask = (type, data) => {
    ScheduledTaskProps.value = {
        instanceType: props.addObj.instanceType || 'PROJECT',
        instanceId: props.addObj.instanceId || baseStore().projectId,
        runningMonitorType: props.runningMonitorType,
        runningMonitorSecondType: type.code
    };
    if (data) {
        ScheduledTaskProps.value.editData = data;
    } else {
        ScheduledTaskProps.value.editData = null;
    }
    showScheduledTask.value = true;
    emits('openScheduledTask', ScheduledTaskProps.value);
};
const getTaskConfig = async () => {
    cancelQuest();
    loading.value = true;
    collapseData.value = [];
    typesData.value = props.types.map(item => ({ ...item, tasks: [] }));
    try {
        const res = await interventionTaskConfig(
            {
                runningMonitorType: props.runningMonitorType,
                runningMonitorSecondType: props.runningMonitorSecondType,
                instanceType: props.listObj.instanceType,
                instanceIds: props.listObj.instanceIds,
                beginTime: getDayjsTz().format('YYYY-MM-DD HH:mm:ss')
            },
            { cancelToken: cancelToken() }
        );
        taskList.value = res.data || [];
        taskList.value.forEach(item => {
            item.isEffect = dayjsIsBetween(getDayjsTz(), item.beginTime, dayjs(item.endTime));
        });
        typesData.value.forEach(type => {
            type.tasks = taskList.value.filter(item => item.runningMonitorSecondType === type?.code);
            collapseData.value.push(type.code);
        });
        collapseData.value = uniq(collapseData.value);
    } catch (error) {
        console.error('获取任务配置失败:', error);
        taskList.value = [];
    } finally {
        // 关闭加载动画
        loading.value = false;
    }
};
const changeHandleData = async () => {
    await getTaskConfig();
};
onMounted(() => {
    getTaskConfig();
});
// 组件卸载时取消请求
onBeforeUnmount(() => {
    cancelQuest();
});
defineExpose({
    changeHandleData
});
watch(
    () => props.listObj.instanceType,
    () => {
        changeHandleData();
    }
);
watch(
    () => props.listObj.instanceIds,
    (newValue, oldValue) => {
        if (isEqual(newValue, oldValue)) {
            return;
        }
        changeHandleData();
    }
);
</script>
<style lang="less" scoped>
.requirment-target {
    padding-top: 20px;
    &-content {
        height: calc(100%);
        :deep(.m-collapse-item) {
            position: relative;
            .m-collapse-item__header {
                padding: 8px 0;
                cursor: default;
                .m-collapse-item__header-icon {
                    cursor: pointer;
                }
            }
        }
        .task-empty {
            background-color: var(--gray-100);
            color: var(--gray-600);
            height: 68px;
            border-radius: 4px;
        }
        .empty-box {
            position: absolute;
        }
        .requirment-target-content-scrollbar {
            :deep(.m-scrollbar__bar.is-vertical) {
                right: -14px;
            }
        }
    }
    .group-name-detail-configuration {
        width: 100%;
        min-width: 0;
    }
    .configuration-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-shrink: 1;
        max-width: 100%;
        margin-right: 16px;
    }
    :deep(.configuration-btn) {
        max-width: 50%;
        flex-shrink: 0;
        min-width: 0;
    }
}
</style>
