<template>
    <div v-if="isEdge() || currentMonitorGroups.length !== 0 || otherMonitorGroups.length !== 0" class="security-monitor-group-editor-wrap" :class="{ 'in-side': inSide }">
        <div class="title-wrap">
            <div class="title">{{ i18n.global.t('meos_control_web.video_monitor_group') }}</div>
            <m-button v-if="hasRightToEdit" class="to-control-btn" type="link" size="medium" @click="addVideoGroup()">{{ i18n.global.t('meos_control_web.add_group') }}</m-button>
        </div>
        <div v-if="loadingGroups" class="security-monitors-loading">
            <m-list-skeleton :item-num="6" />
        </div>
        <div v-else class="security-monitor-editor-content-wrap">
            <NoGroup v-if="currentMonitorGroups.length === 0 && otherMonitorGroups.length === 0" @open-new="addVideoGroup()" />
            <HasGroup
                v-else
                :current-floor-id="currentFloorId"
                @open-edit="addVideoGroup"
                @click-monitor-group="clickMonitorGroup"
                @hover-monitor-group="hoverMonitorGroup"
                @unhover-monitor-group="unhoverMonitorGroup"
            />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
import NoGroup from './NoGroup.vue';
import HasGroup from './HasGroup.vue';
import { enterVideoGroupKey, showVideoGroupMapKey } from '../../hooks/useVideoGroup';
import useMonitorGroupHook from '../../hooks/useMonitorGroupHook';
import { openEditMonitorGroupDrawerInjectKey } from '../../hooks/useDrawer';
import { addOrEditGroupInjectKey } from '../../hooks/useMonitorEditHook';
import baseStore from '@/store/baseStore';
const base = baseStore();
const openEditMonitorGroupDrawer = inject(openEditMonitorGroupDrawerInjectKey);
const addOrEditGroup = inject(addOrEditGroupInjectKey);
const emit = defineEmits(['clickMonitorGroup', 'hover-monitor-group', 'unhover-monitor-group', 'open-edit-group']);

const { queryGroups, currentMonitorGroups, loadingGroups, otherMonitorGroups } = useMonitorGroupHook();
const props = defineProps({
    inSide: {
        type: Boolean,
        default: false
    },
    currentFloorId: {
        type: String,
        default: ''
    }
});
const hoverMonitorGroup = group => {
    emit('hover-monitor-group', group);
};
const unhoverMonitorGroup = () => {
    emit('unhover-monitor-group');
};
const hasRightToEdit = computed(() => {
    return base.hasAuth('MonitorGroupEdit') && isEdge() && (currentMonitorGroups.value.length !== 0 || otherMonitorGroups.value.length !== 0);
});
const enterVideoGroup = inject(enterVideoGroupKey);
const showVideoGroup = inject(showVideoGroupMapKey);
const addVideoGroup = group => {
    enterVideoGroup?.();
    openEditMonitorGroupDrawer(group);
    addOrEditGroup(group);
    openEditGroup(group);
};

const openEditGroup = group => {
    emit('open-edit-group', group);
};

const clickMonitorGroup = group => {
    emit('clickMonitorGroup', group);
};
const queryMonitorGroups = async () => {
    await queryGroups({
        floorId: props.currentFloorId
    });
};

watch(
    () => [props.currentFloorId, showVideoGroup.value],
    async () => {
        await queryMonitorGroups();
    },
    {
        immediate: true,
        deep: true
    }
);
</script>
<style lang="less" scoped>
.security-monitor-group-editor-wrap {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    padding: 12px 16px 12px;
    &.in-side {
        .title-wrap {
            .title {
                position: relative;
                padding-left: 12px;
                &:before {
                    content: ' ';
                    display: block;
                    width: 3px;
                    height: 14px;
                    background: var(--blue-500);
                    position: absolute;
                    left: 0;
                    top: 6px;
                }
            }
        }
    }
    .title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;

        .title {
            color: var(--gray-800);
            font-size: 18px;
            font-weight: 700;
            line-height: 26px;
        }
    }
}
</style>
