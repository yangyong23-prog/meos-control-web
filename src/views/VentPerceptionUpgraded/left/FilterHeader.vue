<template>
    <div class="widget-card">
        <m-checkbox v-model="curDashboardOnlyIotCheck" @change="doChange">{{ i18n.global.t('meos_control_web.show_iot_spaces_only') }}</m-checkbox>
        <div class="cascader-container">
            <div class="divider"></div>
            <m-cascader
                v-model="curDashboardEnvParams"
                :options="envList"
                :caption="i18n.global.t('meos_control_web.env_parameters')"
                :clearable="false"
                :popover-class="'cascader-env-list-custom-dropdown'"
                :width="198"
                :drop-panel-single-width="180"
                @change="doChange"
            >
            </m-cascader>
        </div>
    </div>
    <m-select
        v-model="curDashboardAbnormal"
        clearable
        :size="180"
        :options="[ABNORMAL_EVENT]"
        :placeholder="i18n.global.t('meos_control_web.please_select')"
        :prefix="i18n.global.t('meos_control_web.abnormal_filter_colon')"
    >
    </m-select>
    <m-tree-select
        v-model="curDashboardSelSpaceTypes"
        :data="spaceTypeTrees"
        clearable
        :size="180"
        multiple
        :prefix="i18n.global.t('meos_control_web.space_type_colon')"
        searchable
        panel-searchable
    >
    </m-tree-select>
    <div v-if="hidefilter" class="vent-new-dropdown-container">
        <m-popover :show-arrow="false" placement="bottom-end" :offset="12" content="" trigger="click">
            <div class="vent-new-dropdown-text">
                <span v-if="curDashboardFloorId?.length" class="dot"></span>
                <IconMeriActionFilter />
            </div>
            <template #content>
                <div class="vent-new-dropdown-content">
                    <m-tree-select
                        v-if="curDashboardView === DASHBOARD_VIEW_TYPE.BUILDING_FLOOR"
                        v-model="curDashboardFloorId"
                        :data="buildingFloorTreeOptions"
                        clearable
                        :size="180"
                        :prefix="i18n.global.t('meos_control_web.building_floor_colon')"
                        searchable
                        panel-searchable
                    >
                    </m-tree-select>
                    <m-select
                        v-model="curDashboardView"
                        :clearable="false"
                        :size="180"
                        :options="DASHBOARD_VIEW_OPTIONS"
                        :max-scroll-height="362"
                        :prefix="i18n.global.t('meos_control_web.view_angle')"
                    >
                    </m-select>
                </div>
            </template>
        </m-popover>
    </div>
    <m-tree-select
        v-if="curDashboardView === DASHBOARD_VIEW_TYPE.BUILDING_FLOOR && !hidefilter"
        v-model="curDashboardFloorId"
        :data="buildingFloorTreeOptions"
        clearable
        :size="180"
        :prefix="i18n.global.t('meos_control_web.building_floor_colon')"
        searchable
        panel-searchable
    >
    </m-tree-select>
    <m-select
        v-if="!hidefilter"
        v-model="curDashboardView"
        :clearable="false"
        :size="180"
        :options="DASHBOARD_VIEW_OPTIONS"
        :max-scroll-height="362"
        :prefix="i18n.global.t('meos_control_web.view_angle')"
    >
    </m-select>
</template>
<script setup>
import i18n from '@/localization';
import { ABNORMAL_EVENT, DASHBOARD_VIEW_OPTIONS, DASHBOARD_VIEW_TYPE } from '@/views/VentPerceptionUpgraded/variables';
import {
    spaceTypeTreesKey,
    curDashboardSelSpaceTypesKey,
    curDashboardOnlyIotCheckKey,
    buildingFloorTreeOptionsKey,
    curDashboardFloorIdKey,
    curDashboardViewKey,
    envParamsOptionsKey,
    curDashboardEnvParamsKey,
    curDashboardAbnormalKey,
    dashBoardFilterChangeKey
} from '@/views/VentPerceptionUpgraded/hooks/useBaseHook';
import { IconMeriActionFilter } from 'meri-icon';
defineProps({
    hidefilter: {
        type: Boolean,
        default: false
    }
});
const spaceTypeTrees = inject(spaceTypeTreesKey);
const buildingFloorTreeOptions = inject(buildingFloorTreeOptionsKey);
const curDashboardFloorId = inject(curDashboardFloorIdKey);
const curDashboardView = inject(curDashboardViewKey);
const curDashboardOnlyIotCheck = inject(curDashboardOnlyIotCheckKey);
const envList = inject(envParamsOptionsKey);
const curDashboardEnvParams = inject(curDashboardEnvParamsKey);
const curDashboardAbnormal = inject(curDashboardAbnormalKey);
const curDashboardSelSpaceTypes = inject(curDashboardSelSpaceTypesKey);
const dashBoardFilterChange = inject(dashBoardFilterChangeKey);

const doChange = d => {
    if (dashBoardFilterChange) {
        dashBoardFilterChange();
    }
};
</script>

<style lang="less">
.cascader-env-list-custom-dropdown {
    .m-cascader__list {
        height: fit-content !important;
    }
    .m-scrollbar__box {
        height: 338px !important;
    }
}
</style>
<style lang="less" scoped>
.vent-new-dropdown-container {
    padding: 0 8px;
    .vent-new-dropdown-text {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--blue-500);
        position: relative;
        display: flex;
        align-items: center;
        .dot {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: var(--blue-500);
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, -50%);
            border: 1px solid #fff;
        }
    }
}
.vent-new-dropdown-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 8px;
}
.filter-header-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    position: relative;
}
.widget-card {
    border-radius: 4px;
    background: #fff;
    border: 1px solid @grey-400;

    display: flex;
    width: fit-content;
    height: 32px;
    padding: 8px 0px 8px 8px;
    align-items: center;

    &:hover {
        border: 1px solid @blue-600;
    }
}

.cascader-container {
    display: flex;
    align-items: center;

    .divider {
        width: 1px;
        height: 14px;
        background: #c4c9cf;
        margin-left: 12px;
    }

    :deep(.m-cascader__result) {
        border: none;
        padding: 0 8px 0 12px;
    }

    :deep(.m-select-inner) {
        border: none;
    }
}
</style>
