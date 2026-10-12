<template>
    <div v-for="(items, indexs) in list" :key="indexs" class="access-recognizer">
        {{ items.localName ?? '--' }}
        <independentSetting :list="settings" :select-obj="list?.[0]" />
    </div>
</template>
<script setup>
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import independentSetting from '@/components/independentSetting/index.vue';
import { DETAIL } from '@/utils/globalVariables';
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const equipmentId = computed(() => {
    return props.list?.[0]?.id;
});
const settings = computed(() => {
    return props.list.find(item => item.relInfoCodeGroupConfigs)?.relInfoCodeGroupConfigs?.[0];
});
useEquipInfoSSEHandle(
    equipmentId,
    {
        equipParameterSet: settings
    },
    true,
    DETAIL
);
</script>
<style lang="less" scoped>
.access-recognizer {
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;
    background: #f7f9fa;
    border: 1px solid #f7f9fa;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}
</style>
