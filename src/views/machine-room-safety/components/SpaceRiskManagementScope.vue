<template>
    <template v-if="props.isLoading || props.loadingDangerEvents">
        <div class="custom-skeleton"><m-list-skeleton /></div>
    </template>
    <div v-else-if="!props.riskList?.length" class="empty-custom-wrap">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent">
            <template #img>
                <EmptyImg />
            </template>
        </m-illustration>
    </div>
    <template v-else>
        <div class="tabs-container"><m-tabs v-model="curTab" size="small" :data="tabItems" type="segment"> </m-tabs></div>
        <div class="content-wrapper">
            <RiskListViewByObject v-if="curTab === 'equipment_space'" :risk-list="props.riskList" :show-type="'tab'" :risk-card-show-type="'riskManagement'" />
            <RiskListViewByName v-if="curTab === 'risk_event'" :risk-list="props.spaceRiskListWithName" />
        </div>
    </template>
</template>

<script setup>
import i18n from '@/localization';
import RiskListViewByObject from './RiskListViewByObject.vue';
import RiskListViewByName from './RiskListViewByName.vue';
import EmptyImg from '@/assets/images/common/empty-risk-event.svg';

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: true
    },
    loadingDangerEvents: {
        type: Boolean,
        default: false
    },
    riskList: {
        type: Array,
        default: () => []
    },
    spaceRiskListWithName: {
        type: Array,
        default: () => []
    }
});

const tabItems = ref([
    {
        id: 'equipment_space',
        name: i18n.global.t('meos_control_web.equipment_space_perspective'),
        slotName: 'abnormal'
    },
    {
        id: 'risk_event',
        name: i18n.global.t('meos_control_web.risk_event_perspective')
    }
]);
const curTab = ref('equipment_space');
</script>

<style lang="less" scoped>
.tabs-container {
    // padding: 16px 24px 0 24px;
    margin: 16px 24px 0 24px;
    // :deep(.m-tabs-segment) {
    //     width: 100%;
    // }
}
.content-wrapper {
    height: calc(100% - 44px);
    padding-left: 24px;
}
.custom-skeleton {
    height: fit-content;
    padding-right: 24px;
    padding-top: 16px;
    padding-left: 24px;
}
.empty-custom-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
