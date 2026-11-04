// @ts-ignore
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import emitter from '@/utils/bus';
import { startVisiblePolling } from '@/utils/polling';

// opt/edge-call F2：控制面板策略列表原来 10 秒轮询一次，改为 30 秒，页面隐藏时暂停、上一轮未返回时跳过
const CONTROL_REFRESH_MS = 30 * 1000;
// opt/edge-call F3：天气原来 5 分钟，天气源本身是小时级，改为 15 分钟
const WEATHER_REFRESH_MS = 15 * 60 * 1000;

export default (
    isColdHotControl,
    setTop,
    runSetTab,
    onSetTopHeight,
    getWeatherList,
    getListCoolStrategy,
    getListFixedTimeStrategy,
    getListColdHotStrategy,
    getListHotStrategy,
    querySystemRunningModel,
    getNumberOfChillersFun
) => {
    const loading = ref(false);
    const selectedSystemObj = inject('selectedSystemObj');
    let stopControlPolling = null,
        stopWeatherPolling = null;
    const stopPolling = () => {
        stopControlPolling?.();
        stopControlPolling = null;
        stopWeatherPolling?.();
        stopWeatherPolling = null;
    };

    const innerQuerySystemRunningModel = () => {
        if (isColdHotControl.value === 'ColdHotControl') {
            querySystemRunningModel();
        }
    };

    /**
     * @description: 刷新数据
     * @return {*}
     */
    const refreshFun = async () => {
        await getWeatherList();
        refreshControlFun();
        innerQuerySystemRunningModel();
    };

    const cancelLoop = type => {
        if (type) {
            refreshControlFun();
        }
    };

    // 返回 Promise，供轮询器判断上一轮是否结束
    const refreshControlFun = (hasError = true) => {
        if (isColdHotControl.value === 'ColdHotControl') {
            return Promise.all([getListColdHotStrategy(hasError)]);
        }
        if (isColdHotControl.value === 'ColdSource') {
            return Promise.all([getListCoolStrategy(hasError), getListFixedTimeStrategy(hasError)]);
        }
        return Promise.all([getListHotStrategy(hasError)]);
    };

    const initData = async function () {
        if (!selectedSystemObj.value?.systemId) {
            return;
        }

        // loading.value?.destroy?.();

        // loading.value = MLoading.service({
        //     target: '.controls-box',
        //     fullscreen: false,
        //     duration: 30000,
        //     lottieName: 'ball',
        //     loadIconStyle: {
        //         width: '100px',
        //         height: '100px'
        //     }
        // });
        loading.value = true;
        try {
            if (isColdHotControl.value === 'ColdSource') {
                getNumberOfChillersFun();
            }
            await refreshFun();
            stopPolling();
            stopWeatherPolling = startVisiblePolling(() => getWeatherList(), WEATHER_REFRESH_MS);
            stopControlPolling = startVisiblePolling(() => refreshControlFun(false), CONTROL_REFRESH_MS);
            onSetTopHeight();

            emitter.on('SYSTEM_DATE_CHANGE', refreshControlFun);
            emitter.on('release_intervention', innerQuerySystemRunningModel);
        } finally {
            loading.value = false;
        }
    };

    onMounted(async () => {
        await initData();
    });

    onUnmounted(() => {
        stopPolling();
        emitter.off('SYSTEM_DATE_CHANGE', refreshControlFun);
        emitter.off('release_intervention', innerQuerySystemRunningModel);
    });

    watch(runSetTab, () => {
        if (isColdHotControl.value === 'ColdHotControl') return;
        if (runSetTab.value === '0') {
            getListCoolStrategy();
        } else {
            getListFixedTimeStrategy();
        }
        nextTick(() => {
            setTop.value?.setScrollTop(0);
        });
    });

    watch(selectedSystemObj, () => {
        initData();
    });
    provide('refreshFun', refreshFun);
    return {
        cancelLoop,
        loading
    };
};
