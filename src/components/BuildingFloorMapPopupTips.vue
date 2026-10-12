<template>
    <div v-if="tipsShow" :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }" class="tips" @mouseenter="mouseenterPopup" @mouseleave="mouseleavePopup">
        <div class="tips-content-warp">
            <div v-loading="loading" element-loading-lottiename="circle" class="loading-content">
                <div ref="box" class="tips-content">
                    <div class="f">
                        <span>{{ localNameShowText }}</span>
                        <slot v-if="!loading" :params="{ dateilObj: dateilObj }"></slot>
                    </div>
                    <div :class="[hasContentItems ? 'bc pb10' : '']">
                        <div v-if="hasStatusData" :class="[hasStatusData ? 'mt8' : '', 'title-tag']">
                            <TemplateObjectTags :status-data="statusData" :select-obj="dateilObj" :filter-arr="filterCodes" :template-type="HOVER" />
                            <!-- <m-tag v-for="tag in tagObjs" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag> -->
                        </div>
                    </div>
                    <template v-for="config in relInfoCodeGroupConfigs" :key="config.groupCode">
                        <template
                            v-if="
                                toLower(config.groupCode) === 'equipstatus' || toLower(config.groupCode) === 'spacestatus' || toLower(config.groupCode) === 'objectadditionalinfo'
                            "
                        ></template>
                        <template v-else-if="toLower(config.groupCode) === 'dangereventstatus'">
                            <div class="mt8">
                                <TitlePrefix :title="i18n.global.t('meos_control_web.risk_status')" :col-gap="4" :font-size="14" />
                                <HoverRiskCard :detail-obj="dateilObj" />
                            </div>
                        </template>
                        <template v-else-if="toLower(config.groupCode) === 'riskevent'">
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
                                    <div class="label-value mt4">
                                        <span class="font">{{ i18n.global.t('meos_control_web.departure_time_colon') }}</span>
                                        <span class="time">{{ dayjs.tz(+exceptionEventDisplay.exceptionStartTime).format('YYYY-MM-DD HH:mm') || '- -' }}</span>
                                    </div>
                                    <div class="label-value mt4">
                                        <span class="font">{{ i18n.global.t('meos_control_web.risk_level_colon') }}</span>
                                        <span class="time">{{ importanceDegree(exceptionEventDisplay).name }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="toLower(config.groupCode) === 'routinginspection'">
                            <div v-if="taskInfo" class="mt8">
                                <TitlePrefix :title="i18n.global.t('meos_control_web.inspection_info')" :col-gap="4" :font-size="14" />
                                <div class="label-value mt4">
                                    <span class="font">{{ i18n.global.t('meos_control_web.last_finish_time_colon') }}</span>
                                    <span class="time">{{ dayjs(taskInfo.finishTime).format('YYYY-MM-DD') || '- -' }}</span>
                                </div>
                                <div class="label-value mt4">
                                    <span class="font">{{ i18n.global.t('meos_control_web.inspector_colon') }}</span>
                                    <span class="time">{{ taskInfo.lastUpdateBy }}</span>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="toLower(config.groupCode) === 'runningparameter'">
                            <div v-if="filterInfoCodes(config?.relInfoCodeConfigs).length" class="mt8">
                                <TitlePrefix :title="config.groupName" :col-gap="4" :font-size="14" />
                                <div v-for="(item, index) in filterInfoCodes(config?.relInfoCodeConfigs)" :key="index" class="mt4">
                                    <div style="display: flex" class="label-value">
                                        <span class="font">{{ item.infoCodeName + '：' }}</span>
                                        <span
                                            v-ellipsis
                                            :class="[
                                                item.dataValue && item.infoCodeType !== 'BASIC' ? 'iot-info' : '',
                                                'time',
                                                'm-ellipsis',
                                                isInfoCodeHideLink(item.infoCode) ? 'hide-link' : ''
                                            ]"
                                            @mousemove="e => openTimeFun(e, item)"
                                            @mouseleave="e => closeTimeFun(e)"
                                            @click="detailsIot(item)"
                                            >{{ getValueStr(item).text }}</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="config.relInfoCodeConfigs?.length" class="mt8">
                                <TitlePrefix :title="config.groupName" :col-gap="4" :font-size="14" />
                                <div v-for="(item, index) in config.relInfoCodeConfigs" :key="index">
                                    <!-- 统计类数据 -->
                                    <template v-if="item.infoCodeType === 'RWD_OBJECT_STAT'">
                                        <div v-for="(d, i) in item.dataValue" :key="i" class="label-value mt4">
                                            <span class="font">{{ d.name }}：</span>
                                            <span class="time"> {{ d.dataValue + d.unit }} </span>
                                        </div>
                                    </template>
                                    <div v-else class="label-value mt4">
                                        <span class="font">{{ item.infoCodeName }}：</span>
                                        <span class="time"> {{ getValueStr(item).text }} </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
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
import i18n from '@/localization';
import { getValueStr } from '@/utils/viewUtils';
import dayjs from 'dayjs';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { queryEquipHoverInfo } from '@/apis/systemDiagram';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { AIR_TERMINAL, HOVER, SUCCESSCODE } from '@/utils/globalVariables';
import { watch, ref } from 'vue';
import { importanceDegree } from '@/utils/viewUtils';
import { abnormalJumpFun, jumpToAnalysis } from '@/utils/envUtils';
import { toLower } from 'lodash';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import TitlePrefix from './title-prefix/index.vue';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import HoverRiskCard from '@/views/machine-room-safety/space-map/hoverRiskCard.vue';
import DockSingleton from '@/hooks/responsiveDock';

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
    },
    filterCodes: {
        type: Array,
        default: () => []
    },
    useNewApi: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['clickMoreInfo', 'hide']);
const { getAbnormalEventsList } = DockSingleton.getInstance();
// 停车位-车牌号隐藏跳转数据分析入口
const hideInfoCodes = ['carNumber'];

const isInfoCodeHideLink = infoCode => hideInfoCodes.includes(infoCode);
const filterInfoCodes = relInfoCodeConfigs => {
    if (!relInfoCodeConfigs) return [];
    return (
        relInfoCodeConfigs?.filter(info => {
            return !props.filterCodes?.includes(info?.infoCode);
        }) || []
    );
};
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
const exceptionEventInfoList = ref([]);
const taskInfo = ref();
const additionalInfo = ref();
const relInfoCodeGroupConfigs = ref([]);

const localPosition = ref({
    left: 0,
    right: 0
});

let currentQueryData = null, // 当前查询数据
    showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false, //鼠标在卡片中；解决mouseEnter 先于watch执行
    queryInfoCodeConfigAbortController = null;

const exceptionEventDisplay = computed(() => {
    if (props.queryData?.id || dateilObj.value?.id) {
        const arr = getAbnormalEventsList([props.queryData?.id || dateilObj.value?.id]);
        if (arr?.length > 0) {
            return arr[0];
        }
    }
    if (exceptionEventInfoList.value?.length > 0) {
        return exceptionEventInfoList.value[exceptionEventInfoList.value.length - 1];
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

const equipmentId = computed(() => {
    return props.queryData?.id;
});

// 要展示的名字
const localNameShowText = computed(() => {
    return loading.value ? '' : dateilObj.value?.localName ?? '--';
});
useEquipInfoSSEHandle(
    equipmentId,
    {
        relInfoCodeGroupConfigs,
        RISK_EVENT_DETAIL: exceptionEventInfoList,
        ROUTING_INSPECTION: taskInfo
    },
    true,
    HOVER
);

const showTips = queryData => {
    clearTimeout(hideTipsTimer);
    if (queryData?.id === currentQueryData?.id) return;
    currentQueryData = queryData;
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    const title = props?.queryData?.localName ?? '--';
    showTipsTimer = setTimeout(() => {
        localName.value = currentQueryData.localName;
        tipsShow.value = true;
        getHoverCardData(currentQueryData, title);
    }, 300);
};

const hideTips = () => {
    // 隐藏时取消接口请求
    if (queryInfoCodeConfigAbortController) {
        queryInfoCodeConfigAbortController.abort();
        queryInfoCodeConfigAbortController = null;
    }
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
const convertDetailData = res => {
    // 处理数据
    const data = res.data[0];
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
        classCode: data.classCode,
        objType: data.objType,
        localName: (data.localName || data.objectName) ?? '--',
        showDetail: data.relInfoCodeGroupConfigs
            ?.find(it => toLower(it.groupCode) === 'objectadditionalinfo')
            ?.relInfoCodeConfigs?.find(it => toLower(it.infoCode) === 'existinfocodedetailconfig')?.dataValue
        // relInfoCodeGroupConfigs: data.relInfoCodeGroupConfigs,
        // exceptionEventInfoList: alarmevent?.infoCode ? alarmevent.dataValue : [],
        // taskInfo: onsiteinfo?.dataValue?.finishTime || onsiteinfo?.dataValue?.lastUpdateBy ? onsiteinfo?.dataValue : null
    };
    exceptionEventInfoList.value = alarmevent?.infoCode ? alarmevent.dataValue : [];
    exceptionEventInfoList.value?.sort((a, b) => Number(a?.exceptionStartTime) - Number(b?.exceptionStartTime));
    taskInfo.value = onsiteinfo?.dataValue?.finishTime || onsiteinfo?.dataValue?.lastUpdateBy ? onsiteinfo?.dataValue : null;
    relInfoCodeGroupConfigs.value = data.relInfoCodeGroupConfigs;
    return obj;
};
const getHoverCardData = (item, title) => {
    loading.value = true;
    state.shoeMore = false;
    exceptionEventInfoList.value = [];
    taskInfo.value = [];
    relInfoCodeGroupConfigs.value = [];

    dateilObj.value = null;
    if (queryInfoCodeConfigAbortController) {
        queryInfoCodeConfigAbortController.abort();
        queryInfoCodeConfigAbortController = null;
    }
    queryInfoCodeConfigAbortController = new AbortController();
    const params = {
        runningMonitorType: props.runningMonitorType,
        templateCode: HOVER,
        objectIds: [item.id],
        groupCodes: props.groupCodes?.length ? props.groupCodes : undefined
    };
    if (item?.startTime && item.endTime) {
        params.startTime = item.startTime;
        params.endTime = item.endTime;
    }
    if (item.runningMonitorSecondType) {
        params.runningMonitorSecondType = item.runningMonitorSecondType;
    }
    let queryApiFunc = props.useNewApi ? listInfoCodeConfigsByObjectIdCommon : queryEquipHoverInfo;
    queryApiFunc(params, queryInfoCodeConfigAbortController.signal).then(res => {
        if (res.code === SUCCESSCODE) {
            if (res.data) {
                // 处理数据
                dateilObj.value = convertDetailData(res);
                loading.value = false;
            } else {
                dateilObj.value = null;
                loading.value = false;
            }
            if (dateilObj.value === null) {
                dateilObj.value = {
                    localName: props?.queryData?.localName || title
                };
            }
        } else {
            dateilObj.value = null;
            loading.value = false;
        }
        nextTick(() => {
            state.shoeMore = box.value?.clientHeight >= 400;
        });
    });
};

const statusData = computed(() => {
    return relInfoCodeGroupConfigs.value?.find(it => toLower(it.groupCode) === 'equipstatus' || toLower(it.groupCode) === 'spacestatus');
});

const _hasDataValue = group => {
    return group?.relInfoCodeConfigs?.some(obj => {
        // infoCode 为dangerEvent时不返回dataValue
        return obj.hasOwnProperty('dataValue') || obj.infoCode === 'dangerEvent' || obj.infoCode === 'alarmstatus' || obj.infoCode === 'alarmeventdetail';
    });
};
const hasStatusData = computed(() => {
    return relInfoCodeGroupConfigs.value?.some(
        it => (toLower(it.groupCode) === 'equipstatus' && _hasDataValue(it)) || (toLower(it.groupCode) === 'spacestatus' && _hasDataValue(it))
    );
});

// 有除标题的内容数据展示
const hasContentItems = computed(() => {
    // console.log('relInfoCodeGroupConfigs.value: ', relInfoCodeGroupConfigs.value);
    return relInfoCodeGroupConfigs.value?.some(it => {
        const code = toLower(it.groupCode);
        if (code === 'equipstatus' || code === 'spacestatus' || code === 'objectadditionalinfo') {
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
        id: currentQueryData?.id
    };
    jumpToAnalysis(jumpParams);
};

//ios详情
const detailsIot = item => {
    if (item.dataValue && item.infoCodeType !== 'BASIC') {
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

.label-value {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}
.font {
    color: #626c78;
    // display: inline-flex;
    // white-space: nowrap;
    // flex-shrink: 0;
    word-break: break-all;
    overflow-wrap: break-word;
}

.time {
    color: #000;
    // white-space: nowrap;
    // display: inline-flex;
    // white-space: nowrap;
    // flex-shrink: 0;
    word-break: break-all;
    overflow-wrap: break-word;
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
            justify-content: space-between;
            align-items: start;

            .title:not(:only-child) {
                margin-right: 8px;
            }
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

.hide-link {
    cursor: default !important;
    color: #626c78 !important;

    &:hover {
        cursor: default !important;
    }
}
</style>
