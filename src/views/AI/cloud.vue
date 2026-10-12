<template>
    <div class="AI-cloud-box">
        <div v-if="loading" class="content-loading-box">
            <img width="238" src="@/assets/gif/AI_cloud_loading.gif" alt="" />
            <div class="text">{{ i18n.global.t('meos_control_web.connect_AI_MPC') }}</div>
        </div>
        <div v-if="!loading && success" class="content-success-box">
            <CloudSuccessSVG></CloudSuccessSVG>
            <div class="text1">{{ i18n.global.t('meos_control_web.connect_success_AI_MPC') }}</div>
            <m-button class="text2" type="link" size="medium" @click="jumpToEdge">{{ i18n.global.t('meos_control_web.entry_AI_MPC') }}</m-button>
        </div>
        <div v-if="!loading && !success" class="content-fail-box">
            <CloudFailSVG></CloudFailSVG>
            <div class="text">{{ i18n.global.t('meos_control_web.connect_fail_AI_MPC') }}</div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import CloudFailSVG from '@/assets/svg/AI/cloud_fail.svg';
import CloudSuccessSVG from '@/assets/svg/AI/cloud_success.svg';
import { useCloudHooks } from './hooks/useCloudHooks';

const { loading, success, jumpToEdge } = useCloudHooks();
</script>

<style lang="less" scoped>
.AI-cloud-box {
    width: 100vw;
    height: 100vh;
    position: relative;
    .content-loading-box {
        width: 238px;
        height: 238px;
        position: absolute;
        left: 50%;
        top: 30.6%;
        transform: translateX(-50%);
        text-align: center;
        .text {
            position: absolute;
            width: 100%;
            bottom: -12px;
            transform: translateY(100%);
            color: var(--Grey-Grey-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }
    .content-success-box {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 220px;
        transform: translateX(-50%) translateY(-50%);
        text-align: center;
        .text1 {
            margin-top: 8px;
            color: var(--Grey-Grey-600, #626c78);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .text2 {
            margin-top: 13px;
        }
    }
    .content-fail-box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        text-align: center;
        width: 300px;
        .text {
            margin-top: 8px;
            color: var(--Grey-Grey-600, #626c78);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }
}
</style>
