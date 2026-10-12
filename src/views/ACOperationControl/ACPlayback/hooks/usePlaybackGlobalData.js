// @ts-ignore
import i18n from '@/localization';
import { useRoute } from 'vue-router';
import useStore from '@/store';
import dayjs from 'dayjs';
import { getACHistoryPlaybackData } from '@/apis/ACOperationControl';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import {
    selectedDateInjectKey,
    selectedTimeInjectKey,
    playbackDataInjectKey,
    playbackLoadingInjectKey,
    currentEnvParamInjectKey,
    startPlayInjectKey,
    pausePlayInjectKey,
    isPlayerPausedInjectKey,
    currentPlayingTimeInjectKey,
    currentPlayingDataInjectKey,
    isRightSmallSizeInjectKey,
    sceneLoadingInjectKey
} from '../constant/injectKey';

import { ENV_ATTR_KEYS } from '../../constants/constant';

export default () => {
    const { query } = useRoute();
    const { curEnvParam } = query || {};

    const { base } = useStore();

    // 时间选择状态
    const selectedDate = ref(getDayjsTz().subtract(1, 'd').format('YYYY.MM.DD'));
    const selectedTime = ref('00:00-23:45');

    // 接口返回数据
    const playbackLoading = ref(true);
    const sceneLoading = ref(true);
    const queryDataAbortController = ref();
    const playbackData = ref({});

    // 播放状态
    const isPlayerPaused = ref(true);
    const startPlay = () => {
        isPlayerPaused.value = false;
    };
    const pausePlay = () => {
        isPlayerPaused.value = true;
    };

    const currentPlayingTime = ref('00:00');

    // 当前播放的时段对应的数据
    const currentPlayingData = computed(() => {
        return playbackData.value[currentPlayingTime.value];
    });

    // 右侧环境参数选中状态
    const currentEnvParam = ref(curEnvParam || ENV_ATTR_KEYS.TEMPERATURE);

    const isRightSmallSize = ref(false);

    const getHistoryData = async curDate => {
        const startDateTime = dayjs(curDate + ' ' + '00:00:00').format('YYYY-MM-DD HH:mm:ss');
        const endDateTime = dayjs(curDate + ' ' + '23:45:00').format('YYYY-MM-DD HH:mm:ss');
        const params = {
            startDateTime,
            endDateTime,
            instanceId: base.projectId,
            instanceType: 'PROJECT'
        };
        try {
            queryDataAbortController.value?.abort?.();
            queryDataAbortController.value = new AbortController();
            playbackLoading.value = true;
            const res = await getACHistoryPlaybackData(params, queryDataAbortController.value.signal).finally(() => {
                playbackLoading.value = false;
            });
            if (res?.code === SUCCESSCODE) {
                playbackData.value = res.data;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const clearPastData = () => {
        playbackData.value = {};

        isPlayerPaused.value = true;
        currentPlayingTime.value = '00:00';
        selectedTime.value = '00:00-23:45';
    };

    watchEffect(() => {
        const curDate = selectedDate.value;
        if (curDate) {
            clearPastData();
            getHistoryData(curDate);
        }
    });

    provide(selectedDateInjectKey, selectedDate);
    provide(selectedTimeInjectKey, selectedTime);

    provide(playbackLoadingInjectKey, playbackLoading);
    provide(playbackDataInjectKey, playbackData);

    provide(isPlayerPausedInjectKey, isPlayerPaused);
    provide(startPlayInjectKey, startPlay);
    provide(pausePlayInjectKey, pausePlay);

    provide(currentPlayingTimeInjectKey, currentPlayingTime);
    provide(currentPlayingDataInjectKey, currentPlayingData);

    provide(currentEnvParamInjectKey, currentEnvParam);
    provide(isRightSmallSizeInjectKey, isRightSmallSize);

    provide(sceneLoadingInjectKey, sceneLoading);
    onUnmounted(() => {
        playbackData.value = null;
    });
    return {
        startPlay,
        pausePlay
    };
};
