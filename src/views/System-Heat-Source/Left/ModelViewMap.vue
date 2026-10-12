<template>
    <div class="map-view-container">
        <SpaceMapView
            :has-space="mapSpaceList?.length > 0"
            :show="showSpaceMapView"
            :show-detail="showEquipmentInfo"
            :current-space="currentMapSpaceObj"
            :current-equips="space3dSelectData"
            :all-equips="space3dAllData"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            @open-equipment-info="openDetailDrawer"
            @close-equipment-info="closeEquipmentInfo"
        >
            <template #legend="{ pipelineData }">
                <Legend :switch-data="[]" :pipeline-data="pipelineData"></Legend>
            </template>
        </SpaceMapView>
    </div>
</template>

<script setup>
import SpaceMapView from '@/components/SpaceMapView/index.vue';
import Legend from './Legend.vue';
import { viewModeKey } from '../hooks/useBaseHook';
import { openEquipmentInfoKey, closeEquipmentInfoKey, showEquipmentInfoKey } from '../hooks/useLeftHook';
import { mapSpaceListKey, space3dSelectDataKey, currentMapSpaceObjKey, space3dAllDataKey } from '../hooks/useSpaceMapHook';
import { VIEW_MODE, RUNNING_MONITOR_TYPE } from '../constant/variable';

const viewMode = inject(viewModeKey);

const mapSpaceList = inject(mapSpaceListKey);
const space3dAllData = inject(space3dAllDataKey);
const currentMapSpaceObj = inject(currentMapSpaceObjKey);
const space3dSelectData = inject(space3dSelectDataKey);

const showEquipmentInfo = inject(showEquipmentInfoKey);
const openEquipmentInfo = inject(openEquipmentInfoKey);
const closeEquipmentInfo = inject(closeEquipmentInfoKey);

const showSpaceMapView = computed(() => viewMode.value === VIEW_MODE.MAP_VIEW);

const openDetailDrawer = d => {
    openEquipmentInfo(d);
};
</script>

<style lang="less" scoped>
.map-view-container {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
