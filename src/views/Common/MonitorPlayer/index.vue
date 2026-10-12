<template>
    <DragBox :disabled="disableDrag" :z-index="showTips ? 4000 : 9999">
        <div :id="videoElementId">
            <div ref="dragBoxContainerRef" :class="['drag-box-container']">
                <div class="isFull-screen-box-title fcb" :class="[isFullScreen ? 'fs' : '']">
                    <div v-ellipsis class="m-ellipsis mr8 fb7" :style="{ maxWidth: isFullScreen ? '' : '477px' }">{{ selectObj?.localName ?? '--' }}</div>
                    <div
                        class="tip-warp"
                        @click.stop="
                            () => {
                                showTips = !showTips;
                            }
                        "
                    >
                        <ErrorTips></ErrorTips>
                        <div class="tip">
                            <span>{{ i18n.global.t('meos_control_web.video_load_fail_check_note') }}</span>
                        </div>
                    </div>
                    <div class="fc">
                        <span v-if="isRecording" class="record-tip">{{ i18n.global.t('meos_control_web.close_small_screen_stop_record_auto_save') }}</span>
                        <div class="fc box-header-close" @click="handleSize">
                            <VideoFullsceen v-if="!isFullScreen" />
                            <VideoExFullscreen v-else></VideoExFullscreen>
                        </div>
                        <div class="get-line ml8 mr8"></div>
                        <div class="fc box-header-close" @click="closeVideo">
                            <VideoClose />
                        </div>
                    </div>
                </div>
                <div class="f wh100">
                    <div class="box-item" :class="[isFullScreen ? 'fs' : '']" :style="{ height: isFullScreen ? '100%' : '318px' }">
                        <!-- <div v-if="!isFullScreen" class="box-title fcb">
                            <div v-ellipsis class="m-ellipsis mr8">{{ selectObj?.localName ?? '--' }}</div>
                            <div class="fc box-header-close" @click="closeVideo">
                                <IconMeriActionClose />
                            </div>
                        </div> -->
                        <div class="box-content">
                            <div class="tabs-item">
                                <m-tabs v-model="chooseModel" :data="tabList" type="segment" size="small" @change="chooseModelChange"></m-tabs>
                            </div>
                            <div class="tab-realtime mt8">
                                <div class="action-content" :class="[isFullScreen ? 'full-screen' : 'small-screen']">
                                    <div v-if="isRecording" class="recording">
                                        <Recording></Recording>
                                        <span>{{ i18n.global.t('meos_control_web.video_recording_in_progress') }}</span>
                                        <m-button type="primary" size="small" @click="record">{{ i18n.global.t('meos_control_web.recording_completed') }}</m-button>
                                    </div>
                                    <template v-if="protocol === 'wss'">
                                        <m-tips
                                            :disabled="isFullScreen"
                                            :content="i18n.global.t('meos_control_web.auto_fullscreen_when_recording')"
                                            theme="darkTransparent"
                                            placement="top"
                                            trigger="hover"
                                            :z-index="Z_INDEX.selectDropdown"
                                        >
                                            <div class="action" :class="isRecording ? 'running' : ''" @click="recordAction">
                                                <Record></Record>
                                                <div class="f12">{{ i18n.global.t('meos_control_web.screen_record') }}</div>
                                            </div>
                                        </m-tips>
                                        <m-tips
                                            :disabled="isFullScreen"
                                            :content="i18n.global.t('meos_control_web.auto_fullscreen_when_screenshot')"
                                            theme="darkTransparent"
                                            placement="top"
                                            trigger="hover"
                                            :z-index="Z_INDEX.selectDropdown"
                                        >
                                            <div class="action" @click="screenshoot">
                                                <Screenshoot></Screenshoot>
                                                <div class="f12">{{ i18n.global.t('meos_control_web.screenshot') }}</div>
                                            </div>
                                        </m-tips>
                                        <!-- 暂时隐藏收音能力 -->
                                        <div v-if="selectObj?.isLiveRecord === '1'" class="action" @click="switchSound(!openSound)">
                                            <OpenSound v-if="openSound"></OpenSound>
                                            <CloseSound v-else></CloseSound>
                                            <div class="f12">{{ i18n.global.t('meos_control_web.sound') }}</div>
                                        </div>
                                        <template v-if="chooseModel === VIDEO_TYPE.PLAY_BACK">
                                            <m-select v-model="speedValue" :z-index="Z_INDEX.selectDropdown" size="auto" :noborder="true" :options="speeds">
                                                <template #trigger>
                                                    <div class="action">
                                                        <div class="f12">{{ speedValue + 'X' }}</div>
                                                        <div class="f12">{{ i18n.global.t('meos_control_web.playback_speed') }}</div>
                                                    </div>
                                                </template>
                                            </m-select>
                                            <div
                                                class="action"
                                                :class="pauseExcuting ? 'running pause-excuting' : ''"
                                                :style="{ width: isFullScreen ? '186px' : '140px' }"
                                                @click="switchPause(!pause)"
                                            >
                                                <Pause v-if="!pause"></Pause>
                                                <Resume v-else></Resume>
                                                <div v-if="pauseExcuting" class="f12">{{ i18n.global.t('meos_control_web.executing') }}</div>
                                                <div v-else class="f12">{{ pause ? i18n.global.t('meos_control_web.play') : i18n.global.t('meos_control_web.pause') }}</div>
                                            </div>
                                        </template>
                                    </template>
                                    <template
                                        v-if="
                                            (chooseModel === VIDEO_TYPE.REAL_TIME && (selectObj?.isControl === '1' || selectObj?.isZoomable === '1')) ||
                                            selectObj?.cameraIsControl === '1'
                                        "
                                    >
                                        <div v-if="selectObj?.isControl === '1'" class="angle">
                                            <div class="f12">{{ i18n.global.t('meos_control_web.camera_angle') }}</div>
                                            <div class="fc grid-container mt20">
                                                <template v-for="(item, index) in arr" :key="index">
                                                    <div
                                                        :class="[item.count === 100 ? '' : 'arrow', 'fcc', 'cp', itemIndex === index ? 'mouseDown' : '']"
                                                        @mousedown="doControl(item.name, 0, index)"
                                                        @mouseup="doControl(item.name, 1, index)"
                                                    >
                                                        <div
                                                            v-if="item.count != 100"
                                                            class="wh100 mark-icon-box fcc"
                                                            :style="{
                                                                transform: ` rotate(${item.count * 45}deg)`
                                                            }"
                                                        >
                                                            <SvgIcon name="arrow" />
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                        <div v-if="selectObj?.isZoomable === '1'" class="focus-distance">
                                            <div class="f12">{{ i18n.global.t('meos_control_web.focal_length_adjustment') }}</div>
                                            <div class="mt20 mb20 fullScreen-focus-distance">
                                                <div
                                                    :class="[isFullScreen ? 'fullScreen-focus-add' : '', 'add', 'fcc', 'cp']"
                                                    @mousedown="doControl('ZOOM_IN', 0)"
                                                    @mouseup="doControl('ZOOM_IN', 1)"
                                                >
                                                    <SvgIcon name="add" />
                                                </div>
                                                <div
                                                    :class="[isFullScreen ? 'fullScreen-focus-reduce' : 'mt10', 'reduce', 'fcc', 'cp']"
                                                    @mousedown="doControl('ZOOM_OUT', 0)"
                                                    @mouseup="doControl('ZOOM_OUT', 1)"
                                                >
                                                    <SvgIcon name="reduce" />
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="chooseModel === VIDEO_TYPE.PLAY_BACK">
                                        <TimeInput ref="timeInputRef" @confirm="timeConfirm"></TimeInput>
                                    </template>
                                </div>
                                <div class="empty">
                                    <div class="fcc wh100">
                                        <div :style="{ display: 'block', color: '#626c78' }">{{ i18n.global.t('meos_control_web.no_controllable') }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div :class="[isFullScreen ? 'wh80' : 'monitor-player-warp']">
                        <template v-if="!showTips">
                            <div v-if="selectObj && offlineStatus && chooseModel === VIDEO_TYPE.REAL_TIME" class="monitor-player-offline">
                                {{ i18n.global.t('meos_control_web.camera_offline') }}
                            </div>
                            <MonitorVideo
                                v-else-if="(!offlineStatus || chooseModel === VIDEO_TYPE.PLAY_BACK) && !refreshing"
                                ref="monitorVideoRef"
                                :video-type="chooseModel"
                                :begin-time="beginTime"
                                :end-time="endTime"
                                :select-obj="selectObj"
                                :video-element-id="videoElementId"
                                @success-play="successPlay"
                                @stream-end="streamEnd"
                                @fail-play="failPlay"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </DragBox>
    <VideoError v-model:show="showTips"></VideoError>
</template>
<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import { shallowRef } from 'vue';
import DragBox from './DragBox/index.vue';
import MonitorVideo from './MonitorVideo/index.vue';
import VideoClose from '@/assets/svg/video/video-close.svg';
import ErrorTips from '@/assets/svg/video/error-tips.svg';
import VideoFullsceen from '@/assets/svg/video/video-fullsceen.svg';
import VideoExFullscreen from '@/assets/svg/video/video-exFullscreen.svg';
import CloseSound from '@/assets/svg/video/closeSound.svg';
import OpenSound from '@/assets/svg/video/openSound.svg';
import Generating from '@/assets/svg/video/generating.svg';
import Recording from '@/assets/svg/video/recording.svg';
import Resume from '@/assets/svg/video/resume.svg';
import Pause from '@/assets/svg/video/pause.svg';
import Record from '@/assets/svg/video/record.svg';
import Screenshoot from '@/assets/svg/video/screenshoot.svg';
import { DATE_FORMAT } from './constances';
import { VIDEO_TYPE } from 'yushu-component-web';
import dayjs from 'dayjs';
import { computed } from 'vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { uuid } from 'yushu-js-utils';
import { getPlayerEnv } from './loadPlayerEnv';
// 监控视频控制防抖，等待时间间隔(单位：毫秒)
import { MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT } from '@/config';
import * as _ from 'lodash';
import useFullscreen from './MonitorVideo/hooks/useFullScreen';
import TimeInput from './TimeInput.vue';
import VideoError from '../MutiplePlayer/VideoError.vue';
import { getDayjsTz } from '@/utils/globalVariables';

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => null
    },
    offlineStatus: {
        type: Boolean,
        default: false
    }
});

const arr = ref([
    { name: 'LEFT_UP', count: 0 },
    { name: 'UP', count: 1 },
    { name: 'RIGHT_UP', count: 2 },
    { name: 'LEFT', count: 7 },
    { name: '', count: 100 },
    { name: 'RIGHT', count: 3 },
    { name: 'LEFT_DOWN', count: 6 },
    { name: 'DOWN', count: 5 },
    { name: 'RIGHT_DOWN', count: 4 }
]);

const isFullScreen = ref(false);
const refreshing = ref(false);
const monitorVideoRef = ref();
const monitorVideoInstance = shallowRef();
watch(
    () => props.selectObj,
    () => {
        refreshing.value = true;
        chooseModel.value = VIDEO_TYPE.REAL_TIME;
        date.value = '';
        nextTick(() => {
            refreshing.value = false;
        });
    }
);
const videoElementId = `video_element_${uuid(5)}`;
const emits = defineEmits(['close']);
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
const chooseModel = ref(VIDEO_TYPE.REAL_TIME);
const dateScope = `${getDayjsTz().subtract(90, 'day').format('YYYY.MM.DD')}-${getDayjsTz().format('YYYY.MM.DD')}`;

const date = ref('');
const itemIndex = ref(-1);

let _cmd = '',
    _action = '1';
// 摄像头控制防抖
const doControlDebounce = _.debounce(
    () => {
        if (monitorVideoRef.value?.monitorVideoOptControl?.controlCamera) {
            monitorVideoRef.value?.monitorVideoOptControl?.controlCamera({ command: _cmd, action: _action });
        }
    },
    MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT || 450,
    {
        leading: true,
        trailing: true
    }
);

const doControl = (cmd, action, type) => {
    // console.log('item, cmd, type: ', action, cmd, type);
    // return;
    // if (!action) {
    //     return;
    // }
    if (_cmd !== null && _cmd !== cmd) {
        // 若切换不同命令，取消之前的防抖调用
        doControlDebounce.cancel();
    }
    _action = action;
    _cmd = cmd;
    // 调用防抖
    doControlDebounce();
    if (type) {
        itemIndex.value = type;
    }
    if (action === 1) {
        itemIndex.value = -1;
    }
};

// const beginTime = computed(() => {
//     return date.value ? dayjs(new Date(date.value)).hour(0).minute(0).second(0).format(DATE_FORMAT) : '';
// });

// const endTime = computed(() => {
//     if (!date.value) return '';
//     const _t = dayjs(new Date(date.value)).add(1, 'day').hour(0).minute(0).second(0);
//     if (_t.unix() > getDayjsTz().unix()) return dayjs(new Date()).format(DATE_FORMAT);
//     return _t.format(DATE_FORMAT);
// });

const protocol = computed(() => {
    const env = getPlayerEnv();
    return env?.realTimeStreamProtocol || props.selectObj?.realTimeStreamProtocol;
});

// 可以拖拽
const disableDrag = computed(() => {
    return (protocol.value && protocol.value === 'hikrtsp') || isFullScreen.value;
});

const beginTime = ref('');

const endTime = ref('');

const timeConfirm = (s, e) => {
    console.log('s, e :>> ', s, e);
    beginTime.value = s;
    endTime.value = e;

    if (isRecording.value) {
        record();
    }
};

const timeInputRef = ref();

const chooseModelChange = async tab => {
    if (isRecording.value) {
        await record();
    }
    openSound.value = false;
    speedValue.value = 1;
    pause.value = false;
    if (tab.id === VIDEO_TYPE.PLAY_BACK) {
        nextTick(() => {
            timeInputRef.value?.confirm();
        });
    } else {
        nextTick(() => {
            beginTime.value = '';
            endTime.value = '';
        });
    }
};

const dragBoxContainerRef = ref();
const closeVideo = async () => {
    if (isRecording.value) {
        await record();
    }
    emits('close');
};

const showTips = ref(false);

watch(showTips, () => {
    if (showTips.value) {
        // wss销毁视频组件时，会自动停止录制
        isRecording.value = false;
    } else {
        //初始化
    }
});

// MARK:操作-录制
const isRecording = ref(false);
const recordAction = async () => {
    if (!isRecording.value) {
        await record();
    }
};

const timerPromise = () =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });

const record = async () => {
    if (!monitorVideoInstance.value?.instance) return;
    if (isRecording.value) {
        return monitorVideoInstance.value?.instance
            .recordClipEnd(0)
            .then(() => {
                isRecording.value = false;
            })
            .catch(err => {
                console.log('err :>> ', err);
            });
    } else {
        if (!isFullScreen.value) {
            await handleFullscreen();
            await timerPromise();
        }
        return monitorVideoInstance.value?.instance
            .recordClipStart(0, 5, record)
            .then(() => {
                isRecording.value = true;
            })
            .catch(err => {
                console.log('err :>> ', err);
            });
    }
};
const handleSize = async () => {
    if (isRecording.value) {
        await record();
    }
    await handleFullscreen();
};

// MARK:操作-截屏
const screenshoot = async () => {
    if (!isFullScreen.value) {
        await handleFullscreen();
    }

    await nextTick();
    if (!monitorVideoInstance.value?.instance) return;
    return monitorVideoInstance.value?.instance.screenshot(0);
};

// MARK:操作-声音
const openSound = ref(false);

const switchSound = async open => {
    if (!monitorVideoInstance.value?.instance) return;
    let action = open ? monitorVideoInstance.value?.instance.openSound(0) : monitorVideoInstance.value?.instance.closeSound(0);
    if (action) {
        return action.then(() => {
            openSound.value = open;
        });
    }
    return;
};

// MARK:操作-倍速
const speedValue = ref(1);

const speeds = ref([
    // { id: 0.125, name: '0.125X' },
    // { id: 0.25, name: '0.25X' },
    // { id: 0.5, name: '0.5X' },
    { id: 1, name: '1X' },
    { id: 2, name: '2X' },
    { id: 4, name: '4X' }
    // { id: 8, name: '8X' }
]);

watch(speedValue, () => {
    if (!monitorVideoInstance.value?.instance) return;
    monitorVideoInstance.value?.instance.playbackSpeed(0, speedValue.value);
});

// MARK:操作-暂停/播放

// 暂停
const pause = ref(false);
const pauseExcuting = ref(false);

const switchPause = async pau => {
    if (!monitorVideoInstance.value?.instance) return;
    pauseExcuting.value = true;
    let action = pau ? monitorVideoInstance.value?.instance.pause(0) : monitorVideoInstance.value?.instance.resume(0);
    return action
        .then(() => {
            pause.value = pau;
        })
        .finally(() => {
            pauseExcuting.value = false;
        });
};
// MARK:操作-其他

const successPlay = () => {
    switchSound(openSound.value);
    speedValue.value = 1;
    switchPause(false);
};

const failPlay = () => {
    console.log('failPlay :>> ');
    if (isRecording.value) {
        record();
    }
};

const streamEnd = () => {
    console.log('streamEnd :>> ');
};

const { handleFullscreen } = useFullscreen(videoElementId, monitorVideoInstance, isFullScreen);

provide('isFullScreen', isFullScreen);
provide('monitorVideoInstance', monitorVideoInstance);
</script>
<style lang="less">
.drag-box-container {
    // display: flex;
    width: 100%;
    height: 100%;

    .box-item {
        width: 236px;
        background-color: #fff;

        .tab-realtime {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow-y: auto;
            scrollbar-width: none; /* 隐藏滚动条 */
            -ms-overflow-style: none; /* 对于IE和Edge */
        }

        .box-title {
            padding: 8px 12px;
            border-bottom: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
        .box-content {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 12px 12px 0px 12px;

            .action-content {
                display: flex;
                column-gap: 4px;
                flex-wrap: wrap;
                row-gap: 4px;
                padding-bottom: 12px;
                &:empty {
                    display: none;
                    // 选中相邻兄弟组件
                    & + .empty {
                        display: block;
                    }
                }
            }
            .empty {
                display: none;
                height: 100%;
                width: 100%;
            }
            .recording {
                margin: 4px 0 8px 0;
                width: 100%;
                display: flex;
                padding: 9px 8px;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                border-radius: 4px;
                height: 46px;
                background: var(--blue-100, #d9ebff);

                span {
                    flex: 1;
                }
            }
            .action {
                height: 42px;
                border-radius: 4px;
                background: var(--gray-100, #f1f4f6);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                &:hover {
                    cursor: pointer;
                    background: var(--gray-200, #e8ecf0);
                }

                &.running {
                    cursor: not-allowed;
                    background: var(--gray-200, #e8ecf0);
                    color: var(--gray-500, #8b949e);

                    svg {
                        path:nth-child(2) {
                            fill: #c4c9cf;
                        }
                    }
                }

                &.pause-excuting {
                    pointer-events: none;
                    svg {
                        rect {
                            fill: #c4c9cf;
                        }
                    }
                }
            }
            .angle,
            .focus-distance {
                border-radius: 4px;
                background: var(--gray-100, #f1f4f6);
                padding: 4px 12px;
                width: 48%;
                .add,
                .reduce {
                    border-radius: 4px;
                    background: var(--gray-300, #e1e5eb);
                    padding: 8px;
                }
                // .add:hover {
                //     background: rgba(196, 201, 207, 0.6);
                //     color: red;
                // }
                // .reduce:hover {
                //     background: rgba(196, 201, 207, 0.6);
                // }
            }
        }

        &.fs {
            width: 306px;
        }
    }
    .box-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding: 12px;
        &-select {
            display: flex;
            gap: 4px;
            flex: 1;
            justify-content: space-between;
        }
        &-close {
            border-radius: 2px;
            cursor: pointer;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px;
            &:hover {
                background-color: var(--gray-200);
            }
        }
    }

    .monitor-player-warp {
        overflow: hidden;
        width: 512px;
        height: 318px;
        background-color: var(--gray-900);
        .monitor-player-offline {
            width: 100%;
            height: 100%;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .arrow {
        border-radius: 2px;
        background: var(--gray-300, #e1e5eb);
        padding: 2px;
        width: 24px;
        height: 24px;
    }
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 4px; /* 格子间隔 */
    }
    .arrow:nth-child(5) {
        background-color: transparent;
    }
    // .arrow:hover {
    //     background: rgba(196, 201, 207, 0.6);
    // }
    .mouseDown:hover {
        background: #d9ebff;
    }
    .disabled-cursor {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .mouseDown {
        .my-path {
            fill: #246fe5;
        }
    }
}
.small-screen {
    .action {
        width: 68px;
    }
}
.full-screen {
    .action {
        width: 91px;
    }
    .angle,
    .focus-distance {
        width: 100% !important;
    }
    .focus-distance {
        // margin-top: 8px;
    }
    .grid-container {
        width: 158px;
        margin: 20px auto 24px;
        .arrow {
            width: 44px;
            height: 44px;
        }
    }
    .fullScreen-focus-distance {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        .fullScreen-focus-add,
        .fullScreen-focus-reduce {
            width: 50%;
        }
    }
}
.isFull-screen-box-title {
    width: 100%;
    border-bottom: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    background: #fff;
    padding: 8px 12px;

    .tip-warp {
        margin-right: auto;
        display: flex;
        align-items: center;
        .tip {
            margin-left: 4px;
            span {
                color: var(--blue-500, #246fe5);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 32px;
            }
        }
        &:hover {
            cursor: pointer;
        }
    }

    .record-tip {
        color: #1b2129;
        margin-right: 8px;
    }

    .get-line {
        width: 1px;
        height: 14px;
        background: @grey-400;
    }

    &.fs {
        padding: 12px;
    }
}
.wh100 {
    width: 100%;
    height: 100%;
}
.wh80 {
    width: calc(100% - 306px);
    height: calc(100% - 49px);
    background-color: var(--gray-900);
}
</style>
