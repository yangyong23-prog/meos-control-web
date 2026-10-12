<template>
    <div class="equipment-list wh100 fc" :style="{ zIndex: zIndex }" @click="equipmentListClick">
        <m-sidebar v-model:width="width" v-model:show="show" :change-size="true" :resident="false">
            <Left :loading-class-list="loadingClassList" @back="back"></Left>
        </m-sidebar>
        <div class="loading-box h100" :style="{ width: `calc(100% - ${show ? width : 12}px)` }">
            <Right
                v-if="Refresh && classCodeList.length"
                :filter="filter"
                :system-id="systemId"
                :select-equip-id="selectEquipId"
                :has-equipment-info="hasEquipmentInfo"
                :filter-in-system-ids="filterInSystemIds"
                :manual-auto-set-control="manualAutoSetControl"
                @click-equip="handleClickEquip"
            >
            </Right>
            <div v-else class="w100 h100 fcc">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import { GET_MENU_CONFIG, OBJ_TYPE } from '@/utils/globalVariables';
import Left from './left/index.vue';
import Right from './right/index.vue';
import { useBaseHook } from './hooks/useBaseHook';
const props = defineProps({
    floorId: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    },
    classCode: {
        type: String,
        default: ''
    },
    runningMonitorType: {
        type: String,
        default: () => window[GET_MENU_CONFIG]?.()?.RUNNING_MONITOR_TYPE
    },
    runningMonitorSecondType: {
        type: String,
        default: ''
    },
    subscribeType: {
        type: String,
        default: () => window[GET_MENU_CONFIG]?.()?.SUBSCRIBE_TYPE
    },
    permission: {
        type: String,
        default: () => window[GET_MENU_CONFIG]?.()?.PERMISSION
    },
    filter: {
        type: Object,
        default: () => ({})
    },
    zIndex: {
        type: Number,
        default: Z_INDEX.equipmentList
    },
    pageSize: {
        type: Number,
        default: 50
    },
    getFilterObjectIdsFn: Function,
    selectEquipId: {
        type: String,
        default: ''
    },
    hasEquipmentInfo: {
        type: Boolean,
        default: true
    },
    filterInSystemIds: {
        type: Array,
        default: () => []
    },
    excludeClassCodes: {
        type: Array,
        default: () => []
    },
    manualAutoSetControl: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['back', 'closeEquipmentInfo', 'click-equip']);
const width = ref(300);
const show = ref(true);
const { Refresh, loadingClassList, classCodeList, selectTableList, curClassCodeObj } = useBaseHook(props);
const zIndex = computed(() => props.zIndex);

const equipmentListClick = () => {
    emits('closeEquipmentInfo');
};
const handleClickEquip = row => {
    emits('click-equip', { ...row, objType: row.objType || OBJ_TYPE.EQUIPMENT, type: row.objType || OBJ_TYPE.EQUIPMENT });
};
const back = () => {
    equipmentListClick();
    emits('back');
};

watch(
    () => [selectTableList.value, curClassCodeObj.value],
    () => {
        // 表格勾选项变化时，同步通知父层关闭当前设备详情。
        emits('closeEquipmentInfo');
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.loading-box {
    :deep(.m-loading-mask) {
        z-index: 10 !important;
    }
}
.equipment-list {
    background-color: #ffffff;
    position: absolute;
    :deep(.meri-sidebar-line) {
        z-index: 12;
    }
    :deep(.meri-sidebar-toggle) {
        z-index: 12;
    }
}
</style>
