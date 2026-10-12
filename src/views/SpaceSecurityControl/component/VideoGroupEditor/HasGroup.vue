<template>
    <div class="monitor-editor-nogroup-wrap">
        <div v-if="currentFloorId" class="monitor-label-tips">{{ i18n.global.t('meos_control_web.current_floor_camera_group') }}</div>
        <div v-if="currentGroups?.length === 0" class="monitor-edit-group-btn-grey">{{ i18n.global.t('meos_control_web.no_group_on_current_floor') }}</div>
        <div v-else class="monitor-group-edit-btns">
            <div
                v-for="group in currentGroups"
                :key="group.groupName"
                :class="{
                    'monitor-group-edit-btn': true,
                    selected: showMutiplePlayer && group.groupName === currentSelected
                }"
                @mouseenter="hoverMonitorGroupBounce(group)"
                @mouseleave="unhoverMonitorGroup()"
                @click.stop="clickMonitorGroup(group)"
            >
                <div class="group-info">
                    <div v-ellipsis class="group-title m-ellipsis">{{ group.groupName }}</div>
                    <div class="group-monitors-num">
                        <m-tips
                            :content="i18n.global.t('meos_control_web.num_floor_camera', { num: group.camerasInCurrentFloor })"
                            theme="darkTransparent"
                            :disabled="!group.camerasInCurrentFloor"
                            >{{ i18n.global.t('meos_control_web.num_camera', { num: group.objects?.length }) }}</m-tips
                        >
                    </div>
                </div>
                <div v-if="hasRightToEdit" class="group-action">
                    <IconMeriActionEditor size="14" @click="openEditMonitorGroupDrawer(group)" />
                </div>
            </div>
        </div>
        <div v-if="otherGroups?.length" class="retract-box">
            <span class="rel-btn" @click="showOtherMonitorGroup = !showOtherMonitorGroup">
                <template v-if="!showOtherMonitorGroup"
                    >{{ i18n.global.t('meos_control_web.other_monitor_groups') }}<IconMeriComponentChevronDown size="14" color="#626C78"
                /></template>
                <template v-else-if="showOtherMonitorGroup"
                    >{{ i18n.global.t('meos_control_web.other_monitor_groups') }}<IconMeriComponentChevronUp size="14" color="#626C78"
                /></template>
            </span>
        </div>
        <m-scrollbar ref="scrollbarRef" class="monitor-groups-scroll-warp">
            <div v-if="showOtherMonitorGroup" class="monitor-group-edit-btns">
                <div
                    v-for="group in otherGroups"
                    :key="group.groupName"
                    :class="{
                        'monitor-group-edit-btn': true,
                        selected: showMutiplePlayer && group.groupName === currentSelected
                    }"
                    @mouseenter="hoverMonitorGroupBounce(group)"
                    @mouseleave="unhoverMonitorGroup()"
                    @click="clickMonitorGroup(group)"
                >
                    <div class="group-info">
                        <div v-ellipsis class="group-title m-ellipsis">{{ group.groupName }}</div>
                        <div class="group-monitors-num">{{ i18n.global.t('meos_control_web.num_camera', { num: group.objects?.length }) }}</div>
                    </div>
                    <div v-if="hasRightToEdit" class="group-action">
                        <IconMeriActionEditor size="14" @click="openEditMonitorGroupDrawer(group)" />
                    </div>
                </div>
            </div>
        </m-scrollbar>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp, IconMeriActionEditor } from 'meri-icon';
import { currentGroupsInjectKey, otherGroupsInjectKey } from '../../hooks/useMonitorGroupHook';
const emit = defineEmits(['openEdit', 'click-monitor-group', 'hover-monitor-group', 'unhover-monitor-group']);
import { debounce } from 'lodash';
import baseStore from '@/store/baseStore';
const base = baseStore();
const showOtherMonitorGroup = ref(false);
const props = defineProps({
    currentFloorId: {
        type: String,
        default: ''
    }
});
const currentGroups = inject(currentGroupsInjectKey);
const otherGroups = inject(otherGroupsInjectKey);
const currentSelected = ref('');
const showMutiplePlayer = inject('showMutiplePlayer');
const openEditMonitorGroupDrawer = group => {
    emit('openEdit', group);
    unhoverMonitorGroup();
};
const hoverMonitorGroup = group => {
    const objectIds = [];
    group.objects &&
        group.objects?.map(o => {
            if (props.currentFloorId && o.floorId === props.currentFloorId) {
                objectIds.push(o.id);
            } else {
                objectIds.push(o.id);
            }
        });
    emit('hover-monitor-group', objectIds);
};
const hoverMonitorGroupBounce = debounce(hoverMonitorGroup, 100);

const unhoverMonitorGroup = () => {
    hoverMonitorGroupBounce.cancel();
    emit('unhover-monitor-group');
};
const clickMonitorGroup = group => {
    currentSelected.value = group.groupName;
    emit('click-monitor-group', group);
};
const hasRightToEdit = computed(() => {
    return base.hasAuth('MonitorGroupEdit') && isEdge();
});
</script>
<style lang="less" scoped>
.monitor-editor-nogroup-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .monitor-label-tips {
        overflow: hidden;
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
    .monitor-edit-group-btn-grey {
        width: 100%;
        padding: 12px 8px;
        gap: 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--gray-100, #f1f4f6);
        border: none;
        box-sizing: border-box;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: 0px;
        text-align: center;
        color: var(--gray-600, #626c78);
    }
    .retract-box {
        .rel-btn {
            display: inline-flex;
            height: 24px;
            padding: 5px 4px;
            justify-content: center;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
            cursor: pointer;
            flex-grow: 0;
            border-radius: 4px;
            font-family: 'Microsoft YaHei UI';
            font-size: 14px;
            color: var(--gray-600, #626c78);
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            &:hover {
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
    .monitor-group-edit-btns {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .monitor-group-edit-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        white-space: nowrap;
        position: relative;
        height: 54px;
        padding: 0px 12px;
        cursor: pointer;
        max-width: 100%;
        overflow: hidden;
        box-sizing: content-box;
        border-radius: 8px;
        border: 1px solid var(--gray-100, #f1f4f6);
        background: var(--gray-100, #f1f4f6);
        &:hover {
            border: 1px solid var(--blue-500, #246fe5);
            background-color: #f1f4f6;
            .group-action {
                display: flex;
            }
            .group-info {
                max-width: calc(100% - 32px);
            }
        }
        &.selected {
            border: 1px solid var(--blue-500, #246fe5);
            background-color: #ebf6ff;
        }
        .group-action {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            display: none;
            align-items: center;
            justify-self: flex-end;
            justify-content: center;
            border-radius: 4px;
            &:hover {
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
        .group-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            max-width: 100%;
            gap: 8px;
            .group-title {
                max-width: 100%;
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 22px; /* 157.143% */
                color: var(--gray-900, #1b2129);
            }
            .group-monitors-num {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
            }
        }
    }
}
</style>
