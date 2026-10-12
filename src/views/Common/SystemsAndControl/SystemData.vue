<template>
    <div v-if="tabList.length" class="system-params">
        <div class="system-params-tabs fcb" :class="{ oneTab: tabList.length < 2 }">
            <m-tabs v-model="value" size="large" :data="tabList" style="width: calc(100% - 24px); margin-left: -12px" />
            <m-tips v-if="showMonitoringDashboard" :content="i18n.global.t('meos_control_web.monitoring_dashboard')" theme="darkTransparent">
                <div class="system-params-tabs-icon fcc" @click="emits('click')">
                    <img src="@/assets/images/common/modal.png" style="width: 18px; height: 18px" />
                </div>
            </m-tips>
        </div>
        <ParamsBox v-if="value !== 'tem'" :data="currentTabData" :system-id="systemId" />
        <EchartsPie
            v-else-if="value === 'tem' && hasIndoorTemperature"
            :data="chartsData"
            :space-scope-data="chartsDataBySpaceScope"
            :all-chart-spaces-count="allChartSpacesCount"
            :style="showAllSpacesOnly ? undefined : { height: Object.values(chartsDataBySpaceScope || {}).some(item => item.length > 5) ? '300px' : '230px' }"
            @open-space-list="openSpaceList"
        />
        <SpaceListDrawer v-if="showSpaceListDrawer" :data="activeSpaceList" @close="showSpaceListDrawer = false" />
    </div>
</template>

<script setup lang="ts">
import { showAllSpacesOnly } from '@/config';
import i18n from '@/localization';
import ParamsBox from './components/ParamsBox.vue';
import EchartsPie from '@/components/echarts/EchartsPie.vue';
import SpaceListDrawer from './components/spaceInfo/SpaceListDrawer.vue';
import { SystemDataProps } from './types/props';
const props = defineProps<SystemDataProps>();
const emits = defineEmits<{
    (event: 'click'): void;
}>();
const showSpaceListDrawer = defineModel('showSpaceListDrawer', {
    type: Boolean,
    default: false
});
const activeSpaceList = ref<Record<string, any>>({});
const value = ref('');
const tabList = computed(() => {
    const arr = [...props.data, ...(props.hasIndoorTemperature ? [{ groupCode: 'tem', groupName: i18n.global.t('meos_control_web.indoor_temperature') }] : [])];
    return arr.map(item => {
        return {
            id: item.groupCode,
            name: item.groupName
        };
    });
});
const openSpaceList = (data: { name: string }) => {
    activeSpaceList.value = structuredClone(data);
    activeSpaceList.value.title = data.name + i18n.global.t('meos_control_web.space_list');
    showSpaceListDrawer.value = true;
};
const currentTabData = computed(() => {
    return props.data.find(item => item.groupCode === value.value)?.relInfoCodeConfigs || [];
});
onMounted(() => {
    value.value = tabList.value?.[0]?.id;
});
</script>
<style lang="less" scoped>
.system-params {
    margin-top: 14px;
}
.system-params-tabs {
    margin-bottom: 12px;
    border-bottom: 1px solid var(--gray-200);
    &-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        user-select: none;
        &:hover {
            border-radius: 2px;
            background: rgba(196, 201, 207, 0.3);
        }
    }
}
.oneTab {
    :deep(.m-tabs-list) {
        &::before {
            visibility: hidden;
        }
        .m-tabs-item {
            cursor: default;
        }
        .m-tabs-name {
            color: rgba(0, 0, 0, 1);
        }
    }
}
</style>
