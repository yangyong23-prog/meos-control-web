<template>
    <div class="date-item">
        <div v-for="(item, idx) in list.list" :key="idx" class="item-row" @click="handleEdit(item)">
            <template v-if="item">
                <div v-ellipsis="{ title: item.localName }" class="item-name m-ellipsis">{{ item.localName }}</div>
                <div class="item-actions">
                    <m-button type="link" size="small" @click.stop="handleEdit(item)">{{ t('common.edit') }}</m-button>
                    <m-button type="link" size="small" @click.stop="handleDelete(item)">{{ t('common.delete') }}</m-button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CalendarDay, TimetableItem, SystemInfo } from '../types';

const props = defineProps({
    list: { type: Object as PropType<CalendarDay>, required: true },
    systemInfo: { type: Object as PropType<SystemInfo>, required: true }
});

const emit = defineEmits<{
    (e: 'editBtn', params: any): void;
    (e: 'delBtn', id: string): void;
}>();

const { t } = useI18n();

const handleEdit = (item: TimetableItem) => {
    emit('editBtn', { consoleType: item.consoleType, currentDate: item.date, objectId: item.id });
};

const handleDelete = (item: TimetableItem) => {
    emit('delBtn', item.id);
};
</script>

<style lang="less" scoped>
.date-item {
    .item-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        border-bottom: 1px solid #e1e5eb;
        cursor: pointer;
        &:hover {
            background: #f5f7fa;
        }
        &:last-child {
            border-bottom: none;
        }
    }
    .item-name {
        flex: 1;
        color: var(--title-color);
    }
    .item-actions {
        display: flex;
        gap: 8px;
    }
}
</style>
