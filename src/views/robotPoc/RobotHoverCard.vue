<template>
    <div v-if="tipsShow" :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }" class="tips" @mouseenter="mouseenterPopup" @mouseleave="mouseleavePopup">
        <div class="tips-content-warp">
            <div v-loading="loading" element-loading-lottiename="circle" class="loading-content">
                <div v-if="!dateilObj" class="tips-content">
                    <div class="f">
                        <span v-ellipsis class="m-ellipsis">{{ (queryData?.localName || queryData?.name) ?? '--' }}</span>
                    </div>
                </div>
                <div v-else ref="box" class="tips-content">
                    <div class="tips-header">
                        <span v-ellipsis class="m-ellipsis header-name">{{ dateilObj?.localName ?? '--' }}</span>
                        <span v-if="tagObjs.length" :class="['title-tag']">
                            <m-tag v-for="tag in tagObjs" :key="tag.name" class="info-tag" :color="tag.color" :bg-color="tag.bgColor" size="small">{{ tag.name }} </m-tag>
                        </span>
                    </div>
                    <template v-for="config in relInfoCodeGroupConfigs" :key="config.groupCode">
                        <template v-if="toLower(config.groupCode) === 'runningparameter'">
                            <div v-if="config?.relInfoCodeConfigs?.length" class="mt8">
                                <div v-for="(item, index) in config.relInfoCodeConfigs" :key="index" class="mt4">
                                    <div style="display: flex">
                                        <span class="font">{{ item.infoCodeName + '：' }}</span>
                                        <span v-ellipsis class="m-ellipsis font">{{ getValueStr(item).text }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="config.relInfoCodeConfigs?.length" class="mt8">
                                <div v-for="(item, index) in config.relInfoCodeGroupConfigs" :key="index" class="f mt4">
                                    <span class="font">{{ item.infoCodeName }}：</span>
                                    <span class="m-ellipsis font">{{ item.dataValue || '--' }}</span>
                                </div>
                            </div>
                        </template>
                    </template>
                    <div class="track-warp">
                        <m-button type="default" size="medium" @click="toTrack">{{
                            dateilObj && currentTrackObj?.id === dateilObj?.id
                                ? i18n.global.t('meos_control_web.stop_tracking')
                                : i18n.global.t('meos_control_web.track_this_robot')
                        }}</m-button>
                    </div>
                </div>
            </div>
            <div class="dow"></div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getValueStr } from '@/utils/viewUtils';
import { queryEquipHoverInfo } from '@/apis/systemDiagram';
import { HOVER, SUCCESSCODE } from '@/utils/globalVariables';
import { watch, ref } from 'vue';
import { toLower } from 'lodash';

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
        default: 'Robot'
    },
    currentTrackObj: {
        type: Object,
        default: () => null
    }
});

const emit = defineEmits(['track', 'hide']);

const loading = ref(true);
const dateilObj = ref(null);
const box = ref(null);
const tipsShow = ref(false);

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

const toTrack = () => {
    if (props.currentTrackObj?.id === dateilObj.value?.id) {
        emit('track', null);
        return;
    }
    emit('track', dateilObj.value);
};

//运行状态
const runStatusEnum = {
    1: {
        name: i18n.global.t('common.operation'),
        color: '#0C9B4A',
        bgColor: '#DAF7E1'
    },
    0: {
        name: i18n.global.t('meos_control_web.stop'),
        color: '#1B2129',
        bgColor: '#E8ECF0'
    }
};

//在离线状态
const onlineStatusEnum = {
    1: {
        name: i18n.global.t('meos_control_web.online'),
        color: '#0C9B4A',
        bgColor: '#DAF7E1'
    },
    0: {
        name: i18n.global.t('meos_control_web.offline'),
        color: '#1B2129',
        bgColor: '#E8ECF0'
    }
};

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
const convertDetailData = res => {
    // 处理数据
    const data = res.data[0];
    if (!data) {
        return null;
    }
    const obj = {
        id: data.id || data.objectId,
        localName: (data.localName || data.objectName) ?? '--'
    };
    relInfoCodeGroupConfigs.value = data.relInfoCodeGroupConfigs;

    return obj;
};
const getHoverCardData = item => {
    loading.value = true;
    dateilObj.value = null;
    if (queryInfoCodeConfigAbortController) {
        queryInfoCodeConfigAbortController.abort();
        queryInfoCodeConfigAbortController = null;
    }
    queryInfoCodeConfigAbortController = new AbortController();
    const params = {
        runningMonitorType: props.runningMonitorType,
        templateCode: HOVER,
        objectIds: [item.id]
    };

    queryEquipHoverInfo(params, queryInfoCodeConfigAbortController.signal).then(res => {
        if (res.code === SUCCESSCODE) {
            if (res.data) {
                // 处理数据
                dateilObj.value = convertDetailData(res);
                loading.value = false;
            } else {
                dateilObj.value = null;
                loading.value = false;
            }
        } else {
            dateilObj.value = null;
            loading.value = false;
        }
    });
};

// 处理标签
const tagObjs = computed(() => {
    let tag = relInfoCodeGroupConfigs.value?.find(it => toLower(it.groupCode) === 'equipstatus' || toLower(it.groupCode) === 'spacestatus');
    if (tag?.relInfoCodeConfigs?.length) {
        let tagInfo = {};
        // 转成原有的对象形式，用以处理每个标签的数据
        tag.relInfoCodeConfigs.forEach(it => {
            tagInfo[it.infoCode] = it.dataValue;
        });
        const onlineStatusEnumTag = onlineStatusEnum[tagInfo.onlineStatus];
        const runStatusTag = runStatusEnum[tagInfo.runStatus];
        return [onlineStatusEnumTag, runStatusTag].filter(Boolean);
    }
    return [];
});

defineExpose({
    hideTipsNow
});
</script>

<style lang="less" scoped>
.tips-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--gray-200);
    gap: 8px;
    padding-bottom: 8px;
    .header-name {
        font-size: 14px;
        color: var(--gray-900);
    }
}
.title-tag {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;

    .info-tag {
        margin-left: 0px !important;
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
    width: 250px;
    padding: 10px 10px 0px;
    z-index: 999 !important;
    transform: translate(-50%, -100%);
}

.font {
    color: #626c78;
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
        padding: 12px 16px;
        overflow-y: hidden;
        max-height: 400px;

        .f {
            display: flex;
            align-items: center;
        }

        .content:hover {
            color: #1b4acc;
            cursor: pointer;
        }

        .track-warp {
            margin-top: 8px;
        }
    }
}
</style>
