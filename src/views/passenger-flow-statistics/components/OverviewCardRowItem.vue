<template>
    <div
        :class="{ 'overview-card-row-item-wrapper': true, 'can-select': props.canSelect, 'is-selected': props.isSelected, 'size-large': props.size === 'large' }"
        @click="handleClick(item)"
    >
        <div v-ellipsis :class="['label', 'm-ellipsis']">{{ props.item.name ?? '--' }}</div>
        <div class="left">
            <span>{{ i18n.global.t('meos_control_web.entry') }}</span
            ><span class="count">{{ props.item.inCount }}</span>
        </div>
        <div class="separator"></div>
        <div class="right">
            <span>{{ i18n.global.t('meos_control_web.exit') }}</span> <span class="count">{{ props.item.outCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    canSelect: {
        type: Boolean,
        default: false
    },
    isSelected: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: 'normal'
    }
});

const emits = defineEmits(['toggle-select']);

const handleClick = computed(() => (item: any) => {
    if (props.canSelect) {
        emits('toggle-select', item);
    }
});
</script>

<style lang="less" scoped>
.overview-card-row-item-wrapper {
    display: flex;
    align-items: center;
    column-gap: 8px;
    cursor: default;
}

.label {
    width: 70px;
    text-align: left;
    color: @grey-800;
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
}

.left,
.right {
    width: 104px;
    text-align: left;

    color: @grey-500;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: 24px;
    display: flex;
    column-gap: 8px;
}

.count {
    color: @grey-900;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: 24px;
}

.separator {
    width: 1px;
    height: 12px;
    background: #d9d9d9;
}

.can-select {
    cursor: pointer;
    padding: 10px 8px;

    &:hover {
        border-radius: 4px;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
}

.is-selected {
    border-radius: 4px;
    background: @blue-100;

    &:hover {
        background: @blue-100;
    }

    .label,
    .left,
    .right,
    .count {
        color: @blue-500;
    }
}

.size-large {
    .label {
        width: fit-content;
        font-size: 18px;
        line-height: 26px;
    }
    .left,
    .right {
        width: fit-content;
        font-size: 16px;
    }
    .count {
        width: fit-content;
        font-size: 16px;
    }
}
</style>
