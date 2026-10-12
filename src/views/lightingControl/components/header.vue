<template>
    <div class="publicLightingMap-header">
        <div v-if="curFloorId" class="go-back-wrap" :class="{ dark: !publicControl }" @click="goBackBuilding()">
            <span class="go-back"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
            <span class="building-floor-mark-txt">
                <span v-if="curBuildingName && currentBuidingNum > 1" class="builfing-name">{{ curBuildingName }}</span
                ><span v-if="curBuildingName && currentBuidingNum > 1" class="split-name-txt">/</span><span class="floor-name-txt">{{ curFloorName }}</span>
            </span>
        </div>

        <div v-else class="left-box">
            <template v-if="headerModelView === 'model'">
                <!-- <img src="@/assets/imgs/header-icon.png" alt="" /> -->
                <!-- <div class="title" :style="{ color: publicControlVisible ? '#2e3742' : '#FFF' }">{{ templateName }}照明</div> -->

                <div v-if="menuData.length > 1" :class="['title', publicControlVisible ? 'indoor' : 'outdoor']" :style="{ color: publicControlVisible ? '#2e3742' : '#FFF' }">
                    <m-dropdown v-model="templateType" :text="templateName" :options="menuData" :show-arrow="false" trigger="click" @change="dropdownChange"> </m-dropdown>
                </div>

                <div v-else>
                    <div class="title" :style="{ color: publicControlVisible ? '#2e3742' : '#FFF' }">{{ templateName }}</div>
                </div>
            </template>
            <template v-else>
                <div class="title">{{ i18n.global.t('meos_control_web.lighting_monitoring') }}</div>
            </template>
        </div>
        <div class="right-box">
            <template v-if="headerModelView === 'model'">
                <div class="tab">
                    <m-tabs v-model="currentTabs" :data="stateList" size="small" type="segment"></m-tabs>
                </div>
                <div class="right-select">
                    <m-cascader
                        v-if="currentTabs === 'openCloseStatus'"
                        v-model="currentLampFuncTypes"
                        :disabled="showSpaceInfo || showModuleInfo || showBuildingInfo"
                        check-strictly
                        :trigger="'hover'"
                        :value-key="'key'"
                        :label-key="'value'"
                        style="background: #ffffff; border-radius: 4px"
                        width="240"
                        :options="circuitInfoCodes"
                        :caption="i18n.global.t('meos_control_web.function_luminaire')"
                        clearable
                    >
                    </m-cascader>
                    <m-select
                        v-else-if="currentTabs === 'abnormalStatus'"
                        v-model="currentAbnormalValue"
                        :disabled="showSpaceInfo || showModuleInfo || showBuildingInfo"
                        :options="abnormalList"
                        :size="240"
                        :prefix="i18n.global.t('meos_control_web.abnormal_type_colon')"
                        clearable
                    >
                        <m-option v-for="item in abnormalList" :key="item.id" :value="item.id" :label="item.name">
                            <div style="padding: 8px 0">
                                {{ item.name }}
                                <div
                                    v-if="item.id === 'EQUIPMENT_STATUS_ABNORMAL'"
                                    style="color: #8b949e; font-size: 12px; font-style: normal; font-weight: var(--platform-font-weight); height: 22px; margin-top: 4px"
                                >
                                    {{ i18n.global.t('meos_control_web.loop_module_offline_or_control_mismatch') }}
                                </div>
                            </div>
                        </m-option>
                    </m-select>
                    <m-select
                        v-else
                        v-model="currentIntervenedValue"
                        :disabled="showSpaceInfo || showModuleInfo || showBuildingInfo"
                        :options="intervenedList"
                        :size="240"
                        :prefix="i18n.global.t('meos_control_web.intervention_type_colon')"
                        clearable
                    >
                    </m-select>
                    <MapSearch
                        v-if="publicControl"
                        :spaces="currentSpaceData"
                        :loading="loadingSpaceData"
                        :space-filter-fn="spaceFilterFn"
                        :current-floor-id="curFloorId"
                        only-type="space"
                        @choose="chooseObj"
                    ></MapSearch>
                </div>
            </template>
            <weather v-else />
            <HeaderModelSwitch v-if="isIndoorOutdoor && !curFloorId" :disabled-id="disabledTabId" :default-tab="headerModelView" :list="[]" @grid-tab-change="onGridTabChange" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import useMapTabs from '@/views/lightingControl/hooks/useMapTabs';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import HeaderModelSwitch from '@/views/Common/HeaderModelSwitch.vue';
import weather from './weather.vue';
const props = defineProps({
    publicControl: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(['searchChooseObj', 'dropChange']);
const currentTabs = inject('currentTabs');
const currentLampFuncTypes = inject('currentLampFuncTypes');
const currentAbnormalValue = inject('currentAbnormalValue');
const currentIntervenedValue = inject('currentIntervenedValue');
const currentSpaceData = inject('currentSpaceData', ref([]));
const loadingSpaceData = inject('loadingSpaceData', ref(false));
const menuData = inject('menuData');
const { stateList, abnormalList, intervenedList, circuitInfoCodes } = useMapTabs(props);
const curFloorId = inject('curFloorId');
const curFloorName = inject('curFloorName');
const curBuildingName = inject('curBuildingName');
const currentBuidingNum = inject('currentBuidingNum');

// 标题
const templateName = inject('templateName');
const templateType = inject('templateType');
const showSpaceInfo = inject('showSpaceInfo');
const showModuleInfo = inject('showModuleInfo');
const showBuildingInfo = inject('showBuildingInfo');
const publicControlVisible = inject('publicControlVisible');
const headerModelView = inject('headerModelView');
const isIndoorOutdoor = inject('isIndoorOutdoor');
const mapMounte = inject('mapMounte');
const isFloor = inject('isFloor');
const dashboardTemplateType = inject('dashboardTemplateType');
const getCurFilterLampType = () => {
    let code = currentLampFuncTypes?.value;
    if (code) {
        const arr = code.split('/');
        if (arr[0] === 'funcTypes') {
            code = arr?.length > 2 ? arr[2] : '';
        } else {
            code = arr?.length > 1 ? arr[1] : '';
        }
    }
    return code;
};
const callToggleWidth = inject('callToggleWidth');
const onGridTabChange = item => {
    callToggleWidth(true);
    dashboardTemplateType.value = '';
    headerModelView.value = item;
};
const disabledTabId = computed(() => {
    if (!mapMounte.value) return 'model';
    return '';
});
const goBackBuilding = () => {
    curFloorId.value = '';
    if (isFloor.value) {
        headerModelView.value = 'list';
        isFloor.value = false;
    }
    showSpaceInfo.value = false;
    showModuleInfo.value = false;
};

const dropdownChange = (val, option) => {
    // templateType.value = option.key;
    // templateName.value = option.label;
    callToggleWidth(true);
    emits('dropChange', option);
};
const spaceFilterFn = spaceData => {
    let flag = true;
    if (currentTabs.value === 'abnormalStatus') {
        if (currentAbnormalValue.value && !spaceData.abnormalStatuses?.some(code => code === currentAbnormalValue.value)) {
            flag = false;
        }
    } else if (currentTabs.value === 'intervenedStatus') {
        if (currentIntervenedValue.value && !spaceData.interventionTypes?.includes(currentIntervenedValue.value)) {
            flag = false;
        }
    } else if (currentTabs.value === 'openCloseStatus') {
        if (!spaceData.openCloseStatus) {
            flag = false;
        } else if (currentLampFuncTypes?.value) {
            const curFilterLampType = getCurFilterLampType();
            if (spaceData.lampFuncTypes?.indexOf(curFilterLampType) < 0) {
                flag = false;
            }
        }
    }
    return flag;
};

const chooseObj = (obj, type) => {
    emits('searchChooseObj', obj, type);
};

watch(
    () => publicControlVisible?.value,
    val => {
        publicControlVisible.value = val;
        console.log('publicControlVisible;;;', val);
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.outdoor {
    :deep(.m-dropdown) {
        .dropdown-text:hover {
            background-color: transparent !important;
        }
        .m_svg_class .fill_color {
            fill: white;
        }
    }
}
.indoor {
    :deep(.m-dropdown) {
        .dropdown-text:hover {
            background-color: transparent !important;
        }
        .m_svg_class .fill_color {
            fill: #8b949e;
        }
    }
}

.publicLightingMap-header {
    position: absolute;
    top: 0;
    left: 0;
    height: 48px;
    z-index: 10;
    width: 100%;
    padding-top: 16px;
    padding-right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .go-back-wrap {
        font-weight: bold;
        font-size: 18px;
        line-height: 32px;
        color: var(--gray-800);
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 12px;
        gap: 4px;
        .go-back {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width: 20px;
            flex-shrink: 0;
        }
    }

    .left-box {
        padding-left: 12px;
        display: flex;
        align-items: center;
        margin-right: 12px;
        img {
            width: 44px;
            height: 44px;
        }
        .title {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            margin-left: 6px;
        }
        .title {
            :deep(.m-dropdown):hover {
                background-color: transparent !important;
            }
            :deep(.dropdown-text):hover {
                background-color: transparent !important;
            }
        }
    }

    .right-box {
        display: flex;
        justify-content: end;
        align-items: center;
        flex: 1;
        gap: 8px;
        .tab {
            :deep(.m-tabs-list .m-tabs-item) {
                padding: 3px 10px;
            }
        }
    }
}
.m-select-menu-item {
    height: auto !important;
}
.right-select {
    display: flex;
    gap: 8px;
    z-index: 1;
}
.m-cascader {
    border-radius: 4px;
}
</style>
<style lang="less">
.m-select-menu-content {
    min-height: 58px !important;
}
</style>
