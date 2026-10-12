<template>
    <div class="speed">
        <m-dropdown
            :options="speedOptions"
            :model-value="modelValue"
            :append-to="appendTo"
            theme="darkTransparent"
            placement="top"
            popover-class="speed-popover"
            @option-click="onClick"
        >
            <div class="speed-trigger">{{ i18n.global.t('meos_control_web.playback_speed') }}</div>
        </m-dropdown>
    </div>
</template>

<script setup>
import i18n from '@/localization';
defineProps({
    modelValue: {
        type: [Number, String],
        default: 1
    },
    appendTo: {
        type: String,
        default: 'body'
    }
});

const emits = defineEmits(['update:modelValue', 'change']);

const speedOptions = [
    { key: -8, label: '0.1X' },
    { key: -4, label: '0.25X' },
    { key: -2, label: '0.5X' },
    { key: 1, label: '1.0X' },
    { key: 2, label: '2X' },
    { key: 4, label: '4X' },
    { key: 8, label: '8X' }
];

const onClick = value => {
    emits('update:modelValue', value);
    emits('change', value);
};
</script>

<style lang="scss">
.speed-popover {
    .is-active {
        background: var(--blue-900) !important;
        color: #ffffff !important;
        font-weight: 700 !important;
    }
    .m-scrollbar {
        padding: 0 !important;
    }
    .m-dropdown-item {
        border-radius: 0 !important;
        min-height: 32px !important;
    }
}
</style>

<style lang="less" scoped>
.speed {
    display: flex;
    justify-content: center;
    align-items: center;
    &-trigger {
        font-size: 12px;
        color: #fff;
    }
    :deep(.m-dropdown) {
        width: 42px;
        height: 18px;
        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 5.333px;
        border: 0.667px solid rgb(196 201 207 / 50%);
        padding: 0;
    }
}
</style>
