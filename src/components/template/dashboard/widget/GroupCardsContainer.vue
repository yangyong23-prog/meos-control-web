<template>
    <div
        :id="`group_${group?.id}`"
        :class="{ 'group-cards-container': true, 'fit-layout-group': props.fitLayout, 'is-row-fill': props.isRowFill }"
        :style="{ '--group-filter-cards-count': group?.cards?.length ?? 0 }"
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
    >
        <slot name="group-info" :group-data="group" :hover-group="hoverGroup" />
        <div v-if="group?.cards?.length" class="cards-list">
            <div v-for="card in group?.cards" :key="card?.id" class="card-content-wrapper">
                <slot name="card-info" :card-data="card" :hover-group="hoverGroup" />
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    group: {
        type: Object,
        default: () => {}
    },
    fitLayout: {
        type: Boolean,
        default: false
    },
    isRowFill: {
        type: Boolean,
        default: false
    }
});
const hoverGroup = ref(false);

const onmouseenter = () => {
    hoverGroup.value = true;
};
const onmouseleave = () => {
    hoverGroup.value = false;
};
</script>
<style lang="less" scoped>
.group-cards-container {
    .cards-list {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .card-wrapper {
        border-radius: 8px;
        background: #f9fcff;
    }
}

.fit-layout-group,
.is-row-fill {
    display: grid;
    margin: 0;

    .cards-list {
        width: 100%;
        display: grid;
        gap: 12px;

        .card-content-wrapper {
            width: unset;
        }
    }
}

.fit-layout-group {
    grid-column-end: span var(--row-cards-show-count);

    .cards-list {
        grid-template-columns: repeat(var(--row-cards-show-count), minmax(0, 1fr));
    }
}

.is-row-fill {
    grid-column-end: span min(var(--group-filter-cards-count), var(--row-cards-show-count));

    .cards-list {
        grid-template-columns: repeat(min(var(--group-filter-cards-count), var(--row-cards-show-count)), minmax(0, 1fr));
    }
}
</style>
