<template>
    <m-scrollbar box-class="floor-spaces-statistic-wrapper">
        <m-list-skeleton v-if="loading" />
        <template v-else-if="spaceList.length">
            <TitleWithPrefix :title="i18n.global.t('meos_control_web.space_passenger_flow_statistics')" />
            <div class="spaces-container">
                <template v-for="(space, index) in spaceList" :key="index">
                    <SpaceItem :space="space" @click-space="clickSpace" @hover-space="hoverSpace" @unhover-space="unhoverSpace" />
                </template>
            </div>
        </template>
        <div v-else class="empty-container">
            <Empty />
        </div>
    </m-scrollbar>
</template>

<script setup>
import i18n from '@/localization';
import TitleWithPrefix from '../components/TitleWithPrefix.vue';
import { spacePassengerFlowDataInjectKey, currentFloorObjInjectKey } from '../constant/injectKey';
import Empty from '@/components/common/Empty.vue';
import SpaceItem from './SpaceItem.vue';

const currentFloorObj = inject(currentFloorObjInjectKey);
const spacePassengerFlowData = inject(spacePassengerFlowDataInjectKey);

const emits = defineEmits(['click-space', 'hover-space', 'unhover-space']);

const loading = ref(false);

const spaceList = computed(() => {
    const allFloors = spacePassengerFlowData?.value?.flatMap(v => {
        const { floors = [], ...buildRest } = v || {};
        return floors?.map(f => ({ ...buildRest, ...f }));
    });
    const curFloorId = currentFloorObj?.value?.floorId;
    const curFloorSpaces = allFloors?.find(f => f.floorId === curFloorId)?.spaces;
    return curFloorSpaces?.map(s => {
        const { objectId, objectName } = s || {};
        // TODO 待接入SSE更新信息点数据
        return {
            ...s,
            spaceId: objectId,
            id: objectId,
            spaceName: objectName,
            name: objectName
        };
    });
});

watch(
    () => spaceList.value,
    cur => {
        loading.value = true;
        if (cur?.length) {
            loading.value = false;
        }
    },
    {
        immediate: true
    }
);

const clickSpace = space => {
    emits('click-space', space);
};
const hoverSpace = space => {
    emits('hover-space', space);
};
const unhoverSpace = () => {
    emits('unhover-space');
};
</script>

<style lang="less" scoped>
:deep(.floor-spaces-statistic-wrapper) {
    padding-top: 20px;
    padding-inline: 16px;
    padding-bottom: 20px;
}

.spaces-container {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}

.empty-container {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
}
</style>
