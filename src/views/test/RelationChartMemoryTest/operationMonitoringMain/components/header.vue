<template>
    <div class="operation-monitoring-header">
        <div class="left-box">
            <template v-if="showHome"> <m-button type="link" @click="goHome">首页</m-button> <span class="line"></span> </template>
            <GraphSelect :has-icon="!showHome" :options="systemList" :default-graph="selectedSystemObj" @change="handleChangeGraph" />
            <div v-if="base.headerConfig.runningMonitorType && !isEdge()" class="mr16 ft update-time-text">
                {{ i18n.global.t('meos_control_web.update_time_colon') }}{{ base.headerConfig.startTime || '--' }}
            </div>
            <m-popover
                v-if="selectedSystemObj?.diagramBaseObject !== 'project' && selectedSystemObj?.systemId"
                popover-class="detailBtnPopover"
                placement="bottom-start"
                content="新开标签页打开"
                theme="dark"
                :show-arrow="false"
                :enterable="true"
            >
                <m-button type="link" style="margin-left: -12px" class="detailBtn" @click="openSystemDetail">系统详情</m-button>
            </m-popover>
        </div>

        <div class="right-box">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
import GraphSelect from './GraphSelect.vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuthParamsString } from '@/utils/envUtils';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { openWebsite } from '@/utils/websiteNavigation';
import { isEdge } from '@/utils/envUtils';
import useStore from '@/store';
import { setRunningMonitorType } from '@/views/test/RelationChartMemoryTest/use-utils';

const { base } = useStore();
const route = useRoute();
const router = useRouter();
const systemId = inject('systemId');
const systemList = inject('systemList');
const selectedSystemObj = inject('selectedSystemObj');
const showHome = computed(() => route.query.redirect);

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

function handleChangeGraph(graph) {
    setRunningMonitorType(graph.classCode);
    systemId.value = graph.systemId;
    selectedSystemObj.value = graph;
    const query = {
        ...route.query,
        sysName: graph.localName,
        graphTypeCode: graph.graphTypeCode,
        classCode: graph.classCode || ''
    };
    router.replace({ query });
}
</script>
<style lang="less" scoped>
.SPACE_3D_GRAPH .update-time-text {
    color: @white !important;
}
.operation-monitoring-header {
    padding: 16px;
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
        flex: 1;
        &-tab {
            :deep(.m-tabs.m-tabs-segment) {
                width: 179px;
                .m-tabs-item {
                    flex: 1;
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
