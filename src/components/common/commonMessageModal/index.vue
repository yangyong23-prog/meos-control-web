<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        :title="i18n.global.t('meos_control_web.failure_list')"
        :width="420"
        :footer="false"
        modal-class-name="message-modal"
        @close="closeModal"
    >
        <template #content>
            <div v-for="item in data" :key="item" class="message-modal-item">
                <span>{{ item?.localName ?? '--' }}</span>
                <m-tag color="#FFF" bg-color="#F55047" size="small">{{ i18n.global.t('meos_control_web.failed') }}</m-tag>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    data: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:modelValue', 'close']);

const showModal = ref(false);

const closeModal = () => {
    showModal.value = false;
    nextTick(() => {
        emit('close');
    });
};
onMounted(() => {
    showModal.value = props.modelValue;
});
</script>

<style lang="less">
.message-modal {
    .m-modal-main-content {
        padding: 16px 24px 24px 24px !important;
        .message-modal-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            color: #1b2129;

            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            height: 22px;
            line-height: 22px;
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
}
</style>
