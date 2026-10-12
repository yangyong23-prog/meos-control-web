<template>
    <div class="seea-operating-control h100">
        <m-list-skeleton v-if="isLoading" class="seea-operating-loading-wrap" :item-num="6" />
        <m-scrollbar v-else-if="hasData" ref="scrollbarRef" class="container" :height="'100%'">
            <div class="operating-control-main wh100">
                <div v-if="sysInfoCodes?.length > 0" class="area-block">
                    <div class="card-header w100">
                        <div class="title-item">{{ i18n.global.t('meos_control_web.power_generation_statistics') }}</div>
                        <m-tips :content="i18n.global.t('meos_control_web.monitoring_dashboard')" theme="darkTransparent">
                            <div class="icon-item" @click="openElecAnalysis">
                                <DataBoardIcon></DataBoardIcon>
                            </div>
                        </m-tips>
                    </div>
                    <div class="card-contend elec-statistics">
                        <div v-for="info in sysInfoCodes" :key="info.infoCode" class="sys-info-item">
                            <div class="val-wrap">
                                <div v-ellipsis class="val ffCustom-M m-ellipsis">{{ info.dataValue ?? '--' }}</div>
                                <div class="unit">{{ info.unit ?? '' }}</div>
                            </div>
                            <div class="label">{{ info.aliasName ?? '--' }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="equipStatics?.length > 0" class="area-block">
                    <div class="card-header w100">
                        <div class="title-item">{{ i18n.global.t('meos_control_web.device_statistics') }}</div>
                    </div>
                    <EquipStatics> </EquipStatics>
                </div>
                <div v-if="runnigParamsObj && runnigParamsData" class="area-block">
                    <div class="card-header w100">
                        <div class="title-item">{{ i18n.global.t('meos_control_web.operating_parameters') }}</div>
                    </div>
                    <RunnigParams class="w100" :select-obj="runnigParamsObj" :data="runnigParamsData"> </RunnigParams>
                </div>
            </div>
        </m-scrollbar>
        <m-illustration v-else :title="i18n.global.t('meos_control_web.no_content')" type="noContent" style="height: calc(100% - 32px)" class="fcc"></m-illustration>
        <MonitoringBoard v-if="showElecAnalysis" :sys-info-codes="sysInfoCodes" @close="showElecAnalysis = false" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import {
    showElecAnalysisKey,
    opControlObjIdsKey,
    systemIdKey,
    sysInfoCodesKey,
    equipStaticsKey,
    relationChartComponentKey,
    cumulativeEnergyUpdateTimeKey
} from '@/views/SEEA/hooks/useBaseHook';
import Decimal from 'decimal.js';
import DataBoardIcon from '@/assets/svg/SEEA/data-board.svg';
import dataDockHandling from '@/hooks/dataDockHandling';
import MonitoringBoard from '../components/monitoringBoard/index.vue';
import { listInfoCodeConfigsByObjectIdCommon, batchQueryPeriodData } from '@/apis/public';
import EquipStatics from './EquipStatics.vue';
import { RUNNING_MONITOR_TYPE, MONITORINGSTATION_CLASSCODE, dayGroupCode, monthGroupCode, anualGroupCode } from '../constants/index';
import { DETAIL, SUCCESSCODE, getDayjsTz } from '@/utils/globalVariables';
import RunnigParams from '@/components/ObjectInfoComponents/RunningParams/index.vue';
import { isEdge } from '@/utils/envUtils';
import dayjs from 'dayjs';
import useStore from '@/store';

const { base } = useStore();
const { loadDynaDataWithIotHandling } = dataDockHandling();
const showElecAnalysis = inject(showElecAnalysisKey);
const opControlObjIds = inject(opControlObjIdsKey);
const systemId = inject(systemIdKey);
const equipStatics = inject(equipStaticsKey);
const relationChartComponent = inject(relationChartComponentKey);
const cumulativeEnergyUpdateTime = inject(cumulativeEnergyUpdateTimeKey);

const sysInfoCodes = inject(sysInfoCodesKey);
const runnigParamsObj = ref(); //运行参数对象
const staticsLoading = ref(false);

// 运行参数数据
const runnigParamsData = computed(() => {
    return runnigParamsObj.value?.relInfoCodeGroupConfigs?.find(g => g.groupCode === 'runningParameter');
});
const hasData = computed(() => {
    return equipStatics.value?.length > 0 || sysInfoCodes.value?.length > 0 || runnigParamsData.value;
});
const isLoading = computed(() => {
    // return true;
    return relationChartComponent?.value?.graphDataloading?.value || staticsLoading.value;
});
let fetchAbortController = null;
watch(opControlObjIds, () => {
    if (opControlObjIds.value?.length > 0) {
        staticsLoading.value = true;
        fetchAbortController?.abort();
        fetchAbortController = new AbortController();
        loadDynaDataWithIotHandling(
            {
                runningMonitorType: RUNNING_MONITOR_TYPE,
                objectIds: opControlObjIds.value,
                templateCode: DETAIL,
                filterGroups: [{ groupCode: dayGroupCode }, { groupCode: monthGroupCode }, { groupCode: anualGroupCode }, { groupCode: 'runningParameter' }]
            },
            listInfoCodeConfigsByObjectIdCommon,
            fetchAbortController.signal
        )
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    // console.log('res: ', res.data);
                    const systemObj = res.data?.find(obj => obj.id === systemId?.value);
                    // 气象监测站对象
                    runnigParamsObj.value = res.data?.find(obj => obj.classCode === MONITORINGSTATION_CLASSCODE);
                    sysInfoCodes.value = [];
                    if (systemObj) {
                        systemObj.relInfoCodeGroupConfigs?.forEach(g => {
                            if (g.groupCode === dayGroupCode) {
                                if (g?.relInfoCodeConfigs && g?.relInfoCodeConfigs?.length) {
                                    sysInfoCodes.value.push({
                                        ...g?.relInfoCodeConfigs[0],
                                        groupCode: g.groupCode,
                                        groupName: g.groupName
                                    });
                                }
                            } else if (g.groupCode === monthGroupCode) {
                                if (g?.relInfoCodeConfigs && g?.relInfoCodeConfigs?.length) {
                                    sysInfoCodes.value.push({
                                        ...g?.relInfoCodeConfigs[0],
                                        groupCode: g.groupCode,
                                        groupName: g.groupName
                                    });
                                }
                            } else if (g.groupCode === anualGroupCode) {
                                if (g?.relInfoCodeConfigs && g?.relInfoCodeConfigs?.length) {
                                    sysInfoCodes.value.push({
                                        ...g?.relInfoCodeConfigs[0],
                                        groupCode: g.groupCode,
                                        groupName: g.groupName
                                    });
                                }
                            }
                        });
                        sysInfoCodes.value.sort((a, b) => a.sequence - b.sequence);
                    } else {
                        sysInfoCodes.value = [];
                    }
                }
                if (sysInfoCodes.value?.length > 0) {
                    batchQueryPeriodData(
                        {
                            beginDate: getDayjsTz().startOf('year').format('YYYYMMDDHHmmss'),
                            endDate: getDayjsTz().add(1, 'year').startOf('year').format('YYYYMMDDHHmmss'),
                            enumTime: '1y',
                            infoCodes: ['accddailyCumulativeEnergy'],
                            objectIds: [systemId.value]
                        },
                        {}
                    ).then(yearRes => {
                        let yearVal = new Decimal(0),
                            hasVal = false;
                        if (yearRes.code === SUCCESSCODE) {
                            yearRes?.data.forEach(dat => {
                                dat?.data.forEach(dat2 => {
                                    dat2?.data.forEach(dat3 => {
                                        if (dat3?.ipValue) {
                                            hasVal = true;
                                            const ipValue = dat3?.ipValue ?? 0;
                                            yearVal = Decimal.add(ipValue, yearVal);
                                        }
                                    });
                                });
                            });
                        }
                        if (hasVal) {
                            sysInfoCodes.value?.forEach(info => {
                                if (info.groupCode === anualGroupCode) {
                                    info.dataValue = yearVal.toFixed(1) || '--';
                                }
                            });
                        }
                    });
                }
            })
            .finally(() => {
                staticsLoading.value = false;
            });
    } else {
        sysInfoCodes.value = [];
        runnigParamsObj.value = null;
    }
});

watchEffect(() => {
    const curTimeFmt = getDayjsTz().format('YYYY.MM.DD HH:mm');
    sysInfoCodes.value?.forEach(info => {
        if (isEdge()) {
            if (info?.dataValue) {
                cumulativeEnergyUpdateTime.value[info.groupCode] = curTimeFmt;
            }
        } else {
            if (base.headerConfig?.startTime) {
                const t = dayjs(base.headerConfig.startTime).format('YYYY.MM.DD HH:mm:ss');
                cumulativeEnergyUpdateTime.value[info.groupCode] = t ?? '--';
            }
        }
    });
});
// 打开运行分析
const openElecAnalysis = () => {
    showElecAnalysis.value = true;
};
</script>
<style lang="less" scoped>
.seea-operating-control {
    position: relative;
    // overflow: auto;
    .seea-operating-loading-wrap {
        padding-right: 16px;
    }
    .operating-control-main {
        // margin-top: 16px;
        padding-right: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
        align-self: stretch;
    }
    .area-block {
        width: 100%;
        // height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }
    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .card-contend {
        width: 100%;
        height: 100%;
    }
    .elec-statistics {
        display: flex;
        padding: 16px 12px;
        align-items: center;
        align-content: center;
        gap: 8px;
        flex-wrap: wrap;
        border-radius: 4px;
        background: #f4f8ff;
        .sys-info-item {
            display: flex;
            // flex: 1;
            flex-direction: column;
            align-items: flex-start;
            .val-wrap {
                display: flex;
                align-items: center;
                gap: 4px;
                max-width: 100%;
                .val {
                    color: var(--gray-900, #1b2129);
                    font-size: 20px;
                    font-weight: 700;
                }
                .unit {
                    color: var(--gray-600, #626c78);
                    font-size: 14px;
                    font-weight: 400;
                }
            }
            .label {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
            }
        }
    }
    .title-item {
        display: flex;
        align-items: center;
        gap: 9px;

        color: var(--gray-800, #2e3742);
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 26px; /* 133.333% */
        &::before {
            // position: absolute;
            content: '';
            // top: 7px;
            // left: 0;
            width: 3px;
            height: 14px;
            background-color: var(--blue-500, #246fe5);
        }
    }
    .icon-item {
        display: inline-flex;
        padding: 3px;
        align-items: center;
        gap: 10px;
        &:hover {
            cursor: pointer;
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    /* 小尺寸：窗口宽度 <1600px */
    @media (max-width: 1600px) {
        .sys-info-item {
            width: 48%;
        }
    }
    /* 大尺寸：窗口宽度 ≥1600px */
    @media (min-width: 1600px) {
        .elec-statistics {
            flex-direction: row;
            justify-content: space-between;
        }

        .sys-info-item {
            flex: 1; /* 子元素按比例分配宽度（默认3列） */
            max-width: 33%;
        }
    }
}
</style>
