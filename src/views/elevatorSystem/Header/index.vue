<template>
    <Header
        :title="i18n.global.t('meos_control_web.elevator_system')"
        :current-floor-obj="currentFloorObj"
        :current-building-num="currentBuildingNum"
        :building-local-name="buildingLocalName"
        @go-back-building="goBackBuilding"
    >
        <template #headRight> </template>
    </Header>
</template>
<script setup>
import i18n from '@/localization';
import Header from '@/views/Common/Header/index.vue';
import { currentBuildingNumKey } from '../hooks/useElevatorGlobalData';
// import { CONTROL_BAR_TAB_KEYS, CONTROL_BAR_TABS } from '../constants/index';
const isAbnormal = inject('isAbnormal');
const currentTab = inject('currentTab');
const currentFloorObj = inject('currentFloorObj');
const equipFilterTreeData = inject('equipFilterTreeData');
const filterEquipmentClass = inject('filterEquipmentClass');
// 仅看可控设备
const onlyShowControlledEquipment = inject('onlyShowControlledEquipment');
const onlyShowControlledEquipmentRef = ref(onlyShowControlledEquipment?.value ? 'checked' : 'uncheck');

const currentBuildingNum = inject(currentBuildingNumKey);
const currentBuildingObj = inject('currentBuildingObj');
const buildingLocalName = computed(() => currentBuildingObj?.value?.localName);
// 仅看可控设备切换
const onlyShowControlledEquipmentChange = state => {
    onlyShowControlledEquipmentRef.value = state;
    onlyShowControlledEquipment.value = state === 'checked' ? true : false;
};
const goBackBuilding = () => {
    currentFloorObj.value = null;
};
const tabsOptions = ref([]);
const selectValue = ref([]);
// tabsOptions.value = CONTROL_BAR_TABS.map(da => {
//     return {
//         ...da
//     };
// });
const treeSelect = () => {
    let arr = [];
    equipFilterTreeData.value.forEach(g => {
        arr = arr.concat(
            g.children?.filter(obj => {
                return obj.checked === 'checked';
            })
        );
    });
    filterEquipmentClass.value = arr;
};
watch(selectValue, () => {
    if (!selectValue.value?.length) {
        filterEquipmentClass.value = [];
    }
});
</script>
<style lang="less" scoped>
.header-box-select {
    height: 32px;
    border-radius: 4px;
    background: #fff;
    padding: 8px 4px 8px 12px;
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
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
.header-box-tab {
    :deep(.m-tabs.m-tabs-segment) {
        width: 242px;
        .m-tabs-item {
            flex: 1;
            padding: 0 14px;
        }
        .m-tabs-body {
            padding-right: 0 !important;
            .m-tabs-trigger {
                display: none !important;
            }
        }
    }
    .tab-content-warp {
        display: flex;
        align-items: center;
        position: relative;
        .red-circle {
            position: absolute;
            top: -8px;
            right: -12px;
        }
    }
}
</style>
