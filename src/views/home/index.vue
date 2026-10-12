<template>
    <div class="home-content-bg-wrap">
        <video autoplay muted loop>
            <source src="../../assets/home.mp4" type="video/mp4" />
            Your browser does not support the video.
        </video>
        <div class="home-content-wrap">
            <div class="middle">
                <div class="header-wrap">
                    <p class="home-title">{{ i18n.global.t('meos_control_web.status_overview') }}</p>
                    <p class="subtitle">{{ i18n.global.t('meos_control_web.discipline_system_instance_list_click_for_detail') }}</p>
                </div>
                <div class="card-content-wrap">
                    <CardModule v-if="moduleList.length > 0 && !loading" :module-list="moduleList" @top-px="topPx => (top = topPx)"></CardModule>
                    <div v-if="moduleList.length > 1 && !loading" class="legend-wrap-home">
                        <m-anchor :sections="getAnchorList(moduleList)" width="128px" target=".mAnchorWrap"> </m-anchor>
                    </div>
                    <m-illustration
                        v-show="moduleList.length === 0 && !loading"
                        :title="i18n.global.t('meos_control_web.no_content')"
                        type="noContent"
                        style="margin-top: 260px"
                    ></m-illustration>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import CardModule from './cardModule/index.vue';
import { getAnchorList } from './utils';
import useModuleData from './hooks/useModuleData';

const { loading, moduleList, queryModuleData } = useModuleData();

queryModuleData();

let timer = null;

timer = setInterval(() => {
    queryModuleData();
}, window?.homeTime || 15 * 1000 * 60);

onBeforeUnmount(() => {
    clearInterval(timer);
    timer = null;
});
</script>
<style lang="less" scoped>
@media screen and (min-width: 1367px) {
    .home-content-bg-wrap {
        --top-padding: 60px;
        --middle-padding: 48px;
        --tittle-padding-top: 28px;
    }
}

@media screen and (max-width: 1366px) {
    .home-content-bg-wrap {
        --top-padding: 36px;
        --middle-padding: 24px;
        --tittle-padding-top: 24px;
    }
}

.home-content-bg-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
    background: #e8f1ff;
    min-width: 1280px;

    video {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        height: 100%;
        z-index: 1;
        object-fit: cover;
        mix-blend-mode: darken;
        border: none;
        outline: none;
        max-height: 1080px;
    }
    video:focus {
        outline: none;
    }
    .home-content-wrap {
        width: 100%;
        position: relative;
        z-index: 2;
        height: 100%;
        display: flex;
        justify-content: center;
        min-width: 1100px;
        overflow: auto;

        .middle {
            display: flex;
            justify-content: space-between;
            flex-flow: column;
            height: 100%;
            .header-wrap {
                .home-title {
                    color: @grey-900;
                    font-feature-settings: 'clig' off, 'liga' off;

                    font-size: 28px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                    margin-bottom: 12px;
                    padding-top: var(--top-padding);
                }
                .subtitle {
                    color: @grey-600;
                    font-feature-settings: 'clig' off, 'liga' off;

                    font-size: 14px;
                    font-style: normal;
                    font-weight: var(--platform-font-weight);
                    line-height: normal;
                }
                padding-bottom: var(--middle-padding);
            }
            .card-content-wrap {
                flex: 1;
                position: relative;
                overflow: visible;
                height: 0;
                min-height: 0;
                .legend-wrap-home {
                    width: 128px;
                    height: 300px;
                    position: absolute;
                    top: 40px;
                    right: -138px;
                }
            }
        }
    }
}

@media screen and (max-width: 1600px) {
    .home-content-wrap .middle {
        width: 970px;
    }
}

@media screen and (min-width: 1600px) {
    .home-content-wrap .middle {
        width: 1293px;
    }
}
</style>
