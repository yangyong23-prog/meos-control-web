<template>
    <m-drawer :append-to="$drawerAppendTo" :show="delayShow" :drawer-class="props.drawerClass" :z-index="props.zIndex" @close="close">
        <template #title>
            <slot name="title"></slot>
        </template>
        <template #content>
            <slot name="content"></slot>
        </template>
    </m-drawer>
</template>
<script setup>
const props = defineProps({
    zIndex: {
        type: Number,
        default: 55
    },
    drawerClass: {
        type: String,
        default: 'simple-drawer-box'
    }
});

const drawerStatus = defineModel({
    type: Boolean,
    default: false
});

const close = () => {
    drawerStatus.value = false;
};

const delayShow = ref(false);

watch(
    drawerStatus,
    newVal => {
        nextTick(() => {
            delayShow.value = newVal;
        });
    },
    {
        immediate: true
    }
);
</script>
<style lang="less">
@media screen and (min-width: 1600px) {
    .simple-drawer-box {
        .m-drawer-container {
            width: 480px !important;
        }
    }
}
@media screen and (max-width: 1600px) {
    .simple-drawer-box {
        .m-drawer-container {
            width: 400px !important;
        }
    }
}

.simple-drawer-box {
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
        padding: 16px 24px 12px 24px;
        align-items: center;
    }

    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
        height: 100%;
        position: relative;
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
