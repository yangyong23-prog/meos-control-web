<template>
    <div class="player-controls-warp">
        <div class="playing-icon" :class="{ disabled: sceneLoading || playbackLoading }" @click="tooglePlay">
            <PlayPause v-if="isPlayerPaused" />
            <PlayBegin v-else />
        </div>
        <div ref="progressDomRef" class="progress-warp" @mouseup="endDrag" @mouseleave="endDrag" @mousemove="changePlayingTime" @click="clickTo">
            <div class="progress-bg" @mouseleave="mouseleaveProgress" @mousemove="hoverTips">
                <div class="progress-finished" :style="{ width: `${leftPercentage}%` }"></div>
                <div class="progress-bar" :style="{ left: `${leftPercentage}%` }" @mousedown="startDrag"></div>
            </div>
            <div v-if="tipsText" class="time-tips" :style="{ left: `${tipsLeft}%` }">
                {{ tipsText }}
                <div class="tip-mark-pointer"></div>
            </div>
        </div>

        <div class="progress-text">
            <span class="played-time">{{ minuitFormat(playedMinute + startMinuits) }} </span><span class="all-time"> / {{ minuitFormat(allplayMinute + startMinuits) }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import PlayPause from '@/assets/svg/play-pause.svg';
import PlayBegin from '@/assets/svg/play-begin.svg';
import {
    isPlayerPausedInjectKey,
    selectedDateInjectKey,
    currentPlayingTimeInjectKey,
    selectedTimeInjectKey,
    playbackLoadingInjectKey,
    sceneLoadingInjectKey
} from '../../constant/injectKey';

const selectedDate = inject(selectedDateInjectKey);
const selectedTime = inject(selectedTimeInjectKey);
const currentPlayingTime = inject(currentPlayingTimeInjectKey);

const isPlayerPaused = inject(isPlayerPausedInjectKey);
const playbackLoading = inject(playbackLoadingInjectKey);
const sceneLoading = inject(sceneLoadingInjectKey);

const allplayMinute = ref(0);
const playedMinute = ref(0);
const leftPercentage = ref(0);
const progressDomRef = ref();
const startMinuits = ref(0);

const getMinuits = time => {
    const [hour, min] = time.split(':');
    return Number(hour) * 60 + Number(min);
};

const minuitFormat = minuite => {
    let showMinute = minuite > 0 ? minuite : 0;
    showMinute = showMinute - (showMinute % 15);
    const hour = ('0' + Math.floor(showMinute / 60)).slice(-2);
    const min = ('0' + Math.floor(showMinute % 60)).slice(-2);
    return `${hour}:${min}`;
};

const updateMinuteByPercentage = percentage => {
    playedMinute.value = Math.floor((percentage / 100) * allplayMinute.value);
};

const updatePercentageByMinute = minute => {
    leftPercentage.value = (minute / allplayMinute.value) * 100;
};

let dragging = false,
    lastX = null,
    progressLen = null,
    leftLen = null,
    allDxInOneDrag = 0;

const startDrag = e => {
    const { clientX } = e;
    dragging = true;
    lastX = clientX;
    progressLen = progressDomRef.value.clientWidth;
    leftLen = progressLen * leftPercentage.value * 0.01;
};

const changePlayingTime = e => {
    if (!dragging) return;
    const { clientX } = e;
    const dx = clientX - lastX;
    lastX = clientX;

    leftLen += dx;
    allDxInOneDrag += dx;
    if (leftLen < 0) {
        leftLen = 0;
    }

    if (leftLen > progressLen) {
        leftLen = progressLen;
    }
    leftPercentage.value = (leftLen / progressLen) * 100;
    updateMinuteByPercentage(leftPercentage.value);
};

const endDrag = () => {
    setTimeout(() => {
        dragging = false;
        lastX = null;
        progressLen = null;
        leftLen = null;
        allDxInOneDrag = 0;

        console.log('endDrag');
    });
};

const clickTo = e => {
    if (Math.abs(allDxInOneDrag) > 4) return; // 判定为drag 不触发 click
    const allLen = progressDomRef.value.clientWidth;
    const left = e.clientX - progressDomRef.value.offsetLeft;
    leftPercentage.value = (left / allLen) * 100;
    updateMinuteByPercentage(leftPercentage.value);
};

const tooglePlay = () => {
    if (sceneLoading.value || playbackLoading.value) return;
    isPlayerPaused.value = !isPlayerPaused.value;
};

// eslint-disable-next-line one-var
let lastTime,
    playing = false;

const stopPlayRunning = () => {
    playing = false;
};

const playRunning = () => {
    if (!playing) return;
    requestAnimationFrame(time => {
        const dt = lastTime ? time - lastTime : 0;
        lastTime = time;
        playedMinute.value += Number((dt / 1000) * 7.5);
        updatePercentageByMinute(playedMinute.value);
        if (playedMinute.value >= allplayMinute.value) {
            playedMinute.value = 0;
        }
        playRunning();
    });
};

const startPlayRunning = () => {
    if (sceneLoading.value || playbackLoading.value) return;
    lastTime = null;
    playing = true;
    playRunning();
    isPlayerPaused.value = false;
};

const tipsText = ref('');
const tipsLeft = ref('');

const hoverTips = e => {
    const { clientX } = e;
    const left = clientX - progressDomRef.value.offsetLeft;
    const ratio = left / progressDomRef.value.clientWidth;
    tipsLeft.value = ratio * 100;
    tipsText.value = `${minuitFormat(allplayMinute.value * ratio + startMinuits.value)}`;
};

const mouseleaveProgress = () => {
    tipsText.value = '';
    tipsLeft.value = 0;
};

watch(
    isPlayerPaused,
    () => {
        if (isPlayerPaused.value) {
            console.log('暂停', isPlayerPaused.value);
            stopPlayRunning();
        } else {
            console.log('播放', isPlayerPaused.value);
            startPlayRunning();
        }
    },
    {
        immediate: true
    }
);

watch(
    [selectedDate, selectedTime],
    () => {
        leftPercentage.value = 0;
        playedMinute.value = 0;
        allplayMinute.value = 0;
        startMinuits.value = 0;

        if (selectedTime.value) {
            const times = selectedTime.value.split('-');
            const startTime = times[0];
            startMinuits.value = getMinuits(startTime);
            const endTime = times[1];
            allplayMinute.value = getMinuits(endTime) - startMinuits.value + 14.99; // + 14.99 是因为 每个格子15分钟， 14.99 是为了防止最后一个格子没有播放完
        }
    },
    {
        immediate: true
    }
);

watch(
    playedMinute,
    () => {
        if (playedMinute.value === 0 || playedMinute.value) {
            const playedTime = minuitFormat(playedMinute.value);
            if (currentPlayingTime.value && currentPlayingTime.value !== playedTime) {
                currentPlayingTime.value = playedTime;
            }
        } else {
            currentPlayingTime.value = '00:00';
        }
    },
    {
        immediate: true
    }
);

watch([sceneLoading, playbackLoading], () => {
    if (!sceneLoading.value && !playbackLoading.value) {
        startPlayRunning();
    }
});

onUnmounted(() => {
    stopPlayRunning();
});
</script>

<style lang="less" scoped>
.player-controls-warp {
    display: flex;
    height: 32px;
    padding: 0 12px 0 4px;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;
    border-radius: 4px;
    background: rgba(66, 76, 89, 0.6);
    /* Shadow/shadow-1 */
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    .playing-icon {
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        flex-shrink: 0;
        &:hover {
            border-radius: 4px;
            background: rgba(196, 201, 207, 0.3);
        }

        :deep(svg) {
            path {
                fill: #fff;
                stroke: #fff;
            }
        }

        &.disabled {
            cursor: no-drop;
            :deep(svg) {
                path {
                    fill: #aab1b8;
                    stroke: #aab1b8;
                }
            }
        }
    }
    .progress-warp {
        flex: 1;
        width: 100%;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;

        .progress-bg {
            width: 100%;
            height: 4px;
            background-color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            border-radius: 2px;
            position: relative;

            .progress-finished {
                position: absolute;
                top: 0;
                left: 0;
                height: 4px;
                background-color: #fff;
                border-radius: 2px;
                z-index: 1;
            }
            .progress-bar {
                position: absolute;
                top: 50%;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #fff;
                z-index: 2;
                cursor: pointer;
                transform: translateX(-50%) translateY(-50%);
                box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.4);
            }
        }
        .time-tips {
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid var(--gray-300);
            background: rgba(27, 33, 41, 0.8);
            color: #fff;
            font-size: 14px;
            line-height: 22px;
            position: absolute;
            top: -30px;
            transform: translateX(-50%);
            z-index: 11;
            .tip-mark-pointer {
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 2px;
                height: 10px;
                background-color: #000;
                pointer-events: none;
            }
        }
    }
    .progress-text {
        width: 90px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        text-align: right;
        white-space: nowrap;
        .played-time {
            color: #fff;
            font-weight: 700;
        }
        .all-time {
            color: var(--gray-300);
        }
    }
}
</style>
