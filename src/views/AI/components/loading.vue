<template>
    <div class="AI-loading-main">
        <div class="title-text">{{ i18n.global.t('meos_control_web.welcome_to_mpc_agent') }}</div>
        <div class="video-box">
            <video class="AI-video" autoplay loop muted="true" src="@/assets/mp4/AI_loading.mp4"></video>
            <span class="video-text">
                <span :style="`font-family: 'CustomRegular2';font-size: 48px`">{{ Num.toFixed(0) }}</span>
                <span :style="`font-size: 24px`">%</span>
            </span>
            <div class="wait">{{ i18n.global.t('meos_control_web.connecting_to_agent_please_wait') }}...</div>
        </div>
    </div>
</template>

<script setup>
import { strategyLoadingKey, viewLoadedKey } from '../hooks/useStaticData';
import i18n from '@/localization';
const emits = defineEmits(['loaded']);

const strategyLoading = inject(strategyLoadingKey);
const viewLoaded = inject(viewLoadedKey);

const Num = ref(0);

let timer = null,
    startStamp = new Date().getTime(),
    duration = 1000 * 3,
    speed = 50,
    used = duration;

watch(strategyLoading, value => {
    if (!value) {
        duration = used < 2000 ? 1000 : used > 3000 ? 1 : 3000 - used;
        speed = 50;
    }
});

const process = () => {
    const now = new Date().getTime();
    used = now - startStamp < 0 ? 0 : now - startStamp;
    if (Num.value + (speed * 100) / duration >= 99) {
        Num.value = 99;
        if (!strategyLoading?.value) {
            Num.value = 100;
            setTimeout(() => {
                viewLoaded();
                Num.value = 100;
            }, 200);
            clear();
            return;
        }
    } else {
        Num.value = Num.value + (speed * 100) / duration;
    }
    timer = setTimeout(process, speed);
};

const clear = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};

onMounted(() => {
    process();
});

onBeforeUnmount(() => {
    clear();
});
</script>

<style lang="less" scoped>
.AI-loading-main {
    height: 100%;
    width: 100%;
    background: linear-gradient(180deg, #dedff9 -18.19%, #fff 98.98%);
    position: relative;
    .video-box {
        width: 100vw;
        position: absolute;
        left: 50%;
        top: 50%;
        transition: all;
        transform: translateX(-50%) translateY(-50%);
        display: flex;
        justify-content: center;
        .AI-video {
            width: 300px;
        }
        .video-text {
            position: absolute;
            font-family: 'CustomRegular2';
            color: #ffffff;
            font-weight: 600;
            left: 50%;
            top: 50%;
            transition: all;
            transform: translateX(-50%) translateY(-50%);
        }
        .wait {
            position: absolute;
            width: 100%;
            top: calc(100% + 16px);
            color: var(--gray-600, #626c78);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
        }
    }
    .title-text {
        position: absolute;
        width: 100%;
        top: 19%;
        height: 32px;
        color: var(--gray-700, #424c59);
        text-align: center;
        font-size: 32px;
        font-style: normal;
        font-weight: 400;
    }
}
</style>
