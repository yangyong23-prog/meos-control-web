<template>
    <div class="left-header fcb">
        <div class="left-content fcc">
            <GraphSelect :options="systemList" :default-graph="currentSystem" @change="handleChangeGraph" />
            <m-popover
                v-if="currentSystem?.diagramBaseObject !== 'project' && currentSystem?.systemId"
                popover-class="detailBtnPopover"
                placement="bottom-start"
                :content="i18n.global.t('meos_control_web.open_in_new_tab')"
                theme="dark"
                :show-arrow="false"
                :enterable="true"
            >
                <m-button
                    :type="viewMode === VIEWMODE.MAPVIEW ? 'text' : 'link'"
                    class="detailBtn"
                    :style="{ color: viewMode === VIEWMODE.MAPVIEW ? '#fff' : undefined }"
                    @click="openSystemDetail"
                    >{{ i18n.global.t('meos_control_web.system_details') }}</m-button
                >
            </m-popover>
        </div>
        <div class="right-content">
            <template v-if="viewMode === VIEWMODE.MAPVIEW">
                <m-select
                    v-if="mapSpaceList?.length > 1"
                    ref="spaceSelect"
                    v-model="currentMapSpaceId"
                    :options="mapSpaceList"
                    :prefix="i18n.global.t('meos_control_web.current_machine_room_colon')"
                ></m-select>
                <div v-if="mapSpaceList?.length === 1" class="map-space-name">
                    <div class="label">{{ i18n.global.t('meos_control_web.current_machine_room_colon') }}</div>
                    <div class="name">{{ currentMapSpaceObj?.localName ?? '--' }}</div>
                </div>
            </template>
            <m-tabs v-model="viewMode" :data="viewModeTabs" type="segment" size="medium">
                <template #name="{ item }">
                    <div :style="{ color: item.id === viewMode ? '#246FE5' : '#1B2129', fontWeight: item.id === viewMode ? 700 : 400 }">
                        {{ item.name }}
                    </div>
                </template>
            </m-tabs>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString, isEdge } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import { VIEWMODE } from '../constant/variables';
import { viewModeKey, systemListKey, currentSystemKey, systemIdKey, mapSpaceListKey, currentMapSpaceObjKey, currentMapSpaceIdKey, RefreshKey } from '../hooks/useStateHook';
import GraphSelect from './graphSelect.vue';
import useStore from '@/store';
const { base } = useStore();
const spaceSelect = ref();
const systemId = inject(systemIdKey);
const systemList = inject(systemListKey);
const currentSystem = inject(currentSystemKey);
const mapSpaceList = inject(mapSpaceListKey);
const currentMapSpaceObj = inject(currentMapSpaceObjKey);
const currentMapSpaceId = inject(currentMapSpaceIdKey);
const viewMode = inject(viewModeKey);
const Refresh = inject(RefreshKey, ref(true));
function handleChangeGraph(graph) {
    systemId.value = graph.systemId;
    currentSystem.value = graph;
    Refresh.value = false;
    nextTick(() => {
        Refresh.value = true;
    });
}
// 视图模式标签
const viewModeTabs = ref([
    {
        id: VIEWMODE.GRAPHCODE,
        name: i18n.global.t('meos_control_web.relationship_view'),
        slotName: 'name'
    },
    {
        id: VIEWMODE.MAPVIEW,
        name: i18n.global.t('meos_control_web.model_view_angle'),
        slotName: 'name'
    }
]);
const openSystemDetail = () => {
    if (currentSystem.value?.systemId) {
        openWebsite(MEOI_INSTANCE_DETAIL, {
            params: `objId=${currentSystem.value?.systemId}&f=MEOI_CatalogList&type=all&${getAuthParamsString()}`,
            newPage: true,
            origin: CLOUD_ORIGIN || ''
        });
    }
};
</script>
<style lang="less" scoped>
.left-header {
    height: 32px;
    position: absolute;
    width: calc(100%);
    top: 16px;
    left: 0;
    z-index: 65;
    .right-content {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 100%;
        .map-space-name {
            display: flex;
            min-width: 56px;
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
            }
            .name {
                overflow: hidden;
                color: var(--Grey-Grey-0, #fff);
                text-overflow: ellipsis;
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 22px; /* 157.143% */
            }
        }
    }
    .detailBtn {
        display: none;
    }
    &:hover {
        .detailBtn {
            display: block;
        }
    }
}
</style>
