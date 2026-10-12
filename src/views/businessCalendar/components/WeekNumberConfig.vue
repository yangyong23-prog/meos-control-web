<template>
    <div ref="target" class="groups-container">
        <div v-for="row in groupList" :key="row.key" class="group-item">
            <WeekNumberConfigItem
                v-model:week-numbers="row.weekNumbers"
                v-model:switch="row.rangeSwitch"
                v-model:range-list="row.rangeList"
                :all-week-numbers="allWeekNumbers"
                :prop-key="row.groupId"
                :single-width="props.singleWidth"
                :icon-size="props.iconSize"
                @change="handleWeekNumberChange"
            ></WeekNumberConfigItem>
            <m-tips :disabled="groupList.length === 1" :content="i18n.global.t('meos_control_web.remove_group_for_divide')" placement="top" theme="darkTransparent">
                <div v-show="groupList.length > 1" class="delete-btn-icon" @click="deleteGroup(row)">
                    <IconMeriActionDelete />
                </div>
            </m-tips>
        </div>
    </div>

    <div v-if="showAddGroup" class="btn-icon" @click="addGroup">
        <IconMeriComponentButtonAdd :size="14" :color="'var(--blue-500)'" />
        <span>{{ i18n.global.t('meos_control_web.add_group_for_divide') }}</span>
    </div>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import { nanoid } from 'nanoid';
import { IconMeriActionDelete, IconMeriComponentButtonAdd } from 'meri-icon';
import i18n from '@/localization';
import WeekNumberConfigItem from './WeekNumberConfigItem.vue';

const props = defineProps({
    singleWidth: {
        type: Number,
        default: 192
    },
    iconSize: {
        type: String,
        default: '32px'
    },
    autoScroll: {
        type: Boolean,
        default: true
    }
});

const target = useTemplateRef('target');
const emits = defineEmits(['change']);
const groupList = defineModel({
    type: Array,
    default: () => [
        {
            groupId: `group-${nanoid()}`,
            weekNumbers: [],
            rangeSwitch: 'checked',
            rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }]
        }
    ]
});

const allWeekNumbers = computed(() => {
    return groupList.value.flatMap(v => v?.weekNumbers ?? []);
});
const showAddGroup = computed(() => {
    if (allWeekNumbers.value.length) {
        const hasNotFull = allWeekNumbers.value.length < 7;
        return hasNotFull ? groupList.value.length < 7 : false;
    } else {
        return groupList.value.length < 7;
    }
});

const addGroup = () => {
    const groupId = nanoid();
    const rangeListId = nanoid();
    const newItem = {
        groupId: `add-group-${groupId}`,
        weekNumbers: [],
        rangeSwitch: 'checked',
        rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${rangeListId}` }]
    };
    const newItems = [...groupList.value, newItem];
    groupList.value = newItems;
    emits('change', 'add-group', { row: newItem });
    if (props.autoScroll) {
        nextTick(() => {
            target?.value?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }
};
const deleteGroup = row => {
    const list = groupList.value.filter(it => it.groupId !== row.groupId);
    if (list.length === 0) {
        return;
    }

    groupList.value = list;
    emits('change', 'delete-group', { row });
};

const handleWeekNumberChange = (type, val) => {
    emits('change', type, val);
};
</script>

<style scoped lang="less">
.groups-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.group-item {
    display: flex;
    flex-direction: column;
    padding: 12px;
    border-radius: 4px;
    background: #f7f9fa;
    position: relative;
}
.delete-btn-icon {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 24px;
    height: 24px;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 4px;
    background-color: #e4e7ea;
    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
    }
}

.btn-icon {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;

    color: var(--blue-500);
    width: fit-content;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    height: 32px;

    &:hover {
        background-color: var(--gray-300);
    }
    &.disabled {
        color: var(--gray-400);
        background-color: transparent;
        cursor: not-allowed;
    }
}
</style>
