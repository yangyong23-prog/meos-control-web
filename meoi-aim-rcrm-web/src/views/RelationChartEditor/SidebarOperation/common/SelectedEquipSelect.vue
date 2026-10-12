<template>
    <div class="selected-equip-select" :class="{ 'is-dropdown-enabled': canExpandDropdown }">
        <m-select
            ref="spaceSelectRef"
            :model-value="modelValue"
            :options="selectOptions"
            value-key="id"
            label-key="name"
            multiple
            :mode="selectMode"
            has-confirm
            has-check-all
            :max-tag-count="1"
            :max-scroll-height="220"
            :disabled="isSelectDisabled"
            :size="300"
            :menu-size="300"
            :max-tag-width="244"
            placeholder="请选择"
            @update:model-value="updateValue"
            @confirm="handleConfirm"
        />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { $Message } from 'meri-plus';

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    options: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'change']);

const spaceSelectRef = ref(null);
const selectOptions = computed(() => {
    return props.options.map(item => ({
        ...item,
        id: item.value,
        name: item.label
    }));
});

const selectMode = computed(() => {
    return props.options.length > 1 ? 'multiple' : 'tags';
});

const canExpandDropdown = computed(() => props.options.length > 1 && !props.disabled);

const isSelectDisabled = computed(() => !canExpandDropdown.value);

const updateValue = value => {
    const nextValue = Array.isArray(value) ? value : [];
    emit('update:modelValue', nextValue);
};

const handleConfirm = value => {
    if (!value?.length) {
        console.log('value?.length: ', value?.length);
        updateValue([...props.modelValue]);
        $Message.Default({ title: '请至少选择一项' });
        spaceSelectRef.value?.focus();
        return;
    }
    const nextValue = Array.isArray(value) ? value : [];
    emit('change', nextValue);
};
</script>

<style lang="scss" scoped>
.selected-equip-select {
    width: 300px;
    :deep(.m-select) {
        position: relative;
        width: 300px;
        height: 32px;
        box-sizing: border-box;
        font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
    }
    :deep(.m-select-inner) {
        width: 300px !important;
        min-height: 32px;
        height: 32px;
        padding: 5px 28px 5px 12px;
        background: #e9edf1;
        border: 1px solid #c4c9cf;
        border-radius: 4px;
        box-sizing: border-box;
    }
    :deep(.m-select-inner[data-active='true']) {
        border-color: #246fe5;
        background: #ffffff;
    }
    &.is-dropdown-enabled {
        :deep(.m-select-inner) {
            background: #ffffff;
            border-color: #246fe5;
            cursor: pointer;
        }
        :deep(.m-select-icon) {
            color: #246fe5;
        }
    }
    :deep(.m-select-inner[data-disabled='true']) {
        background: #e9edf1;
        border-color: #c4c9cf;
        cursor: not-allowed;
    }
    :deep(.m-select-inner-tags) {
        display: flex;
        flex: 1;
        align-items: center;
        min-width: 0;
        height: 22px;
        overflow: hidden;
    }
    :deep(.m-select-tag) {
        display: inline-flex;
        align-items: center;
        max-width: 244px;
        height: 24px;
        padding: 1px 0;
        margin: 0;
        background: transparent;
        border: 0;
        border-radius: 0;
        box-sizing: border-box;
        color: #1b2129;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
    }
    :deep(.m-select-tag-content) {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 22px;
    }
    :deep(.m-select-tag-icon) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        margin-left: 4px;
        color: #2e3742;
    }
    :deep(.m-select-inner-multiple) {
        display: inline-flex;
        align-items: center;
        min-width: 0;
        height: 22px;
        color: #1b2129;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
    }
    :deep(.m-select-inner-multiple-num) {
        color: #246fe5;
        font-weight: 700;
        padding: 0 2px;
    }
    :deep(.m-select-icon) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-left: 0;
        color: #c4c9cf;
        position: absolute;
        top: 8px;
        right: 8px;
    }
    :deep(.m-select-placeholder) {
        color: #8b949e;
        font-size: 14px;
        line-height: 22px;
    }
}
</style>
