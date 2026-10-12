<template>
    <div class="air-cold-left-header fcb">
        <div class="fcc left-content" style="gap: 4px">
            <GraphSelect class="graphSelect" :options="systemList" :default-graph="currentSystem" @change="handleChangeGraph" />
            <span v-if="systemId && currentOperatingMode.dataValue !== undefined" v-ellipsis class="condition m-ellipsis">
                {{ i18n.global.t('meos_control_web.current_operating_mode_colon') }}{{ getValueStr(currentOperatingMode).text }}
            </span>
            <div v-if="base.getShowUpdateTime" class="ft update-time update-time-text" :class="viewMode === MapView ? 'update-time-abs' : ''">
                {{ i18n.global.t('meos_control_web.update_time_colon') }}{{ base.headerConfig.startTime || '--' }}
            </div>
            <m-popover
                v-if="currentSystem?.diagramBaseObject !== 'project' && currentSystem?.systemId"
                popover-class="detailBtnPopover"
                placement="bottom-start"
                :content="i18n.global.t('meos_control_web.open_in_new_tab')"
                theme="dark"
                :show-arrow="false"
                :enterable="true"
            >
                <m-button type="link" class="detailBtn" @click="openSystemDetail">{{ i18n.global.t('meos_control_web.system_details') }}</m-button>
            </m-popover>
        </div>

        <div class="right-content" style="align-items: end">
            <div v-show="viewMode === MapView" class="fcc">
                <EquipSelect
                    :max-width="maxWidth"
                    size="auto"
                    :space-id="currentMapSpaceObj?.id"
                    :system-id="systemId"
                    :style="{ marginRight: '8px' }"
                    @select-change="selectChange"
                    @all-data="alldata"
                ></EquipSelect>
                <m-select
                    v-if="mapSpaceList?.length > 1"
                    ref="select"
                    v-model="currentMapSpaceId"
                    :max-width="maxWidth"
                    size="auto"
                    :options="mapSpaceList"
                    :prefix="i18n.global.t('meos_control_web.current_machine_room_colon')"
                ></m-select>
                <div v-if="mapSpaceList?.length === 1" class="map-space-name">
                    <div class="label">{{ i18n.global.t('meos_control_web.current_machine_room_colon') }}</div>
                    <div class="name">{{ currentMapSpaceObj?.localName ?? '--' }}</div>
                </div>
            </div>
            <div class="map-tab">
                <m-tabs v-model="viewMode" :data="viewModeTabs" type="segment">
                    <template #name="{ item }">
                        <div class="m-tabs-name" :style="{ color: item.id === viewMode ? '#246FE5' : '#1B2129', fontWeight: item.id === viewMode ? 700 : 400 }">
                            {{ item.name }}
                        </div>
                    </template>
                </m-tabs>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { openWebsite } from '@/utils/websiteNavigation';
import { MapView } from '@/views/ACAC/variables';
import EquipSelect from '@/views/ACAC/components/EquipSelect/index.vue';
import {
    currentSystemKey,
    systemListKey,
    systemIdKey,
    RefreshKey,
    viewModeKey,
    viewModeTabsKey,
    mapSpaceListKey,
    currentMapSpaceObjKey,
    currentMapSpaceIdKey,
    space3dSelectDataKey,
    space3dAllDataKey
} from '../hooks/useBaseHook';
import GraphSelect from './GraphSelect.vue';
import { getAuthParamsString } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import DockSingleton from '@/hooks/responsiveDock';
import { CURRENT_OPERATING_MODE } from '../variables';
import { getValueStr } from '@/utils/tools';
import useStore from '@/store';
const { base } = useStore();
const systemList = inject(systemListKey);
const { getIotData } = DockSingleton.getInstance();
const viewMode = inject(viewModeKey);
const viewModeTabs = inject(viewModeTabsKey);
const systemId = inject(systemIdKey);
const currentSystem = inject(currentSystemKey);
const Refresh = inject(RefreshKey, ref(true));
const mapSpaceList = inject(mapSpaceListKey);
const currentMapSpaceObj = inject(currentMapSpaceObjKey);
const currentMapSpaceId = inject(currentMapSpaceIdKey);
const space3dSelectData = inject(space3dSelectDataKey);
const space3dAllData = inject(space3dAllDataKey);
const currentOperatingMode = computed(() => {
    return getIotData(systemId.value, CURRENT_OPERATING_MODE);
});

const maxWidth = ref(130);
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
const selectChange = data => {
    space3dSelectData.value = data;
};
const alldata = data => {
    space3dAllData.value = data;
};
function handleChangeGraph(graph) {
    systemId.value = graph.systemId;
    currentSystem.value = graph;
    Refresh.value = false;
    nextTick(() => {
        Refresh.value = true;
    });
}
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
.SPACE_3D_GRAPH .update-time-text {
    color: @white !important;
}
.SPACE_3D_GRAPH .detailBtn {
    color: @white !important;
}

@media screen and (max-width: 1920px) {
    .update-time-abs {
        position: absolute;
        top: 32px;
        left: 16px;
    }
}

@media screen and (min-width: 1440px) {
    .graphSelect {
        max-width: 200px;
    }
    .condition {
        max-width: 160px;
    }
}
@media screen and (max-width: 1440px) {
    .graphSelect {
        max-width: 140px;
    }
    .condition {
        max-width: 126px;
    }
}

.air-cold-left-header {
    height: 32px;
    position: absolute;
    width: calc(100%);
    top: 16px;
    left: 0;
    z-index: 65;

    .left-content {
        position: relative;

        .condition {
            color: #1b4acc;
            background-color: #d9ebff;
            border-radius: 4px;
            padding: 0 8px;
            font-size: 14px;
            line-height: 20px; /* 157.143% */
        }

        .update-time {
            white-space: nowrap;
        }
    }

    .right-content {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 100%;

        .map-tab {
            :deep(.m-tabs-name) {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
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
