<template>
    <div class="header-container">
        <div class="header-box">
            <div class="left">
                <div class="go-back-wrap">
                    <span class="go-back" @click="goBack"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
                    <span class="name">
                        <span v-if="curBuildingName" v-ellipsis class="m-ellipsis" style="cursor: pointer" @click="goBack">{{ curBuildingName }}/</span>
                        <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
                    </span>
                </div>
            </div>
            <div class="right">
                <m-checkbox :model-value="showCameraRef" @change="showCameraChange">{{ i18n.global.t('meos_control_web.view_camera') }}</m-checkbox>
                <m-tree-select
                    v-model="curSelectedClasscode"
                    multiple
                    searchable
                    panel-searchable
                    has-confirm
                    :size="184"
                    menu-size="300"
                    :data="filterOptionData"
                    :max-scroll-height="362"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.system_filter')"
                    clearable
                ></m-tree-select>
                <MapSearch
                    :max-height="488"
                    :current-floor-tag="false"
                    :equips="equipsInFloor"
                    :equip-filter-fn="equipFilterFn"
                    :loading="spacesAndEquipsLoading"
                    only-type="equipment"
                    @choose="chooseObj"
                    @hover-obj="hoverObj"
                    @unhover-obj="unhoverObj"
                ></MapSearch>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import useHeaders from './hooks/useHeaders';

defineProps({
    filterOptionData: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['choose', 'hoverObj', 'unhoverObj']);
const {
    showCameraRef,
    equipsInFloor,
    spacesAndEquipsLoading,
    curSelectedClasscode,
    curBuildingName,
    curFloorName,
    equipFilterFn,
    goBack,
    showCameraChange,
    chooseObj,
    hoverObj,
    unhoverObj
} = useHeaders(emits);
</script>

<style lang="less" scoped>
.header-container {
    width: 100%;
    height: 48px;
    position: absolute;
    top: 0;
    left: 0;
    padding: 16px 16px 0 12px;
    padding-right: 0px;
    .header-box {
        display: flex;
        justify-content: space-between;
        .go-back-wrap {
            flex: 1;
            display: inline-flex;
            padding: 0px 16px 0px 4px;
            align-items: center;
            gap: 4px;
            color: @grey-900;

            .go-back {
                display: inline-flex;
                align-items: center;
                cursor: pointer;
            }
            .name {
                display: flex;
                align-items: center;
                color: @grey-800;
                font-size: 18px;
                font-weight: 700;
            }
        }
        .right {
            display: flex;
            gap: 8px;
        }
    }
}
</style>
