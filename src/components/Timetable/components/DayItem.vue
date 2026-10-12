<template>
    <div class="day-item">
        <div v-if="showHeader" class="day-item-header">
            <span class="date">{{ formatDate }}</span>
        </div>
        <div class="day-item-content">
            <div v-if="!list || list.length === 0" class="no-data">{{ t('meos_control_web.no_time_table_data') }}</div>
            <div v-else class="item-list">
                <div v-for="(item, idx) in list" :key="idx" class="item-row" @click="handleEdit(item)">
                    <div class="item-info">
                        <span v-ellipsis="{ title: item.localName }" class="item-name m-ellipsis">{{ item.localName }}</span>
                        <span class="item-type">{{ getConsoleTypeLabel(item.consoleType) }}</span>
                    </div>
                    <div class="item-actions">
                        <m-button type="link" size="small" @click.stop="handleEdit(item)">{{ t('common.edit') }}</m-button>
                        <m-button type="link" size="small" @click.stop="handleDelete(item)">{{ t('common.delete') }}</m-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import type { TimetableItem, SystemInfo } from '../types';

const props = defineProps({
    type: { type: String, default: 'month' },
    showHeader: { type: Boolean, default: true },
    list: { type: Array as PropType<TimetableItem[]>, default: () => [] },
    systemInfo: { type: Object as PropType<SystemInfo>, required: true }
});

const emit = defineEmits<{
    (e: 'editBtn', params: any): void;
    (e: 'delBtn', id: string): void;
}>();

const { t } = useI18n();

const formatDate = computed(() => {
    if (props.list && props.list.length > 0) {
        return dayjs(props.list[0].date).format('MM.DD');
    }
    return '';
});

const getConsoleTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        COOL_SUPPLY: t('meos_control_web.cooling_supply1'),
        COOL_INPUT: t('meos_control_web.thermal_storage_cold'),
        AIR_TERMINAL_ZONE: t('meos_control_web.zone_schedule')
    };
    return labels[type] || type;
};

const handleEdit = (item: TimetableItem) => {
    emit('editBtn', { consoleType: item.consoleType, currentDate: item.date, objectId: item.id });
};

const handleDelete = (item: TimetableItem) => {
    emit('delBtn', item.id);
};
</script>

<style lang="less" scoped>
.day-item {
    height: 100%;
    display: flex;
    flex-direction: column;

    .day-item-header {
        padding: 12px;
        border-bottom: 1px solid #e1e5eb;
        .date {
            font-weight: 700;
            color: var(--title-color);
        }
    }

    .day-item-content {
        flex: 1;
        overflow-y: auto;

        .no-data {
            padding: 20px;
            text-align: center;
            color: var(--notes-color);
        }

        .item-list {
            .item-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px;
                border-bottom: 1px solid #e1e5eb;
                cursor: pointer;
                &:hover {
                    background: #f5f7fa;
                }
                &:last-child {
                    border-bottom: none;
                }

                .item-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    .item-name {
                        color: var(--title-color);
                        font-weight: 500;
                    }
                    .item-type {
                        color: var(--notes-color);
                        font-size: 12px;
                    }
                }

                .item-actions {
                    display: flex;
                    gap: 8px;
                }
            }
        }
    }
}
</style>
