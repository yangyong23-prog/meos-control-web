<template>
    <div class="template-three-container">
        <ControlSet2
            :info-codes="controlledParameterSet"
            :object-id="id"
            :set-conditions="controlledParameterSetCondition"
            :forced-control-fn="forcedControlFn"
            :forced-model="forcedModel"
            :system-id="systemId"
        ></ControlSet2>
    </div>
</template>

<script setup>
import ControlSet2 from '@/components/ObjectInfoComponents/ControlSet2/index.vue';
const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: () => ({})
    },
    forcedModel: {
        type: String,
        default: ''
    },
    forcedControlFn: {
        type: Function,
        default: () => {}
    },
    systemId: {
        type: String,
        default: ''
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
.template-three-container {
    :deep(.control-set) {
        .control-set-box {
            border-radius: 8px;
            background-color: var(--gray-50);
        }
        .control-set-item {
            padding: 8px 12px;
            position: relative;
            display: flex;
            flex-direction: row;
            &::after {
                content: '';
                position: absolute;
                top: 0;
                width: calc(100% - 24px);
                left: 12px;
                border-bottom: 1px solid var(--gray-200);
            }
            &:first-child::after {
                display: none;
            }
            &[type='is-manual-auto-set'] {
                margin-bottom: 12px;
                border-radius: 8px;
                &::after {
                    display: none;
                }
            }
            .control-set-item-name {
                display: flex;
            }
        }
    }
}
</style>
