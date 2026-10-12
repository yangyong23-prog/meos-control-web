<template>
    <!-- <div class="env-container"> -->
    <m-scrollbar v-if="showCharts" box-class="environmental-quality-scrollbar" :height="'100%'">
        <slot name="top"></slot>
        <div v-if="showCharts && show">
            <div class="title fc">
                <slot name="title" :graphic-data="graphicData">
                    {{ graphicData?.groupName || '' }}
                </slot>
            </div>
            <slot name="info" :graphic-data="graphicData"></slot>
            <div v-for="(item, index) in graphicData?.groupChildren || []" :key="index">
                <TempChart :graphic-data="item" :running-monitor-type="runningMonitorType" />
            </div>
        </div>
        <Information v-if="Object.keys(currentStatisticArr).length != 0" :current-statistic-arr="currentStatisticArr" />
        <div v-if="sensorArr.length">
            <div class="title">{{ i18n.global.t('meos_control_web.related_sensor') }}</div>
            <AssociatedSensors :sensor-arr="sensorArr" />
        </div>
    </m-scrollbar>
    <div v-show="!showCharts" class="environmental-quality-empty-container">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
    </div>
</template>

<script setup>
import TempChart from './tempChart.vue';
// import Co2Chart from './co2Chart.vue';
import Information from './information.vue';
import AssociatedSensors from './associatedSensors.vue';
import { MLoading } from 'meri-plus';
import { listInfoCodeConfigsByObject, listSensorByServiceSpace } from '@/apis/airterminalxplantrunmonitor';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import dataDockHandling from '@/hooks/dataDockHandling';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import i18n from '@/localization';
import { envParamShellConfigKey } from '@/views/ACOperationControl/injectKeys';
import { envToControlAimMap, envToParamsMap } from '@/views/ACOperationControl/variables';

// import DockSingleton from '@/hooks/responsiveDock';
// const { getAbnormalEventsList } = DockSingleton.getInstance();
const props = defineProps({
    typeName: {
        type: String,
        default: ''
    },
    spaceId: {
        type: String,
        default: ''
    },
    runningMonitorType: {
        type: String,
        default: ''
    },
    isAbnormal: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: true
    }
});

const graphicData = ref({});
const sensorArr = ref([]);
const abnormalEventList = ref([]);
const currentStatisticArr = ref([]);
const commonDrawerRoot = inject(commonDrawerRootContextKey);
const envParamShellConfig = inject(envParamShellConfigKey, ref([]));
let propsSseClient = commonDrawerRoot?.demandSseClient;

const controlAimInfoCodeToEnvMap = Object.entries(envToControlAimMap).reduce((result, [envCode, infoCode]) => {
    result[infoCode] = envCode;
    return result;
}, {});

const allControlAimInfoCodes = Object.values(envToControlAimMap);

const selectedEnvConfigMap = computed(() => {
    const configMap = {};
    (envParamShellConfig.value || []).forEach(item => {
        const curArr = item?.value || [];
        const envCode = Object.entries(envToParamsMap).find(([key, valueArr]) => {
            return curArr?.some(val => valueArr.includes(val));
        })?.[0];
        if (envCode) {
            configMap[envCode] = curArr;
        }
    });
    return configMap;
});

// 这里只过滤控制目标值类信息点；
// 已确认壳配置不控制实时环境参数字段，因此不再维护“环境 infoCode -> 环境类型”的额外映射。
// 注意：这个过滤只用于 curveStatistic / currentWorkPlaneLux 这类曲线展示区，
// 不用于 currentStatistic 实时参数区。实时参数仍按接口返回直接展示，不受壳配置勾选影响。
const shouldShowControlAimInfoCode = infoCode => {
    const envCode = controlAimInfoCodeToEnvMap[infoCode];
    if (!envCode || !allControlAimInfoCodes.includes(infoCode)) {
        return true;
    }
    if (!envParamShellConfig?.value?.length) {
        return true;
    }
    return selectedEnvConfigMap.value?.[envCode]?.includes?.(infoCode) ?? false;
};

// 曲线区和控制型展示区按壳配置裁剪；
// 与之前不同的是，currentStatistic 不再复用这层过滤逻辑，避免把实时参数错误隐藏。
const filterEnvGroupChildren = groupChildren => {
    return (groupChildren || [])
        .map(item => {
            const relInfoCodeConfigs = (item?.relInfoCodeConfigs || []).filter(config => shouldShowControlAimInfoCode(config?.infoCode));
            return {
                ...item,
                relInfoCodeConfigs
            };
        })
        .filter(item => item?.relInfoCodeConfigs?.length);
};

watch(
    () => props.spaceId,
    () => {
        initData(true);
    }
);
onMounted(() => {
    initData(true);
});
const { writeDataToResponsiveDock } = dataDockHandling();
const spaceId = computed(() => {
    return props.spaceId;
});
const showCharts = computed(() => {
    return !!graphicData.value?.groupChildren?.length;
});

useEquipInfoSSEHandle(
    spaceId,
    {
        RISK_EVENT_DETAIL: abnormalEventList,
        curveStatistic: graphicData,
        currentStatistic: currentStatisticArr
    },
    true,
    DETAIL,
    propsSseClient
);

const initData = loading => {
    let Mloading = null;
    if (loading) {
        Mloading = MLoading.service({
            target: '.environmental-quality-empty-container',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    }
    const promises = [
        listInfoCodeConfigsByObject({ runningMonitorType: props.runningMonitorType, objectIds: [props.spaceId], templateCode: DETAIL }),
        listSensorByServiceSpace({ spaceId: props.spaceId })
    ];
    Promise.all(promises)
        .then(res => {
            abnormalEventList.value = [];
            graphicData.value = {};
            currentStatisticArr.value = [];
            sensorArr.value = [];
            if (res[0].code === SUCCESSCODE) {
                res[0].data[0]?.relInfoCodeGroupConfigs?.map(item => {
                    if (item.groupCode === 'spaceStatus') {
                        //空间状态
                        console.log(item, 'tagsValue');
                    }
                    if (item.groupCode === 'riskEvent') {
                        //异常事件
                        abnormalEventList.value = item?.relInfoCodeConfigs[0].dataValue || [];
                    }
                    if (item.groupCode === 'curveStatistic' || item.groupCode === 'currentWorkPlaneLux') {
                        //实时数据展示
                        graphicData.value = {
                            ...item,
                            groupChildren: filterEnvGroupChildren(item.groupChildren)
                        };
                    }
                    //实时参数
                    if (item.groupCode === 'currentStatistic') {
                        // currentStatistic 展示的是实时参数，不受壳配置控制目标值/调度状态勾选影响。
                        currentStatisticArr.value = item;
                    }
                });
                // 按需订阅时收集sse订阅参数
                if (commonDrawerRoot?.props.isSubscriptOnDemand) {
                    const { classCodeIds } = iterateObjct4InstanceInfo(res[0].data);
                    commonDrawerRoot.setClass2Ids(props.spaceId, classCodeIds);
                    writeDataToResponsiveDock(res[0].data);
                }
            }
            if (res[1].code === SUCCESSCODE) {
                sensorArr.value = res[1].data;
            }
            Mloading?.destroy();
        })
        .catch(() => {
            Mloading?.destroy();
        });
};
</script>

<style lang="less" scoped>
:deep(.environmental-quality-scrollbar) {
    padding: 0 24px;
}
// .env-container {
// height: 100%;
// margin-right: -14px;
.title {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    font-size: 16px;
    font-weight: 700;
    margin: 16px 0;
    &::after {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500, #246fe5);
        content: '';
    }
}
.title-name {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    font-size: 16px;
    font-weight: 700;
    height: 22px;
    line-height: 22px;
    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500, #246fe5);
        content: '';
    }
}
.exception-list {
    padding-right: 10px;
    &-item {
        position: relative;
        padding: 12px 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #fffbfb 0.85%, rgba(255, 255, 255, 0) 96.02%);
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    &-title {
        padding-left: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
    &-title:before {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #f55047;
        border: 1px solid #fff;
        left: 10px;
        top: 18px;
    }
}
.exception-list-item:hover {
    cursor: pointer;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}
.mb0 {
    margin-bottom: 0;
}
.environmental-quality-empty-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
// }
</style>
