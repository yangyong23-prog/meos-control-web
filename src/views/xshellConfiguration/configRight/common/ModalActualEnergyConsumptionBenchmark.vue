<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        type="default"
        :title="props.title"
        :width="420"
        :height="115"
        :auto-close="false"
        @close="closeModal"
        @cancel="closeModal"
        @submit="submitModal"
    >
        <template #content>
            <m-radio-group v-model="radioSelected">
                <m-radio v-for="item in radioOptions" :key="item.value" :label="item.value">
                    {{ item.label }}
                </m-radio>
            </m-radio-group>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    title: {
        type: String,
        default: ''
    }
});
const modalValue = defineModel('data', { type: String, default: '' });
const showModal = defineModel('show', { type: Boolean, default: false });

const radioSelected = ref('target');

const radioOptions = [
    {
        label: i18n.global.t('meos_control_web.target_value'),
        value: 'target'
    },
    {
        label: i18n.global.t('meos_control_web.control_value'),
        value: 'control'
    }
];

const closeModal = () => {
    nextTick(() => {
        showModal.value = false;
    });
};

const submitModal = () => {
    try {
        const jsonObj = JSON.parse(modalValue.value || '{}');
        const finalObj = { ...jsonObj, benchmark: radioSelected.value };
        modalValue.value = JSON.stringify(finalObj);
    } catch (err) {
        return;
    }

    closeModal();
};

watch(
    [() => modalValue.value, () => showModal.value],
    () => {
        if (!showModal.value) {
            return;
        }
        if (!modalValue.value) {
            radioSelected.value = 'target';
        } else {
            try {
                const jsonObj = JSON.parse(modalValue.value || '{}');
                const { benchmark } = jsonObj;
                radioSelected.value = benchmark;
            } catch (err) {
                return;
            }
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped></style>
