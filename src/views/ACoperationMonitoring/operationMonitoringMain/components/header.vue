<template>
    <div class="operation-monitoring-header">
        <div class="left-box">
            <template v-if="showHome">
                <m-button type="text" @click="goHome">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="icon-left">
                            <path
                                d="M10.6008 1.87012L4.47257 7.99838L4.47139 7.99964L10.602 14.1303L11.5283 13.2039L6.32123 7.99685L11.5244 2.79369L10.6008 1.87012Z"
                                fill="#8B949E"
                            />
                        </svg>
                    </template>
                    <span>{{ i18n.global.t('meos_control_web.back') }}</span>
                </m-button>
                <span class="line"></span>
            </template>
            <GraphSelect :has-icon="!showHome" :options="isHideSelectOptions ? [] : systemList" :default-graph="selectedSystemObj" @change="handleChangeGraph" />
            <div v-if="base.getShowUpdateTime" class="mr16 ft update-time-text">
                {{ i18n.global.t('meos_control_web.update_time_colon') }}{{ base.headerConfig.startTime || '--' }}
            </div>
            <m-popover
                v-if="selectedSystemObj?.diagramBaseObject !== 'project' && selectedSystemObj?.systemId"
                popover-class="detailBtnPopover"
                placement="bottom-start"
                :content="i18n.global.t('meos_control_web.open_in_new_tab')"
                theme="dark"
                :show-arrow="false"
                :enterable="true"
            >
                <m-button type="link" style="margin-left: -12px" class="detailBtn" @click="openSystemDetail">{{ i18n.global.t('meos_control_web.system_details') }}</m-button>
            </m-popover>
        </div>
        <div class="right-box">
            <EquipSelect
                v-show="perspectiveType && perspectiveType === PERSPECTIVE_DICT['MODEL_PERSPECTIVE'] && curGraphType && curGraphType === GRAPH_TYPE_DICT['SPACE_3D_GRAPH']"
                :space-id="curEnterSpace?.id"
                :system-id="systemId"
                @select-change="selectChange"
                @all-data="alldata"
            ></EquipSelect>
            <div class="right-box-tab"><m-tabs v-model="perspectiveType" :data="perspectiveList" type="segment" @change="handleChangePerspective"></m-tabs></div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import GraphSelect from './GraphSelect.vue';
import { clone } from 'lodash';
import { PERSPECTIVE_LIST, PERSPECTIVE_DICT, GRAPH_TYPE_DICT } from '@/views/ACoperationMonitoring/constants';
import { useRoute, useRouter } from 'vue-router';
import { getAuthParamsString } from '@/utils/envUtils';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { openWebsite } from '@/utils/websiteNavigation';
import useStore from '@/store';
import { setRunningMonitorType } from '@/views/ACoperationMonitoring/use-utils';
import EquipSelect from '@/views/ACAC/components/EquipSelect/index.vue';

const { base } = useStore();
const route = useRoute();
const router = useRouter();
const systemId = inject('systemId');
const systemList = inject('systemList');
const selectedSystemObj = inject('selectedSystemObj');
const curEnterSpace = inject('curEnterSpaceKey');
const showHome = computed(() => route.query.redirect);
const isHideSelectOptions = computed(() => route.query.redirect === 'SE');

const perspectiveType = inject('perspectiveType');
const curGraphType = inject('curGraphType');
const perspectiveList = ref(clone(PERSPECTIVE_LIST));
const goHome = () => {
    const { redirect } = route.query;
    router.push({
        path: `/${redirect}` || '/system-status-home'
    });
};
const openSystemDetail = () => {
    if (selectedSystemObj.value?.systemId) {
        openWebsite(MEOI_INSTANCE_DETAIL, {
            params: `objId=${selectedSystemObj.value?.systemId}&f=MEOI_CatalogList&type=all&${getAuthParamsString()}`,
            newPage: true,
            origin: CLOUD_ORIGIN || ''
        });
    }
};
const callToggleWidth = inject('callToggleWidth');
const space3dSelectData = inject('space3dSelectDataKey');
const space3dAllData = inject('space3dAllDataKey');

const refresh = inject('refresh');
function handleChangeGraph(graph) {
    callToggleWidth(true);
    refresh.value = true;
    setRunningMonitorType(graph.classCode);
    systemId.value = graph.systemId;
    selectedSystemObj.value = graph;
    const query = {
        ...route.query,
        sysName: graph.localName ?? '--',
        graphTypeCode: graph.graphTypeCode,
        classCode: graph.classCode || ''
    };
    router.replace({ query });
}
const selectChange = data => {
    space3dSelectData.value = data;
};

const alldata = data => {
    space3dAllData.value = data;
};

function handleChangePerspective({ id }) {
    refresh.value = false;
    // callToggleWidth(true);
    // if (id === PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE) {
    //     curGraphType.value = GRAPH_TYPE_DICT.SYSTEM_GRAPH;
    // }
}
</script>
<style lang="less" scoped>
.SPACE_3D_GRAPH .update-time-text {
    color: @white !important;
}
.operation-monitoring-header {
    padding: 16px 16px 16px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 65;

    // &.slogin {
    //     background: url(@/assets/images/operateMonitoring/slogen.png) no-repeat 12px center;
    //     padding-left: 64px;
    // }

    .left-box {
        display: flex;
        align-items: center;

        .detailBtn {
            visibility: hidden;
        }

        .line {
            width: 1px;
            height: 16px;
            opacity: 0.4;
            background: @grey-500;
            margin-left: 8px;
        }
    }

    &:hover .left-box {
        .detailBtn {
            visibility: visible;
        }
    }

    .right-box {
        display: flex;
        justify-content: end;
        align-items: center;

        &-tab {
            :deep(.m-tabs.m-tabs-segment) {
                .m-tabs-name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .m-tabs-body {
                    padding-right: 0 !important;

                    .m-tabs-trigger {
                        display: none !important;
                    }
                }
            }
        }
    }
}

// :deep(.system-select) {
//     .m-select-inner {
//         background: transparent !important;
//         min-width: auto;
//         padding-left: 0;

//         .m-select-inner-value {
//             font-size: 20px;
//             font-weight: 700;
//         }
//     }

//     .m-select-icon path {
//         fill: @grey-500;
//     }
// }
</style>
<style lang="less">
.detailBtnPopover {
    border-radius: 4px;
    border: 1px solid @grey-300;
    background: rgba(27, 33, 41, 0.8) !important;
}
</style>
