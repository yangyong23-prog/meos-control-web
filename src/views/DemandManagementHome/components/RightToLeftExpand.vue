<template>
    <div
        :class="{
            'right-to-left-expand-container': true,
            'is-expand': expandModel,
            disabled: props.disableText
        }"
        @click="switchExpand"
    >
        <m-tips :content="`${props.disableText}`" theme="darkTransparent" :disabled="!props.disableText">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    :d="`M5.5286 3.52925C5.78895 3.2689 6.21106 3.2689 6.4714 3.52925C6.73175 3.7896 6.73175
          4.21171 6.4714 4.47206L3.60948 7.33398L11.3333 7.33398C11.7015 7.33398 12 7.63246 12
          8.00065C12 8.36884 11.7015 8.66732 11.3333 8.66732H3.60948L6.4714 11.5292C6.73175 11.7896
          6.73175 12.2117 6.4714 12.4721C6.21106 12.7324 5.78895 12.7324 5.5286 12.4721L1.52859
          8.47206C1.26825 8.21171 1.26825 7.7896 1.52859 7.52925L5.5286 3.52925Z`"
                    fill="#1B2129"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    :d="`M14 2.66602C13.6318 2.66602 13.3333 2.96449 13.3333 3.33268L13.3333 12.666C13.3333
          13.0342 13.6318 13.3327 14 13.3327C14.3681 13.3327 14.6666 13.0342 14.6666 12.666L14.6666
          3.33268C14.6666 2.96449 14.3681 2.66602 14 2.66602Z`"
                    fill="#8B949E"
                />
            </svg>
        </m-tips>
    </div>
</template>

<script setup>
import { defineModel, defineEmits } from 'vue';

const props = defineProps({
    disableText: {
        type: String,
        default: ''
    }
});

const expandModel = defineModel({ type: Boolean, default: true });
const emit = defineEmits(['toggle-expand']);

const switchExpand = () => {
    if (props.disableText) {
        return;
    }
    expandModel.value = !expandModel.value;
    emit('toggle-expand');
};
</script>

<style lang="less" scoped>
.right-to-left-expand-container {
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 33px;
    left: -15px;
    width: 30px;
    height: 30px;

    transform: rotate(0);
    transition: all 0.5s;

    border-radius: 50%;
    background-color: white;

    cursor: pointer;
    box-shadow: 0px 0px 5px 0px #ccc;
    transition: all 0.5s;
    z-index: 102;
    &:hover {
        background-color: var(--blue-500);
        path {
            fill: #fff;
        }
    }

    :deep(.m-popper-trigger) {
        height: 16px;
    }
}

.is-expand {
    transform: rotate(180deg);
    left: -9px;
}

.disabled {
    cursor: not-allowed;

    &:hover {
        background-color: #fff;

        path {
            fill: #c4c9cf;
        }
    }

    path {
        fill: #c4c9cf;
    }
}
</style>
