<template>
    <div v-if="equips.length" class="relation-equips-group">
        <div v-if="type != 'ElevatorSystem'" class="group-title">
            <span class="icon-warp">
                <component :is="equipGroupIcons[relEquipGroup.groupCode]"></component>
            </span>
            <span class="group-name">
                {{ relEquipGroup.groupName }}
            </span>
        </div>
        <EquipItemForSpaceSecurity
            v-for="equip in equips"
            v-bind="$attrs"
            :key="equip.id"
            :show-to-camera="relEquipGroup.groupCode === 'cameraInSpace'"
            :select-obj="selectObj"
            :data="equip"
        ></EquipItemForSpaceSecurity>
    </div>
</template>
<script setup>
import EquipItemForSpaceSecurity from './EquipItemForSpaceSecurity.vue';
import MonitorIcon from '@/assets/svg/monitor-icon.svg';
import AlarmIcon from '@/assets/svg/alarm-icon.svg';
import SecurityDoorIcon from '@/assets/svg/security-door-icon.svg';

const equipGroupIcons = {
    cameraInSpace: MonitorIcon,
    invasionAlarmEquipment: AlarmIcon,
    doorInSpace: SecurityDoorIcon
};

const props = defineProps({
    relEquipGroup: {
        type: Array,
        default: () => []
    },
    selectObj: {
        type: Object,
        default: () => ({})
    },
    type: {
        type: String,
        default: ''
    }
});

const equips = computed(() => {
    if (props.relEquipGroup?.relInfoCodeConfigs?.length) {
        const data = props.relEquipGroup.relInfoCodeConfigs.reduce((acc, config) => {
            if (config.dataValue?.length) {
                return [...acc, ...config.dataValue];
            }
            return acc;
        }, []);
        // const data = props.relEquipGroup.relInfoCodeConfigs.map(config => config.dataValue).filter(Boolean);
        return data;
    }
    return [];
});
</script>
<style lang="less" scoped>
.relation-equips-group {
    border-radius: 8px;
    background: var(--gray-50);
    margin: 12px 0;
    .group-title {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 16px;
        padding: 12px;
        .icon-warp {
            width: 20px;
            height: 20px;
        }
        .group-name {
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 24px;
        }
    }
}
</style>
