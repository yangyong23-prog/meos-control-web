<template>
    <div class="list-container">
        <template v-for="groupItem in list" :key="groupItem.id">
            <template v-if="groupItem.isBuilding">
                <div v-if="groupItem.children" class="building-item" @click="switchBuildingOpen(groupItem)">
                    <IconMeriComponentArrowDown v-show="buildingOpened[groupItem.id]" color="#8B949E" size="16" />
                    <IconMeriComponentArrowRight v-show="!buildingOpened[groupItem.id]" color="#8B949E" size="16" />
                    {{ groupItem.buildingLocalName }}
                </div>
                <div v-show="buildingOpened[groupItem.id]" class="w100">
                    <SpaceItem v-for="obj in groupItem.children" :key="obj.id" :space="obj" v-bind="$attrs"> </SpaceItem>
                </div>
            </template>
            <SpaceItem v-else :key="groupItem.id" :space="groupItem" v-bind="$attrs"> </SpaceItem>
        </template>
    </div>
</template>
<script setup>
import SpaceItem from './SpaceItem.vue';
import { IconMeriComponentArrowDown, IconMeriComponentArrowRight } from 'meri-icon';
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
});
const buildingOpened = ref({});
watch(
    () => props.list,
    () => {
        props.list?.forEach(building => {
            if (building.isBuilding) {
                if (buildingOpened.value[building.id] === undefined) {
                    buildingOpened.value[building.id] = true;
                }
            }
        });
    },
    { immediate: true }
);
const switchBuildingOpen = building => {
    buildingOpened.value[building.id] = !buildingOpened.value[building.id];
};
</script>
<style lang="less" scoped>
.list-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;

    .building-item {
        display: flex;
        width: 100%;
        height: 28px;
        align-items: center;
        gap: 4px;
        cursor: pointer;

        color: var(--gray-500, #8b949e);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */

        &:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
</style>
