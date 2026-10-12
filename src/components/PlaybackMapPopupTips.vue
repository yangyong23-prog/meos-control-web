<template>
    <div v-if="tipsShow" :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }" class="tips" @mouseenter="handleMouse(true)" @mouseleave="handleMouse(false)">
        <div class="tips-content-warp">
            <div v-loading="loading" element-loading-lottiename="circle" class="loading-content">
                <div ref="tipsContentElementRef" class="tips-content">
                    <div class="fc">
                        <span v-ellipsis class="m-ellipsis">{{ detailData?.localName ?? '--' }}</span>
                    </div>
                    <div :class="[hasContentItems ? 'show-border-bottom' : '', 'pb10']">
                        <div v-if="hasStatusData" :class="[hasStatusData ? 'mt8' : '', 'title-tag']">
                            <PlaybackTags :status-data="statusData" :template-type="HOVER" />
                        </div>
                    </div>
                    <template v-for="config in relInfoCodeGroupConfigs" :key="config.groupCode">
                        <template v-if="toLower(config.groupCode) === 'riskevent'">
                            <div v-if="exceptionEventDisplay" class="mt8">
                                <TitlePrefix :title="i18n.global.t('meos_control_web.abnormal_event')" :col-gap="4" :font-size="14" />
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
                                    <div class="fc mt4">
                                        <span class="font">{{ i18n.global.t('meos_control_web.departure_time_colon') }}</span>
                                        <span class="time">{{ dayjs.tz(+exceptionEventDisplay.exceptionStartTime).format('YYYY-MM-DD HH:mm') || '- -' }}</span>
                                    </div>
                                    <div class="fc mt4">
                                        <span class="font">{{ i18n.global.t('meos_control_web.risk_level_colon') }}</span>
                                        <span class="time">{{ importanceDegree(exceptionEventDisplay).name }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="toLower(config.groupCode) === 'routinginspection'">
                            <div v-if="taskInfo" class="mt8">
                                <TitlePrefix :title="i18n.global.t('meos_control_web.inspection_info')" :col-gap="4" :font-size="14" />
                                <div class="fc mt4">
                                    <span class="font">{{ i18n.global.t('meos_control_web.last_finish_time_colon') }}</span>
                                    <span class="time">{{ dayjs(taskInfo.finishTime).format('YYYY-MM-DD') || '- -' }}</span>
                                </div>
                                <div class="fc mt4">
                                    <span class="font">{{ i18n.global.t('meos_control_web.inspector_colon') }}</span>
                                    <span class="time">{{ taskInfo.lastUpdateBy }}</span>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="toLower(config.groupCode) === 'runningparameter'">
                            <div v-if="config?.relInfoCodeConfigs?.length" class="mt8">
                                <TitlePrefix :title="config.groupName" :col-gap="4" :font-size="14" />
                                <div v-for="(item, index) in config.relInfoCodeConfigs" :key="index" class="mt4">
                                    <div style="display: flex">
                                        <span class="font" style="max-width: 126px">{{ item.infoCodeName + '：' }}</span>
                                        <span v-ellipsis :class="['iot-data-value', 'm-ellipsis']" style="max-width: 92px">{{ getValueStr(item).text }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="config.relInfoCodeConfigs?.length" class="mt8">
                                <TitlePrefix :title="config.groupName" :col-gap="4" :font-size="14" />
                                <div v-for="(item, index) in config.relInfoCodeConfigs" :key="index" class="fc mt4">
                                    <span class="font">{{ item.infoCodeName }}：</span>
                                    <span class="time"> {{ getValueStr(item).text }} </span>
                                </div>
                            </div>
                        </template>
                    </template>
                    <!-- <div v-if="timeUpdateState.showMore" class="more-item fc">
                        <div style="cursor: pointer" class="fc" @click="moreInfo">
                            <span style="color: #246fe5">{{ i18n.global.t('meos_control_web.more_info') }}</span>
                            <SvgIcon name="more" />
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="dow"></div>
        </div>
    </div>
    <m-popover
        style="pointer-events: none"
        virtual-triggering
        :virtual-ref="timePopElementRef"
        trigger="manually"
        theme="darkTransparent"
        :is-open="timeUpdateState.showTimePop"
        :show-arrow="false"
        :enterable="false"
    >
        <template #content>
            {{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ timeUpdateState.time }}
            <div>({{ i18n.global.t('meos_control_web.click_jump_data_analysis') }})</div>
        </template>
    </m-popover>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { toLower } from 'lodash';
// import SvgIcon from '@/components/common/SvgIcon.vue';
import PlaybackTags from '@/components/PlaybackTags.vue';
import TitlePrefix from '@/components/title-prefix/index.vue';
import { AIR_TERMINAL, HOVER } from '@/utils/globalVariables';

import { importanceDegree, getValueStr } from '@/utils/viewUtils';
import { abnormalJumpFun } from '@/utils/envUtils';
// import { jumpToAnalysis } from '@/views/lightingControl/loopModuleList/utils';

const props = defineProps({
    queryData: {
        type: Object,
        default: () => null
    },
    pos: {
        type: Object,
        default: () => ({})
    },
    runningMonitorType: {
        type: String,
        default: AIR_TERMINAL
    },
    hoverData: {
        type: Object,
        default: () => {}
    }
});

const emits = defineEmits(['clickMoreInfo', 'hide']);

// 显隐位置
const tipsShow = ref(false);
const localPosition = ref({
    left: 0,
    right: 0
});

// hover 请求响应的详情数据
const loading = ref(false);
const detailData = ref(null);

// 请求响应的详情数据：异常事件、巡检信息、信息点配置
const exceptionEventInfoList = ref([]);
const taskInfo = ref();
const relInfoCodeGroupConfigs = ref([]);

// 显示最后一条异常事件
const exceptionEventDisplay = computed(() => {
    if (exceptionEventInfoList.value?.length > 0) {
        return exceptionEventInfoList.value[exceptionEventInfoList.value.length - 1];
    }
    return null;
});

// 数据更新时间状态
const timeUpdateState = reactive({
    showTimePop: false,
    showMore: false,
    time: ''
});

// 提示框元素引用
const tipsContentElementRef = ref(null);
const timePopElementRef = ref(null);

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

let currentQueryData = null, // 当前查询数据
    showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false; //鼠标在卡片中；解决mouseEnter 先于watch执行

const getHoverCardData = item => {
    timeUpdateState.showMore = false;
    detailData.value = null;

    // 处理数据
    detailData.value = convertDetailData({ data: item });
    nextTick(() => {
        timeUpdateState.showMore = tipsContentElementRef.value?.clientHeight >= 400;
    });
};

const convertDetailData = res => {
    const { data } = res || {};
    if (!data) {
        return null;
    }

    // 异常事件处理
    const alarmevent = data.relInfoCodeGroupConfigs?.find(it => toLower(it.groupCode) === 'riskevent')?.relInfoCodeConfigs?.find(it => toLower(it.infoCode) === 'alarmeventdetail');
    // 巡检信息
    const onsiteinfo = data.relInfoCodeGroupConfigs
        ?.find(it => toLower(it.groupCode) === 'routinginspection')
        ?.relInfoCodeConfigs?.find(it => toLower(it.infoCode) === 'onsiteinfodetail');
    const obj = {
        id: data.id || data.objectId,
        localName: (data.localName || data.objectName) ?? '--',
        data
    };
    exceptionEventInfoList.value = alarmevent?.infoCode ? alarmevent.dataValue : [];
    exceptionEventInfoList.value.sort((a, b) => Number(a?.exceptionStartTime) - Number(b?.exceptionStartTime));
    taskInfo.value = onsiteinfo?.dataValue?.finishTime || onsiteinfo?.dataValue?.lastUpdateBy ? onsiteinfo?.dataValue : null;

    relInfoCodeGroupConfigs.value = [
        {
            groupCode: 'runningparameter',
            groupName: i18n.global.t('meos_control_web.env_parameters'),
            relInfoCodeConfigs: [
                { infoCodeName: i18n.global.t('meos_control_web.space_temperature'), dataValue: data?.temperatureCurrentValue, unit: '°C' },
                { infoCodeName: i18n.global.t('meos_control_web.co2_concentration'), dataValue: data?.carbonDioxideCurrentValue, unit: 'ppm' },
                ...(data?.relInfoCodeConfigs || [])
            ]
        }
    ];

    return obj;
};

// 有除标题的内容数据展示
const hasContentItems = computed(() => {
    return relInfoCodeGroupConfigs.value?.some(it => {
        const code = toLower(it.groupCode);
        if (code === 'equipstatus' || code === 'spacestatus') {
            return false;
        } else if (code === 'riskevent') {
            return it.relInfoCodeConfigs?.some(obj => {
                return obj.dataValue?.length > 0;
            });
        } else if (code === 'routinginspection') {
            return taskInfo.value?.lastUpdateBy || taskInfo.value?.finishTime;
        } else {
            return it.relInfoCodeConfigs?.length > 0;
        }
    });
});

const statusData = computed(() => {
    const curHoverData = detailData.value?.data;
    // XXX 处理标签数据
    const res = {
        relInfoCodeConfigs: [
            { infoCode: 'carbonDioxideDemandStatus', dataValue: curHoverData?.carbonDioxideDemandStatus, dataExtraValue: curHoverData?.carbonDioxideDemandValue },
            {
                infoCode: 'temperatureDemandStatus',
                dataValue: curHoverData?.temperatureDemandStatus,
                dataExtraValue: curHoverData?.temperatureDemandValue
            }
        ]
    };
    return res;
});

const hasStatusData = computed(() => {
    const curHoverData = detailData.value?.data;
    const hasDemandTemp = curHoverData?.temperatureDemandStatus;
    const hasDemandCo2 = curHoverData?.carbonDioxideDemandStatus;
    return hasDemandTemp || hasDemandCo2;
});

// const openTimeFun = (e, item) => {
//     if (item && item.dataValue) {
//         timePopElementRef.value = e.target;
//         timeUpdateState.showTimePop = true;
//         timeUpdateState.time = dayjs(item.dataTime).format('YYYY.MM.DD HH:mm:ss') || '--';
//     }
// };

// const closeTimeFun = () => {
//     timeUpdateState.showTimePop = false;
//     timePopElementRef.value = null;
//     timeUpdateState.time = '';
// };

//iot详情
// const detailsIot = item => {
//     if (item.dataValue) {
//         const jumpParams = {
//             infoCode: item.infoCode,
//             id: currentQueryData?.id
//         };
//         jumpToAnalysis(jumpParams);
//     }
// };

const handleMouse = isEnter => {
    isInCard = isEnter;

    if (isEnter) {
        clearTimeout(hideTipsTimer);
        hideTipsTimer = null;
    } else {
        hideTips();
    }
};

const hideTips = () => {
    if (isInCard) {
        return;
    }
    hideTipsTimer = setTimeout(() => {
        hideTipsNow();
    }, 100);
};

const showTips = queryData => {
    clearTimeout(hideTipsTimer);
    if (queryData?.id === currentQueryData?.id) return;
    currentQueryData = queryData;
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    showTipsTimer = setTimeout(() => {
        tipsShow.value = true;
        getHoverCardData(currentQueryData);
    }, 100);
};

const hideTipsNow = () => {
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    currentQueryData = null;
    isInCard = false;
    emits('hide');
};

// const moreInfo = () => {
//     emits('clickMoreInfo', { ...detailData.value, ...currentQueryData });
// };

const abnormalJump = item => {
    abnormalJumpFun(item);
};

defineExpose({
    hideTipsNow
});
</script>

<style lang="less" scoped>
.tips {
    position: absolute;
    width: 250px;
    padding: 10px 10px 0px;
    z-index: var(--z-index-hover-card) !important;
    transform: translate(-50%, -100%);
}

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

.font {
    color: #626c78;
}

.time {
    color: #000;
}

.iot-data-value {
    color: #1b2129;
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

.show-border-bottom {
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

        .fc {
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

    .iot-info {
        color: #246fe5;
    }

    .iot-info:hover {
        color: #1b4acc;
        cursor: pointer;
    }
}
</style>
