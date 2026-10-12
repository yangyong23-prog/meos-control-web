// @ts-ignore
import i18n from '@/localization';
import { computed, ref, onBeforeUnmount } from 'vue';
import { msToMinutesAndSeconds } from '../utils';

const useProgress = ({ duration, props, speed = 1, onSeekTo, emits }) => {
    const speedMap = {
        '-8': 8,
        '-4': 4,
        '-2': 2,
        1: 1,
        2: 0.5,
        4: 0.25,
        8: 0.125
    };

    const progressBarRef = ref();

    const isDragging = ref(false);

    // 当前时长 毫秒为单位
    const currentTimeStamp = ref(0);

    const progressCircleStyle = computed(() => {
        if (currentTimeStamp.value === 0) {
            return {
                left: 'calc(0% - 6px)'
            };
        }

        return {
            left: `calc(${progressInnerStyle.value.width} - 6px)`
        };
    });

    // 进度条内部白色条&时间的位置
    const progressInnerStyle = computed(() => ({
        width: `${Math.floor((currentTimeStamp.value / duration.value) * 100)}%`
    }));

    // 当前时间进度文字
    const currentTimeText = computed(() => {
        const { minutes, seconds } = msToMinutesAndSeconds(currentTimeStamp.value);

        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    });

    const timeOs = ref();

    const startLoopCurrentTime = () => {
        clearLoopCurrentTime();
        timeOs.value = setTimeout(() => {
            currentTimeStamp.value += 1000;
            if (currentTimeStamp.value < duration.value) {
                startLoopCurrentTime();
            }
        }, 1000 * speedMap?.[speed.value]);
    };

    const clearLoopCurrentTime = () => {
        clearTimeout(timeOs.value);
    };

    const seekTo = async () => {
        const isOverEndTime = currentTimeStamp.value >= duration.value;

        const targetTime = isOverEndTime ? new Date(props.endTime).getTime() - 1000 : new Date(props.beginTime).getTime() + currentTimeStamp.value;
        console.log('video player>>> targetTime:', new Date(targetTime));
        await onSeekTo?.(targetTime);
        console.log('video player>>> onSeekTo end');

        isOverEndTime ? clearLoopCurrentTime() : startLoopCurrentTime();
    };

    const setVideoProgress = event => {
        const circleLeft = event.clientX - progressBarRef.value.getBoundingClientRect().left;
        const maxLeft = progressBarRef.value.offsetWidth;

        if (circleLeft >= maxLeft - 6) {
            currentTimeStamp.value = JSON.parse(JSON.stringify(duration.value));
        } else {
            const innerRatio = (event.clientX - progressBarRef.value.getBoundingClientRect().left + 6) / progressBarRef.value.offsetWidth;

            currentTimeStamp.value = Math.floor(innerRatio * duration.value);
        }
    };

    const onMouseMove = event => {
        if (isDragging.value) {
            event.stopPropagation();
            event.preventDefault();
            setVideoProgress(event);
            emits('move');
        }
    };

    const onMouseUp = () => {
        isDragging.value = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        emits('moveEnd');

        seekTo();
    };

    const onProgressBarMouseDown = () => {
        isDragging.value = true;
        clearLoopCurrentTime();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    // 直接点击进度条直接定位
    const onClickProgress = event => {
        clearLoopCurrentTime();

        const ratio = (event.clientX - progressBarRef.value.getBoundingClientRect().left) / progressBarRef.value.offsetWidth;

        currentTimeStamp.value = Math.floor(ratio * duration.value);

        seekTo();
    };

    const resetProgress = () => {
        currentTimeStamp.value = 0;
    };

    onBeforeUnmount(() => {
        clearLoopCurrentTime();
    });

    return {
        isDragging,
        progressBarRef,
        progressInnerStyle,
        progressCircleStyle,
        currentTimeText,
        resetProgress,
        onProgressBarMouseDown,
        onClickProgress,
        startLoopCurrentTime,
        clearLoopCurrentTime
    };
};

export default useProgress;
