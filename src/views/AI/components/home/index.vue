<template>
    <div class="AI-home-page">
        <Header></Header>
        <Content></Content>
        <GrowLine v-for="item in arrowData" :key="item.id" :start-config="item.startConfig" :end-config="item.endConfig" :grow-animation="item.growAnimation" :color="item.color">
        </GrowLine>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Header from './components/header/header.vue';
import Content from './components/content/content.vue';
import { animate } from 'animejs';
import emitter from '@/utils/bus';
import GrowLine from '../GrowLine/index.vue';
import dayjs from 'dayjs';
import { formatAIDebugTime, getJobResultSnapshot, getStrategyOverviewSnapshot, logAIDebug } from '../../utils/debug';
import { broadcastAndComputeEndTimeKey, computeStartTimeKey, showHomeViewKey, headerCenterStateKey, activeStrategyIndexKey, headerCenterDataCenterKey } from '../../injectionKey';
import {
    AISystemLoadingKey,
    AISystemNoDataKey,
    strategyLoadingKey,
    getBroadcastDataKey,
    broadcastKey,
    coolStationCastDataKey,
    acCastDataKey,
    spaceCastDataKey,
    getLoadAcQuarterKey,
    getWeatherKey,
    airSearonCastDataKey,
    Hour24ForecastDataKey,
    getLastStrategyOverviewKey,
    opacityStrategyKey,
    setStrategyOverviewTempKey,
    resetStrategyOverviewTempKey,
    strategyOverviewKey,
    currentSystemIdKey
} from '../../hooks/useStaticData';
import { jobResult } from '@/apis/AI';
import useStore from '@/store';

import { ANIMATESTATE } from '../../variable';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter } from '@/utils/dayjsTools';

let // 播放时间(ms)
    animateDuration = 500,
    // 箭头的scoll容器
    arrowScoll = null,
    // 策略生成
    PGCards = [],
    // 策略预测
    PPCards = [],
    // 策略评价
    PECards = [],
    // 最终策略选择
    FSCard = null,
    // // 策略生成dom
    // PGCardDom = [],
    // // 策略预测dom
    // PPCardDom = null,
    // // 用户控制动画淡入
    // PPCardLine1Right = null,
    // PPCardLine2Right = null,
    // PPCardLine3Right = null,
    // // 策略评价
    // PECardDom = null,
    // PECardIconDom = null,

    /**
     * 由于箭头需要组件创建结束后，异步接收到到组件内部dom的id。
     * 需要先缓存吗，最后一起赋值给arrowData
     * 必有三条数据
     * 执行动画时可以充分利用缓存数据
     * **/
    arrowDataTemp = [
        // 第一组
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#9D8BFD',
            growAnimation: false
        },
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#7ECDF2',
            growAnimation: false
        },
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#F0D36D',
            growAnimation: false
        },
        // 2
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#9D8BFD',
            growAnimation: false
        },
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#7ECDF2',
            growAnimation: false
        },
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#F0D36D',
            growAnimation: false
        },
        // 3
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#9D8BFD',
            growAnimation: false
        },
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#9D8BFD',
            growAnimation: false
        },
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#9D8BFD',
            growAnimation: false
        },
        // 4
        {
            startConfig: {
                id: '',
                dom: null,
                scrollCintainer: null
            },
            endConfig: {
                id: '',
                dom: null,
                height: 0,
                offsetX: 0,
                offsetY: 0,
                scrollCintainer: null
            },
            color: '#9D8BFD',
            growAnimation: false
        }
    ],
    // 动画前后需要记录的CSS属性值，动画结束后还原
    PGCardDomPaddingTop = '12px',
    PGCardDomPaddingBottom = '20px',
    PGCardDomMarginBottom = '16px',
    PGCardDomHeight = '531px',
    PPCardDomPaddingTop = '12px',
    PPCardDomPaddingBottom = '20px',
    PPCardDomMarginBottom = '16px',
    PPCardDomHeight = '464px',
    PECardDomPaddingTop = '12px',
    PECardDomPaddingBottom = '20px',
    PECardDomMarginBottom = '16px',
    PECardDomHeight = '548px';

// 系统加载过程
const AISystemLoading = inject(AISystemLoadingKey);
const AISystemNoData = inject(AISystemNoDataKey);
const strategyLoading = inject(strategyLoadingKey);
const strategyOverview = inject(strategyOverviewKey);
const getBroadcast = inject(getBroadcastDataKey);
const broadcastData = inject(broadcastKey);
const coolStationCastData = inject(coolStationCastDataKey);
const acCastData = inject(acCastDataKey);
const spaceCastData = inject(spaceCastDataKey);
const getLoadAcQuarter = inject(getLoadAcQuarterKey);
const getWeather = inject(getWeatherKey);
const airSearonCastData = inject(airSearonCastDataKey);
const Hour24ForecastData = inject(Hour24ForecastDataKey);
const showHomeView = inject(showHomeViewKey);
const getLastStrategyOverview = inject(getLastStrategyOverviewKey);
const opacityStrategy = inject(opacityStrategyKey);
const setStrategyOverviewTemp = inject(setStrategyOverviewTempKey);
const resetStrategyOverviewTemp = inject(resetStrategyOverviewTempKey);
const currentSystemId = inject(currentSystemIdKey);

const { base } = useStore();

// 控制活跃策略
const activeStrategyIndex = ref(0);

// 箭头数据
const arrowData = ref([]);

// 控制header的数据结构
// header右侧数据播报
const headerRightData = ref([]);
// heade中间数据播报
const headerCenterData = reactive({
    doing: '',
    next: ''
});
// heade中间数据播报AI打字数据
const headerCenterDataCenter = ref('');

// 记录最后一次播报结束时间和计算结束时间的最新值
const computeStartTime = ref(null);
const broadcastEndTime = ref(null);
const computeEndTime = ref(null);

watch(showHomeView, value => {
    if (value) {
        createArrow();
    }
});

const broadcastAndComputeEndTime = computed(() => {
    if (broadcastEndTime.value && computeEndTime.value) {
        return dayjsIsAfter(computeEndTime.value, broadcastEndTime.value) ? computeEndTime.value : broadcastEndTime.value;
    }
    return null;
});

// heade中间数据播报状态
/**
 * 0 等待下次开始
 * 1 播报中
 * 2 播报数据结束即将开始
 * 3 主体动画（正在计算）
 * **/
const headerCenterState = ref(ANIMATESTATE.free);

// header缓存数据用于控制动画时间
const broadcastTemp = [
    {
        label: i18n.global.t('meos_control_web.hvac_season_period_next_24_hours'),
        content: []
    },
    {
        label: i18n.global.t('meos_control_web.space_environment_quality_standard_next_24_hours'),
        content: []
    },
    {
        label: i18n.global.t('meos_control_web.space_scheduling_standard_next_24_hours'),
        content: []
    },
    {
        label: i18n.global.t('meos_control_web.value_selection_next_24_hours'),
        content: []
    },
    {
        label: i18n.global.t('meos_control_web.weather_forecast_next_24_hours'),
        content: []
    },
    {
        label: i18n.global.t('meos_control_web.cooling_station_basic_data'),
        content: []
    },
    {
        label: i18n.global.t('meos_control_web.terminal_equipment_basic_data'),
        content: []
    },
    {
        label: i18n.global.t('meos_control_web.space_basic_data'),
        content: []
    }
];

provide('headerRightData', headerRightData);
provide('headerCenterData', headerCenterData);
provide(headerCenterDataCenterKey, headerCenterDataCenter);
provide(headerCenterStateKey, headerCenterState);
provide(broadcastAndComputeEndTimeKey, broadcastAndComputeEndTime);
provide(computeStartTimeKey, computeStartTime);
provide(activeStrategyIndexKey, activeStrategyIndex);

const currentAnimateDuration = computed(() => {
    return inSomeHeaderCenterState(ANIMATESTATE.animation) ? animateDuration : 0;
});

// 箭头的滚动容器
emitter.off('scrollId');
emitter.on('scrollId', id => {
    arrowScoll = document.getElementById(id);
    for (let i = 0; i < arrowDataTemp.length; i++) {
        const item = arrowDataTemp[i];
        if (i === 9) {
            item.startConfig.scrollCintainer = arrowScoll;
            continue;
        }
        item.startConfig.scrollCintainer = arrowScoll;
        item.endConfig.scrollCintainer = arrowScoll;
    }
    createArrow();
});

// 策略生成dom和id数据接受和处理
emitter.off('PGcard');
emitter.on('PGcard', data => {
    PGCards[data.index] = {
        outDom: document.getElementById(data.outId),
        lineIds: data.lineIds,
        lineDoms: data.lineIds.map(item => {
            return document.getElementById(item);
        })
    };
    createArrow();
});

// 策略预测dom的id数据接受
emitter.off('PPcard');
emitter.on('PPcard', data => {
    PPCards[data.index] = {
        outDom: document.getElementById(data.outId),
        lineRightIds: data.lineRightIds,
        lineRightDoms: data.lineRightIds.map(item => {
            return document.getElementById(item);
        }),
        lineLeftIds: data.lineLeftIds,
        lineLeftDoms: data.lineLeftIds.map(item => {
            return document.getElementById(item);
        })
    };
    createArrow();
});

// 策略评价dom和id数据接收
emitter.off('PEcard');
emitter.on('PEcard', data => {
    PECards[data.index] = {
        outDom: document.getElementById(data.outId),
        IconDom: document.getElementById(data.iconId),
        bestId: data.bestId,
        bestDom: document.getElementById(data.bestId),
        titleId: data.titleId,
        titleDom: document.getElementById(data.titleId)
    };
    createArrow();
});

// 策略评价dom和id数据接收
emitter.off('PEcard-best');
emitter.on('PEcard-best', data => {
    if (!PECards[data.index]) PECards[data.index] = {};
    PECards[data.index].IconDom = document.getElementById(data.iconId);
    PECards[data.index].bestId = data.bestId;
    PECards[data.index].bestDom = document.getElementById(data.bestId);
});

// 策略评价dom和id数据接收
emitter.off('FSCard');
emitter.on('FSCard', data => {
    FSCard = {
        outDom: document.getElementById(data.outId),
        titleId: data.titleId,
        titleDom: document.getElementById(data.titleId)
    };
    createArrow();
});

emitter.off('AI-compute-start');
emitter.on('AI-compute-start', args => {
    logAIDebug('home', '收到 AI-compute-start 事件', {
        showHomeView: showHomeView.value,
        headerCenterState: headerCenterState.value,
        startTime: formatAIDebugTime(args.startTime)
    });
    if (!showHomeView.value) {
        if (outsideSomeHeaderCenterState(ANIMATESTATE.free)) {
            return;
        } else {
            changeHeaderCenterState(ANIMATESTATE.broadcast);
            return;
        }
    }
    if (outsideSomeHeaderCenterState(ANIMATESTATE.free)) {
        // 正在动画中
        return;
    }
    if (args.startTime) {
        computeStartTime.value = args.startTime;
    }
    const time = getDayjsTz();
    // 获取播报数据、天气数据
    computeEndTime.value = null;
    broadcastEndTime.value = null;
    Promise.all([getLoadAcQuarter(), getBroadcast(computeStartTime.value), getWeather()]).then(() => {
        startHeaderAnimate(time);
    });
});

emitter.off('end-anime');
emitter.on('end-anime', () => {
    clearArrow();
    changeHeaderCenterState(ANIMATESTATE.free);
    stopArrowAnimation();
});

emitter.off('AI-compute-fail');
emitter.on('AI-compute-fail', () => {
    changeHeaderCenterState(ANIMATESTATE.free);
    stopArrowAnimation();
});

emitter.off('AI-compute-end');
emitter.on('AI-compute-end', async args => {
    logAIDebug('home', '收到 AI-compute-end 事件', {
        showHomeView: showHomeView.value,
        headerCenterState: headerCenterState.value,
        endTime: formatAIDebugTime(args.endTime),
        cachedOverview: getStrategyOverviewSnapshot(strategyOverview.value)
    });
    if (!showHomeView.value) {
        // 首页不处于活跃状态的时候，获取数据判断是否最新数据
        const params = {
            projectId: base.projectId,
            systemId: currentSystemId.value,
            dataOffset: 0
        };
        jobResult(params).then(res => {
            const latestSnapshot = getJobResultSnapshot(res.data);
            const cachedSnapshot = getStrategyOverviewSnapshot(strategyOverview.value)[0] || null;
            const latestFirstCode = res.data?.stgyCodeList?.[0]?.code ?? null;
            const matchedCurrentCode = strategyOverview.value?.[0]?.stgyCodeList?.some(item => item.code === latestFirstCode) ?? false;
            logAIDebug('home', '首页非活跃时进行最新策略判定', {
                params,
                latestSnapshot,
                cachedSnapshot,
                latestFirstCode,
                matchedCurrentCode,
                compareRule: '仅比较最新第一页第一条策略 code 是否命中当前第一页 stgyCodeList'
            });
            if (res.data && strategyOverview.value.length > 0) {
                const node = strategyOverview.value[0].stgyCodeList.find(item => {
                    return res.data.stgyCodeList[0].code === item.code;
                });
                if (!node) {
                    logAIDebug('home', '首页非活跃时检测到首个 code 未命中当前缓存，触发 getLastStrategyOverview');
                    getLastStrategyOverview();
                } else {
                    logAIDebug('home', '首页非活跃时首个 code 命中当前缓存，跳过 getLastStrategyOverview');
                }
            } else {
                logAIDebug('home', '首页非活跃时未触发最新策略刷新', {
                    hasLatestData: Boolean(res.data),
                    cachedStrategyLength: strategyOverview.value.length
                });
            }
        });
        changeHeaderCenterState(ANIMATESTATE.free);
    } else {
        computeEndTime.value = args.endTime;
        logAIDebug('home', '首页活跃时写入 computeEndTime，等待播报结束触发内容刷新', {
            computeEndTime: formatAIDebugTime(computeEndTime.value),
            broadcastEndTime: formatAIDebugTime(broadcastEndTime.value)
        });
        // broadcastEndTime 播报结束的标志
        if (broadcastEndTime.value) {
            startContentAnimation();
        }
    }
});

emitter.off('PE-out-click');
emitter.on('PE-out-click', async args => {
    changeActiveIndex(args.index);
});

emitter.off('PG-out-click');
emitter.on('PG-out-click', async args => {
    changeActiveIndex(args.index);
});

emitter.off('PP-out-click');
emitter.on('PP-out-click', async args => {
    changeActiveIndex(args.index);
});

onMounted(() => {});

const startContentAnimation = async () => {
    if (!inSomeHeaderCenterState(ANIMATESTATE.request)) {
        logAIDebug('home', 'startContentAnimation 被跳过，当前状态不是 request', {
            headerCenterState: headerCenterState.value,
            computeEndTime: formatAIDebugTime(computeEndTime.value),
            broadcastEndTime: formatAIDebugTime(broadcastEndTime.value)
        });
        return;
    }
    logAIDebug('home', 'startContentAnimation 开始执行', {
        activeStrategyIndex: activeStrategyIndex.value,
        strategySnapshotBeforeRefresh: getStrategyOverviewSnapshot(strategyOverview.value)
    });
    setStrategyOverviewTemp();
    await getLastStrategyOverview();
    logAIDebug('home', 'startContentAnimation 完成最新策略刷新', {
        strategySnapshotAfterRefresh: getStrategyOverviewSnapshot(strategyOverview.value)
    });
    changeHeaderCenterState(ANIMATESTATE.animation);
    await resetActiveIndex();
    // 箭头替换预留时间
    await sleepTime(inSomeHeaderCenterState(ANIMATESTATE.animation) ? 1000 : 0);
    makeArrow();
    await initAnimation();
    await sleepTime(inSomeHeaderCenterState(ANIMATESTATE.animation) ? 1000 : 0);
    await executeAnimation();
    await sleepTime(inSomeHeaderCenterState(ANIMATESTATE.animation) ? 1000 : 0);
    if (inSomeHeaderCenterState(ANIMATESTATE.free)) {
        // 非正常结束 (切换系统，防止重复箭头)
        clearArrow();
    }
    stopAnimation();
};

// 动画开始前初始化
const initAnimation = async () => {
    await initArrowAnimation();
    await initPGCard();
    await initPPCard();
    await initPECard();
};
// 动画开始前初始化箭头
const initArrowAnimation = async () => {
    clearArrow();
    for (let i = 0; i < arrowDataTemp.length; i++) {
        const item = arrowDataTemp[i];
        item.growAnimation = true;
    }
};
// 动画开始前初始化策略生成
const initPGCard = async () => {
    const style = window.getComputedStyle(PGCards[activeStrategyIndex.value].outDom);
    let pt = style.paddingTop,
        pb = style.paddingBottom,
        mb = style.marginBottom,
        { height } = style;
    PGCardDomPaddingTop = pt !== '0px' ? pt : PGCardDomPaddingTop;
    PGCardDomPaddingBottom = pb !== '0px' ? pb : PGCardDomPaddingBottom;
    PGCardDomMarginBottom = mb !== '0px' ? mb : PGCardDomMarginBottom;
    PGCardDomHeight = height !== '0px' ? height : PGCardDomHeight;

    await animate(PGCards[activeStrategyIndex.value].outDom, {
        duration: 0,
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0
    });
};
// 动画开始前初始化策略预测
const initPPCard = async () => {
    const style = window.getComputedStyle(PPCards[activeStrategyIndex.value].outDom);
    let pt = style.paddingTop,
        pb = style.paddingBottom,
        mb = style.marginBottom,
        { height } = style;
    PPCardDomPaddingTop = pt !== '0px' ? pt : PPCardDomPaddingTop;
    PPCardDomPaddingBottom = pb !== '0px' ? pb : PPCardDomPaddingBottom;
    PPCardDomMarginBottom = mb !== '0px' ? mb : PPCardDomMarginBottom;
    PPCardDomHeight = height !== '0px' ? height : PPCardDomHeight;

    await animate(PPCards[activeStrategyIndex.value].outDom, {
        duration: 0,
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0
    });
    await animate(PPCards[activeStrategyIndex.value].lineRightDoms[0], {
        duration: 0,
        opacity: 0
    });
    await animate(PPCards[activeStrategyIndex.value].lineRightDoms[1], {
        duration: 0,
        opacity: 0
    });
    await animate(PPCards[activeStrategyIndex.value].lineRightDoms[2], {
        duration: 0,
        opacity: 0
    });
};
// 动画开始前初始化策略评价
const initPECard = async () => {
    const style = window.getComputedStyle(PECards[activeStrategyIndex.value].outDom);
    let pt = style.paddingTop,
        pb = style.paddingBottom,
        mb = style.marginBottom,
        { height } = style;
    PECardDomPaddingTop = pt !== '0px' ? pt : PECardDomPaddingTop;
    PECardDomPaddingBottom = pb !== '0px' ? pb : PECardDomPaddingBottom;
    PECardDomMarginBottom = mb !== '0px' ? mb : PECardDomMarginBottom;
    PECardDomHeight = height !== '0px' ? height : PECardDomHeight;

    await animate(PECards[activeStrategyIndex.value].outDom, {
        duration: 0,
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0
    });
    await animate(PECards[activeStrategyIndex.value].outDom, {
        duration: 0,
        opacity: 0,
        height: 0
    });
    await animate(PECards[activeStrategyIndex.value].IconDom, {
        duration: 0,
        opacity: 0
    });
};
// 动画开始前初始化最终选择
const initFSCard = async () => {
    await animate(FSCard.outDom, {
        duration: currentAnimateDuration.value,
        opacity: 0
    });
    await animate(FSCard.outDom, {
        duration: 0,
        left: 340
    });
    resetStrategyOverviewTemp();
};

// 执行动画
const executeAnimation = async () => {
    // 策略生成还原CSS属性
    await animate(PGCards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value / 5,
        paddingTop: PGCardDomPaddingTop,
        paddingBottom: PGCardDomPaddingBottom,
        marginBottom: PGCardDomMarginBottom
    });
    // 策略生成展开动画1
    await animate(PGCards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value,
        height: 320,
        opacity: 1
    });
    // 策略生成箭头1
    await addArrowDataItem(arrowDataTemp[0]);
    // 策略预测还原CSS属性
    await animate(PPCards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value / 5,
        paddingTop: PPCardDomPaddingTop,
        paddingBottom: PPCardDomPaddingBottom,
        marginBottom: PPCardDomMarginBottom
    });
    // 策略预测展开动画1
    await animate(PPCards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value,
        height: 200,
        opacity: 1
    });
    // 策略预测箭头1
    await addArrowDataItem(arrowDataTemp[3]);
    await animate(PPCards[activeStrategyIndex.value].lineRightDoms[0], {
        duration: currentAnimateDuration.value,
        opacity: 1
    });
    await animate(PGCards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value,
        height: 420
    });
    await addArrowDataItem(arrowDataTemp[1]);
    await animate(PPCards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value,
        height: 330
    });
    await addArrowDataItem(arrowDataTemp[4]);
    await animate(PPCards[activeStrategyIndex.value].lineRightDoms[1], {
        duration: currentAnimateDuration.value,
        opacity: 1
    });
    await animate(PGCards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value,
        height: PGCardDomHeight
    });
    await animate(PGCards[activeStrategyIndex.value].outDom, {
        duration: 0,
        height: 'auto'
    });
    await addArrowDataItem(arrowDataTemp[2]);
    await animate(PPCards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value,
        height: PPCardDomHeight
    });
    await animate(PPCards[activeStrategyIndex.value].outDom, {
        duration: 0,
        height: 'auto'
    });
    await addArrowDataItem(arrowDataTemp[5]);
    await animate(PPCards[activeStrategyIndex.value].lineRightDoms[2], {
        duration: currentAnimateDuration.value,
        opacity: 1
    });
    await addArrowDataItems([arrowDataTemp[6], arrowDataTemp[7], arrowDataTemp[8]]);
    // 策略生成还原CSS属性
    await animate(PECards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value / 5,
        paddingTop: PECardDomPaddingTop,
        paddingBottom: PECardDomPaddingBottom,
        marginBottom: PECardDomMarginBottom
    });
    await animate(PECards[activeStrategyIndex.value].outDom, {
        duration: currentAnimateDuration.value,
        opacity: 1,
        height: PECardDomHeight
    });
    await animate(PECards[activeStrategyIndex.value].outDom, {
        duration: 0,
        height: 'auto'
    });
    await animate(PECards[activeStrategyIndex.value].IconDom, {
        duration: currentAnimateDuration.value * 2,
        opacity: 1
    });
    // await initFSCard();
    await animate(FSCard.outDom, {
        duration: currentAnimateDuration.value,
        opacity: 0
    });
    await addArrowDataItem(arrowDataTemp[9]);
    await animate(FSCard.outDom, {
        duration: 0,
        left: 340
    });
    resetStrategyOverviewTemp();
    await animate(FSCard.outDom, {
        duration: currentAnimateDuration.value,
        left: 0,
        opacity: 1
    });
    // await addArrowDataItem(arrowDataTemp[9]);
};

const addArrowDataItem = async item => {
    return new Promise(resolve => {
        arrowData.value.push(item);
        setTimeout(() => {
            resolve();
        }, currentAnimateDuration.value);
    });
};

const addArrowDataItems = async arr => {
    return new Promise(resolve => {
        arrowData.value.push(...arr);
        setTimeout(() => {
            resolve();
        }, currentAnimateDuration.value);
    });
};

const sleepTime = async duration => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
};

const stopAnimation = () => {
    changeHeaderCenterState(ANIMATESTATE.free);
    stopArrowAnimation();
};

const createArrow = () => {
    if (!arrowHasloaded()) return;
    if (!opacityStrategy.value) {
        return;
    }
    clearArrow();
    makeArrow();
    nextTick(() => {
        for (let i = 0; i < arrowDataTemp.length; i++) {
            const item = arrowDataTemp[i];
            arrowData.value.push(item);
        }
    });
};

const makeArrow = () => {
    // 策略生成
    arrowDataTemp[0].startConfig.id = PGCards[activeStrategyIndex.value].lineIds[0];
    arrowDataTemp[0].startConfig.dom = PGCards[activeStrategyIndex.value].lineDoms[0];
    arrowDataTemp[1].startConfig.id = PGCards[activeStrategyIndex.value].lineIds[1];
    arrowDataTemp[1].startConfig.dom = PGCards[activeStrategyIndex.value].lineDoms[1];
    arrowDataTemp[2].startConfig.id = PGCards[activeStrategyIndex.value].lineIds[2];
    arrowDataTemp[2].startConfig.dom = PGCards[activeStrategyIndex.value].lineDoms[2];

    // 策略预测
    // // 第一组箭头动画结束配
    arrowDataTemp[0].endConfig.id = PPCards[activeStrategyIndex.value].lineLeftIds[0];
    arrowDataTemp[0].endConfig.dom = PPCards[activeStrategyIndex.value].lineLeftDoms[0];
    arrowDataTemp[1].endConfig.id = PPCards[activeStrategyIndex.value].lineLeftIds[1];
    arrowDataTemp[1].endConfig.dom = PPCards[activeStrategyIndex.value].lineLeftDoms[1];
    arrowDataTemp[2].endConfig.id = PPCards[activeStrategyIndex.value].lineLeftIds[2];
    arrowDataTemp[2].endConfig.dom = PPCards[activeStrategyIndex.value].lineLeftDoms[2];

    // // 第二组箭头动画开始配置
    // const PPCardLine1LeftDom = document.getElementById(data.lineLeftIds[0]);
    arrowDataTemp[3].startConfig.id = PPCards[activeStrategyIndex.value].lineLeftIds[0];
    arrowDataTemp[3].startConfig.dom = PPCards[activeStrategyIndex.value].lineLeftDoms[0];
    arrowDataTemp[4].startConfig.id = PPCards[activeStrategyIndex.value].lineLeftIds[1];
    arrowDataTemp[4].startConfig.dom = PPCards[activeStrategyIndex.value].lineLeftDoms[1];
    arrowDataTemp[5].startConfig.id = PPCards[activeStrategyIndex.value].lineLeftIds[2];
    arrowDataTemp[5].startConfig.dom = PPCards[activeStrategyIndex.value].lineLeftDoms[2];

    // // 第二组箭头动画结束配置
    arrowDataTemp[3].endConfig.id = PPCards[activeStrategyIndex.value].lineRightIds[0];
    arrowDataTemp[3].endConfig.dom = PPCards[activeStrategyIndex.value].lineRightDoms[0];
    arrowDataTemp[4].endConfig.id = PPCards[activeStrategyIndex.value].lineRightIds[1];
    arrowDataTemp[4].endConfig.dom = PPCards[activeStrategyIndex.value].lineRightDoms[1];
    arrowDataTemp[5].endConfig.id = PPCards[activeStrategyIndex.value].lineRightIds[2];
    arrowDataTemp[5].endConfig.dom = PPCards[activeStrategyIndex.value].lineRightDoms[2];

    // // 第三组箭头动画开始配置
    arrowDataTemp[6].startConfig.id = PPCards[activeStrategyIndex.value].lineRightIds[0];
    arrowDataTemp[6].startConfig.dom = PPCards[activeStrategyIndex.value].lineRightDoms[0];
    arrowDataTemp[7].startConfig.id = PPCards[activeStrategyIndex.value].lineRightIds[1];
    arrowDataTemp[7].startConfig.dom = PPCards[activeStrategyIndex.value].lineRightDoms[1];
    arrowDataTemp[8].startConfig.id = PPCards[activeStrategyIndex.value].lineRightIds[2];
    arrowDataTemp[8].startConfig.dom = PPCards[activeStrategyIndex.value].lineRightDoms[2];

    // // 第三组箭头结束结束配置
    arrowDataTemp[6].endConfig.id = PECards[activeStrategyIndex.value].titleId;
    arrowDataTemp[6].endConfig.dom = PECards[activeStrategyIndex.value].titleDom;
    arrowDataTemp[7].endConfig.id = PECards[activeStrategyIndex.value].titleId;
    arrowDataTemp[7].endConfig.dom = PECards[activeStrategyIndex.value].titleDom;
    arrowDataTemp[8].endConfig.id = PECards[activeStrategyIndex.value].titleId;
    arrowDataTemp[8].endConfig.dom = PECards[activeStrategyIndex.value].titleDom;

    // // 第四组箭头动画开始配置
    arrowDataTemp[9].startConfig.id = PECards[activeStrategyIndex.value].bestId;

    arrowDataTemp[9].startConfig.dom = PECards[activeStrategyIndex.value].bestDom;

    // // 第四组动画结束配置
    arrowDataTemp[9].endConfig.id = FSCard.titleId;
    arrowDataTemp[9].endConfig.dom = FSCard.titleDom;
};

const arrowHasloaded = () => {
    if (strategyOverview.value.length === 0) return false;
    const total =
        // 滚轮
        1 +
        // 策略生成
        strategyOverview.value.length +
        // 策略预测
        strategyOverview.value.length +
        // 策略评价
        strategyOverview.value.length +
        // 最终价值选择
        1;
    return (
        total ===
        // 滚轮
        (arrowScoll ? 1 : 0) +
            // 策略生成
            PGCards.length +
            // 策略预测
            PPCards.length +
            // 策略评价
            PECards.length +
            // 最终价值选择
            (FSCard ? 1 : 0)
    );
};

const clearArrow = () => {
    arrowData.value = [];
    // for (let i = 0; i < arrowData.value.length; i++) {
    //     arrowData.value.pop();
    // }
};

const stopArrowAnimation = () => {
    for (let i = 0; i < arrowDataTemp.length; i++) {
        const item = arrowDataTemp[i];
        item.growAnimation = false;
    }
};

//
const startHeaderAnimate = async (time = getDayjsTz()) => {
    const times = [
        {
            // 每种数据的总量需要看产品手册
            // 未来24小时空调季时段
            max: 2, // 每种类型的数据最长的播放时间(s)
            single: 2 // 每一条数据播放的时间（s）
        },
        // 未来24小时空间环境品质标准
        {
            max: 30,
            single: 0.2
        },
        {
            // 未来24小时空间调度标准
            max: 30,
            single: 0.2
        },
        {
            // 未来24小时价值选择
            max: 5,
            single: 1
        },
        {
            // 未来24小时天气预报
            max: 8,
            single: 0.1
        },
        {
            // 冷站基础数据
            max: 20,
            single: 1
        },
        {
            // 末端设备基础数据
            max: 20,
            single: 0.5
        },
        {
            // 空间基础数据
            max: 5,
            single: 0.1
        }
    ];
    const second = time.diff(computeStartTime.value, 'second');
    let index = 8,
        num = 0;
    // 临时组装数据
    headerAnimateDataTemp();
    // 计算从第几条开始播
    for (let i = 0; i < times.length; i++) {
        const broadcast = broadcastTemp[i];
        console.log('-----------------------------------', broadcast);
        let total = 0;
        const str = broadcast.content.join('、');
        total = str.length * 0.015;
        if (total > times[i].max) {
            total = times[i].max;
        }
        num = num + total;
        if (num > second) {
            index = i;
            break;
        }
    }
    changeHeaderCenterState(ANIMATESTATE.broadcast);
    headerRightData.value = [];
    // 未来24小时空调季时段 2s
    if (index <= 0 && broadcastTemp[0].content.length > 0) {
        await changeHeaderCenterAnimate(0, times[0]);
        addHeaderRightData(broadcastTemp[0].label);
    }
    // 未来24小时空间环境品质标准 最长20s 每条200ms
    if (index <= 1 && broadcastTemp[1].content.length > 0) {
        await changeHeaderCenterAnimate(1, times[1]);
        addHeaderRightData(broadcastTemp[1].label);
    }
    // 未来24小时空间调度标准 最长20s 每条200ms
    if (index <= 2 && broadcastTemp[2].content.length > 0) {
        await changeHeaderCenterAnimate(2, times[2]);
        addHeaderRightData(broadcastTemp[2].label);
    }
    // 未来24小时价值选择 没有配置内容的展示2s 有配置明细的每个配置明细展示1s直至全部展示完
    if (index <= 3 && broadcastTemp[3].content.length > 0) {
        await changeHeaderCenterAnimate(3, times[3]);
        addHeaderRightData(broadcastTemp[3].label);
    }
    // 未来24小时天气预报 每个时刻点展示0.1s，共10s
    if (index <= 4 && broadcastTemp[4].content.length > 0) {
        await changeHeaderCenterAnimate(4, times[4]);
        addHeaderRightData(broadcastTemp[4].label);
    }
    // 冷站基础数据 每个设备展示1s，最长展示20s
    if (index <= 5 && broadcastTemp[5].content.length > 0) {
        await changeHeaderCenterAnimate(5, times[5]);
        addHeaderRightData(broadcastTemp[5].label);
    }
    // 末端设备基础数据 每个设备展示0.5s，最长展示20S
    if (index <= 6 && broadcastTemp[6].content.length > 0) {
        await changeHeaderCenterAnimate(6, times[6]);
        addHeaderRightData(broadcastTemp[6].label);
    }
    // 空间基础数据 每个空间0.1s，最长10s
    if (index <= 7 && broadcastTemp[7].content.length > 0) {
        await changeHeaderCenterAnimate(7, times[7]);
        addHeaderRightData(broadcastTemp[7].label);
    }
    if (inSomeHeaderCenterState(ANIMATESTATE.broadcast)) {
        broadcastEndTime.value = getDayjsTz();
        changeHeaderCenterState(ANIMATESTATE.request);
        // computeEndTime 如果这个属性有值（说明算法已经计算结束），则进入下一步，
        if (computeEndTime.value) {
            startContentAnimation();
        }
    }
};

const addHeaderRightData = data => {
    headerRightData.value.push(
        i18n.global.t('meos_control_web.fetch_data', {
            data: data
        })
    );
};

const changeHeaderCenterAnimate = (broadcastTempIndex, options) => {
    const broadcast = broadcastTemp[broadcastTempIndex];
    console.log('-----------------------------------', broadcast);
    let total = 0;
    const str = broadcast.content.join('、');
    // 每个字需要播报时间
    total = str.length * 0.015;
    if (total > options.max) {
        total = options.max;
    }
    return new Promise(resolve => {
        // let index = 0;
        headerCenterData.doing = broadcast.label;
        headerCenterDataCenter.value = str;
        headerCenterData.next = broadcastTemp[broadcastTempIndex + 1] ? broadcastTemp[broadcastTempIndex + 1].label : '';
        const stopIntervaler = setInterval(() => {
                if (outsideSomeHeaderCenterState(ANIMATESTATE.broadcast)) {
                    clearTimeout(timeouter);
                    clearInterval(stopIntervaler);
                    resolve();
                }
            }, 50),
            timeouter = setTimeout(() => {
                clearInterval(stopIntervaler);
                resolve();
            }, total * 1000);
    });
};

const headerAnimateDataTemp = () => {
    for (let k = 0; k < broadcastTemp.length; k++) {
        switch (k) {
            case 0:
                // 未来24小时空调季时段 2s
                broadcastTemp[k].content = [...airSearonCastData.value];
                break;
            case 1:
                // 未来24小时空间环境品质标准 最长20s 每条200ms
                if (broadcastData.value) {
                    broadcastTemp[k].content = [...broadcastData.value.environmentQualityTexts];
                }
                break;
            case 2:
                // 未来24小时空间调度标准 最长20s 每条200ms
                if (broadcastData.value) {
                    broadcastTemp[k].content = [...broadcastData.value.spaceSchedulingTexts];
                }
                break;
            case 3:
                // 未来24小时价值选择 没有配置内容的展示2s 有配置明细的每个配置明细展示1s直至全部展示完
                if (broadcastData.value) {
                    broadcastTemp[k].content = [broadcastData.value.valueSelectText];
                }
                break;
            case 4:
                // 未来24小时天气预报 每个时刻点展示0.1s，共10s
                broadcastTemp[k].content = [
                    ...Hour24ForecastData.value.map(item => {
                        const time = dayjs(item.time, 'YYYY-MM-DD HH:mm:ss', true);
                        return `${time.format('HH:mm')} ${item.text} ${i18n.global.t('meos_control_web.temperature_num_humidity_val', {
                            num: item.temperature,
                            val: item.humidity
                        })}`;
                    })
                ];
                break;
            case 5:
                // 冷站基础数据 每个设备展示1s，最长展示20s
                broadcastTemp[k].content = [...coolStationCastData.value];
                break;
            case 6:
                // 末端设备基础数据 每个设备展示0.5s，最长展示20S
                broadcastTemp[k].content = [...acCastData.value];
                break;
            case 7:
                // 空间基础数据 每个空间0.1s，最长10s
                broadcastTemp[k].content = [...spaceCastData.value];
                break;
            default:
                break;
        }
    }
};

const changeHeaderCenterState = state => {
    const keys = Object.keys(ANIMATESTATE);
    const result = keys.map(key => {
        return ANIMATESTATE[key];
    });
    if (result.indexOf(state) > -1) {
        headerCenterState.value = state;
    }
};

const inSomeHeaderCenterState = state => {
    return headerCenterState.value === state;
};

const outsideSomeHeaderCenterState = state => {
    return headerCenterState.value !== state;
};

const changeActiveIndex = async index => {
    if (activeStrategyIndex.value === index) return;
    if (inSomeHeaderCenterState(ANIMATESTATE.animation)) {
        return;
    }
    clearArrow();
    const current = activeStrategyIndex.value;
    activeStrategyIndex.value = index;
    await collapseAnimate(index, current);
    initArrowAnimation();
    createArrow();
};

const resetActiveIndex = () => {
    return new Promise((resolve, reject) => {
        clearArrow();
        if (activeStrategyIndex.value === 0) {
            return resolve();
        }
        // 复位操作
        for (let i = 0; i < activeStrategyIndex.value; i++) {
            animate(PGCards[i].outDom, {
                duration: 500,
                height: PGCardDomHeight
            });
            animate(PPCards[i].outDom, {
                duration: 500,
                height: PPCardDomHeight
            });
            animate(PECards[i].outDom, {
                duration: 500,
                height: PECardDomHeight
            });
            setTimeout(() => {
                animate(PGCards[i].outDom, {
                    duration: 0,
                    height: 'auto'
                });
                animate(PPCards[i].outDom, {
                    duration: 0,
                    height: 'auto'
                });
                animate(PECards[i].outDom, {
                    duration: 0,
                    height: 'auto'
                });
            }, 500);
        }

        setTimeout(() => {
            activeStrategyIndex.value = 0;
            resolve();
        }, 600);
    });
};

const collapseAnimate = (target, current) => {
    return new Promise((resolve, reject) => {
        if (target === current) return;
        if (target > current) {
            for (let i = current; i < target; i++) {
                animate(PGCards[i].outDom, {
                    duration: 0,
                    height: PGCardDomHeight
                });
                animate(PPCards[i].outDom, {
                    duration: 0,
                    height: PPCardDomHeight
                });
                animate(PECards[i].outDom, {
                    duration: 0,
                    height: PECardDomHeight
                });
                animate(PGCards[i].outDom, {
                    duration: 500,
                    height: 60
                });
                animate(PPCards[i].outDom, {
                    duration: 500,
                    height: 60
                });
                animate(PECards[i].outDom, {
                    duration: 500,
                    height: 60
                });
            }
            setTimeout(() => {
                resolve();
            }, 500);
        } else {
            for (let i = target; i < current; i++) {
                animate(PGCards[i].outDom, {
                    duration: 500,
                    height: PGCardDomHeight
                });
                animate(PPCards[i].outDom, {
                    duration: 500,
                    height: PPCardDomHeight
                });

                animate(PECards[i].outDom, {
                    duration: 500,
                    height: PECardDomHeight
                });
            }
            setTimeout(() => {
                animate(PGCards[activeStrategyIndex.value].outDom, {
                    duration: 0,
                    height: 'auto'
                });
                animate(PPCards[activeStrategyIndex.value].outDom, {
                    duration: 0,
                    height: 'auto'
                });

                animate(PECards[activeStrategyIndex.value].outDom, {
                    duration: 0,
                    height: 'auto'
                });
                resolve();
            }, 500);
        }
    });
};

const destoryHeaderAnimate = () => {};

onUnmounted(() => {
    emitter.off('PGcard');
    emitter.off('PPcard');
    emitter.off('PEcard');
    emitter.off('FSCard');
    emitter.off('scrollId');
    emitter.off('end-anime');
    emitter.off('AI-compute-start');
    emitter.off('AI-compute-fail');
    emitter.off('AI-compute-end');
});

// animeJS动画方案
</script>

<style lang="less" scoped>
.AI-home-page {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
