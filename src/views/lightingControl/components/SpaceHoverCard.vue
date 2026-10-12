<template>
    <div
        v-if="cardShow"
        :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }"
        class="card-container"
        @mouseenter="mouseenterPopup"
        @mouseleave="mouseleavePopup"
    >
        <div class="card-content-warp">
            <div v-loading="loading" element-loading-lottiename="circle" class="loading-content">
                <div v-if="cardData" ref="box" class="card-content">
                    <div v-ellipsis class="m-ellipsis card-name">{{ localName ?? '--' }}</div>

                    <div v-if="tagObjs?.length" class="card-tags-warp">
                        <span v-for="tag in tagObjs" :key="tag.name" class="tag-item" :style="{ backgroundColor: tag.color }">{{ tag.name }}</span>
                    </div>
                    <div v-if="oneAbnormal || cardData?.deviceInfo?.length || cardData.workPlaneLux" class="split-line" />

                    <div v-if="oneAbnormal" class="abnormal-event-content">
                        <div class="content-title">{{ i18n.global.t('meos_control_web.abnormal_event') }}</div>
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
                        <div v-if="cardData?.exceptionEventBaseInfoList?.length > 1" class="abnormal-count" @click="moreInfo">
                            {{ i18n.global.t('meos_control_web.there_are_still', { name: '' }) }}<span class="num">{{ cardData.exceptionEventBaseInfoList.length - 1 }}</span
                            >{{ i18n.global.t('meos_control_web.some_abnormals', { count: '' }) }}<LeftArrow class="arrow-more" />
                        </div>
                    </div>

                    <!-- <div v-if="cardData?.deviceInfo?.length" class="equipment-abnormal-content">
                        <div class="content-title">{{ i18n.global.t('meos_control_web.device_exception') }}</div>
                        <div v-for="device in cardData.deviceInfo" :key="device.id" class="equipment-content">
                            <span
                                v-ellipsis
                                :class="[myElement === 24 ? 'equipment-name1' : myElement === 60 || myElement === 55 ? 'equipment-name2' : 'equipment-name', 'm-ellipsis']"
                                >{{ device.name }}</span
                            >
                            <div class="right-content">
                                <span v-if="device.infoCodeList?.indexOf('onlineStatus') > -1" class="offline-mark" style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.offline') }}</span>
                                <span v-if="device.infoCodeList?.indexOf('orderFailAlarm') > -1" class="inconsistent" style="color: var(--orange-700)">{{ i18n.global.t('meos_control_web.control_feedback_mismatch') }}</span>
                            </div>
                        </div>
                    </div> -->

                    <div v-if="cardData.workPlaneLux" class="mt8 environmental-parameter">
                        <div class="content-title">{{ i18n.global.t('meos_control_web.env_parameters') }}</div>
                        <div class="f mt4">
                            <span class="font">{{ i18n.global.t('meos_control_web.illuminance_colon') }}</span>
                            <span :class="[cardData.workPlaneLux ? 'content' : '']" @click="jumpToDataAnalysis(cardData)">{{ cardData.workPlaneLux || '--' }}lx</span>
                        </div>
                    </div>

                    <div v-if="state.shoeMore" class="more-item">
                        <div style="cursor: pointer" @click="moreInfo">
                            <span style="color: #246fe5">{{ i18n.global.t('meos_control_web.more_info') }}</span>
                            <LeftArrow />
                        </div>
                    </div>
                </div>
            </div>
            <div class="dow"></div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { getLightSpaceData } from '@/apis/lightingControl';
import { importanceDegree } from '@/utils/viewUtils';
import { watch, ref } from 'vue';
import useStore from '@/store';
import { SUCCESSCODE } from '@/utils/globalVariables';
import LeftArrow from '@/assets/images/common/right.svg';
import { abnormalJumpFun, jumpToAnalysis } from '@/utils/envUtils';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';

const { base } = useStore();
const templateType = inject('templateType');

const props = defineProps({
    spaceObj: {
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
    shoeMore: true,
    time: ''
});

const openCloseStatusMap = {
    ALL_OPEN: {
        name: i18n.global.t('meos_control_web.fully_on'),
        color: '#F2CB0C'
    },
    ALL_CLOSE: {
        name: i18n.global.t('meos_control_web.fully_off'),
        color: '#626C78'
    },
    PARTIAL_OPEN: {
        name: i18n.global.t('meos_control_web.partial_on'),
        color: '#CC5300'
    },
    FEEDBACK_REGULATION: {
        name: i18n.global.t('meos_control_web.feedback_adjustment'),
        color: '#00A2A7'
    }
};

const abnormalTag = {
    name: i18n.global.t('meos_control_web.abnormal'),
    color: '#F55047'
};

const runningDeviationTypeMap = {
    MORE_OPEN: {
        name: i18n.global.t('common.over_on'),
        color: '#E6B407'
    },
    LESS_OPEN: {
        name: i18n.global.t('common.drive_less'),
        color: '#FF9D2D'
    }
};

const interventionTypeMap = {
    DEMAND_INTERVENTION: {
        // 手动干预1
        name: i18n.global.t('meos_control_web.manual_intervention'),
        color: '#8252E3'
    },
    MANUAL_CONTROL: {
        // 手动干预2
        name: i18n.global.t('meos_control_web.manual_intervention'),
        color: '#8252E3'
    }
};

const loading = ref(true);
const cardData = ref(null);
const timePopRef = ref('');
const localName = ref('');
const box = ref(null);
const cardShow = ref(false);
const currentSpaceData = ref();
const myElement = ref('');
const localPosition = ref({
    left: 0,
    right: 0
});

const tagObjs = computed(() => {
    if (cardData.value?.tags) {
        const { tags } = cardData.value;
        const openCloseStatusTag = openCloseStatusMap[tags.openCloseStatus];
        const abnormalTagObj = tags.abnormalStatuses && tags.abnormalStatuses?.indexOf(ABNORMAL_EVENT) !== -1 ? abnormalTag : null;
        const runningDeviationTypeTag = runningDeviationTypeMap[tags.runningDeviationType];
        const interventionTypeTag = interventionTypeMap[tags.interventionType];
        const runningDeviationTypes = tags.runningDeviationTypes?.map(runningDeviationType => runningDeviationTypeMap[runningDeviationType]) || [];
        return [openCloseStatusTag, abnormalTagObj, interventionTypeTag, ...runningDeviationTypes].filter(Boolean);
    }
    return [];
});

const oneAbnormal = computed(() => {
    return cardData.value?.exceptionEventBaseInfoList[0];
});

let showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false, //鼠标在卡片中；解决mouseEnter 先于watch执行
    queryInfoCodeConfigAobortController = null;

watch(
    () => props.spaceObj,
    () => {
        if (props.spaceObj?.id || props.spaceObj?.lampFuncType) {
            showTips(props.spaceObj);
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

const showTips = spaceObj => {
    clearTimeout(hideTipsTimer);
    if (spaceObj?.id && spaceObj?.id === currentSpaceData.value?.id) return;
    if (spaceObj?.lampFuncType && spaceObj?.lampFuncType === currentSpaceData.value?.lampFuncType) return;
    currentSpaceData.value = spaceObj;
    clearTimeout(showTipsTimer);
    cardShow.value = false;
    showTipsTimer = setTimeout(() => {
        localName.value = currentSpaceData.value.localName ?? '--';
        cardShow.value = true;
        getAbnormalEventList(currentSpaceData.value);
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
    cardShow.value = false;
    currentSpaceData.value = null;
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

const getAbnormalEventList = spaceData => {
    loading.value = true;
    state.shoeMore = false;
    cardData.value = null;
    if (queryInfoCodeConfigAobortController) {
        queryInfoCodeConfigAobortController.abort();
        queryInfoCodeConfigAobortController = null;
    }
    queryInfoCodeConfigAobortController = new AbortController();
    const param = { projectId: base.projectId, demandTemplateType: templateType.value };
    if (spaceData.id) {
        param.spaceId = spaceData.id;
    }
    if (spaceData.lampFuncType) {
        param.lampFuncType = spaceData.lampFuncType;
    }
    getLightSpaceData(param, queryInfoCodeConfigAobortController.signal).then(res => {
        if (res.code === SUCCESSCODE) {
            if (res.data) {
                cardData.value = res.data;
                loading.value = false;
            } else {
                cardData.value = {};
                loading.value = false;
            }
        } else {
            cardData.value = {};
            loading.value = false;
        }
        nextTick(() => {
            state.shoeMore = box.value?.clientHeight >= 400 ? true : false;
            myElement.value = document.querySelector('.right-content')?.clientWidth;
            console.log(myElement.value, 'myElement.value');
        });
    });
};

const days = computed(() => minutes => {
    const day = Math.floor(minutes / 60 / 24);
    return day;
});

const hours = computed(() => minutes => {
    const hour = Math.ceil((minutes % (60 * 24)) / 60);
    return hour;
});

//更多
const moreInfo = () => {
    emit('clickMoreInfo', { ...cardData.value, ...currentSpaceData.value });
};

const abnormalJump = item => {
    abnormalJumpFun(item);
};
const jumpToDataAnalysis = item => {
    // console.log(item, currentSpaceData.value);
    const jumpParams = {
        infoCode: item.hasOwnProperty('workPlaneLux') ? 'workPlaneLux' : '',
        id: currentSpaceData?.value?.id
    };
    jumpToAnalysis(jumpParams);
};

defineExpose({
    hideTipsNow
});
</script>

<style lang="less" scoped>
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
.card-container {
    position: absolute;
    // display: none;
    padding: 10px 10px 0;
    z-index: var(--z-index-hover-card) !important;
    transform: translate(-50%, -100%);

    .card-content-warp {
        font-size: 14px;
        width: 250px;
        min-height: 60px;
        position: relative;

        .loading-content {
            width: 100%;
            min-height: 60px;
            background-color: white;
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
            border-radius: 4px;
            overflow: hidden;
        }

        .card-content {
            padding: 12px 16px;
            overflow-y: hidden;
            max-height: 400px;

            .card-name {
                font-size: 14px;
                color: var(--gray-900);
                margin-bottom: 8px;
            }

            .card-tags-warp {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                padding-bottom: 8px;
                .tag-item {
                    padding: 0 4px;
                    font-size: 12px;
                    font-style: normal;
                    line-height: 20px; /* 166.667% */
                    border-radius: 2px;
                    color: #fff;
                }
            }

            .split-line {
                border-bottom: 1px solid var(--gray-200);
            }

            .content-title {
                font-weight: bold;
                position: relative;
                padding-left: 10px;
                &::before {
                    content: '';
                    position: absolute;
                    left: 0px;
                    top: 4px;
                    width: 2px;
                    height: 12px;
                    background-color: var(--blue-500);
                }
            }
            .environmental-parameter {
                .content {
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
                .font {
                    color: #626c78;
                }
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

                .font {
                    color: #626c78;
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

            .equipment-abnormal-content {
                margin-top: 8px;
                font-size: 14px;
                .equipment-content {
                    margin-top: 4px;
                    display: flex;
                    justify-content: space-between;
                    .equipment-name {
                        width: calc(100% - 100px);
                    }
                    .equipment-name1 {
                        width: calc(100% - 40px); //只有离线的时候
                    }
                    .equipment-name2 {
                        width: calc(100% - 80px); //只有控反不一致的时候
                    }
                    .right-content {
                        font-size: 12px;
                        display: flex;
                        justify-content: flex-end;
                        gap: 4px;
                        white-space: nowrap;
                        line-height: 20px;
                    }
                }
            }

            .more-item {
                width: 100%;
                position: absolute;
                bottom: 10px;
                left: 0;
                background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.85) 30%, rgba(255, 255, 255, 1) 100%);
                border-radius: 4px;
                display: flex;
                align-items: center;
                padding: 20px 16px 5px;
                line-height: 22px;
                font-size: 14px;

                &:hover {
                    color: var(--blue-700);
                    :deep(svg) {
                        path {
                            fill: var(--blue-700);
                        }
                    }
                }

                :deep(svg) {
                    margin-left: 4px;
                    path {
                        fill: var(--blue-500);
                    }
                }
            }
        }

        .dow {
            width: 0;
            height: 0;
            border-top: 5px solid white;
            border-right: 5px solid transparent;
            border-left: 5px solid transparent;
            border-bottom: 5px solid transparent;
            margin: auto;
        }
    }
}

.bc {
    border-bottom: 1px solid #f1f4f6;
    padding-bottom: 10px;
}
</style>
