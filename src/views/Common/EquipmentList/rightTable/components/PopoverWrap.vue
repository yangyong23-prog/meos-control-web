<template>
    <div>
        <m-popover
            ref="popoverRef"
            :trigger="trigger"
            :placement="placement"
            :offset="offset"
            :is-open="true"
            :disabled="disabled"
            popover-class="parameter-determination-tips-wrap"
            @click-event="clickEvent"
        >
            <template #content>
                <slot name="content"></slot>
            </template>
            <slot></slot>
        </m-popover>
    </div>
</template>

<script setup>
const props = defineProps({
    trigger: {
        type: String,
        default: 'click'
    },
    placement: {
        type: String,
        default: 'bottom-start'
    },
    offset: {
        type: Number,
        default: 8
    },
    visible: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

watch(
    () => props.visible,
    v => {
        if (!v) {
            popoverRef.value.manuallyHide();
        }
    },
    {
        deep: true
    }
);

const popoverRef = ref();
const clickEvent = () => {
    popoverRef.value.manuallyOpen();
};
</script>
