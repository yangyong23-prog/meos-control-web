<template>
    <div class="requirement-box" :style="{ 'margin-right': `${props.marginRight}px` }">
        <RequirementTargetBoxItem v-for="(task, index) in tasks" :key="index" :task="task" :change-handle-data="changeHandleData" v-bind="$attrs" @edit="$emit('edit', task)">
            <template #content="{ task }">
                <slot name="content" :task="task"></slot>
            </template>
        </RequirementTargetBoxItem>
    </div>
</template>

<script setup>
import RequirementTargetBoxItem from './RequirementTargetBoxItem.vue';
const props = defineProps({
    tasks: {
        type: Array,
        default: () => []
    },
    changeHandleData: {
        type: Function,
        default: () => {}
    },
    marginRight: {
        type: Number,
        default: 0
    }
});
</script>
<style lang="less" scoped>
.requirement-box {
}
</style>
