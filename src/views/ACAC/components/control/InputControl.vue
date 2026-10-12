<template>
    <div class="input-control">
        <div v-ellipsis class="input-control-title m-ellipsis">{{ data.infoCodeName }}</div>
        <SetAndActual
            :data="data"
            :disabled="disabled"
            :disabled-text="disabledText"
            :disabled-no-value="disabledNoValue"
            :set-value-always="setValueAlways"
            :active-set-form-data="activeSetFormData"
            @open-set-form="openSetForm"
        />
    </div>
</template>

<script setup>
import SetAndActual from './SetAndActual.vue';
defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    disabled: {
        type: Boolean,
        default: false
    },
    disabledText: {
        type: String,
        default: ''
    },
    disabledNoValue: {
        type: Boolean,
        default: false
    },
    setValueAlways: {
        type: Boolean,
        default: false
    },
    activeSetFormData: {
        type: Object,
        default: () => ({})
    }
});
const emit = defineEmits(['openSetForm']);
const openSetForm = e => {
    emit('openSetForm', e);
};
</script>
<style lang="less" scoped>
.input-control {
    &-title {
        height: 24px;
        line-height: 24px;
    }
    &-times {
        background-color: var(--gray-200);
        border-radius: 4px;
        padding: 2px 4px;
        color: var(--gray-600);
        margin-left: 4px;
    }
}
</style>
