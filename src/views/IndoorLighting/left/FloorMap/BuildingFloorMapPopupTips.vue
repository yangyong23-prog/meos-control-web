<template>
    <div v-if="tipsShow" :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }" class="tips" @mouseenter="mouseenterPopup" @mouseleave="mouseleavePopup">
        <div class="tips-content-warp">
            <div class="loading-content">
                <div ref="box" class="tips-content">
                    <!-- 名称 -->
                    <div class="f">
                        <span>{{ localNameShowText }}</span>
                    </div>
                    <div :class="[hasContentItems ? 'bc pb8' : '']">
                        <!-- 标签 -->
                        <div class="title-tag mr4">
                            <SpaceTags :space-id="detailObj?.id" />
                        </div>
                    </div>

                    <!-- 异常事件（一定没有异常事件） -->
                    <div v-if="oneAbnormal" class="abnormal-event-content">
                        <TitlePrefix :title="i18n.global.t('meos_control_web.abnormal_event')" :col-gap="4" :font-size="14" />
                        <m-popover
                            style="pointer-events: none"
                            :enterable="false"
                            theme="darkTransparent"
                            :show-arrow="false"
                            :content="i18n.global.t('meos_control_web.click_jump_abnormal_event')"
                        >
                            <div class="content" @click="abnormalJump(oneAbnormal)">
                                {{
                                    i18n.global.t('meos_control_web.find_certain_risks', {
                                        instancesName: oneAbnormal.instancesName,
                                        problemsNumber: oneAbnormal.problemsNumber,
                                        problemsName: oneAbnormal.problemsName
                                    })
                                }}
                            </div>
                        </m-popover>
                        <div class="f mt4">
                            <span class="font">{{ i18n.global.t('meos_control_web.departure_time_colon') }}</span>
                            <span class="time">{{ dayjs.tz(+oneAbnormal.exceptionStartTime).format('YYYY-MM-DD HH:mm') || '- -' }}</span>
                        </div>
                        <div class="f mt4">
                            <span class="font">{{ i18n.global.t('meos_control_web.risk_level_colon') }}</span>
                            <span class="time">{{ importanceDegree(oneAbnormal).name }}</span>
                        </div>
                        <div v-if="exceptionEventBaseInfoList?.length > 1" class="abnormal-count">
                            {{ i18n.global.t('meos_control_web.there_are_still', { name: '' }) }} <span class="num">{{ exceptionEventBaseInfoList.length - 1 }}</span
                            >{{ i18n.global.t('meos_control_web.some_abnormals', { count: '' }) }}<LeftArrow class="arrow-more" />
                        </div>
                    </div>
                    <!-- 信息点 -->
                    <div v-if="lux.show" :key="index" class="mt4">
                        <TitlePrefix :title="i18n.global.t('meos_control_web.env_parameters')" :col-gap="4" :font-size="14" :line-height="22" />
                        <div style="display: flex">
                            <span class="font" style="max-width: 126px">{{ lux.infoCodeName + '：' }}</span>
                            <span
                                v-ellipsis
                                :class="[lux.dataValue && lux.infoCodeType !== 'BASIC' ? 'iot-info' : '', 'time', 'm-ellipsis']"
                                style="max-width: 92px"
                                @mousemove="e => openTimeFun(e, lux)"
                                @mouseleave="e => closeTimeFun(e)"
                                @click="detailsIot(lux)"
                                >{{ lux.value }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="dow"></div>
        </div>
    </div>
    <!-- 照度跳转到数据分析 -->
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
import i18n from '@/localization';
import { AIR_TERMINAL } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import SpaceTags from '../../components/SpaceTags.vue';
import LeftArrow from '@/assets/images/common/right.svg';
import { importanceDegree } from '@/utils/viewUtils';
import { jumpToAnalysis } from '@/utils/envUtils';
import { isEmpty } from 'lodash';
import TitlePrefix from '@/components/title-prefix/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
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
    groupCodes: {
        type: Array,
        default: () => []
    }
});
const emit = defineEmits(['clickMoreInfo', 'hide']);

// 停车位-车牌号隐藏跳转数据分析入口
const hideInfoCodes = ['carNumber'];

const isInfoCodeHideLink = infoCode => hideInfoCodes.includes(infoCode);

const state = reactive({
    showTimePop: false,
    shoeMore: false,
    time: ''
});

const detailObj = ref();
const timePopRef = ref('');
const box = ref(null);
const tipsShow = ref(false);
const taskInfo = ref();
const relInfoCodeGroupConfigs = ref([]);

const localPosition = ref({
    left: 0,
    right: 0
});

let showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false; //鼠标在卡片中；解决mouseEnter 先于watch执行

const { getAbnormalEventsList, getIotData, getIotShowValue } = DockSingleton.getInstance();

const lux = computed(() => {
    const data = getIotData(detailObj.value?.id, 'workPlaneLux');
    const value = isEmpty(data.dataValue) ? '--' : getIotShowValue(detailObj.value?.id, 'workPlaneLux');
    return { ...data, value, show: data.dataValue !== undefined };
});

const hasContentItems = computed(() => {
    return lux.value.show;
});

const exceptionEventBaseInfoList = computed(() => {
    return getAbnormalEventsList(detailObj.value?.abnormalIds || []);
});

const oneAbnormal = computed(() => {
    if (exceptionEventBaseInfoList.value.length > 0) {
        return exceptionEventBaseInfoList.value[exceptionEventBaseInfoList.value.length - 1];
    }
    return null;
});
useWatchWithCleanup(
    () => props.queryData,
    () => {
        if (props.queryData?.id) {
            showTips(props.queryData);
        } else {
            hideTips();
        }
    }
);

useWatchWithCleanup(
    () => props.pos,
    () => {
        if (props.pos) {
            localPosition.value = { ...props.pos };
        }
    }
);

// 要展示的名字
const localNameShowText = computed(() => {
    return detailObj.value?.localName ?? '--';
});

const showTips = queryData => {
    clearTimeout(hideTipsTimer);
    detailObj.value = queryData;
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    showTipsTimer = setTimeout(() => {
        tipsShow.value = true;
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
    detailObj.value = null;
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

const openTimeFun = (e, item) => {
    if (isInfoCodeHideLink(item?.infoCode)) {
        return;
    }
    if (item && item.dataValue && item.infoCodeType !== 'BASIC') {
        timePopRef.value = e.target;
        state.showTimePop = true;
        state.time = dayjs(item.dataTime).format('YYYY.MM.DD HH:mm:ss') || '--';
    }
};

const closeTimeFun = () => {
    state.showTimePop = false;
    timePopRef.value = null;
    state.time = '';
};

const jumpToDataAnalysis = item => {
    if (isInfoCodeHideLink(item?.infoCode)) {
        return;
    }
    const jumpParams = {
        infoCode: item.infoCode,
        id: detailObj.value?.id
    };
    jumpToAnalysis(jumpParams);
};

//ios详情
const detailsIot = item => {
    if (item.dataValue && item.infoCodeType !== 'BASIC') {
        jumpToDataAnalysis(item);
    }
};

const abnormalJump = item => {
    // abnormalJumpFun(item);
};

defineExpose({
    hideTipsNow
});
</script>

<style lang="less" scoped>
.tips {
    position: absolute;
    // display: none;
    width: 250px;
    padding: 10px 10px 0px;
    z-index: var(--z-index-hover-card) !important;
    transform: translate(-50%, -100%);
}
.bc {
    border-bottom: 1px solid #f1f4f6;
}

.pb8 {
    padding-bottom: 8px;
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

        .title-tag {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 4px;
        }

        .abnormal-event-content {
            margin-top: 8px;
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

            .time {
                color: #000;
            }

            .abnormal-count {
                padding: 4px 8px;
                border-radius: 4px;
                margin-top: 4px;
                background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0.2) 100%);
                font-size: 12px;
                cursor: pointer;
                .num {
                    font-style: normal;
                    font-weight: bold;
                    color: var(--blue-500);
                    line-height: 22px; /* 183.333% */
                }
                .arrow-more {
                    width: 10px;
                    height: 10px;
                    margin-left: 4px;
                    position: relative;
                    top: 1px;
                }
            }
        }
    }

    .font {
        color: #626c78;
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
