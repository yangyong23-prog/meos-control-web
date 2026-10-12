<template>
    <div ref="videoRef" :class="['monitor-video-container', videoElementId]">
        <div v-if="videoIsError" class="monitor-video-error">
            <div class="monitor-video-error-text">{{ i18n.global.t('meos_control_web.video_unavailable') }}</div>
            <m-button :loading="refreshLoading" :width="64" type="text" @click="onRefresh">{{ i18n.global.t('meos_control_web.refresh') }}</m-button>
        </div>
        <video v-else-if="realTimeStreamProtocol() === 'hls'" :id="videoId" class="monitor-video" muted autoplay></video>
        <div v-else :id="videoId" class="monitor-video" />
        <div v-if="!videoIsError && false" :class="['monitor-video-toolbar', { fullscreen: isFullScreen }]">
            <div v-if="!isRealTime && !isDHRTSP()" class="monitor-video-toolbar-box">
                <div class="monitor-video-toolbar-item" @click.stop="onPlayPause">
                    <IconMeriActionSuspend v-if="isPlaying" :size="12" color="white" />
                    <IconMeriActionStart v-else :size="12" color="white" />
                </div>
            </div>
            <div v-if="!isRealTime && !isDHRTSP()" class="monitor-video-toolbar-progress">
                <div ref="progressBarRef" class="monitor-video-toolbar-progress-item" @click="onClickProgress">
                    <div :style="progressInnerStyle" class="monitor-video-toolbar-progress-item__inner" />
                </div>
                <div
                    :style="progressCircleStyle"
                    :class="['monitor-video-toolbar-progress-circle', { dragging: isDragging, fullscreen: isFullScreen }]"
                    @mousedown="onProgressBarMouseDown"
                />
                <div
                    :style="{
                        left: progressInnerStyle.width
                    }"
                    :class="['monitor-video-toolbar-progress-time', { dragging: isDragging, fullscreen: isFullScreen }]"
                >
                    <span>{{ currentTimeText }}</span>
                    <span>/</span>
                    <span>{{ durationText }}</span>
                </div>
            </div>
            <div class="monitor-video-toolbar-box">
                <div class="monitor-video-toolbar-item" @click="onChangeSound">
                    <CloseSound v-if="openSound" />
                    <OpenSound v-else />
                </div>
                <div class="monitor-video-toolbar-item" @click="handleFullscreen">
                    <CloseFullscreen v-if="isFullScreen" />
                    <Fullscreen v-else />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { IconMeriActionStart, IconMeriActionSuspend } from 'meri-icon';
import { DATE_FORMAT } from '../constances';
import { emptyValue } from './utils';
import CloseSound from '@/assets/svg/video/close-sound.svg';
import OpenSound from '@/assets/svg/video/open-sound.svg';
import Fullscreen from '@/assets/svg/video/fullscreen.svg';
import CloseFullscreen from '@/assets/svg/video/close-fullscreen.svg';
import { VIDEO_PROTOCOL, VIDEO_TYPE } from 'yushu-component-web';
import dayjs from 'dayjs';

import { getPlayerEnv } from '../loadPlayerEnv';

// import Speed from './components/Speed/index.vue';
import useLoading from '@/hooks/useLoading';
import useFullScreen from './hooks/useFullScreen';
import useVideo from './hooks/useVideo';
import useProgress from './hooks/useProgress';

import { urlContain } from '@/utils';

const packageName = urlContain('meos-autocontrol-web-edge') ? 'meos-autocontrol-web-edge' : 'meos-control-web';

const props = defineProps({
    // 视频类型
    videoType: {
        type: String,
        default: VIDEO_TYPE.PLAY_BACK
    },
    // 监控ID
    selectObj: {
        type: Object,
        default: null
    },
    // 查看回放视频,时间段开始时间
    beginTime: {
        type: String,
        default: null
    },
    // 查看回放视频,时间段结束时间
    endTime: {
        type: String,
        default: null
    },
    // 是否默认开启声音
    autoOpenSound: {
        type: Boolean,
        default: false
    },
    // 是否默认初始化
    autoPlay: {
        type: Boolean,
        default: true
    },
    videoElementId: {
        type: String,
        default: ''
    }
});

const isFullScreen = inject('isFullScreen');

const emits = defineEmits(['move', 'moveEnd', 'successPlay', 'streamEnd', 'failPlay']);

// 刷新按钮Loading
const refreshLoading = ref(false);

const getObjectId = () => {
    return props.selectObj?.id;
};
const monitorVideoInstance = inject('monitorVideoInstance');

// Loading
const { openLoading, closeLoading } = useLoading(
    unref(props).videoElementId,
    '#2E3742',
    'circle',
    {
        width: '200px',
        height: '200px'
    },
    0
);

// 视频操作 hooks
const {
    videoRef,
    videoId,
    videoIsError,
    isPlaying,
    isRealTime,
    duration,
    durationText,
    speed,
    openSound,
    monitorVideoOptControl,
    onChangeSpeed,
    onPlayOrPause,
    onChangeSound,
    onSeekTo,
    initVideoInstance,
    loadVideo
} = useVideo(props, openLoading, closeLoading);

// 全屏操作相关hooks
const { handleFullscreen } = useFullScreen(unref(props).videoElementId, monitorVideoInstance);

const {
    isDragging,
    progressInnerStyle,
    progressCircleStyle,
    progressBarRef,
    currentTimeText,
    resetProgress,
    onProgressBarMouseDown,
    onClickProgress,
    startLoopCurrentTime,
    clearLoopCurrentTime
} = useProgress({
    duration,
    props,
    speed,
    onSeekTo,
    emits
});

// 清空视频相关数据
const resetVideoInfo = () => {
    // TODO
    monitorVideoInstance.value?.pause();
};

const isDHRTSP = () => {
    const env = getPlayerEnv();
    const str = env?.manufacturer || props.selectObj?.manufacturer || '';
    return str.indexOf('大华') !== -1;
};
const jsPluginPathMap = {
    [VIDEO_PROTOCOL.DHRTSP]: {
        jsPluginPath: `/${packageName}/dahua-rtsp-sdk/scripts/videoPlayer.js`
    }
};
const agreementMap = {
    hls: VIDEO_PROTOCOL.HLS,
    rtsp: VIDEO_PROTOCOL.DHRTSP,
    hikrtsp: VIDEO_PROTOCOL.HIKRTSP,
    wss: VIDEO_PROTOCOL.HIK
};

const realTimeStreamProtocol = () => {
    const env = getPlayerEnv();
    return env?.realTimeStreamProtocol || props.selectObj?.realTimeStreamProtocol;
};

const agreementType = () => {
    const env = getPlayerEnv();
    const str = env?.manufacturer || props.selectObj?.manufacturer || '';
    const str1 = env?.realTimeStreamProtocol || props.selectObj?.realTimeStreamProtocol;
    if (agreementMap[str1]) {
        return agreementMap[str1];
    } else {
        if (str.indexOf('大华') !== -1) {
            return VIDEO_PROTOCOL.DHRTSP;
        } else {
            return VIDEO_PROTOCOL.HIK;
        }
    }
};
const toLoadVideo = async (showFullScreenLoading = true) => {
    try {
        const objectId = getObjectId();
        const isEmptyObjectId = emptyValue(objectId);

        if (isEmptyObjectId || (!isRealTime.value && (emptyValue(props.beginTime) || emptyValue(props.endTime)))) {
            resetVideoInfo();
            return;
        }
        closeLoading?.();
        showFullScreenLoading && openLoading?.();

        const env = getPlayerEnv();

        const loadOpt = {
            objectId: env?.objectId || objectId,
            protocol: agreementType(),
            jsPluginPath: jsPluginPathMap[VIDEO_PROTOCOL.DHRTSP]?.jsPluginPath,
            videoType: props.videoType
        };
        if (!isRealTime.value) {
            loadOpt.beginTime = dayjs(props.beginTime).format(DATE_FORMAT);
            loadOpt.endTime = dayjs(props.endTime).format(DATE_FORMAT);
        }

        console.log('loadOpt', loadOpt);
        const loadRes = await loadVideo(loadOpt);
        if (!loadRes?.error) {
            videoIsError.value = false;
            await nextTick();
            monitorVideoOptControl.value?.play();
            closeLoading?.();
            videoIsError.value = false;
        } else {
            resetProgress?.();
            closeLoading?.();
            videoIsError.value = true;
        }
    } catch {
        closeLoading?.();
        await nextTick(() => {
            videoIsError.value = true;
            isPlaying.value = false;
        });
    }
};

// 刷新
const onRefresh = async () => {
    try {
        refreshLoading.value = true;
        await toLoadVideo(false);
        refreshLoading.value = false;
    } catch {
        refreshLoading.value = false;
    }
};

const onPlayPause = () => {
    onPlayOrPause?.({
        replayFunc: () => {
            resetProgress?.();
            startLoopCurrentTime?.();
        },
        resumeFunc: () => {
            startLoopCurrentTime?.();
        },
        pauseFunc: () => {
            clearLoopCurrentTime?.();
        }
    });
};

const onSwitchSpeed = async value => {
    await onChangeSpeed?.(value);
    startLoopCurrentTime?.();
};

onMounted(() => {
    initVideoInstance?.({
        StreamEnd() {
            if (!isRealTime.value) clearLoopCurrentTime?.();
            emits('streamEnd');
        },
        successPlay() {
            if (!isRealTime.value) startLoopCurrentTime?.();
            emits('successPlay');
        },
        failPlay() {
            if (!isRealTime.value) startLoopCurrentTime?.();
            emits('failPlay');
        }
    });
    watch(
        () => [props.objectId, props.beginTime, props.endTime],
        () => {
            nextTick(() => {
                clearLoopCurrentTime?.();
                toLoadVideo();
            });
        },
        {
            immediate: true
        }
    );
});

onBeforeUnmount(() => {
    if (typeof monitorVideoInstance.value?.closeVideo === 'function') {
        monitorVideoInstance.value.closeVideo(true);
        console.log('<<<<<<<closeVideo>>>> 成功');
    }

    if (typeof monitorVideoInstance.value?.destroy === 'function') {
        monitorVideoInstance.value.destroy();
        console.log('<<<<<<<destory>>>> 成功');
    }
});

defineExpose({
    monitorVideoOptControl
});
</script>

<style lang="less" scoped>
.monitor-video-container {
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;
    background-color: #000;
    --tool-bar-height: 0px;

    .monitor-video-error {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 0;
        background: var(--gray-800);
        &-text {
            font-size: 12px;
            color: var(--gray-400);
            margin-bottom: 12px;
        }
        :deep(svg) {
            path {
                fill: #fff;
            }
        }
        :deep(.m-button-span-text) {
            color: #fff;
        }
    }

    .monitor-video {
        width: 100%;
        height: calc(100% - var(--tool-bar-height));
    }

    .monitor-video-toolbar {
        width: 100%;
        display: flex;
        height: var(--tool-bar-height);
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding: 0 12px 0 15px;
        background: linear-gradient(180deg, rgb(0 0 0 / 6%) 0%, rgb(53 53 53 / 60%) 100%);
        &-box {
            justify-content: unset;
            align-items: center;
            display: flex;
            gap: 8px;
        }
        &-progress {
            display: flex;
            justify-content: unset;
            align-items: center;
            height: 100%;
            flex: 1;
            cursor: pointer;
            position: relative;
            &:hover {
                .monitor-video-toolbar-progress-item {
                    transform: scaleY(2);
                }
                .monitor-video-toolbar-progress-circle,
                .monitor-video-toolbar-progress-time {
                    display: flex;
                }
            }
            &-item {
                width: 100%;
                height: 2px;
                border-radius: 2px;
                background: rgb(255 255 255 / 30%);
                transition: all 0.3s ease-in-out;
                &__inner {
                    width: 0;
                    height: 100%;
                    background: #fff;
                    border-radius: 2px;
                }
            }
            &-circle {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #fff;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                display: none;
                &.dragging {
                    display: flex;
                }
                &.fullscreen {
                    width: 16px;
                    height: 16px;
                }
            }
            &-time {
                justify-content: unset;
                align-items: center;
                gap: 3px;
                position: absolute;
                left: 0;
                top: -8px;
                display: none;
                transform: translateX(-50%);
                & > span {
                    font-size: 10px;
                    color: rgb(255 255 255 / 30%);
                    font-weight: var(--platform-font-weight);
                    &:first-child {
                        font-size: 10px;
                        color: #fff;
                    }
                }
                &.dragging {
                    display: flex;
                }
                &.fullscreen {
                    font-size: 14px;
                }
            }
        }
        &-item {
            width: 16px;
            height: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 2px;
            cursor: pointer;
            &:hover {
                background: var(--grey-alpha-30, rgb(196 201 207 / 30%));
            }
        }
        &.fullscreen {
            .monitor-video-toolbar-item {
                width: 24px;
                height: 24px;
            }
        }
    }
}
</style>
