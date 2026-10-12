<template>
    <div>
        <m-modal
            v-model:visible="show"
            :append-to="$modalAppendTo"
            modal-class-name="config-use"
            type="default"
            :title="activeConfig.name + i18n.global.t('meos_control_web.configuration')"
            :width="activeConfigId == configType['energy'] ? '400' : '1260'"
            @close="close"
        >
            <template #content>
                <!-- 费用最低、碳排放最低 -->
                <div v-if="activeConfigId == configType['carbon'] || activeConfigId == configType['money']" class="disposition-wrap">
                    <div class="disposition-left">
                        <div class="disposition-name">
                            <em></em><b v-ellipsis class="text">{{ setName }}{{ i18n.global.t('meos_control_web.last_7_days_trend') }}</b
                            >（{{ timeDate }}）
                        </div>
                        <div class="chart-wrap">
                            <Linechart v-if="chartInfo.yData.length > 0"></Linechart>
                            <m-illustration v-else-if="chartInfo.inited" :title="i18n.global.t('common.no_data')" type="noContent" style="padding-top: 0" />
                        </div>
                        <div class="disposition-name">
                            <em></em><b v-ellipsis class="text">{{ setName }}{{ i18n.global.t('meos_control_web.last_7_days_distribution') }}</b>
                            <span class="time"> <m-time-picker v-model="pickerTime" :hide-clear="true" range format="hm" @change="pickerChange"></m-time-picker></span>
                        </div>
                        <div v-if="infoBoxIsshow" class="info-box">
                            <ul>
                                <li v-for="(item, index) in data.info" :key="index">
                                    <span
                                        ><em>{{ item.value || '--' }}</em
                                        >{{ setUnit }}</span
                                    >
                                    <span
                                        >{{ item.name }}
                                        <m-tips :content="item.tips" theme="darkTransparent" trigger="hover">
                                            <div><IconMeriComponentDialogLinear :size="16" /></div>
                                        </m-tips>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="disposition-right">
                        <div class="disposition-name">
                            <em></em><b v-ellipsis class="text">{{ i18n.global.t('meos_control_web.temp_co2_satisfaction_rate_config') }}</b
                            ><b v-ellipsis class="tips">{{ i18n.global.t('meos_control_web.click_ruler_config_satisfaction_delete_slider') }}</b>
                        </div>
                        <!-- 刻度尺 -->
                        <Scale ref="scaleChildrenRef" @set-scale-data="setScaleData"></Scale>
                        <!-- <div class="scaleUnit">{{ setUnit }}</div> -->
                        <div class="set-box">
                            <!-- 输入框 -->
                            <div v-for="(item, index) in markData.setList" :key="index" class="set-box_temp">
                                <div class="lable-box">
                                    {{
                                        i18n.global.t('meos_control_web.when_conditions', {
                                            intervalMin: item.intervalMin,
                                            less: index == 0 ? '≤' : '<',
                                            setName: setName,
                                            intervalMax: item.intervalMax,
                                            setUnit: setUnit
                                        })
                                    }}
                                </div>
                                <div class="input-box">
                                    <div class="temp">
                                        {{ i18n.global.t('meos_control_web.temperature_satisfaction_rate') }}
                                        <m-input-number
                                            v-model="item.tempFillRate"
                                            class="mt4"
                                            text-align="left"
                                            :placeholder="i18n.global.t('common.placeholder_input')"
                                            controls="rightButton"
                                            :error-text="item.tempErrorText"
                                            :min="0"
                                            :max="100"
                                            :precision="0"
                                            @change="inputChange(item, 'tempErrorText')"
                                        >
                                            <template #suffix> % </template>
                                        </m-input-number>
                                    </div>
                                    <div class="temp">
                                        ，{{ i18n.global.t('meos_control_web.co2_satisfaction_rate') }}
                                        <m-input-number
                                            v-model="item.co2FillRate"
                                            class="mt4"
                                            text-align="left"
                                            :placeholder="i18n.global.t('common.placeholder_input')"
                                            controls="rightButton"
                                            :error-text="item.co2ErrorText"
                                            :min="0"
                                            :max="100"
                                            :precision="0"
                                            @change="inputChange(item, 'co2ErrorText')"
                                        >
                                            <template #suffix> % </template>
                                        </m-input-number>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 能耗最低 -->
                <div v-else-if="activeConfigId == configType['energy']">
                    <div v-for="(item, index) in markData.setList" :key="index" class="energy-input-box">
                        <div class="temp temp-gap">
                            <label>{{ i18n.global.t('meos_control_web.temperature_satisfaction_rate_2') }}<em>*</em></label>
                            <m-input-number
                                v-model="item.tempFillRate"
                                text-align="left"
                                :placeholder="i18n.global.t('common.placeholder_input')"
                                controls="rightButton"
                                :error-text="item.tempErrorText"
                                :min="0"
                                :max="100"
                                :precision="0"
                                @change="inputChange(item, 'tempErrorText')"
                            >
                                <template #suffix> % </template>
                            </m-input-number>
                        </div>
                        <div class="temp">
                            <label>{{ i18n.global.t('meos_control_web.co2_satisfaction_rate') }}<em>*</em></label>
                            <m-input-number
                                v-model="item.co2FillRate"
                                text-align="left"
                                :placeholder="i18n.global.t('common.placeholder_input')"
                                controls="rightButton"
                                :error-text="item.co2ErrorText"
                                :min="0"
                                :max="100"
                                :precision="0"
                                @change="inputChange(item, 'co2ErrorText')"
                            >
                                <template #suffix> % </template>
                            </m-input-number>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <m-button style="width: 80px" type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button style="width: 80px" type="primary" @click.stop="submit">{{ i18n.global.t('common.save') }}</m-button>
            </template>
        </m-modal>
        <!-- 二次弹窗 -->
        <m-modal
            v-model:visible="secondaryPop"
            :append-to="$modalAppendTo"
            type="info"
            :title="i18n.global.t('meos_control_web.acknowledge_apply_value')"
            :content="i18n.global.t('meos_control_web.select_flexible_adjust_by_current_value')"
            @close="secondaryPopClose"
            @submit="saveConfigSbumit"
        >
        </m-modal>
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable eqeqeq */

import { PropType, ref, reactive, provide, onMounted, computed, nextTick } from 'vue';
import { BoxList } from './types';
import Scale from './components/scale.vue';
import Linechart from './components/linechart.vue';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import { $Message, MLoading } from 'meri-plus';
import { mathFormat } from '@/utils/pformat';
import { queryValConfigDetail, getCurrentElectricityInfo, getCurrentCarbonInfo, saveConfig } from '@/apis/configUse';
import _ from 'lodash';
import dayjs from 'dayjs';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';

const emits = defineEmits(['close']);
const props = defineProps({
    activeConfig: {
        type: Object as PropType<BoxList>,
        default: () => ({})
    },
    templateType: {
        type: String,
        default: 'AIRCONDITIONING'
    },
    templateId: {
        type: String,
        default: ''
    }
});
const scaleChildrenRef = ref();
const show = ref();
const pickerTime = ref();
const timeDate = ref();
const isPicker = ref();
const secondaryPop = ref(false);
const loadingU = ref();
const infoBoxIsshow = ref(true);
const chartInfo: any = reactive({
    inited: false,
    xData: [],
    yData: [],
    setName: '',
    setUnit: ''
});
const data = reactive({
    info: [
        {
            id: 'lowerQuartile',
            name: i18n.global.t('meos_control_web.lower_quartile'),
            tips: i18n.global.t('meos_control_web.equals_sample_25th_percentile'),
            value: null
        },
        {
            id: 'averageValue',
            name: i18n.global.t('meos_control_web.mean_value'),
            tips: i18n.global.t('meos_control_web.equals_sample_mean'),
            value: null
        },
        {
            id: 'median',
            name: i18n.global.t('meos_control_web.median'),
            tips: i18n.global.t('meos_control_web.equals_sample_median'),
            value: null
        },
        {
            id: 'upperQuartile',
            name: i18n.global.t('meos_control_web.upper_quartile'),
            tips: i18n.global.t('meos_control_web.equals_sample_75th_percentile'),
            value: null
        }
    ]
});
// 刻度尺数据
const markData = reactive({
    scaleInfo: {
        max: '3.0',
        min: '0.0'
    },
    markList: [
        {
            id: new Date().getTime() + '01',
            value: '0.0',
            left: '0.0',
            isHover: false,
            disabled: true,
            tempFillRate: null,
            co2FillRate: null
        }
    ],
    setList: [
        {
            intervalMin: null,
            intervalMax: null,
            tempFillRate: null,
            tempErrorText: '',
            co2FillRate: null,
            co2ErrorText: ''
        }
    ]
});
const configType: any = {
    money: 'value_select_lowest_cast',
    carbon: 'value_select_Lowest_carbon_emissions',
    energy: 'value_select_lowest_energy',
    quality: 'value_select_quality_first'
};
provide('markData', markData);
provide('chartInfo', chartInfo);
onMounted(() => {
    // 环境品质
    if (activeConfigId.value == configType.quality) {
        secondaryPop.value = true;
    } else {
        // 其他
        show.value = true;
    }

    // 碳排放
    if (activeConfigId.value == configType.carbon) {
        markData.scaleInfo.max = '2.0';
    }
    // 费用
    if (activeConfigId.value == configType.money) {
        markData.scaleInfo.max = '3.0';
    }
    chartInfo.setName = setName;
    chartInfo.setUnit = setUnit;
    // 近7天时间
    timeDate.value = `${getDayjsTz().subtract(7, 'day').format('YYYY.MM.DD')}-${getDayjsTz().subtract(1, 'day').format('YYYY.MM.DD')}`;
    // 费用最低、碳排放最低时请求趋势、分布接口
    if (activeConfigId.value == configType.carbon || activeConfigId.value == configType.money) {
        // 7天趋势、7天分布
        getConfigInfo();
    }
    if (activeConfigId.value !== configType.quality) {
        // 温度、CO₂满足率
        getlistConfigScale();
    }
});
// 当前选中的类型id
const activeConfigId = computed(() => {
    return props.activeConfig?.id;
});
// 名称
// eslint-disable-next-line vue/return-in-computed-property
const setName = computed(() => {
    if (props.activeConfig?.id == configType.carbon) return i18n.global.t('meos_control_web.carbon_factor');
    if (props.activeConfig?.id == configType.money) return i18n.global.t('meos_control_web.electricity_price');
});
// 单位
// eslint-disable-next-line vue/return-in-computed-property
const setUnit = computed(() => {
    if (props.activeConfig?.id == configType.carbon) return 'kgCO₂/kWh';
    if (props.activeConfig?.id == configType.money) return i18n.global.t('meos_control_web.yuan');
});
const inputChange = (item: any, type: any) => {
    item[type] = '';
};
// 刻度尺数据转为list数据
const setScaleData = () => {
    let arr: any = [],
        sortArr: any = [],
        uniqByArr: any = [];
    // 去重复
    uniqByArr = _.uniqBy(markData?.markList, 'value');
    // 从小到大排序
    sortArr = _.sortBy(uniqByArr, o => o.value);

    sortArr.forEach((item: any, i: any) => {
        if (item.isHover) return;
        let obj: any = {};
        if (i == 0) {
            obj = {
                tempFillRate: item.tempFillRate,
                co2FillRate: item.co2FillRate,
                co2ErrorText: '',
                tempErrorText: ''
            };
            // 非能耗最低才要这两个字段 https://persagy2021.coding.net/p/apm-aim/bug-tracking/issues/106168/detail
            if (activeConfigId.value !== configType.energy) {
                obj.intervalMin = item.value;
                obj.intervalMax = null;
            }
            arr.push(obj);
        }
        if (i > 0) {
            // 非能耗最低才要这两个字段 https://persagy2021.coding.net/p/apm-aim/bug-tracking/issues/106168/detail
            if (activeConfigId.value !== configType.energy) {
                arr[arr.length - 1].intervalMax = item.value;
                arr[arr.length - 1].tempFillRate = item.tempFillRate;
            }
            arr[arr.length - 1].co2FillRate = item.co2FillRate;
            if (i < sortArr.length - 1) {
                obj = {
                    tempFillRate: item.tempFillRate,
                    co2FillRate: item.co2FillRate,
                    co2ErrorText: '',
                    tempErrorText: ''
                };
                // 非能耗最低才要这两个字段 https://persagy2021.coding.net/p/apm-aim/bug-tracking/issues/106168/detail
                if (activeConfigId.value !== configType.energy) {
                    obj.intervalMin = item.value;
                    obj.intervalMax = null;
                }
                arr.push(obj);
            }
        }
    });
    markData.setList = arr;
};
// 时间选择
const pickerChange = (val: any) => {
    isPicker.value = true;
    pickerTime.value = val;
    getConfigInfo();
};

// 温度、CO₂满足率配置请求接口
const getlistConfigScale = () => {
    loadingU.value = MLoading.service({
        target: '.disposition-wrap',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        background: 'rgb(255,255,255,1)',
        loadTextOptions: {
            text: i18n.global.t('common.loading'),
            style: {}
        },
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    let params = {
            projectId: baseStore().projectId,
            type: activeConfigId.value,
            templateType: props.templateType,
            templateId: props.templateId
        },
        // 炭因子最大值为2，费用最大值为3
        val = activeConfigId.value == configType.carbon ? 2 : 3,
        max: any = markData.scaleInfo?.max;

    queryValConfigDetail(params)
        .then((res: any) => {
            let { data } = res;
            if (!data || data.length == 0) {
                markData.markList.push({
                    id: new Date().getTime() + '01',
                    value: val.toFixed(1),
                    left: ((100 / (max * 10)) * val * 10).toString(),
                    isHover: false,
                    disabled: true,
                    tempFillRate: null,
                    co2FillRate: null
                });
            }
            data?.forEach((item: any, index: any) => {
                if (index == 0) {
                    markData.markList[0].tempFillRate = mathFormat.toFixed(item.tempFillRate);
                    markData.markList[0].co2FillRate = mathFormat.toFixed(item.co2FillRate);
                }
                markData.markList.push({
                    id: new Date().getTime() + '00' + index,
                    value: Number(item.intervalMax || 0).toFixed(1),
                    left: ((100 / (max * 10)) * item.intervalMax * 10).toString(),
                    isHover: false,
                    disabled: item.intervalMax == val ? true : false,
                    tempFillRate: mathFormat.toFixed(item.tempFillRate),
                    co2FillRate: mathFormat.toFixed(item.co2FillRate)
                });
            });
            setScaleData();
            loadingU.value.destroy();
        })
        .catch(() => {
            loadingU.value.destroy();
        });
};
// 7天趋势、7天分布请求接口
const getConfigInfo = async () => {
    let timeYear = getDayjsTz().year(),
        time = timeDate.value.split('-'),
        params = {
            projectId: baseStore().projectId,
            type: activeConfigId.value,
            startTime: dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(time[1]).add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            sampleStartTime: pickerTime.value ? dayjs(`${timeYear}.${pickerTime.value.split('-')[0]}`).format('HH:mm:ss') : null,
            sampleEndTime: pickerTime.value ? dayjs(`${timeYear}.${pickerTime.value.split('-')[1]}`).format('HH:mm:ss') : null
        },
        // 电价与炭因子2个接口
        res: any = activeConfigId.value == configType.money ? await getCurrentElectricityInfo(params) : await getCurrentCarbonInfo(params);
    // 切换时间时，7天分布重新渲染
    infoBoxIsshow.value = false;
    loadingU.value.destroy();
    // eslint-disable-next-line one-var
    let resultData = res?.data || {};
    // 切换时间时，图表不刷新
    if (!isPicker.value) {
        // 图表数据
        let { elecDataList } = resultData,
            xData: any = [],
            yData: any = [];
        elecDataList?.forEach((item: any) => {
            xData.push(item.dataTime);
            yData.push(item.dataValue);
        });
        chartInfo.xData = xData;
        chartInfo.yData = yData?.filter((v: any) => v !== undefined);
        chartInfo.inited = true;
    }
    // 分布数据
    // eslint-disable-next-line one-var
    let typeList: any = {};
    for (let i in resultData) {
        typeList[i] = i;
    }
    data.info.forEach((item: any) => {
        if (item.id == typeList[item.id]) {
            item.value = mathFormat.toFixed(resultData[typeList[item.id]]);
        }
    });
    isPicker.value = false;
    if (resultData.openTime && resultData.closeTime) {
        let currYear = getDayjsTz().format('YYYY.MM.DD');
        // 时间
        pickerTime.value = `${dayjs(currYear + ' ' + resultData.openTime).format('HH:mm')}-${dayjs(currYear + ' ' + resultData.closeTime).format('HH:mm')}`;
    }
    nextTick(() => {
        infoBoxIsshow.value = true;
    });
};
const saveConfigSbumit = async () => {
    let params = {
        projectId: baseStore().projectId,
        type: activeConfigId.value,
        templateType: props.templateType,
        templateId: props.templateId,
        details: markData.setList
    };
    // 保存
    saveConfig(params).then((res: any) => {
        if (res.result == 'success') {
            $Message.success({
                title: i18n.global.t('common.save_success')
            });
            emits('close');
        }
    });
};
// 关闭
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
// 确定
const submit = () => {
    // 验证
    markData.setList.forEach((item: any) => {
        if (!(item.co2FillRate || item.co2FillRate === 0)) {
            item.co2ErrorText = i18n.global.t('meos_control_web.input_required_check_error_2');
        }
        if (!(item.tempFillRate || item.tempFillRate === 0)) {
            item.tempErrorText = i18n.global.t('meos_control_web.input_required_check_error_2');
        }
    });
    let error = markData.setList.some((item: any) => {
        return item.tempErrorText || item.co2ErrorText;
    });
    if (error) {
        $Message.error({
            title: i18n.global.t('meos_control_web.input_validation_error')
        });
    } else {
        // 作废，取消二次弹窗 二次弹窗
        // secondaryPop.value = true

        saveConfigSbumit();
    }
};
// 二次弹窗取消
const secondaryPopClose = () => {
    secondaryPop.value = false;
    if (activeConfigId.value == configType.quality) {
        nextTick(() => {
            emits('close');
        });
    }
};
</script>

<style lang="less" scoped>
em {
    font-style: normal;
}
.disposition-wrap {
    padding: 0px 0;
    overflow: hidden;
    position: relative;
    .disposition-name {
        display: flex;
        height: 32px;
        line-height: 32px;
        color: #000;
        margin-bottom: 15px;
        .text {
            font-weight: bold;
            font-size: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .tips {
            font-size: 12px;
            color: #8b949e;
            font-weight: normal;
            margin-left: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        em {
            height: 14px;
            width: 3px;
            background: #246fe5;
            margin-top: 9px;
            margin-right: 7px;
        }
        .time {
            font-weight: normal;
            width: 100px;
            margin-left: 10px;
        }
        :deep .m-time-picker-trigger {
            width: 145px;
        }
    }
    .disposition-left {
        width: 570px;
        float: left;
        padding-bottom: 20px;
        .chart-wrap {
            height: 300px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .info-box {
            ul {
                display: flex;
                color: #626c78;
                li {
                    border-right: 1px solid #e1e5eb;
                    width: 24%;
                    padding-left: 2%;
                    span {
                        display: block;
                        line-height: 24px;
                        font-size: 12px;
                        div {
                            display: inline-block;
                            vertical-align: sub;
                        }
                    }
                    em {
                        font-size: 16px;
                        font-weight: bold;
                        font-style: normal;
                        color: #000;
                        margin-right: 6px;
                    }
                    &:last-child {
                        border-right: none;
                    }
                }
            }
        }
    }
    .disposition-right {
        float: left;
        padding: 0 10px;
        width: calc(100% - 570px);
        border-left: 1px solid rgba(225, 229, 235, 1);
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        .set-box {
            margin-top: 30px;
            height: calc(100% - 137px);
            overflow: hidden;
            overflow-y: auto;
            &_temp {
                background: #f1f4f6;
                margin-bottom: 10px;
                padding: 10px 0 30px 20px;
                box-sizing: border-box;
                border-radius: 6px;
                .lable-box {
                    height: 24px;
                    line-height: 24px;
                    margin: 10px 0px;
                }
                .input-box {
                    display: flex;
                    .temp {
                        .m-input-number {
                            width: 140px;
                        }
                    }
                }
            }
        }
        .scaleUnit {
            position: absolute;
            right: 36px;
            font-size: 12px;
            color: #8b949e;
        }
    }
}
// 能耗最低
.energy-input-box {
    label {
        margin-right: 8px;
        em {
            color: red;
        }
    }
    .temp {
        margin: 20px 0 20px 0;
        .m-input-number {
            width: 140px;
        }
    }
    .temp-gap {
        margin-bottom: 40px;
    }
}
:deep .m-time-picker-trigger {
    line-height: 30px !important;
}
</style>
