<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :width="420"
        type="default"
        :title="i18n.global.t('meos_control_web.by_system_service_space')"
        :escable="false"
        @close="close"
    >
        <template #content>
            <div class="row-title">{{ i18n.global.t('meos_control_web.spaces_not_belonging_to_checked_system_blacklisted') }}</div>
            <m-tree v-model="selected" :data="props.treeData" multiple :return-parent-node="false"> </m-tree>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';

const props = defineProps({
    treeData: {
        type: Array,
        default: () => []
    },
    data: {
        type: Array,
        default: () => []
    }
});
const show = ref(false);
const emits = defineEmits(['close', 'confirm']);

const selected = ref([]);

watch(
    () => props.data,
    curList => {
        selected.value = curList;
    },
    {
        immediate: true
    }
);
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
const confirm = () => {
    show.value = false;
    emits('confirm', selected.value);
};
onMounted(() => {
    show.value = true;
});
</script>

<style lang="less" scoped>
.row-title {
    color: var(--gray-500, #8b949e);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 16px;
}
</style>
