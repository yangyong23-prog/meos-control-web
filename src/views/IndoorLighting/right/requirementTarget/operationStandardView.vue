<!--运行标准-->
<template>
    <div class="operation-standard-view">
        <div v-ellipsis class="label meos-ellipsis-line">{{ label }}</div>
        <!-- meos-frame 下隐藏标准配置入口 -->
        <div v-if="hasData && !isMeosFrame()" class="view-standard-btn meos-text-link" @click="gotoStandardConfig">
            {{ i18n.global.t('meos_control_web.view_standard_config') }}
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { isMeosFrame, jumpToLightingDemandManagement } from '@/utils/envUtils';
import i18n from '@/localization';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});

const hasData = computed(() => !!props.data?.templateId);
const label = computed(() => {
    if (hasData.value) {
        return i18n.global.t('meos_control_web.execute_template_standard_today', { templateName: props.data?.templateName ?? '--' });
    }
    return i18n.global.t('meos_control_web.no_lighting_operation_standard_today');
});

const gotoStandardConfig = () => {
    jumpToLightingDemandManagement({
        templateId: props.data?.templateId,
        templateType: props.data?.templateType,
        templateTag: props.data?.templateTag
    });
};
</script>

<style scoped lang="less">
.operation-standard-view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-radius: 4px;
    background: var(--gray-50);
    gap: 8px;

    .label {
        flex: 1;
    }

    .view-standard-btn {
        flex: none;
    }
}
</style>
