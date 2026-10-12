<template>
    <div v-if="systemId && showMonitoringInfo" class="monitoring-info">
        <div class="monitoring-info-top">
            <div :class="{ 'top-tab': true, 'single-tab': info.tabsData?.length === 1 }"><m-tabs v-model="info.tabsModel" size="large" :data="info.tabsData" /></div>
            <m-tips :content="info.boardName" theme="darkTransparent">
                <!-- equipmentNodeVosList是因为看板参数需要左侧图的id -->
                <img
                    v-if="info.boardShow && equipmentNodeVosList?.length"
                    class="monitoring-info-top-icon"
                    src="../../../../assets/images/common/modal.png"
                    @click="openEchartsData"
                />
            </m-tips>
        </div>
        <div class="monitoring-info-bottom">
            <template v-for="item in info.tabsData" :key="item.id">
                <EchartsPie
                    v-if="
                        ['heatIndoorTempnew', 'indoorTemp'].includes(item.id) &&
                        ['heatIndoorTempnew', 'indoorTemp'].includes(info.tabsModel) &&
                        ['AC', 'ACCI', 'ACCH'].includes(curPathName)
                    "
                    :class="{ 'chart-bottom': chartsData?.length === 5 }"
                    :style="{ height: chartsData?.length > 5 ? '234px' : '164px' }"
                    :data="chartsData"
                    @open-space-list="openSpaceList"
                />
                <template v-else-if="item.id === info.tabsModel">
                    <m-scrollbar v-if="item.infoCodes.length">
                        <div class="monitoring-info-bottom-box">
                            <div v-for="val in item.infoCodes" :key="val.infoCode" class="monitoring-info-bottom-item">
                                <div v-ellipsis class="monitoring-info-bottom-item-key">
                                    {{ getValueStr(val).text }} <span class="unit">{{ val.unit }}</span>
                                </div>
                                <div v-ellipsis class="monitoring-info-bottom-item-value">
                                    {{ val.name }}
                                </div>
                            </div>
                        </div>
                    </m-scrollbar>
                    <m-illustration v-else class="monitoring-info-empty" :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
                </template>
            </template>
        </div>
        <template v-if="showEchartData">
            <EchatsData v-if="curPathName === 'AC' || curPathName === 'ACCI'" :run-infos="info.tabsData" @close="closeEchartModal" />
            <HeatEcharts v-else :func-code="funcCode" @close="closeEchartModal" />
        </template>
    </div>
    <SpaceListDrawer v-if="showSpaceListDrawer" :data="activeSpaceList" @close="showSpaceListDrawer = false" />
</template>
<script setup>
import i18n from '@/localization';
import EchartsPie from './EchartsPie.vue'; // 室内温度
import EchatsData from './echarts/EchatsData.vue';
import HeatEcharts from './HeatEcharts/index.vue';
import { getValueStr } from '../../hooks/userEcharts';
import { querySystemRunningParam } from '@/apis/systemDiagram';
import baseStore from '@/store/baseStore';
import SpaceListDrawer from './spaceInfo/SpaceListDrawer.vue';
import useEchartsPie from '../../hooks/useEchartsPie';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import emitter from '@/utils/bus';
const equipmentNodeVosList = inject('equipmentNodeVosList');
const info = reactive({
    tabsModel: '',
    tabsData: [],
    boardShow: false, // 是否展示监控看板
    boardName: '', //监控看板名称
    boardItems: [] // 监控看板对象数组
});
const funcCode = ref(''); // 热源分类
const curPathName = ref('');
const routePathName = window.location.pathname.split('/');
curPathName.value = routePathName[routePathName.length - 1];
const showSpaceListDrawer = ref(false);
const activeSpaceList = ref({});
// 监控看板弹框
const showEchartData = ref(false);
const openEchartsData = () => {
    showEchartData.value = true;
    clearInterval(timer);
};
const openSpaceList = data => {
    emitter.emit(CLOSE_CONTROL_FORM);
    activeSpaceList.value = structuredClone(data);
    activeSpaceList.value.title = data.name + i18n.global.t('meos_control_web.space_list');
    showSpaceListDrawer.value = true;
};
const closeEchartModal = () => {
    showEchartData.value = false;
    timer = setInterval(() => {
        getInfoCodeConfigByObjectIds();
    }, 1000 * 60);
};
watch(
    () => showSpaceListDrawer.value,
    val => {
        val && queryListInfoCodeConfigsByObject(allSpaceIds?.value);
    }
);
const systemId = inject('systemId');
const selectedSystemObj = inject('selectedSystemObj');

const getInfoCodeConfigByObjectIds = id => {
    if (!selectedSystemObj.value) return;
    const graphTypeCode = selectedSystemObj.value?.isSub ? selectedSystemObj.value.originGraphTypeCode : selectedSystemObj.value.graphTypeCode;
    let queryParams = {
        systemClassCode: selectedSystemObj.value.classCode,
        graphTypeCode,
        imageOrProductName: selectedSystemObj.value.imageOrProductName
    };

    if (selectedSystemObj.value.diagramBaseObject === 'project') {
        queryParams.systemId = baseStore().projectId;
    } else {
        queryParams.systemId = selectedSystemObj.value.systemId;
    }
    // 2024-5-8 适配iot接口已改
    querySystemRunningParam(queryParams).then(res => {
        info.tabsData = [];
        info.boardItems = [];
        const { result, data } = res;
        if (result === 'success') {
            info.tabsData =
                data?.allInfoCode?.map(item => {
                    item.id = item.groupId;
                    item.name = item.groupName;
                    return item;
                }) || [];
            data?.customFunction?.length &&
                data?.customFunction.forEach(funcId => {
                    if (['heatIndoorTempnew', 'indoorTemp'].includes(funcId.funcCode)) {
                        info.tabsData = info.tabsData.concat([
                            {
                                id: funcId.funcCode,
                                name: funcId.funcName
                            }
                        ]);
                    }
                    if (['coldstationBoard', 'ACCHGBhotstationBoard', 'MunicipalhotstationBoard'].includes(funcId.funcCode)) {
                        info.boardShow = true;
                        info.boardName = funcId.funcName;
                        info.boardItems.push(funcId);
                    } else {
                        info.boardShow = false;
                    }
                });
            let curTab = info.tabsData.filter(item => item.id === info.tabsModel);
            if (id) {
                info.tabsModel = info.tabsData[0]?.id;
            } else {
                if (curTab && curTab.length) {
                    info.tabsModel = curTab[0].id;
                } else {
                    info.tabsModel = info.tabsData[0]?.id || '';
                }
            }
        }
    });
};

const showMonitoringInfo = computed(() => {
    if (info.tabsData.length) {
        return true;
    } else if (info.tabsData.length === 1) {
        let list = info.tabsData?.[0]?.infoCodes || [];
        return !list.every(res => !res || !res.dataSource || !res.dataSource.length || res.dataSource.length === 0);
    } else {
        return false;
    }
});
watch(
    () => info.boardItems[0]?.funcCode,
    (newl, old) => {
        funcCode.value = newl;
        if (old === newl) return;
    },
    { deep: true, immediate: true }
);
let timer = null;
function queryInfoCode() {
    timer && clearInterval(timer);
    getInfoCodeConfigByObjectIds();
    timer = setInterval(() => {
        getInfoCodeConfigByObjectIds();
    }, 1000 * 60);
}
onUnmounted(() => {
    clearInterval(timer);
});
const { chartsData, allSpaceIds, queryListSpacesByRunningMonitor, queryListInfoCodeConfigsByObject } = useEchartsPie(curPathName, systemId);
watch(
    () => systemId.value,
    () => {
        if (systemId.value) {
            queryListSpacesByRunningMonitor(systemId.value);
            queryInfoCode(systemId.value);
        }
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.monitoring-info {
    margin: 16px 0;
    &-top {
        height: 43px;
        display: flex;
        position: relative;
        top: 0;
        left: -12px;
        .top-tab {
            width: calc(100% - 20px);
            font-size: 16px;
        }

        .single-tab {
            :deep(.m-tabs-list) {
                &::before {
                    display: none;
                }

                .m-tabs-item {
                    cursor: default;
                }
            }
            :deep(.m-tabs-name) {
                color: @grey-900;
                font-weight: var(--platform-font-weight);
            }
        }

        &-icon {
            width: 20px;
            height: 20px;
            position: absolute;
            top: 12px;
            right: -12px;
            cursor: pointer;
            padding: 1px;

            &:hover {
                border-radius: 2px;
                background: rgba(196, 201, 207, 0.3);
            }
        }
    }

    &-bottom {
        border-top: 1px solid #e8ecf0;

        &-box {
            max-height: 234px;
            margin-top: 12px;
            display: grid;
            gap: 14px;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 44px;
        }

        &-item {
            font-weight: var(--platform-font-weight);
            line-height: 22px;

            &-key {
                color: #1f2429;
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .unit {
                    color: #646c73;
                    font-size: 14px;
                }
            }

            &-value {
                color: #646c73;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .chart-bottom {
        // height: 234px !important;
        margin: 20px 0;
    }
    &-empty {
        flex-direction: column;
        justify-content: center;
        height: 246px;
    }
}
@media only screen and (max-width: 1366px) {
    .monitoring-info {
        margin: 8px 0;
    }
    .chart-bottom {
        margin: 12px 0;
    }
}
</style>
