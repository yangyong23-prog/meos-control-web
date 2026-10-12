<template>
    <div :id="infoPointData?.id" v-ellipsis class="group-name m-ellipsis" :style="outStyle">
        {{ infoPointData.title }}
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    infoPointData: {
        type: Object,
        default: () => ({})
    }
});
const outStyle = computed(() => {
    const { fontSize } = props.infoPointData;
    return {
        fontSize: `${fontSize}px`
    };
});
</script>
<style lang="scss" scoped>
.group-name {
    margin: 0 2px;
    padding: 1px 2px;
    border-radius: 1.16px;
    background: #d9ebff;
    user-select: none;
    text-align: center;
    color: #246fe5;

    @include text-ellipsis;
}
</style>
