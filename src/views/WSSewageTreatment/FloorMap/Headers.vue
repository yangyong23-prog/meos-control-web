<template>
    <div class="header-container">
        <div class="header-box">
            <div class="left">
                <div class="go-back-wrap">
                    <span class="go-back" @click="goBack"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
                    <span class="name">
                        <span v-if="curBuildingName" v-ellipsis class="m-ellipsis">{{ curBuildingName }}/</span>
                        <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
                    </span>
                </div>
            </div>
            <div class="right">
                <m-select
                    v-model="curSelectedClasscode"
                    multiple
                    :size="184"
                    :options="mapClasscodeOptions"
                    :max-scroll-height="362"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.equipment_filter_colon')"
                    clearable
                ></m-select>
                <MapSearch
                    class="right-search"
                    :current-floor-tag="false"
                    :equips="curFloorMapEquips"
                    :equip-filter-fn="equipFilterFn"
                    :loading="spacesAndEquipsLoading"
                    only-type="equipment"
                    @choose="chooseObj"
                ></MapSearch>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import { currentFloorObjInjectKey, mapClasscodeOptionsKey, curSelectedClasscodeKey, spacesAndEquipsLoadingInjectKey, curFloorMapEquipsKey, mapRefKey } from '../constant/injectKey';
import MapSearch from '@/views/Common/MapSearch/index.vue';

const currentFloorObj = inject(currentFloorObjInjectKey);
const curSelectedClasscode = inject(curSelectedClasscodeKey);
const mapClasscodeOptions = inject(mapClasscodeOptionsKey);
const curFloorMapEquips = inject(curFloorMapEquipsKey);
const spacesAndEquipsLoading = inject(spacesAndEquipsLoadingInjectKey);
const filterEquipmentClass = inject('filterEquipmentClass');
const mapRef = inject(mapRefKey); // ==> src\views\WSSewageTreatment\hooks\useBaseData.js

const curBuildingName = computed(() => {
    return `${currentFloorObj?.value?.buildingLocalName || ''}`;
});
const curFloorName = computed(() => {
    return `${currentFloorObj?.value?.localId || ''}`;
});
const goBack = () => {
    currentFloorObj.value = null;
};
const floorView = computed(() => {
    return !!currentFloorObj.value?.id;
});
const equipFilterFn = equipData => {
    let flag = true;
    // if (filterEquipmentClass.value && filterEquipmentClass.value.classCode !== equipData.classCode) {
    //     flag = false;
    // }

    // if (flag && floorView.value && onlyShowControlledEquipment.value && !equipData.controlled) {
    //     flag = false;
    // }

    // if (flag && currentTab.value === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
    //     flag = isEquipAbnormal(equipData?.tag);
    // }

    return flag;
};
const chooseObj = (obj, type) => {
    mapRef?.value?.clickMapObj(obj);
};
</script>

<style lang="less" scoped>
.header-container {
    width: 100%;
    height: 48px;
    position: absolute;
    top: 0;
    left: 0;
    padding: 16px 16px 0 12px;
    padding-right: 16px;
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
            .right-search {
                margin-left: 8px;
            }
        }
    }
}
</style>
