<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :escable="false"
        modal-class-name="loop-group-modal"
        type="default"
        :title="`${i18n.global.t('meos_control_web.loop_grouping')} - ${name}`"
        :width="1260"
        :need-scrollbar="false"
        @close="close"
    >
        <template #content="{ maxHeight }">
            <LoopGroupMain
                :style="{ height: maxHeight }"
                :height="maxHeight"
                :func-types="funcTypes"
                :template-type="templateType"
                :func-type-loading="funcTypeLoading"
                :group-list="groupList"
                :active-func-type="activeFuncType"
            />
        </template>
        <template #footer> </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import { useLoopGroupHook } from '../../hooks/useLoopGroupHook';
import LoopGroupMain from './LoopGroupMain.vue';
const props = defineProps({
    templateType: {
        type: String,
        default: ''
    },
    menus: {
        type: Array,
        default: () => []
    }
});

const { funcTypes, funcTypeLoading, groupList, activeFuncType } = useLoopGroupHook(props);
const emits = defineEmits(['close']);
const name = computed(() => {
    const menu = props.menus.find(item => item.id === props.templateType);
    return menu ? menu.name : '';
});
const show = defineModel('show', { type: Boolean, default: false });

const close = () => {
    emits('close');
};
</script>
<style lang="less">
.loop-group-modal.m-modal-bg {
    .m-modal-main .m-modal-main-content {
        padding: 0;
    }
    .m-main-handle {
        display: none;
    }
}
</style>
