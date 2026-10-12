<template>
    <IconMeriActionEditor
        size="14"
        class="node-slot-icon"
        :class="{ 'node-slot-icon-hover': showActionEditor }"
        @click.stop="$event => handle($event)"
    ></IconMeriActionEditor>
</template>

<script setup>
import { IconMeriActionEditor } from 'meri-icon';
const props = defineProps({
    // 当前编辑item
    rows: {
        type: Object,
        default: () => {}
    },
    // 编辑icon背景色展示
    showActionEditor: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['handle']);
const handle = event => {
    emits('handle', event, props.rows);
};
</script>

<style lang="scss" scoped>
.node-slot-icon {
    width: 20px;
    min-width: 20px;
    max-width: 20px;
    height: 20px;
    min-height: 20px;
    max-height: 20px;
    border-radius: 2px;
    padding: 3px;
    &:hover {
        background: rgb(196 201 207 / 30%);
    }
}
.node-slot-icon-hover {
    background: rgb(196 201 207 / 30%);
}
</style>
