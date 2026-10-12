<template>
    <div class="fc" style="cursor: pointer" :disabled="disabled" @click="click">
        <div class="title-checkbox fcc" :class="{ 'is-active': data }" :disabled="disabled">
            <IconMeriComponentCheckboxDone v-if="data" :size="16" color="#fff" />
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
import { IconMeriComponentCheckboxDone } from 'meri-icon';
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['change']);
const data = defineModel({ type: Boolean, default: false });
const click = () => {
    if (props.disabled) return;
    data.value = !data.value;
};
watch(
    () => data.value,
    val => {
        emit('change');
    }
);
</script>
<style lang="less" scoped>
.title-checkbox {
    height: 16px;
    width: 16px;
    background-color: var(--gray-0);
    border-radius: 2px;
    margin-right: 8px;
    border: 1px solid var(--gray-500);
    &.is-active {
        background-color: var(--blue-500);
        border: 1px solid var(--blue-500);
    }
    &[disabled='true'] {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--gray-400);
        border-color: var(--gray-400);
    }
}
</style>
