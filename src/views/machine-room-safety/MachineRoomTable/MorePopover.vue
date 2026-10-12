<template>
    <m-popover ref="morePopoverRef" trigger="click" placement="bottom-end" :show-arrow="false" popover-class="room-more-popover-wrap">
        <template #content>
            <div class="more-list">
                <a
                    v-for="item in eqListPopover"
                    :key="item.templateTypeName"
                    class="more-list-item"
                    :href="'#' + item.templateTypeName"
                    @click.prevent="scrollTo('#' + item.templateTypeName)"
                >
                    <span v-ellipsis class="name">{{ item.templateTypeName }}</span>
                    <span class="count">({{ item.count }})</span>
                </a>
            </div>
        </template>
        <div class="more" :class="{ 'more-active': !isMore }" @click="changeMore">
            {{ i18n.global.t('common.more') }}
            <IconMeriComponentChevronDown v-if="isMore" size="16" color="#8D9399" />
            <IconMeriComponentChevronUp v-else size="16" color="#8D9399" />
        </div>
    </m-popover>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp } from 'meri-icon';
const props = defineProps({
    eqListPopover: {
        type: Array,
        default: () => []
    },
    isMore: {
        type: Boolean,
        default: true
    }
});
const emits = defineEmits(['changeMore', 'scrollTo']);
const morePopoverRef = ref(null);
const scrollTo = anchor => {
    morePopoverRef.value.manuallyHide();
    emits('scrollTo', anchor);
};
const changeMore = () => {
    emits('changeMore');
};
</script>
<style lang="less" scoped>
.more-list {
    max-width: 292px;
    &-item {
        border-radius: 4px;
        padding: 9px 8px;
        color: #1b2129;

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        display: flex;
        align-items: center;
        .name {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .count {
            color: #8b949e;
        }
        &:hover {
            cursor: pointer;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
.more {
    user-select: none;
    margin-right: 2px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 54px;
    border-radius: 4px;
    padding: 5px 4px;
    color: #1b2129;
    cursor: pointer;
    svg {
        margin-left: 2px;
    }
    &:hover {
        background: #e8ecf0;
    }
}
.more-active {
    background: #e8ecf0;
}
</style>
<style lang="less">
.room-more-popover-wrap {
    padding: 4px !important;
}
</style>
