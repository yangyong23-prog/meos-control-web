// @ts-ignore
import i18n from '@/localization';
import { ref, computed } from 'vue';
import { msToMinutesAndSeconds, emptyValue } from '../utils';
import { uuid } from 'yushu-js-utils';
import useStore from '@/store';
import { getPlayerEnv } from '../../loadPlayerEnv';
import { urlContain } from '@/utils';

const packageName = urlContain('meos-autocontrol-web-edge') ? 'meos-autocontrol-web-edge' : 'meos-control-web';
// todo
import { MonitorPlayer, VIDEO_PROTOCOL, VIDEO_TYPE } from 'yushu-component-web';

const useVideo = (props, openLoading, closeLoading) => {
    const { base } = useStore();
    const { projectId, groupCode } = base;

    const videoRef = ref();

    // 监控视频实例
    const monitorVideoOptControl = ref();
    const monitorVideoInstance = inject('monitorVideoInstance');
    // const monitorVideoInstance = ref();

    // 播放视频盒子 ID
    const videoId = `video_${uuid(5)}`;

    // 视频是否错误
    const videoIsError = ref(false);

    // 当前是否正在播放
    const isPlaying = ref(false);

    // 是否完成播放
    const isFinishPlay = ref(false);

    // 是否打开声音
    const openSound = ref(false);

    // 当前倍速
    const speed = ref(1);

    // 当前是否实时播放类型
    const isRealTime = computed(() => props.videoType === VIDEO_TYPE.REAL_TIME);

    // 时长多少分钟
    const duration = computed(() => {
        if (emptyValue(props.beginTime) || emptyValue(props.endTime)) return 0;

        return new Date(props.endTime).getTime() - new Date(props.beginTime).getTime();
    });

    // 时长文字
    const durationText = computed(() => {
        const { minutes, seconds } = msToMinutesAndSeconds(duration.value);

        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    });

    // 播放or暂停
    let playChanging = false;
    const onPlayOrPause = async ({ replayFunc, resumeFunc, pauseFunc }) => {
        if (playChanging) return;
        playChanging = true;
        if (isPlaying.value) {
            // 如果是实时,只能停止
            // 如果是回放,可以暂停
            console.log('video player>>>  点击暂停');

            isRealTime.value ? await monitorVideoInstance.value.stop() : await monitorVideoInstance.value.pause();
            pauseFunc?.();
        } else {
            console.log('video player>>> 点击播放');

            if (isRealTime.value) {
                // 实时播放暂停后需要重新播放
                await monitorVideoInstance.value?.play?.();
            } else {
                if (isFinishPlay.value) {
                    speed.value = 1;
                    // 如果当前是播放完成后的点击播放,则重新播放
                    await monitorVideoInstance.value?.play?.();
                    replayFunc?.();
                } else {
                    // 如果未播放完成,中途暂停,则调用恢复即可
                    await monitorVideoInstance.value?.resume?.();
                    resumeFunc?.();
                }
            }

            isFinishPlay.value = false;
        }

        isPlaying.value = !isPlaying.value;
        playChanging = false;
    };

    // 开关声音
    const onChangeSound = async () => {
        if (openSound.value) {
            await monitorVideoInstance.value?.closeSound?.();
        } else {
            await monitorVideoInstance.value?.openSound?.();
        }

        openSound.value = !openSound.value;
    };

    // 由于海康插件未有提供"指定倍速"API,只能一次一次调用
    // 所以这里是一次一次调用,返回的倍速跟指定的倍速一样就停止即可
    const loopPlayBack = async (playBackFast, targetRate) => {
        const rate = playBackFast ? await monitorVideoInstance.value?.playbackFast?.() : await monitorVideoInstance.value?.playbackSlow?.();

        console.log(rate, 'video player>>> rate');
        console.log(targetRate, 'video player>>> targetRate');
        if (rate === targetRate) return Promise.resolve();

        return loopPlayBack(playBackFast, targetRate);
    };

    // 改变倍速
    const onChangeSpeed = async value => {
        if (speed.value === value) return;

        if (!monitorVideoInstance.value?.playbackFast || !monitorVideoInstance.value?.playbackSlow) return;

        // 原本倍速比选择的倍速大 意味着要慢放
        await loopPlayBack(speed.value < value, value);

        speed.value = value;
    };

    const onSeekTo = seekStart => {
        return monitorVideoInstance.value?.seekTo?.(seekStart);
    };

    const getPlayEnv = () => {
        const env = getPlayerEnv();
        console.log('video player>>>', env);

        return {
            baseUrl: env?.baseUrl || `http://${window.location.host}`,
            groupCode: env?.groupCode || groupCode,
            projectId: env?.projectId || projectId
        };
    };

    const initVideoInstance = ({ StreamEnd, successPlay, failPlay }) => {
        const playSuccess = () => {
            isPlaying.value = true;
            videoIsError.value = false;
            successPlay?.();
        };

        const playFail = () => {
            isPlaying.value = false;
            videoIsError.value = true;
            failPlay?.();
            closeLoading?.();
        };

        const cfg = {
            ...getPlayEnv(),
            callbacks: {
                onRealTimeSuccess() {
                    //实时视频播放成功
                    console.log('video player>>> onRealTimeSuccess');
                    playSuccess();
                },
                onPlaybackSuccess() {
                    //回放视频播放成功
                    console.log('video player>>> onPlaybackSuccess');
                    playSuccess();
                },
                onRealTimeFail() {
                    //实时视颜播放失败
                    console.log('video player>>> onRealTimeFail');
                    playFail();
                },
                onPlaybackFail() {
                    //回放视频播放失败
                    console.log('video player>>> onPlaybackFail');
                    playFail();
                },
                onPlayFinished() {
                    //视频播放完成
                    console.log('video player>>>  onPlayFinished');
                    isPlaying.value = false;
                    isFinishPlay.value = true;
                    StreamEnd?.();
                },
                pluginErrorHandler(iWndIndex, iErrorCode, oError) {
                    //插件加载失败
                    console.log(iWndIndex, iErrorCode, oError, 'video player>>> error');
                    // isPlaying.value = false;
                    // videoIsError.value = true;
                    playFail();
                }
            }
        };

        console.log('video player>>> init cfg>>>>>>', cfg);

        monitorVideoOptControl.value = new MonitorPlayer(cfg);
        const opt = {
            objectId: 'xxxxxx',
            autoLoadPlugin: false,
            //
            videoType: VIDEO_TYPE.REAL_TIME,
            // 视频协议
            protocol: VIDEO_PROTOCOL.HIK,
            borderSelectColor: '#f7f9fa',
            supporDoubleClickFull: false,

            // 需要挂载的video element 必填
            mountElement: videoId,
            //  (海康)组件内部加载worker地址前缀
            hikSzBasePath: `/${packageName}/video-sdk`
            // js插件地址,完整路径
            // jsPluginPath: ''
        };
        monitorVideoOptControl.value.setOption(opt);
    };

    const loadVideo = async ({ objectId, beginTime, endTime, videoType, protocol, jsPluginPath }) => {
        const token = base.token || '';
        const opt = {
            token,
            autoLoadPlugin: false,
            objectId,
            videoType,
            protocol,
            // 需要挂载的video element 必填
            mountElement: videoId,
            //  (海康)组件内部加载worker地址前缀
            hikSzBasePath: `/${packageName}/video-sdk`,
            // js插件地址,完整路径
            jsPluginPath
        };

        console.log('video player>>> load opt', opt);
        isPlaying.value = false;
        if (!isRealTime.value) {
            opt.beginTime = beginTime;
            opt.endTime = endTime;
        }
        try {
            monitorVideoOptControl.value?.setOption(opt);
            const loadRes = await monitorVideoOptControl.value?.load();
            console.log('video player>>> load monitorVideoOptControl', monitorVideoOptControl, loadRes);
            monitorVideoInstance.value = monitorVideoOptControl.value.monitorVideo;
            return loadRes;
        } catch (e) {
            videoIsError.value = true;
            console.error('load video error>>>>>>', e);
            return {
                error: true
            };
        }
    };

    return {
        videoRef,
        videoId,
        videoIsError,
        isRealTime,
        isPlaying,
        isFinishPlay,
        openSound,
        speed,
        duration,
        durationText,
        monitorVideoOptControl,
        onPlayOrPause,
        onChangeSound,
        onChangeSpeed,
        onSeekTo,
        initVideoInstance,
        loadVideo
    };
};

export default useVideo;
