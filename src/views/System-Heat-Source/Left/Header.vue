<template>
    <Header
        v-show="systemList?.length > 0"
        v-model:system-id="systemId"
        v-model:current-system="currentSystem"
        v-model:is-refresh="Refresh"
        v-model:view-mode="viewMode"
        :system-list="systemList"
        :view-mode-tabs="viewModeTabs"
        :view-mode-type="'icon'"
        :view-mode-disabled-id="viewModeDisabledId"
        :right-time-color="'#fff'"
        :right-detail-color="'#fff'"
        :is-fit-wrap-layout="false"
    >
        <template #right-content>
            <div
                v-show="viewMode === VIEW_MODE.MAP_VIEW"
                class="right-content"
            >
                <EquipSelect
                    :max-width="maxWidth"
                    size="auto"
                    :space-id="currentMapSpaceObj?.id"
                    :system-id="systemId"
                    @init="handleInit"
                    @select-change="selectChange"
                    @all-data="allData"
                ></EquipSelect>
                <m-select
                    v-if="(mapSpaceList?.length ?? 0) > 1"
                    ref="select"
                    v-model="currentMapSpaceId"
                    :max-width="maxWidth"
                    size="auto"
                    :options="mapSpaceList"
                    :prefix="i18n.global.t('meos_control_web.current_machine_room_colon')"
                ></m-select>
                <div
                    v-if="mapSpaceList?.length === 1"
                    class="map-space-name"
                >
                    <span class="label">{{ i18n.global.t('meos_control_web.current_machine_room_colon') }}</span>
                    <span
                        v-ellipsis
                        class="m-ellipsis name"
                        >{{ mapSpaceList[0]?.localName ?? '--' }}</span
                    >
                </div>
            </div>
        </template>
    </Header>
</template>
<script setup>
import i18n from '@/localization';
import { VIEW_MODE } from '../constant/variable';

import { viewModeKey, systemListKey, currentSystemKey, systemIdKey, refreshFlagKey, viewModeDisabledIdKey, isAbnormalIdsAllLoadedKey } from '../hooks/useBaseHook';
import { mapSpaceListKey, currentMapSpaceObjKey, currentMapSpaceIdKey, space3dSelectDataKey, space3dAllDataKey } from '../hooks/useSpaceMapHook';
import Header from '@/components/systemGraphHeader/index.vue';
import EquipSelect from '../components/equip-select/index.vue';

const systemId = inject(systemIdKey);
const systemList = inject(systemListKey);
const currentSystem = inject(currentSystemKey);
const mapSpaceList = inject(mapSpaceListKey);
const currentMapSpaceObj = inject(currentMapSpaceObjKey);
const currentMapSpaceId = inject(currentMapSpaceIdKey);
const space3dSelectData = inject(space3dSelectDataKey);
const space3dAllData = inject(space3dAllDataKey);
const viewMode = inject(viewModeKey);
const Refresh = inject(refreshFlagKey, ref(true));
const viewModeDisabledId = inject(viewModeDisabledIdKey);
const isAbnormalIdsAllLoaded = inject(isAbnormalIdsAllLoadedKey);

const maxWidth = ref(130);
const handleInit = () => {
    if (isAbnormalIdsAllLoaded) {
        isAbnormalIdsAllLoaded.model = false;
    }
};
const selectChange = data => {
    space3dSelectData.value = data;
};
const allData = data => {
    space3dAllData.value = data;
    if (isAbnormalIdsAllLoaded) {
        isAbnormalIdsAllLoaded.model = true;
    }
};

// 视图模式标签
const viewModeTabs = ref([
    {
        id: VIEW_MODE.GRAPH_CODE,
        name: i18n.global.t('meos_control_web.relationship_view'),
        slotName: 'name'
    },
    {
        id: VIEW_MODE.MAP_VIEW,
        name: i18n.global.t('meos_control_web.model_view_angle'),
        slotName: 'name'
    }
]);

let resizeObserver = null;
onMounted(() => {
    resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        const { width } = contentRect;
        if (width < 1440) {
            maxWidth.value = 32;
        } else if (width > 1600) {
            maxWidth.value = 132;
        } else {
            maxWidth.value = 72;
        }
    });

    resizeObserver.observe(document.body);
});
onUnmounted(() => {
    resizeObserver?.stop?.();
});
</script>
<style lang="less" scoped>
.right-content {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
}

.map-space-name {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .label {
        color: var(--Grey-Grey-0, #fff);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        opacity: 0.8;
        min-width: fit-content;
    }
    .name {
        overflow: hidden;
        color: var(--Grey-Grey-0, #fff);
        text-overflow: ellipsis;

        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;

        max-width: 500px;
    }
}
</style>
