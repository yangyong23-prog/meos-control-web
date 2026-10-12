<template>
    <div class="status-text-wrap" :class="[{ normal: props.type === 'normal' && text }, { error: props.type === 'error' && text }, { offline: props.type === 'offline' && text }]">
        <!-- <span class="dot"></span> -->
        <span class="text text-hide" :class="{ 'light-loop-control-hover-active': showHover && text }"> {{ text ? text : '--' }} </span>
    </div>
</template>
<script setup>
const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    showHover: {
        type: Boolean,
        default: true
    }
});
</script>
<style lang="less" scoped>
.status-text-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    span {
        display: inline-block;
    }
    .dot {
        height: 6px;
        width: 6px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .text {
        color: @grey-900;

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 24px;
    }
    &.normal {
        .dot {
            background: @green-500;
        }
    }
    &.error {
        .dot {
            background: @red-600;
        }
        .text {
            color: @red-600;
        }
    }
    &.offline {
        .dot {
            background: @grey-400;
        }
        .text {
            color: @grey-400;
        }
    }
}
</style>
