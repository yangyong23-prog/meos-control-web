<template>
    <TemplateObjectTags :status-data="item" :select-obj="statusData" :template-type="DETAIL" />
</template>
<script setup>
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import { DETAIL } from '@/utils/globalVariables';
const props = defineProps({
    statusData: {
        type: Array,
        default: () => {}
    }
});
const item = computed(() => {
    return props.statusData?.relInfoCodeGroupConfigs?.[0];
});
const equipId = computed(() => {
    return props.statusData.id;
});

useEquipInfoSSEHandle(
    equipId,
    {
        equipStatus: item
    },
    true,
    DETAIL
);
</script>
