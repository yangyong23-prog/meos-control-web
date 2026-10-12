<template>
    <m-modal v-model:visible="show" :append-to="$modalAppendTo" type="default" :title="i18n.global.t('meos_control_web.failure_list')" :width="420" @close="close">
        <template #content>
            <div v-for="(error, index) in errorList" :key="index" class="error-list-item">
                <div v-ellipsis class="error-list-item-name m-ellipsis">
                    {{ error.localName }}
                </div>
                <div class="error-list-item-tag">
                    <m-tag color="#fff" bg-color="#F55047" size="small">{{ i18n.global.t('meos_control_web.failed') }}</m-tag>
                </div>
            </div>
        </template>
        <template #footer> </template>
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
    &-name {
        width: calc(100% - 36px);
        display: inline-block;
    }
    &-tag {
        width: 32px;
        display: inline-block;
    }
}
</style>
