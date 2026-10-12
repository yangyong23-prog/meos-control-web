<template>
    <div
        :class="{
            'card-container': true,
            'is-hover': isHover
        }"
        :style="{
            'box-shadow': isHover && hoverActive?.hoverBorder ? `inset 0 0 0 2px ${hoverActive?.hoverBorder}` : 'none',
            'background-color': isHover && hoverActive?.hoverBg ? `${hoverActive?.hoverBg}` : undefined
        }"
        @mouseenter="handleMouse(true)"
        @mouseleave="handleMouse(false)"
        @click="abnormalJump(card)"
    >
        <AbnormalCardHeader :card="props.card" :render-name="renderName" :render-tags="renderTags" :is-hover="isHover"></AbnormalCardHeader>
        <div class="card-content">
            <template v-if="showHoverMultiple">
                <AbnormalCardItem
                    v-for="(item, index) in props?.card?.instances || []"
                    :key="index"
                    v-model="isHover"
                    :card="props.card"
                    :show-hover-multiple="showHoverMultiple"
                    :instance-name="item?.instanceName"
                ></AbnormalCardItem>
            </template>
            <AbnormalCardItem v-else v-model="isHover" :card="props.card"></AbnormalCardItem>
        </div>
    </div>
</template>

<script setup>
import AbnormalCardItem from './abnormal-card-item.vue';
import AbnormalCardHeader from './abnormal-card-header.vue';
import { useAbnormalCard } from './useAbnormalCard';
import { abnormalJumpFun } from '@/utils/envUtils';

const props = defineProps({
    card: {
        type: Object,
        default: () => {}
    }
});
const emits = defineEmits(['hover-abnormal-item', 'unhover-abnormal-item']);
const { renderTags, isHover, hoverActive, renderName, showHoverMultiple } = useAbnormalCard(props);

const abnormalJump = item => {
    abnormalJumpFun(item);
};

const handleMouse = isEnter => {
    isHover.value = isEnter;
    if (isEnter) {
        hoverActive.value = renderTags.value?.[0];
        emits('hover-abnormal-item', props.card);
    } else {
        hoverActive.value = {};
        emits('unhover-abnormal-item');
    }
};
</script>

<style lang="less" scoped>
.card-container {
    display: flex;
    flex-direction: column;
    background: #f7f9fa;
    border-radius: 8px;
    transition: all 300ms cubic-bezier(0.25, 0.1, 0.25, 0.1);
    cursor: pointer;
    overflow: hidden;
}

.card-content {
    display: flex;
    flex-direction: column;
}
</style>
<style lang="less">
.abnormal-value-name-ellipsis-class {
    pointer-events: none;
}
</style>
