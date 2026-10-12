<template>
    <div v-if="tipsShow" :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }" class="tips" @mouseenter="mouseenterPopup" @mouseleave="mouseleavePopup">
        <div class="tips-content-warp">
            <div v-loading="loading" element-loading-lottiename="circle" class="loading-content">
                <div ref="box" class="tips-content">
                    <div class="f">
                        <span v-ellipsis class="m-ellipsis">{{ dateilObj?.localName ?? '--' }}</span>
                    </div>
                    <div :class="[dateilObj?.exceptionEventInfoList?.length || dateilObj?.riskEventIotFieldVos?.length || dateilObj?.taskInfo ? 'bc' : '', 'pb10']">
                        <div v-if="dateilObj?.tagInfo" :class="[tagObjs?.length ? 'mt8' : '', 'title-tag']">
                            <!-- <span v-for="tag in tagObjs" :key="tag.name" class="tag-item info-tag" :style="{ backgroundColor: tag.color }">{{ tag.name }}</span> -->
                            <m-tag v-for="tag in tagObjs" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
                        </div>
                    </div>
                    <div v-if="dateilObj?.exceptionEventInfoList?.length" class="mt8">
                        <div class="title-info">{{ i18n.global.t('meos_control_web.abnormal_event') }}</div>
                        <div>
                            <m-popover
                                style="pointer-events: none"
                                :enterable="false"
                                theme="darkTransparent"
                                :show-arrow="false"
                                :content="i18n.global.t('meos_control_web.click_jump_abnormal_event')"
                            >
                                <div class="content" @click="abnormalJump(exceptionEventDisplay)">
                                    {{
                                        i18n.global.t('meos_control_web.find_certain_risks', {
                                            instancesName: exceptionEventDisplay.instancesName,
                                            problemsNumber: exceptionEventDisplay.problemsNumber,
                                            problemsName: exceptionEventDisplay.problemsName
                                        })
                                    }}
                                </div>
                            </m-popover>
                            <div class="f mt4">
                                <span class="font">{{ i18n.global.t('meos_control_web.departure_time_colon') }}</span>
                                <span class="time">{{ dayjs.tz(+exceptionEventDisplay.exceptionStartTime).format('YYYY-MM-DD HH:mm') || '- -' }}</span>
                            </div>
                            <div class="f mt4">
                                <span class="font">{{ i18n.global.t('meos_control_web.risk_level_colon') }}</span>
                                <span class="time">{{ importanceDegree(exceptionEventDisplay).name }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="dateilObj?.taskInfo" class="mt8">
                        <div class="title-info">{{ i18n.global.t('meos_control_web.inspection_info') }}</div>
                        <div class="f mt4">
                            <span class="font">{{ i18n.global.t('meos_control_web.last_finish_time_colon') }}</span>
                            <span class="time">{{ dayjs(dateilObj.taskInfo.finishTime).format('YYYY-MM-DD') || '- -' }}</span>
                        </div>
                        <div class="f mt4">
                            <span class="font">{{ i18n.global.t('meos_control_web.inspector_colon') }}</span>
                            <span class="time">{{ dateilObj.taskInfo.lastUpdateBy }}</span>
                        </div>
                    </div>
                    <div v-if="dateilObj?.riskEventIotFieldVos?.length" class="mt8">
                        <div class="title-info">{{ i18n.global.t('meos_control_web.operating_parameters') }}</div>
                        <div v-for="(item, index) in dateilObj.riskEventIotFieldVos" :key="index" class="mt4">
                            <div style="display: flex">
                                <span class="font">{{ item.name + '：' }}</span>
                                <div v-if="item.linkCodes" v-ellipsis class="m-ellipsis">
                                    <span v-for="(obj, objIndex) in item.linkCodes" :key="objIndex" class="ml5 iot-info"
                                        >{{ obj.name }}: {{ obj.dataValueName || '--' }} {{ obj.unit }}</span
                                    >
                                </div>
                                <span
                                    v-else
                                    v-ellipsis
                                    :class="[item.infoType == i18n.global.t('meos_control_web.operating_parameters') && item.dataValue ? 'iot-info' : '', 'time', 'm-ellipsis']"
                                    @mousemove="e => openTimeFun(e, item)"
                                    @mouseleave="e => closeTimeFun(e)"
                                    @click="detailsIot(item)"
                                    >{{ getValueStr(item).text }}</span
                                >
                            </div>
                        </div>
                    </div>
                    <div v-if="state.shoeMore" class="more-item fc">
                        <div style="cursor: pointer" class="fc" @click="moreInfo">
                            <span style="color: #246fe5">{{ i18n.global.t('meos_control_web.more_info') }}</span>
                            <SvgIcon name="more" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="dow"></div>
        </div>
    </div>
    <m-popover
        style="pointer-events: none"
        virtual-triggering
        :virtual-ref="timePopRef"
        trigger="manually"
        theme="darkTransparent"
        :is-open="state.showTimePop"
        :show-arrow="false"
        :enterable="false"
    >
        <template #content>
            {{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ state.time }}
            <div>({{ i18n.global.t('meos_control_web.click_jump_data_analysis') }})</div>
        </template>
    </m-popover>
</template>

<script setup>
import { getValueStr } from '@/utils/viewUtils';
import dayjs from 'dayjs';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { queryEquipOrSpaceHoverInfo } from '@/apis/systemDiagram';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { watch, ref } from 'vue';
import { importanceDegree } from '@/utils/viewUtils';
import { abnormalJumpFun, jumpToAnalysis } from '@/utils/envUtils';
import { baseColors } from '@/constants/baseColors';
import i18n from '@/localization';

const props = defineProps({
    queryData: {
        type: Object,
        default: () => null
    },
    pos: {
        type: Object,
        default: () => {}
    }
});
const emit = defineEmits(['clickMoreInfo', 'hide']);

const state = reactive({
    showTimePop: false,
    shoeMore: false,
    time: ''
});
const loading = ref(true);
const dateilObj = ref(null);
const timePopRef = ref('');
const localName = ref('');
const box = ref(null);
const tipsShow = ref(false);
const timestamp = ref('');
const localPosition = ref({
    left: 0,
    right: 0
});

let currentQueryData = null, // 当前查询数据
    showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false, //鼠标在卡片中；解决mouseEnter 先于watch执行
    queryInfoCodeConfigAobortController = null;

//手自动状态
const manualAutoStatus = {
    MANUAL_OPERATION: {
        name: i18n.global.t('meos_control_web.device_manual'),
        color: '#FFB800'
    },
    AUTO: {
        name: i18n.global.t('meos_control_web.auto'),
        color: baseColors['$blue-500']
    }
};
//本地远程
const localRemote = {
    LOCAL: {
        name: i18n.global.t('meos_control_web.local'),
        color: '#246FE5'
    },
    REMOTE: {
        name: i18n.global.t('meos_control_web.remote'),
        color: baseColors['$grey-800']
    }
};
//开关状态
const onOffState = {
    OPEN: {
        name: i18n.global.t('meos_control_web.on'),
        color: '#09B3B5'
    },
    CLOSE: {
        name: i18n.global.t('meos_control_web.off'),
        color: '#8B949E'
    }
};
//温度区间
const temperatureDemandStatus = {
    TARGET_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_target_value'),
        color: '#15AE55'
    },
    UPPER_LIMIT_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_upper_limit'),
        color: '#FF7A2F'
    },
    LOWER_LIMIT_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_lower_limit'),
        color: '#1B9FFF'
    },
    COLD_STORAGE_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_cold_storage_value'),
        color: '#1B9FFF'
    },
    HEAT_STORAGE_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_heat_storage_value'),
        color: '#FF7A2F'
    }
};
//CO2区间
const carbonDioxideDemandStatus = {
    TARGET_VALUE: {
        name: i18n.global.t('meos_control_web.co2_target_value'),
        color: '#15AE55'
    },
    UPPER_LIMIT_VALUE: {
        name: i18n.global.t('meos_control_web.co2_upper_limit'),
        color: '#FF7A2F'
    },
    LOWER_LIMIT_VALUE: {
        name: i18n.global.t('meos_control_web.co2_lower_limit'),
        color: '#1B9FFF'
    },
    COLD_STORAGE_VALUE: {
        name: i18n.global.t('meos_control_web.co2_cold_storage_value'),
        color: '#1B9FFF'
    },
    HEAT_STORAGE_VALUE: {
        name: i18n.global.t('meos_control_web.co2_heat_storage_value'),
        color: '#FF7A2F'
    }
};
//异常状态
const abnormal = {
    ABNORMAL_EVENT: {
        name: i18n.global.t('meos_control_web.abnormal'),
        color: '#F55047'
    },
    ORDER_FAIL_ALARM: {
        name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
        color: '#FF9D00 '
    },
    HIGH_LEV_ALARM: {
        name: i18n.global.t('meos_control_web.high_level_alarm'),
        color: '#F55047'
    },
    LOW_LEV_ALARM: {
        name: i18n.global.t('meos_control_web.low_level_alarm'),
        color: '#F55047'
    },
    FAULT_STATUS: {
        name: i18n.global.t('meos_control_web.fault_signal'),
        color: '#F55047'
    }
};
// 断电
const powerStatus = {
    OUTAGE: {
        name: i18n.global.t('meos_control_web.power_off'),
        color: '#AAA873'
    }
};
//在离线状态
const onlineStatusEnum = {
    ONLINE: {
        name: i18n.global.t('meos_control_web.online'),
        color: '#246FE5'
    },
    OFFLINE: {
        name: i18n.global.t('meos_control_web.offline'),
        color: '#8B949E'
    }
};

const exceptionEventDisplay = computed(() => {
    if (dateilObj.value?.exceptionEventInfoList?.length > 0) {
        return dateilObj.value.exceptionEventInfoList[dateilObj.value.exceptionEventInfoList.length - 1];
    }
    return null;
});
watch(
    () => props.queryData,
    () => {
        if (props.queryData?.id) {
            showTips(props.queryData);
        } else {
            hideTips();
        }
    }
);

watch(
    () => props.pos,
    () => {
        if (props.pos) {
            localPosition.value = { ...props.pos };
        }
    }
);

const showTips = queryData => {
    clearTimeout(hideTipsTimer);
    if (queryData?.id === currentQueryData?.id) return;
    currentQueryData = queryData;
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    showTipsTimer = setTimeout(() => {
        localName.value = currentQueryData.localName ?? '--';
        tipsShow.value = true;
        getHoverCardData(currentQueryData);
    }, 300);
};

const hideTips = () => {
    if (isInCard) {
        return;
    }
    hideTipsTimer = setTimeout(() => {
        hideTipsNow();
    }, 200);
};

const hideTipsNow = () => {
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    currentQueryData = null;
    isInCard = false;
    emit('hide');
};

const mouseenterPopup = () => {
    isInCard = true;
    clearTimeout(hideTipsTimer);
    hideTipsTimer = null;
};

const mouseleavePopup = () => {
    isInCard = false;
    hideTips();
};

const getHoverCardData = item => {
    loading.value = true;
    state.shoeMore = false;
    dateilObj.value = null;
    if (queryInfoCodeConfigAobortController) {
        queryInfoCodeConfigAobortController.abort();
        queryInfoCodeConfigAobortController = null;
    }
    queryInfoCodeConfigAobortController = new AbortController();
    const obj = {
        iotDataRequestVos: [
            {
                objectId: item.id,
                classCode: item.classCode
            }
        ],
        graphTypeCode: item.graphTypeCode,
        objectType: item.objType
    };
    queryEquipOrSpaceHoverInfo(obj, queryInfoCodeConfigAobortController.signal).then(res => {
        if (res.code === SUCCESSCODE) {
            if (res.data) {
                dateilObj.value = res.data[0];
                dateilObj.value?.exceptionEventInfoList?.sort((a, b) => Number(a?.exceptionStartTime) - Number(b?.exceptionStartTime));
                timestamp.value = res.timestamp;
                loading.value = false;
            } else {
                dateilObj.value = null;
                loading.value = false;
            }
        } else {
            dateilObj.value = null;
            loading.value = false;
        }
        nextTick(() => {
            state.shoeMore = box.value?.clientHeight >= 400 ? true : false;
        });
    });
};
const tagObjs = computed(() => {
    if (dateilObj.value?.tagInfo) {
        const { tagInfo } = dateilObj.value;
        const abnormalCopy = [...(tagInfo?.abnormal || [])];
        // 有高液位标签时  不显示低液位标签
        const hightLevIndex = abnormalCopy?.findIndex(abnormalItem => abnormalItem === 'HIGH_LEV_ALARM');
        const lowLevIndex = abnormalCopy?.findIndex(abnormalItem => abnormalItem === 'LOW_LEV_ALARM');
        if (hightLevIndex > -1 && lowLevIndex > -1) {
            abnormalCopy?.splice(lowLevIndex, 1);
        }

        const onlineStatusEnumTag = onlineStatusEnum[tagInfo.onlineStatusEnum];
        const manualAutoStatusTag = manualAutoStatus[tagInfo.manualAutoStatus];
        const localRemoteTag = localRemote[tagInfo.localRemote];
        const onOffStateTag = onOffState[tagInfo.onOffState];
        const carbonDioxideDemandStatusTag = carbonDioxideDemandStatus[tagInfo.carbonDioxideDemandStatus];
        const temperatureDemandStatusTag = temperatureDemandStatus[tagInfo.temperatureDemandStatus];
        const abnormalTag = abnormalCopy?.map(abnormalItem => abnormal[abnormalItem]) || [];
        const powerStatusTag = powerStatus[tagInfo.powerStatus];

        return [
            manualAutoStatusTag,
            onlineStatusEnumTag,
            localRemoteTag,
            powerStatusTag,
            onOffStateTag,
            carbonDioxideDemandStatusTag,
            temperatureDemandStatusTag,
            ...abnormalTag
        ].filter(Boolean);
    }
    return [];
});
// 控反不一致
// const haveInconsistent = computed(() => {
//     if (!dateilObj.value?.homeInfoCode?.length) return false;
//     const { homeInfoCode } = dateilObj.value;
//     const targetInfoCode = homeInfoCode.find(item => item.infoCode === 'orderFailAlarm');
//     return targetInfoCode?.dataValue === '1';
// });

const openTimeFun = (e, item) => {
    console.log(item, 'item');
    if (item && item.dataValue && item.infoType === i18n.global.t('meos_control_web.operating_parameters')) {
        timePopRef.value = e.target;
        state.showTimePop = true;
        state.time = item.dataTime ? dayjs(item.dataTime).format('YYYY.MM.DD HH:mm:ss') : dayjs(+timestamp.value).format('YYYY.MM.DD HH:mm:ss');
    }
};

const closeTimeFun = () => {
    state.showTimePop = false;
    timePopRef.value = null;
    state.time = '';
};

const jumpToDataAnalysis = item => {
    const jumpParams = {
        infoCode: item.code,
        id: currentQueryData?.id
    };
    jumpToAnalysis(jumpParams);
};

//ios详情
const detailsIot = item => {
    if (item.infoType === i18n.global.t('meos_control_web.operating_parameters') && item.dataValue) {
        jumpToDataAnalysis(item);
    }
};

//更多
const moreInfo = () => {
    emit('clickMoreInfo', { ...dateilObj.value, ...currentQueryData });
};

const abnormalJump = item => {
    abnormalJumpFun(item);
};

defineExpose({
    hideTipsNow
});
</script>

<style lang="less" scoped>
.title-tag {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    .info-tag {
        // margin-right: 4px;
        margin-left: 0px !important;
        // margin-top: 4px;
    }
    .tag-item {
        padding: 0 4px;
        font-size: 12px;
        font-style: normal;
        line-height: 20px; /* 166.667% */
        border-radius: 2px;
        color: #fff;
    }
}
:deep(.circular) {
    width: 28px !important;
    height: 28px !important;
    circle {
        stroke: #626c78 !important;
    }
}
:deep(.el-loading-spinner) {
    margin-top: -14px !important;
}
.tips {
    position: absolute;
    // display: none;
    width: 250px;
    padding: 10px 10px 0px;
    z-index: var(--z-index-hover-card) !important;
    transform: translate(-50%, -100%);
}

.font {
    color: #626c78;
}

.time {
    color: #000;
}

.abnormal {
    position: relative;
    padding-left: 12px;
    color: #f55047;
}

.abnormal::after {
    content: '';
    position: absolute;
    left: 0px;
    top: 7px;
    width: 8px;
    height: 8px;
    background-color: #f55047;
    border-radius: 50%;
}

.bc {
    border-bottom: 1px solid #f1f4f6;
}
.pb10 {
    padding-bottom: 10px;
}
.title-info {
    font-weight: 700;
    position: relative;
    padding-left: 7px;
    font-size: 14px;
}

.title-info::after {
    content: '';
    position: absolute;
    left: 0px;
    top: 2px;
    width: 3px;
    height: 14px;
    background-color: #246fe5;
}

.tips-content-warp {
    font-size: 14px;
    width: 100%;
    // min-height: 40px;
    .dow {
        width: 0;
        height: 0;
        border-top: 5px solid white;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        border-bottom: 5px solid transparent;
        margin: auto;
    }

    .loading-content {
        width: 100%;
        min-height: 40px;
        background-color: white;
        box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }

    .tips-content {
        padding: 12px;
        overflow-y: hidden;
        max-height: 400px;
        .f {
            display: flex;
            align-items: center;
        }
        .content {
            margin-top: 4px;
            display: -webkit-box;
            overflow: hidden;
            color: #246fe5;
            word-break: break-all;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .content:hover {
            color: #1b4acc;
            cursor: pointer;
        }
        .more-item {
            width: 92%;
            position: fixed;
            bottom: 10px;
            left: 10px;
            height: 40px;
            // 背景色纵向透明渐变
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.85) 30%, rgba(255, 255, 255, 1) 100%);
            border-radius: 4px;
            padding-left: 12px;
        }
    }

    // }
    .iot-info {
        color: #246fe5;
    }
    .iot-info:hover {
        color: #1b4acc;
        cursor: pointer;
    }
}
</style>
