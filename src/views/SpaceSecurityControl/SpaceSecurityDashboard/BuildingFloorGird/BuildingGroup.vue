<template>
    <div>
        <div class="build-name" @click="toogleBuildingExpand">
            <span class="open-close-icon" :class="{ close: !buildingOpen }"><Arrow /></span>
            <span class="name">{{ building?.localName ?? '--' }}</span>
        </div>
        <div class="floor-list" :class="{ close: !buildingOpen }">
            <FloorCard v-for="floor in building?.floors" :key="floor.id" :floor="floor"></FloorCard>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Arrow from '@/assets/images/common/arrow.svg';
import FloorCard from './FloorCard.vue';

const props = defineProps({
    building: {
        type: Object,
        default: () => ({})
    }
});

const buildingOpen = ref(true);
const toogleBuildingExpand = () => {
    buildingOpen.value = !buildingOpen.value;
};
</script>
<style lang="less" scoped>
.build-name {
    position: sticky;
    top: 0;
    display: inline-flex;
    gap: 4px;
    align-items: center;
    cursor: pointer;
    padding-bottom: 12px;
    .open-close-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s;
        &.close {
            transform: rotate(-90deg);
        }
    }
    .name {
        color: var(--gray-800);
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 26px;
    }
}

.floor-list {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 12px;
    &.close {
        display: none;
    }
}
.floor-list-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
}

// 媒体查询 1080 以下
@media screen and (max-width: 1080px) {
    .floor-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
// 媒体查询 1080 - 1440
@media screen and (min-width: 1080px) and (max-width: 1440px) {
    .floor-list {
        grid-template-columns: repeat(3, 1fr);
    }
}
// 媒体查询 1440 以上
@media screen and (min-width: 1440px) {
    .floor-list {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
