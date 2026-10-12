<template>
    <div class="container">
        <div class="header">
            <span class="title">{{ i18n.global.t('meos_control_web.surveillance_video') }}</span>
            <div class="tip-warp">
                <ErrorTips></ErrorTips>
                <div class="tip">
                    <span
                        @click.stop="
                            () => {
                                showTips = !showTips;
                            }
                        "
                        >{{ i18n.global.t('meos_control_web.video_load_fail_check_note') }}</span
                    >
                </div>
            </div>
            <template v-if="!preview">
                <TimeInput v-show="chooseModel === VIDEO_TYPE.PLAY_BACK" ref="timeInput" @confirm="timeConfirm"></TimeInput>
                <div class="layout">
                    <span class="title">{{ i18n.global.t('meos_control_web.layout') }}</span>
                    <m-radio-group v-model="currentSplit">
                        <m-radio v-for="item in layoutOptions" :key="item.label" size="14" :label="item.value">{{ item.label }}</m-radio>
                    </m-radio-group>
                </div>
                <div class="tabs">
                    <m-tabs v-model="chooseModel" :data="tabList" type="segment" size="medium" @change="chooseModelChange"></m-tabs>
                </div>
            </template>
        </div>
        <div class="close" @click.stop="close">
            <CloseVideo class="close-video" style="width: 32px; height: 32px"></CloseVideo>
        </div>
        <div class="player-warp">
            <div v-if="!showTips" id="mutiplePlayer" :style="{ width: '100%', height: '100%' }"></div>
        </div>
        <div v-show="Number(totalPageNumberRef) > 1" class="footer">
            <span class="page-number"
                >{{ i18n.global.t('meos_control_web.page_number') }}{{ i18n.global.t('meos_control_web.page_number') }}{{ currentPageRef }}/{{ totalPageNumberRef }}</span
            >
            <m-button size="large" type="default" :disabled="currentPageRef === '1' || loading" @click="prePage">{{ i18n.global.t('meos_control_web.previous_page') }}</m-button>
            <m-button size="large" type="default" :disabled="currentPageRef === totalPageNumberRef || loading" @click="nextPage">{{
                i18n.global.t('meos_control_web.next_page')
            }}</m-button>
        </div>
    </div>
    <VideoError v-model:show="showTips"></VideoError>
</template>
<script setup>
import i18n from '@/localization';
import { ref, onMounted } from 'vue';
import { MutipleMonitorPlayer, VIDEO_TYPE } from 'yushu-component-web';
import CloseVideo from '@/assets/svg/closeVideo.svg';
import ErrorTips from '@/assets/svg/video/error-tips.svg';
import { urlContain } from '@/utils';
import useStore from '@/store';
import { getPlayerEnv } from '../MonitorPlayer/loadPlayerEnv';
import TimeInput from './TimeInput.vue';
import VideoError from './VideoError.vue';
const packageName = urlContain('meos-autocontrol-web-edge') ? 'meos-autocontrol-web-edge' : 'meos-control-web';

const emit = defineEmits(['close']);

const currentSplit = defineModel('currentSplit', { type: Number });

const props = defineProps({
    objectIds: {
        type: Array,
        default: () => []
    },
    preview: {
        type: Boolean,
        default: false
    },
    playModel: {
        type: VIDEO_TYPE,
        default: VIDEO_TYPE.REAL_TIME
    }
});

let player = null;
const layoutOptions = ref([
    {
        label: '2x2',
        value: 2
    },
    {
        label: '3x3',
        value: 3
    },
    {
        label: '4x4',
        value: 4
    }
]);

const chooseModel = ref(props.playModel);
const tabList = [
    {
        id: VIDEO_TYPE.REAL_TIME,
        name: i18n.global.t('meos_control_web.realtime_video')
    },
    {
        id: VIDEO_TYPE.PLAY_BACK,
        name: i18n.global.t('meos_control_web.historical_video')
    }
];

const playbackDate = ref();

const showTips = ref(false);
const loading = ref(false);
const timeInput = ref();

const init = () => {
    const { base } = useStore();
    const token = base.token || '';
    const { baseUrl, projectId, groupCode, bdtpBaseUrl } = getPlayerEnv();
    //'https://ops.jrzjbsh.cn:9001/dtp-rwd-server',
    const cfg = {
        bdtpBaseUrl,
        baseUrl,
        groupCode,
        projectId,
        hikSzBasePath: `/${packageName}/video-sdk`,
        callbacks: {
            onRealTimeSuccess: () => {
                console.log('onRealTimeSuccess: ');
            },
            // 回放视频播放成功
            onPlaybackSuccess: () => {
                console.log('onPlaybackSuccess: ');
            },
            // 实时视频播放失败
            onRealTimeFail: () => {
                console.log('onRealTimeFail: ');
            },
            // 回放视频播放失败
            onPlaybackFail: () => {
                console.log('onPlaybackFail: ');
            },
            // 视频播放完成
            onPlayFinished: () => {
                console.log('onPlayFinished: ');
            },
            // 插件加载失败
            pluginErrorHandler: () => {
                console.log('pluginErrorHandler: ');
            },
            // 视窗选中回调
            onEventSelect: index => {
                console.log('windowEventSelect: ', index);
            }
        }
    };
    player = new MutipleMonitorPlayer(cfg);
    const opt = {
        token,
        objectIds: props.objectIds,
        hikSzBasePath: `/${packageName}/video-sdk`,
        autoLoadPlugin: true,
        autoPlay: true,
        autoInit: true,
        autoOpenSound: false,
        videoType: chooseModel.value,
        // 需要挂载的video element 必填
        mountElement: 'mutiplePlayer',
        // 最大分屏数（目前支持HIK WSS）
        maxSplit: 4,
        // 当前分屏数（目前支持HIK WSS）
        currentSplit: currentSplit.value,

        //是否支持双击全屏，默认true（目前支持HIK WSS）
        supporDoubleClickFull: true,

        //选中边框颜色（目前支持HIK WSS）
        borderSelectColor: ''
    };
    player.setOption(opt);

    chooseModelChange();
};

const destroy = () => {
    player?.destroy();
    player = null;
};

const chooseModelChange = () => {
    if (chooseModel.value === VIDEO_TYPE.PLAY_BACK && !playbackDate.value) {
        timeInput.value?.confirm();
    }
};

watch(
    [() => props.objectIds, currentSplit, chooseModel, playbackDate, showTips],
    async () => {
        console.log('监听 :>> ', props.objectIds, currentSplit.value);
        if (!showTips.value) {
            if (!player) init();
            loading.value = true;
            player.setOption({
                objectIds: props.objectIds,
                videoType: chooseModel.value
            });
            if (playbackDate.value) {
                player.setOption({
                    beginTime: playbackDate.value.s,
                    endTime: playbackDate.value.e
                });
            }
            await player.arrangeWindow(currentSplit.value);
            player.load().then(_loadHandler);
        } else {
            destroy();
        }
    },
    {
        immediate: true
    }
);

onMounted(() => {
    init();
});

onUnmounted(() => {
    destroy();
});

const close = () => {
    destroy();
    emit('close');
};

const nextPage = () => {
    loading.value = true;
    player.nextPage().then(_loadHandler);
};

const prePage = () => {
    loading.value = true;
    player.prePage().then(_loadHandler);
};

const timeConfirm = (s, e) => {
    playbackDate.value = { s, e };
};

const currentPageRef = ref('1');
const totalPageNumberRef = ref('1');

const _loadHandler = res => {
    loading.value = false;
    const { resultCode, currentPage, totalPageNumber } = res;
    currentPageRef.value = `${currentPage + 1}`;
    totalPageNumberRef.value = `${totalPageNumber}`;
    console.log('_loadHandler res :>> ', resultCode, res);
};
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    aspect-ratio: 1.93;
    display: flex;
    flex-direction: column;
    position: relative;
    .header {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        column-gap: 12px;
        row-gap: 8px;

        // height: 32px;
        padding-right: 44px;
        .title {
            color: var(--gray-800, #2e3742);
            font-size: 24px;
            font-weight: 700;
            line-height: 32px;
        }
        .tip-warp {
            flex: auto;
            display: flex;
            align-items: center;
            .tip {
                margin-left: 4px;
                flex: auto;
                span {
                    color: var(--blue-500, #246fe5);
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 32px;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
        .layout {
            border-radius: 4px;
            background: #ffffff;
            display: flex;
            align-items: center;
            padding: 5px 12px;
            span {
                color: var(--gray-600, #626c78);
                font-feature-settings: 'liga' off, 'clig' off;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
            }
        }
        .tabs {
        }
    }
    .close {
        position: absolute;
        top: 0;
        right: 0;
        &:hover {
            cursor: pointer;
            :deep(svg) {
                circle {
                    stroke: #246fe5;
                }
                path {
                    fill: #246fe5;
                }
            }
        }
    }
    .player-warp {
        margin: 8px 0 12px;
        width: 100%;
        height: 100%;

        // aspect-ratio: 1.775;
        background-color: black;
    }
    .footer {
        display: flex;
        width: 100%;
        height: 42px;
        justify-content: flex-end;
        align-items: center;
        column-gap: 11px;
        .page-number {
            color: var(--gray-900, #1b2129);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }
    }
}
</style>
