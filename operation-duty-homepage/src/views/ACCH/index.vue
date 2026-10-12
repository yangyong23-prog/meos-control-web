<template>
    <Panel
        v-model="currentSelectOption"
        :card-tag="currentSystem?.cardTag"
        :loading="loading"
        :title="title"
        :template-name="currentSystem?.templateName"
        :template-tag="currentSystem?.templateTag"
        :title-path="titlePath"
        :title-params="titleParams"
        :select-options="selectOptions"
        @change="onSelectChange"
    >
        <div v-if="!loaded" class="ac-row-grid"></div>
        <template v-else-if="loaded && currentSystem">
            <Mode1 v-if="isGovern" :data="currentSystem" />
            <Mode2 v-else :data="currentSystem" />
        </template>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_data_available')" width="90px" height="76px" />
    </Panel>
</template>

<script setup>
import i18n from '@/localization';
import Empty from '@/components/Empty.vue';
import Panel from '../components/base/panel.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import Mode1 from './mode1.vue';
import Mode2 from './mode2.vue';
defineProps({
    size: {
        type: String,
        default: '1*1'
    },
    title: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_heat_source_system')
    }
});
const { data, getDutyHomeData, startDataPolling, loaded, dataLoading, loading } = useHomeDataHook();
const selectOptions = computed(() => {
    if (data.value) {
        return data.value.hotColdchildCardVOList?.map(system => ({
            id: system.systemId,
            name: system.localName
        }));
    }
    return [];
});
const onSelectChange = item => {
    currentSelectOption.value = item;
    currentSystem.value = data.value.hotColdchildCardVOList?.find(system => system.systemId === item);
};
const titlePath = computed(() => {
    if (currentSystem.value && currentSystem.value.canJump) {
        return `/ACCH`;
    }
    return '';
});
const titleParams = computed(() => {
    if (currentSystem.value) {
        return {
            sysName: currentSystem.value.sysName,
            graphTypeCode: currentSystem.value.graphTypeCode,
            classCode: currentSystem.value.classCode
        };
    }
    return {};
});
const currentSelectOption = ref();
const currentSystem = ref();
const isGovern = computed(() => {
    if (currentSystem.value) {
        return currentSystem.value.heatSoureType.includes(1);
    }
    return false;
});
watch(
    () => dataLoading.value,
    () => {
        if (currentSelectOption.value) {
            currentSystem.value = data.value.hotColdchildCardVOList?.find(system => system.systemId === currentSelectOption.value);
        } else if (data.value) {
            currentSelectOption.value = data.value.hotColdchildCardVOList?.[0]?.systemId;
            currentSystem.value = data.value.hotColdchildCardVOList?.[0];
        }
    }
);
onMounted(async () => {
    // 获取数据
    startDataPolling({ systemList: ['HEAT_SOURCE'] }, '.ac-row-grid');
    await getDutyHomeData({ systemList: ['HEAT_SOURCE'] }, '.ac-row-grid');
    if (data.value) {
        currentSelectOption.value = data.value.hotColdchildCardVOList?.[0]?.systemId;
        currentSystem.value = data.value.hotColdchildCardVOList?.[0];
    }
});
</script>
<style lang="less" scoped>
.vent-row {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
    .vent-row-mini {
        height: 100%;
    }
}
</style>
