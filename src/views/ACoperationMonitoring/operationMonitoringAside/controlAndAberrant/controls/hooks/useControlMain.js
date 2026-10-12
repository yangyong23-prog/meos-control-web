// @ts-ignore
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import emitter from '@/utils/bus';

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
    const timer = ref();
    const timerWeather = ref();

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

    const refreshControlFun = (hasError = true) => {
        if (isColdHotControl.value === 'ColdHotControl') {
            getListColdHotStrategy(hasError);
        } else if (isColdHotControl.value === 'ColdSource') {
            getListCoolStrategy(hasError);
            getListFixedTimeStrategy(hasError);
        } else {
            getListHotStrategy(hasError);
        }
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
            clearInterval(timerWeather.value);
            timerWeather.value = setInterval(() => {
                getWeatherList();
            }, 1000 * 60 * 5);
            clearInterval(timer.value);
            timer.value = setInterval(() => {
                refreshControlFun(false);
            }, 1000 * 10);
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
        clearInterval(timer.value);
        clearInterval(timerWeather.value);
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
