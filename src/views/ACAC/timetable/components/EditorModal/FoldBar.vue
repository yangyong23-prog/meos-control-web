<template>
    <div class="fold-bar">
        <div class="btn" @click="doOpen">
            {{ open ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}
            <IconMeriComponentChevronUp v-if="open" color="#1B2129" :size="14" /> <IconMeriComponentChevronDown v-else color="#1B2129" :size="14" />
        </div>
        <template v-if="showDel">
            <div class="split-line"></div>
            <m-tips v-if="delDisable" :content="i18n.global.t('meos_control_web.elapsed_time_not_deletable')" trigger="hover" theme="darkTransparent">
                <div class="del-icon disable">
                    <IconMeriActionDelete color="#C4C9CF"></IconMeriActionDelete>
                </div>
            </m-tips>
            <div v-else class="del-icon" @click="doDelete">
                <IconMeriActionDelete></IconMeriActionDelete>
            </div>
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp, IconMeriActionDelete } from 'meri-icon';
const props = defineProps({
    // 展开
    open: {
        type: Boolean,
        default: true
    },
    // 展示删除按钮
    showDel: {
        type: Boolean,
        default: false
    },
    // 禁用删除按钮
    delDisable: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['toggleOpen', 'delete']);
const doDelete = () => {
    if (props.delDisable) {
        return;
    }
    emits('delete');
};
const doOpen = () => {
    emits('toggleOpen');
};
</script>
<style lang="less" scoped>
.fold-bar {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;

    display: flex;
    align-items: center;
    gap: 2px;
    .btn {
        display: flex;
        height: 32px;
        padding: 0px 8px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        gap: 4px;

        color: var(--gray-900, #1b2129);
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        &:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
        * {
            pointer-events: none;
        }
    }

    border-radius: 0px 0px 0px 8px;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    .split-line {
        width: 1px;
        height: 12px;
        background-color: #c4c9cf;
    }
    .del-icon {
        display: flex;
        width: 32px;
        height: 32px;
        padding: 4px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    .disable {
        cursor: not-allowed;
    }
}
</style>
