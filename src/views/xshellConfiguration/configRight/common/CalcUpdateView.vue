<template>
    <div class="terminal-calc-section">
        <title-type :title="title" />
        <div class="terminal-calc-form">
            <div class="label-position">
                <div class="label-top">
                    <div class="fc">
                        <span class="item-name">{{ i18n.global.t('meos_control_web.data_calc') }}</span>
                    </div>
                </div>
            </div>
            <div class="calc-content">
                <template v-if="isCalcLoading">
                    <m-tips :content="i18n.global.t('meos_control_web.calc_wait_tip')" theme="dark" trigger="hover" :enterable="false">
                        <div class="calc-loading-text">{{ i18n.global.t('meos_control_web.calc_in_progress') }}...</div>
                    </m-tips>
                    <div class="calc-loading-spinner"></div>
                </template>
                <m-button v-else type="link" @click="handleStartCalc">
                    {{ i18n.global.t('meos_control_web.start_calc') }}
                </m-button>
                <span v-if="lastCalcTime" class="calc-time">{{ i18n.global.t('meos_control_web.last_calc_time') }}：{{ lastCalcTime }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getLoopTime, triggerBuildCache } from '@/apis/xshellConfiguration';
import { $Message, MButton, MTips } from 'meri-plus';
import { SUCCESSCODE } from '@/utils/globalVariables';
import titleType from './titleType.vue';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    loopInterval: {
        type: Number,
        default: 5000
    },
    runningMonitorType: {
        type: String,
        default: ''
    }
});

const lastCalcTime = ref('');
const isCalcLoading = defineModel('loading', { type: Boolean, default: false });

// opt/edge-call F4：原来不论是否在计算都按 loopInterval 轮询；现在只有计算中才按 loopInterval，
// 空闲时 5 分钟查一次（用于发现别人触发的计算），页面隐藏时不发请求。
const IDLE_LOOP_INTERVAL = 5 * 60 * 1000;

let pollingTimer = null,
    isPolling = false,
    loopAbortController = null;

const handleStartCalc = async () => {
    if (isCalcLoading.value) return;
    isCalcLoading.value = true;
    try {
        const res = await triggerBuildCache({ runningMonitorType: props.runningMonitorType });
        if (res.code === SUCCESSCODE) {
            $Message.success({ title: i18n.global.t('meos_control_web.calc_success') });
        }
        if (res.code !== 'B0001') {
            isCalcLoading.value = false;
        }
        // 触发计算后立即按计算中的频率刷新状态
        if (isPolling) {
            clearTimeout(pollingTimer);
            fetchLoopTime();
        }
    } catch (error) {
        console.log(error);
        isCalcLoading.value = false;
    }
};

const startPolling = () => {
    if (isPolling) return;
    isPolling = true;
    fetchLoopTime();
};

const nextLoopDelay = () => (isCalcLoading.value ? props.loopInterval : Math.max(props.loopInterval, IDLE_LOOP_INTERVAL));

const fetchLoopTime = async () => {
    if (!isPolling) return;
    if (typeof document !== 'undefined' && document.hidden) {
        // 页面隐藏时不请求，稍后再看
        pollingTimer = setTimeout(fetchLoopTime, props.loopInterval);
        return;
    }
    loopAbortController?.abort?.();
    loopAbortController = new AbortController();
    try {
        const res = await getLoopTime({ runningMonitorType: props.runningMonitorType }, { signal: loopAbortController.signal });
        if (res.code === SUCCESSCODE && res.data) {
            isCalcLoading.value = res.data.isBuilding || false;
            if (res.data.lastUpdateTime) {
                lastCalcTime.value = res.data.lastUpdateTime;
            }
        }
    } catch (error) {
        if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
            return;
        }
        console.error('轮训接口请求失败:', error);
    } finally {
        if (isPolling) {
            clearTimeout(pollingTimer);
            pollingTimer = setTimeout(() => {
                fetchLoopTime();
            }, nextLoopDelay());
        }
    }
};

const stopPolling = () => {
    isPolling = false;
    if (pollingTimer) {
        clearTimeout(pollingTimer);
        pollingTimer = null;
    }
    loopAbortController?.abort?.();
};

onMounted(() => {
    startPolling();
});

onUnmounted(() => {
    stopPolling();
});
</script>

<style scoped lang="less">
.terminal-calc-section {
    .terminal-calc-form {
        display: flex;
        padding: 11px 0 11px 30px;
        margin: 12px 0;

        .label-position {
            display: flex;
            align-items: center;
            width: 345px;
        }

        .calc-content {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 12px;

            .calc-loading-text {
                font-size: 14px;
                color: #8a939e;
                cursor: pointer;
                line-height: 32px;
            }

            .calc-loading-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top-color: #8a939e;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .calc-time {
                font-size: 14px;
                color: #8a939e;
                user-select: none;
            }
        }
    }
}
</style>
