<template>
    <m-modal v-model:visible="visible" :append-to="$modalAppendTo" :title="modalTitle" width="800px" @cancel="handleCancel" @ok="handleOk">
        <div class="editor-modal-content">
            <slot name="content" :params="params" :on-save="handleSave">
                <div class="editor-form">
                    <div class="form-item">
                        <label class="form-label">{{ t('meos_control_web.schedule_name') }}</label>
                        <m-input v-model="formData.localName" :placeholder="t('common.please_input')" />
                    </div>
                    <div class="form-item">
                        <label class="form-label">{{ t('meos_control_web.schedule_type') }}</label>
                        <m-select v-model="formData.consoleType" :options="consoleTypeOptions" :disabled="!!params.consoleType" />
                    </div>
                    <div class="form-item">
                        <label class="form-label">{{ t('meos_control_web.effective_date') }}</label>
                        <m-date-picker v-model="formData.date" :clearable="false" />
                    </div>
                </div>
            </slot>
        </div>
    </m-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { EditorModalParams, SystemType } from '../../types';

const props = defineProps({
    visible: { type: Boolean, default: false },
    consoleType: { type: String as PropType<SystemType>, default: 'COOL_SUPPLY' },
    systemType: { type: String, default: 'ACAC' },
    objectId: { type: String, default: '' },
    currentDate: { type: String, default: '' }
});

const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
    (e: 'afterSaved'): void;
}>();

const { t } = useI18n();

const params = computed<EditorModalParams>(() => ({
    consoleType: props.consoleType as SystemType,
    objectId: props.objectId,
    currentDate: props.currentDate
}));

const formData = ref({
    localName: '',
    consoleType: props.consoleType,
    date: props.currentDate || new Date().toISOString().split('T')[0]
});

const consoleTypeOptions = computed(() => [
    { label: t('meos_control_web.cooling_supply1'), value: 'COOL_SUPPLY' },
    { label: t('meos_control_web.thermal_storage_cold'), value: 'COOL_INPUT' },
    { label: t('meos_control_web.zone_schedule'), value: 'AIR_TERMINAL_ZONE' }
]);

const modalTitle = computed(() => {
    return formData.value.consoleType ? t('meos_control_web.edit_schedule') : t('meos_control_web.create_new_schedule');
});

watch(
    () => props.consoleType,
    val => {
        formData.value.consoleType = val;
    }
);

watch(
    () => props.currentDate,
    val => {
        if (val) formData.value.date = val;
    }
);

const handleCancel = () => {
    emit('update:visible', false);
};

const handleOk = () => {
    handleSave();
};

const handleSave = () => {
    emit('afterSaved');
    emit('update:visible', false);
};
</script>

<style lang="less" scoped>
.editor-modal-content {
    .editor-form {
        .form-item {
            margin-bottom: 16px;
            .form-label {
                display: block;
                margin-bottom: 8px;
                color: var(--title-color);
                font-weight: 500;
            }
        }
    }
}
</style>
