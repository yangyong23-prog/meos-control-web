<template>
    <m-modal v-model:visible="show" :append-to="$modalAppendTo" type="default" :title="i18n.global.t('meos_control_web.failure_list')" :width="600" @close="close">
        <template #content>
            <div v-for="(error, index) in errorList" :key="index" v-ellipsis class="error-list-item m-ellipsis">
                {{ error.localName }}<span class="error-list-item-message">({{ error.message }})</span>
            </div>
            <div style="height: 16px"></div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click.stop="close">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';

defineProps({
    errorList: {
        type: Array,
        default: () => []
    }
});
const show = ref(false);
const emits = defineEmits(['close']);
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};

onMounted(() => {
    show.value = true;
});
</script>
<style lang="less" scoped>
.error-list-item {
    height: 22px;
    line-height: 22px;
    & + .error-list-item {
        margin-top: 16px;
    }
    .error-list-item-message {
        color: var(--gray-600);
    }
}
</style>
