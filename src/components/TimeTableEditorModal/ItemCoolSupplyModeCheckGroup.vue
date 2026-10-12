<template>
    <m-form-item :label="label" label-width="140px" class="cooling-mode">
        <m-checkbox-group v-model="coolingMode">
            <div class="check-list">
                <m-checkbox v-for="item in coolingModeOptions" :key="item.value" :disabled="disabled" :label="item.value">
                    {{ item.label }}
                </m-checkbox>
            </div>
        </m-checkbox-group>
    </m-form-item>
</template>
<script setup>
const props = defineProps({
    label: {
        type: String,
        default: ''
    },

    coolingModeOptions: {
        type: Array,
        default: () => []
    },
    defaultData: {
        type: Object,
        default: () => null
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
const coolingMode = defineModel({ type: String, default: '' });

const getValue = () => {
    return coolingMode.value;
};

defineExpose({
    getValue
});
</script>
