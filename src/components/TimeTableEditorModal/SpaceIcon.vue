<template>
    <div v-if="noTip" class="fcc guan-lian" style="margin-left: 5px" @click.stop="noClick || openSpaceList?.(data)">
        <SvgIcon name="guanlian" />
        <slot></slot>
    </div>
    <m-tips v-else :content="i18n.global.t('meos_control_web.guan_lian_space')" theme="darkTransparent">
        <div class="fcc guan-lian" style="margin-left: 5px" @click.stop="noClick || openSpaceList?.(data)">
            <SvgIcon name="guanlian" />
            <slot></slot>
        </div>
    </m-tips>
</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import i18n from '@/localization';
defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    noClick: {
        type: Boolean,
        default: false
    },
    noTip: {
        type: Boolean,
        default: false
    },
    openSpaceList: Function
});
</script>
<style lang="less" scoped>
.guan-lian {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    cursor: pointer;
    border-radius: 2px;
    &:hover {
        background-color: var(--alpha-30);
    }
}
</style>
