<template>
    <template v-if="useDrawer">
        <m-drawer :append-to="$drawerAppendTo" :show="drawerStatus" drawer-class="common-drawer-box" :z-index="zIndex" @close="close">
            <template #title>
                <slot name="title"></slot>
            </template>
            <template #content>
                <slot name="content"></slot>
            </template>
        </m-drawer>
    </template>
    <div v-else style="height: 100%">
        <slot name="title"></slot>
        <slot name="content"></slot>
    </div>
</template>
<script setup>
import { Z_INDEX } from '@/constants/zIndex';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },

    useDrawer: {
        type: Boolean,
        default: true
    },
    zIndex: {
        type: Number,
        default: Z_INDEX.commonDrawer
    }
});

const emits = defineEmits(['update:modelValue', 'close']);

const close = () => {
    drawerStatus.value = false;
    emits('close');
};

const drawerStatus = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});
</script>
<style lang="less">
@media screen and (min-width: 1600px) {
    .common-drawer-box {
        .m-drawer-container {
            width: 480px !important;
        }
    }
    // .title-text {
    //     max-width: 310px;
    // }
    .title-tag {
        max-width: 356px;
    }
    .text-name-item {
        max-width: 100px;
    }
}
@media screen and (max-width: 1600px) {
    .common-drawer-box {
        .m-drawer-container {
            width: 400px !important;
        }
    }
    // .title-text {
    //     max-width: 290px;
    // }
    .title-tag {
        max-width: 280px;
    }
    .text-name-item {
        max-width: 47px;
    }
}

.common-drawer-box {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
    .m-drawer-container-header {
        height: auto;
        border-bottom: none;
        padding: 16px 24px 12px 24px;
        align-items: flex-start;
    }

    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
        height: 100%;
    }

    .drawer-tabs-box {
        .m-tabs-list {
            height: 42px;
            line-height: 1;
        }
        .m-tabs-name {
            line-height: 1;
        }
    }
}
</style>
