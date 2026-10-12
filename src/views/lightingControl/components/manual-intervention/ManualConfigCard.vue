<template>
    <div class="config-card-container">
        <div
            :class="{
                'config-card-item': true,
                done: isDone
            }"
        >
            <div class="header">
                <div class="left">
                    <div class="start-time">
                        <div class="seconds">{{ beginTime?.split(' ')?.[1] ? formatMinutes(beginTime?.split(' ')?.[1]) : '--' }}</div>
                        <div class="date">{{ beginTime?.split(' ')?.[0] ? formatTime(beginTime?.split(' ')?.[0]) : '--' }}</div>
                    </div>
                    <div class="separator">-</div>
                    <div class="end-time">
                        <div class="seconds">{{ endTime?.split(' ')?.[1] ? formatMinutes(endTime?.split(' ')?.[1]) : '--' }}</div>
                        <div class="date">{{ endTime?.split(' ')?.[0] ? formatTime(endTime?.split(' ')?.[0]) : '--' }}</div>
                    </div>
                </div>
                <div v-if="!isDone" class="right">
                    <div class="right-content">
                        <m-popover
                            :disabled="!inherit?.length && isEdge()"
                            :content="!isEdge() ? i18n.global.t('meos_control_web.not_operable_in_cloud') : i18n.global.t('meos_control_web.intervention_override_scene_no_op')"
                            theme="darkTransparent"
                            :show-arrow="false"
                        >
                            <m-button type="link" size="small" :disabled="!isEdge() || inherit?.length" @click="editIntervention">{{ i18n.global.t('common.edit') }}</m-button>
                        </m-popover>
                        <div class="separator"></div>
                        <m-popover
                            :disabled="!inherit?.length && isEdge()"
                            :content="!isEdge() ? i18n.global.t('meos_control_web.not_operable_in_cloud') : i18n.global.t('meos_control_web.intervention_override_scene_no_op')"
                            theme="darkTransparent"
                            :show-arrow="false"
                        >
                            <m-button type="link" size="small" :disabled="!isEdge() || inherit?.length" @click="removeIntervention">{{
                                i18n.global.t('meos_control_web.release_intervention')
                            }}</m-button>
                        </m-popover>
                    </div>
                </div>
                <div v-else class="right">
                    <m-tag v-if="isDone" color="#1B2129" bg-color="#E8ECF0" size="small">{{ i18n.global.t('meos_control_web.intervention_completed') }}</m-tag>
                </div>
            </div>
            <div v-if="isActive || isDone || inherit?.length" class="tags">
                <m-tag v-if="isActive" color="#0C9B4A" bg-color="#DAF7E1" size="small">{{ i18n.global.t('meos_control_web.effective') }}</m-tag>
                <!-- <m-tag v-if="isDone" color="#1B2129" bg-color="#E8ECF0" size="small"> 已完成 </m-tag> -->
                <m-tag v-if="inherit?.length" color="#1B2129" bg-color="#E8ECF0" size="small">
                    {{ i18n.global.t('meos_control_web.accord_name_interrupt', { name: inherit?.[0]?.instanceName ?? '--' }) }}
                </m-tag>
            </div>
            <div class="content">
                <div :class="{ reason: true }">{{ `${i18n.global.t('meos_control_web.reason_colon')}：${reason || '--'}` }}</div>
                <div class="show-more-config">
                    <m-button type="link" size="small" class="operation-btn" @click="switchConfigShow">
                        {{
                            state.configShow && !listDataLoading
                                ? i18n.global.t('meos_control_web.collapse_intervention_config')
                                : i18n.global.t('meos_control_web.expand_intervention_configuration')
                        }}
                    </m-button>
                    <div v-if="listDataLoading" class="show-more-icon">
                        <m-button type="link" size="small" loading />
                    </div>
                    <div v-else :class="{ 'show-more-icon': true, up: state.configShow && !listDataLoading, down: !state.configShow || listDataLoading }"><Arrow /></div>
                </div>
            </div>
            <template v-if="state.configShow && !listDataLoading">
                <div ref="listRef" class="config-list-card-container">
                    <ConfigList :theme="'subCard'" :done="isDone" :data="listData" />
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import Arrow from '@/assets/svg/up.svg';
import { MMessageBox, $Message } from 'meri-plus';
import dayjs from 'dayjs';
import ConfigList from '../../components/config-list/index.vue';
import { InterventionProps } from './types';
import { getInterventionConfigDetail } from '@/apis/lightingDemandIntervention';
import { ConfigDataItem } from '../config-list/types';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { isEdge } from '@/utils/envUtils';

interface ManualConfigCardProps {
    data?: InterventionProps;
    defaultExpand?: boolean;
    expandScroll?: boolean;
}

const props = defineProps<ManualConfigCardProps>();
const { data, expandScroll } = unref(props);

const { beginTime, endTime, inherit, reason } = data || {};

const isActive = computed(() => props?.data?.status === 'EFFECTING');
const isDone = computed(() => props?.data?.status === 'COMPLETED');

const listData = ref<ConfigDataItem>({});
const listDataLoading = ref(false);

const state = reactive({
    configShow: false
});
const listRef = ref<HTMLElement | null>(null);

const formatTime = (time: string) => {
    return dayjs(time).format('YYYY.MM.DD');
};

const formatMinutes = (time: string) => {
    return time.split(':')?.slice(0, 2)?.join(':');
};

watch(
    () => props?.defaultExpand,
    cur => {
        if (cur) {
            state.configShow = !state.configShow;
            getConfigListData();
        }
    },
    { immediate: true }
);

async function getConfigListData() {
    const { configId, instanceId, instanceType, runningMonitorSecondType } = props?.data || {};
    const params = {
        configId,
        instanceId,
        instanceType,
        runningMonitorSecondType
    };

    listDataLoading.value = true;
    const res = await getInterventionConfigDetail(params).finally(() => {
        listDataLoading.value = false;
    });
    if (res?.code === SUCCESSCODE) {
        const { configData } = (res?.data || {}) as any;
        listData.value = configData as ConfigDataItem;
    }
}

async function switchConfigShow() {
    state.configShow = !state.configShow;
    if (state.configShow && expandScroll) {
        nextTick(() => {
            const ele = listRef?.value;
            ele?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    if (state.configShow) {
        getConfigListData();
    }
}

const emits = defineEmits(['edit:intervention', 'remove:intervention']);

const editIntervention = () => {
    // 云端禁用写入
    if (!isEdge()) {
        return;
    }
    emits('edit:intervention', props?.data ?? {});
};

const removeIntervention = () => {
    // 云端禁用写入
    if (!isEdge()) {
        return;
    }
    MMessageBox({
        type: 'danger',
        title: i18n.global.t('meos_control_web.confirm_release_intervention'),
        confirmButtonText: i18n.global.t('meos_control_web.release'),
        message: `${i18n.global.t('meos_control_web.after_release_objects_follow_auto_demand')}`
    })
        .then(() => {
            emits('remove:intervention', {
                ...(props?.data ?? {}),
                callback: () => {
                    $Message.success({
                        title: i18n.global.t('meos_control_web.release_intervention_success'),
                        showClose: true,
                        duration: 3000
                    });
                }
            });
        })
        .catch(() => {});
};
</script>

<style lang="less" scoped>
.config-card-container {
    display: flex;
    flex-direction: column;
}

.config-card-item {
    display: flex;
    flex-direction: column;

    width: 100%;
    min-height: 80px;
    padding: 12px;

    border-radius: 4px;
    border: 1px solid var(--yellow-100, #fcf8b8);
    background: var(--orange-50, #fffbe6);

    .config-list-card-container {
        padding-top: 12px;
    }
}

.done {
    border: 1px solid var(--gray-100, #f1f4f6);
    background: var(--gray-50, #f7f9fa);
}

.header {
    display: flex;
    justify-content: space-between;
    position: relative;
}

.left {
    display: flex;
    align-items: center;
    column-gap: 16px;

    .start-time,
    .end-time {
        display: flex;
        flex-direction: column;
        row-gap: 4px;
    }

    .separator {
        width: 10px;
        color: @grey-800;
        font-size: 16px;
        font-weight: var(--platform-font-weight);
    }

    .seconds {
        font-family: 'Persagy2.0';
        color: @grey-800;
        font-size: 16px;
        font-weight: 700;
    }
    .date {
        color: @grey-500;
        font-size: 14px;
        font-weight: 500;
    }
}

.right {
    transform: translateY(-5px);
    .right-content {
        display: flex;
        align-items: center;
        column-gap: 4px;
    }

    .separator {
        width: 1px;
        height: 17px;
        background: #d9d9d9;
    }
}

.tags {
    display: flex;
    align-items: center;
    margin-top: 8px;
}

.content {
    margin-top: 8px;

    .reason {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}

.show-more-config {
    margin-top: 4px;
    display: flex;
    align-items: center;
    position: relative;

    .operation-btn {
        transform: translateX(-4px);
    }

    .show-more-icon {
        :deep(path) {
            fill: @blue-500;
        }
    }

    .show-more-icon.up {
        transform: rotateZ(90deg);
    }

    .show-more-icon.down {
        transform: rotateZ(-90deg);
    }
}
</style>
