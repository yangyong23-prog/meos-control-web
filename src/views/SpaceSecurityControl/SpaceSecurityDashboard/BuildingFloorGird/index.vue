<template>
    <div v-if="dashboardObj" class="building-floor-gird">
        <m-select
            ref="selectRef"
            v-model="abnormalType"
            clearable
            :size="200"
            class="abnormal-type-filter-select"
            :options="abnormalList"
            :max-scroll-height="362"
            :placeholder="i18n.global.t('meos_control_web.please_select')"
            :prefix="i18n.global.t('meos_control_web.abnormal_type_colon')"
        >
            <div v-for="item in abnormalList" :key="item.id" class="filter-item" :class="{ selected: item.id === abnormalType }" @click="chooseFilterItem(item)">
                <p class="filter-item-name">{{ item.name }}</p>
                <p v-if="item.info" class="filter-item-info">{{ item.info }}</p>
            </div>
        </m-select>
        <div v-if="buildingList.length" class="building-warp">
            <BuildingGroup v-for="building in buildingList" :key="building.id" :building="building"></BuildingGroup>
        </div>
        <div v-else class="empty-warp">
            <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
        </div>
    </div>
</template>
<script setup>
import { dashboardObjInjectKey } from '../../hooks/useDashboard';
import BuildingGroup from './BuildingGroup.vue';
import i18n from '@/localization';

const abnormalList = ref([
    { id: 'abnormal', name: i18n.global.t('meos_control_web.abnormal_event') },
    { id: 'deviation', name: i18n.global.t('meos_control_web.disarm_demand_deviation_alt') },
    { id: 'statusAbnormal', name: i18n.global.t('meos_control_web.device_status_abnormal'), info: i18n.global.t('meos_control_web.equipment_offline_or_feedback_mismatch') }
]);
const abnormalType = ref('');
const dashboardObj = inject(dashboardObjInjectKey);
const selectRef = ref(null);

const buildingList = computed(() => {
    if (!dashboardObj.value) return [];
    // 过滤
    const buildings = dashboardObj.value.buildings.map(item => {
        const floors = item.floors.filter(floor => {
            if (abnormalType.value === 'abnormal') {
                return floor.haveAbnormal;
            }
            if (abnormalType.value === 'deviation') {
                return floor.haveDeviation;
            }
            if (abnormalType.value === 'statusAbnormal') {
                return floor.haveStatusAbnormal;
            }
            return true;
        });
        return {
            ...item,
            floors
        };
    });

    return buildings.filter(b => b.floors.length);
});

const chooseFilterItem = item => {
    abnormalType.value = item.id;
    selectRef.value?.blur();
};

onUnmounted(() => {
    selectRef.value = null;
});
</script>
<style lang="less" scoped>
.building-floor-gird {
    position: relative;
    padding: 0 16px;
    padding-right: 2px;
    display: flex;
    flex-direction: column;
    :deep(.abnormal-type-filter-select) {
        position: absolute;
        right: 1px;
        top: 0;
        z-index: 9;
    }

    .building-warp {
        flex: 1;
        overflow: auto;
        position: relative;
    }

    .empty-warp {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 64px;
    }
}
.filter-item {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 8px;
    border-radius: 4px;
    margin-top: 2px;

    .filter-item-name {
        font-size: 14px;
        color: var(--gray-900);
    }
    .filter-item-info {
        font-size: 12px;
        color: var(--gray-500);
        line-height: 22px;
    }

    &:hover {
        background: #c4c9cf4d;
        cursor: pointer;
    }

    &.selected {
        background: var(--blue-100);
        .filter-item-name {
            color: var(--primary-color);
        }

        .filter-item-info {
            color: var(--primary-color);
        }
    }
}
</style>
