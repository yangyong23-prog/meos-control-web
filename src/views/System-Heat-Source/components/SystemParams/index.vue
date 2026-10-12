<template>
    <div class="system-params">
        <div class="system-params-tabs fcb" :class="{ oneTab: tabList.length < 2 }">
            <m-tabs v-model="value" size="large" :data="tabList" style="width: calc(100% - 24px); margin-left: -12px" />
            <m-tips :content="i18n.global.t('meos_control_web.monitoring_dashboard')" theme="darkTransparent">
                <div class="system-params-tabs-icon fcc" @click="click">
                    <img src="@/assets/images/common/modal.png" style="width: 18px; height: 18px" />
                </div>
            </m-tips>
        </div>
        <ParamsBox v-if="value !== 'tem'" :data="currentTabData" :system-id="systemId" />
        <EchartsPie
            v-else-if="value === 'tem'"
            :data="chartsData"
            :space-scope-data="chartsDataBySpaceScope"
            :all-chart-spaces-count="allChartSpacesCount"
            :style="showAllSpacesOnly ? undefined : { height: Object.values(chartsDataBySpaceScope || {}).some(item => item.length > 5) ? '300px' : '230px' }"
            @open-space-list="openSpaceList"
        />
        <SpaceListDrawer v-if="showSpaceListDrawer" :data="activeSpaceList" @close="showSpaceListDrawer = false" />
    </div>
</template>

<script setup>
import { showAllSpacesOnly } from '@/config';
import i18n from '@/localization';
import ParamsBox from './ParamsBox.vue';
import EchartsPie from '@/components/echarts/EchartsPie.vue';
import SpaceListDrawer from './spaceInfo/SpaceListDrawer.vue';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    chartsData: {
        type: Array,
        default: () => []
    },
    chartsDataBySpaceScope: {
        type: Object,
        default: () => ({})
    },
    systemId: {
        type: String,
        default: ''
    },
    allChartSpacesCount: {
        type: Number,
        default: 0
    }
});
const showSpaceListDrawer = ref(false);
const activeSpaceList = ref({});
const showMonitoringBoard = defineModel('showMonitoringBoard', false);
const click = () => {
    showMonitoringBoard.value = true;
};
const openSpaceList = data => {
    activeSpaceList.value = structuredClone(data);
    activeSpaceList.value.title = data.name + i18n.global.t('meos_control_web.space_list');
    showSpaceListDrawer.value = true;
};
const tabList = computed(() => {
    const arr = [...props.data, { groupCode: 'tem', groupName: i18n.global.t('meos_control_web.indoor_temperature') }];
    return arr.map(item => {
        return {
            id: item.groupCode,
            name: item.groupName
        };
    });
});
const value = ref();
const currentTabData = computed(() => {
    return props.data.find(item => item.groupCode === value.value)?.relInfoCodeConfigs || [];
});
watchEffect(() => {
    if (props.data.length) {
        value.value = props.data[0].groupCode;
    } else {
        value.value = 'tem';
    }
});
</script>
<style lang="less" scoped>
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
