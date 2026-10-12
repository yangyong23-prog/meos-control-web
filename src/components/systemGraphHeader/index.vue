<template>
    <div
        :class="{
            'system-graph-header': true,
            'is-tab-left-active': isTabLeftActive,
            'is-tab-right-active': isTabRightActive
        }"
        :style="{ '--right-time-color': props.rightTimeColor, '--right-detail-color': props.rightDetailColor }"
    >
        <div class="left-content">
            <GraphSelect :is-fit-wrap-layout="props.isFitWrapLayout" :options="props.systemList" :default-graph="currentSystem" @change="handleChangeGraph" />
            <slot name="left-content" :is-left-active="isTabLeftActive" :is-right-active="isTabRightActive"></slot>
            <span v-if="props.showUpdateTime && base.getShowUpdateTime" :class="{ 'update-time-container': true, 'update-time-abs': isTabRightActive && props.isFitWrapLayout }">
                <span>{{ i18n.global.t('meos_control_web.update_time_colon') }}{{ base.headerConfig.startTime || '--' }}</span>
            </span>
            <!-- 返回主视图等插槽 -->
            <div v-if="$slots.subHeader" class="sub-header-container">
                <slot name="subHeader"></slot>
            </div>
            <m-popover
                v-if="currentSystem?.diagramBaseObject !== 'project' && currentSystem?.systemId"
                popover-class="detailBtnPopover"
                placement="bottom-start"
                :content="i18n.global.t('meos_control_web.open_in_new_tab')"
                theme="dark"
                :show-arrow="false"
                :enterable="true"
            >
                <m-button type="link" class="detailBtn" @click="openSystemDetail">{{ i18n.global.t('meos_control_web.system_details') }}</m-button>
            </m-popover>
        </div>

        <div class="right-content">
            <slot name="right-content"></slot>
            <template v-if="props.viewModeType === 'icon'">
                <ViewModeSwitch v-model="viewMode" :tab-keys="tabKeys" :disabled-id="props.viewModeDisabledId" :disabled-tips="props.viewModeDisabledTips" />
            </template>
            <template v-else-if="props.viewModeType === 'text'">
                <m-tabs v-model="viewMode" :data="viewModeTabs" :item-width="84" type="segment" size="medium">
                    <template #name="{ item }">
                        <div :style="{ color: item.id === viewMode ? '#246FE5' : '#1B2129', fontWeight: item.id === viewMode ? 700 : 400 }">
                            {{ item.name }}
                        </div>
                    </template>
                </m-tabs>
            </template>
            <template v-else>
                <slot name="right-tabs" ::is-left-active="isTabLeftActive" :is-right-active="isTabRightActive"></slot>
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { openWebsite } from '@/utils/websiteNavigation';
import useStore from '@/store';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import ViewModeSwitch from './ViewModeSwitch.vue';

import GraphSelect from './GraphSelect.vue';

const { base } = useStore();

const props = defineProps({
    systemList: {
        type: Array,
        default: () => []
    },
    viewModeTabs: {
        type: Array,
        default: () => []
    },
    viewModeType: {
        type: String,
        default: 'icon' // icon | text
    },
    viewModeDisabledId: {
        type: String,
        default: ''
    },
    viewModeDisabledTips: {
        type: String,
        default: i18n.global.t('meos_control_web.model_loading')
    },
    rightTimeColor: {
        type: String,
        default: '#fff'
    },
    rightDetailColor: {
        type: String,
        default: '#fff'
    },
    isFitWrapLayout: {
        type: Boolean,
        default: true
    },
    showUpdateTime: {
        type: Boolean,
        default: true
    }
});

const systemId = defineModel('systemId');
const viewMode = defineModel('viewMode');
const currentSystem = defineModel('currentSystem');
const isRefresh = defineModel('isRefresh');

const tabKeys = computed(() => props.viewModeTabs.map(v => v.id));
const isTabLeftActive = computed(() => viewMode.value === tabKeys.value[0]);
const isTabRightActive = computed(() => viewMode.value === tabKeys.value[1]);

function handleChangeGraph(graph) {
    systemId.value = graph.systemId;
    currentSystem.value = graph;
    isRefresh.value = false;
    nextTick(() => {
        isRefresh.value = true;
    });
}
const openSystemDetail = () => {
    if (currentSystem.value?.systemId) {
        openWebsite(MEOI_INSTANCE_DETAIL, {
            params: `objId=${currentSystem.value?.systemId}&f=MEOI_CatalogList&type=all&${getAuthParamsString()}`,
            newPage: true,
            origin: CLOUD_ORIGIN || ''
        });
    }
};
</script>
<style lang="less" scoped>
@media screen and (max-width: 1920px) {
    .update-time-abs {
        position: absolute;
        top: 32px;
        left: 16px;
    }
}

.system-graph-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    position: absolute;
    width: calc(100%);
    top: 16px;
    left: 0;
    z-index: var(--z-index-system-graph-header);

    .left-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
    }

    .right-content {
        display: flex;
        align-items: end;
        gap: 8px;
        height: 100%;
    }
    .detailBtn {
        display: none;
    }
    &:hover {
        .detailBtn {
            display: block;
        }
    }
}

.is-tab-left-active {
    .sub-header-container {
        position: absolute;
        top: 60px;
        left: 16px;
        z-index: 20;

        display: flex;
        align-items: center;
    }
    .update-time-container {
        color: #626c78;
    }
}

.is-tab-right-active {
    .sub-header-container {
        display: none;
    }
    .update-time-container {
        color: var(--right-time-color);
    }
    .detailBtn {
        color: var(--right-detail-color) !important;
    }
}
</style>
