<template>
    <div class="total-relate">
        <div class="total-relate-title">
            {{ title }}
        </div>
        <div class="total-relate-list">
            <div
                v-for="item in relates"
                v-show="item.rule || item.id === 'total'"
                :key="item.name"
                class="relate-item"
                :class="{ fc: !onlyModule }"
                :style="{ pointerEvents: item.id === 'total' ? 'none' : '' }"
                @click="openEquipmentList({ runningMonitorSecondType, filter: { [item.infoCode]: [item.dataValue] }, classCode: classCode })"
            >
                <div v-if="!onlyModule" class="relate-item-title">{{ item.name }} &nbsp;</div>
                <div v-ellipsis class="relate-item-value ffCP fw600 m-ellipsis" :class="{ mb8: onlyModule }">
                    <InfoCodeNumber
                        v-if="item.id !== 'total'"
                        v-model="item.list"
                        v-model:rule="item.rule"
                        :objects="data"
                        v-bind="{ ...item, color: '' }"
                        class="fw600 ffCP"
                        style="margin-left: 2px; color: var(--gray-800)"
                    />
                    <template v-else>{{ item.value }}</template>
                </div>
                <div v-if="onlyModule" class="relate-item-title">
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { INFOCODE } from '../../variables';
import InfoCodeNumber from '@/views/IndoorLighting/components/StatusNumber/InfoCodeNumber.vue';
import { openEquipmentListKey } from '@/views/IndoorLighting/hooks/useEquipmentList';
const openEquipmentList = inject(openEquipmentListKey);

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: i18n.global.t('meos_control_web.associated_control_module')
    },
    onlyModule: {
        type: Boolean,
        default: false
    },
    runningMonitorSecondType: {
        type: String,
        default: ''
    }
});

const classCode = computed(() => props.data?.[0]?.classCode);
const relates = ref([
    {
        id: 'total',
        name: i18n.global.t('common.total_count'),
        value: props.data.length || 0
    },
    {
        ...INFOCODE.onlineStatus0,
        list: [],
        rule: false
    },
    {
        ...INFOCODE.faultStatus1,
        list: [],
        rule: false
    }
]);
</script>
<style lang="less" scoped>
.total-relate {
    display: flex;
    flex-direction: column;
    .total-relate-list {
        display: flex;
        gap: 8px;
        .relate-item {
            width: 64px;
            cursor: pointer;
            &-title {
                color: var(--gray-600);
            }
            &:hover {
                .relate-item-title {
                    color: var(--blue-500);
                }
                :deep(.relate-item-value) {
                    .info-code-number {
                        color: var(--blue-500) !important;
                    }
                }
            }
        }
    }
    .total-relate-title {
        margin-bottom: 8px;
    }
}
.total-relate.is-compact {
    .total-relate-list {
        gap: 8px;
        .relate-item {
            width: 56px;
        }
    }
}
</style>
