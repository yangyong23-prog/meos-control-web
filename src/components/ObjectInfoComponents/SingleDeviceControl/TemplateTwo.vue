<template>
    <div class="template-two-container">
        <ControlSet :show-data-source="showDataSource" :info-codes="controlledParameterSet" :object-id="id" :set-conditions="controlledParameterSetCondition"></ControlSet>
    </div>
</template>

<script setup>
import ControlSet from '@/components/ObjectInfoComponents/ControlSet/index.vue';
const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: () => ({})
    },
    showDataSource: {
        type: Boolean,
        default: false
    }
});
const controlledParameterSet = computed(() => {
    return props.data?.relInfoCodeConfigs || [];
});
const controlledParameterSetCondition = computed(() => {
    return props.data?.groupChildren?.[0]?.relInfoCodeConfigs?.map(item => item.infoCode) || [];
});
</script>
<style lang="less" scoped>
.template-two-container {
    :deep(.control-set) {
        .control-set-divider {
            height: 16px;
        }
        .control-set-box {
            border-radius: 8px;
            background-color: var(--gray-50);
        }
        .control-set-item {
            padding: 8px 12px;
            position: relative;
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                width: calc(100% - 24px);
                left: 12px;
                border-bottom: 1px solid var(--gray-200);
            }
            &:last-child::after {
                display: none;
            }
            &[type='is-manual-auto-set'] {
                margin-bottom: 12px;
                border-radius: 8px;
                &::after {
                    display: none;
                }
            }
            &.not-first-manual-auto-set {
                border-top-right-radius: 8px;
                border-top-left-radius: 8px;
            }
            &:last-child {
                border-bottom-right-radius: 8px;
                border-bottom-left-radius: 8px;
            }
        }
    }
}
</style>
