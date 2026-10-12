<template>
    <div class="equipment-list-left h100">
        <div class="left-header fc">
            <m-button type="text" icon="IconMeriComponentChevronLeft" @click="$emit('back')">{{ i18n.global.t('meos_control_web.back') }}</m-button>
            <div class="header-line"></div>
            <b class="fs18">{{ i18n.global.t('meos_control_web.equipment_list') }}</b>
        </div>
        <ClassCodeList v-if="!loadingClassList" />
        <m-list-skeleton v-else style="padding: 8px 12px" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { curClassCodeObjKey } from '../hooks/useBaseHook';
import ClassCodeList from './ClassCodeList.vue';
defineProps({
    floorId: {
        type: String,
        default: ''
    },
    classCode: {
        type: String,
        default: ''
    },
    loadingClassList: {
        type: Boolean,
        default: false
    }
});
const curClassCodeObj = inject(curClassCodeObjKey);
</script>
<style lang="less" scoped>
.equipment-list-left {
    user-select: none;
    background-color: var(--gray-100);
    position: relative;
    z-index: 11;
    .left-header {
        height: 48px;
        padding: 12px 8px;
        border-bottom: 1px solid var(--alpha-30);
        .header-line {
            height: 16px;
            width: 1px;
            background-color: var(--gray-400);
            margin-right: 8px;
        }
    }
    .class-code-list {
        height: calc(100% - 48px);
    }
}
</style>
