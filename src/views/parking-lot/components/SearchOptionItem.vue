<template>
    <div class="search-option-item-wrapper" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <span v-ellipsis :class="['item-name-base', 'm-ellipsis']" v-html="computedHtml"></span>
        <div class="item-name-suffix">
            <m-button v-if="isHover" type="link">{{
                props?.el?.floorId === props?.curFloorId ? i18n.global.t('meos_control_web.details') : i18n.global.t('meos_control_web.jump_to_floor_to_view')
            }}</m-button>
            <m-tag color="#626C78" bg-color="rgba(196, 201, 207, 0.30)" size="small">{{ props?.el?.floorLocalName || '--' }}</m-tag>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    el: {
        type: Object,
        default: () => ({})
    },
    curFloorId: {
        type: String,
        default: ''
    },
    searchValue: {
        type: String,
        default: ''
    }
});
const isHover = ref(false);

const computedHtml = computed(() => {
    const title = props?.el?.digitalDeliveryName || props?.el?.localName;
    if (!props?.searchValue) {
        return `<span title='${title}'>${props?.el?.localName || '--'}</span>`;
    }
    const res = props?.el?.localName?.replace(props?.searchValue, `<span style="color:var(--primary-color)">${props?.searchValue}</span>`) || '--';
    return `<span title='${title}'>${res}</span>`;
});

const handleMouseEnter = () => {
    isHover.value = true;
};
const handleMouseLeave = () => {
    isHover.value = false;
};
</script>

<style lang="less" scoped>
.search-option-item-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    height: 100%;
    width: 100%;

    .item-name-base {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
    }

    .item-name-suffix {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        column-gap: 4px;
    }
}
</style>
