<template>
    <div ref="cardBox" class="group-info" :style="{ width: `${data.width || 360}px`, fontSize: `${data.fontSize || 24}px` }">
        <GroupList is-iot :data="data" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import GroupList from './groupList.vue';

const props = defineProps({
    isIot: {
        type: Boolean,
        default: true
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    },
    data: {
        type: Object,
        default: () => {}
    }
});
const cardBox = ref(null);
</script>
<style lang="less" scoped>
.group-info {
    border-radius: 8px;
    padding: 12px;
    border: 1px solid #e1e5eb;
    background: rgb(255 255 255 / 80%);
    color: #424c59;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
