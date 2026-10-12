<template>
    <div class="system-other">
        <div class="title-name fcb">
            {{ i18n.global.t('meos_control_web.manual_batch_control') }}
            <m-button type="link" @click="handleOpenEquipmentList">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
        </div>
        <SystemAutoSet />
        <template v-if="automaticResetArr.length">
            <div class="title-name" style="margin-top: 12px">{{ i18n.global.t('meos_control_web.auto_control_cum_runtime_reset') }}</div>
            <div v-for="(item, index) in automaticResetArr" :key="index" class="automatic-item" style="padding-top: 8px">
                <AutomaticReset :data="item" />
            </div>
        </template>
        <DisabilityAlarmReset v-if="disabilityAlarmReset.groupCode" class="mt12" :data="disabilityAlarmReset" :system-data="currentSystem" :sse="sseConsoleClient" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import SystemAutoSet from '@/views/ACAC/components/SystemAutoSet.vue';
import AutomaticReset from '@/views/ACAC/components/AutomaticReset.vue';
import DisabilityAlarmReset from '@/components/systemInfo/DisabilityAlarmReset/index.vue';
import { sseConsoleClientKey } from '../../../hooks/useRightHook';
import { openEquipmentListKey, showSystemInfoKey, systemIdKey } from '@/views/ACAC/hooks/useBaseHook';
defineProps({
    automaticResetArr: {
        type: Array,
        default: () => []
    },
    disabilityAlarmReset: {
        type: Object,
        default: () => ({})
    },
    currentSystem: {
        type: Object,
        default: () => ({})
    }
});
const sseConsoleClient = inject(sseConsoleClientKey);
const openEquipmentList = inject(openEquipmentListKey);
const showSystemInfo = inject(showSystemInfoKey, ref(false));
const systemId = inject(systemIdKey);
const handleOpenEquipmentList = () => {
    openEquipmentList(null, [systemId.value], ['ACVVEJ', 'ACVVEO'], true, () => {
        // 关闭设备列表时，如果系统设置已关闭，则恢复打开系统设置
        if (!showSystemInfo.value) {
            showSystemInfo.value = true;
        }
    });
};
</script>
<style lang="less" scoped>
.system-other {
    .title-name {
        padding-left: 12px;
        position: relative;
        color: var(--gray-800);
        font-size: 16px;
        font-weight: 700;
        &::after {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            width: 3px;
            height: 14px;
            background: var(--blue-500);
            content: '';
        }
    }
}
</style>
