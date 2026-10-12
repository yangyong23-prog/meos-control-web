<template>
    <m-scrollbar class="echarts-data-box-main">
        <div class="mrow">
            <div class="mcol-12">
                <div id="SystemEfficiency" class="main-box run-info" style="padding-right: 0">
                    <div class="main-box-title">{{ i18n.global.t('meos_control_web.system_operation_efficiency') }}</div>
                    <div class="main-box-chart fcc">
                        <template v-for="item in runEfficiencyData" :key="item.name">
                            <RunEfficiency
                                v-if="item.pieData"
                                :pie-data="item.pieData"
                                :max="item.max"
                                :name="item.name"
                                :data="item.data"
                                :total="item.total"
                                :split="item.split"
                                :color="item.color"
                            />
                        </template>
                        <template v-if="runEfficiencyData.length === 0">
                            <Empty :text="i18n.global.t('common.no_data')" width="80px" height="80px" />
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="mrow">
            <div
                :class="{ 'mcol-4': coolSideTemData.data.length, 'mcol-10': !coolSideTemData.data.length }"
                :style="!coolSideTemData.data.length ? { width: 'calc(100% - 346px)' } : {}"
            >
                <div id="ChillerLoad" class="main-box">
                    <div class="main-box-title">{{ i18n.global.t('meos_control_web.chiller_operation') }}</div>
                    <div class="main-box-chart">
                        <EchartLine v-if="coolRunData.data.length" :data="coolRunData.data" :x-axis-data="coolRunData.xAxisData" unit="%" />
                        <template v-else>
                            <Empty :text="i18n.global.t('common.no_data')" width="80px" height="80px" />
                        </template>
                    </div>
                </div>
            </div>
            <div :class="{ 'mcol-8': coolSideTemData.data.length, 'mcol-2': !coolSideTemData.data.length }" :style="coolSideTemData.data.length ? {} : { width: '346px' }">
                <div id="ChillingTemp" class="main-box fc">
                    <div v-if="coolSideTemData.data.length" class="main-box-left">
                        <div class="main-box-title">{{ i18n.global.t('meos_control_web.cooling_side_temperature_analysis') }}</div>
                        <div class="main-box-chart">
                            <EchartLine :data="coolSideTemData.data" :x-axis-data="coolSideTemData.xAxisData" unit="℃" />
                            <div class="run-info-box"></div>
                        </div>
                    </div>
                    <div class="main-box-right">
                        <div class="main-box-title">{{ i18n.global.t('meos_control_web.cooling_side_realtime_value') }}</div>
                        <div class="main-box-chart">
                            <template v-if="coolSideInfos.length">
                                <div
                                    v-for="val in coolSideInfos"
                                    :key="val.infoCode"
                                    class="card-box-list fcb"
                                    :infoCode="val.infoCode"
                                    style="padding-right: 8px"
                                    @mousemove="e => openTimeFun(e, val.dataTime)"
                                    @mouseleave="closeTimeFun"
                                >
                                    <span class="card-box-list-key">{{ val.name }}</span>
                                    <span class="card-box-list-value">{{ getValueStr(val).text }}</span>
                                </div>
                            </template>
                            <template v-else>
                                <Empty :text="i18n.global.t('common.no_data')" width="80px" height="80px" />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mrow tem">
            <div class="mcol-4">
                <div id="FreezingTempDiff" class="main-box back-tem">
                    <div class="main-box-title">{{ i18n.global.t('meos_control_web.chilled_side_supply_return_delta_t') }}</div>
                    <div class="main-box-chart">
                        <EchartLine v-if="coolSideBackTemData.data?.length" :data="coolSideBackTemData.data" :x-axis-data="coolSideBackTemData.xAxisData" unit="℃" />
                        <template v-else>
                            <Empty :text="i18n.global.t('common.no_data')" width="80px" height="80px" />
                        </template>
                    </div>
                </div>
            </div>
            <div class="mcol-8">
                <div id="FreezingTemp" class="main-box fc">
                    <div class="main-box-left">
                        <div class="main-box-title">{{ i18n.global.t('meos_control_web.chilled_side_supply_temp') }}</div>
                        <div class="main-box-chart">
                            <EchartLine
                                v-if="coolSideSupplyWaterTemData.data?.length"
                                :data="coolSideSupplyWaterTemData.data"
                                :x-axis-data="coolSideSupplyWaterTemData.xAxisData"
                                unit="℃"
                            />
                            <template v-else>
                                <Empty :text="i18n.global.t('common.no_data')" width="80px" height="80px" />
                            </template>
                        </div>
                    </div>
                    <div class="main-box-right">
                        <div class="main-box-title">{{ i18n.global.t('meos_control_web.chilled_side_realtime_value') }}</div>
                        <m-scrollbar class="main-box-chart">
                            <template v-if="coolDongSideInfos.length">
                                <div
                                    v-for="val in coolDongSideInfos"
                                    :key="val.infoCode"
                                    class="card-box-list fcb"
                                    :infoCode="val.infoCode"
                                    style="padding-right: 8px"
                                    @mousemove="e => openTimeFun(e, val.dataTime)"
                                    @mouseleave="closeTimeFun"
                                >
                                    <span class="card-box-list-key">{{ val.name }}</span>
                                    <span class="card-box-list-value">{{ getValueStr(val).text }}</span>
                                </div>
                            </template>

                            <template v-else>
                                <Empty :text="i18n.global.t('common.no_data')" width="80px" height="80px" />
                            </template>
                        </m-scrollbar>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showFreezingSecondary" id="FreezingSecondary" class="cool-two">
            <div class="cool-two-title">{{ i18n.global.t('meos_control_web.chilled_secondary_side') }}</div>
            <template v-if="pumpData.data.length">
                <div v-for="(item, i) in pumpData.data" :key="i" class="mrow">
                    <div v-for="val in item" :key="val.name" class="mcol-6">
                        <div class="main-box">
                            <div class="main-box-title">{{ val.name }}</div>
                            <div class="main-box-chart fcc">
                                <EchartLine :data="(val.data as any)" :x-axis-data="pumpData.xAxisData" unit="℃" dashed />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <Empty :text="i18n.global.t('common.no_data')" width="80px" height="80px" />
            </template>
        </div>
    </m-scrollbar>
    <m-popover virtual-triggering :virtual-ref="timePopRef" trigger="manually" theme="darkTransparent" :is-open="showTimePop" :show-arrow="false">
        <template #content>{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ time }}</template>
    </m-popover>
</template>

<script lang="ts" setup>
import Empty from '@/components/common/Empty.vue';
import { ComputedRef } from 'vue';
import RunEfficiency from './RunEfficiency.vue';
import EchartLine from './EchartLine.vue';
import dayjs from 'dayjs';
import { getSystemEfficiency, getChillerLoad, getChillingTemp, getFreezingTempDiff, getFreezingTemp, getFreezingSecondary } from '@/apis/echarts';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { AppLoadingService } from '@/components/AppLoading/service';
import { findLeastCommonMultiple } from '@/utils/tools';
import { isArray, orderBy, toNumber } from 'lodash';
import emitter from '@/utils/bus';
import { querySystemRunningParam } from '@/apis/systemDiagram';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import { dayjsIsBefore } from '@/utils/dayjsTools';

const selectedSystemObj: any = inject('selectedSystemObj');
type Unit = 'C' | 'kpa' | 'RH' | 'dra' | '台' | '℃' | '';
interface IOTObject {
    textMap?: string;
    isStrategy?: boolean;
    infoCode: string;
    name: string;
    unit?: Unit;
    dataValue: number | string | null;
    max?: number;
    min?: number;
    forced?: number;
    dataSource?: Record<string, string>[] | null;
    createTime?: string;
    forceInfo?: IOTObject[];
    value?: number | string | null;
    isEdit?: boolean;
    ordered?: number;
    components?: string[];
    objectId: string;
    [key: string]: any;
}
interface EchartLineData {
    name: string;
    data: Array<number | null>;
    smooth?: boolean;
    areaStyle?: Record<string, any>;
    lineStyle?: Record<string, any>;
}
interface SystemRunInfoObject {
    id: string;
    name: string;
    list: IOTObject[];
}
interface InfoCode {
    groupId: string;
    groupName: string;
    infoCodes: IOTObject[];
    parentId: string;
    children?: InfoCode[];
}
interface SystemRunningConditionInfo {
    controlInfoCode: InfoCode[];
    extraInfo: Record<string, any>;
    homeInfoCode: InfoCode[];
    allInfoCode: InfoCode[];
    [key: string]: any;
}

// 2024-5-8 适配iot接口已改
const getSystemRunningConditionInfo = async (id: string[] | string, systemId: string, callback: (arg0: any) => void) => {
    let queryParams = null;
    if (!selectedSystemObj.value) {
        return null;
    }
    if (selectedSystemObj.value.diagramBaseObject === 'project') {
        queryParams = {
            objectIds: [baseStore().projectId],
            systemId: baseStore().projectId,
            systemClassCode: selectedSystemObj.value.classCode,
            graphTypeCode: selectedSystemObj.value.graphTypeCode,
            imageOrProductName: selectedSystemObj.value.imageOrProductName
        };
    } else {
        queryParams = {
            objectIds: [selectedSystemObj.value.systemId],
            systemId: selectedSystemObj.value.systemId,
            systemClassCode: selectedSystemObj.value.classCode,
            graphTypeCode: selectedSystemObj.value.graphTypeCode,
            imageOrProductName: selectedSystemObj.value.imageOrProductName
        };
    }
    await querySystemRunningParam(queryParams).then((res: any) => {
        if (res.code === SUCCESSCODE) {
            callback(res.data || {});
        }
    });
};
const getValueStr = (data: IOTObject | any) => {
    if (data?.dataSource?.length) {
        let str = '';
        data.dataSource.forEach((item: { [x: string]: string }) => {
            if (data.dataValue) {
                // eslint-disable-next-line no-restricted-syntax
                if (toNumber(item.code) === toNumber(data.dataValue)) {
                    str = item.name;
                }
            }
        });
        return { html: `<span>${str || '--'}</span>`, text: str || '--' };
    }
    // eslint-disable-next-line no-nested-ternary
    const value = data.dataValue ? data.dataValue : '--';
    return {
        html: `<span>${data.dataValue || ''}</span> <span>${data.unit || ''}</span>`,
        text: `${value} ${data.unit || ''}`
    };
};
const props = defineProps({
    tabId: {
        type: String,
        default: ''
    }
});
const color = [
    {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
            {
                offset: 0,
                color: '#246FE5' // 0% 处的颜色
            },
            {
                offset: 1,
                color: '#fff' // 100% 处的颜色
            }
        ],
        global: false // 缺省为 false
    },
    {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
            {
                offset: 0,
                color: '#14C4C4 ' // 0% 处的颜色
            },
            {
                offset: 1,
                color: '#fff' // 100% 处的颜色
            }
        ],
        global: false // 缺省为 false
    }
];
const show = ref(false);
const runEfficiencyData = ref<any[]>([]);
const coolRunData = ref<{ data: EchartLineData[]; xAxisData: string[] }>({ data: [], xAxisData: [] });
const coolSideTemData = ref<{ data: EchartLineData[]; xAxisData: string[] }>({ data: [], xAxisData: [] });
const coolSideBackTemData = ref<{ data: EchartLineData[]; xAxisData: string[] }>({ data: [], xAxisData: [] });
const coolSideSupplyWaterTemData = ref<{ data: EchartLineData[]; xAxisData: string[] }>({ data: [], xAxisData: [] });
const pumpData = ref<{ data: EchartLineData[][]; xAxisData: string[] }>({ data: [], xAxisData: [] });
const loadingInstances = new Set<any>();
const sideInfos = ['coolWaterMainReturnTemp', 'coolWaterMainSupplyTemp', 'coolWaterMainReturnPress', 'coolWaterMainSupplyPress'];
const dongSideInfos = ['primaryChillWaterFlow', 'chillWaterMainSupplyPress', 'chillWaterMainReturnPress', 'distributorCollectorDetaPress'];
const coolSideInfos = computed(() => {
    const arr = runInfos.value?.find(item => item.name === i18n.global.t('meos_control_web.cooling_side'))?.list.filter(item => sideInfos.includes(item.infoCode));
    return orderBy(arr, ['ordered'], ['asc']);
});
const coolDongSideInfos = computed(() => {
    const arr = runInfos.value?.find(item => item.name === i18n.global.t('meos_control_web.chilled_water_side'))?.list.filter(item => dongSideInfos.includes(item.infoCode));
    return orderBy(arr, ['ordered'], ['asc']);
});
const timePopRef = ref<HTMLElement | null>(null);
const showTimePop = ref(false);
const systemRunningConditionInfo = ref<SystemRunningConditionInfo>();
const time = ref('');
const runInfos: ComputedRef<SystemRunInfoObject[] | undefined> = computed(() => {
    const arr = systemRunningConditionInfo.value?.allInfoCode?.map(item => ({
        id: item.groupId,
        name: item.groupName,
        list: item.infoCodes
    }));
    arr?.push({ id: 'pie', name: i18n.global.t('meos_control_web.indoor_temperature'), list: [] });
    return arr;
});
const showFreezingSecondary = ref(true);
const init = () => {
    getRunEfficiencyData();
    getCoolSideTemData();
    getCoolSideBackTemData();
    getCoolSideSupplyWaterTemData();
    getPumpData();
    getSystemRunningConditionInfo(props.tabId, props.tabId, data => {
        systemRunningConditionInfo.value = data;
    });
};
const loadingFun = (target: string) =>
    (() => {
        const loading = AppLoadingService.service({
            target,
            text: i18n.global.t('common.loading'),
            size: 100
        });
        loadingInstances.add(loading);
        return loading;
    })();
const destroyLoading = (loading: any, delay = 0) => {
    const destroy = () => {
        loadingInstances.delete(loading);
        loading?.destroy?.();
    };
    if (!delay) {
        destroy();
        return;
    }
    setTimeout(destroy, delay);
};
const destroyAllLoading = () => {
    loadingInstances.forEach(loading => loading?.destroy?.());
    loadingInstances.clear();
};
const openTimeFun = (e: any, dataTime: any) => {
    if (dataTime) {
        timePopRef.value = e.target;
        showTimePop.value = true;
        time.value = dayjs(dataTime).format('YYYY.MM.DD HH:mm:ss');
    }
};
const closeTimeFun = () => {
    showTimePop.value = false;
    timePopRef.value = null;
    time.value = '';
};

function generateArray() {
    // 设置起始时间和结束时间
    const startTime = dayjs('2023-11-20 00:00:00');
    const endTime = dayjs('2023-11-20 23:59:59');

    // 初始化结果数组
    const arrayObject: string[] = [];

    // 生成15分钟维度的时间数组
    let currentTime = startTime;
    while (dayjsIsBefore(currentTime, endTime)) {
        arrayObject.push(currentTime.format('HH:mm'));
        currentTime = currentTime.add(15, 'minute');
    }
    return arrayObject;
}
/**
 * @description: 系统运行看板-系统运行效率
 * @return {*}
 */
const getRunEfficiencyData = () => {
    const loading = loadingFun('#SystemEfficiency');
    runEfficiencyData.value = [];
    getSystemEfficiency({ systemId: props.tabId })
        .then((res: any) => {
            if (res.code === SUCCESSCODE && res.data?.length) {
                res.data = res.data.map((item: any) => {
                    const total = item.excellentEnd * 1;
                    const values = [item.improveEnd * 1, item.generallyEnd * 1, item.goodEnd * 1, item.excellentEnd * 1];
                    const obj = {
                        pieData: [
                            {
                                value: item.improveEnd * 1,
                                schedule: (item.improveEnd * 1) / total,
                                data: item.improveEnd * 1,
                                range: `${item.improveStart} - ${item.improveEnd}`,
                                name: i18n.global.t('meos_control_web.needs_improvement'),
                                color: '#F55047'
                            },
                            {
                                value: item.generallyEnd * 1 - item.generallyStart * 1,
                                schedule: (item.improveEnd * 1) / total + (item.generallyEnd * 1 - item.generallyStart * 1) / total,
                                data: item.generallyEnd * 1,
                                range: `${item.generallyStart} - ${item.generallyEnd}`,
                                name: i18n.global.t('meos_control_web.general'),
                                color: '#FFB800'
                            },
                            {
                                value: item.goodEnd * 1 - item.goodStart * 1,
                                schedule:
                                    (item.improveEnd * 1) / total + (item.generallyEnd * 1 - item.generallyStart * 1) / total + (item.goodEnd * 1 - item.goodStart * 1) / total,
                                data: item.goodEnd * 1,
                                range: `${item.goodStart} - ${item.goodEnd}`,
                                name: i18n.global.t('meos_control_web.good'),
                                color: '#246FE5'
                            },
                            {
                                value: item.excellentEnd * 1 - item.excellentStart * 1,
                                schedule: 1,
                                data: item.excellentEnd * 1,
                                range: `${item.excellentStart} - ${item.excellentEnd}`,
                                name: i18n.global.t('meos_control_web.excellent'),
                                color: '#14C4C4'
                            }
                        ],
                        data: item.target,
                        name: item.efficiencyName,
                        max: item.excellentEnd,
                        split: 0.5,
                        color: '#C4C9CF',
                        total
                    };
                    if (obj.data) {
                        if (toNumber(obj.data) / obj.max <= obj.pieData[0].schedule) {
                            obj.color = obj.pieData[0].color;
                        } else if (toNumber(obj.data) / obj.max <= obj.pieData[1].schedule) {
                            obj.color = obj.pieData[1].color;
                        } else if (toNumber(obj.data) / obj.max <= obj.pieData[2].schedule) {
                            obj.color = obj.pieData[2].color;
                        } else if (toNumber(obj.data) / obj.max <= obj.pieData[3].schedule) {
                            obj.color = obj.pieData[3].color;
                        }
                    }
                    try {
                        if (item.excellentEnd > 10) {
                            const numbers: number[] = [];
                            values.forEach(element => {
                                const aaa: string = toNumber(element).toFixed(0);
                                numbers.push(toNumber(aaa));
                            });
                            const result = findLeastCommonMultiple(numbers);
                            obj.split = result;
                        }
                    } catch (error) {
                        console.error(error);
                    }

                    return obj;
                });
                runEfficiencyData.value = res.data;
            }
            destroyLoading(loading, 1000);
        })
        .catch(() => {
            destroyLoading(loading, 1000);
        });
};
/**
 * @description: 系统运行看板-冷机运行
 * @return {*}
 */
const getCoolRunData = () => {
    coolRunData.value.xAxisData = generateArray();
    const loading = loadingFun('#ChillerLoad');
    getChillerLoad({ systemId: props.tabId })
        .then((res: any) => {
            if (res.code === SUCCESSCODE && res.data?.length) {
                coolRunData.value.data = handelData(res.data[0], false);
            }
            destroyLoading(loading);
        })
        .catch(() => {
            destroyLoading(loading);
        });
};
const orderFun = (order: string[], data: any) => {
    const arr: any[] = [];
    order.forEach(item => {
        const obj = data.data.find((val: { infoCode: string }) => val.infoCode === item);
        if (obj) {
            arr.push(obj);
        }
    });
    return arr;
};
/**
 * @description: 系统运行看板-冷却侧温度分析
 * @return {*}
 */
const getCoolSideTemData = () => {
    coolSideTemData.value.xAxisData = generateArray();
    const loading = loadingFun('#ChillingTemp');
    getChillingTemp({ systemId: props.tabId })
        .then((res: any) => {
            if (res.code === SUCCESSCODE && res.data?.length) {
                res.data[0].data = orderFun(['coolWaterMainReturnTemp', 'coolWaterReturnTempSet'], res.data[0]);
                coolSideTemData.value.data = handelData(res.data[0], true);
            }
            destroyLoading(loading);
            getCoolRunData();
        })
        .catch(() => {
            destroyLoading(loading);
            getCoolRunData();
        });
};
/**
 * @description: 系统运行看板-冷冻侧供回水温差
 * @return {*}
 */
const getCoolSideBackTemData = () => {
    coolSideBackTemData.value.xAxisData = generateArray();
    const loading = loadingFun('#FreezingTempDiff');
    getFreezingTempDiff({ systemId: props.tabId })
        .then((res: any) => {
            if (res.code === SUCCESSCODE && res.data?.length) {
                res.data[0].data = orderFun(['chillWaterDetaTemp', 'chillWaterDetaTempSet'], res.data[0]);
                coolSideBackTemData.value.data = handelData(res.data[0], true);
            }
            destroyLoading(loading);
        })
        .catch(() => {
            destroyLoading(loading);
        });
};
/**
 * @description: 系统运行看板-冷冻侧供水温度
 * @return {*}
 */
const getCoolSideSupplyWaterTemData = () => {
    coolSideSupplyWaterTemData.value.xAxisData = generateArray();
    const loading = loadingFun('#FreezingTemp');
    getFreezingTemp({ systemId: props.tabId })
        .then((res: any) => {
            if (res.code === SUCCESSCODE && res.data?.length) {
                res.data[0].data = orderFun(['primaryChillWaterMainSupplyTemp', 'chillWaterOutTempSet'], res.data[0]);
                coolSideSupplyWaterTemData.value.data = handelData(res.data[0], true);
            }
            destroyLoading(loading);
        })
        .catch(() => {
            destroyLoading(loading);
        });
};
const getPumpData = () => {
    pumpData.value.xAxisData = generateArray();
    const loading = loadingFun('#FreezingSecondary');
    getFreezingSecondary({ systemId: props.tabId })
        .then((res: any) => {
            if (res.code === SUCCESSCODE && res.data?.length) {
                pumpData.value.data = [];
                let arr: any = [];
                res.data.forEach((item: any, index: number) => {
                    item.data = orderFun(['branchDetaTempSet', 'branchDetaTemp', 'branchSupplyTemp', 'branchReturnTemp'], item);
                    arr.push({ name: item.objectName, data: handelData(item, true) });
                    if (index === res.data.length - 1 && arr.length === 1) {
                        pumpData.value.data.push(arr);
                    }
                    if (arr.length === 2) {
                        console.log(arr);
                        pumpData.value.data.push(arr);
                        arr = [];
                    }
                });

                showFreezingSecondary.value = pumpData.value.data.length !== 0;
            } else {
                showFreezingSecondary.value = false;
            }
            destroyLoading(loading);
        })
        .catch(() => {
            destroyLoading(loading);
        });
};

const handelData = (obj: any, type: boolean) => {
    const { data } = obj;
    if (data?.length) {
        return data.map((item: { objectName: any; infoCodeName: any; data: any[]; objectId: string }, i: number) => ({
            name: item.objectName || item.infoCodeName,
            id: item.objectId || item.objectName || item.infoCodeName,
            data: item.data.map((val: { ipValue: any }) => (val.ipValue ? toNumber(val.ipValue).toFixed(2) : null)),
            ...(type
                ? {
                      areaStyle:
                          i <= 1
                              ? {
                                    color: color[i] || null
                                }
                              : null,
                      lineStyle: {
                          type: i > 1 ? 'dashed' : null,
                          width: i > 1 ? 1 : 2
                      }
                  }
                : { smooth: false })
        }));
    }
    return [];
};

const refreshSys = (data: any) => {
    // eslint-disable-next-line guard-for-in
    for (const key in systemRunningConditionInfo.value) {
        const element = systemRunningConditionInfo.value[key];
        if (isArray(element)) {
            for (const iterator of element) {
                for (const item of iterator.infoCodes) {
                    if (data.infoCode === item.infoCode) {
                        item.dataValue = data.dataValue;
                        item.dataTime = data.dataTime;
                        return;
                    }
                }
            }
        }
    }
};
onMounted(() => {
    show.value = true;
    init();
    emitter.on('refreshSys', refreshSys);
});
onUnmounted(() => {
    emitter.off('refreshSys', refreshSys);
    destroyAllLoading();
});
</script>
<style lang="less">
.echarts-data .echarts-data-box {
    &-main {
        height: calc(100% - 56px);
        [class*='mcol-'] {
            padding: 0 8px;
        }
        .mrow {
            margin-left: -8px;
            margin-right: -8px;
            &.tem {
                background-color: rgba(255, 255, 255, 0.7);
                margin: 0;
                border-radius: 8px;
                [class*='mcol-'] {
                    padding: 0;
                }
                .main-box {
                    background-color: transparent;
                }
            }
        }
        .mrow + .mrow {
            margin-top: 16px;
        }
        & > .m-scrollbar__box {
            padding: 16px 20px;
        }
        .main-box {
            height: 220px;
            border-radius: 8px;
            border: 1px solid #fff;
            background: rgba(255, 255, 255, 0.7);
            padding: 20px;
            &.run-info {
                .main-box-title {
                    margin-bottom: 0;
                }
            }
            &.back-tem {
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    height: calc(100% - 40px);
                    width: 1px;
                    background-color: var(--gray-200);
                    top: 20px;
                    right: 0px;
                }
            }
            &-title {
                font-weight: 600;
                font-size: 16px;
                height: 22px;
                margin-bottom: 12px;
            }
            &-chart {
                height: calc(100% - 22px);
                .card-box-list {
                    .card-box-list-key {
                        color: #646c73;
                    }
                    & + .card-box-list {
                        margin-top: 12px;
                    }
                }
            }
            &-left {
                height: 100%;
                flex: 1;
                border-right: 1px solid var(--gray-200);
                padding-right: 20px;
                margin-right: 20px;
            }
            &-right {
                width: 296px;
                height: 100%;
            }
        }
        .cool-two {
            border-radius: 8px;
            margin-top: 12px;
            background: rgba(255, 255, 255, 0.7);
            min-height: 181px;
            &-title {
                font-weight: 600;
                font-size: 16px;
                padding: 20px;
                padding-bottom: 0;
            }
            .main-box {
                background-color: transparent;
            }
            .mcol-6 + .mcol-6 {
                border-left: 1px solid var(--gray-200);
            }
        }
    }
}
</style>
