<template>
    <div class="header-container" :style="{ background: props?.headerBg }">
        <div class="title">{{ i18n.global.t('meos_control_web.power_distribution') }}</div>
        <div class="filter-container">
            <div class="check-info-codes">
                <m-checkbox :model-value="viewHasData ? 'checked' : 'uncheck'" @click="viewHasDataClick">
                    {{ i18n.global.t('meos_control_web.only_view_systems_with_data_available') }}
                </m-checkbox>
            </div>
            <m-select
                v-model="dashboardAbnormalFilter"
                :disabled="isGlobalLoading || abnormalEventListLoading"
                clearable
                :size="200"
                :options="dashboardAbnormalOptions"
                :max-scroll-height="362"
                :placeholder="i18n.global.t('meos_control_web.please_select')"
                :prefix="i18n.global.t('meos_control_web.abnormal_type_colon')"
            ></m-select>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { dashboardAbnormalOptionsKey, dashboardAbnormalFilterKey, isGlobalLoadingKey, viewHasDataKey } from '../hooks/useGlobalData';
import { abnormalEventListLoadingKey } from '../hooks/useAbnormalList';

const props = defineProps({
    headerBg: {
        type: String,
        default: 'transparent'
    }
});

const dashboardAbnormalOptions = inject(dashboardAbnormalOptionsKey);
const dashboardAbnormalFilter = inject(dashboardAbnormalFilterKey);
const viewHasData = inject(viewHasDataKey);

const isGlobalLoading = inject(isGlobalLoadingKey);
const abnormalEventListLoading = inject(abnormalEventListLoadingKey);
const viewHasDataClick = () => {
    viewHasData.value = !viewHasData.value;
};
</script>

<style lang="less" scoped>
.header-container {
    display: flex;
    width: 100%;
    height: 48px;
    padding: 16px 0px 0px 16px;
    align-items: center;
    justify-content: space-between;

    .title {
        color: var(--gray-800, #2e3742);
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;
    }

    .filter-container {
        display: flex;
        align-items: center;
        .check-info-codes {
            box-sizing: border-box;
            width: 174%;
            height: 32px;
            padding: 5px 12px;
            background-color: #fff;
            border-radius: 4px;
            background: var(--Grey-Grey-0, #fff);
            /* Shadow/shadow-1 */
            box-shadow: 0 2px 10px 0 rgba(27, 33, 41, 0.1);
            text-align: center;
            line-height: 22px;
            margin-right: 12px;
        }
    }
}
</style>
