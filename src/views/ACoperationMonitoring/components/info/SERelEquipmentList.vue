<template>
    <RelatedRelationships
        :data="groupList"
        :select-obj="selectObj"
        :use-expand="false"
        :name-can-select="false"
        :loading="loading"
        :running-monitor-type="runningMonitorType"
        :use-internal="false"
    ></RelatedRelationships>
</template>
<script setup>
import RelatedRelationships from '@/views/Common/RelatedRelationships/index.vue';
import useSERelEquips from '../../hooks/useSERelEquips';

const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const { groupList, loading } = useSERelEquips(props);
</script>
