<template>
    <div v-if="systemList?.length > 0 && headerModelView === VIEW_MODE_3D_GRAPH && currentFloorObj?.id" class="header-container">
        <div class="header-box">
            <div class="left">
                <div v-if="currentFloorObj?.id" class="go-back-wrap">
                    <span class="go-back" @click="goBack"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
                    <span class="name">
                        <span v-if="curBuildingName" v-ellipsis class="m-ellipsis" style="cursor: pointer" @click="goBack">{{ curBuildingName }}/</span>
                        <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
                    </span>
                </div>
                <div v-else class="header-name">{{ i18n.global.t('meos_control_web.pv_system') }}</div>
            </div>
            <div class="right">
                <MapSearch
                    :max-height="488"
                    :current-floor-tag="false"
                    :current-floor-id="currentFloorObj?.id"
                    :clear-change-floor="true"
                    :equips="searchEquips"
                    :loading="spacesAndEquipsLoading"
                    only-type="equipment"
                    @choose="chooseObj"
                    @hover-obj="hoverObj"
                    @unhover-obj="unhoverObj"
                ></MapSearch>
            </div>
        </div>
    </div>
    <Header
        v-show="systemList?.length > 0 && (headerModelView === VIEW_MODE_RELATION_GRAPH || !currentFloorObj?.id)"
        v-model:system-id="systemId"
        v-model:current-system="currentSystem"
        v-model:is-refresh="Refresh"
        v-model:view-mode="headerModelView"
        :system-list="systemList"
        :view-mode-tabs="viewModeTabs"
        :view-mode-type="'icon'"
        :view-mode-disabled-id="viewModeDisabledId"
        :right-time-color="'#626c78'"
        :right-detail-color="'#246FE5'"
        :is-fit-wrap-layout="false"
    >
        <template #right-content>
            <div v-show="headerModelView === VIEW_MODE_3D_GRAPH" class="fcc">
                <MapSearch
                    :max-height="488"
                    :current-floor-tag="false"
                    :current-floor-id="currentFloorObj?.id"
                    :clear-change-floor="true"
                    :equips="searchEquips"
                    :loading="spacesAndEquipsLoading"
                    only-type="equipment"
                    @choose="chooseObj"
                ></MapSearch>
            </div>
        </template>
    </Header>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import useHeaders from './hooks/useHeaders';
import { VIEW_MODE_TABS, VIEW_MODE_3D_GRAPH, VIEW_MODE_RELATION_GRAPH } from '../constants/index';
import { headerModelViewKey, viewModeDisabledIdKey, systemListKey, systemIdKey, currentSystemKey, RefreshKey } from '../hooks/useBaseHook';
import Header from '@/components/systemGraphHeader/index.vue';
defineProps({
    filterOptionData: {
        type: Array,
        default: () => []
    }
});
const viewModeTabs = ref(VIEW_MODE_TABS);
const headerModelView = inject(headerModelViewKey);
const viewModeDisabledId = inject(viewModeDisabledIdKey);
const systemList = inject(systemListKey);
const systemId = inject(systemIdKey);
const currentSystem = inject(currentSystemKey);
const Refresh = inject(RefreshKey);
const emits = defineEmits(['choose', 'hoverObj', 'unhoverObj']);
const { currentFloorObj, searchEquips, spacesAndEquipsLoading, curBuildingName, curFloorName, goBack, chooseObj, hoverObj, unhoverObj } = useHeaders(emits);
</script>

<style lang="less" scoped>
.header-container {
    width: 100%;
    height: 48px;
    z-index: 99;
    position: absolute;
    top: 0;
    left: 0;
    padding: 16px 0px 0 12px;
    .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
            flex: 1;
            min-width: 0;
            align-items: center;
            .header-name {
                color: @grey-800;
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
                line-height: 32px;
            }
        }
        .go-back-wrap {
            flex: 1;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: @grey-900;
            width: 100%;

            .go-back {
                display: inline-flex;
                align-items: center;
                cursor: pointer;

                &:hover {
                    background-color: #c4c9cf;
                }
            }
            .name {
                display: flex;
                min-width: 0;
                align-items: center;
                color: @grey-800;
                font-size: 18px;
                font-weight: 700;
            }
        }
        .right {
            display: flex;
            gap: 8px;

            .check-warp {
                padding: 0px 8px 0px 8px;
                border-radius: 4px;
                background: var(--Grey-Grey-0, #fff);
                box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
            }
        }
    }
}
</style>
