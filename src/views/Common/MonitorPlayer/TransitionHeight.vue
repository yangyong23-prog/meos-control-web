<template>
    <Transition v-on="TransitionCb">
        <slot />
    </Transition>
</template>

<script setup>
import { addClass, removeClass } from '@/utils/assist';

const TransitionCb = {
    beforeEnter(el) {
        addClass(el, 'fold-transition');
        if (!el.dataset) el.dataset = {};

        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;

        el.style.height = '0';
        el.style.paddingTop = '0';
        el.style.paddingBottom = '0';
    },

    enter(el) {
        el.dataset.oldOverflow = el.style.overflow;
        el.style.height = el.scrollHeight !== 0 ? el.scrollHeight + 'px' : '';
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;

        el.style.overflow = 'hidden';
    },

    afterEnter(el) {
        // for safari: remove class then reset height is necessary
        removeClass(el, 'fold-transition');
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow;
    },

    beforeLeave(el) {
        if (!el.dataset) el.dataset = {};
        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;
        el.dataset.oldOverflow = el.style.overflow;

        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden';
    },

    leave(el) {
        if (el.scrollHeight !== 0) {
            // for safari: add class after set height, or it will jump to zero height suddenly, weired
            addClass(el, 'fold-transition');
            el.style.height = '0';
            el.style.paddingTop = '0';
            el.style.paddingBottom = '0';
        }
    },

    afterLeave(el) {
        removeClass(el, 'fold-transition');
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow;
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
};
</script>
<style lang="less" scoped>
.fold-transition {
    transition: 0.3s height cubic-bezier(0.25, 0.1, 0.25, 0.1), 0.3s padding-top cubic-bezier(0.25, 0.1, 0.25, 0.1), 0.3s padding-bottom cubic-bezier(0.25, 0.1, 0.25, 0.1);
}
</style>
