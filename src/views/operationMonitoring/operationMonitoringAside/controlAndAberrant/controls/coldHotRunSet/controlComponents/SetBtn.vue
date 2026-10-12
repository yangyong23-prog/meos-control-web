<template>
    <SetButton v-if="controlItem.runStatus" type="link" size="small" @click="(el, e) => openControlPop(e, controlItem)">
        {{ btnText(controlItem) }}
    </SetButton>
    <SetDiv v-else-if="btnText(controlItem)" :disabled="true" :content="content">
        {{ btnText(controlItem) }}
    </SetDiv>
</template>

<script setup>
import SetButton from '@/components/common/SetButton.vue';
import SetDiv from '@/components/common/SetDiv.vue';
import { btnText } from '@/utils/tools';
defineProps({
    controlItem: {
        type: Object,
        default: () => ({})
    },
    content: String
});

const openControlPop = inject('openControlPop');
</script>
<style lang="less" scoped>
.btn-disabled {
    cursor: not-allowed;
    color: var(--gray-400);
    padding: 0 4px;
}
</style>
