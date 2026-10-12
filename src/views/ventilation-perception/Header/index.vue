<template>
    <div class="header-wrapper">
        <div v-if="!floorView || headerModelView === 'list'" class="header-icon">
            <img class="img" :src="ventIcon" alt="header-icon" />
            <span class="header-name">{{ templateName || '' }}{{ i18n.global.t('common.meos_home_ventilation') }}</span>
        </div>
        <div v-else class="go-back-wrap">
            <span class="go-back" @click="goBack"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
            <span class="name">
                <template v-if="currentBuidingNum > 1 && buildingLocalName">
                    <span v-ellipsis class="building-name m-ellipsis">{{ buildingLocalName }}</span
                    >/
                </template>
                <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
            </span>
        </div>
        <div class="right-content">
            <template v-if="headerModelView === 'list'">
                <m-select
                    :model-value="currentBuildingModel"
                    :options="buildingFloorSpacesStaticTree"
                    :max-scroll-height="362"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.building_colon')"
                    :size="180"
                    class="select-box"
                    @change="chooseFloor"
                >
                </m-select>
                <div class="widget-card" :style="{ paddingInline: '8px' }">
                    <m-checkbox v-model="dashboardOnlyShowIOTMonitorSpaceCheck">{{ i18n.global.t('meos_control_web.iot_monitored_space') }}</m-checkbox>
                </div>
                <m-select
                    v-model="dashboardAbnormalSpaceFilter"
                    class="select-box"
                    clearable
                    :size="180"
                    :options="abnormalList"
                    :max-scroll-height="362"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.abnormal_space_colon')"
                ></m-select>
            </template>
            <map-header v-else @search-choose-obj="searchChooseObj" />
            <HeaderModelSwitch
                v-if="!floorView"
                :list="subTabsList"
                :default-tab="headerModelView"
                :disabled-id="headerModelSwitchDisabledId"
                @grid-tab-change="onGridTabChange"
                @grid-sub-tab-change="onGridSubTabChange"
            />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ventIcon from '@/assets/imgs/header-icon.png';
import HeaderModelSwitch from '@/views/Common/HeaderModelSwitch.vue';
import MapHeader from '../components/header.vue';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import { buildingFloorSpacesStaticTreeKey, headerModelViewKey, floorFromeKey, mapStaticDataLoadingKey } from '../constant/symbols';
import { dashboardOnlyShowIOTMonitorSpaceInjectKey, dashboardAbnormalSpaceFilterInjectKey, dashboardCurrentEnvInjectKey } from '../hooks/useDashboard';
const props = defineProps({
    templateName: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['grid-sub-tab-change', 'grid-tab-change', 'searchChooseObj']);

const floorFrome = inject(floorFromeKey);
const headerModelView = inject(headerModelViewKey);
const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);
const buildingFloorSpacesStaticTree = inject(buildingFloorSpacesStaticTreeKey);
const dashboardAbnormalSpaceFilter = inject(dashboardAbnormalSpaceFilterInjectKey);
const dashboardOnlyShowIOTMonitorSpace = inject(dashboardOnlyShowIOTMonitorSpaceInjectKey);
const mapStaticDataLoading = inject(mapStaticDataLoadingKey);
const subTabsList = inject('subTabsList');
const abnormalList = inject('abnormalList');
const currentBuidingNum = inject('currentBuidingNum');
const currentFloorObj = inject('currentFloorObj');
const currentBuildingObj = inject('currentBuildingObj');

const currentBuildingModel = computed(() => {
    if (currentBuildingObj?.value?.id) {
        return currentBuildingObj?.value?.id;
    } else {
        return buildingFloorSpacesStaticTree?.value?.[0]?.id;
    }
});

const goBack = () => {
    currentFloorObj.value = null;
    if (floorFrome.value === 'dashboard') {
        headerModelView.value = 'list';
        floorFrome.value = '';
    }
};

const floorView = computed(() => {
    return !!currentFloorObj.value?.id;
});

const headerModelSwitchDisabledId = computed(() => {
    return mapStaticDataLoading.value ? 'model' : '';
});

const dashboardOnlyShowIOTMonitorSpaceCheck = computed({
    get() {
        return dashboardOnlyShowIOTMonitorSpace.value ? 'checked' : 'uncheck';
    },
    set(val) {
        dashboardOnlyShowIOTMonitorSpace.value = val === 'checked';
    }
});

const buildingLocalName = computed(() => {
    if (currentFloorObj.value) {
        return `${currentFloorObj.value.buildingLocalName || currentBuildingObj?.value?.name || '--'}`;
    }
    return '';
});

const curFloorName = computed(() => {
    const n = currentFloorObj?.value?.floorLocalName || currentFloorObj?.value?.localId || currentFloorObj?.value?.localName || '--';
    return n ? i18n.global.t('meos_control_web.floor_num', { floor: n }) : '';
});

const chooseFloor = id => {
    if (currentBuildingObj.id && id === currentBuildingObj.id) return;
    const obj = buildingFloorSpacesStaticTree.value.find(item => item.id === id);
    currentBuildingObj.value = obj;
};
const onGridTabChange = item => {
    emit('grid-tab-change', item);
};

const onGridSubTabChange = item => {
    // emit('grid-sub-tab-change', item);
    dashboardCurrentEnv.value = item;
};

const searchChooseObj = item => {
    emit('searchChooseObj', item);
};
</script>

<style lang="less" scoped>
.header-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 0px 10px;

    .header-icon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        column-gap: 6px;

        .img {
            width: 44px;
            height: 44px;
        }

        .header-name {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px;
        }
    }
    .go-back-wrap {
        flex: 1;
        overflow: hidden;
        display: inline-flex;
        height: 40px;
        padding: 0px 16px 0px 4px;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        border-radius: 4px;
        // background: linear-gradient(90deg, rgba(98, 108, 120, 0.08) 0%, rgba(181, 200, 222, 0.08) 100%);

        font-size: 14px;
        color: @grey-700;
        cursor: pointer;
        z-index: 20;

        &.dark {
            background: linear-gradient(90deg, rgba(181, 200, 222, 0.16) 0%, rgba(98, 108, 120, 0.16) 100%);
            color: @white;
        }

        .go-back {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
        }

        .line {
            width: 1px;
            height: 16px;
            background-color: @grey-400;
        }
        .name {
            display: flex;
            flex: 1;
            overflow: hidden;
            color: @grey-800;
            text-align: center;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            .building-name {
                min-width: 20px;
            }
        }
    }

    .right-content {
        display: flex;
        align-items: center;
        column-gap: 8px;
        position: relative;
        .widget-card {
            border-radius: 4px;
            background: #fff;
            display: grid;
            place-items: center;
            height: 32px;
            border: 1px solid #c4c9cf;
        }
    }
}
</style>
<style lang="less">
.right-content {
    .select-box {
        border-radius: 4px;
        background: #ffffff;
    }
}
.m-select-menu-content {
    min-height: 58px !important;
}
</style>
