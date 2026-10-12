<template>
    <div class="header-box-tabs">
        <m-tabs v-model="currentTab" :data="stateList" type="segment" size="small"></m-tabs>
    </div>
    <div v-if="floorView" class="header-box-select">
        <m-checkbox :model-value="onlyShowControlledEquipmentRef" @change="onlyShowControlledEquipmentChange">{{
            i18n.global.t('meos_control_web.only_controllable_equipment')
        }}</m-checkbox>
        <span class="box-split ml12"></span>
        <!-- 设备类 -->
        <m-select
            v-if="floorView"
            v-model="selectValue"
            :max-scroll-height="362"
            :size="184"
            :placeholder="i18n.global.t('meos_control_web.please_select')"
            :prefix="i18n.global.t('meos_control_web.ventilation_equipment_colon')"
            clearable
            noborder
            @change="handleChange"
            @clear="handleChange"
        >
            <div class="select-explain">*通过通风设备筛选其服务的空间</div>
            <m-option v-for="item in equipTypeOptions" :key="item.key" :value="item.key" :label="item.name"> </m-option>
        </m-select>
    </div>

    <!-- 搜索组建 -->
    <MapSearch
        :spaces="allSpaces"
        :equips="allEquips"
        :space-filter-fn="spaceFilterFn"
        :equip-filter-fn="equipFilterFn"
        :current-floor-id="currentFloorObj?.id"
        :loading="spacesAndEquipsLoading"
        :only-type="onlyType"
        @choose="chooseObj"
    ></MapSearch>
</template>
<script setup>
import i18n from '@/localization';
import useMapTabs from '../hooks/useMapTabs';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import { allEquipsInjectKey, allSpacesInjectKey, spacesAndEquipsLoadingInjectKey } from '../constant/symbols';

const emit = defineEmits(['searchChooseObj']);
const onlyShowControlledEquipment = inject('onlyShowControlledEquipment');
const currentFloorObj = inject('currentFloorObj');
const filterEquipmentType = inject('filterEquipmentType');
const onlyShowControlledEquipmentRef = ref(onlyShowControlledEquipment?.value ? 'checked' : 'uncheck');
const selectValue = ref();
const equipTypeOptions = inject('equipTypeOptions');

const allSpaces = inject(allSpacesInjectKey);
const allEquips = inject(allEquipsInjectKey);
const spacesAndEquipsLoading = inject(spacesAndEquipsLoadingInjectKey);

const spaceFilterFn = spaceData => {
    let flag = true;
    if (filterEquipmentType.value && !spaceData.equipTypes?.includes(filterEquipmentType.value.key)) {
        flag = false;
    }
    if (flag && floorView.value && onlyShowControlledEquipment.value && !spaceData.isControl) {
        flag = false;
    }

    if (flag && currentTab.value === 'abnormalStatus' && !spaceData.isAbnormal) {
        flag = false;
    }
    return flag;
};

const floorView = computed(() => {
    return !!currentFloorObj.value?.id;
});

const equipFilterFn = equipData => {
    let flag = true;
    if (filterEquipmentType.value && filterEquipmentType.value.key !== equipData.equipType) {
        flag = false;
    }
    if (flag && floorView.value && onlyShowControlledEquipment.value && !equipData.isControl) {
        flag = false;
    }

    if (flag && currentTab.value === 'abnormalStatus' && !equipData.abnormalTypes?.length > 0) {
        flag = false;
    }
    return flag;
};

const chooseObj = (obj, type) => {
    emit('searchChooseObj', obj, type);
};

const { templateName, stateList, viewList, currentState, currentView } = useMapTabs();

const currentTab = inject('currentTab');

const onlyShowControlledEquipmentChange = state => {
    onlyShowControlledEquipmentRef.value = state;
    onlyShowControlledEquipment.value = state === 'checked' ? true : false;
};
const handleChange = selectId => {
    filterEquipmentType.value = equipTypeOptions.value.find(da => da.key === selectId);
};

const onlyType = computed(() => {
    if (!floorView.value && currentTab.value === 'runStatus') {
        return 'space';
    }
    return '';
});

watch(filterEquipmentType, newVal => {
    if (!newVal) {
        selectValue.value = null;
    }
});
</script>
<style lang="less" scoped>
.select-explain {
    color: #8b949e;
    font-size: 12px;
    text-align: center;
}
.header-box-tabs {
    :deep(.m-tabs.m-tabs-segment) {
        width: 116px;
        .m-tabs-item {
            flex: 1;
            padding: 0 2px;
        }
        .m-tabs-body {
            padding-right: 0 !important;
            .m-tabs-trigger {
                display: none !important;
            }
        }
    }
}
.header-box-select {
    height: 32px;
    border-radius: 4px;
    background: #fff;
    padding: 8px 4px 8px 12px;
    border: 1px solid var(--gray-400);
    display: flex;
    align-items: center;
    .box-split {
        width: 1px;
        height: 14px;
        opacity: 0.4;
        background: var(--gray-500, #8b949e);
    }
    :deep(.m-select) {
        height: 24px;
    }
}
</style>
